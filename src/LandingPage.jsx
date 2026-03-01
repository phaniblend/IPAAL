import { useState } from "react";

const PROBLEM_LIST = [
  "Counter App",
  "Toggle Visibility",
  "Controlled Input",
  "Form with Validation",
  "Color Picker",
  "Simple Timer",
  "useEffect Basics",
  "Dependency Array",
  "Cleanup in useEffect",
  "Multiple State Vars",
  "Reusable Button",
  "Card Component",
  "Props Drilling",
  "Default Props",
  "Children Prop",
  "Conditional Rendering",
  "List Rendering",
  "PropTypes / TypeScript Interface",
  "Component Composition",
  "Event Handling",
  "Conditional Classes",
  "Inline Styles",
  "CSS Modules",
  "Styled Component Pattern",
  "Lifting State Up",
  "Controlled vs Uncontrolled",
  "Simple Todo List",
  "Star Rating Component",
  "Accordion",
  "Image Gallery",
];

if (typeof document !== "undefined" && !document.getElementById("dm-sans-font")) {
  const link = document.createElement("link");
  link.id = "dm-sans-font";
  link.rel = "stylesheet";
  link.href = "https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&display=swap";
  document.head.appendChild(link);
}

export default function LandingPage({ onSelectProblem }) {
  const [hover, setHover] = useState(null);

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

  return (
    <div style={wrap}>
      <header style={header}>
        <div style={logo}>INPACT</div>
        <div style={subtitle}>Problem-solving as a Learning — pick a problem to start</div>
      </header>
      <div style={grid}>
        {PROBLEM_LIST.map((title, i) => (
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
            <div style={cardNum}>P{String(i + 1).padStart(2, "0")}</div>
            <div style={cardTitle}>{title}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
