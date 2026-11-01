import "dotenv/config";
import { listAllIssues, listProjects } from "../server/onedev-client.js";
import { COHORT_PROJECT_ID } from "../src/cohort-matching/matching.js";

const email = String(process.argv[2] || "bsit.setty@gmail.com").trim().toLowerCase();
const [projects, issues] = await Promise.all([
  listProjects({ count: 100 }),
  listAllIssues(),
]);
const apps = issues.filter(
  (i) =>
    i.projectId === COHORT_PROJECT_ID &&
    i.title.startsWith("Application:") &&
    (i.description || "")
      .split("\n")
      .some((l) => l.trim().toLowerCase() === `email: ${email}`)
);
const appIds = new Set(apps.map((a) => a.id));
const matches = issues.filter((i) => {
  if (i.projectId !== COHORT_PROJECT_ID || !i.title.startsWith("Matched:")) return false;
  return appIds.has(Number(/ApplicationId:\s*(\d+)/.exec(i.description || "")?.[1]));
});
console.log("projects", projects.map((p) => `${p.id}:${p.name}`).join(", "));
console.log("apps", apps.length, apps.map((a) => `#${a.id}`).join(" "));
console.log("matches", matches.length);
for (const m of matches) {
  const tid = /TaskId:\s*(\d+)/.exec(m.description || "")?.[1];
  const task = issues.find((i) => String(i.id) === String(tid));
  console.log(
    `  ${m.title} → task ${tid} ${task ? `[${projects.find((p) => p.id === task.projectId)?.name}] ${task.title}` : "(missing)"}`
  );
}
