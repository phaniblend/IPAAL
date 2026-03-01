import { useState, useEffect } from "react";
import CodeEditor from "./CodeEditor";

// ─── TUTORIAL DATA ────────────────────────────────────────────────────────────
const NODES = [
  {
    id: "intro",
    type: "reveal",
    phase: "Problem",
    content: {
      tag: "PROBLEM #5",
      title: "Conditional Rendering with Ternary",
      body: `A status card that shows different content based on a boolean.

isLoggedIn = true  →  "Welcome back!"  +  Logout button
isLoggedIn = false →  "Please sign in" +  Login button

One state variable. Two completely different UIs.`,
      usecase: `Ternary is React's most common rendering pattern. Nav bars, dashboards, and auth flows all use it — show this if true, show that if false. Cleaner than if/else inside JSX.`,
    },
  },
  {
    id: "objectives",
    type: "objectives",
    phase: "Objectives",
    items: [
      "Use a ternary operator inside JSX: condition ? A : B",
      "Understand when to use ternary vs && for conditional rendering",
      "Render different text based on a boolean state",
      "Render different button labels based on the same boolean",
      "Wire a toggle function to flip the boolean on click",
      "Explain why if/else doesn't work directly inside JSX return",
    ],
  },
  {
    id: "step1",
    type: "question",
    phase: "Step 1 of 5",
    paal: "Declare a state variable called isLoggedIn (setter: setIsLoggedIn). The user starts logged out — what should the initial value be?",
    hint: "This is a boolean — true or false. The user starts logged OUT, so the initial value should be false.",
    analogy: {
      title: "Similar pattern — modal state",
      code: `const [isOpen, setIsOpen] = useState(false)`,
      explain: "Starts closed (false). Same idea — your user starts logged out (false). The boolean name tells you what true means: isLoggedIn=true means logged in.",
    },
    evaluate: (ans) => {
      const a = ans.replace(/\s/g, "").toLowerCase();
      const hasUseState = a.includes("usestate");
      const hasFalse = a.includes("(false)");
      const hasCorrectName = /const\[isloggedin,/i.test(ans.replace(/\s/g, ""));
      const hasBoolName = /const\[\w+,/.test(ans.replace(/\s/g, ""));
      if (hasUseState && hasFalse && hasCorrectName) return "correct";
      if (hasUseState && hasFalse && hasBoolName) return "naming";
      if (hasUseState && a.includes("(true)")) return "wrong_value";
      if (hasUseState) return "partial";
      return "wrong";
    },
    feedback_correct: "✅ useState(false) — starts logged out. isLoggedIn=false means the login UI shows first.",
    feedback_naming: (ans) => {
      const m = ans.match(/const\s*\[(\w+)/);
      const used = m ? m[1] : "your variable";
      return `✅ Good — useState(false) is right.\n\nFor this tutorial use isLoggedIn / setIsLoggedIn so all steps stay in sync:\n\nconst [isLoggedIn, setIsLoggedIn] = useState(false)`;
    },
    feedback_wrong_value: "Almost — but the user starts logged OUT, so the initial value should be false, not true.",
    feedback_partial: "Declare it like:\nconst [isLoggedIn, setIsLoggedIn] = useState(false)\n\nfalse = logged out. The login screen shows first.",
    feedback_wrong: "const [isLoggedIn, setIsLoggedIn] = useState(false)\n\nBoolean state, starts false (logged out).",
    expected: `const [isLoggedIn, setIsLoggedIn] = useState(false)`,
    seed_code: `import { useState } from 'react'

export default function StatusCard() {
  // Step 1: declare boolean state — user starts logged out

}`,
  },
  {
    id: "step2",
    type: "question",
    phase: "Step 2 of 5",
    paal: "Write a toggle function called handleAuth that flips isLoggedIn. One click logs in, another logs out. Use the functional update form.",
    hint: "Same toggle pattern as Problem #2 — flip the boolean using prev:\nconst handleAuth = () => setIsLoggedIn(prev => !prev)",
    analogy: {
      title: "Same pattern you already know",
      code: `const toggle = () => setIsVisible(prev => !prev)`,
      explain: "You wrote this in P02. Exact same pattern — just different variable name. prev => !prev flips any boolean safely.",
    },
    evaluate: (ans) => {
      const a = ans.toLowerCase().replace(/\s/g, "");
      const hasFn = a.includes("const") && a.includes("=>");
      // Accept any param name: prev=>!prev, p=>!p, val=>!val etc
      const hasFlip = /\(\w+\)\s*=>\s*!\w+|\w+\s*=>\s*!\w+/.test(ans.replace(/\s/g, "")) && a.includes("!");
      const hasFunctional = /\(\w+\s*\)\s*=>/.test(ans) || /\(\w+\s*=>\s*!/.test(ans) || /\w+=>\s*!/.test(a);
      const hasNamedParam = /const\s+\w+\s*=\s*\w\s*=>/.test(ans) && !/const\s+\w+\s*=\s*\(\s*\)\s*=>/.test(ans);
      if (hasNamedParam && !hasFunctional) return "named_param";
      if (hasFn && hasFlip) return "correct";
      if (a.includes("!")) return "partial";
      if (hasFn && a.includes("set")) return "partial";
      return "wrong";
    },
    feedback_correct: "✅ prev => !prev — the same safe flip pattern from P02. Works for any boolean toggle.",
    feedback_named_param: "The toggle takes no arguments — use () => not a named param:\nconst handleAuth = () => setIsLoggedIn(prev => !prev)",
    feedback_partial: "Almost — make sure you're using the functional form: setIsLoggedIn(prev => !prev)",
    feedback_wrong: "const handleAuth = () => setIsLoggedIn(prev => !prev)\n\nEmpty parens — no args needed. prev => !prev flips the boolean.",
    expected: `const handleAuth = () => setIsLoggedIn(prev => !prev)`,
    seed_code: `import { useState } from 'react'

export default function StatusCard() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  // Step 2: write handleAuth — flips isLoggedIn with prev => !prev

}`,
  },
  {
    id: "step3",
    type: "question",
    phase: "Step 3 of 5",
    paal: `Write the JSX. Use a ternary to show different text:\n• isLoggedIn is true → show "Welcome back!"\n• isLoggedIn is false → show "Please sign in"\n\nJust the text for now — no button yet.`,
    hint: "Ternary syntax inside JSX:\n{isLoggedIn ? 'Welcome back!' : 'Please sign in'}\n\nThe ? separates true case, the : separates false case.",
    analogy: {
      title: "Similar pattern — greeting message",
      code: `<p>{isAdmin ? 'Admin Panel' : 'User Dashboard'}</p>`,
      explain: "condition ? trueValue : falseValue — reads like: 'if isAdmin then Admin Panel, otherwise User Dashboard'. Same structure for your login text.",
    },
    evaluate: (ans) => {
      const a = ans.toLowerCase().replace(/\s/g, "");
      const hasBadReturn = /return\s*\(\s*\{/.test(ans);
      if (hasBadReturn) return "syntax";
      const hasValidReturn = /return\s*\(/.test(ans);
      const hasTernary = a.includes("?") && a.includes(":");
      const hasIsLoggedIn = a.includes("isloggedin");
      const hasWelcome = a.includes("welcomeback") || a.includes("welcome");
      const hasSignIn = a.includes("signin") || a.includes("sign");
      if (hasValidReturn && hasTernary && hasIsLoggedIn) return "correct";
      if (hasTernary && !hasIsLoggedIn) return "partial_var";
      if (hasIsLoggedIn && !hasTernary) return "partial_ternary";
      if (hasValidReturn) return "partial";
      return "wrong";
    },
    feedback_correct: "✅ Ternary inside JSX — condition ? trueOutput : falseOutput. React evaluates this on every render based on current state.",
    feedback_syntax: "Syntax error: return(){ is not valid. Use return ( to wrap JSX.",
    feedback_partial_var: "Good ternary structure — but make sure you're checking isLoggedIn:\n{isLoggedIn ? 'Welcome back!' : 'Please sign in'}",
    feedback_partial_ternary: "isLoggedIn is there — now use a ternary to show different text:\n{isLoggedIn ? 'Welcome back!' : 'Please sign in'}",
    feedback_partial: "Add the ternary inside your return:\n{isLoggedIn ? 'Welcome back!' : 'Please sign in'}",
    feedback_wrong: `return (\n  <div>\n    <p>{isLoggedIn ? 'Welcome back!' : 'Please sign in'}</p>\n  </div>\n)`,
    expected: `{isLoggedIn ? 'Welcome back!' : 'Please sign in'}`,
    seed_code: `import { useState } from 'react'

export default function StatusCard() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  const handleAuth = () => setIsLoggedIn(prev => !prev)

  // Step 3: write JSX with ternary text — no button yet

}`,
  },
  {
    id: "step4",
    type: "question",
    phase: "Step 4 of 5",
    paal: `Add a button below the text. Wire onClick={handleAuth} and use a ternary for the label:\n• isLoggedIn true → label "Logout"\n• isLoggedIn false → label "Login"`,
    hint: "Two ternaries — one for the text, one for the button label:\n<button onClick={handleAuth}>\n  {isLoggedIn ? 'Logout' : 'Login'}\n</button>",
    analogy: {
      title: "Similar pattern — follow button",
      code: `<button onClick={handleFollow}>\n  {isFollowing ? 'Unfollow' : 'Follow'}\n</button>`,
      explain: "Same pattern — the button label reflects state. isFollowing=true shows Unfollow, false shows Follow. Your button works the same way.",
    },
    evaluate: (ans) => {
      const a = ans.toLowerCase().replace(/\s/g, "");
      const hasButton = a.includes("<button");
      const hasOnClick = a.includes("onclick={");
      const hasTernaryLabel = a.includes("?") && a.includes(":");
      const hasLogout = a.includes("logout");
      const hasLogin = a.includes("login");
      const hasTextTernary = a.includes("welcomeback") || a.includes("welcome") || a.includes("signin") || a.includes("sign");
      if (hasButton && hasOnClick && hasTernaryLabel && hasLogout && hasLogin) return "correct";
      if (hasButton && !hasOnClick) return "partial_onclick";
      if (hasButton && hasOnClick && !hasTernaryLabel) return "partial_label";
      if (hasButton && hasOnClick && hasTernaryLabel && (!hasLogout || !hasLogin)) return "partial_text";
      return "wrong";
    },
    feedback_correct: "✅ Button wired with onClick + ternary label. Both the message and the button update together on every click.",
    feedback_partial_onclick: "Button is there — but it needs onClick={handleAuth} to actually trigger the toggle.",
    feedback_partial_label: "onClick is wired — now make the label dynamic:\n{isLoggedIn ? 'Logout' : 'Login'}",
    feedback_partial_text: "Almost — use 'Logout' and 'Login' as the two labels:\n{isLoggedIn ? 'Logout' : 'Login'}",
    feedback_wrong: `<button onClick={handleAuth}>\n  {isLoggedIn ? 'Logout' : 'Login'}\n</button>`,
    expected: `<button onClick={handleAuth}>\n  {isLoggedIn ? 'Logout' : 'Login'}\n</button>`,
    seed_code: `import { useState } from 'react'

export default function StatusCard() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  const handleAuth = () => setIsLoggedIn(prev => !prev)

  // Step 4: add button with onClick + ternary label
  return (
    <div>
      <p>{isLoggedIn ? 'Welcome back!' : 'Please sign in'}</p>
    </div>
  )
}`,
  },
  {
    id: "step5",
    type: "question",
    phase: "Step 5 of 5",
    paal: "Here's your component with the button missing. Add the wired button with a ternary label, then submit the full component.",
    hint: "Full structure: useState(false) → handleAuth with prev => !prev → return with ternary text paragraph + wired button with ternary label.",
    analogy: {
      title: "Reference — full ternary pattern",
      code: `import { useState } from 'react'

export default function FollowButton() {
  const [isFollowing, setIsFollowing] = useState(false)

  const toggle = () => setIsFollowing(prev => !prev)

  return (
    <div>
      <p>{isFollowing ? 'Following!' : 'Not following'}</p>
      <button onClick={toggle}>
        {isFollowing ? 'Unfollow' : 'Follow'}
      </button>
    </div>
  )
}`,
      explain: "Same structure — boolean state, toggle fn, ternary text, ternary button label. Just different domain.",
    },
    evaluate: (ans) => {
      const a = ans.toLowerCase().replace(/\s/g, "");
      const checks = [
        a.includes("import") && a.includes("usestate"),
        a.includes("(false)"),
        a.includes("prev=>!prev") || a.includes("prev =>!prev") || a.includes("prev => !prev"),
        (a.match(/\?/g) || []).length >= 2,
        a.includes("<button") && a.includes("onclick={"),
        a.includes("<p>"),
        a.includes("exportdefaultfunction") || a.includes("export default function"),
      ];
      const passed = checks.filter(Boolean).length;
      if (passed >= 6) return "correct";
      if (passed >= 4) return "partial";
      return "wrong";
    },
    feedback_correct: "✅ Complete. useState(false) → prev => !prev toggle → two ternaries rendering different text and button label. That's conditional rendering with ternary.",
    feedback_partial: "Almost — check: useState(false), prev => !prev in toggle, two ternaries (one for text, one for button label), onClick wired to the button.",
    feedback_wrong: "Structure: import → useState(false) → toggle fn → return with ternary paragraph + ternary button.",
    expected: `import { useState } from 'react'

export default function StatusCard() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  const handleAuth = () => setIsLoggedIn(prev => !prev)

  return (
    <div>
      <p>{isLoggedIn ? 'Welcome back!' : 'Please sign in'}</p>
      <button onClick={handleAuth}>
        {isLoggedIn ? 'Logout' : 'Login'}
      </button>
    </div>
  )
}`,
    seed_code: `import { useState } from 'react'

export default function StatusCard() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  const handleAuth = () => setIsLoggedIn(prev => !prev)

  return (
    <div>
      <p>{isLoggedIn ? 'Welcome back!' : 'Please sign in'}</p>
      // Step 5: add the button with onClick + ternary label
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
  const [userChoices, setUserChoices] = useState({ varName: "isLoggedIn", setterName: "setIsLoggedIn", toggleName: "handleAuth", userJSX3: null, userJSX4: null });
  const node = NODES[nodeIndex];
  const progress = NODES.length <= 1 ? 0 : Math.min(100, Math.round((nodeIndex / (NODES.length - 1)) * 100));

  function getSeed(n) {
    if (n?.id === "step4" && userChoices.userJSX3) {
      const base = userChoices.userJSX3.replace(/\/\/\s*Step\s*\d[^\n]*/g, "").replace(/\n{3,}/g, "\n\n").trimEnd()
        .replace(/}\s*$/, "").trimEnd();
      return base + "\n  // Step 4: add button with onClick + ternary label\n}";
    }
    if (n?.id === "step5" && userChoices.userJSX4) {
      const base = userChoices.userJSX4.replace(/\/\/\s*Step\s*\d[^\n]*/g, "").replace(/\n{3,}/g, "\n\n").trimEnd()
        .replace(/}\s*$/, "").trimEnd();
      return base + "\n      // Step 5: add the button here\n    </div>\n  )\n}";
    }
    let seed = n?.seed_code ?? "";
    seed = seed.replace(/\bisLoggedIn\b/g, userChoices.varName);
    seed = seed.replace(/\bsetIsLoggedIn\b/g, userChoices.setterName);
    seed = seed.replace(/\bhandleAuth\b/g, userChoices.toggleName);
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
    if (node?.id === "step2") {
      const m = answer.match(/const\s+(\w+)\s*=/);
      if (m) setUserChoices(c => ({ ...c, toggleName: m[1] }));
    }
    if (node?.id === "step3") setUserChoices(c => ({ ...c, userJSX3: answer }));
    if (node?.id === "step4") setUserChoices(c => ({ ...c, userJSX4: answer }));
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
    label: { fontSize: "11px", color: "#4a5568", letterSpacing: "1px" },
    body: { display: "flex", flex: 1 },
    sidebar: { width: "220px", background: "#0d1117", borderRight: "1px solid #1e2733", padding: "24px 0", flexShrink: 0 },
    sideItem: (a, d) => ({ padding: "10px 20px", display: "flex", alignItems: "center", gap: "10px", cursor: "pointer", background: a ? "#1a2332" : "transparent", borderLeft: a ? "2px solid #00d4ff" : "2px solid transparent" }),
    dot: (a, d) => ({ width: "8px", height: "8px", borderRadius: "50%", background: d ? "#10b981" : a ? "#00d4ff" : "#2d3748", flexShrink: 0 }),
    sideText: (a, d) => ({ fontSize: "11px", color: d ? "#10b981" : a ? "#e2e8f0" : "#4a5568", letterSpacing: "0.5px" }),
    phase: { fontSize: "10px", letterSpacing: "3px", color: "#00d4ff", marginBottom: "16px" },
    tag: { fontSize: "11px", color: "#a78bfa", fontWeight: "600", letterSpacing: "0.15em", marginBottom: "12px" },
    h1: { fontSize: "28px", fontWeight: "400", color: "#f8fafc", marginBottom: "32px", lineHeight: "1.2" },
    pre: { fontSize: "13px", lineHeight: "1.8", color: "#a0aec0", background: "#0d1117", border: "1px solid #1e2733", borderRadius: "8px", padding: "24px", whiteSpace: "pre-wrap", marginBottom: "32px" },
    paalBox: { background: "#0d1117", border: "1px solid #1e2733", borderLeft: "3px solid #00d4ff", borderRadius: "8px", padding: "20px 24px", marginBottom: "24px" },
    paalText: { fontSize: "16px", color: "#e2e8f0", lineHeight: "1.6", whiteSpace: "pre-wrap" },
    paalLabel: { fontSize: "10px", color: "#00d4ff", letterSpacing: "2px", marginBottom: "10px" },
    btnRow: { display: "flex", gap: "12px", marginTop: "16px", flexWrap: "wrap" },
    btn: (v) => ({ padding: "10px 24px", borderRadius: "6px", border: "none", cursor: "pointer", fontSize: "12px", fontWeight: "700", letterSpacing: "0.08em", background: v === "primary" ? "#00d4ff" : v === "ghost" ? "transparent" : "#1a2332", color: v === "primary" ? "#080c14" : v === "ghost" ? "#4a5568" : "#a0aec0", border: v === "ghost" ? "1px solid #2d3748" : "none" }),
    fb: (t) => ({ marginTop: "20px", padding: "16px 20px", borderRadius: "8px", fontSize: "12px", lineHeight: "1.8", background: t === "correct" ? "rgba(16,185,129,0.08)" : t === "partial" ? "rgba(245,158,11,0.08)" : "rgba(239,68,68,0.08)", border: `1px solid ${t === "correct" ? "#10b981" : t === "partial" ? "#f59e0b" : "#ef4444"}`, color: t === "correct" ? "#10b981" : t === "partial" ? "#f59e0b" : "#ef4444", whiteSpace: "pre-wrap" }),
    hint: { marginTop: "12px", padding: "12px 16px", background: "rgba(124,58,237,0.08)", border: "1px solid #7c3aed", borderRadius: "6px", fontSize: "11px", color: "#9f7aea", lineHeight: "1.7", whiteSpace: "pre-wrap" },
    expected: { marginTop: "12px", padding: "16px", background: "#0d1117", border: "1px solid #2d3748", borderRadius: "6px", fontSize: "12px", color: "#718096", whiteSpace: "pre-wrap", lineHeight: "1.7" },
    anchor: { background: "linear-gradient(135deg,#0d1117 0%,#1a0a2e 100%)", border: "1px solid #7c3aed", borderRadius: "12px", padding: "32px" },
    rubricItem: (c) => ({ display: "flex", alignItems: "center", gap: "10px", padding: "10px 14px", background: c ? "rgba(16,185,129,0.06)" : "#0d1117", border: `1px solid ${c ? "#10b981" : "#1e2733"}`, borderRadius: "6px", cursor: "pointer", transition: "all 0.2s" }),
    rubricText: (c) => ({ fontSize: "13px", color: c ? "#10b981" : "#718096" }),
  };

  const sideItems = [
    { label: "Problem", id: "intro" }, { label: "Objectives", id: "objectives" },
    { label: "Step 1 — Boolean state", id: "step1" }, { label: "Step 2 — Toggle fn", id: "step2" },
    { label: "Step 3 — Ternary text", id: "step3" }, { label: "Step 4 — Ternary button", id: "step4" },
    { label: "Step 5 — Full", id: "step5" },
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
    const partialKeys = ["naming", "syntax", "named_param", "wrong_value", "partial_var", "partial_ternary", "partial_onclick", "partial_label", "partial_text"];
    const rawFb =
      result === "correct" ? node.feedback_correct
      : result === "naming" ? node.feedback_naming
      : result === "wrong_value" ? node.feedback_wrong_value
      : result === "named_param" ? node.feedback_named_param
      : result === "syntax" ? (syntaxMsg || node.feedback_syntax)
      : result === "partial_var" ? node.feedback_partial_var
      : result === "partial_ternary" ? node.feedback_partial_ternary
      : result === "partial_onclick" ? node.feedback_partial_onclick
      : result === "partial_label" ? node.feedback_partial_label
      : result === "partial_text" ? node.feedback_partial_text
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
            <div style={s.expected}>{node.expected}</div>
          </div>
        )}
        <div style={s.btnRow}>
          {result !== "correct" ? (
            <>
              <button style={s.btn("primary")} onClick={submit}>SUBMIT</button>
              {node.analogy && <button style={{ ...s.btn("secondary"), background: "rgba(124,58,237,0.15)", border: "1px solid #7c3aed", color: "#9f7aea" }} onClick={() => setShowAnalogy(true)}>💡 SHOW ME AN EXAMPLE</button>}
              {attempts > 0 && !showHint && <button style={s.btn("secondary")} onClick={() => setShowHint(true)}>SHOW HINT</button>}
              {attempts > 1 && !showExpected && <button style={s.btn("ghost")} onClick={() => setShowExpected(true)}>SHOW ANSWER</button>}
              {attempts > 0 && <button style={{ ...s.btn("ghost"), borderColor: "#4a5568" }} onClick={() => { const seed = getSeed(NODES[nodeIndex]); setAnswer(seed); setResult(null); setAttempts(0); setShowHint(false); setShowExpected(false); setSyntaxMsg(null); }}>↺ TRY AGAIN</button>}
            </>
          ) : <button style={s.btn("primary")} onClick={next}>NEXT STEP →</button>}
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
            <div style={{ display: "flex", gap: "12px" }}><div style={{ fontSize: "10px", color: "#4a5568", letterSpacing: "1px", width: "80px", flexShrink: 0, marginTop: "2px" }}>WHEN</div><div style={{ fontSize: "13px", color: "#a0aec0", lineHeight: "1.6" }}>{node.when}</div></div>
            <div style={{ display: "flex", gap: "12px" }}><div style={{ fontSize: "10px", color: "#4a5568", letterSpacing: "1px", width: "80px", flexShrink: 0, marginTop: "2px" }}>MISTAKE</div><div style={{ fontSize: "13px", color: "#a0aec0", lineHeight: "1.6" }}>{node.mistake}</div></div>
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
              <code style={{ fontFamily: "'Fira Code',monospace", fontSize: "12px", color: "#10b981", flexShrink: 0, lineHeight: "1.6", minWidth: "300px" }}>{item.line}</code>
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
          Blank editor — no hints, no seed. Reproduce the full StatusCard component from memory. Hit <strong style={{ color: "#e2e8f0" }}>CHECK MY CODE</strong> when done.
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
                  <div key={i} style={s.rubricItem(checked)} onClick={() => setWfsChecked(p => checked ? p.filter(x => x !== i) : [...p, i])}>
                    <div style={{ width: 16, height: 16, flexShrink: 0 }}>
                      {checked ? <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg> : <div style={{ width: 14, height: 14, border: "1px solid #4a5568", borderRadius: "3px" }} />}
                    </div>
                    <div style={s.rubricText(checked)}>{item}</div>
                  </div>
                );
              })}
            </div>
            {allChecked && (
              <div style={{ marginTop: "24px" }}>
                <div style={s.fb("correct")}>✅ Problem #5 complete. Ternary rendering mastered.{"\n"}Next: Problem #6 — List Rendering with map()</div>
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
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "60vh", textAlign: "center" }}>
        <div style={{ fontSize: "48px", marginBottom: "24px" }}>🎯</div>
        <h1 style={s.h1}>Problem #5 Complete</h1>
        {onNextProblem && (
          <div style={s.btnRow}>
            <button style={s.btn("primary")} onClick={onNextProblem}>NEXT PROBLEM →</button>
          </div>
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
        <div style={s.label}>{progress}%</div>
        <div style={{ ...s.label, marginLeft: "8px" }}>P05 — TERNARY RENDERING</div>
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
                style={s.sideItem(isActive, isDone)}
                onClick={() => setNodeIndex(i)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setNodeIndex(i); } }}
              >
                <div style={s.dot(isActive, isDone)} />
                <div style={s.sideText(isActive, isDone)}>{item.label}</div>
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
