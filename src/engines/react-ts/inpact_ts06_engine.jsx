/**
 * 🔒 LOCKED — React · TS lesson 6 — List Rendering with map (TypeScript).
 * Do not change steps, copy, or evaluation without explicit product/content sign-off.
 * Generated mirror: content/generated/react-ts/006_list-rendering-with-map_lesson.json
 */
import createINPACTEngine from "../inpact_engine_shared";

const NODES = [
  {
    id: "intro",
    type: "reveal",
    phase: "Lesson",
    content: {
      tag: "LESSON #6 (TypeScript)",
      title: "List Rendering with map() — Typed",
      body: "In React, you often need to display lists of data. Instead of manually writing repetitive JSX, you can use JavaScript's map() method to transform arrays into React elements. With TypeScript, you'll add type safety to ensure your data structures are well-defined.",
      usecase:
        "Displaying lists of users, products, tasks, or any collection where each item shares a similar visual structure.",
    },
  },
  {
    id: "objectives",
    type: "objectives",
    phase: "Objectives",
    items: [
      "Transform an array of typed data into JSX elements using map()",
      "Add a unique key prop to each rendered list item",
      "Handle empty arrays gracefully with conditional rendering",
      "Type event handlers for list interactions",
    ],
  },
  {
    id: "step1",
    type: "question",
    phase: "Step 1 of 7",
    paal: "Import React and the useState hook from the 'react' package.",
    hint: "Use a combination of default and named imports in a single statement.",
    example_code: "import React, { useEffect } from 'react'",
    think_prompt:
      "Which import statement gives us both React and the useState hook?",
    mc_options: [
      "import React from 'react'",
      "import { useState } from 'react'",
      "import React, { useState } from 'react'",
    ],
    mc_correct_option: "import React, { useState } from 'react'",
    mc_anchor:
      "We need both the default React import (for JSX) and the named useState import (for state management).",
    why_this_matters:
      "React provides the core library for building components, and useState lets us manage dynamic data that will drive our list rendering.",
    answer_keywords: ["import", "React", "{ useState }", "'react'"],
    seed_code: "",
    starter_code: "",
    feedback_correct:
      "Perfect! You've imported the essential tools for building a stateful React component.",
    feedback_partial:
      "You're close! Remember we need both React (for JSX) and useState (for state).",
    feedback_wrong:
      "Let's try again. We need to import both React and the useState hook from 'react'.",
    expected: "The component will have access to React and useState.",
  },
  {
    id: "step2",
    type: "question",
    phase: "Step 2 of 7",
    paal: "Define a type called Item that has id (number) and text (string) properties, then create a functional component called ItemList.",
    hint: "Start with 'type Item = {...}', then define 'const ItemList = () => {...}'.",
    example_code:
      "type User = { id: string; name: string };\nconst UserList = () => { ... }",
    think_prompt:
      "Where should we define the type for our list items to make it accessible throughout the component?",
    mc_options: [
      "Inside the component function",
      "As a global variable",
      "Outside the component, before its definition",
    ],
    mc_correct_option: "Outside the component, before its definition",
    mc_anchor:
      "Type definitions should be placed outside components so they can be reused and don't get recreated on every render.",
    why_this_matters:
      "TypeScript requires us to define the shape of our data before using it. This prevents runtime errors and makes our code self-documenting.",
    answer_keywords: ["type Item", "id:", "text:", "const ItemList", "=>"],
    seed_code: "",
    starter_code: "",
    feedback_correct:
      "Great! You've created a well-typed foundation for your list component.",
    feedback_partial:
      "Almost there! Make sure you define both the Item type and the ItemList component.",
    feedback_wrong:
      "Let's review: we need a type definition for our list items, then a component function.",
    expected: "A typed component skeleton ready for state and JSX.",
    analog_Example:
      "type Product = { id: number; name: string };\nconst ProductList = () => { ... }",
    deepDiveLabel: "You've used built-in types — now let's build your own",
    deepDive: {
      hook: "Every lesson so far you've used types that already exist in the TypeScript standard library — `number`, `boolean`, `string`, `JSX.Element`. But real app data doesn't come in primitive shapes. A list item isn't a number or a string — it's a *thing with properties*. This is where you stop consuming types and start authoring them.",

      pain: "⚠️ **Lesson:** You declare `const [items, setItems] = useState([])` without a type. TypeScript infers the array as `never[]` — an array that can never hold anything. You try to push an object in and it errors immediately. Why can't TypeScript just figure out the shape from how you use it?",

      mentalModel:
        "**Mental model:** Think of a custom type as a **blueprint you file before construction starts**.\n- Primitive types (`number`, `string`) are pre-filed blueprints TypeScript already knows.\n- Your `Item` type is a blueprint you're filing yourself: *'anything called an Item must have an id that's a number and a text that's a string.'*\n- Once filed, TypeScript checks every brick against it — if you try to add a property that isn't in the blueprint, or miss one that is, it errors at compile time.\n- Defined outside the component because blueprints don't belong inside the building — they're referenced by anything that needs them, not recreated each time.\n- This is also why types don't exist at runtime — they're blueprints, not materials. The compiled JavaScript has no trace of them.",

      discover:
        "**Pattern — custom type and its variations:**\n```tsx\n// basic object type\ntype Item = {\n  id: number;\n  text: string;\n};\n\n// optional property — may or may not exist\ntype Item = {\n  id: number;\n  text: string;\n  description?: string; // the ? means optional\n};\n\n// union type — value can be one of several things\ntype Status = 'active' | 'inactive' | 'pending';\n\n// union in an object type\ntype Item = {\n  id: number;\n  text: string;\n  status: 'active' | 'inactive';\n};\n\n// using the type\nconst [items, setItems] = useState<Item[]>([]);\n```\n- `type Item = {}` → defines the shape — every Item must match this exactly\n- `?` after a property name → optional, TypeScript won't complain if it's missing\n- `'active' | 'inactive'` → union type — only these exact string values allowed, nothing else\n- `Item[]` → array of Items — TypeScript checks every element against the blueprint",

      quickRules:
        "**Quick rules:**\n- ✅ define types outside the component — reusable and not recreated on every render\n- ✅ `property?: type` → optional property\n- ✅ `type A = X | Y | Z` → union — value must be one of the listed options\n- ❌ defining types inside the component function — works but recreates on every render and can't be reused\n- type names use PascalCase by convention — `Item`, `UserProfile`, `ApiResponse`\n- types are compile-time only — zero runtime cost, zero bundle size impact\n- `type` vs `interface` — both define object shapes, `type` is more flexible (supports unions), `interface` is more extensible (supports merging). For component data, `type` is the current preference.",

      watchOut:
        "👀 **Watch out:** Union types with strings are only as safe as the strings you list. `type Status = 'active' | 'inactive'` means TypeScript will error if you try to assign `'Active'` (capital A) or `'disabled'` (unlisted). This is a feature — it prevents the entire class of bugs where a status value arrives misspelled from an API and silently falls through every condition. The strictness is the point.",

      dryRun:
        "🔁 **Think:** You define `type Item = { id: number; text: string }`. Your backend starts sending items with an extra `createdAt: string` field. TypeScript doesn't error on receiving it — but if you try to *access* `item.createdAt` in your component, it errors. Why? And what's the one-character change to the type that makes `createdAt` valid but still optional? (Hint: the field exists sometimes, not always.)",

      build:
        "**Learning focus:** Define a custom TypeScript type with named properties, optional fields, and union values — understanding that types are compile-time blueprints that shape and protect your data without any runtime cost.",
    },
  },
  {
    id: "step3",
    type: "question",
    phase: "Step 3 of 7",
    paal: "Declare state to hold an array of Item objects. Initialize it with at least two sample items (each with unique id and text).",
    hint: "Use useState<Item[]> with an initial array containing objects matching your Item type.",
    example_code:
      "const [users] = useState<User[]>([{ id: 1, name: 'Alice' }])",
    think_prompt:
      "What's the correct way to type useState for an array of Item objects?",
    mc_options: [
      "const [items] = useState([])",
      "const [items] = useState<Item[]>([])",
      "const [items] = useState<Array>([])",
    ],
    mc_correct_option: "const [items] = useState<Item[]>([])",
    mc_anchor:
      "TypeScript needs the generic parameter <Item[]> to know what type of array useState should manage.",
    why_this_matters:
      "State provides the dynamic data that React will render. By typing our state, TypeScript ensures we only store data matching our Item structure.",
    answer_keywords: ["useState<Item[]>", "[{", "id:", "text:", "}]"],
    seed_code: "",
    starter_code: "",
    feedback_correct:
      "Excellent! You've created typed state that will drive your list rendering.",
    feedback_partial:
      "Good start! Make sure you include the Item[] type parameter and provide initial data.",
    feedback_wrong:
      "Let's adjust: useState needs the Item[] type and an initial array of items.",
    expected: "State variable containing an array of typed items.",
  },
  {
    id: "step4",
    type: "question",
    phase: "Step 4 of 7",
    paal: "Make your component return a div containing an h1 with the text 'My Items' and an empty unordered list (ul).",
    hint: "Use return ( ... ) with JSX syntax for div, h1, and ul elements.",
    example_code:
      "return (\n  <div>\n    <h1>My List</h1>\n    <ul></ul>\n  </div>\n)",
    think_prompt:
      "What should a React component return from its function body?",
    mc_options: [
      "A string of HTML",
      "JSX elements",
      "A plain JavaScript object",
    ],
    mc_correct_option: "JSX elements",
    mc_anchor:
      "React components return JSX, which looks like HTML but gets transformed into React elements.",
    why_this_matters:
      "Every React component must return JSX. Starting with a simple structure helps us build incrementally.",
    answer_keywords: ["return", "<div>", "<h1>", "My Items", "<ul>"],
    seed_code: "",
    starter_code: "",
    feedback_correct:
      "Perfect! You've set up the visual structure for your list.",
    feedback_partial:
      "Almost! Make sure you're returning JSX with both a heading and a list container.",
    feedback_wrong:
      "Let's try again: the component needs to return JSX with a heading and list.",
    expected: "Component renders a heading and empty list container.",
    analog_Example:
      "return (\n  <div>\n    <h1>User Profiles</h1>\n    <ul></ul>\n  </div>\n)",
  },
  {
    id: "step5",
    type: "question",
    phase: "Step 5 of 7",
    paal: "Inside the ul, use map() on your items array to render each item as an li element showing its text.",
    hint: "Use {items.map(item => ...)} inside the ul tags.",
    example_code: "{users.map(user => <li>{user.name}</li>)}",
    think_prompt:
      "How do we convert an array of data into an array of JSX elements?",
    mc_options: [
      "Using a for loop inside JSX",
      "Using the map() method",
      "Using the filter() method",
    ],
    mc_correct_option: "Using the map() method",
    mc_anchor:
      "map() creates a new array by calling a function on each element, perfect for transforming data to JSX.",
    why_this_matters:
      "The map() method transforms data into UI. This is the core pattern for rendering lists in React.",
    answer_keywords: ["items.map", "item =>", "<li>", "{item.text}"],
    seed_code: "",
    starter_code: "",
    feedback_correct: "Excellent! You're transforming data into UI with map().",
    feedback_partial:
      "Good progress! Make sure you're calling map() on items and rendering li elements.",
    feedback_wrong:
      "Let's review: we need to map over items and render each one as an li.",
    expected: "Each item appears as a list item with its text displayed.",
    analog_example:
      "return (\n  <div>\n    <h1>User Profiles</h1>\n    <ul>{users.map(user => <li key={user.id}>{user.name}</li>)}</ul>\n  </div>\n)",
    deepDiveLabel:
      "Your data is an array — but JSX needs elements. map() is the bridge.",
    deepDive: {
      hook: "You have an array of items in state. You need a list of `<li>` elements on screen. These are two completely different shapes — one is JavaScript data, the other is UI. Every React developer hits this moment: *how do I turn one into the other?*\n\nThe answer is `map()` — and once you understand why it works, you'll use it in every list you ever build.",

      pain: "⚠️ **Lesson:** You try `{for (let item of items) { <li>{item.text}</li> }}` inside your JSX. The editor red-squiggles immediately. You know `for` loops work in JavaScript — so why does JSX refuse them?",

      mentalModel:
        "**Mental model:** Think of `map()` as a **stamping machine on a conveyor belt**.\n- Your array is the conveyor belt — items roll through one by one.\n- The function you pass to `map()` is the stamp — it transforms each item into something new.\n- `map()` returns a new array of stamped results — in this case, an array of JSX elements.\n- JSX can render an array of elements natively — it just prints them in order.\n- A `for` loop is a *statement* — it does work but produces no value. JSX `{}` only accepts *expressions* — things that evaluate to a value. `map()` is an expression: it takes an array and returns a new array. That's why it fits inside `{}`  and `for` doesn't.\n- `{item.text}` inside the `<li>` is interpolation — the same `{}` escape hatch you've used since lesson 1. Here it reaches into each array element and pulls out the property you named in your type.",

      discover:
        "**Pattern — mapping data to JSX:**\n```tsx\n// your data\nconst items: Item[] = [\n  { id: 1, text: 'Buy milk' },\n  { id: 2, text: 'Walk dog' },\n];\n\n// mapping to JSX\n<ul>\n  {items.map(item => (\n    <li key={item.id}>{item.text}</li>\n  ))}\n</ul>\n```\n- `items.map(item => ...)` → for each item in the array, return one JSX element\n- `item` → the current element on the conveyor — its shape matches your `Item` type\n- `{item.text}` → interpolation — reach into the object and pull out the property\n- `key={item.id}` → React needs a unique key per element to track changes efficiently — use the id from your type, never the array index if you can avoid it\n- the whole `{items.map(...)}` sits inside JSX because `map()` is an expression that returns an array of elements",

      quickRules:
        "**Quick rules:**\n- ✅ `{items.map(item => <li>{item.text}</li>)}` — expression, works in JSX\n- ❌ `{for (let item of items) { ... }}` — statement, JSX rejects it\n- always add `key` to the outermost element returned from `map()` — React will warn without it\n- `key` must be unique among siblings — use a stable id from your data, not the array index\n- ❌ `key={index}` — works but causes subtle bugs when items are reordered or deleted\n- `{item.text}` → property interpolation — TypeScript autocompletes because it knows `item` matches your `Item` type\n- `map()` always returns a new array — it never mutates the original",

      watchOut:
        "👀 **Watch out:** Forgetting `key` won't break your list — it'll render fine. But React will log a warning, and more importantly, without keys React can't efficiently track which items changed when your list updates. It re-renders everything instead of just the changed item. On a small list this is invisible. On a list of hundreds of items updating in real time — a stock ticker, a chat feed, a live leaderboard — it becomes a performance problem. Add the key. It costs one attribute.",

      dryRun:
        "🔁 **Think:** Your `items` array has 3 elements. You call `items.map(item => <li>{item.text}</li>)`. How many `<li>` elements does `map()` return? Now you add a `filter()` before the `map()` — `items.filter(item => item.text.length > 5).map(item => <li>{item.text}</li>)`. If only 2 items have text longer than 5 characters, how many `<li>` elements render? (Hint: `filter()` returns a new array — `map()` then runs on that smaller array.)",

      build:
        "**Learning focus:** Use `map()` to transform an array of typed data into an array of JSX elements — understanding that `map()` works inside JSX because it's an expression that returns a value, and that property interpolation with `{item.property}` is TypeScript-safe because the item's shape is already known.",
    },
  },
  {
    id: "step6",
    type: "question",
    phase: "Step 6 of 7",
    paal: "Add a key prop to each li element using the item's id property.",
    hint: "Add key={item.id} to the li element.",
    example_code: "<li key={user.id}>{user.name}</li>",
    think_prompt: "Why does React need a key prop when rendering lists?",
    mc_options: [
      "To apply CSS styles",
      "To identify elements during updates",
      "To make the HTML valid",
    ],
    mc_correct_option: "To identify elements during updates",
    mc_anchor:
      "Keys help React track elements efficiently. Without them, React might re-render the entire list unnecessarily.",
    why_this_matters:
      "React uses keys to identify which items have changed, been added, or removed. This is essential for performance and correct rendering.",
    answer_keywords: ["key={item.id}"],
    seed_code: "",
    starter_code: "",
    feedback_correct:
      "Perfect! You've added the essential key prop for React's rendering optimization.",
    feedback_partial:
      "Almost! Make sure you're adding the key prop to the li element.",
    feedback_wrong: "Let's adjust: each li needs a key prop using item.id.",
    expected: "Each list item has a unique key prop.",
    analog_example: "<li key={user.id}>{user.name}</li>",
    deepDiveLabel:
      "React renders your list fine without key — so what is it actually protecting?",
    deepDive: {
      hook: "Your list renders perfectly without `key`. No visual difference. No crash. Just a console warning you can easily ignore.\n\nSo you ignore it. Then your app gets a delete button. A user deletes the second item in a list of three. React re-renders — and the wrong item flashes, an input inside a list item loses its typed value, or a checked checkbox jumps to the wrong row. You didn't change that logic. The bug came from the missing key.",

      pain: "⚠️ **Lesson:** You have a list of three items. You delete the first one. React sees two items where there were three — but without keys, it has no idea *which* item disappeared. It assumes the third item was removed and patches the first two. The data is right. The rendered output is wrong. Why can't React just compare the content?",

      mentalModel:
        "**Mental model:** Think of React's list reconciliation as a **register at a coat check**.\n- Without keys: React tracks items by position — slot 1, slot 2, slot 3. Delete slot 1 and everything shifts. React patches slot 1 with what was in slot 2, slot 2 with slot 3. It's comparing positions, not identities.\n- With keys: each coat has a numbered tag. React tracks by tag — it knows exactly which coat was taken, which ones remain, and where to put the new ones. Positions are irrelevant.\n- `key={item.id}` is the tag. React uses it to match DOM nodes from the previous render to the current one — updating only what actually changed, moving what moved, removing what was removed.\n- This matters most when list items have internal state — an input field, a checkbox, an expanded accordion. Without keys, React reuses the wrong DOM node and that internal state ends up on the wrong item.",

      discover:
        "**Pattern — key placement and choice:**\n```tsx\n{/* ❌ no key — React tracks by position */}\n{items.map(item => (\n  <li>{item.text}</li>\n))}\n\n{/* ❌ index as key — breaks on reorder/delete */}\n{items.map((item, index) => (\n  <li key={index}>{item.text}</li>\n))}\n\n{/* ✅ stable id as key — React tracks by identity */}\n{items.map(item => (\n  <li key={item.id}>{item.text}</li>\n))}\n```\n- `key` goes on the outermost element returned from `map()` — not on a child inside it\n- key must be a string or number — unique among siblings in this list\n- key is not a prop — you cannot read `item.key` inside the component, React consumes it internally\n- key only needs to be unique within the list — not globally across the whole app",

      quickRules:
        "**Quick rules:**\n- ✅ `key={item.id}` — stable, unique, survives reorder and delete\n- ❌ `key={index}` — shifts when items are added/removed/reordered, causes wrong-item bugs\n- ❌ no key — React warns and falls back to positional tracking\n- ❌ `key={Math.random()}` — generates a new key every render, React treats every item as new every time, destroys all optimisation\n- key is invisible to the component — never try to read it as a prop\n- if your data has no id, generate a stable one when the data is created — not inside `map()`",

      watchOut:
        "👀 **Watch out:** `key={index}` is the most common mistake because it silences the warning and the list looks correct — until items are deleted or reordered. The bug it causes is subtle: React reuses the DOM node at position 0 for whatever item is now at position 0, carrying over any internal state that was attached to the old item. A typed input in a deleted row appears in the row that shifted up. A checkbox checked on item 2 appears checked on item 1 after item 1 is deleted. The data is fine — the DOM is lying. Always use a stable id.",

      dryRun:
        "🔁 **Think:** You have three items with ids 1, 2, 3. You delete item 2. With `key={item.id}`, React knows exactly which DOM node to remove. With `key={index}`, what keys does React see before the delete? What keys does it see after? What does React *think* happened — and which item's DOM node gets incorrectly reused? (Hint: trace the index values before and after the deletion.)",

      build:
        "**Learning focus:** Add a stable `key` prop to each mapped list element using the item's id — understanding that keys are React's identity system for list items, protecting DOM nodes from being reused across the wrong data when the array changes.",
    },
  },
  {
    id: "step7",
    type: "question",
    phase: "Step 7 of 7",
    paal: "If the items array is empty, display a paragraph saying 'No items yet' instead of the list.",
    hint: "Use a ternary operator: {items.length ? ... : <p>No items yet</p>}",
    example_code: "{todos.length ? todos.map(...) : <p>No todos</p>}",
    think_prompt:
      "How can we conditionally render content based on whether an array is empty?",
    mc_options: [
      "Using an if statement inside JSX",
      "Using the ternary operator",
      "Using the logical AND operator",
    ],
    mc_correct_option: "Using the ternary operator",
    mc_anchor:
      "Conditional rendering lets us show different UI based on application state, making our components more robust.",
    why_this_matters:
      "Real applications often deal with empty data states. Providing a user-friendly message improves the experience.",
    answer_keywords: ["items.length", "?", ":", "<p>", "No items yet"],
    seed_code: "",
    starter_code: "",
    feedback_correct:
      "Excellent! Your component now handles all states gracefully.",
    feedback_partial:
      "Good! Make sure you're using a ternary operator to check items.length.",
    feedback_wrong:
      "Let's review: we need to check if items is empty and show a message if it is.",
    expected: "Empty state shows friendly message instead of empty list.",
    analog_example: "{users.length ? users.map(...) : <p>No users found</p>}",
    deepDiveLabel: "Same component, different UI — how React decides what to show based on state",
    deepDive: {
      hook: "<svg width='100%' viewBox='0 0 680 360' role='img' xmlns='http://www.w3.org/2000/svg'><title>Conditional rendering flow diagram</title><desc>Shows the chain from button click through toggle function to state update to condition check to UI output</desc><defs><marker id='arr' viewBox='0 0 10 10' refX='8' refY='5' markerWidth='6' markerHeight='6' orient='auto-start-reverse'><path d='M2 1L8 5L2 9' fill='none' stroke='context-stroke' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/></marker></defs><text x='340' y='22' text-anchor='middle' font-size='11' font-family='sans-serif' fill='#64748b'>state change → condition re-evaluated → different UI branch renders</text><rect x='30' y='36' width='110' height='44' rx='8' fill='#1e293b' stroke='#475569' stroke-width='1'/><text x='85' y='54' text-anchor='middle' font-size='11' font-family='sans-serif' fill='#94a3b8'>user clicks</text><text x='85' y='70' text-anchor='middle' font-size='11' font-family='monospace' fill='#64748b'>button</text><line x1='140' y1='58' x2='168' y2='58' stroke='#475569' stroke-width='1.5' marker-end='url(#arr)'/><rect x='170' y='36' width='130' height='44' rx='8' fill='#1e293b' stroke='#475569' stroke-width='1'/><text x='235' y='54' text-anchor='middle' font-size='11' font-family='monospace' fill='#94a3b8'>handleToggle()</text><text x='235' y='70' text-anchor='middle' font-size='10' font-family='sans-serif' fill='#64748b'>prev => !prev</text><line x1='300' y1='58' x2='328' y2='58' stroke='#475569' stroke-width='1.5' marker-end='url(#arr)'/><rect x='330' y='36' width='140' height='44' rx='8' fill='#1e293b' stroke='#22d3ee' stroke-width='1.5'/><text x='400' y='54' text-anchor='middle' font-size='11' font-family='sans-serif' fill='#22d3ee'>state updates</text><text x='400' y='70' text-anchor='middle' font-size='11' font-family='monospace' fill='#64748b'>isVisible: true</text><line x1='470' y1='58' x2='498' y2='58' stroke='#22d3ee' stroke-width='1.5' marker-end='url(#arr)'/><rect x='500' y='36' width='150' height='44' rx='8' fill='#0f172a' stroke='#22d3ee' stroke-width='2'/><text x='575' y='54' text-anchor='middle' font-size='11' font-family='sans-serif' fill='#22d3ee'>React re-renders</text><text x='575' y='70' text-anchor='middle' font-size='10' font-family='sans-serif' fill='#64748b'>condition re-evaluated</text><line x1='575' y1='80' x2='575' y2='118' stroke='#22d3ee' stroke-width='1.5' marker-end='url(#arr)'/><rect x='390' y='120' width='260' height='36' rx='8' fill='#1e293b' stroke='#22d3ee' stroke-width='1'/><text x='520' y='143' text-anchor='middle' font-size='11' font-family='monospace' fill='#22d3ee'>items.length ? &lt;ul&gt; : &lt;p&gt;</text><line x1='390' y1='138' x2='300' y2='138' stroke='#f87171' stroke-width='1.5' marker-end='url(#arr)'/><text x='345' y='130' text-anchor='middle' font-size='10' font-family='sans-serif' fill='#f87171'>false</text><line x1='520' y1='156' x2='520' y2='188' stroke='#22d3ee' stroke-width='1.5' marker-end='url(#arr)'/><text x='535' y='176' font-size='10' font-family='sans-serif' fill='#22d3ee'>true</text><rect x='130' y='118' width='170' height='40' rx='8' fill='#0f172a' stroke='#f87171' stroke-width='1.5'/><text x='215' y='134' text-anchor='middle' font-size='11' font-family='monospace' fill='#f87171'>&lt;p&gt;No items yet&lt;/p&gt;</text><text x='215' y='150' text-anchor='middle' font-size='10' font-family='sans-serif' fill='#64748b'>empty state UI</text><rect x='400' y='190' width='240' height='40' rx='8' fill='#0f172a' stroke='#22d3ee' stroke-width='1.5'/><text x='520' y='206' text-anchor='middle' font-size='11' font-family='monospace' fill='#22d3ee'>&lt;ul&gt;{items.map(...)}&lt;/ul&gt;</text><text x='520' y='222' text-anchor='middle' font-size='10' font-family='sans-serif' fill='#64748b'>list UI</text><rect x='30' y='252' width='620' height='92' rx='8' fill='#1e293b' stroke='#334155' stroke-width='1'/><text x='340' y='272' text-anchor='middle' font-size='10' font-family='sans-serif' fill='#94a3b8'>three patterns — same result, different use cases:</text><text x='50' y='292' font-size='11' font-family='monospace' fill='#22d3ee'>ternary</text><text x='130' y='292' font-size='11' font-family='monospace' fill='#e2e8f0'>a ? &lt;A /&gt; : &lt;B /&gt;</text><text x='400' y='292' font-size='10' font-family='sans-serif' fill='#64748b'>either/or — always one branch renders</text><text x='50' y='312' font-size='11' font-family='monospace' fill='#22d3ee'>&amp;&amp;</text><text x='130' y='312' font-size='11' font-family='monospace' fill='#e2e8f0'>flag &amp;&amp; &lt;A /&gt;</text><text x='400' y='312' font-size='10' font-family='sans-serif' fill='#64748b'>show or nothing — one outcome only</text><text x='50' y='332' font-size='11' font-family='monospace' fill='#22d3ee'>if/else</text><text x='130' y='332' font-size='11' font-family='monospace' fill='#e2e8f0'>const el = ...; return el</text><text x='400' y='332' font-size='10' font-family='sans-serif' fill='#64748b'>outside return — for complex logic</text></svg>\n\nYour list renders fine when there are items. Then a user opens the app with no data — maybe it's their first visit, maybe they deleted everything. The `<ul>` renders empty. No message. No feedback. The user stares at a blank space wondering if something broke.\n\nEmpty state is not an edge case — it's the first thing a new user sees. Conditional rendering is how React shows the right UI for the right situation.",

      pain: "⚠️ **Lesson:** You write `{items.length && <ul>{items.map(...)}</ul>}`. When the array is empty, you expect nothing — but the screen shows `0`. The condition evaluated to the number zero, not a boolean false. Why did React print it instead of hiding it?",

      mentalModel:
        "**Mental model:** Think of your JSX return as a **signpost with multiple roads** — React reads the condition and takes exactly one road every render.\n- The condition is re-evaluated fresh on every render — when state changes, React re-runs the component, hits the condition, and takes whichever road the new state points to.\n- Three roads available in JSX:\n  1. **Ternary** `condition ? <A /> : <B />` — always picks one of two outcomes. Use when you need an *either/or* — show the list or show the empty message.\n  2. **&&** `condition && <A />` — shows A or shows nothing. Use when there's only one outcome and the other is truly empty — show a badge only when there are notifications.\n  3. **if/else outside return** — full JavaScript, no expression constraints. Use for complex logic that would be unreadable inline.\n- The `&&` trap: if `condition` is the number `0`, React prints `0` because `0` is not a boolean — it's a falsy number with a display value. Always guard with a true boolean: `items.length > 0 && ...` or `!!items.length && ...`",

      discover:
        "**Pattern — three conditional rendering forms:**\n```tsx\n// ternary — either/or, always one branch renders\n{items.length > 0\n  ? <ul>{items.map(item => <li key={item.id}>{item.text}</li>)}</ul>\n  : <p>No items yet</p>\n}\n\n// && — show or show nothing\n{hasError && <p className='error'>Something went wrong</p>}\n\n// computed variable — outside return, for complex logic\nconst content = items.length > 0\n  ? <ul>{items.map(...)}</ul>\n  : <p>No items yet</p>;\n\nreturn <div>{content}</div>;\n```\n- ternary is the default choice for empty state — it always renders *something* in both branches\n- `&&` is for optional additions — notifications, banners, tooltips\n- computed variable before return keeps complex conditions readable\n- `items.length > 0` not `items.length` — avoid the `0` print trap",

      quickRules:
        "**Quick rules:**\n- ✅ `items.length > 0 ? <List /> : <Empty />` — safe ternary, explicit boolean\n- ✅ `isLoggedIn && <Dashboard />` — safe && with true boolean state\n- ❌ `items.length && <List />` — prints `0` when array is empty\n- ❌ `if` statement inside JSX return — statement, not expression, JSX rejects it\n- ternary for either/or, `&&` for show/nothing, variable for complex\n- empty state is a real UI state — always handle it explicitly, never leave users staring at blank space",

      watchOut:
        "👀 **Watch out:** The `&&` trap bites everyone once. `{items.length && <ul>...</ul>}` looks correct — and works correctly when items exist. But an empty array has `length` of `0`, which is falsy but also a renderable value. React prints `0` on screen. The fix is one character: `{items.length > 0 && <ul>...</ul>}`. Now the condition is a true boolean — `false` renders nothing. Always convert to boolean when using `&&`.",

      dryRun:
        "🔁 **Think:** Your component has this in the return: `{items.length > 0 ? <ul>...</ul> : <p>No items yet</p>}`. The app loads with an empty array. What renders? The user adds one item. React re-renders — what renders now? The user deletes that item. React re-renders again — what renders? (Hint: trace `items.length` through each scenario and follow which branch the ternary takes.)",

      build:
        "**Learning focus:** Use the ternary operator to conditionally render between two UI states — understanding that React re-evaluates conditions on every render, and that `items.length > 0` is safer than `items.length` alone when used with conditional rendering patterns.",
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
  {
    label: "Step 7",
    id: "step7",
  },
];

export default createINPACTEngine({
  NODES,
  sideItems,
  lessonNum: 6,
  title: "List Rendering with map() (TypeScript)",
  shortName: "TS — LIST RENDERING WITH MAP()",
});
