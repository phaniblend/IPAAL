/* global process */
/**
 * Quality pass over content/<track>/*_lesson.json:
 * 1. Value consistency: if step 1 says "1 through 5" but seedCode uses [10,20,30,40,50], normalize.
 * 2. Split compound steps: "Do X then do Y" → two steps.
 * 3. Dependency check: useState/useEffect in seed → ensure import from 'react' appears in that step or an earlier step; prepend import on react-js/react-ts when safe.
 * 4. Phase lines: renumberSteps sets "Step k of n" to match array length (fixes drift).
 * 5. Materialize leading `// Import React…` placeholder comments into real imports from step 2 onward (step 1 stays learner-written).
 * 6. Trim and renumber after any changes.
 *
 * Run: node scripts/quality-pass-content-lessons.js
 * Optional: FROM_TRACK=js FROM_INDEX=0 LIMIT=100 DRY_RUN=1 (no writes)
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");
const CONTENT_DIR = process.env.CONTENT_DIR || path.join(rootDir, "content");
const FROM_TRACK = process.env.FROM_TRACK || null;
const FROM_INDEX = Number(process.env.FROM_INDEX) || 0;
const LIMIT = process.env.LIMIT ? Number(process.env.LIMIT) : null;
const DRY_RUN =
  String(process.env.DRY_RUN || "").toLowerCase() === "1" ||
  String(process.env.DRY_RUN || "").toLowerCase() === "true" ||
  process.argv.includes("--dry-run");
const CI_CHECK = process.argv.includes("--ci");

const report = {
  processed: 0,
  modified: 0,
  consistencyFixes: 0,
  stepsSplit: 0,
  dependencyIssues: [],
  importsPrepended: 0,
  reactImportsMaterialized: 0,
  issues: [],
};

const REACT_IMPORTS = {
  useState: "import React, { useState } from 'react';",
  useEffect: "import React, { useState, useEffect } from 'react';",
  useRef: "import React, { useState, useRef } from 'react';",
  useContext: "import React, { useState, useContext } from 'react';",
  useReducer: "import React, { useState, useReducer } from 'react';",
};
function defaultImportFor(hooks) {
  const set = new Set(hooks);
  return `import React, { ${[...set].sort().join(", ")} } from 'react';`;
}

const REACT_HOOK_NAMES = ["useState", "useEffect", "useRef", "useContext", "useReducer", "useMemo", "useCallback"];

function hooksUsedInSeed(seed) {
  const text = seedText(seed);
  return REACT_HOOK_NAMES.filter((h) => text.includes(h));
}

function seedNeedsReactNamespace(seed) {
  const text = seedText(seed);
  if (!text) return false;
  return (
    /React\.(FC|ReactNode|Component|SyntheticEvent|FormEvent|CSSProperties|MouseEvent|KeyboardEvent)/.test(text) ||
    /:\s*JSX\.Element/.test(text)
  );
}

function seedText(seed) {
  if (typeof seed === "string") return seed;
  if (seed && typeof seed === "object") {
    return Object.values(seed)
      .map((v) => (typeof v === "string" ? v : String(v ?? "")))
      .join("\n");
  }
  return "";
}

function collectFiles() {
  const files = [];
  const dirs = fs.readdirSync(CONTENT_DIR, { withFileTypes: true }).filter((d) => d.isDirectory());
  const tracks = FROM_TRACK ? dirs.filter((d) => d.name === FROM_TRACK) : dirs;
  tracks.sort((a, b) => a.name.localeCompare(b.name));
  for (const dir of tracks) {
    const trackPath = path.join(CONTENT_DIR, dir.name);
    const list = fs.readdirSync(trackPath).filter((f) => f.endsWith("_lesson.json"));
    list.sort();
    for (const f of list) files.push(path.join(trackPath, f));
  }
  return files;
}

function buildSideItems(steps) {
  const items = [{ label: "Intro", id: "intro" }, { label: "Objectives", id: "objectives" }];
  steps.forEach((s) => items.push({ label: s.title || s.id, id: s.id }));
  return items;
}

function renumberSteps(steps) {
  const n = steps.length;
  return steps.map((s, i) => ({ ...s, id: `step${i + 1}`, phase: `Step ${i + 1} of ${n}` }));
}

/** Step 1 says "1 through 5" or "1, 2, 3, 4, 5" etc. */
function step1UsesOneThroughFive(instruction) {
  if (!instruction || typeof instruction !== "string") return false;
  const lower = instruction.toLowerCase();
  if (lower.includes("1 through 5")) return true;
  if (lower.includes("numbers 1") && lower.includes("5")) return true;
  if (/1\s*,\s*2\s*,\s*3\s*,\s*4\s*,\s*5/.test(instruction)) return true;
  if (/\b1\s+through\s+5\b/.test(lower)) return true;
  return false;
}

/** Replace wrong array literal with [1, 2, 3, 4, 5] in text. */
function fixArrayLiteralInText(text) {
  if (typeof text !== "string") return text;
  let out = text;
  const wrong = [
    "[10, 20, 30, 40, 50]",
    "[10,20,30,40,50]",
    "10, 20, 30, 40, 50",
    "10,20,30,40,50",
  ];
  const right = "[1, 2, 3, 4, 5]";
  const rightNoBracket = "1, 2, 3, 4, 5";
  wrong.forEach((w) => {
    if (w.startsWith("[")) out = out.split(w).join(right);
    else out = out.split(w).join(rightNoBracket);
  });
  return out;
}

function applyConsistencyFixes(steps) {
  if (!steps.length) return steps;
  const firstInstruction = steps[0]?.instruction || "";
  if (!step1UsesOneThroughFive(firstInstruction)) return steps;
  let fixCount = 0;
  const out = steps.map((s) => {
    let changed = false;
    const seed = s.seedCode;
    if (seed && (seed.includes("10, 20, 30, 40, 50") || seed.includes("10,20,30,40,50"))) {
      s = { ...s, seedCode: fixArrayLiteralInText(seed) };
      changed = true;
    }
    const exp = s.expectedOutcome;
    if (typeof exp === "string" && (exp.includes("10, 20, 30") || exp.includes("150"))) {
      s = { ...s, expectedOutcome: fixArrayLiteralInText(exp) };
      changed = true;
    }
    if (changed) fixCount++;
    return s;
  });
  if (fixCount) report.consistencyFixes += fixCount;
  return out;
}

/** Split "Do X then do Y" into two steps. Returns new steps array. */
function splitCompoundSteps(steps) {
  const result = [];
  for (let i = 0; i < steps.length; i++) {
    const s = steps[i];
    const inst = (s.instruction || "").trim();
    const thenMatch = inst.match(/^(.+?)\s+then\s+(.+)$/i) || inst.match(/^(.+?)\s+and\s+then\s+(.+)$/i);
    if (!thenMatch || thenMatch[1].length < 15 || thenMatch[2].length < 15) {
      result.push(s);
      continue;
    }
    const [_, firstPart, secondPart] = thenMatch;
    const title1 = (s.title || "").slice(0, 50);
    const title2 = secondPart.slice(0, 45).replace(/\.$/, "");
    result.push({
      ...s,
      instruction: firstPart.trim(),
      title: title1 || s.title,
    });
    result.push({
      ...s,
      id: `step${result.length + 1}_split`,
      phase: "",
      title: title2 || "Next step",
      instruction: secondPart.trim(),
      seedCode: s.seedCode,
      expectedOutcome: "",
      successCriteria: ["Complete the step as instructed."],
      feedbackCorrect: "Great! Step completed.",
      feedbackPartial: "Review the instruction and try again.",
      feedbackWrong: "Check the instruction and try again.",
      evaluation: s.evaluation,
    });
    report.stepsSplit++;
  }
  return result;
}

/**
 * From step 2 onward: replace leading `// Import React…` placeholders with real imports when the seed uses hooks or React.* types.
 * Step 0 stays the learner import exercise.
 */
function materializeReactPlaceholderImportsAfterStepOne(steps) {
  const stringRules = [
    {
      re: /^(\s*)\/\/\s*Import React,\s*useState,\s*and\s*useRef from 'react'\s*\r?\n?/i,
      test: (s) => /useState|useRef/.test(s),
      replace: "$1import React, { useState, useRef } from 'react';\n",
    },
    {
      re: /^(\s*)\/\/\s*Import React and useState from 'react'\s*\r?\n\/\//,
      test: (s) => s.includes("useState"),
      replace: "$1import React, { useState } from 'react';\n//",
    },
    {
      re: /^(\s*)\/\/\s*Import React and useState from 'react'\s*\r?\n/,
      test: (s) => s.includes("useState"),
      replace: "$1import React, { useState } from 'react';\n",
    },
    {
      re: /^(\s*)\/\/\s*Import React and useState here\s*\r?\n/,
      test: (s) => s.includes("useState"),
      replace: "$1import React, { useState } from 'react';\n",
    },
    {
      re: /^(\s*)\/\/\s*Import React and ReactNode from 'react'\s*\r?\n/,
      test: (s) => /ReactNode|children:/.test(s),
      replace: "$1import React, { ReactNode } from 'react';\n",
    },
  ];

  for (let i = 1; i < steps.length; i++) {
    let seed = steps[i].seedCode;
    if (typeof seed !== "string") continue;

    let newSeed = seed;
    for (const rule of stringRules) {
      if (!rule.test(newSeed)) continue;
      if (!rule.re.test(newSeed)) continue;
      const next = newSeed.replace(rule.re, rule.replace);
      if (next !== newSeed) {
        newSeed = next;
        report.reactImportsMaterialized++;
        break;
      }
    }

    if (newSeed === seed && /^(\s*)\/\/\s*Import React and TypeScript types here\s*\r?\n/.test(seed)) {
      if (seedNeedsReactNamespace(seed) || hooksUsedInSeed(seed).length > 0) {
        const hooks = hooksUsedInSeed(seed);
        const line =
          hooks.length > 0
            ? `import React, { ${hooks.sort().join(", ")} } from 'react';\n`
            : `import React from 'react';\n`;
        const next = seed.replace(/^(\s*)\/\/\s*Import React and TypeScript types here\s*\r?\n/, (_, indent) => indent + line);
        if (next !== seed) {
          newSeed = next;
          report.reactImportsMaterialized++;
        }
      }
    }

    if (newSeed === seed && /^(\s*)\/\/\s*Import React and ColumnDef type here\s*\r?\n/.test(seed)) {
      if (/@tanstack\/react-table|ColumnDef/.test(seed)) {
        const after = seed.replace(/^(\s*)\/\/\s*Import React and ColumnDef type here\s*\r?\n/, "");
        const firstLine = (after.trimStart().split(/\r?\n/)[0] || "").trim();
        if (!/^import\s/i.test(firstLine)) {
          const next = seed.replace(
            /^(\s*)\/\/\s*Import React and ColumnDef type here\s*\r?\n/,
            "$1import React from 'react';\nimport { ColumnDef } from '@tanstack/react-table';\n\n"
          );
          if (next !== seed) {
            newSeed = next;
            report.reactImportsMaterialized++;
          }
        }
      }
    }

    if (newSeed !== seed) steps[i] = { ...steps[i], seedCode: newSeed };
  }
}

/** Check dependencies and prepend missing React imports for React / JS / TS lesson tracks. */
function checkAndFixDependencies(config, steps, filePath) {
  const track = (config && config.track) || "";
  const canAutoPrepend =
    track === "react-js" ||
    track === "react-ts" ||
    track === "js" ||
    track === "ts" ||
    track === "vue";
  const hooks = REACT_HOOK_NAMES;
  for (let i = 0; i < steps.length; i++) {
    const rawSeed = seedText(steps[i].seedCode || "");
    const seed = rawSeed.replace(/\/\/[^\n]*/g, "").replace(/\/\*[\s\S]*?\*\//g, "");
    const used = hooks.filter((h) => seed.includes(h));
    if (used.length === 0) continue;
    const priorAndCurrent = steps.slice(0, i + 1);
    const missing = used.filter(
      (hook) =>
        !priorAndCurrent.some((st) => {
          const txt = seedText(st.seedCode || "");
          return txt.includes("import") && txt.includes(hook);
        })
    );
    if (missing.length === 0) continue;
    report.dependencyIssues.push({
      file: path.relative(rootDir, filePath),
      step: i + 1,
      stepId: steps[i].id,
      hook: missing[0],
    });
    if (canAutoPrepend && typeof steps[i].seedCode === "string" && steps[i].seedCode && !steps[i].seedCode.trimStart().startsWith("import")) {
      const importLine = defaultImportFor(used);
      steps[i].seedCode = importLine + "\n\n" + (steps[i].seedCode || "").trimStart();
      report.importsPrepended++;
    }
  }
}

function qualityPassOne(filePath) {
  let raw;
  try {
    raw = fs.readFileSync(filePath, "utf8");
  } catch (e) {
    report.issues.push({ file: filePath, error: e.message });
    return false;
  }
  let data;
  try {
    data = JSON.parse(raw);
  } catch (e) {
    report.issues.push({ file: filePath, error: "Invalid JSON: " + e.message });
    return false;
  }
  const config = data.config ?? data;
  if (!config || !Array.isArray(config.steps) || config.steps.length === 0) return false;

  let steps = config.steps;

  steps = applyConsistencyFixes(steps);
  steps = splitCompoundSteps(steps);
  steps = renumberSteps(steps);
  materializeReactPlaceholderImportsAfterStepOne(steps);
  checkAndFixDependencies(config, steps, filePath);

  config.steps = steps;
  config.sideItems = buildSideItems(steps);

  const newRaw = JSON.stringify(data, null, 2);
  const modified = newRaw !== raw;
  if (modified) report.modified++;

  if (!DRY_RUN) {
    try {
      fs.writeFileSync(filePath, newRaw, "utf8");
    } catch (e) {
      report.issues.push({ file: filePath, error: "Write: " + e.message });
      return false;
    }
  }
  return true;
}

function main() {
  const allFiles = collectFiles();
  let files = allFiles;
  if (FROM_INDEX > 0 || LIMIT != null)
    files = allFiles.slice(FROM_INDEX, LIMIT != null ? FROM_INDEX + LIMIT : undefined);

  console.log("Quality pass: consistency, split compound steps, dependency check, React seed materialization");
  if (DRY_RUN) console.log("DRY_RUN=1 — no files will be written\n");
  console.log(`Files: ${files.length}\n`);

  const start = Date.now();
  for (let i = 0; i < files.length; i++) {
    report.processed++;
    const ok = qualityPassOne(files[i]);
    if ((i + 1) % 100 === 0 || !ok)
      console.log(`[${i + 1}/${files.length}] ${ok ? "ok" : "FAIL"} ${path.relative(rootDir, files[i])}`);
  }
  const elapsed = ((Date.now() - start) / 1000).toFixed(1);
  console.log(`\nDone in ${elapsed}s. Processed: ${report.processed}, Modified: ${report.modified}`);
  console.log(`Consistency fixes: ${report.consistencyFixes}, Steps split: ${report.stepsSplit}, Imports prepended: ${report.importsPrepended}, React import materialized (step 2+): ${report.reactImportsMaterialized}`);
  console.log(`Dependency issues (remaining): ${report.dependencyIssues.length}`);
  if (report.dependencyIssues.length > 0 && report.dependencyIssues.length <= 30) {
    report.dependencyIssues.forEach((d) => console.log(`  ${d.file} step ${d.step} missing ${d.hook} import`));
  }
  if (report.issues.length) {
    console.log(`Errors: ${report.issues.length}`);
    report.issues.forEach((i) => console.log(`  ${i.file}: ${i.error}`));
  }
  const reportPath = path.join(rootDir, "quality-pass-report.json");
  fs.writeFileSync(reportPath, JSON.stringify({ ...report, elapsed: Number(elapsed) }, null, 2), "utf8");
  console.log(`Report: ${reportPath}`);

  if (CI_CHECK && (report.modified > 0 || report.dependencyIssues.length > 0)) {
    console.error(
      "\n--ci: content lessons need a quality pass (modified files or hook/import issues). Run: node scripts/quality-pass-content-lessons.js"
    );
    process.exit(1);
  }
}

main();
