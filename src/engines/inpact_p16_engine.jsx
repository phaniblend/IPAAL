import createINPACTEngine from "./inpact_engine_shared";

const NODES = [
  { id: "intro", type: "reveal", phase: "Problem", content: { tag: "PROBLEM #16", title: "Conditional Rendering", body: `Show different UI based on: loading, error, empty, and data states. Build a component that has a state (e.g. status: 'loading' | 'error' | 'empty' | 'data') and renders a different message or content for each.`, usecase: "Every data-driven UI needs loading, error, empty, and success states." } },
  { id: "objectives", type: "objectives", phase: "Objectives", items: ["Use state to hold status (loading / error / empty / data)", "Render different JSX for each status with if/else or ternary", "Optionally show mock data when status is 'data'"] },
  { id: "step1", type: "question", phase: "Step 1 of 3", paal: "Create a component with state: const [status, setStatus] = useState('loading'). Render a paragraph that says 'Loading...' when status === 'loading'.", hint: "if (status === 'loading') return <p>Loading...</p>; or {status === 'loading' && <p>Loading...</p>}", answer_keywords: ["usestate", "status", "loading", "return", "p"], seed_code: `import { useState } from 'react'

export default function DataView() {
  const [status, setStatus] = useState('loading')
  // Step 1: return Loading... when status === 'loading'
}`, feedback_correct: "✅ Conditional loading state.", feedback_partial: "Check status and render different content.", feedback_wrong: "if (status === 'loading') return <p>Loading...</p>", expected: "Conditional return or JSX based on status." },
  { id: "step2", type: "question", phase: "Step 2 of 3", paal: "Add branches for status === 'error' (show 'Something went wrong'), status === 'empty' (show 'No data'), and status === 'data' (show 'Data loaded' or a list).", hint: "if (status === 'error') return <p>Something went wrong</p>; else if (status === 'empty') ...", answer_keywords: ["error", "empty", "data", "condition"], seed_code: `import { useState } from 'react'

export default function DataView() {
  const [status, setStatus] = useState('loading')
  if (status === 'loading') return <p>Loading...</p>
  // Step 2: add error, empty, data branches
}`, feedback_correct: "✅ All four states handled.", feedback_partial: "Add error, empty, and data branches.", feedback_wrong: "Return different JSX for each status value.", expected: "Branches for loading, error, empty, data." },
  { id: "step3", type: "question", phase: "Step 3 of 3", paal: "Optionally add buttons to switch status so you can see each state: setStatus('loading'), setStatus('error'), etc. Export the component.", hint: "Buttons: onClick={() => setStatus('loading')} etc.", answer_keywords: ["setstatus", "button", "onclick"], seed_code: `import { useState } from 'react'

export default function DataView() {
  const [status, setStatus] = useState('loading')
  if (status === 'loading') return <p>Loading...</p>
  if (status === 'error') return <p>Something went wrong</p>
  if (status === 'empty') return <p>No data</p>
  return (
    <div>
      <p>Data loaded</p>
      {/* Step 3: optional buttons to change status */}
    </div>
  )
}`, feedback_correct: "✅ Conditional rendering with all states complete.", feedback_partial: "Add buttons to toggle status for testing.", feedback_wrong: "Buttons that call setStatus with different values.", expected: "Optional buttons to switch status." },
];

const sideItems = [{ label: "Problem", id: "intro" }, { label: "Objectives", id: "objectives" }, { label: "Step 1", id: "step1" }, { label: "Step 2", id: "step2" }, { label: "Step 3", id: "step3" }];

export default createINPACTEngine({ NODES, sideItems, problemNum: 16, title: "Conditional Rendering", shortName: "CONDITIONAL RENDERING" });
