#!/usr/bin/env node
/**
 * Generates the core-lesson manifest IPF's task-to-lesson matcher reads — a build-time snapshot,
 * not a runtime scan. Per the parked §5a-4 spec: "Do not scan 922 source files in the browser at
 * runtime. Generate a versioned manifest at build time." Run this whenever IPAAL-main's curriculum
 * changes; commit the output.
 *
 * Reads WEB_APP_MASTERY_SPECS directly (not the aspirational webAppBuildingBlocksCurriculum.js
 * catalog) — confirmed live via real import that all 109 curriculum entries have a real, working
 * lesson spec behind them (29 hand-authored + 80 generated from BLUEPRINTS), so the manifest can
 * point at real, loadable lessons, not placeholders. Array order === route index: App.jsx's
 * `/lessons/webapp-blocks/<index>` (see src/auth/redirectPath.js) opens ENGINES_WEB_APP_BLOCKS[index],
 * built by mapping this same array 1:1, so index-in-this-array IS the route index — no separate
 * lookup table needed.
 */
import path from "path";
import fs from "fs";
import { fileURLToPath, pathToFileURL } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const IPAAL_MAIN = "D:/inpact-assistance-mods/IPAAL-main/IPAAL-main";
const OUT_PATH = path.resolve(__dirname, "..", "src", "id-module", "coreLessonManifest.json");

async function main() {
  const specsPath = pathToFileURL(path.join(IPAAL_MAIN, "src/engines/mastery/webAppMasterySpecs.js")).href;
  const { WEB_APP_MASTERY_SPECS } = await import(specsPath);

  const entries = WEB_APP_MASTERY_SPECS.map((spec, index) => ({
    schemaVersion: 1,
    lessonKey: `webapp-blocks.${spec.id}`,
    track: "webapp-blocks",
    listIndex: index,
    route: `/lessons/webapp-blocks/${index}`,
    title: spec.title,
    moduleId: spec.module,
    // Real per-lesson text to match a task's title/description/acceptance-criteria against —
    // concept/whatItIs/task are the most content-dense fields available on every spec.
    matchText: [spec.title, spec.module, spec.concept, spec.whatItIs, spec.task].filter(Boolean).join(" "),
    published: true,
  }));

  fs.writeFileSync(OUT_PATH, JSON.stringify({ generatedAt: new Date().toISOString(), sourceRepo: IPAAL_MAIN, count: entries.length, entries }, null, 2));
  console.log(`Wrote ${entries.length} lessons to ${OUT_PATH}`);
}

main().catch((err) => {
  console.error("Manifest generation failed:", err.message);
  process.exit(1);
});
