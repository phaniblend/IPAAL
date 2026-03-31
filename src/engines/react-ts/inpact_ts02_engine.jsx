import createINPACTEngine from "../inpact_engine_shared";

/** Follows shared 5-phase pattern: imports → state → JSX → handlers → wire (see ../lessonPhasePattern.js). */

const NODES = [
  {
    id: "intro",
    type: "reveal",
    phase: "Lesson",
    content: {
      tag: "LESSON #2 (TypeScript)",
      title: "Toggle Visibility — Typed",
      body: "Show or hide a paragraph when the user clicks a **button**; the screen should reflect visible vs hidden.",
      usecase: "Show/hide toggles appear everywhere — menus, panels, and disclosure blocks in real products.",
    },
  },
  {
    id: "objectives",
    type: "objectives",
    phase: "Objectives",
    items: [
      "Import React and useState from 'react' before JSX and state.",
      "Model visibility with typed boolean state (useState<boolean>).",
      "Return JSX that includes a layout, a button, and paragraph text before adding click behavior.",
      "Write a handler that flips the boolean using a functional update so each click uses the latest value.",
      "Wire the button’s onClick to that handler and show or hide the paragraph from state; export the component.",
    ],
  },
  {
    id: "step1",
    type: "question",
    phase: "Step 1 of 5 — Imports",
    paal:
      "At the top of the file, import React and useState from 'react' — React is needed for JSX in this setup, and useState for state in the next step.",
    hint: "import React, { useState } from 'react' (same idea as import { useState } from 'react' if your tooling uses the automatic JSX runtime only).",
    cursorLine: 1,
    cursorAtStartOfLine: 1,
    seed_code: `export default function ToggleVisibility() {

}`,
    evaluate(answer) {
      const raw = answer || "";
      const fromReact = /from\s*['"]react['"]/i.test(raw);
      const useStateNamed =
        /import\s*\{[^}]*\buseState\b[^}]*\}\s*from\s*['"]react['"]/i.test(raw) ||
        /import\s+React\s*,\s*\{[^}]*\buseState\b[^}]*\}\s*from\s*['"]react['"]/i.test(raw);
      if (useStateNamed && fromReact) return "correct";
      if (/\buseState\b/.test(raw) && fromReact) return "partial";
      if (!/\buseState\b/.test(raw)) return "wrong";
      return "partial";
    },
    feedback_correct: "✅ React and useState are imported — you're set for JSX and state in the following steps.",
    feedback_partial: "Add an import from 'react' that includes useState, and include React if you use JSX here (e.g. import React, { useState } from 'react').",
    feedback_wrong: "Import from 'react' with useState (and React for JSX), e.g. import React, { useState } from 'react'",
    expected: "import React, { useState } from 'react' (or import { useState } from 'react' with automatic JSX runtime)",
  },
  {
    id: "step2",
    type: "question",
    phase: "Step 2 of 5 — State & types",
    paal: "Inside ToggleVisibility, define boolean state for visibility and initialize it to true (so content starts visible).",
    hint: "useState<boolean>(true) — any names you like for the state pair.",
    cursorLine: 4,
    cursorAtStartOfLine: 4,
    seed_code: `import { useState } from 'react'

export default function ToggleVisibility() {

}`,
    evaluate(answer) {
      const a = (answer || "").toLowerCase().replace(/\s/g, "");
      if (!a.includes("usestate")) return "wrong";
      if (!a.includes("usestate<boolean>")) return "partial";
      return "correct";
    },
    feedback_correct: "✅ Typed boolean state is ready for JSX and handlers.",
    feedback_partial: "Add useState with an explicit <boolean> generic.",
    feedback_wrong: "const [visible, setVisible] = useState<boolean>(true) (names may differ).",
    expected: "useState<boolean>(true)",
  },
  {
    id: "step3",
    type: "question",
    phase: "Step 3 of 5 — JSX",
    paal:
      "Add a return with JSX: a wrapping <div>, a <button> with a short label (e.g. Toggle), and a <p> with sample text. Do not add onClick on the button yet — only structure and copy.",
    hint: "return ( <div> <button>Toggle</button> <p>You can see this.</p> </div> ) — adjust text if you like.",
    cursorLine: 5,
    cursorAtStartOfLine: 5,
    seed_code: `import { useState } from 'react'

export default function ToggleVisibility() {
  const [visible, setVisible] = useState<boolean>(true)

}`,
    evaluate(answer) {
      const raw = answer || "";
      const hasReturn = /return\s*\(/.test(raw);
      const hasDiv = /<div\b/i.test(raw);
      const hasButton = /<button\b/i.test(raw);
      const hasP = /<p\b/i.test(raw);
      const hasOnClick = /onClick\s*=/.test(raw);
      if (hasReturn && hasDiv && hasButton && hasP && !hasOnClick) return "correct";
      if (hasReturn && hasDiv && hasButton && hasP && hasOnClick) return "partial";
      if (hasReturn && (hasButton || hasP)) return "partial";
      return "wrong";
    },
    feedback_correct:
      "✅ JSX skeleton is clear — a div, a button, and a paragraph — with no click handler yet. Next you will add the toggle function, then attach it.",
    feedback_partial: "You need a return with <div>, <button>, and <p>. Remove onClick from the button for this step.",
    feedback_wrong: "return ( ... ) with a div, button (no onClick), and p.",
    expected: "return ( <div> <button>...</button> <p>...</p> </div> ) without onClick",
  },
  {
    id: "step4",
    type: "question",
    phase: "Step 4 of 5 — Handlers",
    paal:
      "Define a function (any name) that flips the visibility boolean using the setter and a functional update (e.g. previous value => !previous value). Do not add or change onClick on the button yet.",
    hint: "const toggle = () => setVisible(prev => !prev) — names may differ.",
    cursorLine: 6,
    cursorAtStartOfLine: 6,
    seed_code: `import { useState } from 'react'

export default function ToggleVisibility() {
  const [visible, setVisible] = useState<boolean>(true)
  return (
    <div>
      <button>Toggle</button>
      <p>You can see this.</p>
    </div>
  )
}`,
    evaluate(answer) {
      const raw = answer || "";
      const c = raw.replace(/\s/g, "");
      const hasOnClick = /onClick\s*=/.test(raw);
      const functionalFlip =
        /set\w+\(\w+=>\s*!/.test(c) || /set\w+\(\([^)]*\)=>\s*!/.test(c);
      const directToggle = /set\w+\(!\w+\)/.test(c);
      if ((functionalFlip || directToggle) && !hasOnClick) return "correct";
      if (functionalFlip || directToggle) return "partial";
      if (/const\s+\w+\s*=\s*\(\s*\)\s*=>/.test(raw) || /function\s+\w+\s*\(\s*\)/.test(raw)) return "partial";
      return "wrong";
    },
    feedback_correct:
      "✅ Handler flips the flag with a functional update. Next step: attach it to the button and tie the paragraph to state.",
    feedback_partial: "Flip the boolean with setX(prev => !prev) (or equivalent). Leave onClick off the button until the next step.",
    feedback_wrong: "Add a function that calls your setter with an updater like prev => !prev.",
    expected: "toggle handler with functional update; no onClick yet",
  },
  {
    id: "step5",
    type: "question",
    phase: "Step 5 of 5 — Wire & finish",
    paal:
      "On the <button>, add onClick pointing at your toggle function. Show the <p> only when visibility is true (e.g. visible && <p>...</p>). Export the component as default.",
    hint: "<button onClick={toggle}>…</button> and {visible && <p>…</p>}",
    cursorLine: 7,
    cursorAtStartOfLine: 7,
    seed_code: `import { useState } from 'react'

export default function ToggleVisibility() {
  const [visible, setVisible] = useState<boolean>(true)
  const toggle = () => setVisible(prev => !prev)
  return (
    <div>
      <button>Toggle</button>
      <p>You can see this.</p>
    </div>
  )
}`,
    evaluate(answer) {
      const raw = answer || "";
      const lower = raw.toLowerCase().replace(/\s/g, "");
      const hasExport = lower.includes("exportdefault");
      const hasP = /<p\b/i.test(raw);
      const hasCond = raw.includes("&&") || /\?\s*\(/.test(raw) || /\?\s*</.test(raw);
      const hasOnClick = /onClick\s*=\s*\{/.test(raw);
      if (hasExport && hasP && hasCond && hasOnClick) return "correct";
      if (hasExport && hasP && hasOnClick) return "partial";
      if (hasExport && hasOnClick) return "partial";
      return "wrong";
    },
    feedback_correct: "✅ Lesson complete — button click runs your handler and the paragraph follows visibility; component is exported.",
    feedback_partial: "Wire onClick on the button, conditionally render the <p> from state, keep export default.",
    feedback_wrong: "onClick={yourToggle}, conditional <p>, export default function.",
    expected: "onClick + conditional paragraph + export default",
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
];

export default createINPACTEngine({ NODES, sideItems, lessonNum: 2, title: "Toggle Visibility (TypeScript)", shortName: "TS — TOGGLE" });
