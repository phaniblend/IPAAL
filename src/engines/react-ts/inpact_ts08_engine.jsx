import createINPACTEngine from "../inpact_engine_shared";

const NODES = [
  {
    "id": "intro",
    "type": "reveal",
    "phase": "Lesson",
    "content": {
      "tag": "LESSON #8 (TypeScript)",
      "title": "Forms & Validation — Typed",
      "body": "Forms are the primary way users interact with your application. TypeScript ensures your form data is predictable and validated at compile time, preventing runtime errors and improving developer experience.",
      "usecase": "You're building a sign-up form for a new service. Users need to provide their name, email, and password with real-time validation feedback."
    }
  },
  {
    "id": "objectives",
    "type": "objectives",
    "phase": "Objectives",
    "items": [
      "Create typed form state with useState",
      "Handle input changes with TypeScript event types",
      "Implement real-time validation with error state",
      "Conditionally render validation feedback"
    ]
  },
  {
    "id": "step1",
    "type": "question",
    "phase": "Step 1 of 8",
    "paal": "Import React and the useState hook from the react package.",
    "hint": "You need two imports: React and useState from 'react'.",
    "example_code": "import React, { useEffect } from 'react';",
    "think_prompt": "What's the primary purpose of useState in a form component?",
    "mc_options": [
      "To handle form submission to a server",
      "To manage and update form field values as the user types",
      "To style form elements dynamically"
    ],
    "mc_correct_option": "To manage and update form field values as the user types",
    "mc_anchor": "useState tracks form field values as they change, enabling reactive updates.",
    "why_this_matters": "React provides the foundation for building components, and useState lets us manage form state that changes over time.",
    "answer_keywords": [
      "import",
      "React",
      "useState",
      "from",
      "'react'"
    ],
    "seed_code": "",
    "starter_code": "",
    "feedback_correct": "Perfect! You've imported the essential React tools.",
    "feedback_partial": "You're close. Check if you imported both React and useState.",
    "feedback_wrong": "Remember to import both React and useState from 'react'.",
    "expected": "The component will have access to React and useState."
  },
  {
    "id": "step2",
    "type": "question",
    "phase": "Step 2 of 8",
    "paal": "Create a functional component named SignUpForm that returns JSX.Element.",
    "hint": "Use the function keyword or arrow function with proper TypeScript return type.",
    "example_code": "const MyComponent = (): JSX.Element => { return <div>Hello</div>; };",
    "think_prompt": "What TypeScript type should a functional component return?",
    "mc_options": [
      "JSX.Element",
      "string",
      "HTMLElement"
    ],
    "mc_correct_option": "JSX.Element",
    "mc_anchor": "Functional components in TypeScript typically return JSX.Element.",
    "why_this_matters": "Every React form needs a component container. TypeScript ensures our component has proper typing from the start.",
    "answer_keywords": [
      "SignUpForm",
      "JSX.Element",
      "return"
    ],
    "seed_code": "",
    "starter_code": "",
    "feedback_correct": "Great! Your component is properly typed.",
    "feedback_partial": "Almost there. Make sure your component returns JSX.Element.",
    "feedback_wrong": "Create a function component that returns JSX.Element.",
    "expected": "A component skeleton ready for form logic."
  },
  {
    "id": "step3",
    "type": "question",
    "phase": "Step 3 of 8",
    "paal": "Inside the component (before any logic), define an interface for the form state with name, email, and password fields, all typed as strings.",
    "hint": "Create an interface with three string properties.",
    "example_code": "interface User { id: number; username: string; };",
    "think_prompt": "Why define an interface for form state instead of using inline types?",
    "mc_options": [
      "Interfaces are required by React",
      "Interfaces make the code run faster",
      "Interfaces provide reusable, self-documenting type definitions",
      "Multiple parts of your component — state, handlers, props — need to agree on the same shape. A named interface is the single source of truth; inline types force you to repeat or drift."
    ],
    "mc_correct_option": "Multiple parts of your component — state, handlers, props — need to agree on the same shape. A named interface is the single source of truth; inline types force you to repeat or drift.",
    "mc_anchor": "Correct: Without a named interface, you'd have to duplicate { email: string; password: string } in your useState, your submit handler, and anywhere else that touches that data. One rename breaks everything. The interface creates a single contract — change it once, TypeScript catches every mismatch automatically.",
    "why_this_matters": "TypeScript interfaces document the shape of your form data, making it clear what fields exist and their expected types.",
    "answer_keywords": [
      "interface",
      "name:",
      "email:",
      "password:",
      "string"
    ],
    "seed_code": "",
    "starter_code": "",
    "feedback_correct": "Excellent! Your interface clearly defines the form structure.",
    "feedback_partial": "Check that all three fields are present and typed as strings.",
    "feedback_wrong": "Define an interface with name, email, and password as string properties.",
    "expected": "A typed interface describing the form's data structure."
  },
  {
    "id": "step4",
    "type": "question",
    "phase": "Step 4 of 8",
    "paal": "Use useState to create form state, typed with your interface, initialized with empty strings for all fields.",
    "hint": "Call useState with an object containing empty string values.",
    "example_code": "const [count, setCount] = useState<number>(0);",
    "think_prompt": "What should the initial form state typically be?",
    "mc_options": [
      "null values for all fields",
      "Empty strings or default values matching the interface",
      "Random generated data"
    ],
    "mc_correct_option": "Empty strings or default values matching the interface",
    "mc_anchor": "Form state should initialize with values that match the interface structure.",
    "why_this_matters": "useState with proper typing ensures your form starts with valid initial values and prevents type errors during updates.",
    "answer_keywords": [
      "useState",
      "{",
      "name:",
      "email:",
      "password:",
      "''"
    ],
    "seed_code": "",
    "starter_code": "",
    "feedback_correct": "Perfect! Your form state is properly typed and initialized.",
    "feedback_partial": "Make sure you're using your interface to type the state.",
    "feedback_wrong": "Use useState with your interface type and initialize all fields as empty strings.",
    "expected": "Typed form state with empty initial values."
  },
  {
    "id": "step5",
    "type": "question",
    "phase": "Step 5 of 8",
    "paal": "In the component's return statement, create a form element with three input fields for name, email, and password.",
    "hint": "Use <form> with <input> elements inside.",
    "example_code": "<form><input type='text' /><button>Submit</button></form>",
    "think_prompt": "Which HTML element should wrap related form inputs?",
    "mc_options": [
      "<div>",
      "<form>",
      "<section>"
    ],
    "mc_correct_option": "<form>",
    "mc_anchor": "The <form> element semantically groups inputs and handles submission events.",
    "why_this_matters": "The visual structure provides users with input fields to interact with. Semantic HTML improves accessibility.",
    "answer_keywords": [
      "<form",
      "<input",
      "type=",
      "text",
      "email",
      "password"
    ],
    "seed_code": "",
    "starter_code": "",
    "feedback_correct": "Great! Your form structure is semantically correct.",
    "feedback_partial": "Make sure you're using <form> and three <input> elements.",
    "feedback_wrong": "Return a <form> with three <input> elements for name, email, and password.",
    "expected": "Basic form structure with three input fields."
  },
  {
    "id": "step6",
    "type": "question",
    "phase": "Step 6 of 8",
    "paal": "Create a handleChange function that updates the corresponding form field when any input changes.",
    "hint": "The function should accept a ChangeEvent<HTMLInputElement> and update state using the input's name and value.",
    "example_code": "const handleInput = (e: ChangeEvent<HTMLInputElement>) => { setValue(e.target.value); };",
    "think_prompt": "What TypeScript type should we use for input change events?",
    "mc_options": [
      "Event",
      "ChangeEvent<HTMLInputElement>",
      "MouseEvent"
    ],
    "mc_correct_option": "ChangeEvent<HTMLInputElement>",
    "mc_anchor": "ChangeEvent<HTMLInputElement> provides type-safe access to the input's value property.",
    "why_this_matters": "Event handlers connect user input to state updates. TypeScript ensures we handle events with proper typing.",
    "answer_keywords": [
      "handleChange",
      "ChangeEvent<HTMLInputElement>",
      "e.target.name",
      "e.target.value"
    ],
    "seed_code": "",
    "starter_code": "",
    "feedback_correct": "Excellent! Your handler is properly typed and functional.",
    "feedback_partial": "Check that your handler uses e.target.name to update the correct field.",
    "feedback_wrong": "Create a function that accepts ChangeEvent<HTMLInputElement> and updates state based on e.target.name and e.target.value.",
    "expected": "A typed change handler function."
  },
  {
    "id": "step7",
    "type": "question",
    "phase": "Step 7 of 8",
    "paal": "Wire each input to display the corresponding form state value and call your change handler on input events.",
    "hint": "Add value and onChange attributes to each input.",
    "example_code": "<input value={text} onChange={handleTextChange} />",
    "think_prompt": "What two attributes create a controlled input in React?",
    "mc_options": [
      "value and onChange",
      "defaultValue and onInput",
      "text and onUpdate"
    ],
    "mc_correct_option": "value and onChange",
    "mc_anchor": "value binds input to state, onChange updates state when user types.",
    "why_this_matters": "Two-way binding ensures the input displays current state and updates state on change, creating a controlled component.",
    "answer_keywords": [
      "value={",
      "onChange={",
      "name="
    ],
    "seed_code": "",
    "starter_code": "",
    "feedback_correct": "Perfect! Your form is now fully controlled.",
    "feedback_partial": "Make sure each input has both value and onChange attributes.",
    "feedback_wrong": "Add value={formState.field} and onChange={handleChange} to each input, with matching name attributes.",
    "expected": "Inputs that display and update form state."
  },
  {
    "id": "step8",
    "type": "question",
    "phase": "Step 8 of 8",
    "paal": "Add validation that displays an error message if the email doesn't contain '@' or if the password is less than 6 characters.",
    "hint": "Create validation logic and conditionally render error messages near the inputs.",
    "example_code": "{password.length < 6 && <p>Password too short</p>}",
    "think_prompt": "When should validation typically run in a form?",
    "mc_options": [
      "Only on form submission",
      "As the user types (real-time)",
      "When the page loads"
    ],
    "mc_correct_option": "As the user types (real-time)",
    "mc_anchor": "Real-time validation provides immediate feedback, reducing user frustration.",
    "why_this_matters": "Immediate feedback helps users correct errors before submission, improving user experience.",
    "answer_keywords": [
      "includes('@')",
      "length",
      ">= 6",
      "&&",
      "<p>",
      "</p>"
    ],
    "seed_code": "",
    "starter_code": "",
    "feedback_correct": "Excellent! Your form now provides helpful validation feedback.",
    "feedback_partial": "Make sure your validation runs on each change and messages appear conditionally.",
    "feedback_wrong": "Add validation that shows errors when email lacks '@' or password is too short.",
    "expected": "Conditional error messages based on input validity."
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
  },
  {
    "label": "Step 8",
    "id": "step8"
  }
];

export default createINPACTEngine({ NODES, sideItems, lessonNum: 8, title: "Forms & Validation (TypeScript)", shortName: "TS — FORMS & VALIDATION" });
