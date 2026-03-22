/**
 * Machine checks for react-ts / react-js lesson JSON (structure + required step fields).
 * Editorial checks (intro vs objectives) are in .cursor/rules/content-lessons.mdc — apply by hand or in a content pass.
 *
 * Usage:
 *   node scripts/audit-react-lessons-structure.mjs
 *   node scripts/audit-react-lessons-structure.mjs --ci   # exit 1 if any failure
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

const TRACKS = ["react-ts", "react-js"];
const ci = process.argv.includes("--ci");

function walkJsonFiles(dir) {
  const out = [];
  if (!fs.existsSync(dir)) return out;
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name);
    const st = fs.statSync(p);
    if (st.isDirectory()) out.push(...walkJsonFiles(p));
    else if (name.endsWith("_lesson.json")) out.push(p);
  }
  return out;
}

function issuesForLesson(raw) {
  const problems = [];
  const c = raw?.config;
  if (!c) {
    problems.push("missing config");
    return problems;
  }

  if (!c.intro?.title?.trim()) problems.push("intro.title missing");
  if (!c.intro?.body?.trim()) problems.push("intro.body missing");
  if (!c.intro?.usecase?.trim()) problems.push("intro.usecase missing");
  if (!Array.isArray(c.objectives) || c.objectives.length === 0) problems.push("objectives empty or missing");
  if (!Array.isArray(c.steps) || c.steps.length === 0) problems.push("steps empty or missing");

  (c.steps || []).forEach((s, i) => {
    const label = s?.id || `index ${i}`;
    if (s?.type !== "question") return;
    if (!s.instruction?.trim()) problems.push(`step ${label}: instruction missing`);
    for (const k of ["feedbackCorrect", "feedbackPartial", "feedbackWrong"]) {
      if (!s[k]?.trim()) problems.push(`step ${label}: ${k} missing`);
    }
    if (!s.evaluation) problems.push(`step ${label}: evaluation missing`);
  });

  return problems;
}

const files = TRACKS.flatMap((t) => walkJsonFiles(path.join(root, "content", t)));
const rows = [];

for (const file of files) {
  let raw;
  try {
    raw = JSON.parse(fs.readFileSync(file, "utf8"));
  } catch (e) {
    rows.push({ file: path.relative(root, file), problems: [`invalid JSON: ${e.message}`] });
    continue;
  }
  const problems = issuesForLesson(raw);
  if (problems.length) rows.push({ file: path.relative(root, file), problems });
}

console.log(`Scanned ${files.length} lesson files (react-ts + react-js).`);
console.log(`Structural failures: ${rows.length}`);
if (rows.length) {
  console.log("\n--- Issues ---\n");
  for (const r of rows.slice(0, 100)) {
    console.log(r.file);
    r.problems.forEach((p) => console.log(`  - ${p}`));
  }
  if (rows.length > 100) console.log(`\n... and ${rows.length - 100} more files`);
}

if (ci && rows.length) process.exit(1);
process.exit(0);
