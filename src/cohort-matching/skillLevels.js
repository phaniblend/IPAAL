/**
 * Shared coding skill-level taxonomy — the one vocabulary Apply, SpecForge's task tagging, and
 * Matching Queue's gating logic all agree on. Only "Coding" trade uses this; every other trade
 * (Product design, PM, QA, Content) stays a free label with no level gate, same as before.
 *
 * Applicant-side levels include "framework" (fluent in React/Angular/Vue day-to-day) as the top
 * rung; task-side tech_level tops out at "advanced" instead — same rank, different word, because
 * "what a task needs" and "how a person describes themselves" are naturally different phrasings
 * of the same ceiling.
 */
export const SKILL_LEVELS = [
  { value: "none", label: "None yet", blurb: "Never written code — you'd start with HTML/CSS fundamentals." },
  { value: "html-css", label: "HTML & CSS", blurb: "I can build a static page layout." },
  { value: "js", label: "JavaScript", blurb: "I can write functions, handle events, work with the DOM or basic React." },
  { value: "ts", label: "TypeScript", blurb: "I've used type annotations, interfaces, generics." },
  { value: "framework", label: "Framework-fluent", blurb: "Comfortable in React/Angular/Vue beyond the basics." },
];

export const TASK_TECH_LEVELS = [
  { value: "html-css", label: "HTML/CSS" },
  { value: "js", label: "JavaScript" },
  { value: "ts", label: "TypeScript" },
  { value: "advanced", label: "Advanced" },
];

const RANK = { none: 0, "html-css": 1, js: 2, ts: 3, advanced: 4, framework: 4 };

export function levelRank(level) {
  return RANK[level] ?? 0;
}

/** A task's tech_level is unlocked for an applicant at `effectiveLevel` if the applicant's rank
 * meets or exceeds the task's. Non-Coding tasks (no techLevel at all) are always unlocked — the
 * gate only applies where a real skill ladder exists. */
export function isUnlocked(taskTechLevel, effectiveLevel) {
  if (!taskTechLevel) return true;
  return levelRank(effectiveLevel) >= levelRank(taskTechLevel);
}
