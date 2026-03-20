import createINPACTEngine from "../inpact_engine_shared";

const NODES = [
  { id: "intro", type: "reveal", phase: "Lesson", content: { tag: "LESSON #120", title: "RBAC Permission Hook", body: "Moves permission checks out of route guards into a reusable hook that gates individual UI components. Builds usePermission('invoices:write') backed by auth context — permission schema design, wildcard matching, and hiding UI vs blocking API.", usecase: "Permission-based UI gating." } },
  { id: "objectives", type: "objectives", phase: "Objectives", items: ["Create usePermission(permission) hook", "Back with auth context permissions", "Support wildcard (e.g. invoices:*)", "Gate buttons/links by permission"] },
  { id: "step1", type: "question", phase: "Step 1 of 3", paal: "Assume auth context has user.permissions (array). Create usePermission(perm) that returns boolean.", answer_keywords: ["useContext", "permissions", "includes"], seed_code: "import { createContext, useContext } from 'react'\n\nexport default function App() {\n  // Step 1\n}", feedback_correct: "✅ Step 1 done.", feedback_partial: "usePermission hook.", feedback_wrong: "Set up hook", expected: "usePermission(perm)" },
  { id: "step2", type: "question", phase: "Step 2 of 3", paal: "Add wildcard support (e.g. invoices:* matches invoices:write).", answer_keywords: ["wildcard", "match", "split"], seed_code: "export default function App() {\n  // Step 2\n}", feedback_correct: "✅ Step 2 done.", feedback_partial: "Wildcard match.", feedback_wrong: "Wildcard logic", expected: "Wildcard matching" },
  { id: "step3", type: "question", phase: "Step 3 of 3", paal: "Gate a button or link with usePermission and export.", answer_keywords: ["export", "default", "button"], seed_code: "export default function App() {\n  // Step 3\n}", feedback_correct: "✅ Lesson #120 complete.", feedback_partial: "Export and finish.", feedback_wrong: "Export component", expected: "Complete" },
];

const sideItems = [{ label: "Lesson", id: "intro" }, { label: "Objectives", id: "objectives" }, { label: "Step 1", id: "step1" }, { label: "Step 2", id: "step2" }, { label: "Step 3", id: "step3" }];
export default createINPACTEngine({ NODES, sideItems, problemNum: 120, title: "RBAC Permission Hook", shortName: "RBAC PERMISSION HOOK" });
