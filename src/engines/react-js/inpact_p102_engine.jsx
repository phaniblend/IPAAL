import createINPACTEngine from "../inpact_engine_shared";

const NODES = [
  { id: "intro", type: "reveal", phase: "Lesson", content: { tag: "LESSON #102", title: "forwardRef & Exposing DOM Nodes", body: "Parent components often need to trigger focus, scroll, or animation on a child's DOM node. Teaches how to wrap a component, forward the ref to a specific element, and type it correctly in TypeScript.", usecase: "Expose DOM nodes to parents." } },
  { id: "objectives", type: "objectives", phase: "Objectives", items: ["Use forwardRef to pass ref to a child", "Attach ref to a DOM element", "Type ref correctly (TypeScript)", "Export and verify focus/scroll"] },
  { id: "step1", type: "question", phase: "Step 1 of 3", paal: "Create a component wrapped with forwardRef.", answer_keywords: ["forwardRef", "import", "react"], seed_code: "import { forwardRef } from 'react'\n\nexport default function App() {\n  // Step 1\n}", feedback_correct: "✅ Step 1 done.", feedback_partial: "Add forwardRef.", feedback_wrong: "Set up structure", expected: "forwardRef wrapper" },
  { id: "step2", type: "question", phase: "Step 2 of 3", paal: "Forward the ref to an input or div and expose it to the parent.", answer_keywords: ["ref", "input", "div"], seed_code: "import { forwardRef } from 'react'\n\nexport default function App() {\n  // Step 2\n}", feedback_correct: "✅ Step 2 done.", feedback_partial: "Ref to element.", feedback_wrong: "Forward ref", expected: "Ref forwarded to DOM element" },
  { id: "step3", type: "question", phase: "Step 3 of 3", paal: "Wire parent to use the ref (e.g. focus) and export.", answer_keywords: ["export", "default", "ref"], seed_code: "import { forwardRef, useRef } from 'react'\n\nexport default function App() {\n  // Step 3\n}", feedback_correct: "✅ Lesson #102 complete.", feedback_partial: "Export and finish.", feedback_wrong: "Export component", expected: "Complete" },
];

const sideItems = [{ label: "Lesson", id: "intro" }, { label: "Objectives", id: "objectives" }, { label: "Step 1", id: "step1" }, { label: "Step 2", id: "step2" }, { label: "Step 3", id: "step3" }];
export default createINPACTEngine({ NODES, sideItems, lessonNum: 102, title: "forwardRef & Exposing DOM Nodes", shortName: "FORWARDREF & DOM NODES" });
