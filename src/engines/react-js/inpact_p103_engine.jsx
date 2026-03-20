import createINPACTEngine from "../inpact_engine_shared";

const NODES = [
  { id: "intro", type: "reveal", phase: "Lesson", content: { tag: "LESSON #103", title: "AbortController & Cleanup in useEffect", body: "The most common async bug in React — a fetch resolving after unmount and updating dead state. Teaches AbortController, proper cleanup functions, and why React 18 StrictMode double-fires effects intentionally.", usecase: "Safe async in effects." } },
  { id: "objectives", type: "objectives", phase: "Objectives", items: ["Use AbortController in fetch", "Return a cleanup that aborts", "Handle unmount before resolve", "Understand StrictMode double-invoke"] },
  { id: "step1", type: "question", phase: "Step 1 of 3", paal: "Set up useEffect with a fetch and AbortController.", answer_keywords: ["useEffect", "AbortController", "fetch"], seed_code: "import { useEffect, useState } from 'react'\n\nexport default function App() {\n  // Step 1\n}", feedback_correct: "✅ Step 1 done.", feedback_partial: "Add AbortController.", feedback_wrong: "Set up structure", expected: "useEffect + AbortController" },
  { id: "step2", type: "question", phase: "Step 2 of 3", paal: "Pass signal to fetch and return cleanup that calls abort().", answer_keywords: ["signal", "abort", "return"], seed_code: "import { useEffect, useState } from 'react'\n\nexport default function App() {\n  // Step 2\n}", feedback_correct: "✅ Step 2 done.", feedback_partial: "Cleanup function.", feedback_wrong: "Abort on cleanup", expected: "Cleanup aborts request" },
  { id: "step3", type: "question", phase: "Step 3 of 3", paal: "Only update state if not aborted and export.", answer_keywords: ["export", "default", "state"], seed_code: "import { useEffect, useState } from 'react'\n\nexport default function App() {\n  // Step 3\n}", feedback_correct: "✅ Lesson #103 complete.", feedback_partial: "Export and finish.", feedback_wrong: "Export component", expected: "Complete" },
];

const sideItems = [{ label: "Lesson", id: "intro" }, { label: "Objectives", id: "objectives" }, { label: "Step 1", id: "step1" }, { label: "Step 2", id: "step2" }, { label: "Step 3", id: "step3" }];
export default createINPACTEngine({ NODES, sideItems, problemNum: 103, title: "AbortController & Cleanup in useEffect", shortName: "ABORTCONTROLLER & CLEANUP" });
