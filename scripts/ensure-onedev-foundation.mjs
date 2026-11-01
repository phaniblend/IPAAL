/**
 * Ensure the reserved OneDev projects exist (product-backlog, cohort-applications,
 * team-ops, module-library, product-proposals). On a fresh colocated OneDev these
 * must be created first so matching.js's hardcoded ids 1–5 land correctly.
 */
import { findProjectByName, createProject, listProjects } from "../server/onedev-client.js";

const FOUNDATION = [
  { name: "product-backlog", description: "Product backlog (reserved)" },
  { name: "cohort-applications", description: "Applications + Matched: records (reserved)" },
  { name: "team-ops", description: "Team ops / RoleGrant / cohorts (reserved)" },
  { name: "module-library", description: "Published Assist modules (reserved)" },
  { name: "product-proposals", description: "Product Forge proposals (reserved)" },
];

const existing = await listProjects({ offset: 0, count: 100 });
console.log(
  "[foundation] existing projects:",
  existing.map((p) => `${p.id}:${p.name}`).join(", ") || "(none)"
);

for (const p of FOUNDATION) {
  const hit = await findProjectByName(p.name);
  if (hit?.id) {
    console.log(`[foundation] ok ${p.name} #${hit.id}`);
    continue;
  }
  const id = await createProject({ name: p.name, description: p.description });
  console.log(`[foundation] created ${p.name} #${id}`);
}

const after = await listProjects({ offset: 0, count: 100 });
const byName = Object.fromEntries(after.map((p) => [p.name, p.id]));
const expected = {
  "cohort-applications": 2,
  "team-ops": 3,
  "module-library": 4,
};
for (const [name, wantId] of Object.entries(expected)) {
  const got = byName[name];
  if (got !== wantId) {
    console.warn(
      `[foundation] WARN ${name} is id ${got}, matching.js expects ${wantId}. ` +
        `If this is not a fresh OneDev, update LIVE/reserved ids or wipe /opt/onedev.`
    );
  }
}

console.log("[foundation] done");
