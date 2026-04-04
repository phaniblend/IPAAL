/**
 * 🔒 LOCKED — React · TS lesson 7 — useEffect & Side Effects (TypeScript).
 * Do not change steps, copy, or evaluation without explicit product/content sign-off.
 * Generated mirror: content/generated/react-ts/007_useeffect-side-effects_lesson.json
 */
import createINPACTEngine from "../inpact_engine_shared";

const NODES = [
  {
    "id": "intro",
    "type": "reveal",
    "phase": "Lesson",
    "content": {
      "tag": "LESSON #7 (TypeScript)",
      "title": "useEffect & Side Effects — Typed",
      "body": "In React, components often need to perform side effects—actions that reach outside the component's pure rendering logic, like fetching data, subscribing to events, or manually updating the DOM. The useEffect hook is React's primary tool for managing these side effects in a declarative, type-safe way with TypeScript.",
      "usecase": "You'll build a counter that logs to the console and updates the document title whenever the count changes, demonstrating how useEffect runs after render and how to properly type its dependencies."
    }
  },
  {
    "id": "objectives",
    "type": "objectives",
    "phase": "Objectives",
    "items": [
      "Understand when and why to use the useEffect hook",
      "Write typed useEffect calls with explicit dependency arrays",
      "Clean up side effects to prevent memory leaks"
    ]
  },
  {
    "id": "step1",
    "type": "question",
    "phase": "Step 1 of 7",
    "paal": "Import the useState and useEffect hooks from React.",
    "hint": "Use curly braces to import multiple named exports from 'react'.",
    "example_code": "import { useRef, useMemo } from 'react'",
    "think_prompt": "Which import statement gives us access to both useState and useEffect hooks?",
    "mc_options": [
      "import React from 'react'",
      "import { useState, useEffect } from 'react'",
      "import useState, useEffect from 'react'"
    ],
    "mc_correct_option": "import { useState, useEffect } from 'react'",
    "mc_anchor": "We need named imports for hooks because they're exported individually, not as a default export.",
    "why_this_matters": "React provides built-in hooks like useState and useEffect as named exports from the 'react' package. Importing them explicitly tells TypeScript exactly what functionality we're using.",
    "answer_keywords": [
      "import",
      "{",
      "useState",
      "useEffect",
      "}",
      "from",
      "'react'"
    ],
    "seed_code": "",
    "starter_code": "",
    "feedback_correct": "Perfect! You've imported the essential hooks we'll use throughout this lesson.",
    "feedback_partial": "Close! Remember to import both hooks using the named import syntax.",
    "feedback_wrong": "Let's try again. We need to import specific hooks from React using curly braces.",
    "expected": "Both hooks are available for use in the component."
  },
  {
    "id": "step2",
    "type": "question",
    "phase": "Step 2 of 7",
    "paal": "Create a function component named EffectDemo with proper TypeScript typing that returns an empty fragment for now.",
    "hint": "Use an explicit `: JSX.Element` return type and return <> </> as initial JSX.",
    "example_code": "const DataFetcher = (): JSX.Element => { return <div>Loading...</div> }",
    "think_prompt": "What's the correct TypeScript type for a React function component that takes no props?",
    "mc_options": [
      "const MyComponent = (): JSX.Element => { ... }",
      "const MyComponent: Function = () => { ... }",
      "const MyComponent = () => { ... }"
    ],
    "mc_correct_option": "const MyComponent = (): JSX.Element => { ... }",
    "mc_anchor": "Modern React + TypeScript favors an explicit JSX.Element return type on the function instead of JSX.Element.",
    "why_this_matters": "Every React component needs a function definition that returns JSX. TypeScript requires us to explicitly declare the component's type, which helps catch errors early.",
    "answer_keywords": [
      "const",
      "EffectDemo",
      ":",
      "JSX.Element",
      "=",
      "()",
      "=>",
      "{",
      "return",
      "<>",
      "</>",
      "}"
    ],
    "seed_code": "",
    "starter_code": "",
    "feedback_correct": "Great! You've created a properly typed React component foundation.",
    "feedback_partial": "Almost there! Make sure to include the TypeScript type annotation.",
    "feedback_wrong": "Let's review: We need a const with JSX.Element type that returns JSX.",
    "expected": "A typed React component skeleton that can be expanded."
  },
  {
    "id": "step3",
    "type": "question",
    "phase": "Step 3 of 7",
    "paal": "Inside the component, declare a state variable for a counter with an explicit number type, initialized to 0.",
    "hint": "Use array destructuring with useState, and include the type parameter <number>.",
    "example_code": "const [value, setValue] = useState<string>('initial')",
    "think_prompt": "If we want a counter that starts at 0 and only holds numbers, which useState call is most appropriate?",
    "mc_options": [
      "const [count] = useState(0)",
      "const [count, setCount] = useState<number>(0)",
      "const count = useState(0)"
    ],
    "mc_correct_option": "const [count, setCount] = useState<number>(0)",
    "mc_anchor": "The useState hook returns a tuple: the current state and a setter function. TypeScript can infer the type from the initial value, but explicit typing improves documentation.",
    "why_this_matters": "State drives our component's behavior and triggers side effects. TypeScript infers types from initial values, but we can be explicit for clarity.",
    "answer_keywords": [
      "useState",
      "<number>",
      "(",
      "0",
      ")",
      "[",
      "count",
      "setCount",
      "]"
    ],
    "seed_code": "",
    "starter_code": "",
    "feedback_correct": "Excellent! You've created typed state that will drive our side effects.",
    "feedback_partial": "Good start! Remember to include the TypeScript type parameter for clarity.",
    "feedback_wrong": "Let's try again. We need useState with explicit typing and proper destructuring.",
    "expected": "A typed count state variable and its setter are available."
  },
  {
    "id": "step4",
    "type": "question",
    "phase": "Step 4 of 7",
    "paal": "Return JSX that displays the current count value and includes a button labeled 'Increment'.",
    "hint": "Use a div container, a paragraph showing the count, and a button element.",
    "example_code": "<div><p>Score: {score}</p><button>Add Point</button></div>",
    "think_prompt": "Which JSX structure would display the count value and provide a way to change it?",
    "mc_options": [
      "<div>{count}</div>",
      "<div><p>Count: {count}</p><button>Increment</button></div>",
      "<p>Count is {count}</p>"
    ],
    "mc_correct_option": "<div><p>Count: {count}</p><button>Increment</button></div>",
    "mc_anchor": "Good UI shows the current state and provides controls to update it. The button will later get an event handler.",
    "why_this_matters": "Users need to see and interact with the counter. JSX provides the visual interface that connects to our state.",
    "answer_keywords": [
      "<div>",
      "{count}",
      "<button>",
      "Increment",
      "</button>",
      "</div>"
    ],
    "seed_code": "",
    "starter_code": "",
    "feedback_correct": "Perfect! The UI now shows the state and provides user interaction.",
    "feedback_partial": "Almost! Make sure to include both the count display and the button.",
    "feedback_wrong": "Let's review: We need JSX that displays the count and has an increment button.",
    "expected": "UI displays count value and has an increment button."
  },
  {
    "id": "step5",
    "type": "question",
    "phase": "Step 5 of 7",
    "paal": "Define a function that increments the count by 1 when called.",
    "hint": "Create a function that calls the state setter with count + 1.",
    "example_code": "const decrement = () => { setValue(prev => prev - 1) }",
    "think_prompt": "What's the proper TypeScript type for a button click handler that doesn't use the event object?",
    "mc_options": [
      "const handleClick = () => { setCount(count + 1) }",
      "const handleClick = (event: any) => { setCount(count + 1) }",
      "const handleClick = (event: React.MouseEvent) => { setCount(count + 1) }"
    ],
    "mc_correct_option": "const handleClick = () => { setCount(count + 1) }",
    "mc_anchor": "When we don't need the event object, we can omit the parameter entirely. The setter function updates state based on the current count.",
    "why_this_matters": "Event handlers connect user interactions to state updates. TypeScript ensures our handler receives the correct event type.",
    "answer_keywords": [
      "const",
      "=",
      "()",
      "=>",
      "{",
      "setCount",
      "count",
      "+",
      "1",
      "}"
    ],
    "seed_code": "",
    "starter_code": "",
    "feedback_correct": "Great! You've created a typed event handler that updates state.",
    "feedback_partial": "Close! Make sure the function actually updates the state by incrementing.",
    "feedback_wrong": "Let's try again. We need a function that calls the setter with count + 1.",
    "expected": "A handler function that updates the count state."
  },
  {
    "id": "step6",
    "type": "question",
    "phase": "Step 6 of 7",
    "paal": "Connect the increment handler to the button's click event.",
    "hint": "Add an onClick attribute to the button element.",
    "example_code": "<button onClick={submitHandler}>Submit</button>",
    "think_prompt": "How do we attach the click handler to the button in JSX?",
    "mc_options": [
      "<button onClick={handleClick}>",
      "<button click={handleClick}>",
      "<button onPress={handleClick}>"
    ],
    "mc_correct_option": "<button onClick={handleClick}>",
    "mc_anchor": "onClick is the standard React prop for handling click events. We pass the function reference, not call it immediately.",
    "why_this_matters": "The button needs to know which function to call when clicked. JSX event attributes connect handlers to DOM events.",
    "answer_keywords": [
      "onClick",
      "=",
      "{",
      "}",
      ">"
    ],
    "seed_code": "",
    "starter_code": "",
    "feedback_correct": "Perfect! The button now responds to clicks and updates state.",
    "feedback_partial": "Almost! Remember to use the correct event attribute name.",
    "feedback_wrong": "Let's review: We need to add an onClick handler to the button.",
    "expected": "Button triggers the increment function when clicked."
  },
  {
    "id": "step7",
    "type": "question",
    "phase": "Step 7 of 7",
    "paal": "Add a useEffect that logs 'Count changed' to the console and updates the document title to show the current count, running only when count changes.",
    "hint": "useEffect takes a function and a dependency array. Include count in the array.",
    "example_code": "useEffect(() => { console.log('User updated:', user); localStorage.setItem('user', user.name); }, [user])",
    "think_prompt": "Which useEffect call logs to console and updates document.title whenever count changes?",
    "mc_options": [
      "useEffect(() => { console.log('Count changed'); document.title = `Count: ${count}` })",
      "useEffect(() => { console.log('Count changed'); document.title = `Count: ${count}` }, [])",
      "useEffect(() => { console.log('Count changed'); document.title = `Count: ${count}` }, [count])"
    ],
    "mc_correct_option": "useEffect(() => { console.log('Count changed'); document.title = `Count: ${count}` }, [count])",
    "mc_anchor": "The dependency array [count] tells React to re-run the effect only when count changes. Without it, it runs after every render; with empty array [], it runs only once.",
    "why_this_matters": "Side effects like logging, API calls, or DOM updates should happen after render, not during. useEffect ensures they run at the right time and can be cleaned up.",
    "answer_keywords": [
      "useEffect",
      "(",
      "()",
      "=>",
      "{",
      "console.log",
      "document.title",
      "}",
      ",",
      "[",
      "count",
      "]",
      ")"
    ],
    "seed_code": "",
    "starter_code": "",
    "feedback_correct": "Excellent! You've successfully implemented typed side effects that respond to state changes.",
    "feedback_partial": "Good! Remember to include the dependency array so it only runs when count changes.",
    "feedback_wrong": "Let's review: useEffect needs a function and dependency array to control when it runs.",
    "expected": "Side effects run whenever count changes."
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
  },
  {
    "label": "Step 7",
    "id": "step7"
  }
];

export default createINPACTEngine({ NODES, sideItems, lessonNum: 7, title: "useEffect & Side Effects (TypeScript)", shortName: "TS — USEEFFECT & SIDE EFFECTS" });
