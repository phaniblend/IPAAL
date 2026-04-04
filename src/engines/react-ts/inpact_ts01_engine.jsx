/**
 * 🔒 LOCKED — React · TS lesson 1 — Counter App (TypeScript).
 * Do not change steps, copy, or evaluation without explicit product/content sign-off.
 * Generated mirror: content/generated/react-ts/001_counter-app_lesson.json
 */
import createINPACTEngine from "../inpact_engine_shared";

const NODES = [
  {
    "id": "intro",
    "type": "reveal",
    "phase": "Lesson",
    "content": {
      "tag": "LESSON #1 (TypeScript)",
      "title": "Counter App — Typed",
      "body": "Build a simple counter app with React and TypeScript. You'll learn how to add type safety to React components, manage state with useState, and handle events with proper TypeScript types.",
      "usecase": "Counters are everywhere in real apps — from shopping carts to like buttons. Adding TypeScript ensures your state and event handlers are predictable and error-free."
    }
  },
  {
    "id": "objectives",
    "type": "objectives",
    "phase": "Objectives",
    "items": [
      "Create a typed React component with TypeScript",
      "Use useState with explicit number type for state",
      "Write event handlers with proper TypeScript event types",
      "Connect event handlers to JSX buttons",
      "Display state values in JSX with type safety"
    ]
  },
  {
    "id": "step1",
    "type": "question",
    "phase": "Step 1 of 7",
    "paal": "Import the necessary dependencies from React to create a component and manage state.",
    "hint": "Use import { ... } from 'react' syntax.",
    "example_code": "Like importing tools from a toolbox before starting a project.",
    "think_prompt": "What do we need to import to use React components and state hooks in TypeScript?",
    "mc_options": [
      "Only React because useState is built into React",
      "React and useState separately because TypeScript requires explicit imports",
      "React and useState from 'react' because useState is a named export"
    ],
    "mc_correct_option": "React and useState from 'react' because useState is a named export",
    "mc_anchor": "Import React and the useState hook from the 'react' package.",
    "why_this_matters": "React provides the core library and hooks like useState for managing component state. TypeScript works seamlessly with React's type definitions.",
    "answer_keywords": [
      "import",
      "React",
      "useState",
      "'react'"
    ],
    "seed_code": "",
    "starter_code": "",
    "feedback_correct": "Perfect! You've imported the essential React building blocks.",
    "feedback_partial": "You're close. Remember to import both React and useState.",
    "feedback_wrong": "Let's start with the basics: import React and useState from 'react'.",
    "expected": "A clean import statement at the top of your file."
  },
  {
    "id": "step2",
    "type": "question",
    "phase": "Step 2 of 7",
    "paal": "Define a function component that will serve as our counter app. Use TypeScript to specify it's a React function component.",
    "hint": "Use const with React.FC type and arrow function syntax.",
    "example_code": "Like declaring a specialized worker with a specific job description.",
    "think_prompt": "How should we define a React function component in TypeScript?",
    "mc_options": [
      "As a regular JavaScript function without types",
      "Using React.FC type for function components",
      "Using function declaration with explicit return type"
    ],
    "mc_correct_option": "Using React.FC type for function components",
    "mc_anchor": "Create a function component using React.FC type annotation.",
    "why_this_matters": "Components are the building blocks of React apps. TypeScript helps define what props a component expects and what it returns.",
    "answer_keywords": [
      "React.FC",
      "=>",
      "()"
    ],
    "seed_code": "",
    "starter_code": "",
    "feedback_correct": "Great! You've created a properly typed React component.",
    "feedback_partial": "Almost there. Make sure to use React.FC for TypeScript typing.",
    "feedback_wrong": "Let's define the component: use React.FC type with an arrow function.",
    "expected": "A typed React function component definition."
  },
  {
    "id": "step3",
    "type": "question",
    "phase": "Step 3 of 7",
    "paal": "Inside your component, declare state to track the current count. Choose an appropriate TypeScript type and initialize it to the starting value.",
    "hint": "Use useState with angle brackets to specify the type.",
    "example_code": "Like reserving a parking spot specifically for cars (not trucks or motorcycles).",
    "think_prompt": "How do we add type safety to useState for a counter that stores numbers?",
    "mc_options": [
      "useState() without type - TypeScript will infer it",
      "useState<number>(0) with explicit generic type",
      "useState(0 as number) with type assertion"
    ],
    "mc_correct_option": "useState<number>(0) with explicit generic type",
    "mc_anchor": "Initialize state with useState and a starting value.",
    "why_this_matters": "State makes components interactive. TypeScript ensures your state variable always holds the expected type of value.",
    "answer_keywords": [
      "useState<number>",
      "useState<number>(0"
    ],
    "seed_code": "",
    "starter_code": "",
    "feedback_correct": "Excellent! Your state is now type-safe for counter values.",
    "feedback_partial": "Good start. Think about what this state represents: the counter's current value should be initialized to the starting value with the right type.",
    "feedback_wrong": "Pause and think: the counter's current value needs a type appropriate for arithmetic (not a string) and be initialized to the starting value.",
    "expected": "A typed useState hook call inside the component."
  },
  {
    "id": "step4",
    "type": "question",
    "phase": "Step 4 of 7",
    "paal": "Create a function that will handle incrementing the counter. Focus on the logic rather than event parameters.",
    "hint": "The function should update the state using the setter from useState.",
    "example_code": "Like programming a remote control button to increase the volume.",
    "think_prompt": "What's the best way to type a click handler function for a button?",
    "mc_options": [
      "Don't type it - TypeScript will infer from usage",
      "Use (event: React.MouseEvent) => void",
      "Use () => void since we don't need the event object"
    ],
    "mc_correct_option": "Use () => void since we don't need the event object",
    "mc_anchor": "Write a function that increases the count by 1.",
    "why_this_matters": "Event handlers need proper typing to prevent runtime errors. TypeScript helps catch event-related bugs during development.",
    "answer_keywords": [
      "=>",
      "set",
      "+",
      "1"
    ],
    "seed_code": "",
    "starter_code": "",
    "feedback_correct": "Perfect! You've created a handler that safely updates state.",
    "feedback_partial": "You're close. Make sure your function calls the state setter.",
    "feedback_wrong": "Let's create the handler: a function that calls setCount with count + 1.",
    "expected": "A function that increments the state value."
  },
  {
    "id": "step5",
    "type": "question",
    "phase": "Step 5 of 7",
    "paal": "Create another handler function for decreasing the counter. Follow the same pattern as the increment handler.",
    "hint": "This function should also use the state setter.",
    "example_code": "Like adding a volume down button to match the volume up button.",
    "think_prompt": "Should the decrement handler have the same type as increment?",
    "mc_options": [
      "No, it needs different typing because it decreases",
      "Yes, both are simple click handlers without event parameters",
      "Maybe, depends on if we prevent negative numbers"
    ],
    "mc_correct_option": "Yes, both are simple click handlers without event parameters",
    "mc_anchor": "Write a function that decreases the count by 1.",
    "why_this_matters": "Complete apps need multiple interactions. Consistent handler patterns make code predictable and maintainable.",
    "answer_keywords": [
      "=>",
      "set",
      "-",
      "1"
    ],
    "seed_code": "",
    "starter_code": "",
    "feedback_correct": "Great! Now you have both increment and decrement handlers.",
    "feedback_partial": "Almost. Make sure this function decreases the count.",
    "feedback_wrong": "Let's add the decrement handler: similar to increment but subtracting 1.",
    "expected": "A second handler function for decrementing."
  },
  {
    "id": "step6",
    "type": "question",
    "phase": "Step 6 of 7",
    "paal": "Make your component return the visual interface: display the current count and provide buttons to change it.",
    "hint": "Use a div to wrap everything, display the state variable, and add button elements.",
    "example_code": "Like arranging furniture in a room so people can interact with it.",
    "think_prompt": "What should our counter's JSX display?",
    "mc_options": [
      "Only the current count number",
      "The count plus one button",
      "The count plus both increment and decrement buttons"
    ],
    "mc_correct_option": "The count plus both increment and decrement buttons",
    "mc_anchor": "Return JSX showing the count and two buttons.",
    "why_this_matters": "JSX defines what users see. TypeScript validates that your JSX is syntactically correct and properly typed.",
    "answer_keywords": [
      "return",
      "div",
      "{",
      "}",
      "button"
    ],
    "seed_code": "",
    "starter_code": "",
    "feedback_correct": "Perfect! Your UI structure is ready for interaction.",
    "feedback_partial": "Good structure. Make sure to display the count value.",
    "feedback_wrong": "Let's build the UI: show the count and add button elements.",
    "expected": "JSX that displays the counter value and buttons."
  },
  {
    "id": "step7",
    "type": "question",
    "phase": "Step 7 of 7",
    "paal": "Make the buttons interactive by connecting them to your handler functions. Pass the function references, don't call them.",
    "hint": "Use onClick prop with curly braces.",
    "example_code": "Like plugging a controller into a game console.",
    "think_prompt": "How do we connect our handler functions to button clicks?",
    "mc_options": [
      "onClick={incrementHandler()} with parentheses",
      "onClick={incrementHandler} without parentheses",
      "onClick=\"incrementHandler\" as a string"
    ],
    "mc_correct_option": "onClick={incrementHandler} without parentheses",
    "mc_anchor": "Attach the handler functions to button click events.",
    "why_this_matters": "Event wiring brings interactivity to life. TypeScript ensures event handlers receive correct event types.",
    "answer_keywords": [
      "onClick",
      "={",
      "}"
    ],
    "seed_code": "",
    "starter_code": "",
    "feedback_correct": "Excellent! Your counter app is now fully interactive and type-safe!",
    "feedback_partial": "Almost there. Make sure you're passing the function, not calling it.",
    "feedback_wrong": "Let's connect the handlers: onClick={handlerFunction} (no parentheses).",
    "expected": "Buttons with onClick handlers attached."
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

export default createINPACTEngine({ NODES, sideItems, lessonNum: 1, title: "Counter App (TypeScript)", shortName: "TS — COUNTER APP" });
