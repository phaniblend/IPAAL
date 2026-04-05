/**
 * Live branch: category counts for React · TS locked catalog only.
 */
import { REACT_TS_LIVE_LESSON_COUNT } from "./reactTsLiveScope.js";

/** Human-readable labels (landing may still reference one track). */
export const TRACK_LABELS = {
  "react-ts": "React · TS",
};

const CATEGORY_ORDER = ["react-ts"];

/**
 * @param {string} track
 * @param {{ reactListLength?: number }} [options]
 * @returns {number}
 */
export function getLessonCount(track, options = {}) {
  if (track === "react-ts" && options.reactListLength != null) {
    return options.reactListLength;
  }
  if (track === "react-ts") {
    return REACT_TS_LIVE_LESSON_COUNT;
  }
  return 0;
}

/**
 * @param {{ reactListLength?: number }} [options]
 * @returns {{ id: string, label: string, count: number }[]}
 */
export function getCategoryCounts(options = {}) {
  return CATEGORY_ORDER.map((id) => ({
    id,
    label: TRACK_LABELS[id] ?? id,
    count: getLessonCount(id, options),
  }));
}
