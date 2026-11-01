/**
 * Ensure SMB desk FE Coding tasks exist and are Matched: to a given email.
 * Runs in-process (same OneDev client as /my-tasks) — do not spawn a child Node;
 * found live on Railway that a spawned ensure script got `fetch failed` against OneDev
 * while the parent HTTP process could reach it fine.
 */
import { listAllIssues, listProjects, createIssue, ensureDeliveryProject } from "./onedev-client.js";
import {
  COHORT_PROJECT_ID,
  TEAM_OPS_PROJECT_ID,
  MODULE_LIBRARY_PROJECT_ID,
  isAssignable,
  taskMeta,
  extractApplicationId,
} from "../src/cohort-matching/matching.js";
import { CODING_ASSISTS } from "../scripts/codingTasks.data.mjs";

const DESK_NAMES = [
  "BookingDepositDesk",
  "InvoiceFollowUpTracker",
  "LeadFollowUpInbox",
  "ShiftCoverageBoard",
  "QuoteEstimateDesk",
  "ReviewReplyInbox",
  "ClientReminderHub",
  "PackagePunchCard",
];

const DESK_BLURBS = {
  BookingDepositDesk: "Appointments + deposits desk",
  InvoiceFollowUpTracker: "Invoice follow-up desk",
  LeadFollowUpInbox: "Lead follow-up desk",
  ShiftCoverageBoard: "Shift coverage desk",
  QuoteEstimateDesk: "Quote / estimate desk",
  ReviewReplyInbox: "Review reply desk",
  ClientReminderHub: "Client reminder desk",
  PackagePunchCard: "Package punch-card desk",
};

function projectNameOf(projects, id) {
  return projects.find((p) => p.id === id)?.name || `project-${id}`;
}

function matchCountForEmail(issues, email) {
  const needle = String(email || "").trim().toLowerCase();
  const appIds = new Set(
    issues
      .filter(
        (i) =>
          i.projectId === COHORT_PROJECT_ID &&
          i.title.startsWith("Application:") &&
          (i.description || "")
            .split("\n")
            .some((line) => line.trim().toLowerCase() === `email: ${needle}`)
      )
      .map((i) => i.id)
  );
  return issues.filter((i) => {
    if (i.projectId !== COHORT_PROJECT_ID || !i.title.startsWith("Matched:")) return false;
    return appIds.has(Number(/ApplicationId:\s*(\d+)/.exec(i.description || "")?.[1]));
  }).length;
}

function taskDescription(productName, t) {
  return [
    t.story ? `Story: ${t.story}` : null,
    t.description ? t.description.trim() : null,
    `Trade: Coding`,
    t.tech ? `TechLevel: ${t.tech}` : t.focus === "backend" ? `TechLevel: crud` : `TechLevel: js`,
    `Cohort: ${productName}`,
    `AcceptanceCriteria: ${t.ac}`,
    t.assist ? `AssistModule: ${t.assist}` : `TutorialExempt: true`,
    t.focus ? `CodingFocus: ${t.focus}` : null,
  ]
    .filter(Boolean)
    .join("\n");
}

async function ensureDeskFeTasks(projects, issues, log) {
  const byName = new Map(projects.map((p) => [p.name, p]));
  let createdTasks = 0;

  for (const name of DESK_NAMES) {
    const coding = CODING_ASSISTS[name] || [];
    if (coding.length === 0) continue;

    let project = byName.get(name);
    if (!project) {
      const ensured = await ensureDeliveryProject({
        name,
        description: DESK_BLURBS[name] || name,
      });
      project = { id: ensured.projectId, name };
      byName.set(name, project);
      projects.push(project);
      log.push(`created project ${name} #${ensured.projectId}`);
      await createIssue({
        projectId: TEAM_OPS_PROJECT_ID,
        title: `Cohort: ${name}`,
        description: [
          `Product: ${name}`,
          `DeliveryProject: ${name} (#${ensured.projectId})`,
          `Seed: server/ensure-fe-board.js`,
          `CreatedAt: ${new Date().toISOString()}`,
        ].join("\n"),
      });
    }

    const existingTitles = new Set(
      issues.filter((i) => i.projectId === project.id).map((i) => i.title)
    );

    for (const t of coding) {
      // Publish assist module stub so NeedsTutorial does not block assignability later.
      if (t.assist) {
        const modTitle = `Module: ${t.assist}`;
        const hasMod = issues.some(
          (i) => i.projectId === MODULE_LIBRARY_PROJECT_ID && i.title === modTitle
        );
        if (!hasMod) {
          const id = await createIssue({
            projectId: MODULE_LIBRARY_PROJECT_ID,
            title: modTitle,
            description: [
              `Concept: ${t.title}`,
              `PublishedAt: ${new Date().toISOString()}`,
              `PublishedBy: server/ensure-fe-board.js`,
            ].join("\n"),
          });
          issues.push({ id, projectId: MODULE_LIBRARY_PROJECT_ID, title: modTitle });
        }
      }

      if (existingTitles.has(t.title)) continue;
      const id = await createIssue({
        projectId: project.id,
        title: t.title,
        description: taskDescription(name, t),
      });
      issues.push({
        id,
        number: id,
        title: t.title,
        description: taskDescription(name, t),
        state: "Open",
        projectId: project.id,
      });
      existingTitles.add(t.title);
      createdTasks++;
    }
  }

  return createdTasks;
}

async function assignFeToEmail({ email, name = "Bsit Setty", projects, issues, log }) {
  const needle = String(email).trim().toLowerCase();
  const productIds = new Set(projects.filter((p) => DESK_NAMES.includes(p.name)).map((p) => p.id));

  const matches = issues.filter(
    (i) => i.projectId === COHORT_PROJECT_ID && i.title.startsWith("Matched:")
  );
  const claimedTaskIds = new Set(
    matches
      .map((m) => Number(/TaskId:\s*(\d+)/.exec(m.description || "")?.[1]))
      .filter((n) => Number.isFinite(n) && n > 0)
  );

  const feTasks = issues.filter((i) => {
    if (!productIds.has(i.projectId)) return false;
    if (i.state && i.state !== "Open") return false;
    if (!isAssignable(i)) return false;
    const meta = taskMeta(i.description);
    if ((meta.trade || "").toLowerCase() !== "coding") return false;
    return meta.codingFocus === "frontend";
  });

  log.push(`FE Coding open assignable: ${feTasks.length}`);

  const apps = issues.filter(
    (i) => i.projectId === COHORT_PROJECT_ID && i.title.startsWith("Application:")
  );
  const appsForEmail = apps.filter((a) =>
    (a.description || "")
      .split("\n")
      .some((line) => line.trim().toLowerCase() === `email: ${needle}`)
  );
  const alreadyMatchedAppIds = new Set(
    matches.map((m) => extractApplicationId(m.description)).filter(Boolean)
  );
  let application =
    appsForEmail.find((a) => !alreadyMatchedAppIds.has(a.id)) ||
    [...appsForEmail].sort((a, b) => b.id - a.id)[0] ||
    null;

  if (!application) {
    const applicationId = await createIssue({
      projectId: COHORT_PROJECT_ID,
      title: `Application: ${name} — Coding`,
      description: [
        `Name: ${name}`,
        `Email: ${needle}`,
        `Stated trade: Coding`,
        `SkillLevel: js`,
        `CodingFocus: frontend`,
        `OwnershipAck: true`,
        `OwnershipAckAt: ${new Date().toISOString()}`,
        `Note: bulk FE assign via server/ensure-fe-board.js`,
      ].join("\n"),
    });
    application = { id: applicationId, title: `Application: ${name} — Coding` };
    log.push(`Created Application #${applicationId}`);
  } else {
    log.push(`Reusing Application #${application.id}`);
  }

  let assigned = 0;
  let skipped = 0;
  for (const task of feTasks) {
    if (claimedTaskIds.has(task.id)) {
      skipped++;
      continue;
    }
    await createIssue({
      projectId: COHORT_PROJECT_ID,
      title: `Matched: ${name} → ${task.title}`,
      description: [
        `ApplicationId: ${application.id}`,
        `TaskId: ${task.id}`,
        `Task: #${task.number || task.id} "${task.title}" in ${projectNameOf(projects, task.projectId)}`,
        `StatedTrade: Coding`,
        `AssignedByEmail: ${needle}`,
        `— placed by server/ensure-fe-board.js`,
      ].join("\n"),
    });
    claimedTaskIds.add(task.id);
    assigned++;
  }
  log.push(`Assigned ${assigned}, skipped ${skipped}`);
  return { assigned, skipped, applicationId: application.id, feTaskCount: feTasks.length };
}

/**
 * @param {{ email?: string, name?: string, minMatches?: number }} opts
 */
export async function ensureFeBoard(opts = {}) {
  const email = String(opts.email || process.env.ENSURE_FE_ASSIGN_EMAIL || "bsit.setty@gmail.com")
    .trim()
    .toLowerCase();
  const name = opts.name || "Bsit Setty";
  const minMatches = Number(opts.minMatches || process.env.ENSURE_FE_MIN_MATCHES || 20);
  const log = [];

  const [projects, issues] = await Promise.all([
    listProjects({ offset: 0, count: 100 }),
    listAllIssues(),
  ]);

  const before = matchCountForEmail(issues, email);
  log.push(`${email} had ${before} Matched: row(s)`);
  if (before >= minMatches) {
    log.push(`already ≥ ${minMatches} — skip`);
    return { ok: true, email, matches: before, skipped: true, log };
  }

  const createdTasks = await ensureDeskFeTasks(projects, issues, log);
  log.push(`seeded/created ${createdTasks} coding task issue(s)`);

  const assignResult = await assignFeToEmail({ email, name, projects, issues, log });

  const afterIssues = await listAllIssues();
  const after = matchCountForEmail(afterIssues, email);
  log.push(`${email} now has ${after} Matched: row(s)`);

  return {
    ok: true,
    email,
    matches: after,
    matchesBefore: before,
    createdTasks,
    ...assignResult,
    log,
  };
}
