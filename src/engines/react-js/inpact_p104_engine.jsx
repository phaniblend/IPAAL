import createINPACTEngine from "../inpact_engine_shared";

const NODES = [
  { id: "intro", type: "reveal", phase: "Lesson", content: { tag: "LESSON #104", title: "React Router Basics", body: "Client-side routing with React Router v6. Teaches createBrowserRouter, route definitions, Link, NavLink, useNavigate, useParams, and useSearchParams.", usecase: "SPA routing." } },
  { id: "objectives", type: "objectives", phase: "Objectives", items: ["Define routes with createBrowserRouter", "Use Link and NavLink", "Use useNavigate, useParams, useSearchParams", "Build a small multi-route app"] },
  { id: "step1", type: "question", phase: "Step 1 of 3", paal: "Set up createBrowserRouter and RouterProvider with at least two routes.", answer_keywords: ["createBrowserRouter", "RouterProvider", "path"], seed_code: "import { createBrowserRouter, RouterProvider } from 'react-router-dom'\n\nexport default function App() {\n  // Step 1\n}", feedback_correct: "✅ Step 1 done.", feedback_partial: "Add router.", feedback_wrong: "Set up routes", expected: "Router with routes" },
  { id: "step2", type: "question", phase: "Step 2 of 3", paal: "Add Link or NavLink for navigation and a route with useParams or useSearchParams.", answer_keywords: ["Link", "NavLink", "useParams"], seed_code: "import { createBrowserRouter, RouterProvider, Link } from 'react-router-dom'\n\nexport default function App() {\n  // Step 2\n}", feedback_correct: "✅ Step 2 done.", feedback_partial: "Links and params.", feedback_wrong: "Navigation", expected: "Link + params" },
  { id: "step3", type: "question", phase: "Step 3 of 3", paal: "Wire everything and export.", answer_keywords: ["export", "default"], seed_code: "import { createBrowserRouter, RouterProvider } from 'react-router-dom'\n\nexport default function App() {\n  // Step 3\n}", feedback_correct: "✅ Lesson #104 complete.", feedback_partial: "Export and finish.", feedback_wrong: "Export component", expected: "Complete" },
];

const sideItems = [{ label: "Lesson", id: "intro" }, { label: "Objectives", id: "objectives" }, { label: "Step 1", id: "step1" }, { label: "Step 2", id: "step2" }, { label: "Step 3", id: "step3" }];
export default createINPACTEngine({ NODES, sideItems, lessonNum: 104, title: "React Router Basics", shortName: "REACT ROUTER BASICS" });
