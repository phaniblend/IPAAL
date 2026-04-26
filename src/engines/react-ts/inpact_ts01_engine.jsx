
import createINPACTEngine from "../inpact_engine_shared";

function normalizeCode(text) {
  return String(text || "")
    .replace(/\r\n/g, "\n")
    .replace(/\s+/g, " ")
    .trim();
}

function isDeclaredAtModuleScope(raw, declarationStartIndex) {
  if (!Number.isFinite(declarationStartIndex) || declarationStartIndex < 0) return false;
  const firstComponentIndex = raw.search(
    /(?:const\s+[A-Z][A-Za-z0-9_]*\s*=\s*\(|function\s+[A-Z][A-Za-z0-9_]*\s*\()/m,
  );
  if (firstComponentIndex < 0) return true;
  return declarationStartIndex < firstComponentIndex;
}

function evalLesson1Step1(answer) {
  const raw = String(answer || "");
  const compact = normalizeCode(raw);
  const hasSignature = /const\s+[A-Z][A-Za-z0-9_]*\s*=\s*\(\s*[^)]*\)\s*(?::\s*[A-Za-z0-9_.<>]+)?\s*=>/m.test(raw);
  const hasReturnedJsx =
    /return\s*\(?\s*<>\s*<\/>\s*\)?\s*;?/m.test(raw) ||
    /return\s*\(\s*<([A-Za-z][A-Za-z0-9-]*)\b[\s\S]*?<\/\1>\s*\)\s*;?/m.test(raw) ||
    /return\s*<([A-Za-z][A-Za-z0-9-]*)\b[\s\S]*?<\/\1>\s*;?/m.test(raw) ||
    /=>\s*<>\s*<\/>\s*;?/.test(raw);
  return hasSignature && hasReturnedJsx && compact.length > 0 ? "correct" : "wrong";
}

function evalLesson1Step2(answer) {
  const raw = String(answer || "");
  const unionMatch = raw.match(/type\s+[A-Za-z_][A-Za-z0-9_]*\s*=\s*([^;\n]+)(?:;|\n|$)/m);
  if (!unionMatch || unionMatch.index == null) return "wrong";
  const rhs = unionMatch[1] || "";
  const hasPipe = /\|/.test(rhs);
  const hasExpectedLiterals =
    /['"]active['"]/.test(rhs) &&
    /['"]delayed['"]/.test(rhs) &&
    /['"]delivered['"]/.test(rhs);
  const moduleScoped = isDeclaredAtModuleScope(raw, unionMatch.index);
  return hasPipe && hasExpectedLiterals && moduleScoped ? "correct" : "wrong";
}

function evalLesson1Step3(answer) {
  const raw = String(answer || "");
  const interfaceMatch = raw.match(/interface\s+[A-Za-z_][A-Za-z0-9_]*\s*\{([\s\S]*?)\}/m);
  if (!interfaceMatch || interfaceMatch.index == null) return "wrong";
  const body = interfaceMatch[1] || "";
  const stringFieldCount = (body.match(/:\s*string\s*;?/g) || []).length;
  const hasCustomTypedField = /:\s*(?!string\b|number\b|boolean\b|any\b)[A-Za-z_][A-Za-z0-9_]*\s*;?/m.test(body);
  const hasEnoughFields = (body.match(/[A-Za-z_][A-Za-z0-9_]*\s*:/g) || []).length >= 3;
  const moduleScoped = isDeclaredAtModuleScope(raw, interfaceMatch.index);
  return stringFieldCount >= 1 && hasCustomTypedField && hasEnoughFields && moduleScoped ? "correct" : "wrong";
}

function evalLesson1Step4(answer) {
  const raw = String(answer || "");
  const hasSignature =
    /const\s+[A-Z][A-Za-z0-9_]*\s*=\s*\(\s*\{[\s\S]*?\}\s*:\s*[A-Za-z_][A-Za-z0-9_]*\s*\)\s*(?::\s*[A-Za-z0-9_.<>]+)?\s*=>/m.test(
      raw,
    );
  const hasFragmentWrapper = /return\s*\(\s*<>\s*[\s\S]*<\/>\s*\)\s*;?/m.test(raw);
  const hasElementWrapper = /return\s*\(\s*<([A-Za-z][A-Za-z0-9-]*)\b[\s\S]*<\/\1>\s*\)\s*;?/m.test(raw);
  const hasValidWrapper = hasFragmentWrapper || hasElementWrapper;
  // Step instruction asks for a label span; do not require a specific literal word.
  const hasSpan = /<span\b[^>]*>[\s\S]*?<\/span>/m.test(raw);
  const hasDiv = /<div>\s*<\/div>|<div><\/div>/m.test(raw);
  return hasSignature && hasValidWrapper && hasSpan && hasDiv ? "correct" : "wrong";
}

function evalLesson1Step5(answer) {
  const raw = String(answer || "");
  const pExpressionCount = (raw.match(/<p\b[^>]*>\s*\{[^}]+\}\s*<\/p>/gm) || []).length;
  return pExpressionCount >= 3 ? "correct" : "wrong";
}

function evalLesson1Step6(answer) {
  const raw = String(answer || "");
  const hasDynamicClass = /className\s*=\s*\{\s*`[^`]*\$\{[^}]+\}[^`]*`\s*\}/m.test(raw);
  return hasDynamicClass ? "correct" : "wrong";
}

const NODES = [
{
  id: "intro",
  type: "reveal",
  phase: "Lesson",
  content: {
    tag: "LESSON #1 (JSX)",
    title: "JSX — The Full Language",
    body: "Learn how JSX works under the hood — from compilation to expressions, fragments, and the attribute rules that trip up every beginner. You'll build a component that puts every JSX rule into practice in one place.",
    usecase:
      "JSX is the language you write React in. Every component you ever build — forms, dashboards, data tables, modals — is JSX. Getting the mental model right here means every lesson from here builds on solid ground.",
  },
},
{
  id: "objectives",
  type: "objectives",
  phase: "Objectives",
  items: [
    "Define a typed React component using arrow function syntax (explicit return type optional)",
    "Create a union type to represent a fixed set of real-world values",
    "Declare a props interface and destructure it in a component signature",
    "Return multiple sibling elements from a component using a Fragment",
    "Embed live JavaScript expressions inside JSX using curly braces",
    "Apply dynamic className based on a prop value",
  ],
},
// ── NO prereqs node — this is the track entry point ──────────────────────────
{
  id: "step1",
  type: "question",
  phase: "Step 1 of 6",
  paal: "Define the ShipmentCard component shell — a capitalized arrow function that returns JSX.",
  hint: "Arrow function, capitalized component name, and a valid JSX return (for example `<></>` or `<div></div>`).",
  example_code: `const Dashboard = () => {
  return <></>;
};`,
  think_prompt:
    "What is the minimum valid definition of a React component that TypeScript will accept?",
  mc_options: [
    "const shipmentCard = () => {}",
    "const ShipmentCard = () => { return <></>; }",
    "function ShipmentCard(): void { return <></>; }",
  ],
  mc_correct_option: "const ShipmentCard = () => { return <></>; }",
  mc_anchor:
    "Arrow function, capital first letter, and JSX return. Explicit return typing is optional in modern React TypeScript — infer it when you want.",
  why_this_matters:
    "Every component in an enterprise application follows this shell. The capital letter tells React this is a component, not a plain HTML tag. TypeScript can infer return types, and explicit annotation remains an optional clarity tool.",
  answer_keywords: ["const", "ShipmentCard", "=>", "return", "<>", "</>"],
  evaluate: evalLesson1Step1,
  seed_code: "",
  starter_code: "// define your component here",
  feedback_correct:
    "Exactly — capitalized component name, arrow function, and JSX return. Explicit return typing is optional.",
  feedback_partial:
    "Almost — check three things: capital first letter on the name, arrow function syntax, and a valid JSX return (`<></>` or `<div></div>` are both fine).",
  feedback_wrong:
    "Pattern: `const ShipmentCard = () => { return <div></div>; }` (or `return <></>;`) — capitalized name, arrow function, JSX return. You may add an explicit return type, but it is not required.",
  expected: `const ShipmentCard = () => {
  return <></>;
};`,
  analog_example: `const ScoreBoard = () => {
  return <></>;
};`,
  deepDiveLabel:
    "The component works with a lowercase name — so why does capitalisation actually matter?",
  deepDive: {
    hook: "You define `const shipmentCard = (): JSX.Element => { return <div>NX-1042</div>; }` and drop `<shipmentCard />` into your dashboard. Nothing renders. No error. No red screen. Just silence. You add a `console.log` inside — it never fires. The component exists, the code is valid JavaScript, and React is completely ignoring it.\n\nThis is one of the quietest bugs in React. No crash. No warning. Just a blank space where your component should be. And it comes down to one character — the case of the first letter.",
    pain: "⚠️ **Lesson:** You write `const shipmentCard` with a lowercase `s`. React renders nothing and throws no error. Why does a single lowercase letter cause React to silently skip your entire component?",
    mentalModel:
      "**Mental model:** React uses the first letter of a JSX tag as a signal to decide what it's looking at.\n- Lowercase first letter → React assumes it's a plain HTML element: `<div>`, `<span>`, `<p>`. It tries to create a DOM node with that name. `<shipmentCard>` is not a valid HTML element — React creates an unknown node, renders nothing meaningful, and moves on silently.\n- Uppercase first letter → React knows it's a component. It calls your function, takes the JSX it returns, and puts that in the DOM.\n- This is not a style guide suggestion. It is how React's JSX parser works at a mechanical level. Lowercase = HTML. Uppercase = component. No exceptions.",
    discover:
      "**Pattern — component shell:**\n```tsx\n// ✅ correct — uppercase, arrow function, explicit return type\nconst ShipmentCard = (): JSX.Element => {\n  return <></>;  \n};\n\n// ❌ lowercase — React treats it as an HTML tag, renders nothing\nconst shipmentCard = (): JSX.Element => {\n  return <></>;  \n};\n\n// ❌ void return type — JSX.Element is the contract, void is wrong\nconst ShipmentCard = (): void => {\n  return <></>;  \n};\n```\n- capital letter = component signal to React's JSX parser\n- `JSX.Element` = the TypeScript contract that this function returns valid JSX\n- empty fragment = valid placeholder until real JSX is added",
    quickRules:
      "**Quick rules:**\n- ✅ `const ShipmentCard = (): JSX.Element =>` — correct, modern standard\n- ❌ `const shipmentCard` — lowercase, React silently treats it as an HTML tag\n- ❌ `(): void` — wrong return type, JSX.Element is the contract\n- ❌ `React.FC` — retired pattern, never use it\n- empty fragment `<></>` is the correct placeholder return — never return `null` as a shell",
    watchOut:
      "👀 **Watch out:** Lowercase component bugs are silent — React won't throw, your TypeScript won't error, your linter may not catch it. The only symptom is a blank space in the UI. If a component ever renders nothing and you can't figure out why, check the capitalisation first.",
    dryRun:
      "🔁 **Think:** You have `const ShipmentCard = (): JSX.Element => { return <></>; }` and you use it as `<ShipmentCard />` in your dashboard. Now a teammate renames it to `const shipmentcard` and the usage stays as `<ShipmentCard />`. What happens — error, blank render, or does it still work? (Hint: the usage tag and the definition name are now different — what does React see when it encounters `<ShipmentCard />`?)",
    build:
      "**Learning focus:** Define a React component as a capitalised arrow function with an explicit JSX.Element return type — understanding that the capital letter is React's signal to treat it as a component rather than an HTML tag.",
  },
},
{
  id: "step2",
  type: "question",
  phase: "Step 2 of 6",
  paal: "Define a union type for shipment status at module scope (outside the component) with exactly three valid states: active, delayed, or delivered.",
  hint: "Place the type above the component, then join literals with |.",
  example_code: `type Direction = 'north' | 'south' | 'east' | 'west';`,
  think_prompt:
    "A shipment can only ever be in one of three states. How do you tell TypeScript to only allow those exact three string values — nothing else?",
  mc_options: [
    "const ShipmentStatus = ['active', 'delayed', 'delivered']",
    "type ShipmentStatus = 'active' | 'delayed' | 'delivered'",
    "type ShipmentStatus = string",
  ],
  mc_correct_option: "type ShipmentStatus = 'active' | 'delayed' | 'delivered'",
  mc_anchor:
    "A union of string literals locks the type to exactly those values. TypeScript will reject anything else at compile time — no invalid statuses can ever reach the UI.",
  why_this_matters:
    "In an enterprise application, shipment status drives badge colour, row highlighting, and filter logic. If a typo like 'actve' slips through, the wrong colour renders and no error is thrown. A union type makes that impossible — TypeScript catches the typo the moment you type it.",
  answer_keywords: ["type", "ShipmentStatus", "=", "active", "delayed", "delivered", "|"],
  evaluate: evalLesson1Step2,
  seed_code: `const ShipmentCard = (): JSX.Element => {
  return <></>;
};`,
  starter_code: `// define ShipmentStatus union type here

const ShipmentCard = (): JSX.Element => {
  return <></>;
};`,
  feedback_correct:
    "Exactly — three literal string values joined by | . TypeScript will now reject any status value that isn't one of these three. No typos, no invalid states reaching the UI.",
  feedback_partial:
    "Close — use `type` + `|` between the three literals, and define it outside the component at module scope.",
  feedback_wrong:
    "Pattern: define a module-scope union type above the component, like `type Status = 'active' | 'delayed' | 'delivered'`.",
  expected: `type ShipmentStatus = 'active' | 'delayed' | 'delivered';

const ShipmentCard = (): JSX.Element => {
  return <></>;
};`,
  analog_example: `type PlayerTier = 'bronze' | 'silver' | 'gold';`,
  deepDiveLabel:
    "type ShipmentStatus = string works and is simpler — so what does the union actually buy you?",
  deepDive: {
    hook: "Your enterprise application dashboard has a status badge that colours shipments green, amber, or red. The colour logic reads the status string and picks a className. A backend engineer changes the API response from `'active'` to `'in_transit'`. No TypeScript error. No runtime crash. Every active shipment now renders with no colour — the className logic hits no match and silently falls through to unstyled.\n\nYou spend 40 minutes in the network tab before you spot the string mismatch. The whole thing could have been a red squiggle the moment the API type was updated — if the status had been a union instead of a plain string.",
    pain: "⚠️ **Lesson:** You type `status = 'actve'` — a one-character typo. TypeScript says nothing. The badge renders unstyled. No error, no warning. How does a union type turn that silent failure into an immediate red squiggle?",
    mentalModel:
      "**Mental model:** Think of `type ShipmentStatus = string` as an **open door** — any string walks through. `'active'`, `'actve'`, `'ACTIVE'`, `'banana'` — all accepted, no questions asked.\n\nA union type is a **bouncer with a list**: `'active' | 'delayed' | 'delivered'`. Only those three exact strings get in. The moment you write `'actve'`, TypeScript flags it before the file even saves. The bug never reaches the browser.\n\nThis is why domain values in an enterprise application — statuses, roles, priorities, directions — are often modeled as union types, never plain strings. The tighter the type, the earlier the catch.",
    discover:
      "**Pattern — union type:**\n```tsx\n// ✅ locked to exact values\ntype ShipmentStatus = 'active' | 'delayed' | 'delivered';\n\n// ✅ used as a prop type — TS enforces at every callsite\ntype ShipmentCardProps = {\n  status: ShipmentStatus;\n};\n\n// ❌ open string — anything passes, typos slip through silently\ntype ShipmentStatus = string;\n```\n- each value is a string literal in quotes\n- `|` means 'or' — exactly one of these at a time\n- defining it once as a named type means every prop, variable, and function that uses it gets the same guarantee automatically",
    quickRules:
      "**Quick rules:**\n- ✅ `type ShipmentStatus = 'active' | 'delayed' | 'delivered'` — locked union, typos caught at compile time\n- ✅ defined at module scope — above the component, reusable across the file\n- ❌ `type ShipmentStatus = string` — open door, no protection\n- ❌ `const ShipmentStatus = ['active', ...]` — an array, not a type, can't be used as a type annotation\n- union types work for any fixed set of values: roles, priorities, directions, modes",
    watchOut:
      "👀 **Watch out:** Union types only protect you if you actually use them. Defining `ShipmentStatus` and then typing a prop as `status: string` gives you zero protection — the union is defined but not enforced. Always use the named type in your props and function signatures.",
    dryRun:
      "🔁 **Think:** You have `type ShipmentStatus = 'active' | 'delayed' | 'delivered'` and a prop typed as `status: ShipmentStatus`. A teammate passes `status='in_transit'` at a callsite. What exactly does TypeScript do — and at what point does it do it? (Hint: does it wait until runtime, or catch it earlier?)",
    build:
      "**Learning focus:** Define a union type from string literals to lock a value to a fixed set of options — so TypeScript catches invalid values at the editor, not in production.",
  },
},
{
  id: "step3",
  type: "question",
  phase: "Step 3 of 6",
  paal: "Define a props interface at module scope (outside the component) for ShipmentCard. Include shipment ID, destination, and status. Interface name is your choice (no required suffix).",
  hint: "Declare the interface above the component. Use your status union type for the status field. `shipmentId` can be string or number.",
  example_code: `interface RouteCardProps {
  routeId: string;
  origin: string;
}`,
  think_prompt:
    "ShipmentCard needs three pieces of data from outside. How do you describe the exact shape of what it expects?",
  mc_options: [
    "type ShipmentCardProps = { shipmentId: string, destination: string, status: string }",
    "interface ShipmentCardProps { shipmentId: string; destination: string; status: ShipmentStatus }",
    "interface ShipmentCardProps { shipmentId: any; destination: any; status: any }",
  ],
  mc_correct_option:
    "interface ShipmentCardProps { shipmentId: string; destination: string; status: ShipmentStatus }",
  mc_anchor:
    "An interface with precise types for each field — and ShipmentStatus as the type for status, not a plain string. This means the union you defined in Step 2 is now enforced at every callsite.",
  why_this_matters:
    "Every ShipmentCard rendered in an enterprise application gets its data from outside — from an API response, a list, a parent component. The interface is the contract that guarantees the right data arrives in the right shape. Using ShipmentStatus instead of string means the union protection from Step 2 actually reaches the component.",
  answer_keywords: [
    "interface", "ShipmentCardProps", "shipmentId", "string",
    "destination", "status", "ShipmentStatus",
  ],
  evaluate: evalLesson1Step3,
  seed_code: `type ShipmentStatus = 'active' | 'delayed' | 'delivered';

const ShipmentCard = (): JSX.Element => {
  return <></>;
};`,
  starter_code: `type ShipmentStatus = 'active' | 'delayed' | 'delivered';

// define ShipmentCardProps interface here

const ShipmentCard = (): JSX.Element => {
  return <></>;
};`,
  feedback_correct:
    "Exactly — three typed fields, status using ShipmentStatus not string. Every caller now gets TypeScript enforcement on all three values.",
  feedback_partial:
    "Close — keep the interface outside the component and ensure status uses your union type. Interface naming is flexible; no required suffix.",
  feedback_wrong:
    "Pattern: declare a module-scope interface above the component with three fields (shipmentId, destination, status), and type status with your union. Interface name can be any valid identifier.",
  expected: `type ShipmentStatus = 'active' | 'delayed' | 'delivered';

interface ShipmentCardProps {
  shipmentId: string;
  destination: string;
  status: ShipmentStatus;
}

const ShipmentCard = (): JSX.Element => {
  return <></>;
};`,
  analog_example: `interface PlayerBadgeProps {
  gamerTag: string;
  level: number;
}`,
  deepDiveLabel:
    "interface and type both define object shapes — so when do you pick one over the other?",
  deepDive: {
    hook: "You're three weeks into a large enterprise codebase. You've defined props with `type` in some files and `interface` in others, copying whatever pattern the file you last edited used. A senior engineer reviews your PR and asks: 'Why is this one a type and that one an interface?' You don't have an answer. You realise you've been picking randomly.\n\nThis isn't a catastrophic mistake — both work for props. But there is a clear convention in the React TypeScript community, and knowing the reasoning behind it means you make the choice deliberately instead of by accident.",
    pain: "⚠️ **Lesson:** You use `type ShipmentCardProps = { ... }` and it works perfectly. Your teammate uses `interface ShipmentCardProps { ... }` and that works too. If both do the same job, why does the convention exist at all?",
    mentalModel:
      "**Mental model:** Think of `interface` as a **notice board** and `type` as a **sealed envelope**.\n- A notice board (`interface`) can be added to later — other files can extend it, merge into it, build on top of it. It's open for extension.\n- A sealed envelope (`type`) is fixed at the point of writing. It can express things an interface can't — like a union: `type Status = 'active' | 'delayed'`. You can't write that with an interface.\n- Convention in React: use `interface` for object shapes like props and state — they're extendable and clearly signal 'this is a data contract'. Use `type` for unions, intersections, and aliases — things that need the extra expressive power.\n- In practice the difference rarely matters for simple props. What matters is being consistent so every teammate instantly knows what they're looking at.",
    discover:
      "**Pattern — interface vs type:**\n```tsx\n// ✅ interface — for props and object shapes (extendable)\ninterface ShipmentCardProps {\n  shipmentId: string;\n  status: ShipmentStatus;\n}\n\n// ✅ type — for unions, intersections, and aliases\ntype ShipmentStatus = 'active' | 'delayed' | 'delivered';\ntype ID = string;\n\n// ⚠️ type for props — works but not the convention\ntype ShipmentCardProps = {\n  shipmentId: string;\n  status: ShipmentStatus;\n};\n\n// ❌ interface for unions — not possible\ninterface ShipmentStatus = 'active' | 'delayed'; // syntax error\n```\n- interface: objects and props — extendable\n- type: unions, intersections, aliases — more expressive\n- the distinction matters most in large codebases where consistency is a team contract",
    quickRules:
      "**Quick rules:**\n- ✅ `interface` for props, state, API shapes — objects with named fields\n- ✅ `type` for unions, intersections, primitives, and function signatures\n- ❌ `interface` for union types — the syntax doesn't exist\n- ❌ switching between the two randomly — pick a pattern and stay consistent\n- both support generics and both describe the same basic object shapes — the difference is extension and expressiveness",
    watchOut:
      "👀 **Watch out:** `interface` supports **declaration merging** — if you declare the same interface name twice in the same scope, TypeScript merges them silently. This can cause unexpected fields to appear on a type. `type` does not merge — declaring the same name twice is an error. For props, this is rarely an issue, but in larger module systems it's a real gotcha.",
    dryRun:
      "🔁 **Think:** You have `interface ShipmentCardProps` with three fields. A teammate in another file writes `interface ShipmentCardProps { carrier: string }` for the same component. What does TypeScript do — error, merge, or ignore the second declaration? Now try the same thing with `type ShipmentCardProps` instead. What's different? (Hint: interface merges, type errors.)",
    build:
      "**Learning focus:** Declare a props interface with precisely typed fields — using an existing union type for one of them — and understand when to choose interface over type.",
  },
},
{
  id: "step4",
  type: "question",
  phase: "Step 4 of 6",
  paal: "Update ShipmentCard to accept ShipmentCardProps — destructure the props in the function signature and return JSX with a label span and an empty div placeholder.",
  hint: "Destructure inside the parameter parentheses. You can return either a Fragment or a single wrapper element.",
  example_code: `const RouteCard = ({ routeId, origin }: RouteCardProps): JSX.Element => {
  return (
    <>
      <span>Route</span>
      <div></div>
    </>
  );
};`,
  think_prompt:
    "ShipmentCard now has a props interface — but the function signature still takes no arguments. How do you wire the interface to the component so the props flow in?",
  mc_options: [
    "const ShipmentCard = (props: ShipmentCardProps): JSX.Element => { return <></>; }",
    "const ShipmentCard = ({ shipmentId, destination, status }: ShipmentCardProps): JSX.Element => { return (<><span>Shipment</span><div></div></>); }",
    "const ShipmentCard = (ShipmentCardProps): JSX.Element => { return <></>; }",
  ],
  mc_correct_option:
    "const ShipmentCard = ({ shipmentId, destination, status }: ShipmentCardProps): JSX.Element => { return (<><span>Shipment</span><div></div></>); }",
  mc_anchor:
    "Destructuring in the parameter gives you the three values directly — no `props.shipmentId` needed. The Fragment lets two sibling elements return without a wrapper div that would affect the DOM. The interface annotation after the destructure is what TypeScript checks.",
  why_this_matters:
    "Destructuring props in the signature is the universal pattern in modern React — it keeps the component body clean and makes the contract visible right at the top. The Fragment keeps the DOM clean — no wrapper div added just to satisfy React's single-return rule.",
  answer_keywords: [
    "ShipmentCardProps", "{", "shipmentId", "destination", "status", "}",
    "<>", "</>", "<span>", "Shipment",
  ],
  evaluate: evalLesson1Step4,
  seed_code: `type ShipmentStatus = 'active' | 'delayed' | 'delivered';

interface ShipmentCardProps {
  shipmentId: string;
  destination: string;
  status: ShipmentStatus;
}

const ShipmentCard = (): JSX.Element => {
  return <></>;
};`,
  starter_code: `type ShipmentStatus = 'active' | 'delayed' | 'delivered';

interface ShipmentCardProps {
  shipmentId: string;
  destination: string;
  status: ShipmentStatus;
}

// update ShipmentCard to accept and destructure ShipmentCardProps
// return JSX containing a <span>Shipment</span> and an empty <div>
const ShipmentCard = (): JSX.Element => {
  return <></>;
};`,
  feedback_correct:
    "Exactly — destructured props, typed with ShipmentCardProps, and returned JSX with both required elements. The component is now wired to receive data from outside.",
  feedback_partial:
    "Close — check two things: are you destructuring `{ shipmentId, destination, status }` directly in the parameter (not using `props.x`), and does the return include both `<span>...</span>` and an empty `<div></div>`?",
  feedback_wrong:
    "Pattern: `const Component = ({ ... }: ShipmentCardProps): JSX.Element => { return (<><span>Label</span><div></div></>); }` (or a single wrapper element). Destructure in params, annotate with the interface, and include both required JSX elements.",
  expected: `type ShipmentStatus = 'active' | 'delayed' | 'delivered';

interface ShipmentCardProps {
  shipmentId: string;
  destination: string;
  status: ShipmentStatus;
}

const ShipmentCard = ({ shipmentId, destination, status }: ShipmentCardProps): JSX.Element => {
  return (
    <>
      <span>Shipment</span>
      <div></div>
    </>
  );
};`,
  analog_example: `const PlayerBadge = ({ gamerTag, level }: PlayerBadgeProps): JSX.Element => {
  return (
    <>
      <span>Player</span>
      <div></div>
    </>
  );
};`,
  deepDiveLabel:
    "Destructuring gives you the values directly — but why not just use the props object instead?",
  deepDive: {
    hook: "You see a codebase where every component does `const ShipmentCard = (props: ShipmentCardProps)` and accesses values as `props.shipmentId`, `props.destination`, `props.status` throughout the JSX. It works perfectly. Then you see another codebase where every component destructures in the parameter. Same behaviour, completely different style.\n\nA new teammate asks which style to use. You need an answer that goes beyond personal preference — there are real trade-offs.",
    pain: "⚠️ **Lesson:** You use `props.status` throughout a 40-line component. A teammate renames the prop from `status` to `shipmentStatus` in the interface. They update the callsite. But inside the component, every `props.status` reference breaks individually — each one is a separate fix. How does destructuring at the parameter reduce that maintenance burden?",
    mentalModel:
      "**Mental model:** Think of destructuring as **unpacking a delivery at the door**.\n- `props` style: you carry the whole box around the house and open it every time you need something — `props.shipmentId`, `props.destination`, `props.status` repeated everywhere.\n- Destructuring style: you unpack everything at the door — `{ shipmentId, destination, status }` — and carry only what you need. The rest of the component never knows or cares about `props`.\n- If a field gets renamed, you fix it in one place — the destructure — and nothing else in the component body changes.\n- Destructuring also makes the component's dependencies immediately visible at the top of the function — like a manifest of everything the component needs to do its job.",
    discover:
      "**Pattern — destructuring vs props object:**\n```tsx\n// ✅ destructuring in parameter — modern standard\nconst ShipmentCard = ({ shipmentId, destination, status }: ShipmentCardProps): JSX.Element => {\n  return <p>{shipmentId}</p>; // clean\n};\n\n// ⚠️ props object — works but verbose, repeated everywhere\nconst ShipmentCard = (props: ShipmentCardProps): JSX.Element => {\n  return <p>{props.shipmentId}</p>; // props. repeated everywhere\n};\n\n// ✅ rename during destructure — useful when a prop name clashes\nconst ShipmentCard = ({ shipmentId: id }: ShipmentCardProps): JSX.Element => {\n  return <p>{id}</p>; // id used inside, shipmentId is the prop name\n};\n```\n- destructure in the parameter: one fix point, clean body\n- props object: valid but adds repetition across large components\n- rename-during-destructure: `{ propName: localName }` — useful for collision avoidance",
    quickRules:
      "**Quick rules:**\n- ✅ always destructure in the parameter — it's the React TypeScript standard\n- ✅ rename during destructure `{ shipmentId: id }` when the prop name clashes with a local variable\n- ❌ `props.x` style — valid but verbose, harder to maintain on rename\n- ❌ destructuring inside the body `const { x } = props` — works but puts the declaration a step away from the signature\n- the interface annotation goes after the destructure block: `{ ... }: ShipmentCardProps`",
    watchOut:
      "👀 **Watch out:** Destructuring deeply nested objects in the parameter gets unreadable fast. `{ origin: { city: originCity }, destination: { city: destCity } }` is technically valid — but nobody wants to read that in a PR. For nested props, destructure at the top level and use dot notation in the JSX body instead.",
    dryRun:
      "🔁 **Think:** You destructure `{ shipmentId, destination, status }` in the parameter. Inside the JSX you write `{props.destination}`. What happens — does it render the value, throw an error, or render undefined? (Hint: `props` is not a variable in scope when you destructure — the parameter is `{ shipmentId, destination, status }`, not `props`.)",
    build:
      "**Learning focus:** Wire a props interface to a component by destructuring in the function signature — understanding that the interface annotation after the destructure is TypeScript's enforcement point, and that Fragment lets multiple siblings return without a DOM wrapper.",
  },
},
{
  id: "step5",
  type: "question",
  phase: "Step 5 of 6",
  paal: "Render all three props inside the card div — shipmentId, destination, and status — each in its own paragraph.",
  hint: "Each prop value needs to be embedded in JSX using curly braces. Plain text renders the word, not the value.",
  example_code: `<div>
  <p>{driverId}</p>
  <p>{region}</p>
</div>`,
  think_prompt:
    "The three prop values are available as variables in the component — shipmentId, destination, status. How do you make JSX render their current values rather than the literal words?",
  mc_options: [
    "<p>shipmentId</p><p>destination</p><p>status</p>",
    "<p>{shipmentId}</p><p>{destination}</p><p>{status}</p>",
    "<p>{{shipmentId}}</p><p>{{destination}}</p><p>{{status}}</p>",
  ],
  mc_correct_option: "<p>{shipmentId}</p><p>{destination}</p><p>{status}</p>",
  mc_anchor:
    "Single curly braces switch JSX into JavaScript expression mode — the variable is evaluated and its value rendered. No braces renders the literal word. Double braces pass an object literal, which React can't render as a child.",
  why_this_matters:
    "Every data-driven component in an enterprise application works this way — props arrive, curly braces pull them into the output. This is the mechanism behind every status badge, data table row, and user profile card you will ever build.",
  answer_keywords: ["{shipmentId}", "{destination}", "{status}"],
  evaluate: evalLesson1Step5,
  seed_code: `type ShipmentStatus = 'active' | 'delayed' | 'delivered';

interface ShipmentCardProps {
  shipmentId: string;
  destination: string;
  status: ShipmentStatus;
}

const ShipmentCard = ({ shipmentId, destination, status }: ShipmentCardProps): JSX.Element => {
  return (
    <>
      <span>Shipment</span>
      <div></div>
    </>
  );
};`,
  starter_code: `type ShipmentStatus = 'active' | 'delayed' | 'delivered';

interface ShipmentCardProps {
  shipmentId: string;
  destination: string;
  status: ShipmentStatus;
}

const ShipmentCard = ({ shipmentId, destination, status }: ShipmentCardProps): JSX.Element => {
  return (
    <>
      <span>Shipment</span>
      <div>
        {/* display shipmentId, destination and status here */}
      </div>
    </>
  );
};`,
  feedback_correct:
    "Exactly — curly braces pull the live prop values into the rendered output. Every time ShipmentCard receives new props, these expressions re-evaluate and the UI updates automatically.",
  feedback_partial:
    "Close — check that all three props are displayed using curly braces, not written as plain text strings.",
  feedback_wrong:
    "Use curly braces to embed each prop: `{shipmentId}`, `{destination}`, `{status}` — plain text like `shipmentId` renders the word, not the value.",
  expected: `type ShipmentStatus = 'active' | 'delayed' | 'delivered';

interface ShipmentCardProps {
  shipmentId: string;
  destination: string;
  status: ShipmentStatus;
}

const ShipmentCard = ({ shipmentId, destination, status }: ShipmentCardProps): JSX.Element => {
  return (
    <>
      <span>Shipment</span>
      <div>
        <p>{shipmentId}</p>
        <p>{destination}</p>
        <p>{status}</p>
      </div>
    </>
  );
};`,
  analog_example: `<div>
  <p>{gamerTag}</p>
  <p>{level}</p>
</div>`,
  deepDiveLabel:
    "Curly braces render a value — but what else can you put inside them?",
  deepDive: {
    hook: "You're building an enterprise application dashboard and need to show a shipment's status differently based on its value — green text for active, red for delayed, grey for delivered. Your first instinct is to write three separate components and conditionally render one. A senior engineer looks over your shoulder and says: 'just put the ternary in the JSX'. You didn't know you could do that. You try it. One line. Done.\n\nCurly braces in JSX are more powerful than they first appear. They're not just for variable names — they're a full JavaScript expression slot.",
    pain: "⚠️ **Lesson:** You write `<p>status</p>` expecting to see the shipment's status. The browser renders the literal word 'status'. You stare at it. The prop is correct, the destructuring is correct. What did you miss?",
    mentalModel:
      "**Mental model:** Think of JSX as two modes that you switch between with curly braces.\n- Outside `{}`: you're writing markup — text is rendered as literal text, tag names become DOM elements.\n- Inside `{}`: you've switched to JavaScript mode — anything that evaluates to a value gets rendered. A variable, a calculation, a ternary, a function call — all valid.\n- `<p>status</p>` never leaves markup mode — `status` is just a word.\n- `<p>{status}</p>` switches to JS mode — `status` is evaluated as the variable and its current value is rendered.\n- The `{}` are the switch. Forget them and your data never makes it to the screen.",
    discover:
      "**Pattern — expressions in JSX:**\n```tsx\n// ✅ variable\n<p>{shipmentId}</p>\n\n// ✅ ternary — conditional display\n<p>{status === 'delayed' ? '⚠️ Delayed' : status}</p>\n\n// ✅ string concatenation\n<p>{'ID: ' + shipmentId}</p>\n\n// ✅ template literal\n<p>{`Destination: ${destination}`}</p>\n\n// ❌ if statement — not an expression, JSX rejects it\n<p>{if (status === 'delayed') '⚠️'}</p>\n```\n- anything that evaluates to a value belongs in `{}`\n- `if` is a statement — use ternary or `&&` instead\n- double curly braces `{{}}` mean something different — an object literal inside an expression slot",
    quickRules:
      "**Quick rules:**\n- ✅ `{variable}` — renders the current value of the variable\n- ✅ `{a > b ? 'yes' : 'no'}` — ternary is an expression, works in JSX\n- ✅ `{condition && <span>show</span>}` — short circuit, renders span only if condition is true\n- ❌ `{if (...) ...}` — statement, not an expression, JSX will error\n- ❌ `variable` without braces — renders the literal word, not the value\n- `{{}}` double braces = object literal inside JSX expression — used for inline styles",
    watchOut:
      "👀 **Watch out:** `<p>{{shipmentId}}</p>` looks like it might work — but double braces mean you're passing an object literal as the content. React will throw: 'Objects are not valid as a React child'. Single braces for values, double braces only for objects like inline style props.",
    dryRun:
      "🔁 **Think:** You write `<p>{destination.toUpperCase()}</p>`. The prop `destination` is `'Hamburg'`. What does the browser render? Now the prop arrives as `undefined` instead. What happens — blank, error, or crash? (Hint: calling `.toUpperCase()` on undefined throws a runtime error — not a TypeScript error, a browser crash.)",
    build:
      "**Learning focus:** Use curly braces to embed live JavaScript expressions in JSX — understanding that `{}` switches from markup mode to JavaScript mode, making any expression's current value part of the rendered output.",
  },
},
{
  id: "step6",
  type: "question",
  phase: "Step 6 of 6",
  paal: "Add a className to the card div that reflects the shipment status — 'card--active' for active, 'card--delayed' for delayed, 'card--delivered' for delivered.",
  hint: "A template literal inside curly braces can build the class name directly from the status value. className is the JSX attribute — not class.",
  example_code: `<div className={\`row--\${priority}\`}>`,
  think_prompt:
    "You have three possible status values and three matching class names. How do you express that mapping inside a className attribute without writing three separate conditions?",
  mc_options: [
    "className='card--{status}'",
    "className={`card--${status}`}",
    "class={`card--${status}`}",
  ],
  mc_correct_option: "className={`card--${status}`}",
  mc_anchor:
    "A template literal inside curly braces builds the class name dynamically from the status value. className is the JSX attribute — class is the HTML attribute and JSX will reject it.",
  why_this_matters:
    "Status-driven className is one of the most common patterns in enterprise applications — badge colours, row highlights, alert levels all work this way. The template literal approach is the cleanest when the class name is a direct function of a single prop value.",
  answer_keywords: ["className", "status", "{`card--${status}`}"],
  evaluate: evalLesson1Step6,
  seed_code: `type ShipmentStatus = 'active' | 'delayed' | 'delivered';

interface ShipmentCardProps {
  shipmentId: string;
  destination: string;
  status: ShipmentStatus;
}

const ShipmentCard = ({ shipmentId, destination, status }: ShipmentCardProps): JSX.Element => {
  return (
    <>
      <span>Shipment</span>
      <div>
        <p>{shipmentId}</p>
        <p>{destination}</p>
        <p>{status}</p>
      </div>
    </>
  );
};`,
  starter_code: `type ShipmentStatus = 'active' | 'delayed' | 'delivered';

interface ShipmentCardProps {
  shipmentId: string;
  destination: string;
  status: ShipmentStatus;
}

const ShipmentCard = ({ shipmentId, destination, status }: ShipmentCardProps): JSX.Element => {
  return (
    <>
      <span>Shipment</span>
      {/* add a dynamic className to this div */}
      <div>
        <p>{shipmentId}</p>
        <p>{destination}</p>
        <p>{status}</p>
      </div>
    </>
  );
};`,
  feedback_correct:
    "Exactly — template literal inside curly braces, className not class. The status union from Step 2 guarantees only three valid class names can ever be generated from this expression.",
  feedback_partial:
    "Close — check two things: is it className not class, and is the expression inside curly braces not quotes?",
  feedback_wrong:
    "The pattern is: `className={\\`card--${status}\\`}` — className attribute, curly braces to enter JS mode, template literal to build the string from the status value.",
  expected: `type ShipmentStatus = 'active' | 'delayed' | 'delivered';

interface ShipmentCardProps {
  shipmentId: string;
  destination: string;
  status: ShipmentStatus;
}

const ShipmentCard = ({ shipmentId, destination, status }: ShipmentCardProps): JSX.Element => {
  return (
    <>
      <span>Shipment</span>
      <div className={\`card--\${status}\`}>
        <p>{shipmentId}</p>
        <p>{destination}</p>
        <p>{status}</p>
      </div>
    </>
  );
};`,
  analog_example: `<section className={\`badge--\${tier}\`}>
  <p>{gamerTag}</p>
</section>

<button className={\`btn--\${variant}\`}>
  Save
</button>`,
  deepDiveLabel:
    "className works — but many enterprise codebases use a clsx() call instead. Why?",
  deepDive: {
    hook: "Your ShipmentCard template literal works perfectly for one dynamic class. Then the design team adds a requirement: the card should also get a `card--selected` class when it's clicked, and a `card--loading` class during a data refresh. Your template literal is now trying to do three jobs at once.\n\nYou end up with something like:\n\n```tsx\nclassName={`card--${status}${selected ? ' card--selected' : ''}${loading ? ' card--loading' : ''}`}\n```\n\nIt works. It's also unreadable, hard to maintain, and one missing space away from broken class names. This is exactly the problem `clsx` was built to solve — but that's a later lesson. Right now, understanding *why* className exists and what it accepts is the foundation everything else builds on.",
    pain: "⚠️ **Lesson:** You write `class={\\`card--${status}\\`}` — it looks right, it mirrors HTML. React throws a warning and the class never applies. Why does JSX reject the attribute name you've used in HTML your whole life?",
    mentalModel:
      "**Mental model:** JSX attributes follow **JavaScript naming rules**, not HTML ones.\n- In HTML, `class` is a valid attribute name — the browser knows what to do with it.\n- In JavaScript, `class` is a reserved keyword — it declares a class definition. JSX compiles through JavaScript, so it can't use `class` as an attribute name without ambiguity.\n- JSX renames it `className` to sidestep the collision entirely.\n- Same reason `for` becomes `htmlFor` on labels — `for` is a reserved keyword in JavaScript too.\n- This isn't arbitrary. Every JSX attribute that differs from HTML has a reserved-word collision or a naming convention reason behind it.",
    discover:
      "**Pattern — dynamic className:**\n```tsx\n// ✅ template literal — clean when class is a direct function of one value\n<div className={`card--${status}`}>\n\n// ✅ ternary — clean for binary class toggle\n<div className={isSelected ? 'card--selected' : 'card--default'}>\n\n// ✅ multiple conditions — readable with clsx (later lesson)\n<div className={clsx('card', `card--${status}`, { 'card--selected': isSelected })}>\n\n// ❌ class — reserved JS keyword, JSX rejects it\n<div class={`card--${status}`}>\n\n// ❌ string without braces — renders literally, status value never evaluated\n<div className='card--{status}'>\n```\n- `className` is always the JSX attribute — never `class`\n- curly braces are required for any dynamic value\n- quotes without braces = literal string, expression never evaluated",
    quickRules:
      "**Quick rules:**\n- ✅ `className={\\`card--${status}\\`}` — dynamic, evaluates the expression\n- ✅ `className='card--static'` — static string, quotes without braces are fine\n- ❌ `class=` — reserved JS keyword, JSX will warn and the class won't apply\n- ❌ `className='card--{status}'` — literal string, curly braces inside quotes do nothing\n- every dynamic JSX attribute value needs curly braces — that's your switch into JS mode",
    watchOut:
      "👀 **Watch out:** `className='card--{status}'` is the most common className mistake. It looks dynamic but the curly braces inside quotes are just characters — JSX never evaluates them. The browser receives the literal string `card--{status}` and no CSS rule will ever match it. Always use `className={expression}` for dynamic values.",
    dryRun:
      "🔁 **Think:** Your union is `'active' | 'delayed' | 'delivered'` and your className is `{\\`card--${status}\\`}`. TypeScript guarantees only three class names can ever be generated: `card--active`, `card--delayed`, `card--delivered`. Now a designer adds a fourth status `'pending'` to the union. What happens to the className — does it break, silently fail, or work automatically? (Hint: the template literal doesn't know about your union — it just concatenates whatever value arrives.)",
    build:
      "**Learning focus:** Apply dynamic className using a JSX expression — understanding that className is the JSX equivalent of the HTML class attribute, that curly braces are required for any dynamic value, and that the expression evaluates at render time to produce the final string.",
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
  lessonNum: 1,
  title: "JSX — The Full Language",
  shortName: "JSX — SHIPMENT CARD",
});