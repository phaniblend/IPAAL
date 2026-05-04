import createINPACTEngine from "../inpact_engine_shared";

// ─── helpers ────────────────────────────────────────────────────────────────

function isDeclaredAtModuleScope(raw, declarationStartIndex) {
  if (!Number.isFinite(declarationStartIndex) || declarationStartIndex < 0) return false;
  const firstComponentIndex = raw.search(
    /(?:const\s+[A-Z][A-Za-z0-9_]*\s*=\s*\(|function\s+[A-Z][A-Za-z0-9_]*\s*\()/m,
  );
  if (firstComponentIndex < 0) return true;
  return declarationStartIndex < firstComponentIndex;
}

// ─── evaluators — Lesson 1: interface → typed shell → card JSX → App (1–2 cards) ─

// Step 1 — module-scope `GroceryItemCardProps` (four string fields)
function evalLesson1Step1(answer) {
  const raw = String(answer || "");
  const m = raw.match(/interface\s+GroceryItemCardProps\s*\{([\s\S]*?)\}/m);
  if (!m || m.index == null) return "wrong";
  const body = m[1] || "";
  const pairs = [
    /\bname\s*:\s*string\b/,
    /\bimageUrl\s*:\s*string\b/,
    /\bquantityAvailable\s*:\s*string\b/,
    /\bexpiresSummary\s*:\s*string\b/,
  ];
  const hit = pairs.filter((re) => re.test(body)).length;
  const moduleScoped = isDeclaredAtModuleScope(raw, m.index);
  if (hit === 4 && moduleScoped) return "correct";
  if (hit >= 2 && moduleScoped) return "partial";
  return "wrong";
}

// Step 2 — typed `GroceryItemCard` destructuring + `GroceryItemCardProps`; return empty Fragment only (no App)
function evalLesson1Step2(answer) {
  const raw = String(answer || "");
  const hasApp = /const\s+App\b|function\s+App\b/.test(raw);
  const hasSig =
    /const\s+GroceryItemCard\s*=\s*\(\s*\{[\s\S]*?\}\s*:\s*GroceryItemCardProps\s*\)(\s*:\s*(?:JSX\.Element|React\.ReactElement|React\.JSX\.Element))?\s*=>/m.test(
      raw,
    );
  const hasImg = /<img\b/i.test(raw);
  const hasDiv = /<div\b/i.test(raw);
  const hasEmptyFragment =
    /return\s*<\s*>\s*<\s*\/\s*>/m.test(raw) ||
    /return\s*\(\s*<\s*>\s*<\s*\/\s*>\s*\)/m.test(raw) ||
    (/return\s*\(?/m.test(raw) && /<>\s*<\/>/m.test(raw)) ||
    /<React\.Fragment>\s*<\/React\.Fragment>/.test(raw) ||
    /return\s*\(\s*<React\.Fragment>\s*<\/React\.Fragment>\s*\)/.test(raw);
  if (hasSig && hasEmptyFragment && !hasImg && !hasDiv && !hasApp) return "correct";
  if (hasSig && hasEmptyFragment && hasApp) return "partial";
  if (hasSig && !hasApp && (hasImg || hasDiv)) return "partial";
  if (hasSig && !hasApp) return "partial";
  return "wrong";
}

/** Card body checks — tolerate normal whitespace / line breaks in JSX (review: correct code flagged partial). */
function lesson1CardBodyFromPropsOk(raw) {
  const hasSig =
    /const\s+GroceryItemCard\s*=\s*\(\s*\{[\s\S]*?\}\s*:\s*GroceryItemCardProps\s*\)(\s*:\s*(?:JSX\.Element|React\.ReactElement|React\.JSX\.Element))?\s*=>/m.test(
      raw,
    );
  const hasImg =
    /<img\b[^>]*\bsrc\s*=\s*\{[\s\n]*imageUrl[\s\n]*\}/m.test(raw) ||
    /<img\b[^>]*\{[\s\n]*imageUrl[\s\n]*\}/m.test(raw);
  const hasAlt =
    /<img\b[^>]*\balt\s*=\s*\{[\s\n]*name[\s\n]*\}/m.test(raw) || /<img[^>]*\balt=\{name\}/m.test(raw);
  const hasQty = /\{[\s\n]*quantityAvailable[\s\n]*\}/.test(raw);
  const hasExp = /\{[\s\n]*expiresSummary[\s\n]*\}/.test(raw);
  const hasNameInHeading =
    /<h2\b[^>]*>[\s\S]*?\{[\s\n]*name[\s\n]*\}[\s\S]*?<\/h2>/im.test(raw) ||
    /<h2\b[^>]*>\s*\{name\}\s*<\/h2>/im.test(raw);
  return hasSig && hasImg && hasAlt && hasQty && hasExp && hasNameInHeading;
}

// Step 3 — full card JSX from props (no App)
function evalLesson1Step3(answer) {
  const raw = String(answer || "");
  const hasApp = /const\s+App\b|function\s+App\b/.test(raw);
  const cardOk = lesson1CardBodyFromPropsOk(raw);
  if (cardOk && !hasApp) return "correct";
  if (cardOk && hasApp) return "partial";
  if (!hasApp && /const\s+GroceryItemCard\b/.test(raw)) return "partial";
  return "wrong";
}

// Step 4 — `App` shell + two `<GroceryItemCard />` with props + default export
function evalLesson1Step4(answer) {
  const raw = String(answer || "");
  const cardOk = lesson1CardBodyFromPropsOk(raw);
  const hasApp = /const\s+App\b|function\s+App\b/.test(raw);
  const hasExport =
    /export\s+default\s+App\b/m.test(raw) ||
    /export\s+default\s+function\s+App\b/m.test(raw) ||
    /export\s+default\s+const\s+App\b/m.test(raw);
  const hasHeader = /<header\b/i.test(raw) && /<h1\b/i.test(raw);
  const cardMatches = [...raw.matchAll(/<GroceryItemCard\b/g)];
  const nCards = cardMatches.length;
  const passesSampleData = /name\s*=/.test(raw) && /imageUrl\s*=/.test(raw);
  if (cardOk && hasApp && hasExport && hasHeader && nCards >= 2 && passesSampleData) return "correct";
  if (cardOk && hasApp && hasExport && hasHeader && nCards === 1 && passesSampleData) return "partial";
  if (cardOk && hasApp && (!hasExport || !hasHeader)) return "partial";
  if (hasApp && nCards >= 1) return "partial";
  return "wrong";
}

// ─── nodes ───────────────────────────────────────────────────────────────────

const NODES = [
  {
    id: "intro",
    type: "reveal",
    phase: "Lesson",
    content: {
      tag: "LESSON #1 · UI building blocks",
      title: "First inventory screen",
      body: "",
      intro_gate_mcq: {
        scenario:
          "A restaurant owner wants to stop wasting food. They need to glance at the screen and immediately see what is in the kitchen — item name, how much is left, and when it expires.",
        prompt: "Where is the smartest place to start building this screen?",
        options: [
          "Lock every screen in the app to final copy and branding before modeling how one row looks",
          "Build one card that shows a single item",
          "Wait until every backend endpoint exists before rendering any UI for the kitchen",
        ],
        correct: "Build one card that shows a single item",
        footer:
          "Next you will skim the learning objectives, then work through four guided steps: a props interface, a typed component shell, full card JSX, then an `App` shell that mounts two cards.",
      },
    },
  },
  {
    id: "objectives",
    type: "objectives",
    phase: "Objectives",
    items: [
      "Declare a TypeScript interface for a React component's props",
      "Define a typed arrow-function component that destructures and annotates its props",
      "Embed prop values into JSX using curly-brace expressions",
      "Compose and export a parent component that mounts a child with sample props",
    ],
  },

  // ── Step 1 — props interface (module scope) ─────────────────────────────────
  {
    id: "step1",
    type: "question",
    phase: "Step 1 of 4",
    paal:
      "Declare `interface GroceryItemCardProps` at module scope with four `string` fields — use these exact names so later JSX and the compiler line up: `name` (display name), `imageUrl`, `quantityAvailable` (quantity label text), and `expiresSummary` (freshness / expiry note). This step is only that interface; the component arrives in Step 2.",
    hint:
      "One property per line: `name: string;` … `expiresSummary: string;`. The names are fixed for this lesson path; what changes later is the text you pass in, not the identifiers.",
    example_code: `interface MenuRowProps {
  label: string;
  priceText: string;
}`,
    think_prompt: `You are building a grocery app. You hardcode an item's display name as \`itemName\` in one place and accidentally type \`itenName\` (a typo) somewhere else. The app compiles, you deploy it — and the owner calls you because item names are blank on screen.

You just spent an hour debugging a typo that a clear data contract could have flagged instantly while coding in TypeScript.

Which of these gives you that contract?`,
    mc_options: [
      "A plain JavaScript object whose values are the literal word `string` — no compile-time checking, just a convention",
      "A TypeScript `interface` that lists each field name and its type — a contract the compiler enforces at every use",
      "Typing the entire props bundle as one plain `string` so any text counts as valid",
    ],
    mc_correct_option:
      "A TypeScript `interface` that lists each field name and its type — a contract the compiler enforces at every use",
    mc_anchor:
      "An `interface` is TypeScript's checklist. The moment a field name is misspelled or missing, the compiler flags it — before the app runs, before you deploy, before the owner calls.",
    mc_think_feedback_correct:
      "Right — the interface is the compile-time contract; typos on prop names surface in the editor instead of as silent blanks.",
    mc_think_feedback_incorrect:
      "Look for the option that names a single type checklist (`interface`) the compiler can enforce at every callsite.",
    why_this_matters:
      "This is the first half of every typed component you will ever write: name the data the component needs before you write a single line of JSX. Get this right and an entire class of bugs becomes impossible.",
    answer_keywords: ["interface", "GroceryItemCardProps", "name", "imageUrl", "quantityAvailable", "expiresSummary"],
    evaluate: evalLesson1Step1,
    seed_code: "",
    starter_code: "// declare your props interface here (four string fields)",
    feedback_correct:
      "Yes — a typed checklist the compiler can verify. No more blank fields from a silent typo.",
    feedback_partial:
      "Close — confirm `GroceryItemCardProps` lists `name`, `imageUrl`, `quantityAvailable`, and `expiresSummary`, each `string`, above any component.",
    feedback_wrong:
      "Use `interface GroceryItemCardProps` with exactly these four `string` fields: `name`, `imageUrl`, `quantityAvailable`, `expiresSummary`.",
    expected: `interface GroceryItemCardProps {
  name: string;
  imageUrl: string;
  quantityAvailable: string;
  expiresSummary: string;
}`,
  },

  // ── Step 2 — typed component shell, empty Fragment (no App) ─────────────────
  {
    id: "step2",
    type: "question",
    phase: "Step 2 of 4",
    paal:
      "Now define the component itself. Write a capitalised arrow function, destructure all four props in the parameter list, and annotate that parameter object with the interface you just declared. Return an empty Fragment `<></>` for now — the JSX comes in the next step.",
    hint: "Shape to aim for: `const YourComponent = ({ …props… }: YourPropsInterface) => { return <></>; }` — the important part is destructuring plus the interface annotation.",
    example_code: `const MenuRow = ({ label, priceText }: MenuRowProps) => {
  return <></>;
};`,
    think_prompt: `You declared an interface in Step 1 that lists exactly what data this component needs. Now you are writing the component function itself.

You want each prop to be directly available as a variable inside the function — no writing \`props.name\` every time — and you want TypeScript to verify that whoever uses this component passes the right data.

Which parameter style achieves both?`,
    mc_options: [
      "A single parameter `(props)` with no type annotation — props are accessible but TypeScript cannot verify them",
      "Destructure each field in the parameter list and annotate the object with your interface — props become local variables and TypeScript enforces the contract",
      "Omit the parameter list entirely and let TypeScript figure it out from JSX",
    ],
    mc_correct_option:
      "Destructure each field in the parameter list and annotate the object with your interface — props become local variables and TypeScript enforces the contract",
    mc_anchor:
      "Destructuring pulls each field into its own variable. The interface annotation ties the whole bundle to the contract you declared — so a missing or mistyped prop is caught before the app runs.",
    mc_think_feedback_correct:
      "Right — destructure for ergonomics, annotate with your interface so every callsite is checked.",
    mc_think_feedback_incorrect:
      "Look for the option that combines destructuring in the parameter list with typing that bundle as your props interface.",
    why_this_matters:
      "This two-part signature — destructured props, typed with an interface — is the pattern every React+TS component starts with. Get comfortable with it here and every future component will feel familiar.",
    answer_keywords: [
      "GroceryItemCard",
      "GroceryItemCardProps",
      "=>",
      "name",
      "imageUrl",
      "quantityAvailable",
      "expiresSummary",
      "return",
      "<>",
    ],
    evaluate: evalLesson1Step2,
    seed_code: `interface GroceryItemCardProps {
  name: string;
  imageUrl: string;
  quantityAvailable: string;
  expiresSummary: string;
}`,
    starter_code: `interface GroceryItemCardProps {
  name: string;
  imageUrl: string;
  quantityAvailable: string;
  expiresSummary: string;
}

// define your component here — destructure props, annotate with the interface, return <></>`,
    feedback_correct:
      "Perfect — typed, destructured props and a Fragment placeholder. The hardest part of a React+TS component is already done.",
    feedback_partial:
      "Check that the component name is capitalised, all four props are destructured in the parameter list, the bundle is annotated with your interface, and the body returns an empty Fragment.",
    feedback_wrong:
      "Write a capitalised arrow function whose parameter list destructures the four fields and annotates that object with your props interface, then return `<></>` inside the body.",
    expected: `interface GroceryItemCardProps {
  name: string;
  imageUrl: string;
  quantityAvailable: string;
  expiresSummary: string;
}

const GroceryItemCard = ({
  name,
  imageUrl,
  quantityAvailable,
  expiresSummary,
}: GroceryItemCardProps) => {
  return <></>;
};`,
  },

  // ── Step 3 — replace Fragment with full card JSX (still no App) ─────────────
  {
    id: "step3",
    type: "question",
    phase: "Step 3 of 4",
    paal:
      "Replace the empty Fragment with the real row: return a `div` wrapping `img` (`src={imageUrl}`, `alt={name}`), `h2` with `{name}`, and two `p` lines using `{quantityAvailable}` and `{expiresSummary}`. Keep the focus on `GroceryItemCard`; `App` and the default export come in Step 4.",
    hint: "Curly braces in JSX mean “evaluate JavaScript here.” Keep the same destructured parameter list and `GroceryItemCardProps` annotation from Step 2.",
    example_code: `const MenuRow = ({ label, priceText }: MenuRowProps) => {
  return (
    <div>
      <p>{label}</p>
      <p>{priceText}</p>
    </div>
  );
};`,
    think_prompt:
      "Plain text inside JSX stays literal. What syntax reads the `name` variable inside an `h2`?",
    mc_options: [
      "`<h2>name</h2>`",
      "`<h2>{name}</h2>`",
      "`<h2 ${name}>`",
    ],
    mc_correct_option: "`<h2>{name}</h2>`",
    mc_anchor:
      "Braces evaluate JavaScript in JSX — that is how props reach the screen.",
    mc_think_feedback_correct:
      "Exactly — `{name}` is the live channel from props to UI.",
    mc_think_feedback_incorrect:
      "Remember: plain text inside tags stays literal; braces read variables.",
    why_this_matters:
      "One typed component definition becomes a reusable template for every row the app will render.",
    answer_keywords: [
      "GroceryItemCard",
      "GroceryItemCardProps",
      "{name}",
      "{imageUrl}",
      "{quantityAvailable}",
      "{expiresSummary}",
    ],
    evaluate: evalLesson1Step3,
    seed_code: `interface GroceryItemCardProps {
  name: string;
  imageUrl: string;
  quantityAvailable: string;
  expiresSummary: string;
}

const GroceryItemCard = ({
  name,
  imageUrl,
  quantityAvailable,
  expiresSummary,
}: GroceryItemCardProps) => {
  return <></>;
};`,
    starter_code: "",
    feedback_correct:
      "The card markup is wired to props — the row is ready for `App` to mount next.",
    feedback_partial:
      "Keep `GroceryItemCard` typed with `GroceryItemCardProps`, and wire `img` (`src` / `alt`), `h2` with `{name}`, and both `p` lines to `quantityAvailable` and `expiresSummary` via `{...}`.",
    feedback_wrong:
      "`GroceryItemCard` should return a `div` containing `img`, `h2`, and two `p` elements; bind the four props in JSX with `{...}` expressions.",
    expected: `interface GroceryItemCardProps {
  name: string;
  imageUrl: string;
  quantityAvailable: string;
  expiresSummary: string;
}

const GroceryItemCard = ({
  name,
  imageUrl,
  quantityAvailable,
  expiresSummary,
}: GroceryItemCardProps) => {
  return (
    <div>
      <img src={imageUrl} alt={name} />
      <h2>{name}</h2>
      <p>Available: {quantityAvailable}</p>
      <p>{expiresSummary}</p>
    </div>
  );
};`,
  },

  // ── Step 4 — App: shell + two `<GroceryItemCard />` + default export ─────────
  {
    id: "step4",
    type: "question",
    phase: "Step 4 of 4",
    paal:
      "Add the `App` component: return a `div` with `header` / `h1`, then mount two `<GroceryItemCard />` elements with different sample values for all four props on each. End with `export default App` so the preview mounts `App` as the root. (One card is a good warm-up — you need two to pass this step.)",
    hint:
      "String attributes on JSX (`name=\"…\"`) are fine. TypeScript should error if you omit a required prop — that is the interface from Step 1 paying rent.",
    example_code: `const App = () => (
  <div>
    <header><h1>Kitchen board</h1></header>
    <MenuRow label="Espresso" priceText="$3.50" />
    <MenuRow label="Cold brew" priceText="$4.25" />
  </div>
);

export default App;`,
    think_prompt:
      "Who should own the page title and the decision to mount `GroceryItemCard` — the card itself, or the `App` component?",
    mc_options: [
      "The card should import and render the App layout",
      "The `App` component composes the shell and mounts `<GroceryItemCard />`",
      "Neither — exports alone decide what renders",
    ],
    mc_correct_option: "The `App` component composes the shell and mounts `<GroceryItemCard />`",
    mc_anchor:
      "Callers compose screens; presentational pieces stay focused. Here `App` is that caller — twice, with different props, to prove reuse.",
    mc_think_feedback_correct:
      "Right — `App` is the composition root for this file: header chrome plus your cards.",
    mc_think_feedback_incorrect:
      "Think composition: the `App` component builds the page frame and places children inside it.",
    why_this_matters:
      "Lists and dashboards are mostly “the same row, different data.” Mounting the same component twice proves you have a reusable unit instead of a one-off paste.",
    answer_keywords: ["App", "header", "h1", "GroceryItemCard", "export", "default"],
    evaluate: evalLesson1Step4,
    seed_code: `interface GroceryItemCardProps {
  name: string;
  imageUrl: string;
  quantityAvailable: string;
  expiresSummary: string;
}

const GroceryItemCard = ({
  name,
  imageUrl,
  quantityAvailable,
  expiresSummary,
}: GroceryItemCardProps) => {
  return (
    <div>
      <img src={imageUrl} alt={name} />
      <h2>{name}</h2>
      <p>Available: {quantityAvailable}</p>
      <p>{expiresSummary}</p>
    </div>
  );
};`,
    starter_code: "",
    feedback_correct:
      "Two cards, one `App`, zero duplicated markup definitions. That is the reuse win.",
    feedback_partial:
      "Compose `App` with `header` + `h1`, `export default App`, and two `<GroceryItemCard … />` callsites with different props for each row.",
    feedback_wrong:
      "Pattern: `App` returns a `div` with `header`/`h1`, mounts two `GroceryItemCard` rows with distinct props, and ends with `export default App`.",
    expected: `interface GroceryItemCardProps {
  name: string;
  imageUrl: string;
  quantityAvailable: string;
  expiresSummary: string;
}

const GroceryItemCard = ({
  name,
  imageUrl,
  quantityAvailable,
  expiresSummary,
}: GroceryItemCardProps) => {
  return (
    <div>
      <img src={imageUrl} alt={name} />
      <h2>{name}</h2>
      <p>Available: {quantityAvailable}</p>
      <p>{expiresSummary}</p>
    </div>
  );
};

const App = () => (
  <div>
    <header>
      <h1>Supply watch</h1>
    </header>
    <GroceryItemCard
      name="Roma tomatoes"
      imageUrl="https://images.unsplash.com/photo-1546094096-0df3bcbbb700?w=400&q=80"
      quantityAvailable="2 cases (est.)"
      expiresSummary="Use by Friday — color turning fast"
    />
    <GroceryItemCard
      name="Fresh basil"
      imageUrl="https://images.unsplash.com/photo-1618375569909-3c8616cf7733?w=400&q=80"
      quantityAvailable="3 bunches"
      expiresSummary="Peak condition — use within 2 days"
    />
  </div>
);

export default App;`,
  },
];

const sideItems = [
  { label: "Lesson", id: "intro" },
  { label: "Objectives", id: "objectives" },
  { label: "Step 1", id: "step1" },
  { label: "Step 2", id: "step2" },
  { label: "Step 3", id: "step3" },
  { label: "Step 4", id: "step4" },
];

const inpactTs01Engine = createINPACTEngine({
  NODES,
  sideItems,
  lessonNum: 1,
  title: "First inventory screen — title + grocery card",
  shortName: "REST — FIRST SCREEN",
});

export default inpactTs01Engine;
