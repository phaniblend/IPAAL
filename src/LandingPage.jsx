import { useState, useEffect } from "react";
import InpactLogo from "./components/InpactLogo.jsx";
import { getLessonCount, TRACK_LABELS } from "./trackLessonCounts.js";
import { FUNDA_ANGULAR_LESSONS } from "./angularFundaLessons.js";
import { MOBILE_ANGULAR_LESSONS } from "./mobileAngularLessons.js";

// Must match ENGINES order in App.jsx (p01…p100 minus 10/16/17/88, then p101–p110, p113–p125, p126–p127; React TS adds TS120–TS122).
export const LESSON_LIST = [
  "Counter App", "Toggle Visibility", "Controlled Input", "Multiple State Variables",
  "Conditional Rendering with Ternary", "List Rendering with map()", "useEffect & Side Effects", "Forms & Validation",
  "Color Picker", "Reusable Button", "Card Component",
  "Props Drilling", "Default Props", "Children Prop",
  "PropTypes / TypeScript Interface", "Component Composition", "Event Handling",
  "Conditional Classes", "Inline Styles", "CSS Modules", "Styled Component Pattern",
  "Lifting State Up", "Controlled vs Uncontrolled", "Simple Todo List", "Star Rating Component",
  "Accordion", "Image Gallery",
  "useFetch", "useDebounce", "useLocalStorage", "useToggle", "useWindowSize", "usePrevious", "useClickOutside", "useKeyPress", "useOnlineStatus", "useMediaQuery",
  "Theme Context", "Auth Context", "Cart Context", "Notification Context", "Context Performance", "useReducer vs useState", "Compound Component (Tabs)",
  "Unnecessary Re-renders", "useMemo for Expensive Computation", "useCallback for Stable References", "React.memo", "List Virtualization", "Lazy Loading Routes", "Image Lazy Loading",
  "HOC withAuth", "Render Props (MouseTracker)", "Controlled DatePicker", "Portal", "Error Boundary", "Recursive TreeView", "Pagination", "Infinite Scroll", "Debounced Search", "Multi-Step Form",
  "Generic List<T>", "Discriminated Union Props", "useRef Typing", "Event Typing", "Generic useFetch<T>", "Utility Types",
  "useImperativeHandle", "useSyncExternalStore", "useTransition", "useDeferredValue", "useLayoutEffect vs useEffect",
  "Mini Redux", "Optimistic UI", "Request Deduplication", "Polling Hook", "WebSocket Hook", "Feature Flag Hook", "Undo/Redo", "Form Library from Scratch", "Component Library Theming", "Micro-frontend Shell",
  "Race Condition Fix", "Memoization Strategy", "Concurrent Mode Gotchas", "Memory Leak Hunt",
  "Test useFetch", "Test Async Component", "Test User Interactions", "Test Context", "Test Error Boundary",
  "Design DataTable API", "Design Auth Flow", "Design Notification System", "Design Permission System", "Design Real-Time Dashboard",
  // New lessons 101–110, 113–125
  "useId & Stable IDs", "forwardRef & Exposing DOM Nodes", "AbortController & Cleanup in useEffect",
  "React Router Basics", "Nested Routes & Protected Routes", "TanStack Query Basics", "Zustand for Global State",
  "Next.js App Router Fundamentals", "React Server Components & SSR vs SSG", "Accessibility (a11y) Fundamentals",
  "JWT Storage & Decode in React", "Session Timeout Hook", "Token Refresh with Axios Interceptor", "Role-Based Route Protection", "Cookie-Based Auth Flow",
  "Zustand Persist Middleware", "OAuth2 PKCE Flow in a SPA", "RBAC Permission Hook", "Multi-Tab Auth Sync", "Secure Token Rotation",
  "Form Validation with Zod + React Hook Form", "Redux Toolkit — createSlice & createAsyncThunk", "RTK Query — Data Fetching & Cache",
  "Creating RTK Endpoints (from zero)",
  "Query Building in RTK",
  "Redux Toolkit: Writing Your First createAsyncThunk",
];

/**
 * Groupings for the lessons grid (React · JS / React · TS / Vue) — indices align with LESSON_LIST.
 * Lesson numbers in the UI are index + 1 (01 … N).
 */
const REACT_GRID_GROUPS = [
  { key: "foundations", title: "Foundations", start: 0, end: 8 },
  { key: "core", title: "Core patterns", start: 8, end: 15 },
  { key: "component", title: "Component design", start: 15, end: 21 },
  { key: "state", title: "State & interaction", start: 21, end: 27 },
  { key: "hooks", title: "Hooks & utilities", start: 27, end: 30 },
];

/** Angular track lesson order — must match App.jsx lessonList for next/prev and content indices. */
export function buildAngularLessonList() {
  return [
    { title: "Project Scaffold", shortName: "QB01" },
    { title: "App Shell & Navigation", shortName: "QB02" },
    { title: "Orders List Page", shortName: "QB03" },
    { title: "Capacitor GPS + Nearby Restaurants", shortName: "QB04" },
    { title: "Push Notifications", shortName: "QB05" },
    { title: "Status Card", shortName: "ANG01" },
    { title: "Search Form", shortName: "ANG02" },
    { title: "Data Service", shortName: "ANG03" },
    { title: "Real-Time Board", shortName: "ANG04" },
    { title: "Board State", shortName: "ANG05" },
    { title: "Portal Navigation", shortName: "ANG06" },
    { title: "Change Detection & Performance", shortName: "ANG07" },
    { title: "Micro-Frontend Architecture", shortName: "ANG08" },
    { title: "Pipes — Creation & Usage", shortName: "ANG09" },
    ...LESSON_LIST.map((title) => ({ title })),
    ...FUNDA_ANGULAR_LESSONS.map(({ title, shortName }) => ({ title, shortName })),
  ];
}

if (typeof document !== "undefined" && !document.getElementById("dm-sans-font")) {
  const link = document.createElement("link");
  link.id = "dm-sans-font";
  link.rel = "stylesheet";
  link.href = "https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&display=swap";
  document.head.appendChild(link);
}

/** Prose + CTA styles for the lessons landing narrative (inline, matches existing palette). */
const LP = {
  hr: { border: "none", borderTop: "1px solid #e2e8f0", margin: "40px 0" },
  section: { marginBottom: "24px", maxWidth: "720px", marginLeft: "auto", marginRight: "auto" },
  kicker: {
    fontSize: "12px",
    letterSpacing: "0.14em",
    textTransform: "uppercase",
    color: "#64748b",
    marginBottom: "6px",
    fontWeight: 600,
  },
  h1: {
    fontSize: "clamp(1.35rem, 3.5vw, 1.85rem)",
    fontWeight: 700,
    color: "#0f172a",
    lineHeight: 1.2,
    margin: "0 0 6px",
  },
  h2: {
    fontSize: "clamp(1.05rem, 2.2vw, 1.25rem)",
    fontWeight: 700,
    color: "#0f172a",
    margin: "0 0 12px",
    lineHeight: 1.35,
  },
  h3: {
    fontSize: "15px",
    fontWeight: 700,
    color: "#0f172a",
    margin: "20px 0 8px",
    lineHeight: 1.4,
  },
  p: { fontSize: "15px", lineHeight: 1.65, color: "#334155", margin: "0 0 14px" },
  em: { fontStyle: "italic", color: "#475569", fontSize: "14px", display: "block", marginBottom: "12px" },
  quote: {
    fontSize: "17px",
    fontWeight: 600,
    color: "#0f172a",
    margin: "0 0 16px",
    fontStyle: "normal",
  },
  phase: {
    padding: "14px 16px",
    marginBottom: "12px",
    background: "#f8fafc",
    borderLeft: "3px solid #00d4ff",
    borderRadius: "0 8px 8px 0",
  },
  phaseTitle: { fontSize: "14px", fontWeight: 700, color: "#0f172a", marginBottom: "6px" },
  phaseBody: { fontSize: "14px", lineHeight: 1.6, color: "#475569", margin: 0 },
  blueprintBlock: { fontSize: "14px", lineHeight: 1.65, color: "#475569", marginBottom: "14px" },
  deepEnd: { fontSize: "14px", fontStyle: "italic", color: "#64748b", marginBottom: "8px" },
  btn: {
    display: "inline-block",
    marginTop: 0,
    padding: "10px 22px",
    background: "#00d4ff",
    color: "#0f172a",
    border: "none",
    borderRadius: "10px",
    fontWeight: 700,
    fontSize: "15px",
    cursor: "pointer",
    fontFamily: "'DM Sans', sans-serif",
  },
  strong: { color: "#0f172a", fontWeight: 600 },
  btnOutline: {
    display: "inline-block",
    marginTop: 0,
    padding: "10px 22px",
    background: "transparent",
    color: "#0891b2",
    border: "2px solid #00d4ff",
    borderRadius: "10px",
    fontWeight: 700,
    fontSize: "15px",
    cursor: "pointer",
    fontFamily: "'DM Sans', sans-serif",
  },
  punchline: {
    fontSize: "clamp(14px, 2vw, 17px)",
    fontWeight: 600,
    letterSpacing: "0.06em",
    textTransform: "lowercase",
    color: "#0891b2",
    margin: "2px auto 0",
    maxWidth: "520px",
    lineHeight: 1.3,
  },
  categorySection: {
    width: "100%",
    maxWidth: "960px",
    margin: "0 auto 12px",
    boxSizing: "border-box",
  },
  categoryHeading: {
    fontSize: "14px",
    fontWeight: 700,
    color: "#0f172a",
    margin: "0 0 6px",
    letterSpacing: "0.02em",
  },
  modalOverlay: {
    position: "fixed",
    inset: 0,
    zIndex: 10050,
    background: "rgba(15, 23, 42, 0.45)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "16px",
    boxSizing: "border-box",
  },
  modalPanel: {
    position: "relative",
    width: "100%",
    maxWidth: "640px",
    maxHeight: "min(90vh, 900px)",
    overflow: "auto",
    background: "#ffffff",
    borderRadius: "12px",
    padding: "28px 24px 24px",
    boxShadow: "0 25px 50px rgba(15,23,42,0.15)",
    boxSizing: "border-box",
  },
  modalClose: {
    position: "absolute",
    top: "12px",
    right: "12px",
    width: "36px",
    height: "36px",
    border: "none",
    borderRadius: "8px",
    background: "#f1f5f9",
    color: "#64748b",
    fontSize: "22px",
    lineHeight: 1,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  modalTitle: {
    fontSize: "1.25rem",
    fontWeight: 700,
    color: "#0f172a",
    margin: "0 0 20px",
    paddingRight: "36px",
  },
};

export default function LandingPage({ track, onSelectLesson, onStartFree, lessonList, freeLessonsHint }) {
  const [hover, setHover] = useState(null);
  const [howItWorksOpen, setHowItWorksOpen] = useState(false);

  // lessonList: null = use LESSON_LIST (100 React lessons); array = curriculum (TSF/JSF: title, shortName, why)
  let list = lessonList ?? LESSON_LIST.map((title) => ({ title }));

  // Angular track: QuickBite (QB01–QB05), then ANG01–ANG09, then React list, then FUNDA
  if (track === "angular") {
    list = buildAngularLessonList();
  }
  if (track === "mobile-angular") {
    list = MOBILE_ANGULAR_LESSONS.map((x) => ({ ...x }));
  }

  const lessonCount = getLessonCount(track, { reactListLength: LESSON_LIST.length });

  const wrap = {
    width: "100%",
    maxWidth: "100%",
    background: "#ffffff",
    color: "#0f172a",
    fontFamily: "'DM Sans', sans-serif",
    padding: "4px clamp(12px, 3vw, 24px) 20px",
    overflowX: "hidden",
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
    alignItems: "stretch",
  };

  const container = {
    width: "100%",
    maxWidth: "960px",
    marginLeft: "auto",
    marginRight: "auto",
    boxSizing: "border-box",
  };

  const header = {
    textAlign: "center",
    marginBottom: "4px",
    maxWidth: "100%",
  };

  const logoWrap = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    lineHeight: 0,
    marginBottom: "0",
    width: "100%",
    maxWidth: "min(100%, 640px)",
    marginLeft: "auto",
    marginRight: "auto",
  };

  const subtitle = {
    fontSize: "14px",
    color: "#0f172a",
    letterSpacing: "1px",
  };

  const card = (i) => ({
    background: i === hover ? "rgba(0,212,255,0.08)" : "#ffffff",
    border: `1px solid ${i === hover ? "#00d4ff" : "#0f172a"}`,
    borderRadius: "12px",
    padding: "12px 10px",
    cursor: "pointer",
    transition: "all 0.2s ease",
    textAlign: "center",
    boxShadow: "0 1px 3px rgba(15,23,42,0.08)",
    /* Was 1:1; height now 60% of before → width/height = 1/0.6 = 5/3 */
    aspectRatio: "5 / 3",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: 0,
    minWidth: 0,
    boxSizing: "border-box",
  });

  const cardNum = {
    fontSize: "10px",
    color: "#00d4ff",
    letterSpacing: "2px",
    marginBottom: "6px",
    flexShrink: 0,
  };

  const cardTitle = {
    fontSize: "clamp(12px, 1.9vw, 15px)",
    fontWeight: "600",
    color: "#0f172a",
    lineHeight: 1.35,
    display: "-webkit-box",
    WebkitLineClamp: 4,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
    textAlign: "center",
    maxWidth: "100%",
  };

  const showReactBlueprint =
    track === "react-js" || track === "react-ts" || track === "vue";

  /** Full blueprint sections + deep bucket — only when list follows LESSON_LIST order (default React/Vue). */
  const useBlueprintGroupedGrid = showReactBlueprint && !lessonList;

  const startFirstLesson = () => {
    if (list.length === 0) return;
    if (onStartFree) onStartFree(0, list[0]);
    else onSelectLesson(0, list[0]);
  };

  useEffect(() => {
    if (!howItWorksOpen) return undefined;
    const onKey = (e) => {
      if (e.key === "Escape") setHowItWorksOpen(false);
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [howItWorksOpen]);

  return (
    <div style={wrap}>
      <style>
        {`
          .lp-hero-brand {
            position: relative;
            width: 100%;
            max-width: min(100%, 640px);
            margin-left: auto;
            margin-right: auto;
            /* Room for tagline aligned to logo “p” stem (absolute); grows with logo */
            min-height: clamp(248px, 52vw, 400px);
          }
          /* “ower…” omits p so it lines up with the logo wordmark’s extended p (next to stem, not under tree) */
          .lp-punchline-abs {
            position: absolute;
            top: 242px;
            left: 165px;
            margin: 0;
            max-width: none;
            text-align: left;
            z-index: 1;
            white-space: nowrap;
          }
          @media (max-width: 600px) {
            .lp-hero-brand {
              min-height: auto;
            }
            .lp-punchline-abs {
              position: relative;
              top: auto;
              left: auto;
              text-align: center;
              white-space: normal;
              margin: 2px auto 0;
              max-width: 90%;
              font-size: clamp(12px, 3.2vw, 15px);
            }
          }
          @media (min-width: 601px) and (max-width: 900px) {
            .lp-punchline-abs {
              top: clamp(118px, 38vw, 242px);
              left: clamp(16px, 10vw, 165px);
              font-size: clamp(11px, 2.6vw, 16px);
              white-space: normal;
              max-width: min(92%, 360px);
            }
          }
          .lp-lesson-grid {
            display: grid;
            grid-template-columns: repeat(3, minmax(0, 1fr));
            gap: 10px;
            width: 100%;
            max-width: 960px;
            margin: 0 auto;
            box-sizing: border-box;
          }
          @media (max-width: 720px) {
            .lp-lesson-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
          }
          @media (max-width: 600px) {
            .lp-lesson-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 8px; }
            .lp-lesson-grid > div { aspect-ratio: 3 / 2 !important; padding: 8px 6px !important; border-radius: 8px !important; }
          }
        `}
      </style>

      <div style={container}>
        <header style={header}>
          <div className="lp-hero-brand">
            <div style={logoWrap}>
              <InpactLogo height="clamp(180px, 32vw, 380px)" />
            </div>
            <p
              className="lp-punchline-abs"
              style={{ ...LP.punchline, margin: 0 }}
              aria-label="power on your tech growth"
            >
              
            </p>
          </div>
          <h1 style={{ ...LP.h1, marginTop: "10px" }}>The Architecture of Thought</h1>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "10px",
              justifyContent: "center",
              alignItems: "center",
              marginTop: "8px",
            }}
          >
            <button type="button" style={LP.btn} onClick={startFirstLesson}>
              Start free
            </button>
            <button type="button" style={LP.btnOutline} onClick={() => setHowItWorksOpen(true)}>
              How it works
            </button>
          </div>
        </header>

        <div
          style={{
            textAlign: "center",
            marginTop: "2px",
            marginBottom: "4px",
            paddingTop: "2px",
            paddingBottom: "6px",
            borderBottom: "1px solid #f1f5f9",
            width: "100%",
          }}
        >
          <div style={{ ...subtitle, color: "#00d4ff", fontWeight: 600, letterSpacing: "0.04em", marginBottom: 0 }}>
            {TRACK_LABELS[track] ?? track} — {lessonCount} lessons
          </div>
          {freeLessonsHint ? (
            <div
              role="status"
              style={{
                fontSize: "13px",
                color: "#64748b",
                marginTop: "8px",
                lineHeight: 1.45,
              }}
            >
              {freeLessonsHint}
            </div>
          ) : null}
        </div>

        {useBlueprintGroupedGrid ? (
          <div id="inpact-lesson-grid">
            {REACT_GRID_GROUPS.map((group) => {
              const end = Math.min(group.end, list.length);
              if (group.start >= list.length) return null;
              const slice = list.slice(group.start, end);
              if (slice.length === 0) return null;
              return (
                <section key={group.key} style={LP.categorySection} aria-labelledby={`lp-cat-${group.key}`}>
                  <h3 id={`lp-cat-${group.key}`} style={LP.categoryHeading}>
                    {group.title}
                  </h3>
                  <div className="lp-lesson-grid">
                    {slice.map((item, j) => {
                      const i = group.start + j;
                      return (
                        <div
                          key={i}
                          style={card(i)}
                          onClick={() => onSelectLesson(i, item)}
                          onMouseEnter={() => setHover(i)}
                          onMouseLeave={() => setHover(null)}
                          role="button"
                          tabIndex={0}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault();
                              onSelectLesson(i, item);
                            }
                          }}
                        >
                          <div style={cardNum}>
                            {item.shortName ? item.shortName : item.id || String(i + 1).padStart(2, "0")}
                          </div>
                          <div style={cardTitle}>{item.title}</div>
                          {(item.why || item.pattern || item.difficulty) && (
                            <div
                              style={{
                                fontSize: "10px",
                                color: "#64748b",
                                marginTop: "6px",
                                lineHeight: 1.35,
                                textAlign: "center",
                                display: "-webkit-box",
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: "vertical",
                                overflow: "hidden",
                                maxWidth: "100%",
                              }}
                            >
                              {item.why || [item.pattern, item.difficulty].filter(Boolean).join(" · ")}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </section>
              );
            })}

            {list.length > 30 && (
              <section style={LP.categorySection} aria-labelledby="lp-cat-deep">
                <h3 id="lp-cat-deep" style={LP.categoryHeading}>
                  The deep end (31–{lessonCount})
                </h3>
                <div className="lp-lesson-grid">
                  {list.slice(30).map((item, j) => {
                    const i = 30 + j;
                    return (
                      <div
                        key={i}
                        style={card(i)}
                        onClick={() => onSelectLesson(i, item)}
                        onMouseEnter={() => setHover(i)}
                        onMouseLeave={() => setHover(null)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            onSelectLesson(i, item);
                          }
                        }}
                      >
                        <div style={cardNum}>
                          {item.shortName ? item.shortName : item.id || String(i + 1).padStart(2, "0")}
                        </div>
                        <div style={cardTitle}>{item.title}</div>
                        {(item.why || item.pattern || item.difficulty) && (
                          <div
                            style={{
                              fontSize: "10px",
                              color: "#64748b",
                              marginTop: "6px",
                              lineHeight: 1.35,
                              textAlign: "center",
                              display: "-webkit-box",
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: "vertical",
                              overflow: "hidden",
                              maxWidth: "100%",
                            }}
                          >
                            {item.why || [item.pattern, item.difficulty].filter(Boolean).join(" · ")}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </section>
            )}
          </div>
        ) : (
          <>
            <h2
              style={{
                fontSize: "13px",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "#64748b",
                marginBottom: "16px",
                fontWeight: 600,
                textAlign: "center",
                width: "100%",
              }}
              id="inpact-lesson-grid"
            >
              All lessons
            </h2>
            <div className="lp-lesson-grid">
              {list.map((item, i) => (
                <div
                  key={i}
                  style={card(i)}
                  onClick={() => onSelectLesson(i, item)}
                  onMouseEnter={() => setHover(i)}
                  onMouseLeave={() => setHover(null)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      onSelectLesson(i, item);
                    }
                  }}
                >
                  <div style={cardNum}>{item.shortName ? item.shortName : item.id || String(i + 1).padStart(2, "0")}</div>
                  <div style={cardTitle}>{item.title}</div>
                  {(item.why || item.pattern || item.difficulty) && (
                    <div
                      style={{
                        fontSize: "10px",
                        color: "#64748b",
                        marginTop: "6px",
                        lineHeight: 1.35,
                        textAlign: "center",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                        maxWidth: "100%",
                      }}
                    >
                      {item.why || [item.pattern, item.difficulty].filter(Boolean).join(" · ")}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {howItWorksOpen && (
        <div
          style={LP.modalOverlay}
          role="presentation"
          onClick={() => setHowItWorksOpen(false)}
        >
          <div
            style={LP.modalPanel}
            role="dialog"
            aria-modal="true"
            aria-labelledby="how-it-works-title"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              style={LP.modalClose}
              aria-label="Close"
              onClick={() => setHowItWorksOpen(false)}
            >
              ×
            </button>
            <h2 id="how-it-works-title" style={LP.modalTitle}>
              How it works
            </h2>

            <div style={{ ...LP.section, marginBottom: "24px", maxWidth: "100%" }}>
              <div style={LP.kicker}>00 · The philosophy</div>
              <p style={LP.quote}>&ldquo;Brain over fingers.&rdquo;</p>
              <p style={LP.p}>
                In a world of copy-paste solutions, we prioritize the pause. We believe in{" "}
                <strong style={LP.strong}>Clarity before creation</strong>. You don&apos;t just learn to write React and
                TypeScript; you learn to <strong style={LP.strong}>architect</strong> them.
              </p>
              <p style={{ ...LP.p, fontWeight: 600, color: "#0f172a", marginBottom: 0 }}>Think first → Code next.</p>
            </div>

            <hr style={LP.hr} />

            <div style={{ ...LP.section, marginBottom: "24px", maxWidth: "100%" }}>
              <div style={LP.kicker}>01 · The learning loop</div>
              <em style={LP.em}>A deliberate cycle designed to build thinking, not just output.</em>
              <div style={LP.phase}>
                <div style={LP.phaseTitle}>Phase 01: The Scenario (Context → Component)</div>
                <p style={LP.phaseBody}>
                  Every line of code starts with a &ldquo;Why.&rdquo; You begin with a focused use case—a real-world
                  situation where a component must perform. We identify what matters most before a single key is pressed.
                </p>
              </div>
              <div style={LP.phase}>
                <div style={LP.phaseTitle}>Phase 02: The Model (Break → Understand)</div>
                <p style={LP.phaseBody}>
                  We strip the syntax away to examine behavior. What changes? What stays? What drives the logic? You form
                  a mental model first, then recognize the reusable pattern hiding behind the noise.
                </p>
              </div>
              <div style={LP.phase}>
                <div style={LP.phaseTitle}>Phase 03: The Build (Predict → Implement)</div>
                <p style={LP.phaseBody}>
                  Before the IDE opens, you predict outcomes. You anticipate what could break. By the time you write the
                  code, it&apos;s an act of implementation, not an act of trial and error.{" "}
                  <strong style={LP.strong}>Code follows understanding.</strong>
                </p>
              </div>
            </div>

            <hr style={LP.hr} />

            <div style={{ ...LP.section, marginBottom: "24px", maxWidth: "100%" }}>
              <div style={LP.kicker}>02 · Your digital mentor</div>
              <h3 style={{ ...LP.h2, fontSize: "1.05rem" }}>Guidance, not answers.</h3>
              <p style={LP.p}>
                Stuck? A mentor is embedded in every step. They won&apos;t give you the solution, but they will sharpen
                your trajectory.
              </p>
              <p style={{ ...LP.p, fontWeight: 600, color: "#0f172a", marginBottom: "12px" }}>
                Hints → Direction → Clarity.
              </p>
              <p style={{ ...LP.p, fontSize: "14px", marginBottom: 0 }}>
                In the app— inside any lesson, use &ldquo;Ask your mentor&rdquo; for step-scoped help.
              </p>
            </div>

            <hr style={LP.hr} />

            <div style={{ ...LP.section, marginBottom: "8px", maxWidth: "100%" }}>
              <div style={LP.kicker}>03 · The blueprint</div>
              <h3 style={{ ...LP.h2, fontSize: "1.05rem" }}>
                The blueprint · {lessonCount} lessons
              </h3>
              <em style={LP.em}>Our curriculum is non-linear. Pick a concept, build a block, and expand your toolkit.</em>

              {showReactBlueprint ? (
                <>
                  <h3 style={LP.h3}>Foundations</h3>
                  <p style={LP.blueprintBlock}>
                    01 · Counter App · 02 · Toggle Visibility · 03 · Controlled Input · 04 · Multiple State · 05 ·
                    Conditional Render · 06 · List Rendering · 07 · useEffect · 08 · Forms
                  </p>
                  <h3 style={LP.h3}>Core patterns</h3>
                  <p style={LP.blueprintBlock}>
                    09 · Color Picker · 10 · Reusable Button · 11 · Card Component · 12 · Props Drilling · 13 · Default
                    Props · 14 · Children Prop · 15 · TypeScript Interface
                  </p>
                  <h3 style={LP.h3}>Component design</h3>
                  <p style={LP.blueprintBlock}>
                    16 · Composition · 17 · Event Handling · 18 · Conditional Classes · 19 · Inline Styles · 20 · CSS
                    Modules · 21 · Styled Patterns
                  </p>
                  <h3 style={LP.h3}>State &amp; interaction</h3>
                  <p style={LP.blueprintBlock}>
                    22 · Lifting State Up · 23 · Controlled vs Uncontrolled · 24 · Simple Todo List · 25 · Star Rating ·
                    26 · Accordion · 27 · Image Gallery
                  </p>
                  <h3 style={LP.h3}>Hooks &amp; utilities</h3>
                  <p style={LP.blueprintBlock}>28 · useFetch · 29 · useDebounce · 30 · useLocalStorage</p>
                  <p style={LP.deepEnd}>Scale first → Optimize next → Architect next</p>
                  <p style={{ ...LP.blueprintBlock, marginBottom: 0 }}>
                    <strong style={LP.strong}>The deep end (31–{lessonCount})</strong> — advanced patterns, performance,
                    testing, auth, data libraries, and architecture. Browse the full list below.
                  </p>
                </>
              ) : (
                <p style={{ ...LP.p, marginBottom: 0 }}>
                  You&apos;re on <strong style={LP.strong}>{TRACK_LABELS[track] ?? track}</strong> — {lessonCount}{" "}
                  lessons tailored to this track. Browse the full list on this page.
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
