/**
 * 🔒 LOCKED — React · TS lesson 2 — Toggle visibility (TypeScript).
 * Do not change steps, copy, or evaluation without explicit product/content sign-off.
 * Generated mirror: content/generated/react-ts/002_toggle-visibility_lesson.json
 */
import createINPACTEngine from "../inpact_engine_shared";

const NODES = [
  {
    id: "intro",
    type: "reveal",
    phase: "Lesson",
    content: {
      tag: "LESSON #2 (TypeScript)",
      title: "Toggle Visibility — Typed",
      body: "Learn to create interactive UI elements that respond to user clicks while maintaining type safety throughout.",
      usecase:
        "You'll build a toggle button that shows/hides content, a common pattern in modals, accordions, and settings panels.",
    },
  },
  {
    id: "objectives",
    type: "objectives",
    phase: "Objectives",
    items: [
      "Declare typed state with useState",
      "Create type-safe event handlers",
      "Conditionally render JSX based on state",
      "Connect handlers to interactive elements",
    ],
  },
  {
    id: "step1",
    type: "question",
    phase: "Step 1 of 6",
    paal: "Import the dependencies needed to build a React component and manage state — you've done this before.",
    hint: "Think back to the Counter App — what did you need to import to make a component work and keep track of changing values?",
    example_code: "import React, { useEffect } from 'react';",
    think_prompt:
      "What do we need from React to create a component with state?",
    mc_options: [
      "Only React itself since state is built-in",
      "React and useState from 'react'",
      "React, useState, and useEffect for side effects",
    ],
    mc_correct_option: "React and useState from 'react'",
    mc_anchor:
      "We need both React (for component definition) and useState (for state management).",
    why_this_matters:
      "React provides the building blocks for components, and useState is essential for managing interactive state.",
    answer_keywords: ["import", "React", "useState", "'react'"],
    seed_code: "",
    starter_code: "",
    feedback_correct:
      "Perfect! You've imported the essential tools for building a stateful component.",
    feedback_partial:
      "You're close. Remember to import both React and useState.",
    feedback_wrong:
      "Let's try again. We need React for component creation and useState for state management.",
    expected: "The imports are declared at the top of the file.",
    analog_example: "import React, { useEffect } from 'react';",
    deepDiveLabel:
      "Feeling rusty? Quick refresher on what you imported in the Counter App and why.",
    deepDive: {
      hook: "You've seen this before. In the Counter App you needed two things from the `react` package — one to make the component work, one to make values on screen change when something happens. If that's ringing a bell, close this and trust yourself. If it's fuzzy, read on.",

      pain: "⚠️ **Lesson:** You write `import React from 'react'` and try to use `useState` — but it crashes. You imported React. Why is the hook missing?",

      mentalModel:
        "**Mental model:** The `react` package is a shelf with different tools on it.\n- `React` is the default — it's always there, no curly braces needed.\n- `useState` is a named tool sitting inside that same shelf — you have to ask for it by name using `{ }`.\n- One import statement, two picks: `import React, { useState } from 'react'`\n- The shelf hasn't changed since the Counter App. Neither has the pattern.",

      discover:
        "**Pattern — same as Counter App:**\n```tsx\nimport React, { useState } from 'react';\n```\n- `React` → default export, needed for JSX to work\n- `{ useState }` → named export, needed to declare state\n- same package, same line, same curly brace rule — nothing new here",

      dryRun:
        "🔁 **Think:** Without looking at your Counter App — what would break first if you only wrote `import React from 'react'` and tried to use `useState`? And what would break if you only wrote `import { useState } from 'react'`? (Hint: each missing piece breaks something different.)",

      build:
        "**Learning focus:** Recall and reapply the import pattern from the Counter App — recognising that the same dependency setup underlies every React component you'll ever build.",
    },
  },
  {
    id: "step2",
    type: "question",
    phase: "Step 2 of 6",
    paal: "Define a function component named ToggleVisibility that returns JSX.Element.",
    hint: "Start with 'function ToggleVisibility(): JSX.Element' or use arrow function syntax.",
    example_code: "function Counter(): JSX.Element { return <div>0</div>; }",
    think_prompt:
      "What TypeScript return type should a React component function have?",
    mc_options: ["JSX.Element", "void", "string"],
    mc_correct_option: "JSX.Element",
    mc_anchor:
      "A component that renders JSX should use an explicit JSX.Element return type on the function (or on a function declaration).",
    why_this_matters:
      "Every React component needs a proper function signature that defines its interface and return type.",
    answer_keywords: ["ToggleVisibility", "return", "<"],
    seed_code: "",
    starter_code: "",
    feedback_correct:
      "Great! You've established the component's foundation with a clear TypeScript return type.",
    feedback_partial:
      "Almost there. Give the component an explicit TypeScript return type: JSX.Element.",
    feedback_wrong:
      "Let's revisit. Define the component so it explicitly returns JSX.Element (e.g. function ToggleVisibility(): JSX.Element { ... } or const ToggleVisibility = (): JSX.Element => ...).",
    expected: "A component function is defined with proper TypeScript typing.",
    analog_example: "function Counter(): JSX.Element { return <div>0</div>; }",
  },
  {
    id: "step3",
    type: "question",
    phase: "Step 3 of 6",
    paal: "Inside the component, declare a state variable to track visibility, typed as boolean with an initial value of false.",
    hint: "Use useState<boolean>(false) to create typed state.",
    example_code: "const [count, setCount] = useState<number>(0);",
    think_prompt:
      "What TypeScript type should we use for a visibility toggle state?",
    mc_options: [
      "string ('visible' or 'hidden')",
      "boolean (true/false)",
      "number (0 or 1)",
    ],
    mc_correct_option: "boolean (true/false)",
    mc_anchor:
      "Boolean is the most semantic type for toggle states (visible = true, hidden = false).",
    why_this_matters:
      "TypeScript ensures our visibility state is always boolean, preventing runtime errors from incorrect state values.",
    answer_keywords: ["useState", "false"],
    seed_code: "",
    starter_code: "",
    feedback_correct:
      "Excellent! You've created type-safe state that will control our visibility.",
    feedback_partial:
      "Good start. Remember to type the state as boolean and initialize it to false.",
    feedback_wrong:
      "Let's adjust. We need boolean state initialized to false using useState.",
    expected:
      "A boolean state variable and its setter are declared inside the component.",
    analog_example:
      "const [count, setCount] = useState<number>(0); this example uses 'number' type for a count variable — 'toggle' state should be typed as boolean instead",
    deepDiveLabel:
      "The state is a boolean — so how do you flip it without knowing what it currently is?",
    deepDive: {
      hook: "You already know the locker model from the Counter App — `useState` hands React a value to watch, and the setter is the only key. This time the locker holds a boolean: `true` or `false`. Visible or hidden.\n\nThe interesting question isn't how to declare it — you've done that. It's how to *toggle* it. A counter always adds 1. A toggle doesn't have a fixed direction — it flips to whatever the current value is *not*. And that's where `prev => !prev` comes in.",

      pain: "⚠️ **Lesson:** You write `setIsVisible(true)` on click. It shows the content. You click again — it's still visible. `setIsVisible(true)` always sets to `true`. It doesn't flip — it just *forces*. How do you write a setter that goes whichever direction the current state isn't?",

      mentalModel:
        "**Mental model:** Remember the locker from the Counter App — `prev` is React handing you the guaranteed latest value from inside the locker before you decide what to put back.\n- For a counter you did `prev + 1` — always add one to whatever was there.\n- For a toggle you do `prev => !prev` — always flip to the opposite of whatever was there.\n- `!prev` is JavaScript's NOT operator: `!true = false`, `!false = true`.\n- You never need to know *what* the current value is — `!prev` handles both directions in one expression.\n- This is why the functional form matters here even more than in the counter: if two rapid clicks fire, each one correctly flips from the last settled value, not from a stale snapshot.",

      discover:
        "**Pattern — boolean toggle:**\n```tsx\nconst [isVisible, setIsVisible] = useState<boolean>(false);\n\nconst handleToggle = (): void => {\n  setIsVisible(prev => !prev);\n};\n```\n- `useState<boolean>(false)` → starts hidden — false means not visible yet\n- `prev => !prev` → flip whatever React hands you — no if/else needed\n- `isVisible` → read this in JSX to decide what to show\n- naming convention: `is` prefix signals this is a boolean flag — `isVisible`, `isOpen`, `isLoading`",

      quickRules:
        "**Quick rules:**\n- ✅ `setIsVisible(prev => !prev)` — always flips correctly regardless of current value\n- ❌ `setIsVisible(true)` — forces one direction, breaks the toggle on second click\n- ❌ `setIsVisible(!isVisible)` — reads the snapshot, not the guaranteed latest value\n- `useState<boolean>(false)` → false = hidden on first render, which is almost always what you want\n- `is` prefix on boolean state names is convention — `isVisible` not `visible`",

      watchOut:
        "👀 **Watch out:** `setIsVisible(!isVisible)` looks correct and will work fine for a simple toggle — but it reads `isVisible` from the render snapshot, not from React's queue. Under rapid double-clicks it can miss a flip and land on the wrong state. `prev => !prev` costs nothing extra and is always safe. Make it the habit.",

      dryRun:
        "🔁 **Think:** `isVisible` starts as `false`. The user clicks three times rapidly. With `setIsVisible(!isVisible)` all three calls read the same snapshot — what does `isVisible` end up as? Now with `setIsVisible(prev => !prev)` each call flips the previous result — what does it end up as? (Hint: the answer is different for each form.)",

      build:
        "**Learning focus:** Declare a typed boolean state and toggle it using the functional updater `prev => !prev` — so the flip is always based on the guaranteed latest value, not a stale snapshot.",
    },
  },
  {
    id: "step4",
    type: "question",
    phase: "Step 4 of 6",
    paal: "Return JSX containing a button and a content holder element that will display our toggleable content.",
    hint: "Wrap both elements in a parent container like a fragment or div.",
    example_code: "return (<><button>Click</button><div>Content</div></>);",
    think_prompt: "What JSX elements do we need for a toggle interface?",
    mc_options: [
      "Just a button that changes text",
      "A button and a content element (like a div, p, span, or heading)",
      "Multiple buttons for different states",
    ],
    mc_correct_option:
      "A button and a content element (like a div, p, span, or heading)",
    mc_anchor:
      "We need both the control (button) and a content area (any suitable element) that responds to it.",
    why_this_matters:
      "The JSX defines what users see - a button and conditional content area.",
    answer_keywords: ["button", "return"],
    seed_code: "",
    starter_code: "",
    feedback_correct:
      "Perfect structure! You've laid out the visual foundation for our toggle.",
    feedback_partial:
      "Almost. Make sure you have both a button and a content element that will hold the toggleable content.",
    feedback_wrong:
      "Let's try again. We need a button and a suitable content element for the toggleable area.",
    expected:
      "JSX with a button and a content element is returned from the component.",
    analog_example: "return (<><button>Click</button><div>Content</div></>);",
    deepDiveLabel:
      "Why can't JSX return two elements side by side — what's the one root rule about?",
    deepDive: {
      hook: "You write your toggle component's return block with a button and a div sitting next to each other. The editor immediately red-squiggles the whole return. You haven't made a typo. The JSX is valid. So why is React refusing two perfectly good elements?\n\nThis is the one root rule — and once you understand *why* it exists, you'll never forget it.",

      pain: "⚠️ **Lesson:** You write `return (<button>Toggle</button><div>Content</div>)` — two elements, both valid JSX. React throws: *'Adjacent JSX elements must be wrapped in an enclosing tag.'* Why can't a function just return two things?",

      mentalModel:
        "**Mental model:** Think of your component's `return` as a **delivery van with one loading bay**.\n- A JavaScript function can only return one value. One. Always.\n- JSX compiles down to `React.createElement()` calls — and a function call is a single expression, not two.\n- Two root elements side by side = two separate expressions = a function trying to return two values at once. JavaScript doesn't allow it.\n- A wrapper `<div>` or `<>` fragment is not decoration — it's the single box that contains both items so the van can carry them as one load.\n- The difference between the two wrappers:\n  - `<div>` → real DOM node, adds an actual element to the page\n  - `<>` → empty fragment, invisible in the DOM — wraps for React's sake without adding any HTML",

      discover:
        "**Pattern — wrapping siblings:**\n```tsx\n// ❌ two root elements — breaks\nreturn (\n  <button>Toggle</button>\n  <div>Content</div>\n);\n\n// ✅ wrapped in div — adds a real DOM node\nreturn (\n  <div>\n    <button>Toggle</button>\n    <div>Content</div>\n  </div>\n);\n\n// ✅ wrapped in fragment — no extra DOM node\nreturn (\n  <>\n    <button>Toggle</button>\n    <div>Content</div>\n  </>\n);\n```\n- use `<div>` when you need the wrapper for styling or layout\n- use `<>` when you just need to satisfy the one root rule without polluting the DOM",

      dryRun:
        "🔁 **Think:** Your toggle component returns a `<button>` and a `<p>` wrapped in a `<>` fragment. A teammate says 'just use a div, fragments are unnecessary complexity.' When would they be wrong? (Hint: think about what an extra `<div>` does to your DOM structure and whether that ever matters)",

      build:
        "**Learning focus:** Understand why JSX must return a single root element — and choose consciously between a `<div>` wrapper and a `<>` fragment based on whether you need a real DOM node or not.",
    },
  },
  {
    id: "step5",
    type: "question",
    phase: "Step 5 of 6",
    paal: "Define a function inside the component that toggles the visibility state between true and false.",
    hint: "Use arrow function syntax and the state setter with previous state.",
    example_code: "const increment = () => setCount(prev => prev + 1);",
    think_prompt: "How should we toggle a boolean state value in React?",
    mc_options: [
      "Directly assign the opposite value",
      "Use the setter function with current value",
      "Create a handler that calls the setter with !currentValue",
    ],
    mc_correct_option:
      "Create a handler that calls the setter with !currentValue",
    mc_anchor:
      "We need a handler function that toggles the boolean state using functional update pattern.",
    why_this_matters:
      "Event handlers encapsulate the logic that responds to user interactions in a type-safe way.",
    answer_keywords: ["=>", "!", "prev", ")"],
    seed_code: "",
    starter_code: "",
    feedback_correct:
      "Great handler! It cleanly encapsulates the toggle logic.",
    feedback_partial:
      "Good attempt. Make sure your handler toggles between true and false using the setter.",
    feedback_wrong:
      "Let's refine. We need a function that toggles the boolean state value.",
    expected: "A handler function is defined that toggles the boolean state.",
    analog_example:
      "const increment = () => setCount(prev => prev + 1); this example increments a number — for a toggle we want to flip a boolean instead, so we use !prev rather than prev + 1",
    deepDiveLabel:
      "The toggle logic is one line — so why does it need its own named function?",
    deepDive: {
      hook: "You already know `prev => !prev` flips the boolean. You could just write `onClick={() => setIsVisible(prev => !prev)}` directly on the button and it would work perfectly. So why pull it out into a named `handleToggle` function at all?\n\nThis is a question about code organisation, not React. And the answer matters more as your components grow.",

      pain: "⚠️ **Lesson:** Your toggle works inline on the button. A week later the same toggle needs to fire from a keyboard shortcut, a swipe gesture, and an external close button — three different places. You now have `prev => !prev` scattered in three JSX attributes. Change the logic once and you have to find all three. Named handlers exist to avoid exactly this.",

      mentalModel:
        "**Mental model:** Think of a named handler as a **single source of truth for a user intention**.\n- The intention here is *'toggle visibility'* — not *'call setIsVisible with prev => !prev'*.\n- When you name it `handleToggle`, you're saying: this is what happens when the user wants to toggle. The *how* lives in one place.\n- If the toggle logic ever needs a side effect — logging, analytics, a guard condition — you add it once in `handleToggle`, not in every JSX attribute that triggers it.\n- Inline logic is fine for throwaway one-offs. Named handlers are for intentions that might be reused or grow.",

      discover:
        "**Pattern — named toggle handler:**\n```tsx\nconst handleToggle = (): void => {\n  setIsVisible(prev => !prev);\n};\n```\n- `handleToggle` → names the *intention*, not the implementation\n- `(): void` → no event param needed, returns nothing\n- `prev => !prev` → the flip logic you already know, now lives in one place\n- wire it: `<button onClick={handleToggle}>` — reference only, no `()`",

      quickRules:
        "**Quick rules:**\n- ✅ named handler when the same action might trigger from multiple places\n- ✅ named handler when the logic might grow (guards, side effects, logging)\n- ✅ inline arrow when it's a true one-liner used exactly once and will stay that way\n- ❌ never duplicate toggle logic across multiple JSX attributes — one change will miss the others\n- handler name should describe the *user intention*: `handleToggle`, not `flipBoolean`",

      watchOut:
        "👀 **Watch out:** `onClick={handleToggle()}` — you've seen this trap before. The `()` calls it on render. Here it's especially sneaky because the toggle fires once on load, flipping `isVisible` to `true` immediately before the user does anything. Pass the reference: `onClick={handleToggle}`.",

      dryRun:
        "🔁 **Think:** Your `handleToggle` currently just flips state. Your PM now asks: 'Can we log every toggle to analytics?' Where do you add that one line — and how many places would you have had to change if you'd used inline logic on three different buttons instead?",

      build:
        "**Learning focus:** Extract toggle logic into a named handler function — understanding that named handlers are about organising *user intentions*, not just wrapping single lines.",
    },
  },
  {
    id: "step6",
    type: "question",
    phase: "Step 6 of 6",
    paal: "Wire the toggle handler to the button's click event and conditionally show the content div only when visibility state is true.",
    hint: "Use onClick for the button and conditional rendering (&&) for the div.",
    example_code:
      "<button onClick={increment}>Add</button>{showDetails && <div>Details</div>}",
    think_prompt: "How do we make the UI respond to our state and handler?",
    mc_options: [
      "Call the handler directly in JSX",
      "Connect handler to button click and conditionally render content",
      "Just declaring them is enough - React auto-wires",
    ],
    mc_correct_option:
      "Connect handler to button click and conditionally render content",
    mc_anchor:
      "We need to attach the handler to the button and make content appear only when state is true.",
    why_this_matters:
      "Wiring state and handlers to JSX creates the interactive experience users expect.",
    answer_keywords: ["onClick", "{", "&&", "}"],
    seed_code: "",
    starter_code: "",
    feedback_correct:
      "Perfect! You've created a fully functional, type-safe toggle component!",
    feedback_partial:
      "Close! Make sure both the click handler and conditional rendering are implemented.",
    feedback_wrong:
      "Let's complete the wiring. Connect handler to button and conditionally show content.",
    expected:
      "Button triggers toggle on click, content appears only when visible.",
    analog_example: `<button onClick={handleToggle}>Toggle</button>{isVisible && <div>Content</div>}`,
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
  lessonNum: 2,
  title: "Toggle Visibility (TypeScript)",
  shortName: "TS — TOGGLE VISIBILITY",
});
