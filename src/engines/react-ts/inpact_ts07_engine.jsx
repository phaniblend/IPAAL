/**
 * 🔒 LOCKED — React · TS lesson 7 — useEffect & Side Effects (TypeScript).
 * Do not change steps, copy, or evaluation without explicit product/content sign-off.
 * Generated mirror: content/generated/react-ts/007_useeffect-side-effects_lesson.json
 */
import createINPACTEngine from "../inpact_engine_shared";

const NODES = [
  {
    id: "intro",
    type: "reveal",
    phase: "Lesson",
    content: {
      tag: "LESSON #7 (TypeScript)",
      title: "useEffect & Data Fetching — Typed",
      body: "React components render UI — but real apps need data from the outside world. useEffect is React's hook for reaching beyond the component: fetching from APIs, syncing to storage, setting up subscriptions. In this lesson you'll fetch real user data from a live API, and learn how changing a state value can automatically trigger a new fetch — all with full TypeScript safety on the response.",
      usecase:
        "You'll build a user profile viewer that fetches a real user from the JSONPlaceholder API. A userId state variable controls which user gets fetched — change it with a button, and useEffect automatically fires the new request. You'll type the API response, handle the loading state, and see how state and effects work together to drive a data-driven UI.",
    },
  },
  {
    id: "objectives",
    type: "objectives",
    phase: "Objectives",
    items: [
      "Define a TypeScript type that matches a real API response shape and use it to type useState",
      "Write a useEffect that fetches data from a live API endpoint on component mount",
      "Wire a state variable into useEffect's dependency array so changing it triggers a new fetch",
      "Handle loading and empty states in JSX using conditional rendering",
      "Identify the three dependency array behaviours — no array, empty array, and value array — and choose the correct one for a given side effect",
    ],
  },
  {
    id: "step1",
    type: "question",
    phase: "Step 1 of 9",
    paal: "Import the dependencies needed to build a React component that fetches data and manages state — you know this pattern.",
    hint: "This lesson needs two hooks — one you've used since lesson 1, one that's new. Both are named exports from 'react'.",
    example_code: "import { useRef, useMemo } from 'react';",
    think_prompt:
      "Which import statement gives us both state management and the ability to run side effects after render?",
    mc_options: [
      "import React from 'react'",
      "import { useState, useEffect } from 'react'",
      "import useState, useEffect from 'react'",
    ],
    mc_correct_option: "import { useState, useEffect } from 'react'",
    mc_anchor:
      "Both hooks are named exports — comma-separated inside the curly braces, one import statement.",
    why_this_matters:
      "useState gives the component memory — which user to fetch, whether data has loaded. useEffect gives the component a channel to the outside world — the API call that runs after render. Together they're the core pattern behind every data-fetching component you'll ever build.",
    answer_keywords: [
      "import",
      "{",
      "useState",
      "useEffect",
      "}",
      "from",
      "'react'",
    ],
    seed_code: "",
    starter_code: "",
    feedback_correct:
      "Exactly — same named import pattern, two picks. useState for state, useEffect for the fetch. You'll use both in every step from here.",
    feedback_partial:
      "Close — you need both hooks. useState alone can't reach the API, and useEffect alone can't store what comes back.",
    feedback_wrong:
      "Think back to the import shelf — both hooks are named exports sitting inside the react package. Curly braces, comma-separated, one statement.",
    expected: "import { useState, useEffect } from 'react';",
    analog_example: "import { useMemo, useCallback } from 'react';",
    deepDiveLabel:
      "You've imported one hook at a time — now let's talk about using many hooks in one component",
    deepDive: {
      hook: "Every lesson so far you've worked with one hook per component — `useState` for the counter, `useState` for the toggle. Real components rarely get that luxury. A data-fetching component needs `useState` for the data, `useState` for the loading flag, and `useEffect` to trigger the fetch. All three hooks, one component, rules that govern all of them.\n\nThis lesson introduces `useEffect` alongside `useState`. Before you use them together, you need to know the rules that apply to every hook — not just one at a time.",
      pain: "⚠️ **Lesson:** You have two `useState` calls and one `useEffect` in your component. You wrap the `useEffect` in an `if` statement so it only fetches when a flag is true. The app crashes: *'React Hook useEffect is called conditionally'*. The hook is valid. The condition makes sense. So why does React refuse it?",
      mentalModel:
        "**Mental model:** You already know React keeps a numbered list of lockers — one per hook call, matched by position every render. That rule doesn't change when you add more hooks or mix hook types.\n- Every hook type — `useState`, `useEffect`, `useRef`, `useMemo` — goes into the same ordered list.\n- React doesn't care what *type* of hook is in each slot — it only cares that slot 1 is always slot 1, slot 2 is always slot 2, every single render.\n- Mix as many hooks as you need — there's no limit and no penalty for combining types.\n- The rules never change regardless of how many you use:\n  1. Always at the top level — never inside `if`, loops, or nested functions\n  2. Always in the same order — never conditional, never skippable\n  3. Only inside React functions — components or custom hooks, never in plain JS functions",
      discover:
        "**Pattern — multiple hooks, different types, one component:**\n```tsx\nimport { useState, useEffect } from 'react';\n\nconst UserFetcher = (): JSX.Element => {\n  // slot 1 — always\n  const [userId, setUserId] = useState<number>(1);\n  // slot 2 — always\n  const [user, setUser] = useState<User | null>(null);\n  // slot 3 — always\n  const [isLoading, setIsLoading] = useState<boolean>(false);\n  // slot 4 — always\n  useEffect(() => {\n    // fetch runs after render — covered in step 5\n  }, [userId]);\n\n  return <div>...</div>;\n};\n```\n- all hooks declared at the top, before any logic or early returns\n- `useState` and `useEffect` in the same import — comma-separated named exports\n- order is stable: React matches slot 1 to `userId`, slot 2 to `user`, slot 3 to `isLoading`, slot 4 to the effect — every render, no exceptions\n- `useEffect` takes its place in the list just like any `useState` — position matters, type doesn't",
      quickRules:
        "**Quick rules:**\n- ✅ import multiple hooks comma-separated: `import { useState, useEffect } from 'react'`\n- ✅ declare all hooks at the top of the component before any logic\n- ✅ mix hook types freely — `useState` and `useEffect` in the same component is normal\n- ❌ hook inside an `if` — React will error: hook called conditionally\n- ❌ hook inside a `for` loop — same error, same reason\n- ❌ hook after an early `return` — React may never reach it, slot count shifts\n- ❌ hook inside a nested function inside the component — only the component's top level counts\n- the error message *'React Hook X is called conditionally'* always means one thing: something above that hook is skipping it on some renders",
      watchOut:
        "👀 **Watch out:** The rules of hooks are enforced by a linter rule called `eslint-plugin-react-hooks` — if your project has it enabled, you'll see the error in your editor before you even run the app. If you don't see editor warnings and you break the rules, React will throw at runtime with a cryptic message about hook count mismatches. Set up the linter — it turns hook rule violations from confusing runtime crashes into immediate editor squiggles.",
      dryRun:
        "🔁 **Think:** Your component has `useState` at slot 1, `useEffect` at slot 2, and another `useState` at slot 3. A teammate moves the second `useState` above the `useEffect` during a refactor — now it's slot 2 and `useEffect` is slot 3. Does anything break? Why or why not? (Hint: what does React actually care about — the hook type or the slot position?)",
      build:
        "**Learning focus:** Import and declare multiple hooks of different types in a single component — understanding that all hooks share the same ordering rules regardless of type, and that stable declaration order is what keeps React's slot matching correct across every render.",
    },
  },
  {
    id: "step2",
    type: "question",
    phase: "Step 2 of 9",
    paal: "We're going to fetch real user data from JSONPlaceholder — a free public API that returns user objects. Visit https://jsonplaceholder.typicode.com/users/1 to see the response shape, then create an interface called User that models the fields we'll use: id, name, email, and username.",
    hint: "Use the interface keyword outside the component. Check the live response at https://jsonplaceholder.typicode.com/users/1 to confirm field names and value types.",
    example_code:
      "interface Product {\n  id: number;\n  title: string;\n  price: number;\n  inStock: boolean;\n}",
    think_prompt:
      "When describing the shape of an API response object in TypeScript, which is the more appropriate construct?",
    mc_options: [
      "type User = { id: number; name: string; } — type aliases are always preferred",
      "interface User { id: number; name: string; } — interfaces are designed for describing object shapes",
      "const User = { id: 0, name: '' } — just use a default object as the shape",
    ],
    mc_correct_option:
      "interface User { id: number; name: string; } — interfaces are designed for describing object shapes",
    mc_anchor:
      "Interfaces describe the shape of objects — API responses, component props, class contracts. That's exactly what they were built for.",
    why_this_matters:
      "JSONPlaceholder returns a user object with a specific shape. Without an interface, TypeScript treats the fetch response as `unknown` — you can't safely access `user.name` or `user.email` without it complaining. Defining the interface first tells TypeScript exactly what to expect, so every property access is checked at compile time rather than discovered as `undefined` at runtime in a live app.",
    answer_keywords: [
      "interface",
      "User",
      "id",
      "number",
      "name",
      "string",
      "email",
      "username",
    ],
    seed_code: "",
    starter_code: "",
    feedback_correct:
      "Well shaped — TypeScript now knows exactly what the API response looks like. Every property access on a User will be checked against this interface.",
    feedback_partial:
      "Good start. Make sure all four fields are present — id, name, email, and username — each with the correct primitive type.",
    feedback_wrong:
      "Use the `interface` keyword: `interface User { }` with four properties. Check https://jsonplaceholder.typicode.com/users/1 to confirm the field names and their value types.",
    expected:
      "interface User { id: number; name: string; email: string; username: string; }",
    analog_example:
      "interface Post {\n  id: number;\n  title: string;\n  body: string;\n  userId: number;\n} // models https://jsonplaceholder.typicode.com/posts/1",
    deepDiveLabel:
      "type vs interface — they look the same. So when do you reach for one over the other?",
    deepDive: {
      hook: "You've been using `type` since the custom types lesson — `type Item = { id: number; text: string }`. Now we're using `interface User { }` and they look almost identical. Same curly braces, same property syntax, same result when you hover over a variable in your editor.\n\nSo why does TypeScript have both? And more importantly — when does the choice actually matter?",
      pain: "⚠️ **Lesson:** You define `interface User { id: number; name: string; }`. Two files away, a teammate accidentally writes another `interface User { email: string; }`. TypeScript merges them silently into one combined interface. No error. Your User now has three fields where you defined two. With `type`, this would have been an immediate duplicate identifier error. Why does `interface` allow this — and when is it a feature rather than a bug?",
      mentalModel:
        "**Mental model:** Think of `interface` as an **open specification document** and `type` as a **sealed contract**.\n- `interface` is designed to be *extended and merged* — it's open by nature. Libraries use this intentionally: you can add fields to a third-party interface without touching the original file.\n- `type` is closed — once defined, it's final. A duplicate `type` with the same name is an immediate error.\n- Both describe object shapes equally well for everyday use. The differences surface at the edges:\n\n```tsx\n// extending — interface uses extends, type uses &\ninterface Animal { name: string; }\ninterface Dog extends Animal { breed: string; }\n\ntype Animal = { name: string; };\ntype Dog = Animal & { breed: string; };\n\n// only type can do unions\ntype ID = number | string;  // ✅\ninterface ID {}  // ❌ interfaces cannot be unions\n\n// only interface can merge\ninterface User { id: number; }\ninterface User { name: string; } // ✅ merges silently\n\ntype User = { id: number; };\ntype User = { name: string; } // ❌ duplicate identifier error\n```\n- For API response shapes — reach for `interface`. It's what interfaces were designed for.\n- For unions or computed types — reach for `type`. It's more expressive.\n- Rule of thumb: object shape → `interface`. Needs a `|` → `type`.",
      discover:
        "**Pattern — interface for API response shape:**\n```tsx\ninterface User {\n  id: number;\n  name: string;\n  username: string;\n  email: string;\n}\n\n// extend it when a detail view needs more fields\ninterface UserDetail extends User {\n  phone: string;\n  website: string;\n}\n\n// use in useState\nconst [user, setUser] = useState<User | null>(null);\n\n// cast the fetch response\nconst data = await response.json() as User;\nsetUser(data);\n```\n- `interface User` → open, extendable, designed for object shapes\n- `extends User` → inherit all User fields and add more — no duplication\n- `User | null` → union still works — type and interface compose freely\n- `as User` → type assertion telling TS to trust the response matches the interface",
      quickRules:
        "**Quick rules:**\n- ✅ shape your interface around what the API actually returns — open the response in your browser first, then model it\n- ✅ only include fields you actually use — you don't need to type the entire response\n- ✅ `interface` for object shapes — API responses, props, class contracts\n- ✅ `type` for unions — `type Status = 'active' | 'inactive'`\n- ✅ `interface extends` for inheritance — adds fields without duplication\n- ✅ `type &` for intersection — same result as extends but sealed\n- ❌ `interface` for unions — interfaces cannot be union types\n- ❌ duplicate `type` names — immediate error, unlike interface merging\n- ❌ invent field names — if the API sends `username` and you type `userName`, you get `undefined` at runtime with no TS error\n- both compile away completely — zero runtime cost, zero bundle impact",
      watchOut:
        "👀 **Watch out:** The most common interface mistake with APIs is mismatching field names. The API sends `username` — you type `userName` with a capital N. TypeScript compiles clean because the type assertion `as User` trusts you. But `user.userName` is `undefined` at runtime. Always open the actual API response in your browser before writing the interface — the field names must match exactly, character for character.",
      dryRun:
        "🔁 **Think:** You have `interface User { id: number; name: string; }` and you need a `UserDetail` that has everything User has plus `phone: string` and `website: string`. Write the `interface` version using `extends`. Now write the `type` version using `&`. Both work — but which one would also let you define `type FlexibleId = number | string`, and why can't the interface version do the same thing?",
      build:
        "**Learning focus:** Define an interface shaped around a real API response — understanding that the API is the source of truth, the interface is your TypeScript mirror of it, and that `interface` is the idiomatic choice for object shapes while `type` handles unions and complex composition.",
    },
  },
  {
    id: "step3",
    type: "question",
    phase: "Step 3 of 9",
    paal: "Inside the component, declare a state variable to hold the fetched user. It should be typed using the User interface, and start as null since no data has arrived yet.",
    hint: "The initial value is null — the fetch hasn't run yet. The type needs to account for both the loaded and not-yet-loaded states.",
    example_code: "const [post, setPost] = useState<Post | null>(null);",
    think_prompt:
      "Why is User | null the correct type for the user state variable?",
    mc_options: [
      "Because TypeScript requires null for all API responses",
      "Because the component renders before the fetch completes — user is null until data arrives",
      "Because User alone would cause a runtime error on first render",
    ],
    mc_correct_option:
      "Because the component renders before the fetch completes — user is null until data arrives",
    mc_anchor:
      "React renders the component immediately — the fetch hasn't finished yet. null is the honest starting value: no user exists until the API responds.",
    why_this_matters:
      "Every async data-fetching component starts life with no data. `User | null` models that reality honestly — the state is either a full User object or nothing yet. TypeScript then forces you to handle both possibilities before accessing any property, which is exactly what prevents the blank screen crashes that happen when JSX tries to read `user.name` before the fetch completes.",
    answer_keywords: ["useState", "User", "null", "setUser"],
    seed_code: "",
    starter_code: "",
    feedback_correct:
      "Honest initial state — null says 'nothing here yet'. TypeScript will now enforce a null check every time you try to read a User property, protecting the first render.",
    feedback_partial:
      "Almost. The type needs to be `User | null` — not just `User`. The component renders before the fetch completes, so null must be a valid state.",
    feedback_wrong:
      "Declare: `const [user, setUser] = useState<User | null>(null)` — the union type covers both the empty state and the loaded state.",
    expected: "const [user, setUser] = useState<User | null>(null);",
    analog_example:
      "const [post, setPost] = useState<Post | null>(null); // null until the API responds",
    deepDiveLabel:
      "Why does state that holds API data always start as null — and what does User | null actually mean?",
    deepDive: {
      hook: "You've initialised state with `0`, `false`, and `''` — values that make sense from the start. Now you're initialising with `null`. Not zero, not an empty object, not a blank User — null.\n\nThis isn't a workaround. It's the most honest thing you can say about data that doesn't exist yet. The fetch hasn't fired. The API hasn't responded. There is no user. `null` is how TypeScript and your future self both know that.",
      pain: "⚠️ **Lesson:** You declare `const [user, setUser] = useState<User>({})`. TypeScript errors immediately — an empty object doesn't satisfy the User interface because `id`, `name`, `email`, and `username` are all required and missing. You try `useState<User>(undefined)` — same problem. What's the correct starting value for state that genuinely doesn't exist yet?",
      mentalModel:
        "**Mental model:** Think of `User | null` as a **results panel with two modes**.\n- `null` mode: the panel is empty — the search hasn't come back yet. Nothing to display.\n- `User` mode: the panel is populated — the fetch completed and data arrived.\n- TypeScript knows about both modes. When the state is `User | null`, it refuses to let you access `user.name` directly — because in null mode, there's no name to read. It forces a check first.\n- `null` and `undefined` are different signals:\n  - `null` → *intentionally empty* — you set it this way on purpose\n  - `undefined` → *never assigned* — something wasn't set\n  - For API state, `null` is the deliberate choice: the data slot exists, it's just waiting to be filled.",
      discover:
        "**Pattern — union type for async state:**\n```tsx\n// ✅ correct — honest about the empty state\nconst [user, setUser] = useState<User | null>(null);\n\n// after fetch completes:\nsetUser(data); // now User, not null\n\n// TypeScript forces null check before property access:\n{user && <p>{user.name}</p>}       // guard with &&\n{user?.name}                        // optional chaining\n{user !== null ? user.name : '...'}  // explicit ternary\n```\n- `User | null` → union: state is one or the other, never both\n- `null` initial value → component can render safely before fetch completes\n- TypeScript enforces the null check — it won't let you write `user.name` without it\n- `user?.name` optional chaining is the cleanest null-safe property access",
      quickRules:
        "**Quick rules:**\n- ✅ `useState<User | null>(null)` — correct for data that arrives asynchronously\n- ❌ `useState<User>({})` — empty object doesn't satisfy the interface\n- ❌ `useState<User>(undefined)` — undefined isn't in the User type\n- ❌ `useState(null)` without the type — TypeScript infers `null` only, can never hold a User\n- `null` = intentionally empty, waiting for data\n- `undefined` = never set, usually a bug in this context\n- once state is `User | null`, access properties with `user?.name` or guard with `user &&`",
      watchOut:
        "👀 **Watch out:** `useState(null)` without the generic type looks fine but TypeScript infers the type as `null` — permanently. When your fetch completes and you call `setUser(data)`, TypeScript will error: *'Argument of type User is not assignable to parameter of type null'*. Always include the full union in the generic: `useState<User | null>(null)`. The generic is what tells TypeScript the state can become a User later.",
      dryRun:
        "🔁 **Think:** Your component renders for the first time. `user` is `null`. Your JSX has `<p>{user.name}</p>`. TypeScript errors at compile time — why? You fix it to `<p>{user?.name}</p>`. Now what renders on first load when user is null? And what renders after `setUser(fetchedUser)` is called? (Hint: what does optional chaining return when the object is null?)",
      build:
        "**Learning focus:** Declare async data state using `useState<User | null>(null)` — understanding that null is the honest initial value for data that doesn't exist yet, and that the `User | null` union type forces null-safe property access throughout the component.",
    },
  },
  {
    id: "step4",
    type: "question",
    phase: "Step 4 of 9",
    paal: "Declare a second state variable to track which user ID to fetch. Type it as a number and initialise it to 1 — this will be the control knob that drives the fetch.",
    hint: "Start at 1 because JSONPlaceholder has users with IDs 1 through 10. This value will go into the dependency array of useEffect in the next step.",
    example_code: "const [postId, setPostId] = useState<number>(1);",
    think_prompt:
      "What makes userId different from the user state variable you just declared?",
    mc_options: [
      "Nothing — they're both just state variables",
      "userId is a controller — changing it triggers a new fetch. user is the result — it holds what came back",
      "userId should be a string because it goes into a URL",
    ],
    mc_correct_option:
      "userId is a controller — changing it triggers a new fetch. user is the result — it holds what came back",
    mc_anchor:
      "One state variable controls the query, the other holds the response. This pairing drives the whole component.",
    why_this_matters:
      "userId isn't just a number sitting in state — it's the value that will live in useEffect's dependency array. When userId changes, the effect re-runs, a new fetch fires, and user updates with the new response. This controller/result pattern is behind every search box, pagination control, and filter dropdown you'll ever build in React.",
    answer_keywords: ["useState", "number", "1", "setUserId", "userId"],
    seed_code: "",
    starter_code: "",
    feedback_correct:
      "The control knob is set. Change this value later and useEffect will automatically fetch the matching user — that's the dependency array doing its job.",
    feedback_partial:
      "Almost. Make sure the type is explicitly `number` and the initial value is `1` — JSONPlaceholder users start at ID 1.",
    feedback_wrong:
      "Declare: `const [userId, setUserId] = useState<number>(1)` — a number typed state variable starting at 1.",
    expected: "const [userId, setUserId] = useState<number>(1);",
    analog_example:
      "const [postId, setPostId] = useState<number>(1); // change postId → fetch fires for the new post",
    deepDiveLabel:
      "A state variable that controls another state variable — the controller/result pattern",
    deepDive: {
      hook: "Most state variables you've declared so far have been self-contained — a counter counts, a toggle toggles, an input holds what was typed. `userId` is different. It doesn't display anything directly. It doesn't represent something the user sees. Its entire job is to *tell the effect what to do*.\n\nThis is a new kind of state — a controller. And it's one of the most powerful patterns in React once you recognise it.",
      pain: "⚠️ **Lesson:** You hardcode the fetch URL: `fetch('https://jsonplaceholder.typicode.com/users/1')`. It works — user 1 loads every time. Then the requirement changes: the user should be able to browse through different users with next/previous buttons. You realise you need the URL to be dynamic. You try changing the string — but the effect never re-runs because nothing in its dependency array changed. Why doesn't changing a hardcoded URL trigger a new fetch?",
      mentalModel:
        "**Mental model:** Think of `userId` as a **dial on a radio** and `user` as the **speaker output**.\n- The dial (`userId`) controls which station you're tuned to.\n- The speaker (`user`) plays whatever that station is broadcasting.\n- Turn the dial → the station changes → new audio comes out.\n- The speaker doesn't control itself — it just outputs whatever the current dial position produces.\n- `useEffect` is the tuner in between — it watches the dial. When the dial moves, it retunes and the speaker updates.\n- This is why `userId` goes into the dependency array and `user` does not — the effect *produces* user, it doesn't *watch* it.",
      discover:
        "**Pattern — controller state wired to a dependency array:**\n```tsx\nconst [userId, setUserId] = useState<number>(1);\n\n// userId in the dep array → effect re-runs when userId changes\nuseEffect(() => {\n  fetch(`https://jsonplaceholder.typicode.com/users/${userId}`)\n    .then(res => res.json())\n    .then(data => setUser(data as User));\n}, [userId]); // ← userId is the controller\n\n// buttons that turn the dial:\n<button onClick={() => setUserId(prev => prev - 1)}>Previous</button>\n<button onClick={() => setUserId(prev => prev + 1)}>Next</button>\n```\n- `userId` in the URL → dynamic fetch target\n- `userId` in the dep array → effect re-runs when it changes\n- `setUserId(prev => prev + 1)` → functional updater, same pattern as the counter\n- `user` is never in the dep array — it's the output, not the trigger",
      quickRules:
        "**Quick rules:**\n- ✅ `useState<number>(1)` — explicit number type, starts at a valid JSONPlaceholder user ID\n- ✅ values that trigger a fetch go in the dependency array — covered in step 5\n- ✅ values that are *set by* the fetch never go in the dependency array — they're the output, not the trigger\n- ❌ hardcoding the ID in the fetch URL — the URL becomes static, changing state won't re-fetch anything\n- ❌ `useState<string>('1')` — a string ID needs parsing before it can go into a URL cleanly, type it as number from the start\n- ✅ start at `1` — JSONPlaceholder has users with IDs 1 through 10, starting at 1 guarantees a valid first fetch\n- the same pattern applies to any value that should trigger a new fetch when it changes: a search term, a page number, a selected category",
      watchOut:
        "👀 **Watch out:** JSONPlaceholder only has users with IDs 1 through 10. If `userId` goes below 1 or above 10, the API returns an empty response or 404 — `setUser` gets called with null or an unexpected shape, and your interface assumptions break. In a real app you'd add boundary guards to the increment/decrement handlers. For now, be aware the valid range is 1–10 when you test the next/previous buttons.",
      dryRun:
        "🔁 **Think:** `userId` starts at `1`. The user clicks Next — `setUserId(prev => prev + 1)`. React re-renders, `userId` is now `2`. useEffect sees `userId` changed — it fires a new fetch for user 2. The fetch completes, `setUser` is called, React re-renders again with the new user. How many total renders happened from the button click to the new user appearing on screen? (Hint: count each state update that causes a render.)",
      build:
        "**Learning focus:** Declare a controller state variable that drives a side effect — understanding that its value in the dependency array is what connects a user interaction to an automatic re-fetch, and that this controller/result pairing is the foundation of every dynamic data-fetching component.",
    },
  },
  {
    id: "step5",
    type: "question",
    phase: "Step 5 of 9",
    paal: "Add a useEffect that fetches a user from JSONPlaceholder using the current userId, updates the user state with the response, and only re-runs when userId changes.",
    hint: "useEffect takes two arguments — a function and a dependency array. The fetch URL should include userId, and userId should be in the dependency array.",
    example_code:
      "useEffect(() => {\n  fetch(`https://jsonplaceholder.typicode.com/posts/${postId}`)\n    .then(res => res.json())\n    .then(data => setPost(data as Post));\n}, [postId]);",
    think_prompt:
      "Which dependency array makes useEffect fetch a new user every time userId changes, but not on every render?",
    mc_options: [
      "useEffect(() => { fetch(...) }, ) — no array, runs on every render",
      "useEffect(() => { fetch(...) }, []) — empty array, runs once on mount only",
      "useEffect(() => { fetch(...) }, [userId]) — runs on mount and whenever userId changes",
    ],
    mc_correct_option:
      "useEffect(() => { fetch(...) }, [userId]) — runs on mount and whenever userId changes",
    mc_anchor:
      "[userId] tells React: re-run this effect when userId changes. On mount userId is 1 — first fetch fires. User clicks next, userId becomes 2 — effect fires again.",
    why_this_matters:
      "The dependency array is what connects a state change to an automatic side effect. Without it, the effect either runs too often (no array) or never re-runs (empty array). With [userId], the fetch is perfectly coupled to the value that controls it — change userId and the right data loads automatically, with no manual wiring needed.",
    answer_keywords: [
      "useEffect",
      "fetch",
      "jsonplaceholder",
      "userId",
      "setUser",
      "as User",
      "[userId]",
    ],
    seed_code: "",
    starter_code: "",
    feedback_correct:
      "The effect is wired — userId in the URL pulls the right user, userId in the dep array re-runs the fetch when it changes. This is the core data-fetching pattern in React.",
    feedback_partial:
      "Good start. Check two things: is userId in the fetch URL, and is userId in the dependency array? Both need to be true for the fetch to be dynamic.",
    feedback_wrong:
      "The structure is: `useEffect(() => { fetch(`https://jsonplaceholder.typicode.com/users/${userId}`).then(res => res.json()).then(data => setUser(data as User)); }, [userId]);`",
    expected:
      "useEffect(() => {\n  fetch(`https://jsonplaceholder.typicode.com/users/${userId}`)\n    .then(res => res.json())\n    .then(data => setUser(data as User));\n}, [userId]);",
    analog_example:
      "useEffect(() => {\n  fetch(`https://jsonplaceholder.typicode.com/posts/${postId}`)\n    .then(res => res.json())\n    .then(data => setPost(data as Post));\n}, [postId]); // postId in URL + dep array = re-fetches when postId changes",
    deepDiveLabel:
      "useEffect runs after render — but the dependency array controls which renders trigger it",
    deepDive: {
      hook: "<svg width='100%' viewBox='0 0 680 380' role='img' xmlns='http://www.w3.org/2000/svg'><title>useEffect dependency array behaviour</title><desc>Shows three dependency array variants and when each fires relative to renders</desc><defs><marker id='arr' viewBox='0 0 10 10' refX='8' refY='5' markerWidth='6' markerHeight='6' orient='auto-start-reverse'><path d='M2 1L8 5L2 9' fill='none' stroke='context-stroke' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/></marker></defs><text x='340' y='22' text-anchor='middle' font-size='11' font-family='sans-serif' fill='#64748b'>the dependency array controls when useEffect fires</text><line x1='40' y1='60' x2='640' y2='60' stroke='#334155' stroke-width='1' stroke-dasharray='4 4'/><text x='40' y='52' font-size='10' font-family='sans-serif' fill='#475569'>renders →</text><text x='160' y='52' font-size='10' font-family='sans-serif' fill='#475569'>mount</text><text x='340' y='52' font-size='10' font-family='sans-serif' fill='#475569'>userId changes</text><text x='520' y='52' font-size='10' font-family='sans-serif' fill='#475569'>other state changes</text><line x1='160' y1='55' x2='160' y2='65' stroke='#475569' stroke-width='1.5'/><line x1='340' y1='55' x2='340' y2='65' stroke='#475569' stroke-width='1.5'/><line x1='520' y1='55' x2='520' y2='65' stroke='#475569' stroke-width='1.5'/><rect x='30' y='80' width='200' height='44' rx='8' fill='#0f172a' stroke='#f87171' stroke-width='1.5'/><text x='130' y='98' text-anchor='middle' font-size='11' font-family='monospace' fill='#f87171'>useEffect(() => {}, )</text><text x='130' y='114' text-anchor='middle' font-size='10' font-family='sans-serif' fill='#64748b'>no array — fires every render</text><line x1='230' y1='102' x2='258' y2='102' stroke='#f87171' stroke-width='1' marker-end='url(#arr)'/><circle cx='160' cy='102' r='5' fill='#f87171'/><circle cx='340' cy='102' r='5' fill='#f87171'/><circle cx='520' cy='102' r='5' fill='#f87171'/><line x1='160' y1='97' x2='160' y2='107' stroke='#f87171' stroke-width='1.5'/><line x1='340' y1='97' x2='340' y2='107' stroke='#f87171' stroke-width='1.5'/><line x1='520' y1='97' x2='520' y2='107' stroke='#f87171' stroke-width='1.5'/><text x='260' y='98' font-size='10' font-family='sans-serif' fill='#f87171'>fires on every single render ⚠️</text><rect x='30' y='160' width='200' height='44' rx='8' fill='#1e293b' stroke='#94a3b8' stroke-width='1.5'/><text x='130' y='178' text-anchor='middle' font-size='11' font-family='monospace' fill='#94a3b8'>useEffect(() => {}, [])</text><text x='130' y='194' text-anchor='middle' font-size='10' font-family='sans-serif' fill='#64748b'>empty array — mount only</text><line x1='230' y1='182' x2='258' y2='182' stroke='#94a3b8' stroke-width='1' marker-end='url(#arr)'/><circle cx='160' cy='182' r='5' fill='#94a3b8'/><line x1='160' y1='177' x2='160' y2='187' stroke='#94a3b8' stroke-width='1.5'/><text x='260' y='178' font-size='10' font-family='sans-serif' fill='#94a3b8'>fires once on mount only ✓</text><text x='260' y='192' font-size='10' font-family='sans-serif' fill='#475569'>userId change → no re-fetch</text><rect x='30' y='240' width='200' height='44' rx='8' fill='#0f172a' stroke='#22d3ee' stroke-width='2'/><text x='130' y='258' text-anchor='middle' font-size='11' font-family='monospace' fill='#22d3ee'>useEffect(() => {}, [userId])</text><text x='130' y='274' text-anchor='middle' font-size='10' font-family='sans-serif' fill='#64748b'>value array — on mount + on change</text><line x1='230' y1='262' x2='258' y2='262' stroke='#22d3ee' stroke-width='1' marker-end='url(#arr)'/><circle cx='160' cy='262' r='5' fill='#22d3ee'/><circle cx='340' cy='262' r='5' fill='#22d3ee'/><line x1='160' y1='257' x2='160' y2='267' stroke='#22d3ee' stroke-width='1.5'/><line x1='340' y1='257' x2='340' y2='267' stroke='#22d3ee' stroke-width='1.5'/><text x='260' y='258' font-size='10' font-family='sans-serif' fill='#22d3ee'>fires on mount + when userId changes ✅</text><text x='260' y='272' font-size='10' font-family='sans-serif' fill='#475569'>other state changes → no re-fetch</text><rect x='30' y='306' width='620' height='58' rx='8' fill='#1e293b' stroke='#334155' stroke-width='1'/><text x='340' y='324' text-anchor='middle' font-size='10' font-family='sans-serif' fill='#94a3b8'>what happens inside the effect for this lesson:</text><text x='50' y='342' font-size='11' font-family='monospace' fill='#22d3ee'>fetch(`https://jsonplaceholder.typicode.com/users/${userId}`)</text><text x='50' y='357' font-size='10' font-family='sans-serif' fill='#64748b'>  userId in the URL + userId in the dep array → effect re-fetches a new user every time userId changes</text></svg>\n\nYou add a `useEffect` with a fetch inside. It works on first load — user 1 appears. You click next, `userId` becomes 2. Nothing happens. The effect doesn't re-run. The screen still shows user 1.\n\nYou added the fetch. You wired the state. But you forgot to tell React *what to watch*. That's the dependency array's job.",
      pain: "⚠️ **Lesson:** You write `useEffect(() => { fetch(...userId...) }, [])` — empty array. User 1 loads on mount. You click next, userId becomes 2, the URL would be different — but the effect never fires again. The empty array told React: *run this once and never again*. How do you tell React to re-run the effect specifically when userId changes?",
      mentalModel:
        "**Mental model:** Think of the dependency array as a **watchlist you hand to React**.\n- No array: React watches nothing — effect fires after every single render, no matter what changed.\n- `[]` empty array: React watches nothing after mount — effect fires once, then goes silent forever.\n- `[userId]`: React watches `userId` specifically — effect fires on mount, then again any time `userId` is a different value from the previous render.\n- React compares each value in the array between renders using `Object.is` — like `===` for primitives. If any value changed, the effect re-runs. If none changed, it skips.\n- Two things must both be true for a dynamic fetch: `userId` in the URL (so the right data is requested) AND `userId` in the dep array (so the effect re-runs when it changes). Miss either one and the fetch is broken.",
      discover:
        "**Pattern — useEffect with a dynamic dep array:**\n```tsx\nuseEffect(() => {\n  fetch(`https://jsonplaceholder.typicode.com/users/${userId}`)\n    .then(res => res.json())\n    .then(data => setUser(data as User));\n}, [userId]);\n//   ^^^^^^^\n//   watched value — effect re-runs when this changes\n```\n- `${userId}` in the URL → fetch targets the right user\n- `[userId]` in the dep array → React watches this value between renders\n- fires on mount (userId = 1 → fetches user 1)\n- fires when userId changes (userId = 2 → fetches user 2)\n- does NOT fire when user state updates, isLoading changes, or anything else changes\n- `as User` → type assertion so TypeScript knows the response shape",
      quickRules:
        "**Quick rules:**\n- ✅ `[userId]` — fires on mount and when userId changes\n- ✅ `[]` — fires on mount only, never again — for one-time setup\n- ❌ no array — fires after every render, including renders caused by the fetch itself — infinite loop risk\n- ❌ `[user]` in the dep array — user is set *by* the effect, watching it causes the effect to trigger itself\n- every value from the component scope that's used inside the effect should be in the dep array\n- the linter rule `exhaustive-deps` will warn you if you miss one\n- dep array values are compared with `Object.is` — primitive values (number, string, boolean) compare by value, objects and arrays compare by reference",
      watchOut:
        "👀 **Watch out:** If you put `user` in the dependency array, you create an infinite loop — the effect runs, sets `user`, React sees `user` changed, runs the effect again, sets `user` again, forever. The effect *produces* user — it should never *watch* user. Only put values in the dep array that the effect *reads* to decide what to do, never the values it *writes* as output.",
      dryRun:
        "🔁 **Think:** Your effect has `[userId]` in the dep array. The user clicks Next — `userId` goes from 1 to 2. The fetch fires, completes, and `setUser(data)` is called. React re-renders because `user` changed. Does the effect fire again on this render? Why or why not? (Hint: what value did React compare between the last two renders — and did it change?)",
      build:
        "**Learning focus:** Write a useEffect that fetches from a dynamic URL and places the changing value in the dependency array — understanding that the dep array is a watchlist that tells React exactly which state changes should trigger the effect to re-run.",
    },
  },
{
  id: "step6",
  type: "question",
  phase: "Step 6 of 9",
  paal: "Add a Previous button that decrements the userId by 1 when clicked. Use the functional updater form.",
  hint: "Inline arrow function on onClick — no event param needed. Use prev => prev - 1 inside the setter.",
  example_code: "<button onClick={() => setPage(prev => prev - 1)}>Previous</button>",
  think_prompt: "Which onClick wiring correctly decrements userId using the functional updater?",
  mc_options: [
    "<button onClick={setUserId(userId - 1)}>Previous</button>",
    "<button onClick={() => setUserId(userId - 1)}>Previous</button>",
    "<button onClick={() => setUserId(prev => prev - 1)}>Previous</button>",
  ],
  mc_correct_option:
    "<button onClick={() => setUserId(prev => prev - 1)}>Previous</button>",
  mc_anchor:
    "Functional updater — React passes the latest queued value, not the snapshot from the current render.",
  why_this_matters:
    "This button is the first half of the navigation mechanism. Clicking it changes userId, which useEffect is watching, which fires a new fetch for the previous user. The button doesn't know about the fetch — it just changes a number. Everything after that is automatic.",
  answer_keywords: ["button", "onClick", "setUserId", "prev", "prev - 1", "Previous"],
  seed_code: "",
  starter_code: "",
  feedback_correct:
    "First domino is set. Click Previous — userId drops by 1, useEffect fires, a new fetch goes out, the previous user loads.",
  feedback_partial:
    "Almost. Make sure you're using the functional updater form `prev => prev - 1` inside setUserId — not `userId - 1`.",
  feedback_wrong:
    "The pattern is: `<button onClick={() => setUserId(prev => prev - 1)}>Previous</button>` — inline arrow function, functional updater, no event param.",
  expected:
    "<button onClick={() => setUserId(prev => prev - 1)}>Previous</button>",
  analog_example:
    "<button onClick={() => setPage(prev => prev - 1)}>Previous</button>",
  deepDiveLabel:
    "One button, one state change — but it starts a chain that ends with a completely different user on screen",
  deepDive: {
    hook: "You've written click handlers before. You've written state updates before. You wrote useEffect in step 5. But this button is the first time all three connect into a single automatic chain:\n\nButton click → userId changes → useEffect sees the change → fetch fires → user state updates → UI shows new user.\n\nThe button doesn't know about the fetch. The fetch doesn't know about the button. They're connected only through the state variable that both touch — userId. That separation is intentional, and it's one of React's most powerful ideas.",
    pain: "⚠️ **Lesson:** You wire the button as `onClick={() => setUserId(userId - 1)}`. Single clicks work perfectly. Then you click rapidly — userId should drop from 5 to 3, but it only drops to 4. Both clicks read `userId = 5` from the same render snapshot and both set it to `4`. The second update was swallowed. You've seen this trap before in the counter lesson — what's the fix?",
    mentalModel:
      "**Mental model:** Think of this button as **tipping the first domino in a chain**.\n- Domino 1: `setUserId(prev => prev - 1)` → React queues the update\n- Domino 2: React re-renders → `userId` is now `4`\n- Domino 3: useEffect compares — did `userId` change? Yes → effect fires\n- Domino 4: fetch runs for user 4 → response arrives\n- Domino 5: `setUser(data)` → React re-renders → new user name appears\n- The button tips domino 1. Everything after falls automatically.\n- `prev => prev - 1` vs `userId - 1`: both tip domino 1 correctly for single clicks. Under rapid clicks, `userId - 1` reads a stale snapshot and two clicks produce one update. `prev => prev - 1` reads React's latest queued value and each click produces its own update.",
    discover:
      "**Pattern — button that drives a fetch cycle:**\n```tsx\n<button\n  onClick={() => setUserId(prev => prev - 1)}\n>\n  Previous\n</button>\n```\n- `() => setUserId(...)` → inline arrow function — no event param, body never uses it\n- `prev => prev - 1` → functional updater — operates on React's latest queued value\n- no named handler function needed — one-liner logic belongs inline\n- clicking starts the full cycle: userId → useEffect → fetch → user → UI\n- the button has no knowledge of the fetch — it only changes a number",
    quickRules:
      "**Quick rules:**\n- ✅ `onClick={() => setUserId(prev => prev - 1)}` — inline, functional updater, no unused param\n- ❌ `onClick={setUserId(prev => prev - 1)}` — calls setter on render, not on click\n- ❌ `onClick={() => setUserId(userId - 1)}` — snapshot read, loses updates under rapid clicks\n- ❌ `onClick={(e) => setUserId(prev => prev - 1)}` — event param declared but never used, drop it\n- JSONPlaceholder users start at ID 1 — clicking Previous on ID 1 returns an empty response\n- in a real app you'd guard the boundary: `disabled={userId <= 1}`",
    watchOut:
      "👀 **Watch out:** There's no lower boundary guard yet — if userId reaches 0 or below, JSONPlaceholder returns an empty response and `setUser` gets called with unexpected data. The component won't crash, but it'll show stale or blank content. Step 9 handles the JSX display — for now, just be aware that clicking Previous when userId is already 1 will produce a broken fetch. A real app would disable the button at the boundary.",
    dryRun:
      "🔁 **Think:** `userId` is currently `3`. The user clicks Previous. Trace every state change and re-render from that click until the new user's name appears on screen. Name each render and which state update caused it. (Hint: there are at least three distinct renders in the chain — can you name which state variable changed to cause each one?)",
    build:
      "**Learning focus:** Wire a button that updates a state variable watched by useEffect — understanding that the button's only job is to change the value, and the fetch follows automatically because useEffect is watching it.",
  },
},
  {
    id: "step7",
    type: "question",
    phase: "Step 7 of 9",
    paal: "Add a useEffect that logs 'Count changed' to the console and updates the document title to show the current count, running only when count changes.",
    hint: "useEffect takes a function and a dependency array. Include count in the array.",
    example_code:
      "useEffect(() => { console.log('User updated:', user); localStorage.setItem('user', user.name); }, [user])",
    think_prompt:
      "Which useEffect call logs to console and updates document.title whenever count changes?",
    mc_options: [
      "useEffect(() => { console.log('Count changed'); document.title = `Count: ${count}` })",
      "useEffect(() => { console.log('Count changed'); document.title = `Count: ${count}` }, [])",
      "useEffect(() => { console.log('Count changed'); document.title = `Count: ${count}` }, [count])",
    ],
    mc_correct_option:
      "useEffect(() => { console.log('Count changed'); document.title = `Count: ${count}` }, [count])",
    mc_anchor:
      "The dependency array [count] tells React to re-run the effect only when count changes. Without it, it runs after every render; with empty array [], it runs only once.",
    why_this_matters:
      "Side effects like logging, API calls, or DOM updates should happen after render, not during. useEffect ensures they run at the right time and can be cleaned up.",
    answer_keywords: [
      "useEffect",
      "(",
      "()",
      "=>",
      "{",
      "console.log",
      "document.title",
      "}",
      ",",
      "[",
      "count",
      "]",
      ")",
    ],
    seed_code: "",
    starter_code: "",
    feedback_correct:
      "Excellent! You've successfully implemented typed side effects that respond to state changes.",
    feedback_partial:
      "Good! Remember to include the dependency array so it only runs when count changes.",
    feedback_wrong:
      "Let's review: useEffect needs a function and dependency array to control when it runs.",
    expected: "Side effects run whenever count changes.",
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
  {
    label: "Step 8",
    id: "step8",
  },
];

export default createINPACTEngine({
  NODES,
  sideItems,
  lessonNum: 7,
  title: "useEffect & Side Effects (TypeScript)",
  shortName: "TS — USEEFFECT & SIDE EFFECTS",
});
