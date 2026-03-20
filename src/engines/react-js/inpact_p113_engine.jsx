import createINPACTEngine from "../inpact_engine_shared";

const NODES = [
  { id: "intro", type: "reveal", phase: "Lesson", content: { tag: "LESSON #113", title: "JWT Storage & Decode in React", body: "Most auth tutorials store JWTs in localStorage — a serious XSS risk. Teaches why access tokens belong in memory, how to decode a JWT payload without a library, when to use sessionStorage as a compromise, and how to structure an auth store around token lifecycle.", usecase: "Secure JWT handling." } },
  { id: "objectives", type: "objectives", phase: "Objectives", items: ["Store access token in memory", "Decode JWT payload (base64)", "Avoid localStorage for tokens", "Structure auth store"] },
  { id: "step1", type: "question", phase: "Step 1 of 3", paal: "Create an auth store that keeps access token in memory (useState or ref).", answer_keywords: ["useState", "token", "memory"], seed_code: "import { useState } from 'react'\n\nexport default function App() {\n  // Step 1\n}", feedback_correct: "✅ Step 1 done.", feedback_partial: "In-memory token.", feedback_wrong: "Set up store", expected: "Token in memory" },
  { id: "step2", type: "question", phase: "Step 2 of 3", paal: "Implement JWT decode (base64url decode payload) without a library.", answer_keywords: ["atob", "JSON.parse", "payload"], seed_code: "export default function App() {\n  // Step 2\n}", feedback_correct: "✅ Step 2 done.", feedback_partial: "Decode payload.", feedback_wrong: "Decode JWT", expected: "Decode JWT payload" },
  { id: "step3", type: "question", phase: "Step 3 of 3", paal: "Wire login/logout and export.", answer_keywords: ["export", "default"], seed_code: "export default function App() {\n  // Step 3\n}", feedback_correct: "✅ Lesson #113 complete.", feedback_partial: "Export and finish.", feedback_wrong: "Export component", expected: "Complete" },
];

const sideItems = [{ label: "Lesson", id: "intro" }, { label: "Objectives", id: "objectives" }, { label: "Step 1", id: "step1" }, { label: "Step 2", id: "step2" }, { label: "Step 3", id: "step3" }];
export default createINPACTEngine({ NODES, sideItems, problemNum: 113, title: "JWT Storage & Decode in React", shortName: "JWT STORAGE & DECODE" });
