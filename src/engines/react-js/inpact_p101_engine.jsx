import createINPACTEngine from "../inpact_engine_shared";

const NODES = [
  { id: "intro", type: "reveal", phase: "Lesson", content: { tag: "LESSON #101", title: "useId & Stable IDs", body: "React 18's useId solves hardcoded HTML IDs that break hydration, accessibility, and concurrent rendering. Teaches stable ID generation, label-input pairing, and why sequential counters fail in async trees.", usecase: "Stable IDs for forms and SSR." } },
  { id: "objectives", type: "objectives", phase: "Objectives", items: ["Use useId() for stable unique IDs", "Pair labels and inputs correctly", "Avoid sequential counters in async trees", "Export and verify in UI"] },
  { id: "step1", type: "question", phase: "Step 1 of 3", paal: "Set up the initial structure and use useId().", answer_keywords: ["useId", "import", "function"], seed_code: "import { useId } from 'react'\n\nexport default function App() {\n  // Step 1\n}", feedback_correct: "✅ Step 1 done.", feedback_partial: "Add useId.", feedback_wrong: "Set up structure", expected: "Initial setup with useId" },
  { id: "step2", type: "question", phase: "Step 2 of 3", paal: "Implement label and input with stable id from useId.", answer_keywords: ["label", "htmlFor", "id"], seed_code: "import { useId } from 'react'\n\nexport default function App() {\n  // Step 2\n}", feedback_correct: "✅ Step 2 done.", feedback_partial: "Label-input pairing.", feedback_wrong: "Implement pairing", expected: "Label and input with stable id" },
  { id: "step3", type: "question", phase: "Step 3 of 3", paal: "Wire everything together and export the component.", answer_keywords: ["export", "default"], seed_code: "import { useId } from 'react'\n\nexport default function App() {\n  // Step 3\n}", feedback_correct: "✅ Lesson #101 complete.", feedback_partial: "Export and finish.", feedback_wrong: "Export component", expected: "Complete" },
];

const sideItems = [{ label: "Lesson", id: "intro" }, { label: "Objectives", id: "objectives" }, { label: "Step 1", id: "step1" }, { label: "Step 2", id: "step2" }, { label: "Step 3", id: "step3" }];
export default createINPACTEngine({ NODES, sideItems, lessonNum: 101, title: "useId & Stable IDs", shortName: "USEID & STABLE IDS" });
