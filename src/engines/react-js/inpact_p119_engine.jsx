import createINPACTEngine from "../inpact_engine_shared";

const NODES = [
  { id: "intro", type: "reveal", phase: "Lesson", content: { tag: "LESSON #119", title: "OAuth2 PKCE Flow in a SPA", body: "PKCE is the correct OAuth2 flow for SPAs — no client secret, no implicit flow. Teaches code verifier/challenge generation, redirect-to-provider pattern, authorization code exchange, and handling the callback route in React Router.", usecase: "OAuth2 PKCE in React." } },
  { id: "objectives", type: "objectives", phase: "Objectives", items: ["Generate code_verifier and code_challenge", "Redirect to provider with challenge", "Exchange code for tokens on callback", "Handle callback route"] },
  { id: "step1", type: "question", phase: "Step 1 of 3", paal: "Generate code_verifier (random) and code_challenge (SHA256 base64url).", answer_keywords: ["crypto", "subtle", "encode"], seed_code: "export default function App() {\n  // Step 1\n}", feedback_correct: "✅ Step 1 done.", feedback_partial: "PKCE helper.", feedback_wrong: "Set up PKCE", expected: "Verifier and challenge" },
  { id: "step2", type: "question", phase: "Step 2 of 3", paal: "Redirect user to provider with code_challenge and state; store verifier in sessionStorage.", answer_keywords: ["redirect", "sessionStorage", "state"], seed_code: "export default function App() {\n  // Step 2\n}", feedback_correct: "✅ Step 2 done.", feedback_partial: "Redirect to provider.", feedback_wrong: "Auth URL", expected: "Redirect with PKCE params" },
  { id: "step3", type: "question", phase: "Step 3 of 3", paal: "Handle callback route: exchange code for tokens, clear sessionStorage, redirect; export.", answer_keywords: ["exchange", "callback", "export"], seed_code: "export default function App() {\n  // Step 3\n}", feedback_correct: "✅ Lesson #119 complete.", feedback_partial: "Export and finish.", feedback_wrong: "Export component", expected: "Complete" },
];

const sideItems = [{ label: "Lesson", id: "intro" }, { label: "Objectives", id: "objectives" }, { label: "Step 1", id: "step1" }, { label: "Step 2", id: "step2" }, { label: "Step 3", id: "step3" }];
export default createINPACTEngine({ NODES, sideItems, lessonNum: 119, title: "OAuth2 PKCE Flow in a SPA", shortName: "OAUTH2 PKCE SPA" });
