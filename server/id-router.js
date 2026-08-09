/**
 * ID Module router — the Instructional Design module from the PD-flow diagram.
 * While SpecForge breaks a spec into assignable tasks, this module runs per task:
 * check the Module Library for an existing generic assistance module first (reuse),
 * and only generate a new one with Gemini if nothing matches. Never product-specific.
 *
 * Two ways a module gets here:
 *  - Manual: someone in ID Studio fills the form themselves (Check Module Library -> Generate -> Publish).
 *  - Auto-drafted: SpecForge's Stage 3 classifier (specforge-router.js) couldn't find a match for a task
 *    it just created, so it already ran Gemini and filed a "Tutorial needed: <tag>" issue here for human
 *    review. /pending-requests surfaces those; publishing one patches the blocked task(s) it was raised for.
 */
import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { generateAssistModule, assertValidModule } from "../src/id-module/generateModule.js";
import { spliceNodesArray } from "../src/id-module/spliceNodesArray.js";
import { notifyTeamServer } from "./notify-server.js";
import { MODULE_CATALOG } from "../src/id-module/moduleCatalog.js";
import { rankModuleMatches } from "../src/id-module/matchModules.js";
import { matchCoreLesson, lessonByKey } from "../src/id-module/matchCoreLesson.js";
import { createAssistanceSession, markSessionLaunched, completeAssistanceSession } from "./assistance-sessions.js";
import {
  listIssues,
  createIssue,
  updateIssueDescription,
  updateIssueTitle,
  parseKV,
} from "./onedev-client.js";
import { tryRematchQueuedApplicants } from "./recruit-router.js";
import { requireRole } from "./auth-session.js";

const router = express.Router();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ASSIST_DIR = path.resolve(__dirname, "..", "src", "engines", "assist");

const MODULE_LIBRARY_PROJECT_ID = 4;

/** POST /match — { moduleTag, concept } -> ranked matches from both published modules and the planned catalog. */
router.post("/match", async (req, res) => {
  try {
    const { moduleTag, concept } = req.body;
    const query = `${moduleTag} ${concept}`;
    const issues = await listIssues({ count: 200 });
    const published = issues.filter((i) => i.projectId === MODULE_LIBRARY_PROJECT_ID && i.title.startsWith("Module:"));
    res.json({ matches: rankModuleMatches(query, published, MODULE_CATALOG) });
  } catch (err) {
    res.status(500).json({ error: err?.message ?? "Match check failed" });
  }
});

/** GET /core-lesson-match?query=... -> best/curated/none match against IAAL-main's real 109-lesson
 * core catalog (see docs/IPF_DEVGUIDE.md §5a-4 — thin-slice routing, no session/completion-tracking
 * yet). Server computes the match and returns a full URL; the client never needs to know the
 * scoring or the lessons-app's base URL. LESSONS_BASE_URL points at IAAL-main's own dev server —
 * treat it as a second local Vite app for now (no deployed instance verified yet). */
router.get("/core-lesson-match", (req, res) => {
  try {
    const query = String(req.query.query || "");
    if (!query.trim()) return res.status(400).json({ error: "query is required" });
    const base = process.env.LESSONS_BASE_URL || "http://127.0.0.1:5174";
    const withUrl = (m) => ({ ...m, url: `${base}/#${m.route}` });
    const result = matchCoreLesson(query);
    if (result.auto) return res.json({ auto: withUrl(result.auto) });
    if (result.curated) return res.json({ curated: result.curated.map(withUrl) });
    res.json({ none: true });
  } catch (err) {
    res.status(500).json({ error: err?.message ?? "Core lesson match failed" });
  }
});

/** POST /assistance-session — { taskId, taskTitle, lessonKey } -> { sessionId, url }. The client
 * only ever picks from lessonKeys this server already returned via /core-lesson-match — a real,
 * logged human choice, same "logged decision, not an algorithm's guess" philosophy as every other
 * placement in this app — but the server re-derives the canonical URL from the manifest itself
 * rather than trusting a client-supplied one, and rejects any lessonKey that isn't a real manifest
 * entry. Session + one-time completion token are created here; the token is returned exactly once
 * and is never itself stored (only its hash is). */
router.post("/assistance-session", async (req, res) => {
  try {
    const { taskId, taskTitle, lessonKey } = req.body;
    if (!taskId || !lessonKey) return res.status(400).json({ error: "taskId and lessonKey are required" });
    const lesson = lessonByKey(lessonKey);
    if (!lesson) return res.status(400).json({ error: `Unknown lessonKey: ${lessonKey}` });

    const base = process.env.LESSONS_BASE_URL || "http://127.0.0.1:5174";
    const lessonUrl = `${base}/#${lesson.route}`;
    const { sessionId, completionToken } = await createAssistanceSession({
      taskId,
      taskTitle: taskTitle || "",
      lessonKey,
      lessonUrl,
    });

    // Query params MUST land after the hash — this app and IAAL-main both use HashRouter, so
    // everything before the `#` is just the static file being served; window.location.search is
    // empty there. See docs/IPF_DEVGUIDE.md §5a-4.
    const launchUrl = `${base}/#${lesson.route}?source=ipf&assistSessionId=${sessionId}&completionToken=${completionToken}`;
    res.json({ sessionId, url: launchUrl });
  } catch (err) {
    console.error("[id-module] /assistance-session:", err);
    res.status(500).json({ error: err?.message ?? "Could not create assistance session" });
  }
});

/** GET /assistance-complete?sessionId=&token= — the completion callback IAAL-main's lesson app
 * navigates to (same-tab, real browser navigation, not a fetch) the moment its real
 * onLessonComplete fires. Validates the session + one-time token, marks completion idempotently,
 * then redirects back to Workbench — this app has no per-task editor route to redirect to (unlike
 * the route this endpoint's shape was originally speced against), so Workbench with a
 * "just completed" marker is the real, honest destination. Never trusts a client-supplied return
 * URL — the only place execution can land is this hardcoded Workbench redirect. */
router.get("/assistance-complete", async (req, res) => {
  try {
    const { sessionId, token } = req.query;
    if (!sessionId || !token) return res.status(400).send("sessionId and token are required");
    const { taskId } = await completeAssistanceSession(String(sessionId), String(token));
    const frontend = process.env.IPF_FRONTEND_URL || "http://127.0.0.1:5173";
    res.redirect(302, `${frontend}/#/workbench?tutorialCompleted=${encodeURIComponent(taskId)}`);
  } catch (err) {
    console.error("[id-module] /assistance-complete:", err);
    res.status(400).send(`Could not complete assistance session: ${err?.message ?? "unknown error"}`);
  }
});

/** POST /assistance-session/:id/launched — best-effort marker, fired once the lesson app's page
 * actually mounts with a real assistance context (see the HashRouter context parser added to
 * IAAL-main). Never blocks anything if it fails. */
router.post("/assistance-session/:id/launched", (req, res) => {
  markSessionLaunched(req.params.id).catch(() => {});
  res.status(202).end();
});

/** GET /catalog — the full planned catalog, for browsing in ID Studio. */
router.get("/catalog", (_req, res) => {
  res.json({ catalog: MODULE_CATALOG });
});

/** POST /generate — { moduleTag, concept, build, keyTeaching, newConcepts } -> generated code, not yet published. */
router.post("/generate", async (req, res) => {
  try {
    const result = await generateAssistModule(req.body);
    await notifyTeamServer(
      `🧩 ID Module generated a new assistance module: **${req.body.moduleTag}** (${req.body.concept}). Needs review before it's published — check ID Studio.`
    );
    res.json(result);
  } catch (err) {
    console.error("[id-module] /generate:", err);
    res.status(err?.message?.includes("Missing GEMINI_API_KEY") ? 503 : 500).json({
      error: err?.message ?? "Generation failed",
    });
  }
});

/** GET /pending-requests — auto-drafted modules (from SpecForge's classifier) awaiting ID-team review.
 * A request is "pending" as long as its title doesn't carry the "(resolved)" suffix publishing adds. */
router.get("/pending-requests", async (_req, res) => {
  try {
    const issues = await listIssues({ count: 200 });
    const requests = issues
      .filter((i) => i.projectId === MODULE_LIBRARY_PROJECT_ID && i.title.startsWith("Tutorial needed:") && !i.title.includes("(resolved)"))
      .map((i) => {
        const fields = parseKV(i.description);
        const taskIds = (fields.RequestedForTasks || "")
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);
        return {
          issueId: i.id,
          tag: i.title.replace("Tutorial needed:", "").trim(),
          concept: fields.Concept || "",
          build: fields.Build || "",
          keyTeaching: fields.KeyTeaching || "",
          filePath: fields.FilePath || "",
          product: fields.RequestedForProduct || "",
          taskCount: taskIds.length,
          submitDate: i.submitDate,
        };
      })
      .sort((a, b) => new Date(b.submitDate) - new Date(a.submitDate));
    res.json({ requests });
  } catch (err) {
    res.status(500).json({ error: err?.message ?? "Could not load pending requests" });
  }
});

/** GET /draft?filePath=... — serves an already-generated module's source for review.
 * Path is constrained to src/engines/assist/ — nothing else on disk is reachable through this route. */
router.get("/draft", (req, res) => {
  try {
    const filePath = String(req.query.filePath || "");
    const resolved = path.resolve(filePath);
    if (!resolved.startsWith(ASSIST_DIR + path.sep)) {
      return res.status(400).json({ error: "filePath must be inside src/engines/assist/" });
    }
    if (!fs.existsSync(resolved)) return res.status(404).json({ error: "File not found — it may have been moved." });
    res.json({ code: fs.readFileSync(resolved, "utf8"), filePath: resolved });
  } catch (err) {
    res.status(500).json({ error: err?.message ?? "Could not read draft" });
  }
});

/** PUT /draft — { filePath, nodes } -> re-splices the file's NODES array with ID's edits from the
 * review overlay, validates the result with the same esbuild+vm check generateModule.js runs
 * before a fresh generation is ever written, and only overwrites the file if it passes. A reviewer
 * editing wording in the overlay never risks writing a broken file — same discipline as generation,
 * applied to edits too. */
router.put("/draft", (req, res) => {
  try {
    const { filePath, nodes } = req.body;
    if (!Array.isArray(nodes)) return res.status(400).json({ error: "nodes[] is required" });
    const resolved = path.resolve(String(filePath || ""));
    if (!resolved.startsWith(ASSIST_DIR + path.sep)) {
      return res.status(400).json({ error: "filePath must be inside src/engines/assist/" });
    }
    if (!fs.existsSync(resolved)) return res.status(404).json({ error: "File not found — it may have been moved." });

    const original = fs.readFileSync(resolved, "utf8");
    const spliced = spliceNodesArray(original, nodes);
    assertValidModule(spliced); // throws with a clear message if the edit broke syntax or a runtime reference
    fs.writeFileSync(resolved, spliced, "utf8");
    res.json({ ok: true, filePath: resolved, code: spliced });
  } catch (err) {
    console.error("[id-module] /draft PUT:", err);
    res.status(400).json({ error: err?.message ?? "Could not save edits" });
  }
});

/** POST /publish — { moduleTag, concept, filePath } -> registers it in the Module Library.
 * If a matching "Tutorial needed: <moduleTag>" request exists, this also unblocks every task
 * it was raised for (NeedsTutorial/DraftModule -> AssistModule on each) and closes the request out.
 * Then runs the queued-applicant rematch sweep — human-action trigger, no cron (handoff §9). */
router.post("/publish", requireRole("ID"), async (req, res) => {
  try {
    const { moduleTag, concept, filePath } = req.body;

    await createIssue({
      projectId: MODULE_LIBRARY_PROJECT_ID,
      title: `Module: ${moduleTag}`,
      description: [`Concept: ${concept}`, `FilePath: ${filePath}`, `PublishedAt: ${new Date().toISOString()}`].join("\n"),
    });

    const unblocked = await resolvePendingRequest(moduleTag);

    let rematch = { rematched: [] };
    if (unblocked.length > 0) {
      try {
        rematch = await tryRematchQueuedApplicants();
      } catch (err) {
        console.error("[id-module] rematch sweep after publish failed:", err.message);
      }
    }

    await notifyTeamServer(
      `✅ **${moduleTag}** approved and published to the Module Library — available for reuse now.` +
        (unblocked.length > 0 ? ` Unblocked ${unblocked.length} task${unblocked.length === 1 ? "" : "s"} that were waiting on it.` : "") +
        (rematch.rematched.length > 0
          ? ` Rematched ${rematch.rematched.length} queued applicant${rematch.rematched.length === 1 ? "" : "s"}.`
          : "")
    );
    res.json({
      ok: true,
      unblockedTaskCount: unblocked.length,
      rematchedCount: rematch.rematched.length,
    });
  } catch (err) {
    res.status(500).json({ error: err?.message ?? "Publish failed" });
  }
});

/** Finds the open "Tutorial needed: <moduleTag>" request (if any), patches every task it listed
 * from NeedsTutorial+DraftModule to AssistModule, and marks the request resolved. Returns the
 * list of task issue ids that got unblocked (empty if this was a manual, non-SpecForge publish). */
async function resolvePendingRequest(moduleTag) {
  const issues = await listIssues({ count: 200 });
  const request = issues.find(
    (i) => i.projectId === MODULE_LIBRARY_PROJECT_ID && i.title === `Tutorial needed: ${moduleTag}`
  );
  if (!request) return [];

  const fields = parseKV(request.description);
  const taskIds = (fields.RequestedForTasks || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  const unblocked = [];
  for (const idStr of taskIds) {
    const taskId = Number(idStr);
    if (!taskId) continue;
    try {
      const task = issues.find((i) => i.id === taskId);
      if (!task) continue;
      const newDescription = (task.description || "")
        .split("\n")
        .map((line) => {
          if (/^NeedsTutorial:/.test(line)) return `AssistModule: ${moduleTag}`;
          if (/^DraftModule:/.test(line)) return null; // superseded by AssistModule above
          return line;
        })
        .filter((line) => line !== null)
        .join("\n");
      await updateIssueDescription(taskId, newDescription);
      unblocked.push(taskId);
    } catch (err) {
      console.error(`[id-module] failed to unblock task ${idStr}:`, err.message);
    }
  }

  await updateIssueTitle(request.id, `Tutorial needed: ${moduleTag} (resolved)`);
  return unblocked;
}

export default router;
