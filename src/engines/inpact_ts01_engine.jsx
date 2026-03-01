import createINPACTEngine from "./inpact_engine_shared";

const NODES = [
  { id: "intro", type: "reveal", phase: "Problem", content: { tag: "PROBLEM #1 (TypeScript)", title: "Counter App — Typed", body: "Build the same counter with increment, decrement, and reset. Use TypeScript: type the state as number and type the component props if it receives any.", usecase: "Typing useState and handlers is the foundation for type-safe React." } },
  { id: "objectives", type: "objectives", phase: "Objectives", items: ["Define a state variable for the count (numeric type, initial 0)", "Define handlers that update state; wire buttons to them", "Export a typed function component"] },
  { id: "step1", type: "question", phase: "Step 1 of 3", paal: "Define a state variable to hold the current count value. Give it a numeric type and an initial value of 0.", hint: "useState<number>(0) tells TypeScript the state is always a number.", answer_keywords: ["usestate", "number", "count", "setcount"], example_code: "// Similar: state for a different concept\nconst [score, setScore] = useState<number>(0)", cursorLine: 4, seed_code: `import { useState } from 'react'

export default function Counter() {
  // Step 1: useState<number>(0)
}`, feedback_correct: "✅ State is typed as number.", feedback_partial: "Use useState<number>(0).", feedback_wrong: "const [count, setCount] = useState<number>(0)", expected: "const [count, setCount] = useState<number>(0)" },
  { id: "step2", type: "question", phase: "Step 2 of 3", paal: "Define two functions: one that increases the count by 1, and one that decreases it by 1. Both should update state using the previous value (so the update is based on the latest count).", hint: "const increment = (): void => setCount(prev => prev + 1) or just () => setCount(...)", answer_keywords: ["increment", "decrement", "setcount", "prev"], example_code: "// Similar pattern: a handler that updates state using previous value\nconst double = () => { setProduct(prev => prev * 2) }", cursorLine: 5, seed_code: `import { useState } from 'react'

export default function Counter() {
  const [count, setCount] = useState<number>(0)
  // Step 2: increment and decrement handlers
}`, feedback_correct: "✅ Handlers defined.", feedback_partial: "Add increment and decrement that update count.", feedback_wrong: "const increment = () => setCount(prev => prev + 1); same for decrement.", expected: "increment and decrement functions" },
  { id: "step3", type: "question", phase: "Step 3 of 3", paal: "Define a function that resets the count to 0. In the UI, add a reset button and wire all three buttons (increment, decrement, reset) so each calls its handler when clicked. Export the component.", hint: "const reset = (): void => setCount(0); buttons with onClick={increment} etc.", answer_keywords: ["reset", "onclick", "button", "return", "jsx"], example_code: "// Similar: a handler that sets value to zero, and a button that calls it\nconst clear = () => setValue(0)\n<button onClick={clear}>Clear</button>", cursorLine: 7, seed_code: `import { useState } from 'react'

export default function Counter() {
  const [count, setCount] = useState<number>(0)
  const increment = () => setCount(prev => prev + 1)
  const decrement = () => setCount(prev => prev - 1)
  // Step 3: add reset and a Reset button, wire all three with onClick
  return (
    <div>
      <h1>{count}</h1>
      <button onClick={increment}>+</button>
      <button onClick={decrement}>-</button>
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

const sideItems = [{ label: "Problem", id: "intro" }, { label: "Objectives", id: "objectives" }, { label: "Step 1", id: "step1" }, { label: "Step 2", id: "step2" }, { label: "Step 3", id: "step3" }];

export default createINPACTEngine({ NODES, sideItems, problemNum: 1, title: "Counter App (TypeScript)", shortName: "TS — COUNTER" });
