/**
 * The one trade/skill matching predicate — used by MatchingQueue.jsx (Core Studio's manual
 * override/fallback view) AND server/recruit-router.js (automatic matching at application time).
 * Pure data-in/data-out, no React, no browser APIs — safe to import from server code directly.
 * Keeping this in one file is deliberate: this logic used to be duplicated in MatchingQueue.jsx
 * alone, and duplicating it again into the server would be exactly the kind of drift
 * onedev-client.js's own top comment warns about (auth header/base URL drifting apart between
 * files) — same risk here with "who's eligible for what."
 */
import { levelRank, isUnlocked } from "./skillLevels.js";

export const COHORT_PROJECT_ID = 2;
export const TEAM_OPS_PROJECT_ID = 3;
export const MODULE_LIBRARY_PROJECT_ID = 4;
// IPF's own bookkeeping projects — never real assignable work, even though they hold real OneDev
// issues (cohort-applications, team-ops, module-library).
export const RESERVED_PROJECT_IDS = new Set([COHORT_PROJECT_ID, TEAM_OPS_PROJECT_ID, MODULE_LIBRARY_PROJECT_ID]);

// Founder call 2026-08-09: Product design is purely -core work for now (PD-core does it directly,
// not a JS-assignable trade) — not offered on Apply yet, even though PD Studio/SpecForge can still
// tag a task's trade as "Product design" (that's fine; it just means no JS applicant is ever
// eligible for it until this list changes). Lowercase, matches KNOWN_TRADE_COPY's key convention.
export const CORE_ONLY_TRADES = new Set(["product design"]);

export function isCoreOnlyTrade(trade) {
  return CORE_ONLY_TRADES.has((trade || "").toLowerCase());
}

/** Pulls "ApplicationId: N" out of a match-log issue's description. */
export function extractApplicationId(description) {
  const m = /ApplicationId:\s*(\d+)/.exec(description || "");
  return m ? Number(m[1]) : null;
}

/** A task is only assignable once it's wired to a tutorial (or was created outside the SpecForge
 * pipeline and never carried the marker at all). Anything explicitly flagged NeedsTutorial: true
 * stays unassignable until ID Studio publishes the module it's waiting on. */
export function isAssignable(task) {
  return !/^NeedsTutorial:\s*true/m.test(task.description || "");
}

export function taskMeta(description) {
  const trade = /^Trade:\s*(.+)$/m.exec(description || "")?.[1]?.trim() || null;
  const techLevel = /^TechLevel:\s*(.+)$/m.exec(description || "")?.[1]?.trim() || null;
  return { trade, techLevel };
}

export function parseApplication(app) {
  return Object.fromEntries(
    (app.description || "")
      .split("\n")
      .map((l) => l.split(": "))
      .filter((parts) => parts.length >= 2)
      .map(([k, ...rest]) => [k.trim(), rest.join(": ").trim()])
  );
}

/** Has this person already closed out a task tagged TechLevel: js? That's what unlocks TS/advanced
 * work for them going forward — checked by name, since there's no login system to key off of yet.
 * `matches` = Matched: issues, `allIssues` = every issue unfiltered (for the closed-task lookup). */
export function hasCompletedJsTask(name, matches, allIssues) {
  return matches.some((m) => {
    const matchedName = /Matched: (.+?) →/.exec(m.title)?.[1];
    if (matchedName !== name) return false;
    const taskId = Number(/TaskId:\s*(\d+)/.exec(m.description || "")?.[1]);
    if (!taskId) return false;
    const task = allIssues.find((i) => i.id === taskId);
    if (!task || task.state === "Open") return false;
    return taskMeta(task.description).techLevel === "js";
  });
}

/** Most recent Core-Studio-logged aspiration for this name, if any — overrides whatever was stated
 * at application time, since interests genuinely change after someone starts working. */
export function latestAspirationLevel(name, appAspiration, aspirationIssues) {
  const forName = aspirationIssues
    .filter((i) => i.title === `Aspiration: ${name}`)
    .sort((a, b) => new Date(b.submitDate) - new Date(a.submitDate));
  const fromCheckIn = forName[0] ? /^Level:\s*(.+)$/m.exec(forName[0].description || "")?.[1]?.trim() : null;
  return fromCheckIn || appAspiration || null;
}

/** The ceiling of tech_level work this applicant can be placed on right now. Two tiers only:
 * everyone starts on JS-tier work; TS/advanced unlocks once they've either said so themselves
 * (stated level or aspiration) or proven it by finishing one JS-tagged task. `info` is a parsed
 * application (parseApplication's output or the equivalent freshly-submitted fields). */
export function effectiveCeiling(info, { matches, allIssues, aspirationIssues }) {
  const name = info.Name;
  const statedLevel = info.SkillLevel;
  if (!statedLevel) return null; // not a Coding application — no tech-level gate applies at all
  const aspiration = latestAspirationLevel(name, info.Aspiration, aspirationIssues);
  const unlocked =
    levelRank(statedLevel) >= levelRank("ts") ||
    levelRank(aspiration) >= levelRank("ts") ||
    hasCompletedJsTask(name, matches, allIssues);
  return unlocked ? "advanced" : "js";
}

/** TaskIds already claimed by a Matched: issue — one open task may never be handed to a second
 * applicant (found 2026-08-09 while building low-supply alerts: bestTaskMatch used to ignore this
 * and re-place people onto already-matched work). Matching Queue uses the same filter via
 * tasksForApplicant so the manual fallback can't recreate the bug by hand. */
export function matchedTaskIds(matches) {
  return new Set(
    (matches || [])
      .map((m) => Number(/TaskId:\s*(\d+)/.exec(m.description || "")?.[1]))
      .filter(Boolean)
  );
}

/** Tasks with no Trade: marker (hand-created in Workbench, outside the SpecForge pipeline) stay
 * visible to everyone — same "don't silently break the manual path" rule Workbench itself uses.
 * `assignableTasks` should already be filtered to isAssignable + Open + non-reserved-project.
 * Already-matched tasks are always excluded (see matchedTaskIds). */
export function tasksForApplicant(info, assignableTasks, { matches, allIssues, aspirationIssues }) {
  const trade = info["Stated trade"];
  const ceiling = effectiveCeiling(info, { matches, allIssues, aspirationIssues });
  const taken = matchedTaskIds(matches);
  return assignableTasks.filter((t) => {
    if (taken.has(t.id)) return false;
    const meta = taskMeta(t.description);
    if (!meta.trade) return true;
    if (trade && meta.trade.toLowerCase() !== trade.toLowerCase()) return false;
    if (meta.techLevel) return isUnlocked(meta.techLevel, ceiling || "js");
    return true;
  });
}

/** The single entry point automatic matching uses: given a freshly-submitted application's info and
 * the current state of the world, returns the task to place them on, or null if nothing fits yet
 * (stays queued — Matching Queue's manual view remains the fallback for that case). First eligible
 * task wins (oldest task first, tasks are already in ascending-id order from OneDev) — no richer
 * scoring signal exists yet, same "first real match, not a ranked guess" spirit as the manual flow. */
export function bestTaskMatch(info, { tasks, matches, allIssues, aspirationIssues }) {
  const eligible = tasksForApplicant(info, tasks, { matches, allIssues, aspirationIssues });
  return eligible[0] || null;
}
