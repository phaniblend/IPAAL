import createINPACTEngine from "../inpact_engine_shared";

const NODES = [
  { id: "intro", type: "reveal", phase: "Lesson", content: { tag: "LESSON #105", title: "Nested Routes & Protected Routes", body: "Layouts that persist across child routes and routes that redirect unauthenticated users. Builds on 104 and Auth Context: nested Outlet layouts, ProtectedRoute wrapper, redirect-after-login using location state.", usecase: "Auth and layouts." } },
  { id: "objectives", type: "objectives", phase: "Objectives", items: ["Use Outlet for nested layouts", "Build a ProtectedRoute wrapper", "Redirect unauthenticated users", "Use location state for redirect-after-login"] },
  { id: "step1", type: "question", phase: "Step 1 of 3", paal: "Set up a layout route with Outlet for nested children.", answer_keywords: ["Outlet", "layout", "children"], seed_code: "import { Outlet } from 'react-router-dom'\n\nexport default function App() {\n  // Step 1\n}", feedback_correct: "✅ Step 1 done.", feedback_partial: "Add Outlet.", feedback_wrong: "Set up layout", expected: "Layout with Outlet" },
  { id: "step2", type: "question", phase: "Step 2 of 3", paal: "Create a ProtectedRoute that redirects to login when not authenticated.", answer_keywords: ["Navigate", "redirect", "auth"], seed_code: "import { Outlet, Navigate } from 'react-router-dom'\n\nexport default function App() {\n  // Step 2\n}", feedback_correct: "✅ Step 2 done.", feedback_partial: "Protected route.", feedback_wrong: "Redirect logic", expected: "ProtectedRoute component" },
  { id: "step3", type: "question", phase: "Step 3 of 3", paal: "Wire routes and export.", answer_keywords: ["export", "default"], seed_code: "import { Outlet, Navigate } from 'react-router-dom'\n\nexport default function App() {\n  // Step 3\n}", feedback_correct: "✅ Lesson #105 complete.", feedback_partial: "Export and finish.", feedback_wrong: "Export component", expected: "Complete" },
];

const sideItems = [{ label: "Lesson", id: "intro" }, { label: "Objectives", id: "objectives" }, { label: "Step 1", id: "step1" }, { label: "Step 2", id: "step2" }, { label: "Step 3", id: "step3" }];
export default createINPACTEngine({ NODES, sideItems, lessonNum: 105, title: "Nested Routes & Protected Routes", shortName: "NESTED & PROTECTED ROUTES" });
