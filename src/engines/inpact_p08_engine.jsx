import { useState, useEffect } from "react";
import CodeEditor from "./CodeEditor";


// ─── TUTORIAL DATA ────────────────────────────────────────────────────────────
const NODES = [
  {
    id: "intro",
    type: "reveal",
    phase: "Problem",
    content: {
      tag: "PROBLEM #8",
      title: "Forms & Validation",
      body: `A login form with live validation.

email: ""         →  "Email is required"
email: "notvalid" →  "Enter a valid email"
email: "a@b.com"  →  ✓ valid

password: ""      →  "Password is required"
password: "abc"   →  "Min 6 characters"
password: "abc123" → ✓ valid

Submit button disabled until both fields are valid.
On submit → show "Welcome!" message.`,
      usecase: `Forms are everywhere. Every login, checkout, and signup uses this exact pattern — controlled inputs, live validation, disabled submit, and a success state. Master this once and you've got 80% of real-world forms covered.`,
    },
  },
  {
    id: "objectives",
    type: "objectives",
    phase: "Objectives",
    items: [
      "Manage multiple form fields with separate useState variables",
      "Write validation functions that return error strings or empty string",
      "Use boolean derived state to enable/disable a submit button",
      "Show inline error messages with conditional rendering",
      "Handle form submission with onSubmit + e.preventDefault()",
      "Show a success state after valid submission",
    ],
  },
  {
    id: "step1",
    type: "question",
    phase: "Step 1 of 5",
    paal: "Declare two state variables: email (setter: setEmail) and password (setter: setPassword), both starting as empty strings. Also declare a submitted state (setter: setSubmitted) starting as false.",
    hint: `Three useState calls:\nconst [email, setEmail] = useState("")\nconst [password, setPassword] = useState("")\nconst [submitted, setSubmitted] = useState(false)`,
    analogy: {
      title: "Multiple state variables",
      code: `const [name, setName] = useState("")\nconst [age, setAge] = useState(0)\nconst [active, setActive] = useState(false)`,
      explain: "Each piece of state is independent. When name changes, only name re-renders. Keep state variables small and focused — one thing each.",
    },
    seed_code: `import { useState } from 'react'

export default function LoginForm() {
  // Step 1: declare email, password, submitted state
  
}`,
    expected: `const [email, setEmail] = useState("")
const [password, setPassword] = useState("")
const [submitted, setSubmitted] = useState(false)`,
    evaluate: (ans) => {
      const a = ans.replace(/\s/g, "").toLowerCase();
      const hasEmail = /const\[email,setemail\]=usestate\(""\)/.test(a) || /const\[email,setemail\]=usestate\(''\)/.test(a);
      const hasPassword = /const\[password,setpassword\]=usestate\(""\)/.test(a) || /const\[password,setpassword\]=usestate\(''\)/.test(a);
      const hasSubmitted = /const\[submitted,setsubmitted\]=usestate\(false\)/.test(a);
      const hasEmailState = a.includes("usestate") && (a.includes('"email"') || /\[email,/.test(a));
      const hasPasswordState = a.includes("usestate") && (a.includes('"password"') || /\[password,/.test(a));
      if (hasEmail && hasPassword && hasSubmitted) return "correct";
      if (hasEmail && hasPassword) return "partial_submitted";
      if (hasEmailState && hasPasswordState) return "partial_names";
      if (a.includes("usestate")) return "partial_count";
      return "wrong";
    },
    feedback_correct: "✅ Three state variables — form fields and submission flag. Ready to wire the inputs.",
    feedback_partial_submitted: "Email and password are declared ✓ — just missing the submitted state:\nconst [submitted, setSubmitted] = useState(false)",
    feedback_partial_names: "You have the right idea — make sure to use these exact names so the steps stay in sync:\nconst [email, setEmail] = useState(\"\")\nconst [password, setPassword] = useState(\"\")",
    feedback_partial_count: "Need three useState calls — one for email, one for password, one for submitted (false).",
    feedback_wrong: `const [email, setEmail] = useState("")\nconst [password, setPassword] = useState("")\nconst [submitted, setSubmitted] = useState(false)`,
  },
  {
    id: "step2",
    type: "question",
    phase: "Step 2 of 5",
    paal: "Write the JSX return. Add a <form> with two controlled inputs (email and password) and a submit button. Wire each input's value and onChange. Don't worry about validation yet — just get the inputs working.",
    hint: `<form onSubmit={handleSubmit}>
  <input type="email" value={email} onChange={e => setEmail(e.target.value)} />
  <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
  <button type="submit">Log in</button>
</form>`,
    analogy: {
      title: "Controlled form inputs",
      code: `<input
  type="text"
  value={username}
  onChange={e => setUsername(e.target.value)}
/>`,
      explain: "value= makes React own the field. onChange keeps state in sync as the user types. Without both, the input won't respond to typing.",
    },
    expected: `return (
  <form onSubmit={handleSubmit}>
    <input type="email" value={email} onChange={e => setEmail(e.target.value)} />
    <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
    <button type="submit">Log in</button>
  </form>
)`,
    evaluate: (ans) => {
      const a = ans.replace(/\s/g, "").toLowerCase();
      const hasForm = a.includes("<form");
      const hasEmailInput = /value=\{email\}/.test(ans.replace(/\s/g, ""));
      const hasPasswordInput = /value=\{password\}/.test(ans.replace(/\s/g, ""));
      const hasEmailChange = /setemail\(/.test(a) || /onchange=\{handle.*email/i.test(ans.replace(/\s/g,"").toLowerCase()) || /onchange=\{.*email/i.test(ans.replace(/\s/g,"").toLowerCase());
      const hasPasswordChange = /setpassword\(/.test(a) || /onchange=\{handle.*password/i.test(ans.replace(/\s/g,"").toLowerCase()) || /onchange=\{.*password/i.test(ans.replace(/\s/g,"").toLowerCase());
      const hasButton = a.includes("<button") || a.includes("type=\"submit\"") || a.includes("type='submit'");
      const hasReturn = a.includes("return");
      if (hasForm && hasEmailInput && hasPasswordInput && hasEmailChange && hasPasswordChange && hasButton) return "correct";
      if (hasEmailInput && hasPasswordInput && hasEmailChange && hasPasswordChange) return "partial_form";
      if (hasEmailInput && hasPasswordInput) return "partial_onchange";
      if (hasForm && hasReturn) return "partial_inputs";
      return "wrong";
    },
    feedback_correct: "✅ Both inputs controlled and wired. The form captures typing — next step adds validation.",
    feedback_partial_form: "Both inputs are wired ✓ — wrap them in a <form onSubmit={handleSubmit}> and add a <button type=\"submit\">.",
    feedback_partial_onchange: "value= is set for both ✓ — add onChange handlers:\nonChange={e => setEmail(e.target.value)}\nonChange={e => setPassword(e.target.value)}",
    feedback_partial_inputs: "The form structure is there — add controlled inputs with value= and onChange= for both email and password.",
    feedback_wrong: `return (
  <form onSubmit={handleSubmit}>
    <input type="email" value={email} onChange={e => setEmail(e.target.value)} />
    <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
    <button type="submit">Log in</button>
  </form>
)`,
  },
  {
    id: "step3",
    type: "question",
    phase: "Step 3 of 5",
    paal: "Write two validation functions before the return. emailError() returns a string if invalid, or \"\" if valid. passwordError() does the same. Email must contain @ and a dot. Password must be 6+ characters.",
    hint: `const emailError = () => {
  if (!email) return "Email is required"
  if (!email.includes("@") || !email.includes(".")) return "Enter a valid email"
  return ""
}

const passwordError = () => {
  if (!password) return "Password is required"
  if (password.length < 6) return "Min 6 characters"
  return ""
}`,
    analogy: {
      title: "Email format validation",
      code: `const emailError = () => {
  if (!email) return "Email is required"
  if (!email.includes("@") || !email.includes(".")) return "Enter a valid email"
  return ""
}
// "" means valid — any string means invalid`,
      explain: "Check for @ and . to catch obvious format errors. Return \"\" when valid so if (emailError()) means 'there is a problem'.",
    },
    expected: `const emailError = () => {
  if (!email) return "Email is required"
  if (!email.includes("@") || !email.includes(".")) return "Enter a valid email"
  return ""
}
const passwordError = () => {
  if (!password) return "Password is required"
  if (password.length < 6) return "Min 6 characters"
  return ""
}`,
    evaluate: (ans) => {
      const a = ans.replace(/\s/g, "").toLowerCase();
      const hasEmailFn = /emailerror/.test(a);
      const hasPasswordFn = /passworderror/.test(a);
      const hasEmailRequired = a.includes('"emailisrequired"') || a.includes("'emailisrequired'") || (a.includes("!email") && a.includes("return"));
      const hasPasswordRequired = a.includes('"passwordisrequired"') || a.includes("'passwordisrequired'") || (a.includes("!password") && a.includes("return"));
      const hasEmailFormat = a.includes("@") && (a.includes("includes") || a.includes("test") || a.includes("match"));
      const hasPasswordLength = a.includes("length") && (a.includes("6") || a.includes("< 6") || a.includes("<6"));
      const returnsEmpty = (a.match(/return""/g) || a.match(/return''/g) || []).length >= 2;
      if (hasEmailFn && hasPasswordFn && hasEmailFormat && hasPasswordLength) return "correct";
      if (hasEmailFn && hasPasswordFn && hasEmailRequired && hasPasswordRequired) return "partial_logic";
      if (hasEmailFn && hasPasswordFn) return "partial_checks";
      if (hasEmailFn || hasPasswordFn) return "partial_one";
      return "wrong";
    },
    feedback_correct: "✅ Both validators written. emailError() catches missing and malformed email. passwordError() catches missing and too-short passwords.",
    feedback_partial_logic: `Both functions exist ✓ — make sure they check format too:\nemailError: check for @ and .\npasswordError: check password.length < 6`,
    feedback_partial_checks: "Both function names are there ✓ — fill in the checks:\n• emailError: !email → \"Email is required\", !includes(\"@\") → \"Enter a valid email\"\n• passwordError: !password → \"Password is required\", length < 6 → \"Min 6 characters\"",
    feedback_partial_one: "You have one validator — write both emailError and passwordError with the same pattern.",
    feedback_wrong: `const emailError = () => {
  if (!email) return "Email is required"
  if (!email.includes("@") || !email.includes(".")) return "Enter a valid email"
  return ""
}
const passwordError = () => {
  if (!password) return "Password is required"
  if (password.length < 6) return "Min 6 characters"
  return ""
}`,
  },
  {
    id: "step4",
    type: "question",
    phase: "Step 4 of 5",
    paal: "Add inline error messages below each input. If emailError() returns a string, show it in a <p>. Same for passwordError(). Also disable the submit button when either validator returns a non-empty string.",
    hint: `{emailError() && <p style={{color:"red"}}>{emailError()}</p>}
{passwordError() && <p style={{color:"red"}}>{passwordError()}</p>}

// disable the button:
<button type="submit" disabled={!!(emailError() || passwordError())}>
  Log in
</button>`,
    analogy: {
      title: "Conditional error display",
      code: `{nameError() && <p className="error">{nameError()}</p>}

<button disabled={!!nameError()}>
  Submit
</button>`,
      explain: "nameError() returns a string (truthy) or \"\" (falsy). && short-circuits so the <p> only renders when there's actually an error. !! converts the string to a true boolean for disabled.",
    },
    expected: `{emailError() && <p>{emailError()}</p>}
{passwordError() && <p>{passwordError()}</p>}
<button type="submit" disabled={!!(emailError() || passwordError())}>Log in</button>`,
    evaluate: (ans) => {
      const a = ans.replace(/\s/g, "").toLowerCase();
      const hasEmailError = /emailerror\(\)&&/.test(a) || /\{emailerror\(\)\}/.test(a);
      const hasPasswordError = /passworderror\(\)&&/.test(a) || /\{passworderror\(\)\}/.test(a);
      const hasDisabled = a.includes("disabled");
      const hasDisabledLogic = /disabled=\{/.test(ans.replace(/\s/g, ""));
      const showsBothErrors = hasEmailError && hasPasswordError;
      if (showsBothErrors && hasDisabled && hasDisabledLogic) return "correct";
      if (showsBothErrors && !hasDisabled) return "partial_disabled";
      if (hasDisabled && !showsBothErrors) return "partial_errors";
      if (hasEmailError || hasPasswordError) return "partial_one_error";
      return "wrong";
    },
    feedback_correct: "✅ Inline errors showing, button disabled when form is invalid. One step left — wire the submit.",
    feedback_partial_disabled: "Both error messages are showing ✓ — disable the button when invalid:\n<button disabled={!!(emailError() || passwordError())}>",
    feedback_partial_errors: "The disabled attribute is there ✓ — add the error messages below each input:\n{emailError() && <p>{emailError()}</p>}",
    feedback_partial_one_error: "One error message is showing — add both:\n{emailError() && <p>{emailError()}</p>}\n{passwordError() && <p>{passwordError()}</p>}",
    feedback_wrong: `{emailError() && <p>{emailError()}</p>}
{passwordError() && <p>{passwordError()}</p>}
<button disabled={!!(emailError() || passwordError())}>Log in</button>`,
  },
  {
    id: "step5",
    type: "question",
    phase: "Step 5 of 5",
    paal: "Write the handleSubmit function. It should call e.preventDefault(), then set submitted to true. In the JSX, show a success message when submitted is true, otherwise show the form.",
    hint: `const handleSubmit = (e) => {
  e.preventDefault()
  setSubmitted(true)
}

// In JSX:
if (submitted) return <div>Welcome!</div>

// Or inside return:
{submitted ? <div>Welcome!</div> : <form>...</form>}`,
    analogy: {
      title: "e.preventDefault() on forms",
      code: `const handleSubmit = (e) => {
  e.preventDefault()  // stops page reload
  // now do whatever you want
  setSuccess(true)
}

<form onSubmit={handleSubmit}>`,
      explain: "Without e.preventDefault(), the browser reloads the page on form submit — the old HTML behavior. preventDefault() stops that so React can take over.",
    },
    expected: `const handleSubmit = (e) => {
  e.preventDefault()
  setSubmitted(true)
}`,
    evaluate: (ans) => {
      const a = ans.replace(/\s/g, "").toLowerCase();
      const hasHandleSubmit = a.includes("handlesubmit");
      const hasPreventDefault = a.includes("preventdefault");
      const hasSetSubmitted = a.includes("setsubmitted(true)");
      const hasSuccessUI = a.includes("submitted") && (a.includes("welcome") || a.includes("success") || a.includes("submitted?") || a.includes("submitted&&"));
      if (hasHandleSubmit && hasPreventDefault && hasSetSubmitted && hasSuccessUI) return "correct";
      if (hasHandleSubmit && hasPreventDefault && hasSetSubmitted) return "partial_ui";
      if (hasHandleSubmit && hasSetSubmitted && !hasPreventDefault) return "partial_prevent";
      if (hasHandleSubmit && hasPreventDefault) return "partial_setter";
      return "wrong";
    },
    feedback_correct: "✅ handleSubmit stops the default, sets submitted, and the UI swaps to a success message. That's a complete form.",
    feedback_partial_ui: "handleSubmit is complete ✓ — add the success state in JSX:\n{submitted ? <div>Welcome!</div> : <form>...</form>}",
    feedback_partial_prevent: `setSubmitted(true) is there ✓ — don't forget e.preventDefault() to stop the page from reloading:\nconst handleSubmit = (e) => {\n  e.preventDefault()\n  setSubmitted(true)\n}`,
    feedback_partial_setter: "e.preventDefault() is there ✓ — call setSubmitted(true) to trigger the success state.",
    feedback_wrong: `const handleSubmit = (e) => {
  e.preventDefault()
  setSubmitted(true)
}

// JSX:
{submitted ? <div>Welcome!</div> : <form>...</form>}`,
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
  const [userChoices, setUserChoices] = useState({ userJSX: {} });
  const node = NODES[nodeIndex];
  const progress = NODES.length <= 1 ? 0 : Math.min(100, Math.round((nodeIndex / (NODES.length - 1)) * 100));

  function getSeed(n) {
    if (n?.id === "step2" && userChoices.userJSX["step1"]) {
      let base = userChoices.userJSX["step1"]
        .replace(/\/\/\s*Step\s*\d[^\n]*/g, "")
        .replace(/\n{3,}/g, "\n\n")
        .trimEnd()
        .replace(/\}\s*$/, "")
        .trimEnd();
      return base + "\n\n  // Step 2: return JSX — form with email + password inputs and submit button\n}";
    }
    if (n?.id === "step3" && userChoices.userJSX["step2"]) {
      let base = userChoices.userJSX["step2"]
        .replace(/\/\/\s*Step\s*\d[^\n]*/g, "")
        .replace(/\n{3,}/g, "\n\n")
        .trimEnd()
        .replace(/\}\s*$/, "")
        .trimEnd();
      return base + "\n\n  // Step 3: write emailError() and passwordError() validation functions\n}";
    }
    if (n?.id === "step4" && userChoices.userJSX["step3"]) {
      let base = userChoices.userJSX["step3"]
        .replace(/\/\/\s*Step\s*\d[^\n]*/g, "")
        .replace(/\n{3,}/g, "\n\n")
        .trimEnd()
        .replace(/\}\s*$/, "")
        .trimEnd();
      return base + "\n\n  // Step 4: add inline error messages + disable button when invalid\n}";
    }
    if (n?.id === "step5" && userChoices.userJSX["step4"]) {
      let base = userChoices.userJSX["step4"]
        .replace(/\/\/\s*Step\s*\d[^\n]*/g, "")
        .replace(/\n{3,}/g, "\n\n")
        .trimEnd()
        .replace(/\}\s*$/, "")
        .trimEnd();
      return base + "\n\n  // Step 5: write handleSubmit + show success message when submitted\n}";
    }
    return n?.seed_code ?? "";
  }

  useEffect(() => {
    const seed = getSeed(NODES[nodeIndex]);
    setAnswer(seed);
    setResult(null); setAttempts(0); setShowHint(false); setShowExpected(false); setShowAnalogy(false); setSyntaxMsg(null);
    setTimeout(() => {
    }, 100);
  }, [nodeIndex, userChoices]);

  function next() {
    const stepId = node?.id;
    if (stepId && ["step1", "step2", "step3", "step4"].includes(stepId)) {
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
    { label: "Step 1 — Form state", id: "step1" },
    { label: "Step 2 — Wire inputs", id: "step2" },
    { label: "Step 3 — Validators", id: "step3" },
    { label: "Step 4 — Errors + disabled", id: "step4" },
    { label: "Step 5 — Submit", id: "step5" },
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
    const partialKeys = ["naming", "syntax", "partial_submitted", "partial_names", "partial_count", "partial_form", "partial_onchange", "partial_inputs", "partial_logic", "partial_checks", "partial_one", "partial_disabled", "partial_errors", "partial_one_error", "partial_ui", "partial_prevent", "partial_setter"];
    const rawFb =
      result === "correct" ? node.feedback_correct
      : result === "syntax" ? (syntaxMsg || "Syntax error.")
      : result === "naming" ? node.feedback_naming
      : partialKeys.includes(result) ? node[`feedback_${result}`]
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
            <div style={{ fontSize: "10px", color: "#4a5568", letterSpacing: "2px", marginTop: "16px", marginBottom: "8px" }}>EXPECTED ANSWER</div>
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
          Blank editor — no hints, no seed. Reproduce the full LoginForm component from memory. Hit <strong style={{ color: "#e2e8f0" }}>CHECK MY CODE</strong> when done.
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
                <div style={s.fb("correct")}>✅ Problem #8 complete. You can now build validated forms in React.{"\n"}Next: Problem #9 — Fetching Data with useEffect</div>
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
        <h1 style={s.h1}>Problem #8 Complete</h1>
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
        <div style={s.lbl}>{progress}%</div>
        <div style={{ ...s.lbl, marginLeft: "8px" }}>P08 — FORMS & VALIDATION</div>
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
