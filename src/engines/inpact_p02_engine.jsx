import { useState, useEffect, useRef } from "react";
import CodeEditor from "./CodeEditor";


// Load DM Sans from Google Fonts
if (typeof document !== "undefined" && !document.getElementById("dm-sans-font")) {
  const link = document.createElement("link");
  link.id = "dm-sans-font";
  link.rel = "stylesheet";
  link.href = "https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&display=swap";
  document.head.appendChild(link);
}

// ─── TUTORIAL DATA ────────────────────────────────────────────────────────────
const NODES = [
  {
    id: "intro",
    type: "reveal",
    phase: "Problem",
    content: {
      tag: "PROBLEM #2",
      title: "Toggle Visibility",
      body: `A page with a button and a paragraph of text.

  Clicking the button HIDES the paragraph if it's visible.
  Clicking it again SHOWS it.
  The button label changes too.

Example:
  Start        →  [ Hide ]  Hello, I am visible!
  Click button →  [ Show ]
  Click button →  [ Hide ]  Hello, I am visible!`,
      usecase: `Every "Read more / Show less" link, cookie banner dismiss, and FAQ accordion uses this exact pattern.`,
    },
  },
  {
    id: "objectives",
    type: "objectives",
    phase: "Objectives",
    items: [
      "Use useState with a boolean value — not just a number",
      "Initialise state to true or false depending on the starting UI",
      "Toggle a boolean using the functional update form: setVisible(prev => !prev)",
      "Conditionally render JSX using the && operator",
      "Dynamically set a button's label based on a state variable",
      "Explain why !prev is safer than !isVisible for toggling",
      "Structure a complete React component with boolean state",
    ],
  },
  {
    id: "step1",
    type: "question",
    phase: "Step 1 of 5",
    paal: "Declare a state variable called isVisible (setter: setIsVisible) to hold a boolean. The paragraph starts visible — what should the initial value be?",
    hint: "This isn't a number. The paragraph is either visible or it isn't. What primitive type represents that?",
    analogy: {
      title: "Similar pattern — tracking login status",
      code: `const [isLoggedIn, setIsLoggedIn] = useState(false)`,
      explain: "useState works with any type — not just numbers. Here it's a boolean. false = logged out. Same idea: your state is either visible (true) or hidden (false).",
    },
    evaluate: (ans) => {
      const a = ans.replace(/\s/g, "").toLowerCase();
      const hasUseState = a.includes("usestate");
      const hasTrue = a.includes("(true)");
      const hasBoolName = /const\[i?s?\w+,/.test(ans.replace(/\s/g, ""));
      if (hasUseState && hasTrue && hasBoolName) return "correct";
      if (hasUseState && hasTrue) return "partial";
      if (hasUseState) return "partial";
      return "wrong";
    },
    feedback_correct: "✅ Boolean state declared, starts visible — perfect. Your variable name is saved and will carry through every step from here.",
    feedback_partial: (ans) => {
      const a = ans.toLowerCase().replace(/\s/g, "");
      if (!a.includes("(true)")) return "Close — but check the initial value. The paragraph starts visible, so it should be true.";
      return "Almost — make sure you're destructuring: const [yourVarName, setYourVarName] = useState(true)";
    },
    feedback_wrong: "Declare it like: const [show, setShow] = useState(true)\n\nPick any name you like — true means it starts visible.",
    expected: `const [isVisible, setIsVisible] = useState(true)`,
    seed_code: `import { useState } from 'react'

export default function Toggle() {
  // Step 1: declare boolean state — paragraph starts visible
  
}`,
  },
  {
    id: "step2",
    type: "question",
    phase: "Step 2 of 5",
    paal: "Write a function called toggle that flips isVisible. One click: true → false. Another click: false → true. Use the functional update form.",
    hint: "! flips a boolean. true becomes false, false becomes true. And remember — use the functional update form so you always get the latest value.",
    analogy: {
      title: "Similar pattern — toggling a menu open/closed",
      code: `const toggleMenu = () => setIsOpen(prev => !prev)`,
      explain: "!prev flips whatever prev currently is. If it's true, !true = false. If false, !false = true. One function handles both directions.",
    },
    evaluate: (ans) => {
      const a = ans.toLowerCase().replace(/\s/g, "");
      const hasFn = a.includes("const") && a.includes("=>");
      const hasFlip = a.includes("!prev");
      const hasFunctional = a.includes("(prev=>") || a.includes("(prev =>") || a.includes("(prev)=>") || a.includes("(prev) =>");
      const hasNamedParam = /const\s+\w+\s*=\s*\w\s*=>/.test(ans) && !/const\s+\w+\s*=\s*\(\s*\)\s*=>/.test(ans);
      if (hasNamedParam) return "named_param";
      if (hasFn && hasFlip && hasFunctional) return "correct";
      if (hasFlip) return "partial";
      if (a.includes("set") && a.includes("=>")) return "partial";
      return "wrong";
    },
    feedback_named_param: "Almost — but the toggle function takes no arguments, so use () => not t => or e =>.\n\nTry: const toggle = () => setShow(prev => !prev)",
    feedback_correct: "✅ The functional update form prev => !prev is the right pattern. React guarantees prev is always the latest value — no stale state bugs.",
    feedback_partial: "Almost — the flip logic is there. Wrap it in a named arrow function with empty parens:\nconst toggle = () => yourSetter(prev => !prev)",
    feedback_wrong: "const toggle = () => setIsVisible(prev => !prev)\n\nprev => !prev flips whatever the current value is. One function, both directions.",
    expected: `const toggle = () => setIsVisible(prev => !prev)`,
    seed_code: `import { useState } from 'react'

export default function Toggle() {
  const [isVisible, setIsVisible] = useState(true)

  // Step 2: write the toggle function
  
}`,
  },
  {
    id: "step3",
    type: "question",
    phase: "Step 3 of 5",
    paal: "Write the JSX return. Include a button (label 'Toggle' for now) and a paragraph with the text \"Hello, I am visible!\" — but only render the paragraph when isVisible is true. Don't wire the button yet.",
    hint: "In JSX, {condition && <element />} renders the element only when condition is true. When false, nothing renders.",
    analogy: {
      title: "Similar pattern — showing an error message",
      code: `return (
  <div>
    {hasError && <p>Something went wrong.</p>}
  </div>
)`,
      explain: "hasError && <p> only renders the paragraph when hasError is true. When false, React renders nothing. Same pattern — swap hasError for isVisible.",
    },
    evaluate: (ans) => {
      const a = ans.toLowerCase().replace(/\s/g, "");
      const hasBadReturn = /return\s*\(\s*\{/.test(ans);   // return(){ is invalid
      const hasValidReturn = !hasBadReturn && /return\s*\(/.test(ans);
      const hasConditional = /\w+\s*&&\s*<p/.test(ans);
      const hasParagraph = a.includes("<p>");
      const hasButton = a.includes("<button");
      if (hasBadReturn) return "syntax";
      if (hasValidReturn && hasConditional && hasParagraph && hasButton) return "correct";
      if (hasConditional && hasParagraph) return "partial";
      if (hasButton) return "partial";
      return "wrong";
    },
    feedback_correct: "✅ Conditional render with &&. When the boolean is false, React renders nothing — the paragraph simply doesn't exist in the DOM.",
    feedback_syntax: "Almost — but check your return statement. It should be return ( not return(){ — the parentheses wrap the JSX, they don't call a function.",
    feedback_partial: (ans) => {
      const a = ans.toLowerCase().replace(/\s/g, "");
      if (!a.includes("<button")) return "Paragraph is conditionally rendered — now add the button too (don't wire it yet).";
      if (!a.includes("&&")) return "Good structure — but the paragraph needs to be conditional. Wrap it: {isVisible && <p>Hello, I am visible!</p>}";
      return "Almost — check you have both: a button AND the conditional paragraph using &&.";
    },
    feedback_wrong: `return (
  <div>
    <button>Toggle</button>
    {isVisible && <p>Hello, I am visible!</p>}
  </div>
)`,
    expected: `return (
  <div>
    <button>Toggle</button>
    {isVisible && <p>Hello, I am visible!</p>}
  </div>
)`,
    seed_code: `import { useState } from 'react'

export default function Toggle() {
  const [isVisible, setIsVisible] = useState(true)

  const toggle = () => setIsVisible(prev => !prev)

  // Step 3: write the JSX — conditional paragraph + button (no onClick yet)
  
}`,
  },
  {
    id: "step4",
    type: "question",
    phase: "Step 4 of 5",
    paal: "Wire the button: add onClick={toggle} and make its label dynamic — show 'Hide' when isVisible is true, 'Show' when false.",
    hint: "A ternary works here: isVisible ? 'Hide' : 'Show'. Same for onClick — wire it to toggle.",
    analogy: {
      title: "Similar pattern — play/pause button label",
      code: `<button onClick={togglePlay}>
  {isPlaying ? "Pause" : "Play"}
</button>`,
      explain: "The button label is dynamic — it reads state and switches text. onClick just calls the toggle function. Same two things you need: wire onClick, and make the label conditional.",
    },
    evaluate: (ans) => {
      const a = ans.toLowerCase().replace(/\s/g, "");
      const hasOnClick = a.includes("onclick={toggle}");
      const hasTernary = (a.includes("hide") && a.includes("show")) ||
                         (a.includes("isvisible?") || a.includes("isvisible ?"));
      if (hasOnClick && hasTernary) return "correct";
      if (hasOnClick || hasTernary) return "partial";
      return "wrong";
    },
    feedback_correct: "✅ Dynamic label + wired onClick. The ternary isVisible ? 'Hide' : 'Show' reads state directly — every re-render picks up the latest value.",
    feedback_partial: (ans) => {
      const a = ans.toLowerCase().replace(/\s/g, "");
      if (!a.includes("onclick={toggle}")) return "Label is dynamic — now wire the button: onClick={toggle}";
      return "onClick is wired — now make the label dynamic: {isVisible ? 'Hide' : 'Show'}";
    },
    feedback_wrong: `<button onClick={toggle}>
  {isVisible ? "Hide" : "Show"}
</button>`,
    expected: `<button onClick={toggle}>
  {isVisible ? "Hide" : "Show"}
</button>`,
    seed_code: `import { useState } from 'react'

export default function Toggle() {
  const [isVisible, setIsVisible] = useState(true)

  const toggle = () => setIsVisible(prev => !prev)

  return (
    <div>
      <button>Toggle</button>
      {isVisible && <p>Hello, I am visible!</p>}
    </div>
  )
  // Step 4: wire onClick to toggle and make the button label dynamic
}`,
  },
  {
    id: "step5",
    type: "question",
    phase: "Step 5 of 5",
    paal: "Here's the component you've built so far. Two things are still missing: add onClick={toggle} to the button, and replace the static 'Toggle' label with {isVisible ? 'Hide' : 'Show'}.",
    hint: "Order: import → export default function → useState → toggle fn → return JSX with wired button and conditional paragraph.",
    analogy: {
      title: "Reference — full boolean toggle pattern",
      code: `import { useState } from 'react'

export default function Spoiler() {
  const [revealed, setRevealed] = useState(false)

  const toggle = () => setRevealed(prev => !prev)

  return (
    <div>
      <button onClick={toggle}>
        {revealed ? "Hide answer" : "Show answer"}
      </button>
      {revealed && <p>The answer is 42.</p>}
    </div>
  )
}`,
      explain: "Same structure — different domain. revealed starts false (hidden). Your isVisible starts true (visible). Everything else is identical.",
    },
    evaluate: (ans) => {
      const a = ans.toLowerCase().replace(/\s/g, "");
      const checks = [
        a.includes("import") && a.includes("usestate"),
        a.includes("exportdefaultfunction") || a.includes("exportdefault"),
        a.includes("usestate(true)"),
        a.includes("prev=>!prev"),
        a.includes("onclick={toggle}"),
        a.includes("&&") && a.includes("<p>"),
        a.includes("?") && (a.includes("hide") || a.includes("show")),
      ];
      const passed = checks.filter(Boolean).length;
      if (passed >= 6) return "correct";
      if (passed >= 4) return "partial";
      return "wrong";
    },
    feedback_correct: "✅ Complete. useState(true) → toggle with !prev → conditional render with && → dynamic label with ternary. That's the full boolean toggle pattern.",
    feedback_partial: "Almost — check: useState(true) for initial value, prev => !prev for the toggle, {isVisible && <p>} for conditional render, {isVisible ? 'Hide' : 'Show'} for the label.",
    feedback_wrong: "Start: import → export default function → const [isVisible, setIsVisible] = useState(true) → toggle fn → return with wired button and conditional paragraph.",
    expected: `import { useState } from 'react'

export default function Toggle() {
  const [isVisible, setIsVisible] = useState(true)

  const toggle = () => setIsVisible(prev => !prev)

  return (
    <div>
      <button onClick={toggle}>
        {isVisible ? "Hide" : "Show"}
      </button>
      {isVisible && <p>Hello, I am visible!</p>}
    </div>
  )
}`,
    seed_code: `import { useState } from 'react'

export default function Toggle() {
  const [isVisible, setIsVisible] = useState(true)

  const toggle = () => setIsVisible(prev => !prev)

  // Step 5: add onClick={toggle} and make the label dynamic
  return (
    <div>
      <button>Toggle</button>
      {isVisible && <p>Hello, I am visible!</p>}
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
  const [nodeIndex, setNodeIndex] = useState(2);
  const [answer, setAnswer] = useState("");
  const [result, setResult] = useState(null); // null | 'correct' | 'partial' | 'wrong'
  const [attempts, setAttempts] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [showExpected, setShowExpected] = useState(false);
  const [completedNodes, setCompletedNodes] = useState(["intro", "objectives"]);
  const [objIndex, setObjIndex] = useState(0);
  const [wfsChecked, setWfsChecked] = useState([]);
  const [showAnalogy, setShowAnalogy] = useState(false);
  const [syntaxMsg, setSyntaxMsg] = useState(null);
  const [userChoices, setUserChoices] = useState({ paraText: "see me now!", varName: "isVisible", setterName: "setIsVisible", toggleName: "toggle", userJSX: null });
  const editorRef = useRef(null);

  const node = NODES[nodeIndex];
  const progress = NODES.length <= 1 ? 0 : Math.min(100, Math.round((nodeIndex / (NODES.length - 1)) * 100));

  function getSeed(n) {
    // For step4, build seed from user's actual step3 code + a comment
    if (n?.id === "step4" && userChoices.userJSX) {
      const base = userChoices.userJSX
        .replace(/\/\/\s*Step\s*\d[^\n]*/g, "")  // remove old step comment
        .replace(/\n{3,}/g, "\n\n")               // collapse extra blank lines
        .trimEnd();
      return base + "\n  // Step 4: add onClick={toggle} and make the label dynamic\n}";
    }
    let seed = n?.seed_code ?? "";
    seed = seed.replace(/Hello, I am visible!/g, userChoices.paraText);
    seed = seed.replace(/\bisVisible\b/g, userChoices.varName);
    seed = seed.replace(/\bsetIsVisible\b/g, userChoices.setterName);
    seed = seed.replace(/\btoggle\b/g, userChoices.toggleName);
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
          const lineHeight = 21;
          ta.scrollTop = Math.max(0, (linesBefore * lineHeight) - (ta.clientHeight / 2));
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
      if (match) setUserChoices(c => ({ ...c, toggleName: match[1] }));
    }
    if (node?.id === "step3") {
      const pMatch = answer.match(/<p>(.*?)<\/p>/);
      setUserChoices(c => ({
        ...c,
        paraText: pMatch ? pMatch[1] : c.paraText,
        userJSX: answer,
      }));
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
    const res = evaluate(node, answer);
    setResult(res);
    setAttempts((a) => a + 1);
    if (attempts >= 1) setShowHint(true);
    if (attempts >= 2) setShowExpected(true);
  }

  // ── STYLES ─────────────────────────────────────────────────────────────────
  const s = {
    wrap: {
      minHeight: "100vh",
      background: "#080c14",
      color: "#e2e8f0",
      fontFamily: "'DM Sans', sans-serif",
      letterSpacing: "0.01em",
      display: "flex",
      flexDirection: "column",
    },
    topbar: {
      background: "#0d1117",
      borderBottom: "1px solid #1e2733",
      padding: "12px 24px",
      display: "flex",
      alignItems: "center",
      gap: "16px",
    },
    logo: {
      fontFamily: "'DM Sans', sans-serif",
      fontSize: "13px",
      fontWeight: "700",
      letterSpacing: "3px",
      color: "#00d4ff",
    },
    progressTrack: {
      flex: 1,
      height: "3px",
      background: "#1e2733",
      borderRadius: "2px",
      overflow: "hidden",
    },
    progressFill: {
      height: "100%",
      width: `${progress}%`,
      background: "linear-gradient(90deg, #00d4ff, #7c3aed)",
      transition: "width 0.5s ease",
    },
    progressLabel: {
      fontFamily: "'DM Sans', sans-serif",
      fontSize: "11px",
      color: "#4a5568",
      letterSpacing: "1px",
    },
    body: {
      display: "flex",
      flex: 1,
    },
    sidebar: {
      width: "220px",
      background: "#0d1117",
      borderRight: "1px solid #1e2733",
      padding: "24px 0",
      flexShrink: 0,
    },
    sidebarLabel: {
      fontFamily: "'DM Sans', sans-serif",
      fontSize: "10px",
      color: "#4a5568",
      letterSpacing: "2px",
      padding: "0 20px 12px",
    },
    sideItem: (isActive, isDone, isLocked) => ({
      padding: "10px 20px",
      display: "flex",
      alignItems: "center",
      gap: "10px",
      cursor: "pointer",
      background: isActive ? "#1a2332" : "transparent",
      borderLeft: isActive ? "2px solid #00d4ff" : "2px solid transparent",
      transition: "all 0.2s",
    }),
    sideItemDot: (isActive, isDone) => ({
      width: "8px",
      height: "8px",
      borderRadius: "50%",
      background: isDone ? "#10b981" : isActive ? "#00d4ff" : "#2d3748",
      flexShrink: 0,
    }),
    sideItemText: (isActive, isDone, isLocked) => ({
      fontFamily: "'DM Sans', sans-serif",
      fontSize: "11px",
      color: isDone ? "#10b981" : isActive ? "#e2e8f0" : "#4a5568",
      letterSpacing: "0.5px",
    }),
    main: {
      flex: 1,
      padding: "48px",
      maxWidth: "760px",
      margin: "0 auto",
      width: "100%",
    },
    phase: {
      fontFamily: "'DM Sans', sans-serif",
      fontSize: "10px",
      letterSpacing: "3px",
      color: "#00d4ff",
      marginBottom: "16px",
    },
    tag: {
      fontFamily: "'DM Sans', sans-serif",
      fontSize: "11px",
      color: "#a78bfa",
      fontWeight: "600",
      letterSpacing: "0.15em",
      marginBottom: "12px",
    },
    h1: {
      fontSize: "28px",
      fontWeight: "400",
      color: "#f8fafc",
      marginBottom: "32px",
      lineHeight: "1.2",
      letterSpacing: "-0.3px",
    },
    pre: {
      fontFamily: "'DM Sans', sans-serif",
      fontSize: "13px",
      lineHeight: "1.8",
      color: "#a0aec0",
      background: "#0d1117",
      border: "1px solid #1e2733",
      borderRadius: "8px",
      padding: "24px",
      whiteSpace: "pre-wrap",
      marginBottom: "32px",
    },
    paalBox: {
      background: "#0d1117",
      border: "1px solid #1e2733",
      borderLeft: "3px solid #00d4ff",
      borderRadius: "8px",
      padding: "20px 24px",
      marginBottom: "24px",
    },
    paalLabel: {
      fontFamily: "'DM Sans', sans-serif",
      fontSize: "10px",
      color: "#00d4ff",
      letterSpacing: "2px",
      marginBottom: "10px",
    },
    paalText: {
      fontSize: "16px",
      color: "#e2e8f0",
      lineHeight: "1.6",
    },
    textarea: {
      width: "100%",
      minHeight: "140px",
      background: "#0d1117",
      border: "1px solid #1e2733",
      borderRadius: "8px",
      padding: "16px",
      fontFamily: "'DM Sans', sans-serif",
      fontSize: "13px",
      color: "#e2e8f0",
      resize: "vertical",
      outline: "none",
      lineHeight: "1.7",
      boxSizing: "border-box",
      transition: "border-color 0.2s",
    },
    btnRow: {
      display: "flex",
      gap: "12px",
      marginTop: "16px",
      flexWrap: "wrap",
    },
    btn: (variant) => ({
      padding: "10px 24px",
      borderRadius: "6px",
      border: "none",
      cursor: "pointer",
      fontFamily: "'DM Sans', sans-serif",
      fontSize: "12px",
      fontWeight: "700",
      letterSpacing: "0.08em",
      fontWeight: "700",
      transition: "all 0.2s",
      background:
        variant === "primary"
          ? "#00d4ff"
          : variant === "ghost"
          ? "transparent"
          : "#1a2332",
      color:
        variant === "primary"
          ? "#080c14"
          : variant === "ghost"
          ? "#4a5568"
          : "#a0aec0",
      border: variant === "ghost" ? "1px solid #2d3748" : "none",
    }),
    feedback: (type) => ({
      marginTop: "20px",
      padding: "16px 20px",
      borderRadius: "8px",
      fontFamily: "'DM Sans', sans-serif",
      fontSize: "12px",
      lineHeight: "1.8",
      background:
        type === "correct"
          ? "rgba(16,185,129,0.08)"
          : type === "partial"
          ? "rgba(245,158,11,0.08)"
          : "rgba(239,68,68,0.08)",
      border: `1px solid ${
        type === "correct"
          ? "#10b981"
          : type === "partial"
          ? "#f59e0b"
          : "#ef4444"
      }`,
      color:
        type === "correct"
          ? "#10b981"
          : type === "partial"
          ? "#f59e0b"
          : "#ef4444",
      whiteSpace: "pre-wrap",
    }),
    hintBox: {
      marginTop: "12px",
      padding: "12px 16px",
      background: "rgba(124,58,237,0.08)",
      border: "1px solid #7c3aed",
      borderRadius: "6px",
      fontFamily: "'DM Sans', sans-serif",
      fontSize: "11px",
      color: "#9f7aea",
      lineHeight: "1.7",
    },
    expectedBox: {
      marginTop: "12px",
      padding: "16px",
      background: "#0d1117",
      border: "1px solid #2d3748",
      borderRadius: "6px",
      fontFamily: "'DM Sans', sans-serif",
      fontSize: "12px",
      color: "#718096",
      whiteSpace: "pre-wrap",
      lineHeight: "1.7",
    },
    objItem: (revealed) => ({
      display: "flex",
      alignItems: "flex-start",
      gap: "12px",
      padding: "14px 0",
      borderBottom: "1px solid #1e2733",
      opacity: revealed ? 1 : 0,
      transform: revealed ? "translateY(0)" : "translateY(8px)",
      transition: "all 0.4s ease",
    }),
    objNum: {
      fontFamily: "'DM Sans', sans-serif",
      fontSize: "11px",
      color: "#00d4ff",
      marginTop: "2px",
      flexShrink: 0,
    },
    objText: {
      fontSize: "15px",
      color: "#cbd5e0",
      lineHeight: "1.5",
    },
    anchorCard: {
      background: "linear-gradient(135deg, #0d1117 0%, #1a0a2e 100%)",
      border: "1px solid #7c3aed",
      borderRadius: "12px",
      padding: "32px",
    },
    anchorTitle: {
      fontFamily: "'DM Sans', sans-serif",
      fontSize: "10px",
      letterSpacing: "3px",
      color: "#7c3aed",
      marginBottom: "20px",
    },
    anchorRule: {
      fontSize: "18px",
      fontWeight: "700",
      color: "#f8fafc",
      lineHeight: "1.5",
      marginBottom: "24px",
    },
    anchorMeta: {
      display: "flex",
      flexDirection: "column",
      gap: "12px",
    },
    anchorRow: {
      display: "flex",
      gap: "12px",
    },
    anchorLabel: {
      fontFamily: "'DM Sans', sans-serif",
      fontSize: "10px",
      color: "#4a5568",
      letterSpacing: "1px",
      width: "80px",
      flexShrink: 0,
      marginTop: "2px",
    },
    anchorValue: {
      fontSize: "13px",
      color: "#a0aec0",
      lineHeight: "1.6",
    },
    wfsRubric: {
      display: "flex",
      flexDirection: "column",
      gap: "8px",
      marginTop: "24px",
    },
    rubricItem: (checked) => ({
      display: "flex",
      alignItems: "center",
      gap: "10px",
      padding: "10px 14px",
      background: checked ? "rgba(16,185,129,0.06)" : "#0d1117",
      border: `1px solid ${checked ? "#10b981" : "#1e2733"}`,
      borderRadius: "6px",
      cursor: "pointer",
      transition: "all 0.2s",
    }),
    rubricText: (checked) => ({
      fontFamily: "'DM Sans', sans-serif",
      fontSize: "12px",
      color: checked ? "#10b981" : "#4a5568",
      textDecoration: checked ? "none" : "none",
    }),
    completeBanner: {
      textAlign: "center",
      padding: "60px 20px",
    },
  };

  // ── SIDEBAR ─────────────────────────────────────────────────────────────────
  const sideItems = [
    { label: "Problem", id: "intro" },
    { label: "Objectives", id: "objectives" },
    { label: "Step 1 — Boolean state", id: "step1" },
    { label: "Step 2 — Toggle fn", id: "step2" },
    { label: "Step 3 — Conditional JSX", id: "step3" },
    { label: "Step 4 — Wire + label", id: "step4" },
    { label: "Step 5 — Full", id: "step5" },
  ];

  // ── RENDER NODES ─────────────────────────────────────────────────────────────

  function renderReveal() {
    return (
      <div>
        <div style={s.phase}>{node.phase}</div>
        {node.content.tag && <div style={s.tag}>{node.content.tag}</div>}
        {node.content.title && <h1 style={s.h1}>{node.content.title}</h1>}
        <div style={s.pre}>{node.content.body}</div>
        {node.content.usecase && (
          <div style={{
            background: "rgba(0,212,255,0.05)",
            border: "1px solid rgba(0,212,255,0.2)",
            borderLeft: "3px solid #00d4ff",
            borderRadius: "8px",
            padding: "16px 20px",
            marginBottom: "28px",
          }}>
            <div style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "10px",
              letterSpacing: "2px",
              color: "#00d4ff",
              marginBottom: "8px",
            }}>💡 WHY THIS MATTERS</div>
            <div style={{ fontSize: "14px", color: "#a0aec0", lineHeight: "1.7" }}>
              {node.content.usecase}
            </div>
          </div>
        )}
        <div style={s.btnRow}>
          <button style={s.btn("primary")} onClick={next}>
            CONTINUE →
          </button>
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
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "16px",
                padding: "14px 0",
                borderBottom: "1px solid #1e2733",
                animation: "fadeUp 0.35s ease both",
                animationDelay: `${i * 80}ms`,
              }}
            >
              <div style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "11px",
                color: "#00d4ff",
                marginTop: "3px",
                flexShrink: 0,
                minWidth: "20px",
              }}>
                {String(i + 1).padStart(2, "0")}
              </div>
              <div style={{ fontSize: "15px", color: "#cbd5e0", lineHeight: "1.6" }}>
                {item}
              </div>
            </div>
          ))}
        </div>
        <div style={{ display:"flex", gap:"12px", marginTop:"32px" }}>
          <button style={s.btn("primary")} onClick={next}>
            LET'S BUILD →
          </button>
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
      : result === "partial" ? node.feedback_partial
      : result === "wrong" ? node.feedback_wrong
      : null;
    const feedbackMsg = typeof rawFeedback === "function" ? rawFeedback(answer) : rawFeedback;
    const feedbackType = (result === "naming" || result === "syntax" || result === "named_param") ? "partial" : result;

    return (
      <div>
        <div style={s.phase}>{node.phase}</div>
        <div style={s.paalBox}>
          <div style={s.paalText}>{node.paal}</div>
        </div>

        {node.seed_code && (
          <div style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "10px",
            color: "#4a5568",
            letterSpacing: "1px",
            marginBottom: "8px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}>
            <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#10b981" }} />
            CODE BUILT SO FAR — type below the comment
          </div>
        )}
        <CodeEditor value={answer} onChange={setAnswer} height="380px" />

        {showHint && result !== "correct" && (
          <div style={s.hintBox}>💡 HINT — {node.hint}</div>
        )}

        {feedbackMsg && (
          <div style={s.feedback(feedbackType)}>{feedbackMsg}</div>
        )}

        {showExpected && (
          <div>
            <div style={{ ...s.paalLabel, marginTop: "16px", marginBottom: "8px" }}>
              EXPECTED ANSWER
            </div>
            <div style={s.expectedBox}>{node.expected}</div>
          </div>
        )}

        <div style={s.btnRow}>
          {result !== "correct" ? (
            <>
              <button style={s.btn("primary")} onClick={submit}>
                SUBMIT
              </button>
              {node.analogy && (
                <button style={{
                  ...s.btn("secondary"),
                  background: "rgba(124,58,237,0.15)",
                  border: "1px solid #7c3aed",
                  color: "#9f7aea",
                }} onClick={() => setShowAnalogy(true)}>
                  💡 SHOW ME AN EXAMPLE
                </button>
              )}
              {attempts > 0 && !showHint && (
                <button style={s.btn("secondary")} onClick={() => setShowHint(true)}>
                  SHOW HINT
                </button>
              )}
              {attempts > 1 && !showExpected && (
                <button style={s.btn("ghost")} onClick={() => setShowExpected(true)}>
                  SHOW ANSWER
                </button>
              )}
            </>
          ) : (
            <button style={s.btn("primary")} onClick={next}>
              NEXT STEP →
            </button>
          )}
        </div>

        {/* Analogy Modal */}
        {showAnalogy && node.analogy && (
          <div
            onClick={() => setShowAnalogy(false)}
            style={{
              position: "fixed", inset: 0,
              background: "rgba(0,0,0,0.75)",
              zIndex: 100,
              display: "flex", alignItems: "center", justifyContent: "center",
              padding: "24px",
            }}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              style={{
                background: "#0d1117",
                border: "1px solid #7c3aed",
                borderRadius: "12px",
                padding: "32px",
                maxWidth: "580px",
                width: "100%",
                boxShadow: "0 0 60px rgba(124,58,237,0.2)",
              }}
            >
              <div style={{
                fontFamily: "'Courier New',monospace",
                fontSize: "10px", letterSpacing: "3px",
                color: "#7c3aed", marginBottom: "16px",
              }}>💡 ANALOGOUS EXAMPLE</div>
              <div style={{
                fontSize: "16px", fontWeight: "700",
                color: "#f8fafc", marginBottom: "20px",
              }}>{node.analogy.title}</div>
              <pre style={{
                fontFamily: "'Fira Code','Courier New',monospace",
                fontSize: "13px", lineHeight: "1.8",
                background: "#080c14",
                border: "1px solid #1e2733",
                borderRadius: "8px",
                padding: "16px 20px",
                color: "#10b981",
                whiteSpace: "pre-wrap",
                marginBottom: "20px",
              }}>{node.analogy.code}</pre>
              <div style={{
                fontSize: "14px", color: "#a0aec0",
                lineHeight: "1.7", marginBottom: "28px",
                borderLeft: "2px solid #7c3aed",
                paddingLeft: "16px",
              }}>{node.analogy.explain}</div>
              <div style={{
                fontFamily: "'Courier New',monospace",
                fontSize: "11px", color: "#4a5568",
                marginBottom: "20px",
              }}>Now apply the same pattern to your problem ↓</div>
              <button
                style={{ ...s.btn("primary"), width: "100%" }}
                onClick={() => setShowAnalogy(false)}
              >
                GOT IT — LET ME TRY →
              </button>
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
          <button style={s.btn("primary")} onClick={next}>
            GOT IT →
          </button>
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

        <div style={{
          background: "rgba(0,212,255,0.05)",
          border: "1px solid rgba(0,212,255,0.15)",
          borderLeft: "3px solid #00d4ff",
          borderRadius: "8px",
          padding: "16px 20px",
          marginBottom: "24px",
          fontSize: "14px",
          color: "#a0aec0",
          lineHeight: "1.8",
        }}>
          Blank editor below — no hints, no seed code. Reproduce the full Toggle component from memory. When you're done, hit <strong style={{ color: "#e2e8f0" }}>CHECK MY CODE</strong> and self-assess against the rubric.
        </div>

        <CodeEditor value={answer} onChange={setAnswer} height="380px" />

        {!wfsSubmitted ? (
          <div style={s.btnRow}>
            <button style={s.btn("primary")} onClick={() => {
              if (answer.trim()) setWfsSubmitted(true);
            }}>
              CHECK MY CODE →
            </button>
          </div>
        ) : (
          <>
            <div style={{ ...s.paalLabel, marginTop: "24px", marginBottom: "12px" }}>
              SELF-CHECK RUBRIC — tick each line you got right
            </div>
            <div style={s.wfsRubric}>
              {node.rubric.map((item, i) => {
                const checked = wfsChecked.includes(i);
                return (
                  <div
                    key={i}
                    style={s.rubricItem(checked)}
                    onClick={() =>
                      setWfsChecked((p) =>
                        checked ? p.filter((x) => x !== i) : [...p, i]
                      )
                    }
                  >
                    <div style={{ width: 16, height: 16, flexShrink: 0 }}>
                      {checked
                        ? <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        : <div style={{ width: 14, height: 14, border: "1px solid #4a5568", borderRadius: "3px" }} />
                      }
                    </div>
                    <div style={s.rubricText(checked)}>{item}</div>
                  </div>
                );
              })}
            </div>

            {allChecked && (
              <div style={{ marginTop: "24px" }}>
                <div style={s.feedback("correct")}>
                  ✅ Problem #2 complete. You've mastered boolean state and conditional rendering.{"\n"}
                  Next: Problem #3 — Controlled Input
                </div>
                <div style={s.btnRow}>
                  <button style={s.btn("primary")} onClick={onNextProblem ?? next}>
                    NEXT PROBLEM →
                  </button>
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
        <h1 style={{ ...s.h1, textAlign: "center" }}>Problem #2 Complete</h1>
        <p style={{ color: "#4a5568", fontFamily: "'DM Sans', sans-serif", fontSize: "13px" }}>
          Boolean state mastered. Ready for Problem #3.
        </p>
        {onNextProblem && (
          <div style={s.btnRow}>
            <button style={s.btn("primary")} onClick={onNextProblem}>NEXT PROBLEM →</button>
          </div>
        )}
      </div>
    );
  }

  function renderConnect() {
    return (
      <div>
        <div style={s.phase}>{node.phase}</div>
        <h1 style={s.h1}>{node.title}</h1>

        {/* Context first */}
        <div style={{
          background: "rgba(0,212,255,0.05)",
          border: "1px solid rgba(0,212,255,0.2)",
          borderLeft: "3px solid #00d4ff",
          borderRadius: "8px",
          padding: "16px 20px",
          marginBottom: "28px",
          fontSize: "15px",
          color: "#a0aec0",
          lineHeight: "1.8",
        }}>{node.context}</div>

        {/* Pattern map */}
        <div style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: "10px",
          letterSpacing: "2px",
          color: "#7c3aed",
          marginBottom: "12px",
        }}>🔗 PATTERN MAP — each line maps back to a step you completed</div>

        <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "28px" }}>
          {node.pattern_map.map((item, i) => (
            <div key={i} style={{
              display: "flex",
              gap: "16px",
              alignItems: "flex-start",
              background: "#0d1117",
              border: "1px solid #1e2733",
              borderRadius: "6px",
              padding: "10px 14px",
            }}>
              <code style={{
                fontFamily: "'Fira Code', monospace",
                fontSize: "12px",
                color: "#10b981",
                flexShrink: 0,
                lineHeight: "1.6",
                minWidth: "260px",
              }}>{item.line}</code>
              <div style={{
                fontSize: "12px",
                color: "#718096",
                lineHeight: "1.6",
                borderLeft: "1px solid #2d3748",
                paddingLeft: "14px",
              }}>← {item.label}</div>
            </div>
          ))}
        </div>

        {/* Full code */}
        <div style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: "10px",
          letterSpacing: "2px",
          color: "#4a5568",
          marginBottom: "10px",
        }}>FULL COMPONENT</div>
        <pre style={{
          fontFamily: "'Fira Code','Courier New',monospace",
          fontSize: "13px",
          lineHeight: "1.8",
          background: "#0d1117",
          border: "1px solid #1e2733",
          borderRadius: "8px",
          padding: "20px 24px",
          color: "#e2e8f0",
          whiteSpace: "pre-wrap",
          marginBottom: "32px",
        }}>{node.code}</pre>

        <div style={s.btnRow}>
          <button style={s.btn("primary")} onClick={next}>CONTINUE →</button>
        </div>
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
      {/* TOP BAR */}
      <div style={s.topbar}>
        <div style={s.logo}>INPACT</div>
        <div style={s.progressTrack}>
          <div style={s.progressFill} />
        </div>
        <div style={s.progressLabel}>{progress}%</div>
        <div style={{ ...s.progressLabel, marginLeft: "8px" }}>
          P02 — TOGGLE VISIBILITY
        </div>
      </div>

      <div style={s.body}>
        {/* SIDEBAR */}
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
                <div style={s.sideItemText(isActive, isDone, isLocked)}>
                  {item.label}
                </div>
                {isDone && <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
              </div>
            );
          })}
        </div>

        {/* MAIN */}
        <div style={s.main}>{renderNode()}</div>
      </div>
    </div>
  );
}
