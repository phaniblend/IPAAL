/**
 * 🔒 LOCKED — React · TS lesson 9 — Color Picker (TypeScript).
 * Do not change steps, copy, or evaluation without explicit product/content sign-off.
 * Generated mirror: content/generated/react-ts/009_color-picker_lesson.json
 */
import createINPACTEngine from "../inpact_engine_shared";

const NODES = [
  {
    "id": "intro",
    "type": "reveal",
    "phase": "Lesson",
    "content": {
      "tag": "LESSON #9 (TypeScript)",
      "title": "Color Picker — Typed",
      "body": "You'll build a color picker component that lets users select from predefined colors and see the selected color displayed. This lesson focuses on TypeScript type safety with string literals, event handling, and conditional rendering.\n\nEach step adds one small piece of the component. Work in order: don’t mix adding a handler, building the layout, and connecting the dropdown in a single step.",
      "usecase": "Color pickers are common in design tools, form builders, and customization interfaces where users need visual feedback for their selections."
    }
  },
  {
    "id": "objectives",
    "type": "objectives",
    "phase": "Objectives",
    "items": [
      "Define typed state with string literal union types",
      "Handle change events with TypeScript event typing",
      "Conditionally apply CSS classes based on state",
      "Create reusable color option components"
    ]
  },
  {
    "id": "step1",
    "type": "question",
    "phase": "Step 1 of 6 — Imports",
    "paal": "Import the useState hook from React.",
    "hint": "You'll need the named import syntax for useState.",
    "example_code": "import { useState } from 'react';",
    "think_prompt": "Which React hook would you use to track a color value that changes when users click different options?",
    "mc_options": [
      "useEffect",
      "useState",
      "useRef"
    ],
    "mc_correct_option": "useState",
    "mc_anchor": "useState is the correct choice because we need to store and update the selected color value.",
    "why_this_matters": "React hooks like useState let components manage internal state, which is essential for tracking the user's color selection.",
    "answer_keywords": [
      "import",
      "useState",
      "from",
      "'react'"
    ],
    "seed_code": "",
    "starter_code": "",
    "feedback_correct": "Great! You've imported useState, which will let your component track state.",
    "feedback_partial": "Almost there. Check if you're using the correct import syntax for named exports.",
    "feedback_wrong": "Remember to import useState from 'react' using named import syntax.",
    "expected": "The useState import statement"
  },
  {
    "id": "step2",
    "type": "question",
    "phase": "Step 2 of 6 — Component shell",
    "paal": "Create a function component named ColorPicker that returns a div element.",
    "hint": "Define a function with the appropriate return type annotation.",
    "example_code": "const Counter = (): JSX.Element => {\n  return <div>Counter</div>;\n};",
    "think_prompt": "What TypeScript type should you use for a functional component that accepts no props?",
    "mc_options": [
      "JSX.Element as the function’s return type",
      "React.FC",
      "HTMLDivElement",
      "void"
    ],
    "mc_correct_option": "JSX.Element as the function’s return type",
    "mc_anchor": "The function returns a React element tree—put that in your signature as JSX.Element (e.g. (): JSX.Element => …).",
    "mc_wrong_feedback": {
      "React.FC": "Avoid React.FC here — it implicitly adds children to your props, which is unintended for a component that accepts no props. Use a plain function declaration instead.",
      "HTMLDivElement": "The task says ColorPicker returns a div — so that instinct makes sense. But is HTMLDivElement describing what JSX produces, or what the browser creates after React renders it? Are those the same moment in time?",
      "void": "If the function return type is void, what exactly is React getting back when it calls ColorPicker()? Can it put void on the screen?"
    },
    "why_this_matters": "You’re about to type ColorPicker with no props—the important part is what the function returns (JSX), not a DOM element type and not “nothing.” Naming that return type keeps your signature honest.",
    "answer_keywords": [
      "ColorPicker",
      ":",
      "()",
      "=>",
      "JSX.Element",
      "return",
      "<div>"
    ],
    "seed_code": "",
    "starter_code": "",
    "feedback_correct": "Perfect! You've defined the component skeleton.",
    "feedback_partial": "Check that your function returns JSX and has proper TypeScript typing.",
    "feedback_wrong": "Make sure to create a function named ColorPicker that returns a div element.",
    "expected": "A functional component definition"
  },
  {
    "id": "step3",
    "type": "question",
    "phase": "Step 3 of 6 — State & hooks",
    "paal": "Inside the component, declare state to track the selected color. Use a string literal union type for 'red', 'blue', and 'green'. Initialize with 'red'.",
    "hint": "Use useState with explicit type annotation and provide an initial value.",
    "example_code": "const [fruit, setFruit] = useState<'apple' | 'banana' | 'cherry'>('apple');",
    "think_prompt": "If your color options are 'red', 'blue', and 'green', what's the best TypeScript type for the state?",
    "mc_options": [
      "string",
      "'red' | 'blue' | 'green'",
      "Color[]"
    ],
    "mc_correct_option": "'red' | 'blue' | 'green'",
    "mc_anchor": "String literal unions provide the strongest type safety by restricting values to only valid options.",
    "why_this_matters": "TypeScript string literal unions ensure only valid color values can be stored in state, preventing bugs.",
    "answer_keywords": [
      "useState",
      "'red'",
      "'blue'",
      "'green'",
      "(",
      "'red'",
      ")"
    ],
    "seed_code": "",
    "starter_code": "",
    "feedback_correct": "Excellent! Your state is now type-safe and initialized.",
    "feedback_partial": "Check your type annotation and initial value. The union should include all three colors.",
    "feedback_wrong": "Remember to use useState with a type annotation that restricts values to 'red', 'blue', or 'green'.",
    "expected": "A useState call with proper typing"
  },
  {
    "id": "step4",
    "type": "question",
    "phase": "Step 4 of 6 — JSX (layout & select)",
    "paal": "**JSX only in this step.** In `return`, add a container `div` with: (1) a swatch `div` whose inline `style` uses `backgroundColor` from your color state variable, and (2) a `<select>` with three `<option>` values for `'red'`, `'blue'`, `'green'`. Use **`defaultValue={yourColorState}`** only—**no `onChange`**, and **do not** add a handler function in this step.",
    "hint": "Next you’ll define `handleColorSelect` in step 5, then connect it to the `<select>` in step 6.",
    "example_code": "<div>\n  <div style={{ padding: 8, border: '1px solid #ccc' }}>Selected: {pet}</div>\n  <select defaultValue={pet}>\n    <option value=\"cat\">cat</option>\n    <option value=\"dog\">dog</option>\n    <option value=\"bird\">bird</option>\n  </select>\n</div>",
    "think_prompt": "What’s the right HTML element for choosing exactly one of several fixed options (like your three colors)?",
    "mc_options": [
      "<select>",
      "<input type=\"text\">",
      "<ul>"
    ],
    "mc_correct_option": "<select>",
    "mc_anchor": "Use a `<select>` with `<option>` rows for a native dropdown; pair it with a swatch `div` so users see the current color and can pick another.",
    "why_this_matters": "The swatch answers “what’s selected?”; the dropdown answers “what can I pick?”—same pattern whether the labels are colors or something else.",
    "answer_keywords": [
      "<select",
      "<option",
      "value=",
      "selectedColor",
      "backgroundColor:",
      "style={{",
      "defaultValue"
    ],
    "seed_code": "",
    "starter_code": "",
    "feedback_correct": "Good—structure is in place; next you’ll add a typed handler, then connect `onChange` on the `<select>`.",
    "feedback_partial": "You need a container, a swatch `div` with `backgroundColor` from state, and a `<select>` with three color options and `defaultValue={selectedColor}` (no `onChange` yet).",
    "feedback_wrong": "Return a wrapper `div`, a styled swatch tied to `selectedColor`, and a `<select>` with `<option value=\"red\">` (and blue, green) and `defaultValue={selectedColor}`.",
    "expected": "JSX with swatch div and select options (structure only)"
  },
  {
    "id": "step5",
    "type": "question",
    "phase": "Step 5 of 6 — Handler",
    "paal": "**Handlers only in this step.** Below your state and above `return`, define **`handleColorSelect`** (use this exact name so step 6 matches) that takes one argument typed `'red' | 'blue' | 'green'` and calls your color setter. **Do not** edit the `return` JSX in this step—no `onChange`, no swapping `defaultValue` for `value` yet.",
    "hint": "The function body should only call your setter with the chosen color. You’ll connect this `<select>` in the next step.",
    "example_code": "const handlePetSelect = (pet: 'cat' | 'dog' | 'mouse'): void => {\n  setPet(pet);\n};",
    "think_prompt": "What’s the best parameter type for a function that only ever receives `'red'`, `'blue'`, or `'green'`?",
    "mc_options": [
      "'red' | 'blue' | 'green'",
      "string",
      "React.ChangeEvent<HTMLSelectElement>"
    ],
    "mc_correct_option": "'red' | 'blue' | 'green'",
    "mc_anchor": "Match the handler parameter to your state union so invalid colors can’t be passed in by mistake.",
    "why_this_matters": "A named handler keeps `onChange` readable and keeps the union type in one place.",
    "answer_keywords": [
      "const",
      "=",
      "(",
      "color",
      ":",
      ")",
      "=>",
      "{",
      "setSelectedColor",
      "("
    ],
    "seed_code": "",
    "starter_code": "",
    "feedback_correct": "Perfect! Your handler is properly typed and ready to update state.",
    "feedback_partial": "Check that your function parameter uses the same union type as your state.",
    "feedback_wrong": "Declare `handleColorSelect` (or the name you’ll use in `onChange`) above `return`: one argument typed `'red' | 'blue' | 'green'`, body calls your setter. The next step only connects the `<select>` to this function.",
    "expected": "A typed color handler (not yet connected)"
  },
  {
    "id": "step6",
    "type": "question",
    "phase": "Step 6 of 6 — Connect the dropdown",
    "paal": "**This is step 6 of 6.** There is **nothing new to declare** here: no new functions, no edits to the swatch.\n\n**Only** change the `<select>`:\n1. Remove `defaultValue`.\n2. Add `value={...}` bound to your color state.\n3. Add `onChange` whose **only** job is to call **`handleColorSelect`** (from step 5) with **`e.target.value`** — your handler from step 5 already types that argument as the color union.\n\nIf **`handleColorSelect` is not in your file yet**, stop: finish **step 5** first (define that function above `return`). This step does not replace step 5.",
    "hint": "The `onChange={(e) => …}` wrapper only forwards the event to the **existing** handler; it is not a second handler definition.",
    "example_code": "<select value={pet} onChange={(e) => handlePetSelect(e.target.value)}>…</select>",
    "think_prompt": "Where does the newly selected color string come from on a `<select>` change?",
    "mc_options": [
      "e.target.value",
      "e.currentTarget.checked",
      "event.key"
    ],
    "mc_correct_option": "e.target.value",
    "mc_anchor": "For `<select>`, the chosen option’s value is on the change event as `e.target.value` — pass it straight into your typed handler.",
    "why_this_matters": "Hooking `onChange` to your typed handler closes the loop: dropdown → state → swatch.",
    "answer_keywords": [
      "onChange",
      "e.target.value",
      "handleColorSelect",
      "selectedColor",
      "value=",
      "<select"
    ],
    "seed_code": "",
    "starter_code": "",
    "feedback_correct": "Excellent! Your color picker works end-to-end.",
    "feedback_partial": "Ensure the `<select>` is controlled (`value` + `onChange`) and `onChange` calls your step-5 handler with `e.target.value`.",
    "feedback_wrong": "Remove `defaultValue`, add `value` + `onChange` that forwards `e.target.value` to `handleColorSelect`—and make sure that function exists from step 5.",
    "expected": "Select onChange connected to typed color handler"
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

export default createINPACTEngine({ NODES, sideItems, lessonNum: 9, title: "Color Picker (TypeScript)", shortName: "TS — COLOR PICKER" });
