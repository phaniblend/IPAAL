/**
 * 🔒 LOCKED — React · TS lesson 11 — Card Component (TypeScript).
 * Do not change steps, copy, or evaluation without explicit product/content sign-off.
 * Generated mirror: content/generated/react-ts/011_card-component_lesson.json
 */
import createINPACTEngine from "../inpact_engine_shared";

/**
 * Step 3 must type the Card parameter as CardProps. Global keyword_match treats identifiers as
 * auto-satisfied, so "CardProps" from the interface line alone was incorrectly enough to pass.
 */
function evaluateCardStep3PropsType(answer) {
  const s = String(answer || "");
  const cardParamTyped = /\b(?:function\s+Card|const\s+Card\s*=)\s*\(\s*[^)]*:\s*CardProps\b/.test(s);
  if (cardParamTyped) return "correct";
  if (/\b(?:function\s+Card|const\s+Card\s*=)\s*\(\s*[^)]*:\s*UserProps\b/.test(s)) return "wrong";
  if (/\bfunction\s+Card\b/.test(s) || /\bconst\s+Card\s*=/.test(s)) return "partial";
  return "wrong";
}

/**
 * Step 7: onClick + isExpanded-based conditional render of props.content.
 * Both `isExpanded && <p>…</p>` and `isExpanded ? <p>…</p> : null` are valid — do not require ternary.
 */
function evaluateCardStep7Conditional(answer) {
  const s = String(answer || "");
  const hasOnClick = /onClick\s*=\s*\{/.test(s);
  const hasExpandedCond =
    /\bisExpanded\s*&&/.test(s) ||
    /\bisExpanded\s*\?/.test(s);
  const showsContentWhenExpanded =
    /\bisExpanded\s*&&[\s\S]{0,700}?\{props\.content\}/.test(s) ||
    /\bisExpanded\s*\?[\s\S]{0,700}?\{props\.content\}/.test(s);

  if (!hasOnClick) return "wrong";
  if (!hasExpandedCond) return "partial";
  if (!showsContentWhenExpanded) return "partial";
  return "correct";
}

const NODES = [
  {
    "id": "intro",
    "type": "reveal",
    "phase": "Lesson",
    "content": {
      "tag": "LESSON #11 (TypeScript)",
      "title": "Card Component — Typed",
      "body": "You'll build a reusable Card component with TypeScript that displays content and can be toggled between expanded/collapsed states. This pattern is common in UI libraries and dashboards.",
      "usecase": "Think of product cards, user profiles, or dashboard widgets that need clean, consistent presentation with interactive state."
    }
  },
  {
    "id": "objectives",
    "type": "objectives",
    "phase": "Objectives",
    "items": [
      "Define a typed Card component with props for title and content",
      "Manage local boolean state for expand/collapse behavior",
      "Type event handlers correctly for React+TypeScript",
      "Conditionally render content based on component state"
    ]
  },
  {
    "id": "step1",
    "type": "question",
    "phase": "Step 1 of 7",
    "paal": "Import React and the useState hook from the 'react' package.",
    "hint": "You need both the default React export and the named useState export.",
    "example_code": "import React, { useEffect } from 'react';",
    "think_prompt": "Which import statement gives us both React and the useState hook in TypeScript?",
    "mc_options": [
      "import React, { useState } from 'react';",
      "import { React, useState } from 'react';",
      "import useState from 'react';"
    ],
    "mc_correct_option": "import React, { useState } from 'react';",
    "mc_anchor": "Correct! React is the default export, and useState is a named export from the 'react' package.",
    "why_this_matters": "React provides the component foundation, and useState is essential for managing interactive state within functional components.",
    "answer_keywords": [
      "import",
      "React",
      "useState",
      "'react'"
    ],
    "seed_code": "",
    "starter_code": "",
    "feedback_correct": "Perfect! You've imported the essential building blocks.",
    "feedback_partial": "Close! Check if you're importing both React and useState correctly.",
    "feedback_wrong": "Remember: React is the default export, useState is a named export from 'react'.",
    "expected": "import React, { useState } from 'react';"
  },
  {
    "id": "step2",
    "type": "question",
    "phase": "Step 2 of 7",
    "paal": "Define an interface named CardProps with two required string properties: title and content.",
    "hint": "Use the 'interface' keyword followed by property definitions with colon types.",
    "example_code": "interface ButtonProps { label: string; onClick: () => void; }",
    "think_prompt": "Where should you define the props interface relative to the component function?",
    "mc_options": [
      "Inside the component function",
      "Before the component function",
      "After the component function"
    ],
    "mc_correct_option": "Before the component function",
    "mc_anchor": "Right! Defining interfaces before the component keeps code organized and types accessible.",
    "why_this_matters": "TypeScript interfaces document expected props and provide compile-time safety, catching errors before runtime.",
    "answer_keywords": [
      "interface",
      "CardProps",
      "title:",
      "content:",
      "string"
    ],
    "seed_code": "",
    "starter_code": "",
    "feedback_correct": "Excellent! Your interface clearly defines what data the Card expects.",
    "feedback_partial": "Almost there! Make sure both properties are required strings.",
    "feedback_wrong": "Remember: interface CardProps { title: string; content: string; }",
    "expected": "interface CardProps { title: string; content: string; }"
  },
  {
    "id": "step3",
    "type": "question",
    "phase": "Step 3 of 7",
    "paal": "Create a function component named Card that accepts CardProps as its parameter.",
    "hint": "Define a function that takes a single parameter typed with your interface.",
    "example_code": "function Card(props: CardProps) { return <div>...</div>; }",
    "think_prompt": "How do you type the props parameter in a functional component?",
    "mc_options": [
      "Using a type annotation on the parameter (e.g. props: CardProps)",
      "Using generic angle brackets on the function name",
      "Using a default parameter value"
    ],
    "mc_correct_option": "Using a type annotation on the parameter (e.g. props: CardProps)",
    "mc_anchor": "Annotate the parameter: `function Card(props: CardProps)` or destructure: `function Card({ title, content }: CardProps)`.",
    "why_this_matters": "The component function signature establishes the typed contract between props and the component's implementation.",
    "answer_keywords": [
      "function",
      "Card",
      "props:",
      "CardProps"
    ],
    "evaluate": evaluateCardStep3PropsType,
    "seed_code": "",
    "starter_code": "",
    "feedback_correct": "Great! Your component is now properly typed to receive its props.",
    "feedback_partial": "Check that your function parameter is explicitly typed with CardProps.",
    "feedback_wrong": "Remember: function Card(props: CardProps) { }",
    "expected": "function Card(props: CardProps) { }"
  },
  {
    "id": "step4",
    "type": "question",
    "phase": "Step 4 of 7",
    "paal": "Inside the Card component, declare a state variable to track whether the card is expanded. Initialize it to false.",
    "hint": "Use useState with appropriate typing and destructuring to get the variable and setter.",
    "example_code": "const [isActive, setIsActive] = useState<boolean>(false);",
    "think_prompt": "What TypeScript type should you use for a boolean state variable tracking visibility?",
    "mc_options": [
      "useState<boolean>(false)",
      "useState<number>(0)",
      "useState<string>('false')"
    ],
    "mc_correct_option": "useState<boolean>(false)",
    "mc_anchor": "Exactly! TypeScript can infer boolean from false, but explicit typing improves clarity.",
    "why_this_matters": "Local state enables interactive UI patterns without external dependencies, making components self-contained.",
    "answer_keywords": [
      "useState",
      "boolean",
      "false"
    ],
    "seed_code": "",
    "starter_code": "",
    "feedback_correct": "Perfect! Your card now has memory for its expanded state.",
    "feedback_partial": "Almost! Make sure you're using useState with boolean type and false initial value.",
    "feedback_wrong": "Remember: const [isExpanded, setIsExpanded] = useState<boolean>(false);",
    "expected": "const [isExpanded, setIsExpanded] = useState<boolean>(false);"
  },
  {
    "id": "step5",
    "type": "question",
    "phase": "Step 5 of 7",
    "paal": "Define a function inside the component that toggles the expanded state.",
    "hint": "Create an arrow function that uses the setter with the functional update pattern.",
    "example_code": "const toggleActive = () => setIsActive(prev => !prev);",
    "think_prompt": "You already have `isExpanded` and `setIsExpanded` from `useState`. What should your toggle function do on each call?",
    "mc_options": [
      "Call the setter with a function that flips the previous value: `setIsExpanded(prev => !prev)`",
      "Mutate the state variable directly: `isExpanded = !isExpanded`",
      "Call `useState` again to replace the hook with a new boolean"
    ],
    "mc_correct_option": "Call the setter with a function that flips the previous value: `setIsExpanded(prev => !prev)`",
    "mc_anchor": "State updates must go through the setter from `useState`. Using `prev => !prev` reads the latest value and flips it—exactly what a toggle needs before you wire this function to a button.",
    "why_this_matters": "A small toggle function keeps “flip expanded” in one place. Next you’ll connect it to `onClick`, but the logic stays the same: call the setter, don’t assign to the state variable.",
    "answer_keywords": [
      "=>",
      "setIsExpanded",
      "prev",
      "!prev"
    ],
    "seed_code": "",
    "starter_code": "",
    "feedback_correct": "Excellent! Your handler cleanly toggles the state.",
    "feedback_partial": "Close! Make sure you're using the functional update pattern (prev => !prev).",
    "feedback_wrong": "Remember: const toggleExpanded = () => setIsExpanded(prev => !prev);",
    "expected": "const toggleExpanded = () => setIsExpanded(prev => !prev);"
  },
  {
    "id": "step6",
    "type": "question",
    "phase": "Step 6 of 7",
    "paal": "Return JSX with a div containing an h2 for the title and a button with 'Toggle' text.",
    "hint": "Use curly braces to embed the title prop in the h2 element.",
    "example_code": "<div><h1>{props.name}</h1><button>Action</button></div>",
    "think_prompt": "Where should you access props values in your JSX?",
    "mc_options": [
      "Directly from the props parameter",
      "From a separate state variable",
      "From a global context"
    ],
    "mc_correct_option": "Directly from the props parameter",
    "mc_anchor": "Correct! Props are passed in and available throughout the component function.",
    "why_this_matters": "JSX defines the visual hierarchy and connects static content with dynamic props.",
    "answer_keywords": [
      "return",
      "div",
      "h2",
      "{props.title}",
      "button",
      "Toggle"
    ],
    "seed_code": "",
    "starter_code": "",
    "feedback_correct": "Great! Your card structure is taking shape.",
    "feedback_partial": "Check that you're using props.title inside curly braces in the h2.",
    "feedback_wrong": "Remember: return (<div><h2>{props.title}</h2><button>Toggle</button></div>);",
    "expected": "return (<div><h2>{props.title}</h2><button>Toggle</button></div>);"
  },
  {
    "id": "step7",
    "type": "question",
    "phase": "Step 7 of 7",
    "paal": "Connect the toggle handler to the button and conditionally render the content paragraph only when expanded.",
    "hint": "Add onClick on the button and render <p>{props.content}</p> only when isExpanded is true. In JSX you can use short-circuit (isExpanded && …) or a ternary (isExpanded ? … : null).",
    "example_code": "<button onClick={toggleHandler}>{isVisible ? 'Hide' : 'Show'}</button>",
    "think_prompt": "How do you conditionally show content based on boolean state in JSX?",
    "mc_options": [
      "Using logical && or a ternary expression",
      "Using if-else statement",
      "Using switch statement"
    ],
    "mc_correct_option": "Using logical && or a ternary expression",
    "mc_anchor": "Exactly! In JSX, `condition && <Jsx/>` and `condition ? <Jsx/> : null` are both common for conditional rendering.",
    "why_this_matters": "Connecting handlers to UI elements creates interactive experiences that respond to user input.",
    "answer_keywords": [
      "onClick={",
      "isExpanded",
      "props.content"
    ],
    "evaluate": evaluateCardStep7Conditional,
    "seed_code": "",
    "starter_code": "",
    "feedback_correct": "Perfect! Your Card component is fully interactive and typed!",
    "feedback_partial": "Almost! Wire onClick to your toggle handler, and show <p>{props.content}</p> only when isExpanded is true (&& or ternary — both are fine).",
    "feedback_wrong": "Remember: add onClick to the button and conditionally render the paragraph with props.content when expanded.",
    "expected": "return (<div><h2>{props.title}</h2><button onClick={toggleExpanded}>Toggle</button>{isExpanded && <p>{props.content}</p>}</div>);"
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

export default createINPACTEngine({ NODES, sideItems, lessonNum: 11, title: "Card Component (TypeScript)", shortName: "TS — CARD COMPONENT" });
