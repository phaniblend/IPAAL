/**
 * 🔒 LOCKED — React · TS lesson 5 — Conditional Rendering with Ternary (TypeScript).
 * Do not change steps, copy, or evaluation without explicit product/content sign-off.
 * Generated mirror: content/generated/react-ts/005_conditional-rendering-with-ternary_lesson.json
 */
import createINPACTEngine from "../inpact_engine_shared";

const NODES = [
{ id: "intro", type: "reveal", phase: "Lesson",
  content: {
    tag: "Tier 1 — JSX + TypeScript Foundations",
    title: "Props + Interface",
    body: "Every component you have built so far has stood alone — it renders its own hardcoded data. Real components are different. They receive data from a parent and render it faithfully, every time, for any data that fits the contract. That contract is a TypeScript interface on the props. In this lesson you define that interface, receive props inside the component, and render them — giving you a reusable building block you can drop anywhere in an enterprise web app and trust it will behave.",
    usecase: "You are building a ShipmentStatusBadge. Every row in a shipment table needs a coloured badge that shows the current status — 'In Transit', 'Delivered', 'Delayed', and so on. The badge must accept the status text as a required prop, an optional label for screen readers, and an optional click handler so a parent can make it interactive. The same component, different props, different badge — zero duplication."
  }
},
{ id: "prereqs", type: "prereqs", phase: "Prerequisites",
  items: [
    {
      lesson: 1,
      label: "JSX — The Full Language",
      reason: "Props are rendered inside JSX — you need to know how JSX expressions, attributes, and fragments work before you can receive and display prop values."
    },
    {
      lesson: 2,
      label: "TypeScript — Interfaces + Types",
      reason: "A props interface is a TypeScript interface. You need to know how to declare one, mark fields optional with ?, and apply it to a function parameter before you can type a component's props correctly."
    }
  ]
},
  { id: "objectives", type: "objectives", phase: "Objectives",
  items: [
    "Define a TypeScript interface that describes a component's props, with required and optional fields.",
    "Apply that interface as the type annotation on the component's parameter.",
    "Render required prop values inside JSX.",
    "Provide a default value for an optional prop using the destructuring default syntax.",
    "Accept and wire an optional onClick handler prop to a JSX element."
  ]
},
{
  id: "step-01",
  type: "step",
  phase: "Step 1 of 7",
  title: "Imports",
  paal: "Add the single import this component needs — the one thing from React that lets you describe what a component returns.",
  hint: "You have done this in every lesson so far. JSX.Element is the return type — check your toolbox shelf for what makes that available.",
  example_code: `import { useCallback } from 'react';`,
  think_prompt: "JSX.Element is already globally available. What, then, does this import actually give the component — and do you need anything else?",
  mc_options: [
    "import React from 'react'",
    "import { useState } from 'react'",
    "No import is needed — JSX.Element is globally available and this component uses no hooks"
  ],
  mc_correct_option: "No import is needed — JSX.Element is globally available and this component uses no hooks",
  mc_anchor: "JSX.Element is a global type in a correctly configured React + TypeScript project. This component defines an interface, destructures props, and returns JSX — none of that requires a React import or a hook import.",
  why_this_matters: "Knowing exactly what each import provides — and what it does not — keeps your files clean and your mental model precise. Every import on the shelf should earn its place.",
  answer_keywords: [],
  seed_code: ``,
  starter_code: `// Add your import here (or decide none is needed)`,
  feedback_correct: "Correct — no import needed. JSX.Element is globally available and this component uses no hooks. A clean file with zero unnecessary imports is the right starting point.",
  feedback_partial: "Close, but check whether the thing you imported is actually used anywhere in this component before you add it.",
  feedback_wrong: "This component defines a props interface, destructures props, and returns JSX. None of that requires a React default import or a hook. JSX.Element is already a global type — nothing needs to bring it in.",
  expected: ``,
  analog_example: `// A utility function that needs no imports
const formatCurrency = (amount: number, currency: string): string => {
  return \`\${currency}\${amount.toFixed(2)}\`;
};`,
  deepDiveLabel: "Why does JSX.Element exist as a global type — and when would you actually need a React import?",
  deepDive: {
    hook: `Picture your first day at a new job. You walk into the office and find a fully stocked desk — pens, notepad, laptop, coffee. You did not order any of it. The office manager set it up before you arrived. You just sit down and work.\n\nThat is exactly what a correctly configured React + TypeScript project does with JSX.Element. The tsconfig.json includes \`"jsx": "react-jsx"\` which tells the compiler to use the automatic JSX transform. The automatic transform injects the JSX runtime into every file silently — you never see it, you never import it, but it is always there. JSX.Element is declared in the global React type definitions that ship with @types/react, so TypeScript knows the type without you spelling it out.\n\nNow imagine a new hire who does not trust the stocked desk. Every morning they bring their own pens, their own notepad, their own coffee maker. The desk gets cluttered. Things get duplicated. Everyone watching finds it strange.\n\nThat is what adding \`import React from 'react'\` does in a modern project — it is redundant noise that signals the writer learned React before 2022 and has not updated their habits. It does not break anything, but it tells the reader the author is not sure why it is there.\n\nThe one time you genuinely need a named import from React is when you use something the global scope does not provide — a hook like useState, a type like ReactNode, a utility like createContext. Those live inside the React package and must be imported explicitly. But JSX itself, and the JSX.Element type, are handled for you before your file even opens."`,
    pain: `⚠️ **Lesson:** Unnecessary imports create noise and signal confusion about what the toolchain provides.\n**Symptom:** A file begins with \`import React from 'react'\` on every component even when nothing from that import is referenced — the linter flags it as unused, the reader wonders if something was forgotten, and the habit carries forward into every new file.`,
    mentalModel: `**Mental model: The stocked desk**\n\nYour tsconfig and the automatic JSX transform act as the office manager — they provision the room before you arrive. JSX.Element is already on the desk. You only reach into the React package when you need something that was not pre-provisioned: a hook, a specific type, a context utility. The rule is simple — if TypeScript complains that a name is undefined, import it. If TypeScript is silent, the desk already has what you need. Treat every import as a deliberate decision, not a ritual you copy from the last file you touched.`,
    discover: `**Pattern — import only what you use:**\n\`\`\`tsx\n// ✅ Component using a hook — named import justified\nimport { useState } from 'react';\n\nconst Counter = (): JSX.Element => {\n  const [count, setCount] = useState(0);\n  return <button onClick={() => setCount(prev => prev + 1)}>{count}</button>;\n};\n\n// ✅ Component using no hooks — no import needed\nconst Label = ({ text }: { text: string }): JSX.Element => {\n  return <span>{text}</span>;\n};\n\n// ❌ Redundant React import — automatic transform makes this unnecessary\nimport React from 'react';\nconst Badge = (): JSX.Element => <span>Status</span>;\n\`\`\`\n- The automatic JSX transform handles JSX syntax without a React import\n- JSX.Element is declared globally by @types/react — no import required\n- Named imports (useState, useEffect, ReactNode) must still be imported explicitly\n- An unused import is a signal to the reader that the author is uncertain`,
    quickRules: `**Quick rules:**\n- ✅ Use named imports for hooks: \`import { useState } from 'react'\`\n- ✅ Use named imports for types you reference explicitly: \`import { ReactNode } from 'react'\`\n- ✅ Write JSX freely — the transform handles it without any import\n- ✅ Trust TypeScript silence — if it compiles, the type is available\n- ❌ Never write \`import React from 'react'\` in a modern project\n- ❌ Never import something and then not use it\n- ❌ Never assume an import is needed just because the last file had it`,
    watchOut: `👀 **Watch out:** If you see \`import React from 'react'\` in a codebase, do not copy it into your next file by reflex. Check the tsconfig — if \`"jsx"\` is set to \`"react-jsx"\` or \`"react-jsxdev"\`, the import is unnecessary. The only reason to keep it is if the project has not migrated to the automatic transform, which is rare in any project created after 2021.`,
    dryRun: `🔁 **Think:** A teammate sends you two files. File A starts with \`import React from 'react'\` and uses only \`useState\`. File B starts with \`import { useState } from 'react'\` and uses only \`useState\`.\n\n— In File A, what does the \`React\` name refer to after the import? Is it referenced anywhere in the file? What does the linter say?\n— In File B, is \`useState\` available? Is anything unused? What does the linter say?\n(Hint: trace what is actually consumed from each import — then decide which file is correct.)`,
    build: `**Learning focus:** Decide deliberately whether an import is needed before writing it — and write nothing that the toolchain already provides.`
  }
},
{
  id: "step-02",
  type: "step",
  phase: "Step 2 of 7",
  title: "Props Interface",
  paal: "Define a TypeScript interface called ShipmentStatusBadgeProps. It must have three fields: status as a required string, label as an optional string, and onClick as an optional function that takes no arguments and returns nothing.",
  hint: "You defined interfaces in Lesson 2. Optional fields use ?. A function that takes no arguments and returns nothing has a specific TypeScript signature — think about how you wrote function types before.",
  example_code: `interface TooltipProps {
  text: string;
  maxWidth?: number;
  onDismiss?: () => void;
}`,
  think_prompt: "What is the difference between a field typed as `string` and one typed as `string | undefined` — and why does the `?` shorthand exist for optional props?",
  mc_options: [
    "interface ShipmentStatusBadgeProps { status: string; label?: string; onClick?: () => void; }",
    "interface ShipmentStatusBadgeProps { status: string; label: string | undefined; onClick: Function; }",
    "interface ShipmentStatusBadgeProps { status?: string; label?: string; onClick?: () => void; }"
  ],
  mc_correct_option: "interface ShipmentStatusBadgeProps { status: string; label?: string; onClick?: () => void; }",
  mc_anchor: "status is required — no ? — so TypeScript enforces that every parent must pass it. label and onClick use ? which correctly marks them as optional. onClick uses the precise () => void signature rather than the loose Function type, which gives callers accurate type checking on what they pass.",
  why_this_matters: "The props interface is the contract between this component and every parent that uses it. Required fields guarantee the component always has the data it needs to render. Optional fields give parents flexibility without breaking the contract. Getting this boundary right in a TypeScript interface is what makes a component trustworthy across an entire enterprise web app.",
  answer_keywords: [
    "interface ShipmentStatusBadgeProps",
    "status: string",
    "label?: string",
    "onClick?: () => void"
  ],
  seed_code: ``,
  starter_code: `// Define your props interface here
`,
  feedback_correct: "Correct. status is required so every parent is forced to supply it — the component can never render without it. label and onClick are optional so parents that do not need them stay clean. The () => void signature is precise — Function would accept anything callable and lose type safety.",
  feedback_partial: "The shape is close but check your optional markers. Is status definitely required? Are label and onClick definitely optional? Also check the onClick type — () => void is more precise than a generic function type.",
  feedback_wrong: "A props interface needs to distinguish required fields from optional ones using ?. Making status optional would mean a parent could render the badge with no status text at all — that breaks the component's core purpose. Check each field and ask: can this component function without this value?",
  expected: `interface ShipmentStatusBadgeProps {
  status: string;
  label?: string;
  onClick?: () => void;
}`,
  analog_example: `interface AvatarProps {
  src: string;
  alt: string;
  size?: number;
  onError?: () => void;
}`,
  deepDiveLabel: "Why is `() => void` safer than `Function` — and what does void actually promise the caller?",
  deepDive: {
    hook: `Imagine you hire a courier to deliver a package. You hand them the address — that is the required prop, the thing they absolutely must have to do the job. You also tell them: if you cannot find the building, call me. That phone number is optional — most deliveries go fine without it, but when things go wrong, the option is there.\n\nNow imagine the courier's job description says "must accept instructions." That is technically true — but it tells you nothing. Does that mean written instructions? Verbal? In Mandarin? The description is so loose it is useless as a contract.\n\nThis is the difference between typing an onClick as \`Function\` versus \`() => void\`. \`Function\` says "something callable." It accepts a function that takes seventeen arguments and returns a database connection. TypeScript will not complain. The parent can pass anything callable and the compiler stays silent even when the shape is completely wrong.\n\n\`() => void\` is precise. It says: this function takes no arguments and its return value will be ignored. The caller knows exactly what to pass. The component knows exactly what to call. And void does something subtle but important — it does not mean the function returns undefined. It means the component does not care what the function returns. A parent can pass a function that returns a boolean, a string, anything — and the contract still holds, because the component will never look at the return value. This makes onClick handlers flexible for parents while remaining safe for the component."`,
    pain: `⚠️ **Lesson:** Typing a callback as \`Function\` silently accepts functions with the wrong shape.\n**Symptom:** A parent passes an async function that returns a Promise, or a function that expects an argument, and TypeScript raises no error at the call site — the bug only surfaces at runtime when the component calls the handler and something unexpected happens.`,
    mentalModel: `**Mental model: The courier's job description**\n\nA precise function type is a job description that leaves no ambiguity. \`() => void\` tells every future reader three things: the component will call this with no arguments, the component will not use the return value, and anything you pass must match that shape. \`Function\` is a job description that says "does things" — technically accurate, practically useless. In a real app with dozens of components sharing props across teams, precision in function types is what prevents an entire class of runtime bugs that TypeScript could have caught at compile time.`,
    discover: `**Pattern — precise function types in props:**\n\`\`\`tsx\n// ✅ Precise — no arguments, return value ignored\ninterface ButtonProps {\n  onClick?: () => void;\n}\n\n// ✅ Precise — receives the new value, return value ignored\ninterface InputProps {\n  onChange?: (value: string) => void;\n}\n\n// ✅ Precise — receives an event, return value ignored\ninterface FormProps {\n  onSubmit?: (event: React.FormEvent) => void;\n}\n\n// ❌ Loose — accepts any callable, loses all type safety\ninterface BadProps {\n  onClick?: Function;\n  onChange?: Function;\n}\n\`\`\`\n- Always spell out argument types and count in callback props\n- void as a return type means "caller ignores the return value" — not "must return undefined"\n- The more precise the function type, the earlier TypeScript catches a mismatch\n- Precise types serve as inline documentation for every parent component`,
    quickRules: `**Quick rules:**\n- ✅ Use \`() => void\` for handlers the component calls with no arguments\n- ✅ Use \`(value: T) => void\` when the handler receives a specific argument\n- ✅ Mark fields optional with \`?\` when the component can render without them\n- ✅ Keep required fields required — do not default everything to optional out of convenience\n- ❌ Never use \`Function\` as a prop type — it provides no type safety\n- ❌ Never make a field optional if the component cannot meaningfully render without it\n- ❌ Never use \`any\` as a callback argument type`,
    watchOut: `👀 **Watch out:** It is tempting to make every prop optional "to be flexible." Resist this. Optional props shift the burden from the interface — where TypeScript enforces it — to the component body — where you have to write defensive checks. Every field that is truly required should be required in the interface. Let TypeScript do the enforcement so your component body stays clean.`,
    dryRun: `🔁 **Think:** A parent component renders \`<ShipmentStatusBadge />\` with no props at all. Walk through what TypeScript does at compile time:\n— Is status provided? What error appears and where?\n— Is label provided? Does TypeScript complain?\n— Is onClick provided? Does TypeScript complain?\n(Hint: trace which fields are required in the interface and what the compiler checks at the call site — not inside the component body.)`,
    build: `**Learning focus:** Write a props interface where required fields are enforced by TypeScript and optional fields use the precise ? syntax — giving every parent an unambiguous contract.`
  }
},
{
  id: "step-03",
  type: "step",
  phase: "Step 3 of 7",
  title: "Component Shell",
  paal: "Define the ShipmentStatusBadge component. It must accept props typed with ShipmentStatusBadgeProps and return an empty fragment as a placeholder.",
  hint: "The component standard from Lesson 1 applies here — arrow function, explicit JSX.Element return type. The difference this time is the parameter has a type annotation.",
  example_code: `const LoadingSpinner = (props: LoadingSpinnerProps): JSX.Element => {
  return <></>;
};`,
  think_prompt: "The parameter is named props and typed as ShipmentStatusBadgeProps — but you will destructure it in the next step. What does TypeScript already know about the shape of props at this point, before any destructuring happens?",
  mc_options: [
    "const ShipmentStatusBadge = (props: ShipmentStatusBadgeProps): JSX.Element => { return <></>; }",
    "const shipmentStatusBadge = (props: ShipmentStatusBadgeProps): JSX.Element => { return <></>; }",
    "const ShipmentStatusBadge = (props: ShipmentStatusBadgeProps) => { return <></>; }"
  ],
  mc_correct_option: "const ShipmentStatusBadge = (props: ShipmentStatusBadgeProps): JSX.Element => { return <></>; }",
  mc_anchor: "The component name starts with a capital letter so React treats it as a component. The return type is explicitly annotated as JSX.Element. The parameter is typed with the interface defined in the previous step. The lowercase version breaks React's component detection. The version without a return type annotation loses the explicit contract.",
  why_this_matters: "The component shell is the boundary declaration. Everything inside it will have access to a fully typed props object — TypeScript already knows which fields are required and which are optional before you write a single line of logic. In a real app this means autocomplete, error highlighting, and refactor safety from the moment the shell exists.",
  answer_keywords: [
    "const ShipmentStatusBadge",
    "props: ShipmentStatusBadgeProps",
    "JSX.Element",
    "return <></>"
  ],
  seed_code: `interface ShipmentStatusBadgeProps {
  status: string;
  label?: string;
  onClick?: () => void;
}`,
  starter_code: `interface ShipmentStatusBadgeProps {
  status: string;
  label?: string;
  onClick?: () => void;
}

// Define your component shell here
`,
  feedback_correct: "Correct. The capital letter makes it a valid React component. The explicit JSX.Element return type locks the contract. TypeScript now knows the full shape of props — required and optional — before any logic is written.",
  feedback_partial: "The structure is close — check two things: does the component name start with a capital letter, and is the return type explicitly annotated as JSX.Element?",
  feedback_wrong: "A React component must start with a capital letter — lowercase tells React to treat it as a plain HTML element, not a component. It also needs an explicit JSX.Element return type annotation so the contract is clear to TypeScript and to every reader.",
  expected: `interface ShipmentStatusBadgeProps {
  status: string;
  label?: string;
  onClick?: () => void;
}

const ShipmentStatusBadge = (props: ShipmentStatusBadgeProps): JSX.Element => {
  return <></>;
};`,
  analog_example: `const PriceTag = (props: PriceTagProps): JSX.Element => {
  return <></>;
};`,
  deepDiveLabel: "Why does a lowercase component name break React — and what exactly does the capital letter signal to the JSX transform?",
  deepDive: {
    hook: `Imagine a postal sorting system. Packages with a red label go to the residential handling line. Packages with a blue label go to the commercial handling line. The sorter does not read the address — it reads the label colour and routes accordingly. If you put the wrong colour label on a package, it goes to the wrong line regardless of what the address says.\n\nReact's JSX transform works exactly like this. When the transform encounters \`<ShipmentStatusBadge />\` it sees a capital letter and routes it to the component handling line — it looks up the variable by that name, calls it as a function, and renders what comes back. When it encounters \`<shipmentStatusBadge />\` it sees a lowercase letter and routes it to the HTML element handling line — it treats it as an unknown HTML tag and passes it straight to the DOM. React never calls your function. The DOM receives an element it does not recognise. Nothing renders.\n\nThis is not a TypeScript rule. TypeScript will not catch a lowercase component name as an error — it is a JSX transform convention baked into how React was designed. The capital letter is the label colour. Get it wrong and the sorter sends your component to the wrong line every time.`,
    pain: `⚠️ **Lesson:** A lowercase component name silently renders nothing instead of your component.\n**Symptom:** You define \`const badge = (...)\` and use \`<badge />\` in JSX — the screen is blank, no error appears in the console, and TypeScript does not complain. The component function is never called.`,
    mentalModel: `**Mental model: The postal label colour**\n\nThe JSX transform reads the first character of a component name and makes a binary routing decision: capital letter means "call this as a React component function," lowercase letter means "pass this to the DOM as an HTML tag." This decision happens before TypeScript, before your logic, before any rendering. The capital letter is not a style preference — it is the signal that triggers the correct routing. Every component name must start with a capital letter for the same reason every residential package needs the right label: without it, the system cannot route it correctly.`,
    discover: `**Pattern — capital letter routing:**\n\`\`\`tsx\n// ✅ Capital letter — JSX transform calls this as a component\nconst StatusBadge = (props: StatusBadgeProps): JSX.Element => {\n  return <span>{props.status}</span>;\n};\nconst rendered = <StatusBadge status="Active" />;\n\n// ❌ Lowercase — JSX transform treats this as an HTML tag\nconst statusBadge = (props: StatusBadgeProps): JSX.Element => {\n  return <span>{props.status}</span>;\n};\nconst broken = <statusBadge status="Active" />; // renders unknown HTML element\n\n// ✅ Dynamic component stored in a variable — must be capitalised\nconst Component = isAdmin ? AdminPanel : UserPanel;\nconst dynamic = <Component />;\n\`\`\`\n- The first character is the only thing the JSX transform checks for routing\n- Lowercase names produce unknown DOM elements with no error or warning\n- Even dynamically assigned components must be stored in a capitalised variable\n- TypeScript does not catch this — it is a runtime routing rule, not a type rule`,
    quickRules: `**Quick rules:**\n- ✅ Always start component names with a capital letter\n- ✅ Always annotate the return type as JSX.Element explicitly\n- ✅ Always type the props parameter with its interface\n- ✅ Use an empty fragment as the placeholder return until JSX is ready\n- ❌ Never start a component name with a lowercase letter\n- ❌ Never omit the return type annotation — inferred types hide the contract\n- ❌ Never use React.FC as the component type`,
    watchOut: `👀 **Watch out:** When you store a component in a variable to render it dynamically — for example, choosing between two components based on a condition — the variable name must also start with a capital letter. \`const panel = isAdmin ? AdminPanel : UserPanel\` followed by \`<panel />\` will silently render an unknown HTML element. \`const Panel = isAdmin ? AdminPanel : UserPanel\` followed by \`<Panel />\` works correctly.`,
    dryRun: `🔁 **Think:** Two components are defined — \`const Badge\` and \`const badge\`. Both are used in a parent's JSX: \`<Badge status="OK" />\` and \`<badge status="OK" />\`.\n— What does the JSX transform do with \`<Badge />\`? What function gets called?\n— What does the JSX transform do with \`<badge />\`? What appears in the DOM?\n(Hint: trace the routing decision the transform makes before any React logic runs — capital vs lowercase is the only input to that decision.)`,
    build: `**Learning focus:** Write every component name with a capital first letter and an explicit JSX.Element return type — these two details determine whether React routes the JSX correctly and whether TypeScript enforces the return contract.`
  }
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
