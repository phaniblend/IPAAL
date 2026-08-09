import createINPACTEngine from "../inpact_engine_shared";
import { useState } from "react";

// Module-scope types
interface FormData {
  title: string;
  description: string;
}

interface FormErrors {
  title?: string;
  description?: string;
}

export const NODES = [
  {
    id: "intro",
    type: "reveal",
    phase: "Lesson",
    content: {
      tag: "form-validation-submission",
      title: "Ensuring Valid Data for API Submission",
      body: `When building interactive applications, users often provide data through forms. Without proper checks, this data can be incomplete, malformed, or simply incorrect, leading to frustrating errors for the user and potential data integrity issues on the backend. Implementing client-side validation is crucial for a smooth user experience, providing immediate feedback and preventing unnecessary network requests with invalid payloads. This pattern ensures that the data sent to your API adheres to expected formats and constraints, acting as the first line of defense against bad data.

This pattern is fundamental and appears across almost all interactive software. You'll encounter it in login forms, user profile updates, settings panels, search filters, and any component where a user inputs information that needs to be processed or stored. Mastering this concept allows you to build robust, user-friendly interfaces that gracefully handle input errors and communicate effectively with backend services, ensuring that your application's data remains consistent and reliable.`,
      usecase: "A user registration form where new users provide their email and password. The form needs to ensure both fields are present and the email is a valid format before attempting to create an account via an API.",
    },
  },
  {
    id: "objectives",
    type: "objectives",
    phase: "Objectives",
    items: [
      "Define module-scope types for form data and errors.",
      "Manage form input state and validation error state.",
      "Implement client-side validation logic for form fields.",
      "Construct a submission handler that validates data and sends a correctly structured payload to an API.",
      "Wire form elements to state and submission logic.",
    ],
  },
  {
    id: "step1_imports",
    type: "question",
    phase: "Step 1 of 7",
    paal: "To manage the dynamic state of our form inputs and validation messages, we'll need a way to store and update values within our component. Identify the necessary import statement for state management.",
    hint: "Think about the fundamental hook in React for managing component-level state.",
    example_code: `// Where should the state management hook be imported from?
// import ... from 'react';`,
    think_prompt: "Which React hook is essential for adding state to functional components?",
    mc_options: [
      "import { useEffect } from 'react';",
      "import { useState } from 'react';",
      "import { useContext } from 'react';",
    ],
    mc_correct_option: "import { useState } from 'react';",
    mc_anchor: "import { useState } from 'react';",
    why_this_matters: "The `useState` hook is the cornerstone of managing dynamic data within React functional components. Without it, our form inputs would be static, unable to react to user typing or reflect validation errors.",
    answer_keywords: ["useState", "import", "react"],
    seed_code: ``,
    starter_code: `// Add the necessary import statement here
`,
    feedback_correct: "Correct! `useState` is the right tool for managing dynamic form data and validation states.",
    feedback_partial: "You're close, but `useEffect` is for side effects, and `useContext` is for global state. We need a hook specifically for local component state.",
    feedback_wrong: "`useContext` is for consuming context, not for managing local component state directly. Revisit the core hook for state management.",
    expected: `import { useState } from "react";`,
    analog_example: `// In a simple counter component:
import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  const increment = () => setCount(prevCount => prevCount + 1);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={increment}>Increment</button>
    </div>
  );
}`,
    deepDiveLabel: "Why do we need 'useState' for forms?",
    deepDive: {
      hook: `Imagine a simple text input field on a webpage. When a user types into it, what happens? The text inside the input changes. If our component doesn't 'remember' what the user typed, how can it display the text, or even more importantly, how can it use that text later when the user clicks 'submit'? Without a mechanism to store and update this changing information, the input field would be a static, unresponsive box. Every keystroke would vanish into the ether, and the form would be utterly useless. This problem extends beyond just input values; it applies to whether a form is currently submitting, if there are any error messages to show, or if a checkbox is checked. All these pieces of information are dynamic and need to be tracked by our component.`,
      pain: `⚠️ **Lesson:** Components need internal memory to react to user interactions and display dynamic data. Symptom: Without state management, form inputs are "uncontrolled" and static, unable to reflect user input or trigger updates in the UI.`,
      mentalModel: `**Mental model:** The Component's Scratchpad. Think of a component as having a small, temporary scratchpad where it can jot down notes about its current situation. When something changes (like a user typing), the component updates its notes on the scratchpad. When it needs to decide what to display, it consults its scratchpad. The 'useState' hook is like asking the component for a fresh piece of its scratchpad, along with a special pen that, when used, automatically makes the component look at its notes again and update its display if needed.`,
      discover: `The \`useState\` hook provides a way to add state to functional components.
\`\`\`tsx
import { useState } from 'react';

function MyComponent() {
  // 1. Declare a state variable 'count' and a setter function 'setCount'
  const [count, setCount] = useState(0); 

  // 2. 'count' holds the current state value (initially 0)
  // 3. 'setCount' is a function to update 'count'
  // 4. When 'setCount' is called, the component re-renders with the new 'count' value.
  return (
    <button onClick={() => setCount(count + 1)}>
      Clicked {count} times
    </button>
  );
}
\`\`\`
-   \`useState\` returns an array with two elements: the current state value and a function to update it.
-   The argument passed to \`useState\` (e.g., \`0\`) is the initial state value.
-   When the setter function (\`setCount\`) is called, React re-renders the component.
-   This re-render uses the new state value, making the UI dynamic.`,
      quickRules: `**Quick rules:**
-   ✅ Use \`useState\` for any data that changes over time and affects the component's rendering.
-   ✅ Destructure the array returned by \`useState\` into \`[value, setValue]\`.
-   ✅ Call the setter function (\`setValue\`) to update state; direct modification of \`value\` will not trigger a re-render.
-   ✅ Provide an initial value to \`useState\` for predictable behavior.
-   ❌ Never modify state directly (e.g., \`count = 5\`); always use the setter function.
-   ❌ Don't call \`useState\` inside loops, conditions, or nested functions; it must be at the top level of your component.
-   ❌ Avoid putting derived state (data that can be computed from existing state or props) into \`useState\`.`,
      watchOut: `👀 **Watch out:** When updating state based on the previous state, always use the functional update form of the setter (e.g., \`setCount(prevCount => prevCount + 1)\`). This prevents subtle bugs due to stale closures, especially in asynchronous operations or when updates are batched. Failing to do so can lead to incorrect state values if multiple updates happen rapidly.`,
      dryRun: `🔁 **Think:** A user clicks a button.
1.  Initial state: \`count\` is 0.
2.  User clicks button. The \`onClick\` handler calls \`setCount(count + 1)\`. Since \`count\` is 0, this is \`setCount(0 + 1)\`, so \`setCount(1)\`.
3.  React updates \`count\` to 1 and re-renders the component.
4.  The UI now displays "Clicked 1 times".
5.  User clicks button again. The \`onClick\` handler calls \`setCount(count + 1)\`. Since \`count\` is now 1, this is \`setCount(1 + 1)\`, so \`setCount(2)\`.
6.  React updates \`count\` to 2 and re-renders.
7.  The UI now displays "Clicked 2 times".
(Hint: Trace how the 'count' variable changes with each interaction.)`,
      build: `**Learning focus:** Understand how to import and use the \`useState\` hook to enable dynamic behavior in a component.`,
    },
  },
  {
    id: "step2_types",
    type: "question",
    phase: "Step 2 of 7",
    paal: "To ensure type safety and clarity for our form's data structure and potential error messages, we should define specific interfaces. Create two interfaces: one for the form's data (`FormData`) with `title` and `description` as strings, and another for `FormErrors` where `title` and `description` can optionally be strings (for error messages).",
    hint: "Interfaces define the shape of objects. Use `?` for optional properties.",
    example_code: `// Define FormData and FormErrors interfaces here
interface FormData {
  // ...
}

interface FormErrors {
  // ...
}`,
    think_prompt: "What are the exact types for `title` and `description` in `FormData`, and how do you make them optional in `FormErrors`?",
    mc_options: [
      "interface FormData { title: any; description: any; } interface FormErrors { title: string; description: string; }",
      "interface FormData { title: string; description: string; } interface FormErrors { title?: string; description?: string; }",
      "type FormData = { title: string, description: string }; type FormErrors = { title: string | undefined, description: string | undefined };",
    ],
    mc_correct_option: "interface FormData { title: string; description: string; } interface FormErrors { title?: string; description?: string; }",
    mc_anchor: "interface FormData { title: string; description: string; } interface FormErrors { title?: string; description?: string; }",
    why_this_matters: "Defining explicit types for our form data and errors brings several benefits: it improves code readability, enables powerful autocompletion in IDEs, and catches potential type-related bugs at compile time rather than runtime. This 'contract' for our data structures is essential for robust application development.",
    answer_keywords: ["interface", "type safety", "optional properties", "FormData", "FormErrors"],
    seed_code: `import { useState } from "react";`,
    starter_code: `import { useState } from "react";

// Define FormData and FormErrors interfaces here
`,
    feedback_correct: "Excellent! These interfaces provide clear, type-safe contracts for our form's data and error states.",
    feedback_partial: "You've defined the types, but remember that error messages are often optional. The `?` syntax is key for `FormErrors`.",
    feedback_wrong: "Using `any` defeats the purpose of type safety. Also, `FormErrors` should have optional string properties, not mandatory ones.",
    expected: `import { useState } from "react";

interface FormData {
  title: string;
  description: string;
}

interface FormErrors {
  title?: string;
  description?: string;
}
`,
    analog_example: `// Defining types for a user profile in a different context:
interface UserProfile {
  id: string;
  username: string;
  email: string;
  bio?: string; // bio is optional
  isActive: boolean;
}

interface UserSettings {
  theme: 'light' | 'dark';
  notificationsEnabled: boolean;
  language: 'en' | 'es' | 'fr';
}

// Usage:
const user: UserProfile = {
  id: 'u123',
  username: 'coder_cat',
  email: 'cat@example.com',
  isActive: true,
};

const settings: UserSettings = {
  theme: 'dark',
  notificationsEnabled: true,
  language: 'en',
};`,
    deepDiveLabel: "Why are explicit types so important?",
    deepDive: {
      hook: `Imagine you're building a complex machine, and you have various parts that need to fit together perfectly. If you don't have blueprints or clear specifications for each part, you might accidentally try to connect a square peg to a round hole, or expect a part to be made of metal when it's actually plastic. In software, this leads to runtime errors, unexpected behavior, and hours spent debugging. Without explicit types, your code is like a machine built without a blueprint: you might get lucky, but more often than not, things will break in unpredictable ways, especially as the system grows.`,
      pain: `⚠️ **Lesson:** Explicit type definitions create a contract for data structures, preventing common errors and improving code maintainability. Symptom: Ambiguous data shapes lead to runtime type errors, difficult debugging, and poor developer experience due to lack of autocompletion and early error detection.`,
      mentalModel: `**Mental model:** The Data Blueprint. Think of an interface as a blueprint for a specific type of data. It precisely dictates what properties an object *must* have, what properties it *might* have, and the exact type of value each property holds. Just as a builder consults a blueprint to ensure every beam and pipe is correctly placed, a developer consults an interface to ensure every piece of data conforms to the expected structure. This blueprint is checked by the TypeScript compiler *before* your code even runs, catching mistakes early.`,
      discover: `Interfaces in TypeScript allow us to define the shape of objects.
\`\`\`tsx
// 1. Defines an object that MUST have 'name' (string) and 'age' (number)
interface Person {
  name: string;
  age: number;
  email?: string; // 2. 'email' is optional (string or undefined)
}

// 3. This object correctly matches the Person interface
const user1: Person = {
  name: "Alice",
  age: 30,
};

// 4. This object also correctly matches, including the optional property
const user2: Person = {
  name: "Bob",
  age: 25,
  email: "bob@example.com",
};

// 5. This would cause a compile-time error because 'age' is missing
// const user3: Person = { name: "Charlie" }; 
\`\`\`
-   \`interface\` keyword is used to declare an interface.
-   Properties are defined with a name followed by a colon and their type (e.g., \`name: string\`).
-   Optional properties are denoted by a \`?\` after the property name (e.g., \`email?: string\`).
-   TypeScript uses these interfaces to perform static type checking, catching errors before runtime.
-   They serve as clear documentation for the expected data structure.`,
      quickRules: `**Quick rules:**
-   ✅ Use interfaces to define the shape of objects, especially for data models, props, and state.
-   ✅ Use \`?\` to mark properties that might not always be present.
-   ✅ Leverage interfaces for function parameters and return types to ensure data consistency.
-   ✅ Use interfaces to extend other interfaces for building complex types.
-   ❌ Avoid using \`any\` when a more specific interface or type can be defined.
-   ❌ Don't define interfaces that are too broad or too specific; aim for a balance that accurately reflects the data.
-   ❌ Never rely solely on runtime checks for data shape if static types can catch issues earlier.`,
      watchOut: `👀 **Watch out:** While interfaces provide excellent compile-time checks, they disappear at runtime. This means if you receive data from an external source (like an API), TypeScript won't automatically enforce the interface. You'll still need runtime validation (e.g., using a library like Zod or manually checking) to ensure incoming data conforms to your expected types.`,
      dryRun: `🔁 **Think:** We have a variable \`user\` of type \`UserProfile\`.
1.  \`user\` is initialized as \`{ id: 'u123', username: 'coder_cat', email: 'cat@example.com', isActive: true }\`.
2.  The TypeScript compiler checks this object against the \`UserProfile\` interface.
3.  \`id\` (string), \`username\` (string), \`email\` (string), \`isActive\` (boolean) are all present and match their defined types.
4.  \`bio\` is optional, so its absence is fine.
5.  If we tried to assign \`user.id = 123;\`, the compiler would immediately flag an error because \`id\` is defined as a \`string\`, not a \`number\`.
(Hint: Focus on how the compiler uses the interface to verify the structure and types of properties.)`,
      build: `**Learning focus:** Define type-safe interfaces for the form's data and error structures to improve code reliability and developer experience.`,
    },
  },
  {
    id: "step3_componentShell",
    type: "question",
    phase: "Step 3 of 7",
    paal: "Now, let's create the basic functional component shell for our form. Define a functional component named `SubmissionForm` that accepts a single prop, `onSubmit`, which is a function that takes `FormData` and returns a `Promise<void>`. The component should initially return a simple `<div>` containing the text 'Form goes here'.",
    hint: "Functional components are just functions. Remember to specify the type of the `onSubmit` prop.",
    example_code: `// Create the SubmissionForm component here
function SubmissionForm(/* ... */) {
  // ...
}`,
    think_prompt: "How do you define a functional component and its props with TypeScript, ensuring the `onSubmit` prop has the correct signature?",
    mc_options: [
      `const SubmissionForm = ({ onSubmit }: { onSubmit: (data: any) => void }) => { return <div>Form goes here</div>; };`,
      `function SubmissionForm({ onSubmit }: { onSubmit: (data: FormData) => Promise<void> }) { return <div>Form goes here</div>; }`,
      `function SubmissionForm(props: { onSubmit: (data: FormData) => Promise<void> }) { return <div>Form goes here</div>; }`,
    ],
    mc_correct_option: `function SubmissionForm({ onSubmit }: { onSubmit: (data: FormData) => Promise<void> }) { return <div>Form goes here</div>; }`,
    mc_anchor: `function SubmissionForm({ onSubmit }: { onSubmit: (data: FormData) => Promise<void> }) { return <div>Form goes here</div>; }`,
    why_this_matters: "Establishing the component's signature and its expected props early on creates a clear contract for how it will be used. Defining the `onSubmit` prop with its specific `FormData` type ensures that any parent component using `SubmissionForm` will pass data in the correct format, preventing integration errors.",
    answer_keywords: ["functional component", "props", "TypeScript", "onSubmit", "Promise<void>"],
    seed_code: `import { useState } from "react";

interface FormData {
  title: string;
  description: string;
}

interface FormErrors {
  title?: string;
  description?: string;
}
`,
    starter_code: `import { useState } from "react";

interface FormData {
  title: string;
  description: string;
}

interface FormErrors {
  title?: string;
  description?: string;
}

// Create the SubmissionForm component here
`,
    feedback_correct: "Perfect! This sets up our component with a clear, type-safe contract for its `onSubmit` prop.",
    feedback_partial: "You've got the component structure, but double-check the exact type signature for the `onSubmit` prop, especially its return type.",
    feedback_wrong: "Using `any` for `data` in `onSubmit` defeats type safety. Ensure `FormData` is used and the return type is `Promise<void>`.",
    expected: `import { useState } from "react";

interface FormData {
  title: string;
  description: string;
}

interface FormErrors {
  title?: string;
  description?: string;
}

function SubmissionForm({ onSubmit }: { onSubmit: (data: FormData) => Promise<void> }) {
  return (
    <div>
      Form goes here
    </div>
  );
}
`,
    analog_example: `// A generic button component with a typed click handler:
interface ButtonProps {
  label: string;
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  isDisabled?: boolean;
}

function CustomButton({ label, onClick, isDisabled = false }: ButtonProps) {
  return (
    <button onClick={onClick} disabled={isDisabled}>
      {label}
    </button>
  );
}

// Usage example:
// <CustomButton label="Click Me" onClick={() => console.log('Button clicked!')} />`,
    deepDiveLabel: "Why define props with such specific types?",
    deepDive: {
      hook: `Imagine you're handing off a tool to another engineer. If you just say "here's a tool," they might not know what it does, what kind of input it expects, or what kind of output it produces. They might try to use it for the wrong job, or feed it the wrong materials, leading to breakage. In software, this "hand-off" happens when one component uses another. If the consuming component doesn't know the exact 'specifications' of the props it needs to pass, it's prone to making mistakes that only surface at runtime, causing crashes or incorrect behavior.`,
      pain: `⚠️ **Lesson:** Clearly defined prop types create a reliable interface between components, preventing integration errors and improving maintainability. Symptom: Components are used incorrectly, leading to runtime errors, unexpected behavior, and difficult-to-trace bugs due to mismatched data types or missing required props.`,
      mentalModel: `**Mental model:** The Component's API Contract. Just like a public API has clear documentation on its endpoints, expected request bodies, and response formats, a component's props define its "API." When you define prop types, you're writing a contract that says, "If you want to use me, you must provide data in this exact shape." This contract is enforced by TypeScript, ensuring that any component trying to use \`SubmissionForm\` adheres to its requirements, making the entire application more predictable and robust.`,
      discover: `Defining props with interfaces ensures type safety and clarity.
\`\`\`tsx
// 1. Define an interface for the component's props
interface GreetingProps {
  name: string;
  age?: number; // Optional prop
  onGreet: (message: string) => void; // Function prop with specific signature
}

// 2. Use the interface to type the props object
function Greeting({ name, age, onGreet }: GreetingProps) {
  const displayAge = age ? \` (Age: \${age})\` : '';
  
  // 3. Call the function prop with the expected argument type
  const handleClick = () => onGreet(\`Hello, \${name}!\`);

  return (
    <div>
      <p>Hello, {name}{displayAge}!</p>
      <button onClick={handleClick}>Say Hello</button>
    </div>
  );
}
\`\`\`
-   An interface (\`GreetingProps\`) explicitly defines the types of all expected props.
-   Destructuring props in the function signature makes them easy to access.
-   Function props (\`onGreet\`) are typed with their parameter and return types.
-   TypeScript checks that components using \`Greeting\` provide props matching \`GreetingProps\`.`,
      quickRules: `**Quick rules:**
-   ✅ Always define an interface or type for your component's props.
-   ✅ Use optional properties (\`?\`) for props that are not strictly required.
-   ✅ Type function props with their expected arguments and return types.
-   ✅ Leverage default values for optional props to make components more flexible.
-   ❌ Never use \`any\` for props; it bypasses type checking and defeats the purpose.
-   ❌ Avoid creating components with too many props; consider breaking them down or using context.
-   ❌ Don't rely on comments alone to describe prop expectations; use TypeScript types.`,
      watchOut: `👀 **Watch out:** While TypeScript catches prop type mismatches at compile time, if a prop is optional and not provided, your component logic must gracefully handle its absence (e.g., using default values or conditional rendering). Forgetting to account for optional props can lead to runtime errors if you try to access properties on an \`undefined\` value.`,
      dryRun: `🔁 **Think:** A parent component renders \`<Greeting name="World" onGreet={msg => console.log(msg)} />\`.
1.  The \`Greeting\` component receives \`name: "World"\` and \`onGreet: (msg: string) => void\`.
2.  The \`age\` prop is optional and not provided, so it is \`undefined\`.
3.  Inside \`Greeting\`, \`displayAge\` becomes an empty string because \`age\` is falsy.
4.  When the "Say Hello" button is clicked, \`handleClick\` is called.
5.  \`handleClick\` calls \`onGreet("Hello, World!")\`.
6.  The parent's \`console.log("Hello, World!")\` is executed.
(Hint: Trace how the 'age' prop's absence affects 'displayAge' and how 'onGreet' is called.)`,
      build: `**Learning focus:** Construct the functional component shell, defining its props with precise TypeScript types to establish a clear API contract.`,
    },
  },
  {
    id: "step4_stateVariables",
    type: "question",
    phase: "Step 4 of 7",
    paal: "Inside the `SubmissionForm` component, initialize the necessary state variables. We'll need `formData` to hold the current input values (initialized with empty strings for `title` and `description`), `formErrors` to store any validation messages (initialized as an empty object), and `isSubmitting` to track the form's submission status (initialized to `false`).",
    hint: "Use the `useState` hook for each piece of state. Remember to provide initial values that match your `FormData` and `FormErrors` interfaces.",
    example_code: `function SubmissionForm({ onSubmit }: { onSubmit: (data: FormData) => Promise<void> }) {
  // Initialize state variables here
  // const [formData, setFormData] = useState<FormData>(/* ... */);
  // const [formErrors, setFormErrors] = useState<FormErrors>(/* ... */);
  // const [isSubmitting, setIsSubmitting] = useState<boolean>(/* ... */);

  return (
    <div>
      Form goes here
    </div>
  );
}`,
    think_prompt: "What are the correct initial values for `formData`, `formErrors`, and `isSubmitting` based on their types?",
    mc_options: [
      `const [formData, setFormData] = useState<FormData>({ title: '', description: '' });
const [formErrors, setFormErrors] = useState<FormErrors>({});
const [isSubmitting, setIsSubmitting] = useState<boolean>(false);`,
      `const [formData, setFormData] = useState<FormData>();
const [formErrors, setFormErrors] = useState<FormErrors>();
const [isSubmitting, setIsSubmitting] = useState(false);`,
      `const [formData, setFormData] = useState({ title: null, description: null });
const [formErrors, setFormErrors] = useState({});
const [isSubmitting, setIsSubmitting] = useState(false);`,
    ],
    mc_correct_option: `const [formData, setFormData] = useState<FormData>({ title: '', description: '' });
const [formErrors, setFormErrors] = useState<FormErrors>({});
const [isSubmitting, setIsSubmitting] = useState<boolean>(false);`,
    mc_anchor: `const [formData, setFormData] = useState<FormData>({ title: '', description: '' });
const [formErrors, setFormErrors] = useState<FormErrors>({});
const [isSubmitting, setIsSubmitting] = useState<boolean>(false);`,
    why_this_matters: "Properly initializing state variables is crucial for predictable component behavior. It ensures that our form starts in a known, valid state (empty inputs, no errors, not submitting) and prevents `undefined` errors when accessing properties of `formData` or `formErrors` before any user interaction.",
    answer_keywords: ["useState", "initial state", "formData", "formErrors", "isSubmitting"],
    seed_code: `import { useState } from "react";

interface FormData {
  title: string;
  description: string;
}

interface FormErrors {
  title?: string;
  description?: string;
}

function SubmissionForm({ onSubmit }: { onSubmit: (data: FormData) => Promise<void> }) {
  return (
    <div>
      Form goes here
    </div>
  );
}
`,
    starter_code: `import { useState } from "react";

interface FormData {
  title: string;
  description: string;
}

interface FormErrors {
  title?: string;
  description?: string;
}

function SubmissionForm({ onSubmit }: { onSubmit: (data: FormData) => Promise<void> }) {
  // Initialize state variables here
  
  return (
    <div>
      Form goes here
    </div>
  );
}
`,
    feedback_correct: "Exactly! These `useState` calls correctly initialize our form's data, error, and submission status.",
    feedback_partial: "You've got the `useState` calls, but ensure `formData` is initialized with an object matching `FormData` and `formErrors` with an empty object.",
    feedback_wrong: "Initializing with `undefined` or `null` can lead to runtime errors when trying to access properties. Always provide initial values that match the expected type.",
    expected: `import { useState } from "react";

interface FormData {
  title: string;
  description: string;
}

interface FormErrors {
  title?: string;
  description?: string;
}

function SubmissionForm({ onSubmit }: { onSubmit: (data: FormData) => Promise<void> }) {
  const [formData, setFormData] = useState<FormData>({ title: '', description: '' });
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  return (
    <div>
      Form goes here
    </div>
  );
}
`,
    analog_example: `// In a simple search component:
import { useState } from 'react';

function SearchBar() {
  const [searchTerm, setSearchTerm] = useState<string>(''); // Initial search term is empty
  const [searchResults, setSearchResults] = useState<string[]>([]); // Initial results are an empty array
  const [isLoading, setIsLoading] = useState<boolean>(false); // Not loading initially

  // ... rest of component logic
  return (
    <div>
      <input 
        type="text" 
        value={searchTerm} 
        onChange={(e) => setSearchTerm(e.target.value)} 
        placeholder="Search..." 
      />
      {isLoading && <p>Loading results...</p>}
      <ul>
        {searchResults.map((result, index) => <li key={index}>{result}</li>)}
      </ul>
    </div>
  );
}`,
    deepDiveLabel: "Why is initial state so important?",
    deepDive: {
      hook: `Imagine you walk into a kitchen to bake a cake. If the recipe doesn't tell you how much flour or sugar to start with, or if the oven temperature isn't specified, you're left guessing. Your cake might turn out inedible, or worse, the oven might catch fire! In programming, if a component's state isn't explicitly initialized, it's like starting with unknown ingredients or settings. The component might render with \`undefined\` values, causing crashes, or behave unpredictably because it's not starting from a stable, known baseline. This is especially critical for forms, where users expect a clean slate or pre-filled values.`,
      pain: `⚠️ **Lesson:** Always initialize state variables with appropriate default values to ensure predictable component behavior and prevent runtime errors. Symptom: Uninitialized state leads to \`undefined\` errors, unexpected UI rendering, and inconsistent behavior, making components fragile and difficult to debug.`,
      mentalModel: `**Mental model:** The Component's Default Settings. Think of a component's initial state as its factory default settings. When the component is first "turned on" (mounted), it consults these settings to know how to present itself. For a form, this means knowing that the text fields are empty, no errors are currently displayed, and it's not in the middle of submitting. These defaults provide a stable foundation, ensuring the component is always in a valid and predictable configuration from the moment it appears on screen.`,
      discover: `\`useState\` requires an initial value to define the starting point of the state.
\`\`\`tsx
import { useState } from 'react';

function UserProfileEditor() {
  // 1. Initial state for user data, matching the expected object structure
  const [user, setUser] = useState({ name: '', email: '', bio: '' }); 

  // 2. Initial state for a boolean flag
  const [isEditing, setIsEditing] = useState(false); 

  // 3. Initial state for a list (empty array)
  const [hobbies, setHobbies] = useState<string[]>([]); 

  // 4. Initial state for potential error messages (empty object)
  const [errors, setErrors] = useState<{ name?: string; email?: string }>({});

  // ... rest of the component
  return (
    <div>
      <input value={user.name} onChange={(e) => setUser({ ...user, name: e.target.value })} />
      {errors.name && <p style={{ color: 'red' }}>{errors.name}</p>}
      <button onClick={() => setIsEditing(!isEditing)}>
        {isEditing ? 'Save' : 'Edit'}
      </button>
    </div>
  );
}
\`\`\`
-   \`useState\` is called with the desired initial value.
-   For objects and arrays, provide empty objects (\`{}\`) or empty arrays (\`[]\`) respectively.
-   For booleans, \`true\` or \`false\` are common starting points.
-   This ensures that when the component first renders, these state variables have concrete values, preventing \`null\` or \`undefined\` issues.`,
      quickRules: `**Quick rules:**
-   ✅ Always provide an initial value to \`useState\`.
-   ✅ Ensure the initial value's type matches the expected type of the state variable.
-   ✅ For objects, initialize with an empty object \`{}\` or an object with default property values.
-   ✅ For arrays, initialize with an empty array \`[]\`.
-   ❌ Never leave the initial state as \`undefined\` if the state is expected to be an object, array, or specific primitive.
-   ❌ Don't use \`null\` as an initial state if an empty string, empty object, or empty array is more appropriate for the type.
-   ❌ Avoid complex calculations for initial state; keep it simple and direct.`,
      watchOut: `👀 **Watch out:** If your initial state depends on props that might change, the \`useState\` hook's initial value is only used on the *first* render. Subsequent prop changes will not automatically update the state. For such scenarios, you might need \`useEffect\` to synchronize state with prop changes, or consider if the data should be managed as state at all, rather than derived directly from props.`,
      dryRun: `🔁 **Think:** The \`SubmissionForm\` component is rendered for the first time.
1.  \`useState<FormData>({ title: '', description: '' })\` is called. \`formData\` is set to \`{ title: '', description: '' }\`.
2.  \`useState<FormErrors>({})\` is called. \`formErrors\` is set to \`{}\`.
3.  \`useState<boolean>(false)\` is called. \`isSubmitting\` is set to \`false\`.
4.  The component renders, accessing \`formData.title\` (which is '') and \`isSubmitting\` (which is false).
5.  If \`formData\` was initialized to \`undefined\`, accessing \`formData.title\` would cause a runtime error.
(Hint: Trace the exact values assigned to each state variable upon initial component mount.)`,
      build: `**Learning focus:** Initialize the form's data, error, and submission status state variables with appropriate default values.`,
    },
  },
  {
    id: "step5_structureSkeleton",
    type: "question",
    phase: "Step 5 of 7",
    paal: "Let's build the basic HTML structure for our form. Replace the 'Form goes here' placeholder with a `<form>` element. Inside it, include two `<div>` blocks, one for 'Title' and one for 'Description'. Each `<div>` should contain a `<label>` and an `<input type='text'>`. Also, add a `<button type='submit'>` at the bottom. Display any `formErrors.title` or `formErrors.description` messages below their respective inputs using a `<p>` tag with a red style.",
    hint: "Use `htmlFor` for labels, `name` and `id` for inputs. Remember to conditionally render error messages.",
    example_code: `function SubmissionForm({ onSubmit }: { onSubmit: (data: FormData) => Promise<void> }) {
  // ... state variables ...

  return (
    <form>
      {/* Title field */}
      <div>
        <label htmlFor="title">Title:</label>
        <input type="text" id="title" name="title" />
        {/* Error message for title */}
      </div>

      {/* Description field */}
      <div>
        <label htmlFor="description">Description:</label>
        <input type="text" id="description" name="description" />
        {/* Error message for description */}
      </div>

      <button type="submit">Submit</button>
    </form>
  );
}`,
    think_prompt: "How do you structure the form elements, link labels to inputs, and conditionally display error messages?",
    mc_options: [
      `<form>
  <div>
    <label for="title">Title:</label>
    <input type="text" id="title" name="title" />
    {formErrors.title && <p style={{ color: 'red' }}>{formErrors.title}</p>}
  </div>
  <div>
    <label for="description">Description:</label>
    <input type="text" id="description" name="description" />
    {formErrors.description && <p style={{ color: 'red' }}>{formErrors.description}</p>}
  </div>
  <button type="submit">Submit</button>
</form>`,
      `<form>
  <div>
    <label htmlFor="title">Title:</label>
    <input type="text" id="title" name="title" />
    {formErrors.title ? <p style={{ color: 'red' }}>{formErrors.title}</p> : null}
  </div>
  <div>
    <label htmlFor="description">Description:</label>
    <input type="text" id="description" name="description" />
    {formErrors.description ? <p style={{ color: 'red' }}>{formErrors.description}</p> : null}
  </div>
  <button type="submit">Submit</button>
</form>`,
      `<form>
  <div>
    <label htmlFor="title">Title:</label>
    <input type="text" id="title" name="title" />
    {formErrors.title && <p style={{ color: 'red' }}>{formErrors.title}</p>}
  </div>
  <div>
    <label htmlFor="description">Description:</label>
    <input type="text" id="description" name="description" />
    {formErrors.description && <p style={{ color: 'red' }}>{formErrors.description}</p>}
  </div>
  <button type="submit">Submit</button>
</form>`,
    ],
    mc_correct_option: `<form>
  <div>
    <label htmlFor="title">Title:</label>
    <input type="text" id="title" name="title" />
    {formErrors.title && <p style={{ color: 'red' }}>{formErrors.title}</p>}
  </div>
  <div>
    <label htmlFor="description">Description:</label>
    <input type="text" id="description" name="description" />
    {formErrors.description && <p style={{ color: 'red' }}>{formErrors.description}</p>}
  </div>
  <button type="submit">Submit</button>
</form>`,
    mc_anchor: `<form>
  <div>
    <label htmlFor="title">Title:</label>
    <input type="text" id="title" name="title" />
    {formErrors.title && <p style={{ color: 'red' }}>{formErrors.title}</p>}
  </div>
  <div>
    <label htmlFor="description">Description:</label>
    <input type="text" id="description" name="description" />
    {formErrors.description && <p style={{ color: 'red' }}>{formErrors.description}</p>}
  </div>
  <button type="submit">Submit</button>
</form>`,
    why_this_matters: "A well-structured form with proper labels and clear error displays is fundamental for accessibility and user experience. Linking labels to inputs (`htmlFor`) ensures screen readers correctly associate them, and immediate, visible error feedback guides users to correct their input efficiently, preventing frustration.",
    answer_keywords: ["form structure", "label", "input", "error display", "conditional rendering", "htmlFor"],
    seed_code: `import { useState } from "react";

interface FormData {
  title: string;
  description: string;
}

interface FormErrors {
  title?: string;
  description?: string;
}

function SubmissionForm({ onSubmit }: { onSubmit: (data: FormData) => Promise<void> }) {
  const [formData, setFormData] = useState<FormData>({ title: '', description: '' });
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  return (
    <div>
      Form goes here
    </div>
  );
}
`,
    starter_code: `import { useState } from "react";

interface FormData {
  title: string;
  description: string;
}

interface FormErrors {
  title?: string;
  description?: string;
}

function SubmissionForm({ onSubmit }: { onSubmit: (data: FormData) => Promise<void> }) {
  const [formData, setFormData] = useState<FormData>({ title: '', description: '' });
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  return (
    // Replace this div with the form structure
    <div>
      Form goes here
    </div>
  );
}
`,
    feedback_correct: "Spot on! This structure provides a solid foundation for user input and error display.",
    feedback_partial: "You've got the form elements, but double-check the `htmlFor` attribute for labels and ensure error messages are conditionally rendered.",
    feedback_wrong: "Remember that `for` is a reserved keyword in JavaScript, so JSX uses `htmlFor`. Also, ensure error messages only appear when they exist.",
    expected: `import { useState } from "react";

interface FormData {
  title: string;
  description: string;
}

interface FormErrors {
  title?: string;
  description?: string;
}

function SubmissionForm({ onSubmit }: { onSubmit: (data: FormData) => Promise<void> }) {
  const [formData, setFormData] = useState<FormData>({ title: '', description: '' });
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  return (
    <form>
      <div>
        <label htmlFor="title">Title:</label>
        <input type="text" id="title" name="title" />
        {formErrors.title && <p style={{ color: 'red' }}>{formErrors.title}</p>}
      </div>

      <div>
        <label htmlFor="description">Description:</label>
        <input type="text" id="description" name="description" />
        {formErrors.description && <p style={{ color: 'red' }}>{formErrors.description}</p>}
      </div>

      <button type="submit">Submit</button>
    </form>
  );
}
`,
    analog_example: `// A simple checkbox with a label and conditional help text:
import { useState } from 'react';

function SettingsToggle() {
  const [isEnabled, setIsEnabled] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  return (
    <div>
      <label htmlFor="notifications">Enable Notifications:</label>
      <input
        type="checkbox"
        id="notifications"
        checked={isEnabled}
        onChange={(e) => setIsEnabled(e.target.checked)}
      />
      <button onClick={() => setShowHelp(!showHelp)}>
        {showHelp ? 'Hide Info' : 'Show Info'}
      </button>
      {showHelp && (
        <p style={{ fontSize: '0.8em', color: 'gray' }}>
          Enabling notifications will send alerts to your registered email.
        </p>
      )}
    </div>
  );
}`,
    deepDiveLabel: "Why is semantic HTML and conditional rendering important for forms?",
    deepDive: {
      hook: `Imagine trying to fill out a paper form where the labels are randomly placed, some fields are missing, and error messages just appear somewhere on the page without pointing to the specific problem. It would be a nightmare! Now imagine that digitally, but for someone who can't see the screen and relies on a screen reader. If your HTML isn't semantic (e.g., using a \`div\` instead of a \`label\` for text associated with an input) or if error messages aren't clearly linked, the user experience becomes completely broken. This isn't just about aesthetics; it's about making your application usable for everyone and ensuring clarity for all users.`,
      pain: `⚠️ **Lesson:** Semantic HTML and clear conditional rendering are critical for accessibility, usability, and maintainability of forms. Symptom: Poorly structured forms lead to inaccessible user interfaces, confusing error feedback, and increased cognitive load for users, especially those relying on assistive technologies.`,
      mentalModel: `**Mental model:** The Guided Conversation. Think of a form as a conversation between the user and the application. Semantic HTML elements like \`label\` and \`input\` are like clear questions and designated spaces for answers. The \`htmlFor\` attribute is like drawing a line from the question to its specific answer box. Conditional rendering of error messages is like the application politely interrupting the user to say, "Hold on, I think you missed something here," pointing directly to the problem. This guided conversation ensures the user understands what's expected and receives immediate, relevant feedback.`,
      discover: `Semantic HTML elements and conditional rendering improve form usability.
\`\`\`tsx
function UserInputForm() {
  const [username, setUsername] = useState('');
  const [usernameError, setUsernameError] = useState('');

  // ... (validation logic would set usernameError)

  return (
    <form>
      <div>
        {/* 1. <label> linked to <input> via htmlFor/id */}
        <label htmlFor="username-input">Username:</label>
        <input 
          type="text" 
          id="username-input" 
          name="username" 
          value={username} 
          onChange={(e) => setUsername(e.target.value)} 
          aria-describedby="username-error" // 2. ARIA attribute for accessibility
        />
        {/* 3. Conditional rendering of error message */}
        {usernameError && (
          <p id="username-error" style={{ color: 'red' }}>
            {usernameError}
          </p>
        )}
      </div>
      <button type="submit">Register</button>
    </form>
  );
}
\`\`\`
-   \`label\` elements with \`htmlFor\` attribute are crucial for accessibility, linking text to its corresponding input.
-   \`id\` and \`name\` attributes on inputs are important for both JavaScript access and form submission.
-   Conditional rendering (\`{condition && <Element />}\`) ensures error messages only appear when relevant.
-   Using \`aria-describedby\` further enhances accessibility by programmatically linking error messages to inputs.`,
      quickRules: `**Quick rules:**
-   ✅ Always use a \`label\` element for every form input, linked with \`htmlFor\` and \`id\`.
-   ✅ Use \`type="submit"\` for form submission buttons.
-   ✅ Conditionally render error messages only when they are present and relevant.
-   ✅ Use semantic HTML elements (\`<form>\`, \`<input>\`, \`<button>\`) for their intended purpose.
-   ❌ Never use a \`div\` or \`span\` as a substitute for a \`label\`.
-   ❌ Don't display error messages when the input is valid or empty.
-   ❌ Avoid using inline styles for complex styling; prefer CSS classes.`,
      watchOut: `👀 **Watch out:** While \`htmlFor\` is great, for more complex error scenarios or when an input might have multiple associated descriptions (like a hint and an error), consider using ARIA attributes like \`aria-labelledby\` and \`aria-describedby\`. These provide more flexible ways to associate elements for assistive technologies, ensuring a richer and more accessible user experience.`,
      dryRun: `🔁 **Think:** A user is filling out the form.
1.  Initially, \`formErrors.title\` is \`undefined\` (or an empty string). The \`<p>\` tag for the title error is not rendered.
2.  User types into the title input. \`formErrors.title\` remains \`undefined\`. The error message is still not rendered.
3.  User tries to submit with an empty title. Validation logic runs and sets \`formErrors.title = "Title is required."\`.
4.  The component re-renders. Now \`formErrors.title\` is a truthy string.
5.  The \`<p style={{ color: 'red' }}>{formErrors.title}</p>\` element is rendered, displaying "Title is required." below the title input.
(Hint: Trace the value of 'formErrors.title' and how it dictates the rendering of the error message.)`,
      build: `**Learning focus:** Construct the form's basic HTML structure, including labels, inputs, a submit button, and conditional display for error messages.`,
    },
  },
  {
    id: "step6_handlersLogic",
    type: "question",
    phase: "Step 6 of 7",
    paal: "Now, let's implement the core logic for our form. Create three functions: `handleChange`, `validateForm`, and `handleSubmit`. `handleChange` should update `formData` when an input changes. `validateForm` should check if `title` and `description` are non-empty, updating `formErrors` accordingly, and return `true` if valid, `false` otherwise. `handleSubmit` should prevent default form submission, call `validateForm`, and if valid, set `isSubmitting` to `true`, call the `onSubmit` prop with `formData`, then reset `isSubmitting` and `formData` on completion.",
    hint: "Remember to spread existing state when updating objects. `event.preventDefault()` is key for `handleSubmit`. Use `async/await` for the `onSubmit` prop.",
    example_code: `function SubmissionForm({ onSubmit }: { onSubmit: (data: FormData) => Promise<void> }) {
  // ... state variables ...

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // ... update formData ...
  };

  const validateForm = (): boolean => {
    // ... validation logic ...
    // ... update formErrors ...
    // ... return true/false ...
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    // ... prevent default ...
    // ... validate ...
    // ... if valid: set isSubmitting, call onSubmit, reset isSubmitting/formData ...
  };

  return (
    <form>
      {/* ... form structure ... */}
    </form>
  );
}`,
    think_prompt: "How do you correctly update nested state in `handleChange`, perform validation and update `formErrors` in `validateForm`, and handle the asynchronous `onSubmit` call in `handleSubmit`?",
    mc_options: [
      `const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const { name, value } = e.target;
  setFormData({ ...formData, [name]: value });
};

const validateForm = (): boolean => {
  let errors: FormErrors = {};
  if (!formData.title.trim()) errors.title = 'Title is required.';
  if (!formData.description.trim()) errors.description = 'Description is required.';
  setFormErrors(errors);
  return Object.keys(errors).length === 0;
};

const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  if (validateForm()) {
    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      setFormData({ title: '', description: '' }); // Reset form
      setFormErrors({}); // Clear errors
    } catch (error) {
      console.error('Submission failed:', error);
      // Optionally set a general error message
    } finally {
      setIsSubmitting(false);
    }
  }
};`,
      `const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  formData[e.target.name] = e.target.value; // Direct modification - WRONG
};

const validateForm = (): boolean => {
  if (!formData.title) return false;
  if (!formData.description) return false;
  return true;
};

const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  if (validateForm()) {
    onSubmit(formData); // Not awaiting - WRONG
  }
};`,
      `const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  setFormData({ [e.target.name]: e.target.value }); // Overwrites other fields - WRONG
};

const validateForm = (): boolean => {
  const errors: FormErrors = {};
  if (formData.title === '') errors.title = 'Title cannot be empty.';
  setFormErrors(errors);
  return Object.keys(errors).length === 0;
};

const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  if (validateForm()) {
    setIsSubmitting(true);
    await onSubmit(formData);
    setIsSubmitting(false);
  }
};`,
    ],
    mc_correct_option: `const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const { name, value } = e.target;
  setFormData({ ...formData, [name]: value });
};

const validateForm = (): boolean => {
  let errors: FormErrors = {};
  if (!formData.title.trim()) errors.title = 'Title is required.';
  if (!formData.description.trim()) errors.description = 'Description is required.';
  setFormErrors(errors);
  return Object.keys(errors).length === 0;
};

const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  if (validateForm()) {
    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      setFormData({ title: '', description: '' }); // Reset form
      setFormErrors({}); // Clear errors
    } catch (error) {
      console.error('Submission failed:', error);
      // Optionally set a general error message
    } finally {
      setIsSubmitting(false);
    }
  }
};`,
    mc_anchor: `const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const { name, value } = e.target;
  setFormData({ ...formData, [name]: value });
};

const validateForm = (): boolean => {
  let errors: FormErrors = {};
  if (!formData.title.trim()) errors.title = 'Title is required.';
  if (!formData.description.trim()) errors.description = 'Description is required.';
  setFormErrors(errors);
  return Object.keys(errors).length === 0;
};

const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  if (validateForm()) {
    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      setFormData({ title: '', description: '' }); // Reset form
      setFormErrors({}); // Clear errors
    } catch (error) {
      console.error('Submission failed:', error);
      // Optionally set a general error message
    } finally {
      setIsSubmitting(false);
    }
  }
};`,
    why_this_matters: "These handlers are the brain of our form. `handleChange` ensures inputs are 'controlled' by React state, `validateForm` provides crucial client-side feedback, and `handleSubmit` orchestrates the entire submission process, including preventing default browser behavior, managing loading states, and interacting with the API, ensuring a robust and user-friendly experience.",
    answer_keywords: ["handleChange", "validateForm", "handleSubmit", "event.preventDefault", "async/await", "state update", "form validation"],
    seed_code: `import { useState } from "react";

interface FormData {
  title: string;
  description: string;
}

interface FormErrors {
  title?: string;
  description?: string;
}

function SubmissionForm({ onSubmit }: { onSubmit: (data: FormData) => Promise<void> }) {
  const [formData, setFormData] = useState<FormData>({ title: '', description: '' });
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  return (
    <form>
      <div>
        <label htmlFor="title">Title:</label>
        <input type="text" id="title" name="title" />
        {formErrors.title && <p style={{ color: 'red' }}>{formErrors.title}</p>}
      </div>

      <div>
        <label htmlFor="description">Description:</label>
        <input type="text" id="description" name="description" />
        {formErrors.description && <p style={{ color: 'red' }}>{formErrors.description}</p>}
      </div>

      <button type="submit">Submit</button>
    </form>
  );
}
`,
    starter_code: `import { useState } from "react";

interface FormData {
  title: string;
  description: string;
}

interface FormErrors {
  title?: string;
  description?: string;
}

function SubmissionForm({ onSubmit }: { onSubmit: (data: FormData) => Promise<void> }) {
  const [formData, setFormData] = useState<FormData>({ title: '', description: '' });
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Implement handleChange, validateForm, and handleSubmit here
  
  return (
    <form>
      <div>
        <label htmlFor="title">Title:</label>
        <input type="text" id="title" name="title" />
        {formErrors.title && <p style={{ color: 'red' }}>{formErrors.title}</p>}
      </div>

      <div>
        <label htmlFor="description">Description:</label>
        <input type="text" id="description" name="description" />
        {formErrors.description && <p style={{ color: 'red' }}>{formErrors.description}</p>}
      </div>

      <button type="submit">Submit</button>
    </form>
  );
}
`,
    feedback_correct: "Excellent! These handlers provide the full functionality for managing input, validation, and submission.",
    feedback_partial: "You're close, but ensure `handleChange` correctly updates all fields using the spread operator, and `handleSubmit` properly awaits the `onSubmit` prop.",
    feedback_wrong: "Directly modifying `formData` or not awaiting `onSubmit` will lead to incorrect state and unexpected behavior. Review how to update state immutably and handle asynchronous operations.",
    expected: `import { useState } from "react";

interface FormData {
  title: string;
  description: string;
}

interface FormErrors {
  title?: string;
  description?: string;
}

function SubmissionForm({ onSubmit }: { onSubmit: (data: FormData) => Promise<void> }) {
  const [formData, setFormData] = useState<FormData>({ title: '', description: '' });
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = (): boolean => {
    let errors: FormErrors = {};
    if (!formData.title.trim()) errors.title = 'Title is required.';
    if (!formData.description.trim()) errors.description = 'Description is required.';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevent default browser form submission
    if (validateForm()) {
      setIsSubmitting(true);
      try {
        await onSubmit(formData);
        setFormData({ title: '', description: '' }); // Reset form
        setFormErrors({}); // Clear errors
      } catch (error) {
        console.error('Submission failed:', error);
        // In a real app, you might set a general error message here
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <form>
      <div>
        <label htmlFor="title">Title:</label>
        <input type="text" id="title" name="title" />
        {formErrors.title && <p style={{ color: 'red' }}>{formErrors.title}</p>}
      </div>

      <div>
        <label htmlFor="description">Description:</label>
        <input type="text" id="description" name="description" />
        {formErrors.description && <p style={{ color: 'red' }}>{formErrors.description}</p>}
      </div>

      <button type="submit">Submit</button>
    </form>
  );
}
`,
    analog_example: `// A simple task list where adding a task involves validation:
import { useState } from 'react';

function TaskList() {
  const [newTask, setNewTask] = useState('');
  const [tasks, setTasks] = useState<string[]>([]);
  const [error, setError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewTask(e.target.value);
    setError(''); // Clear error on input change
  };

  const handleAddTask = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (newTask.trim() === '') {
      setError('Task cannot be empty.');
      return;
    }
    setTasks([...tasks, newTask]);
    setNewTask('');
    setError('');
  };

  return (
    <form onSubmit={handleAddTask}>
      <input
        type="text"
        value={newTask}
        onChange={handleInputChange}
        placeholder="Add a new task"
      />
      <button type="submit">Add Task</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <ul>
        {tasks.map((task, index) => (
          <li key={index}>{task}</li>
        ))}
      </ul>
    </form>
  );
}`,
    deepDiveLabel: "How do controlled components and async handlers work together?",
    deepDive: {
      hook: `Imagine a puppet show. If the puppeteer isn't constantly holding the strings and moving the puppet, it just sits there lifelessly. Similarly, if your form inputs aren't "controlled" by React state, they become disconnected from your application's logic. You can't easily read their values, validate them, or reset them. Now, add the complexity of talking to an external API – an action that takes time and might fail. If your component doesn't correctly manage its state during this asynchronous process (e.g., showing a loading spinner, handling errors), the user experience becomes clunky and unreliable. It's like the puppeteer suddenly dropping the strings while the show is still going on.`,
      pain: `⚠️ **Lesson:** Controlled components provide a single source of truth for input values, while asynchronous handlers require careful state management (loading, errors) to maintain a smooth user experience. Symptom: Uncontrolled inputs lead to difficulty in accessing and validating values, and poorly managed async operations result in unresponsive UIs, double submissions, or unhandled errors.`,
      mentalModel: `**Mental model:** The Conductor and the Orchestra. Think of your React component as a conductor, and the form inputs as the musicians. For the music (UI) to be harmonious, the conductor (component) must have complete control over each musician's (input's) performance. This is "controlled components" – the conductor dictates what each musician plays (input's value) and listens for their feedback (onChange event). When the conductor needs to interact with an external orchestra (API), they must manage the timing (\`async/await\`), acknowledge potential delays (\`isSubmitting\`), and handle any wrong notes (errors) gracefully, ensuring the entire performance remains synchronized and professional.`,
      discover: `Controlled components and async handlers are key for robust forms.
\`\`\`tsx
function ControlledInput() {
  const [value, setValue] = useState(''); // 1. State holds the input's value
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value); // 2. Updates state on every change
  };

  const fetchData = async () => {
    setIsLoading(true); // 3. Set loading state
    try {
      const response = await fetch('/api/data'); // 4. Await async operation
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error('Failed to fetch:', error);
    } finally {
      setIsLoading(false); // 5. Reset loading state
    }
  };

  return (
    <div>
      <input type="text" value={value} onChange={handleChange} /> {/* 6. Input value is controlled by state */}
      <button onClick={fetchData} disabled={isLoading}>
        {isLoading ? 'Loading...' : 'Fetch Data'}
      </button>
    </div>
  );
}
\`\`\`
-   **Controlled Components:** The \`value\` prop of an input is tied to a state variable, and the \`onChange\` handler updates that state. This makes React the "single source of truth" for the input's value.
-   **\`async/await\`:** Simplifies asynchronous code, making it look synchronous. \`await\` pauses execution until the Promise resolves.
-   **Loading State:** \`isSubmitting\` (or \`isLoading\`) prevents multiple submissions and provides user feedback during async operations.
-   **\`try...catch...finally\`:** Essential for handling potential errors during API calls and ensuring cleanup (like resetting \`isSubmitting\`) regardless of success or failure.`,
      quickRules: `**Quick rules:**
-   ✅ Always bind input \`value\` props to state variables for controlled components.
-   ✅ Use \`onChange\` handlers to update the state variable for inputs.
-   ✅ Use \`async/await\` for functions that perform asynchronous operations (like API calls).
-   ✅ Implement loading states (\`isSubmitting\`) to provide feedback and prevent double submissions.
-   ❌ Never directly modify the DOM to change input values in React; always update state.
-   ❌ Don't forget to call \`event.preventDefault()\` in form submission handlers to stop browser default behavior.
-   ❌ Avoid unhandled Promises; always include \`catch\` blocks or \`.catch()\` for async operations.`,
      watchOut: `👀 **Watch out:** When dealing with multiple inputs, ensure your \`handleChange\` function correctly updates only the relevant field in your \`formData\` object without overwriting other fields. Using the spread operator (\`{ ...formData, [name]: value }\`) is crucial for immutable updates, preserving existing data while updating a specific property. Forgetting this leads to lost data in other form fields.`,
      dryRun: `🔁 **Think:** A user types "Hello" into the title field and clicks submit.
1.  User types 'H' in title input. \`handleChange\` is called. \`name='title'\`, \`value='H'\`. \`setFormData({ title: 'H', description: '' })\`.
2.  User types 'e', 'l', 'l', 'o'. \`formData\` updates to \`{ title: 'Hello', description: '' }\`.
3.  User clicks submit. \`handleSubmit\` is called. \`e.preventDefault()\` prevents browser refresh.
4.  \`validateForm()\` is called. \`formData.title.trim()\` is 'Hello' (truthy), \`formData.description.trim()\` is '' (falsy).
5.  \`errors.description\` is set to 'Description is required.'. \`setFormErrors({ description: 'Description is required.' })\`.
6.  \`Object.keys(errors).length\` is 1, so \`validateForm\` returns \`false\`.
7.  \`handleSubmit\`'s \`if (validateForm())\` condition is false. The submission logic (setting \`isSubmitting\`, calling \`onSubmit\`) is skipped.
8.  The component re-renders, displaying "Description is required." below the description input.
(Hint: Trace the flow through \`handleChange\`, \`validateForm\`, and \`handleSubmit\`, noting how \`formData\` and \`formErrors\` change.)`,
      build: `**Learning focus:** Implement the \`handleChange\`, \`validateForm\`, and \`handleSubmit\` functions to manage form input, client-side validation, and asynchronous API submission.`,
    },
  },
  {
    id: "step7_wireHandlers",
    type: "question",
    phase: "Step 7 of 7",
    paal: "Finally, let's wire up our form. Connect the `value` and `onChange` props of the `title` and `description` inputs to `formData` and `handleChange` respectively. Attach the `handleSubmit` function to the form's `onSubmit` event. Also, disable the submit button when `isSubmitting` is `true`.",
    hint: "Inputs need both `value` and `onChange` to be controlled. The form needs an `onSubmit` handler. The button needs a `disabled` prop.",
    example_code: `function SubmissionForm({ onSubmit }: { onSubmit: (data: FormData) => Promise<void> }) {
  // ... state and handlers ...

  return (
    <form onSubmit={/* ... */}>
      <div>
        <label htmlFor="title">Title:</label>
        <input
          type="text"
          id="title"
          name="title"
          value={/* ... */}
          onChange={/* ... */}
        />
        {formErrors.title && <p style={{ color: 'red' }}>{formErrors.title}</p>}
      </div>

      <div>
        <label htmlFor="description">Description:</label>
        <input
          type="text"
          id="description"
          name="description"
          value={/* ... */}
          onChange={/* ... */}
        />
        {formErrors.description && <p style={{ color: 'red' }}>{formErrors.description}</p>}
      </div>

      <button type="submit" disabled={/* ... */}>
        Submit
      </button>
    </form>
  );
}`,
    think_prompt: "What are the correct `value`, `onChange`, `onSubmit`, and `disabled` prop assignments to connect the UI to our state and handlers?",
    mc_options: [
      `<form onSubmit={handleSubmit}>
  <div>
    <label htmlFor="title">Title:</label>
    <input type="text" id="title" name="title" value={formData.title} onChange={handleChange} />
    {formErrors.title && <p style={{ color: 'red' }}>{formErrors.title}</p>}
  </div>
  <div>
    <label htmlFor="description">Description:</label>
    <input type="text" id="description" name="description" value={formData.description} onChange={handleChange} />
    {formErrors.description && <p style={{ color: 'red' }}>{formErrors.description}</p>}
  </div>
  <button type="submit" disabled={isSubmitting}>Submit</button>
</form>`,
      `<form onSubmit={handleSubmit()}> // WRONG: calls function immediately
  <div>
    <label htmlFor="title">Title:</label>
    <input type="text" id="title" name="title" value={formData.title} /> // WRONG: no onChange
    {formErrors.title && <p style={{ color: 'red' }}>{formErrors.title}</p>}
  </div>
  <div>
    <label htmlFor="description">Description:</label>
    <input type="text" id="description" name="description" value={formData.description} /> // WRONG: no onChange
    {formErrors.description && <p style={{ color: 'red' }}>{formErrors.description}</p>}
  </div>
  <button type="submit" disabled={isSubmitting}>Submit</button>
</form>`,
      `<form onSubmit={handleSubmit}>
  <div>
    <label htmlFor="title">Title:</label>
    <input type="text" id="title" name="title" value={formData.title} onChange={(e) => setFormData({ title: e.target.value })} /> // WRONG: overwrites description
    {formErrors.title && <p style={{ color: 'red' }}>{formErrors.title}</p>}
  </div>
  <div>
    <label htmlFor="description">Description:</label>
    <input type="text" id="description" name="description" value={formData.description} onChange={(e) => setFormData({ description: e.target.value })} /> // WRONG: overwrites title
    {formErrors.description && <p style={{ color: 'red' }}>{formErrors.description}</p>}
  </div>
  <button type="submit" disabled={isSubmitting}>Submit</button>
</form>`,
    ],
    mc_correct_option: `<form onSubmit={handleSubmit}>
  <div>
    <label htmlFor="title">Title:</label>
    <input type="text" id="title" name="title" value={formData.title} onChange={handleChange} />
    {formErrors.title && <p style={{ color: 'red' }}>{formErrors.title}</p>}
  </div>
  <div>
    <label htmlFor="description">Description:</label>
    <input type="text" id="description" name="description" value={formData.description} onChange={handleChange} />
    {formErrors.description && <p style={{ color: 'red' }}>{formErrors.description}</p>}
  </div>
  <button type="submit" disabled={isSubmitting}>Submit</button>
</form>`,
    mc_anchor: `<form onSubmit={handleSubmit}>
  <div>
    <label htmlFor="title">Title:</label>
    <input type="text" id="title" name="title" value={formData.title} onChange={handleChange} />
    {formErrors.title && <p style={{ color: 'red' }}>{formErrors.title}</p>}
  </div>
  <div>
    <label htmlFor="description">Description:</label>
    <input type="text" id="description" name="description" value={formData.description} onChange={handleChange} />
    {formErrors.description && <p style={{ color: 'red' }}>{formErrors.description}</p>}
  </div>
  <button type="submit" disabled={isSubmitting}>Submit</button>
</form>`,
    why_this_matters: "Wiring the UI elements to our state and handlers is the final step in making the form interactive and functional. This connection ensures that user input is captured, validation is triggered, and the submission process is correctly initiated and managed, providing a complete and responsive user experience.",
    answer_keywords: ["wire up", "value prop", "onChange event", "onSubmit event", "disabled prop", "controlled component"],
    seed_code: `import { useState } from "react";

interface FormData {
  title: string;
  description: string;
}

interface FormErrors {
  title?: string;
  description?: string;
}

function SubmissionForm({ onSubmit }: { onSubmit: (data: FormData) => Promise<void> }) {
  const [formData, setFormData] = useState<FormData>({ title: '', description: '' });
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = (): boolean => {
    let errors: FormErrors = {};
    if (!formData.title.trim()) errors.title = 'Title is required.';
    if (!formData.description.trim()) errors.description = 'Description is required.';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevent default browser form submission
    if (validateForm()) {
      setIsSubmitting(true);
      try {
        await onSubmit(formData);
        setFormData({ title: '', description: '' }); // Reset form
        setFormErrors({}); // Clear errors
      } catch (error) {
        console.error('Submission failed:', error);
        // In a real app, you might set a general error message here
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <form>
      <div>
        <label htmlFor="title">Title:</label>
        <input type="text" id="title" name="title" />
        {formErrors.title && <p style={{ color: 'red' }}>{formErrors.title}</p>}
      </div>

      <div>
        <label htmlFor="description">Description:</label>
        <input type="text" id="description" name="description" />
        {formErrors.description && <p style={{ color: 'red' }}>{formErrors.description}</p>}
      </div>

      <button type="submit">Submit</button>
    </form>
  );
}
`,
    starter_code: `import { useState } from "react";

interface FormData {
  title: string;
  description: string;
}

interface FormErrors {
  title?: string;
  description?: string;
}

function SubmissionForm({ onSubmit }: { onSubmit: (data: FormData) => Promise<void> }) {
  const [formData, setFormData] = useState<FormData>({ title: '', description: '' });
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = (): boolean => {
    let errors: FormErrors = {};
    if (!formData.title.trim()) errors.title = 'Title is required.';
    if (!formData.description.trim()) errors.description = 'Description is required.';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevent default browser form submission
    if (validateForm()) {
      setIsSubmitting(true);
      try {
        await onSubmit(formData);
        setFormData({ title: '', description: '' }); // Reset form
        setFormErrors({}); // Clear errors
      } catch (error) {
        console.error('Submission failed:', error);
        // In a real app, you might set a general error message here
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <form>
      <div>
        <label htmlFor="title">Title:</label>
        <input type="text" id="title" name="title" /* Add value and onChange here */ />
        {formErrors.title && <p style={{ color: 'red' }}>{formErrors.title}</p>}
      </div>

      <div>
        <label htmlFor="description">Description:</label>
        <input type="text" id="description" name="description" /* Add value and onChange here */ />
        {formErrors.description && <p style={{ color: 'red' }}>{formErrors.description}</p>}
      </div>

      <button type="submit" /* Add disabled prop here */>Submit</button>
    </form>
  );
}
`,
    feedback_correct: "Fantastic! Your form is now fully wired, interactive, and ready to handle user input and submissions with validation.",
    feedback_partial: "You've connected most elements, but ensure both `value` and `onChange` are present for each input, and the `disabled` prop is correctly applied to the button.",
    feedback_wrong: "Forgetting `value` or `onChange` makes inputs uncontrolled. Calling `handleSubmit()` instead of passing `handleSubmit` will execute it immediately. Review how to connect controlled components and event handlers.",
    expected: `import { useState } from "react";

interface FormData {
  title: string;
  description: string;
}

interface FormErrors {
  title?: string;
  description?: string;
}

function SubmissionForm({ onSubmit }: { onSubmit: (data: FormData) => Promise<void> }) {
  const [formData, setFormData] = useState<FormData>({ title: '', description: '' });
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = (): boolean => {
    let errors: FormErrors = {};
    if (!formData.title.trim()) errors.title = 'Title is required.';
    if (!formData.description.trim()) errors.description = 'Description is required.';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevent default browser form submission
    if (validateForm()) {
      setIsSubmitting(true);
      try {
        await onSubmit(formData);
        setFormData({ title: '', description: '' }); // Reset form
        setFormErrors({}); // Clear errors
      } catch (error) {
        console.error('Submission failed:', error);
        // In a real app, you might set a general error message here
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="title">Title:</label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
        />
        {formErrors.title && <p style={{ color: 'red' }}>{formErrors.title}</p>}
      </div>

      <div>
        <label htmlFor="description">Description:</label>
        <input
          type="text"
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
        />
        {formErrors.description && <p style={{ color: 'red' }}>{formErrors.description}</p>}
      </div>

      <button type="submit" disabled={isSubmitting}>
        Submit
      </button>
    </form>
  );
}
`,
    analog_example: `// A simple toggle button wired to state and disabling itself during an async action:
import { useState } from 'react';

function FeatureToggle() {
  const [isEnabled, setIsEnabled] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleToggle = async () => {
    setIsUpdating(true);
    try {
      // Simulate API call to update setting
      await new Promise(resolve => setTimeout(resolve, 1000)); 
      setIsEnabled(prev => !prev); // Toggle state after successful update
      console.log('Setting updated!');
    } catch (error) {
      console.error('Failed to update setting:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div>
      <p>Feature Status: {isEnabled ? 'Enabled' : 'Disabled'}</p>
      <button onClick={handleToggle} disabled={isUpdating}>
        {isUpdating ? 'Updating...' : (isEnabled ? 'Disable' : 'Enable')}
      </button>
    </div>
  );
}`,
    deepDiveLabel: "What are 'controlled components' and why are they essential?",
    deepDive: {
      hook: `Imagine a car where the steering wheel isn't connected to the wheels, or the accelerator pedal doesn't control the engine. You'd be sitting in a vehicle that looks like a car but is utterly unresponsive to your commands. In web development, an "uncontrolled component" is similar: an input field that manages its own state internally, completely detached from your React component's logic. You can see the user typing, but your component has no direct knowledge of what's in the input, making it impossible to validate, pre-fill, or reset programmatically. This leads to a disconnected and unmanageable user interface.`,
      pain: `⚠️ **Lesson:** Controlled components provide a single source of truth for input values, enabling predictable behavior, easy validation, and programmatic control. Symptom: Uncontrolled inputs lead to difficulty in accessing current values, inability to reset or pre-fill forms, and complex validation logic that struggles to synchronize with the UI.`,
      mentalModel: `**Mental model:** The Central Command Center. Think of your React component as the central command center for your form. For every input field, the command center (your component's state) issues the exact value that the input should display. When a user types, the input sends a message back to the command center ("I've changed to X!"), and the command center updates its records (state) and then re-issues the new value to the input. This continuous loop ensures that the command center always knows the precise state of every input, allowing it to make informed decisions about validation, submission, and display.`,
      discover: `Controlled components link input values directly to React state.
\`\`\`tsx
function NameInput() {
  const [name, setName] = useState(''); // 1. State variable to hold the input's value

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value); // 2. Update state whenever the input changes
  };

  return (
    <div>
      <label htmlFor="name-field">Name:</label>
      <input
        id="name-field"
        type="text"
        value={name} // 3. The input's value is controlled by the 'name' state
        onChange={handleNameChange} // 4. The 'onChange' event updates the 'name' state
      />
      <p>Current Name: {name}</p>
      <button onClick={() => setName('')}>Clear Name</button> {/* 5. State can be updated programmatically */}
    </div>
  );
}
\`\`\`
-   The \`value\` prop of the input is directly bound to a state variable (\`name\`).
-   The \`onChange\` event handler updates this state variable (\`setName\`).
-   This creates a "controlled component" where React state is the single source of truth for the input's value.
-   It allows for easy access to the current value, programmatic resets, and real-time validation.`,
      quickRules: `**Quick rules:**
-   ✅ Always set the \`value\` prop of an input to a state variable.
-   ✅ Always provide an \`onChange\` handler that updates the corresponding state variable.
-   ✅ Use the \`name\` attribute on inputs to identify them in a generic \`handleChange\` function.
-   ✅ Leverage the \`disabled\` prop on buttons to prevent multiple submissions during async operations.
-   ❌ Never omit the \`onChange\` handler for a controlled input; it will become read-only.
-   ❌ Don't try to directly manipulate the DOM to change input values in a React controlled component.
-   ❌ Avoid passing a function call (e.g., \`onSubmit={handleSubmit()}\`) directly to an event handler; pass the function reference (e.g., \`onSubmit={handleSubmit}\`).`,
      watchOut: `👀 **Watch out:** If you provide a \`value\` prop to an input but forget the \`onChange\` handler, the input will become read-only. Users will be able to see the initial value but won't be able to type anything into it, as the component has no way to update its internal state to reflect their input. This is a common mistake when first learning controlled components.`,
      dryRun: `🔁 **Think:** A user types "Hello" into the title input.
1.  Initial state: \`formData.title\` is \`''\`. The input displays an empty string.
2.  User types 'H'. The input's \`onChange\` event fires.
3.  \`handleChange\` is called. \`e.target.name\` is 'title', \`e.target.value\` is 'H'.
4.  \`setFormData({ ...formData, title: 'H' })\` is called. \`formData\` becomes \`{ title: 'H', description: '' }\`.
5.  The component re-renders. The title input's \`value\` prop is now 'H'. The input displays 'H'.
6.  User types 'e'. \`handleChange\` is called. \`e.target.name\` is 'title', \`e.target.value\` is 'He'.
7.  \`setFormData({ ...formData, title: 'He' })\` is called. \`formData\` becomes \`{ title: 'He', description: '' }\`.
8.  The component re-renders. The title input's \`value\` prop is now 'He'. The input displays 'He'.
(Hint: Trace how the 'value' prop of the input is always synchronized with 'formData.title' via 'onChange' and 'setFormData'.)`,
      build: `**Learning focus:** Connect the form's UI elements (inputs, form, button) to the component's state and event handlers to create a fully interactive and controlled form.`,
    },
  },
];

const sideItems = [
  { label: "Lesson", id: "intro" },
  { label: "Objectives", id: "objectives" },
  { label: "Imports", id: "step1_imports" },
  { label: "Module Types", id: "step2_types" },
  { label: "Component Shell", id: "step3_componentShell" },
  { label: "State Variables", id: "step4_stateVariables" },
  { label: "Structure Skeleton", id: "step5_structureSkeleton" },
  { label: "Handlers & Logic", id: "step6_handlersLogic" },
  { label: "Wire Handlers", id: "step7_wireHandlers" },
];

export default createINPACTEngine({
  NODES,
  sideItems,
  lessonNum: 0, // Assistance modules are not part of a numbered track
  title: "Form Validation & API Submission",
  shortName: "Form Submit",
});
