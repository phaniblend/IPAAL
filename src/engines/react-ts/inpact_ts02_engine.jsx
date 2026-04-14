/**
 * 🔒 LOCKED — React · TS lesson 2 — Toggle Visibility (TypeScript).
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
      body: "A counter always moves in one direction — up or down. A toggle is different. It doesn't have a fixed direction — it flips to whatever the current state is *not*. Visible becomes hidden. Hidden becomes visible. One piece of boolean state, one handler, and the UI responds.\n\nThis lesson introduces two ideas that build on the counter: boolean state typed with `useState<boolean>`, and conditional rendering — showing different JSX depending on what state currently holds. These two tools together power modals, accordions, dropdowns, drawers, and every show/hide interaction you'll ever build.",
      usecase:
        "You'll build a ToggleVisibility component with a button that shows and hides a content block. Every click flips a boolean. The JSX reads that boolean and decides what to render. By the end you'll have the full click → state → render cycle working with a boolean, and you'll understand why `prev => !prev` is always the right way to flip it.",
    },
  },
  {
    id: "objectives",
    type: "objectives",
    phase: "Objectives",
    items: [
      "Declare a boolean state variable using useState<boolean>",
      "Toggle boolean state correctly using the functional updater prev => !prev",
      "Return JSX with a single root element — choosing between div and fragment",
      "Write a named handler function and understand when inline logic is sufficient",
      "Conditionally render JSX using && and ternary — and choose between them",
      "Wire a handler to onClick without calling it on render",
    ],
  },
  {
    id: "step1",
    type: "question",
    phase: "Step 1 of 6",
    paal: "Import the dependencies needed to build a React component that manages state — you've done this before.",
    hint: "One hook, one named export, one import statement. Same pattern as lesson 1.",
    example_code: "import { useEffect } from 'react';",
    think_prompt:
      "Which import gives the component access to useState so it can track whether the content is visible?",
    mc_options: [
      "import React, { useState } from 'react'",
      "import { useState } from 'react'",
      "import useState from 'react'",
    ],
    mc_correct_option: "import { useState } from 'react'",
    mc_anchor:
      "useState is a named export — it lives inside curly braces. One hook, one import statement.",
    why_this_matters:
      "The import pattern doesn't change between lessons — useState is always a named export from 'react'. What changes is which hooks you need and what type of state they hold. This lesson needs one: useState for the boolean visibility flag.",
    answer_keywords: ["import", "{", "useState", "}", "from", "'react'"],
    seed_code: "",
    starter_code: "",
    feedback_correct:
      "Exactly — curly braces, named export, from 'react'. useState is always imported this way regardless of what type of state it holds.",
    feedback_partial:
      "You have useState but check the syntax — named exports go inside curly braces: `{ useState }`.",
    feedback_wrong:
      "useState is a named export, not the default. It needs curly braces: `import { useState } from 'react'`.",
    expected: "import { useState } from 'react';",
    analog_example: "import { useEffect } from 'react';",
    deepDiveLabel:
      "Same import, new component — the pattern doesn't change, only which hooks you need",
    deepDive: {
      hook: "The import line for this lesson is identical to lesson 1. That's deliberate — the named export pattern for hooks never changes. What changes is what you do with `useState` once it's in scope.\n\nIf writing `import { useState } from 'react'` already felt automatic, exit here. If anything felt uncertain, the mental model below is worth a minute.",
      pain: "⚠️ **Lesson:** You write `import { useState } from 'react'` — identical to lesson 1. But this component holds a boolean, not a number. Does the import change? Does anything about the hook signature change? Or is useState always useState, regardless of what type of state it holds?",
      mentalModel:
        "**Mental model:** The toolbox shelf doesn't reorganise based on what you're building.\n- `useState` is always in the same place — named export, curly braces, from `'react'`.\n- What changes between components is the *type* and *initial value* inside the component.\n- A counter uses `useState<number>(0)`. A toggle uses `useState<boolean>(false)`. The import line is identical.\n- The shelf stays the same. You just reach for different things once you're inside the component.",
      discover:
        "**Pattern — same import, different state:**\n```tsx\n// counter app — lesson 1\nimport { useState } from 'react';\nconst [count, setCount] = useState<number>(0);\n\n// toggle app — this lesson, same import\nimport { useState } from 'react';\nconst [isVisible, setIsVisible] = useState<boolean>(false);\n```\n- the import line is identical in both\n- what varies is the generic type and initial value inside the component\n- one import pattern covers every useState use case across every lesson",
      quickRules:
        "**Quick rules:**\n- ✅ `import { useState } from 'react'` — same line every lesson\n- ❌ `import React, { useState } from 'react'` — React is unused in React 17+ projects\n- ❌ `import useState from 'react'` — no braces, wrong slot in the module\n- if you need two hooks: `import { useState, useEffect } from 'react'` — comma-separated, one statement\n- never two import lines from the same package",
      watchOut:
        "👀 **Watch out:** If you need more than one hook later — say useState and useEffect — add them comma-separated in the same import: `import { useState, useEffect } from 'react'`. One import statement, as many named exports as you need. Never write two separate import lines from the same package.",
      dryRun:
        "🔁 **Think:** This component needs useState. A later component needs useState and useEffect. Write the import line for each. Now write a single import line that covers both at once. Which is cleaner — and why would a linter flag the two-line version?",
      build:
        "**Learning focus:** Recognise that the named import pattern for hooks is fixed and transferable — the import line stays the same across every component, and only the generic type and initial value change inside the component body.",
    },
  },
  {
    id: "step2",
    type: "question",
    phase: "Step 2 of 6",
    paal: "Define a functional component named ToggleVisibility that returns JSX.Element. Place it below your import.",
    hint: "Same shell pattern from lesson 1 — arrow function or function declaration, explicit return type, empty fragment as placeholder.",
    example_code: "const Counter = (): JSX.Element => { return <></>; }",
    think_prompt:
      "What TypeScript return type should a React component that renders JSX declare?",
    mc_options: [
      "void — the component doesn't return anything useful",
      "JSX.Element — the component promises to return valid JSX",
      "HTMLElement — the component returns a DOM element",
    ],
    mc_correct_option:
      "JSX.Element — the component promises to return valid JSX",
    mc_anchor:
      "JSX.Element is what the component actually returns — the return type annotation makes that contract explicit and TypeScript-enforced.",
    why_this_matters:
      "The component shell is the container. Every state declaration, every handler, and all the JSX lives inside this function. Declaring `: JSX.Element` means TypeScript checks that the function always returns valid JSX — it can't accidentally return undefined or a string.",
    answer_keywords: ["ToggleVisibility", "JSX.Element", "return"],
    seed_code: "",
    starter_code: "",
    feedback_correct:
      "JSX.Element is the contract — this function always returns renderable JSX. State, handler, and markup all go inside from here.",
    feedback_partial:
      "Close — make sure the return type is explicitly `: JSX.Element` and the name is exactly `ToggleVisibility`.",
    feedback_wrong:
      "A component that renders JSX should declare `JSX.Element` as its return type: `const ToggleVisibility = (): JSX.Element => { return <></>; }`",
    expected:
      "const ToggleVisibility = (): JSX.Element => { return <></>; }",
    analog_example: "const LoginForm = (): JSX.Element => { return <></>; }",
  },
  {
    id: "step3",
    type: "question",
    phase: "Step 3 of 6",
    paal: "Inside the component, declare a boolean state variable to track visibility. Start it as false — hidden by default.",
    hint: "Use useState<boolean>(false). The variable name should signal it's a boolean flag — the 'is' prefix is the convention.",
    example_code:
      "const [isActive, setIsActive] = useState<boolean>(false);",
    think_prompt:
      "Why is boolean the correct type for a visibility toggle — not string or number?",
    mc_options: [
      "Because React only supports boolean for toggle state",
      "Because visibility has exactly two states — visible or not. Boolean models that precisely with no invalid values possible",
      "Because string would require more characters to type",
    ],
    mc_correct_option:
      "Because visibility has exactly two states — visible or not. Boolean models that precisely with no invalid values possible",
    mc_anchor:
      "Boolean is the exact type for binary state. TypeScript can only assign true or false — no 'maybe', no 'visible', no 3.",
    why_this_matters:
      "Choosing the right type for state isn't just TypeScript ceremony — it's design. `boolean` says: this value is either true or false, nothing else. TypeScript enforces that. If you used `string`, TypeScript would allow 'visible', 'hidden', 'maybe', and 'banana' — all equally valid strings. `boolean` makes invalid states unrepresentable.",
    answer_keywords: [
      "useState",
      "boolean",
      "false",
      "isVisible",
      "setIsVisible",
    ],
    seed_code: "",
    starter_code: "",
    feedback_correct:
      "Boolean state, false by default — hidden on first render, which is almost always the right starting point for a toggle.",
    feedback_partial:
      "Almost — make sure the type generic is explicitly `<boolean>` and the initial value is `false`.",
    feedback_wrong:
      "Use `useState<boolean>(false)` — boolean type constrains the value to only true or false, which is exactly what a visibility toggle needs.",
    expected:
      "const [isVisible, setIsVisible] = useState<boolean>(false);",
    analog_example:
      "const [isOpen, setIsOpen] = useState<boolean>(false); // menu starts closed",
    deepDiveLabel:
      "The state is a boolean — so how do you flip it without knowing what it currently is?",
    deepDive: {
      hook: "You already know the locker model from the Counter App — `useState` hands React a value to watch, and the setter is the only key. This time the locker holds a boolean: `true` or `false`. Visible or hidden.\n\nThe interesting question isn't how to declare it — you've done that. It's how to *toggle* it. A counter always adds 1. A toggle doesn't have a fixed direction — it flips to whatever the current value is *not*. And that's where `prev => !prev` comes in.",
      pain: "⚠️ **Lesson:** You write `setIsVisible(true)` on click. It shows the content. You click again — it's still visible. `setIsVisible(true)` always sets to `true`. It doesn't flip — it just *forces*. How do you write a setter that goes whichever direction the current state isn't?",
      mentalModel:
        "**Mental model:** Remember the locker from the Counter App — `prev` is React handing you the guaranteed latest value from inside the locker before you decide what to put back.\n- For a counter you did `prev + 1` — always add one to whatever was there.\n- For a toggle you do `prev => !prev` — always flip to the opposite of whatever was there.\n- `!prev` is JavaScript's NOT operator: `!true = false`, `!false = true`.\n- You never need to know *what* the current value is — `!prev` handles both directions in one expression.\n- This is why the functional form matters here even more than in the counter: if two rapid clicks fire, each one correctly flips from the last settled value, not from a stale snapshot.",
      discover:
        "**Pattern — boolean toggle:**\n```tsx\nconst [isVisible, setIsVisible] = useState<boolean>(false);\n\n// ✅ correct — functional updater, always flips from latest value\nconst handleToggle = (): void => {\n  setIsVisible(prev => !prev);\n};\n\n// ❌ forces true — content never hides on second click\nconst handleToggleBroken = (): void => {\n  setIsVisible(true);\n};\n\n// ⚠️ risky — reads snapshot, can miss flips under rapid clicks\nconst handleToggleRisky = (): void => {\n  setIsVisible(!isVisible);\n};\n```\n- `useState<boolean>(false)` → starts hidden\n- `prev => !prev` → flip whatever React hands you — no if/else needed\n- `isVisible` → read this in JSX to decide what to show\n- naming convention: `is` prefix signals a boolean flag — `isVisible`, `isOpen`, `isLoading`",
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
    paal: "Return JSX from the component: a button and a content paragraph, both wrapped in a single root element. Don't wire state yet — just build the skeleton.",
    hint: "Wrap both elements in either a div or an empty fragment <>. Give the button some text and the paragraph some placeholder content.",
    example_code:
      "return (\n  <>\n    <button>Click me</button>\n    <p>Some content</p>\n  </>\n);",
    think_prompt:
      "Why can't JSX return two sibling elements without wrapping them?",
    mc_options: [
      "React has a rule that limits components to one element for performance",
      "A JavaScript function can only return one value — two root elements are two separate expressions, which is a syntax error",
      "TypeScript requires a single root for type-checking",
    ],
    mc_correct_option:
      "A JavaScript function can only return one value — two root elements are two separate expressions, which is a syntax error",
    mc_anchor:
      "JSX compiles to function calls. A function returning two values is a syntax error in JavaScript — the wrapper is what makes them one single return value.",
    why_this_matters:
      "This isn't a React quirk — it's a JavaScript constraint. JSX compiles to `React.createElement()` calls, and a function can only return one thing. The wrapper `<div>` or `<>` is the container that makes two siblings into one return value. Choosing between them matters: `<div>` adds a real DOM node, `<>` is invisible in the DOM.",
    answer_keywords: ["button", "return", "<>", "div"],
    seed_code: "",
    starter_code: "",
    feedback_correct:
      "Button and content wrapped in a single root — the skeleton is ready to wire state into.",
    feedback_partial:
      "Make sure both a button and a content paragraph are present inside a single root wrapper.",
    feedback_wrong:
      "Two sibling elements need a single parent. Wrap them: `<><button>Toggle</button><p>Content</p></>`",
    expected:
      "return (\n  <>\n    <button>Toggle</button>\n    <p>This content can be hidden</p>\n  </>\n);",
    analog_example:
      "return (\n  <div>\n    <h2>Title</h2>\n    <p>Body text</p>\n  </div>\n);",
    deepDiveLabel:
      "Why can't JSX return two elements side by side — what's the one root rule about?",
    deepDive: {
      hook: "You write your toggle component's return block with a button and a paragraph sitting next to each other. The editor immediately red-squiggles the whole return. You haven't made a typo. The JSX is valid. So why is React refusing two perfectly good elements?\n\nThis is the one root rule — and once you understand *why* it exists, you'll never forget it.",
      pain: "⚠️ **Lesson:** You write `return (<button>Toggle</button><p>Content</p>)` — two elements, both valid JSX. React throws: *'Adjacent JSX elements must be wrapped in an enclosing tag.'* Why can't a function just return two things?",
      mentalModel:
        "**Mental model:** Think of your component's `return` as a **delivery van with one loading bay**.\n- A JavaScript function can only return one value. One. Always.\n- JSX compiles down to `React.createElement()` calls — and a function call is a single expression, not two.\n- Two root elements side by side = two separate expressions = a function trying to return two values at once. JavaScript doesn't allow it.\n- A wrapper `<div>` or `<>` fragment is not decoration — it's the single box that contains both items so the van can carry them as one load.\n- The difference between the two wrappers:\n  - `<div>` → real DOM node, adds an actual element to the page\n  - `<>` → empty fragment, invisible in the DOM — wraps for React's sake without adding any HTML",
      discover:
        "**Pattern — wrapping siblings:**\n```tsx\n// ❌ two root elements — syntax error\nreturn (\n  <button>Toggle</button>\n  <p>Content</p>\n);\n\n// ✅ wrapped in div — adds a real DOM node\nreturn (\n  <div>\n    <button>Toggle</button>\n    <p>Content</p>\n  </div>\n);\n\n// ✅ wrapped in fragment — no extra DOM node\nreturn (\n  <>\n    <button>Toggle</button>\n    <p>Content</p>\n  </>\n);\n```\n- use `<div>` when you need the wrapper for styling or layout\n- use `<>` when you just need to satisfy the one root rule without polluting the DOM",
      quickRules:
        "**Quick rules:**\n- ✅ `<>...</>` fragment — no DOM node, clean HTML output\n- ✅ `<div>...</div>` — real DOM node, use when you need it for styling\n- ❌ two sibling root elements — syntax error, JavaScript can't return two values\n- the choice between `<div>` and `<>` depends on whether you need the wrapper to exist in the DOM\n- fragments are preferred when the wrapper is only there to satisfy the rule",
      watchOut:
        "👀 **Watch out:** Adding a `<div>` wrapper when you only needed a `<>` fragment can break CSS layouts — especially flexbox and grid, where an unexpected `<div>` between parent and children changes the layout model. Always ask: does this wrapper need to exist in the DOM? If no, reach for `<>`.",
      dryRun:
        "🔁 **Think:** Your toggle component returns a `<button>` and a `<p>` wrapped in a `<>` fragment. A teammate says 'just use a div, fragments are unnecessary complexity.' When would they be wrong? (Hint: think about what an extra `<div>` does to your DOM structure and whether that ever matters.)",
      build:
        "**Learning focus:** Understand why JSX must return a single root element — and choose consciously between a `<div>` wrapper and a `<>` fragment based on whether you need a real DOM node or not.",
    },
  },
  {
    id: "step5",
    type: "question",
    phase: "Step 5 of 6",
    paal: "Write a handleToggle function inside the component that flips the isVisible state. Use the functional updater form.",
    hint: "Arrow function, no event param, returns void. Use prev => !prev inside the setter.",
    example_code:
      "const handleToggle = (): void => {\n  setIsVisible(prev => !prev);\n};",
    think_prompt:
      "The toggle logic is one line — why give it a named function instead of writing it inline on the button?",
    mc_options: [
      "Named functions are required by TypeScript for event handlers",
      "A named handler gives the user intention a single home — if the same action fires from multiple places, there's one place to change the logic",
      "Inline arrow functions don't work on onClick",
    ],
    mc_correct_option:
      "A named handler gives the user intention a single home — if the same action fires from multiple places, there's one place to change the logic",
    mc_anchor:
      "Named handlers are about organising user intentions, not just wrapping single lines. When logic might grow or trigger from multiple places, a name is the right choice.",
    why_this_matters:
      "Inline logic works fine for a true one-liner used exactly once. But toggle logic can grow — a guard condition, an analytics call, a side effect. Named handlers give that logic one home. When the same toggle fires from a button, a keyboard shortcut, and an escape key handler, you change it once.",
    answer_keywords: [
      "handleToggle",
      "setIsVisible",
      "prev",
      "!prev",
      "void",
    ],
    seed_code: "",
    starter_code: "",
    feedback_correct:
      "Named handler, functional updater, no event param — clean. If this logic ever needs to grow or fire from multiple places, there's exactly one place to change it.",
    feedback_partial:
      "Almost — make sure you're using `prev => !prev` inside the setter and the function signature has no event parameter.",
    feedback_wrong:
      "Write the handler as `const handleToggle = (): void => { setIsVisible(prev => !prev); }` — the body only needs the setter, no event param.",
    expected:
      "const handleToggle = (): void => {\n  setIsVisible(prev => !prev);\n};",
    analog_example:
      "const handleClose = (): void => {\n  setIsOpen(prev => !prev);\n}; // same pattern — no event param needed",
    deepDiveLabel:
      "The toggle logic is one line — so why does it need its own named function?",
    deepDive: {
      hook: "You already know `prev => !prev` flips the boolean. You could just write `onClick={() => setIsVisible(prev => !prev)}` directly on the button and it would work perfectly. So why pull it out into a named `handleToggle` function at all?\n\nThis is a question about code organisation, not React. And the answer matters more as your components grow.",
      pain: "⚠️ **Lesson:** Your toggle works inline on the button. A week later the same toggle needs to fire from a keyboard shortcut, a swipe gesture, and an external close button — three different places. You now have `prev => !prev` scattered in three JSX attributes. Change the logic once and you have to find all three. Named handlers exist to avoid exactly this.",
      mentalModel:
        "**Mental model:** Think of a named handler as a **single source of truth for a user intention**.\n- The intention here is *'toggle visibility'* — not *'call setIsVisible with prev => !prev'*.\n- When you name it `handleToggle`, you're saying: this is what happens when the user wants to toggle. The *how* lives in one place.\n- If the toggle logic ever needs a side effect — logging, analytics, a guard condition — you add it once in `handleToggle`, not in every JSX attribute that triggers it.\n- Inline logic is fine for throwaway one-offs. Named handlers are for intentions that might be reused or grow.",
      discover:
        "**Pattern — named toggle handler:**\n```tsx\nconst handleToggle = (): void => {\n  setIsVisible(prev => !prev);\n};\n```\n- `handleToggle` → names the *intention*, not the implementation\n- `(): void` → no event param needed, returns nothing\n- `prev => !prev` → the flip logic, lives in one place\n- wire it: `<button onClick={handleToggle}>` — reference only, no `()`",
      quickRules:
        "**Quick rules:**\n- ✅ named handler when the same action might trigger from multiple places\n- ✅ named handler when the logic might grow (guards, side effects, logging)\n- ✅ inline arrow when it's a true one-liner used exactly once and will stay that way\n- ❌ never duplicate toggle logic across multiple JSX attributes — one change will miss the others\n- handler name should describe the *user intention*: `handleToggle`, not `flipBoolean`",
      watchOut:
        "👀 **Watch out:** `onClick={handleToggle()}` — the `()` calls it on render. Here it's especially sneaky because the toggle fires once on load, flipping `isVisible` to `true` immediately before the user does anything. Pass the reference: `onClick={handleToggle}`.",
      dryRun:
        "🔁 **Think:** Your `handleToggle` currently just flips state. A requirement comes in: 'Log every toggle to analytics.' Where do you add that one line — and how many places would you have had to change if you'd used inline logic on three different buttons instead?",
      build:
        "**Learning focus:** Extract toggle logic into a named handler function — understanding that named handlers are about organising *user intentions*, not just wrapping single lines.",
    },
  },
  {
    id: "step6",
    type: "question",
    phase: "Step 6 of 6",
    paal: "Wire the component together: connect handleToggle to the button's onClick, and conditionally show the content paragraph only when isVisible is true. Use && for the conditional render.",
    hint: "onClick={handleToggle} — reference, no (). For conditional render: {isVisible && <p>...</p>}",
    example_code:
      "<button onClick={handleToggle}>Toggle</button>\n{isVisible && <p>Now you see me</p>}",
    think_prompt:
      "When should you use && for conditional rendering instead of a ternary?",
    mc_options: [
      "Always — && is always simpler than ternary",
      "When there's only one outcome — show something or show nothing. Ternary is for either/or between two different outputs",
      "When the condition is a boolean — ternary works for all other types",
    ],
    mc_correct_option:
      "When there's only one outcome — show something or show nothing. Ternary is for either/or between two different outputs",
    mc_anchor:
      "`&&` is for show/nothing. Ternary is for show A or show B. This toggle shows content or shows nothing — `&&` is the right tool.",
    why_this_matters:
      "Every click now completes a full cycle: onClick fires → handleToggle runs → setIsVisible flips the boolean → React re-renders → isVisible is re-evaluated → JSX shows or hides the paragraph. This is the complete click → state → render loop. Understanding this sequence is the foundation of every interactive React component you'll build.",
    answer_keywords: ["onClick", "handleToggle", "isVisible", "&&"],
    seed_code: "",
    starter_code: "",
    feedback_correct:
      "The component is wired. Click the button — isVisible flips, React re-renders, the paragraph appears and disappears. That's the full loop.",
    feedback_partial:
      "Check two things: onClick should reference handleToggle without parentheses, and the paragraph should be wrapped in `{isVisible && ...}`.",
    feedback_wrong:
      "Wire onClick as a reference — `onClick={handleToggle}` not `onClick={handleToggle()}` — then conditionally render the paragraph with `{isVisible && <p>...</p>}`.",
    expected:
      "<button onClick={handleToggle}>Toggle</button>\n{isVisible && <p>This content can be hidden</p>}",
    analog_example:
      "<button onClick={handleClose}>Close</button>\n{isOpen && <div className='modal'>Modal content</div>}",
    deepDiveLabel:
      "onClick={handler} vs onClick={handler()} — and when to use && vs ternary for conditional rendering",
    deepDive: {
      hook: "<svg width='100%' viewBox='0 0 680 300' role='img' xmlns='http://www.w3.org/2000/svg'><title>Conditional rendering flow diagram</title><desc>Shows the chain from button click through toggle function to state update to condition check to UI output</desc><defs><marker id='arr' viewBox='0 0 10 10' refX='8' refY='5' markerWidth='6' markerHeight='6' orient='auto-start-reverse'><path d='M2 1L8 5L2 9' fill='none' stroke='context-stroke' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/></marker></defs><text x='340' y='22' text-anchor='middle' font-size='11' font-family='sans-serif' fill='#64748b'>click → state → re-render → condition → UI</text><rect x='30' y='40' width='110' height='44' rx='8' fill='#1e293b' stroke='#475569' stroke-width='1'/><text x='85' y='58' text-anchor='middle' font-size='11' font-family='sans-serif' fill='#94a3b8'>user clicks</text><text x='85' y='74' text-anchor='middle' font-size='11' font-family='monospace' fill='#64748b'>button</text><line x1='140' y1='62' x2='168' y2='62' stroke='#475569' stroke-width='1.5' marker-end='url(#arr)'/><rect x='170' y='40' width='130' height='44' rx='8' fill='#1e293b' stroke='#475569' stroke-width='1'/><text x='235' y='58' text-anchor='middle' font-size='11' font-family='monospace' fill='#94a3b8'>handleToggle()</text><text x='235' y='74' text-anchor='middle' font-size='10' font-family='sans-serif' fill='#64748b'>prev => !prev</text><line x1='300' y1='62' x2='328' y2='62' stroke='#475569' stroke-width='1.5' marker-end='url(#arr)'/><rect x='330' y='40' width='140' height='44' rx='8' fill='#1e293b' stroke='#22d3ee' stroke-width='1.5'/><text x='400' y='58' text-anchor='middle' font-size='11' font-family='sans-serif' fill='#22d3ee'>state updates</text><text x='400' y='74' text-anchor='middle' font-size='11' font-family='monospace' fill='#64748b'>isVisible: true</text><line x1='470' y1='62' x2='498' y2='62' stroke='#22d3ee' stroke-width='1.5' marker-end='url(#arr)'/><rect x='500' y='40' width='150' height='44' rx='8' fill='#0f172a' stroke='#22d3ee' stroke-width='2'/><text x='575' y='58' text-anchor='middle' font-size='11' font-family='sans-serif' fill='#22d3ee'>React re-renders</text><text x='575' y='74' text-anchor='middle' font-size='10' font-family='sans-serif' fill='#64748b'>condition re-evaluated</text><line x1='575' y1='84' x2='575' y2='118' stroke='#22d3ee' stroke-width='1.5' marker-end='url(#arr)'/><rect x='400' y='120' width='250' height='36' rx='8' fill='#1e293b' stroke='#22d3ee' stroke-width='1'/><text x='525' y='143' text-anchor='middle' font-size='11' font-family='monospace' fill='#22d3ee'>isVisible &amp;&amp; &lt;p&gt;Content&lt;/p&gt;</text><line x1='400' y1='138' x2='310' y2='138' stroke='#f87171' stroke-width='1.5' marker-end='url(#arr)'/><text x='355' y='130' text-anchor='middle' font-size='10' font-family='sans-serif' fill='#f87171'>false</text><line x1='525' y1='156' x2='525' y2='186' stroke='#22d3ee' stroke-width='1.5' marker-end='url(#arr)'/><text x='540' y='176' font-size='10' font-family='sans-serif' fill='#22d3ee'>true</text><rect x='140' y='118' width='170' height='40' rx='8' fill='#0f172a' stroke='#f87171' stroke-width='1.5'/><text x='225' y='134' text-anchor='middle' font-size='11' font-family='monospace' fill='#f87171'>renders nothing</text><text x='225' y='150' text-anchor='middle' font-size='10' font-family='sans-serif' fill='#64748b'>content hidden</text><rect x='410' y='188' width='230' height='40' rx='8' fill='#0f172a' stroke='#22d3ee' stroke-width='1.5'/><text x='525' y='204' text-anchor='middle' font-size='11' font-family='monospace' fill='#22d3ee'>&lt;p&gt;Content visible&lt;/p&gt;</text><text x='525' y='220' text-anchor='middle' font-size='10' font-family='sans-serif' fill='#64748b'>paragraph shown</text><rect x='30' y='248' width='620' height='44' rx='8' fill='#1e293b' stroke='#334155' stroke-width='1'/><text x='340' y='264' text-anchor='middle' font-size='10' font-family='sans-serif' fill='#94a3b8'>two conditional rendering patterns — choose based on what the false branch needs to show:</text><text x='120' y='281' font-size='10' font-family='monospace' fill='#22d3ee'>&amp;&amp;</text><text x='150' y='281' font-size='10' font-family='monospace' fill='#e2e8f0'>flag &amp;&amp; &lt;A /&gt;</text><text x='310' y='281' font-size='10' font-family='sans-serif' fill='#64748b'>show or nothing — false branch is empty</text><text x='120' y='296' font-size='10' font-family='monospace' fill='#22d3ee'>?:</text><text x='150' y='296' font-size='10' font-family='monospace' fill='#e2e8f0'>flag ? &lt;A /&gt; : &lt;B /&gt;</text><text x='310' y='296' font-size='10' font-family='sans-serif' fill='#64748b'>either/or — both branches render something</text></svg>\n\nYou've written the handler. You've built the JSX. Now you wire them together — and this is where the full React data flow becomes visible for the first time:\n\nClick → handleToggle → setIsVisible → React re-renders → isVisible evaluated → JSX shows or hides content.",
      pain: "⚠️ **Lesson:** You wire the button as `onClick={handleToggle()}`. The component renders — the content immediately appears. You haven't clicked anything. The content is visible on load and clicking the button does nothing useful. What went wrong — and why does one pair of parentheses change everything?",
      mentalModel:
        "**Mental model:** `onClick={handleToggle}` vs `onClick={handleToggle()}`.\n- `onClick={handleToggle}` → you're passing a *reference* to the function. React stores it and calls it when the button is clicked.\n- `onClick={handleToggle()}` → you're *calling the function right now*, during render. The return value of `void` gets passed to onClick. The handler fires on render, not on click.\n- Think of it like a doorbell: `handleToggle` is handing someone the doorbell button. `handleToggle()` is pressing it yourself right now before anyone arrives.\n\nFor conditional rendering:\n- `{isVisible && <p>Content</p>}` → show the paragraph or show nothing\n- `{isVisible ? <p>Content</p> : <p>Hidden placeholder</p>}` → show one paragraph or a different paragraph\n- This toggle shows content or nothing — `&&` is the right tool. Ternary is for when the false branch also needs to render something.",
      discover:
        "**Pattern — wiring handler and conditional render:**\n```tsx\n// ✅ reference — React calls it on click\n<button onClick={handleToggle}>Toggle</button>\n\n// ❌ call — fires immediately on render\n<button onClick={handleToggle()}>Toggle</button>\n\n// && — show or nothing\n{isVisible && <p>This content is hidden by default</p>}\n\n// ternary — show A or show B\n{isVisible ? <p>Visible content</p> : <p>Hidden placeholder</p>}\n```\n- pass the reference, not the call — this applies to every onClick in every lesson\n- `&&` when the false branch is empty — the paragraph either shows or doesn't\n- ternary when both states need to render something different",
      quickRules:
        "**Quick rules:**\n- ✅ `onClick={handleToggle}` — reference, called on click\n- ❌ `onClick={handleToggle()}` — call, fires on render\n- ✅ `{flag && <A />}` — show/nothing — false branch is empty\n- ✅ `{flag ? <A /> : <B />}` — either/or — both branches render something\n- ❌ `{flag && <A />}` when flag could be a number — renders `0` if flag is `0`. Use `{flag > 0 && <A />}` instead\n- the `&&` trap: `{items.length && <List />}` shows `0` when the array is empty — always use `{items.length > 0 && <List />}`",
      watchOut:
        "👀 **Watch out:** The `&&` trap bites when the condition is a number. `{items.length && <ul>...</ul>}` looks correct — and works when items exist. But an empty array has `length` of `0`, which is falsy but also a number JSX renders on screen. You see `0` instead of nothing. The fix: `{items.length > 0 && <ul>...</ul>}`. For this lesson `isVisible` is a true boolean so `&&` is safe — but file the trap away for when you use array lengths or counts as conditions.",
      dryRun:
        "🔁 **Think:** `isVisible` starts as `false`. The component renders. What does `{isVisible && <p>Content</p>}` evaluate to — and what appears on screen? The user clicks. `handleToggle` runs, `isVisible` flips to `true`, React re-renders. Now what does the condition evaluate to? (Hint: trace the value of `isVisible` through each render.)",
      build:
        "**Learning focus:** Wire a handler to onClick by reference and use `&&` for conditional rendering — understanding that reference vs call is a one-character difference with completely different behaviour, and that `&&` is for show/nothing while ternary is for either/or.",
    },
  },
];

const sideItems = [
  { label: "Lesson", id: "intro" },
  { label: "Objectives", id: "objectives" },
  { label: "Step 1", id: "step1" },
  { label: "Step 2", id: "step2" },
  { label: "Step 3", id: "step3" },
  { label: "Step 4", id: "step4" },
  { label: "Step 5", id: "step5" },
  { label: "Step 6", id: "step6" },
];

export default createINPACTEngine({
  NODES,
  sideItems,
  lessonNum: 2,
  title: "Toggle Visibility (TypeScript)",
  shortName: "TS — TOGGLE VISIBILITY",
});