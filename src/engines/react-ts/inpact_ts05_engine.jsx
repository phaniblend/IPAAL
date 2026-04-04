/**
 * 🔒 LOCKED — React · TS lesson 5 — Conditional Rendering with Ternary (TypeScript).
 * Do not change steps, copy, or evaluation without explicit product/content sign-off.
 * Generated mirror: content/generated/react-ts/005_conditional-rendering-with-ternary_lesson.json
 */
import createINPACTEngine from "../inpact_engine_shared";

const NODES = [
  {
    "id": "intro",
    "type": "reveal",
    "phase": "Lesson",
    "content": {
      "tag": "LESSON #5 (TypeScript)",
      "title": "Conditional Rendering with Ternary — Typed",
      "body": "In React with TypeScript, you often need to show different UI based on conditions. The ternary operator (condition ? trueValue : falseValue) is a concise way to handle conditional rendering while maintaining type safety.",
      "usecase": "You'll build a toggleable user status indicator that shows different messages and styles based on whether a user is online or offline."
    }
  },
  {
    "id": "objectives",
    "type": "objectives",
    "phase": "Objectives",
    "items": [
      "Use useState with explicit TypeScript types for boolean state",
      "Write a toggle handler with proper TypeScript event typing",
      "Apply ternary operator for conditional rendering in JSX",
      "Combine conditional rendering with dynamic styling"
    ]
  },
  {
    "id": "step1",
    "type": "question",
    "phase": "Step 1 of 5",
    "paal": "Import React and the useState hook from the 'react' package.",
    "hint": "Use named imports for React and useState.",
    "example_code": "import { useState } from 'react';",
    "think_prompt": "In a typical React app using ES modules, why must you import useState from the 'react' package?",
    "mc_options": [
      "Because React injects hooks globally, so import is optional",
      "Because useState is a named export from the 'react' package — it is not a global",
      "Because JSX automatically loads useState the first time you call it"
    ],
    "mc_correct_option": "Because useState is a named export from the 'react' package — it is not a global",
    "mc_anchor": "Hooks like useState live on the react package; you import the ones you use, like any other module API.",
    "why_this_matters": "React provides the useState hook for managing component state, which is essential for tracking conditions that determine what gets rendered.",
    "answer_keywords": [
      "import",
      "React",
      "useState",
      "'react'"
    ],
    "seed_code": "",
    "starter_code": "",
    "feedback_correct": "Great! You've imported the essential React tools.",
    "feedback_partial": "Almost there. Make sure you're importing both React and useState.",
    "feedback_wrong": "Let's try again. You need to import React and useState from 'react'.",
    "expected": "The component should have access to React and useState."
  },
  {
    "id": "step2",
    "type": "question",
    "phase": "Step 2 of 5",
    "paal": "Create a functional component called UserStatus that returns a div element. Use TypeScript to type it as a React functional component.",
    "hint": "Use an explicit JSX.Element return type (or a function declaration with return type).",
    "example_code": "const MyComponent = (): JSX.Element => { return <div>Hello</div>; };",
    "think_prompt": "What's the main benefit of typing React components with TypeScript?",
    "mc_options": [
      "It makes the code run faster",
      "It catches type errors at compile time rather than runtime",
      "It reduces the bundle size of the application"
    ],
    "mc_correct_option": "It catches type errors at compile time rather than runtime",
    "mc_anchor": "Exactly! TypeScript helps catch errors early during development.",
    "why_this_matters": "TypeScript requires explicit type annotations for function components to ensure type safety throughout your application.",
    "answer_keywords": [
      "UserStatus",
      "return",
      "<div>",
      "JSX.Element",
      "=>"
    ],
    "seed_code": "",
    "starter_code": "",
    "feedback_correct": "Perfect! You've created a typed React component.",
    "feedback_partial": "Good start. Make sure your component returns JSX and has TypeScript typing.",
    "feedback_wrong": "Let's review. You need a component that returns a div element with proper TypeScript typing.",
    "expected": "A basic React component structure with proper TypeScript typing."
  },
  {
    "id": "step3",
    "type": "question",
    "phase": "Step 3 of 5",
    "paal": "Inside your component, declare a state variable to track whether the user is online. Initialize it to false and type it as boolean.",
    "hint": "Use useState with a type parameter or let TypeScript infer from the initial value.",
    "example_code": "const [count, setCount] = useState<number>(0);",
    "think_prompt": "Why do we type the initial value as boolean when using useState?",
    "mc_options": [
      "Because TypeScript can't infer the type from true/false",
      "To explicitly tell TypeScript that this state will only hold boolean values",
      "Because useState requires a type parameter for all primitive values"
    ],
    "mc_correct_option": "To explicitly tell TypeScript that this state will only hold boolean values",
    "mc_anchor": "Right! Explicit typing ensures TypeScript knows what values are valid for this state.",
    "why_this_matters": "State variables hold data that determines what gets rendered. With TypeScript, we explicitly type state to prevent bugs.",
    "answer_keywords": [
      "useState",
      "false",
      "boolean"
    ],
    "seed_code": "",
    "starter_code": "",
    "feedback_correct": "Excellent! You've created typed boolean state.",
    "feedback_partial": "Almost. Make sure your state is typed as boolean and initialized to false.",
    "feedback_wrong": "Let's try again. You need useState with boolean type and false initial value.",
    "expected": "A boolean state variable with its setter function."
  },
  {
    "id": "step4",
    "type": "question",
    "phase": "Step 4 of 5",
    "paal": "Define a function that toggles the online status when called. Use proper TypeScript typing for the event parameter.",
    "hint": "The handler should flip the boolean state value.",
    "example_code": "const handleClick = (event: React.MouseEvent) => { setCount(prev => prev + 1); };",
    "think_prompt": "What's the advantage of typing event handlers in TypeScript?",
    "mc_options": [
      "It makes the handler run faster",
      "It prevents calling event.preventDefault() on wrong event types",
      "TypeScript can suggest correct event properties and methods"
    ],
    "mc_correct_option": "TypeScript can suggest correct event properties and methods",
    "mc_anchor": "Good thinking! TypeScript's IntelliSense helps you use the right event properties.",
    "why_this_matters": "Event handlers update state in response to user interactions. TypeScript ensures handlers receive correctly typed events.",
    "answer_keywords": [
      "=>",
      "set",
      "prev",
      "!",
      "React.MouseEvent"
    ],
    "seed_code": "",
    "starter_code": "",
    "feedback_correct": "Perfect! Your handler is properly typed and functional.",
    "feedback_partial": "Good. Make sure your handler toggles the state and has proper event typing.",
    "feedback_wrong": "Let's review. You need a function that toggles the boolean state with typed event parameter.",
    "expected": "A typed event handler that toggles the boolean state."
  },
  {
    "id": "step5",
    "type": "question",
    "phase": "Step 5 of 5",
    "paal": "In your component's return statement, use a ternary operator to show 'Online' with green text when the state is true, and 'Offline' with red text when false. Connect your toggle handler to a button.",
    "hint": "Use condition ? 'Online' : 'Offline' and style with inline styles or CSS classes.",
    "example_code": "return (\n  <div>\n    <p style={{ color: flag ? \"green\" : \"red\" }}>\n      {flag ? \"On\" : \"Off\"}\n    </p>\n    <button type=\"button\" onClick={handleFlip}>Toggle</button>\n  </div>\n);",
    "think_prompt": "Why use a ternary operator instead of an if-else statement in JSX?",
    "mc_options": [
      "Ternary operators are faster than if-else",
      "JSX only accepts expressions, not statements like if-else",
      "Ternary operators work better with TypeScript"
    ],
    "mc_correct_option": "JSX only accepts expressions, not statements like if-else",
    "mc_anchor": "Exactly! JSX requires expressions, and ternary operators are expressions that return a value.",
    "why_this_matters": "The ternary operator lets you conditionally render different JSX in a concise, readable way while maintaining TypeScript type safety.",
    "answer_keywords": [
      "?",
      ":",
      "Online",
      "Offline",
      "onClick",
      "color",
      "button"
    ],
    "seed_code": "",
    "starter_code": "",
    "feedback_correct": "Excellent! You've mastered conditional rendering with TypeScript!",
    "feedback_partial": "Good progress. Make sure you're using a ternary operator and both text and color change.",
    "feedback_wrong": "Let's review. You need a ternary operator that shows different text and colors, plus a button that toggles the state.",
    "expected": "Conditional rendering that changes text and color based on state, with a working toggle button."
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
  }
];

export default createINPACTEngine({ NODES, sideItems, lessonNum: 5, title: "Conditional Rendering with Ternary (TypeScript)", shortName: "TS — CONDITIONAL RENDERING WITH TERNARY" });
