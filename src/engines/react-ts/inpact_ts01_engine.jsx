/**
 * 🔒 LOCKED — React · TS JSX lesson 1 — ShipmentCard (JSX).
 * Do not change steps, copy, or evaluation without explicit product/content sign-off.
 * Generated mirror: content/generated/react-ts/001_shipment-card_lesson.json
 */
import createINPACTEngine from "../inpact_engine_shared";

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
    "Define a typed React component using arrow function syntax with an explicit JSX.Element return type",
    "Create a union type to represent a fixed set of real-world values",
    "Declare a props interface and destructure it in a component signature",
    "Return multiple sibling elements from a component using a Fragment",
    "Embed live JavaScript expressions inside JSX using curly braces",
    "Apply dynamic className based on a prop value",
  ],
},
{
  id: "step1",
  type: "question",
  phase: "Step 1 of 6",
  paal: "Define the ShipmentCard component shell — an arrow function that returns JSX.Element.",
  hint: "Arrow function, explicit return type, empty fragment as placeholder.",
  example_code: `const Dashboard = (): JSX.Element => {
  return <></>;
};`,
  think_prompt:
    "What is the minimum valid definition of a React component that TypeScript will accept?",
  mc_options: [
    "const shipmentCard = () => {}",
    "const ShipmentCard = (): JSX.Element => { return <></>; }",
    "function ShipmentCard(): void { return <></>; }",
  ],
  mc_correct_option: "const ShipmentCard = (): JSX.Element => { return <></>; }",
  mc_anchor:
    "Arrow function, capital first letter, explicit JSX.Element return type, empty fragment as placeholder — this is the standard component definition in modern React.",
  why_this_matters:
    "Every component in Nexus follows this exact shell. The capital letter tells React this is a component, not a plain HTML tag. JSX.Element is the contract — TypeScript will catch any branch that accidentally returns something invalid before it ever reaches a user.",
  answer_keywords: ["const", "ShipmentCard", "JSX.Element", "=>", "return", "<>", "</>"],
  seed_code: "",
  starter_code: "// define your component here",
  feedback_correct:
    "Exactly — capital name, arrow function, JSX.Element return type, empty fragment. This shell is the foundation every Nexus component starts from.",
  feedback_partial:
    "Almost — check three things: capital first letter on the name, explicit `: JSX.Element` return type, and an empty fragment `<></>` as the placeholder return.",
  feedback_wrong:
    "The pattern is: `const ShipmentCard = (): JSX.Element => { return <></>; }` — capital name, arrow function, JSX.Element return type.",
  expected: `const ShipmentCard = (): JSX.Element => {
  return <></>;
};`,
  analog_example: `const RouteMap = (): JSX.Element => {
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
  paal: "Define a union type called ShipmentStatus that represents the only three valid states a shipment can be in: active, delayed, or delivered.",
  hint: "A union type uses the pipe character | between each value.",
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
    "In Nexus, shipment status drives badge colour, row highlighting, and filter logic. If a typo like 'actve' slips through, the wrong colour renders and no error is thrown. A union type makes that impossible — TypeScript catches the typo the moment you type it.",
  answer_keywords: ["type", "ShipmentStatus", "=", "active", "delayed", "delivered", "|"],
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
    "Close — make sure you're using the `type` keyword and pipe `|` characters between the three exact string literals.",
  feedback_wrong:
    "The pattern is: `type ShipmentStatus = 'active' | 'delayed' | 'delivered'` — the type keyword, then the name, then string literals separated by pipes.",
  expected: `type ShipmentStatus = 'active' | 'delayed' | 'delivered';

const ShipmentCard = (): JSX.Element => {
  return <></>;
};`,
  analog_example: `type OrderPriority = 'low' | 'medium' | 'high';`,
  deepDiveLabel:
    "type ShipmentStatus = string works and is simpler — so what does the union actually buy you?",
  deepDive: {
    hook: "Your Nexus dashboard has a status badge that colours shipments green, amber, or red. The colour logic reads the status string and picks a className. A backend engineer changes the API response from `'active'` to `'in_transit'`. No TypeScript error. No runtime crash. Every active shipment now renders with no colour — the className logic hits no match and silently falls through to unstyled.\n\nYou spend 40 minutes in the network tab before you spot the string mismatch. The whole thing could have been a red squiggle the moment the API type was updated — if the status had been a union instead of a plain string.",
    pain: "⚠️ **Lesson:** You type `status = 'actve'` — a one-character typo. TypeScript says nothing. The badge renders unstyled. No error, no warning. How does a union type turn that silent failure into an immediate red squiggle?",
    mentalModel:
      "**Mental model:** Think of `type ShipmentStatus = string` as an **open door** — any string walks through. `'active'`, `'actve'`, `'ACTIVE'`, `'banana'` — all accepted, no questions asked.\n\nA union type is a **bouncer with a list**: `'active' | 'delayed' | 'delivered'`. Only those three exact strings get in. The moment you write `'actve'`, TypeScript flags it before the file even saves. The bug never reaches the browser.\n\nThis is why domain values in Nexus — statuses, roles, priorities, directions — are always union types, never plain strings. The tighter the type, the earlier the catch.",
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
  paal: "Define a props interface for ShipmentCard. The component needs to receive a shipment ID, a destination, and a status.",
  hint: "An interface defines the shape of an object. Use your ShipmentStatus union type for the status field.",
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
    "Every ShipmentCard rendered in Nexus gets its data from outside — from an API response, a list, a parent component. The interface is the contract that guarantees the right data arrives in the right shape. Using ShipmentStatus instead of string means the union protection from Step 2 actually reaches the component.",
  answer_keywords: [
    "interface",
    "ShipmentCardProps",
    "shipmentId",
    "string",
    "destination",
    "status",
    "ShipmentStatus",
  ],
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
    "Close — check the status field type. It should use ShipmentStatus from Step 2, not a plain string.",
  feedback_wrong:
    "The pattern is: `interface ShipmentCardProps { shipmentId: string; destination: string; status: ShipmentStatus }` — interface keyword, field names, and the union type you already defined for status.",
  expected: `type ShipmentStatus = 'active' | 'delayed' | 'delivered';

interface ShipmentCardProps {
  shipmentId: string;
  destination: string;
  status: ShipmentStatus;
}

const ShipmentCard = (): JSX.Element => {
  return <></>;
};`,
  analog_example: `interface DriverCardProps {
  driverId: string;
  region: string;
}`,
  deepDiveLabel:
    "interface and type both define object shapes — so when do you pick one over the other?",
  deepDive: {
    hook: "You're three weeks into Nexus. You've defined props with `type` in some files and `interface` in others, copying whatever pattern the file you last edited used. A senior engineer reviews your PR and asks: 'Why is this one a type and that one an interface?' You don't have an answer. You realise you've been picking randomly.\n\nThis isn't a catastrophic mistake — both work for props. But there is a clear convention in the React TypeScript community, and knowing the reasoning behind it means you make the choice deliberately instead of by accident.",
    pain: "⚠️ **Lesson:** You use `type ShipmentCardProps = { ... }` and it works perfectly. Your teammate uses `interface ShipmentCardProps { ... }` and that works too. If both do the same job, why does the convention exist at all?",
    mentalModel:
      "**Mental model:** Think of `interface` as a **notice board** and `type` as a **sealed envelope**.\n- A notice board (`interface`) can be added to later — other files can extend it, merge into it, build on top of it. It's open for extension.\n- A sealed envelope (`type`) is fixed at the point of writing. It can express things an interface can't — like a union: `type Status = 'active' | 'delayed'`. You can't write that with an interface.\n- Convention in React: use `interface` for object shapes like props and state — they're extendable and clearly signal 'this is a data contract'. Use `type` for unions, intersections, and aliases — things that need the extra expressive power.\n- In practice the difference rarely matters for simple props. What matters is being consistent so every teammate instantly knows what they're looking at.",
    discover:
      "**Pattern — interface vs type:**\n```tsx\n// ✅ interface for object shapes — props, state, API responses\ninterface ShipmentCardProps {\n  shipmentId: string;\n  destination: string;\n  status: ShipmentStatus;\n}\n\n// ✅ type for unions and aliases\ntype ShipmentStatus = 'active' | 'delayed' | 'delivered';\n\n// ✅ interface extension — interface can build on another interface\ninterface PriorityShipmentCardProps extends ShipmentCardProps {\n  priority: 'urgent' | 'standard';\n}\n\n// ❌ type can't do this — unions can't be extended this way\ntype PriorityShipmentCardProps = ShipmentCardProps & { priority: string }; // works but less readable\n```\n- `interface` for object shapes — extendable, readable, conventional for props\n- `type` for unions, literals, and complex aliases\n- consistency matters more than the choice itself",
    quickRules:
      "**Quick rules:**\n- ✅ `interface` for props, state, and API response shapes\n- ✅ `type` for unions, string literals, and type aliases\n- ❌ `any` — turns off TypeScript entirely, never use it for props\n- ❌ `type Props = { status: string }` when you have a union — you lose the protection you already defined\n- name props interfaces after the component: `ShipmentCardProps`, `DriverRowProps`, `FilterPanelProps`",
    watchOut:
      "👀 **Watch out:** Using `status: string` instead of `status: ShipmentStatus` in your props is the most common way to accidentally throw away a union type you worked to define. The interface field type and the union type must match — otherwise the protection stops at the type definition and never reaches the component.",
    dryRun:
      "🔁 **Think:** You have `interface ShipmentCardProps` with `status: ShipmentStatus`. A new requirement adds a `priority` field to some shipment cards but not all. You need `priority` to be optional. What does that look like in the interface — and does it change anything for callers that don't pass it? (Hint: there's a single character that makes a field optional in TypeScript.)",
    build:
      "**Learning focus:** Define a props interface using precise field types — including a union type you've already defined — so TypeScript enforces the correct data shape at every component callsite.",
  },
},
{
  id: "step4",
  type: "question",
  phase: "Step 4 of 6",
  paal: "Update the ShipmentCard signature to accept props, then replace the empty fragment with two real siblings — a span showing 'Shipment' and an empty div that will become the card body.",
  hint: "Destructure the props directly in the function parameter. The fragment is already there — put the two siblings inside it.",
  example_code: `const RouteCard = ({ routeId }: RouteCardProps): JSX.Element => {
  return (
    <>
      <span>Route</span>
      <div></div>
    </>
  );
};`,
  think_prompt:
    "The fragment is already your root. Why is it the right choice here over replacing it with a div?",
  mc_options: [
    "Replace <></> with a <div> — two children need a real wrapper",
    "Keep <></> and put both siblings inside it — Fragment groups them without adding a DOM node",
    "Return the two elements as a JavaScript array",
  ],
  mc_correct_option:
    "Keep <></> and put both siblings inside it — Fragment groups them without adding a DOM node",
  mc_anchor:
    "The Fragment was already the right root. It satisfies React's single-root rule without adding a real DOM node — keeping the Nexus grid layout intact.",
  why_this_matters:
    "Nexus renders ShipmentCard inside data tables and flex grids where an unexpected wrapper div breaks column alignment. The Fragment you already have is the correct root — it groups the siblings for React without interfering with the parent's CSS structure.",
  answer_keywords: [
    "shipmentId", "destination", "status", "<>", "</>", "span", "div"
  ],
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

// update the signature to accept props
// put a span and a div inside the fragment
const ShipmentCard = (): JSX.Element => {
  return <></>;
};`,
  feedback_correct:
    "Exactly — props destructured in the signature, two real siblings inside the existing fragment. No extra DOM node, no layout interference in the Nexus grid.",
  feedback_partial:
    "Close — check two things: are the props typed in the parameter, and are both siblings inside the fragment rather than a div?",
  feedback_wrong:
    "Update the parameter to `({ shipmentId, destination, status }: ShipmentCardProps)` and place a span and a div inside the existing `<></>` fragment.",
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
  analog_example: `const WarehouseRow = ({ warehouseId, region }: WarehouseRowProps): JSX.Element => {
  return (
    <>
      <span>Warehouse</span>
      <div></div>
    </>
  );
};`,
  deepDiveLabel:
    "A div also works as a root — so what does an extra div actually break in a real layout?",
  deepDive: {
    hook: "Your Nexus shipment table renders each row as a CSS grid with seven columns. ShipmentCard sits in column three. Everything lines up perfectly in dev. You push to staging — the whole row shifts. Column three is now double-wide and everything after it is pushed out.\n\nYou inspect the DOM. There's an extra `<div>` wrapping the card content that isn't in your CSS grid definition. The grid sees eight children instead of seven. That extra div is the component's root wrapper — added out of habit because 'components need a root element'. They do. But it doesn't have to be a real DOM node.",
    pain: "⚠️ **Lesson:** You replace `<></>` with a `<div>` because it feels more concrete. The component works — but the Nexus grid layout breaks on staging. The div that fixed the React error caused a CSS error. How do you satisfy React's rule without adding a DOM node?",
    mentalModel:
      "**Mental model:** Think of a Fragment as a **transparent carrier bag**.\n- React's rule: a component return must be one thing — you can't hand back two loose items.\n- A `<div>` wrapper satisfies the rule but puts a real box in the DOM — the parent's CSS has to account for it.\n- A Fragment `<></>` is a carrier bag that React sees as one thing, but the browser never sees at all. The children land directly in the parent as if the bag was never there.\n- The DOM stays clean. The grid sees the right number of children. The layout holds.",
    discover:
      "**Pattern — Fragment:**\n```tsx\n// ✅ Fragment — no DOM node added\nreturn (\n  <>\n    <span>Shipment</span>\n    <div></div>\n  </>\n);\n\n// ❌ div wrapper — adds a real DOM node, can break CSS grid/flex layouts\nreturn (\n  <div>\n    <span>Shipment</span>\n    <div></div>\n  </div>\n);\n\n// ✅ long form — use when you need to pass a key prop\nimport { Fragment } from 'react';\nreturn (\n  <Fragment key={shipmentId}>\n    <span>Shipment</span>\n    <div></div>\n  </Fragment>\n);\n```\n- `<></>` is the short form — use it by default\n- `<Fragment key={...}>` is the long form — only needed when you need to pass a `key` prop\n- both produce zero DOM nodes",
    quickRules:
      "**Quick rules:**\n- ✅ `<></>` — default choice when siblings need a root but no DOM wrapper\n- ✅ `<Fragment key={id}>` — only when you need to pass a key prop\n- ❌ `<div>` as a reflex root wrapper — adds a real node, can silently break grid and flex layouts\n- Fragment produces zero DOM nodes — children land directly in the parent\n- one root rule is React's rule, not the DOM's — Fragment satisfies React without touching the DOM",
    watchOut:
      "👀 **Watch out:** Fragments are invisible in the DOM but visible in React DevTools — they show up as `<Fragment>` in the component tree. If your layout looks wrong and you're sure your CSS is right, open DevTools and count the actual DOM nodes. A stray wrapper div is often the culprit.",
    dryRun:
      "🔁 **Think:** You render ten ShipmentCards inside a CSS grid that expects direct children. Five use `<></>` as root, five use `<div>` as root. The grid has `grid-template-columns: repeat(3, 1fr)`. How many direct children does the grid see — 10, 15, or something else? Which cards break the column alignment? (Hint: Fragment children land directly in the parent — div children are one node each.)",
    build:
      "**Learning focus:** Use a Fragment as the return root when a component has multiple sibling elements — satisfying React's single-root rule without adding a DOM node that could interfere with the parent layout.",
  },
},
{
  id: "step5",
  type: "question",
  phase: "Step 5 of 6",
  paal: "Fill the card div with the shipment data — display the shipment ID, destination, and status inside the div using JSX expressions.",
  hint: "Curly braces let you embed any JavaScript expression directly into JSX.",
  example_code: `<div>
  <p>{routeId}</p>
  <p>{origin}</p>
</div>`,
  think_prompt:
    "The props are already destructured in the signature. How do you pull their values into the JSX so the browser renders them?",
  mc_options: [
    "Write the values as plain text: <p>shipmentId</p>",
    "Use curly braces: <p>{shipmentId}</p>",
    "Use double curly braces: <p>{{shipmentId}}</p>",
  ],
  mc_correct_option: "Use curly braces: <p>{shipmentId}</p>",
  mc_anchor:
    "Single curly braces are the JSX escape hatch into JavaScript. Whatever is inside them is evaluated as a live expression — the current value of the variable flows into the rendered output.",
  why_this_matters:
    "Every piece of data in Nexus — shipment IDs, destinations, driver names, warehouse counts — reaches the UI through curly brace expressions. This is the fundamental mechanism that makes React components dynamic rather than static HTML.",
  answer_keywords: [
    "{shipmentId}",
    "{destination}",
    "{status}",
  ],
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
  <p>{driverId}</p>
  <p>{region}</p>
</div>`,
  deepDiveLabel:
    "Curly braces render a value — but what else can you put inside them?",
  deepDive: {
    hook: "You're building the Nexus dashboard and need to show a shipment's status differently based on its value — green text for active, red for delayed, grey for delivered. Your first instinct is to write three separate components and conditionally render one. A senior engineer looks over your shoulder and says: 'just put the ternary in the JSX'. You didn't know you could do that. You try it. One line. Done.\n\nCurly braces in JSX are more powerful than they first appear. They're not just for variable names — they're a full JavaScript expression slot.",
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
  hint: "className is a JSX attribute that takes an expression. A ternary can pick between two values — but you have three. Think about how to chain them.",
  example_code: `<div className={priority === 'high' ? 'row--high' : priority === 'medium' ? 'row--medium' : 'row--low'}>`,
  think_prompt:
    "You have three possible status values and three matching class names. How do you express that mapping inside a className attribute?",
  mc_options: [
    "className='card--{status}'",
    "className={`card--${status}`}",
    "class={`card--${status}`}",
  ],
  mc_correct_option: "className={`card--${status}`}",
  mc_anchor:
    "A template literal inside curly braces builds the class name dynamically from the status value. className is the JSX attribute — class is the HTML attribute and JSX will reject it.",
  why_this_matters:
    "Status-driven className is one of the most common patterns in Nexus — badge colours, row highlights, alert levels all work this way. The template literal approach is the cleanest when the class name is a direct function of a single prop value.",
  answer_keywords: [
    "className",
    "status",
    "{`card--${status}`}",
  ],
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
  analog_example: `<div className={\`row--\${priority}\`}>
  <p>{driverId}</p>
</div>`,
  deepDiveLabel:
    "className works — but the Nexus codebase uses a clsx() call instead. Why?",
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
