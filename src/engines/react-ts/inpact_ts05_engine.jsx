/**
 * 🔒 LOCKED — React · TS lesson 5 — Conditional Rendering with Ternary (TypeScript).
 * Do not change steps, copy, or evaluation without explicit product/content sign-off.
 * Generated mirror: content/generated/react-ts/005_conditional-rendering-with-ternary_lesson.json
 */
import createINPACTEngine from "../inpact_engine_shared";

const NODES = [
  {
    id: "intro",
    type: "reveal",
    phase: "Lesson",
    content: {
      tag: "LESSON #5 (TypeScript)",
      title: "Conditional Rendering with Ternary — Typed",
      body: "In React with TypeScript, you often need to show different UI based on conditions. The ternary operator (condition ? trueValue : falseValue) is a concise way to handle conditional rendering while maintaining type safety.",
      usecase:
        "You'll build a toggleable user status indicator that shows different messages and styles based on whether a user is online or offline.",
    },
  },
  {
    id: "objectives",
    type: "objectives",
    phase: "Objectives",
    items: [
      "Use useState with explicit TypeScript types for boolean state",
      "Write a toggle handler with proper TypeScript event typing",
      "Apply ternary operator for conditional rendering in JSX",
      "Combine conditional rendering with dynamic styling",
    ],
  },
  {
    id: "step1",
    type: "question",
    phase: "Step 1 of 5",
    paal: "Import the dependencies needed to build a React component and manage state — you know this one.",
    hint: "Same import pattern you've used in every lesson so far.",
    example_code: "import React, { useEffect } from 'react';",
    think_prompt:
      "Which import pattern correctly brings in both React and a named hook?",
    mc_options: [
      "import { React, useState } from 'react'",
      "import React, { useState } from 'react'",
      "import React from 'react'",
    ],
    mc_correct_option: "import React, { useState } from 'react'",
    mc_anchor: "Default export and named export — one statement, two picks.",
    why_this_matters:
      "Every stateful React component starts here. This pattern is now muscle memory — recognising it instantly in any codebase is the goal.",
    answer_keywords: ["import", "React", "useState", "'react'"],
    seed_code: "",
    starter_code: "",
    feedback_correct:
      "Exactly — same pattern, every time. That consistency is the point.",
    feedback_partial:
      "Close. Remember: React is the default export, useState goes in the curly braces.",
    feedback_wrong:
      "Think back to the Counter App — what were the two things you imported and how did the curly braces fit in?",
    expected: "import React, { useState } from 'react';",
    analog_example: "import React, { useEffect } from 'react';",
  },
  {
    id: "step2",
    type: "question",
    phase: "Step 2 of 5",
    paal: "Create a functional component called UserStatus that returns a div element. Use TypeScript to type it as a React functional component.",
    hint: "Use an explicit JSX.Element return type (or a function declaration with return type).",
    example_code:
      "const MyComponent = (): JSX.Element => { return <div>Hello</div>; };",
    think_prompt:
      "What's the main benefit of typing React components with TypeScript?: check the `hungry for more` section if you're not sure.",
    mc_options: [
      "It makes the code run faster",
      "It catches type errors at compile time rather than runtime",
      "It reduces the bundle size of the application",
    ],
    mc_correct_option:
      "It catches type errors at compile time rather than runtime",
    mc_anchor:
      "Exactly! TypeScript helps catch errors early during development.",
    why_this_matters:
      "TypeScript requires explicit type annotations for function components to ensure type safety throughout your application.",
    answer_keywords: ["UserStatus", "return", "<div>", "JSX.Element", "=>"],
    seed_code: "",
    starter_code: "",
    feedback_correct: "Perfect! You've created a typed React component.",
    feedback_partial:
      "Good start. Make sure your component returns JSX and has TypeScript typing.",
    feedback_wrong:
      "Let's review. You need a component that returns a div element with proper TypeScript typing.",
    expected:
      "A basic React component structure with proper TypeScript typing.",
    analog_example:
      "const MyComponent = (): JSX.Element => { return <div>Hello</div>; };",
    deepDiveLabel: "Why add types at all? The app runs fine without them.",
    deepDive: {
      hook: "You've typed components in every lesson so far. It's become routine — `: JSX.Element` goes on every function, `<number>` goes on every counter state. It works. But you've probably never felt a moment where skipping it would have actually hurt you.\n\nLet's make that moment real.",

      pain: "⚠️ **Lesson:** Your team ships a stock trading dashboard. A backend developer renames a field in the API response from `currentPrice` to `price`. Your component reads `stock.currentPrice` — now `undefined`. No TypeScript. No error at compile time. The component renders `$undefined` on screen. A user places a trade based on a blank price field. The app didn't crash — it just silently served wrong data at the worst possible moment.",

      mentalModel:
        "**Mental model:** Think of TypeScript as a **pre-flight checklist that runs before the plane takes off**.\n- Without it: the pilot discovers the engine problem mid-flight. Passengers are already on board.\n- With it: the ground crew catches it on the tarmac. No one is at risk yet.\n- `compile time` = on the tarmac. Your editor, your CI pipeline, your build process — before a single user touches the app.\n- `runtime` = mid-flight. The app is live. Real users. Real data. Real consequences.\n- `: JSX.Element` on a component is one part of that checklist — it guarantees the function always hands back valid UI, not `undefined`, not a string, not null slipping through an edge case.\n- Every type annotation you write is a check that moves a potential crash from your users' screens to your editor's red squiggles.",

      discover:
        "**Pattern — the contract that protects users:**\n```tsx\nconst UserStatus = (): JSX.Element => {\n  return <div>Active</div>;\n};\n```\n- `: JSX.Element` → TypeScript will error at compile time if this function ever returns something that isn't valid JSX\n- no `React.FC` — retired since React 18\n- the contract isn't for the browser — it's for the next developer who refactors this component at 11pm before a release\n- a typed component is a component that can be changed safely",

      quickRules:
        "**Quick rules:**\n- ✅ `: JSX.Element` — compile time contract, errors surface in the editor\n- ❌ no return type — works until a refactor silently breaks the return value\n- compile time error = caught by you, fixed in seconds\n- runtime error = caught by your user, fixed after the damage\n- the more critical the app — finance, health, logistics — the more a missed type costs\n- TypeScript doesn't slow you down. It front-loads the pain to where it's cheap.",

      watchOut:
        "👀 **Watch out:** The most dangerous bugs aren't the ones that crash the app — they're the ones that let it keep running while serving wrong data. A component that returns `undefined` instead of JSX doesn't always throw. Sometimes it just renders nothing. No error. No log. A blank panel where critical information should be. TypeScript catches the condition that causes that before it ever ships.",

      dryRun:
        "🔁 **Think:** Your `UserStatus` component has no return type. A teammate refactors it and adds an early return that forgets to include JSX — it returns `undefined` in one branch. TypeScript with `: JSX.Element` would catch this — where exactly? At what point in the development process does the error surface, and who sees it first — the developer or the user?",

      build:
        "**Learning focus:** Understand that typing a React component isn't ceremony — it's a compile-time guarantee that protects users from silent failures that only appear when real data hits a live app.",
    },
  },
  {
    id: "step3",
    type: "question",
    phase: "Step 3 of 5",
    paal: "Inside your component, declare a state variable to track whether the user is online. Initialize it to false and type it as boolean.",
    hint: "Use useState with a type parameter or let TypeScript infer from the initial value.",
    example_code: "const [count, setCount] = useState<number>(0);",
    think_prompt:
      "Why do we type the initial value as boolean when using useState?",
    mc_options: [
      "Because TypeScript can't infer the type from true/false",
      "To explicitly tell TypeScript that this state will only hold boolean values",
      "Because useState requires a type parameter for all primitive values",
    ],
    mc_correct_option:
      "To explicitly tell TypeScript that this state will only hold boolean values",
    mc_anchor:
      "Right! Explicit typing ensures TypeScript knows what values are valid for this state.",
    why_this_matters:
      "State variables hold data that determines what gets rendered. With TypeScript, we explicitly type state to prevent bugs.",
    answer_keywords: ["useState", "false", "boolean"],
    seed_code: "",
    starter_code: "",
    feedback_correct: "Excellent! You've created typed boolean state.",
    feedback_partial:
      "Almost. Make sure your state is typed as boolean and initialized to false.",
    feedback_wrong:
      "Let's try again. You need useState with boolean type and false initial value.",
    expected: "A boolean state variable with its setter function.",
    analog_example:
      "const [isVisible, setIsVisible] = useState<boolean>(false);",
  },
  {
    id: "step4",
    type: "question",
    phase: "Step 4 of 5",
    paal: "Define a function that toggles the online status when called. The handler doesn't need the event — focus on the toggle logic.",
    hint: "The function body only needs the setter. No event param required.",
    example_code:
      "const handleToggle = (): void => { setIsVisible(prev => !prev); };",
    think_prompt:
      "This handler doesn't use the event object at all — so how should it be typed?",
    mc_options: [
      "(): void — no event param since the body never uses it",
      "(e: React.MouseEvent): void — always type the event on click handlers",
      "(e: any): void — use any to keep it flexible",
    ],
    mc_correct_option: "(): void — no event param since the body never uses it",
    mc_anchor:
      "Only declare the event param when your handler body actually uses it. This one doesn't — drop it.",
    why_this_matters:
      "Declaring params you never use is noise — it signals to every reader that the event matters here, when it doesn't. Clean handlers declare only what they need.",
    answer_keywords: ["=>", "set", "prev", "!"],
    seed_code: "",
    starter_code: "",
    feedback_correct:
      "Clean handler — no unnecessary params, toggle logic is clear.",
    feedback_partial:
      "Almost. Does your handler actually use the event object? If not, drop the param entirely.",
    feedback_wrong:
      "Remember: only declare the event param if the body uses it. This handler just needs the setter.",
    expected:
      "A clean handler function that toggles boolean state with no unnecessary event param.",
    analog_example:
      "const handleToggle = (): void => { setIsVisible(prev => !prev); }; ",
  },
  {
    id: "step5",
    type: "question",
    phase: "Step 5 of 5",
    paal: "In your component's return statement, use a ternary operator to show 'Online' with green text when the state is true, and 'Offline' with red text when false. Connect your toggle handler to a button.",
    hint: "Use condition ? 'Online' : 'Offline' and style with inline styles or CSS classes.",
    example_code:
      'return (\n  <div>\n    <p style={{ color: flag ? "green" : "red" }}>\n      {flag ? "On" : "Off"}\n    </p>\n    <button type="button" onClick={handleFlip}>Toggle</button>\n  </div>\n);',
    think_prompt:
      "Why use a ternary operator instead of an if-else statement in JSX?",
    mc_options: [
      "Ternary operators are faster than if-else",
      "JSX only accepts expressions, not statements like if-else",
      "Ternary operators work better with TypeScript",
    ],
    mc_correct_option:
      "JSX only accepts expressions, not statements like if-else",
    mc_anchor:
      "Exactly! JSX requires expressions, and ternary operators are expressions that return a value.",
    why_this_matters:
      "The ternary operator lets you conditionally render different JSX in a concise, readable way while maintaining TypeScript type safety.",
    answer_keywords: [
      "?",
      ":",
      "Online",
      "Offline",
      "onClick",
      "color",
      "button",
    ],
    seed_code: "",
    starter_code: "",
    feedback_correct:
      "Excellent! You've mastered conditional rendering with TypeScript!",
    feedback_partial:
      "Good progress. Make sure you're using a ternary operator and both text and color change.",
    feedback_wrong:
      "Let's review. You need a ternary operator that shows different text and colors, plus a button that toggles the state.",
    expected:
      "Conditional rendering that changes text and color based on state, with a working toggle button.",
    analog_example:
      'return (\n  <div>\n    <p style={{ color: flag ? "green" : "red" }}>\n      {flag ? "On" : "Off"}\n    </p>\n    <button type="button" onClick={handleFlip}>Toggle</button>\n  </div>\n);',
    deepDiveLabel:
      "Styling in React looks like CSS — but the rules are different in almost every way",
    deepDive: {
      hook: "You already know JSX isn't HTML — you saw that `class` becomes `className` and `onclick` becomes `onClick` back when you first learned JSX. Styling follows the same pattern of HTML-looks-but-JS-rules.\n\nBut there's a bigger shift with styles specifically. In HTML, styles are strings. In React, inline styles are JavaScript objects. That one shift changes everything about how you write them — and unlocks something HTML never could: styles that respond directly to state.",
      pain: "⚠️ **Lesson:** You write `<p style='color: green'>Online</p>` exactly as you would in HTML. React throws: *'The style prop expects a mapping from style properties to values, not a string.'* You used valid CSS syntax — so why does React reject it?",

      mentalModel:
        "**Mental model:** Think of React's style prop as a **JavaScript object that happens to describe CSS** — not a CSS string.\n- In HTML: `style='color: green; font-size: 16px'` → a string, parsed by the browser.\n- In React: `style={{ color: 'green', fontSize: '16px' }}` → a JS object, consumed by React.\n- The double `{{` isn't special syntax — the outer `{}` is the JSX expression slot, the inner `{}` is the JavaScript object literal.\n- Property names follow camelCase JS convention — not kebab-case CSS: `font-size` → `fontSize`, `background-color` → `backgroundColor`, `border-radius` → `borderRadius`.\n- Values are strings or numbers: `fontSize: 16` (number, React adds 'px') or `fontSize: '1rem'` (string with unit).\n- `className` takes a string of CSS class names — exactly like HTML's `class` but renamed because `class` is a reserved word in JavaScript.\n- The power: because styles are just JavaScript, they can contain expressions, variables, ternaries — anything JS can do.",

      discover:
        "**Pattern — static vs conditional styling:**\n```tsx\n{/* static inline style — JS object */}\n<p style={{ color: 'green', fontWeight: 'bold' }}>Always green</p>\n\n{/* conditional inline style — ternary inside the object */}\n<p style={{ color: isOnline ? 'green' : 'red' }}>\n  {isOnline ? 'Online' : 'Offline'}\n</p>\n\n{/* conditional className — cleaner for complex styles */}\n<p className={isOnline ? 'status-online' : 'status-offline'}>\n  {isOnline ? 'Online' : 'Offline'}\n</p>\n```\n- `style={{ }}` → double braces: JSX slot + JS object\n- camelCase properties: `fontWeight`, `backgroundColor`, `borderRadius`\n- ternary inside the style object → styles that respond to state\n- `className` with ternary → pick between CSS classes based on state\n- inline styles win for dynamic values tied to state; `className` wins for complex, reusable styles",

      quickRules:
        "**Quick rules:**\n- ✅ `style={{ color: 'red' }}` — JS object, camelCase properties\n- ❌ `style='color: red'` — string, React rejects it\n- ✅ `className='status-label'` — string of CSS class names\n- ❌ `class='status-label'` — reserved JS word, JSX rejects it\n- camelCase all multi-word CSS properties: `font-size` → `fontSize`, `background-color` → `backgroundColor`\n- number values auto-get 'px': `fontSize: 16` → `font-size: 16px`\n- string values need explicit units: `fontSize: '1rem'`, `width: '100%'`\n- ternary inside `style={{}}` or `className={}` → conditional styling powered by state",

      watchOut:
        "👀 **Watch out:** Inline styles in React are scoped to the element — they never leak. But they also can't use CSS pseudo-classes like `:hover` or `:focus` because those require CSS rules, not inline JS objects. If you need hover effects or focus rings tied to state, use `className` with CSS classes instead — or manage hover state explicitly with `useState` and `onMouseEnter`/`onMouseLeave`. Inline styles are powerful for dynamic values; CSS classes are better for interactive states.",

      dryRun:
        "🔁 **Think:** You want the button text to be bold when `isOnline` is true and normal weight when false. You also want the font size to always be 16px. Write the `style` prop that handles both — one conditional property and one static property in the same object. (Hint: a JS object can have as many keys as you need, mixed static and dynamic.)",

      build:
        "**Learning focus:** Write React inline styles as JavaScript objects with camelCase properties — and use ternary expressions inside style objects or className to make styles respond directly to component state.",
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
];

export default createINPACTEngine({
  NODES,
  sideItems,
  lessonNum: 5,
  title: "Conditional Rendering with Ternary (TypeScript)",
  shortName: "TS — CONDITIONAL RENDERING WITH TERNARY",
});
