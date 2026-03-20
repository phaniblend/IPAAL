import { useState } from "react";
import { getLessonCount, getCategoryCounts, TRACK_LABELS } from "./trackLessonCounts.js";
import { FUNDA_ANGULAR_LESSONS } from "./angularFundaLessons.js";
import { MOBILE_ANGULAR_LESSONS } from "./mobileAngularLessons.js";

// Must match ENGINES order in App.jsx (p01…p100 minus 10/16/17/88, then p101–p110, p113–p125).
export const PROBLEM_LIST = [
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
    ...PROBLEM_LIST.map((title) => ({ title })),
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

export default function LandingPage({ track, onTrackChange, onSelectProblem, problemList }) {
  const [hover, setHover] = useState(null);

  // problemList: null = use PROBLEM_LIST (100 React problems); array = curriculum (TSF/JSF: title, shortName, why)
  let list = problemList ?? PROBLEM_LIST.map((title) => ({ title }));

  // Angular track: QuickBite (QB01–QB05), then ANG01–ANG09, then React list, then FUNDA
  if (track === "angular") {
    list = buildAngularLessonList();
  }
  if (track === "mobile-angular") {
    list = MOBILE_ANGULAR_LESSONS.map((x) => ({ ...x }));
  }

  const count = list.length;
  const lessonCount = track === "algorithms" ? (problemList?.length ?? 0) : getLessonCount(track, { reactListLength: PROBLEM_LIST.length });
  const categoryCounts = getCategoryCounts({ reactListLength: PROBLEM_LIST.length });

  const wrap = {
    minHeight: "100vh",
    width: "100%",
    background: "#ffffff",
    color: "#0f172a",
    fontFamily: "'DM Sans', sans-serif",
    padding: "48px 24px 48px 140px",
    overflowX: "hidden",
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
  };

  const container = {
    width: "100%",
    maxWidth: "900px",
    margin: "0 auto",
    boxSizing: "border-box",
  };

  const header = {
    textAlign: "center",
    marginBottom: "48px",
    maxWidth: "100%",
  };

  const logo = {
    fontSize: "28px",
    fontWeight: "700",
    letterSpacing: "4px",
    color: "#00d4ff",
    marginBottom: "8px",
  };

  const subtitle = {
    fontSize: "14px",
    color: "#0f172a",
    letterSpacing: "1px",
  };

  const grid = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
    gap: "16px",
    width: "100%",
    margin: "0 auto",
    boxSizing: "border-box",
  };

  const card = (i) => ({
    background: i === hover ? "rgba(0,212,255,0.08)" : "#ffffff",
    border: `1px solid ${i === hover ? "#00d4ff" : "#0f172a"}`,
    borderRadius: "12px",
    padding: "20px 24px",
    cursor: "pointer",
    transition: "all 0.2s ease",
    textAlign: "left",
    boxShadow: "0 1px 3px rgba(15,23,42,0.08)",
  });

  const cardNum = {
    fontSize: "11px",
    color: "#00d4ff",
    letterSpacing: "2px",
    marginBottom: "8px",
  };

  const cardTitle = {
    fontSize: "16px",
    fontWeight: "600",
    color: "#0f172a",
    lineHeight: "1.4",
  };

  const trackWrap = { display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "8px", marginBottom: "32px", maxWidth: "100%" };
  const trackBtn = (isActive) => ({
    padding: "10px 24px",
    borderRadius: "8px",
    border: isActive ? "2px solid #0f172a" : "1px solid #0f172a",
    background: isActive ? "rgba(0,212,255,0.15)" : "transparent",
    color: isActive ? "#00d4ff" : "#0f172a",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: "600",
    letterSpacing: "0.05em",
  });

  return (
    <div style={wrap}>
      <div style={container}>
      <header style={header}>
        <div style={logo}>INPACT</div>
        <div style={subtitle}>Problem-solving as a Learning — pick a problem to start</div>
        <div style={trackWrap}>
          <button type="button" style={trackBtn(track === "react-js")} onClick={() => onTrackChange("react-js")}>React · JS</button>
          <button type="button" style={trackBtn(track === "react-ts")} onClick={() => onTrackChange("react-ts")}>React · TS</button>
          <button type="button" style={trackBtn(track === "angular")} onClick={() => onTrackChange("angular")}>Angular</button>
          <button type="button" style={trackBtn(track === "mobile-angular")} onClick={() => onTrackChange("mobile-angular")}>Mobile Angular</button>
          <button type="button" style={trackBtn(track === "vue")} onClick={() => onTrackChange("vue")}>Vue</button>
          <button type="button" style={trackBtn(track === "js")} onClick={() => onTrackChange("js")}>JavaScript</button>
          <button type="button" style={trackBtn(track === "ts")} onClick={() => onTrackChange("ts")}>TypeScript</button>
          <button type="button" style={trackBtn(track === "node")} onClick={() => onTrackChange("node")}>Node</button>
          <button type="button" style={trackBtn(track === "express")} onClick={() => onTrackChange("express")}>Express</button>
          <button type="button" style={trackBtn(track === "css")} onClick={() => onTrackChange("css")}>CSS</button>
          <button type="button" style={trackBtn(track === "algorithms")} onClick={() => onTrackChange("algorithms")}>Algorithms</button>
        </div>
        <div style={{ ...subtitle, marginTop: "-16px", marginBottom: "16px", color: "#00d4ff" }}>
          {TRACK_LABELS[track] ?? track} — {lessonCount} lessons
        </div>
        <div style={{ fontSize: "12px", color: "#64748b", marginTop: "8px", marginBottom: "16px", maxWidth: "100%", overflowX: "auto" }}>
          Category-wise: {categoryCounts.map((c) => `${c.label} ${c.count}`).join(" · ")}
        </div>
        {/* Mentor callout only — no default-selection bluepatch under Algorithms */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", justifyContent: "center", alignItems: "center", marginTop: "8px", marginBottom: "8px" }}>
          <div style={{ padding: "10px 16px", background: "#f1f5f9", border: "1px solid #e2e8f0", borderRadius: "8px", fontSize: "13px", color: "#0f172a" }}>
            <span style={{ fontWeight: 600, color: "#0f172a", marginRight: "6px" }}>Mentor</span>
            <span style={{ color: "#64748b" }}>— inside any lesson, use “Ask your mentor” for step-scoped help.</span>
          </div>
        </div>
      </header>
      <div style={{ ...grid, maxWidth: "100%" }}>
        {list.map((item, i) => (
          <div
            key={i}
            style={card(i)}
            onClick={() => onSelectProblem(i, item)}
            onMouseEnter={() => setHover(i)}
            onMouseLeave={() => setHover(null)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onSelectProblem(i, item);
              }
            }}
          >
            <div style={cardNum}>{item.shortName ? item.shortName : item.id || String(i + 1).padStart(2, "0")}</div>
            <div style={cardTitle}>{item.title}</div>
            {(item.why || item.pattern || item.difficulty) && (
              <div style={{ fontSize: "12px", color: "#0f172a", marginTop: "8px", lineHeight: 1.4 }}>
                {item.why || [item.pattern, item.difficulty].filter(Boolean).join(" · ")}
              </div>
            )}
          </div>
        ))}
      </div>
      </div>
    </div>
  );
}
