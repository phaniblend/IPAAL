import createINPACTEngine from "../inpact_engine_shared";

const NODES = [
  { id: "intro", type: "reveal", phase: "Lesson", content: { tag: "LESSON #2 (TypeScript)", title: "Toggle Visibility — Typed", body: "Show/hide a paragraph on button click. Use useState<boolean> for the visible state and type the setter.", usecase: "Boolean state is common; typing it prevents mixing with other types." } },
  { id: "objectives", type: "objectives", phase: "Objectives", items: ["Model a boolean state variable using useState<boolean> so state, refs, or values keep a predictable shape as the feature evolves, and data shape and updates remain explicit throughout the lesson.","Type a toggle handler as () => void and bind it to an onClick prop so invalid interactions are rejected by the compiler instead of leaking into runtime.","Use a boolean state variable to conditionally return JSX via a ternary expression so the pattern drives visible behavior, and the rendered branch clearly follows the current state.","Establish a VisibilityProps interface and apply it to React.FC<VisibilityProps> so the contract is explicit and incorrect usage is caught early."] },
  { id: "step1", type: "question", phase: "Step 1 of 3", paal: "Declare state: const [visible, setVisible] = useState<boolean>(true).", hint: "useState<boolean>(true)", answer_keywords: ["usestate", "boolean", "visible", "setvisible"], seed_code: `import { useState } from 'react'

export default function ToggleVisibility() {
  // Step 1: useState<boolean>
}`, feedback_correct: "✅ Boolean state typed.", feedback_partial: "useState<boolean>(true or false).", feedback_wrong: "const [visible, setVisible] = useState<boolean>(true)", expected: "useState<boolean>" },
  { id: "step2", type: "question", phase: "Step 2 of 3", paal: "Add a toggle handler and a button. Button onClick should call setVisible(prev => !prev).", hint: "const toggle = () => setVisible(prev => !prev)", answer_keywords: ["toggle", "setvisible", "onclick", "button"], seed_code: `import { useState } from 'react'

export default function ToggleVisibility() {
  const [visible, setVisible] = useState<boolean>(true)
  // Step 2: toggle and button
}`, feedback_correct: "✅ Toggle wired.", feedback_partial: "Button that flips visible.", feedback_wrong: "onClick={() => setVisible(prev => !prev)}", expected: "toggle handler and button" },
  { id: "step3", type: "question", phase: "Step 3 of 3", paal: "Render a paragraph only when visible is true. Use {visible && <p>...</p>}. Export the component.", hint: "{visible && <p>You can see this.</p>}", answer_keywords: ["visible", "&&", "return", "<p>"], seed_code: `import { useState } from 'react'

export default function ToggleVisibility() {
  const [visible, setVisible] = useState<boolean>(true)
  return (
    <div>
      <button onClick={() => setVisible(prev => !prev)}>Toggle</button>
      {visible && <p>You can see this.</p>}
    </div>
  )
}`, feedback_correct: "✅ Toggle Visibility with TypeScript complete.", feedback_partial: "Conditional render and export.", feedback_wrong: "visible && <p>...</p>", expected: `Wrap button and paragraph in one element (e.g. <div>). Use {visible && <p>...</p>} for the conditional paragraph. Export the component. Example:
  return (
    <div>
      <button onClick={...}>Toggle</button>
      {visible && <p>You can see this.</p>}
    </div>
  )` },
];

const sideItems = [{ label: "Lesson", id: "intro" }, { label: "Objectives", id: "objectives" }, { label: "Step 1", id: "step1" }, { label: "Step 2", id: "step2" }, { label: "Step 3", id: "step3" }];

export default createINPACTEngine({ NODES, sideItems, problemNum: 2, title: "Toggle Visibility (TypeScript)", shortName: "TS — TOGGLE" });
