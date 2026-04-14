/**
 * 🔒 LOCKED — React · TS lesson 1 — Counter App (TypeScript).
 * Do not change steps, copy, or evaluation without explicit product/content sign-off.
 * Generated mirror: content/generated/react-ts/001_counter-app_lesson.json
 */
import createINPACTEngine from "../inpact_engine_shared";

const NODES = [
  {
    id: "intro",
    type: "reveal",
    phase: "Lesson",
    content: {
      tag: "LESSON #1 (TypeScript)",
      title: "Counter App — Typed",
      body: "Build a simple counter app with React and TypeScript. You'll learn how to add type safety to React components, manage state with useState, and handle events with proper TypeScript types.",
      usecase:
        "Counters are everywhere in real apps — from shopping carts to like buttons. Adding TypeScript ensures your state and event handlers are predictable and error-free.",
    },
  },
  {
    id: "objectives",
    type: "objectives",
    phase: "Objectives",
    items: [
      "Create a typed React component with TypeScript",
      "Use useState with explicit number type for state",
      "Write event handlers with proper TypeScript event types",
      "Connect event handlers to JSX buttons",
      "Display state values in JSX with type safety",
    ],
  },
{
  id: "step1",
  type: "question",
  phase: "Step 1 of 7",
  paal: "Import the dependencies needed to build a React component that manages state.",
  hint: "useState is a named export from 'react'. Since React 17, JSX no longer needs React in scope — import only what your code directly uses.",
  example_code: "import { useEffect } from 'react';",
  think_prompt:
    "Which import statement gives the component access to useState so it can track and update the counter value?",
  mc_options: [
    "import React from 'react'",
    "import { useState } from 'react'",
    "import useState from 'react'",
  ],
  mc_correct_option: "import { useState } from 'react'",
  mc_anchor:
    "useState is a named export — it lives inside curly braces. Since React 17, JSX no longer requires React to be in scope, so you only import what your code actually calls.",
  why_this_matters:
    "React ships many tools inside one package — hooks, types, utilities. Your job is to know which ones your file needs and import them by name. useState is the hook that gives a component tracked memory: when you call its setter, React knows to re-render. Since React 17, the JSX transform handles React itself automatically — so `import React` is no longer needed unless your code calls React directly.",
  answer_keywords: ["import", "{", "useState", "}", "from", "'react'"],
  seed_code: "",
  starter_code: "",
  feedback_correct:
    "Exactly — useState named, curly braces, from 'react'. This is the import pattern for every hook you'll ever use.",
  feedback_partial:
    "Close — useState is a named export, so it needs curly braces. No default React import needed.",
  feedback_wrong:
    "Write: `import { useState } from 'react'` — curly braces around the hook name, no React default needed.",
  expected: "import { useState } from 'react';",
  analog_example: "import { useEffect } from 'react';",
  deepDiveLabel:
    "useState isn't part of React — so where does it actually come from?",
  deepDive: {
    hook: "Before React 17, every component file had to start with `import React from 'react'`. JSX compiled to `React.createElement(...)` under the hood — so if `React` wasn't in scope, the file would crash immediately, even if you never wrote `React.` anywhere yourself.\n\nReact 17 changed the compiler. The JSX transform now injects what it needs automatically — `React` no longer has to be in your file. So the import you write is just what *your code* actually calls. Nothing more.",
    pain: "⚠️ **Lesson:** You write `import React from 'react'` and try to call `useState(0)` — the app crashes with *`useState is not a function`*. The package is imported. Why is the hook missing?",
    mentalModel:
      "**Mental model:** Think of the `react` package as a toolbox shelf.\n- The shelf holds many tools: `useState`, `useEffect`, `useRef`, `ReactNode`, and more.\n- Each tool is a **named export** — you pick it up by name using `{ }`.\n- Before React 17: JSX compiled to `React.createElement(...)` — so `React` had to be in scope or your component crashed.\n- React 17+: the build tool injects the JSX factory automatically — `React` no longer needs to be in your file.\n- Rule: only import what your code directly calls. `useState` is called directly — import it. `React` is handled by the build tool — leave it off unless you specifically need it.",
    discover:
      "**Pattern — modern named import:**\n```tsx\n// ✅ React 17+ — import only what you use\nimport { useState } from 'react';\n\n// ✅ multiple hooks — comma-separated\nimport { useState, useEffect } from 'react';\n\n// ⚠️ pre-React 17 pattern — still works but React is now unnecessary\nimport React, { useState } from 'react';\n```\n- `{ useState }` → named export — opt-in by exact name\n- `{ useState, useEffect }` → multiple named exports — comma-separated inside one pair of braces\n- no braces = default export — `React` was the default, but you rarely need it directly now\n- rule: curly braces = you know the exact name of what you want",
    quickRules:
      "**Quick rules:**\n- ✅ `import { useState } from 'react'` — correct, modern pattern\n- ✅ `import { useState, useEffect } from 'react'` — multiple named exports, one statement\n- ⚠️ `import React, { useState } from 'react'` — works but React is unused in React 17+ projects\n- ❌ `import useState from 'react'` — no braces, tries to grab the default export as useState, crashes\n- ❌ `import { React } from 'react'` — React is the default export, not a named one\n- named exports always go inside `{ }`, default exports never do",
    watchOut:
      "👀 **Watch out:** You may encounter `import React from 'react'` in older codebases or copied snippets — it's not wrong, it's pre-React 17. It still compiles because React 17+ is backwards compatible. But in a modern project linters will flag it as an unused import. The clean pattern is: named-only imports for everything your file actually calls.",
    dryRun:
      "🔁 **Think:** You have `import { useState, useEffect } from 'react'`. A refactor changes it to `import { React, useState } from 'react'` — removing useEffect and curly-bracing React. What two things break, and why does each one break? (Hint: one mistake loses a hook, the other mistakes a default export for a named one.)",
    build:
      "**Learning focus:** Import named exports from 'react' using curly braces — understanding that hooks like useState are named exports you opt into by name, that the default React import is no longer needed for JSX in React 17+ projects, and that you should only import what your file directly uses.",
  },
},
  {
    id: "step2",
    type: "question",
    phase: "Step 2 of 7",
    paal: "Define a function component that will serve as our counter app. Use TypeScript to specify it's a React function component.",
    hint: "Use const, arrow function, and an explicit `: JSX.Element` return type.",
    example_code:
      "Like declaring a specialized worker with a specific job description.",
    think_prompt:
      "How should we define a React function component in TypeScript?",
    mc_options: [
      "As a regular JavaScript function, no types needed",
      "By wrapping it inside a React.createElement() call",
      "As a function that explicitly returns : JSX.Element",
    ],
    mc_correct_option: "As a function that explicitly returns : JSX.Element",
    mc_anchor:
      "Create a function component with an explicit JSX.Element return type on the function.",
    why_this_matters:
      "TypeScript's return type on a component is a compile-time contract — it guarantees the function always hands back valid JSX, catching mistakes in the editor before they ever reach your users.",
    answer_keywords: ["JSX.Element", "=>", "()"],
    seed_code: "",
    starter_code: "",
    feedback_correct: "Great! You've created a properly typed React component.",
    feedback_partial:
      "Almost there. Add an explicit JSX.Element return type on your component function.",
    feedback_wrong:
      "Let's define the component: use an arrow function and an explicit `: JSX.Element` return type.",
    expected: "A typed React function component definition.",
    analog_example:
      "const MyComponent = (): JSX.Element => { return <div>...</div> }",
    deepDiveLabel:
      "The component works without a return type — so what is : JSX.Element actually doing?",
    deepDive: {
      hook: "Your tech lead reviews your PR and comments: 'Why is Counter not typed?' You push back in your head — it works fine, it returns JSX, what's the point? They merge it anyway but add `: JSX.Element` themselves. Three weeks later a teammate refactors Counter and accidentally returns `null` in one branch. No editor warning. No compile error. The app ships. A user hits a blank screen at 2am — and your team spends an hour in Slack tracing it back to that one untyped function. TypeScript would have shown a red squiggle the moment they saved the file. Your users never would have known.",
      pain: "⚠️ **Lesson:** You skip the return type — `function Counter() { return <div>0</div> }` — and everything runs fine. So you wonder: if it works without typing, what is `: JSX.Element` actually doing for me?",
      mentalModel:
        "**Mental model:** Think of `: JSX.Element` as a **signed contract on the function door**.\n- Without it: the function is an open kitchen — anyone can walk in and serve anything. A string, null, a number — TypeScript has nothing to check against.\n- With it: you've pinned a sign that says *'this door only lets out JSX'*. TypeScript stands guard — the moment someone tries to return the wrong thing, it flags it **before the code ever runs**.\n- The JSX still works either way at runtime — the contract isn't for the browser, it's for **you and your teammates** catching mistakes at the editor, not in production.\n- Every hour you don't spend in a 2am Slack fire tracing a blank screen is the contract doing its job silently.",
      discover:
        "**Pattern:**\n```tsx\nfunction Counter(): JSX.Element {\n  return <div>0</div>;\n}\n```\n- `Counter` → the component name, always capitalised in React\n- `(): JSX.Element` → the contract — this function promises to return valid JSX\n- `return <div>0</div>` → fulfils the contract — TS verifies this at compile time\n- no `React.FC` — that pattern is retired since React 18, `: JSX.Element` is the current standard",
      quickRules:
        "**Quick rules:**\n- ✅ `function Counter(): JSX.Element` — explicit return type, current React 18+ standard\n- ❌ `React.FC` — retired pattern, avoid it\n- ❌ no return type at all — works but loses TypeScript's contract guarantee\n- component name must be capitalised — lowercase = React treats it as a plain HTML tag",
      watchOut:
        "👀 **Watch out:** Lowercase component names silently break things. `function counter()` won't error immediately — React will just treat it as an unknown HTML element and render nothing. Always capitalise.",
      dryRun:
        "🔁 **Think:** You write `function Counter(): JSX.Element { return null; }` — will TypeScript complain? And if you write `function Counter(): JSX.Element { if (loading) return null; return <div>0</div>; }` — same question. What does `: JSX.Element` actually reject? (Hint: `null` is not JSX — but there is a type that *allows* null alongside JSX. What might it be called?)",
      build:
        "**Learning focus:** Declare a TypeScript return type on a React function component so the compiler enforces that it always returns valid JSX — catching mistakes at the editor, not in production.",
    },
  },
  {
    id: "step3",
    type: "question",
    phase: "Step 3 of 7",
    paal: "Inside your component, declare state to track the current count. Choose an appropriate TypeScript type and initialize it to the starting value.",
    hint: "Use useState with angle brackets to specify the type.",
    example_code:
      "Like reserving a parking spot specifically for cars (not trucks or motorcycles).",
    think_prompt:
      "How do we add type safety to useState for a counter that stores numbers?",
    mc_options: [
      "useState() without type - TypeScript will infer it",
      "useState<number>(0) with explicit generic type",
      "useState(0 as number) with type assertion",
    ],
    mc_correct_option: "useState<number>(0) with explicit generic type",
    mc_anchor: "Initialize state with useState and a starting value.",
    why_this_matters:
      "State makes components interactive. TypeScript ensures your state variable always holds the expected type of value.",
    answer_keywords: ["useState<number>", "useState<number>(0"],
    seed_code: "",
    starter_code: "",
    feedback_correct:
      "Excellent! Your state is now type-safe for counter values.",
    feedback_partial:
      "Good start. Think about what this state represents: the counter's current value should be initialized to the starting value with the right type.",
    feedback_wrong:
      "Pause and think: the counter's current value needs a type appropriate for arithmetic (not a string) and be initialized to the starting value.",
    expected: "A typed useState hook call inside the component.",
    analog_example:
      "const [name, setName] = useState<string>('') — this state is specifically for strings, just like our counter state should be specifically for numbers.", 
    deepDiveLabel:
      "count++ updates memory — so why doesn't the screen reflect it?",
    deepDive: {
      hook: "<svg width='100%' viewBox='0 0 680 340' role='img' xmlns='http://www.w3.org/2000/svg'><title>State change triggers re-render cycle</title><desc>Shows the cycle: user action triggers setCount, React sees state changed, re-renders component, screen updates</desc><defs><marker id='arr' viewBox='0 0 10 10' refX='8' refY='5' markerWidth='6' markerHeight='6' orient='auto-start-reverse'><path d='M2 1L8 5L2 9' fill='none' stroke='context-stroke' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/></marker></defs><text x='340' y='22' text-anchor='middle' font-size='11' font-family='sans-serif' fill='#64748b'>every state change = a fresh render cycle</text><rect x='30' y='36' width='250' height='56' rx='8' fill='#1e293b' stroke='#475569' stroke-width='1'/><text x='155' y='58' text-anchor='middle' font-size='12' font-family='monospace' fill='#e2e8f0'>const [count,</text><text x='155' y='76' text-anchor='middle' font-size='12' font-family='monospace' fill='#22d3ee'>setCount] = useState&lt;number&gt;(0)</text><text x='155' y='104' text-anchor='middle' font-size='10' font-family='sans-serif' fill='#64748b'>declares state, starts at 0</text><line x1='280' y1='64' x2='318' y2='64' stroke='#475569' stroke-width='1.5' marker-end='url(#arr)'/><rect x='320' y='36' width='160' height='56' rx='8' fill='#1e293b' stroke='#475569' stroke-width='1'/><text x='400' y='58' text-anchor='middle' font-size='11' font-family='sans-serif' fill='#94a3b8'>React watches</text><text x='400' y='76' text-anchor='middle' font-size='11' font-family='sans-serif' fill='#64748b'>this value in memory</text><line x1='400' y1='92' x2='400' y2='138' stroke='#475569' stroke-width='1.5' marker-end='url(#arr)'/><text x='412' y='118' font-size='10' font-family='sans-serif' fill='#64748b'>user clicks</text><rect x='290' y='140' width='220' height='50' rx='8' fill='#1e293b' stroke='#22d3ee' stroke-width='1.5'/><text x='400' y='161' text-anchor='middle' font-size='12' font-family='monospace' fill='#22d3ee'>setCount(count + 1)</text><text x='400' y='179' text-anchor='middle' font-size='10' font-family='sans-serif' fill='#64748b'>tells React: value changed</text><line x1='400' y1='190' x2='400' y2='224' stroke='#22d3ee' stroke-width='1.5' marker-end='url(#arr)'/><rect x='260' y='226' width='280' height='56' rx='8' fill='#0f172a' stroke='#22d3ee' stroke-width='2'/><text x='400' y='248' text-anchor='middle' font-size='11' font-family='sans-serif' fill='#22d3ee'>React re-runs Counter()</text><text x='400' y='266' text-anchor='middle' font-size='11' font-family='sans-serif' fill='#64748b'>fresh count value flows into JSX</text><line x1='400' y1='282' x2='400' y2='312' stroke='#22d3ee' stroke-width='1.5' marker-end='url(#arr)'/><rect x='310' y='314' width='180' height='18' rx='4' fill='#1e293b' stroke='#334155' stroke-width='1'/><text x='400' y='327' text-anchor='middle' font-size='11' font-family='monospace' fill='#e2e8f0'>screen shows: 1 ✅</text><rect x='30' y='158' width='170' height='54' rx='8' fill='#0f172a' stroke='#f87171' stroke-width='1.5'/><text x='115' y='178' text-anchor='middle' font-size='11' font-family='sans-serif' fill='#f87171'>plain let count = 0</text><text x='115' y='194' text-anchor='middle' font-size='10' font-family='sans-serif' fill='#64748b'>count++ changes memory</text><text x='115' y='208' text-anchor='middle' font-size='10' font-family='sans-serif' fill='#64748b'>React never notified 💥</text><line x1='200' y1='185' x2='288' y2='185' stroke='#f87171' stroke-width='1' stroke-dasharray='4 3' marker-end='url(#arr)'/><text x='244' y='178' text-anchor='middle' font-size='9' font-family='sans-serif' fill='#f87171'>vs</text></svg>\n\nYou wire up a click button: `count++`. You click three times. You open DevTools and `console.log(count)` — it says 3. But the screen still shows 0. The value is changing. The screen is frozen. You stare at it for ten minutes wondering if React is broken. It isn't — React just never knew anything changed.",
      pain: "⚠️ **Lesson:** You declare `let count = 0` and increment it on click. The variable updates fine in memory — but the screen never updates. Why does React ignore a perfectly valid variable change?",
      mentalModel:
        "**Mental model:** Think of React as a **security guard watching a specific locker**.\n- `useState<number>(0)` hands React a locker and says: *watch this*.\n- `count` is the label on the locker — you read it in JSX to show the current value.\n- `setCount(n)` is the only key that opens the locker — the moment you use it, the guard sees the change and re-runs your component top to bottom with the new value.\n- A plain `let` is a variable in your pocket — the guard never sees it, never reacts, screen stays frozen.\n- Re-rendering isn't magic — it's React literally calling `Counter()` again with the new state value flowing in fresh.",
      discover:
        "**Pattern:**\n```tsx\nconst [count, setCount] = useState<number>(0);\n```\n- `count` → current value, read in JSX — never modify this directly\n- `setCount` → the only key to the locker — always go through this to change state\n- `<number>` → TypeScript type: only numbers allowed in this locker\n- `0` → initial value: what count is on the very first render",
      quickRules:
        "**Quick rules:**\n- ✅ `const [count, setCount] = useState<number>(0)` — typed, initialised, destructured\n- ❌ `count++` or `count = count + 1` — mutating directly, React never notified\n- always go through the setter — that's the only door React watches\n- the type in `<>` and the initial value must match — `useState<number>('hello')` will error",
      watchOut:
        "👀 **Watch out:** Naming the setter anything other than `set` + the state name (`setCount`, `setVisible`, `setInput`) isn't a rule — it's a convention. But breaking it confuses every teammate who reads your code. Stick to it.",
      dryRun:
        "🔁 **Think:** You call `setCount(count + 1)` three times in a row inside one click handler. After all three calls, what does the screen show — 1, 2, or 3? (Hint: all three calls read the same snapshot of `count` from this render — they don't see each other's updates)",
      build:
        "**Learning focus:** Declare typed component state with `useState<number>` and understand that only calling the setter — never mutating directly — tells React to re-render with the new value.",
    },
  },
  {
    id: "step4",
    type: "question",
    phase: "Step 4 of 7",
    paal: "Create a function that will handle incrementing the counter. Focus on the logic rather than event parameters.",
    hint: "The function should update the state using the setter from useState.",
    example_code:
      "Like programming a remote control button to increase the volume.",
    think_prompt:
      "What's the best way to type a click handler function for a button?",
    mc_options: [
      "Don't type it - TypeScript will infer from usage",
      "Use (event: React.MouseEvent) => void",
      "Use () => void since we don't need the event object",
    ],
    mc_correct_option: "Use () => void since we don't need the event object",
    mc_anchor: "Write a function that increases the count by 1.",
    why_this_matters:
      "Event handlers need proper typing to prevent runtime errors. TypeScript helps catch event-related bugs during development.",
    answer_keywords: ["=>", "set", "+", "1"],
    seed_code: "",
    starter_code: "",
    feedback_correct:
      "Perfect! You've created a handler that safely updates state.",
    feedback_partial:
      "You're close. Make sure your function calls the state setter.",
    feedback_wrong:
      "Let's create the handler: a function that calls setCount with count + 1.",
    expected: "A function that increments the state value.",
    analog_example:
      "const handleVolumeUp = (e: React.MouseEvent<HTMLButtonElement>) => { setVolume(prev => prev + 1) } — this is a click handler that increases volume, just like our increment handler increases count.",
    deepDiveLabel:
      "onClick gets a click — but does your handler actually need to know that?",
    deepDive: {
      hook: "<svg width='100%' viewBox='0 0 680 360' role='img' xmlns='http://www.w3.org/2000/svg'><title>React event handler typing diagram</title><desc>Shows when to type the event param and when to omit it entirely</desc><defs><marker id='arr' viewBox='0 0 10 10' refX='8' refY='5' markerWidth='6' markerHeight='6' orient='auto-start-reverse'><path d='M2 1L8 5L2 9' fill='none' stroke='context-stroke' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/></marker></defs><text x='340' y='22' text-anchor='middle' font-size='11' font-family='sans-serif' fill='#64748b'>only type the event param if your logic actually uses it</text><text x='160' y='42' text-anchor='middle' font-size='10' font-family='sans-serif' fill='#f87171'>handler doesn't use event</text><text x='500' y='42' text-anchor='middle' font-size='10' font-family='sans-serif' fill='#22d3ee'>handler uses event</text><rect x='30' y='52' width='270' height='70' rx='8' fill='#0f172a' stroke='#f87171' stroke-width='1.5'/><text x='50' y='74' font-size='11' font-family='monospace' fill='#f87171'>const handleClick =</text><text x='50' y='90' font-size='11' font-family='monospace' fill='#f87171'>  (e: React.MouseEvent) => {</text><text x='50' y='106' font-size='11' font-family='monospace' fill='#94a3b8'>  setCount(count + 1)</text><text x='50' y='118' font-size='11' font-family='monospace' fill='#f87171'>}</text><rect x='30' y='134' width='270' height='36' rx='6' fill='#1e293b' stroke='#f87171' stroke-width='1'/><text x='165' y='148' text-anchor='middle' font-size='10' font-family='sans-serif' fill='#f87171'>❌ e declared but never touched</text><text x='165' y='162' text-anchor='middle' font-size='10' font-family='sans-serif' fill='#64748b'>noise — drop it entirely</text><line x1='340' y1='40' x2='340' y2='240' stroke='#334155' stroke-width='1' stroke-dasharray='4 4'/><rect x='360' y='52' width='290' height='70' rx='8' fill='#0f172a' stroke='#22d3ee' stroke-width='1.5'/><text x='378' y='74' font-size='11' font-family='monospace' fill='#22d3ee'>const handleInput =</text><text x='378' y='90' font-size='11' font-family='monospace' fill='#22d3ee'>  (e: React.ChangeEvent</text><text x='378' y='106' font-size='11' font-family='monospace' fill='#22d3ee'>  &lt;HTMLInputElement&gt;) => {</text><text x='378' y='118' font-size='11' font-family='monospace' fill='#e2e8f0'>  setInput(e.target.value)</text><rect x='360' y='134' width='290' height='36' rx='6' fill='#1e293b' stroke='#22d3ee' stroke-width='1'/><text x='505' y='148' text-anchor='middle' font-size='10' font-family='sans-serif' fill='#22d3ee'>✅ e.target.value is used in logic</text><text x='505' y='162' text-anchor='middle' font-size='10' font-family='sans-serif' fill='#64748b'>type it — TS unlocks what's inside</text><rect x='30' y='196' width='620' height='44' rx='8' fill='#1e293b' stroke='#475569' stroke-width='1'/><text x='340' y='214' text-anchor='middle' font-size='11' font-family='sans-serif' fill='#94a3b8'>the rule:</text><text x='340' y='230' text-anchor='middle' font-size='11' font-family='monospace' fill='#e2e8f0'>does my handler body reference the event param?  yes → type it.  no → omit it.</text><rect x='30' y='258' width='620' height='50' rx='8' fill='#0f172a' stroke='#334155' stroke-width='1'/><text x='340' y='278' text-anchor='middle' font-size='11' font-family='sans-serif' fill='#94a3b8'>when you do need it, React.MouseEvent gives you:</text><text x='340' y='298' text-anchor='middle' font-size='11' font-family='monospace' fill='#22d3ee'>e.target   e.currentTarget   e.preventDefault()   e.stopPropagation()</text></svg>\n\nYou see a colleague's counter handler: `(e: React.MouseEvent) => { setCount(count + 1) }`. You copy the pattern onto every handler you write. A month later your tech lead reviews your PR — 'why are you receiving an event you never open?' You stare at the code. The `e` is just sitting there, declared, ignored. You'd been typing a parcel address on every envelope even when you had no intention of reading who sent it.",
      pain: "⚠️ **Lesson:** You add `(e: React.MouseEvent)` to your increment handler out of habit. The handler works — but `e` is never used inside it. What's actually wrong with that, and when do you genuinely need the event param?",
      mentalModel:
        "**Mental model:** Think of the event param as a **delivery note that comes with every click**.\n- React always generates the note — it contains who clicked, where, which element, and more.\n- But your handler only needs to *sign for it* if it's going to *read* something from it.\n- A counter that just does `setCount(count + 1)` doesn't need the note — it already knows what to do.\n- An input handler that needs `e.target.value` must sign for it — that's the only way to read what the user typed.\n- Declaring a param you never use is noise — it signals to every reader that the event matters here, when it doesn't.",
      discover:
        "**Pattern — the decision:**\n```tsx\n// no event needed — omit it\nconst handleClick = (): void => {\n  setCount(count + 1);\n};\n\n// event needed — type it\nconst handleInput = (e: React.ChangeEvent<HTMLInputElement>): void => {\n  setInput(e.target.value);\n};\n```\n- ask first: does my logic reference `e` anywhere inside the body?\n- yes → declare and type it so TS knows what's inside\n- no → omit it entirely — cleaner, more honest code\n- `React.MouseEvent` for clicks, `React.ChangeEvent<HTMLInputElement>` for text inputs, `React.FormEvent` for form submits",
      quickRules:
        "**Quick rules:**\n- ✅ `(): void` — no event param when handler doesn't use it\n- ❌ `(e: React.MouseEvent) => { setCount(n) }` — e declared but never read, drop it\n- ✅ `(e: React.ChangeEvent<HTMLInputElement>): void` — typed because `e.target.value` is used\n- `React.MouseEvent` for clicks, `React.ChangeEvent<HTMLInputElement>` for inputs, `React.FormEvent` for forms",
      watchOut:
        "👀 **Watch out:** Cargo-culting `(e: React.MouseEvent)` onto every handler feels safe — it looks thorough. But it's noise that misleads teammates into thinking the event object matters in that handler when it doesn't. Only declare what you actually use.",
      dryRun:
        "🔁 **Think:** You're writing a button that resets the count to 0. Does that handler need the event param? Now imagine the same button also needs to call `e.preventDefault()` to stop a form from submitting — does it need the param now? What changed? (Hint: the question is always — does the body reach into `e`?)",
      build:
        "**Learning focus:** Decide consciously whether an event handler needs the event param — and when it does, type it with the correct React event type so TypeScript can tell you exactly what that event carries.",
    },
  },
  {
    id: "step5",
    type: "question",
    phase: "Step 5 of 7",
    paal: "Create another handler function for decreasing the counter. Follow the same pattern as the increment handler.",
    hint: "This function should also use the state setter.",
    example_code:
      "Like adding a volume down button to match the volume up button.",
    think_prompt:
      "Should the decrement handler have the same type as increment?",
    mc_options: [
      "No, it needs different typing because it decreases",
      "Yes, both are simple click handlers without event parameters",
      "Maybe, depends on if we prevent negative numbers",
    ],
    mc_correct_option:
      "Yes, both are simple click handlers without event parameters",
    mc_anchor: "Write a function that decreases the count by 1.",
    why_this_matters:
      "Complete apps need multiple interactions. Consistent handler patterns make code predictable and maintainable.",
    answer_keywords: ["=>", "set", "-", "1"],
    seed_code: "",
    starter_code: "",
    feedback_correct:
      "Great! Now you have both increment and decrement handlers.",
    feedback_partial: "Almost. Make sure this function decreases the count.",
    feedback_wrong:
      "Let's add the decrement handler: similar to increment but subtracting 1.",
    expected: "A second handler function for decrementing.",
    analog_example:
      "const handleVolumeDown = () => { setVolume(prev => prev - 1) } — this is a click handler that decreases volume, just like our decrement handler decreases count.",
    deepDiveLabel:
      "setCount(count - 1) works — so why would you write it differently?",
    deepDive: {
      hook: "<svg width='100%' viewBox='0 0 680 360' role='img' xmlns='http://www.w3.org/2000/svg'><title>Functional updater pattern in useState setter</title><desc>Contrasts setCount(count - 1) snapshot approach with setCount(prev => prev - 1) guaranteed fresh value approach</desc><defs><marker id='arr' viewBox='0 0 10 10' refX='8' refY='5' markerWidth='6' markerHeight='6' orient='auto-start-reverse'><path d='M2 1L8 5L2 9' fill='none' stroke='context-stroke' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/></marker></defs><text x='340' y='22' text-anchor='middle' font-size='11' font-family='sans-serif' fill='#64748b'>setCount(count - 1)  vs  setCount(prev => prev - 1)</text><text x='160' y='42' text-anchor='middle' font-size='10' font-family='sans-serif' fill='#f87171'>using the snapshot</text><rect x='30' y='52' width='280' height='56' rx='8' fill='#0f172a' stroke='#f87171' stroke-width='1.5'/><text x='50' y='74' font-size='12' font-family='monospace' fill='#f87171'>setCount(count - 1)</text><text x='50' y='94' font-size='10' font-family='sans-serif' fill='#64748b'>reads count from this render's snapshot</text><line x1='170' y1='108' x2='170' y2='134' stroke='#f87171' stroke-width='1.5' marker-end='url(#arr)'/><rect x='30' y='136' width='280' height='56' rx='8' fill='#1e293b' stroke='#f87171' stroke-width='1'/><text x='170' y='156' text-anchor='middle' font-size='10' font-family='sans-serif' fill='#f87171'>if 3 updates fire fast:</text><text x='170' y='172' text-anchor='middle' font-size='10' font-family='sans-serif' fill='#64748b'>all 3 read count = 5 (stale snapshot)</text><text x='170' y='186' text-anchor='middle' font-size='10' font-family='sans-serif' fill='#64748b'>result: 4, not 2 💥</text><line x1='340' y1='38' x2='340' y2='280' stroke='#334155' stroke-width='1' stroke-dasharray='4 4'/><text x='510' y='42' text-anchor='middle' font-size='10' font-family='sans-serif' fill='#22d3ee'>using the functional updater</text><rect x='360' y='52' width='290' height='56' rx='8' fill='#0f172a' stroke='#22d3ee' stroke-width='1.5'/><text x='378' y='74' font-size='12' font-family='monospace' fill='#22d3ee'>setCount(prev => prev - 1)</text><text x='378' y='94' font-size='10' font-family='sans-serif' fill='#64748b'>React passes the guaranteed latest value</text><line x1='505' y1='108' x2='505' y2='134' stroke='#22d3ee' stroke-width='1.5' marker-end='url(#arr)'/><rect x='360' y='136' width='290' height='56' rx='8' fill='#1e293b' stroke='#22d3ee' stroke-width='1'/><text x='505' y='156' text-anchor='middle' font-size='10' font-family='sans-serif' fill='#22d3ee'>if 3 updates fire fast:</text><text x='505' y='172' text-anchor='middle' font-size='10' font-family='sans-serif' fill='#64748b'>each prev sees the previous result</text><text x='505' y='186' text-anchor='middle' font-size='10' font-family='sans-serif' fill='#64748b'>5 → 4 → 3 → 2 ✅</text><rect x='30' y='212' width='620' height='52' rx='8' fill='#1e293b' stroke='#475569' stroke-width='1'/><text x='340' y='232' text-anchor='middle' font-size='11' font-family='sans-serif' fill='#94a3b8'>what is prev?</text><text x='340' y='250' text-anchor='middle' font-size='11' font-family='sans-serif' fill='#e2e8f0'>React calls your function with the most up-to-date state value as the argument.</text><text x='340' y='262' text-anchor='middle' font-size='10' font-family='sans-serif' fill='#64748b'>you name it — prev, current, n — it's just a param. prev is convention.</text><rect x='30' y='282' width='620' height='44' rx='8' fill='#0f172a' stroke='#334155' stroke-width='1'/><text x='340' y='300' text-anchor='middle' font-size='11' font-family='sans-serif' fill='#94a3b8'>the rule:</text><text x='340' y='318' text-anchor='middle' font-size='11' font-family='monospace' fill='#22d3ee'>if new value depends on old value → always use the functional form</text></svg>\n\nYour counter works fine — click decrement, count goes down. Then a colleague asks you to add a rapid-fire triple-decrement on long press. You wire it up with `setCount(count - 1)` called three times. You long press. Count drops by 1, not 3. You `console.log` and the value updated once. React batched all three calls — and all three read the same stale snapshot of `count`. The functional form would have chained them correctly.",
      pain: "⚠️ **Lesson:** `setCount(count - 1)` works perfectly for a single click — so what exactly is the risk, and why do experienced devs reach for `prev => prev - 1` even when it seems unnecessary?",
      mentalModel:
        "**Mental model:** Think of `count` in your handler as a **photograph taken at render time**.\n- When your handler runs, `count` is frozen at whatever value it was when React last rendered.\n- `setCount(count - 1)` says: *take one off this photograph*. Fine for a single call.\n- But if React batches multiple updates, every call is still looking at the same old photograph — they all subtract from 5, not from each other's result.\n- `prev => prev - 1` is different — instead of a photograph, you hand React a **recipe**: *whatever the latest value is when you process this, subtract one from that*.\n- React queues your recipes and runs them in order, each one receiving the freshest value. No stale snapshots.",
      discover:
        "**Pattern — the functional updater:**\n```tsx\nconst handleDecrement = (): void => {\n  setCount(prev => prev - 1);\n};\n```\n- `prev` → React injects the guaranteed latest state value here — not the snapshot from this render\n- `prev - 1` → your update logic, expressed as a pure transformation\n- `prev` is just a name — `current`, `n`, `val` all work — `prev` is convention\n- rule: if the new value depends on the old value, always use this form",
      quickRules:
        "**Quick rules:**\n- ✅ `setCount(prev => prev - 1)` — guaranteed fresh value, safe for batched updates\n- ✅ `setCount(count - 1)` — fine for simple single-click updates, risky under batching\n- rule of thumb: if the new value is calculated from the old value, always use the functional form\n- `prev` is just a convention — the name is yours, what matters is that React injects the latest value",
      watchOut:
        "👀 **Watch out:** `setCount(count - 1)` will work perfectly in your counter — until it doesn't. The bug only shows up under rapid updates or React batching, which means it'll work in development and silently miscalculate in production under load. Use the functional form by default and you'll never hit it.",
      dryRun:
        "🔁 **Think:** You write `setCount(prev => prev - 1)` in your decrement handler and `setCount(count + 1)` in your increment handler. Both work fine in normal use. But under rapid clicking, one of them is a time bomb. Which one, and why? (Hint: which one reads from the frozen photograph?)",
      build:
        "**Learning focus:** Use the functional updater form `prev => prev - 1` when the new state value is derived from the previous one — so React always operates on the latest value, not a stale render snapshot.",
    },
  },
  {
    id: "step6",
    type: "question",
    phase: "Step 6 of 7",
    paal: "Make your component return the visual interface: the JSX required to display the current count and provide buttons to change it.",
    hint: "Use a div to wrap everything, display the state variable, and add button elements.",
    example_code:
      "Like arranging furniture in a room so people can interact with it.",
    think_prompt: "What should our counter's JSX display?",
    mc_options: [
      "Only the current count number",
      "The count plus one button",
      "The count plus both increment and decrement buttons",
    ],
    mc_correct_option: "The count plus both increment and decrement buttons",
    mc_anchor: "Return JSX showing the count and two buttons.",
    why_this_matters:
      "JSX defines what users see. TypeScript validates that your JSX is syntactically correct and properly typed.",
    answer_keywords: ["return", "div", "{", "}", "button"],
    seed_code: "",
    starter_code: "",
    feedback_correct: "Perfect! Your UI structure is ready for interaction.",
    feedback_partial: "Good structure. Make sure to display the count value.",
    feedback_wrong:
      "Let's build the UI: show the count and add button elements.",
    expected: "JSX that displays the counter value and buttons.",
    analog_example:
      "return (\n  <div>\n    <p>Score: {score}</p>\n    <button>Increment</button>\n    <button>Decrement</button>\n  </div>\n) — this JSX shows the score(display value) and two buttons, just like our counter should.",
    deepDiveLabel:
      "There's HTML inside a JavaScript function — is that even allowed?",
    deepDive: {
      hook: "A React component has one job: run, and hand back a picture of the UI. Everything else — state, handlers, logic — is just setup before that return.\n\nYour tech lead drops a component file in your lap and asks you to add a button. You open it and stop — there's what looks like HTML sitting right inside a JavaScript function, next to `useState` and `const` declarations. You've never seen that before. You try writing a quick `<p>` tag in a plain `.js` file and the editor screams. So why does it work here, inside `.tsx`?\n\nThis is JSX — a syntax extension that lets you write what *looks* like HTML directly inside JavaScript. It's not magic and it's not real HTML. Your build tool intercepts it before the browser ever sees it and compiles it into plain JavaScript function calls. The browser receives zero JSX — it only ever gets the result.",
      pain: "⚠️ **Lesson:** You write `<p class='counter'>{count}</p>` exactly as you would in an HTML file. React throws: *'Did you mean className?'* You used a valid HTML attribute — so why does JSX reject it?",
      mentalModel:
        "**Mental model:** Think of JSX as **a template language that lives inside JavaScript, not inside HTML**.\n- Because it compiles through JavaScript, it follows JS naming rules — not HTML ones. `class` is a reserved word in JS, so JSX uses `className`. `onclick` becomes `onClick` (camelCase).\n- The `{}` curly braces are the escape hatch — anything inside them is evaluated as a live JavaScript expression: `{count}`, `{count > 0 ? 'up' : 'zero'}`, `{items.length}`.\n- One hard rule: `return` can only hand back **one root element**. Two siblings at the top level breaks the compiler. Wrap them in a `<div>` or an empty `<>` fragment.\n- JSX is never what the browser runs. Under the hood `<p>{count}</p>` compiles to `React.createElement('p', null, count)` — JSX is just a readable shorthand for that.\n- Now step back and look at the whole picture: **a React component is just a function with a UI-shaped return value**. It runs, does its setup work — state, variables, handlers — and then returns one thing: the JSX that describes what the user should see right now. That's the whole model. The word 'component' sounds fancy but it's just a function whose return value happens to be your UI.",
      discover:
        "**Pattern — JSX inside return:**\n```tsx\nreturn (\n  <div>\n    <p>{count}</p>\n    <button>+</button>\n    <button>-</button>\n  </div>\n);\n```\n- `return (` → parentheses let you spread JSX across multiple lines cleanly\n- `<div>` → the single root every JSX return must have — siblings need a wrapper\n- `{count}` → live JS value injected into the markup — updates every re-render\n- buttons carry no logic yet — that comes when you wire `onClick` to your handlers",
      quickRules:
        "**Quick rules:**\n- ✅ `{count}` — live JS value, updates every re-render\n- ❌ `class=''` → use `className=''` in JSX\n- ❌ `onclick=''` → use `onClick={handler}` in JSX (camelCase, no quotes)\n- return must have exactly one root element — wrap siblings in `<div>` or `<>`\n- `{}` only accepts expressions — `if` statements inside JSX will break, use ternary instead",
      watchOut:
        "👀 **Watch out:** JSX looks so much like HTML that your fingers will type `class=` on autopilot for months. The error React throws is clear — *'Did you mean className?'* — but it's still a jarring stop mid-flow. Burn `className` into muscle memory now.",
      dryRun:
        "🔁 **Think:** You want to show the count only when it's above zero, so you write `<p>{ if (count > 0) count }</p>`. The editor red-squiggles immediately. Why? And what would you write instead? (Hint: `{}` only accepts *expressions* — things that evaluate to a value. `if` is a statement. There's a one-liner that is an expression and does the same job.)",
      build:
        "**Learning focus:** Write a JSX return block that embeds live state values using `{}`, respects the single-root rule, and uses JSX attribute names instead of HTML ones — understanding that this return block is the entire visual output of your component.",
    },
  },
  {
    id: "step7",
    type: "question",
    phase: "Step 7 of 7",
    paal: "Make the buttons interactive by connecting them to your handler functions. Pass the function references, don't call them.",
    hint: "Use onClick prop with curly braces.",
    example_code: "Like plugging a controller into a game console.",
    think_prompt: "How do we connect our handler functions to button clicks?",
    mc_options: [
      "onClick={incrementHandler()} with parentheses",
      "onClick={incrementHandler} without parentheses",
      'onClick="incrementHandler" as a string',
    ],
    mc_correct_option: "onClick={incrementHandler} without parentheses",
    mc_anchor: "Attach the handler functions to button click events.",
    why_this_matters:
      "Event wiring brings interactivity to life. TypeScript ensures event handlers receive correct event types.",
    answer_keywords: ["onClick", "={", "}"],
    seed_code: "",
    starter_code: "",
    feedback_correct:
      "Excellent! Your counter app is now fully interactive and type-safe!",
    feedback_partial:
      "Almost there. Make sure you're passing the function, not calling it.",
    feedback_wrong:
      "Let's connect the handlers: onClick={handlerFunction} (no parentheses).",
    expected: "Buttons with onClick handlers attached.",
    analog_example:
      "<button onClick={handleSubmit}>Submit</button> — this button calls handleSubmit when clicked, just like our counter buttons should call their handlers.",
    deepDiveLabel:
      "onClick={handler} vs onClick={handler()} — one character difference, completely different behaviour",
    deepDive: {
      hook: "<svg width='100%' viewBox='0 0 680 340' role='img' xmlns='http://www.w3.org/2000/svg'><title>Wiring handlers to buttons — onClick timing diagram</title><desc>Shows the difference between passing a handler reference vs calling it immediately on render</desc><defs><marker id='arr' viewBox='0 0 10 10' refX='8' refY='5' markerWidth='6' markerHeight='6' orient='auto-start-reverse'><path d='M2 1L8 5L2 9' fill='none' stroke='context-stroke' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/></marker></defs><text x='340' y='22' text-anchor='middle' font-size='11' font-family='sans-serif' fill='#64748b'>when does the handler actually run?</text><text x='160' y='42' text-anchor='middle' font-size='10' font-family='sans-serif' fill='#f87171'>❌ called on render</text><rect x='30' y='52' width='290' height='44' rx='8' fill='#0f172a' stroke='#f87171' stroke-width='1.5'/><text x='50' y='72' font-size='12' font-family='monospace' fill='#f87171'>onClick={handler(param)}</text><text x='50' y='88' font-size='10' font-family='sans-serif' fill='#64748b'>the () executes handler right now</text><line x1='175' y1='96' x2='175' y2='124' stroke='#f87171' stroke-width='1.5' marker-end='url(#arr)'/><rect x='30' y='126' width='290' height='54' rx='8' fill='#1e293b' stroke='#f87171' stroke-width='1'/><text x='175' y='146' text-anchor='middle' font-size='10' font-family='sans-serif' fill='#f87171'>fires during render, not on click</text><text x='175' y='162' text-anchor='middle' font-size='10' font-family='sans-serif' fill='#64748b'>if it calls setCount → triggers re-render</text><text x='175' y='174' text-anchor='middle' font-size='10' font-family='sans-serif' fill='#64748b'>→ renders again → fires again → 🔁 infinite loop</text><line x1='340' y1='38' x2='340' y2='260' stroke='#334155' stroke-width='1' stroke-dasharray='4 4'/><text x='510' y='42' text-anchor='middle' font-size='10' font-family='sans-serif' fill='#22d3ee'>✅ called on click</text><rect x='358' y='52' width='292' height='44' rx='8' fill='#0f172a' stroke='#22d3ee' stroke-width='1.5'/><text x='378' y='68' font-size='12' font-family='monospace' fill='#22d3ee'>onClick={handler}</text><text x='378' y='84' font-size='10' font-family='sans-serif' fill='#64748b'>passes the function itself — not its result</text><text x='378' y='96' font-size='10' font-family='sans-serif' fill='#22d3ee'>React holds it, calls it when user clicks</text><line x1='505' y1='96' x2='505' y2='124' stroke='#22d3ee' stroke-width='1.5' marker-end='url(#arr)'/><rect x='358' y='126' width='292' height='36' rx='8' fill='#1e293b' stroke='#22d3ee' stroke-width='1'/><text x='505' y='146' text-anchor='middle' font-size='10' font-family='sans-serif' fill='#22d3ee'>runs only when button is clicked ✅</text><text x='505' y='158' text-anchor='middle' font-size='10' font-family='sans-serif' fill='#64748b'>zero times on render</text><rect x='30' y='200' width='620' height='110' rx='8' fill='#1e293b' stroke='#475569' stroke-width='1'/><text x='340' y='220' text-anchor='middle' font-size='11' font-family='sans-serif' fill='#94a3b8'>but what if you need to pass a param?</text><rect x='48' y='228' width='270' height='34' rx='6' fill='#0f172a' stroke='#f87171' stroke-width='1'/><text x='58' y='242' font-size='11' font-family='monospace' fill='#f87171'>onClick={handler(param)}</text><text x='58' y='254' font-size='10' font-family='sans-serif' fill='#64748b'>still fires on render 💥</text><rect x='358' y='228' width='276' height='34' rx='6' fill='#0f172a' stroke='#22d3ee' stroke-width='1.5'/><text x='368' y='242' font-size='11' font-family='monospace' fill='#22d3ee'>onClick={() => handler(param)}</text><text x='368' y='254' font-size='10' font-family='sans-serif' fill='#64748b'>wrapper fn holds the call for later ✅</text><text x='340' y='286' text-anchor='middle' font-size='11' font-family='sans-serif' fill='#e2e8f0'>the arrow function is a wrapper — it gives React something to call later,</text><text x='340' y='300' text-anchor='middle' font-size='11' font-family='sans-serif' fill='#e2e8f0'>and inside that wrapper, you call your handler with whatever params you need.</text></svg>\n\nYou wire your increment button: `onClick={handleIncrement()}`. You load the page. The count is already at 1 before you've clicked anything. You click — nothing happens. You click again — still nothing. You stare at the button wondering if `onClick` is broken. It isn't. You accidentally called the handler *during render* instead of handing it to React to call *on click*. One pair of parentheses. Completely different behaviour.",
      pain: "⚠️ **Lesson:** `onClick={handleIncrement()}` looks right — you're passing the handler to onClick. But the counter increments on page load, not on click. Why does adding `()` break the entire wiring?",
      mentalModel:
        "**Mental model:** Think of `onClick` as a **doorbell slot** — it expects you to slide in a *bell*, not ring it yourself right now.\n- `onClick={handler}` → you slide in the bell. React holds it. When the user clicks, React rings it.\n- `onClick={handler()}` → you ring the bell yourself during render, hand React the *result* (probably `undefined`), and React has nothing to call on click.\n- The `()` is the difference between *handing over a function* and *executing it*.\n- When you need to pass a param, you can't do `onClick={handler(param)}` — that still rings immediately. Instead wrap it: `onClick={() => handler(param)}`. The arrow function *is* the bell — React rings that arrow function on click, which then calls your handler with the param.",
      discover:
        "**Pattern — three wiring scenarios:**\n```tsx\n// no params needed — pass the reference directly\n<button onClick={handleIncrement}>+</button>\n\n// no params, inline — arrow function as the handler\n<button onClick={() => setCount(prev => prev + 1)}>+</button>\n\n// params needed — wrap in arrow function\n<button onClick={() => handleChange(5)}>+5</button>\n```\n- never write `onClick={handler()}` — the `()` fires it on render\n- if the handler is simple enough, write it inline with an arrow function\n- if the handler needs a param, the arrow wrapper is the only safe way",
      quickRules:
        "**Quick rules:**\n- ✅ `onClick={handler}` → reference — React calls it on click\n- ❌ `onClick={handler()}` → executed — fires on render, React gets `undefined`\n- ✅ `onClick={() => handler(param)}` → wrapper — safely passes params, fires on click\n- if your button does something before you click it — you have a stray `()` somewhere\n- `=> void` on the handler means it returns nothing — React doesn't expect a value back from click handlers",
      watchOut:
        "👀 **Watch out:** The most common noob trap is copy-pasting a handler call from inside regular JS logic straight into JSX. In normal JS you'd write `handleIncrement()` to call a function. In JSX's `onClick`, that same instinct adds `()` and silently breaks everything. The rule to tattoo: **inside `onClick={}`, you're not calling the function — you're nominating it.**",
      dryRun:
        "🔁 **Think:** You have `onClick={() => handleIncrement()}` — wrapped in an arrow function but still calling `handleIncrement()` with parentheses inside. Does this work correctly or does it fire on render? (Hint: ask yourself what React actually receives as the onClick value — is it a function or a result?)",
      build:
        "**Learning focus:** Wire event handlers to JSX controls correctly — knowing when to pass a reference directly, when to write inline logic, and when to use an arrow function wrapper to safely pass parameters.",
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
  { label: "Step 7", id: "step7" },
];

export default createINPACTEngine({
  NODES,
  sideItems,
  lessonNum: 1,
  title: "Counter App (TypeScript)",
  shortName: "TS — COUNTER APP",
});
