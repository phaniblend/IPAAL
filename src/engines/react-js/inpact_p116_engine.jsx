import createINPACTEngine from "../inpact_engine_shared";

const NODES = [
  { id: "intro", type: "reveal", phase: "Lesson", content: { tag: "LESSON #116", title: "Role-Based Route Protection", body: "Extends lesson 105's ProtectedRoute to role and permission checks. Builds a RoleGuard that reads roles from auth context and renders a 403 fallback or redirects — covering role-based vs permission-based access.", usecase: "Role-based route guards." } },
  { id: "objectives", type: "objectives", phase: "Objectives", items: ["Read roles from auth context", "Create RoleGuard component", "Render 403 or redirect", "Distinguish role vs permission"] },
  { id: "step1", type: "question", phase: "Step 1 of 3", paal: "Assume an auth context with user.roles; create RoleGuard(allowedRoles).", answer_keywords: ["roles", "context", "allowedRoles"], seed_code: "import { createContext, useContext } from 'react'\n\nexport default function App() {\n  // Step 1\n}", feedback_correct: "✅ Step 1 done.", feedback_partial: "RoleGuard.", feedback_wrong: "Set up guard", expected: "RoleGuard with allowedRoles" },
  { id: "step2", type: "question", phase: "Step 2 of 3", paal: "If user has no allowed role, render 403 or Navigate to forbidden.", answer_keywords: ["Navigate", "403", "forbidden"], seed_code: "import { Navigate } from 'react-router-dom'\n\nexport default function App() {\n  // Step 2\n}", feedback_correct: "✅ Step 2 done.", feedback_partial: "403 fallback.", feedback_wrong: "Redirect logic", expected: "403 or redirect" },
  { id: "step3", type: "question", phase: "Step 3 of 3", paal: "Wrap a route with RoleGuard and export.", answer_keywords: ["export", "default"], seed_code: "export default function App() {\n  // Step 3\n}", feedback_correct: "✅ Lesson #116 complete.", feedback_partial: "Export and finish.", feedback_wrong: "Export component", expected: "Complete" },
];

const sideItems = [{ label: "Lesson", id: "intro" }, { label: "Objectives", id: "objectives" }, { label: "Step 1", id: "step1" }, { label: "Step 2", id: "step2" }, { label: "Step 3", id: "step3" }];
export default createINPACTEngine({ NODES, sideItems, lessonNum: 116, title: "Role-Based Route Protection", shortName: "ROLE-BASED ROUTE GUARD" });
