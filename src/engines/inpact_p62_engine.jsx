import createINPACTEngine from "./inpact_engine_shared";

const NODES = [
  { id: "intro", type: "reveal", phase: "Problem", content: { tag: "PROBLEM #62", title: "Infinite Scroll", body: "Load more on scroll (IntersectionObserver)", usecase: "Infinite scroll." } },
  { id: "objectives", type: "objectives", phase: "Objectives", items: ["Understand the goal", "Implement step by step", "Export and verify"] },
  { id: "step1", type: "question", phase: "Step 1 of 3", paal: "Set up the initial structure and state needed for this problem.", answer_keywords: ["import", "state", "function"], seed_code: "import { useState } from 'react'\n\nexport default function App() {\n  // Step 1\n}", feedback_correct: "✅ Step 1 done.", feedback_partial: "Add required setup.", feedback_wrong: "Set up structure", expected: "Initial setup" },
  { id: "step2", type: "question", phase: "Step 2 of 3", paal: "Implement the core logic or UI for this problem.", answer_keywords: ["return", "render", "logic"], seed_code: "import { useState } from 'react'\n\nexport default function App() {\n  // Step 2\n}", feedback_correct: "✅ Step 2 done.", feedback_partial: "Core logic in place.", feedback_wrong: "Implement core", expected: "Core implementation" },
  { id: "step3", type: "question", phase: "Step 3 of 3", paal: "Wire everything together, handle edge cases, and export the component.", answer_keywords: ["export", "default"], seed_code: "import { useState } from 'react'\n\nexport default function App() {\n  // Step 3\n}", feedback_correct: "✅ Problem #62 complete.", feedback_partial: "Export and finish.", feedback_wrong: "Export component", expected: "Complete" },
];

const sideItems = [{ label: "Problem", id: "intro" }, { label: "Objectives", id: "objectives" }, { label: "Step 1", id: "step1" }, { label: "Step 2", id: "step2" }, { label: "Step 3", id: "step3" }];
export default createINPACTEngine({ NODES, sideItems, problemNum: 62, title: "Infinite Scroll", shortName: "INFINITE SCROLL" });
