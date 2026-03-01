import { useState, useEffect } from "react";
import CodeEditor from "./CodeEditor";

// ─── TUTORIAL DATA ────────────────────────────────────────────────────────────
const NODES = [
  {
    id: "intro",
    type: "reveal",
    phase: "Problem",
    content: {
      tag: "PROBLEM #7",
      title: "useEffect & Side Effects",
      body: `A document title updater. Every time the count changes,
the browser tab title updates automatically.

count = 0  →  tab shows "Count: 0"
count = 1  →  tab shows "Count: 1"
count = 5  →  tab shows "Count: 5"

No button click triggers this — it just happens
whenever count changes.`,
      usecase: `useEffect is how React talks to the outside world — the DOM, APIs, timers, localStorage. Any time you need something to happen as a consequence of state changing, useEffect is the tool.`,
    },
  },
  {
    id: "objectives",
    type: "objectives",
    phase: "Objectives",
    items: [
      "Understand what a \"side effect\" is and why it lives outside render",
      "Write a useEffect with a callback function",
      "Use the dependency array to control when the effect runs",
      "Understand the three dependency array modes: [], [value], no array",
      "Update document.title from inside useEffect",
      "Explain why setting state directly in render causes infinite loops",
    ],
  },
  {
    id: "step1",
    type: "question",
    phase: "Step 1 of 6",
    paal: "Import useEffect alongside useState from 'react'.",
    hint: "Both hooks live in the same package:\nimport { useState, useEffect } from 'react'",
    analogy: {
      title: "Importing multiple hooks",
      code: `import { useState, useEffect } from 'react'`,
      explain: "Hooks are named exports — import as many as you need from the same 'react' import in one line.",
    },
    evaluate: (ans) => {
      const a = ans.replace(/\s/g, "").toLowerCase();
      const bothImported = a.includes("usestate") && a.includes("useeffect") && a.includes("from'react'");
      if (bothImported) return "correct";
      if (a.includes("usestate") && !a.includes("useeffect")) return "partial_effect";
      if (a.includes("useeffect") && !a.includes("usestate")) return "partial_state";
      return "wrong";
    },
    feedback_correct: "✅ Both hooks imported. Now declare the state variable.",
    feedback_partial_effect: "useState is there — add useEffect too:\nimport { useState, useEffect } from 'react'",
    feedback_partial_state: "useEffect is there — add useState too:\nimport { useState, useEffect } from 'react'",
    feedback_wrong: `import { useState, useEffect } from 'react'`,
    expected: `import { useState, useEffect } from 'react'`,
    seed_code: `// Step 1: import both useState and useEffect from 'react'

export default function Counter() {

}`,
  },
  {
    id: "step1b",
    type: "question",
    phase: "Step 2 of 6",
    paal: "Declare a state variable called count (setter: setCount) starting at 0.",
    hint: "const [count, setCount] = useState(0)",
    analogy: {
      title: "Number state",
      code: `const [score, setScore] = useState(0)`,
      explain: "useState(0) for any number that starts at zero. The brackets destructure the pair: current value and the setter function.",
    },
    evaluate: (ans) => {
      const a = ans.replace(/\s/g, "").toLowerCase();
      if (/const\[count,setcount\]=usestate\(0\)/.test(a)) return "correct";
      if (a.includes("usestate(0)") && /const\[\w+,\w+\]=usestate\(0\)/.test(a)) return "naming";
      if (a.includes("usestate(0)")) return "partial";
      return "wrong";
    },
    feedback_correct: "✅ count state declared at 0. Ready for the useEffect.",
    feedback_naming: `Use count / setCount so all steps stay in sync:\nconst [count, setCount] = useState(0)`,
    feedback_partial: "useState(0) ✓ — destructure the result:\nconst [count, setCount] = useState(0)",
    feedback_wrong: `const [count, setCount] = useState(0)`,
    expected: `const [count, setCount] = useState(0)`,
    seed_code: `import { useState, useEffect } from 'react'

export default function Counter() {
  // Step 2: declare count state starting at 0

}`,
  },

  {
    id: "step2",
    type: "question",
    phase: "Step 3 of 6",
    paal: "Write a useEffect that sets document.title to \"Count: \" + count. Add [count] as the dependency array so it runs every time count changes.",
    hint: "useEffect takes two arguments — a callback and a dependency array:\nuseEffect(() => {\n  document.title = 'Count: ' + count\n}, [count])",
    analogy: {
      title: "Similar pattern — logging on change",
      code: `useEffect(() => {\n  console.log('Score changed:', score)\n}, [score])`,
      explain: "The callback runs after render whenever score changes. [score] in the dependency array means: re-run this effect whenever score changes. Same idea for document.title.",
    },
    evaluate: (ans) => {
      const a = ans.toLowerCase().replace(/\s/g, "");
      const hasUseEffect = a.includes("useeffect(");
      const hasDocTitle = a.includes("document.title");
      const hasDepArray = a.includes("[count]") || a.includes("[" + "count" + "]");
      const hasCallback = a.includes("()=>{") || a.includes("()=>");
      const hasNoArray = hasUseEffect && hasDocTitle && !a.includes("[");
      const hasEmptyArray = a.includes("[]");
      if (hasUseEffect && hasDocTitle && hasDepArray && hasCallback) return "correct";
      if (hasUseEffect && hasDocTitle && hasEmptyArray) return "partial_deps_empty";
      if (hasUseEffect && hasDocTitle && hasNoArray) return "partial_deps_missing";
      if (hasUseEffect && !hasDocTitle) return "partial_title";
      if (hasDocTitle && !hasUseEffect) return "partial_effect";
      return "wrong";
    },
    feedback_correct: "✅ useEffect with [count] dependency — runs after mount and after every count change. document.title syncs automatically.",
    feedback_partial_deps_empty: "document.title is set — but [] means 'run once on mount only'. Use [count] so it re-runs every time count changes.",
    feedback_partial_deps_missing: "document.title is set inside useEffect — now add the dependency array [count] as the second argument:\nuseEffect(() => { ... }, [count])",
    feedback_partial_title: "useEffect is there — but set document.title inside it:\nuseEffect(() => {\n  document.title = 'Count: ' + count\n}, [count])",
    feedback_partial_effect: "document.title is being set — but wrap it in useEffect so React controls when it runs:\nuseEffect(() => { document.title = 'Count: ' + count }, [count])",
    feedback_wrong: `useEffect(() => {\n  document.title = 'Count: ' + count\n}, [count])`,
    expected: `useEffect(() => {\n  document.title = 'Count: ' + count\n}, [count])`,
    seed_code: `import { useState, useEffect } from 'react'

export default function Counter() {
  const [count, setCount] = useState(0)

  // Step 2: useEffect that sets document.title — runs when count changes

}`,
  },
  {
    id: "step3",
    type: "question",
    phase: "Step 4 of 6",
    paal: "Write the JSX. Show the current count in a paragraph. Add two buttons — one to increment count by 1, one to decrement by 1. Wire each button with onClick: the +1 button should call setCount(prev => prev + 1), the -1 button should call setCount(prev => prev - 1).",
    hint: "Paragraph: <p>Count: {count}</p>. Buttons: <button onClick={() => setCount(prev => prev + 1)}>+1</button> and <button onClick={() => setCount(prev => prev - 1)}>-1</button>. Both use the functional update form.",
    analogy: {
      title: "Similar pattern — score tracker",
      code: `<p>Score: {score}</p>\n<button onClick={() => setScore(p => p + 1)}>+1</button>\n<button onClick={() => setScore(p => p - 1)}>-1</button>`,
      explain: "prev + 1 and prev - 1 both depend on the current value — so use the functional form. Inline arrow functions in onClick are fine for simple cases.",
    },
    evaluate: (ans) => {
      const a = ans.toLowerCase().replace(/\s/g, "");
      const hasBadReturn = /return\s*\(\s*\{/.test(ans);
      if (hasBadReturn) return "syntax";
      const hasReturn = /return\s*\(/.test(ans);
      const hasPara = a.includes("<p>") && a.includes("{count}");
      const hasIncrement = /\w+\s*=>\s*\(?\w+\s*\+\s*1/.test(ans) || a.includes("count+1") || a.includes("count + 1");
      const hasDecrement = /\w+\s*=>\s*\(?\w+\s*-\s*1/.test(ans) || a.includes("count-1") || a.includes("count - 1");
      const hasButtons = (a.match(/<button/g) || []).length >= 2;
      const hasOnClick = (a.match(/onclick=/g) || []).length >= 2;
      if (hasReturn && hasPara && hasIncrement && hasDecrement && hasButtons) return "correct";
      if (hasButtons && hasPara && (!hasIncrement || !hasDecrement)) return "partial_logic";
      if (hasButtons && !hasPara) return "partial_para";
      if (hasPara && !hasButtons) return "partial_buttons";
      if (hasReturn) return "partial";
      return "wrong";
    },
    feedback_correct: "✅ Count displayed, two buttons wired. Every click updates count → useEffect fires → document.title updates.",
    feedback_syntax: "Syntax error: return(){\n  is not valid. Use return ( to wrap JSX.",
    feedback_partial_logic: "Buttons are there — check the increment/decrement logic:\n+1 button: onClick={() => setCount(prev => prev + 1)}\n-1 button: onClick={() => setCount(prev => prev - 1)}",
    feedback_partial_para: "Buttons look good — add a paragraph showing the current count:\n<p>Count: {count}</p>",
    feedback_partial_buttons: "Paragraph is there — now add two buttons for increment and decrement.",
    feedback_partial: "Add: <p>Count: {count}</p> and two buttons with onClick handlers for +1 and -1.",
    feedback_wrong: `return (\n  <div>\n    <p>Count: {count}</p>\n    <button onClick={() => setCount(prev => prev + 1)}>+1</button>\n    <button onClick={() => setCount(prev => prev - 1)}>-1</button>\n  </div>\n)`,
    expected: `<p>Count: {count}</p>\n<button onClick={() => setCount(prev => prev + 1)}>+1</button>\n<button onClick={() => setCount(prev => prev - 1)}>-1</button>`,
    seed_code: `import { useState, useEffect } from 'react'

export default function Counter() {
  const [count, setCount] = useState(0)

  useEffect(() => {
    document.title = 'Count: ' + count
  }, [count])

  // Step 3: JSX — paragraph with {count}, two buttons with onClick for +1 and -1

}`,
  },
  {
    id: "step4",
    type: "question",
    phase: "Step 5 of 6",
    paal: "Add a second useEffect that runs only once when the component mounts. It should log 'Counter mounted' to the console. Use an empty dependency array.",
    hint: "Empty array [] means 'run once on mount, never again':\nuseEffect(() => {\n  console.log('Counter mounted')\n}, [])",
    analogy: {
      title: "Similar pattern — fetch on mount",
      code: `useEffect(() => {\n  fetchUserData()\n}, [])`,
      explain: "[] means run once when the component first appears. Classic use: fetch data, set up subscriptions, log analytics. Runs after the first render only.",
    },
    evaluate: (ans) => {
      const a = ans.toLowerCase().replace(/\s/g, "");
      const useEffectCount = (a.match(/useeffect\(/g) || []).length;
      const hasEmptyDep = a.includes(",[])") || a.includes("},[])") || a.includes("}, [])") || a.includes("},[])");
      const hasConsoleLog = a.includes("console.log");
      if (hasConsoleLog && hasEmptyDep) return "correct";
      if (hasConsoleLog && !hasEmptyDep) return "partial_array";
      if (useEffectCount >= 1 && !hasConsoleLog) return "partial_log";
      return "wrong";
    },
    feedback_correct: "✅ Two useEffects — one tracks count changes, one runs once on mount. Each effect has its own purpose and its own dependency array.",
    feedback_partial_array: "console.log is there — but add the empty dependency array [] so it only runs once on mount:\nuseEffect(() => { console.log('Counter mounted') }, [])",
    feedback_partial_log: "Second useEffect is there — add console.log('Counter mounted') inside it.",
    feedback_partial_effect: "Good console.log — wrap it in a second useEffect with [] as the dependency array:\nuseEffect(() => {\n  console.log('Counter mounted')\n}, [])",
    feedback_wrong: `useEffect(() => {\n  console.log('Counter mounted')\n}, [])`,
    expected: `useEffect(() => {\n  console.log('Counter mounted')\n}, [])`,
    seed_code: `import { useState, useEffect } from 'react'

export default function Counter() {
  const [count, setCount] = useState(0)

  useEffect(() => {
    document.title = 'Count: ' + count
  }, [count])

  // Step 4: add a second useEffect that runs once on mount — logs 'Counter mounted'

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(prev => prev + 1)}>+1</button>
      <button onClick={() => setCount(prev => prev - 1)}>-1</button>
    </div>
  )
}`,
  },
  {
    id: "step5",
    type: "question",
    phase: "Step 6 of 6",
    paal: "Submit the complete Counter component. It should have: both hooks imported, count state, two useEffects (one tracking count, one mount-only), and the JSX with paragraph and two buttons.",
    hint: "Check all five pieces: import, useState(0), useEffect with [count], useEffect with [], return with paragraph and two wired buttons.",
    analogy: {
      title: "Reference — full useEffect pattern",
      code: `import { useState, useEffect } from 'react'

export default function LiveTitle() {
  const [text, setText] = useState('')

  useEffect(() => {
    document.title = text || 'Untitled'
  }, [text])

  useEffect(() => {
    console.log('Component ready')
  }, [])

  return (
    <div>
      <input value={text} onChange={(e) => setText(e.target.value)} />
      <p>Title: {text}</p>
    </div>
  )
}`,
      explain: "Same structure — two useEffects with different deps, one state variable, JSX. Just a different domain.",
    },
    evaluate: (ans) => {
      const a = ans.toLowerCase().replace(/\s/g, "");
      const checks = [
        a.includes("import") && a.includes("usestate") && a.includes("useeffect"),
        a.includes("usestate(0)"),
        a.includes("document.title") && a.includes("[count]"),
        a.includes("console.log") && (a.includes(",[])") || a.includes("},[])") || a.includes("}, [])") || a.includes("},[])")),
        (a.match(/useeffect\(/g) || []).length >= 2,
        a.includes("<p>") && a.includes("{count}"),
        (a.match(/<button/g) || []).length >= 2,
      ];
      const passed = checks.filter(Boolean).length;
      if (passed >= 6) return "correct";
      if (passed >= 4) return "partial";
      return "wrong";
    },
    feedback_correct: "✅ Complete. Two useEffects, each with the right dependency array, a count state, and wired JSX. That's side effects in React.",
    feedback_partial: "Almost — check: both hooks imported, useState(0), useEffect with document.title and [count], useEffect with console.log and [], paragraph showing count, two buttons.",
    feedback_wrong: "Structure: import both → useState(0) → useEffect for title → useEffect for mount log → return with paragraph and two buttons.",
    expected: `import { useState, useEffect } from 'react'\n\nexport default function Counter() {\n  const [count, setCount] = useState(0)\n\n  useEffect(() => {\n    document.title = 'Count: ' + count\n  }, [count])\n\n  useEffect(() => {\n    console.log('Counter mounted')\n  }, [])\n\n  return (\n    <div>\n      <p>Count: {count}</p>\n      <button onClick={() => setCount(prev => prev + 1)}>+1</button>\n      <button onClick={() => setCount(prev => prev - 1)}>-1</button>\n    </div>\n  )\n}`,
    seed_code: `import { useState, useEffect } from 'react'

export default function Counter() {
  const [count, setCount] = useState(0)

  useEffect(() => {
    document.title = 'Count: ' + count
  }, [count])

  useEffect(() => {
    console.log('Counter mounted')
  }, [])

  // Step 6: full component — remove this comment and submit when ready
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(prev => prev + 1)}>+1</button>
      <button onClick={() => setCount(prev => prev - 1)}>-1</button>
    </div>
  )
}`,
  },
];


function validateSyntax(code) {
  const counts = { "(": 0, "{": 0, "[": 0 };
  const closers = { ")": "(", "}": "{", "]": "[" };
  let inStr = false, strCh = null;
  for (let i = 0; i < code.length; i++) {
    const ch = code[i];
    if (!inStr && (ch === '"' || ch === "'" || ch === "`")) { inStr = true; strCh = ch; continue; }
    if (inStr && ch === strCh && code[i-1] !== "\\") { inStr = false; continue; }
    if (inStr) continue;
    if (counts[ch] !== undefined) counts[ch]++;
    if (closers[ch]) counts[closers[ch]]--;
  }
  if (counts["("] !== 0) return "Unbalanced parentheses ( )";
  if (counts["{"] !== 0) return "Unbalanced curly braces { }";
  if (counts["["] !== 0) return "Unbalanced brackets [ ]";
  return null;
}

function runEvaluate(node, answer) {
  if (node.evaluate) return node.evaluate(answer);
  return "wrong";
}

export default function INPACTEngine({ onNextProblem }) {
  const [nodeIndex, setNodeIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [result, setResult] = useState(null);
  const [attempts, setAttempts] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [showExpected, setShowExpected] = useState(false);
  const [completedNodes, setCompletedNodes] = useState([]);
  const [wfsChecked, setWfsChecked] = useState([]);
  const [showAnalogy, setShowAnalogy] = useState(false);
  const [syntaxMsg, setSyntaxMsg] = useState(null);
  const [userChoices, setUserChoices] = useState({ varName: "count", setterName: "setCount", userJSX: {} });
  const node = NODES[nodeIndex];
  const progress = NODES.length <= 1 ? 0 : Math.min(100, Math.round((nodeIndex / (NODES.length - 1)) * 100));

  function getSeed(n) {
    if (n?.id === "step3" && userChoices.userJSX["step1b"]) {
      const base = userChoices.userJSX["step1b"].replace(/\/\/\s*Step\s*\d[^\n]*/g, "").replace(/\n{3,}/g, "\n\n").trimEnd()
        .replace(/}\s*$/, "").trimEnd();
      return base + "\n  // Step 3: JSX — paragraph with {count}, two buttons with onClick for +1 and -1\n}";
    }
    let seed = n?.seed_code ?? "";
    seed = seed.replace(/\bcount\b/g, userChoices.varName).replace(/\bsetCount\b/g, userChoices.setterName);
    return seed;
  }

  useEffect(() => {
    const seed = getSeed(NODES[nodeIndex]);
    setAnswer(seed);
    setResult(null); setAttempts(0); setShowHint(false); setShowExpected(false); setShowAnalogy(false); setSyntaxMsg(null);
    setTimeout(() => {
    }, 100);
  }, [nodeIndex, userChoices]);

  function next() {
    if (node?.id === "step1") {
      const m = answer.match(/const\s*\[(\w+)\s*,\s*(\w+)\]/);
      if (m) setUserChoices(c => ({ ...c, varName: m[1], setterName: m[2] }));
    }
    const stepId = node?.id;
    if (stepId && ["step1b", "step2", "step3"].includes(stepId)) {
      setUserChoices(c => ({ ...c, userJSX: { ...c.userJSX, [stepId]: answer } }));
    }
    if (node?.id) setCompletedNodes(p => (p.includes(node.id) ? p : [...p, node.id]));
    setNodeIndex(i => Math.min(i + 1, NODES.length));
  }

  function submit() {
    if (!answer.trim()) return;
    const se = validateSyntax(answer);
    if (se) { setResult("syntax"); setSyntaxMsg(se); setAttempts(a => a + 1); return; }
    setSyntaxMsg(null);
    const res = runEvaluate(node, answer);
    setResult(res);
    setAttempts(a => a + 1);
    if (attempts >= 1) setShowHint(true);
    if (attempts >= 2) setShowExpected(true);
  }

  const s = {
    wrap: { minHeight: "100vh", background: "#080c14", color: "#e2e8f0", fontFamily: "'DM Sans', sans-serif", display: "flex", flexDirection: "column" },
    topbar: { background: "#0d1117", borderBottom: "1px solid #1e2733", padding: "12px 24px", display: "flex", alignItems: "center", gap: "16px" },
    logo: { fontSize: "13px", fontWeight: "700", letterSpacing: "3px", color: "#00d4ff" },
    progressTrack: { flex: 1, height: "3px", background: "#1e2733", borderRadius: "2px", overflow: "hidden" },
    progressFill: { height: "100%", width: `${progress}%`, background: "linear-gradient(90deg,#00d4ff,#7c3aed)", transition: "width 0.5s ease" },
    lbl: { fontSize: "11px", color: "#4a5568", letterSpacing: "1px" },
    body: { display: "flex", flex: 1 },
    sidebar: { width: "220px", background: "#0d1117", borderRight: "1px solid #1e2733", padding: "24px 0", flexShrink: 0 },
    si: (a, d) => ({ padding: "10px 20px", display: "flex", alignItems: "center", gap: "10px", cursor: "pointer", background: a ? "#1a2332" : "transparent", borderLeft: a ? "2px solid #00d4ff" : "2px solid transparent" }),
    dot: (a, d) => ({ width: "8px", height: "8px", borderRadius: "50%", background: d ? "#10b981" : a ? "#00d4ff" : "#2d3748", flexShrink: 0 }),
    st: (a, d) => ({ fontSize: "11px", color: d ? "#10b981" : a ? "#e2e8f0" : "#4a5568" }),
    phase: { fontSize: "10px", letterSpacing: "3px", color: "#00d4ff", marginBottom: "16px" },
    tag: { fontSize: "11px", color: "#a78bfa", fontWeight: "600", letterSpacing: "0.15em", marginBottom: "12px" },
    h1: { fontSize: "28px", fontWeight: "400", color: "#f8fafc", marginBottom: "32px", lineHeight: "1.2" },
    pre: { fontSize: "13px", lineHeight: "1.8", color: "#a0aec0", background: "#0d1117", border: "1px solid #1e2733", borderRadius: "8px", padding: "24px", whiteSpace: "pre-wrap", marginBottom: "32px" },
    paalBox: { background: "#0d1117", border: "1px solid #1e2733", borderLeft: "3px solid #00d4ff", borderRadius: "8px", padding: "20px 24px", marginBottom: "24px" },
    paalText: { fontSize: "16px", color: "#e2e8f0", lineHeight: "1.6" },
    paalLabel: { fontSize: "10px", color: "#00d4ff", letterSpacing: "2px", marginBottom: "10px" },
    btnRow: { display: "flex", gap: "12px", marginTop: "16px", flexWrap: "wrap" },
    btn: (v) => ({ padding: "10px 24px", borderRadius: "6px", border: "none", cursor: "pointer", fontSize: "12px", fontWeight: "700", letterSpacing: "0.08em", background: v === "primary" ? "#00d4ff" : v === "ghost" ? "transparent" : "#1a2332", color: v === "primary" ? "#080c14" : v === "ghost" ? "#4a5568" : "#a0aec0", border: v === "ghost" ? "1px solid #2d3748" : "none" }),
    fb: (t) => ({ marginTop: "20px", padding: "16px 20px", borderRadius: "8px", fontSize: "12px", lineHeight: "1.8", background: t === "correct" ? "rgba(16,185,129,0.08)" : t === "partial" ? "rgba(245,158,11,0.08)" : "rgba(239,68,68,0.08)", border: `1px solid ${t === "correct" ? "#10b981" : t === "partial" ? "#f59e0b" : "#ef4444"}`, color: t === "correct" ? "#10b981" : t === "partial" ? "#f59e0b" : "#ef4444", whiteSpace: "pre-wrap" }),
    hint: { marginTop: "12px", padding: "12px 16px", background: "rgba(124,58,237,0.08)", border: "1px solid #7c3aed", borderRadius: "6px", fontSize: "11px", color: "#9f7aea", lineHeight: "1.7", whiteSpace: "pre-wrap" },
    exp: { marginTop: "12px", padding: "16px", background: "#0d1117", border: "1px solid #2d3748", borderRadius: "6px", fontSize: "12px", color: "#718096", whiteSpace: "pre-wrap", lineHeight: "1.7" },
    anchor: { background: "linear-gradient(135deg,#0d1117 0%,#1a0a2e 100%)", border: "1px solid #7c3aed", borderRadius: "12px", padding: "32px" },
    ri: (c) => ({ display: "flex", alignItems: "center", gap: "10px", padding: "10px 14px", background: c ? "rgba(16,185,129,0.06)" : "#0d1117", border: `1px solid ${c ? "#10b981" : "#1e2733"}`, borderRadius: "6px", cursor: "pointer", transition: "all 0.2s" }),
    rt: (c) => ({ fontSize: "13px", color: c ? "#10b981" : "#718096" }),
  };

  const sideItems = [
    { label: "Problem", id: "intro" }, { label: "Objectives", id: "objectives" },
    { label: "Step 1 — Import hooks", id: "step1" }, { label: "Step 2 — Count state", id: "step1b" },
    { label: "Step 3 — useEffect[count]", id: "step2" }, { label: "Step 4 — JSX & buttons", id: "step3" },
  { label: "Step 5 — Mount effect", id: "step4" }, { label: "Step 6 — Full", id: "step5" },
  ];

  function renderReveal() {
    return (
      <div>
        <div style={s.phase}>{node.phase}</div>
        <div style={s.tag}>{node.content.tag}</div>
        <h1 style={s.h1}>{node.content.title}</h1>
        <div style={s.pre}>{node.content.body}</div>
        <div style={{ background: "rgba(0,212,255,0.05)", border: "1px solid rgba(0,212,255,0.2)", borderLeft: "3px solid #00d4ff", borderRadius: "8px", padding: "16px 20px", marginBottom: "28px" }}>
          <div style={{ fontSize: "10px", letterSpacing: "2px", color: "#00d4ff", marginBottom: "8px" }}>💡 WHY THIS MATTERS</div>
          <div style={{ fontSize: "14px", color: "#a0aec0", lineHeight: "1.7" }}>{node.content.usecase}</div>
        </div>
        <div style={s.btnRow}><button style={s.btn("primary")} onClick={next}>CONTINUE →</button></div>
      </div>
    );
  }

  function renderObjectives() {
    return (
      <div>
        <style>{`@keyframes fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}`}</style>
        <div style={s.phase}>{node.phase}</div>
        <h1 style={s.h1}>After completing this problem, you'll be able to:</h1>
        {node.items.map((item, i) => (
          <div key={i} style={{ display: "flex", gap: "16px", padding: "14px 0", borderBottom: "1px solid #1e2733", animation: "fadeUp 0.35s ease both", animationDelay: `${i * 80}ms` }}>
            <div style={{ fontSize: "11px", color: "#00d4ff", marginTop: "3px", flexShrink: 0, minWidth: "20px" }}>{String(i + 1).padStart(2, "0")}</div>
            <div style={{ fontSize: "15px", color: "#cbd5e0", lineHeight: "1.6" }}>{item}</div>
          </div>
        ))}
        <div style={s.btnRow}><button style={s.btn("primary")} onClick={next}>LET'S BUILD →</button></div>
      </div>
    );
  }

  function renderQuestion() {
    const partialKeys = ["naming", "syntax", "partial_import", "partial_effect", "partial_deps_empty", "partial_deps_missing", "partial_title", "partial_logic", "partial_para", "partial_buttons", "partial_array", "partial_log"];
    const rawFb =
      result === "correct" ? node.feedback_correct
      : result === "naming" ? node.feedback_naming
      : result === "syntax" ? (syntaxMsg || "Syntax error.")
      : result === "partial_import" ? node.feedback_partial_import
      : result === "partial_effect" ? node.feedback_partial_effect
      : result === "partial_deps_empty" ? node.feedback_partial_deps_empty
      : result === "partial_deps_missing" ? node.feedback_partial_deps_missing
      : result === "partial_title" ? node.feedback_partial_title
      : result === "partial_logic" ? node.feedback_partial_logic
      : result === "partial_para" ? node.feedback_partial_para
      : result === "partial_buttons" ? node.feedback_partial_buttons
      : result === "partial_array" ? node.feedback_partial_array
      : result === "partial_log" ? node.feedback_partial_log
      : result === "partial" ? node.feedback_partial
      : result === "wrong" ? node.feedback_wrong
      : null;
    const fbMsg = typeof rawFb === "function" ? rawFb(answer) : rawFb;
    const fbType = partialKeys.includes(result) ? "partial" : result;

    return (
      <div>
        <div style={s.phase}>{node.phase}</div>
        <div style={s.paalBox}><div style={s.paalText}>{node.paal}</div></div>
        {node.seed_code && (
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
            <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#10b981" }} />
            <div style={{ fontSize: "10px", color: "#4a5568", letterSpacing: "2px" }}>CODE BUILT SO FAR — type below the comment</div>
          </div>
        )}
        <CodeEditor value={answer} onChange={setAnswer} height="380px" />
        {showHint && result !== "correct" && <div style={s.hint}>💡 HINT — {node.hint}</div>}
        {fbMsg && <div style={s.fb(fbType)}>{fbMsg}</div>}
        {showExpected && result !== "correct" && (
          <div>
            <div style={{ ...s.paalLabel, marginTop: "16px", marginBottom: "8px" }}>EXPECTED ANSWER</div>
            <div style={s.exp}>{node.expected}</div>
          </div>
        )}
        <div style={s.btnRow}>
          {result !== "correct" ? (
            <>
              <button style={s.btn("primary")} onClick={submit}>SUBMIT</button>
              {node.analogy && <button style={{ ...s.btn("secondary"), background: "rgba(124,58,237,0.15)", border: "1px solid #7c3aed", color: "#9f7aea" }} onClick={() => setShowAnalogy(true)}>💡 SHOW ME AN EXAMPLE</button>}
              {attempts > 0 && !showHint && <button style={s.btn("secondary")} onClick={() => setShowHint(true)}>SHOW HINT</button>}
              {attempts > 1 && !showExpected && <button style={s.btn("ghost")} onClick={() => setShowExpected(true)}>SHOW ANSWER</button>}
              <button style={{ ...s.btn("ghost"), borderColor: "#4a5568" }} onClick={() => { const seed = getSeed(NODES[nodeIndex]); setAnswer(seed); setResult(null); setAttempts(0); setShowHint(false); setShowExpected(false); setSyntaxMsg(null); }}>↺ TRY AGAIN</button>
            </>
          ) : <button style={s.btn("primary")} onClick={next}>{nodeIndex === NODES.length - 1 ? "DONE →" : "NEXT STEP →"}</button>}
        </div>
        {showAnalogy && node.analogy && (
          <div onClick={() => setShowAnalogy(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div onClick={e => e.stopPropagation()} style={{ background: "#0d1117", border: "1px solid #7c3aed", borderRadius: "12px", padding: "32px", maxWidth: "500px", width: "90%" }}>
              <div style={{ fontSize: "10px", letterSpacing: "3px", color: "#7c3aed", marginBottom: "16px" }}>💡 ANALOGOUS EXAMPLE</div>
              <div style={{ fontSize: "16px", fontWeight: "700", color: "#f8fafc", marginBottom: "20px" }}>{node.analogy.title}</div>
              <pre style={{ fontFamily: "'Fira Code',monospace", fontSize: "13px", lineHeight: "1.8", background: "#080c14", border: "1px solid #1e2733", borderRadius: "8px", padding: "16px 20px", color: "#10b981", whiteSpace: "pre-wrap", marginBottom: "20px" }}>{node.analogy.code}</pre>
              <div style={{ fontSize: "14px", color: "#a0aec0", lineHeight: "1.7", marginBottom: "28px", borderLeft: "2px solid #7c3aed", paddingLeft: "16px" }}>{node.analogy.explain}</div>
              <button style={{ ...s.btn("primary"), width: "100%" }} onClick={() => setShowAnalogy(false)}>GOT IT — LET ME TRY →</button>
            </div>
          </div>
        )}
      </div>
    );
  }

  function renderAnchor() {
    return (
      <div>
        <div style={s.phase}>{node.phase}</div>
        <h1 style={s.h1}>Save this to memory</h1>
        <div style={s.anchor}>
          <div style={{ fontSize: "10px", letterSpacing: "3px", color: "#7c3aed", marginBottom: "20px" }}>⚓ ANCHOR CARD</div>
          <div style={{ fontSize: "18px", fontWeight: "700", color: "#f8fafc", lineHeight: "1.5", marginBottom: "24px" }}>{node.rule}</div>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <div style={{ display: "flex", gap: "12px" }}><div style={{ fontSize: "10px", color: "#4a5568", letterSpacing: "1px", width: "80px", flexShrink: 0 }}>WHEN</div><div style={{ fontSize: "13px", color: "#a0aec0", lineHeight: "1.6" }}>{node.when}</div></div>
            <div style={{ display: "flex", gap: "12px" }}><div style={{ fontSize: "10px", color: "#4a5568", letterSpacing: "1px", width: "80px", flexShrink: 0 }}>MISTAKE</div><div style={{ fontSize: "13px", color: "#a0aec0", lineHeight: "1.6" }}>{node.mistake}</div></div>
          </div>
        </div>
        <div style={s.btnRow}><button style={s.btn("primary")} onClick={next}>GOT IT →</button></div>
      </div>
    );
  }

  function renderConnect() {
    return (
      <div>
        <div style={s.phase}>{node.phase}</div>
        <h1 style={s.h1}>{node.title}</h1>
        <div style={{ background: "rgba(0,212,255,0.05)", border: "1px solid rgba(0,212,255,0.2)", borderLeft: "3px solid #00d4ff", borderRadius: "8px", padding: "16px 20px", marginBottom: "28px", fontSize: "15px", color: "#a0aec0", lineHeight: "1.8" }}>{node.context}</div>
        <div style={{ fontSize: "10px", letterSpacing: "2px", color: "#7c3aed", marginBottom: "12px" }}>🔗 PATTERN MAP</div>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "28px" }}>
          {node.pattern_map.map((item, i) => (
            <div key={i} style={{ display: "flex", gap: "16px", background: "#0d1117", border: "1px solid #1e2733", borderRadius: "6px", padding: "10px 14px" }}>
              <code style={{ fontFamily: "'Fira Code',monospace", fontSize: "12px", color: "#10b981", flexShrink: 0, lineHeight: "1.6", minWidth: "320px" }}>{item.line}</code>
              <div style={{ fontSize: "12px", color: "#718096", lineHeight: "1.6", borderLeft: "1px solid #2d3748", paddingLeft: "14px" }}>← {item.label}</div>
            </div>
          ))}
        </div>
        <div style={{ fontSize: "10px", letterSpacing: "2px", color: "#4a5568", marginBottom: "10px" }}>FULL COMPONENT</div>
        <pre style={{ fontFamily: "'Fira Code',monospace", fontSize: "13px", lineHeight: "1.8", background: "#0d1117", border: "1px solid #1e2733", borderRadius: "8px", padding: "20px 24px", color: "#e2e8f0", whiteSpace: "pre-wrap", marginBottom: "32px" }}>{node.code}</pre>
        <div style={s.btnRow}><button style={s.btn("primary")} onClick={next}>CONTINUE →</button></div>
      </div>
    );
  }

  function renderWFS() {
    const allChecked = wfsChecked.length === node.rubric.length;
    const [submitted, setSubmitted] = useState(false);
    return (
      <div>
        <div style={s.phase}>{node.phase}</div>
        <h1 style={s.h1}>Write From Scratch</h1>
        <div style={{ background: "rgba(0,212,255,0.05)", border: "1px solid rgba(0,212,255,0.15)", borderLeft: "3px solid #00d4ff", borderRadius: "8px", padding: "16px 20px", marginBottom: "24px", fontSize: "14px", color: "#a0aec0", lineHeight: "1.8" }}>
          Blank editor — no hints, no seed. Reproduce the full Counter component from memory. Hit <strong style={{ color: "#e2e8f0" }}>CHECK MY CODE</strong> when done.
        </div>
        <CodeEditor value={answer} onChange={setAnswer} height="380px" />
        {!submitted ? (
          <div style={s.btnRow}><button style={s.btn("primary")} onClick={() => { if (answer.trim()) setSubmitted(true); }}>CHECK MY CODE →</button></div>
        ) : (
          <>
            <div style={{ fontSize: "10px", color: "#00d4ff", letterSpacing: "2px", marginTop: "24px", marginBottom: "12px" }}>SELF-CHECK RUBRIC — tick each line you got right</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {node.rubric.map((item, i) => {
                const checked = wfsChecked.includes(i);
                return (
                  <div key={i} style={s.ri(checked)} onClick={() => setWfsChecked(p => checked ? p.filter(x => x !== i) : [...p, i])}>
                    <div style={{ width: 16, height: 16, flexShrink: 0 }}>
                      {checked ? <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg> : <div style={{ width: 14, height: 14, border: "1px solid #4a5568", borderRadius: "3px" }} />}
                    </div>
                    <div style={s.rt(checked)}>{item}</div>
                  </div>
                );
              })}
            </div>
            {allChecked && (
              <div style={{ marginTop: "24px" }}>
                <div style={s.fb("correct")}>✅ Problem #7 complete. You can now sync React to the outside world with useEffect.{"\n"}Next: Problem #8 — Forms & Validation</div>
                <div style={s.btnRow}><button style={s.btn("primary")} onClick={onNextProblem ?? next}>NEXT PROBLEM →</button></div>
              </div>
            )}
          </>
        )}
      </div>
    );
  }

  function renderNode() {
    if (nodeIndex >= NODES.length) return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "60vh", textAlign: "center", padding: "24px" }}>
        <div style={{ fontSize: "48px", marginBottom: "24px" }}>🎯</div>
        <h1 style={s.h1}>Problem #7 Complete</h1>
        <p style={{ color: "#64748b", fontSize: "14px", marginBottom: "24px" }}>Step 6 of 6 — all done. Use ← All Problems above to pick another, or go to the next problem.</p>
        {onNextProblem ? (
          <div style={s.btnRow}>
            <button style={s.btn("primary")} onClick={onNextProblem}>NEXT PROBLEM →</button>
          </div>
        ) : (
          <p style={{ color: "#64748b", fontSize: "13px" }}>Use ← All Problems to return to the list.</p>
        )}
      </div>
    );
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
        <div style={s.lbl}>{progress}%</div>
        <div style={{ ...s.lbl, marginLeft: "8px" }}>P07 — USEEFFECT</div>
      </div>
      <div style={s.body}>
        <div style={s.sidebar}>
          <div style={{ fontSize: "10px", color: "#4a5568", letterSpacing: "2px", padding: "0 20px 12px" }}>PROGRESS</div>
          {sideItems.map((item, i) => {
            const isActive = NODES[nodeIndex]?.id === item.id || (nodeIndex >= NODES.length && i === NODES.length - 1);
            const isDone = completedNodes.includes(item.id);
            return (
              <div
                key={item.id}
                style={s.si(isActive, isDone)}
                onClick={() => setNodeIndex(i)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setNodeIndex(i); } }}
              >
                <div style={s.dot(isActive, isDone)} />
                <div style={s.st(isActive, isDone)}>{item.label}</div>
                {isDone && <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>}
              </div>
            );
          })}
        </div>
        <div style={{ flex: 1, padding: "48px", maxWidth: "760px", margin: "0 auto", width: "100%" }}>
          {renderNode()}
        </div>
      </div>
    </div>
  );
}
