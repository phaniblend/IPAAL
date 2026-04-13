/**
 * 🔒 LOCKED — React · TS lesson 4 — Multiple State Variables (TypeScript).
 * Do not change steps, copy, or evaluation without explicit product/content sign-off.
 * Generated mirror: content/generated/react-ts/004_multiple-state-variables_lesson.json
 */
import createINPACTEngine from "../inpact_engine_shared";

const NODES = [
  {
    id: "intro",
    type: "reveal",
    phase: "Lesson",
    content: {
      tag: "LESSON #4 (TypeScript)",
      title: "Multiple State Variables — Typed",
      body: "In real applications, components rarely track just one piece of state. You'll often manage multiple independent values that change over time. TypeScript ensures each state variable has a clear type, preventing accidental mixing of different data types.",
      usecase:
        "Think of a user profile form with multiple fields, a shopping cart with items and totals, or a game with score, lives, and level — all requiring separate but coordinated state management.",
    },
  },
  {
    id: "objectives",
    type: "objectives",
    phase: "Objectives",
    items: [
      "Declare multiple useState hooks with explicit TypeScript types",
      "Update independent state variables with separate setter functions",
      "Display multiple state values in JSX with proper typing",
      "Handle multiple click events that modify different state values",
    ],
  },
  {
    id: "step1",
    type: "question",
    phase: "Step 1 of 6",
    paal: "Import React and the useState hook from the 'react' package.",
    hint: "Use a single import statement with both default (React) and named (useState) imports.",
    example_code: "import React, { useEffect } from 'react';",
    think_prompt:
      "Which import statement gives us both React and the useState hook with TypeScript support?",
    mc_options: [
      "import React, { useState } from 'react';",
      "import { useState } from 'react';",
      "import React from 'react'; import { useState } from 'react';",
    ],
    mc_correct_option: "import React, { useState } from 'react';",
    mc_anchor:
      "Correct! React must be imported for JSX, and useState is a named export from 'react'.",
    why_this_matters:
      "Every React component needs React in scope, and useState is the hook that enables state management. TypeScript requires explicit imports for type safety.",
    answer_keywords: ["import", "React", "useState", "'react'"],
    seed_code: "",
    starter_code: "",
    feedback_correct:
      "Perfect! You've imported the essential tools for typed state management.",
    feedback_partial:
      "Close! Check if you're importing both React and useState correctly.",
    feedback_wrong:
      "Let's try again. Remember: React (default) and useState (named) come from 'react'.",
    expected: "The import statement should appear at the top of the file.",
    analog_example: "import React, { useState } from 'react';",
  },
  {
    id: "step2",
    type: "question",
    phase: "Step 2 of 6",
    paal: "Define a functional component named CounterDashboard that returns an empty div for now, with an explicit JSX.Element return type.",
    hint: "Start with 'const CounterDashboard = (): JSX.Element => { return <div></div>; };'",
    example_code:
      "const UserProfile = (): JSX.Element => { return <section></section>; };",
    think_prompt:
      "How do we define a functional component with TypeScript that returns JSX?",
    mc_options: [
      "const MyComponent = (): JSX.Element => { return <div>Hello</div>; };",
      "function MyComponent() { return <div>Hello</div>; }",
      "const MyComponent = () => <div>Hello</div>;",
    ],
    mc_correct_option:
      "const MyComponent = (): JSX.Element => { return <div>Hello</div>; };",
    mc_anchor:
      "An explicit JSX.Element return type documents what the component renders.",
    why_this_matters:
      "Components are the building blocks of React. TypeScript requires us to specify that this function returns JSX.Element.",
    answer_keywords: ["CounterDashboard", "JSX.Element", "return", "<div"],
    seed_code: "",
    starter_code: "",
    feedback_correct:
      "Great! You've created a properly typed React component skeleton.",
    feedback_partial:
      "Almost! Make sure you're using JSX.Element and returning JSX.",
    feedback_wrong:
      "Let's review: const ComponentName = (): JSX.Element => { return <div></div>; };",
    expected:
      "A component function with proper TypeScript typing that returns JSX.",
    analog_example:
      "const UserProfile = (): JSX.Element => { return <section></section>; };",
  },
  {
    id: "step3",
    type: "question",
    phase: "Step 3 of 6",
    paal: "Inside CounterDashboard, declare a state variable for a step counter initialized to 0. Use explicit number type with useState.",
    hint: "Use array destructuring: const [variableName, setterName] = useState<number>(initialValue);",
    example_code: "const [score, setScore] = useState<number>(100);",
    think_prompt:
      "How do we declare a state variable for a counter that starts at 0 with explicit number type?",
    mc_options: [
      "const [count, setCount] = useState<number>(0);",
      "const count = useState(0);",
      "const [count] = useState(0);",
    ],
    mc_correct_option: "const [count, setCount] = useState<number>(0);",
    mc_anchor:
      "The <number> generic ensures count is always a number, and setCount only accepts numbers.",
    why_this_matters:
      "Each useState call creates an independent state variable. TypeScript infers the type from the initial value, but explicit typing prevents future errors.",
    answer_keywords: ["useState<number>", "0", "const", "["],
    seed_code: "",
    starter_code: "",
    feedback_correct:
      "Excellent! You've created your first typed state variable.",
    feedback_partial:
      "Good start! Check if you included the type parameter and initial value.",
    feedback_wrong: "Remember: const [name, setName] = useState<number>(0);",
    expected:
      "A state variable with number type and corresponding setter function.",
    analog_example: "const [score, setScore] = useState<number>(100);",
  },
  {
    id: "step4",
    type: "question",
    phase: "Step 4 of 6",
    paal: "Add a second state variable to track whether a feature is active. Initialize it to false with boolean type.",
    hint: "Place this below your first useState declaration with a different variable name.",
    example_code:
      "const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true);",
    think_prompt:
      "How do we add a second state variable for a toggle (boolean) with TypeScript?",
    mc_options: [
      "const [isActive, setIsActive] = useState<boolean>(false);",
      "const isActive = useState(false);",
      "const [isActive] = useState<boolean>(false);",
    ],
    mc_correct_option:
      "const [isActive, setIsActive] = useState<boolean>(false);",
    mc_anchor:
      "Each useState is independent — you can have as many as needed, each with its own type.",
    why_this_matters:
      "Components often track multiple independent values. Each gets its own useState call, ensuring separation of concerns and type safety.",
    answer_keywords: ["useState<boolean>", "false"],
    seed_code: "",
    starter_code: "",
    feedback_correct:
      "Perfect! Now you're managing two independent typed state variables.",
    feedback_partial:
      "Almost! Make sure it's a boolean type with false initial value.",
    feedback_wrong:
      "Try: const [variableName, setVariableName] = useState<boolean>(false);",
    expected: "Two independent state variables declared in the component.",
    analog_example:
      "const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true);",
    deepDiveLabel:
      "Can a component have more than one useState — and does the order matter?",
    deepDive: {
      hook: "You've declared one `useState` so far. Now you're adding a second one right below it. It works — but it raises a question worth understanding: are these two lockers independent? Can they interfere with each other? Does React care which order they're declared in?\n\nThe answer to that last question is more important than it looks.",

      pain: "⚠️ **Lesson:** You refactor your component and move the `useState<boolean>` declaration above the `useState<number>` one. Everything still works. Then you wrap one of them in an `if` statement to skip it on certain renders. The app crashes with a cryptic error about hooks. The order seemed irrelevant — so why did wrapping it break everything?",

      mentalModel:
        "**Mental model:** Think of React as keeping a **numbered list of lockers** for every component — one slot per `useState` call, in the order they appear in the code.\n- First render: React reads your hooks top to bottom and assigns them slots — slot 1: `count`, slot 2: `isActive`.\n- Every re-render: React reads the same list in the same order and matches each hook call to its slot by position.\n- If you skip a hook on one render (inside an `if`, a loop, or after an early return) — the slot numbers shift. Slot 2 becomes slot 1. React hands the wrong value to the wrong variable. Everything breaks.\n- This is the **Rules of Hooks**: always call hooks at the top level of your component, never inside conditions, loops, or nested functions.\n- The two state variables are completely independent — changing `count` never affects `isActive` and vice versa. They just share the same ordered list.",

      discover:
        "**Pattern — multiple independent state variables:**\n```tsx\nconst [count, setCount] = useState<number>(0);\nconst [isActive, setIsActive] = useState<boolean>(false);\nconst [label, setLabel] = useState<string>('');\n```\n- each `useState` is its own independent locker — different type, different value, different setter\n- order must be stable across every render — React identifies each by position, not by name\n- group related state together at the top of the component, before any logic\n- names are for you and your teammates — React only sees slot 1, slot 2, slot 3",

      quickRules:
        "**Quick rules:**\n- ✅ declare all `useState` calls at the top of the component — before any conditions or early returns\n- ❌ never put `useState` inside an `if`, a loop, or a nested function\n- ❌ never put `useState` after an early `return` — React may never reach it\n- each `useState` is independent — updating one never touches the others\n- there is no limit on how many `useState` calls a component can have\n- if two values always change together, consider combining them into one `useState` with an object",

      watchOut:
        "👀 **Watch out:** The error React throws when you break hook order — *'Rendered more hooks than during the previous render'* — is one of the most confusing messages a noob encounters because it doesn't point at the `if` statement that caused it. It points at a hook further down. If you see it, the culprit is almost always a conditional or early return *above* a hook call, not the hook itself.",

      dryRun:
        "🔁 **Think:** Your component has three `useState` calls. On the first render all three run. On the second render, a condition is true so you skip the second one with an `if`. React now reads slot 1 from the first hook and slot 2 from the third hook. What value does the third hook's variable contain — its own value, or the second hook's value from the previous render? (Hint: React matches by position, not by name.)",

      build:
        "**Learning focus:** Declare multiple independent typed state variables in a single component — and understand why hook call order must stay consistent across every render.",
    },
  },
  {
    id: "step5",
    type: "question",
    phase: "Step 5 of 6",
    paal: "Create a function called handleIncrement that increases the step counter by 1 using its setter function.",
    hint: "Use arrow function syntax and the setter from your first useState.",
    example_code: "const increaseScore = () => setScore(prev => prev + 10);",
    think_prompt:
      "How do we write a handler that increments a counter state variable?",
    mc_options: [
      "const increment = () => setCount(prev => prev + 1);",
      "function increment() { count = count + 1; }",
      "const increment = () => count++;",
    ],
    mc_correct_option: "const increment = () => setCount(prev => prev + 1);",
    mc_anchor:
      "Using the functional update pattern (prev => prev + 1) ensures we always have the latest state value.",
    why_this_matters:
      "Event handlers update state using setter functions. TypeScript ensures we pass the correct type of value to each setter.",
    answer_keywords: ["const", "=>", "set", "prev", "+", "1"],
    seed_code: "",
    starter_code: "",
    feedback_correct:
      "Great! Your handler will safely update the counter state.",
    feedback_partial:
      "Close! Make sure you're using the setter function with prev => prev + 1.",
    feedback_wrong:
      "Try: const handleIncrement = () => setCounter(prev => prev + 1);",
    expected: "An arrow function that updates the counter state.",
    analog_example: "const doubleScore = () => setScore(prev => prev * 2 );",
  },
  {
    id: "step6",
    type: "question",
    phase: "Step 6 of 6",
    paal: "In the returned JSX, display both state values and add a button that calls handleIncrement when clicked. Convert the boolean to string for display.",
    hint: "Use paragraph tags for each value and a button with onClick attribute.",
    example_code:
      "<div><p>Score: {score}</p><p>Logged in: {isLoggedIn.toString()}</p><button onClick={increaseScore}>Add Points</button></div>",
    think_prompt:
      "How do we display both state values and connect buttons to their handlers?",
    mc_options: [
      "<div><p>Steps: {count}</p><p>Active: {isActive.toString()}</p><button onClick={handleIncrement}>Add Step</button></div>",
      "<div>{count} {isActive} <button>Add Step</button></div>",
      "<div><p>{count}</p><p>{isActive}</p><button onClick={() => {}}>Add Step</button></div>",
    ],
    mc_correct_option:
      "<div><p>Steps: {count}</p><p>Active: {isActive.toString()}</p><button onClick={handleIncrement}>Add Step</button></div>",
    mc_anchor:
      "JSX expressions {} render state values, and onClick connects handlers to user interactions.",
    why_this_matters:
      "JSX connects state and handlers to the UI. TypeScript ensures values are properly rendered and event handlers are correctly typed.",
    answer_keywords: [
      "{count}",
      "{isActive",
      ".toString()",
      "onClick={",
      "handleIncrement",
    ],
    seed_code: "",
    starter_code: "",
    feedback_correct:
      "Excellent! Your component now manages multiple state variables with full TypeScript safety.",
    feedback_partial:
      "Almost there! Check that you're displaying both values and the button has onClick.",
    feedback_wrong:
      "Try: <div><p>Steps: {counter}</p><p>Active: {isActive.toString()}</p><button onClick={handleIncrement}>Add Step</button></div>",
    expected: "A complete component displaying state and responding to clicks.",
    analog_example:
      "<div><p>Score: {score}</p><p>Logged in: {isLoggedIn.toString()}</p><button onClick={increaseScore}>Add Points</button></div>",
    deepDiveLabel:
      "Why can't JSX just display a boolean the way it displays a number or string?",
    deepDive: {
      hook: "You render `{count}` and the number shows up perfectly. You render `{isActive}` right below it — and nothing appears. No error. No crash. Just silence. The value is `false`, it's definitely there, React isn't complaining. So where did it go?",

      pain: "⚠️ **Lesson:** `{isActive}` renders nothing when the value is `false` — and also nothing when it's `true`. JSX silently swallows booleans. Why does React display numbers and strings but refuse to show `true` or `false`?",

      mentalModel:
        "**Mental model:** Think of JSX as a **selective printer** — it only prints things that have a natural text representation.\n- Numbers have one: `42` prints as `'42'`.\n- Strings already are text: `'hello'` prints as `'hello'`.\n- Booleans don't have a display form in React's eyes — `true` and `false` are logic values, not display values. React deliberately swallows them because they're used constantly for conditional rendering (`{isActive && <div>}</div>`) and printing them would break every conditional in every component.\n- To display a boolean as text you must convert it explicitly — tell React: *I want the word, not the logic value*.\n- Three ways to do it:\n  - `{isActive.toString()}` → `'true'` or `'false'`\n  - `{String(isActive)}` → same result, slightly more defensive\n  - `{isActive ? 'Yes' : 'No'}` → human-friendly label, better for real UIs",

      discover:
        "**Pattern — displaying booleans:**\n```tsx\n<p>Count: {count}</p>\n\n{/* ❌ renders nothing */}\n<p>Active: {isActive}</p>\n\n{/* ✅ renders 'true' or 'false' */}\n<p>Active: {isActive.toString()}</p>\n\n{/* ✅ human readable — better for users */}\n<p>Active: {isActive ? 'Yes' : 'No'}</p>\n```\n- `{count}` → works — number has a natural string representation\n- `{isActive}` → silent — React swallows booleans intentionally\n- `.toString()` → correct for debug displays and dev tools\n- ternary → correct for user-facing UI — users shouldn't see `true`/`false`",

      quickRules:
        "**Quick rules:**\n- ✅ `{isActive.toString()}` — explicit conversion, shows 'true' or 'false'\n- ✅ `{String(isActive)}` — same result, works even if value is null or undefined\n- ✅ `{isActive ? 'Yes' : 'No'}` — human readable, prefer this in real UI\n- ❌ `{isActive}` — silent, renders nothing, no error\n- ❌ `{isActive + ''}` — string concatenation works but is considered bad practice\n- same silent treatment applies to `null` and `undefined` — JSX swallows those too",

      watchOut:
        "👀 **Watch out:** `{isActive && <SomeComponent />}` is the most common boolean JSX pattern — show a component only when true. But if `isActive` were a *number* instead of a boolean — say `0` — React would render `0` on screen instead of nothing, because `0` is not a boolean and JSX does print it. This is a real gotcha when filtering arrays: `{items.length && <List />}` renders `0` when the array is empty. Always use a true boolean: `{items.length > 0 && <List />}`.",

      dryRun:
        "🔁 **Think:** You have `{isActive && 'Feature is on'}`. When `isActive` is `true` this renders 'Feature is on'. When `isActive` is `false` — does it render 'false', render nothing, or crash? And if you changed `isActive` to a number — say `const count = 0` — and wrote `{count && 'Has items'}`, what renders when count is 0? (Hint: React treats booleans and numbers very differently in JSX.)",

      build:
        "**Learning focus:** Understand why JSX silently swallows boolean values and convert them explicitly using `.toString()` or a ternary — choosing the form that fits whether you're debugging or building user-facing UI.",
    },
  },
];

const sideItems = [
  {
    label: "Lesson",
    id: "intro",
  },
  {
    label: "Objectives",
    id: "objectives",
  },
  {
    label: "Step 1",
    id: "step1",
  },
  {
    label: "Step 2",
    id: "step2",
  },
  {
    label: "Step 3",
    id: "step3",
  },
  {
    label: "Step 4",
    id: "step4",
  },
  {
    label: "Step 5",
    id: "step5",
  },
  {
    label: "Step 6",
    id: "step6",
  },
];

export default createINPACTEngine({
  NODES,
  sideItems,
  lessonNum: 4,
  title: "Multiple State Variables (TypeScript)",
  shortName: "TS — MULTIPLE STATE VARIABLES",
});
