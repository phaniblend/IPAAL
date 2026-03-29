import createINPACTEngine from "../inpact_engine_shared";

const NODES = [
  { id: "intro", type: "reveal", phase: "Lesson", content: { tag: "LESSON #1 (TypeScript)", title: "Counter App — Typed", body: "Build a simple screen that shows a number (starting at 0) and three buttons: one that increases it by 1, one that decreases it by 1, and one that resets it to 0. The user sees the number update as they click.", usecase: "You'll use this same pattern in real apps — for example, the + and − buttons that change item quantity in a shopping cart, or a reset control that clears the value." } },
  { id: "objectives", type: "objectives", phase: "Objectives", items: ["Establish a typed component contract so the component can be used correctly and invalid props are caught at compile time.","Model the counter value as typed state so updates stay numeric and invalid assignments fail before runtime.","Wire button interactions through typed handlers so clicks produce the intended update path without loose function signatures.","Pass typed props across the boundary, deliberately observe a type mismatch, and fix it so the learner sees the compiler as a design guardrail."] },
  { id: "step1", type: "question", phase: "Step 1 of 4", paal: "The file already has the React import and an empty Counter component. Your task: add a state variable inside the component to hold the current count. Use useState with a numeric type and initial value 0 so we can display and update the number in later steps.", hint: "useState<number>(0) tells TypeScript the state is always a number.", answer_keywords: ["usestate", "number", "count", "setcount"], example_code: "// Similar: state for a different concept\nconst [score, setScore] = useState<number>(0)", cursorLine: 4, cursorAtStartOfLine: 5, starter_code: `import { useState } from 'react'

export default function Counter() {
  // Step 1: add state for the count (number, initial 0)

}`, feedback_correct: "✅ State is typed as number.", feedback_partial: "Use useState<number>(0).", feedback_wrong: "const [count, setCount] = useState<number>(0)", expected: "const [count, setCount] = useState<number>(0)" },
  { id: "step2", type: "question", phase: "Step 2 of 4", paal: "Define two functions: one that increases the count by 1, and one that decreases it by 1. Both should update state using the previous value (so the update is based on the latest count).", hint: "const increment = (): void => setCount(prev => prev + 1) or just () => setCount(...)", answer_keywords: ["increment", "decrement", "setcount", "prev"], example_code: "// Similar pattern: a handler that updates state using previous value\nconst double = () => { setProduct(prev => prev * 2) }", cursorLine: 5, feedback_correct: "✅ Handlers defined.", feedback_partial: "Add increment and decrement that update count.", feedback_wrong: "const increment = () => setCount(prev => prev + 1); same for decrement.", expected: "increment and decrement functions" },
  { id: "step2jsx", type: "question", phase: "Step 3 of 4", paal: "Add the UI: write a return statement with JSX that displays the current count on screen and three buttons labeled +, -, and Reset. Don't wire the buttons to the handlers yet — just render them.", hint: "return ( <div> <h1>{count}</h1> <button>+</button> <button>-</button> <button>Reset</button> </div> )", answer_keywords: ["return", "button", "count", "+", "-", "reset"], example_code: "return (\n  <div>\n    <h1>{count}</h1>\n    <button>+</button>\n    <button>-</button>\n    <button>Reset</button>\n  </div>\n)", cursorAtStartOfLine: 6, feedback_correct: "✅ UI is in place. Next step: add reset and wire all three buttons.", feedback_partial: "You need a return with JSX, {count} visible, and three buttons.", feedback_wrong: "Add a return ( ... ) with a div, something showing {count}, and three <button>s: +, -, Reset.", expected: "return ( <div> ... {count} ... three buttons </div> )" },
  { id: "step3", type: "question", phase: "Step 4 of 4", paal: "Define a function that resets the count to 0. Then wire all three buttons: each button's onClick should call its handler (increment, decrement, reset). Export the component.", hint: "const reset = (): void => setCount(0); then onClick={increment}, onClick={decrement}, onClick={reset} on the buttons.", answer_keywords: ["reset", "onclick", "increment", "decrement", "button", "return"], example_code: "// Similar: a handler that sets value to zero, and a button that calls it\nconst clear = () => setValue(0)\n<button onClick={clear}>Clear</button>", cursorLine: 7, cursorAtStartOfLine: 10, evaluate(answer) {
      const code = (answer || "").toLowerCase();
      const hasResetFn = /reset\s*[=:(]|setcount\s*\(\s*0\s*\)/.test(code);
      const hasReturnJsx = /return\s*\(/.test(code) && (/<div|<\s*div|<\s*button|onclick\s*=/.test(code));
      const onClickIncrement = /onclick\s*=\s*\{\s*increment\s*\}/.test(code);
      const onClickDecrement = /onclick\s*=\s*\{\s*decrement\s*\}/.test(code);
      const onClickReset = /onclick\s*=\s*\{\s*reset\s*\}/.test(code);
      const allThreeWired = onClickIncrement && onClickDecrement && onClickReset;
      if (hasResetFn && hasReturnJsx && allThreeWired) return "correct";
      if (hasResetFn || hasReturnJsx || onClickIncrement || onClickDecrement || onClickReset) return "partial";
      return "wrong";
    }, seed_code: `import { useState } from 'react'

export default function Counter() {
  const [count, setCount] = useState<number>(0)
  const increment = () => setCount(prev => prev + 1)
  const decrement = () => setCount(prev => prev - 1)
  // Step 4: add reset and wire all three buttons with onClick
  return (
    <div>

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
}`, feedback_correct: "✅ Counter with TypeScript state complete.", feedback_partial: "Wire all three buttons and reset.", feedback_wrong: "Add reset and onClick for all buttons.", expected: "Full counter with typed state" },
];

const sideItems = [{ label: "Lesson", id: "intro" }, { label: "Objectives", id: "objectives" }, { label: "Step 1", id: "step1" }, { label: "Step 2", id: "step2" }, { label: "Step 3", id: "step2jsx" }, { label: "Step 4", id: "step3" }];

export default createINPACTEngine({ NODES, sideItems, problemNum: 1, title: "Counter App (TypeScript)", shortName: "TS — COUNTER" });
