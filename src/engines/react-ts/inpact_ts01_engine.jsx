import createINPACTEngine from "../inpact_engine_shared";

const NODES = [
  { id: "intro", type: "reveal", phase: "Lesson", content: { tag: "LESSON #1 (TypeScript)", title: "Counter App — Typed", body: "Build a simple screen that shows a number (starting at 0) and three buttons: one that increases it by 1, one that decreases it by 1, and one that resets it to 0. The user sees the number update as they click.", usecase: "You'll use this same pattern in real apps — for example, the + and − buttons that change item quantity in a shopping cart, or a reset control that clears the value." } },
  { id: "objectives", type: "objectives", phase: "Objectives", items: ["Establish a typed component contract so the component can be used correctly and invalid props are caught at compile time.","Model the counter value as typed state so updates stay numeric and invalid assignments fail before runtime.","Wire button interactions through typed handlers so clicks produce the intended update path without loose function signatures.","Pass typed props across the boundary, deliberately observe a type mismatch, and fix it so the learner sees the compiler as a design guardrail."] },
  { id: "step1", type: "question", phase: "Step 1 of 4", paal: "Inside the empty Counter component, define and create state for the current count, typed as a number; initialize it at 0 for display and updates in later steps.", hint: "useState<number>(0) tells TypeScript the state is always a number.", answer_keywords: ["usestate", "number", "count", "setcount"], example_code: "// Similar: state for a different concept\nconst [score, setScore] = useState<number>(0)", cursorLine: 4, cursorAtStartOfLine: 4, starter_code: `import { useState } from 'react'

export default function Counter() {

}`, feedback_correct: "✅ Nice work — you declared count with useState<number>(0), so TypeScript knows this piece of state is always a number and can catch mistakes before runtime.", feedback_partial: "Use useState<number>(0).", feedback_wrong: "const [count, setCount] = useState<number>(0)", expected: "const [count, setCount] = useState<number>(0)" },
  { id: "step2jsx", type: "question", phase: "Step 2 of 4", paal: "Add the UI: return JSX that shows the live count and three buttons (+, −, Reset); render only — do not wire onClick yet.", hint: "return ( <div> <h1>{count}</h1> <button>+</button> <button>-</button> <button>Reset</button> </div> )", answer_keywords: ["return", "button", "count", "+", "-", "reset"], example_code: "return (\n  <div>\n    <h1>{count}</h1>\n    <button>+</button>\n    <button>-</button>\n    <button>Reset</button>\n  </div>\n)", cursorAtStartOfLine: 5, feedback_correct: "✅ Your JSX shows the live count and all three buttons are on screen. Next you will define the functions (increment/decrement/reset).", feedback_partial: "You need a return with JSX, {count} visible, and three buttons.", feedback_wrong: "Add a return ( ... ) with a div, something showing {count}, and three <button>s: +, -, Reset.", expected: "return ( <div> ... {count} ... three buttons </div> )" },
  { id: "step2", type: "question", phase: "Step 3 of 4", paal: "Define functions for increment, decrement, and reset. Clicking + should add 1 to the count, clicking - should subtract 1, and clicking Reset should set the count back to 0. Increment/decrement must use functional updates so each update uses the latest count.", hint: "increment/decrement: setCount(prev => prev + 1) and setCount(prev => prev - 1); reset: setCount(0). (These functions will be used by the buttons in the next step.)", evaluate(answer) {
      const a = (answer || "").toLowerCase().replace(/\s/g, "");
      const hasNames = a.includes("increment") && a.includes("decrement") && a.includes("reset") && a.includes("setcount");
      const functionalPlus = /setcount\([^)]*=>[^)]*\+1/.test(a);
      const functionalMinus = /setcount\([^)]*=>[^)]*-1/.test(a);
      const hasReset = /setcount\s*\(\s*0\s*\)/.test(a);
      const hasOnClick = /onclick\s*=/.test(a);

      if (hasNames && functionalPlus && functionalMinus && hasReset && !hasOnClick) return "correct";
      if (hasNames && (functionalPlus || functionalMinus) && hasReset) return "partial";
      return "wrong";
    }, example_code: "// Similar: functions that update state using functional updates\nconst inc = () => setCount(prev => prev + 1)\nconst dec = () => setCount(prev => prev - 1)\nconst clear = () => setCount(0)", cursorLine: 5, feedback_correct: "✅ Functions are defined — + adds 1, - subtracts 1, and Reset sets the count back to 0. Next you’ll wire onClick on each button.", feedback_partial: "Add increment (+1), decrement (-1) using functional updates, and reset (setCount(0)); keep the buttons without onClick in this step.", feedback_wrong: "Define increment/decrement functions that call setCount(prev => prev +/- 1) and a reset function that calls setCount(0). Leave wiring for the next step.", expected: "increment/decrement/reset functions (no onClick yet)" },
  { id: "step3", type: "question", phase: "Step 4 of 4", paal: "Wire onClick so the + button calls increment, the - button calls decrement, and Reset calls reset; export the component.", hint: "onClick={increment}, onClick={decrement}, onClick={reset} on the three buttons", answer_keywords: ["onclick", "increment", "decrement", "reset", "button", "return"], example_code: "// Similar: onClick calls your function\n<button onClick={increment}>+</button>", evaluate(answer) {
      const code = (answer || "").toLowerCase();
      const hasReturnJsx = /return\s*\(/.test(code) && /<button/.test(code);
      const onClickIncrement = /onclick\s*=\s*\{\s*increment\s*\}/.test(code);
      const onClickDecrement = /onclick\s*=\s*\{\s*decrement\s*\}/.test(code);
      const onClickReset = /onclick\s*=\s*\{\s*reset\s*\}/.test(code);
      const hasExport = /export\s+default/.test(code);
      const allThreeWired = onClickIncrement && onClickDecrement && onClickReset;

      if (hasExport && hasReturnJsx && allThreeWired) return "correct";
      if (hasExport && (hasReturnJsx || onClickIncrement || onClickDecrement || onClickReset)) return "partial";
      return "wrong";
    }, cursorLine: 6, cursorAtStartOfLine: 12, seed_code: `import { useState } from 'react'

export default function Counter() {
  const [count, setCount] = useState<number>(0)
  const increment = () => setCount(prev => prev + 1)
  const decrement = () => setCount(prev => prev - 1)
  const reset = () => setCount(0)

  return (
    <div>
      <h1>{count}</h1>
      <button>+</button>
      <button>-</button>
      <button>Reset</button>
    </div>
  )
}`, solution_code: `import { useState } from 'react'

export default function Counter() {
  const [count, setCount] = useState<number>(0)
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
}`, feedback_correct: "✅ Lesson complete — onClick is wired for +, -, and Reset, and the typed counter updates as you click.", feedback_partial: "Wire onClick on all three buttons to increment/decrement/reset (export the component).", feedback_wrong: "Add onClick wiring for +, -, and Reset (calling increment/decrement/reset).", expected: "Full counter with wired onClick + typed state" },
];

const sideItems = [{ label: "Lesson", id: "intro" }, { label: "Objectives", id: "objectives" }, { label: "Step 1", id: "step1" }, { label: "Step 2", id: "step2jsx" }, { label: "Step 3", id: "step2" }, { label: "Step 4", id: "step3" }];

export default createINPACTEngine({ NODES, sideItems, lessonNum: 1, title: "Counter App (TypeScript)", shortName: "TS — COUNTER" });
