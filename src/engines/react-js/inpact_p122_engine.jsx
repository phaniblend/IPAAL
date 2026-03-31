import createINPACTEngine from "../inpact_engine_shared";

const NODES = [
  { id: "intro", type: "reveal", phase: "Lesson", content: { tag: "LESSON #122", title: "Secure Token Rotation", body: "Sliding session: keep users logged in without long-lived access tokens. Teaches access token in memory + refresh token in httpOnly cookie, automatic rotation on each request, revocation on logout, and handling concurrent refresh attempts safely.", usecase: "Token rotation and revocation." } },
  { id: "objectives", type: "objectives", phase: "Objectives", items: ["Store access in memory, refresh in cookie", "Rotate on request (or interval)", "Revoke on logout", "Serialize concurrent refresh"] },
  { id: "step1", type: "question", phase: "Step 1 of 3", paal: "Set up auth layer: access token in memory, refresh via cookie (credentials: 'include').", answer_keywords: ["credentials", "include", "memory"], seed_code: "export default function App() {\n  // Step 1\n}", feedback_correct: "✅ Step 1 done.", feedback_partial: "Token storage.", feedback_wrong: "Set up tokens", expected: "Access in memory, refresh cookie" },
  { id: "step2", type: "question", phase: "Step 2 of 3", paal: "Before each API call (or in interceptor), if token expired or about to expire, call refresh once and queue other requests.", answer_keywords: ["refresh", "queue", "interceptor"], seed_code: "export default function App() {\n  // Step 2\n}", feedback_correct: "✅ Step 2 done.", feedback_partial: "Rotation logic.", feedback_wrong: "Refresh on request", expected: "Rotate on request" },
  { id: "step3", type: "question", phase: "Step 3 of 3", paal: "On logout call revocation endpoint and clear in-memory token; export.", answer_keywords: ["export", "revoke", "logout"], seed_code: "export default function App() {\n  // Step 3\n}", feedback_correct: "✅ Lesson #122 complete.", feedback_partial: "Export and finish.", feedback_wrong: "Export component", expected: "Complete" },
];

const sideItems = [{ label: "Lesson", id: "intro" }, { label: "Objectives", id: "objectives" }, { label: "Step 1", id: "step1" }, { label: "Step 2", id: "step2" }, { label: "Step 3", id: "step3" }];
export default createINPACTEngine({ NODES, sideItems, lessonNum: 122, title: "Secure Token Rotation", shortName: "SECURE TOKEN ROTATION" });
