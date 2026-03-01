import createINPACTEngine from "./inpact_engine_shared";

const NODES = [
  { id: "intro", type: "reveal", phase: "Problem", content: { tag: "PROBLEM #17", title: "List Rendering", body: `Render a list of products with proper key props. Use an array of objects (e.g. id, name, price) and map over it to render a div or li for each. Explain why keys matter (React uses them for reconciliation).`, usecase: "Lists are everywhere; keys prevent bugs and keep updates efficient." } },
  { id: "objectives", type: "objectives", phase: "Objectives", items: ["Define an array of items (e.g. products with id, name, price)", "Use .map() to render one element per item", "Add key={item.id} (or stable unique key) to the mapped element"] },
  { id: "step1", type: "question", phase: "Step 1 of 3", paal: "Create an array of products: const products = [{ id: 1, name: 'Apple', price: 1 }, { id: 2, name: 'Bread', price: 2 }]. Render a div that maps over products and returns <div key={p.id}>{p.name} - ${p.price}</div>.", hint: "products.map(p => <div key={p.id}>{p.name} - ${p.price}</div>)", answer_keywords: ["map", "key", "id", "products", "div"], seed_code: `const products = [{ id: 1, name: 'Apple', price: 1 }, { id: 2, name: 'Bread', price: 2 }]

export default function ProductList() {
  // Step 1: map products to divs with key
}`, feedback_correct: "✅ List rendered with keys.", feedback_partial: "Use .map() and add key={item.id} to the root element.", feedback_wrong: "return <div>{products.map(p => <div key={p.id}>{p.name} - {p.price}</div>)}</div>", expected: "products.map(p => <div key={p.id}>... (see hint)" },
  { id: "step2", type: "question", phase: "Step 2 of 3", paal: "Wrap the list in a parent div or ul. Use key on the direct child of the map (the outer element). Keys must be unique among siblings and stable.", hint: "key goes on the top-level element inside map: <div key={p.id}>...</div>", answer_keywords: ["key", "unique", "sibling"], seed_code: `const products = [{ id: 1, name: 'Apple', price: 1 }, { id: 2, name: 'Bread', price: 2 }]

export default function ProductList() {
  return (
    <div>
      {/* Step 2: map with key on each item */}
    </div>
  )
}`, feedback_correct: "✅ Keys on list items.", feedback_partial: "Key on the element returned from map.", feedback_wrong: "Each mapped element must have key={uniqueId}.", expected: "List with key on each item." },
  { id: "step3", type: "question", phase: "Step 3 of 3", paal: "Add a short comment: why do we use key? (React uses it to match items across re-renders so it can update instead of recreating DOM.)", hint: "Keys help React know which item changed/added/removed.", answer_keywords: ["comment", "react", "reconciliation", "key"], seed_code: `// Why key: ...
const products = [{ id: 1, name: 'Apple', price: 1 }, { id: 2, name: 'Bread', price: 2 }]

export default function ProductList() {
  return (
    <div>
      {products.map(p => <div key={p.id}>{p.name} - {p.price}</div>)}
    </div>
  )
}`, feedback_correct: "✅ List rendering with keys complete. Keys enable efficient updates.", feedback_partial: "Comment that keys help React track list items.", feedback_wrong: "Keys help React reconcile the list.", expected: "Comment explaining key purpose." },
];

const sideItems = [{ label: "Problem", id: "intro" }, { label: "Objectives", id: "objectives" }, { label: "Step 1", id: "step1" }, { label: "Step 2", id: "step2" }, { label: "Step 3", id: "step3" }];

export default createINPACTEngine({ NODES, sideItems, problemNum: 17, title: "List Rendering", shortName: "LIST RENDERING" });
