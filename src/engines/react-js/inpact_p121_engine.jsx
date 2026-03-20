import createINPACTEngine from "../inpact_engine_shared";

const NODES = [
  { id: "intro", type: "reveal", phase: "Lesson", content: { tag: "LESSON #121", title: "Multi-Tab Auth Sync", body: "A user logging out in one tab while another stays authenticated is a real UX and security bug. Teaches BroadcastChannel API to broadcast auth state changes across tabs, sync logout/login, and force re-render or redirect in listening tabs.", usecase: "Auth sync across tabs." } },
  { id: "objectives", type: "objectives", phase: "Objectives", items: ["Use BroadcastChannel for auth channel", "Post message on login/logout", "Listen in other tabs and update state", "Redirect or re-render on sync"] },
  { id: "step1", type: "question", phase: "Step 1 of 3", paal: "Create a BroadcastChannel('auth') and postMessage on logout (and optionally login).", answer_keywords: ["BroadcastChannel", "postMessage"], seed_code: "export default function App() {\n  // Step 1\n}", feedback_correct: "✅ Step 1 done.", feedback_partial: "BroadcastChannel.", feedback_wrong: "Set up channel", expected: "Post on auth change" },
  { id: "step2", type: "question", phase: "Step 2 of 3", paal: "In auth provider or app, add onmessage listener to update state or redirect when message received.", answer_keywords: ["onmessage", "useEffect", "listener"], seed_code: "import { useEffect } from 'react'\n\nexport default function App() {\n  // Step 2\n}", feedback_correct: "✅ Step 2 done.", feedback_partial: "Listener.", feedback_wrong: "Listen for message", expected: "onmessage updates state" },
  { id: "step3", type: "question", phase: "Step 3 of 3", paal: "Clean up listener on unmount and export.", answer_keywords: ["export", "cleanup", "close"], seed_code: "export default function App() {\n  // Step 3\n}", feedback_correct: "✅ Lesson #121 complete.", feedback_partial: "Export and finish.", feedback_wrong: "Export component", expected: "Complete" },
];

const sideItems = [{ label: "Lesson", id: "intro" }, { label: "Objectives", id: "objectives" }, { label: "Step 1", id: "step1" }, { label: "Step 2", id: "step2" }, { label: "Step 3", id: "step3" }];
export default createINPACTEngine({ NODES, sideItems, problemNum: 121, title: "Multi-Tab Auth Sync", shortName: "MULTI-TAB AUTH SYNC" });
