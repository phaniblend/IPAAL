/**
 * 🔒 LOCKED — React · TS lesson 10 — Reusable Button (TypeScript).
 * Do not change steps, copy, or evaluation without explicit product/content sign-off.
 * Generated mirror: content/generated/react-ts/010_reusable-button_lesson.json
 */
import createINPACTEngine from "../inpact_engine_shared";

const NODES = [
  {
    "id": "intro",
    "type": "reveal",
    "phase": "Lesson",
    "content": {
      "tag": "LESSON #10 (TypeScript)",
      "title": "Reusable Button — Typed",
      "body": "In this lesson, you'll build a reusable button component with TypeScript. You'll define props with explicit types, handle click events, and manage internal state—all while ensuring type safety.",
      "usecase": "Reusable buttons are foundational in React apps. Adding TypeScript ensures your component is used correctly, catches bugs early, and provides better developer experience through autocomplete and documentation."
    }
  },
  {
    "id": "objectives",
    "type": "objectives",
    "phase": "Objectives",
    "items": [
      "Define a reusable component with typed props",
      "Handle click events with proper TypeScript typing",
      "Manage internal component state with useState",
      "Conditionally apply CSS classes based on state"
    ]
  },
  {
    "id": "step1",
    "type": "question",
    "phase": "Step 1 of 7",
    "paal": "Import React and the useState hook from the 'react' package.",
    "hint": "Use a single import statement with both default and named imports.",
    "example_code": "import React, { useEffect } from 'react';",
    "think_prompt": "Which import statement gives you access to both React and the useState hook?",
    "mc_options": [
      "import React, { useState } from 'react';",
      "import { React, useState } from 'react';",
      "import React from 'react'; import useState from 'react';"
    ],
    "mc_correct_option": "import React, { useState } from 'react';",
    "mc_anchor": "React must be imported as default, while hooks like useState are named exports.",
    "why_this_matters": "React provides the core library for building components, and useState is the hook that lets you add state to functional components.",
    "answer_keywords": [
      "import",
      "React",
      "useState",
      "'react'"
    ],
    "seed_code": "",
    "starter_code": "",
    "feedback_correct": "Great! You've imported the necessary dependencies.",
    "feedback_partial": "Check if both React and useState are properly imported.",
    "feedback_wrong": "Remember: React is the default export, useState is a named export.",
    "expected": "The imports are correctly declared at the top of the file."
  },
  {
    "id": "step2",
    "type": "question",
    "phase": "Step 2 of 7",
    "paal": "Declare a **TypeScript interface** at **module level** (below imports, before any component) named **`ButtonProps`**. Add **`label: string`** and an optional **`onClick`** property (e.g. `onClick?: () => void`).",
    "hint": "Optional props use `?` on the property name.",
    "example_code": "interface CardProps { title: string; subtitle?: string; }",
    "think_prompt": "Where should a props interface live in a typical React + TypeScript file?",
    "mc_options": [
      "At module level, before the component",
      "Inside the component function",
      "Inside the return statement"
    ],
    "mc_correct_option": "At module level, before the component",
    "mc_anchor": "Interfaces for props belong at module scope—after imports, before the component definition.",
    "why_this_matters": "Module-level types document the contract before any component body, which matches how larger codebases organize shared shapes.",
    "answer_keywords": [
      "interface",
      "label",
      "string",
      "onClick",
      "?"
    ],
    "seed_code": "",
    "starter_code": "",
    "feedback_correct": "Perfect! Your props interface is in place.",
    "feedback_partial": "Declare an **`interface`** with **`label: string`** and an optional **`onClick`** (mark optional with `?`).",
    "feedback_wrong": "At module scope, add **`interface ButtonProps`** (or equivalent) with **`label`** and **`onClick?`**.",
    "expected": "A module-level props interface with label and optional onClick."
  },
  {
    "id": "step3",
    "type": "question",
    "phase": "Step 3 of 7",
    "paal": "Define a functional component **`Button`** with props typed as **`ButtonProps`**. Destructure **`label`** and **`onClick`** in the parameter list. **`return null`** from the component body.",
    "hint": "`const Button = ({ label, onClick }: ButtonProps) => { return null; };`",
    "example_code": "const Card = ({ title }: CardProps) => {\n  return null;\n};",
    "think_prompt": "What's a valid way to type the props parameter for a functional component?",
    "mc_options": [
      "const Button = ({ label, onClick }: ButtonProps) => { ... }",
      "const Button = (props: ButtonProps) => { ... }",
      "Both are valid"
    ],
    "mc_correct_option": "Both are valid",
    "mc_anchor": "Destructuring in the parameter list is common when you need named props; a single `props` parameter is fine too.",
    "why_this_matters": "The component shell connects your interface to a real function—state and JSX come in later steps.",
    "answer_keywords": [
      "Button",
      "ButtonProps",
      "label",
      "onClick",
      "=>",
      "return",
      "null"
    ],
    "seed_code": "",
    "starter_code": "",
    "feedback_correct": "Nice—your typed `Button` shell is ready for state and JSX.",
    "feedback_partial": "Define **`Button`** with **`ButtonProps`** and **`return null`**; add **`useState`** and the **`<button>`** in the next steps.",
    "feedback_wrong": "Define **`const Button = ({ label, onClick }: ButtonProps) => { return null; };`** (or equivalent with a single **`props`** parameter).",
    "expected": "A Button component typed with ButtonProps and a placeholder return."
  },
  {
    "id": "step4",
    "type": "question",
    "phase": "Step 4 of 7",
    "paal": "Inside the Button component, declare a state variable to track how many times the button has been clicked. Initialize it to 0.",
    "hint": "Use useState with an explicit generic type or rely on inference.",
    "example_code": "const [score, setScore] = useState<number>(100);",
    "think_prompt": "What TypeScript type should you give to a state variable tracking click count?",
    "mc_options": [
      "const [count, setCount] = useState(0); // inferred as number",
      "const [count, setCount] = useState<number>(0); // explicit number",
      "Both work; explicit typing is optional but good practice"
    ],
    "mc_correct_option": "Both work; explicit typing is optional but good practice",
    "mc_anchor": "useState can infer types from initial values, but explicit typing improves clarity and catches mismatches early.",
    "why_this_matters": "State allows the button to track interactions (like clicks) and update its appearance accordingly.",
    "answer_keywords": [
      "useState",
      "0",
      "const",
      "set"
    ],
    "seed_code": "",
    "starter_code": "",
    "feedback_correct": "Excellent! The button can now track clicks.",
    "feedback_partial": "Check the initial value and destructuring syntax.",
    "feedback_wrong": "Remember: useState returns an array with [state, setState].",
    "expected": "A state variable and setter are declared inside the component."
  },
  {
    "id": "step5",
    "type": "question",
    "phase": "Step 5 of 7",
    "paal": "Return a **`<button>`** element. Display text that combines the **`label`** prop and the click **`count`** (for example: `Click me - 0`).",
    "hint": "Use curly braces to embed the count variable in the button text.",
    "example_code": "<div>Score: {score}</div>",
    "think_prompt": "How do you embed the click count in the button label?",
    "mc_options": [
      "Wrap the expression in curly braces: {count}",
      "Use template literals inside JSX",
      "Both are valid; choose based on readability"
    ],
    "mc_correct_option": "Both are valid; choose based on readability",
    "mc_anchor": "JSX allows any JavaScript expression inside curly braces, including template literals and variables.",
    "why_this_matters": "The JSX defines what users see—a clickable button with a dynamic label.",
    "answer_keywords": [
      "<button",
      ">",
      "{",
      "label",
      "count",
      "}</button>"
    ],
    "seed_code": "",
    "starter_code": "",
    "feedback_correct": "Great! The button renders with dynamic content.",
    "feedback_partial": "Make sure both the label and count appear in the button text.",
    "feedback_wrong": "The button should show something like `${label} - ${count}`.",
    "expected": "The component returns a button element with dynamic text."
  },
  {
    "id": "step6",
    "type": "question",
    "phase": "Step 6 of 7",
    "paal": "Define a **`const`** click-handler function inside **`Button`**. It should increment the click **`count`** and **invoke** the **`onClick`** prop when it is defined.",
    "hint": "The handler should accept a mouse event and update state using the setter.",
    "example_code": "const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => { setClicks(prev => prev + 1); };",
    "think_prompt": "What's the proper TypeScript type for a React button click handler?",
    "mc_options": [
      "(event: React.MouseEvent<HTMLButtonElement>) => void",
      "(e: any) => void",
      "Function"
    ],
    "mc_correct_option": "(event: React.MouseEvent<HTMLButtonElement>) => void",
    "mc_anchor": "Typing event handlers precisely gives you better autocomplete and prevents runtime errors.",
    "why_this_matters": "Event handlers encapsulate the logic that runs when users interact with the button.",
    "answer_keywords": [
      "const",
      "handle",
      "=",
      "=>",
      "set",
      "prev",
      "+",
      "onClick",
      "?"
    ],
    "seed_code": "",
    "starter_code": "",
    "feedback_correct": "Perfect! The handler updates state and respects the prop.",
    "feedback_partial": "Check that you're incrementing count and calling onClick.",
    "feedback_wrong": "The handler should update state and optionally call the prop.",
    "expected": "A click handler function is defined inside the component."
  },
  {
    "id": "step7",
    "type": "question",
    "phase": "Step 7 of 7",
    "paal": "Assign your handler to the **`<button>`** **`onClick`** prop. Set **`className`** so the class reflects whether **`count`** is greater than zero.",
    "hint": "Use the handler variable in onClick. For the class, use a ternary based on count.",
    "example_code": "<button onClick={toggleHandler} className={isActive ? 'active' : ''}>Toggle</button>",
    "think_prompt": "How do you attach the click handler to the button element?",
    "mc_options": [
      "onClick={handleClick}",
      "onClick={() => handleClick()}",
      "Both work; the first is more efficient"
    ],
    "mc_correct_option": "Both work; the first is more efficient",
    "mc_anchor": "Passing the function reference directly avoids creating a new function on every render.",
    "why_this_matters": "Connecting the handler to the button makes it interactive—clicks now trigger your logic.",
    "answer_keywords": [
      "onClick",
      "{",
      "handle",
      "}",
      "className",
      "{",
      "count",
      ">",
      "?",
      ":"
    ],
    "seed_code": "",
    "starter_code": "",
    "feedback_correct": "Excellent! Your reusable button is fully functional and typed.",
    "feedback_partial": "Make sure onClick and className are properly set.",
    "feedback_wrong": "Check the onClick assignment and className logic.",
    "expected": "The button responds to clicks and visually reflects interaction."
  }
];

const sideItems = [
  { "label": "Lesson", "id": "intro" },
  { "label": "Objectives", "id": "objectives" },
  { "label": "Step 1", "id": "step1" },
  { "label": "Step 2", "id": "step2" },
  { "label": "Step 3", "id": "step3" },
  { "label": "Step 4", "id": "step4" },
  { "label": "Step 5", "id": "step5" },
  { "label": "Step 6", "id": "step6" },
  { "label": "Step 7", "id": "step7" }
];

export default createINPACTEngine({ NODES, sideItems, lessonNum: 10, title: "Reusable Button (TypeScript)", shortName: "TS — REUSABLE BUTTON" });
