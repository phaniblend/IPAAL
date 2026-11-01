/**
 * One-shot Railway/prod bootstrap: ensure the 8 desk products + FE Coding Matched:
 * rows exist for the test aspirant, then stop (OpsMarker in cohort-applications).
 *
 * Local already had this via seed-smb-pipeline + assign-fe-tasks-to-email; production
 * OneDev only had a single BatchCraft match, so My tasks showed one card.
 *
 * Safe to leave in prestart — subsequent boots see the marker and no-op.
 */
import "dotenv/config";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import path from "node:path";
import {
  listProjects,
  listAllIssues,
  createIssue,
} from "../server/onedev-client.js";
import { COHORT_PROJECT_ID } from "../src/cohort-matching/matching.js";

const EMAIL = "bsit.setty@gmail.com";
const MARKER_TITLE = "OpsMarker: ensure-prod-fe-board-v1";
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

try {
  const issues = await listAllIssues();
  if (issues.some((i) => i.projectId === COHORT_PROJECT_ID && i.title === MARKER_TITLE)) {
    console.log(`[ensure-prod-fe] marker present — skip (${MARKER_TITLE})`);
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

  await createIssue({
    projectId: COHORT_PROJECT_ID,
    title: MARKER_TITLE,
    description: [
      `Email: ${EMAIL}`,
      `CreatedAt: ${new Date().toISOString()}`,
      `Note: one-shot from scripts/ensure-prod-fe-board.mjs (prestart)`,
    ].join("\n"),
  });
  console.log(`[ensure-prod-fe] done — wrote ${MARKER_TITLE}`);
} catch (err) {
  // Never block app boot if OneDev is down or seed partially fails.
  console.warn(`[ensure-prod-fe] skipped/failed: ${err.message}`);
  process.exit(0);
}
