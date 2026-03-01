import { useState, useEffect } from "react";
import CodeEditor from "./CodeEditor";

// ─── TUTORIAL DATA ────────────────────────────────────────────────────────────
const NODES = [
  {
    id: "intro",
    type: "reveal",
    phase: "Problem",
    content: {
      tag: "PROBLEM #4",
      title: "Multiple State Variables",
      body: `A profile card form with two independent inputs — name and age.

Each input has its own state. Changing one doesn't affect the other.

Example:
  name: [ Alice     ]
  age:  [ 30        ]

  → Hello, Alice! You are 30 years old.`,
      usecase: `Every real form has multiple fields. useState can be called multiple times — each call creates a completely independent piece of state. This is how React manages forms, filters, and multi-field UIs.`,
    },
  },
  {
    id: "objectives",
    type: "objectives",
    phase: "Objectives",
    items: [
      "Call useState multiple times in one component — each call is independent",
      "Understand that updating one state variable never affects another",
      "Write separate onChange handlers for each input",
      "Render both values in a live output paragraph",
      "Understand why we don't put both values in one useState object",
    ],
  },
  {
    id: "step1",
    type: "question",
    phase: "Step 1 of 5",
    paal: `Declare two state variables: one called name (setter: setName) starting as an empty string, and one called age (setter: setAge) also starting as an empty string. Both inputs start blank.`,
    hint: `Call useState twice — once for each field. They're completely independent:\nconst [name, setName] = useState("")\nconst [age, setAge] = useState("")`,
    analogy: {
      title: "Similar pattern — login form",
      code: `const [email, setEmail] = useState("")\nconst [password, setPassword] = useState("")`,
      explain: "Two separate useState calls — two independent pieces of state. Changing email never touches password. Same idea: your name and age states are completely separate.",
    },
    evaluate: (ans) => {
      const a = ans.replace(/\s/g, "").toLowerCase();
      const hasName = a.includes("usestate") && /const\[name,/.test(ans.replace(/\s/g, ""));
      const hasAge = a.includes("usestate") && /const\[age,/.test(ans.replace(/\s/g, ""));
      const hasTwoUseState = (a.match(/usestate/g) || []).length >= 2;
      const hasSomeName = /const\[\w+,/.test(ans.replace(/\s/g, ""));
      const hasEmpty = (a.match(/usestate\(""\)/g) || a.match(/usestate\(''\)/g) || []).length >= 1;
      if (hasName && hasAge && hasTwoUseState) return "correct";
      if (hasTwoUseState && hasEmpty) return "naming";
      if (hasTwoUseState) return "partial";
      if (a.includes("usestate")) return "partial";
      return "wrong";
    },
    feedback_correct: `✅ Two independent useState("") calls. Updating name never touches age — they're completely separate pieces of state.`,
    feedback_naming: (ans) => {
      return `✅ Good — two useState("") calls is right.\n\nFor this tutorial use name/setName and age/setAge so the steps stay in sync:\n\nconst [name, setName] = useState("")\nconst [age, setAge] = useState("")`;
    },
    feedback_partial: (ans) => {
      const a = ans.replace(/\s/g, "").toLowerCase();
      const count = (a.match(/usestate/g) || []).length;
      if (count < 2) return `You need two separate useState calls — one for name, one for age. Each field gets its own state.`;
      return `Almost — make sure both start as "" (empty string) since both inputs start blank.`;
    },
    feedback_wrong: `Declare both like:\nconst [name, setName] = useState("")\nconst [age, setAge] = useState("")\n\nTwo calls — two independent pieces of state.`,
    expected: `const [name, setName] = useState("")\nconst [age, setAge] = useState("")`,
    seed_code: `import { useState } from 'react'

export default function ProfileCard() {
  // Step 1: declare two state variables — name and age, both start empty

}`,
  },
  {
    id: "step2",
    type: "question",
    phase: "Step 2 of 5",
    paal: `Write two handler functions: handleNameChange and handleAgeChange. Each reads e.target.value and updates its own state variable.`,
    hint: `One handler per field — each calls its own setter:\nconst handleNameChange = (e) => setName(e.target.value)\nconst handleAgeChange = (e) => setAge(e.target.value)`,
    analogy: {
      title: "Similar pattern — login handlers",
      code: `const handleEmail = (e) => setEmail(e.target.value)\nconst handlePassword = (e) => setPassword(e.target.value)`,
      explain: "Separate handler for each field. Each one reads e.target.value and updates only its own state. They never cross-contaminate.",
    },
    evaluate: (ans) => {
      const a = ans.toLowerCase().replace(/\s/g, "");
      const hasTwoHandlers = (a.match(/const\w+=\(e\)=>/g) || a.match(/const\w+=e=>/g) || []).length >= 1;
      const hasETargetValue = (a.match(/e\.target\.value/g) || []).length >= 2;
      const hasSetName = a.includes("setname");
      const hasSetAge = a.includes("setage");
      const hasBothSetters = hasSetName && hasSetAge;
      if (hasETargetValue && hasBothSetters) return "correct";
      if (hasETargetValue && (hasSetName || hasSetAge)) return "partial";
      if (a.includes("e.target.value")) return "partial";
      return "wrong";
    },
    feedback_correct: `✅ Two handlers, each reading e.target.value and calling its own setter. Clean separation — name state never touches age state.`,
    feedback_partial: (ans) => {
      const a = ans.toLowerCase().replace(/\s/g, "");
      const count = (a.match(/e\.target\.value/g) || []).length;
      if (count < 2) return `You need two handlers — one calling setName(e.target.value) and one calling setAge(e.target.value).`;
      if (!a.includes("setname")) return `Good — now add a handler for name too: const handleNameChange = (e) => setName(e.target.value)`;
      if (!a.includes("setage")) return `Good — now add a handler for age too: const handleAgeChange = (e) => setAge(e.target.value)`;
      return `Almost — each handler needs e.target.value to read what was typed.`;
    },
    feedback_wrong: `const handleNameChange = (e) => setName(e.target.value)\nconst handleAgeChange = (e) => setAge(e.target.value)\n\nOne handler per field.`,
    expected: `const handleNameChange = (e) => setName(e.target.value)\nconst handleAgeChange = (e) => setAge(e.target.value)`,
    seed_code: `import { useState } from 'react'

export default function ProfileCard() {
  const [name, setName] = useState("")
  const [age, setAge] = useState("")

  // Step 2: write handleNameChange and handleAgeChange

}`,
  },
  {
    id: "step3",
    type: "question",
    phase: "Step 3 of 5",
    paal: `Write the JSX. Two inputs — one for name (wired to name state + handleNameChange), one for age (wired to age state + handleAgeChange). Add placeholder text to each. No output paragraph yet.`,
    hint: `Each input follows the same controlled pattern:\n<input value={name} onChange={handleNameChange} placeholder="Your name" />\n<input value={age} onChange={handleAgeChange} placeholder="Your age" />`,
    analogy: {
      title: "Similar pattern — login form JSX",
      code: `return (\n  <div>\n    <input value={email} onChange={handleEmail} placeholder="Email" />\n    <input value={password} onChange={handlePassword} placeholder="Password" />\n  </div>\n)`,
      explain: "Same controlled pattern per input — value= ties it to state, onChange= keeps state in sync. Just repeated for each field.",
    },
    evaluate: (ans) => {
      const a = ans.toLowerCase().replace(/\s/g, "");
      const hasBadReturn = /return\s*\(\s*\{/.test(ans);
      if (hasBadReturn) return "syntax";
      const hasValidReturn = /return\s*\(/.test(ans);
      const inputCount = (a.match(/<input/g) || []).length;
      const valueCount = (a.match(/value=\{/g) || []).length;
      const onChangeCount = (a.match(/onchange=\{/g) || []).length;
      if (hasValidReturn && inputCount >= 2 && valueCount >= 2 && onChangeCount >= 2) return "correct";
      if (inputCount >= 2 && (valueCount < 2 || onChangeCount < 2)) return "partial_wire";
      if (inputCount === 1) return "partial_one";
      if (inputCount === 0) return "wrong";
      return "partial";
    },
    feedback_correct: `✅ Two controlled inputs, each wired independently. value= and onChange= on both. React owns both fields.`,
    feedback_syntax: `Syntax error: return(){\n  is not valid. Use return ( to wrap JSX.`,
    feedback_partial_wire: (ans) => {
      const a = ans.toLowerCase().replace(/\s/g, "");
      const valueCount = (a.match(/value=\{/g) || []).length;
      const onChangeCount = (a.match(/onchange=\{/g) || []).length;
      const inputCount = (a.match(/<input/g) || []).length;
      if (valueCount < inputCount && onChangeCount >= inputCount) return `onChange is wired — but check your value= props. Make sure both inputs have value={name} and value={age} (not the same variable for both).`;
      if (onChangeCount < inputCount && valueCount >= inputCount) return `value= is wired — but both inputs need onChange too.\n\nAdd to the name input:  onChange={handleNameChange}\nAdd to the age input:   onChange={handleAgeChange}`;
      return `Both inputs need value= and onChange=:\n\nName input:  value={name} onChange={handleNameChange}\nAge input:   value={age} onChange={handleAgeChange}`;
    },
    feedback_partial_one: `Good start — but you need two inputs, one for name and one for age. Each gets its own value and onChange.`,
    feedback_partial: `Almost — make sure both inputs have value={} and onChange={} wired to their own state and handler.`,
    feedback_wrong: `return (\n  <div>\n    <input value={name} onChange={handleNameChange} placeholder="Your name" />\n    <input value={age} onChange={handleAgeChange} placeholder="Your age" />\n  </div>\n)`,
    expected: `return (\n  <div>\n    <input value={name} onChange={handleNameChange} placeholder="Your name" />\n    <input value={age} onChange={handleAgeChange} placeholder="Your age" />\n  </div>\n)`,
    seed_code: `import { useState } from 'react'

export default function ProfileCard() {
  const [name, setName] = useState("")
  const [age, setAge] = useState("")

  const handleNameChange = (e) => setName(e.target.value)
  const handleAgeChange = (e) => setAge(e.target.value)

  // Step 3: write JSX with two controlled inputs (no output yet)

}`,
  },
  {
    id: "step4",
    type: "question",
    phase: "Step 4 of 5",
    paal: `Add a paragraph below the inputs that shows: Hello, {name}! You are {age} years old. Both values should update live as the user types.`,
    hint: `Interpolate both state values in one paragraph:\n<p>Hello, {name}! You are {age} years old.</p>\nBoth update live on every keystroke.`,
    analogy: {
      title: "Similar pattern — live preview",
      code: `<p>Logging in as {email}</p>`,
      explain: "JSX interpolation works the same for multiple variables — just reference each one in {}. React re-renders whenever any state updates.",
    },
    evaluate: (ans) => {
      const a = ans.toLowerCase().replace(/\s/g, "");
      const hasParagraph = a.includes("<p>");
      const hasName = a.includes("{name}");
      const hasAge = a.includes("{age}");
      const hasInputs = (a.match(/<input/g) || []).length >= 2;
      if (hasParagraph && hasName && hasAge && hasInputs) return "correct";
      if (hasParagraph && (hasName || hasAge) && hasInputs) return "partial_one_var";
      if (!hasParagraph && hasInputs) return "partial_no_p";
      return "wrong";
    },
    feedback_correct: `✅ Both {name} and {age} interpolated live. Every keystroke updates that state variable, React re-renders, paragraph reflects the latest values.`,
    feedback_partial_one_var: (ans) => {
      const a = ans.toLowerCase().replace(/\s/g, "");
      if (!a.includes("{name}")) return `Age is showing — now add {name} to the paragraph too.`;
      return `Name is showing — now add {age} to the paragraph too.`;
    },
    feedback_partial_no_p: `Inputs are wired — now add the output paragraph below them:\n<p>Hello, {name}! You are {age} years old.</p>`,
    feedback_wrong: `Add below the inputs:\n<p>Hello, {name}! You are {age} years old.</p>`,
    expected: `<p>Hello, {name}! You are {age} years old.</p>`,
    seed_code: `import { useState } from 'react'

export default function ProfileCard() {
  const [name, setName] = useState("")
  const [age, setAge] = useState("")

  const handleNameChange = (e) => setName(e.target.value)
  const handleAgeChange = (e) => setAge(e.target.value)

  // Step 4: add the output paragraph showing both values
  return (
    <div>
      <input value={name} onChange={handleNameChange} placeholder="Your name" />
      <input value={age} onChange={handleAgeChange} placeholder="Your age" />
    </div>
  )
}`,
  },
  {
    id: "step5",
    type: "question",
    phase: "Step 5 of 5",
    paal: `Here's everything you've built. The output paragraph is missing. Add it below the inputs, then submit the full component.`,
    hint: `Full structure: import → two useState("") → two handlers → return with two wired inputs + output paragraph.`,
    analogy: {
      title: "Reference — full multi-state pattern",
      code: `import { useState } from 'react'

export default function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleEmail = (e) => setEmail(e.target.value)
  const handlePassword = (e) => setPassword(e.target.value)

  return (
    <div>
      <input value={email} onChange={handleEmail} placeholder="Email" />
      <input value={password} onChange={handlePassword} placeholder="Password" />
      <p>Logging in as: {email}</p>
    </div>
  )
}`,
      explain: "Same structure — two useState, two handlers, two wired inputs, one output. Just different field names.",
    },
    evaluate: (ans) => {
      const a = ans.toLowerCase().replace(/\s/g, "");
      const checks = [
        a.includes("import") && a.includes("usestate"),
        (a.match(/usestate\(""\)/g) || a.match(/usestate\(''\)/g) || []).length >= 2,
        (a.match(/e\.target\.value/g) || []).length >= 2,
        (a.match(/<input/g) || []).length >= 2,
        (a.match(/value=\{/g) || []).length >= 2,
        (a.match(/onchange=\{/g) || []).length >= 2,
        a.includes("<p>") && a.includes("{name}") && a.includes("{age}"),
      ];
      const passed = checks.filter(Boolean).length;
      if (passed >= 6) return "correct";
      if (passed >= 4) return "partial";
      return "wrong";
    },
    feedback_correct: `✅ Complete. Two useState("") → two handlers with e.target.value → two controlled inputs → live output paragraph. That's multi-state in React.`,
    feedback_partial: `Almost — check: two useState(""), two handlers with e.target.value, value= and onChange= on both inputs, and {name} + {age} in the paragraph.`,
    feedback_wrong: `Start: import → two useState("") → handleNameChange + handleAgeChange → return with two wired inputs and output paragraph.`,
    expected: `import { useState } from 'react'

export default function ProfileCard() {
  const [name, setName] = useState("")
  const [age, setAge] = useState("")

  const handleNameChange = (e) => setName(e.target.value)
  const handleAgeChange = (e) => setAge(e.target.value)

  return (
    <div>
      <input value={name} onChange={handleNameChange} placeholder="Your name" />
      <input value={age} onChange={handleAgeChange} placeholder="Your age" />
      <p>Hello, {name}! You are {age} years old.</p>
    </div>
  )
}`,
    seed_code: `import { useState } from 'react'

export default function ProfileCard() {
  const [name, setName] = useState("")
  const [age, setAge] = useState("")

  const handleNameChange = (e) => setName(e.target.value)
  const handleAgeChange = (e) => setAge(e.target.value)

  return (
    <div>
      <input value={name} onChange={handleNameChange} placeholder="Your name" />
      <input value={age} onChange={handleAgeChange} placeholder="Your age" />
      // Step 5: add the output paragraph showing both name and age
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
  const [userChoices, setUserChoices] = useState({ var1: "name", setter1: "setName", var2: "age", setter2: "setAge", handler1: "handleNameChange", handler2: "handleAgeChange", userJSX3: null, userJSX4: null });
  const node = NODES[nodeIndex];
  const progress = NODES.length <= 1 ? 0 : Math.min(100, Math.round((nodeIndex / (NODES.length - 1)) * 100));

  function getSeed(n) {
    if (n?.id === "step4" && userChoices.userJSX3) {
      const base = userChoices.userJSX3.replace(/\/\/\s*Step\s*\d[^\n]*/g, "").replace(/\n{3,}/g, "\n\n").trimEnd()
        .replace(/}\s*$/, "").trimEnd();
      return base + "\n  // Step 4: add output paragraph showing both values\n}";
    }
    if (n?.id === "step5" && userChoices.userJSX4) {
      const base = userChoices.userJSX4.replace(/\/\/\s*Step\s*\d[^\n]*/g, "").replace(/\n{3,}/g, "\n\n").trimEnd()
        .replace(/}\s*$/, "").trimEnd();
      return base + "\n      // Step 5: add output paragraph here\n    </div>\n  )\n}";
    }
    let seed = n?.seed_code ?? "";
    seed = seed.replace(/\bname\b/g, userChoices.var1).replace(/\bsetName\b/g, userChoices.setter1);
    seed = seed.replace(/\bage\b/g, userChoices.var2).replace(/\bsetAge\b/g, userChoices.setter2);
    seed = seed.replace(/\bhandleNameChange\b/g, userChoices.handler1).replace(/\bhandleAgeChange\b/g, userChoices.handler2);
    return seed;
  }

  useEffect(() => {
    const currentNode = NODES[nodeIndex];
    const seed = getSeed(currentNode);
    setAnswer(seed);
    setResult(null); setAttempts(0); setShowHint(false); setShowExpected(false); setShowAnalogy(false); setSyntaxMsg(null);
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
        } else { ta.setSelectionRange(seed.length, seed.length); ta.scrollTop = ta.scrollHeight; }
      }
    }, 60);
  }, [nodeIndex, userChoices]);

  function next() {
    if (node?.id === "step1") {
      const matches = [...answer.matchAll(/const\s*\[(\w+)\s*,\s*(\w+)\]/g)];
      if (matches[0]) setUserChoices(c => ({ ...c, var1: matches[0][1], setter1: matches[0][2] }));
      if (matches[1]) setUserChoices(c => ({ ...c, var2: matches[1][1], setter2: matches[1][2] }));
    }
    if (node?.id === "step2") {
      const matches = [...answer.matchAll(/const\s+(\w+)\s*=/g)];
      if (matches[0]) setUserChoices(c => ({ ...c, handler1: matches[0][1] }));
      if (matches[1]) setUserChoices(c => ({ ...c, handler2: matches[1][1] }));
    }
    if (node?.id === "step3") setUserChoices(c => ({ ...c, userJSX3: answer }));
    if (node?.id === "step4") setUserChoices(c => ({ ...c, userJSX4: answer }));
    if (node?.id) setCompletedNodes(p => (p.includes(node.id) ? p : [...p, node.id]));
    setNodeIndex(i => Math.min(i + 1, NODES.length));
  }

  function submit() {
    if (!answer.trim()) return;
    const syntaxError = validateSyntax(answer);
    if (syntaxError) { setResult("syntax"); setSyntaxMsg(syntaxError); setAttempts(a => a + 1); return; }
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
    logo: { fontFamily: "'DM Sans', sans-serif", fontSize: "13px", fontWeight: "700", letterSpacing: "3px", color: "#00d4ff" },
    progressTrack: { flex: 1, height: "3px", background: "#1e2733", borderRadius: "2px", overflow: "hidden" },
    progressFill: { height: "100%", width: `${progress}%`, background: "linear-gradient(90deg, #00d4ff, #7c3aed)", transition: "width 0.5s ease" },
    progressLabel: { fontFamily: "'DM Sans', sans-serif", fontSize: "11px", color: "#4a5568", letterSpacing: "1px" },
    body: { display: "flex", flex: 1 },
    sidebar: { width: "220px", background: "#0d1117", borderRight: "1px solid #1e2733", padding: "24px 0", flexShrink: 0 },
    sidebarLabel: { fontFamily: "'DM Sans', sans-serif", fontSize: "10px", color: "#4a5568", letterSpacing: "2px", padding: "0 20px 12px" },
    sideItem: (a, d) => ({ padding: "10px 20px", display: "flex", alignItems: "center", gap: "10px", cursor: "pointer", background: a ? "#1a2332" : "transparent", borderLeft: a ? "2px solid #00d4ff" : "2px solid transparent" }),
    sideItemDot: (a, d) => ({ width: "8px", height: "8px", borderRadius: "50%", background: d ? "#10b981" : a ? "#00d4ff" : "#2d3748", flexShrink: 0 }),
    sideItemText: (a, d) => ({ fontFamily: "'DM Sans', sans-serif", fontSize: "11px", color: d ? "#10b981" : a ? "#e2e8f0" : "#4a5568", letterSpacing: "0.5px" }),
    phase: { fontFamily: "'DM Sans', sans-serif", fontSize: "10px", letterSpacing: "3px", color: "#00d4ff", marginBottom: "16px" },
    tag: { fontFamily: "'DM Sans', sans-serif", fontSize: "11px", color: "#a78bfa", fontWeight: "600", letterSpacing: "0.15em", marginBottom: "12px" },
    h1: { fontSize: "28px", fontWeight: "400", color: "#f8fafc", marginBottom: "32px", lineHeight: "1.2" },
    pre: { fontFamily: "'DM Sans', sans-serif", fontSize: "13px", lineHeight: "1.8", color: "#a0aec0", background: "#0d1117", border: "1px solid #1e2733", borderRadius: "8px", padding: "24px", whiteSpace: "pre-wrap", marginBottom: "32px" },
    paalBox: { background: "#0d1117", border: "1px solid #1e2733", borderLeft: "3px solid #00d4ff", borderRadius: "8px", padding: "20px 24px", marginBottom: "24px" },
    paalLabel: { fontFamily: "'DM Sans', sans-serif", fontSize: "10px", color: "#00d4ff", letterSpacing: "2px", marginBottom: "10px" },
    paalText: { fontSize: "16px", color: "#e2e8f0", lineHeight: "1.6" },
    btnRow: { display: "flex", gap: "12px", marginTop: "16px", flexWrap: "wrap" },
    btn: (v) => ({ padding: "10px 24px", borderRadius: "6px", border: "none", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", fontSize: "12px", fontWeight: "700", letterSpacing: "0.08em", background: v === "primary" ? "#00d4ff" : v === "ghost" ? "transparent" : "#1a2332", color: v === "primary" ? "#080c14" : v === "ghost" ? "#4a5568" : "#a0aec0", border: v === "ghost" ? "1px solid #2d3748" : "none" }),
    feedback: (t) => ({ marginTop: "20px", padding: "16px 20px", borderRadius: "8px", fontFamily: "'DM Sans', sans-serif", fontSize: "12px", lineHeight: "1.8", background: t === "correct" ? "rgba(16,185,129,0.08)" : t === "partial" ? "rgba(245,158,11,0.08)" : "rgba(239,68,68,0.08)", border: `1px solid ${t === "correct" ? "#10b981" : t === "partial" ? "#f59e0b" : "#ef4444"}`, color: t === "correct" ? "#10b981" : t === "partial" ? "#f59e0b" : "#ef4444", whiteSpace: "pre-wrap" }),
    hintBox: { marginTop: "12px", padding: "12px 16px", background: "rgba(124,58,237,0.08)", border: "1px solid #7c3aed", borderRadius: "6px", fontFamily: "'DM Sans', sans-serif", fontSize: "11px", color: "#9f7aea", lineHeight: "1.7", whiteSpace: "pre-wrap" },
    expectedBox: { marginTop: "12px", padding: "16px", background: "#0d1117", border: "1px solid #2d3748", borderRadius: "6px", fontFamily: "'DM Sans', sans-serif", fontSize: "12px", color: "#718096", whiteSpace: "pre-wrap", lineHeight: "1.7" },
    anchorCard: { background: "linear-gradient(135deg, #0d1117 0%, #1a0a2e 100%)", border: "1px solid #7c3aed", borderRadius: "12px", padding: "32px" },
    anchorTitle: { fontFamily: "'DM Sans', sans-serif", fontSize: "10px", letterSpacing: "3px", color: "#7c3aed", marginBottom: "20px" },
    anchorRule: { fontSize: "18px", fontWeight: "700", color: "#f8fafc", lineHeight: "1.5", marginBottom: "24px" },
    anchorMeta: { display: "flex", flexDirection: "column", gap: "12px" },
    anchorRow: { display: "flex", gap: "12px" },
    anchorLabel: { fontFamily: "'DM Sans', sans-serif", fontSize: "10px", color: "#4a5568", letterSpacing: "1px", width: "80px", flexShrink: 0, marginTop: "2px" },
    anchorValue: { fontSize: "13px", color: "#a0aec0", lineHeight: "1.6" },
    wfsRubric: { display: "flex", flexDirection: "column", gap: "8px", marginTop: "24px" },
    rubricItem: (c) => ({ display: "flex", alignItems: "center", gap: "10px", padding: "10px 14px", background: c ? "rgba(16,185,129,0.06)" : "#0d1117", border: `1px solid ${c ? "#10b981" : "#1e2733"}`, borderRadius: "6px", cursor: "pointer", transition: "all 0.2s" }),
    rubricText: (c) => ({ fontSize: "13px", color: c ? "#10b981" : "#718096", lineHeight: "1.5" }),
    completeBanner: { display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "60vh", textAlign: "center" },
  };

  const sideItems = [
    { label: "Problem", id: "intro" }, { label: "Objectives", id: "objectives" },
    { label: "Step 1 — Two state vars", id: "step1" }, { label: "Step 2 — Two handlers", id: "step2" },
    { label: "Step 3 — Two inputs", id: "step3" }, { label: "Step 4 — Live output", id: "step4" },
    { label: "Step 5 — Full", id: "step5" },
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
            <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "10px", letterSpacing: "2px", color: "#00d4ff", marginBottom: "8px" }}>💡 WHY THIS MATTERS</div>
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
    const partialResults = ["partial_wire", "partial_one", "partial_one_var", "partial_no_p"];
    const rawFeedback =
      result === "correct" ? node.feedback_correct
      : result === "naming" ? node.feedback_naming
      : result === "syntax" ? (syntaxMsg || node.feedback_syntax)
      : result === "partial_wire" ? node.feedback_partial_wire
      : result === "partial_one" ? node.feedback_partial_one
      : result === "partial_one_var" ? node.feedback_partial_one_var
      : result === "partial_no_p" ? node.feedback_partial_no_p
      : result === "partial" ? node.feedback_partial
      : result === "wrong" ? node.feedback_wrong
      : null;
    const feedbackMsg = typeof rawFeedback === "function" ? rawFeedback(answer) : rawFeedback;
    const feedbackType = ["naming", "syntax", ...partialResults].includes(result) ? "partial" : result;

    return (
      <div>
        <div style={s.phase}>{node.phase}</div>
        <div style={s.paalBox}><div style={s.paalText}>{node.paal}</div></div>
        {node.seed_code && (
          <div style={{ marginBottom: "8px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
              <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#10b981" }} />
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "10px", color: "#4a5568", letterSpacing: "2px" }}>CODE BUILT SO FAR — type below the comment</div>
            </div>
          </div>
        )}
        <CodeEditor value={answer} onChange={setAnswer} height="380px" />
        {showHint && result !== "correct" && <div style={s.hintBox}>💡 HINT — {node.hint}</div>}
        {feedbackMsg && <div style={s.feedback(feedbackType)}>{feedbackMsg}</div>}
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
              {node.analogy && <button style={{ ...s.btn("secondary"), background: "rgba(124,58,237,0.15)", border: "1px solid #7c3aed", color: "#9f7aea" }} onClick={() => setShowAnalogy(true)}>💡 SHOW ME AN EXAMPLE</button>}
              {attempts > 0 && !showHint && <button style={s.btn("secondary")} onClick={() => setShowHint(true)}>SHOW HINT</button>}
              {attempts > 1 && !showExpected && <button style={s.btn("ghost")} onClick={() => setShowExpected(true)}>SHOW ANSWER</button>}
              {attempts > 0 && <button style={{ ...s.btn("ghost"), borderColor: "#4a5568" }} onClick={() => { const seed = getSeed(NODES[nodeIndex]); setAnswer(seed); setResult(null); setAttempts(0); setShowHint(false); setShowExpected(false); setSyntaxMsg(null); }}>↺ TRY AGAIN</button>}
            </>
          ) : (
            <button style={s.btn("primary")} onClick={next}>NEXT STEP →</button>
          )}
        </div>
        {showAnalogy && node.analogy && (
          <div onClick={() => setShowAnalogy(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div onClick={e => e.stopPropagation()} style={{ background: "#0d1117", border: "1px solid #7c3aed", borderRadius: "12px", padding: "32px", maxWidth: "500px", width: "90%", boxShadow: "0 0 60px rgba(124,58,237,0.2)" }}>
              <div style={{ fontFamily: "'Courier New',monospace", fontSize: "10px", letterSpacing: "3px", color: "#7c3aed", marginBottom: "16px" }}>💡 ANALOGOUS EXAMPLE</div>
              <div style={{ fontSize: "16px", fontWeight: "700", color: "#f8fafc", marginBottom: "20px" }}>{node.analogy.title}</div>
              <pre style={{ fontFamily: "'Fira Code','Courier New',monospace", fontSize: "13px", lineHeight: "1.8", background: "#080c14", border: "1px solid #1e2733", borderRadius: "8px", padding: "16px 20px", color: "#10b981", whiteSpace: "pre-wrap", marginBottom: "20px" }}>{node.analogy.code}</pre>
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
        <div style={s.anchorCard}>
          <div style={s.anchorTitle}>⚓ ANCHOR CARD</div>
          <div style={s.anchorRule}>{node.rule}</div>
          <div style={s.anchorMeta}>
            <div style={s.anchorRow}><div style={s.anchorLabel}>WHEN</div><div style={s.anchorValue}>{node.when}</div></div>
            <div style={s.anchorRow}><div style={s.anchorLabel}>MISTAKE</div><div style={s.anchorValue}>{node.mistake}</div></div>
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
        <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "10px", letterSpacing: "2px", color: "#7c3aed", marginBottom: "12px" }}>🔗 PATTERN MAP — each line maps back to a step you completed</div>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "28px" }}>
          {node.pattern_map.map((item, i) => (
            <div key={i} style={{ display: "flex", gap: "16px", alignItems: "flex-start", background: "#0d1117", border: "1px solid #1e2733", borderRadius: "6px", padding: "10px 14px" }}>
              <code style={{ fontFamily: "'Fira Code', monospace", fontSize: "12px", color: "#10b981", flexShrink: 0, lineHeight: "1.6", minWidth: "320px" }}>{item.line}</code>
              <div style={{ fontSize: "12px", color: "#718096", lineHeight: "1.6", borderLeft: "1px solid #2d3748", paddingLeft: "14px" }}>← {item.label}</div>
            </div>
          ))}
        </div>
        <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "10px", letterSpacing: "2px", color: "#4a5568", marginBottom: "10px" }}>FULL COMPONENT</div>
        <pre style={{ fontFamily: "'Fira Code','Courier New',monospace", fontSize: "13px", lineHeight: "1.8", background: "#0d1117", border: "1px solid #1e2733", borderRadius: "8px", padding: "20px 24px", color: "#e2e8f0", whiteSpace: "pre-wrap", marginBottom: "32px" }}>{node.code}</pre>
        <div style={s.btnRow}><button style={s.btn("primary")} onClick={next}>CONTINUE →</button></div>
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
          Blank editor below — no hints, no seed. Reproduce the full ProfileCard component from memory. Hit <strong style={{ color: "#e2e8f0" }}>CHECK MY CODE</strong> when done.
        </div>
        <CodeEditor value={answer} onChange={setAnswer} height="380px" />
        {!wfsSubmitted ? (
          <div style={s.btnRow}><button style={s.btn("primary")} onClick={() => { if (answer.trim()) setWfsSubmitted(true); }}>CHECK MY CODE →</button></div>
        ) : (
          <>
            <div style={{ ...s.paalLabel, marginTop: "24px", marginBottom: "12px" }}>SELF-CHECK RUBRIC — tick each line you got right</div>
            <div style={s.wfsRubric}>
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
                <div style={s.feedback("correct")}>✅ Problem #4 complete. You can now manage multiple independent state variables.{"\n"}Next: Problem #5 — Conditional Rendering with Ternary</div>
                <div style={s.btnRow}><button style={s.btn("primary")} onClick={onNextProblem ?? next}>NEXT PROBLEM →</button></div>
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
        <h1 style={{ ...s.h1, textAlign: "center" }}>Problem #4 Complete</h1>
        <p style={{ color: "#4a5568", fontFamily: "'DM Sans', sans-serif", fontSize: "13px" }}>Multiple state mastered. Ready for Problem #5.</p>
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
        <div style={{ ...s.progressLabel, marginLeft: "8px" }}>P04 — MULTIPLE STATE</div>
      </div>
      <div style={s.body}>
        <div style={s.sidebar}>
          <div style={s.sidebarLabel}>PROGRESS</div>
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
                <div style={s.sideItemDot(isActive, isDone)} />
                <div style={s.sideItemText(isActive, isDone)}>{item.label}</div>
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
