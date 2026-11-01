/**
 * Audit P04: deepDive.discover used to embed the full expected solution.
 * Replace those dumps with a non-answer nudge. Safe to re-run.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const dir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../src/engines/assist");
const replacement =
  'discover: "Re-read the WHAT / HOW for this step. The check verifies those requirements — not a pasted answer.",';

let n = 0;
for (const f of fs.readdirSync(dir).filter((x) => x.endsWith(".tsx"))) {
  const p = path.join(dir, f);
  let s = fs.readFileSync(p, "utf8");
  const next = s.replace(/discover:\s*`[\s\S]*?`,/g, replacement);
  if (next !== s) {
    fs.writeFileSync(p, next);
    n += 1;
    console.log("patched", f);
  }
}
console.log(`done — ${n} files`);
