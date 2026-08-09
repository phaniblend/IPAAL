/**
 * Task -> real IAAL-main core lesson matching. Thin-slice version of the matcher designed in
 * §5a-4 of the devguide: text-overlap only for now (concept/framework/difficulty/prereq scoring
 * from the full spec is a fast-follow once this routing mechanism is proven live), reusing
 * scoreOverlap — the same scorer matchModules.js already uses for IPF's own Module Library, so
 * "close enough" means the same thing everywhere a task gets paired with teaching content.
 */
import { scoreOverlap } from "./matchModules.js";
import manifest from "./coreLessonManifest.json" with { type: "json" };

// Matches matchModules.js's bestModuleMatch threshold (0.45) — same scorer, same notion of
// "confident enough to auto-route," calibrated against real task-title-length queries. Live-tested
// against real Restaurant Inventory Manager task titles: keyword overlap alone has a real precision
// ceiling — a task's domain-specific words ("Ingredient") don't appear in the deliberately generic
// lesson titles/concepts, so a semantically-good match can still score low. A CURATED band below
// the auto threshold surfaces those as suggestions rather than silently dropping them; nothing below
// it is worth showing at all. Real concept-based scoring (the full §5a-4 spec's weighted model) is
// the actual fix for the ceiling — this is the honest interim.
const CONFIDENCE_AUTO = 0.45;
// Lowered from an initial 0.2 after live-testing against a real task's actual AcceptanceCriteria
// text (longer and more varied vocabulary than a short title): a genuinely sensible top match
// ("Load, edit, and save an existing record" for an add/edit/delete-ingredient task) scored only
// 0.143 — real content dilutes scoreOverlap's fraction just by being longer, not because the match
// is wrong. 0.1 keeps near-zero noise out while not dropping real, verbose-task matches like this one.
const CONFIDENCE_CURATED = 0.1;

/** query -> ranked lessons from the manifest, highest score first. */
export function rankCoreLessons(query) {
  return manifest.entries
    .map((entry) => ({ ...entry, score: scoreOverlap(query, entry.matchText) }))
    .filter((m) => m.score > 0)
    .sort((a, b) => b.score - a.score);
}

/** Best match only, or null if nothing clears the confidence bar. */
export function bestCoreLessonMatch(query) {
  const ranked = rankCoreLessons(query);
  const top = ranked[0];
  return top && top.score >= CONFIDENCE_AUTO ? top : null;
}

/** { auto } if confident, else { curated: [...] } (top 3 below auto but above the curated floor),
 * else { none: true }. This is what a UI should actually branch on — auto-route vs. offer choices
 * vs. nothing worth showing. */
export function matchCoreLesson(query) {
  const ranked = rankCoreLessons(query);
  const top = ranked[0];
  if (top && top.score >= CONFIDENCE_AUTO) return { auto: top };
  const curated = ranked.filter((m) => m.score >= CONFIDENCE_CURATED).slice(0, 3);
  if (curated.length > 0) return { curated };
  return { none: true };
}

export function coreLessonManifestMeta() {
  return { generatedAt: manifest.generatedAt, count: manifest.count };
}

/** Looks up one manifest entry by its stable lessonKey. Used server-side to validate a
 * client-selected lesson before creating a real assistance session for it — the client only ever
 * sees lessonKeys this server itself returned from a match, but the session-creation endpoint
 * re-derives the canonical URL from here rather than trusting whatever URL the client sends back,
 * per the "a client-provided redirect is not authoritative" rule in docs/IPF_DEVGUIDE.md §5a-4. */
export function lessonByKey(lessonKey) {
  return manifest.entries.find((e) => e.lessonKey === lessonKey) || null;
}
