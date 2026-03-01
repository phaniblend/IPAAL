import createINPACTEngine from "./inpact_engine_shared";

const NODES = [
  { id: "intro", type: "reveal", phase: "Problem", content: { tag: "PROBLEM #18", title: "PropTypes / TypeScript Interface", body: `Add TypeScript interfaces to a UserCard component. Define an interface for the props (e.g. name: string, age: number, avatar?: string) and use it to type the component. If using JS, use PropTypes instead.`, usecase: "Typed props catch bugs early and document the component API." } },
  { id: "objectives", type: "objectives", phase: "Objectives", items: ["Define an interface or PropTypes for UserCard props", "Apply the type to the component function", "Render name, age, and optional avatar"] },
  { id: "step1", type: "question", phase: "Step 1 of 3", paal: "Create a UserCard component that accepts name (string) and age (number). In TypeScript: interface UserCardProps { name: string; age: number }. In JS: add PropTypes for name and age.", hint: "TS: function UserCard({ name, age }: UserCardProps). JS: UserCard.propTypes = { name: PropTypes.string, age: PropTypes.number }", answer_keywords: ["interface", "proptypes", "name", "age", "string", "number"], seed_code: `// Step 1: define props type and UserCard
// TS: interface UserCardProps { name: string; age: number }
export default function UserCard({ name, age }) {
  return <div>{name}, {age}</div>
}`, feedback_correct: "✅ Props typed.", feedback_partial: "Add interface or PropTypes for name and age.", feedback_wrong: "UserCardProps { name: string; age: number } or PropTypes.", expected: "Interface or PropTypes with name and age." },
  { id: "step2", type: "question", phase: "Step 2 of 3", paal: "Add an optional avatar prop (string, optional). In TS use avatar?: string. In PropTypes use PropTypes.string and make it not required.", hint: "avatar?: string in interface; PropTypes.string with isRequired: false", answer_keywords: ["avatar", "optional", "string"], seed_code: `// interface UserCardProps { name: string; age: number; avatar?: string }
export default function UserCard({ name, age, avatar }) {
  // Step 2: render avatar img if provided
  return <div>{name}, {age}</div>
}`, feedback_correct: "✅ Optional avatar in types and render.", feedback_partial: "Add avatar to interface/PropTypes and conditionally render img.", feedback_wrong: "avatar?: string; {avatar && <img src={avatar} />}", expected: "Optional avatar prop and conditional img." },
  { id: "step3", type: "question", phase: "Step 3 of 3", paal: "Export UserCard. Usage: <UserCard name=\"Jane\" age={25} /> or with avatar. Types/PropTypes should match.", hint: "Ensure export default and props match the interface.", answer_keywords: ["export", "default"], seed_code: `// interface UserCardProps { name: string; age: number; avatar?: string }
export default function UserCard({ name, age, avatar }) {
  return (
    <div>
      {avatar && <img src={avatar} alt={name} />}
      <span>{name}, {age}</span>
    </div>
  )
}`, feedback_correct: "✅ UserCard with typed props complete.", feedback_partial: "Export and optional avatar.", feedback_wrong: "Export default UserCard with typed props.", expected: "Same as seed." },
];

const sideItems = [{ label: "Problem", id: "intro" }, { label: "Objectives", id: "objectives" }, { label: "Step 1", id: "step1" }, { label: "Step 2", id: "step2" }, { label: "Step 3", id: "step3" }];

export default createINPACTEngine({ NODES, sideItems, problemNum: 18, title: "PropTypes / TypeScript", shortName: "PROPTYPES / TYPESCRIPT" });
