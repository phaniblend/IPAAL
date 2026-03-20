import createINPACTEngine from "../inpact_engine_shared";

const NODES = [
  { id: "intro", type: "reveal", phase: "Lesson", content: { tag: "LESSON #110", title: "Accessibility (a11y) Fundamentals", body: "A11y appears on every senior rubric and is legally required in many industries. Teaches ARIA roles and states, semantic HTML, focus management in modals, keyboard operability for custom components, and axe-core — applied to Accordion (29) and Portal (58).", usecase: "Accessible React components." } },
  { id: "objectives", type: "objectives", phase: "Objectives", items: ["Use semantic HTML and ARIA", "Manage focus in modals", "Ensure keyboard operability", "Run axe-core or similar"] },
  { id: "step1", type: "question", phase: "Step 1 of 3", paal: "Add semantic HTML (main, nav, button) and ARIA attributes where needed.", answer_keywords: ["aria-", "role", "button"], seed_code: "export default function App() {\n  // Step 1\n}", feedback_correct: "✅ Step 1 done.", feedback_partial: "Semantic + ARIA.", feedback_wrong: "Set up a11y", expected: "Semantic HTML and ARIA" },
  { id: "step2", type: "question", phase: "Step 2 of 3", paal: "Implement focus trap or focus return in a modal/dialog.", answer_keywords: ["focus", "ref", "useEffect"], seed_code: "import { useRef, useEffect } from 'react'\n\nexport default function App() {\n  // Step 2\n}", feedback_correct: "✅ Step 2 done.", feedback_partial: "Focus management.", feedback_wrong: "Focus trap", expected: "Focus management" },
  { id: "step3", type: "question", phase: "Step 3 of 3", paal: "Ensure keyboard support (Enter, Escape, Tab) and export.", answer_keywords: ["export", "onKeyDown", "keyboard"], seed_code: "export default function App() {\n  // Step 3\n}", feedback_correct: "✅ Lesson #110 complete.", feedback_partial: "Export and finish.", feedback_wrong: "Export component", expected: "Complete" },
];

const sideItems = [{ label: "Lesson", id: "intro" }, { label: "Objectives", id: "objectives" }, { label: "Step 1", id: "step1" }, { label: "Step 2", id: "step2" }, { label: "Step 3", id: "step3" }];
export default createINPACTEngine({ NODES, sideItems, problemNum: 110, title: "Accessibility (a11y) Fundamentals", shortName: "A11Y FUNDAMENTALS" });
