import { useState } from "react";

// Must match ENGINES order in App.jsx (p01…p100).
const PROBLEM_LIST = [
  "Counter App", "Toggle Visibility", "Controlled Input", "Multiple State Variables",
  "Conditional Rendering with Ternary", "List Rendering with map()", "useEffect & Side Effects", "Forms & Validation",
  "Color Picker", "Multiple State Vars", "Reusable Button", "Card Component",
  "Props Drilling", "Default Props", "Children Prop", "Conditional Rendering",
  "List Rendering", "PropTypes / TypeScript Interface", "Component Composition", "Event Handling",
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
  "Race Condition Fix", "Memoization Strategy", "Bundle Analysis", "Concurrent Mode Gotchas", "Memory Leak Hunt",
  "Test useFetch", "Test Async Component", "Test User Interactions", "Test Context", "Test Error Boundary",
  "Design DataTable API", "Design Auth Flow", "Design Notification System", "Design Permission System", "Design Real-Time Dashboard",
];

if (typeof document !== "undefined" && !document.getElementById("dm-sans-font")) {
  const link = document.createElement("link");
  link.id = "dm-sans-font";
  link.rel = "stylesheet";
  link.href = "https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&display=swap";
  document.head.appendChild(link);
}

export default function LandingPage({ track, onTrackChange, onSelectProblem, problemList }) {
  const [hover, setHover] = useState(null);
  // problemList: null = use PROBLEM_LIST (100 React problems); array = TSF curriculum (10 items with title, shortName, why)
  const list = problemList ?? PROBLEM_LIST.map((title) => ({ title }));
  const count = list.length;

  const wrap = {
    minHeight: "100vh",
    background: "linear-gradient(160deg, #080c14 0%, #0f172a 50%, #1e1b4b 100%)",
    color: "#e2e8f0",
    fontFamily: "'DM Sans', sans-serif",
    padding: "48px 24px",
  };

  const header = {
    textAlign: "center",
    marginBottom: "48px",
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
    color: "#64748b",
    letterSpacing: "1px",
  };

  const grid = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
    gap: "16px",
    maxWidth: "1200px",
    margin: "0 auto",
  };

  const card = (i) => ({
    background: i === hover ? "rgba(0,212,255,0.08)" : "rgba(15,23,42,0.8)",
    border: `1px solid ${i === hover ? "#00d4ff" : "#334155"}`,
    borderRadius: "12px",
    padding: "20px 24px",
    cursor: "pointer",
    transition: "all 0.2s ease",
    textAlign: "left",
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
    color: "#f1f5f9",
    lineHeight: "1.4",
  };

  const trackWrap = { display: "flex", justifyContent: "center", gap: "8px", marginBottom: "32px" };
  const trackBtn = (isActive) => ({
    padding: "10px 24px",
    borderRadius: "8px",
    border: "1px solid " + (isActive ? "#00d4ff" : "#334155"),
    background: isActive ? "rgba(0,212,255,0.15)" : "transparent",
    color: isActive ? "#00d4ff" : "#94a3b8",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: "600",
    letterSpacing: "0.05em",
  });

  return (
    <div style={wrap}>
      <header style={header}>
        <div style={logo}>INPACT</div>
        <div style={subtitle}>Problem-solving as a Learning — pick a problem to start</div>
        <div style={trackWrap}>
          <button type="button" style={trackBtn(track === "react-js")} onClick={() => onTrackChange("react-js")}>React · JavaScript</button>
          <button type="button" style={trackBtn(track === "react-ts")} onClick={() => onTrackChange("react-ts")}>React · TypeScript</button>
          <button type="button" style={trackBtn(track === "tsf")} onClick={() => onTrackChange("tsf")}>TypeScript · Fundamentals</button>
        </div>
      </header>
      <div style={grid}>
        {list.map((item, i) => (
          <div
            key={i}
            style={card(i)}
            onClick={() => onSelectProblem(i)}
            onMouseEnter={() => setHover(i)}
            onMouseLeave={() => setHover(null)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onSelectProblem(i);
              }
            }}
          >
            <div style={cardNum}>{item.shortName ? item.shortName : "P" + String(i + 1).padStart(2, "0")}</div>
            <div style={cardTitle}>{item.title}</div>
            {item.why && <div style={{ fontSize: "12px", color: "#94a3b8", marginTop: "8px", lineHeight: 1.4 }}>{item.why}</div>}
          </div>
        ))}
      </div>
    </div>
  );
}
