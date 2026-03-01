import { useState, useEffect } from "react";
import CodeEditor from "./CodeEditor";

// ─── TUTORIAL DATA ────────────────────────────────────────────────────────────
const NODES = [
  {
    id: "intro",
    type: "reveal",
    phase: "Problem",
    content: {
      tag: "PROBLEM #3",
      title: "Controlled Input",
      body: `A text input and a paragraph below it.

As you type into the input, the paragraph updates in real time — letter by letter.

Example:
  Start        →  [          ]  You typed: 
  Type "Hi"    →  [ Hi       ]  You typed: Hi
  Type "Hi!"   →  [ Hi!      ]  You typed: Hi!`,
      usecase: `Every search box, live character count, username field, and form preview on the web uses this exact pattern. It's how React stays in control of what the user types.`,
    },
  },
  {
    id: "objectives",
    type: "objectives",
    phase: "Objectives",
    items: [
      "Use useState with an empty string — the input starts blank",
      "Understand why the initial value is \"\" not true or 0",
      "Write an onChange handler that reads e.target.value",
      "Wire value={text} to make React control the input",
      "Wire onChange={handleChange} to update state on each keystroke",
      "Render live text in a paragraph using {text}",
      "Explain the difference between controlled and uncontrolled inputs",
    ],
  },
  {
    id: "step1",
    type: "question",
    phase: "Step 1 of 5",
    paal: "Declare a state variable called text (setter: setText) to hold a string. The input starts empty — what should the initial value be?",
    hint: "This isn't a boolean or a number. The input starts blank. An empty string in JS is written as two quote marks with nothing between them: \"\"",
    analogy: {
      title: "Similar pattern — tracking a search query",
      code: `const [query, setQuery] = useState("")`,
      explain: "useState works with strings too. \"\" means empty string — the search box starts blank. Same idea: your text state starts with nothing typed.",
    },
    evaluate: (ans) => {
      const a = ans.replace(/\s/g, "").toLowerCase();
      const hasUseState = a.includes("usestate");
      const hasEmpty = a.includes('("")') || a.includes("('')");
      const hasCorrectName = /const\[text,/.test(ans.replace(/\s/g, ""));
      const hasSomeName = /const\[\w+,/.test(ans.replace(/\s/g, ""));
      if (hasUseState && hasEmpty && hasCorrectName) return "correct";
      if (hasUseState && hasEmpty && hasSomeName) return "naming";
      if (hasUseState && hasEmpty) return "naming";
      if (hasUseState) return "partial";
      return "wrong";
    },
    feedback_correct: "✅ const [text, setText] = useState(\"\") — string state, starts empty. Every keystroke will update this.",
    feedback_naming: (ans) => {
      const nameMatch = ans.match(/const\s*\[(\w+)/);
      const usedName = nameMatch ? nameMatch[1] : "your variable";
      return `✅ Good — useState("") is right, empty string is the correct initial value.\n\nJust one thing: you used "${usedName}" but in this tutorial we'll use text / setText throughout so all steps stay in sync.\n\nTry: const [text, setText] = useState("")`;
    },
    feedback_partial: (ans) => {
      const a = ans.toLowerCase().replace(/\s/g, "");
      if (!a.includes('("")') && !a.includes("('')")) return "Close — but what's the initial value? The input starts empty, so use \"\" (empty string), not true or 0.";
      return "Almost — destructure it: const [text, setText] = useState(\"\")";
    },
    feedback_wrong: `Declare it like:\nconst [text, setText] = useState("")\n\n"" = empty string. The input starts blank.`,
    expected: `const [text, setText] = useState("")`,
    seed_code: `import { useState } from 'react'

export default function ControlledInput() {
  // Step 1: declare string state — input starts empty
  
}`,
  },
  {
    id: "step2",
    type: "question",
    phase: "Step 2 of 5",
    paal: "Write a function called handleChange that reads the input's value on every keystroke. The event object is called e — how do you get the typed text from it?",
    hint: "Every input event carries a target — the input element itself. The typed value lives at e.target.value. Use that to call setText.",
    analogy: {
      title: "Similar pattern — tracking a search field",
      code: `const handleSearch = (e) => setQuery(e.target.value)`,
      explain: "e is the event object. e.target is the input element. e.target.value is what the user typed. Call your setter with it and React updates on every keystroke.",
    },
    evaluate: (ans) => {
      const a = ans.toLowerCase().replace(/\s/g, "");
      const hasFn = a.includes("const") && a.includes("=>");
      const hasEvent = a.includes("e.target.value") || a.includes("event.target.value");
      const hasSetText = a.includes("settext") || a.includes("set");
      const hasNamedParam = /const\s+\w+\s*=\s*\w\s*=>/.test(ans) && !/const\s+\w+\s*=\s*\(/.test(ans);
      if (hasNamedParam && !a.includes("(e)") && !a.includes("(event)") && !a.includes("e=>") && !a.includes("event=>")) return "named_param";
      if (hasFn && hasEvent && hasSetText) return "correct";
      if (hasEvent) return "partial";
      if (hasFn && hasSetText) return "partial";
      return "wrong";
    },
    feedback_correct: "✅ e.target.value is how you read what's in the input. Every keypress fires onChange, which calls handleChange, which updates text state.",
    feedback_named_param: "Almost — but the param name matters here. Use (e) so you can access e.target.value:\nconst handleChange = (e) => setText(e.target.value)",
    feedback_partial: (ans) => {
      const a = ans.toLowerCase().replace(/\s/g, "");
      if (!a.includes("e.target.value") && !a.includes("event.target.value")) return "The key piece is e.target.value — that's where the typed text lives. Try: const handleChange = (e) => setText(e.target.value)";
      return "Almost — make sure you're calling setText with e.target.value inside a named function.";
    },
    feedback_wrong: `const handleChange = (e) => setText(e.target.value)\n\ne.target.value = whatever is currently typed in the input.`,
    expected: `const handleChange = (e) => setText(e.target.value)`,
    seed_code: `import { useState } from 'react'

export default function ControlledInput() {
  const [text, setText] = useState("")

  // Step 2: write handleChange — reads e.target.value and updates text
  
}`,
  },
  {
    id: "step3",
    type: "question",
    phase: "Step 3 of 5",
    paal: "Write the JSX. Include an input wired with value={text} and onChange={handleChange}. Don't add the paragraph yet.",
    hint: "A controlled input needs two things: value={text} makes React own the displayed value, onChange={handleChange} updates state on every keystroke. Without value=, it's uncontrolled.",
    analogy: {
      title: "Similar pattern — controlled search input",
      code: `return (
  <div>
    <input value={query} onChange={handleSearch} />
  </div>
)`,
      explain: "value= makes React the source of truth — the input shows exactly what's in state. onChange keeps state in sync with what the user types. Both are required for a controlled input.",
    },
    evaluate: (ans) => {
      const a = ans.toLowerCase().replace(/\s/g, "");
      const hasBadReturn = /return\s*\(\s*\{/.test(ans);
      if (hasBadReturn) return "syntax";
      const hasValidReturn = /return\s*\(/.test(ans);
      const hasInput = a.includes("<input");
      const hasValue = a.includes("value={") || a.includes("value={text}");
      const hasOnChange = a.includes("onchange={");
      if (hasValidReturn && hasInput && hasValue && hasOnChange) return "correct";
      if (hasInput && hasValue && !hasOnChange) return "partial_onchange";
      if (hasInput && hasOnChange && !hasValue) return "partial_value";
      if (hasInput) return "partial";
      return "wrong";
    },
    feedback_correct: "✅ value={text} makes this a controlled input — React owns what's displayed. onChange={handleChange} keeps state in sync on every keystroke.",
    feedback_syntax: "Syntax error: return(){\n  is not valid. Use return (\n  to wrap JSX.",
    feedback_partial_onchange: "Good — value={text} is there. Now add onChange={handleChange} so React updates state on every keystroke.",
    feedback_partial_value: "Good — onChange={handleChange} is there. Now add value={text} to make it a controlled input. Without it, React doesn't own the displayed value.",
    feedback_partial: "You have the input — now wire it: add both value={text} and onChange={handleChange}.",
    feedback_wrong: `return (
  <div>
    <input value={text} onChange={handleChange} />
  </div>
)`,
    expected: `return (
  <div>
    <input value={text} onChange={handleChange} />
  </div>
)`,
    seed_code: `import { useState } from 'react'

export default function ControlledInput() {
  const [text, setText] = useState("")

  const handleChange = (e) => setText(e.target.value)

  // Step 3: write JSX — wired input (no paragraph yet)
  
}`,
  },
  {
    id: "step4",
    type: "question",
    phase: "Step 4 of 5",
    paal: "Add a paragraph below the input that shows the live text. Display it as: You typed: {text}",
    hint: "Render the paragraph inside the same div, below the input. Use a template: <p>You typed: {text}</p> — the {text} part is JSX interpolation.",
    analogy: {
      title: "Similar pattern — live character count",
      code: `<p>{query.length} characters</p>`,
      explain: "Anything in {} inside JSX is evaluated as JS. {text} renders whatever is currently in state — updating live on every keystroke.",
    },
    evaluate: (ans) => {
      const a = ans.toLowerCase().replace(/\s/g, "");
      const hasParagraph = a.includes("<p>");
      const hasTextVar = a.includes("{text}") || a.includes("{show}") || a.includes("{value}");
      const hasInput = a.includes("<input");
      const hasOnChange = a.includes("onchange={");
      if (hasParagraph && hasTextVar && hasInput && hasOnChange) return "correct";
      if (hasParagraph && !hasTextVar) return "partial_interp";
      if (!hasParagraph && hasInput) return "partial_p";
      return "wrong";
    },
    feedback_correct: "✅ {text} inside JSX renders the live state value. Every keystroke → onChange → setText → re-render → paragraph updates. That's the full controlled input loop.",
    feedback_partial_interp: "Paragraph is there — but make it dynamic. Use {text} inside it so it reflects state: <p>You typed: {text}</p>",
    feedback_partial_p: "Input is wired — now add the paragraph below it: <p>You typed: {text}</p>",
    feedback_wrong: `Add below the input:\n<p>You typed: {text}</p>\n\n{text} renders whatever is currently in state.`,
    expected: `<p>You typed: {text}</p>`,
    seed_code: `import { useState } from 'react'

export default function ControlledInput() {
  const [text, setText] = useState("")

  const handleChange = (e) => setText(e.target.value)

  // Step 4: add a paragraph showing "You typed: {text}"
  return (
    <div>
      <input value={text} onChange={handleChange} />
    </div>
  )
}`,
  },
  {
    id: "step5",
    type: "question",
    phase: "Step 5 of 5",
    paal: "Here's the component you've built so far. The paragraph is missing. Add <p>You typed: {text}</p> below the input, then submit the full component.",
    hint: "Order: useState → handleChange → return with input (value + onChange) → paragraph showing text.",
    analogy: {
      title: "Reference — full controlled input pattern",
      code: `import { useState } from 'react'

export default function Search() {
  const [query, setQuery] = useState("")

  const handleChange = (e) => setQuery(e.target.value)

  return (
    <div>
      <input value={query} onChange={handleChange} />
      <p>Searching for: {query}</p>
    </div>
  )
}`,
      explain: "Same structure — different domain. query starts empty, your text starts empty. handleChange reads e.target.value. The paragraph mirrors state live.",
    },
    evaluate: (ans) => {
      const a = ans.toLowerCase().replace(/\s/g, "");
      const checks = [
        a.includes("import") && a.includes("usestate"),
        a.includes("exportdefaultfunction") || a.includes("exportdefault"),
        a.includes('usestate("")') || a.includes("usestate('')"),
        a.includes("e.target.value"),
        a.includes("value={"),
        a.includes("onchange={"),
        a.includes("<p>") && (a.includes("{text}") || a.includes("{show}") || a.includes("{value}")),
      ];
      const passed = checks.filter(Boolean).length;
      if (passed >= 6) return "correct";
      if (passed >= 4) return "partial";
      return "wrong";
    },
    feedback_correct: "✅ Complete. useState(\"\") → handleChange with e.target.value → controlled input with value + onChange → live paragraph. That's the full controlled input pattern.",
    feedback_partial: "Almost — check: useState(\"\") for initial value, e.target.value in handleChange, value={text} and onChange={handleChange} on the input, {text} in the paragraph.",
    feedback_wrong: "Start: import → export default function → useState(\"\") → handleChange → return with wired input and live paragraph.",
    expected: `import { useState } from 'react'

export default function ControlledInput() {
  const [text, setText] = useState("")

  const handleChange = (e) => setText(e.target.value)

  return (
    <div>
      <input value={text} onChange={handleChange} />
      <p>You typed: {text}</p>
    </div>
  )
}`,
    seed_code: `import { useState } from 'react'

export default function ControlledInput() {
  const [text, setText] = useState("")

  const handleChange = (e) => setText(e.target.value)

  return (
    <div>
      <input value={text} onChange={handleChange} />
      // Step 5: add the paragraph showing live text
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
  const [userChoices, setUserChoices] = useState({
    varName: "text", setterName: "setText", handlerName: "handleChange", paraPrefix: "You typed:",
  });

  const node = NODES[nodeIndex];
  const progress = NODES.length <= 1 ? 0 : Math.min(100, Math.round((nodeIndex / (NODES.length - 1)) * 100));

  function getSeed(n) {
    if (n?.id === "step4" && userChoices.userJSX) {
      const base = userChoices.userJSX
        .replace(/\/\/\s*Step\s*\d[^\n]*/g, "")
        .replace(/\n{3,}/g, "\n\n")
        .trimEnd()
        .replace(/}\s*$/, "").trimEnd();
      return base + "\n  // Step 4: add the paragraph showing live text\n}";
    }
    if (n?.id === "step5" && userChoices.userJSX4) {
      const base = userChoices.userJSX4
        .replace(/\/\/\s*Step\s*\d[^\n]*/g, "")
        .replace(/\n{3,}/g, "\n\n")
        .trimEnd()
        .replace(/}\s*$/, "").trimEnd();
      return base + "\n    // Step 5: add the paragraph showing live text\n    </div>\n  )\n}";
    }
    let seed = n?.seed_code ?? "";
    seed = seed.replace(/\btext\b/g, userChoices.varName);
    seed = seed.replace(/\bsetText\b/g, userChoices.setterName);
    seed = seed.replace(/\bhandleChange\b/g, userChoices.handlerName);
    return seed;
  }

  useEffect(() => {
    const currentNode = NODES[nodeIndex];
    const seed = getSeed(currentNode);
    setAnswer(seed);
    setResult(null);
    setAttempts(0);
    setShowHint(false);
    setShowExpected(false);
    setShowAnalogy(false);
    setSyntaxMsg(null);
    setTimeout(() => {
      if (editorRef.current) {
        const ta = editorRef.current;
        ta.focus();
        const commentIdx = seed.indexOf("// Step");
        if (commentIdx !== -1) {
          const afterComment = seed.indexOf("\n", commentIdx);
          const pos = afterComment !== -1 ? afterComment + 1 : seed.length;
          ta.setSelectionRange(pos, pos);
          const linesBefore = seed.substring(0, commentIdx).split("\n").length - 1;
          ta.scrollTop = Math.max(0, (linesBefore * 21) - (ta.clientHeight / 2));
        } else {
          ta.setSelectionRange(seed.length, seed.length);
          ta.scrollTop = ta.scrollHeight;
        }
      }
    }, 60);
  }, [nodeIndex, userChoices]);

  function next() {
    if (node?.id === "step1") {
      const match = answer.match(/const\s*\[(\w+)\s*,\s*(\w+)\]/);
      if (match) setUserChoices(c => ({ ...c, varName: match[1], setterName: match[2] }));
    }
    if (node?.id === "step2") {
      const match = answer.match(/const\s+(\w+)\s*=/);
      if (match) setUserChoices(c => ({ ...c, handlerName: match[1] }));
    }
    if (node?.id === "step3") {
      setUserChoices(c => ({ ...c, userJSX: answer }));
    }
    if (node?.id === "step4") {
      setUserChoices(c => ({ ...c, userJSX4: answer }));
    }
    if (node?.id) setCompletedNodes((p) => (p.includes(node.id) ? p : [...p, node.id]));
    setNodeIndex((i) => Math.min(i + 1, NODES.length));
  }

  function submit() {
    if (!answer.trim()) return;
    const syntaxError = validateSyntax(answer);
    if (syntaxError) {
      setResult("syntax");
      setSyntaxMsg(syntaxError);
      setAttempts((a) => a + 1);
      return;
    }
    setSyntaxMsg(null);
    const res = runEvaluate(node, answer);
    setResult(res);
    setAttempts((a) => a + 1);
    if (attempts >= 1) setShowHint(true);
    if (attempts >= 2) setShowExpected(true);
  }

  // ── STYLES ──────────────────────────────────────────────────────────────────
  const s = {
    wrap: { minHeight: "100vh", background: "#080c14", color: "#e2e8f0", fontFamily: "'DM Sans', sans-serif", letterSpacing: "0.01em", display: "flex", flexDirection: "column" },
    topbar: { background: "#0d1117", borderBottom: "1px solid #1e2733", padding: "12px 24px", display: "flex", alignItems: "center", gap: "16px" },
    logo: { fontFamily: "'DM Sans', sans-serif", fontSize: "13px", fontWeight: "700", letterSpacing: "3px", color: "#00d4ff" },
    progressTrack: { flex: 1, height: "3px", background: "#1e2733", borderRadius: "2px", overflow: "hidden" },
    progressFill: { height: "100%", width: `${progress}%`, background: "linear-gradient(90deg, #00d4ff, #7c3aed)", transition: "width 0.5s ease" },
    progressLabel: { fontFamily: "'DM Sans', sans-serif", fontSize: "11px", color: "#4a5568", letterSpacing: "1px" },
    body: { display: "flex", flex: 1 },
    sidebar: { width: "220px", background: "#0d1117", borderRight: "1px solid #1e2733", padding: "24px 0", flexShrink: 0 },
    sidebarLabel: { fontFamily: "'DM Sans', sans-serif", fontSize: "10px", color: "#4a5568", letterSpacing: "2px", padding: "0 20px 12px" },
    sideItem: (isActive, isDone, isLocked) => ({ padding: "10px 20px", display: "flex", alignItems: "center", gap: "10px", cursor: "pointer", background: isActive ? "#1a2332" : "transparent", borderLeft: isActive ? "2px solid #00d4ff" : "2px solid transparent", transition: "all 0.2s" }),
    sideItemDot: (isActive, isDone) => ({ width: "8px", height: "8px", borderRadius: "50%", background: isDone ? "#10b981" : isActive ? "#00d4ff" : "#2d3748", flexShrink: 0 }),
    sideItemText: (isActive, isDone, isLocked) => ({ fontFamily: "'DM Sans', sans-serif", fontSize: "11px", color: isDone ? "#10b981" : isActive ? "#e2e8f0" : "#4a5568", letterSpacing: "0.5px" }),
    main: { flex: 1, padding: "48px", maxWidth: "760px", margin: "0 auto", width: "100%" },
    phase: { fontFamily: "'DM Sans', sans-serif", fontSize: "10px", letterSpacing: "3px", color: "#00d4ff", marginBottom: "16px" },
    tag: { fontFamily: "'DM Sans', sans-serif", fontSize: "11px", color: "#a78bfa", fontWeight: "600", letterSpacing: "0.15em", marginBottom: "12px" },
    h1: { fontSize: "28px", fontWeight: "400", color: "#f8fafc", marginBottom: "32px", lineHeight: "1.2", letterSpacing: "-0.3px" },
    pre: { fontFamily: "'DM Sans', sans-serif", fontSize: "13px", lineHeight: "1.8", color: "#a0aec0", background: "#0d1117", border: "1px solid #1e2733", borderRadius: "8px", padding: "24px", whiteSpace: "pre-wrap", marginBottom: "32px" },
    paalBox: { background: "#0d1117", border: "1px solid #1e2733", borderLeft: "3px solid #00d4ff", borderRadius: "8px", padding: "20px 24px", marginBottom: "24px" },
    paalLabel: { fontFamily: "'DM Sans', sans-serif", fontSize: "10px", color: "#00d4ff", letterSpacing: "2px", marginBottom: "10px" },
    paalText: { fontSize: "16px", color: "#e2e8f0", lineHeight: "1.6" },
    btnRow: { display: "flex", gap: "12px", marginTop: "16px", flexWrap: "wrap" },
    btn: (variant) => ({
      padding: "10px 24px", borderRadius: "6px", border: "none", cursor: "pointer",
      fontFamily: "'DM Sans', sans-serif", fontSize: "12px", fontWeight: "700", letterSpacing: "0.08em",
      transition: "all 0.2s",
      background: variant === "primary" ? "#00d4ff" : variant === "ghost" ? "transparent" : "#1a2332",
      color: variant === "primary" ? "#080c14" : variant === "ghost" ? "#4a5568" : "#a0aec0",
      border: variant === "ghost" ? "1px solid #2d3748" : "none",
    }),
    feedback: (type) => ({
      marginTop: "20px", padding: "16px 20px", borderRadius: "8px",
      fontFamily: "'DM Sans', sans-serif", fontSize: "12px", lineHeight: "1.8",
      background: type === "correct" ? "rgba(16,185,129,0.08)" : type === "partial" ? "rgba(245,158,11,0.08)" : "rgba(239,68,68,0.08)",
      border: `1px solid ${type === "correct" ? "#10b981" : type === "partial" ? "#f59e0b" : "#ef4444"}`,
      color: type === "correct" ? "#10b981" : type === "partial" ? "#f59e0b" : "#ef4444",
      whiteSpace: "pre-wrap",
    }),
    hintBox: { marginTop: "12px", padding: "12px 16px", background: "rgba(124,58,237,0.08)", border: "1px solid #7c3aed", borderRadius: "6px", fontFamily: "'DM Sans', sans-serif", fontSize: "11px", color: "#9f7aea", lineHeight: "1.7" },
    expectedBox: { marginTop: "12px", padding: "16px", background: "#0d1117", border: "1px solid #2d3748", borderRadius: "6px", fontFamily: "'DM Sans', sans-serif", fontSize: "12px", color: "#718096", whiteSpace: "pre-wrap", lineHeight: "1.7" },
    anchorCard: { background: "linear-gradient(135deg, #0d1117 0%, #1a0a2e 100%)", border: "1px solid #7c3aed", borderRadius: "12px", padding: "32px" },
    anchorTitle: { fontFamily: "'DM Sans', sans-serif", fontSize: "10px", letterSpacing: "3px", color: "#7c3aed", marginBottom: "20px" },
    anchorRule: { fontSize: "18px", fontWeight: "700", color: "#f8fafc", lineHeight: "1.5", marginBottom: "24px" },
    anchorMeta: { display: "flex", flexDirection: "column", gap: "12px" },
    anchorRow: { display: "flex", gap: "12px" },
    anchorLabel: { fontFamily: "'DM Sans', sans-serif", fontSize: "10px", color: "#4a5568", letterSpacing: "1px", width: "80px", flexShrink: 0, marginTop: "2px" },
    anchorValue: { fontSize: "13px", color: "#a0aec0", lineHeight: "1.6" },
    wfsRubric: { display: "flex", flexDirection: "column", gap: "8px", marginTop: "24px" },
    rubricItem: (checked) => ({ display: "flex", alignItems: "center", gap: "10px", padding: "10px 14px", background: checked ? "rgba(16,185,129,0.06)" : "#0d1117", border: `1px solid ${checked ? "#10b981" : "#1e2733"}`, borderRadius: "6px", cursor: "pointer", transition: "all 0.2s" }),
    rubricText: (checked) => ({ fontSize: "13px", color: checked ? "#10b981" : "#718096", lineHeight: "1.5" }),
    completeBanner: { display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "60vh", textAlign: "center" },
  };

  const sideItems = [
    { label: "Problem", id: "intro" },
    { label: "Objectives", id: "objectives" },
    { label: "Step 1 — String state", id: "step1" },
    { label: "Step 2 — handleChange", id: "step2" },
    { label: "Step 3 — Controlled input", id: "step3" },
    { label: "Step 4 — Live paragraph", id: "step4" },
    { label: "Step 5 — Full", id: "step5" },
  ];

  // ── RENDERERS ───────────────────────────────────────────────────────────────
  function renderReveal() {
    return (
      <div>
        <div style={s.phase}>{node.phase}</div>
        {node.content.tag && <div style={s.tag}>{node.content.tag}</div>}
        {node.content.title && <h1 style={s.h1}>{node.content.title}</h1>}
        <div style={s.pre}>{node.content.body}</div>
        {node.content.usecase && (
          <div style={{ background: "rgba(0,212,255,0.05)", border: "1px solid rgba(0,212,255,0.2)", borderLeft: "3px solid #00d4ff", borderRadius: "8px", padding: "16px 20px", marginBottom: "28px" }}>
            <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "10px", letterSpacing: "2px", color: "#00d4ff", marginBottom: "8px" }}>💡 WHY THIS MATTERS</div>
            <div style={{ fontSize: "14px", color: "#a0aec0", lineHeight: "1.7" }}>{node.content.usecase}</div>
          </div>
        )}
        <div style={s.btnRow}>
          <button style={s.btn("primary")} onClick={next}>CONTINUE →</button>
        </div>
      </div>
    );
  }

  function renderObjectives() {
    return (
      <div>
        <style>{`@keyframes fadeUp { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }`}</style>
        <div style={s.phase}>{node.phase}</div>
        <h1 style={s.h1}>After completing this problem, you'll be able to:</h1>
        <div>
          {node.items.map((item, i) => (
            <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "16px", padding: "14px 0", borderBottom: "1px solid #1e2733", animation: "fadeUp 0.35s ease both", animationDelay: `${i * 80}ms` }}>
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "11px", color: "#00d4ff", marginTop: "3px", flexShrink: 0, minWidth: "20px" }}>{String(i + 1).padStart(2, "0")}</div>
              <div style={{ fontSize: "15px", color: "#cbd5e0", lineHeight: "1.6" }}>{item}</div>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", gap: "12px", marginTop: "32px" }}>
          <button style={s.btn("primary")} onClick={next}>LET'S BUILD →</button>
        </div>
      </div>
    );
  }

  function renderQuestion() {
    const rawFeedback =
      result === "correct" ? node.feedback_correct
      : result === "naming" ? node.feedback_naming
      : result === "named_param" ? node.feedback_named_param
      : result === "syntax" ? (syntaxMsg || node.feedback_syntax)
      : result === "partial_onchange" ? node.feedback_partial_onchange
      : result === "partial_value" ? node.feedback_partial_value
      : result === "partial_interp" ? node.feedback_partial_interp
      : result === "partial_p" ? node.feedback_partial_p
      : result === "partial" ? node.feedback_partial
      : result === "wrong" ? node.feedback_wrong
      : null;
    const feedbackMsg = typeof rawFeedback === "function" ? rawFeedback(answer) : rawFeedback;
    const feedbackType = ["naming", "syntax", "named_param", "partial_onchange", "partial_value", "partial_interp", "partial_p"].includes(result) ? "partial" : result;

    return (
      <div>
        <div style={s.phase}>{node.phase}</div>
        <div style={s.paalBox}>
          <div style={s.paalText}>{node.paal}</div>
        </div>

        {node.seed_code && (
          <div style={{ marginBottom: "8px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
              <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#10b981" }} />
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "10px", color: "#4a5568", letterSpacing: "2px" }}>CODE BUILT SO FAR — type below the comment</div>
            </div>
          </div>
        )}

        <CodeEditor value={answer} onChange={setAnswer} height="380px" />

        {showHint && result !== "correct" && (
          <div style={s.hintBox}>💡 HINT — {node.hint}</div>
        )}

        {feedbackMsg && (
          <div style={s.feedback(feedbackType)}>{feedbackMsg}</div>
        )}

        {showExpected && result !== "correct" && (
          <div>
            <div style={{ ...s.paalLabel, marginTop: "16px", marginBottom: "8px" }}>EXPECTED ANSWER</div>
            <div style={s.expectedBox}>{node.expected}</div>
          </div>
        )}

        <div style={s.btnRow}>
          {result !== "correct" ? (
            <>
              <button style={s.btn("primary")} onClick={submit}>SUBMIT</button>
              {node.analogy && (
                <button style={{ ...s.btn("secondary"), background: "rgba(124,58,237,0.15)", border: "1px solid #7c3aed", color: "#9f7aea" }} onClick={() => setShowAnalogy(true)}>
                  💡 SHOW ME AN EXAMPLE
                </button>
              )}
              {attempts > 0 && !showHint && (
                <button style={s.btn("secondary")} onClick={() => setShowHint(true)}>SHOW HINT</button>
              )}
              {attempts > 1 && !showExpected && (
                <button style={s.btn("ghost")} onClick={() => setShowExpected(true)}>SHOW ANSWER</button>
              )}
            </>
          ) : (
            <button style={s.btn("primary")} onClick={next}>NEXT STEP →</button>
          )}
        </div>

        {showAnalogy && node.analogy && (
          <div onClick={() => setShowAnalogy(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div onClick={(e) => e.stopPropagation()} style={{ background: "#0d1117", border: "1px solid #7c3aed", borderRadius: "12px", padding: "32px", maxWidth: "500px", width: "90%", boxShadow: "0 0 60px rgba(124,58,237,0.2)" }}>
              <div style={{ fontFamily: "'Courier New',monospace", fontSize: "10px", letterSpacing: "3px", color: "#7c3aed", marginBottom: "16px" }}>💡 ANALOGOUS EXAMPLE</div>
              <div style={{ fontSize: "16px", fontWeight: "700", color: "#f8fafc", marginBottom: "20px" }}>{node.analogy.title}</div>
              <pre style={{ fontFamily: "'Fira Code','Courier New',monospace", fontSize: "13px", lineHeight: "1.8", background: "#080c14", border: "1px solid #1e2733", borderRadius: "8px", padding: "16px 20px", color: "#10b981", whiteSpace: "pre-wrap", marginBottom: "20px" }}>{node.analogy.code}</pre>
              <div style={{ fontSize: "14px", color: "#a0aec0", lineHeight: "1.7", marginBottom: "28px", borderLeft: "2px solid #7c3aed", paddingLeft: "16px" }}>{node.analogy.explain}</div>
              <div style={{ fontFamily: "'Courier New',monospace", fontSize: "11px", color: "#4a5568", marginBottom: "20px" }}>Now apply the same pattern to your problem ↓</div>
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
        <div style={s.anchorCard}>
          <div style={s.anchorTitle}>⚓ ANCHOR CARD</div>
          <div style={s.anchorRule}>{node.rule}</div>
          <div style={s.anchorMeta}>
            <div style={s.anchorRow}>
              <div style={s.anchorLabel}>WHEN</div>
              <div style={s.anchorValue}>{node.when}</div>
            </div>
            <div style={s.anchorRow}>
              <div style={s.anchorLabel}>MISTAKE</div>
              <div style={s.anchorValue}>{node.mistake}</div>
            </div>
          </div>
        </div>
        <div style={s.btnRow}>
          <button style={s.btn("primary")} onClick={next}>GOT IT →</button>
        </div>
      </div>
    );
  }

  function renderConnect() {
    return (
      <div>
        <div style={s.phase}>{node.phase}</div>
        <h1 style={s.h1}>{node.title}</h1>
        <div style={{ background: "rgba(0,212,255,0.05)", border: "1px solid rgba(0,212,255,0.2)", borderLeft: "3px solid #00d4ff", borderRadius: "8px", padding: "16px 20px", marginBottom: "28px", fontSize: "15px", color: "#a0aec0", lineHeight: "1.8" }}>{node.context}</div>
        <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "10px", letterSpacing: "2px", color: "#7c3aed", marginBottom: "12px" }}>🔗 PATTERN MAP — each line maps back to a step you completed</div>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "28px" }}>
          {node.pattern_map.map((item, i) => (
            <div key={i} style={{ display: "flex", gap: "16px", alignItems: "flex-start", background: "#0d1117", border: "1px solid #1e2733", borderRadius: "6px", padding: "10px 14px" }}>
              <code style={{ fontFamily: "'Fira Code', monospace", fontSize: "12px", color: "#10b981", flexShrink: 0, lineHeight: "1.6", minWidth: "280px" }}>{item.line}</code>
              <div style={{ fontSize: "12px", color: "#718096", lineHeight: "1.6", borderLeft: "1px solid #2d3748", paddingLeft: "14px" }}>← {item.label}</div>
            </div>
          ))}
        </div>
        <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "10px", letterSpacing: "2px", color: "#4a5568", marginBottom: "10px" }}>FULL COMPONENT</div>
        <pre style={{ fontFamily: "'Fira Code','Courier New',monospace", fontSize: "13px", lineHeight: "1.8", background: "#0d1117", border: "1px solid #1e2733", borderRadius: "8px", padding: "20px 24px", color: "#e2e8f0", whiteSpace: "pre-wrap", marginBottom: "32px" }}>{node.code}</pre>
        <div style={s.btnRow}>
          <button style={s.btn("primary")} onClick={next}>CONTINUE →</button>
        </div>
      </div>
    );
  }

  function renderWFS() {
    const allChecked = wfsChecked.length === node.rubric.length;
    const [wfsSubmitted, setWfsSubmitted] = useState(false);
    return (
      <div>
        <div style={s.phase}>{node.phase}</div>
        <h1 style={s.h1}>Write From Scratch</h1>
        <div style={{ background: "rgba(0,212,255,0.05)", border: "1px solid rgba(0,212,255,0.15)", borderLeft: "3px solid #00d4ff", borderRadius: "8px", padding: "16px 20px", marginBottom: "24px", fontSize: "14px", color: "#a0aec0", lineHeight: "1.8" }}>
          Blank editor below — no hints, no seed code. Reproduce the full ControlledInput component from memory. When done, hit <strong style={{ color: "#e2e8f0" }}>CHECK MY CODE</strong> and self-assess.
        </div>
        <CodeEditor value={answer} onChange={setAnswer} height="380px" />
        {!wfsSubmitted ? (
          <div style={s.btnRow}>
            <button style={s.btn("primary")} onClick={() => { if (answer.trim()) setWfsSubmitted(true); }}>CHECK MY CODE →</button>
          </div>
        ) : (
          <>
            <div style={{ ...s.paalLabel, marginTop: "24px", marginBottom: "12px" }}>SELF-CHECK RUBRIC — tick each line you got right</div>
            <div style={s.wfsRubric}>
              {node.rubric.map((item, i) => {
                const checked = wfsChecked.includes(i);
                return (
                  <div key={i} style={s.rubricItem(checked)} onClick={() => setWfsChecked((p) => checked ? p.filter((x) => x !== i) : [...p, i])}>
                    <div style={{ width: 16, height: 16, flexShrink: 0 }}>
                      {checked
                        ? <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        : <div style={{ width: 14, height: 14, border: "1px solid #4a5568", borderRadius: "3px" }} />}
                    </div>
                    <div style={s.rubricText(checked)}>{item}</div>
                  </div>
                );
              })}
            </div>
            {allChecked && (
              <div style={{ marginTop: "24px" }}>
                <div style={s.feedback("correct")}>✅ Problem #3 complete. You've mastered controlled inputs and e.target.value.{"\n"}Next: Problem #4 — Multiple State Variables</div>
                <div style={s.btnRow}>
                  <button style={s.btn("primary")} onClick={onNextProblem ?? next}>NEXT PROBLEM →</button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    );
  }

  function renderComplete() {
    return (
      <div style={s.completeBanner}>
        <div style={{ fontSize: "48px", marginBottom: "24px" }}>🎯</div>
        <h1 style={{ ...s.h1, textAlign: "center" }}>Problem #3 Complete</h1>
        <p style={{ color: "#4a5568", fontFamily: "'DM Sans', sans-serif", fontSize: "13px" }}>Controlled inputs mastered. Ready for Problem #4.</p>
        {onNextProblem && (
          <div style={s.btnRow}>
            <button style={s.btn("primary")} onClick={onNextProblem}>NEXT PROBLEM →</button>
          </div>
        )}
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
        <div style={{ ...s.progressLabel, marginLeft: "8px" }}>P03 — CONTROLLED INPUT</div>
      </div>
      <div style={s.body}>
        <div style={s.sidebar}>
          <div style={s.sidebarLabel}>PROGRESS</div>
          {sideItems.map((item, i) => {
            const isActive = NODES[nodeIndex]?.id === item.id || (nodeIndex >= NODES.length && i === NODES.length - 1);
            const isDone = completedNodes.includes(item.id);
            const isLocked = !isDone && !isActive;
            return (
              <div
                key={item.id}
                style={s.sideItem(isActive, isDone, isLocked)}
                onClick={() => setNodeIndex(i)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setNodeIndex(i); } }}
              >
                <div style={s.sideItemDot(isActive, isDone)} />
                <div style={s.sideItemText(isActive, isDone, isLocked)}>{item.label}</div>
                {isDone && <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
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
