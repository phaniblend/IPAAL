/**
 * Railway/prod bootstrap: ensure the 8 desk products exist and FE Coding Matched:
 * rows for the test aspirant reach the expected count. Retries on every boot until
 * match count is high enough (no sticky "success" marker that can mask a failed assign).
 *
 * Also invokable via POST /api/recruit/bootstrap-fe-board (ops token).
 */
import "dotenv/config";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { listProjects, listAllIssues } from "../server/onedev-client.js";
import { COHORT_PROJECT_ID } from "../src/cohort-matching/matching.js";

const EMAIL = String(process.env.ENSURE_FE_ASSIGN_EMAIL || "bsit.setty@gmail.com")
  .trim()
  .toLowerCase();
const MIN_MATCHES = Number(process.env.ENSURE_FE_MIN_MATCHES || 20);
const DESK = "BookingDepositDesk";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

function runNode(script, args = []) {
  const r = spawnSync(process.execPath, [script, ...args], {
    cwd: root,
    env: process.env,
    stdio: "inherit",
  });
  if (r.status !== 0) {
    throw new Error(`${path.basename(script)} exited ${r.status}`);
  }
}

function matchCountForEmail(issues, email) {
  const appIds = new Set(
    issues
      .filter(
        (i) =>
          i.projectId === COHORT_PROJECT_ID &&
          i.title.startsWith("Application:") &&
          (i.description || "")
            .split("\n")
            .some((line) => line.trim().toLowerCase() === `email: ${email}`)
      )
      .map((i) => i.id)
  );
  return issues.filter((i) => {
    if (i.projectId !== COHORT_PROJECT_ID || !i.title.startsWith("Matched:")) return false;
    return appIds.has(Number(/ApplicationId:\s*(\d+)/.exec(i.description || "")?.[1]));
  }).length;
}

try {
  let issues = await listAllIssues();
  let matches = matchCountForEmail(issues, EMAIL);
  console.log(`[ensure-prod-fe] ${EMAIL} currently has ${matches} Matched: row(s)`);
  if (matches >= MIN_MATCHES) {
    console.log(`[ensure-prod-fe] already ≥ ${MIN_MATCHES} — skip`);
    process.exit(0);
  }

  const projects = await listProjects({ offset: 0, count: 100 });
  const hasDesk = projects.some((p) => p.name === DESK);
  if (!hasDesk) {
    console.log(`[ensure-prod-fe] ${DESK} missing — seeding SMB desks…`);
    runNode(path.join("scripts", "seed-smb-pipeline.mjs"));
  } else {
    console.log(`[ensure-prod-fe] ${DESK} already present — seed skipped`);
  }

  console.log(`[ensure-prod-fe] assigning FE Coding tasks → ${EMAIL}`);
  runNode(path.join("scripts", "assign-fe-tasks-to-email.mjs"), [EMAIL]);

  issues = await listAllIssues();
  matches = matchCountForEmail(issues, EMAIL);
  console.log(`[ensure-prod-fe] done — ${EMAIL} now has ${matches} Matched: row(s)`);
  if (matches < MIN_MATCHES) {
    console.warn(
      `[ensure-prod-fe] still below ${MIN_MATCHES} — next boot (or bootstrap-fe-board) will retry`
    );
  }
} catch (err) {
  console.warn(`[ensure-prod-fe] skipped/failed: ${err.message}`);
  process.exit(0);
}
