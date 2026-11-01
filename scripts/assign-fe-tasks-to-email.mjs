/**
 * Assign every open FE Coding task (CodingFocus: frontend) across the SMB desk
 * products to a JS email — Application: + Matched: per task (same shape as
 * assign-by-email / Matching Queue).
 *
 * Usage:
 *   node scripts/assign-fe-tasks-to-email.mjs
 *   node scripts/assign-fe-tasks-to-email.mjs bsit.setty@gmail.com
 *
 * Requires OneDev up + .env ONEDEV_API_USER/PASS.
 */
import "dotenv/config";
import { listAllIssues, listProjects, createIssue } from "../server/onedev-client.js";
import {
  COHORT_PROJECT_ID,
  isAssignable,
  taskMeta,
  extractApplicationId,
} from "../src/cohort-matching/matching.js";

const EMAIL = String(process.argv[2] || "bsit.setty@gmail.com")
  .trim()
  .toLowerCase();
const NAME = "Bsit Setty";

const PRODUCT_NAMES = new Set([
  "BookingDepositDesk",
  "InvoiceFollowUpTracker",
  "LeadFollowUpInbox",
  "ShiftCoverageBoard",
  "QuoteEstimateDesk",
  "ReviewReplyInbox",
  "ClientReminderHub",
  "PackagePunchCard",
]);

function projectNameOf(projects, id) {
  return projects.find((p) => p.id === id)?.name || `project-${id}`;
}

const [projects, issues] = await Promise.all([
  listProjects({ offset: 0, count: 100 }),
  listAllIssues(),
]);

const productIds = new Set(
  projects.filter((p) => PRODUCT_NAMES.has(p.name)).map((p) => p.id)
);
console.log(
  "Products found:",
  [...productIds].map((id) => `${projectNameOf(projects, id)} (#${id})`).join(", ") || "(none)"
);
if (productIds.size === 0) {
  console.error("FAIL: none of the 8 desk products exist in OneDev. Reseed first.");
  process.exit(1);
}

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
  if (i.state !== "Open") return false;
  if (!isAssignable(i)) return false;
  const meta = taskMeta(i.description);
  if ((meta.trade || "").toLowerCase() !== "coding") return false;
  return meta.codingFocus === "frontend";
});

console.log(`FE Coding open assignable: ${feTasks.length}`);
if (feTasks.length === 0) {
  console.error("FAIL: no FE Coding tasks found (CodingFocus: frontend).");
  process.exit(1);
}

const apps = issues.filter(
  (i) => i.projectId === COHORT_PROJECT_ID && i.title.startsWith("Application:")
);
const appsForEmail = apps.filter((a) =>
  (a.description || "")
    .split("\n")
    .some((line) => line.trim().toLowerCase() === `email: ${EMAIL}`)
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
    title: `Application: ${NAME} — Coding`,
    description: [
      `Name: ${NAME}`,
      `Email: ${EMAIL}`,
      `Stated trade: Coding`,
      `SkillLevel: js`,
      `CodingFocus: frontend`,
      `OwnershipAck: true`,
      `OwnershipAckAt: ${new Date().toISOString()}`,
      `Note: bulk FE assign via scripts/assign-fe-tasks-to-email.mjs`,
    ].join("\n"),
  });
  application = { id: applicationId, title: `Application: ${NAME} — Coding` };
  console.log(`Created Application #${applicationId}`);
} else {
  console.log(`Reusing Application #${application.id}`);
}

let assigned = 0;
let skipped = 0;
for (const task of feTasks) {
  if (claimedTaskIds.has(task.id)) {
    console.log(`  skip (already claimed) #${task.number} ${task.title}`);
    skipped++;
    continue;
  }
  await createIssue({
    projectId: COHORT_PROJECT_ID,
    title: `Matched: ${NAME} → ${task.title}`,
    description: [
      `ApplicationId: ${application.id}`,
      `TaskId: ${task.id}`,
      `Task: #${task.number} "${task.title}" in ${projectNameOf(projects, task.projectId)}`,
      `StatedTrade: Coding`,
      `AssignedByEmail: ${EMAIL}`,
      `— placed by scripts/assign-fe-tasks-to-email.mjs`,
    ].join("\n"),
  });
  claimedTaskIds.add(task.id);
  assigned++;
  console.log(
    `  ✓ #${task.number} [${projectNameOf(projects, task.projectId)}] ${task.title}`
  );
}

console.log(`\nDone. Assigned ${assigned}, skipped ${skipped}.`);
console.log(`Sign in as ${EMAIL} → #/workbench (My tasks) to test.`);
console.log(
  "Live product ids for my-tasks filter:",
  [...productIds].sort((a, b) => a - b).join(", ")
);
