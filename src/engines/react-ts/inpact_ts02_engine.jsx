import createINPACTEngine from "../inpact_engine_shared";

const NODES = [
{
  id: "intro",
  type: "reveal",
  phase: "Lesson",
  content: {
    tag: "LESSON #2 (TypeScript)",
    title: "TypeScript — Interfaces + Types",
    body: "Go beyond basic props — learn how to model real API data with nested interfaces, extend shared base types, and combine domain shapes with intersections. You'll build the TypeScript foundation that every data-heavy component in a real enterprise app depends on.",
    usecase:
      "Every piece of data that flows through a real enterprise app arrives as a nested object from an API. Without the right type shapes, a single field rename on the backend silently breaks the entire UI. This lesson gives you the tools to catch that at the editor, not in production.",
  },
},
{
  id: "prereqs",
  type: "prereqs",
  phase: "Prerequisites",
  items: [
    {
      lesson: 1,
      label: "JSX — The Full Language",
      reason: "This lesson ends by building ShipmentRecordCard — a component that destructures a typed props shape and renders nested values like {origin.city} in JSX. You need to know the component shell (arrow function + JSX.Element return type), curly brace expressions, and how props flow into a component from Lesson 1 before you can put the interfaces you define here to use.",
    },
  ],
},
{
  id: "objectives",
  type: "objectives",
  phase: "Objectives",
  items: [
    "Define a base interface with readonly fields to represent shared API record properties",
    "Model nested data structures using interfaces as field types",
    "Extend a base interface to build domain-specific types without repeating shared fields",
    "Combine two separate interfaces into one shape using a type intersection",
    "Destructure nested props in a component signature and render nested values in JSX",
  ],
},
{
  id: "step1",
  type: "question",
  phase: "Step 1 of 5",
  paal: "Define a BaseRecord interface with three readonly fields that every API response includes: id, createdAt, and updatedAt — all strings.",
  hint: "readonly means TypeScript will reject any attempt to reassign the field after it's set.",
  example_code: `interface BaseEntity {
  readonly uuid: string;
  readonly timestamp: string;
}`,
  think_prompt:
    "In a TypeScript interface, what keyword do you place before each field name (like id, createdAt, updatedAt) so those fields cannot be reassigned after the API data is loaded?",
  mc_options: [
    "interface BaseRecord { id: string; createdAt: string; updatedAt: string }",
    "interface BaseRecord { readonly id: string; readonly createdAt: string; readonly updatedAt: string }",
    "type BaseRecord = { const id: string; const createdAt: string; const updatedAt: string }",
  ],
  mc_correct_option:
    "interface BaseRecord { readonly id: string; readonly createdAt: string; readonly updatedAt: string }",
  mc_anchor:
    "readonly on an interface field is a compile-time contract — TypeScript rejects any code that tries to reassign it. The data arrives from the API and stays frozen. const works for variables, not interface fields — readonly is the interface equivalent.",
  why_this_matters:
    "In a real enterprise app, id, createdAt, and updatedAt come from the database. No client-side code should ever overwrite them — doing so would corrupt audit trails and break data integrity. readonly makes that rule enforceable by TypeScript rather than by team convention alone.",
  answer_keywords: [
    "interface", "BaseRecord", "readonly", "id", "createdAt", "updatedAt", "string",
  ],
  seed_code: "",
  starter_code: "// define BaseRecord interface here",
  feedback_correct:
    "Exactly — three readonly string fields. TypeScript will now reject any code that tries to reassign id, createdAt, or updatedAt after the record arrives from the API.",
  feedback_partial:
    "Close — check that all three fields have the readonly modifier. Missing it on even one field leaves a gap in the contract.",
  feedback_wrong:
    "The pattern is: `interface BaseRecord { readonly id: string; readonly createdAt: string; readonly updatedAt: string }` — readonly before each field name, not const.",
  expected: `interface BaseRecord {
  readonly id: string;
  readonly createdAt: string;
  readonly updatedAt: string;
}`,
  analog_example: `interface AuditLog {
  readonly entryId: string;
  readonly recordedAt: string;
}`,
  deepDiveLabel:
    "readonly stops reassignment — but does it actually protect nested objects too?",
  deepDive: {
    hook: "You mark `id` as readonly on your BaseRecord. You feel safe — nobody can touch the ID. Three weeks later a teammate writes a data normalisation function. They don't reassign `id` — they reassign the entire record object reference. TypeScript says nothing. The readonly was on the field, not the object itself.\n\nThen a different teammate has a nested `address` object inside a record. They mark the field readonly. They think the city inside address is protected too. It isn't. They mutate `record.address.city` directly. TypeScript still says nothing.\n\nreadonly is shallower than it looks — and knowing exactly where it stops is the difference between a real contract and a false sense of security.",
    pain: "⚠️ **Lesson:** You define `readonly id: string` on BaseRecord. A function receives a `BaseRecord` and tries `record.id = 'new-id'`. TypeScript errors — good. But then it tries `record.createdAt = record.updatedAt` — does that error too? (Hint: yes — but why does readonly protect assignment from *any* source, not just external ones?)",
    mentalModel:
      "**Mental model:** Think of `readonly` as a **one-way turnstile on a specific field**.\n- The turnstile lets data in once — when the object is first created.\n- After that, the turnstile locks. Any code that tries to push data back through — reassign the field — hits the lock at compile time.\n- But the turnstile only guards *that exact field*. If the field holds an object, the turnstile guards the reference — not the contents of that object. `record.origin = newOrigin` is blocked. `record.origin.city = 'Berlin'` is not — that's a different turnstile that doesn't exist yet.\n- This is called *shallow readonly*. Deep readonly requires a utility type — but that's a later lesson. For now: readonly on primitives like string and number is a complete guarantee. readonly on object fields is only a partial one.",
    discover:
      "**Pattern — readonly fields:**\n```tsx\n// ✅ readonly on primitive fields — complete guarantee\ninterface BaseRecord {\n  readonly id: string;\n  readonly createdAt: string;\n  readonly updatedAt: string;\n}\n\n// ✅ TypeScript rejects this\nconst record: BaseRecord = { id: 'NX-1', createdAt: '...', updatedAt: '...' };\nrecord.id = 'NX-2'; // ❌ Cannot assign to 'id' because it is a read-only property\n\n// ⚠️ readonly on object field — only guards the reference, not the contents\ninterface Shipment {\n  readonly origin: { city: string };\n}\nshipment.origin = { city: 'Berlin' }; // ❌ blocked\nshipment.origin.city = 'Berlin';      // ✅ TypeScript allows this — shallow readonly\n```\n- readonly on string/number/boolean = complete protection\n- readonly on object fields = reference is locked, contents are not\n- const on variables = same idea, different context — const is for variable bindings, readonly is for interface fields",
    quickRules:
      "**Quick rules:**\n- ✅ `readonly id: string` — field is set once, never reassigned\n- ✅ use readonly on any field that comes from the API and must not change\n- ❌ `const id: string` inside an interface — const is not valid inside interfaces, readonly is\n- ❌ assuming readonly protects nested object contents — it only locks the reference\n- readonly is a compile-time check only — it has zero effect at runtime in JavaScript",
    watchOut:
      "👀 **Watch out:** readonly disappears at runtime. TypeScript compiles it away — the JavaScript output has no trace of it. If you're mutating records server-side or in a test environment that bypasses TypeScript, readonly offers no protection. It's a development-time guardrail, not a runtime lock.",
    dryRun:
      "🔁 **Think:** You have `interface BaseRecord { readonly id: string; readonly createdAt: string; readonly updatedAt: string }`. A function receives a `BaseRecord` and does `record.createdAt = record.updatedAt` — trying to sync the two timestamps. Does TypeScript error? Now the same function does `const copy = { ...record, createdAt: record.updatedAt }` — creating a new object instead. Does that error? (Hint: readonly guards assignment to the original field — spread creates a brand new object with no readonly constraint.)",
    build:
      "**Learning focus:** Define readonly fields on an interface to express that certain data — like API-sourced IDs and timestamps — must never be reassigned after arrival, making that constraint enforceable by TypeScript at the editor rather than by team convention.",
  },
},
{
  id: "step2",
  type: "question",
  phase: "Step 2 of 5",
  paal: "Define a Location interface with two fields — city and country — both strings. This will represent the nested origin and destination objects on a shipment.",
  hint: "A nested object in an API response is just another interface. Define it separately so it can be reused.",
  example_code: `interface Coordinates {
  latitude: number;
  longitude: number;
}`,
  think_prompt:
    "A shipment has both an origin and a destination — each with a city and a country. Instead of repeating those two fields twice, how do you define the shape once and reference it in multiple places?",
  mc_options: [
    "Add originCity, originCountry, destinationCity, destinationCountry as flat string fields",
    "Define a Location interface with city and country, then use it as a field type",
    "Use a tuple type: [string, string] for each location",
  ],
  mc_correct_option:
    "Define a Location interface with city and country, then use it as a field type",
  mc_anchor:
    "A separate interface for Location means the shape is defined once and reused wherever a location appears — origin, destination, or any future field. Flat fields scale poorly and tuple types lose the field names entirely.",
  why_this_matters:
    "Real API responses are never flat. An address, a location, a price breakdown — these are always nested objects. Defining a dedicated interface for each nested shape means you describe it once and TypeScript enforces it everywhere it's used. Adding a new location field later means updating one interface, not hunting down every flat field across the codebase.",
  answer_keywords: ["interface", "Location", "city", "country", "string"],
  seed_code: `interface BaseRecord {
  readonly id: string;
  readonly createdAt: string;
  readonly updatedAt: string;
}`,
  starter_code: `interface BaseRecord {
  readonly id: string;
  readonly createdAt: string;
  readonly updatedAt: string;
}

// define Location interface here`,
  feedback_correct:
    "Exactly — a clean two-field interface. Now both origin and destination can reference this same shape instead of repeating city and country fields everywhere.",
  feedback_partial:
    "Close — make sure you have both city and country as string fields inside the interface.",
  feedback_wrong:
    "The pattern is: `interface Location { city: string; country: string }` — a standalone interface that describes the shape of a location object.",
  expected: `interface BaseRecord {
  readonly id: string;
  readonly createdAt: string;
  readonly updatedAt: string;
}

interface Location {
  city: string;
  country: string;
}`,
  analog_example: `interface Currency {
  code: string;
  symbol: string;
}`,
  deepDiveLabel:
    "Flat fields are simpler to write — so when does nesting actually pay off?",
  deepDive: {
    hook: "You're building a shipment form in an enterprise app. The designer hands you a spec: origin city, origin country, destination city, destination country — four fields. You add them flat to your interface: `originCity`, `originCountry`, `destinationCity`, `destinationCountry`. Simple.\n\nSix weeks later the spec changes. Every location now also needs a postal code. You open your codebase. The flat fields are scattered across eight interfaces, twelve components, and three API utility files. You update them one by one. You miss two. TypeScript doesn't catch them because the field is new — there's nothing to break yet. The postal code silently never renders in two components.\n\nIf the shape had been a `Location` interface from day one, you'd have added `postalCode: string` in one place and TypeScript would have enforced it everywhere automatically.",
    pain: "⚠️ **Lesson:** You define `originCity: string` and `destinationCity: string` as flat fields. They work fine. Six months later the API starts returning `origin: { city, country, postalCode }` instead. How many files do you need to touch — and how does a nested interface make that change a one-liner?",
    mentalModel:
      "**Mental model:** Think of a nested interface as a **reusable stamp**.\n- A flat approach cuts the shape by hand every time — `originCity`, `originCountry`, `destinationCity`, `destinationCountry`. Four cuts. Every new location concept means more cuts in more places.\n- A `Location` interface is a stamp. You press it once for `origin`, once for `destination`, once for `nextStop`. The shape is identical everywhere because it comes from the same stamp.\n- When the stamp changes — a new field added — every impression updates automatically. TypeScript walks every place the stamp was used and checks the new shape is satisfied. One change, full enforcement.",
    discover:
      "**Pattern — nested interface:**\n```tsx\n// ✅ define the nested shape once\ninterface Location {\n  city: string;\n  country: string;\n}\n\n// ✅ reference it as a field type — used twice, defined once\ninterface ShipmentRecord {\n  origin: Location;\n  destination: Location;\n}\n\n// ❌ flat fields — duplicated, hard to extend, easy to miss\ninterface ShipmentRecord {\n  originCity: string;\n  originCountry: string;\n  destinationCity: string;\n  destinationCountry: string;\n}\n```\n- interfaces can be used anywhere a type is expected — including as field types inside other interfaces\n- nesting mirrors the actual shape of the API response — no translation needed\n- one interface change propagates enforcement everywhere it's used",
    quickRules:
      "**Quick rules:**\n- ✅ define a separate interface for any object that appears in more than one place\n- ✅ nested interfaces mirror real API shapes — easier to map incoming data\n- ❌ flat fields for nested data — they scale poorly and scatter changes across the codebase\n- ❌ `[string, string]` tuple — loses field names, makes destructuring unreadable\n- if you find yourself writing `xCity` and `xCountry` as separate fields, that's a signal to extract an interface",
    watchOut:
      "👀 **Watch out:** Naming a custom interface `Location` conflicts with the browser's built-in `window.Location` type in some TypeScript configurations. If you see unexpected type errors, prefix it: `ShipmentLocation` or `GeoLocation`. In a real codebase, domain-prefixed names are safer.",
    dryRun:
      "🔁 **Think:** You have `interface Location { city: string; country: string }` and `interface ShipmentRecord { origin: Location; destination: Location }`. The API starts returning a `postalCode` field inside each location object. You add `postalCode: string` to the Location interface. How many other files does TypeScript now check — and what exactly does it flag as incomplete? (Hint: every variable, prop, and function parameter typed as `Location` now needs to satisfy the new shape.)",
    build:
      "**Learning focus:** Define a dedicated interface for any nested object shape — so the structure is described once, reused everywhere it appears, and any change to the shape propagates enforcement automatically across the entire codebase.",
  },
},
{
  id: "step3",
  type: "question",
  phase: "Step 3 of 5",
  paal: "Define a ShipmentRecord interface that extends BaseRecord and adds three fields: origin and destination as Location types, and status as a union of 'active', 'delayed', or 'delivered'.",
  hint: "extends copies all fields from the parent interface into the child. You don't redeclare them — you only add what's new.",
  example_code: `interface AdminUser extends BaseUser {
  permissions: string[];
  department: string;
}`,
  think_prompt:
    "ShipmentRecord needs id, createdAt, and updatedAt from BaseRecord — plus its own fields. How do you get the shared fields without copying them manually into a new interface?",
  mc_options: [
    "interface ShipmentRecord { id: string; createdAt: string; updatedAt: string; origin: Location; destination: Location; status: string }",
    "interface ShipmentRecord extends BaseRecord { origin: Location; destination: Location; status: 'active' | 'delayed' | 'delivered' }",
    "type ShipmentRecord = BaseRecord & { origin: Location; destination: Location; status: string }",
  ],
  mc_correct_option:
    "interface ShipmentRecord extends BaseRecord { origin: Location; destination: Location; status: 'active' | 'delayed' | 'delivered' }",
  mc_anchor:
    "extends pulls all BaseRecord fields in automatically — id, createdAt, updatedAt are inherited without being redeclared. The union on status locks it to exactly three valid values. The type intersection option works but loses the readonly guarantee inherited from BaseRecord.",
  why_this_matters:
    "In a real enterprise app every domain type — orders, invoices, users — shares the same base fields from the database. extends means you define those fields once in BaseRecord and every domain type inherits them automatically. When the base shape changes, every child interface updates in one place.",
  answer_keywords: [
    "interface", "ShipmentRecord", "extends", "BaseRecord",
    "origin", "Location", "destination", "status", "active", "delayed", "delivered",
  ],
  seed_code: `interface BaseRecord {
  readonly id: string;
  readonly createdAt: string;
  readonly updatedAt: string;
}

interface Location {
  city: string;
  country: string;
}`,
  starter_code: `interface BaseRecord {
  readonly id: string;
  readonly createdAt: string;
  readonly updatedAt: string;
}

interface Location {
  city: string;
  country: string;
}

// define ShipmentRecord extending BaseRecord here`,
  feedback_correct:
    "Exactly — extends inherits all BaseRecord fields including their readonly modifiers, and ShipmentRecord only declares what's new. The status union locks the field to three valid values.",
  feedback_partial:
    "Close — check two things: are you using extends BaseRecord rather than repeating the base fields, and is status a union type rather than a plain string?",
  feedback_wrong:
    "The pattern is: `interface ShipmentRecord extends BaseRecord { origin: Location; destination: Location; status: 'active' | 'delayed' | 'delivered' }` — extends pulls in the base fields, then you declare only the new ones.",
  expected: `interface BaseRecord {
  readonly id: string;
  readonly createdAt: string;
  readonly updatedAt: string;
}

interface Location {
  city: string;
  country: string;
}

interface ShipmentRecord extends BaseRecord {
  origin: Location;
  destination: Location;
  status: 'active' | 'delayed' | 'delivered';
}`,
  analog_example: `interface PremiumOrder extends BaseOrder {
  discountCode: string;
  expressDelivery: boolean;
}`,
  deepDiveLabel:
    "extends and type intersection both combine interfaces — so what does extends give you that & doesn't?",
  deepDive: {
    hook: "You need a type that combines BaseRecord and some shipment-specific fields. A colleague shows you two ways to do it:\n\n```tsx\n// option A\ninterface ShipmentRecord extends BaseRecord {\n  origin: Location;\n}\n\n// option B  \ntype ShipmentRecord = BaseRecord & { origin: Location };\n```\n\nBoth compile. Both give you the same fields. You pick option B because it feels more concise. Six months later you need to extend ShipmentRecord itself — add a PriorityShipment that builds on it. You write `interface PriorityShipment extends ShipmentRecord` and TypeScript errors. You can't extend a type alias that contains an intersection the same way you extend an interface. You refactor back to option A. Two hours lost.",
    pain: "⚠️ **Lesson:** You use `type ShipmentRecord = BaseRecord & { origin: Location }` instead of extends. It works perfectly — until a teammate tries to extend ShipmentRecord with another interface. What breaks, and why does the choice between extends and & matter more than it first appears?",
    mentalModel:
      "**Mental model:** Think of `extends` as **official inheritance** and `&` as **duct-taping two shapes together**.\n- `extends` creates a formal parent-child relationship. TypeScript understands the hierarchy — error messages are cleaner, the interface is extendable by others, and readonly modifiers flow down cleanly.\n- `&` (intersection) merges two shapes into one type alias. The result has all the fields, but TypeScript treats it as a flat merged type — not a hierarchy. Some editors show worse autocomplete. Other interfaces can't formally extend it.\n- For domain types that other types will build on — use `extends`. For one-off combinations where you just need the fields merged — `&` is fine.\n- The rule of thumb: if something else might ever extend this type, use `interface` and `extends`.",
    discover:
      "**Pattern — extends vs intersection:**\n```tsx\n// ✅ extends — formal inheritance, extendable, readonly flows down\ninterface ShipmentRecord extends BaseRecord {\n  origin: Location;\n  destination: Location;\n  status: 'active' | 'delayed' | 'delivered';\n}\n\n// ✅ another interface can build on it\ninterface PriorityShipment extends ShipmentRecord {\n  priority: 'urgent' | 'standard';\n}\n\n// ⚠️ intersection — works for combining, but less extensible\ntype ShipmentRecord = BaseRecord & {\n  origin: Location;\n  destination: Location;\n};\n\n// ❌ this causes issues — can't cleanly extend a type alias intersection\ninterface PriorityShipment extends ShipmentRecord { ... }\n```\n- extends = hierarchy, readonly inheritance, clean error messages\n- & = flat merge, good for one-off combinations\n- when in doubt: if others will extend it, use interface + extends",
    quickRules:
      "**Quick rules:**\n- ✅ `interface Child extends Parent` — formal inheritance, readonly modifiers carry through\n- ✅ use extends for domain types that other interfaces will build on\n- ⚠️ `type Combined = A & B` — works for merging, but harder to extend later\n- ❌ repeating parent fields manually in the child — defeats the purpose, creates drift\n- an interface can extend multiple parents: `interface C extends A, B { }` — valid in TypeScript",
    watchOut:
      "👀 **Watch out:** When you extend an interface, you inherit readonly modifiers automatically — but you can't *remove* them in the child. If BaseRecord has `readonly id`, ShipmentRecord cannot redeclare `id` as mutable. The readonly flows down and stays. Design your base interfaces carefully — readonly decisions made at the top propagate everywhere.",
    dryRun:
      "🔁 **Think:** You have `interface ShipmentRecord extends BaseRecord`. A teammate writes `interface UrgentShipment extends ShipmentRecord { eta: string }`. UrgentShipment now has how many fields in total — and which ones are readonly? (Hint: trace the chain: BaseRecord → ShipmentRecord → UrgentShipment, and remember readonly flows down through every extends.)",
    build:
      "**Learning focus:** Use extends to build domain-specific interfaces on top of a shared base — inheriting all base fields including their readonly modifiers, and only declaring what's new in the child.",
  },
},
{
  id: "step4",
  type: "question",
  phase: "Step 4 of 5",
  paal: "Define a DriverSummary interface with two fields — driverName and vehicleId, both strings. Then create a ShipmentWithDriver type that combines ShipmentRecord and DriverSummary using a type intersection.",
  hint: "An intersection uses the & operator between two types. The result has all fields from both.",
  example_code: `interface ContactInfo {
  email: string;
  phone: string;
}

type UserWithContact = BaseUser & ContactInfo;`,
  think_prompt:
    "A shipment record and a driver summary are two separate domain shapes. Sometimes the API returns them joined together. How do you express a type that has all the fields of both — without redefining either?",
  mc_options: [
    "interface ShipmentWithDriver extends ShipmentRecord { driverName: string; vehicleId: string }",
    "type ShipmentWithDriver = ShipmentRecord & DriverSummary",
    "interface ShipmentWithDriver { shipment: ShipmentRecord; driver: DriverSummary }",
  ],
  mc_correct_option: "type ShipmentWithDriver = ShipmentRecord & DriverSummary",
  mc_anchor:
    "A type intersection flattens both shapes into one — every field from ShipmentRecord and every field from DriverSummary lives at the top level of ShipmentWithDriver. The third option nests them as sub-objects instead of merging — that's a different shape entirely.",
  why_this_matters:
    "Real APIs often return joined data — a shipment with its assigned driver, an order with its customer details. A type intersection lets you express that combined shape without rewriting either source type. Both stay independent and reusable, and the intersection is the join.",
  answer_keywords: [
    "interface", "DriverSummary", "driverName", "vehicleId", "string",
    "type", "ShipmentWithDriver", "&", "ShipmentRecord",
  ],
  seed_code: `interface BaseRecord {
  readonly id: string;
  readonly createdAt: string;
  readonly updatedAt: string;
}

interface Location {
  city: string;
  country: string;
}

interface ShipmentRecord extends BaseRecord {
  origin: Location;
  destination: Location;
  status: 'active' | 'delayed' | 'delivered';
}`,
  starter_code: `interface BaseRecord {
  readonly id: string;
  readonly createdAt: string;
  readonly updatedAt: string;
}

interface Location {
  city: string;
  country: string;
}

interface ShipmentRecord extends BaseRecord {
  origin: Location;
  destination: Location;
  status: 'active' | 'delayed' | 'delivered';
}

// define DriverSummary interface here
// define ShipmentWithDriver intersection type here`,
  feedback_correct:
    "Exactly — DriverSummary stays independent, ShipmentRecord stays independent, and ShipmentWithDriver is the intersection that joins them. All fields from both live at the top level of the combined type.",
  feedback_partial:
    "Close — check two things: is DriverSummary defined as its own interface, and is ShipmentWithDriver a type alias using & rather than an interface using extends?",
  feedback_wrong:
    "Define `interface DriverSummary { driverName: string; vehicleId: string }` first, then `type ShipmentWithDriver = ShipmentRecord & DriverSummary` — the & operator merges both shapes into one flat type.",
  expected: `interface BaseRecord {
  readonly id: string;
  readonly createdAt: string;
  readonly updatedAt: string;
}

interface Location {
  city: string;
  country: string;
}

interface ShipmentRecord extends BaseRecord {
  origin: Location;
  destination: Location;
  status: 'active' | 'delayed' | 'delivered';
}

interface DriverSummary {
  driverName: string;
  vehicleId: string;
}

type ShipmentWithDriver = ShipmentRecord & DriverSummary;`,
  analog_example: `interface ProductDetails {
  name: string;
  sku: string;
}

type OrderLineItem = BaseOrder & ProductDetails;`,
  deepDiveLabel:
    "The intersection flattens both shapes — but what happens when both sides have a field with the same name?",
  deepDive: {
    hook: "You create a type intersection between two interfaces. Both interfaces happen to have a field called `status` — one typed as `string`, the other as `'active' | 'delayed'`. You expect one to win. Neither does. TypeScript intersects the types too — the resulting `status` field becomes `string & ('active' | 'delayed')`, which simplifies to `'active' | 'delayed'`. The narrower type wins by default.\n\nNow a trickier case: both sides have `id` typed as `string`. The intersection gives you `string & string` — which is just `string`. Fine. But one side has `id: string` and the other has `id: number`. The intersection gives you `string & number` — which is `never`. A field typed as `never` can never be assigned any value. TypeScript won't error when you define the type — it errors when you try to use it. Silent at definition, loud at usage.",
    pain: "⚠️ **Lesson:** You intersect two interfaces and both have a field called `id` — one typed `string`, one typed `number`. TypeScript doesn't error on the intersection definition. But the moment you try to create an object of that type, nothing satisfies it. Why does `string & number` produce `never` — and why does TypeScript wait until usage to tell you?",
    mentalModel:
      "**Mental model:** Think of a type intersection as a **Venn diagram where the result is the overlap of constraints**.\n- `string & number` means: a value that satisfies both `string` AND `number` simultaneously. No such value exists. The result is `never` — the empty type.\n- `string & ('active' | 'delayed')` means: a value that is both a string AND one of those literals. The literals already are strings — so the narrower constraint wins: `'active' | 'delayed'`.\n- The rule: intersection makes types *more restrictive*, not more permissive. When two constraints can't both be satisfied, the field becomes `never`.\n- TypeScript evaluates this lazily — it constructs the intersection type without checking usability, then errors when you try to assign a value to a `never` field.",
    discover:
      "**Pattern — intersection field collisions:**\n```tsx\n// ✅ no collision — all field names are unique\ntype ShipmentWithDriver = ShipmentRecord & DriverSummary;\n\n// ⚠️ same field, compatible types — narrower type wins\ntype A = { status: string };\ntype B = { status: 'active' | 'delayed' };\ntype C = A & B; // status: 'active' | 'delayed' ✅\n\n// ❌ same field, incompatible types — field becomes never\ntype D = { id: string };\ntype E = { id: number };\ntype F = D & E; // id: never 💥 — no value can satisfy this\n```\n- before intersecting two types, check for shared field names\n- compatible types: narrower wins\n- incompatible types: field becomes never, object becomes unusable\n- the safest intersections combine types with completely distinct field names",
    quickRules:
      "**Quick rules:**\n- ✅ `type Combined = A & B` — safe when A and B have no overlapping field names\n- ✅ overlapping fields with compatible types — narrower type wins automatically\n- ❌ overlapping fields with incompatible types — field becomes `never`, type is unusable\n- check for field name collisions before intersecting — TypeScript won't warn you at definition time\n- use extends instead of & when you need formal inheritance and the ability to extend further",
    watchOut:
      "👀 **Watch out:** TypeScript won't error when you *define* an intersection with a `never` field — it only errors when you try to *use* it. This makes the bug feel distant from the cause. If you're getting mysterious errors on object literals that look correct, check your intersection types for field name collisions.",
    dryRun:
      "🔁 **Think:** You have `type ShipmentWithDriver = ShipmentRecord & DriverSummary`. ShipmentRecord has 6 fields (id, createdAt, updatedAt, origin, destination, status). DriverSummary has 2 fields (driverName, vehicleId). How many fields does ShipmentWithDriver have in total — and which ones are readonly? (Hint: trace which fields came from BaseRecord through ShipmentRecord, and remember readonly flows through extends but & is a flat merge.)",
    build:
      "**Learning focus:** Use a type intersection to combine two independent interface shapes into one flat type — understanding that & merges all fields from both sides, that readonly modifiers from extends-based parents carry through, and that field name collisions between the two sides produce never.",
  },
},
{
  id: "step5",
  type: "question",
  phase: "Step 5 of 5",
  paal: "Build the ShipmentRecordCard component — accept ShipmentWithDriver as props, destructure it in the signature, and render the shipment ID, origin city, destination city, status, and driver name in JSX.",
  hint: "Nested fields are accessed with dot notation inside curly braces — {origin.city} not just {origin}.",
  example_code: `const OrderCard = ({ id, delivery, customer }: OrderWithCustomer): JSX.Element => {
  return (
    <div>
      <p>{id}</p>
      <p>{delivery.city}</p>
      <p>{customer.name}</p>
    </div>
  );
};`,
  think_prompt:
    "origin and destination are Location objects — not strings. How do you reach the city field inside a nested object when destructuring at the top level only gives you the object itself?",
  mc_options: [
    "Destructure origin and destination, then access .city with dot notation in JSX",
    "Destructure originCity and destinationCity directly from props",
    "Pass the entire origin object as a prop to a child component",
  ],
  mc_correct_option:
    "Destructure origin and destination, then access .city with dot notation in JSX",
  mc_anchor:
    "Destructuring at the top level gives you the Location object. Dot notation inside JSX reaches into it — {origin.city}. You can't destructure originCity directly because that field doesn't exist on the interface — the shape is nested, not flat.",
  why_this_matters:
    "Every real API response has nested objects. Knowing how to destructure the top level and then reach into nested fields with dot notation is the pattern you'll use on every data component you ever build — cards, tables, detail views, all of them.",
  answer_keywords: [
    "ShipmentWithDriver", "ShipmentRecordCard", "JSX.Element",
    "origin", "destination", "origin.city", "destination.city", "status", "driverName",
  ],
  seed_code: `interface BaseRecord {
  readonly id: string;
  readonly createdAt: string;
  readonly updatedAt: string;
}

interface Location {
  city: string;
  country: string;
}

interface ShipmentRecord extends BaseRecord {
  origin: Location;
  destination: Location;
  status: 'active' | 'delayed' | 'delivered';
}

interface DriverSummary {
  driverName: string;
  vehicleId: string;
}

type ShipmentWithDriver = ShipmentRecord & DriverSummary;`,
  starter_code: `interface BaseRecord {
  readonly id: string;
  readonly createdAt: string;
  readonly updatedAt: string;
}

interface Location {
  city: string;
  country: string;
}

interface ShipmentRecord extends BaseRecord {
  origin: Location;
  destination: Location;
  status: 'active' | 'delayed' | 'delivered';
}

interface DriverSummary {
  driverName: string;
  vehicleId: string;
}

type ShipmentWithDriver = ShipmentRecord & DriverSummary;

// define ShipmentRecordCard component here
// destructure props from ShipmentWithDriver
// render id, origin.city, destination.city, status, driverName`,
  feedback_correct:
    "Exactly — top-level destructuring gives you the Location objects, and dot notation reaches into them in JSX. Every nested API shape in a real app follows this same pattern.",
  feedback_partial:
    "Close — check that you're accessing nested fields with dot notation in JSX. {origin} renders [object Object], not the city. You need {origin.city}.",
  feedback_wrong:
    "The pattern is: destructure `{ id, origin, destination, status, driverName }` from `ShipmentWithDriver` in the signature, then use `{origin.city}` and `{destination.city}` in the JSX — dot notation reaches into the nested Location object.",
  expected: `interface BaseRecord {
  readonly id: string;
  readonly createdAt: string;
  readonly updatedAt: string;
}

interface Location {
  city: string;
  country: string;
}

interface ShipmentRecord extends BaseRecord {
  origin: Location;
  destination: Location;
  status: 'active' | 'delayed' | 'delivered';
}

interface DriverSummary {
  driverName: string;
  vehicleId: string;
}

type ShipmentWithDriver = ShipmentRecord & DriverSummary;

const ShipmentRecordCard = ({
  id,
  origin,
  destination,
  status,
  driverName,
}: ShipmentWithDriver): JSX.Element => {
  return (
    <div>
      <p>{id}</p>
      <p>{origin.city}</p>
      <p>{destination.city}</p>
      <p>{status}</p>
      <p>{driverName}</p>
    </div>
  );
};`,
  analog_example: `const InvoiceCard = ({ id, billing, recipient }: InvoiceWithRecipient): JSX.Element => {
  return (
    <div>
      <p>{id}</p>
      <p>{billing.city}</p>
      <p>{recipient.name}</p>
    </div>
  );
};`,
  deepDiveLabel:
    "Dot notation works — but can you destructure nested fields directly in the function parameter instead?",
  deepDive: {
    hook: "You're three components deep into building a data-heavy enterprise app. Every component destructures props at the top level and then uses dot notation to reach nested fields — `{origin.city}`, `{customer.address.street}`, `{order.pricing.total}`. It works, but some components end up with long chains of dot notation scattered across the JSX.\n\nA senior engineer shows you a trick: you can destructure nested objects directly in the function parameter. Instead of `{ origin }` and then `{origin.city}` in JSX, you write `{ origin: { city: originCity } }` in the parameter and use `{originCity}` in JSX. One level of nesting gone.\n\nYou try it. It works. Then you need `origin.city` AND `origin.country` in the same component. The nested destructure gets harder to read. Then a third field. Now the parameter signature is longer than the JSX. You switch back to dot notation. The right choice depends on the depth and how many fields you need.",
    pain: "⚠️ **Lesson:** You render `{origin}` in JSX expecting to see the city. The browser shows `[object Object]`. The prop is correct, the destructuring is correct. What did JSX actually render — and why does a nested object need dot notation to reach its contents?",
    mentalModel:
      "**Mental model:** Think of a nested object in JSX as a **box inside a box**.\n- `{origin}` hands JSX the outer box. JSX tries to render a box — it doesn't know how to display an object, so it calls `.toString()` on it and renders `[object Object]`.\n- `{origin.city}` opens the outer box and hands JSX the string inside. JSX knows how to render a string — it displays it directly.\n- Dot notation is the key that opens each layer. One dot per level of nesting.\n- The alternative is nested destructuring in the parameter: `{ origin: { city } }` — this opens the box at the function boundary and gives you the string directly. Both approaches reach the same value, the trade-off is readability versus convenience.",
    discover:
      "**Pattern — nested field access:**\n```tsx\n// ✅ dot notation in JSX — most readable for 1-2 nested fields\nconst ShipmentRecordCard = ({ origin, destination }: ShipmentWithDriver): JSX.Element => {\n  return (\n    <div>\n      <p>{origin.city}</p>\n      <p>{destination.city}</p>\n    </div>\n  );\n};\n\n// ✅ nested destructuring in parameter — useful when one nested field is used many times\nconst ShipmentRecordCard = ({ \n  origin: { city: originCity },\n  destination: { city: destinationCity }\n}: ShipmentWithDriver): JSX.Element => {\n  return (\n    <div>\n      <p>{originCity}</p>\n      <p>{destinationCity}</p>\n    </div>\n  );\n};\n\n// ❌ rendering the object directly — produces [object Object]\n<p>{origin}</p>\n```\n- dot notation: simple, readable, works for any depth\n- nested destructuring: removes repetition when the same nested field appears many times\n- never render an object directly in JSX — always reach the primitive value inside",
    quickRules:
      "**Quick rules:**\n- ✅ `{origin.city}` — dot notation reaches into the nested object\n- ✅ `{ origin: { city } }` in parameter — nested destructure, use when city is referenced many times\n- ❌ `{origin}` in JSX — renders [object Object], not the value inside\n- ❌ `{origin.toString()}` — produces [object Object] too, toString on a plain object is not useful\n- one dot per level of nesting — `{order.pricing.total}` reaches three levels deep",
    watchOut:
      "👀 **Watch out:** Nested destructuring in the function parameter looks clever but gets unreadable fast. `{ origin: { city: originCity, country: originCountry }, destination: { city: destCity, country: destCountry } }` is technically valid TypeScript — but nobody wants to read that in a PR. Prefer dot notation in JSX for anything beyond one level deep.",
    dryRun:
      "🔁 **Think:** You render `{origin.city}` and it shows 'Hamburg'. Now the API changes — origin is temporarily `null` while data loads. What happens when React tries to evaluate `{origin.city}` — blank, [object Object], or a runtime crash? (Hint: accessing `.city` on null throws immediately — this is where optional chaining `origin?.city` becomes essential, but that's a later pattern.)",
    build:
      "**Learning focus:** Destructure nested interface shapes at the top level and use dot notation in JSX to reach into nested objects — understanding that rendering an object directly produces [object Object] and that each dot in the chain opens one more level of nesting.",
  },
},
];

const sideItems = [
  { label: "Lesson", id: "intro" },
  { label: "Objectives", id: "objectives" },
  { label: "Step 1", id: "step1" },
  { label: "Step 2", id: "step2" },
  { label: "Step 3", id: "step3" },
  { label: "Step 4", id: "step4" },
  { label: "Step 5", id: "step5" },
];

export default createINPACTEngine({
  NODES,
  sideItems,
  lessonNum: 2,
  title: "TypeScript — Interfaces + Types",
  shortName: "TS — SHIPMENT RECORD",
});