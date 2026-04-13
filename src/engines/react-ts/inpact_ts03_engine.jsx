/**
 * 🔒 LOCKED — React · TS lesson 3 — Controlled Input (TypeScript).
 * Do not change steps, copy, or evaluation without explicit product/content sign-off.
 * Generated mirror: content/generated/react-ts/003_controlled-input_lesson.json
 */
import createINPACTEngine from "../inpact_engine_shared";

const NODES = [
  {
    id: "intro",
    type: "reveal",
    phase: "Lesson",
    content: {
      tag: "LESSON #3 (TypeScript)",
      title: "Controlled Input — Typed",
      body: "In React, a controlled input is one whose value is driven by React state, not the DOM. This gives you full control over the input's behavior and validation. With TypeScript, we add precise typing to ensure our state and event handlers work correctly.",
      usecase:
        "Forms, search fields, settings panels — anywhere you need to track and validate user input in real time.",
    },
  },
  {
    id: "objectives",
    type: "objectives",
    phase: "Objectives",
    items: [
      "Create typed state for input values",
      "Write a typed change handler",
      "Connect state and handler to an input element",
      "Display the current value dynamically",
    ],
  },
  {
    id: "step1",
    type: "question",
    phase: "Step 1 of 6",
    paal: "Import React and the useState hook from the 'react' package.",
    hint: "Use a single import statement that brings in React and the named export useState.",
    example_code: "import React, { useState } from 'react';",
    think_prompt:
      "Which import statement gives us both React and the useState hook?",
    mc_options: [
      "import React, { useState } from 'react';",
      "import { useState } from 'react';",
      "import React from 'react'; import { useState } from 'react';",
    ],
    mc_correct_option: "import React, { useState } from 'react';",
    mc_anchor: "Import React and useState together in one statement.",
    why_this_matters:
      "We need React to create components and useState to manage the input's value over time.",
    answer_keywords: ["import", "React", "useState", "'react'"],
    seed_code: "",
    starter_code: "",
    feedback_correct: "Great! You've imported the essentials.",
    feedback_partial:
      "Almost — check that you're importing both React and useState.",
    feedback_wrong: "Let's try again. We need React and useState from 'react'.",
    expected: "The import line is added.",
    analog_example: "import React, { useEffect} from 'react';",
  },
  {
    id: "step2",
    type: "question",
    phase: "Step 2 of 6",
    paal: "Declare a functional component named ControlledInput with an explicit JSX.Element return type.",
    hint: "Start with 'const ControlledInput = (): JSX.Element => { }'.",
    example_code:
      "const MyButton = (): JSX.Element => { return <button>Click</button>; };",
    think_prompt:
      "What's the correct way to define a functional component in TypeScript?",
    mc_options: [
      "function MyComponent() { ... }",
      "const MyComponent = (): JSX.Element => { ... }",
      "const MyComponent = () => { ... }",
    ],
    mc_correct_option: "const MyComponent = (): JSX.Element => { ... }",
    mc_anchor:
      "Use an explicit JSX.Element return type for the component function.",
    why_this_matters:
      "Every React component needs a function definition to hold our logic and JSX.",
    answer_keywords: ["const", "ControlledInput", "JSX.Element", "=>"],
    seed_code: "",
    starter_code: "",
    feedback_correct: "Perfect! The component is ready.",
    feedback_partial:
      "Close — make sure you're using JSX.Element for TypeScript.",
    feedback_wrong: "Let's define a component with JSX.Element.",
    expected: "Component skeleton is created.",
    analog_example: "const MyComponent = () => { return <div>Hello</div>; };",
  },
  {
    id: "step3",
    type: "question",
    phase: "Step 3 of 6",
    paal: "Inside the component, declare a state variable to hold the input's current value, initialized as an empty string.",
    hint: "Call useState with a generic type <string> and an initial empty string.",
    example_code: "const [count, setCount] = useState<number>(0);",
    think_prompt:
      "How do you declare a state variable for a text input with TypeScript?",
    mc_options: [
      "const [value] = useState('');",
      "const [value, setValue] = useState<string>('');",
      "const value = useState('');",
    ],
    mc_correct_option: "const [value, setValue] = useState<string>('');",
    mc_anchor: "Use useState with a generic <string> to type the state.",
    why_this_matters:
      "We need a place to store the current text of the input, and TypeScript ensures it's always a string.",
    answer_keywords: ["useState", "<string>", "''"],
    seed_code: "",
    starter_code: "",
    feedback_correct: "Excellent! The state is typed and ready.",
    feedback_partial:
      "Almost — remember to add the <string> generic for TypeScript.",
    feedback_wrong: "Let's declare state with useState<string>('').",
    expected: "State variable and setter are declared.",
    analog_example:
      "const [isOn, setIsOn] = useState<boolean>(false); this creates a boolean state variable; however, we need a string for the input value.",
  },
  {
    id: "step4",
    type: "question",
    phase: "Step 4 of 6",
    paal: "In the component's return statement, add an input element.",
    hint: "Return <input /> from the component.",
    example_code:
      'return (\n  <div>\n    <input placeholder="Search" />\n  </div>\n);',
    think_prompt: "What JSX element represents a text input?",
    mc_options: ["<input />", "<textInput />", "<input type='text' />"],
    mc_correct_option: "<input />",
    mc_anchor: "A plain <input /> defaults to type='text'.",
    why_this_matters:
      "The input must be rendered for the user to interact with.",
    answer_keywords: ["return", "<input"],
    seed_code: "",
    starter_code: "",
    feedback_correct: "Great! The input is rendered.",
    feedback_partial: "Check that you're returning the input element.",
    feedback_wrong: "Let's add an <input /> element in the return.",
    expected: "Input element appears in JSX.",
    analog_example: 'return <input placeholder="Enter text" />;',
    deepDiveLabel:
      "An input looks like a regular HTML element — but React treats it very differently",
    deepDive: {
      hook: "You drop an `<input />` into your JSX. It renders. You type in it. Looks fine. Then you try to read what the user typed — and realise you have no idea how to get that value out of the field and into your component's logic.\n\nThis is the moment every React beginner hits with form controls. A `<div>` or `<p>` just displays what you give it. An `<input>` is a two-way street — it takes user input *and* needs to report it back. React has a specific way of handling that conversation.",

      pain: "⚠️ **Lesson:** You add `<input />` to your JSX. The user types. You try `console.log(inputValue)` — it's still the initial value. The input is rendering fine, the user is clearly typing, so why isn't your variable updating?",

      mentalModel:
        "**Mental model:** Think of a regular element like `<p>` as a **noticeboard** — React puts content on it, done. An `<input>` is more like a **two-way radio** — React sets the initial value, but the user can also transmit back through it.\n- For React to hear what the user transmits, you need three things working together:\n  1. **`value`** — locks the input to your state value. Without it, the input is *uncontrolled* — it manages its own value internally and React can't read it reliably.\n  2. **`onChange`** — fires every keystroke, handing you an event with `e.target.value` — the current text in the field.\n  3. **`name`** — not required for a single input, but essential when you have multiple fields and want to handle them with one handler using `e.target.name` to know which field changed.\n- Without `value` + `onChange` together, the input is uncontrolled — it works visually but React is blind to its contents.",

      discover:
        "**Pattern — controlled input:**\n```tsx\nconst [inputValue, setInputValue] = useState<string>('');\n\nconst handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {\n  setInputValue(e.target.value);\n};\n\n<input\n  type='text'\n  name='username'\n  value={inputValue}\n  onChange={handleChange}\n/>\n```\n- `value={inputValue}` → React owns the value — input always reflects state\n- `onChange={handleChange}` → every keystroke fires this, `e.target.value` is what's in the field right now\n- `e.target.name` → tells you *which* input fired — useful when one handler serves multiple fields\n- `React.ChangeEvent<HTMLInputElement>` → the correct event type for input `onChange` — not `MouseEvent`",

      quickRules:
        "**Quick rules:**\n- ✅ always pair `value` + `onChange` — one without the other creates a broken or read-only input\n- ❌ `value` without `onChange` → React locks the field, user can't type\n- ❌ `onChange` without `value` → uncontrolled — React can't reliably read the field's contents\n- `e.target.value` → the string currently in the input field\n- `e.target.name` → the `name` attribute of the input that fired the event\n- `type='text'` is default — but always be explicit: `'email'`, `'password'`, `'number'` change browser behaviour",

      watchOut:
        "👀 **Watch out:** Forgetting `value={inputValue}` means your input is uncontrolled — it'll look fine and the user can type freely, but your state variable never updates. You'll `console.log(inputValue)` and it'll be empty string forever. The field works visually, React is just not listening. Always pair `value` and `onChange` — they're a matched set.",

      dryRun:
        "🔁 **Think:** You have two inputs — `name` and `email` — and you want one `handleChange` handler for both. Both inputs share the same `onChange={handleChange}`. Inside the handler, how do you know which field the user just typed in — and what attribute on the input makes that possible? (Hint: `e.target.___`)",

      build:
        "**Learning focus:** Understand the difference between controlled and uncontrolled inputs — and wire an input correctly using `value`, `onChange`, and `e.target.value` so React always knows what the user has typed.",
    },
  },
  {
    id: "step5",
    type: "question",
    phase: "Step 5 of 6",
    paal: "Define a function inside the component that handles changes to the input. It should accept the event and update the state with the new value.",
    hint: "Create an arrow function like (e: React.ChangeEvent<HTMLInputElement>) => { setValue(e.target.value); }.",
    example_code:
      "const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {\n  setLabel(e.target.value);\n};",
    think_prompt:
      "What's the correct type for a change event on an input element?",
    mc_options: [
      "React.ChangeEvent<HTMLInputElement>",
      "React.MouseEvent",
      "Event",
    ],
    mc_correct_option: "React.ChangeEvent<HTMLInputElement>",
    mc_anchor:
      "Use React.ChangeEvent<HTMLInputElement> for input change events.",
    why_this_matters:
      "We need a function to update state when the user types, with proper TypeScript typing for the event.",
    answer_keywords: ["React.ChangeEvent<HTMLInputElement>", "target.value"],
    seed_code: "",
    starter_code: "",
    feedback_correct: "Perfect! The handler is typed correctly.",
    feedback_partial:
      "Almost — ensure the event parameter is typed as React.ChangeEvent<HTMLInputElement>.",
    feedback_wrong:
      "Let's write a handler that updates state with the input's value.",
    expected: "Handler function is defined.",
    analog_example:
      "const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => { console.log('Clicked'); }; while this is a valid event handler, we need a change handler for the input, which uses React.ChangeEvent<HTMLInputElement>.",
    deepDiveLabel:
      "You've handled clicks before — but a change event carries something a click never does",
    deepDive: {
      hook: "You already know the event param rule from the Counter App — only declare it if your handler body actually uses it. Your click handlers didn't need it, so you dropped it entirely.\n\nThis handler is different. The input's `onChange` fires on every keystroke — and the only way to know what the user just typed is to reach into the event object. This is the first time the event param earns its place.",

      pain: "⚠️ **Lesson:** You write `const handleChange = (): void => { setValue(???) }`. You need the new input value — but where does it come from? The input isn't a button. There's no `count + 1`. The value lives inside the event, and without the param you have no way to read it.",

      mentalModel:
        "**Mental model:** Remember the delivery note metaphor from the Counter App — React generates a note with every event, containing details about what just happened.\n- A click note says: *which element was clicked, where on screen, which mouse button*. Your counter didn't need any of that — so you dropped the param.\n- A change note says: *which input fired, what its current value is, what its name is*. Your input handler needs all of that — so you sign for the note.\n- `e.target` is the input element itself — the DOM node that fired the event.\n- `e.target.value` is the string currently inside that input — exactly what the user just typed.\n- `e.target.name` is the `name` attribute on the input — tells you *which* field fired when one handler serves multiple inputs.\n- This is why the generic matters: `React.ChangeEvent<HTMLInputElement>` tells TypeScript the target is specifically an `HTMLInputElement` — which is why `e.target.value` autocompletes and is typed as `string`, not `unknown`.",

      discover:
        "**Pattern — change handler that reads from event:**\n```tsx\nconst handleChange = (\n  e: React.ChangeEvent<HTMLInputElement>\n): void => {\n  setValue(e.target.value);\n};\n```\n- `e: React.ChangeEvent<HTMLInputElement>` → typed because we need `e.target.value`\n- `<HTMLInputElement>` → the generic that tells TS what kind of element fired — unlocks `.value`, `.name`, `.checked`\n- `e.target.value` → the string currently in the input field after this keystroke\n- `(): void` would be wrong here — unlike click handlers, this one *must* receive the event",

      quickRules:
        "**Quick rules:**\n- ✅ `React.ChangeEvent<HTMLInputElement>` → for text, email, password, number inputs\n- ✅ `React.ChangeEvent<HTMLSelectElement>` → for dropdowns\n- ✅ `React.ChangeEvent<HTMLTextAreaElement>` → for textareas\n- ❌ `React.MouseEvent` → wrong type for onChange — that's for clicks\n- ❌ plain `Event` → too generic, TypeScript can't infer `e.target.value` from it\n- rule: the generic `<HTML___Element>` in `ChangeEvent` is what unlocks the correct `.target` properties",

      watchOut:
        "👀 **Watch out:** `e.target.value` is always a `string` — even if your input is `type='number'`. If you need a number, convert it explicitly: `Number(e.target.value)` or `parseInt(e.target.value)`. Forgetting this and passing it straight into `useState<number>` will cause a TypeScript error — or worse, silent NaN bugs if you bypass the type system.",

      dryRun:
        "🔁 **Think:** You have one `handleChange` handler wired to two inputs — `name` and `email`. Both fire the same function. Inside the handler, `e.target.value` gives you what was typed — but how do you know *which field* to update in state? What property on `e.target` tells you that, and what attribute on the input element feeds it? (Hint: you set this attribute in the previous step.)",

      build:
        "**Learning focus:** Write a change handler that types the event as `React.ChangeEvent<HTMLInputElement>` and reads `e.target.value` — understanding why this event param is essential here when click handlers could drop it entirely.",
    },
  },
  {
    id: "step6",
    type: "question",
    phase: "Step 6 of 6",
    paal: "On the input element, bind its value to the state variable and its onChange event to your handler. Also add a paragraph below to display the current value.",
    hint: "Add value={value} and onChange={yourHandler} to the input, and render <p>Current: {value}</p>.",
    example_code:
      "const [label, setLabel] = useState<string>('');\n\nconst handleLabelChange = (e: React.ChangeEvent<HTMLInputElement>) => {\n  setLabel(e.target.value);\n};\n\nreturn (\n  <div>\n    <input value={label} onChange={handleLabelChange} />\n    <p>Current: {label}</p>\n  </div>\n);",
    think_prompt: "Which two props make an input controlled?",
    mc_options: [
      "value and onChange",
      "defaultValue and onInput",
      "text and onUpdate",
    ],
    mc_correct_option: "value and onChange",
    mc_anchor: "Set value={state} and onChange={handler}.",
    why_this_matters:
      "Connecting state and handler makes the input controlled — React drives its value and changes.",
    answer_keywords: ["value={", "onChange={", "<p>", "{value}"],
    seed_code: "",
    starter_code: "",
    feedback_correct:
      "Excellent! The input is fully controlled and the value is shown.",
    feedback_partial:
      "Check that you've set both value and the change handler on onChange, and added the paragraph.",
    feedback_wrong:
      "Let's connect the input to state and the handler, and show the value.",
    expected: "Input is controlled and value is displayed.",
    analog_example:
      "const [email, setEmail] = useState<string>('');\n\nconst handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {\n  setEmail(e.target.value);\n};\n\nreturn (\n  <div>\n    <input type='email' value={email} onChange={handleEmailChange} />\n    <p>Email: {email}</p>\n  </div>\n); while this example uses an email input, the same pattern applies to a text input — the key is using value and onChange to control it.",
    deepDiveLabel:
      "value and onChange are just props — so what exactly is a prop?",
    deepDive: {
      hook: "You've been writing `onClick={handler}` on buttons since lesson 1 without stopping to name what that actually is. It looks like an HTML attribute. But it's not — it's a prop.\n\nProps are how you configure any JSX element — built-in ones like `<button>` and `<input>`, or custom ones you build yourself. Every time you wrote `onClick`, `type`, or `className` on an element, you were passing props. This step is a good moment to name the thing you've already been doing — because `value` and `onChange` on your input are exactly the same mechanism.",
      pain: "⚠️ **Lesson:** You write `<input value={inputValue}>` — but you used curly braces, not quotes. In HTML you'd write `value='hello'`. In JSX you wrote `value={inputValue}`. Why the difference, and what does that change about what gets passed?",

      mentalModel:
        "**Mental model:** Think of props as the **settings panel on a component or element**.\n- Every JSX element — whether a built-in like `<input>` or a custom one like `<Counter>` — accepts props as its configuration.\n- Props with quotes: `type='text'` → you're passing a static string. Fixed. Hardcoded.\n- Props with `{}`: `value={inputValue}` → you're passing a live JavaScript expression. Dynamic. Wired to state.\n- `value={inputValue}` doesn't pass the *text* 'inputValue' — it passes whatever *value the variable inputValue holds right now*.\n- `onChange={handleChange}` doesn't call handleChange — it passes the *function itself* as a prop. React calls it later when the input fires.\n- This is the same rule you learned with `onClick` — `{}` means 'evaluate this as JavaScript', not 'treat this as a string'.",

      discover:
        "**Pattern — props in action on a controlled input:**\n```tsx\n<input\n  type='text'\n  value={inputValue}\n  onChange={handleChange}\n/>\n<p>Current: {inputValue}</p>\n```\n- `type='text'` → static prop, string in quotes — won't change\n- `value={inputValue}` → dynamic prop, live variable in `{}` — updates every render\n- `onChange={handleChange}` → function prop, passes the handler reference — React calls it on keystroke\n- `{inputValue}` in `<p>` → same `{}` rule in JSX body — renders the live value",

      quickRules:
        "**Quick rules:**\n- props in quotes `prop='value'` → static string, hardcoded\n- props in curly braces `prop={expression}` → dynamic, evaluated as JavaScript\n- `value={inputValue}` → passes the current value of the variable, not the word 'inputValue'\n- `onChange={handleChange}` → passes the function, not its result — no `()` at the end\n- every HTML attribute you know has a JSX prop equivalent — most are identical, a few are renamed (`class` → `className`, `for` → `htmlFor`)",

      watchOut:
        "👀 **Watch out:** `value='inputValue'` with quotes passes the literal string `'inputValue'` — the input will always show the text 'inputValue' and the user can never change it. `value={inputValue}` with curly braces passes the variable. One character difference, completely different behaviour — you've seen this trap before with `onClick={handler()}`. Props follow the same rule.",

      dryRun:
        "🔁 **Think:** A teammate writes `<input onChange='handleChange' />` — string quotes around the handler name. TypeScript doesn't complain immediately. But when the user types, nothing happens. Why? And what does `onChange` actually receive when you use quotes instead of curly braces? (Hint: what is the *type* of `'handleChange'` vs `{handleChange}`?)",

      build:
        "**Learning focus:** Understand that `value` and `onChange` are props — and that curly braces pass live JavaScript values while quotes pass static strings, making the difference between a wired dynamic input and a frozen one.",
    },
  },
];

const sideItems = [
  {
    label: "Lesson",
    id: "intro",
  },
  {
    label: "Objectives",
    id: "objectives",
  },
  {
    label: "Step 1",
    id: "step1",
  },
  {
    label: "Step 2",
    id: "step2",
  },
  {
    label: "Step 3",
    id: "step3",
  },
  {
    label: "Step 4",
    id: "step4",
  },
  {
    label: "Step 5",
    id: "step5",
  },
  {
    label: "Step 6",
    id: "step6",
  },
];

export default createINPACTEngine({
  NODES,
  sideItems,
  lessonNum: 3,
  title: "Controlled Input (TypeScript)",
  shortName: "TS — CONTROLLED INPUT",
});
