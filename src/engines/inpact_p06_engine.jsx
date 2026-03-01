import { useState, useEffect } from "react";
import CodeEditor from "./CodeEditor";

// ─── TUTORIAL DATA ────────────────────────────────────────────────────────────
const NODES = [
  {
    id: "intro",
    type: "reveal",
    phase: "Problem",
    content: {
      tag: "PROBLEM #6",
      title: "List Rendering with map()",
      body: `A shopping list component. An array of items lives in state.
Each item renders as a <li> element.

items = ['Apples', 'Bread', 'Milk']

→  • Apples
   • Bread
   • Milk

Add an item → list grows. Remove one → list shrinks.`,
      usecase: `Every feed, inbox, search result, product list, and comment thread on the web renders an array using map(). It's the single most used pattern in React after useState.`,
    },
  },
  {
    id: "objectives",
    type: "objectives",
    phase: "Objectives",
    items: [
      "Use useState with an array as initial value",
      "Use .map() to transform an array into JSX elements",
      "Understand why every mapped element needs a unique key prop",
      "Add items to state using the spread operator: [...prev, newItem]",
      "Remove items from state using .filter()",
      "Understand why you never mutate state directly with .push()",
    ],
  },
  {
    id: "step1",
    type: "question",
    phase: "Step 1 of 5",
    paal: "Declare a state variable called items (setter: setItems). It should hold an array with three starting items: 'Apples', 'Bread', and 'Milk'.",
    hint: "useState can hold any type — including arrays:\nconst [items, setItems] = useState(['Apples', 'Bread', 'Milk'])",
    analogy: {
      title: "Similar pattern — todo list",
      code: `const [todos, setTodos] = useState(['Buy groceries', 'Walk the dog'])`,
      explain: "useState holds an array just like any other value. The array is the initial state — your component starts with these items already in the list.",
    },
    evaluate: (ans) => {
      const a = ans.replace(/\s/g, "").toLowerCase();
      const hasUseState = a.includes("usestate");
      const hasArray = a.includes("[") && a.includes("]") && a.includes("usestate([");
      const hasItems = a.includes("apples") && a.includes("bread") && a.includes("milk");
      const hasCorrectName = /const\[items,/i.test(ans.replace(/\s/g, ""));
      const hasSomeName = /const\[\w+,/.test(ans.replace(/\s/g, ""));
      if (hasUseState && hasArray && hasItems && hasCorrectName) return "correct";
      if (hasUseState && hasArray && hasItems && hasSomeName) return "naming";
      if (hasUseState && hasArray) return "partial";
      if (hasUseState) return "partial";
      return "wrong";
    },
    feedback_correct: "✅ useState with an array — React treats it like any other state value. The whole array updates atomically on every change.",
    feedback_naming: (ans) => {
      const m = ans.match(/const\s*\[(\w+)/);
      const used = m ? m[1] : "your variable";
      return `✅ Good — array state with the right items.\n\nFor this tutorial use items / setItems so all steps stay in sync:\nconst [items, setItems] = useState(['Apples', 'Bread', 'Milk'])`;
    },
    feedback_partial: (ans) => {
      const a = ans.toLowerCase();
      if (!a.includes("apples") || !a.includes("bread") || !a.includes("milk")) return "Close — make sure the initial array has all three items: 'Apples', 'Bread', 'Milk'";
      return "Almost — useState needs the array as its argument:\nconst [items, setItems] = useState(['Apples', 'Bread', 'Milk'])";
    },
    feedback_wrong: `const [items, setItems] = useState(['Apples', 'Bread', 'Milk'])\n\nuseState can hold arrays. The list starts with these three items.`,
    expected: `const [items, setItems] = useState(['Apples', 'Bread', 'Milk'])`,
    seed_code: `import { useState } from 'react'

export default function ShoppingList() {
  // Step 1: declare array state — starts with Apples, Bread, Milk

}`,
  },
  {
    id: "step2",
    type: "question",
    phase: "Step 2 of 5",
    paal: "Render the list. Use .map() on items to return a <li> for each item. Each <li> needs a key prop. Wrap in a <ul>.",
    hint: "Map returns a new array of JSX:\n{items.map((item, index) => (\n  <li key={index}>{item}</li>\n))}",
    analogy: {
      title: "Similar pattern — rendering usernames",
      code: `<ul>\n  {users.map((user, i) => (\n    <li key={i}>{user.name}</li>\n  ))}\n</ul>`,
      explain: "map() transforms each array element into JSX. key= helps React track which item is which — use index for now (we'll cover better keys later).",
    },
    evaluate: (ans) => {
      const a = ans.toLowerCase().replace(/\s/g, "");
      const hasBadReturn = /return\s*\(\s*\{/.test(ans);
      if (hasBadReturn) return "syntax";
      const hasMap = a.includes(".map(");
      const hasLi = a.includes("<li");
      const hasKey = a.includes("key=");
      const hasUl = a.includes("<ul");
      const hasReturn = /return\s*\(/.test(ans);
      if (hasReturn && hasMap && hasLi && hasKey && hasUl) return "correct";
      if (hasMap && hasLi && !hasKey) return "partial_key";
      if (hasMap && hasLi && hasKey && !hasUl) return "partial_ul";
      if (hasMap && !hasLi) return "partial_li";
      if (a.includes("items") && !hasMap) return "partial_map";
      return "wrong";
    },
    feedback_correct: "✅ .map() transforms each array item into a <li>. React renders all of them. key= lets React efficiently update only what changed.",
    feedback_syntax: "Syntax error: return(){\n  is not valid. Use return ( to wrap JSX.",
    feedback_partial_key: "Good map and <li> — but each <li> needs a key prop. Add key={index}:\n<li key={index}>{item}</li>",
    feedback_partial_ul: "Almost — wrap the mapped list in a <ul> so the browser knows it's a list:\n<ul>{items.map(...)}</ul>",
    feedback_partial_li: "map() is there — now return a <li> for each item:\nitems.map((item, index) => <li key={index}>{item}</li>)",
    feedback_partial_map: "You have the items array — now use .map() to turn it into JSX:\nitems.map((item, index) => <li key={index}>{item}</li>)",
    feedback_wrong: `return (\n  <div>\n    <ul>\n      {items.map((item, index) => (\n        <li key={index}>{item}</li>\n      ))}\n    </ul>\n  </div>\n)`,
    expected: `{items.map((item, index) => (\n  <li key={index}>{item}</li>\n))}`,
    seed_code: `import { useState } from 'react'

export default function ShoppingList() {
  const [items, setItems] = useState(['Apples', 'Bread', 'Milk'])

  // Step 2: render the list using .map() — each item gets a <li key={index}>

}`,
  },
  {
    id: "step3",
    type: "question",
    phase: "Step 3 of 5",
    paal: "Add an input and an 'Add' button above the list. The input should be controlled — wire it to a separate state variable called newItem (setter: setNewItem), starting as an empty string.",
    hint: "Two pieces of state: items (the list) and newItem (what's being typed):\nconst [newItem, setNewItem] = useState(\"\")\n\nThen wire the input:\n<input value={newItem} onChange={(e) => setNewItem(e.target.value)} />",
    analogy: {
      title: "Similar pattern — search + results",
      code: `const [query, setQuery] = useState("")\n// ...\n<input value={query} onChange={(e) => setQuery(e.target.value)} />\n<button>Search</button>`,
      explain: "Controlled input for the new item text, separate from the list state. Same controlled input pattern from P03.",
    },
    evaluate: (ans) => {
      const a = ans.toLowerCase().replace(/\s/g, "");
      const hasNewItem = /const\[newitem,/i.test(ans.replace(/\s/g, "")) || a.includes("newitem");
      const hasEmptyString = a.includes('usestate("")') || a.includes("usestate('')");
      const hasInput = a.includes("<input");
      const hasOnChange = a.includes("onchange={");
      const hasButton = a.includes("<button");
      const hasMap = a.includes(".map(");
      if (hasNewItem && hasEmptyString && hasInput && hasOnChange && hasButton && hasMap) return "correct";
      if (hasNewItem && hasInput && !hasOnChange) return "partial_wire";
      if (!hasNewItem && hasInput) return "partial_state";
      if (hasNewItem && !hasInput) return "partial_input";
      if (a.includes("input") || a.includes("button")) return "partial";
      return "wrong";
    },
    feedback_correct: "✅ Two state variables — items for the list, newItem for the typed text. Controlled input wired up. Ready to wire the Add button.",
    feedback_partial_wire: "newItem state is there — now wire the input:\n<input value={newItem} onChange={(e) => setNewItem(e.target.value)} />\n\nNote: the onChange handler is separate from addItem. addItem comes in Step 4 — it appends to the list. The onChange handler just updates the input text as you type.",
    feedback_partial_state: "Input is there — but you need a second state variable for what's being typed:\nconst [newItem, setNewItem] = useState(\"\")",
    feedback_partial_input: "newItem state is declared — now add the controlled input and button to the JSX.",
    feedback_partial: "You need: a newItem state variable, a controlled input wired to it, and an Add button.",
    feedback_wrong: `const [newItem, setNewItem] = useState("")\n// ...\n<input value={newItem} onChange={(e) => setNewItem(e.target.value)} />\n<button>Add</button>`,
    expected: `const [newItem, setNewItem] = useState("")`,
    seed_code: `import { useState } from 'react'

export default function ShoppingList() {
  const [items, setItems] = useState(['Apples', 'Bread', 'Milk'])

  // Step 3: add newItem state + controlled input + Add button (keep the map below)
  return (
    <div>
      <ul>
        {items.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </div>
  )
}`,
  },
  {
    id: "step4",
    type: "question",
    phase: "Step 4 of 5",
    paal: "Wire the Add button. Write a function called addItem that appends newItem to the items array using the spread operator, then clears the input.",
    hint: "Never push() — always create a new array:\nconst addItem = () => {\n  setItems(prev => [...prev, newItem])\n  setNewItem('')\n}",
    analogy: {
      title: "Similar pattern — adding a todo",
      code: `const addTodo = () => {\n  setTodos(prev => [...prev, newTodo])\n  setNewTodo('')\n}`,
      explain: "[...prev, newItem] creates a brand new array with all existing items plus the new one. React detects the new reference and re-renders. Never mutate — always spread.",
    },
    evaluate: (ans) => {
      const a = ans.toLowerCase().replace(/\s/g, "");
      const hasSpread = a.includes("...prev") || a.includes("...items");
      const hasSetItems = a.includes("setitems");
      const hasClear = a.includes("setnewitem('')") || a.includes('setnewitem("")');
      const hasOnClick = a.includes("onclick={");
      const hasFn = a.includes("additem") || (a.includes("const") && a.includes("=>") && hasSetItems);
      if (hasFn && hasSpread && hasSetItems && hasClear && hasOnClick) return "correct";
      if (hasSpread && hasSetItems && !hasClear) return "partial_clear";
      if (hasSetItems && !hasSpread) return "partial_spread";
      if (hasFn && !hasOnClick) return "partial_onclick";
      if (hasSetItems) return "partial";
      return "wrong";
    },
    feedback_correct: "✅ [...prev, newItem] creates a new array — React sees a new reference and re-renders. setNewItem('') clears the input after adding.",
    feedback_partial_clear: "Spread is right — but don't forget to clear the input after adding:\nsetNewItem('')",
    feedback_partial_spread: "setItems is there — but use spread to create a new array, not push or direct assignment:\nsetItems(prev => [...prev, newItem])\n\nIf your addItem function only calls setNewItem — that's the onChange handler. addItem should append to the list.",
    feedback_partial_onclick: "addItem function looks good — now wire it to the button:\n<button onClick={addItem}>Add</button>",
    feedback_partial: "Use spread to add without mutating:\nsetItems(prev => [...prev, newItem])\nsetNewItem('')",
    feedback_wrong: `const addItem = () => {\n  setItems(prev => [...prev, newItem])\n  setNewItem('')\n}\n// and on the button:\n<button onClick={addItem}>Add</button>`,
    expected: `const addItem = () => {\n  setItems(prev => [...prev, newItem])\n  setNewItem('')\n}`,
    seed_code: `import { useState } from 'react'

export default function ShoppingList() {
  const [items, setItems] = useState(['Apples', 'Bread', 'Milk'])
  const [newItem, setNewItem] = useState('')

  // Step 4: write addItem — spreads newItem into items, clears input
  return (
    <div>
      <input value={newItem} onChange={(e) => setNewItem(e.target.value)} />
      <button>Add</button>
      <ul>
        {items.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </div>
  )
}`,
  },
  {
    id: "step5",
    type: "question",
    phase: "Step 5 of 5",
    paal: "Add a Remove button inside each <li>. Wire it to remove that item using .filter(). Each click removes exactly that item from the list.",
    hint: "filter() keeps items that don't match the index:\nsetItems(prev => prev.filter((_, i) => i !== index))\n\nAdd a button inside the <li> with onClick wired to this.",
    analogy: {
      title: "Similar pattern — removing a todo",
      code: `{todos.map((todo, i) => (\n  <li key={i}>\n    {todo}\n    <button onClick={() => setTodos(p => p.filter((_, j) => j !== i))}>✕</button>\n  </li>\n))}`,
      explain: "filter() returns a new array excluding the item at the clicked index. prev.filter((_, i) => i !== index) keeps everything except the one you clicked.",
    },
    evaluate: (ans) => {
      const a = ans.toLowerCase().replace(/\s/g, "");
      const hasFilter = a.includes(".filter(");
      const hasSetItems = a.includes("setitems");
      const hasButton = a.includes("<button");
      const hasOnClick = a.includes("onclick={");
      const hasMap = a.includes(".map(");
      const hasIndex = a.includes("index") || a.includes("!==");
      if (hasFilter && hasSetItems && hasButton && hasOnClick && hasMap && hasIndex) return "correct";
      if (hasFilter && hasSetItems && !hasButton) return "partial_button";
      if (hasSetItems && !hasFilter) return "partial_filter";
      if (hasButton && !hasOnClick) return "partial_onclick";
      return "wrong";
    },
    feedback_correct: "✅ filter() creates a new array without the removed item. React sees the new reference and re-renders the shorter list.",
    feedback_partial_button: "Filter logic is right — now add the Remove button inside each <li> with onClick wired to it.",
    feedback_partial_filter: "Button is there — but use filter to remove, not splice or direct mutation:\nsetItems(prev => prev.filter((_, i) => i !== index))",
    feedback_partial_onclick: "Button is in the JSX — wire its onClick:\n<button onClick={() => setItems(prev => prev.filter((_, i) => i !== index))}>Remove</button>",
    feedback_wrong: `{items.map((item, index) => (\n  <li key={index}>\n    {item}\n    <button onClick={() => setItems(prev => prev.filter((_, i) => i !== index))}>\n      Remove\n    </button>\n  </li>\n))}`,
    expected: `setItems(prev => prev.filter((_, i) => i !== index))`,
    seed_code: `import { useState } from 'react'

export default function ShoppingList() {
  const [items, setItems] = useState(['Apples', 'Bread', 'Milk'])
  const [newItem, setNewItem] = useState('')

  const addItem = () => {
    setItems(prev => [...prev, newItem])
    setNewItem('')
  }

  // Step 5: add Remove button inside each <li> using filter()
  return (
    <div>
      <input value={newItem} onChange={(e) => setNewItem(e.target.value)} />
      <button onClick={addItem}>Add</button>
      <ul>
        {items.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
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
  const [userChoices, setUserChoices] = useState({ varName: "items", setterName: "setItems", inputVar: "newItem", inputSetter: "setNewItem", addFn: "addItem", userJSX: {} });
  const node = NODES[nodeIndex];
  const progress = NODES.length <= 1 ? 0 : Math.min(100, Math.round((nodeIndex / (NODES.length - 1)) * 100));

  function getSeed(n) {
    if (n?.id === "step3" && userChoices.userJSX["step2"]) {
      let base = userChoices.userJSX["step2"]
        .replace(/\/\/\s*Step\s*\d[^\n]*/g, "")  // strip step comments
        .replace(/\}\s*\}(\s*)$/g, "}")           // strip double closing braces
        .replace(/\}\s*$/g, "")                    // strip final closing brace
        .replace(/\n{3,}/g, "\n\n")
        .trimEnd();
      return base + "\n\n  // Step 3: add newItem state + controlled input + Add button\n}";
    }
    if (n?.id === "step4" && userChoices.userJSX["step3"]) {
      let base = userChoices.userJSX["step3"]
        .replace(/\/\/\s*Step\s*\d[^\n]*/g, "")
        .replace(/\}\s*\}(\s*)$/g, "}")
        .replace(/\}\s*$/g, "")
        .replace(/\n{3,}/g, "\n\n")
        .trimEnd();
      return base + "\n\n  // Step 4: write addItem using spread, wire to button\n}";
    }
    if (n?.id === "step5" && userChoices.userJSX["step4"]) {
      let base = userChoices.userJSX["step4"]
        .replace(/\/\/\s*Step\s*\d[^\n]*/g, "")
        .replace(/\}\s*\}(\s*)$/g, "}")
        .replace(/\}\s*$/g, "")
        .replace(/\n{3,}/g, "\n\n")
        .trimEnd();
      return base + "\n\n  // Step 5: add Remove button inside each li using filter\n}";
    }
    let seed = n?.seed_code ?? "";
    seed = seed.replace(/\bitems\b/g, userChoices.varName).replace(/\bsetItems\b/g, userChoices.setterName);
    seed = seed.replace(/\bnewItem\b/g, userChoices.inputVar).replace(/\bsetNewItem\b/g, userChoices.inputSetter);
    seed = seed.replace(/\baddItem\b/g, userChoices.addFn);
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
    if (node?.id === "step3") {
      const m = answer.match(/const\s*\[(\w+)\s*,\s*(\w+)\]\s*=\s*useState\s*\(\s*["']/);
      if (m) setUserChoices(c => ({ ...c, inputVar: m[1], inputSetter: m[2] }));
    }
    if (node?.id === "step4") {
      const m = answer.match(/const\s+(\w+)\s*=\s*\(\s*\)\s*=>/);
      if (m) setUserChoices(c => ({ ...c, addFn: m[1] }));
    }
    const stepId = node?.id;
    if (stepId && ["step2", "step3", "step4"].includes(stepId)) {
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
    { label: "Step 1 — Array state", id: "step1" }, { label: "Step 2 — Render list", id: "step2" },
    { label: "Step 3 — Add input", id: "step3" }, { label: "Step 4 — Add item", id: "step4" },
    { label: "Step 5 — Remove item", id: "step5" },
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
    const partialKeys = ["naming", "syntax", "partial_key", "partial_ul", "partial_li", "partial_map", "partial_wire", "partial_state", "partial_input", "partial_clear", "partial_spread", "partial_onclick", "partial_button", "partial_filter"];
    const rawFb =
      result === "correct" ? node.feedback_correct
      : result === "naming" ? node.feedback_naming
      : result === "syntax" ? (syntaxMsg || node.feedback_syntax)
      : partialKeys.slice(2).includes(result) ? node[`feedback_${result}`]
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
          Blank editor — no hints, no seed. Reproduce the full ShoppingList component from memory. Hit <strong style={{ color: "#e2e8f0" }}>CHECK MY CODE</strong> when done.
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
                <div style={s.fb("correct")}>✅ Problem #6 complete. You can now render, add, and remove from lists in React.{"\n"}Next: Problem #7 — useEffect & Side Effects</div>
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
        <h1 style={s.h1}>Problem #6 Complete</h1>
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
        <div style={{ ...s.lbl, marginLeft: "8px" }}>P06 — LIST RENDERING</div>
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
