import createINPACTEngine from "../inpact_engine_shared";

const NODES = [
  { id: "intro", type: "reveal", phase: "Lesson", content: { tag: "LESSON #107", title: "Zustand for Global State", body: "Context API re-renders entire subtrees — Zustand uses subscription-based state. Teaches store creation, selector-based re-render optimization, async actions, and persist middleware, comparing to the cart from lesson 43.", usecase: "Global state without Context re-renders." } },
  { id: "objectives", type: "objectives", phase: "Objectives", items: ["Create a Zustand store", "Use selectors to limit re-renders", "Add async actions", "Optional: persist middleware"] },
  { id: "step1", type: "question", phase: "Step 1 of 3", paal: "Create a Zustand store with create and a few state slices.", answer_keywords: ["create", "zustand", "store"], seed_code: "import { create } from 'zustand'\n\nexport default function App() {\n  // Step 1\n}", feedback_correct: "✅ Step 1 done.", feedback_partial: "Add store.", feedback_wrong: "Set up store", expected: "Zustand store" },
  { id: "step2", type: "question", phase: "Step 2 of 3", paal: "Use the store in a component with a selector to avoid unnecessary re-renders.", answer_keywords: ["useStore", "selector", "subscribe"], seed_code: "import { create } from 'zustand'\n\nexport default function App() {\n  // Step 2\n}", feedback_correct: "✅ Step 2 done.", feedback_partial: "Selector usage.", feedback_wrong: "Use store", expected: "Component with selector" },
  { id: "step3", type: "question", phase: "Step 3 of 3", paal: "Wire UI and export.", answer_keywords: ["export", "default"], seed_code: "import { create } from 'zustand'\n\nexport default function App() {\n  // Step 3\n}", feedback_correct: "✅ Lesson #107 complete.", feedback_partial: "Export and finish.", feedback_wrong: "Export component", expected: "Complete" },
];

const sideItems = [{ label: "Lesson", id: "intro" }, { label: "Objectives", id: "objectives" }, { label: "Step 1", id: "step1" }, { label: "Step 2", id: "step2" }, { label: "Step 3", id: "step3" }];
export default createINPACTEngine({ NODES, sideItems, problemNum: 107, title: "Zustand for Global State", shortName: "ZUSTAND GLOBAL STATE" });
