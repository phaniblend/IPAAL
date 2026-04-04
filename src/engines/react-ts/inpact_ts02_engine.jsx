/**
 * 🔒 LOCKED — React · TS lesson 2 — Toggle visibility (TypeScript).
 * Do not change steps, copy, or evaluation without explicit product/content sign-off.
 * Generated mirror: content/generated/react-ts/002_toggle-visibility_lesson.json
 */
import createINPACTEngine from "../inpact_engine_shared";

const NODES = [
  {
    "id": "intro",
    "type": "reveal",
    "phase": "Lesson",
    "content": {
      "tag": "LESSON #2 (TypeScript)",
      "title": "Toggle Visibility — Typed",
      "body": "Learn to create interactive UI elements that respond to user clicks while maintaining type safety throughout.",
      "usecase": "You'll build a toggle button that shows/hides content, a common pattern in modals, accordions, and settings panels."
    }
  },
  {
    "id": "objectives",
    "type": "objectives",
    "phase": "Objectives",
    "items": [
      "Declare typed state with useState",
      "Create type-safe event handlers",
      "Conditionally render JSX based on state",
      "Connect handlers to interactive elements"
    ]
  },
  {
    "id": "step1",
    "type": "question",
    "phase": "Step 1 of 6",
    "paal": "Import React and the useState hook from the 'react' library.",
    "hint": "Use named imports for both React and useState.",
    "example_code": "import React, { useEffect } from 'react';",
    "think_prompt": "What do we need from React to create a component with state?",
    "mc_options": [
      "Only React itself since state is built-in",
      "React and useState from 'react'",
      "React, useState, and useEffect for side effects"
    ],
    "mc_correct_option": "React and useState from 'react'",
    "mc_anchor": "We need both React (for component definition) and useState (for state management).",
    "why_this_matters": "React provides the building blocks for components, and useState is essential for managing interactive state.",
    "answer_keywords": [
      "import",
      "React",
      "useState",
      "'react'"
    ],
    "seed_code": "",
    "starter_code": "",
    "feedback_correct": "Perfect! You've imported the essential tools for building a stateful component.",
    "feedback_partial": "You're close. Remember to import both React and useState.",
    "feedback_wrong": "Let's try again. We need React for component creation and useState for state management.",
    "expected": "The imports are declared at the top of the file."
  },
  {
    "id": "step2",
    "type": "question",
    "phase": "Step 2 of 6",
    "paal": "Define a function component named ToggleVisibility that returns JSX.Element.",
    "hint": "Start with 'function ToggleVisibility(): JSX.Element' or use arrow function syntax.",
    "example_code": "function Counter(): JSX.Element { return <div>0</div>; }",
    "think_prompt": "What TypeScript return type should a React component function have?",
    "mc_options": [
      "JSX.Element",
      "React.FC (FunctionComponent)",
      "Either JSX.Element or React.FC are valid"
    ],
    "mc_correct_option": "Either JSX.Element or React.FC are valid",
    "mc_anchor": "TypeScript accepts both explicit JSX.Element return type or React.FC interface for components.",
    "why_this_matters": "Every React component needs a proper function signature that defines its interface and return type.",
    "answer_keywords": [
      "ToggleVisibility",
      "return",
      "<"
    ],
    "seed_code": "",
    "starter_code": "",
    "feedback_correct": "Great! You've established the component's foundation with a clear TypeScript return type.",
    "feedback_partial": "Almost there. Make sure your component has an explicit TypeScript return type such as JSX.Element or React.FC.",
    "feedback_wrong": "Let's revisit. We need a function component with an explicit TypeScript return type (for example JSX.Element or React.FC).",
    "expected": "A component function is defined with proper TypeScript typing."
  },
  {
    "id": "step3",
    "type": "question",
    "phase": "Step 3 of 6",
    "paal": "Inside the component, declare a state variable to track visibility, typed as boolean with an initial value of false.",
    "hint": "Use useState<boolean>(false) to create typed state.",
    "example_code": "const [count, setCount] = useState<number>(0);",
    "think_prompt": "What TypeScript type should we use for a visibility toggle state?",
    "mc_options": [
      "string ('visible' or 'hidden')",
      "boolean (true/false)",
      "number (0 or 1)"
    ],
    "mc_correct_option": "boolean (true/false)",
    "mc_anchor": "Boolean is the most semantic type for toggle states (visible = true, hidden = false).",
    "why_this_matters": "TypeScript ensures our visibility state is always boolean, preventing runtime errors from incorrect state values.",
    "answer_keywords": [
      "useState",
      "false"
    ],
    "seed_code": "",
    "starter_code": "",
    "feedback_correct": "Excellent! You've created type-safe state that will control our visibility.",
    "feedback_partial": "Good start. Remember to type the state as boolean and initialize it to false.",
    "feedback_wrong": "Let's adjust. We need boolean state initialized to false using useState.",
    "expected": "A boolean state variable and its setter are declared inside the component."
  },
  {
    "id": "step4",
    "type": "question",
    "phase": "Step 4 of 6",
    "paal": "Return JSX containing a button and a content holder element that will display our toggleable content.",
    "hint": "Wrap both elements in a parent container like a fragment or div.",
    "example_code": "return (<><button>Click</button><div>Content</div></>);",
    "think_prompt": "What JSX elements do we need for a toggle interface?",
    "mc_options": [
      "Just a button that changes text",
      "A button and a content element (like a div, p, span, or heading)",
      "Multiple buttons for different states"
    ],
    "mc_correct_option": "A button and a content element (like a div, p, span, or heading)",
    "mc_anchor": "We need both the control (button) and a content area (any suitable element) that responds to it.",
    "why_this_matters": "The JSX defines what users see - a button and conditional content area.",
    "answer_keywords": [
      "button",
      "return"
    ],
    "seed_code": "",
    "starter_code": "",
    "feedback_correct": "Perfect structure! You've laid out the visual foundation for our toggle.",
    "feedback_partial": "Almost. Make sure you have both a button and a content element that will hold the toggleable content.",
    "feedback_wrong": "Let's try again. We need a button and a suitable content element for the toggleable area.",
    "expected": "JSX with a button and a content element is returned from the component."
  },
  {
    "id": "step5",
    "type": "question",
    "phase": "Step 5 of 6",
    "paal": "Define a function inside the component that toggles the visibility state between true and false.",
    "hint": "Use arrow function syntax and the state setter with previous state.",
    "example_code": "const increment = () => setCount(prev => prev + 1);",
    "think_prompt": "How should we toggle a boolean state value in React?",
    "mc_options": [
      "Directly assign the opposite value",
      "Use the setter function with current value",
      "Create a handler that calls the setter with !currentValue"
    ],
    "mc_correct_option": "Create a handler that calls the setter with !currentValue",
    "mc_anchor": "We need a handler function that toggles the boolean state using functional update pattern.",
    "why_this_matters": "Event handlers encapsulate the logic that responds to user interactions in a type-safe way.",
    "answer_keywords": [
      "=>",
      "!",
      "prev",
      ")"
    ],
    "seed_code": "",
    "starter_code": "",
    "feedback_correct": "Great handler! It cleanly encapsulates the toggle logic.",
    "feedback_partial": "Good attempt. Make sure your handler toggles between true and false using the setter.",
    "feedback_wrong": "Let's refine. We need a function that toggles the boolean state value.",
    "expected": "A handler function is defined that toggles the boolean state."
  },
  {
    "id": "step6",
    "type": "question",
    "phase": "Step 6 of 6",
    "paal": "Wire the toggle handler to the button's click event and conditionally show the content div only when visibility state is true.",
    "hint": "Use onClick for the button and conditional rendering (&&) for the div.",
    "example_code": "<button onClick={increment}>Add</button>{showDetails && <div>Details</div>}",
    "think_prompt": "How do we make the UI respond to our state and handler?",
    "mc_options": [
      "Call the handler directly in JSX",
      "Connect handler to button click and conditionally render content",
      "Just declaring them is enough - React auto-wires"
    ],
    "mc_correct_option": "Connect handler to button click and conditionally render content",
    "mc_anchor": "We need to attach the handler to the button and make content appear only when state is true.",
    "why_this_matters": "Wiring state and handlers to JSX creates the interactive experience users expect.",
    "answer_keywords": [
      "onClick",
      "{",
      "&&",
      "}"
    ],
    "seed_code": "",
    "starter_code": "",
    "feedback_correct": "Perfect! You've created a fully functional, type-safe toggle component!",
    "feedback_partial": "Close! Make sure both the click handler and conditional rendering are implemented.",
    "feedback_wrong": "Let's complete the wiring. Connect handler to button and conditionally show content.",
    "expected": "Button triggers toggle on click, content appears only when visible."
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

export default createINPACTEngine({ NODES, sideItems, lessonNum: 2, title: "Toggle Visibility (TypeScript)", shortName: "TS — TOGGLE VISIBILITY" });
