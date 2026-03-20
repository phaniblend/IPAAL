import createINPACTEngine from "../inpact_engine_shared";

const NODES = [
  { id: "intro", type: "reveal", phase: "Lesson", content: { tag: "LESSON #123", title: "Form Validation with Zod + React Hook Form", body: "Zod and React Hook Form are the dominant form stack in modern React. Teaches schema definition, TypeScript type inference with z.infer, wiring to RHF with zodResolver, and field-level error display.", usecase: "Typed forms with Zod and RHF." } },
  { id: "objectives", type: "objectives", phase: "Objectives", items: ["Define Zod schema and z.infer type", "Use useForm with zodResolver", "Display field-level errors", "Submit validated data"] },
  { id: "step1", type: "question", phase: "Step 1 of 3", paal: "Define a Zod schema (e.g. email, password) and infer TypeScript type.", answer_keywords: ["z.object", "z.infer", "z.string"], seed_code: "import { z } from 'zod'\n\nexport default function App() {\n  // Step 1\n}", feedback_correct: "✅ Step 1 done.", feedback_partial: "Zod schema.", feedback_wrong: "Set up schema", expected: "Schema + type" },
  { id: "step2", type: "question", phase: "Step 2 of 3", paal: "Use useForm with zodResolver(schema) and register fields.", answer_keywords: ["useForm", "zodResolver", "register"], seed_code: "import { useForm } from 'react-hook-form'\nimport { zodResolver } from '@hookform/resolvers/zod'\n\nexport default function App() {\n  // Step 2\n}", feedback_correct: "✅ Step 2 done.", feedback_partial: "RHF + resolver.", feedback_wrong: "Wire form", expected: "useForm + zodResolver" },
  { id: "step3", type: "question", phase: "Step 3 of 3", paal: "Display errors from formState.errors and export.", answer_keywords: ["errors", "export", "default"], seed_code: "import { useForm } from 'react-hook-form'\n\nexport default function App() {\n  // Step 3\n}", feedback_correct: "✅ Lesson #123 complete.", feedback_partial: "Export and finish.", feedback_wrong: "Export component", expected: "Complete" },
];

const sideItems = [{ label: "Lesson", id: "intro" }, { label: "Objectives", id: "objectives" }, { label: "Step 1", id: "step1" }, { label: "Step 2", id: "step2" }, { label: "Step 3", id: "step3" }];
export default createINPACTEngine({ NODES, sideItems, problemNum: 123, title: "Form Validation with Zod + React Hook Form", shortName: "ZOD + REACT HOOK FORM" });
