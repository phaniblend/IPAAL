/**
 * SpecForge API router.
 *  POST /generate   Stage 1 (Normalizer) + Stage 2 (Domain Model). Review-only, no writes.
 *  POST /breakdown  Stage 3 (Task Breakdown): epics -> stories -> tasks. Review-only, no writes.
 *  POST /classify   Scores a task list against the Module Library (published + planned catalog).
 *                   Read-only — lets PD Studio show live match status before anything is created.
 *  POST /publish    The only endpoint that writes: creates/reuses the delivery project, creates a new
 *                   cohort or (if cohortIssueId is given — a spec revision) adds to an existing one's
 *                   TaskCount, creates one OneDev task issue per task (tagged AssistModule if a match
 *                   was found, NoTutorialNeeded for non-coding trades, or NeedsTutorial+DraftModule
 *                   while a new one is drafted), and files a "Tutorial needed" request in the Module
 *                   Library for anything undrafted or awaiting ID-team review. A task is never created
 *                   wired to nothing and silently assignable — it's matched, exempt, mid-draft, or
 *                   explicitly blocked.
 */
import express from "express";
import { runStages1And2, runTaskBreakdown, runTutorialDrafting } from "../src/specforge/pipeline.js";
import { generateAssistModule } from "../src/id-module/generateModule.js";
import { bestModuleMatch } from "../src/id-module/matchModules.js";
import { MODULE_CATALOG } from "../src/id-module/moduleCatalog.js";
import { notifyTeamServer } from "./notify-server.js";
import { listIssues, listProjects, createProject, createIssue, updateIssueDescription, parseKV } from "./onedev-client.js";
import { tryRematchQueuedApplicants } from "./recruit-router.js";
import { requireRole } from "./auth-session.js";

const router = express.Router();

const COHORT_PROJECT_ID = 2;
const TEAM_OPS_PROJECT_ID = 3;
const MODULE_LIBRARY_PROJECT_ID = 4;
const RESERVED_PROJECT_IDS = new Set([COHORT_PROJECT_ID, TEAM_OPS_PROJECT_ID, MODULE_LIBRARY_PROJECT_ID]);

function getDeepSeekKey() {
  return process.env.DEEPSEEK_API_KEY || process.env.VITE_DEEPSEEK_API_KEY;
}

router.post("/generate", async (req, res) => {
  const apiKey = getDeepSeekKey();
  if (!apiKey) {
    return res.status(503).json({ error: "DEEPSEEK_API_KEY is not set in D:\\IPAAL\\.env — SpecForge needs it to run." });
  }
  try {
    const result = await runStages1And2(req.body, apiKey);
    res.json(result);
  } catch (err) {
    console.error("[specforge] /generate:", err);
    const status = err?.name === "ZodError" ? 400 : 500;
    res.status(status).json({ error: err?.message ?? "SpecForge pipeline failed" });
  }
});

router.post("/breakdown", async (req, res) => {
  const apiKey = getDeepSeekKey();
  if (!apiKey) {
    return res.status(503).json({ error: "DEEPSEEK_API_KEY is not set in D:\\IPAAL\\.env — SpecForge needs it to run." });
  }
  try {
    const { stage1, stage2 } = req.body;
    if (!stage1 || !stage2) return res.status(400).json({ error: "stage1 and stage2 are required" });
    const tasks = await runTaskBreakdown(stage1, stage2, apiKey);
    res.json({ tasks });
  } catch (err) {
    console.error("[specforge] /breakdown:", err);
    const status = err?.name === "ZodError" ? 400 : 500;
    res.status(status).json({ error: err?.message ?? "Task breakdown failed" });
  }
});

async function loadPublishedModules() {
  const issues = await listIssues({ count: 200 });
  return issues.filter((i) => i.projectId === MODULE_LIBRARY_PROJECT_ID && i.title.startsWith("Module:"));
}

router.post("/classify", async (req, res) => {
  try {
    const { tasks } = req.body;
    if (!Array.isArray(tasks)) return res.status(400).json({ error: "tasks[] is required" });
    const published = await loadPublishedModules();
    const classified = tasks.map((t) => {
      if (t.no_tutorial_needed) return { ...t, matchStatus: "exempt" };
      const match = bestModuleMatch(`${t.title} ${t.description}`, published, MODULE_CATALOG);
      return match
        ? { ...t, matchStatus: "matched", moduleTag: match.tag, matchScore: match.score }
        : { ...t, matchStatus: "unmatched" };
    });
    res.json({ tasks: classified });
  } catch (err) {
    console.error("[specforge] /classify:", err);
    res.status(500).json({ error: err?.message ?? "Classification failed" });
  }
});

function buildTaskDescription(task, cohortName, assistLine) {
  const criteria = (task.acceptance_criteria || []).join("; ");
  return [
    `Epic: ${task.epic}`,
    `Story: ${task.story}`,
    `Trade: ${task.trade}`,
    // TechLevel only exists for tasks with a real skill ladder (Coding, mostly) — Matching Queue
    // reads this to gate placement against what an applicant actually said they're ready for.
    task.tech_level ? `TechLevel: ${task.tech_level}` : null,
    `Cohort: ${cohortName}`,
    criteria ? `AcceptanceCriteria: ${criteria}` : null,
    ...assistLine,
  ]
    .filter((l) => l !== null && l !== undefined)
    .join("\n");
}

router.post("/publish", requireRole("PD"), async (req, res) => {
  try {
    const { productName, cohortName, deliveryProjectId, deliveryProjectName, cohortIssueId, tasks } = req.body;
    if (!productName || (!cohortName && !cohortIssueId) || !Array.isArray(tasks) || tasks.length === 0) {
      return res.status(400).json({
        error: "productName, a non-empty tasks[], and either cohortName (new cohort) or cohortIssueId (add to an existing one) are required",
      });
    }

    // --- Step 1: classify every task against the current Module Library (exempt trades skip this) ---
    const published = await loadPublishedModules();
    const matches = tasks.map((t) =>
      t.no_tutorial_needed ? null : bestModuleMatch(`${t.title} ${t.description}`, published, MODULE_CATALOG)
    );
    const unmatchedIndexes = tasks.map((_, i) => i).filter((i) => !tasks[i].no_tutorial_needed && !matches[i]);
    const unmatchedTasks = unmatchedIndexes.map((i) => tasks[i]);

    // --- Step 2: draft + generate generic tutorials for whatever nothing matched ---
    let groups = [];
    const deepseekKey = getDeepSeekKey();
    if (unmatchedTasks.length > 0 && deepseekKey) {
      try {
        groups = await runTutorialDrafting(unmatchedTasks, productName, deepseekKey);
      } catch (err) {
        console.error("[specforge] tutorial drafting failed, tasks will queue without a draft:", err.message);
      }
    }
    for (const group of groups) {
      try {
        const generated = await generateAssistModule({
          moduleTag: group.moduleTag,
          concept: group.concept,
          build: group.build,
          keyTeaching: group.keyTeaching,
        });
        group.filePath = generated.filePath;
        group.generationFailed = false;
      } catch (err) {
        group.filePath = null;
        group.generationFailed = true;
        group.generationError = err?.message ?? String(err);
      }
    }
    // absolute-index -> covering group (a task not covered by any group falls back to plain NeedsTutorial)
    const groupByAbsoluteIndex = new Map();
    for (const group of groups) {
      for (const relIdx of group.taskIndexes) {
        const absIdx = unmatchedIndexes[relIdx];
        if (absIdx !== undefined) groupByAbsoluteIndex.set(absIdx, group);
      }
    }

    // --- Step 3+4: resolve the delivery project and the cohort together. Two paths:
    //   reuse   — cohortIssueId given: this is a spec revision adding tasks to an existing sprint
    //             team, so the delivery project comes from that cohort's own record and its
    //             TaskCount is bumped rather than a second Cohort issue being logged.
    //   create  — no cohortIssueId: first publish for this product, make both fresh.
    let projectId, projectName, resolvedCohortName, cohortIssueIdResolved;

    if (cohortIssueId) {
      const opsIssues = await listIssues({ count: 200 });
      const existingCohort = opsIssues.find((i) => i.id === Number(cohortIssueId) && i.projectId === TEAM_OPS_PROJECT_ID);
      if (!existingCohort) return res.status(404).json({ error: `Cohort #${cohortIssueId} not found` });

      const fields = parseKV(existingCohort.description);
      const m = /DeliveryProject:\s*(.+?)\s*\(#(\d+)\)/.exec(existingCohort.description || "");
      if (!m) return res.status(400).json({ error: "That cohort's record is missing its delivery-project reference — can't add tasks to it." });
      projectName = m[1];
      projectId = Number(m[2]);
      resolvedCohortName = existingCohort.title.replace("Cohort:", "").trim();
      cohortIssueIdResolved = existingCohort.id;

      const newTaskCount = Number(fields.TaskCount || 0) + tasks.length;
      await updateIssueDescription(
        existingCohort.id,
        [
          `Product: ${fields.Product || productName}`,
          `DeliveryProject: ${projectName} (#${projectId})`,
          `TaskCount: ${newTaskCount}`,
          `CreatedAt: ${fields.CreatedAt || new Date().toISOString()}`,
          `UpdatedAt: ${new Date().toISOString()}`,
        ].join("\n")
      );
    } else {
      projectId = deliveryProjectId ? Number(deliveryProjectId) : null;
      projectName = deliveryProjectName || null;
      const projects = await listProjects({ count: 100 });

      if (!projectId) {
        if (!deliveryProjectName) return res.status(400).json({ error: "deliveryProjectId or deliveryProjectName is required" });
        projectId = await createProject({ name: deliveryProjectName, description: `Delivery project for ${productName}, opened by PD Studio / SpecForge.` });
        if (!projectId) throw new Error("OneDev did not return a project id after creation");
        projectName = deliveryProjectName;
      } else {
        // Harden client-supplied ids (handoff §9 / DEVGUIDE §6.3): must exist in OneDev, must not be
        // a reserved IPF bookkeeping project, and the name comes from OneDev not the client claim.
        if (!Number.isFinite(projectId) || projectId <= 0) {
          return res.status(400).json({ error: "deliveryProjectId must be a positive OneDev project id." });
        }
        if (RESERVED_PROJECT_IDS.has(projectId)) {
          return res.status(400).json({
            error:
              "That project id is reserved for IPF's own tracking (cohort-applications / team-ops / module-library) — pick a delivery project.",
          });
        }
        const found = projects.find((p) => p.id === projectId);
        if (!found) {
          return res.status(400).json({
            error: `Unknown deliveryProjectId ${projectId} — that project does not exist in OneDev.`,
          });
        }
        projectName = found.name;
      }
      if (RESERVED_PROJECT_IDS.has(projectId)) {
        return res.status(400).json({ error: "That project id is reserved for IPF's own tracking (cohort-applications / team-ops / module-library) — pick a delivery project." });
      }

      resolvedCohortName = cohortName;
      cohortIssueIdResolved = await createIssue({
        projectId: TEAM_OPS_PROJECT_ID,
        title: `Cohort: ${cohortName}`,
        description: [
          `Product: ${productName}`,
          `DeliveryProject: ${projectName} (#${projectId})`,
          `TaskCount: ${tasks.length}`,
          `CreatedAt: ${new Date().toISOString()}`,
        ].join("\n"),
      });
    }

    // --- Step 5: create one task issue per task, wired or explicitly blocked ---
    const createdTaskIds = [];
    for (let i = 0; i < tasks.length; i++) {
      const task = tasks[i];
      let assistLine;
      if (task.no_tutorial_needed) {
        assistLine = ["NoTutorialNeeded: true"];
      } else if (matches[i]) {
        assistLine = [`AssistModule: ${matches[i].tag}`];
      } else {
        const group = groupByAbsoluteIndex.get(i);
        assistLine =
          group && !group.generationFailed
            ? ["NeedsTutorial: true", `DraftModule: ${group.moduleTag}`]
            : ["NeedsTutorial: true"];
      }
      const description = buildTaskDescription(task, resolvedCohortName, assistLine);
      const issueId = await createIssue({ projectId, title: task.title, description });
      createdTaskIds.push(issueId);
    }

    // --- Step 6: file a Tutorial-needed request per drafted group, now that task ids exist ---
    const draftedGroups = [];
    for (const group of groups) {
      const requestedForTasks = group.taskIndexes.map((relIdx) => createdTaskIds[unmatchedIndexes[relIdx]]).filter(Boolean);
      if (requestedForTasks.length === 0) continue;
      await createIssue({
        projectId: MODULE_LIBRARY_PROJECT_ID,
        title: `Tutorial needed: ${group.moduleTag}`,
        description: [
          `Concept: ${group.concept}`,
          `Build: ${group.build}`,
          `KeyTeaching: ${group.keyTeaching}`,
          group.filePath ? `FilePath: ${group.filePath}` : null,
          group.generationFailed ? `GenerationFailed: ${group.generationError || "unknown error"}` : null,
          `RequestedForProduct: ${productName}`,
          `RequestedForTasks: ${requestedForTasks.join(",")}`,
        ]
          .filter(Boolean)
          .join("\n"),
      });
      draftedGroups.push({ tag: group.moduleTag, taskCount: requestedForTasks.length, generationFailed: !!group.generationFailed });
    }

    const exemptCount = tasks.filter((t) => t.no_tutorial_needed).length;
    const matchedCount = matches.filter(Boolean).length;
    const blockedCount = tasks.length - matchedCount - exemptCount;

    // Newly published wired/exempt tasks are immediately assignable — catch up anyone already queued
    // for those trades (same human-action rematch pattern as ID Studio publish).
    let rematch = { rematched: [] };
    if (matchedCount + exemptCount > 0) {
      try {
        rematch = await tryRematchQueuedApplicants();
      } catch (err) {
        console.error("[specforge] rematch sweep after publish failed:", err.message);
      }
    }

    await notifyTeamServer(
      `📦 SpecForge published **${tasks.length}** task${tasks.length === 1 ? "" : "s"} for **${productName}** into **${projectName}** (cohort **${resolvedCohortName}**${cohortIssueId ? ", added to existing" : ""}): ` +
        `${matchedCount} wired to existing tutorials, ${exemptCount} exempt (non-coding trade), ${blockedCount} blocked pending a tutorial` +
        (draftedGroups.length > 0
          ? ` — ${draftedGroups.length} draft${draftedGroups.length === 1 ? "" : "s"} generated and waiting on ID Studio review (${draftedGroups.map((g) => g.tag).join(", ")}).`
          : ".") +
        (rematch.rematched.length > 0
          ? ` Rematched ${rematch.rematched.length} queued applicant${rematch.rematched.length === 1 ? "" : "s"}.`
          : "")
    );

    res.json({
      deliveryProjectId: projectId,
      deliveryProjectName: projectName,
      cohortIssueId: cohortIssueIdResolved,
      cohortName: resolvedCohortName,
      reusedCohort: !!cohortIssueId,
      totalTasks: tasks.length,
      matchedCount,
      exemptCount,
      blockedCount,
      draftedGroups,
      createdTaskIds,
      rematchedCount: rematch.rematched.length,
    });
  } catch (err) {
    console.error("[specforge] /publish:", err);
    res.status(500).json({ error: err?.message ?? "Publish failed" });
  }
});

export default router;
