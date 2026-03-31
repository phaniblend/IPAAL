import createINPACTEngine from "../inpact_engine_shared";

const NODES = [
  { id: "intro", type: "reveal", phase: "Lesson", content: { tag: "LESSON #115", title: "Token Refresh with Axios Interceptor", body: "Silent token refresh is the trickiest part of auth in SPAs — failed requests need to queue, wait for refresh, then retry. Teaches Axios request/response interceptors, promise queuing during refresh, and the race condition that breaks naive implementations.", usecase: "Silent refresh with Axios." } },
  { id: "objectives", type: "objectives", phase: "Objectives", items: ["Use Axios request/response interceptors", "Queue requests during refresh", "Retry after new token", "Avoid refresh race"] },
  { id: "step1", type: "question", phase: "Step 1 of 3", paal: "Set up Axios instance and response interceptor that catches 401.", answer_keywords: ["axios", "interceptors", "response"], seed_code: "import axios from 'axios'\n\nexport default function App() {\n  // Step 1\n}", feedback_correct: "✅ Step 1 done.", feedback_partial: "Interceptor.", feedback_wrong: "Set up Axios", expected: "Response interceptor" },
  { id: "step2", type: "question", phase: "Step 2 of 3", paal: "On 401, call refresh endpoint once and queue other requests until refresh completes.", answer_keywords: ["refresh", "queue", "Promise"], seed_code: "import axios from 'axios'\n\nexport default function App() {\n  // Step 2\n}", feedback_correct: "✅ Step 2 done.", feedback_partial: "Queue and refresh.", feedback_wrong: "Refresh logic", expected: "Queue + single refresh" },
  { id: "step3", type: "question", phase: "Step 3 of 3", paal: "Retry original request with new token and export.", answer_keywords: ["export", "retry", "token"], seed_code: "import axios from 'axios'\n\nexport default function App() {\n  // Step 3\n}", feedback_correct: "✅ Lesson #115 complete.", feedback_partial: "Export and finish.", feedback_wrong: "Export component", expected: "Complete" },
];

const sideItems = [{ label: "Lesson", id: "intro" }, { label: "Objectives", id: "objectives" }, { label: "Step 1", id: "step1" }, { label: "Step 2", id: "step2" }, { label: "Step 3", id: "step3" }];
export default createINPACTEngine({ NODES, sideItems, lessonNum: 115, title: "Token Refresh with Axios Interceptor", shortName: "TOKEN REFRESH AXIOS" });
