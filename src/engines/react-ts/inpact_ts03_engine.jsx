/**
 * 🔒 LOCKED — React · TS lesson 3 — Controlled Input (TypeScript).
 * Do not change steps, copy, or evaluation without explicit product/content sign-off.
 * Generated mirror: content/generated/react-ts/003_controlled-input_lesson.json
 */
import createINPACTEngine from "../inpact_engine_shared";

const NODES = [
  {
    "id": "intro",
    "type": "reveal",
    "phase": "Lesson",
    "content": {
      "tag": "LESSON #3 (TypeScript)",
      "title": "Controlled Input — Typed",
      "body": "In React, a controlled input is one whose value is driven by React state, not the DOM. This gives you full control over the input's behavior and validation. With TypeScript, we add precise typing to ensure our state and event handlers work correctly.",
      "usecase": "Forms, search fields, settings panels — anywhere you need to track and validate user input in real time."
    }
  },
  {
    "id": "objectives",
    "type": "objectives",
    "phase": "Objectives",
    "items": [
      "Create typed state for input values",
      "Write a typed change handler",
      "Connect state and handler to an input element",
      "Display the current value dynamically"
    ]
  },
  {
    "id": "step1",
    "type": "question",
    "phase": "Step 1 of 6",
    "paal": "Import React and the useState hook from the 'react' package.",
    "hint": "Use a single import statement that brings in React and the named export useState.",
    "example_code": "import React, { useState } from 'react';",
    "think_prompt": "Which import statement gives us both React and the useState hook?",
    "mc_options": [
      "import React, { useState } from 'react';",
      "import { useState } from 'react';",
      "import React from 'react'; import { useState } from 'react';"
    ],
    "mc_correct_option": "import React, { useState } from 'react';",
    "mc_anchor": "Import React and useState together in one statement.",
    "why_this_matters": "We need React to create components and useState to manage the input's value over time.",
    "answer_keywords": [
      "import",
      "React",
      "useState",
      "'react'"
    ],
    "seed_code": "",
    "starter_code": "",
    "feedback_correct": "Great! You've imported the essentials.",
    "feedback_partial": "Almost — check that you're importing both React and useState.",
    "feedback_wrong": "Let's try again. We need React and useState from 'react'.",
    "expected": "The import line is added."
  },
  {
    "id": "step2",
    "type": "question",
    "phase": "Step 2 of 6",
    "paal": "Declare a functional component named ControlledInput with an explicit JSX.Element return type.",
    "hint": "Start with 'const ControlledInput = (): JSX.Element => { }'.",
    "example_code": "const MyButton = (): JSX.Element => { return <button>Click</button>; };",
    "think_prompt": "What's the correct way to define a functional component in TypeScript?",
    "mc_options": [
      "function MyComponent() { ... }",
      "const MyComponent = (): JSX.Element => { ... }",
      "const MyComponent = () => { ... }"
    ],
    "mc_correct_option": "const MyComponent = (): JSX.Element => { ... }",
    "mc_anchor": "Use an explicit JSX.Element return type for the component function.",
    "why_this_matters": "Every React component needs a function definition to hold our logic and JSX.",
    "answer_keywords": [
      "const",
      "ControlledInput",
      "JSX.Element",
      "=>"
    ],
    "seed_code": "",
    "starter_code": "",
    "feedback_correct": "Perfect! The component is ready.",
    "feedback_partial": "Close — make sure you're using JSX.Element for TypeScript.",
    "feedback_wrong": "Let's define a component with JSX.Element.",
    "expected": "Component skeleton is created."
  },
  {
    "id": "step3",
    "type": "question",
    "phase": "Step 3 of 6",
    "paal": "Inside the component, declare a state variable to hold the input's current value, initialized as an empty string.",
    "hint": "Call useState with a generic type <string> and an initial empty string.",
    "example_code": "const [count, setCount] = useState<number>(0);",
    "think_prompt": "How do you declare a state variable for a text input with TypeScript?",
    "mc_options": [
      "const [value] = useState('');",
      "const [value, setValue] = useState<string>('');",
      "const value = useState('');"
    ],
    "mc_correct_option": "const [value, setValue] = useState<string>('');",
    "mc_anchor": "Use useState with a generic <string> to type the state.",
    "why_this_matters": "We need a place to store the current text of the input, and TypeScript ensures it's always a string.",
    "answer_keywords": [
      "useState",
      "<string>",
      "''"
    ],
    "seed_code": "",
    "starter_code": "",
    "feedback_correct": "Excellent! The state is typed and ready.",
    "feedback_partial": "Almost — remember to add the <string> generic for TypeScript.",
    "feedback_wrong": "Let's declare state with useState<string>('').",
    "expected": "State variable and setter are declared."
  },
  {
    "id": "step4",
    "type": "question",
    "phase": "Step 4 of 6",
    "paal": "In the component's return statement, add an input element.",
    "hint": "Return <input /> from the component.",
    "example_code": "return (\n  <div>\n    <input placeholder=\"Search\" />\n  </div>\n);",
    "think_prompt": "What JSX element represents a text input?",
    "mc_options": [
      "<input />",
      "<textInput />",
      "<input type='text' />"
    ],
    "mc_correct_option": "<input />",
    "mc_anchor": "A plain <input /> defaults to type='text'.",
    "why_this_matters": "The input must be rendered for the user to interact with.",
    "answer_keywords": [
      "return",
      "<input"
    ],
    "seed_code": "",
    "starter_code": "",
    "feedback_correct": "Great! The input is rendered.",
    "feedback_partial": "Check that you're returning the input element.",
    "feedback_wrong": "Let's add an <input /> element in the return.",
    "expected": "Input element appears in JSX."
  },
  {
    "id": "step5",
    "type": "question",
    "phase": "Step 5 of 6",
    "paal": "Define a function inside the component that handles changes to the input. It should accept the event and update the state with the new value.",
    "hint": "Create an arrow function like (e: React.ChangeEvent<HTMLInputElement>) => { setValue(e.target.value); }.",
    "example_code": "const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {\n  setLabel(e.target.value);\n};",
    "think_prompt": "What's the correct type for a change event on an input element?",
    "mc_options": [
      "React.ChangeEvent<HTMLInputElement>",
      "React.MouseEvent",
      "Event"
    ],
    "mc_correct_option": "React.ChangeEvent<HTMLInputElement>",
    "mc_anchor": "Use React.ChangeEvent<HTMLInputElement> for input change events.",
    "why_this_matters": "We need a function to update state when the user types, with proper TypeScript typing for the event.",
    "answer_keywords": [
      "React.ChangeEvent<HTMLInputElement>",
      "target.value"
    ],
    "seed_code": "",
    "starter_code": "",
    "feedback_correct": "Perfect! The handler is typed correctly.",
    "feedback_partial": "Almost — ensure the event parameter is typed as React.ChangeEvent<HTMLInputElement>.",
    "feedback_wrong": "Let's write a handler that updates state with the input's value.",
    "expected": "Handler function is defined."
  },
  {
    "id": "step6",
    "type": "question",
    "phase": "Step 6 of 6",
    "paal": "On the input element, bind its value to the state variable and its onChange event to your handler. Also add a paragraph below to display the current value.",
    "hint": "Add value={value} and onChange={yourHandler} to the input, and render <p>Current: {value}</p>.",
    "example_code": "const [label, setLabel] = useState<string>('');\n\nconst handleLabelChange = (e: React.ChangeEvent<HTMLInputElement>) => {\n  setLabel(e.target.value);\n};\n\nreturn (\n  <div>\n    <input value={label} onChange={handleLabelChange} />\n    <p>Current: {label}</p>\n  </div>\n);",
    "think_prompt": "Which two props make an input controlled?",
    "mc_options": [
      "value and onChange",
      "defaultValue and onInput",
      "text and onUpdate"
    ],
    "mc_correct_option": "value and onChange",
    "mc_anchor": "Set value={state} and onChange={handler}.",
    "why_this_matters": "Connecting state and handler makes the input controlled — React drives its value and changes.",
    "answer_keywords": [
      "value={",
      "onChange={",
      "<p>",
      "{value}"
    ],
    "seed_code": "",
    "starter_code": "",
    "feedback_correct": "Excellent! The input is fully controlled and the value is shown.",
    "feedback_partial": "Check that you've set both value and the change handler on onChange, and added the paragraph.",
    "feedback_wrong": "Let's connect the input to state and the handler, and show the value.",
    "expected": "Input is controlled and value is displayed."
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

export default createINPACTEngine({ NODES, sideItems, lessonNum: 3, title: "Controlled Input (TypeScript)", shortName: "TS — CONTROLLED INPUT" });
