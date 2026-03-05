import { useState, useEffect } from "react";
import CodeEditor from "./CodeEditor";

if (typeof document !== "undefined" && !document.getElementById("dm-sans-font")) {
  const link = document.createElement("link");
  link.id = "dm-sans-font";
  link.rel = "stylesheet";
  link.href = "https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&display=swap";
  document.head.appendChild(link);
}

const NODES = [
  {
    id: "intro",
    type: "reveal",
    phase: "Problem",
    content: {
      tag: "PROBLEM #9",
      title: "Color Picker",
      body: `Change the background color of a div based on a dropdown selection.

Build a <select> with options (e.g. Red, Green, Blue) and a div. When the user picks a color from the dropdown, the div's background updates to that color.`,
      usecase: "Theme switchers, chart color selectors, and any UI that lets users choose from a fixed set of options use this pattern.",
    },
  },
  {
    id: "objectives",
    type: "objectives",
    phase: "Objectives",
    items: [
      "Use useState with a string to hold the selected color value",
      "Render a <select> with <option> elements",
      "Wire value and onChange to make the select controlled",
      "Apply dynamic inline style (e.g. backgroundColor) to a div based on state",
    ],
  },
  {
    id: "step1",
    type: "question",
    phase: "Step 1 of 4",
    paal: "Declare state for the selected color. Use a string (e.g. \"red\" or \"#ff0000\"). Pick an initial value that matches one of the options you'll add later.",
    hint: "useState with a string. Example: useState(\"red\")",
    answer_keywords: ["usestate", "color", "setcolor", "red"],
    seed_code: `import { useState } from 'react'

export default function ColorPicker() {
  // Step 1: state for selected color (string)
  
}`,
    feedback_correct: "✅ Color state declared. You'll use this value for both the select and the div background.",
    feedback_partial: "Almost — use useState with a string initial value, e.g. \"red\".",
    feedback_wrong: "const [color, setColor] = useState(\"red\")",
    expected: `const [color, setColor] = useState("red")`,
    example_code: "// Similar: state for a different string\nconst [theme, setTheme] = useState(\"dark\")",
  },
  {
    id: "step2",
    type: "question",
    phase: "Step 2 of 4",
    paal: "Add a <select> with at least three <option> values (e.g. red, green, blue). Wire value={color} and onChange to update color with e.target.value.",
    hint: "Controlled select: value={color}, onChange={(e) => setColor(e.target.value)}",
    answer_keywords: ["select", "option", "value", "onchange", "setcolor", "target.value"],
    seed_code: `import { useState } from 'react'

export default function ColorPicker() {
  const [color, setColor] = useState("red")

  // Step 2: controlled <select> with options
  
}`,
    feedback_correct: "✅ Controlled select. When the user picks an option, state updates and the UI stays in sync.",
    feedback_partial: "Make sure you have value={color} and onChange that calls setColor(e.target.value).",
    feedback_wrong: "<select value={color} onChange={(e) => setColor(e.target.value)}>\n  <option value=\"red\">Red</option>\n  <option value=\"green\">Green</option>\n  <option value=\"blue\">Blue</option>\n</select>",
    expected: `<select value={color} onChange={(e) => setColor(e.target.value)}>
  <option value="red">Red</option>
  <option value="green">Green</option>
  <option value="blue">Blue</option>
</select>`,
    example_code: "// Similar: controlled input with value + onChange\n<input value={query} onChange={(e) => setQuery(e.target.value)} placeholder=\"Search\" />",
  },
  {
    id: "step3",
    type: "question",
    phase: "Step 3 of 4",
    paal: "Render a div whose background color changes with state. Use inline style: style={{ backgroundColor: color }}. You can also add a mapping from color names to hex if you like.",
    hint: "Inline style object: style={{ backgroundColor: color }}. For named colors, CSS accepts \"red\", \"green\", etc.",
    answer_keywords: ["div", "style", "backgroundcolor", "color"],
    seed_code: `import { useState } from 'react'

export default function ColorPicker() {
  const [color, setColor] = useState("red")

  return (
    <div>
      <select value={color} onChange={(e) => setColor(e.target.value)}>
        <option value="red">Red</option>
        <option value="green">Green</option>
        <option value="blue">Blue</option>
      </select>
      {/* Step 3: div with dynamic backgroundColor */}
    </div>
  )
}`,
    feedback_correct: "✅ Dynamic style. The div background now reflects the selected color.",
    feedback_partial: "Add a div with style={{ backgroundColor: color }}.",
    feedback_wrong: "<div style={{ backgroundColor: color }}>Preview</div>",
    expected: `<div style={{ backgroundColor: color, minHeight: "100px" }}>Preview</div>`,
    example_code: "// Similar: dynamic style with a different property (e.g. text color or width)\n<div style={{ color: theme, width: \"200px\" }}>Sample text</div>",
  },
  {
    id: "step4",
    type: "question",
    phase: "Step 4 of 4",
    paal: "You've built state, the controlled select, and the div with dynamic background. Check that everything is in place (and that you have export default), then submit.",
    hint: "Combine step 1–3 in one component.",
    answer_keywords: ["import", "usestate", "export", "default", "color", "select", "backgroundcolor"],
    seed_code: `import { useState } from 'react'

export default function ColorPicker() {
  // Step 4: full component
  
}`,
    feedback_correct: "✅ Color Picker complete. Dropdown drives div background — classic controlled UI.",
    feedback_partial: "Ensure you have: useState for color, controlled select, and div with style={{ backgroundColor: color }}.",
    feedback_wrong: "Combine state, select with value/onChange, and div with backgroundColor.",
    expected: `import { useState } from 'react'

export default function ColorPicker() {
  const [color, setColor] = useState("red")
  return (
    <div>
      <select value={color} onChange={(e) => setColor(e.target.value)}>
        <option value="red">Red</option>
        <option value="green">Green</option>
        <option value="blue">Blue</option>
      </select>
      <div style={{ backgroundColor: color, minHeight: "100px" }} />
    </div>
  )
}`,
  },
];

function evaluate(node, answer) {
  if (node.evaluate) return node.evaluate(answer);
  const lower = answer.toLowerCase().replace(/\s/g, "");
  const hits = (node.answer_keywords || []).filter((kw) =>
    lower.includes(kw.toLowerCase().replace(/\s/g, ""))
  );
  const ratio = hits.length / (node.answer_keywords?.length || 1);
  if (ratio >= 0.8) return "correct";
  if (ratio >= 0.5) return "partial";
  return "wrong";
}

export default function INPACTEngine({ onNextProblem }) {
  const [nodeIndex, setNodeIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [result, setResult] = useState(null);
  const [attempts, setAttempts] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [showExample, setShowExample] = useState(false);
  const [showExpected, setShowExpected] = useState(false);
  const [completedNodes, setCompletedNodes] = useState([]);
  const [passedCodeByStepId, setPassedCodeByStepId] = useState({});

  const node = NODES[nodeIndex];
  const progress = NODES.length <= 1 ? 0 : Math.min(100, Math.round((nodeIndex / (NODES.length - 1)) * 100));

  useEffect(() => {
    setResult(null);
    setAttempts(0);
    setShowHint(false);
    setShowExample(false);
    setShowExpected(false);
    if (node?.type === "question") {
      let initialCode = "";
      if (node.id && passedCodeByStepId[node.id]) {
        initialCode = passedCodeByStepId[node.id];
      } else {
        for (let i = nodeIndex - 1; i >= 0; i--) {
          const prev = NODES[i];
          if (prev?.type === "question" && prev.id && passedCodeByStepId[prev.id]) {
            initialCode = passedCodeByStepId[prev.id];
            break;
          }
        }
        if (initialCode === "" && node.starter_code) initialCode = node.starter_code;
        if (initialCode === "") initialCode = node?.seed_code ?? "";
      }
      setAnswer(initialCode);
    }
  }, [nodeIndex, passedCodeByStepId]);

  function next() {
    if (node?.type === "question" && node?.id && result === "correct") {
      setPassedCodeByStepId((prev) => ({ ...prev, [node.id]: answer }));
    }
    if (node?.id) setCompletedNodes((p) => (p.includes(node.id) ? p : [...p, node.id]));
    setNodeIndex((i) => Math.min(i + 1, NODES.length));
  }

  function submit() {
    if (!answer.trim()) return;
    const res = evaluate(node, answer);
    setResult(res);
    setAttempts((a) => a + 1);
    if (attempts >= 1) setShowHint(true);
    if (attempts >= 2) setShowExpected(true);
  }

  const s = {
    wrap: { minHeight: "100vh", background: "#080c14", color: "#e2e8f0", fontFamily: "'DM Sans', sans-serif", display: "flex", flexDirection: "column" },
    topbar: { background: "#0d1117", borderBottom: "1px solid #1e2733", padding: "12px 24px", display: "flex", alignItems: "center", gap: "16px" },
    logo: { fontSize: "13px", fontWeight: "700", letterSpacing: "3px", color: "#00d4ff" },
    progressTrack: { flex: 1, height: "3px", background: "#1e2733", borderRadius: "2px", overflow: "hidden" },
    progressFill: { height: "100%", width: `${progress}%`, background: "linear-gradient(90deg,#00d4ff,#7c3aed)", transition: "width 0.5s ease" },
    progressLabel: { fontSize: "11px", color: "#4a5568", letterSpacing: "1px" },
    body: { display: "flex", flex: 1 },
    sidebar: { width: "220px", background: "#0d1117", borderRight: "1px solid #1e2733", padding: "24px 0", flexShrink: 0 },
    sidebarLabel: { fontSize: "10px", color: "#4a5568", letterSpacing: "2px", padding: "0 20px 12px" },
    sideItem: (a, d) => ({ padding: "10px 20px", display: "flex", alignItems: "center", gap: "10px", cursor: "pointer", background: a ? "#1a2332" : "transparent", borderLeft: a ? "2px solid #00d4ff" : "2px solid transparent" }),
    sideItemDot: (a, d) => ({ width: "8px", height: "8px", borderRadius: "50%", background: d ? "#10b981" : a ? "#00d4ff" : "#2d3748", flexShrink: 0 }),
    sideItemText: (a, d) => ({ fontSize: "11px", color: d ? "#10b981" : a ? "#e2e8f0" : "#4a5568", letterSpacing: "0.5px" }),
    main: { flex: 1, padding: "48px", maxWidth: "760px", margin: "0 auto", width: "100%" },
    phase: { fontSize: "10px", letterSpacing: "3px", color: "#00d4ff", marginBottom: "16px" },
    tag: { fontSize: "11px", color: "#a78bfa", fontWeight: "600", letterSpacing: "0.15em", marginBottom: "12px" },
    h1: { fontSize: "28px", fontWeight: "400", color: "#f8fafc", marginBottom: "32px", lineHeight: "1.2" },
    pre: { fontSize: "13px", lineHeight: "1.8", color: "#a0aec0", background: "#0d1117", border: "1px solid #1e2733", borderRadius: "8px", padding: "24px", whiteSpace: "pre-wrap", marginBottom: "32px" },
    paalBox: { background: "#0d1117", border: "1px solid #1e2733", borderLeft: "3px solid #00d4ff", borderRadius: "8px", padding: "20px 24px", marginBottom: "24px" },
    paalLabel: { fontSize: "10px", color: "#00d4ff", letterSpacing: "2px", marginBottom: "10px" },
    paalText: { fontSize: "16px", color: "#e2e8f0", lineHeight: "1.6", whiteSpace: "pre-wrap" },
    btnRow: { display: "flex", gap: "12px", marginTop: "16px", flexWrap: "wrap" },
    btn: (v) => ({ padding: "10px 24px", borderRadius: "6px", border: "none", cursor: "pointer", fontSize: "12px", fontWeight: "700", letterSpacing: "0.08em", background: v === "primary" ? "#00d4ff" : v === "ghost" ? "transparent" : "#1a2332", color: v === "primary" ? "#080c14" : v === "ghost" ? "#4a5568" : "#a0aec0", border: v === "ghost" ? "1px solid #2d3748" : "none" }),
    feedback: (t) => ({ marginTop: "20px", padding: "16px 20px", borderRadius: "8px", fontSize: "12px", lineHeight: "1.8", background: t === "correct" ? "rgba(16,185,129,0.08)" : t === "partial" ? "rgba(245,158,11,0.08)" : "rgba(239,68,68,0.08)", border: `1px solid ${t === "correct" ? "#10b981" : t === "partial" ? "#f59e0b" : "#ef4444"}`, color: t === "correct" ? "#10b981" : t === "partial" ? "#f59e0b" : "#ef4444", whiteSpace: "pre-wrap" }),
    hintBox: { marginTop: "12px", padding: "12px 16px", background: "rgba(124,58,237,0.08)", border: "1px solid #7c3aed", borderRadius: "6px", fontSize: "11px", color: "#9f7aea", lineHeight: "1.7" },
    expectedBox: { marginTop: "12px", padding: "16px", background: "#0d1117", border: "1px solid #2d3748", borderRadius: "6px", fontSize: "12px", color: "#718096", whiteSpace: "pre-wrap", lineHeight: "1.7" },
    completeBanner: { textAlign: "center", padding: "60px 20px" },
  };

  const sideItems = [
    { label: "Problem", id: "intro" },
    { label: "Objectives", id: "objectives" },
    { label: "Step 1 — State", id: "step1" },
    { label: "Step 2 — Select", id: "step2" },
    { label: "Step 3 — Div style", id: "step3" },
    { label: "Step 4 — Full", id: "step4" },
  ];

  function renderReveal() {
    return (
      <div>
        <div style={s.phase}>{node.phase}</div>
        {node.content.tag && <div style={s.tag}>{node.content.tag}</div>}
        <h1 style={s.h1}>{node.content.title}</h1>
        <div style={s.pre}>{node.content.body}</div>
        {node.content.usecase && (
          <div style={{ background: "rgba(0,212,255,0.05)", border: "1px solid rgba(0,212,255,0.2)", borderLeft: "3px solid #00d4ff", borderRadius: "8px", padding: "16px 20px", marginBottom: "28px" }}>
            <div style={{ fontSize: "10px", letterSpacing: "2px", color: "#00d4ff", marginBottom: "8px" }}>💡 WHY THIS MATTERS</div>
            <div style={{ fontSize: "14px", color: "#a0aec0", lineHeight: "1.7" }}>{node.content.usecase}</div>
          </div>
        )}
        <div style={s.btnRow}><button style={s.btn("primary")} onClick={next}>CONTINUE →</button></div>
      </div>
    );
  }

  function renderObjectives() {
    return (
      <div>
        <div style={s.phase}>{node.phase}</div>
        <h1 style={s.h1}>After completing this problem, you'll be able to:</h1>
        {node.items.map((item, i) => (
          <div key={i} style={{ display: "flex", gap: "16px", padding: "14px 0", borderBottom: "1px solid #1e2733" }}>
            <div style={{ fontSize: "11px", color: "#00d4ff", flexShrink: 0, minWidth: "20px" }}>{String(i + 1).padStart(2, "0")}</div>
            <div style={{ fontSize: "15px", color: "#cbd5e0", lineHeight: "1.6" }}>{item}</div>
          </div>
        ))}
        <div style={s.btnRow}><button style={s.btn("primary")} onClick={next}>LET'S BUILD →</button></div>
      </div>
    );
  }

  function renderQuestion() {
    const rawFb = result === "correct" ? node.feedback_correct : result === "partial" ? node.feedback_partial : result === "wrong" ? node.feedback_wrong : null;
    const fbMsg = typeof rawFb === "function" ? rawFb(answer) : rawFb;
    return (
      <div>
        <div style={s.phase}>{node.phase}</div>
        <div style={s.paalBox}><div style={s.paalLabel}>PAAL</div><div style={s.paalText}>{node.paal}</div></div>
        {node.seed_code && (
          <div style={{ fontSize: "10px", color: "#4a5568", marginBottom: "8px" }}>CODE BUILT SO FAR — edit below</div>
        )}
        <CodeEditor value={answer} onChange={setAnswer} height="320px" />
        {showHint && <div style={s.hintBox}>💡 {node.hint}</div>}
        {fbMsg && <div style={s.feedback(result)}>{fbMsg}</div>}
        {showExample && node.example_code && (
          <div style={{ marginTop: "16px" }}>
            <div style={{ ...s.paalLabel, marginBottom: "6px" }}>EXAMPLE (similar pattern — not the exact answer)</div>
            <div style={s.expectedBox}>{node.example_code}</div>
          </div>
        )}
        {showExpected && <div><div style={{ ...s.paalLabel, marginTop: "16px" }}>EXPECTED</div><div style={s.expectedBox}>{node.expected}</div></div>}
        <div style={s.btnRow}>
          {result !== "correct" ? (
            <>
              <button style={s.btn("primary")} onClick={submit}>SUBMIT</button>
              {node.example_code && !showExample && <button style={s.btn("secondary")} onClick={() => setShowExample(true)}>SHOW ME EXAMPLE</button>}
              {attempts > 0 && !showHint && <button style={s.btn("secondary")} onClick={() => setShowHint(true)}>SHOW HINT</button>}
              {attempts > 1 && !showExpected && <button style={s.btn("ghost")} onClick={() => setShowExpected(true)}>SHOW ANSWER</button>}
            </>
          ) : <button style={s.btn("primary")} onClick={next}>NEXT STEP →</button>}
        </div>
      </div>
    );
  }

  function renderComplete() {
    return (
      <div style={s.completeBanner}>
        <div style={{ fontSize: "48px", marginBottom: "24px" }}>🎯</div>
        <h1 style={{ ...s.h1, textAlign: "center" }}>Problem #9 Complete</h1>
        <p style={{ color: "#4a5568", fontSize: "13px" }}>Color Picker done. Ready for the next problem.</p>
        {onNextProblem && <div style={s.btnRow}><button style={s.btn("primary")} onClick={onNextProblem}>NEXT PROBLEM →</button></div>}
      </div>
    );
  }

  function renderNode() {
    if (nodeIndex >= NODES.length) return renderComplete();
    switch (node.type) {
      case "reveal": return renderReveal();
      case "objectives": return renderObjectives();
      case "question": return renderQuestion();
      default: return renderReveal();
    }
  }

  return (
    <div style={s.wrap}>
      <div style={s.topbar}>
        <div style={s.logo}>INPACT</div>
        <div style={s.progressTrack}><div style={s.progressFill} /></div>
        <div style={s.progressLabel}>{progress}%</div>
        <div style={{ ...s.progressLabel, marginLeft: "8px" }}>P09 — COLOR PICKER</div>
      </div>
      <div style={s.body}>
        <div style={s.sidebar}>
          <div style={s.sidebarLabel}>PROGRESS</div>
          {sideItems.map((item, i) => {
            const isActive = NODES[nodeIndex]?.id === item.id || (nodeIndex >= NODES.length && i === NODES.length - 1);
            const isDone = completedNodes.includes(item.id);
            return (
              <div key={item.id} style={s.sideItem(isActive, isDone)} onClick={() => setNodeIndex(i)} role="button" tabIndex={0} onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setNodeIndex(i); } }}>
                <div style={s.sideItemDot(isActive, isDone)} />
                <div style={s.sideItemText(isActive, isDone)}>{item.label}</div>
                {isDone && <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
              </div>
            );
          })}
        </div>
        <div style={s.main}>{renderNode()}</div>
      </div>
    </div>
  );
}
