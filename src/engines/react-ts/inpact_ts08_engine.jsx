/**
 * 🔒 LOCKED — React · TS lesson 8 — Forms & Validation (TypeScript).
 * Do not change steps, copy, or evaluation without explicit product/content sign-off.
 * Generated mirror: content/generated/react-ts/008_forms-validation_lesson.json
 */
import createINPACTEngine from "../inpact_engine_shared";

const NODES = [
  {
    "id": "intro",
    "type": "reveal",
    "phase": "Lesson",
    "content": {
      "tag": "LESSON #8 (TypeScript)",
      "title": "Forms & Validation — Typed",
      "body": "You’ll build a small sign-up form: typed state, controlled inputs, and validation the user sees right away—not after submit.",
      "usecase": "Sign-up and profile forms are everywhere; getting state, events, and validation right here carries directly into production apps."
    }
  },
  {
    "id": "objectives",
    "type": "objectives",
    "phase": "Objectives",
    "items": [
      "Model form data with a TypeScript interface and object state",
      "Type change handlers with ChangeEvent<HTMLInputElement>",
      "Wire controlled inputs (value + onChange) to that state",
      "Show inline validation errors as the user types"
    ]
  },
  {
    "id": "step1",
    "type": "question",
    "phase": "Step 1 of 8",
    "paal": "At the top of the file, import React and the useState hook from the `react` package.",
    "hint": "Use a single import: default `React` plus the named hook `useState` from `'react'`.",
    "example_code": "import React, { useMemo } from 'react';",
    "think_prompt": "You're building a form component that needs to remember what the user is typing. React has a hook for exactly this. Which one do you reach for?",
    "mc_options": [
      "useEffect — runs side effects after render",
      "useRef — grabs a direct reference to a DOM element",
      "useState — holds and updates a value between renders"
    ],
    "mc_correct_option": "useState — holds and updates a value between renders",
    "mc_anchor": "For values that change as the user types, `useState` is the hook: it stores state and triggers re-renders when you update it—exactly what controlled inputs need.",
    "why_this_matters": "React comes with built-in tools called hooks that help you manage things like state, side effects, and shared logic.Your job isn't to build state management from scratch — it's to know which hook to reach for and bring it in. Imports are how you claim that work.",
    "answer_keywords": [
      "import",
      "React",
      "useState",
      "from",
      "'react'"
    ],
    "seed_code": "",
    "starter_code": "",
    "feedback_correct": "Good—`React` and `useState` are in place. Next you’ll define the `FormState` interface for your fields.",
    "feedback_partial": "You still need both: default `React` and named `useState` from `'react'`.",
    "feedback_wrong": "Add: `import React, { useState } from 'react'` (or equivalent with both names from `'react'`).",
    "expected": "A valid import line that brings in `React` and `useState`."
  },
  {
    "id": "step2",
    "type": "question",
    "phase": "Step 2 of 8",
    "paal": "Below your imports, define a `FormState` interface at **module scope** with `name`, `email`, and `password`, each typed as `string`. Declare it outside any component—not inside a function body.",
    "hint": "Use `interface FormState { … }` below the import line; field names should match the input `name` attributes you’ll use later. You’ll add `SignUpForm` in the next step.",
    "example_code": "interface User { id: number; username: string; };",
    "think_prompt": "Why define an interface for form state instead of using inline types?",
    "mc_options": [
      "Interfaces are required by React",
      "Interfaces make the code run faster",
      "Interfaces provide reusable, self-documenting type definitions",
      "Multiple parts of your component — state, handlers, props — need to agree on the same shape. A named interface is the single source of truth; inline types force you to repeat or drift."
    ],
    "mc_correct_option": "Multiple parts of your component — state, handlers, props — need to agree on the same shape. A named interface is the single source of truth; inline types force you to repeat or drift.",
    "mc_anchor": "One named interface is the shared contract: state, handlers, and future props can all reference FormState instead of repeating or drifting inline shapes. At module scope it is defined once, easy to export, and matches typical TypeScript project layout.",
    "why_this_matters": "In TypeScript, an interface describes the shape of your data — what fields exist and what type each field is. Think of it as a contract: anything that uses this data must follow the same rules. Instead of describing the shape every time you use it, you define it once and reference it by name everywhere.",
    "answer_keywords": [
      "interface",
      "name:",
      "email:",
      "password:",
      "string"
    ],
    "seed_code": "",
    "starter_code": "",
    "feedback_correct": "Good—`FormState` is at module scope and names the three fields you’ll bind to inputs and state.",
    "feedback_partial": "Declare `interface FormState` with `name`, `email`, and `password` as `string`—at file level, not inside a component.",
    "feedback_wrong": "Add `interface FormState { name: string; email: string; password: string; }` below your imports (not inside a component).",
    "expected": "A module-level `FormState` interface with your three string fields."
  },
  {
    "id": "step3",
    "type": "question",
    "phase": "Step 3 of 8",
    "paal": "Define a component named `SignUpForm` that renders JSX and declares an explicit return type of `JSX.Element`. Place it **below** your `FormState` interface.",
    "hint": "Either an arrow component `const SignUpForm = (): JSX.Element => …` or `function SignUpForm(): JSX.Element { … }` works.",
    "example_code": "const MyComponent = (): JSX.Element => { return <div>Hello</div>; };",
    "think_prompt": "What TypeScript type should a functional component return?",
    "mc_options": [
      "JSX.Element",
      "string",
      "HTMLElement"
    ],
    "mc_correct_option": "JSX.Element",
    "mc_anchor": "`JSX.Element` is what you actually return from `<form>…</form>`—so the signature matches the UI.",
    "why_this_matters": "The component is the shell: everything else (state, handlers, inputs) will live inside it.",
    "answer_keywords": [
      "SignUpForm",
      "JSX.Element",
      "return"
    ],
    "seed_code": "",
    "starter_code": "",
    "feedback_correct": "Nice—`SignUpForm` is declared with a clear `JSX.Element` return. You can add state and markup next.",
    "feedback_partial": "Check the name `SignUpForm` and an explicit `: JSX.Element` (or equivalent) on the function.",
    "feedback_wrong": "Declare `SignUpForm` so it returns JSX and type the return as `JSX.Element`.",
    "expected": "A typed `SignUpForm` component you can add hooks and JSX inside."
  },
  {
    "id": "step4",
    "type": "question",
    "phase": "Step 4 of 8",
    "paal": "Create state with `useState<FormState>` and initialize `{ name: '', email: '', password: '' }`.",
    "hint": "Destructure as `[formState, setFormState]`—the initial object must satisfy `FormState`.",
    "example_code": "const [count, setCount] = useState<number>(0);",
    "think_prompt": "What should the initial form state typically be?",
    "mc_options": [
      "null values for all fields",
      "Empty strings or default values matching the interface",
      "Random generated data"
    ],
    "mc_correct_option": "Empty strings or default values matching the interface",
    "mc_anchor": "Empty strings (or other defaults) should still satisfy `FormState`—no missing keys.",
    "why_this_matters": "Typed `useState` means every update must produce a full `FormState` object (or you spread from `prev`).",
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
    "feedback_correct": "Good—starting from empty strings matches typical sign-up defaults and pairs with controlled inputs.",
    "feedback_partial": "Use `useState<FormState>` and an initial object with `name`, `email`, and `password` set to `''`.",
    "feedback_wrong": "Try: `const [formState, setFormState] = useState<FormState>({ name: '', email: '', password: '' });`.",
    "expected": "`formState` / `setFormState` typed as `FormState`, all fields initially `''`."
  },
  {
    "id": "step5",
    "type": "question",
    "phase": "Step 5 of 8",
    "paal": "Return a `<form>` with three inputs: name (text), email (`type=\"email\"`), and password (`type=\"password\"`). Give each input a `name` that matches your state keys.",
    "hint": "Semantic types (`email`, `password`) help browsers and accessibility; `name` will pair with your handler.",
    "example_code": "<form><input type='text' /><button>Submit</button></form>",
    "think_prompt": "Which HTML element should wrap related form inputs?",
    "mc_options": [
      "<div>",
      "<form>",
      "<section>"
    ],
    "mc_correct_option": "<form>",
    "mc_anchor": "`<form>` groups related controls; native behavior (e.g. Enter to submit) and assistive tech expect it.",
    "why_this_matters": "You’re laying out the fields you’ll control with `value` / `onChange` in the next steps.",
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
    "feedback_correct": "Good—three inputs with sensible `type`s and `name`s set you up for one shared change handler.",
    "feedback_partial": "Wrap fields in `<form>` and include three `<input>` elements with `text`, `email`, and `password` as appropriate.",
    "feedback_wrong": "Return `<form>…</form>` with three inputs; use `name=\"name\"`, `name=\"email\"`, `name=\"password\"` (or consistent names matching state).",
    "expected": "A `<form>` containing three labeled inputs ready to wire to state."
  },
  {
    "id": "step6",
    "type": "question",
    "phase": "Step 6 of 8",
    "paal": "Add a `handleChange` that takes `ChangeEvent<HTMLInputElement>` and updates `formState` using `e.target.name` and `e.target.value` (spread the previous state so other fields stay intact).",
    "hint": "`setFormState(prev => ({ ...prev, [e.target.name]: e.target.value }))` keeps one handler for all named inputs.",
    "example_code": "// Object state — update one key; handler is wired to inputs with name= matching state keys; preserve the rest\nconst handleNameInput = (e: ChangeEvent<HTMLInputElement>) => {\n  setFormState(prev => ({ ...prev, [e.target.name]: e.target.value }));\n};",
    "think_prompt": "What TypeScript type should we use for input change events?",
    "mc_options": [
      "Event",
      "ChangeEvent<HTMLInputElement>",
      "MouseEvent"
    ],
    "mc_correct_option": "ChangeEvent<HTMLInputElement>",
    "mc_anchor": "`ChangeEvent<HTMLInputElement>` narrows `target` to an input so `value` and `name` are available with correct types.",
    "why_this_matters": "One typed handler can serve every field as long as `name` matches a key on `FormState`.",
    "answer_keywords": [
      "handleChange",
      "ChangeEvent<HTMLInputElement>",
      "e.target.name",
      "e.target.value"
    ],
    "seed_code": "",
    "starter_code": "",
    "feedback_correct": "Good—typed event + dynamic key update is the usual pattern for multi-field forms.",
    "feedback_partial": "Ensure the parameter type is `ChangeEvent<HTMLInputElement>` and state updates use both `e.target.name` and `e.target.value`.",
    "feedback_wrong": "Define `handleChange` with `ChangeEvent<HTMLInputElement>` and merge `e.target.value` into state under `[e.target.name]`.",
    "expected": "A `handleChange` that updates the matching `FormState` key without dropping the others."
  },
  {
    "id": "step7",
    "type": "question",
    "phase": "Step 7 of 8",
    "paal": "Make each input controlled: set `value` from `formState` and `onChange={handleChange}`. Keep `name` aligned with your state keys (`name`, `email`, `password`).",
    "hint": "Pattern per field: `value={formState.email}` and `name=\"email\"` (and likewise for the others).",
    "example_code": "<input value={text} onChange={handleTextChange} />",
    "think_prompt": "What two attributes create a controlled input in React?",
    "mc_options": [
      "value and onChange",
      "defaultValue and onInput",
      "text and onUpdate"
    ],
    "mc_correct_option": "value and onChange",
    "mc_anchor": "`value` shows what’s in state; `onChange` writes user input back—together they keep a single source of truth.",
    "why_this_matters": "Controlled inputs let validation and UI stay in sync because every keystroke flows through React state.",
    "answer_keywords": [
      "value={",
      "onChange={",
      "name="
    ],
    "seed_code": "",
    "starter_code": "",
    "feedback_correct": "Nice—state drives what’s on screen, and typing flows back through `handleChange`.",
    "feedback_partial": "Each input needs `value={…}`, `onChange={handleChange}`, and a `name` that matches a `FormState` key.",
    "feedback_wrong": "Bind `value` to `formState.<field>`, pass `onChange={handleChange}`, and set `name` to the same key string.",
    "expected": "Three controlled inputs reading from and writing to `formState`."
  },
  {
    "id": "step8",
    "type": "question",
    "phase": "Step 8 of 8",
    "paal": "Show inline errors as the user types: if email doesn’t include `'@'`, or password has fewer than 6 characters, render a short message (e.g. under that field).",
    "hint": "Derive booleans from `formState.email` / `formState.password` and use `&&` or a ternary to show `<p>` (or similar) only when invalid.",
    "example_code": "{!email.includes('@') && <p>Invalid email</p>}\n{pwd.length < 6 && <p>Password too short</p>}",
    "think_prompt": "When should validation typically run in a form?",
    "mc_options": [
      "Only on form submission",
      "As the user types (real-time)",
      "When the page loads"
    ],
    "mc_correct_option": "As the user types (real-time)",
    "mc_anchor": "Validating while typing surfaces problems before submit—users fix issues in context.",
    "why_this_matters": "Because inputs are controlled, you can recompute validity on every render from current state.",
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
    "feedback_correct": "Good—you’re reflecting rules in the UI as state changes, which is how most product forms behave.",
    "feedback_partial": "Check both rules: email must include `@`; password `length` must be at least 6. Show messages when they fail.",
    "feedback_wrong": "Conditionally render errors when `!formState.email.includes('@')` or `formState.password.length < 6` (or equivalent).",
    "expected": "Visible, inline feedback for email format and password length."
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
