import createINPACTEngine from "../inpact_engine_shared";

const NODES = [
  { id: "intro", type: "reveal", phase: "Lesson", content: { tag: "LESSON #117", title: "Cookie-Based Auth Flow", body: "httpOnly cookies are the most secure way to store session tokens but React cannot read the token. Teaches how httpOnly cookies work, credentials in fetch, CSRF tokens via headers, and reading user identity from a /me endpoint.", usecase: "httpOnly cookie auth." } },
  { id: "objectives", type: "objectives", phase: "Objectives", items: ["Use credentials: 'include' in fetch", "Attach CSRF token header", "Get user from /me endpoint", "No client-side token storage"] },
  { id: "step1", type: "question", phase: "Step 1 of 3", paal: "Call login API with credentials: 'include' and store CSRF token for subsequent requests.", answer_keywords: ["credentials", "include", "csrf"], seed_code: "export default function App() {\n  // Step 1\n}", feedback_correct: "✅ Step 1 done.", feedback_partial: "Credentials + CSRF.", feedback_wrong: "Set up fetch", expected: "Fetch with credentials" },
  { id: "step2", type: "question", phase: "Step 2 of 3", paal: "Fetch /me with credentials and CSRF header to get current user.", answer_keywords: ["/me", "fetch", "header"], seed_code: "export default function App() {\n  // Step 2\n}", feedback_correct: "✅ Step 2 done.", feedback_partial: "/me request.", feedback_wrong: "User from /me", expected: "Get user from /me" },
  { id: "step3", type: "question", phase: "Step 3 of 3", paal: "Wire login state and export.", answer_keywords: ["export", "default"], seed_code: "export default function App() {\n  // Step 3\n}", feedback_correct: "✅ Lesson #117 complete.", feedback_partial: "Export and finish.", feedback_wrong: "Export component", expected: "Complete" },
];

const sideItems = [{ label: "Lesson", id: "intro" }, { label: "Objectives", id: "objectives" }, { label: "Step 1", id: "step1" }, { label: "Step 2", id: "step2" }, { label: "Step 3", id: "step3" }];
export default createINPACTEngine({ NODES, sideItems, lessonNum: 117, title: "Cookie-Based Auth Flow", shortName: "COOKIE-BASED AUTH" });
