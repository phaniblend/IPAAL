import createINPACTEngine from "./inpact_engine_shared";

const NODES = [
  { id: "intro", type: "reveal", phase: "Problem", content: { tag: "PROBLEM #13", title: "Props Drilling", body: `Pass data 3 levels deep without Context. Build a small tree: App → Layer1 → Layer2 → Layer3, and pass a value (e.g. theme or user) from App down so Layer3 can display it. Explain why passing props through many layers gets painful.`, usecase: "Understanding props drilling motivates Context and state management." } },
  { id: "objectives", type: "objectives", phase: "Objectives", items: ["Create Layer1, Layer2, Layer3 components", "Pass a prop from parent to child through all three", "Render the prop in Layer3", "Add a short comment on why drilling is painful"] },
  { id: "step1", type: "question", phase: "Step 1 of 3", paal: "Create Layer1 that accepts a prop (e.g. value) and passes it to Layer2. Create Layer2 that accepts value and passes it to Layer3. Create Layer3 that accepts value and renders it.", hint: "Layer1: return <Layer2 value={value} />; Layer2: return <Layer3 value={value} />; Layer3: return <span>{value}</span>", answer_keywords: ["layer1", "layer2", "layer3", "value", "props"], seed_code: `// Step 1: Layer1 → Layer2 → Layer3, pass value down
function Layer3({ value }) { return <span>{value}</span> }
function Layer2({ value }) { return <Layer3 value={value} /> }
function Layer1({ value }) { return <Layer2 value={value} /> }
export default function App() { return <Layer1 value="hello" /> }`, feedback_correct: "✅ Props passed 3 levels deep.", feedback_partial: "Each layer must receive value and pass it to the next.", feedback_wrong: "Layer1 passes value to Layer2, Layer2 to Layer3, Layer3 displays it.", expected: "Three components, value passed via props to each, rendered in Layer3." },
  { id: "step2", type: "question", phase: "Step 2 of 3", paal: "Add a second prop (e.g. label) that only Layer3 needs. You'll have to add it to Layer1 and Layer2 even though they don't use it. That's drilling.", hint: "label passes through Layer1 and Layer2 to Layer3.", answer_keywords: ["label", "layer1", "layer2", "layer3"], seed_code: `function Layer3({ value, label }) { return <span>{label}: {value}</span> }
function Layer2({ value, label }) { return <Layer3 value={value} label={label} /> }
function Layer1({ value, label }) { return <Layer2 value={value} label={label} /> }
export default function App() { return <Layer1 value="hello" label="Message" /> }`, feedback_correct: "✅ You see how every intermediate layer must declare and forward props.", feedback_partial: "Pass label through Layer1 and Layer2 to Layer3.", feedback_wrong: "Add label prop and pass it through each layer.", expected: "label in all three, only Layer3 uses it." },
  { id: "step3", type: "question", phase: "Step 3 of 3", paal: "Add a comment above your components: why does props drilling become painful when the tree gets deep or many components need the same data?", hint: "Every middle component has to accept and forward props it doesn't use; one prop change touches many files.", answer_keywords: ["comment", "drilling", "painful", "forward", "context"], seed_code: `// Why drilling is painful: ...
function Layer3({ value, label }) { return <span>{label}: {value}</span> }
function Layer2({ value, label }) { return <Layer3 value={value} label={label} /> }
function Layer1({ value, label }) { return <Layer2 value={value} label={label} /> }
export default function App() { return <Layer1 value="hello" label="Message" /> }`, feedback_correct: "✅ Props drilling explained. Context solves this by providing values without passing through every layer.", feedback_partial: "Comment that middle components must forward props they don't use.", feedback_wrong: "Explain that drilling forces every level to know about and pass props.", expected: "Comment describing why drilling is painful." },
];

const sideItems = [{ label: "Problem", id: "intro" }, { label: "Objectives", id: "objectives" }, { label: "Step 1", id: "step1" }, { label: "Step 2", id: "step2" }, { label: "Step 3", id: "step3" }];

export default createINPACTEngine({ NODES, sideItems, problemNum: 13, title: "Props Drilling", shortName: "PROPS DRILLING" });
