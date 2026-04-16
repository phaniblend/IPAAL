/**
 * Redux ∪ RTK (union): curriculum indices (0-based, same order as LESSON_LIST / ENGINES_TS)
 * for lessons that belong in the Redux track on the landing page.
 *
 * Verified against engines / JSON — not from titles alone:
 * - 72: `inpact_ts76_engine.jsx` — Mini Redux (useReducer + Context + useSyncExternalStore selector).
 * - 117: `react-ts/inpact_p124_engine.jsx` — createSlice, createAsyncThunk, configureStore (@reduxjs/toolkit).
 * - 118: `react-ts/inpact_p125_engine.jsx` — RTK Query (createApi, fetchBaseQuery, hooks).
 * - 119–121: `inpact_ts120/121/122_engine.jsx` + `content/react-ts/120_*.json` … `122_*.json` — RTK endpoints, query builder, createAsyncThunk from scratch.
 *
 * Intentionally excluded: index 42 — `inpact_ts46_engine.jsx` teaches React useReducer vs useState
 * (complex form state), not Redux/RTK libraries.
 */
export const REDUX_RTK_LESSON_INDICES = new Set([72, 117, 118, 119, 120, 121]);

export function isReduxRtkLessonIndex(i) {
  return REDUX_RTK_LESSON_INDICES.has(i);
}

/**
 * Landing-page subsections under “Redux (Toolkit & RTK)” — each group lists curriculum indices in display order.
 */
export const REDUX_LANDING_SUBSECTIONS = [
  { key: "redux-pattern-mini", title: "Reducer pattern (before Toolkit)", indices: [72] },
  { key: "redux-toolkit-rtk-query", title: "Redux Toolkit & RTK Query", indices: [117, 118] },
  { key: "redux-rtk-hands-on", title: "RTK endpoints, queries & async", indices: [119, 120, 121] },
];
