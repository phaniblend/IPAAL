import reactTs from "./glossary/react-ts.json";
import reactJs from "./glossary/react-js.json";
import reactTsExtendedDeepDives from "../../content/react-ts/000_deep_dives.json";

const PACKS = {
  "react-ts": reactTs,
  "react-js": reactJs,
};

/**
 * React · TS extended dives: `content/react-ts/000_deep_dives.json`. Keys like `001_Counter_App` → problemNum 1.
 * Optional `introductionStepId` (default `step1`) registers the dive on that step; other steps get the
 * same dive via `byProblem` fallback — unless `showDeepDiveInIntro` is true (then only the Lesson intro shows it).
 */
const { REACT_TS_EXTENDED_BY_PROBLEM_AND_STEP, REACT_TS_EXTENDED_BY_PROBLEM, REACT_TS_INTRO_DEEP_DIVE_BY_PROBLEM } =
  (() => {
    /** @type {Record<string, { id: string, label: string, deepDive: object }>} */
    const map = Object.create(null);
    /** @type {Record<number, { id: string, label: string, deepDive: object }>} */
    const byProblem = Object.create(null);
    /** @type {Record<number, { id: string, label: string, deepDive: object }>} */
    const introByProblem = Object.create(null);
    for (const [key, entry] of Object.entries(reactTsExtendedDeepDives || {})) {
      const m = String(key).match(/^0*(\d+)_/);
      if (!m || !entry?.deepDive) continue;
      const n = Number(m[1]);
      const item = {
        id: key,
        label: entry.label || key,
        deepDive: entry.deepDive,
      };
      if (entry.showDeepDiveInIntro === true) {
        introByProblem[n] = item;
        continue;
      }
      const stepId =
        typeof entry.introductionStepId === "string" && entry.introductionStepId.trim()
          ? entry.introductionStepId.trim()
          : "step1";
      map[`${n}::${stepId}`] = item;
      byProblem[n] = item;
    }
    return {
      REACT_TS_EXTENDED_BY_PROBLEM_AND_STEP: map,
      REACT_TS_EXTENDED_BY_PROBLEM: byProblem,
      REACT_TS_INTRO_DEEP_DIVE_BY_PROBLEM: introByProblem,
    };
  })();

/**
 * @param {string} track
 * @param {number} problemNum
 * @param {string} stepId
 * @param {string[]|undefined} nodeIntroduces - from step JSON `introducesConcepts`, copied to node
 * @returns {{ id: string, label: string, deepDive: Record<string, string> }[]}
 */
export function getDeepDiveConceptsForStep(track, problemNum, stepId, nodeIntroduces) {
  const chosenPack = PACKS[track];
  const packs = chosenPack ? [chosenPack] : Object.values(PACKS).filter(Boolean);
  if (!packs.length) return [];

  const pNum = problemNum == null ? null : Number(problemNum);
  const ids = new Set();
  for (const pack of packs) {
    for (const row of pack.introductions || []) {
      const rowP = row.problemNum == null ? null : Number(row.problemNum);
      if (pNum != null && rowP === pNum && row.stepId === stepId) {
        ids.add(row.conceptId);
      }
    }
  }
  for (const id of nodeIntroduces || []) {
    if (typeof id === "string" && id.trim()) ids.add(id.trim());
  }

  const out = [];
  for (const id of ids) {
    const c = packs.map((p) => p?.concepts?.[id]).find(Boolean);
    if (!c?.deepDive) continue;
    out.push({
      id,
      label: c.label || id,
      deepDive: c.deepDive,
    });
  }

  if (track === "react-ts" && pNum != null && stepId) {
    let ext = REACT_TS_EXTENDED_BY_PROBLEM_AND_STEP[`${pNum}::${stepId}`];
    if (!ext?.deepDive) ext = REACT_TS_EXTENDED_BY_PROBLEM[pNum];
    if (ext?.deepDive && !out.some((o) => o.id === ext.id)) {
      out.push(ext);
    }
  }

  return out;
}

/** Lowercase alphanumerics only — compare lesson titles to extended JSON keys like `029_useDebounce`. */
function normalizedLessonTitleSlug(s) {
  return String(s ?? "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "");
}

/**
 * Lesson-level deep dive (intro surfaces). Opt-in: `showDeepDiveInIntro: true` in `000_deep_dives.json`.
 * Resolves by `problemNum` first, then by matching `lessonTitle` to the key suffix (e.g. useDebounce ↔ 029_useDebounce).
 *
 * @param {string} track
 * @param {number|null|undefined} problemNum - from engine config when known
 * @param {string|null|undefined} lessonTitle - e.g. list title or intro.title (covers list index ≠ problemNum)
 * @returns {{ id: string, label: string, deepDive: Record<string, string> } | null}
 */
export function getIntroDeepDiveConcept(track, problemNum, lessonTitle) {
  if (track !== "react-ts") return null;
  const pNum = problemNum == null || problemNum === "" ? null : Number(problemNum);
  if (pNum != null && !Number.isNaN(pNum)) {
    const byNum = REACT_TS_INTRO_DEEP_DIVE_BY_PROBLEM[pNum];
    if (byNum?.deepDive) return byNum;
  }
  const norm = normalizedLessonTitleSlug(lessonTitle);
  if (!norm) return null;
  for (const [key, entry] of Object.entries(reactTsExtendedDeepDives || {})) {
    if (entry.showDeepDiveInIntro !== true || !entry?.deepDive) continue;
    const km = String(key).match(/^0*\d+_(.+)$/);
    if (!km) continue;
    const slug = km[1].toLowerCase().replace(/[^a-z0-9]+/g, "");
    if (!slug) continue;
    if (slug === norm || norm.includes(slug) || slug.includes(norm)) {
      return {
        id: key,
        label: entry.label || key,
        deepDive: entry.deepDive,
      };
    }
  }
  return null;
}

export function glossarySupportsDeepDive(track) {
  return Boolean(PACKS[track]?.concepts && Object.keys(PACKS[track].concepts).length > 0);
}
