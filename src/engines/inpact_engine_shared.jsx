import { useState, useEffect, useMemo, useCallback, useContext, useRef } from "react";
import { createPortal } from "react-dom";
import CodeEditor from "./CodeEditor";
import MultiFileEditor from "./MultiFileEditor";
import { LessonValidationContext } from "../ai-lessons/lessonValidationContext.jsx";
import { fetchLessonCodeValidation } from "../ai-lessons/clientLessonValidation.js";
import { fetchFeedbackAnnotate } from "../ai-lessons/clientFeedbackAnnotate.js";
import { lessonApiUrl } from "../ai-lessons/lessonApiUrl.js";
import CssTabsEditor from "./css/CssTabsEditor";
import AngularTabbedEditor from "./angular/AngularTabbedEditor";
import { mergeAngularTsWithHtml, mergeAngularCssIntoTS, splitAngularSeed } from "./angular/angularTabMerge.js";
import LessonEditorOutputTabs from "./LessonEditorOutputTabs";
import InterfaceTour from "./InterfaceTour";
import RichLearnerText from "./RichLearnerText";
import { inferReactTsAnalogousExample } from "./reactTsAnalogousExamples.js";
import { mergeSnippetIntoEmptyReactExportDefaultBody } from "./mergeReactExampleSnippet.js";
import { fetchStepExample } from "../ai-lessons/fetchStepExample.js";
import { SNIPPET_PACK_OPTIONS_REACT_JS, SNIPPET_PACK_OPTIONS_REACT_TS } from "./monacoReactSnippetPacks.js";
import SnippetPackMultiselect from "./SnippetPackMultiselect.jsx";

/** Persisted preference for lesson step rail (left sidebar) visibility. */
const LESSON_SIDEBAR_COLLAPSED_KEY = "inpact-lesson-sidebar-collapsed";

/** React · TS lesson 1 intro: full interface tour vs. recap (final step only). */
const LESSON1_INTERFACE_TOUR_PREF_KEY = "inpact.reactTs.lesson1.interfaceTourPref";

function readLesson1InterfaceTourPref() {
  if (typeof window === "undefined") return "";
  try {
    return window.localStorage.getItem(LESSON1_INTERFACE_TOUR_PREF_KEY) || "";
  } catch {
    return "";
  }
}

function writeLesson1InterfaceTourPref(value) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(LESSON1_INTERFACE_TOUR_PREF_KEY, value);
  } catch {
    /* ignore */
  }
}

if (typeof document !== "undefined" && !document.getElementById("dm-sans-font")) {
  const link = document.createElement("link");
  link.id = "dm-sans-font";
  link.rel = "stylesheet";
  link.href = "https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&display=swap";
  document.head.appendChild(link);
}

/** Build JSON answer for angular-tabs from step seed (object, merged string, or inline template). */
function seedCodeToAngularTabsAnswer(seed) {
  if (typeof seed === "object" && seed !== null && ("ts" in seed || "html" in seed)) {
    return JSON.stringify({ ts: seed.ts ?? "", html: seed.html ?? "", css: seed.css ?? "" });
  }
  if (typeof seed === "string" && /template\s*:\s*`/.test(seed)) {
    const { tsPart, htmlPart } = splitAngularSeed(seed);
    return JSON.stringify({ ts: tsPart, html: htmlPart, css: "" });
  }
  return JSON.stringify({ ts: typeof seed === "string" ? seed : "", html: "", css: "" });
}

function seedCodeToMultiFileAnswer(seed) {
  if (typeof seed === "object" && seed !== null && !Array.isArray(seed)) {
    const files = Object.fromEntries(
      Object.entries(seed).map(([k, v]) => [String(k), typeof v === "string" ? v : String(v ?? "")])
    );
    const firstFile = Object.keys(files)[0] || "App.tsx";
    return JSON.stringify({ activeFile: firstFile, files });
  }
  return JSON.stringify({ activeFile: "App.tsx", files: { "App.tsx": typeof seed === "string" ? seed : "" } });
}

/** Same file keys/content as seedCodeToMultiFileAnswer — used so first focus clears untouched seed (placeholder behavior). */
function multiFileSeedToPlaceholderByFile(seed) {
  if (typeof seed === "object" && seed !== null && !Array.isArray(seed)) {
    return Object.fromEntries(
      Object.entries(seed).map(([k, v]) => [String(k), typeof v === "string" ? v : String(v ?? "")])
    );
  }
  return { "App.tsx": typeof seed === "string" ? seed : "" };
}

function parseMultiFileAnswer(answer, fallback = "App.tsx") {
  try {
    const p = JSON.parse(answer || "{}");
    const files = p && typeof p.files === "object" ? p.files : {};
    const normalized = Object.fromEntries(
      Object.entries(files).map(([k, v]) => [String(k), typeof v === "string" ? v : String(v ?? "")])
    );
    const activeFile =
      typeof p.activeFile === "string" && Object.prototype.hasOwnProperty.call(normalized, p.activeFile)
        ? p.activeFile
        : Object.keys(normalized)[0] || fallback;
    return { files: normalized, activeFile };
  } catch (_) {
    return { files: { [fallback]: answer || "" }, activeFile: fallback };
  }
}

function mergeMultiFileForValidation(answer) {
  const parsed = parseMultiFileAnswer(answer);
  const entries = Object.entries(parsed.files);
  if (entries.length === 0) return "";
  return entries.map(([name, code]) => `// FILE: ${name}\n${code}`).join("\n\n");
}

function ensureReactJsxScaffoldForStep(node, code, lang) {
  if (typeof code !== "string" || !code.trim()) return code;
  const languageTag = String(lang || node?.language || "").toLowerCase();
  const isReactLike =
    languageTag.includes("react") ||
    languageTag.includes("tsx") ||
    languageTag.includes("jsx") ||
    languageTag.includes("typescript") ||
    languageTag.includes("javascript");
  if (!isReactLike) return code;
  const text = `${node?.paal || ""}\n${node?.hint || ""}\n${node?.expected || ""}`.toLowerCase();
  const needsUiScaffold =
    /\b(jsx|return|render|onclick|onchange|oninput|button|input|form|handler|wire)\b/.test(text);
  if (!needsUiScaffold) return code;
  const alreadyHasJsx = /return\s*\(\s*<[\w]/m.test(code) || /<[A-Za-z][\w-]*[\s>]/.test(code);
  if (alreadyHasJsx) return code;

  const scaffold = text.includes("input")
    ? `  return (\n    <div>\n      <input />\n      <p></p>\n    </div>\n  );\n`
    : `  return (\n    <div>\n      <button></button>\n      <span></span>\n    </div>\n  );\n`;

  const fnMatch = code.match(/export\s+default\s+function\s+\w+\s*\([^)]*\)\s*\{[\s\S]*\}\s*$/m);
  if (!fnMatch) return code;
  const fnBlock = fnMatch[0];
  const insertAt = fnBlock.lastIndexOf("}");
  if (insertAt < 0) return code;
  const updatedFn = `${fnBlock.slice(0, insertAt)}\n${scaffold}${fnBlock.slice(insertAt)}`;
  return code.replace(fnBlock, updatedFn);
}

/**
 * When a question step's editor content comes only from starter/seed (no saved answer, no carry-forward),
 * that string is cleared on first focus if unchanged — same idea as MultiFileEditor's placeholder.
 */
function computeSingleFileSeedPlaceholderBaseline({
  node,
  nodeIndex,
  NODES,
  passedCodeByStepId,
  answerShape,
  language,
}) {
  if (node?.type !== "question") return undefined;
  if (answerShape === "css-tabs" || answerShape === "angular-tabs" || answerShape === "multi-file") {
    return undefined;
  }
  let initialCode = "";
  let loadedFromPassOrCarry = false;
  if (node.id && passedCodeByStepId[node.id]) {
    initialCode = passedCodeByStepId[node.id];
    loadedFromPassOrCarry = true;
  } else {
    for (let i = nodeIndex - 1; i >= 0; i--) {
      const prev = NODES[i];
      if (prev?.type === "question" && prev.id && passedCodeByStepId[prev.id]) {
        initialCode = passedCodeByStepId[prev.id];
        loadedFromPassOrCarry = true;
        break;
      }
    }
    if (initialCode === "") {
      const seed = node.starter_code || node.seed_code || "";
      if (seed) initialCode = seed;
    }
  }
  if (loadedFromPassOrCarry) return undefined;
  if (typeof initialCode !== "string" || !initialCode.trim()) return undefined;
  const afterScaffold = ensureReactJsxScaffoldForStep(node, initialCode, language || node?.language || "");
  return String(afterScaffold).trim() ? afterScaffold : undefined;
}

function getMultiFilePreviewCode(answer) {
  const parsed = parseMultiFileAnswer(answer);
  const names = Object.keys(parsed.files);
  if (names.length === 0) return "";
  const appFile =
    names.find((n) => /^app\.(t|j)sx?$/i.test(n)) ||
    names.find((n) => /^index\.(t|j)sx?$/i.test(n)) ||
    parsed.activeFile;
  return parsed.files[appFile] || "";
}

/** Task text suggests inserting relative to existing structure — pair fragment examples with seed context. */
const PLACEMENT_OR_INSERT_HINT_RE =
  /\b(inside|after|before|next to|beneath|following|within|under|on both|on each|to both|configs?|options?|add\s+`)/i;

function exampleSnippetLooksFragmentary(exampleCode) {
  if (typeof exampleCode !== "string") return false;
  const t = exampleCode.trim();
  if (!t || t.length > 400) return false;
  return t.split("\n").length <= 5;
}

function extractFilenameFromInstruction(text) {
  if (typeof text !== "string") return null;
  const m1 = text.match(/\*\*([\w./-]+\.(?:tsx?|jsx?|css))\*\*/i);
  if (m1) return m1[1];
  const m2 = text.match(/`([^`]+\.(?:tsx?|jsx?|css))`/i);
  if (m2) return m2[1];
  return null;
}

function inferMultiFileSeedKeyForExample(seedObj, paal) {
  const keys = Object.keys(seedObj || {});
  if (!keys.length) return null;
  const fromInstr = extractFilenameFromInstruction(paal);
  if (fromInstr && Object.prototype.hasOwnProperty.call(seedObj, fromInstr)) return fromInstr;
  const lower = (paal || "").toLowerCase();
  if (
    /\b(getposts|getpost|createapi|endpoints|builder\.query|builder\.mutation|reducerpath|fetchbasequery|tagtypes|providestags|invalidatestags)\b/.test(
      lower
    )
  ) {
    const api = keys.find((k) => /^api\./i.test(k));
    if (api) return api;
  }
  return keys.find((k) => /^app\./i.test(k)) || keys[0];
}

function snippetAroundAnchor(seedText, exampleCode, paal) {
  const lines = seedText.split("\n");
  const ex = (exampleCode || "").toLowerCase();
  const p = (paal || "").toLowerCase();
  // tagTypes on createApi: instruction says "next to reducerPath" — show only the top of the
  // config so the analogous example snippet is not separated by the whole endpoints block.
  if (ex.includes("tagtypes") || p.includes("tagtypes")) {
    const rp = lines.findIndex((l) => /reducerpath\s*:/i.test(l));
    if (rp >= 0) {
      const from = Math.max(0, rp - 1);
      const to = Math.min(lines.length, rp + 4);
      return lines.slice(from, to).join("\n");
    }
  }
  let idx = -1;
  if (ex.includes("providestags") || p.includes("providestags")) {
    idx = lines.findIndex((l) => /\bgetposts\b|\bgetpost\b|builder\.query/i.test(l));
  }
  if (idx < 0 && (ex.includes("invalidatestags") || p.includes("invalidates"))) {
    idx = lines.findIndex((l) => /builder\.mutation|addpost|\bmutation\b/i.test(l));
  }
  if (idx < 0 && (ex.includes("reducerpath") || p.includes("reducerpath"))) {
    idx = lines.findIndex((l) => /createapi\s*\(/i.test(l));
  }
  if (idx < 0 && (ex.includes("basequery") || p.includes("basequery"))) {
    idx = lines.findIndex((l) => /createapi\s*\(|reducerpath/i.test(l));
  }
  if (idx < 0 && /\bendpoints\b/.test(p)) {
    idx = lines.findIndex((l) => /\bendpoints\s*:\s*\(/i.test(l));
  }
  if (idx < 0) idx = lines.findIndex((l) => /\bendpoints\s*:\s*\(/i.test(l));
  if (idx < 0) return null;
  const from = Math.max(0, idx - 5);
  const to = Math.min(lines.length, idx + 30);
  return lines.slice(from, to).join("\n");
}

/** Prefix analogousExample / multiline expected with a focused seed excerpt when the step is placement-style or the example is a short fragment. */
function buildExampleWithStarterContext(answerShape, node, baseCode) {
  if (!baseCode || typeof baseCode !== "string") return baseCode;
  const paal = node.paal || "";
  const hint = node.hint || "";
  const ctxText = `${paal}\n${hint}`;
  // Learners want the pattern, not the whole "code built so far" copied above.
  // Only include surrounding starter when we explicitly have placement/insert wording.
  const wantsContext = PLACEMENT_OR_INSERT_HINT_RE.test(ctxText);
  if (!wantsContext) return baseCode;
  const seed = node.seed_code;
  if (answerShape === "multi-file" && seed && typeof seed === "object" && !Array.isArray(seed)) {
    const key = inferMultiFileSeedKeyForExample(seed, paal);
    const seedText = key ? String(seed[key] ?? "") : "";
    if (!seedText.trim()) return baseCode;
    let snippet = snippetAroundAnchor(seedText, baseCode, paal);
    if (!snippet) {
      const max = 1600;
      snippet = (seedText.length > max ? `// …\n${seedText.slice(-max)}` : seedText).trim() || seedText;
    }
    return `// File: ${key} — surrounding starter (edit your file to match the task)\n${snippet}\n\n${baseCode.trim()}`;
  }
  if (answerShape !== "multi-file" && typeof seed === "string" && seed.trim()) {
    const merged = mergeSnippetIntoEmptyReactExportDefaultBody(seed, baseCode);
    if (merged) return merged;
    let snippet = snippetAroundAnchor(seed, baseCode, paal);
    if (!snippet) {
      const max = 1600;
      snippet = seed.length > max ? `// …\n${seed.slice(-max)}` : seed;
    }
    return `// Surrounding starter\n${snippet}\n\n${baseCode.trim()}`;
  }
  return baseCode;
}

function stripAnalogousHeadingComment(code) {
  if (typeof code !== "string") return code;
  const lines = code.split("\n");
  const filtered = lines.filter((l) => !/^\s*\/\/\s*Analogous example\s*:?\s*$/i.test(l));
  return filtered.join("\n").trim();
}

function stripToRelevantToggleFunction(node, code) {
  if (typeof code !== "string" || !code.trim()) return code;

  const paal = String(node?.paal || "");
  const hint = String(node?.hint || "");
  const expected = String(node?.expected || "");
  const text = `${paal}\n${hint}\n${expected}`.toLowerCase();

  // Only do this for steps that are asking for a toggle/flip function,
  // and explicitly avoid wiring events yet.
  const looksLikeToggleTask = /\b(toggle|flip|visibility|visible|shown)\b/.test(text) && /=>/.test(text);
  const mentionsNoOnClickYet =
    /\b(do\s*not|without|no)\b[\s\S]{0,120}\bon(click)?\b/.test(text) ||
    /\b(next\s*step|wire)\b/.test(text);
  if (!looksLikeToggleTask || !mentionsNoOnClickYet) return code;

  // Prefer extracting a `const xxx = () => setY(...prev => !prev...)` line.
  const mConst = code.match(
    /(^|\n)(const\s+[A-Za-z_$][\w$]*\s*=\s*\(\)\s*=>\s*set[A-Za-z_$][\w$]*\(\s*\(?[A-Za-z_$][\w$]*\)?\s*=>\s*![A-Za-z_$][\w$]*\s*\)\s*;?\s*)/m
  );
  if (mConst && mConst[2]) return mConst[2].trim();

  // Fallback: extract a `function foo(...) { ... setX(... => !...) ... }` block.
  const mFn = code.match(
    /(function\s+[A-Za-z_$][\w$]*\s*\([^)]*\)\s*\{\s*[\s\S]*?\bset[A-Za-z_$][\w$]*\([\s\S]*?=>[\s\S]*?![\s\S]*?\)\s*;?[\s\S]*?\})/m
  );
  if (mFn && mFn[1]) return mFn[1].trim();

  return code;
}

/** Synchronous example resolution + whether to hit /api/lessons/step-example first (React TS, no curated snippet). */
function resolveQuestionStepExample(answerShape, node, shortName) {
  if (node?.type !== "question") {
    return { primarySyncEntry: null, localFallbackEntry: null, preferServerFetch: false };
  }
  const isReactTsTrack = typeof shortName === "string" && /^\s*TS\s+[—-]/i.test(shortName);
  let primarySyncEntry = null;

  function looksLikeCodeSnippet(exampleCode) {
    if (typeof exampleCode !== "string") return false;
    const t = exampleCode.trim();
    if (!t) return false;
    const lowered = t.toLowerCase();
    // Heuristic reject: common natural-language lead-ins from analogies.
    if (/^like\s+/i.test(t) || /^example[:\s]/i.test(lowered) || /^before\s+/i.test(lowered)) return false;
    // Accept if it contains typical code tokens.
    return (
      (/\bimport\b/.test(t) && /\bfrom\b/.test(t)) ||
      /\bconst\b/.test(t) ||
      /\bfunction\b/.test(t) ||
      /\blet\b/.test(t) ||
      /\bvar\b/.test(t) ||
      /\breturn\b/.test(t) ||
      /\buseState\b/.test(t) ||
      /\bonClick\b/.test(t) ||
      /\bonChange\b/.test(t) ||
      /\binterface\b/.test(t) ||
      /\bclass\b/.test(t) ||
      /\btype\s+[A-Za-z_$][\w$]*\s*=/.test(t) ||
      /\bstruct\b/.test(t) ||
      /\bwhile\s*\(/.test(t) ||
      /\bfor\s*\(/.test(t) ||
      /=>/.test(t) ||
      /<\s*[A-Za-z]/.test(t) ||
      /\bReact\./.test(t) ||
      /:\s*React\./.test(t) ||
      // Framework-agnostic algorithm snippets (linked lists, nodes, pseudocode shapes)
      /\bListNode\b/.test(t) ||
      /\bTreeNode\b/.test(t) ||
      /\{\s*value\s*:/.test(t) ||
      /\{\s*val\s*:/.test(t) ||
      /\bnext\s*:\s*/.test(t) ||
      /\|\s*null/.test(t)
    );
  }

  const taskTextForExample = `${node?.paal || ""}\n${node?.hint || ""}\n${node?.expected || ""}\n${node?.think_prompt || ""}\n${node?.instruction || ""}`
    .toLowerCase();
  // For import-focused steps, skip generic `example_code` as primary so learners don't see the
  // exact required import line — unless the lesson engine sets `analogousExample` / `analog_example`.
  const isImportFocusedTask = /\bimport\b/.test(taskTextForExample) && /\breact\b/.test(taskTextForExample);

  const engineAnalogousExample =
    (typeof node.analogousExample === "string" && node.analogousExample.trim()) ||
    (typeof node.analog_example === "string" && node.analog_example.trim()) ||
    "";

  const curatedRaw =
    (typeof node.ai_example_code === "string" && node.ai_example_code.trim()) ||
    (typeof node.analogousExample === "string" && node.analogousExample.trim()) ||
    (typeof node.analog_example === "string" && node.analog_example.trim()) ||
    (typeof node.example_code === "string" && node.example_code.trim()) ||
    "";

  function applyPrimaryFromBase(base) {
    const wrapped = buildExampleWithStarterContext(answerShape, node, base);
    const meta = node.ai_example_meta;
    const deepseekMerge =
      meta &&
      typeof meta === "object" &&
      meta.exampleOrigin === "deepseek" &&
      typeof meta.fetchedAfter === "string";
    const label = deepseekMerge
      ? "EXAMPLE"
      : wrapped !== base
        ? "EXAMPLE (starter context + pattern — adapt to your code)"
        : "EXAMPLE (similar pattern — not the exact answer)";
    primarySyncEntry = {
      label,
      code: stripToRelevantToggleFunction(node, stripAnalogousHeadingComment(wrapped)),
    };
  }

  // Import-focused: only accept curated snippet when it comes from the engine's explicit analogous field.
  if (isImportFocusedTask && engineAnalogousExample && looksLikeCodeSnippet(engineAnalogousExample)) {
    applyPrimaryFromBase(engineAnalogousExample);
  } else if (!isImportFocusedTask && curatedRaw && looksLikeCodeSnippet(curatedRaw)) {
    applyPrimaryFromBase(curatedRaw);
  }

  let localFallbackEntry = null;
  if (isReactTsTrack) {
    const inferred = inferReactTsAnalogousExample(node);
    if (inferred) {
      const wrapped = buildExampleWithStarterContext(answerShape, node, inferred);
      localFallbackEntry = {
        label:
          wrapped !== inferred
            ? "EXAMPLE (starter context + pattern — adapt to your code)"
            : "EXAMPLE (similar pattern — not the exact answer)",
        code: stripAnalogousHeadingComment(wrapped),
      };
    }
  }
  if (!localFallbackEntry && typeof node.seed_code === "string" && node.seed_code.trim()) {
    localFallbackEntry = {
      label: "EXAMPLE",
      code: stripToRelevantToggleFunction(node, stripAnalogousHeadingComment(node.seed_code)),
    };
  }

  const preferServerFetch =
    isReactTsTrack &&
    !primarySyncEntry &&
    !!(node.paal && String(node.paal).trim());

  return { primarySyncEntry, localFallbackEntry, preferServerFetch };
}

function evaluate(node, answer) {
  if (node.evaluate) return node.evaluate(answer);
  const raw = String(answer || "");
  const lower = raw.toLowerCase().replace(/\s/g, "");
  const identifierWhitelist = new Set([
    "usestate",
    "useeffect",
    "useref",
    "onclick",
    "onchange",
    "return",
    "button",
    "input",
    "export",
    "default",
    "div",
    "span",
    "p",
    "map",
    "length",
    "target",
    "value",
    "string",
    "number",
    "boolean",
  ]);
  const isIdentifierOnly = (kw) => /^[a-zA-Z_$][\w$]*$/.test(kw);
  const keywordSatisfied = (kw) => {
    const k = String(kw || "").toLowerCase().replace(/\s/g, "");
    if (!k) return true;
    if (k.includes("onclick")) return /onClick\s*=\s*\{/.test(raw);
    if (k.includes("onchange")) return /onChange\s*=\s*\{/.test(raw);
    if (k.includes("usestate<string>")) return /useState\s*<\s*string\s*>/i.test(raw);
    if (k.includes("usestate<number>")) {
      // If the keyword also specifies an initial `0`, check both generic + initializer.
      if (k.includes("(0") || k.includes("0)")) return /useState\s*<\s*number\s*>\s*\(\s*0\s*\)/i.test(raw);
      return /useState\s*<\s*number\s*>/i.test(raw);
    }
    if (k.includes("usestate<boolean>")) return /useState\s*<\s*boolean\s*>/i.test(raw);
    if (k.includes("react.changeevent<input")) return /React\.ChangeEvent\s*<\s*HTMLInputElement\s*>/i.test(raw);
    // Lesson copy often used literal `{value}`; learners may use input, caption, etc. Accept any `{...}` in <p>.
    if (k === "{value}") return /<p\b[^>]*>[\s\S]*\{[^}]+\}/.test(raw);
    if (isIdentifierOnly(k) && !identifierWhitelist.has(k)) return true; // never force learner naming
    return lower.includes(k);
  };
  const keywords = node.answer_keywords || [];
  const hits = keywords.filter((kw) => keywordSatisfied(kw));
  const ratio = keywords.length ? hits.length / keywords.length : 0;
  if (ratio >= 0.8) return "correct";
  if (ratio >= 0.5) return "partial";
  return "wrong";
}

function stripCodeLikeFragments(text) {
  if (typeof text !== "string") return "";
  let t = text;
  t = t.replace(/```[\s\S]*?```/g, "");
  t = t.replace(/`[^`]*`/g, "the relevant part");
  // JSX/HTML tags only — do not strip TypeScript generics like React.ChangeEvent<HTMLInputElement>
  t = t.replace(/<\/?[a-z][a-z0-9]*\b[^>]*>/gi, "a UI element");
  t = t.replace(/\b(import|export|const|let|var|function|return|class)\b/gi, "");
  t = t.replace(/\b(useState|useEffect|useRef|onClick|set[A-Z]\w*)\b/g, "the required pattern");
  t = t.replace(/\bonChange\b/g, "the change handler");
  t = t.replace(/\[[^\]]*\]|\{[^}]*\}|\([^)]*\)/g, "");
  t = t.replace(/[=;<>]/g, " ");
  if (
    /(\bconst\b|\bimport\b|\breturn\b|=>|\{|\}|;|<|>|\(|\)|\[[^\]]*\])/.test(t) ||
    /\buseState\b/i.test(text)
  ) {
    // If still code-like, drop it fully.
    t = "";
  }
  t = t.replace(/\s+/g, " ").trim();
  return t;
}

function buildHintOnlyGuidance(node) {
  const task = stripCodeLikeFragments(node?.paal || "");
  const hint = stripCodeLikeFragments(node?.hint || "");
  const parts = [];
  if (task) parts.push(`Task focus: ${task}`);
  if (hint) parts.push(`Guidance: ${hint}`);
  if (parts.length === 0) parts.push("Review the task requirements, then validate your solution step-by-step.");
  return parts.join("\n\n");
}

function buildFeedbackOnlyGuidance(text) {
  const raw = String(text || "").trim();
  const cleaned = stripCodeLikeFragments(raw);
  if (cleaned) return `Feedback: ${cleaned}`;
  // Code-heavy AI feedback strips to empty — still show the real message for RichLearnerText + annotate.
  if (raw) return raw;
  return "Feedback: review the task requirements, verify behavior step-by-step, and ensure type correctness.";
}

function buildAnalogousExample(node, fallbackCode = "") {
  const text = `${node?.paal || ""}\n${node?.hint || ""}\n${node?.expected || ""}`.toLowerCase();
  const taskFull = `${node?.paal || ""}\n${node?.hint || ""}\n${node?.expected || ""}\n${node?.think_prompt || ""}`.toLowerCase();
  const looksReactUiStep =
    /\busestate\b/.test(taskFull) ||
    /\bjsx\b/.test(taskFull) ||
    /\bonclick\b/.test(taskFull) ||
    /\bonchange\b/.test(taskFull) ||
    /<\s*[a-z]/.test(taskFull);
  const looksAlgoLinkedList =
    !looksReactUiStep &&
    (/\blinked\s*list\b/.test(taskFull) ||
      /\blist\s*node\b/.test(taskFull) ||
      (/\bnode\b/.test(taskFull) && /\bnext\b/.test(taskFull) && /\bcarry\b/.test(taskFull)) ||
      (/\bdummy\b/.test(taskFull) && /\bcarry\b/.test(taskFull)));
  // Framework-agnostic linked-list addition pattern (no React); used when fallback is empty.
  if (looksAlgoLinkedList) {
    if (/\bnode\s*model\b|\bdefine\s+the\s+node\b|\bvalue\s+field\b.*\bnext\b/.test(taskFull)) {
      return `// Analogous node shape (adapt names to your language)
class ListNode {
  constructor(val, next = null) {
    this.val = val;
    this.next = next;
  }
}`;
    }
    if (
      (/\bdummy\b/.test(taskFull) || /\bconstruct\b.*\bpointer/.test(taskFull) || /\btail\b/.test(taskFull)) &&
      /carry/.test(taskFull)
    ) {
      return `const dummy = new ListNode(0);
let tail = dummy;
let carry = 0;`;
    }
    if (/%|modulo|floor|carry|digit/.test(taskFull) && /sum|add/.test(taskFull)) {
      return `const sum = a + b + carry;
const digit = sum % 10;
carry = Math.floor(sum / 10);`;
    }
    if (/append|\.next\s*=|tail\s*=/.test(taskFull)) {
      return `tail.next = new ListNode(digit);
tail = tail.next;`;
    }
    if (/loop|while|until|either\s+list|dummy\.next/.test(taskFull)) {
      return `while (p !== null || q !== null || carry !== 0) {
  // read digits, build sum, append node, advance
}
return dummy.next;`;
    }
    if (/test|\[9,9\]|validate/.test(taskFull)) {
      return `// Example assertion shape (adapt to your test runner)
// add([9,9], [1]) -> [0,0,1]`;
    }
    return `// Carry-and-pointer pattern (language-agnostic)
// 1) dummy head + tail + carry
// 2) while lists or carry remain: sum digits + carry, append digit node
// 3) return dummy.next`;
  }
  // Prefer resolved lesson snippet (curated example_code / server merge) before generic heuristics.
  if (typeof fallbackCode === "string" && fallbackCode.trim()) {
    return fallbackCode.trim();
  }
  // Word-boundary regex checks to avoid false triggers like "ControlledInput"
  // matching both "input" and "controlled" via substring `includes()`.
  const hasOnChange = /\bonchange\b/.test(text) || /\bonchange\s*=\s*\{/.test(text);
  const hasControlledInputPhrase = /\bcontrolled\s+input\b/.test(text);
  const hasStandaloneInputWord = /\binput\b/.test(text);
  if (
    text.includes("functional update") ||
    (/\bincrement\b/.test(text) && /\bdecrement\b/.test(text)) ||
    (/\bsetcount\b/.test(text) && /\bprev\b/.test(text))
  ) {
    return `// Analogous pattern (not your exact answer)
const [value, setValue] = useState<number>(1);

const double = () => {
  setValue((prev) => prev * 2);
};

const halve = () => {
  setValue((prev) => Math.max(0, Math.floor(prev / 2)));
};`;
  }
  if (hasStandaloneInputWord && (hasOnChange || hasControlledInputPhrase)) {
    if (/\bparagraph\b/.test(text) || /\bdisplay\s+the\s+current\b/.test(text) || /\bbelow\s+to\s+display\b/.test(text)) {
      return `// Analogous pattern (not your exact answer)
const [label, setLabel] = useState<string>("");

const handleLabelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  setLabel(e.target.value);
};

return (
  <div>
    <input value={label} onChange={handleLabelChange} />
    <p>Current: {label}</p>
  </div>
);`;
    }
    return `// Analogous pattern (not your exact answer)
const [query, setQuery] = useState<string>("");

const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  setQuery(e.target.value);
};`;
  }
  // Last resort: avoid React-specific bullets when the step is not a UI lesson.
  if (!looksReactUiStep) {
    return `// Analogous pattern (sketch the idea; use your own identifiers)
// 1) model the data structure your algorithm needs
// 2) initialize loop state (pointers, accumulators)
// 3) update state each iteration until termination
// 4) return or validate the result`;
  }
  return `// Analogous pattern
// 1) define typed state
// 2) define handler with clear intent
// 3) wire handler in JSX`;
}

function pickDefaultLanguageOption(languagePickerOptions, languageFromConfig) {
  if (!languagePickerOptions?.length) return null;
  const tag = String(languageFromConfig || "typescript").toLowerCase();
  return (
    languagePickerOptions.find((o) => o.id === tag) ||
    languagePickerOptions.find((o) => tag === o.monacoLanguage) ||
    languagePickerOptions[0]
  );
}

export default function createINPACTEngine(config) {
  const {
    NODES,
    sideItems,
    lessonNum,
    title,
    shortName,
    language,
    getOutputPreview,
    answerShape,
    defaultHtml,
    lessonIntro: configLessonIntro,
    lessonObjectives: configLessonObjectives,
    intro: configIntro,
    objectives: configObjectives,
    onValidateCode: configOnValidateCode,
    onAskMentor,
    validateWithAI = true,
    codeValidationProfile,
    languagePickerOptions = null,
  } = config;
  const lessonIntro = configLessonIntro ?? configIntro ?? null;
  const lessonObjectives = configLessonObjectives ?? (Array.isArray(configObjectives) ? configObjectives : null);
  const pad = String(lessonNum).padStart(2, "0");

  return function INPACTEngine({ onNextLesson, onLessonComplete }) {
    const [nodeIndex, setNodeIndex] = useState(0);
    const [answer, setAnswer] = useState("");
    const [mainTab, setMainTab] = useState("lesson");
    const [editorWorkspaceOpen, setEditorWorkspaceOpen] = useState(false);
    const [result, setResult] = useState(null);
    const [attempts, setAttempts] = useState(0);
    const [showHint, setShowHint] = useState(false);
    const [showTaskModal, setShowTaskModal] = useState(false);
    const [thinkSelection, setThinkSelection] = useState(null);
    const [showExampleModal, setShowExampleModal] = useState(false);
    const [exampleModalPayload, setExampleModalPayload] = useState(null);
    const [exampleModalLoading, setExampleModalLoading] = useState(false);
    const [exampleModalFetchError, setExampleModalFetchError] = useState(null);
    const [exampleModalOffset, setExampleModalOffset] = useState({ x: 0, y: 0 });
    const [exampleModalDragging, setExampleModalDragging] = useState(false);
    const exampleModalDragRef = useRef(null);
    const [feedbackModalOffset, setFeedbackModalOffset] = useState({ x: 0, y: 0 });
    const [feedbackModalDragging, setFeedbackModalDragging] = useState(false);
    const feedbackModalDragRef = useRef(null);
    const [showFeedbackModal, setShowFeedbackModal] = useState(false);
    const [taskInstructionPulseNonce, setTaskInstructionPulseNonce] = useState(0);
    const [showMentorModal, setShowMentorModal] = useState(false);
    const [mentorDraft, setMentorDraft] = useState("");
    /** Multi-turn mentor chat for this step: { role: 'user' | 'assistant', content: string } */
    const [mentorThread, setMentorThread] = useState([]);
    const [mentorLoading, setMentorLoading] = useState(false);
    const [mentorError, setMentorError] = useState("");
    const [checking, setChecking] = useState(false);
    const [feedbackAnnotateLoading, setFeedbackAnnotateLoading] = useState(false);
    const [feedbackAnnotateError, setFeedbackAnnotateError] = useState("");
    const [feedbackAnnotatedCode, setFeedbackAnnotatedCode] = useState(null);
    const [languagePickerChoice, setLanguagePickerChoice] = useState(() =>
      pickDefaultLanguageOption(languagePickerOptions, language)
    );
    const [tourLaunchNonce, setTourLaunchNonce] = useState(0);
    /** While the interface tour is open, suppress the think/task gate modal so tour targets remain interactive. */
    const [interfaceTourOpen, setInterfaceTourOpen] = useState(false);
    /** Starting step for the next forced tour launch (React · TS lesson 1 recap vs. full walkthrough). */
    const [lesson1TourStartIndex, setLesson1TourStartIndex] = useState(0);
    const [lesson1TourPrefSnapshot, setLesson1TourPrefSnapshot] = useState("");
    const lesson1IntroTourFiredRef = useRef(false);
    /** When the interface tour jumps to the first question node, skip one auto-open of the think/task modal. */
    const skipAutoTaskModalOnceRef = useRef(false);
    const feedbackModalPrimaryBtnRef = useRef(null);
    const mainScrollRef = useRef(null);
    const [completedNodes, setCompletedNodes] = useState([]);
    const [passedCodeByStepId, setPassedCodeByStepId] = useState({});
    const [aiFeedback, setAiFeedback] = useState("");
    const [validationFallbackNote, setValidationFallbackNote] = useState("");
    /** Multi-file focus-clear baseline for the first question step only (matches that step's `initialCode`). Later steps never clear on focus. */
    const [multiFileFocusBaseline, setMultiFileFocusBaseline] = useState(null);
    const [monacoSnippetPacks, setMonacoSnippetPacks] = useState([]);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
      try {
        return typeof localStorage !== "undefined" && localStorage.getItem(LESSON_SIDEBAR_COLLAPSED_KEY) === "true";
      } catch {
        return false;
      }
    });
    const lessonValidationCtx = useContext(LessonValidationContext);
    /** Non-empty only — `""` is truthy enough to kill `??` fallback yet still fails `=== "react-ts"` and blocked the L1 tour. */
    const lessonCtxTrack =
      typeof lessonValidationCtx?.track === "string" && lessonValidationCtx.track.trim() !== ""
        ? lessonValidationCtx.track.trim()
        : undefined;
    /** When the engine runs outside `LessonValidationContext` (e.g. some embeds), infer React · TS lesson 1 for tour gating only. */
    const inferredReactTsLesson1 =
      Number(lessonNum) === 1 &&
      !lessonCtxTrack &&
      (String(language || "").toLowerCase().includes("typescript") ||
        /jsx|react|shipment|tsx|typescript/i.test(`${title || ""} ${shortName || ""}`));
    const effectiveTourTrack = lessonCtxTrack ?? (inferredReactTsLesson1 ? "react-ts" : undefined);
    const node = NODES[nodeIndex];
    /** Mount tab chrome on intro/objectives so lesson-1 interface tour targets exist before the first coding step. */
    const useReactTsLesson1TabsShell = useMemo(
      () =>
        effectiveTourTrack === "react-ts" &&
        Number(lessonNum) === 1 &&
        (node?.type === "reveal" || node?.type === "objectives"),
      [effectiveTourTrack, lessonNum, node?.type]
    );
    const firstQuestionNodeIndex = useMemo(() => NODES.findIndex((n) => n?.type === "question"), [NODES]);
    const hasEngineIntroReveal = useMemo(
      () => NODES.some((n) => n?.id === "intro" && n?.type === "reveal"),
      [NODES]
    );
    /** Lesson 1 Lesson/Objectives screens (before first coding step) — auto interface tour entry. */
    const isReactTsLesson1PreQuestion = useMemo(
      () =>
        effectiveTourTrack === "react-ts" &&
        Number(lessonNum) === 1 &&
        firstQuestionNodeIndex > 0 &&
        nodeIndex < firstQuestionNodeIndex &&
        (node?.type === "reveal" || node?.type === "objectives"),
      [effectiveTourTrack, lessonNum, firstQuestionNodeIndex, nodeIndex, node?.type]
    );
    /** Static lesson: intro/objectives. AI dynamic lesson (no intro node): first question step after AI overview. */
    const isReactTsLesson1TourEntry = useMemo(
      () =>
        effectiveTourTrack === "react-ts" &&
        Number(lessonNum) === 1 &&
        (isReactTsLesson1PreQuestion ||
          (!hasEngineIntroReveal &&
            firstQuestionNodeIndex >= 0 &&
            nodeIndex === firstQuestionNodeIndex &&
            node?.type === "question")),
      [
        effectiveTourTrack,
        lessonNum,
        isReactTsLesson1PreQuestion,
        hasEngineIntroReveal,
        firstQuestionNodeIndex,
        nodeIndex,
        node?.type,
      ]
    );
    const editorMonacoLanguage = useMemo(
      () => languagePickerChoice?.monacoLanguage || language || node?.language || "javascript",
      [languagePickerChoice, language, node?.language]
    );
    const questionNodes = useMemo(() => NODES.filter((n) => n?.type === "question"), [NODES]);
    const codingStepIndex = node?.type === "question" ? questionNodes.findIndex((n) => n.id === node.id) : -1;
    const codingStepNum = codingStepIndex >= 0 ? codingStepIndex + 1 : nodeIndex + 1;
    const codingStepTotal = questionNodes.length > 0 ? questionNodes.length : NODES.length;
    const stepExampleResolution = useMemo(
      () => resolveQuestionStepExample(answerShape, node, shortName),
      [answerShape, node, shortName]
    );
    const multiFilePlaceholderClearOnFirstStepOnly =
      answerShape === "multi-file" && firstQuestionNodeIndex >= 0 && nodeIndex === firstQuestionNodeIndex;
    const singleFilePlaceholderClearOnFocus = useMemo(
      () =>
        computeSingleFileSeedPlaceholderBaseline({
          node,
          nodeIndex,
          NODES,
          passedCodeByStepId,
          answerShape,
          language: language || node?.language || "",
        }),
      [node, nodeIndex, NODES, passedCodeByStepId, answerShape, language]
    );
    const showSnippetPicker = useMemo(
      () =>
        (lessonValidationCtx?.track === "react-ts" || lessonValidationCtx?.track === "react-js") &&
        node?.type === "question" &&
        answerShape !== "css-tabs" &&
        answerShape !== "angular-tabs",
      [lessonValidationCtx?.track, node?.type, answerShape]
    );
    const snippetPacksForEditor = useMemo(() => {
      if (!showSnippetPicker) return [];
      return monacoSnippetPacks;
    }, [showSnippetPicker, monacoSnippetPacks]);
    const snippetPackOptionsList = useMemo(() => {
      if (lessonValidationCtx?.track === "react-ts") return SNIPPET_PACK_OPTIONS_REACT_TS;
      if (lessonValidationCtx?.track === "react-js") return SNIPPET_PACK_OPTIONS_REACT_JS;
      return [];
    }, [lessonValidationCtx?.track]);
    const progress = NODES.length <= 1 ? 0 : Math.min(100, Math.round((nodeIndex / (NODES.length - 1)) * 100));
    const lessonCompleteFiredRef = useRef(false);

    useEffect(() => {
      try {
        localStorage.setItem(LESSON_SIDEBAR_COLLAPSED_KEY, sidebarCollapsed ? "true" : "false");
      } catch {
        /* ignore */
      }
    }, [sidebarCollapsed]);

    useEffect(() => {
      const onL1 = effectiveTourTrack === "react-ts" && Number(lessonNum) === 1;
      if (onL1) {
        setLesson1TourPrefSnapshot(readLesson1InterfaceTourPref());
      } else {
        setLesson1TourPrefSnapshot("");
        lesson1IntroTourFiredRef.current = false;
        setLesson1TourStartIndex(0);
      }
    }, [effectiveTourTrack, lessonNum]);

    useEffect(() => {
      const t = lessonValidationCtx?.track;
      if (t !== "react-ts" && t !== "react-js") return;
      try {
        const json = sessionStorage.getItem(`inpact.monacoSnippetPacks.${t}`);
        if (json) {
          const parsed = JSON.parse(json);
          if (Array.isArray(parsed)) {
            const allowed = new Set(
              (t === "react-js" ? SNIPPET_PACK_OPTIONS_REACT_JS : SNIPPET_PACK_OPTIONS_REACT_TS).map((o) => o.id)
            );
            const valid = parsed.filter((id) => allowed.has(id));
            setMonacoSnippetPacks(valid.length ? valid : t === "react-ts" ? ["react-ts"] : ["react"]);
            return;
          }
        }
        const legacy = sessionStorage.getItem(`inpact.monacoSnippetPack.${t}`);
        if (legacy === "react-ts" || legacy === "react") {
          setMonacoSnippetPacks(legacy === "react-ts" ? ["react-ts"] : ["react"]);
          return;
        }
        if (legacy === "off") {
          setMonacoSnippetPacks([]);
          return;
        }
      } catch {
        /* ignore */
      }
      setMonacoSnippetPacks(t === "react-ts" ? ["react-ts"] : ["react"]);
    }, [lessonValidationCtx?.track]);

    useEffect(() => {
      const t = lessonValidationCtx?.track;
      if (!t || (t !== "react-ts" && t !== "react-js")) return;
      try {
        sessionStorage.setItem(`inpact.monacoSnippetPacks.${t}`, JSON.stringify(monacoSnippetPacks));
      } catch {
        /* ignore */
      }
    }, [lessonValidationCtx?.track, monacoSnippetPacks]);

    useEffect(() => {
      if (nodeIndex < NODES.length) {
        lessonCompleteFiredRef.current = false;
        return;
      }
      if (!onLessonComplete || lessonCompleteFiredRef.current) return;
      lessonCompleteFiredRef.current = true;
      onLessonComplete();
    }, [nodeIndex, NODES.length, onLessonComplete]);

    const onValidateCodeResolved = useMemo(() => {
      if (configOnValidateCode) return configOnValidateCode;
      if (validateWithAI === false) return undefined;
      if (!lessonValidationCtx?.track) return undefined;
      const langForApi = languagePickerChoice?.id || language;
      return async (n, userCode) =>
        fetchLessonCodeValidation({
          track: lessonValidationCtx.track,
          node: n,
          userCode,
          language: langForApi || undefined,
          codeValidationProfile: codeValidationProfile === "algorithm" ? "algorithm" : undefined,
        });
    }, [
      configOnValidateCode,
      validateWithAI,
      lessonValidationCtx,
      language,
      languagePickerChoice,
      codeValidationProfile,
    ]);

    const onAskMentorResolved = useMemo(() => {
      if (onAskMentor) return onAskMentor;
      if (!lessonValidationCtx?.track) return undefined;
      const lessonKey =
        lessonValidationCtx.lessonKey ??
        `${lessonValidationCtx.track}:${lessonValidationCtx.lessonIndex ?? ""}:${lessonValidationCtx.lessonTitle ?? ""}`;
      return async (n, userMessage, priorTurns = []) => {
        const history = Array.isArray(priorTurns) ? priorTurns : [];
        const res = await fetch(lessonApiUrl("/api/lessons/mentor"), {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            step: { id: n.id, instruction: n.paal, paal: n.paal },
            userMessage: String(userMessage).trim(),
            history,
            track: lessonValidationCtx.track,
            lessonKey,
          }),
        });
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err?.error || res.statusText || "Mentor unavailable");
        }
        const data = await res.json();
        return data.reply ?? "";
      };
    }, [onAskMentor, lessonValidationCtx]);

    useEffect(() => {
      setExampleModalPayload(null);
      setExampleModalLoading(false);
      setExampleModalFetchError(null);
      setShowExampleModal(false);
    }, [nodeIndex, node?.id]);

    const openStepExampleModal = useCallback(() => {
      setExampleModalOffset({ x: 0, y: 0 });
      setExampleModalFetchError(null);
      setShowExampleModal(true);
      setExampleModalLoading(false);
      const fallbackCode =
        stepExampleResolution?.primarySyncEntry?.code ||
        stepExampleResolution?.localFallbackEntry?.code ||
        "";
      setExampleModalPayload({
        label: "ANALOGOUS EXAMPLE",
        code: buildAnalogousExample(node, fallbackCode),
      });
    }, [node, stepExampleResolution]);

    useEffect(() => {
      if (node?.type !== "question") setEditorWorkspaceOpen(false);
    }, [node?.type]);

    useEffect(() => {
      setResult(null);
      setAttempts(0);
      setShowHint(false);
      if (interfaceTourOpen) {
        setShowTaskModal(false);
      } else if (skipAutoTaskModalOnceRef.current) {
        skipAutoTaskModalOnceRef.current = false;
        setShowTaskModal(false);
      } else {
        setShowTaskModal(node?.type === "question");
      }
      setThinkSelection(null);
      setShowExampleModal(false);
      setExampleModalOffset({ x: 0, y: 0 });
      setFeedbackModalOffset({ x: 0, y: 0 });
      setShowFeedbackModal(false);
      setShowMentorModal(false);
      setMentorDraft("");
      setMentorThread([]);
      setMentorError("");
      setMentorLoading(false);
      setChecking(false);
      setAiFeedback("");
      setValidationFallbackNote("");
      setFeedbackAnnotateLoading(false);
      setFeedbackAnnotateError("");
      setFeedbackAnnotatedCode(null);
      setMainTab("lesson");
      if (node?.type === "question") {
        let initialCode = "";
        if (node.id && passedCodeByStepId[node.id]) {
          initialCode = passedCodeByStepId[node.id];
        } else {
          for (let i = nodeIndex - 1; i >= 0; i--) {
            const prev = NODES[i];
            if (prev?.type === "question" && prev.id && passedCodeByStepId[prev.id]) {
              initialCode = passedCodeByStepId[prev.id];
              break;
            }
          }
          if (initialCode === "") {
            if (answerShape === "css-tabs") {
              initialCode = JSON.stringify({ html: defaultHtml || "", css: node.starter_code || node.seed_code || "" });
            } else if (answerShape === "angular-tabs") {
              const seed = node.starter_code || node.seed_code || "";
              initialCode = seedCodeToAngularTabsAnswer(seed);
            } else if (answerShape === "multi-file") {
              const seed = node.starter_code || node.seed_code || "";
              initialCode = seedCodeToMultiFileAnswer(seed);
            } else {
              const seed = node.starter_code || node.seed_code || "";
              if (seed) initialCode = seed;
            }
          }
        }
        if (
          answerShape !== "css-tabs" &&
          answerShape !== "angular-tabs" &&
          answerShape !== "multi-file" &&
          typeof initialCode === "string" &&
          initialCode.trim()
        ) {
          initialCode = ensureReactJsxScaffoldForStep(node, initialCode, language || node?.language || "");
        }
        setAnswer(initialCode);
        if (answerShape === "multi-file" && multiFilePlaceholderClearOnFirstStepOnly) {
          setMultiFileFocusBaseline(parseMultiFileAnswer(initialCode).files);
        } else {
          setMultiFileFocusBaseline(null);
        }
      } else {
        setMultiFileFocusBaseline(null);
      }
    }, [nodeIndex, passedCodeByStepId, multiFilePlaceholderClearOnFirstStepOnly, interfaceTourOpen]);

    useEffect(() => {
      if (!interfaceTourOpen) return;
      setShowTaskModal(false);
    }, [interfaceTourOpen]);

    function handleExampleModalPointerDown(e) {
      if (e.pointerType === "mouse" && e.button !== 0) return;
      e.preventDefault();
      setExampleModalDragging(true);
      exampleModalDragRef.current = {
        id: e.pointerId,
        sx: e.clientX,
        sy: e.clientY,
        ox: exampleModalOffset.x,
        oy: exampleModalOffset.y,
      };
      e.currentTarget.setPointerCapture(e.pointerId);
    }

    function handleExampleModalPointerMove(e) {
      const d = exampleModalDragRef.current;
      if (!d || e.pointerId !== d.id) return;
      setExampleModalOffset({
        x: d.ox + (e.clientX - d.sx),
        y: d.oy + (e.clientY - d.sy),
      });
    }

    function handleExampleModalPointerUp(e) {
      const d = exampleModalDragRef.current;
      if (!d || e.pointerId !== d.id) return;
      setExampleModalDragging(false);
      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch (_) {
        /* ignore */
      }
      exampleModalDragRef.current = null;
    }

    function handleFeedbackModalPointerDown(e) {
      if (e.pointerType === "mouse" && e.button !== 0) return;
      e.preventDefault();
      setFeedbackModalDragging(true);
      feedbackModalDragRef.current = {
        id: e.pointerId,
        sx: e.clientX,
        sy: e.clientY,
        ox: feedbackModalOffset.x,
        oy: feedbackModalOffset.y,
      };
      e.currentTarget.setPointerCapture(e.pointerId);
    }

    function handleFeedbackModalPointerMove(e) {
      const d = feedbackModalDragRef.current;
      if (!d || e.pointerId !== d.id) return;
      setFeedbackModalOffset({
        x: d.ox + (e.clientX - d.sx),
        y: d.oy + (e.clientY - d.sy),
      });
    }

    function handleFeedbackModalPointerUp(e) {
      const d = feedbackModalDragRef.current;
      if (!d || e.pointerId !== d.id) return;
      setFeedbackModalDragging(false);
      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch (_) {
        /* ignore */
      }
      feedbackModalDragRef.current = null;
    }

    function next() {
      if (node?.type === "question" && node?.id && result === "correct") {
        setPassedCodeByStepId((prev) => ({ ...prev, [node.id]: answer }));
      }
      if (node?.id) setCompletedNodes((p) => (p.includes(node.id) ? p : [...p, node.id]));
      setNodeIndex((i) => {
        let j = i + 1;
        while (j < NODES.length && NODES[j]?.type === "prereqs") j += 1;
        return Math.min(j, NODES.length);
      });
    }

    function getMergedCodeForKeywordEval() {
      return answerShape === "css-tabs"
        ? (() => {
            try {
              const p = JSON.parse(answer);
              return p && typeof p.css === "string" ? p.css : answer;
            } catch (_) {
              return answer;
            }
          })()
        : answerShape === "angular-tabs"
          ? (() => {
              try {
                const p = JSON.parse(answer);
                if (p && typeof p === "object") {
                  let ts = (p.ts ?? "").trim();
                  const html = (p.html ?? "").trim();
                  const css = (p.css ?? "").trim();
                  ts = mergeAngularTsWithHtml(ts, html);
                  ts = mergeAngularCssIntoTS(ts, css);
                  return ts;
                }
                return answer;
              } catch (_) {
                return answer;
              }
            })()
          : answerShape === "multi-file"
            ? mergeMultiFileForValidation(answer)
            : answer;
    }

    function getUserCodeForServerValidation() {
      if (answerShape === "css-tabs") return answer;
      return getMergedCodeForKeywordEval();
    }

    async function submit() {
      const toEval = getMergedCodeForKeywordEval();
      if (!toEval.trim()) return;
      setChecking(true);
      setAiFeedback("");
      setValidationFallbackNote("");
      const minCheckingMs = 500;
      const start = Date.now();
      const done = () => {
        const elapsed = Date.now() - start;
        setTimeout(() => setChecking(false), Math.max(0, minCheckingMs - elapsed));
      };

      const keywordRes = evaluate(node, toEval);
      let res = "wrong";
      let feedbackFromAi = "";
      const hasDeclarativeKeywords = Array.isArray(node.answer_keywords) && node.answer_keywords.length > 0;
      const useKeywordOnlyWithoutAi =
        hasDeclarativeKeywords &&
        codeValidationProfile !== "algorithm" &&
        !(languagePickerOptions?.length > 0);
      try {
        if (onValidateCodeResolved && node?.type === "question" && useKeywordOnlyWithoutAi) {
          // JSON lessons ship evaluation.required → answer_keywords. Grading with AI here
          // repeatedly produced "rename to match seed" false negatives; keywords are intentionally name-agnostic.
          res = keywordRes;
          setAiFeedback("");
        } else if (onValidateCodeResolved && node?.type === "question") {
          const userCodeForApi = getUserCodeForServerValidation();
          const ai = await onValidateCodeResolved(node, userCodeForApi);
          const r = ai?.result;
          if (r === "correct" || r === "partial" || r === "wrong") {
            if (keywordRes === "correct" && (r === "wrong" || r === "partial")) {
              res = "correct";
              setAiFeedback("");
            } else {
              res = r;
              if (typeof ai.feedback === "string" && ai.feedback.trim()) {
                feedbackFromAi = ai.feedback.trim();
                setAiFeedback(feedbackFromAi);
              }
            }
          } else {
            throw new Error("Invalid validation response");
          }
        } else {
          res = keywordRes;
        }
      } catch (err) {
        res = keywordRes;
        const msg = err && typeof err.message === "string" ? err.message : "Validation unavailable";
        setValidationFallbackNote(`Keyword check used: ${msg}`);
      }

      setResult(res);
      setAttempts((a) => a + 1);
      if (attempts >= 1) setShowHint(true);
      const staticFb = node[`feedback_${res}`];
      if (node.hint || staticFb || feedbackFromAi) {
        setFeedbackModalOffset({ x: 0, y: 0 });
        setShowFeedbackModal(true);
      }
      done();
    }

    async function sendMentor() {
      if (!onAskMentorResolved || node?.type !== "question") return;
      const msg = mentorDraft.trim();
      if (!msg) return;
      setMentorLoading(true);
      setMentorError("");
      try {
        const reply = await onAskMentorResolved(node, msg, mentorThread);
        const replyText = typeof reply === "string" ? reply : String(reply ?? "");
        setMentorThread((prev) => [...prev, { role: "user", content: msg }, { role: "assistant", content: replyText }]);
        setMentorDraft("");
      } catch (e) {
        setMentorError(e && typeof e.message === "string" ? e.message : "Mentor unavailable");
      } finally {
        setMentorLoading(false);
      }
    }

    const parsedCssTabs = useMemo(() => {
      if (answerShape !== "css-tabs") return null;
      try {
        const p = JSON.parse(answer || "{}");
        return { html: p.html ?? "", css: p.css ?? "" };
      } catch (_) {
        return { html: defaultHtml || "", css: answer || "" };
      }
    }, [answer, answerShape, defaultHtml]);

    const parsedAngularTabs = useMemo(() => {
      if (answerShape !== "angular-tabs") return null;
      try {
        const p = JSON.parse(answer || "{}");
        return { ts: p.ts ?? "", html: p.html ?? "", css: p.css ?? "" };
      } catch (_) {
        return { ts: answer || "", html: "", css: "" };
      }
    }, [answer, answerShape]);

    const angularPlaceholder = useMemo(() => {
      if (answerShape !== "angular-tabs" || !node) return undefined;
      const seed = node.starter_code ?? node.seed_code ?? "";
      try {
        return JSON.parse(seedCodeToAngularTabsAnswer(seed));
      } catch (_) {
        return { ts: "", html: "", css: "" };
      }
    }, [answerShape, node]);

    const parsedMultiFile = useMemo(() => {
      if (answerShape !== "multi-file") return null;
      return parseMultiFileAnswer(answer);
    }, [answer, answerShape]);

    const canSubmitCode = useMemo(() => {
      if (answerShape === "css-tabs") return Boolean(parsedCssTabs?.css?.trim());
      if (answerShape === "angular-tabs") {
        return Boolean(
          parsedAngularTabs?.ts?.trim() ||
            parsedAngularTabs?.html?.trim() ||
            parsedAngularTabs?.css?.trim()
        );
      }
      if (answerShape === "multi-file") {
        return Object.values(parsedMultiFile?.files || {}).some((v) => String(v || "").trim());
      }
      return Boolean(answer.trim());
    }, [answerShape, parsedCssTabs, parsedAngularTabs, parsedMultiFile, answer]);

    const lessonKeyboardRef = useRef(null);

    lessonKeyboardRef.current = {
      showFeedbackModal,
      showTaskModal,
      showExampleModal,
      showMentorModal,
      nodeType: node?.type,
      result,
      checking,
      canSubmitCode,
      feedbackAnnotateLoading,
      submit,
      next,
    };

    const runSubmitShortcut = useCallback(() => {
      const k = lessonKeyboardRef.current;
      if (!k) return;
      if (k.showFeedbackModal || k.showTaskModal || k.showExampleModal || k.showMentorModal) return;
      if (k.nodeType !== "question") return;
      if (k.result === "correct") return;
      if (k.checking || !k.canSubmitCode) return;
      void k.submit();
    }, []);

    useEffect(() => {
      if (!showFeedbackModal) return undefined;
      const id = requestAnimationFrame(() => {
        feedbackModalPrimaryBtnRef.current?.focus();
      });
      return () => cancelAnimationFrame(id);
    }, [showFeedbackModal]);

    useEffect(() => {
      function onKeyDown(e) {
        const k = lessonKeyboardRef.current;
        if (!k) return;
        if (
          k.showFeedbackModal &&
          e.key === "Enter" &&
          !e.repeat &&
          !e.ctrlKey &&
          !e.metaKey &&
          !e.shiftKey &&
          !e.altKey
        ) {
          const el = e.target;
          if (
            el &&
            (el.tagName === "TEXTAREA" ||
              (el.tagName === "INPUT" && el.type !== "button" && el.type !== "submit" && el.type !== "reset"))
          ) {
            return;
          }
          if (k.feedbackAnnotateLoading) return;
          e.preventDefault();
          e.stopPropagation();
          setShowFeedbackModal(false);
          setFeedbackAnnotateLoading(false);
          setFeedbackAnnotateError("");
          setFeedbackAnnotatedCode(null);
          if (k.result === "correct") k.next();
          return;
        }
        const chord = (e.ctrlKey || e.metaKey) && e.shiftKey && e.key === "Enter";
        if (!chord || e.repeat) return;
        if (k.showFeedbackModal || k.showTaskModal || k.showExampleModal || k.showMentorModal) return;
        if (k.nodeType !== "question") return;
        if (k.result === "correct") return;
        if (k.checking || !k.canSubmitCode) return;
        e.preventDefault();
        e.stopPropagation();
        void k.submit();
      }
      window.addEventListener("keydown", onKeyDown, true);
      return () => window.removeEventListener("keydown", onKeyDown, true);
    }, []);

    const multiFilePlaceholderByFile = useMemo(() => {
      if (answerShape !== "multi-file" || !node) return undefined;
      const seed = node.starter_code ?? node.seed_code ?? "";
      const map = multiFileSeedToPlaceholderByFile(seed);
      const hasAny = Object.values(map).some((v) => String(v ?? "").trim());
      return hasAny ? map : undefined;
    }, [answerShape, node]);

    const s = {
      wrap: { height: "100vh", overflow: "hidden", background: "#ffffff", color: "#1e293b", fontFamily: "'DM Sans', sans-serif", display: "flex", flexDirection: "column", paddingTop: "52px", boxSizing: "border-box" },
      body: { display: "flex", flex: 1, minHeight: 0, minWidth: 0, overflowX: "hidden" },
      sidebar: { width: "240px", background: "#f1f5f9", borderRight: "1px solid #e2e8f0", padding: "20px 0", flexShrink: 0, overflowY: "auto" },
      sidebarLabel: { fontSize: "10px", fontWeight: "700", letterSpacing: "0.15em", color: "#64748b", padding: "0 20px 10px", marginBottom: "4px" },
      sideItem: (a, d) => ({ padding: "12px 20px", display: "flex", alignItems: "center", gap: "12px", cursor: "pointer", background: a ? "#e0f2fe" : "transparent", borderLeft: a ? "3px solid #0891b2" : "3px solid transparent" }),
      sideItemDot: (a, d) => ({ width: "10px", height: "10px", borderRadius: "50%", flexShrink: 0, ...(d ? { background: "#10b981" } : a ? { background: "#0891b2" } : { background: "transparent", border: "2px solid #94a3b8" }) }),
      sideItemText: (a, d) => ({ fontSize: "13px", color: d ? "#059669" : a ? "#0f172a" : "#64748b", lineHeight: 1.35, fontWeight: (a ? 600 : 400) }),
      main: { flex: 1, padding: "4px 20px 24px 20px", paddingLeft: "96px", minWidth: "75vw", maxWidth: "75vw", minHeight: 0, display: "flex", flexDirection: "column", overflowX: "hidden", boxSizing: "border-box" },
      phase: { fontSize: "10px", letterSpacing: "3px", color: "#f28a8a", marginBottom: "16px" },
      tag: { fontSize: "11px", color: "#f28a8a", fontWeight: "600", letterSpacing: "0.15em", marginBottom: "12px" },
      h1: { fontSize: "28px", fontWeight: "400", color: "#0f172a", marginBottom: "32px", lineHeight: "1.2" },
      pre: { fontSize: "13px", lineHeight: "1.8", color: "#475569", background: "#f1f5f9", border: "1px solid #e2e8f0", borderRadius: "8px", padding: "24px", whiteSpace: "pre-wrap", marginBottom: "32px" },
      paalBox: { background: "#f1f5f9", border: "1px solid #e2e8f0", borderLeft: "3px solid #f28a8a", borderRadius: "8px", padding: "20px 24px", marginBottom: "24px" },
      paalLabel: { fontSize: "10px", color: "#f28a8a", letterSpacing: "2px", marginBottom: "10px" },
      paalText: { fontSize: "16px", color: "#334155", lineHeight: "1.6", whiteSpace: "pre-wrap" },
      btnRow: { display: "flex", gap: "12px", marginTop: "4px", flexWrap: "wrap" },
      btn: (v) => ({ padding: "14px 32px", borderRadius: "16px", cursor: "pointer", fontSize: "14px", fontWeight: "600", letterSpacing: "0.02em", background: v === "primary" ? "#00D2FF" : v === "ghost" ? "transparent" : "#e0f2fe", color: v === "primary" ? "#00334E" : v === "ghost" ? "#64748b" : "#0f172a", border: v === "ghost" ? "1px solid #cbd5e1" : v === "secondary" ? "1px solid #bae6fd" : "none" }),
      feedback: (t) => ({ marginTop: "20px", padding: "16px 20px", borderRadius: "8px", fontSize: "12px", lineHeight: "1.8", background: t === "correct" ? "rgba(16,185,129,0.1)" : t === "partial" ? "rgba(245,158,11,0.1)" : "rgba(239,68,68,0.1)", border: `1px solid ${t === "correct" ? "#10b981" : t === "partial" ? "#f59e0b" : "#ef4444"}`, color: t === "correct" ? "#059669" : t === "partial" ? "#d97706" : "#dc2626", whiteSpace: "pre-wrap" }),
      hintBox: { marginTop: "12px", padding: "12px 16px", background: "rgba(124,58,237,0.08)", border: "1px solid #7c3aed", borderRadius: "6px", fontSize: "11px", color: "#6d28d9", lineHeight: "1.7" },
      expectedBox: { marginTop: "12px", padding: "16px", background: "#f1f5f9", border: "1px solid #e2e8f0", borderRadius: "6px", fontSize: "12px", color: "#475569", whiteSpace: "pre-wrap", lineHeight: "1.7" },
      completeBanner: { textAlign: "center", padding: "60px 20px" },
      helpTourBtn: {
        position: "fixed",
        right: "16px",
        top: "62px",
        zIndex: 12040,
        padding: "8px 12px",
        borderRadius: "999px",
        border: "1px solid #bae6fd",
        background: "#e0f2fe",
        color: "#075985",
        fontSize: "12px",
        fontWeight: 700,
        cursor: "pointer",
      },
    };

    /** Dismiss running tour when these stack above it (task modal uses z-index only). */
    const tourDismissForStackingModals = showExampleModal || showFeedbackModal || showMentorModal;

    const interfaceTourSteps = useMemo(
      () => [
        {
          selector: ".inpact-help-tour-button[data-tour-id=\"help-tour-button\"]",
          text: "This short walkthrough highlights the main workspace controls. You can replay it any time from Help: Tour. Next, we open the Editor so the tour matches the layout you use while coding.",
          action: { type: "noop" },
        },
        {
          selector: '.inpact-main-tabs-row [data-tour-id="tab-editor"]',
          text: "The tour switches to match each control. Editor is your full-screen workspace for code, Preview, checks, and help—use it whenever you are building the step.",
          action: { type: "open-lesson" },
        },
        {
          selector: '.inpact-main-tabs-row [data-tour-id="tab-lesson"]',
          text: "Lesson holds the write-up, objectives, and optional deep dives. Open Lesson when you want that context—then return to Editor to code.",
          action: { type: "open-lesson" },
        },
        {
          selector: '[data-tour-id="reading-button"]',
          text: "Reading opens a book-like view to skim every step in this lesson. It lives in the top tab row; we switch to Lesson so the main view matches what you are reading about.",
          action: { type: "open-lesson" },
        },
        {
          selector: '[data-tour-id="preview-button"]',
          text: "Preview opens a live output modal from inside the editor so you can quickly validate what your code renders.",
          action: { type: "open-editor" },
        },
        {
          selector:
            '[data-inpact-editor-workspace="open"] .inpact-editor-task-deep-dive-host[data-tour-id="deep-dive-editor-button"]',
          text: "Want to go deeper? This opens an optional explanation focused on this step-helping you understand why it matters, without spoiling the solution.",
          action: { type: "open-editor" },
        },
        {
          selector: '[data-tour-id="check-code-button"]',
          text: "CHECK MY CODE{CTRL+SHIFT+ENTER}{ctrl+shift+enter} validates your solution for the current step.",
          action: { type: "open-editor" },
        },
        {
          selector: '[data-tour-id="show-example-button"]',
          text: "Show me an example gives a pattern-style reference to guide your solution.",
          action: { type: "open-editor" },
        },
        {
          selector: '[data-tour-id="view-hint-feedback-button"]',
          text: "View hint & feedback gathers hints and code feedback in one place so you can learn from each attempt.",
          action: { type: "open-editor" },
        },
        {
          selector: '[data-inpact-editor-workspace="open"] [data-tour-id="think-prompt-button"]',
          text: "Think prompt opens a short guided reflection for this step—use it when you want to think through the problem before you write code.",
          action: { type: "open-editor" },
        },
        {
          selector: '[data-tour-id="ask-mentor-button"]',
          text: "Ask mentor lets you chat with a mentor-style assistant about this exact step, in your own words.",
          action: { type: "open-editor" },
        },
        {
          selector: ".inpact-help-tour-button[data-tour-id=\"help-tour-button\"]",
          text: "You can reopen this interface walkthrough at any time from Help: Tour in the header—use it whenever you want a refresher on where each control lives.",
          action: { type: "noop" },
        },
      ],
      []
    );

    const interfaceTourStepCount = interfaceTourSteps.length;

    useEffect(() => {
      if (!isReactTsLesson1TourEntry) {
        lesson1IntroTourFiredRef.current = false;
        return undefined;
      }
      if (lesson1IntroTourFiredRef.current) return undefined;
      const pref = readLesson1InterfaceTourPref();
      if (pref === "completed") {
        lesson1IntroTourFiredRef.current = true;
        return undefined;
      }
      lesson1IntroTourFiredRef.current = true;
      const last = Math.max(0, interfaceTourStepCount - 1);
      const startIdx = pref === "recapOnly" ? last : 0;
      setLesson1TourStartIndex(startIdx);
      // Sync bump: dev Strict Mode clears setTimeout(0) before it runs, so the tour never opened.
      setTourLaunchNonce((n) => n + 1);
      return () => {
        lesson1IntroTourFiredRef.current = false;
      };
    }, [isReactTsLesson1TourEntry, interfaceTourStepCount]);

    useEffect(() => {
      const host = mainScrollRef.current;
      if (!host) return;
      const onLessonSurface =
        node?.type === "reveal" ||
        node?.type === "objectives" ||
        (node?.type === "question" && mainTab === "lesson");
      if (!onLessonSurface) return;
      const id = requestAnimationFrame(() => {
        host.scrollTo({ top: 0, behavior: "instant" });
      });
      return () => cancelAnimationFrame(id);
    }, [node?.id, node?.type, mainTab]);

    const skipLesson1InterfaceTourToRecap = useCallback(() => {
      writeLesson1InterfaceTourPref("recapOnly");
      setLesson1TourPrefSnapshot("recapOnly");
      const last = Math.max(0, interfaceTourSteps.length - 1);
      setLesson1TourStartIndex(last);
      setTourLaunchNonce((v) => v + 1);
    }, [interfaceTourSteps.length]);

    const handleLesson1TourLastStepDone = useCallback(() => {
      if (effectiveTourTrack !== "react-ts" || Number(lessonNum) !== 1) return;
      writeLesson1InterfaceTourPref("completed");
      setLesson1TourPrefSnapshot("completed");
    }, [effectiveTourTrack, lessonNum]);

    const handleTourAction = useCallback(
      (action) => {
        if (!action || typeof action !== "object") return;
        // Never stack the tour under the think / task gate modal (or block the tour card on Close).
        setShowTaskModal(false);
        /** First tour step runs on Lesson intro where Editor tabs are not mounted yet — do not jump to a coding step. */
        if (action.type === "noop") return;
        const jumpToQuestionForTour = node?.type !== "question" && firstQuestionNodeIndex >= 0;
        if (jumpToQuestionForTour) {
          skipAutoTaskModalOnceRef.current = true;
        }
        if (node?.type !== "question" && firstQuestionNodeIndex >= 0) {
          setNodeIndex(firstQuestionNodeIndex);
        }
        if (action.type === "open-lesson") {
          setMainTab("lesson");
          setEditorWorkspaceOpen(false);
          return;
        }
        if (action.type === "open-editor") {
          setMainTab("editor");
          setEditorWorkspaceOpen(true);
        }
      },
      [node?.type, firstQuestionNodeIndex]
    );

    function renderReveal() {
      const c = node?.content && typeof node.content === "object" ? node.content : {};
      const revealTitle = typeof c.title === "string" && c.title.trim() ? c.title : title || "Lesson";
      const revealBody = typeof c.body === "string" ? c.body : "";
      const revealPadding = { paddingLeft: "44px" };
      return (
        <div>
          <div style={revealPadding}>
            {node.phase && node.phase !== "Lesson" && <div style={s.phase}>{node.phase}</div>}
            {c.tag && <div style={s.tag}>{c.tag}</div>}
            <h1 style={s.h1}>{revealTitle}</h1>
            <RichLearnerText text={revealBody} style={s.pre} />
          </div>
          {c.usecase && <div style={{ ...revealPadding, background: "rgba(8,145,178,0.08)", border: "1px solid rgba(8,145,178,0.25)", borderLeft: "3px solid #0891b2", borderRadius: "8px", padding: "16px 20px", marginBottom: "28px" }}><div style={{ fontSize: "10px", letterSpacing: "2px", color: "#0891b2", marginBottom: "8px" }}>💡 WHY THIS MATTERS</div><RichLearnerText text={c.usecase} variant="muted" style={{ fontSize: "14px", color: "#475569", lineHeight: "1.7" }} /></div>}
          <div style={s.btnRow}><button type="button" className="inpact-btn-primary" style={s.btn("primary")} onClick={next}>CONTINUE →</button></div>
        </div>
      );
    }

    function renderObjectives() {
      const objectiveItems = Array.isArray(node?.items) ? node.items : [];
      return (
        <div>
          {node.phase && node.phase !== "Lesson" && <div style={s.phase}>{node.phase}</div>}
          <h1 style={s.h1}>After completing this Lesson, you'll be able to:</h1>
          {objectiveItems.map((item, i) => (
            <div key={i} style={{ display: "flex", gap: "16px", padding: "14px 0", borderBottom: "1px solid #e2e8f0" }}>
              <div style={{ fontSize: "11px", color: "#0891b2", flexShrink: 0, minWidth: "20px" }}>{String(i + 1).padStart(2, "0")}</div>
              <RichLearnerText style={{ fontSize: "15px", color: "#334155", lineHeight: "1.6" }} text={item} />
            </div>
          ))}
          <div style={s.btnRow}>
            <button
              type="button"
              className="inpact-btn-primary"
              style={s.btn("primary")}
              data-inpact-lesson-lets-build="true"
              onClick={() => {
                next();
                setMainTab("editor");
                setEditorWorkspaceOpen(true);
              }}
            >
              LET&apos;S BUILD →
            </button>
          </div>
        </div>
      );
    }

    function renderEditorBlockScrollable(fillAvailable = false) {
      const codeForCursor = answerShape === "css-tabs" ? (parsedCssTabs?.css || "") : answerShape === "angular-tabs" ? (parsedAngularTabs?.ts || "") : (answer || "");
      const stepLineIndex = codeForCursor.split("\n").findIndex((l) => l.includes("// Step"));
      const cursorAtStartOfLine = node.cursorAtStartOfLine ?? (stepLineIndex >= 0 ? stepLineIndex + 2 : undefined);
      const showEditorCursorHint =
        answerShape !== "css-tabs" &&
        answerShape !== "angular-tabs" &&
        answerShape !== "multi-file" &&
        (cursorAtStartOfLine != null || node.cursorLine != null);
      return (
        <>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              gap: "6px",
              marginBottom: fillAvailable ? "2px" : "6px",
              width: "100%",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap", width: "100%" }}>
              {languagePickerOptions?.length > 0 && languagePickerChoice && (
                <label
                  data-tour-id="code-language-picker"
                  style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "11px", color: "#475569", fontWeight: 500 }}
                >
                  <span style={{ letterSpacing: "0.04em", textTransform: "uppercase", fontSize: "10px", color: "#64748b" }}>Code in</span>
                  <select
                    value={languagePickerChoice.id}
                    onChange={(e) => {
                      const opt = languagePickerOptions.find((o) => o.id === e.target.value);
                      if (opt) setLanguagePickerChoice(opt);
                    }}
                    style={{
                      fontSize: "11px",
                      padding: "4px 10px",
                      borderRadius: "6px",
                      border: "1px solid #cbd5e1",
                      background: "#fff",
                      color: "#0f172a",
                      cursor: "pointer",
                    }}
                  >
                    {languagePickerOptions.map((o) => (
                      <option key={o.id} value={o.id}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                </label>
              )}
              <span style={{ fontSize: "11px", color: "#0891b2", fontWeight: 600 }}>Step {codingStepNum} of {codingStepTotal}</span>
              {codingStepIndex > 0 && (
                <>
                  <span style={{ fontSize: "11px", color: "#64748b" }}>·</span>
                  <span style={{ fontSize: "11px", color: "#0891b2", fontWeight: 600, letterSpacing: "0.05em" }}>write your code in the editor below</span>
                </>
              )}
            </div>
            {showSnippetPicker && snippetPackOptionsList.length > 0 ? (
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  alignItems: "flex-end",
                  gap: "8px 12px",
                  fontSize: "11px",
                  color: "#475569",
                  fontWeight: 500,
                  maxWidth: "100%",
                }}
              >
                <label style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "6px", minWidth: 0, flex: "0 1 320px" }}>
                  <span style={{ letterSpacing: "0.04em", textTransform: "uppercase", fontSize: "10px", color: "#64748b" }}>Snippets</span>
                  <SnippetPackMultiselect
                    options={snippetPackOptionsList}
                    value={monacoSnippetPacks}
                    onChange={setMonacoSnippetPacks}
                    placeholder="Select snippet packs…"
                    searchPlaceholder="Search"
                  />
                </label>
              </div>
            ) : null}
          </div>
          {showEditorCursorHint && <div style={{ fontSize: "10px", color: "#64748b", marginBottom: fillAvailable ? "2px" : "6px" }}>Type your code where the cursor is placed.</div>}
          {answerShape === "angular-tabs" && (
            <div style={{ fontSize: "12px", color: "#0e7490", marginBottom: fillAvailable ? "4px" : "8px", padding: fillAvailable ? "6px 10px" : "8px 12px", background: "rgba(8,145,178,0.08)", border: "1px solid rgba(8,145,178,0.25)", borderRadius: "6px", lineHeight: 1.5 }}>
              <strong>Tip:</strong> Use <code style={{ background: "rgba(0,0,0,0.06)", padding: "2px 6px", borderRadius: "4px", fontSize: "11px" }}>{"template: `" + "`"}</code> in the TypeScript tab and put your markup in the <strong>HTML</strong> tab; put CSS in the <strong>CSS</strong> tab. All three merge when you click Check.
            </div>
          )}
          <div
            style={
              fillAvailable
                ? {
                    borderRadius: "10px",
                    overflow: "hidden",
                    border: "1px solid #e2e8f0",
                    marginBottom: "4px",
                    flex: 1,
                    minHeight: "200px",
                    width: "100%",
                    maxWidth: "100%",
                    display: "flex",
                    flexDirection: "column",
                  }
                : {
                    borderRadius: "10px",
                    overflow: "hidden",
                    border: "1px solid #e2e8f0",
                    marginBottom: "4px",
                    height: "480px",
                    minHeight: "480px",
                    width: "100%",
                    maxWidth: "100%",
                  }
            }
          >
            {fillAvailable ? (
              <div style={{ flex: 1, minHeight: 0, position: "relative", display: "flex", flexDirection: "column" }}>
                {answerShape === "css-tabs" ? (
                  <CssTabsEditor
                    key={node?.id}
                    value={parsedCssTabs || { html: "", css: "" }}
                    onChange={(v) => setAnswer(JSON.stringify(v))}
                    height="100%"
                  />
                ) : answerShape === "angular-tabs" ? (
                  <AngularTabbedEditor
                    key={node?.id}
                    value={parsedAngularTabs || { ts: "", html: "", css: "" }}
                    onChange={(v) => setAnswer(JSON.stringify(v))}
                    height="100%"
                    placeholder={angularPlaceholder}
                  />
                ) : answerShape === "multi-file" ? (
                  <MultiFileEditor
                    key={node?.id}
                    value={answer}
                    onChange={setAnswer}
                    height="100%"
                    defaultFileName={editorMonacoLanguage.includes("ts") ? "App.tsx" : "App.jsx"}
                    language={editorMonacoLanguage}
                    focusBaselineByFile={multiFileFocusBaseline}
                    placeholderByFile={multiFilePlaceholderByFile}
                    clearPlaceholderOnFirstFocus={multiFilePlaceholderClearOnFirstStepOnly}
                    onSubmitShortcut={runSubmitShortcut}
                    snippetPacks={snippetPacksForEditor}
                  />
                ) : (
                  <CodeEditor
                    key={node?.id}
                    value={answer}
                    onChange={setAnswer}
                    height="100%"
                    cursorAtEndOfLine={cursorAtStartOfLine == null ? node.cursorLine : undefined}
                    cursorAtStartOfLine={cursorAtStartOfLine}
                    language={editorMonacoLanguage}
                    placeholderClearOnFocus={singleFilePlaceholderClearOnFocus}
                    focusOnMount={!singleFilePlaceholderClearOnFocus}
                    onSubmitShortcut={runSubmitShortcut}
                    snippetPacks={snippetPacksForEditor}
                  />
                )}
              </div>
            ) : answerShape === "css-tabs" ? (
              <CssTabsEditor
                key={node?.id}
                value={parsedCssTabs || { html: "", css: "" }}
                onChange={(v) => setAnswer(JSON.stringify(v))}
                height="480px"
              />
            ) : answerShape === "angular-tabs" ? (
              <AngularTabbedEditor
                key={node?.id}
                value={parsedAngularTabs || { ts: "", html: "", css: "" }}
                onChange={(v) => setAnswer(JSON.stringify(v))}
                height="480px"
                placeholder={angularPlaceholder}
              />
            ) : answerShape === "multi-file" ? (
              <MultiFileEditor
                key={node?.id}
                value={answer}
                onChange={setAnswer}
                height="480px"
                defaultFileName={editorMonacoLanguage.includes("ts") ? "App.tsx" : "App.jsx"}
                language={editorMonacoLanguage}
                focusBaselineByFile={multiFileFocusBaseline}
                placeholderByFile={multiFilePlaceholderByFile}
                clearPlaceholderOnFirstFocus={multiFilePlaceholderClearOnFirstStepOnly}
                onSubmitShortcut={runSubmitShortcut}
                snippetPacks={snippetPacksForEditor}
              />
            ) : (
              <CodeEditor
                key={node?.id}
                value={answer}
                onChange={setAnswer}
                height="480px"
                cursorAtEndOfLine={cursorAtStartOfLine == null ? node.cursorLine : undefined}
                cursorAtStartOfLine={cursorAtStartOfLine}
                language={editorMonacoLanguage}
                placeholderClearOnFocus={singleFilePlaceholderClearOnFocus}
                focusOnMount={!singleFilePlaceholderClearOnFocus}
                onSubmitShortcut={runSubmitShortcut}
                snippetPacks={snippetPacksForEditor}
              />
            )}
          </div>
        </>
      );
    }

    function renderEditorBlockButtons(fbMsg, feedbackPlainForAnnotate = "") {
      const canSubmit = answerShape === "css-tabs"
        ? (parsedCssTabs?.css?.trim())
        : answerShape === "angular-tabs"
          ? (parsedAngularTabs?.ts?.trim() || parsedAngularTabs?.html?.trim() || parsedAngularTabs?.css?.trim())
          : answerShape === "multi-file"
            ? Object.values(parsedMultiFile?.files || {}).some((v) => String(v || "").trim())
            : answer.trim();
      const hasExampleButton = node?.type === "question";
      const hasHintOrFeedback = node.hint || fbMsg;
      const taskModalHasThinkMcq =
        node?.type === "question" &&
        typeof node?.think_prompt === "string" &&
        Array.isArray(node?.mc_options) &&
        node.mc_options.length >= 2 &&
        typeof node?.mc_correct_option === "string";
      return (
        <>
          <div style={s.btnRow}>
            {result !== "correct" ? (
              <>
                <button type="button" data-tour-id="check-code-button" className={`inpact-btn-primary ${checking ? "inpact-btn-checking" : ""}`} style={s.btn("primary")} onClick={submit} disabled={!canSubmit || checking} title="Shortcut: Ctrl+Shift+Enter (⌘⇧↵ on Mac)">{checking ? "Checking..." : "CHECK MY CODE{ctrl+shift+enter}"}</button>
                {hasExampleButton && (
                  <button type="button" data-tour-id="show-example-button" style={s.btn("secondary")} onClick={openStepExampleModal}>
                    SHOW ME AN EXAMPLE
                  </button>
                )}
                {attempts > 0 && !showHint && (
                  <button
                    type="button"
                    data-tour-id="show-hint-button"
                    style={s.btn("secondary")}
                    onClick={() => {
                      setShowHint(true);
                      setFeedbackModalOffset({ x: 0, y: 0 });
                      setShowFeedbackModal(true);
                    }}
                  >
                    SHOW HINT
                  </button>
                )}
                {hasHintOrFeedback && (
                  <button
                    type="button"
                    data-tour-id="view-hint-feedback-button"
                    style={s.btn("secondary")}
                    onClick={() => {
                      setFeedbackModalOffset({ x: 0, y: 0 });
                      setShowFeedbackModal(true);
                    }}
                  >
                    💡 VIEW HINT & FEEDBACK
                  </button>
                )}
                {node?.type === "question" && !showTaskModal && (
                  <button
                    type="button"
                    data-tour-id="think-prompt-button"
                    style={s.btn("secondary")}
                    onClick={() => setShowTaskModal(true)}
                  >
                    Think prompt
                  </button>
                )}
                {onAskMentorResolved && (
                  <button type="button" data-tour-id="ask-mentor-button" style={s.btn("secondary")} onClick={() => { setShowMentorModal(true); setMentorError(""); }}>Ask mentor</button>
                )}
              </>
            ) : (
              <>
                {!(showFeedbackModal && hasHintOrFeedback) && (
                  <button type="button" className="inpact-btn-primary" style={s.btn("primary")} onClick={next}>NEXT STEP →</button>
                )}
                {hasHintOrFeedback && !showFeedbackModal && (
                  <button
                    type="button"
                    data-tour-id="view-hint-feedback-button"
                    style={s.btn("secondary")}
                    onClick={() => {
                      setFeedbackModalOffset({ x: 0, y: 0 });
                      setShowFeedbackModal(true);
                    }}
                  >
                    💡 VIEW HINT & FEEDBACK
                  </button>
                )}
                {node?.type === "question" && !showTaskModal && (
                  <button
                    type="button"
                    data-tour-id="think-prompt-button"
                    style={s.btn("secondary")}
                    onClick={() => setShowTaskModal(true)}
                  >
                    Think prompt
                  </button>
                )}
                {onAskMentorResolved && (
                  <button type="button" data-tour-id="ask-mentor-button" style={s.btn("secondary")} onClick={() => { setShowMentorModal(true); setMentorError(""); }}>Ask mentor</button>
                )}
              </>
            )}
          </div>
          {showExampleModal && (
            <div
              style={{
                position: "fixed",
                inset: 0,
                zIndex: 11010,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "rgba(15, 23, 42, 0.5)",
                padding: "24px",
                boxSizing: "border-box",
              }}
              onClick={() => setShowExampleModal(false)}
              role="dialog"
              aria-modal="true"
              aria-labelledby="example-modal-title"
            >
              <div
                style={{
                  background: "#ffffff",
                  borderRadius: "12px",
                  padding: "24px",
                  maxWidth: "min(92vw, 720px)",
                  width: "100%",
                  maxHeight: "80vh",
                  overflowY: "auto",
                  boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
                  border: "1px solid #e2e8f0",
                  transform: `translate(${exampleModalOffset.x}px, ${exampleModalOffset.y}px)`,
                  touchAction: "none",
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <div
                  role="presentation"
                  onPointerDown={handleExampleModalPointerDown}
                  onPointerMove={handleExampleModalPointerMove}
                  onPointerUp={handleExampleModalPointerUp}
                  onPointerCancel={handleExampleModalPointerUp}
                  style={{
                    cursor: exampleModalDragging ? "grabbing" : "grab",
                    margin: "-4px -8px 8px -8px",
                    padding: "4px 8px",
                    borderRadius: "8px",
                    userSelect: "none",
                    touchAction: "none",
                  }}
                  title="Drag to move"
                >
                  <div id="example-modal-title" style={{ ...s.paalLabel, marginBottom: 0 }}>
                    {exampleModalLoading ? "Loading example…" : exampleModalPayload?.label || "EXAMPLE"}
                  </div>
                </div>
                {exampleModalFetchError ? (
                  <div style={{ fontSize: "12px", color: "#b45309", marginBottom: "10px", lineHeight: 1.5 }}>
                    Could not load this example right now — showing the local pattern.
                  </div>
                ) : null}
                <div style={s.expectedBox}>
                  {exampleModalLoading ? (
                    <div style={{ padding: "20px", color: "#64748b", fontSize: "13px" }}>
                      Loading example…
                    </div>
                  ) : (
                    exampleModalPayload?.code ?? ""
                  )}
                </div>
                <div style={{ marginTop: "20px", display: "flex", justifyContent: "flex-end" }}>
                  <button type="button" className="inpact-btn-primary" style={s.btn("primary")} onClick={() => setShowExampleModal(false)}>Close</button>
                </div>
              </div>
            </div>
          )}
          {showFeedbackModal && hasHintOrFeedback && (
            <div
              style={{
                position: "fixed",
                inset: 0,
                zIndex: 11010,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "rgba(15, 23, 42, 0.5)",
                padding: "24px",
                boxSizing: "border-box",
              }}
              onClick={() => {
                setShowFeedbackModal(false);
                setFeedbackAnnotateLoading(false);
                setFeedbackAnnotateError("");
                setFeedbackAnnotatedCode(null);
              }}
              role="dialog"
              aria-modal="true"
              aria-labelledby="feedback-modal-title"
            >
              <div
                style={{
                  background: "#ffffff",
                  borderRadius: "12px",
                  padding: "24px",
                  maxWidth: feedbackAnnotatedCode ? "min(92vw, 760px)" : "520px",
                  width: "100%",
                  maxHeight: "80vh",
                  overflowY: "auto",
                  boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
                  border: "1px solid #e2e8f0",
                  transform: `translate(${feedbackModalOffset.x}px, ${feedbackModalOffset.y}px)`,
                  touchAction: "none",
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <div
                  role="presentation"
                  onPointerDown={handleFeedbackModalPointerDown}
                  onPointerMove={handleFeedbackModalPointerMove}
                  onPointerUp={handleFeedbackModalPointerUp}
                  onPointerCancel={handleFeedbackModalPointerUp}
                  style={{
                    cursor: feedbackModalDragging ? "grabbing" : "grab",
                    margin: "-4px -8px 12px -8px",
                    padding: "4px 8px",
                    borderRadius: "8px",
                    userSelect: "none",
                    touchAction: "none",
                  }}
                  title="Drag to move"
                >
                  <div id="feedback-modal-title" style={{ fontSize: "12px", fontWeight: 700, letterSpacing: "0.05em", color: "#64748b", marginBottom: 0 }}>HINT & FEEDBACK</div>
                </div>
                {null /* Intentionally no purple hint block in this modal; we show only feedback. */}
                {fbMsg && (
                  <div style={s.feedback(result)}>
                    <RichLearnerText text={fbMsg} variant="feedback" />
                  </div>
                )}
                {result !== "correct" &&
                  getMergedCodeForKeywordEval().trim() &&
                  (feedbackPlainForAnnotate.trim() || String(node?.hint || "").trim()) && (
                    <div style={{ marginTop: "14px" }}>
                      <button
                        type="button"
                        data-tour-id="feedback-map-to-code-button"
                        className="inpact-btn-primary"
                        style={s.btn("secondary")}
                        disabled={feedbackAnnotateLoading}
                        onClick={async () => {
                          setFeedbackAnnotateError("");
                          setFeedbackAnnotateLoading(true);
                          try {
                            const userCode = getMergedCodeForKeywordEval();
                            const fb =
                              feedbackPlainForAnnotate.trim() ||
                              String(node?.hint || "").trim() ||
                              "Review your code against the step task.";
                            const data = await fetchFeedbackAnnotate({
                              instruction: node?.paal || node?.instruction || "",
                              feedback: fb,
                              hint: node?.hint || "",
                              userCode,
                              language: editorMonacoLanguage,
                            });
                            setFeedbackAnnotatedCode(data.annotatedCode ?? "");
                          } catch (e) {
                            setFeedbackAnnotatedCode(null);
                            setFeedbackAnnotateError(
                              e && typeof e.message === "string" ? e.message : "Could not map feedback to your code."
                            );
                          } finally {
                            setFeedbackAnnotateLoading(false);
                          }
                        }}
                      >
                        {feedbackAnnotateLoading ? "Preparing…" : "Annotate my code with this feedback"}
                      </button>
                      <p style={{ fontSize: "11px", color: "#64748b", margin: "8px 0 0", lineHeight: 1.45 }}>
                        Adds brief inline comments at the relevant lines (and small corrections where needed) so the feedback connects directly to your submission.
                      </p>
                    </div>
                  )}
                {feedbackAnnotateError ? (
                  <div
                    style={{
                      marginTop: "12px",
                      fontSize: "12px",
                      color: "#b45309",
                      padding: "10px 12px",
                      background: "rgba(245,158,11,0.12)",
                      borderRadius: "8px",
                      lineHeight: 1.5,
                    }}
                  >
                    {feedbackAnnotateError}
                  </div>
                ) : null}
                {feedbackAnnotatedCode != null && feedbackAnnotatedCode !== "" ? (
                  <div style={{ marginTop: "16px" }}>
                    <div
                      style={{
                        fontSize: "10px",
                        fontWeight: 700,
                        letterSpacing: "0.08em",
                        color: "#64748b",
                        marginBottom: "8px",
                      }}
                    >
                      YOUR CODE, ANNOTATED
                    </div>
                    <pre
                      style={{
                        margin: 0,
                        padding: "12px 14px",
                        borderRadius: "10px",
                        background: "#f1f5f9",
                        border: "1px solid #e2e8f0",
                        fontSize: "12px",
                        lineHeight: 1.5,
                        overflowX: "auto",
                        fontFamily:
                          'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace',
                        whiteSpace: "pre-wrap",
                        wordBreak: "break-word",
                      }}
                    >
                      {feedbackAnnotatedCode}
                    </pre>
                  </div>
                ) : null}
                <div style={{ marginTop: "20px", display: "flex", justifyContent: "flex-end", gap: "10px", flexWrap: "wrap" }}>
                  <button
                    ref={feedbackModalPrimaryBtnRef}
                    type="button"
                    data-inpact-feedback-primary="true"
                    className="inpact-btn-primary"
                    style={s.btn("primary")}
                    title={result === "correct" ? "Next step (Enter)" : "Close (Enter)"}
                    onClick={() => {
                      setShowFeedbackModal(false);
                      setFeedbackAnnotateLoading(false);
                      setFeedbackAnnotateError("");
                      setFeedbackAnnotatedCode(null);
                      if (result === "correct") next();
                    }}
                  >
                    {result === "correct" ? "NEXT STEP →" : "Close"}
                  </button>
                </div>
              </div>
            </div>
          )}
          {showMentorModal && onAskMentorResolved && (
            <div
              style={{
                position: "fixed",
                inset: 0,
                zIndex: 11011,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "rgba(15, 23, 42, 0.5)",
                padding: "24px",
                boxSizing: "border-box",
              }}
              onClick={() => setShowMentorModal(false)}
              role="dialog"
              aria-modal="true"
              aria-labelledby="mentor-modal-title"
            >
              <div
                style={{
                  background: "#ffffff",
                  borderRadius: "12px",
                  padding: "24px",
                  maxWidth: "580px",
                  width: "100%",
                  maxHeight: "85vh",
                  overflowY: "auto",
                  boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
                  border: "1px solid #e2e8f0",
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <div id="mentor-modal-title" style={{ fontSize: "12px", fontWeight: 700, letterSpacing: "0.05em", color: "#64748b", marginBottom: "8px" }}>ASK YOUR MENTOR</div>
                <p style={{ fontSize: "13px", color: "#475569", lineHeight: 1.5, margin: "0 0 16px" }}>
                  Ask about this step in your own words. You can send follow-up questions; the mentor keeps context for this step until you move on or clear the chat.
                </p>
                <div
                  style={{
                    maxHeight: "min(40vh, 320px)",
                    overflowY: "auto",
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
                    padding: "10px 12px",
                    marginBottom: "12px",
                    background: "#f8fafc",
                  }}
                  aria-label="Mentor conversation"
                >
                  {mentorThread.length === 0 ? (
                    <div style={{ fontSize: "12px", color: "#94a3b8", fontStyle: "italic" }}>Your messages and the mentor&apos;s replies will appear here.</div>
                  ) : (
                    mentorThread.map((turn, i) => (
                      <div
                        key={`${turn.role}-${i}`}
                        style={{
                          marginBottom: i < mentorThread.length - 1 ? "14px" : 0,
                          textAlign: turn.role === "user" ? "right" : "left",
                        }}
                      >
                        <div style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.06em", color: "#64748b", marginBottom: "4px" }}>
                          {turn.role === "user" ? "You" : "Mentor"}
                        </div>
                        <div
                          style={{
                            display: "inline-block",
                            textAlign: "left",
                            maxWidth: "100%",
                            padding: "10px 12px",
                            borderRadius: "8px",
                            background: turn.role === "user" ? "#e0f2fe" : "#ffffff",
                            border: turn.role === "user" ? "1px solid #bae6fd" : "1px solid #e2e8f0",
                            boxSizing: "border-box",
                          }}
                        >
                          <RichLearnerText text={turn.content} style={{ fontSize: "13px", color: "#334155", lineHeight: 1.55, whiteSpace: "pre-wrap" }} />
                        </div>
                      </div>
                    ))
                  )}
                </div>
                <textarea
                  value={mentorDraft}
                  onChange={(e) => setMentorDraft(e.target.value)}
                  placeholder={mentorThread.length ? "Ask a follow-up…" : "What would you like help with?"}
                  rows={4}
                  style={{
                    width: "100%",
                    boxSizing: "border-box",
                    padding: "12px 14px",
                    fontSize: "13px",
                    fontFamily: "inherit",
                    lineHeight: 1.5,
                    borderRadius: "8px",
                    border: "1px solid #e2e8f0",
                    resize: "vertical",
                    marginBottom: "12px",
                  }}
                />
                {mentorError ? <div style={{ fontSize: "12px", color: "#dc2626", marginBottom: "8px" }}>{mentorError}</div> : null}
                <div style={{ marginTop: "16px", display: "flex", justifyContent: "flex-end", gap: "12px", flexWrap: "wrap", alignItems: "center" }}>
                  <button
                    type="button"
                    style={{ ...s.btn("ghost"), marginRight: "auto" }}
                    disabled={mentorThread.length === 0 || mentorLoading}
                    onClick={() => {
                      setMentorThread([]);
                      setMentorError("");
                    }}
                  >
                    Clear chat
                  </button>
                  <button type="button" style={s.btn("ghost")} onClick={() => setShowMentorModal(false)}>Close</button>
                  <button
                    type="button"
                    className="inpact-btn-primary"
                    style={s.btn("primary")}
                    onClick={sendMentor}
                    disabled={!mentorDraft.trim() || mentorLoading}
                  >
                    {mentorLoading ? "Sending…" : "Send"}
                  </button>
                </div>
              </div>
            </div>
          )}
          {showTaskModal && !interfaceTourOpen && node?.type === "question" ? (
            <div
              style={{
                position: "fixed",
                inset: 0,
                zIndex: 11009,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "rgba(15, 23, 42, 0.5)",
                padding: "24px",
                boxSizing: "border-box",
              }}
              onClick={() => {
                if (taskModalHasThinkMcq) return;
                setShowTaskModal(false);
              }}
              role="dialog"
              aria-modal="true"
              aria-labelledby="task-modal-title"
            >
              {(() => {
                const hasThink =
                  typeof node?.think_prompt === "string" &&
                  Array.isArray(node?.mc_options) &&
                  node.mc_options.length >= 2 &&
                  typeof node?.mc_correct_option === "string";

                const selected = hasThink ? thinkSelection : null;
                const isCorrect = hasThink && selected != null && selected === node.mc_correct_option;

                if (!hasThink) {
                  return (
                    <div
                      style={{
                        background: "#ffffff",
                        borderRadius: "12px",
                        padding: "24px",
                        maxWidth: "640px",
                        width: "100%",
                        maxHeight: "80vh",
                        overflowY: "auto",
                        boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
                        border: "1px solid #e2e8f0",
                      }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div id="task-modal-title" style={{ ...s.paalLabel, marginBottom: "10px" }}>
                        TASK
                      </div>
                      <div style={s.expectedBox}>
                        <RichLearnerText text={node.paal || ""} variant="task" />
                      </div>
                      {node.hint ? (
                        <div style={{ ...s.hintBox, marginTop: "14px" }}>
                          <span aria-hidden>💡 </span>
                          <RichLearnerText as="span" text={buildHintOnlyGuidance(node)} variant="hint" style={{ display: "inline" }} />
                        </div>
                      ) : null}
                      <div style={{ marginTop: "20px", display: "flex", justifyContent: "flex-end" }}>
                        <button
                          type="button"
                          className="inpact-btn-primary"
                          style={s.btn("primary")}
                          onClick={() => setShowTaskModal(false)}
                        >
                          Continue to editor
                        </button>
                      </div>
                    </div>
                  );
                }

                const whyMatters = node.why_this_matters || "";
                const thinkPrompt = node.think_prompt || "";
                const options = node.mc_options || [];
                const anchor = node.mc_anchor || (isCorrect ? node.feedback_correct : node.feedback_wrong) || "";

                return (
                  <div
                    style={{
                      background: "#ffffff",
                      borderRadius: "12px",
                      padding: "18px",
                      maxWidth: "920px",
                      width: "100%",
                      maxHeight: "80vh",
                      overflowY: "auto",
                      boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
                      border: "1px solid #e2e8f0",
                    }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div
                      style={{
                        marginBottom: "14px",
                        padding: "10px 14px",
                        borderRadius: "8px",
                        border: "1px solid rgba(242,138,138,0.9)",
                        background: "#f28a8a",
                        color: "#0f172a",
                        fontSize: "18px",
                        lineHeight: 1.35,
                        fontWeight: 500,
                      }}
                    >
                      Pause before coding: Answer the quick thinking prompt first
                    </div>

                    {whyMatters ? (
                      <div style={{ marginBottom: "12px" }}>
                        <div style={{ fontSize: "10px", letterSpacing: "2px", color: "#0891b2", marginBottom: "8px", fontWeight: 800 }}>
                          WHY THIS MATTERS
                        </div>
                        <div style={{ fontSize: "14px", color: "#475569", lineHeight: 1.6 }}>{whyMatters}</div>
                      </div>
                    ) : null}

                    <div style={{ marginBottom: "12px" }}>
                      <div style={{ fontSize: "10px", letterSpacing: "3px", color: "#0891b2", marginBottom: "10px", fontWeight: 800 }}>
                        THINK
                      </div>
                      <div style={s.expectedBox}>
                        <RichLearnerText
                          text={thinkPrompt}
                          variant="task"
                          style={{ fontSize: "19px", lineHeight: 1.55, fontWeight: 700, color: "#0f172a" }}
                        />
                      </div>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "16px" }}>
                      {options.map((opt, idx) => {
                        const checked = selected != null;
                        const optIsCorrect = checked && opt === node.mc_correct_option;
                        const optIsWrongSel = checked && opt === selected && !optIsCorrect;
                        return (
                          <button
                            key={`${opt}-${idx}`}
                            type="button"
                            onClick={() => setThinkSelection(opt)}
                            style={{
                              textAlign: "left",
                              padding: "13px 16px",
                              borderRadius: "12px",
                              border: optIsCorrect
                                ? "2px solid rgba(16,185,129,0.9)"
                                : optIsWrongSel
                                  ? "2px solid rgba(239,68,68,0.9)"
                                  : selected === opt
                                    ? "2px solid rgba(8,145,178,0.75)"
                                    : "1px solid #dbeafe",
                              background: optIsCorrect
                                ? "rgba(16,185,129,0.08)"
                                : optIsWrongSel
                                  ? "rgba(239,68,68,0.06)"
                                  : selected === opt
                                    ? "rgba(8,145,178,0.04)"
                                    : "#f8fafc",
                              cursor: "pointer",
                              color: "#0f172a",
                              boxShadow:
                                optIsCorrect || optIsWrongSel || selected === opt
                                  ? "0 4px 10px rgba(15,23,42,0.08)"
                                  : "0 1px 3px rgba(15,23,42,0.06)",
                              fontSize: "14px",
                              fontWeight: 500,
                              transition: "background 0.15s ease, border-color 0.15s ease, box-shadow 0.15s ease",
                            }}
                          >
                            {opt}
                          </button>
                        );
                      })}
                    </div>

                    {selected != null ? (
                      <div style={{ marginBottom: "14px" }}>
                        <div
                          style={{
                            fontSize: "12px",
                            padding: "10px 12px",
                            borderRadius: "10px",
                            background: isCorrect ? "rgba(16,185,129,0.08)" : "rgba(239,68,68,0.06)",
                            border: `1px solid ${isCorrect ? "rgba(16,185,129,0.35)" : "rgba(239,68,68,0.25)"}`,
                            color: isCorrect ? "#059669" : "#dc2626",
                            lineHeight: 1.5,
                            fontWeight: 700,
                          }}
                        >
                          {isCorrect ? "Correct" : "Not quite"}: {anchor}
                        </div>
                      </div>
                    ) : null}

                    <div style={{ marginTop: "6px" }}>
                      <div style={{ fontSize: "10px", letterSpacing: "2px", color: "#0891b2", marginBottom: "10px", fontWeight: 800 }}>
                        NOW CODE
                      </div>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                        <button
                          type="button"
                          className="inpact-btn-primary"
                          style={s.btn("primary")}
                          disabled={!isCorrect}
                          onClick={() => {
                            setShowTaskModal(false);
                            setMainTab("editor");
                          }}
                        >
                          Continue to editor
                        </button>
                        <button
                          type="button"
                          className="inpact-btn-primary"
                          style={s.btn("ghost")}
                          onClick={() => {
                            setShowMentorModal(true);
                            setMentorError("");
                          }}
                        >
                          Need help?
                        </button>
                        <button
                          type="button"
                          className="inpact-btn-primary"
                          style={s.btn("secondary")}
                          onClick={() => {
                            openStepExampleModal();
                          }}
                        >
                          Show me a simpler version
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          ) : null}
        </>
      );
    }

    function renderEditorContent({ fillViewport = false } = {}) {
      const rawFb = result === "correct" ? node.feedback_correct : result === "partial" ? node.feedback_partial : result === "wrong" ? node.feedback_wrong : null;
      const staticFbMsg = typeof rawFb === "function" ? rawFb(answer) : rawFb;
      const feedbackPlainForAnnotate = String(aiFeedback || staticFbMsg || "").trim();
      const fbMsg = buildFeedbackOnlyGuidance(feedbackPlainForAnnotate);
      return (
        <div style={{ display: "flex", flexDirection: "column", flex: 1, minHeight: 0, width: "100%", maxWidth: "100%", overflowX: "hidden" }}>
          <div
            style={{
              flex: 1,
              minHeight: 0,
              overflowY: fillViewport ? "hidden" : "auto",
              overflowX: "hidden",
              maxWidth: "100%",
              display: fillViewport ? "flex" : "block",
              flexDirection: fillViewport ? "column" : undefined,
            }}
          >
            {renderEditorBlockScrollable(fillViewport)}
          </div>
          <div
            style={{
              flexShrink: 0,
              paddingTop: fillViewport ? "10px" : "20px",
              marginTop: fillViewport ? "4px" : "8px",
              borderTop: "1px solid #e2e8f0",
            }}
          >
            {validationFallbackNote ? (
              <RichLearnerText
                text={validationFallbackNote}
                style={{
                  fontSize: "11px",
                  color: "#b45309",
                  marginBottom: "10px",
                  padding: "8px 12px",
                  background: "rgba(245,158,11,0.12)",
                  borderRadius: "6px",
                  lineHeight: 1.5,
                }}
              />
            ) : null}
            {renderEditorBlockButtons(fbMsg, feedbackPlainForAnnotate)}
          </div>
        </div>
      );
    }

    function renderComplete() {
      return (
        <div style={s.completeBanner}>
          <div style={{ fontSize: "48px", marginBottom: "24px" }}>🎯</div>
          <h1 style={{ ...s.h1, textAlign: "center" }}>Lesson #{lessonNum} Complete</h1>
          <p style={{ color: "#4a5568", fontSize: "13px" }}>{title} done. Ready for the Next Lesson.</p>
          {onNextLesson && <div style={s.btnRow}><button type="button" className="inpact-btn-primary" style={s.btn("primary")} onClick={onNextLesson}>Next Lesson →</button></div>}
        </div>
      );
    }

    function renderNode() {
      if (nodeIndex >= NODES.length) return renderComplete();
      switch (node.type) {
        case "reveal": return renderReveal();
        case "objectives": return renderObjectives();
        case "question": return renderEditorContent();
        default: return renderReveal();
      }
    }

    const showLesson1TourSkipBar =
      isReactTsLesson1TourEntry &&
      lesson1TourPrefSnapshot !== "completed" &&
      lesson1TourPrefSnapshot !== "recapOnly";
    const interfaceTourInitialStepIndex =
      effectiveTourTrack === "react-ts" && Number(lessonNum) === 1 ? lesson1TourStartIndex : 0;

    return (
      <div style={s.wrap}>
        <button
          type="button"
          className="inpact-help-tour-button"
          data-tour-id="help-tour-button"
          style={s.helpTourBtn}
          title="Replay the interface walkthrough"
          onClick={() => {
            setLesson1TourStartIndex(0);
            setTourLaunchNonce((v) => v + 1);
          }}
        >
          Help: Tour
        </button>
        <style>{`
          @media (max-width: 768px) {
            .inpact-sidebar { display: none !important; }
            .inpact-main { min-width: 100vw !important; max-width: 100vw !important; padding-left: 16px !important; padding-right: 16px !important; }
          }
        `}</style>
        <div style={s.body}>
          <div
            className="inpact-sidebar"
            style={{
              ...s.sidebar,
              width: sidebarCollapsed ? 48 : 240,
              minWidth: sidebarCollapsed ? 48 : 240,
              transition: "width 0.2s ease, min-width 0.2s ease",
              padding: sidebarCollapsed ? "12px 0" : "20px 0",
              display: "flex",
              flexDirection: "column",
              boxSizing: "border-box",
            }}
          >
            {sidebarCollapsed ? (
              <button
                type="button"
                aria-expanded={false}
                aria-label="Expand lesson steps"
                title="Show steps"
                onClick={() => setSidebarCollapsed(false)}
                style={{
                  alignSelf: "stretch",
                  minHeight: "140px",
                  margin: "0 6px",
                  border: "1px solid #bae6fd",
                  borderRadius: "8px",
                  background: "#e0f2fe",
                  color: "#075985",
                  cursor: "pointer",
                  fontSize: "11px",
                  fontWeight: 700,
                  letterSpacing: "0.12em",
                  writingMode: "vertical-rl",
                  textOrientation: "mixed",
                  padding: "12px 6px",
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                STEPS ›
              </button>
            ) : (
              <>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "8px",
                    padding: "0 12px 10px 16px",
                    flexShrink: 0,
                  }}
                >
                  <div style={{ ...s.sidebarLabel, padding: 0, marginBottom: 0 }}>PROGRESS</div>
                  <button
                    type="button"
                    aria-expanded={true}
                    aria-label="Collapse lesson steps"
                    title="Hide steps"
                    onClick={() => setSidebarCollapsed(true)}
                    style={{
                      border: "1px solid #cbd5e1",
                      background: "#ffffff",
                      borderRadius: "6px",
                      padding: "4px 8px",
                      cursor: "pointer",
                      fontSize: "14px",
                      lineHeight: 1,
                      color: "#64748b",
                    }}
                  >
                    ‹
                  </button>
                </div>
                {sideItems.map((item, i) => {
                  const isActive = NODES[nodeIndex]?.id === item.id || (nodeIndex >= NODES.length && i === sideItems.length - 1);
                  const isDone = completedNodes.includes(item.id);
                  return (
                    <div key={item.id} style={s.sideItem(isActive, isDone)} onClick={() => setNodeIndex(i)} role="button" tabIndex={0} onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setNodeIndex(i); } }}>
                      <div style={s.sideItemDot(isActive, isDone)} /><div style={s.sideItemText(isActive, isDone)}>{item.label}</div>
                    </div>
                  );
                })}
              </>
            )}
          </div>
          <div ref={mainScrollRef} className="inpact-main" style={{ ...s.main, overflowY: "auto" }}>
            {node?.type === "question" || useReactTsLesson1TabsShell ? (
              <LessonEditorOutputTabs
                node={node}
                nodes={NODES}
                mainTab={mainTab}
                setMainTab={setMainTab}
                lessonTrack={lessonCtxTrack ?? effectiveTourTrack}
                lessonNum={lessonNum}
                taskInstructionPulseNonce={taskInstructionPulseNonce}
                answer={answer}
                previewCode={answerShape === "multi-file" ? getMultiFilePreviewCode(answer) : undefined}
                getOutputPreview={getOutputPreview ?? (answerShape === "angular-tabs" ? (ans) => {
                  try {
                    const p = typeof ans === "string" ? JSON.parse(ans || "{}") : ans;
                    const html = (p?.html ?? "").trim();
                    const css = (p?.css ?? "").trim();
                    return `<!DOCTYPE html><html><head><meta charset="utf-8"><style>${css}</style></head><body>${html || "<p>Add markup in the HTML tab to see a preview.</p>"}</body></html>`;
                  } catch (_) { return "<!DOCTYPE html><html><body><p>Invalid answer format.</p></body></html>"; }
                } : undefined)}
                lessonIntro={lessonIntro}
                lessonObjectives={lessonObjectives}
                omitObjectivesFromLessonTab={node?.type === "reveal" && node?.id === "intro"}
                preQuestionFooter={
                  useReactTsLesson1TabsShell && node?.type === "reveal" ? (
                    <div style={s.btnRow}>
                      <button type="button" className="inpact-btn-primary" style={s.btn("primary")} onClick={next}>
                        CONTINUE →
                      </button>
                    </div>
                  ) : useReactTsLesson1TabsShell && node?.type === "objectives" ? (
                    <div style={s.btnRow}>
                      <button
                        type="button"
                        className="inpact-btn-primary"
                        style={s.btn("primary")}
                        data-inpact-lesson-lets-build="true"
                        onClick={() => {
                          next();
                          setMainTab("editor");
                          setEditorWorkspaceOpen(true);
                        }}
                      >
                        LET&apos;S BUILD →
                      </button>
                    </div>
                  ) : null
                }
                useEditorWorkspaceModal
                editorWorkspaceOpen={editorWorkspaceOpen}
                onOpenEditorWorkspace={() => setEditorWorkspaceOpen(true)}
                onCloseEditorWorkspace={() => setEditorWorkspaceOpen(false)}
                editorWorkspaceTitle={
                  node?.type === "question" ? `${title} · Step ${codingStepNum} of ${codingStepTotal}` : title
                }
                editorProgress={{
                  items: sideItems,
                  activeNodeIndex: nodeIndex,
                  completedIds: completedNodes,
                  onSelectIndex: setNodeIndex,
                }}
              >
                {node?.type === "question" ? (
                  renderEditorContent({ fillViewport: true })
                ) : (
                  <div
                    style={{
                      flex: 1,
                      minHeight: "min(40vh, 360px)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: "28px 20px",
                      color: "#64748b",
                      fontSize: "14px",
                      lineHeight: 1.6,
                      textAlign: "center",
                      boxSizing: "border-box",
                    }}
                  >
                    Open <strong style={{ color: "#0891b2" }}>Editor</strong> after you start Step 1 — the workspace preview opens here for the interface tour and for coding.
                  </div>
                )}
              </LessonEditorOutputTabs>
            ) : (
              renderNode()
            )}
          </div>
        </div>
        <InterfaceTour
          steps={interfaceTourSteps}
          onRequestAction={handleTourAction}
          forceStartNonce={tourLaunchNonce}
          lessonKey={`${lessonNum}:${title}`}
          blockTour={tourDismissForStackingModals}
          initialStepIndex={interfaceTourInitialStepIndex}
          onOpenChange={setInterfaceTourOpen}
          onLastStepDone={handleLesson1TourLastStepDone}
        />
        {showLesson1TourSkipBar
          ? createPortal(
              <div
                role="region"
                aria-label="Interface tour options"
                style={{
                  position: "fixed",
                  left: "50%",
                  bottom: "20px",
                  transform: "translateX(-50%)",
                  zIndex: 12180,
                  maxWidth: "min(520px, calc(100vw - 32px))",
                  padding: "12px 16px",
                  borderRadius: "12px",
                  background: "#f8fafc",
                  border: "1px solid #e2e8f0",
                  boxShadow: "0 12px 32px rgba(15, 23, 42, 0.18)",
                  fontFamily: "'DM Sans', sans-serif",
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                  alignItems: "stretch",
                }}
              >
                <p style={{ margin: 0, fontSize: "13px", lineHeight: 1.55, color: "#334155" }}>
                  If you have used this workspace before, you can skip the full guided tour. You will still see a short
                  recap that points to Help: Tour so you know how to reopen the walkthrough later.
                </p>
                <button
                  type="button"
                  onClick={skipLesson1InterfaceTourToRecap}
                  style={{
                    alignSelf: "flex-end",
                    padding: "8px 14px",
                    fontSize: "13px",
                    fontWeight: 600,
                    borderRadius: "8px",
                    border: "1px solid #bae6fd",
                    background: "#e0f2fe",
                    color: "#075985",
                    cursor: "pointer",
                  }}
                >
                  Skip full tour — show recap only
                </button>
              </div>,
              document.body
            )
          : null}
      </div>
    );
  };
}
