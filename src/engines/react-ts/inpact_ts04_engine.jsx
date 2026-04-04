/**
 * 🔒 LOCKED — React · TS lesson 4 — Multiple State Variables (TypeScript).
 * Do not change steps, copy, or evaluation without explicit product/content sign-off.
 * Generated mirror: content/generated/react-ts/004_multiple-state-variables_lesson.json
 */
import createINPACTEngine from "../inpact_engine_shared";

const NODES = [
  {
    "id": "intro",
    "type": "reveal",
    "phase": "Lesson",
    "content": {
      "tag": "LESSON #4 (TypeScript)",
      "title": "Multiple State Variables — Typed",
      "body": "In real applications, components rarely track just one piece of state. You'll often manage multiple independent values that change over time. TypeScript ensures each state variable has a clear type, preventing accidental mixing of different data types.",
      "usecase": "Think of a user profile form with multiple fields, a shopping cart with items and totals, or a game with score, lives, and level — all requiring separate but coordinated state management."
    }
  },
  {
    "id": "objectives",
    "type": "objectives",
    "phase": "Objectives",
    "items": [
      "Declare multiple useState hooks with explicit TypeScript types",
      "Update independent state variables with separate setter functions",
      "Display multiple state values in JSX with proper typing",
      "Handle multiple click events that modify different state values"
    ]
  },
  {
    "id": "step1",
    "type": "question",
    "phase": "Step 1 of 6",
    "paal": "Import React and the useState hook from the 'react' package.",
    "hint": "Use a single import statement with both default (React) and named (useState) imports.",
    "example_code": "import React, { useEffect } from 'react';",
    "think_prompt": "Which import statement gives us both React and the useState hook with TypeScript support?",
    "mc_options": [
      "import React, { useState } from 'react';",
      "import { useState } from 'react';",
      "import React from 'react'; import { useState } from 'react';"
    ],
    "mc_correct_option": "import React, { useState } from 'react';",
    "mc_anchor": "Correct! React must be imported for JSX, and useState is a named export from 'react'.",
    "why_this_matters": "Every React component needs React in scope, and useState is the hook that enables state management. TypeScript requires explicit imports for type safety.",
    "answer_keywords": [
      "import",
      "React",
      "useState",
      "'react'"
    ],
    "seed_code": "",
    "starter_code": "",
    "feedback_correct": "Perfect! You've imported the essential tools for typed state management.",
    "feedback_partial": "Close! Check if you're importing both React and useState correctly.",
    "feedback_wrong": "Let's try again. Remember: React (default) and useState (named) come from 'react'.",
    "expected": "The import statement should appear at the top of the file."
  },
  {
    "id": "step2",
    "type": "question",
    "phase": "Step 2 of 6",
    "paal": "Define a functional component named CounterDashboard that returns an empty div for now, with an explicit JSX.Element return type.",
    "hint": "Start with 'const CounterDashboard = (): JSX.Element => { return <div></div>; };'",
    "example_code": "const UserProfile = (): JSX.Element => { return <section></section>; };",
    "think_prompt": "How do we define a functional component with TypeScript that returns JSX?",
    "mc_options": [
      "const MyComponent = (): JSX.Element => { return <div>Hello</div>; };",
      "function MyComponent() { return <div>Hello</div>; }",
      "const MyComponent = () => <div>Hello</div>;"
    ],
    "mc_correct_option": "const MyComponent = (): JSX.Element => { return <div>Hello</div>; };",
    "mc_anchor": "An explicit JSX.Element return type documents what the component renders.",
    "why_this_matters": "Components are the building blocks of React. TypeScript requires us to specify that this function returns JSX.Element.",
    "answer_keywords": [
      "CounterDashboard",
      "JSX.Element",
      "return",
      "<div"
    ],
    "seed_code": "",
    "starter_code": "",
    "feedback_correct": "Great! You've created a properly typed React component skeleton.",
    "feedback_partial": "Almost! Make sure you're using JSX.Element and returning JSX.",
    "feedback_wrong": "Let's review: const ComponentName = (): JSX.Element => { return <div></div>; };",
    "expected": "A component function with proper TypeScript typing that returns JSX."
  },
  {
    "id": "step3",
    "type": "question",
    "phase": "Step 3 of 6",
    "paal": "Inside CounterDashboard, declare a state variable for a step counter initialized to 0. Use explicit number type with useState.",
    "hint": "Use array destructuring: const [variableName, setterName] = useState<number>(initialValue);",
    "example_code": "const [score, setScore] = useState<number>(100);",
    "think_prompt": "How do we declare a state variable for a counter that starts at 0 with explicit number type?",
    "mc_options": [
      "const [count, setCount] = useState<number>(0);",
      "const count = useState(0);",
      "const [count] = useState(0);"
    ],
    "mc_correct_option": "const [count, setCount] = useState<number>(0);",
    "mc_anchor": "The <number> generic ensures count is always a number, and setCount only accepts numbers.",
    "why_this_matters": "Each useState call creates an independent state variable. TypeScript infers the type from the initial value, but explicit typing prevents future errors.",
    "answer_keywords": [
      "useState<number>",
      "0",
      "const",
      "["
    ],
    "seed_code": "",
    "starter_code": "",
    "feedback_correct": "Excellent! You've created your first typed state variable.",
    "feedback_partial": "Good start! Check if you included the type parameter and initial value.",
    "feedback_wrong": "Remember: const [name, setName] = useState<number>(0);",
    "expected": "A state variable with number type and corresponding setter function."
  },
  {
    "id": "step4",
    "type": "question",
    "phase": "Step 4 of 6",
    "paal": "Add a second state variable to track whether a feature is active. Initialize it to false with boolean type.",
    "hint": "Place this below your first useState declaration with a different variable name.",
    "example_code": "const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true);",
    "think_prompt": "How do we add a second state variable for a toggle (boolean) with TypeScript?",
    "mc_options": [
      "const [isActive, setIsActive] = useState<boolean>(false);",
      "const isActive = useState(false);",
      "const [isActive] = useState<boolean>(false);"
    ],
    "mc_correct_option": "const [isActive, setIsActive] = useState<boolean>(false);",
    "mc_anchor": "Each useState is independent — you can have as many as needed, each with its own type.",
    "why_this_matters": "Components often track multiple independent values. Each gets its own useState call, ensuring separation of concerns and type safety.",
    "answer_keywords": [
      "useState<boolean>",
      "false"
    ],
    "seed_code": "",
    "starter_code": "",
    "feedback_correct": "Perfect! Now you're managing two independent typed state variables.",
    "feedback_partial": "Almost! Make sure it's a boolean type with false initial value.",
    "feedback_wrong": "Try: const [variableName, setVariableName] = useState<boolean>(false);",
    "expected": "Two independent state variables declared in the component."
  },
  {
    "id": "step5",
    "type": "question",
    "phase": "Step 5 of 6",
    "paal": "Create a function called handleIncrement that increases the step counter by 1 using its setter function.",
    "hint": "Use arrow function syntax and the setter from your first useState.",
    "example_code": "const increaseScore = () => setScore(prev => prev + 10);",
    "think_prompt": "How do we write a handler that increments a counter state variable?",
    "mc_options": [
      "const increment = () => setCount(prev => prev + 1);",
      "function increment() { count = count + 1; }",
      "const increment = () => count++;"
    ],
    "mc_correct_option": "const increment = () => setCount(prev => prev + 1);",
    "mc_anchor": "Using the functional update pattern (prev => prev + 1) ensures we always have the latest state value.",
    "why_this_matters": "Event handlers update state using setter functions. TypeScript ensures we pass the correct type of value to each setter.",
    "answer_keywords": [
      "const",
      "=>",
      "set",
      "prev",
      "+",
      "1"
    ],
    "seed_code": "",
    "starter_code": "",
    "feedback_correct": "Great! Your handler will safely update the counter state.",
    "feedback_partial": "Close! Make sure you're using the setter function with prev => prev + 1.",
    "feedback_wrong": "Try: const handleIncrement = () => setCounter(prev => prev + 1);",
    "expected": "An arrow function that updates the counter state."
  },
  {
    "id": "step6",
    "type": "question",
    "phase": "Step 6 of 6",
    "paal": "In the returned JSX, display both state values and add a button that calls handleIncrement when clicked. Convert the boolean to string for display.",
    "hint": "Use paragraph tags for each value and a button with onClick attribute.",
    "example_code": "<div><p>Score: {score}</p><p>Logged in: {isLoggedIn.toString()}</p><button onClick={increaseScore}>Add Points</button></div>",
    "think_prompt": "How do we display both state values and connect buttons to their handlers?",
    "mc_options": [
      "<div><p>Steps: {count}</p><p>Active: {isActive.toString()}</p><button onClick={handleIncrement}>Add Step</button></div>",
      "<div>{count} {isActive} <button>Add Step</button></div>",
      "<div><p>{count}</p><p>{isActive}</p><button onClick={() => {}}>Add Step</button></div>"
    ],
    "mc_correct_option": "<div><p>Steps: {count}</p><p>Active: {isActive.toString()}</p><button onClick={handleIncrement}>Add Step</button></div>",
    "mc_anchor": "JSX expressions {} render state values, and onClick connects handlers to user interactions.",
    "why_this_matters": "JSX connects state and handlers to the UI. TypeScript ensures values are properly rendered and event handlers are correctly typed.",
    "answer_keywords": [
      "{count}",
      "{isActive",
      ".toString()",
      "onClick={",
      "handleIncrement"
    ],
    "seed_code": "",
    "starter_code": "",
    "feedback_correct": "Excellent! Your component now manages multiple state variables with full TypeScript safety.",
    "feedback_partial": "Almost there! Check that you're displaying both values and the button has onClick.",
    "feedback_wrong": "Try: <div><p>Steps: {counter}</p><p>Active: {isActive.toString()}</p><button onClick={handleIncrement}>Add Step</button></div>",
    "expected": "A complete component displaying state and responding to clicks."
  }
];

const sideItems = [
  {
    "label": "Lesson",
    "id": "intro"
  },
  {
    "label": "Objectives",
    "id": "objectives"
  },
  {
    "label": "Step 1",
    "id": "step1"
  },
  {
    "label": "Step 2",
    "id": "step2"
  },
  {
    "label": "Step 3",
    "id": "step3"
  },
  {
    "label": "Step 4",
    "id": "step4"
  },
  {
    "label": "Step 5",
    "id": "step5"
  },
  {
    "label": "Step 6",
    "id": "step6"
  }
];

export default createINPACTEngine({ NODES, sideItems, lessonNum: 4, title: "Multiple State Variables (TypeScript)", shortName: "TS — MULTIPLE STATE VARIABLES" });
