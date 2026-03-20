#!/usr/bin/env node
/**
 * Rename "Problem" to "Lesson" in UI titles only (not in body copy).
 * - Sidebar first item: label: "Problem" -> label: "Lesson"
 * - Button: "NEXT PROBLEM" -> "NEXT LESSON"
 * - Complete screen: "Problem #N Complete" -> "Lesson #N Complete"
 * - Tag in content: "PROBLEM #N" -> "LESSON #N" (and PROBLEM #N (Vue) etc.)
 * - phase: "Problem" stays or becomes "Lesson" for intro (sidebar shows this)
 */
const fs = require("fs");
const path = require("path");

const srcDir = path.join(__dirname, "..", "src");

function walk(dir, ext, fn) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory() && e.name !== "node_modules") walk(full, ext, fn);
    else if (e.isFile() && e.name.endsWith(ext)) fn(full);
  }
}

let filesChanged = 0;
walk(srcDir, ".jsx", (file) => {
  let content = fs.readFileSync(file, "utf8");
  let changed = false;

  // Sidebar label (first item in progress list)
  if (content.includes('label: "Problem"')) {
    content = content.replace(/label: "Problem"/g, 'label: "Lesson"');
    changed = true;
  }
  // Button text
  if (content.includes("NEXT PROBLEM")) {
    content = content.replace(/NEXT PROBLEM/g, "NEXT LESSON");
    changed = true;
  }
  // Complete screen title: "Problem #3 Complete" etc.
  if (content.includes("Problem #") && content.includes("Complete")) {
    content = content.replace(/Problem #(\d+) Complete/g, "Lesson #$1 Complete");
    changed = true;
  }
  // Tag in intro content: "PROBLEM #3" or "PROBLEM #11" or "PROBLEM #40 (Vue)"
  if (content.includes('tag: "PROBLEM #')) {
    content = content.replace(/tag: "PROBLEM #/g, 'tag: "LESSON #');
    changed = true;
  }
  // phase for intro (sidebar shows "Problem" / "Lesson" when this is the first node)
  if (content.includes('phase: "Problem"') && content.includes("intro")) {
    content = content.replace(/phase: "Problem"/g, 'phase: "Lesson"');
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(file, content);
    filesChanged++;
    console.log(file);
  }
});

console.log("\nTotal files updated:", filesChanged);
