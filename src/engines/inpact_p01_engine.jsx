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
      tag: "PROBLEM #1",
      title: "Counter App",
      body: `Build a page that shows a number starting at 0, with three buttons:

  [ + ]     increases the number by 1
  [ - ]     decreases the number by 1
  [ Reset ] brings the number back to 0

Example:
  Start       →  0
  Click +     →  1
  Click +     →  2
  Click -     →  1
  Click Reset →  0`,
      usecase: "You'll use this exact pattern in a shopping cart — the [ + ] and [ - ] buttons that change item quantity, and a Reset button that clears it.",
    },
  },
  {
    id: "objectives",
    type: "objectives",
    phase: "Objectives",
    items: [
      "Use the useState hook to store and manage a changing value inside a React component",
      "Destructure the return value of useState into a state variable and a setter function",
      "Explain why calling the setter triggers a re-render but reassigning a variable does not",
      "Define named callback functions (increment, decrement, reset) inside a React component",
      "Assign a callback function to a button's onClick event handler",
      "Use the functional update form setCount(prev => prev + 1) when new state depends on old state",
      "Distinguish between setCount(0) and setCount(prev => prev + 1) — and know when to use each",
      "Structure a complete React component: import → state → handlers → return JSX",
      "Export a React component using the export default function syntax",
    ],
  },

  {
    id: "step1",
    type: "question",
    phase: "Step 1 of 5",
    paal: "Initialise a state variable to hold the counter value. It should start at 0.",
    hint: "You'll need to import something from React first. Then use array destructuring.",
    answer_keywords: ["usestate", "count", "setcount", "0"],
    seed_code: `import { useState } from 'react'

export default function Counter() {
  // Step 1: declare your state variable here

}`,
    analogy: {
      title: "Similar pattern — tracking a score",
      code: `const [score, setScore] = useState(0)`,
      explain: "useState(0) gives you two things back: score (the current value) and setScore (the function to change it). The 0 is the starting value. Same pattern — different names."
    },
    feedback_correct: "✅ Correct. useState(0) gives you back two things — count (the current value) and setCount (the function to change it). Calling setCount does two things: updates the value AND tells React to re-render the screen. A regular variable only does the first.",
    feedback_partial: "Almost — make sure you're destructuring both the value and the setter from useState, and passing 0 as the initial value.",
    feedback_wrong: "Think about this: React needs to remember values between re-renders. A regular variable resets every render. Try: const [count, setCount] = useState(0)",
    expected: `const [count, setCount] = useState(0)`,
    type_input: "code",
  },
  {
    id: "step2",
    type: "question",
    phase: "Step 2 of 5",
    paal: "Write the JSX that displays count on screen and renders three buttons: +, -, and Reset. Don't wire them up yet.",
    hint: "Use an <h1> to show the number. Three <button> elements below it.",
    answer_keywords: ["return", "h1", "button", "count", "+", "-", "reset"],
    seed_code: `import { useState } from 'react'

export default function Counter() {
  const [count, setCount] = useState(0)

  // Step 2: write your return JSX here

}`,
    analogy: {
      title: "Similar pattern — displaying a username",
      code: `const [username, setUsername] = useState("guest")

return (
  <div>
    <h2>{username}</h2>
    <button>Change</button>
  </div>
)`,
      explain: "{username} in JSX displays the live value. Whenever username changes, React updates just that spot. Same: {count} will update live whenever count changes."
    },
    feedback_correct: "✅ Perfect. Your UI is on screen. count in curly braces tells React to display the live value — whenever count changes, React updates just that part of the DOM.",
    feedback_partial: "You're close — make sure you have all three buttons and you're displaying {count} in your JSX.",
    feedback_wrong: "Start with a return statement wrapping a div. Inside: an <h1>{count}</h1> and three <button> elements.",
    expected: `return (
  <div>
    <h1>{count}</h1>
    <button>+</button>
    <button>-</button>
    <button>Reset</button>
  </div>
)`,
    type_input: "code",
  },
  {
    id: "step3a",
    type: "question",
    phase: "Step 3 of 7",
    paal: "Define the increment function. It should increase count by 1 when called.",
    hint: "prev inside setCount is not the same as a parameter of the function. Keep the arrow function empty: () => ...",
    analogy: {
      title: "Similar pattern — updating a score",
      code: `const addPoint = () => setScore(prev => prev + 1)`,
      explain: "addPoint takes no arguments. The prev lives inside setScore — React passes it automatically. Same pattern you need for increment."
    },
    evaluate: (ans) => {
      const a = ans.toLowerCase().replace(/\s/g, "");
      const hasFunc = a.includes("constincrement") || a.includes("increment=()=>");
      const hasFunctionalUpdate = a.includes("setcount(prev=>") || a.includes("setcount((prev)=>");
      const hasWrongPrev = /\(prev\)=>setcount/.test(a) || /prev=>setcount/.test(a);
      if (hasFunc && hasFunctionalUpdate) return "correct";
      if (hasWrongPrev) return "partial";
      if (a.includes("setcount") && a.includes("prev")) return "partial";
      return "wrong";
    },
    feedback_correct: "✅ Correct. increment is a zero-argument function. prev lives inside setCount — React gives it the latest value automatically.",
    feedback_partial: (ans) => {
      const a = ans.toLowerCase().replace(/\s/g, "");
      if (/\(prev\)=>setcount/.test(a)) return "Close — but (prev) here would receive the click event, not the count. The fix: const increment = () => setCount(prev => prev + 1)";
      return "Almost — make sure the shape is: const increment = () => setCount(prev => prev + 1)";
    },
    feedback_wrong: "const increment = () => setCount(prev => prev + 1)\n\nincrement takes no params. prev goes inside setCount, not outside.",
    seed_code: `import { useState } from 'react'

export default function Counter() {
  const [count, setCount] = useState(0)

  // Step 3a: define the increment function here
  

  return (
    <div>
      <h1>{count}</h1>
      <button>+</button>
      <button>-</button>
      <button>Reset</button>
    </div>
  )
}
`,
    expected: `const increment = () => setCount(prev => prev + 1)`,
  },
  {
    id: "step3b",
    type: "question",
    phase: "Step 4 of 7",
    paal: "Wire increment to the + button using onClick.",
    hint: "onClick takes a reference to the function — no parentheses. onClick={increment} not onClick={increment()}",
    analogy: {
      title: "Similar pattern — wiring a save handler",
      code: `const save = () => console.log("saved")
<button onClick={save}>Save</button>`,
      explain: "onClick={save} passes the function reference. onClick={save()} would call it immediately on render — wrong. Same rule applies to your increment."
    },
    evaluate: (ans) => {
      const a = ans.toLowerCase().replace(/\s/g, "");
      const hasOnClick = a.includes("onclick={increment}");
      const badOnClick = a.includes("onclick={increment()}");
      if (hasOnClick && !badOnClick) return "correct";
      if (badOnClick) return "partial";
      if (a.includes("onclick") && a.includes("increment")) return "partial";
      return "wrong";
    },
    feedback_correct: "✅ onClick={increment} — passing the reference, not calling it. That's the correct pattern for all event handlers.",
    feedback_partial: (ans) => {
      const a = ans.toLowerCase().replace(/\s/g, "");
      if (a.includes("onclick={increment()}")) return "Close — but onClick={increment()} calls it immediately on render. Remove the () — just onClick={increment}";
      return "Almost — make sure it's onClick={increment} on the + button.";
    },
    feedback_wrong: `<button onClick={increment}>+</button>\n\nNote: no () after increment. You're passing the function, not calling it.`,
    seed_code: `import { useState } from 'react'

export default function Counter() {
  const [count, setCount] = useState(0)

  const increment = () => setCount(prev => prev + 1)

  // Step 3b: wire increment to the + button with onClick
  return (
    <div>
      <h1>{count}</h1>
      <button>+</button>
      <button>-</button>
      <button>Reset</button>
    </div>
  )
}
`,
    expected: `<button onClick={increment}>+</button>`,
  },
  {
    id: "step4a",
    type: "question",
    phase: "Step 5 of 7",
    paal: "Define the decrement function. It should decrease count by 1.",
    hint: "Mirror of increment — same shape, just subtract instead of add.",
    analogy: {
      title: "Similar pattern — removing a point",
      code: `const removePoint = () => setScore(prev => prev - 1)`,
      explain: "Exact same pattern as increment. Just swap + for -."
    },
    evaluate: (ans) => {
      const a = ans.toLowerCase().replace(/\s/g, "");
      const hasFunc = a.includes("constdecrement") || a.includes("decrement=()=>");
      const hasFunctionalUpdate = a.includes("setcount(prev=>prev-1)") || a.includes("setcount((prev)=>prev-1)") || a.includes("setcount(prev=>prev-");
      if (hasFunc && hasFunctionalUpdate) return "correct";
      if (a.includes("decrement") && a.includes("setcount")) return "partial";
      return "wrong";
    },
    feedback_correct: "✅ Same pattern as increment — just flipped. You'll use this shape constantly.",
    feedback_partial: "Almost — make sure: const decrement = () => setCount(prev => prev - 1)",
    feedback_wrong: "const decrement = () => setCount(prev => prev - 1)\n\nMirror of increment. prev - 1 instead of prev + 1.",
    seed_code: `import { useState } from 'react'

export default function Counter() {
  const [count, setCount] = useState(0)

  const increment = () => setCount(prev => prev + 1)
  // Step 4a: define the decrement function here
  

  return (
    <div>
      <h1>{count}</h1>
      <button onClick={increment}>+</button>
      <button>-</button>
      <button>Reset</button>
    </div>
  )
}
`,
    expected: `const decrement = () => setCount(prev => prev - 1)`,
  },
  {
    id: "step4b",
    type: "question",
    phase: "Step 6 of 7",
    paal: "Define the reset function and wire all three buttons with onClick.",
    hint: "reset always goes to 0 — no prev needed. setCount(0) is enough.",
    analogy: {
      title: "Similar pattern — clearing a basket",
      code: `const clearBasket = () => setItems(0)
<button onClick={clearBasket}>Clear</button>`,
      explain: "clearBasket always resets to 0 regardless of current value — no prev needed. Same for reset."
    },
    evaluate: (ans) => {
      const a = ans.toLowerCase().replace(/\s/g, "");
      const hasReset = a.includes("constreset") || a.includes("reset=()=>");
      const hasSetZero = a.includes("setcount(0)");
      const hasDecrementWired = a.includes("onclick={decrement}");
      const hasResetWired = a.includes("onclick={reset}");
      if (hasReset && hasSetZero && hasDecrementWired && hasResetWired) return "correct";
      if (hasReset && hasSetZero) return "partial";
      if (a.includes("reset") && a.includes("setcount")) return "partial";
      return "wrong";
    },
    feedback_correct: "✅ reset uses setCount(0) directly — no prev needed since it always resets to zero regardless of current value.",
    feedback_partial: (ans) => {
      const a = ans.toLowerCase().replace(/\s/g, "");
      if (!a.includes("onclick={decrement}")) return "reset is defined but - button isn't wired. Add onClick={decrement} to the - button.";
      if (!a.includes("onclick={reset}")) return "decrement is wired but Reset button isn't. Add onClick={reset} to the Reset button.";
      return "Almost — define reset as: const reset = () => setCount(0), then wire both remaining buttons.";
    },
    feedback_wrong: `const reset = () => setCount(0)

Then wire:
<button onClick={decrement}>-</button>
<button onClick={reset}>Reset</button>`,
    seed_code: `import { useState } from 'react'

export default function Counter() {
  const [count, setCount] = useState(0)

  const increment = () => setCount(prev => prev + 1)
  const decrement = () => setCount(prev => prev - 1)
  // Step 4b: define reset and wire all three buttons

  return (
    <div>
      <h1>{count}</h1>
      <button onClick={increment}>+</button>
      <button>-</button>
      <button>Reset</button>
    </div>
  )
}
`,
    expected: `const reset = () => setCount(0)

<button onClick={decrement}>-</button>
<button onClick={reset}>Reset</button>`,
  },
  {
    id: "step5",
    type: "question",
    phase: "Step 7 of 7",
    paal: "Keep your full component (reset and all three wired buttons stay). Remove only the step comments (e.g. // Step 5: ...) so the file is one clean component from import to closing brace.",
    hint: "Define reset, add onClick={reset} to the Reset button, then remove the // Step 5 comment. Order: import → useState → 3 handlers (increment, decrement, reset) → return JSX with 3 wired buttons.",
    answer_keywords: ["import", "usestate", "export", "function", "counter", "const", "return"],
    analogy: {
      title: "Similar pattern — a Like button component",
      code: `import { useState } from 'react'

export default function LikeButton() {
  const [likes, setLikes] = useState(0)

  const addLike = () => setLikes(prev => prev + 1)
  const reset = () => setLikes(0)

  return (
    <div>
      <span>{likes}</span>
      <button onClick={addLike}>👍 Like</button>
      <button onClick={reset}>Reset</button>
    </div>
  )
}`,
      explain: "Same structure: import → component → state → handlers → JSX. The only difference is the domain (likes vs count). Use this as a reference for your full Counter component."
    },
    evaluate: (ans) => {
      const a = ans.toLowerCase().replace(/\s/g, "");
      const checks = [
        a.includes("import") && a.includes("usestate"),
        a.includes("exportdefaultfunction") || a.includes("exportdefault"),
        a.includes("const[count,setcount]"),
        a.includes("constincrement"),
        a.includes("constdecrement"),
        a.includes("constreset"),
        a.includes("onclick={increment}"),
        a.includes("onclick={decrement}"),
        a.includes("onclick={reset}"),
      ];
      const passed = checks.filter(Boolean).length;
      if (passed >= 8) return "correct";
      if (passed >= 5) return "partial";
      return "wrong";
    },
    feedback_correct: "✅ Complete. That's your Counter App — every piece in the right place.",
    feedback_partial: (answer) => {
      const a = (answer || "").toLowerCase().replace(/\s/g, "");
      if (!a.includes("onclick={reset}")) return "Almost complete — wire the Reset button: add onClick={reset} to the Reset button.";
      if (!a.includes("constreset")) return "Almost complete — define the reset handler: const reset = () => setCount(0);";
      if (!a.includes("import") || !a.includes("usestate")) return "Almost complete — add import { useState } from 'react' at the top.";
      return "Almost complete — double check: all 3 handler functions defined, all 3 onClick attributes wired, useState imported.";
    },
    feedback_wrong: "Start from the top: import → export default function Counter() → useState → 3 handlers → return JSX with 3 wired buttons.",
    seed_code: `import { useState } from 'react'

export default function Counter() {
  const [count, setCount] = useState(0)

  const increment = () => setCount(prev => prev + 1)
  const decrement = () => setCount(prev => prev - 1)
  const reset = () => setCount(0)
  // Step 5: add reset, then wire all 3 buttons in the JSX below

  return (
    <div>
      <h1>{count}</h1>
      <button onClick={increment}>+</button>
      <button onClick={decrement}>-</button>
      <button onClick={reset}>Reset</button>
    </div>
  )
}
`,
    expected: `import { useState } from 'react'

export default function Counter() {
  const [count, setCount] = useState(0)

  const increment = () => setCount(prev => prev + 1)
  const decrement = () => setCount(prev => prev - 1)
  const reset = () => setCount(0)

  return (
    <div>
      <h1>{count}</h1>
      <button onClick={increment}>+</button>
      <button onClick={decrement}>-</button>
      <button onClick={reset}>Reset</button>
    </div>
  )
}`,
  },
];

// ─── EVALUATION ───────────────────────────────────────────────────────────────
function evaluate(node, answer) {
  // Use node-level custom evaluator if defined
  if (node.evaluate) return node.evaluate(answer);
  const lower = answer.toLowerCase().replace(/\s/g, "");
  const hits = node.answer_keywords.filter((kw) =>
    lower.includes(kw.toLowerCase().replace(/\s/g, ""))
  );
  const ratio = hits.length / node.answer_keywords.length;
  if (ratio >= 0.8) return "correct";
  if (ratio >= 0.5) return "partial";
  return "wrong";
}

// ─── ICONS ────────────────────────────────────────────────────────────────────
const CheckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M3 8l3.5 3.5L13 4.5" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const LockIcon = () => (
  <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
    <rect x="3" y="7" width="10" height="8" rx="1" stroke="#4a5568" strokeWidth="1.5"/>
    <path d="M5 7V5a3 3 0 016 0v2" stroke="#4a5568" strokeWidth="1.5"/>
  </svg>
);

// ─── MAIN ENGINE ──────────────────────────────────────────────────────────────


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
  const [result, setResult] = useState(null); // null | 'correct' | 'partial' | 'wrong'
  const [attempts, setAttempts] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [showExpected, setShowExpected] = useState(false);
  const [completedNodes, setCompletedNodes] = useState([]);
  const [objIndex, setObjIndex] = useState(0);
  const [wfsChecked, setWfsChecked] = useState([]);
  const [showAnalogy, setShowAnalogy] = useState(false);
  const editorRef = useRef(null);

  const node = NODES[nodeIndex];
  const progress = NODES.length <= 1 ? 0 : Math.min(100, Math.round((nodeIndex / (NODES.length - 1)) * 100));

  useEffect(() => {
    const currentNode = NODES[nodeIndex];
    const seed = currentNode?.seed_code ?? "";
    setAnswer(seed);
    setResult(null);
    setAttempts(0);
    setShowHint(false);
    setShowExpected(false);
    setShowAnalogy(false);
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
  }, [nodeIndex]);

  function next() {
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
      overflow: "visible",
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
      overflow: "visible",
      wordBreak: "break-word",
      whiteSpace: "pre-wrap",
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
    { label: "Step 1 — State", id: "step1" },
    { label: "Step 2 — JSX", id: "step2" },
    { label: "Step 3 — Define fn", id: "step3a" },
    { label: "Step 4 — Wire onClick", id: "step3b" },
    { label: "Step 5 — Decrement", id: "step4a" },
    { label: "Step 6 — Reset + Wire", id: "step4b" },
    { label: "Step 7 — Full", id: "step5" },
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
      : result === "partial" ? node.feedback_partial
      : result === "wrong" ? node.feedback_wrong
      : null;
    const feedbackMsg = typeof rawFeedback === "function" ? rawFeedback(answer) : rawFeedback;

    return (
      <div>
        <div style={s.phase}>{node.phase}</div>
        <div style={s.paalBox}>
          <div style={s.paalLabel}>PAAL</div>
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

        {showHint && (
          <div style={s.hintBox}>💡 HINT — {node.hint}</div>
        )}

        {feedbackMsg && (
          <div style={s.feedback(result)}>{feedbackMsg}</div>
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
    return (
      <div>
        <div style={s.phase}>{node.phase}</div>
        <h1 style={s.h1}>Write From Scratch</h1>
        <div style={s.pre}>{`Close this panel. Open a blank editor.
Reproduce the full Counter component from memory.
No hints. No looking back.`}</div>

        <div style={{ ...s.paalLabel, marginBottom: "12px" }}>
          SELF-CHECK RUBRIC — tick each one after you've written it
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
                  {checked ? <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg> : (
                    <div style={{ width: 14, height: 14, border: "1px solid #4a5568", borderRadius: "3px" }} />
                  )}
                </div>
                <div style={s.rubricText(checked)}>{item}</div>
              </div>
            );
          })}
        </div>

        {allChecked && (
          <div style={{ marginTop: "24px" }}>
            <div style={s.feedback("correct")}>
              ✅ Problem #1 complete. You've mastered useState fundamentals.{"\n"}
              Next: Problem #2 — Toggle Visibility
            </div>
            <div style={s.btnRow}>
              <button style={s.btn("primary")} onClick={onNextProblem ?? next}>
                NEXT PROBLEM →
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  function renderComplete() {
    return (
      <div style={s.completeBanner}>
        <div style={{ fontSize: "48px", marginBottom: "24px" }}>🎯</div>
        <h1 style={{ ...s.h1, textAlign: "center" }}>Problem #1 Complete</h1>
        <p style={{ color: "#4a5568", fontFamily: "'DM Sans', sans-serif", fontSize: "13px" }}>
          Tutorial recorded. Ready for Problem #2.
        </p>
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
      {/* TOP BAR */}
      <div style={s.topbar}>
        <div style={s.logo}>INPACT</div>
        <div style={s.progressTrack}>
          <div style={s.progressFill} />
        </div>
        <div style={s.progressLabel}>{progress}%</div>
        <div style={{ ...s.progressLabel, marginLeft: "8px" }}>
          P01 — COUNTER APP
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
                onClick={() => {
                  if (i < nodeIndex && !window.confirm("Go back to this step? The editor will show this step's code.")) return;
                  setNodeIndex(i);
                }}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    if (i < nodeIndex && !window.confirm("Go back to this step? The editor will show this step's code.")) return;
                    setNodeIndex(i);
                  }
                }}
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
