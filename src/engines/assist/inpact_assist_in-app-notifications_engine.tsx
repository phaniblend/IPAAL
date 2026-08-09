import createINPACTEngine from "../inpact_engine_shared";
import { useState } from 'react';

export const NODES = [
  {
    id: "intro",
    type: "reveal",
    phase: "Lesson",
    content: {
      tag: "in-app-notifications",
      title: "In-App Notifications: Keeping Users Informed",
      body: `In modern applications, users often perform actions that take time to complete or trigger background processes. Without immediate feedback, users might feel uncertain about the status of their requests, leading to frustration, repeated actions, or a perception that the application is unresponsive. In-app notifications solve this by providing timely, contextual updates directly within the user interface, ensuring users are always aware of important changes or outcomes without needing to leave the application or check external channels like email. This pattern enhances user experience by offering transparency and reducing cognitive load.

This fundamental pattern appears across a wide range of applications. You'll see it in chat applications signaling new messages, task management tools indicating task completion, social media platforms notifying of new interactions, or development environments showing the status of a build process. Mastering in-app notifications is key to building responsive and user-friendly software, as it allows you to communicate dynamic information effectively and keep users engaged with their ongoing workflows.`,
      usecase: `Imagine a user initiates a complex data export that might take several minutes to process. Instead of making them wait on a loading screen or sending an email, an in-app notification can appear when the export is complete, allowing them to continue using the application in the meantime and then download the file when ready.`,
    },
  },
  {
    id: "objectives",
    type: "objectives",
    phase: "Objectives",
    items: [
      "Define a consistent data structure for notifications.",
      "Create a functional component to display dynamic content.",
      "Manage a list of notifications and their read status using state.",
      "Render dynamic lists of data in the user interface.",
      "Implement logic to update individual items within a state array.",
      "Connect user interactions to state-modifying functions.",
      "Simulate the arrival of new, asynchronous updates.",
    ],
  },
  {
    id: "step1",
    type: "question",
    phase: "Step 1 of 8",
    paal: "Before building our notification system, we need a clear blueprint for what a notification actually is. Defining a type or interface helps ensure all notifications have a consistent structure, making them easier to manage and display.",
    hint: "Think about the essential pieces of information every notification needs: a unique identifier, its message, and whether it has been seen yet.",
    example_code: `interface UserProfile {
  id: string;
  name: string;
  email: string;
}`,
    mc_options: [
      "Define a class `Notification` with properties like `message` and `timestamp`.",
      "Create an `interface Notification` with `id`, `message`, and `isRead` properties.",
      "Use a simple `type Notification = string;` to store just the message.",
    ],
    mc_correct_option: "Create an `interface Notification` with `id`, `message`, and `isRead` properties.",
    mc_anchor: "interface Notification",
    why_this_matters: "A well-defined type acts as a contract, ensuring that every piece of data conforms to an expected shape. This prevents errors, improves code readability, and makes it easier for different parts of your application to interact with notification data reliably.",
    answer_keywords: ["interface", "type definition", "structure"],
    seed_code: ``,
    starter_code: `// Define the Notification interface here`,
    feedback_correct: "Excellent! Defining an interface provides a clear, type-safe contract for all our notification objects.",
    feedback_partial: "You're on the right track with defining a structure, but an interface is generally preferred for defining object shapes in TypeScript. Also, consider what properties are essential for managing read status.",
    feedback_wrong: "While a string could hold a message, it lacks the structure to manage other crucial aspects like a unique ID or read status. An interface is much better for defining complex data shapes.",
    expected: `interface Notification {
  id: string;
  message: string;
  isRead: boolean;
}`,
    analog_example: `interface TodoItem {
  id: string;
  text: string;
  isCompleted: boolean;
}`,
    deepDiveLabel: "Why use an interface for data structures?",
    deepDive: {
      hook: "Imagine you're building a house, and you tell your team to 'build a wall.' Without a blueprint, one person might use bricks, another wood, and a third might forget to add a window frame. The result is chaos, mismatched parts, and a house that might not stand. In software, when you deal with data, a similar problem arises if you don't define its structure. You might expect a 'name' field, but get 'fullName' or 'firstName' and 'lastName' separately. This leads to constant checking, 'if' statements, and brittle code that breaks easily when data changes slightly. This lack of a clear contract makes collaboration difficult and introduces countless opportunities for errors.",
      pain: "⚠️ **Lesson:** Inconsistent data structures lead to unpredictable behavior and increased development time. Symptom: Runtime errors due to missing or unexpected properties, difficulty integrating different parts of the application, and a constant need for defensive coding checks (e.g., `if (data && data.property)`), which clutters code and hides underlying structural issues.",
      mentalModel: "**Mental model:** The 'Data Blueprint.' An interface is like a blueprint for a specific type of data. It specifies exactly what properties an object *must* have and what type each property should be. Just as a house blueprint ensures all walls, doors, and windows are built to spec, a data blueprint ensures all objects of that type conform to a consistent structure, making them predictable and reliable. This blueprint is a contract that all developers working on the project can understand and adhere to, preventing misunderstandings and ensuring data integrity.",
      discover: `interface Product {
  id: string;
  name: string;
  price: number;
  inStock: boolean;
}
`,
      quickRules: `
- ✅ Use interfaces to define the shape of objects.
- ✅ Ensure all required properties and their types are explicitly listed.
- ✅ Leverage interfaces for function parameters and return types for clarity.
- ✅ Interfaces promote type safety and catch errors at compile-time.
- ❌ Don't use interfaces for runtime logic or implementation details.
- ❌ Avoid overly complex interfaces with too many optional properties.
- ❌ Never rely on implicit data shapes; always define them explicitly.`,
      watchOut: "👀 **Watch out:** While interfaces provide strong type checking during development, they are completely removed during compilation to JavaScript. This means they offer no runtime validation. If data comes from an external source (like an API), you still need to validate its structure at runtime, even if you've defined an interface for it, to protect against unexpected external data formats.",
      dryRun: "🔁 **Think:** Imagine a new `Notification` object is created: `{ id: 'abc', message: 'New update available!', isRead: false }`. Does this object conform to our `Notification` interface? Yes, it has an `id` (string), `message` (string), and `isRead` (boolean). What if we tried to create `{ id: 123, message: 'Hello' }`? The `id` type would be wrong (number instead of string), and `isRead` would be missing. The TypeScript compiler would immediately flag these as errors, preventing potential issues before the code even runs. (Hint: Type checking happens at development time, not runtime.)",
      build: "**Learning focus:** Define a clear and consistent data structure for notifications using an interface.",
    },
  },
  {
    id: "step2",
    type: "question",
    phase: "Step 2 of 8",
    paal: "Now that we have a blueprint for our notifications, let's create the main container component that will display them. This component will be responsible for holding and rendering all the notification-related UI.",
    hint: "Start with a simple functional component that returns a basic `div` element. Remember, no `React.FC`!",
    example_code: `function GreetingDisplay() {
  return (
    <div>
      Hello there!
    </div>
  );
}`,
    mc_options: [
      "Define a class component `NotificationCenter extends React.Component`.",
      "Create a function `NotificationCenter()` that returns `<div>Notification Center</div>`.",
      "Write `const NotificationCenter: React.FC = () => { ... }`.",
    ],
    mc_correct_option: "Create a function `NotificationCenter()` that returns `<div>Notification Center</div>`.",
    mc_anchor: "function NotificationCenter()",
    why_this_matters: "A component acts as a self-contained building block for your UI. By creating a dedicated `NotificationCenter` component, we encapsulate all notification logic and presentation, making it reusable, easier to understand, and simpler to maintain.",
    answer_keywords: ["functional component", "component shell", "return JSX"],
    seed_code: `interface Notification {
  id: string;
  message: string;
  isRead: boolean;
}`,
    starter_code: `interface Notification {
  id: string;
  message: string;
  isRead: boolean;
}

// Create the NotificationCenter component here`,
    feedback_correct: "Spot on! A plain functional component is the modern and recommended way to build UI elements.",
    feedback_partial: "You're close, but avoid using `React.FC` as it adds unnecessary complexity and is often discouraged. A simple function declaration is all you need.",
    feedback_wrong: "Class components are an older pattern. Modern applications primarily use functional components due to their simplicity and better integration with hooks.",
    expected: `interface Notification {
  id: string;
  message: string;
  isRead: boolean;
}

function NotificationCenter() {
  return (
    <div>
      <h2>Notifications</h2>
    </div>
  );
}`,
    analog_example: `function UserProfileCard() {
  return (
    <div className="card">
      <h3>User Profile</h3>
      <p>Details will go here.</p>
    </div>
  );
}`,
    deepDiveLabel: "What's a functional component and why use it?",
    deepDive: {
      hook: "Imagine you're building a complex machine, like a car. Instead of building the entire car from scratch every time, you break it down into smaller, manageable parts: an engine, wheels, seats, a steering wheel. Each part has a specific job and can be assembled independently. In software, when you try to write all your UI code in one giant file, it quickly becomes unmanageable, hard to debug, and impossible to reuse. You'd find yourself copying and pasting the same button or display logic over and over, leading to inconsistencies and a maintenance nightmare. This is where components come in, acting as modular, reusable pieces of your user interface.",
      pain: "⚠️ **Lesson:** Monolithic UI code is difficult to manage and scale. Symptom: Code duplication, difficulty isolating bugs, poor readability, and a high barrier to entry for new developers trying to understand the codebase. Changes in one part of the UI can unintentionally break another, leading to a fragile and frustrating development process.",
      mentalModel: "**Mental model:** The 'UI Building Block.' A functional component is like a specialized LEGO brick. It's a simple JavaScript function that takes some inputs (props) and returns a piece of UI (JSX). Just like a LEGO brick, it's self-contained, has a clear purpose, and can be combined with other bricks to build larger, more complex structures. This modularity makes your UI easier to design, build, and maintain. Functional components are favored because they are simpler, easier to test, and integrate seamlessly with hooks for managing state and side effects.",
      discover: `function Button(props: { label: string; onClick: () => void }) {
  return (
    <button onClick={props.onClick}>
      {props.label}
    </button>
  );
}
`,
      quickRules: `
- ✅ Define components as plain JavaScript functions.
- ✅ Ensure components return JSX to describe their UI.
- ✅ Use PascalCase (e.g., \`MyComponent\`) for component names.
- ✅ Components should be focused on a single responsibility.
- ❌ Don't use \`React.FC\` or similar type helpers that add unnecessary complexity.
- ❌ Avoid putting business logic directly inside the component's render return.
- ❌ Never mutate props directly within a component; treat them as read-only.`,
      watchOut: "👀 **Watch out:** While functional components are powerful, they re-execute their entire body on every re-render. This is usually efficient, but for very complex components with heavy computations, you might need optimization techniques like memoization (e.g., `useMemo`, `useCallback`) to prevent unnecessary work. For beginners, focus on clear, simple components first, and optimize only when performance issues are actually observed.",
      dryRun: "🔁 **Think:** When `NotificationCenter` is rendered, what does it produce? It executes the function body. The `return` statement then produces a `div` element containing an `h2` with the text 'Notifications'. If this component were part of a larger application, this `div` and `h2` would become part of the browser's Document Object Model (DOM), visible on the screen. The function simply describes the UI, it doesn't directly manipulate the browser. (Hint: Components are functions that return UI descriptions.)",
      build: "**Learning focus:** Create the basic functional component shell for our notification display.",
    },
  },
  {
    id: "step3",
    type: "question",
    phase: "Step 3 of 8",
    paal: "Our `NotificationCenter` needs to keep track of the actual notifications and their read status. This data is dynamic – it changes over time. To manage this dynamic data within our component, we'll use a special hook called `useState`.",
    hint: "Inside your `NotificationCenter` component, declare a state variable to hold an array of `Notification` objects. Initialize it with a few sample notifications.",
    example_code: `import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <button onClick={() => setCount(count + 1)}>
      Count: {count}
    </button>
  );
}`,
    mc_options: [
      "Declare a global variable `notifications` outside the component.",
      "Use `const notifications = []` inside the component, updating it directly.",
      "Call `useState` inside `NotificationCenter` to manage a `notifications` array and an `unreadCount`.",
    ],
    mc_correct_option: "Call `useState` inside `NotificationCenter` to manage a `notifications` array and an `unreadCount`.",
    mc_anchor: "useState",
    why_this_matters: "State management is fundamental to interactive applications. `useState` allows components to 'remember' data and re-render automatically when that data changes. Without it, our notification list would be static and unable to reflect new notifications or changes in their read status, making the application unresponsive to user actions or external updates.",
    answer_keywords: ["useState", "state variable", "dynamic data", "re-render"],
    seed_code: `interface Notification {
  id: string;
  message: string;
  isRead: boolean;
}

function NotificationCenter() {
  return (
    <div>
      <h2>Notifications</h2>
    </div>
  );
}`,
    starter_code: `import { useState } from 'react'; // Ensure this import is at the very top of the file

interface Notification {
  id: string;
  message: string;
  isRead: boolean;
}

function NotificationCenter() {
  // Declare state variables for notifications and unread count here

  return (
    <div>
      <h2>Notifications</h2>
    </div>
  );
}`,
    feedback_correct: "Perfect! `useState` is the right tool for managing dynamic data within a component, and deriving `unreadCount` is a smart approach.",
    feedback_partial: "You've correctly identified `useState` for managing notifications, but remember to also calculate and store the `unreadCount` for display.",
    feedback_wrong: "Global variables or direct modification of local variables won't trigger component re-renders. `useState` is specifically designed to make components react to data changes.",
    expected: `import { useState } from 'react';

interface Notification {
  id: string;
  message: string;
  isRead: boolean;
}

function NotificationCenter() {
  const [notifications, setNotifications] = useState<Notification[]>([
    { id: '1', message: 'Welcome to your notification center!', isRead: false },
    { id: '2', message: 'Your report is ready for download.', isRead: false },
    { id: '3', message: 'System maintenance scheduled for tonight.', isRead: true },
  ]);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div>
      <h2>Notifications</h2>
    </div>
  );
}`,
    analog_example: `import { useState } from 'react';

interface Product {
  id: string;
  name: string;
  quantity: number;
}

function ShoppingCart() {
  const [cartItems, setCartItems] = useState<Product[]>([
    { id: 'a1', name: 'Milk', quantity: 1 },
    { id: 'b2', name: 'Bread', quantity: 2 },
  ]);

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div>
      <h3>Shopping Cart ({totalItems} items)</h3>
    </div>
  );
}`,
    deepDiveLabel: "How does `useState` make components dynamic?",
    deepDive: {
      hook: "Imagine you have a whiteboard where you write down important information. If that information changes, you erase the old and write the new. But what if you want your entire room to magically rearrange itself every time you update a note on the whiteboard? That's what `useState` helps achieve in a component. Without `useState`, a component is like a static picture; once rendered, it never changes unless its parent forces it to. Any data it holds is fixed. This means you couldn't have a counter that increments, a toggle that flips, or a list that updates with new items, because the component wouldn't 'remember' its internal state or know when to redraw itself. It would be a static display, unresponsive to any changes.",
      pain: "⚠️ **Lesson:** Components without state are static and non-interactive. Symptom: Inability to respond to user input, display dynamic data, or reflect changes over time, leading to a dull and unresponsive user experience. Users would be unable to interact with the application in any meaningful way, as their actions would have no visible effect.",
      mentalModel: "**Mental model:** The 'Component's Memory Bank.' `useState` provides a component with its own private, persistent memory bank. When you call `useState`, you get two things: the current value stored in that memory slot (the state variable) and a special pen (the setter function) to write a *new* value into it. Crucially, when you use the 'pen' to write a new value, the component automatically knows to 'look at the whiteboard again' (re-render) with the updated information, ensuring the UI always reflects the latest state. This automatic re-rendering is the magic that makes components dynamic and interactive.",
      discover: `import { useState } from 'react';

function ToggleButton() {
  const [isOn, setIsOn] = useState(false); // 1. Declare state

  const handleClick = () => {
    setIsOn(!isOn); // 2. Update state using the setter
  };

  return (
    <button onClick={handleClick}>
      {isOn ? 'ON' : 'OFF'} {/* 3. Display state */}
    </button>
  );
}
`,
      quickRules: `
- ✅ Call \`useState\` only inside functional components or custom hooks.
- ✅ \`useState\` returns an array: \`[currentStateValue, setterFunction]\`.
- ✅ Always use the setter function (\`setX\`) to update state; never modify state directly.
- ✅ When updating state based on the previous state, use the functional update form (\`setX(prevX => ...)\`) for reliability.
- ❌ Don't call \`useState\` inside loops, conditions, or nested functions.
- ❌ Never mutate objects or arrays directly in state; always create new copies.
- ❌ Avoid creating too many small, independent state variables if they are logically related.`,
      watchOut: "👀 **Watch out:** When updating state that is an object or an array, you must create a *new* object or array with the changes, rather than modifying the existing one. For example, to add an item to an array, you'd use `setItems([...prevItems, newItem])`, not `prevItems.push(newItem)`. This immutability is crucial for React to detect changes and optimize re-renders, as it compares references, not deep contents.",
      dryRun: "🔁 **Think:**\n1. Initial render: `notifications` is `[{id:'1', isRead:false}, {id:'2', isRead:false}, {id:'3', isRead:true}]`. `unreadCount` is calculated as `2` (notifications '1' and '2').\n2. A user clicks to mark notification '1' as read. A new array is created: `[{id:'1', isRead:true}, {id:'2', isRead:false}, {id:'3', isRead:true}]`. `setNotifications` is called with this new array.\n3. The component re-renders. `notifications` is now the new array. `unreadCount` is recalculated as `1` (only notification '2' is unread).\n4. The UI updates to show the new `unreadCount` and the changed status of notification '1'.\n(Hint: State updates trigger re-renders, and derived values like `unreadCount` are re-calculated.)",
      build: "**Learning focus:** Implement `useState` to manage the list of notifications and derive the unread count.",
    },
  },
  {
    id: "step4",
    type: "question",
    phase: "Step 4 of 8",
    paal: "With our notifications stored in state, the next step is to display them visually. We'll render the `unreadCount` and then iterate over our `notifications` array to show each one in a list.",
    hint: "Use the `map` array method to transform each `Notification` object into a `div` or `li` element. Don't forget to display the `unreadCount` prominently.",
    example_code: `function ItemList() {
  const items = ['Apple', 'Banana', 'Cherry'];
  return (
    <ul>
      {items.map((item, index) => (
        <li key={index}>{item}</li>
      ))}
    </ul>
  );
}`,
    mc_options: [
      "Manually create a `div` for each notification in the JSX.",
      "Use `notifications.forEach()` to add elements to the DOM directly.",
      "Map over the `notifications` array to render a list of notification messages and the `unreadCount`.",
    ],
    mc_correct_option: "Map over the `notifications` array to render a list of notification messages and the `unreadCount`.",
    mc_anchor: "map over notifications",
    why_this_matters: "Dynamically rendering lists from data is a core pattern in UI development. Using `map` ensures that our UI automatically updates to reflect the current state of our `notifications` array, whether items are added, removed, or changed, without manual intervention. This keeps the UI synchronized with the underlying data.",
    answer_keywords: ["map", "list rendering", "dynamic UI", "key prop"],
    seed_code: `import { useState } from 'react';

interface Notification {
  id: string;
  message: string;
  isRead: boolean;
}

function NotificationCenter() {
  const [notifications, setNotifications] = useState<Notification[]>([
    { id: '1', message: 'Welcome to your notification center!', isRead: false },
    { id: '2', message: 'Your report is ready for download.', isRead: false },
    { id: '3', message: 'System maintenance scheduled for tonight.', isRead: true },
  ]);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div>
      <h2>Notifications</h2>
    </div>
  );
}`,
    starter_code: `import { useState } from 'react';

interface Notification {
  id: string;
  message: string;
  isRead: boolean;
}

function NotificationCenter() {
  const [notifications, setNotifications] = useState<Notification[]>([
    { id: '1', message: 'Welcome to your notification center!', isRead: false },
    { id: '2', message: 'Your report is ready for download.', isRead: false },
    { id: '3', message: 'System maintenance scheduled for tonight.', isRead: true },
  ]);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div>
      <h2>Notifications</h2>
      {/* Display unread count and map over notifications here */}
    </div>
  );
}`,
    feedback_correct: "Excellent! Using `map` is the canonical way to render lists dynamically, and including the `key` prop is crucial for performance.",
    feedback_partial: "You've correctly used `map` to render the list, but ensure you're also displaying the `unreadCount` and providing a unique `key` prop for each list item.",
    feedback_wrong: "Manually creating elements or using `forEach` doesn't leverage the declarative nature of UI frameworks. `map` is designed for transforming data arrays into lists of UI elements.",
    expected: `import { useState } from 'react';

interface Notification {
  id: string;
  message: string;
  isRead: boolean;
}

function NotificationCenter() {
  const [notifications, setNotifications] = useState<Notification[]>([
    { id: '1', message: 'Welcome to your notification center!', isRead: false },
    { id: '2', message: 'Your report is ready for download.', isRead: false },
    { id: '3', message: 'System maintenance scheduled for tonight.', isRead: true },
  ]);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div>
      <h2>Notifications (\${unreadCount} unread)</h2>
      <div style={{ border: '1px solid #ccc', padding: '10px', marginTop: '10px' }}>
        {notifications.map(notification => (
          <div key={notification.id} style={{
            padding: '8px',
            margin: '5px 0',
            backgroundColor: notification.isRead ? '#f0f0f0' : '#e0f7fa',
            borderLeft: notification.isRead ? 'none' : '3px solid #00bcd4'
          }}>
            {notification.message}
          </div>
        ))}
      </div>
    </div>
  );
}`,
    analog_example: `function ProductList() {
  const products = [
    { id: 'p1', name: 'Laptop', price: 1200 },
    { id: 'p2', name: 'Mouse', price: 25 },
    { id: 'p3', name: 'Keyboard', price: 75 },
  ];

  return (
    <div>
      <h3>Available Products</h3>
      <ul>
        {products.map(product => (
          <li key={product.id}>
            \${product.name} - $\${product.price}
          </li>
        ))}
      </ul>
    </div>
  );
}`,
    deepDiveLabel: "Why is `key` important when rendering lists?",
    deepDive: {
      hook: "Imagine you have a list of physical items, say books on a shelf. If you want to rearrange them, add a new one, or remove an old one, you need a way to identify each specific book. If two books have the exact same cover and title, how do you tell them apart when you say 'move *that* book'? In UI, when you render a list of elements, the system faces a similar challenge. If you just tell it 'here are three `div`s,' and then later 'here are three `div`s, but the middle one changed its text,' the system doesn't inherently know *which* `div` changed. It might re-create all three, which is inefficient, or update the wrong one, leading to bugs. This becomes especially problematic with interactive elements that hold their own internal state.",
      pain: "⚠️ **Lesson:** Inefficient list updates and potential UI bugs without unique identifiers. Symptom: Performance issues (slow rendering), incorrect component state being preserved or destroyed, and unexpected visual glitches when list items are reordered, added, or removed. This can lead to a frustrating user experience and difficult-to-diagnose errors.",
      mentalModel: "**Mental model:** The 'Unique ID Tag.' The `key` prop is like a unique ID tag that you attach to each item in a dynamic list. When the list changes (items are added, removed, or reordered), the rendering engine uses these `key` tags to efficiently identify exactly which item is which. Instead of guessing or re-rendering everything, it can precisely track each element, updating only what's necessary and preserving the state of existing elements. This makes list updates fast and reliable, ensuring that user interactions (like input in a form field) are correctly maintained even if the list order changes.",
      discover: `function UserList({ users }: { users: { id: string; name: string }[] }) {
  return (
    <ul>
      {users.map(user => (
        <li key={user.id}> {/* The 'key' prop is crucial here */}
          \${user.name}
        </li>
      ))}
    </ul>
  );
}
`,
      quickRules: `
- ✅ Always provide a \`key\` prop when rendering lists of elements.
- ✅ \`key\` values must be unique among sibling elements in the list.
- ✅ Use stable, unique IDs from your data (e.g., \`item.id\`) as keys.
- ✅ Keys help optimize performance and prevent bugs during list updates.
- ❌ Don't use array \`index\` as a \`key\` if the list items can be reordered, added, or removed.
- ❌ Never use random values (e.g., \`Math.random()\`) as keys, as they change on every render.
- ❌ Avoid duplicate \`key\` values within the same list.`,
      watchOut: "👀 **Watch out:** While using the array index as a `key` might seem convenient (`<li key={index}>`), it's generally discouraged. If your list items can change order, be filtered, or new items are inserted in the middle, using the index as a key can lead to subtle and hard-to-debug bugs where the wrong component state is preserved or elements are updated incorrectly. Always prefer a stable, unique ID from your data source.",
      dryRun: "🔁 **Think:**\n1. Initial render: `notifications` has IDs '1', '2', '3'. The UI renders three `div`s with `key=\"1\"`, `key=\"2\"`, `key=\"3\"`.\n2. A new notification with `id=\"4\"` arrives. The `notifications` array now has '1', '2', '3', '4'.\n3. The rendering engine compares the old list of keys ('1', '2', '3') with the new list ('1', '2', '3', '4').\n4. It sees that '1', '2', '3' are still present and in the same order, so it efficiently reuses their existing DOM elements. It only needs to *create* a new `div` for `key=\"4\"` and append it.\n(Hint: Unique keys allow the system to identify and reuse existing elements efficiently, rather than re-creating them.)",
      build: "**Learning focus:** Display the unread count and render the list of notifications using the `map` method.",
    },
  },
  {
    id: "step5",
    type: "question",
    phase: "Step 5 of 8",
    paal: "Our notification center needs to be interactive. Users should be able to mark notifications as read. This requires a function that can update the `isRead` property of a specific notification within our state.",
    hint: "Create a function that takes a `notificationId` as an argument. Inside this function, use `setNotifications` to create a *new* array where the matching notification's `isRead` property is flipped.",
    example_code: `function TodoList() {
  const [todos, setTodos] = useState([{ id: 'a', text: 'Learn', completed: false }]);

  const toggleComplete = (idToToggle: string) => {
    setTodos(prevTodos =>
      prevTodos.map(todo =>
        todo.id === idToToggle ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  return (
    <button onClick={() => toggleComplete('a')}>Toggle Learn</button>
  );
}`,
    mc_options: [
      "Directly modify the `notifications` array and then call `setNotifications`.",
      "Create a `markAsRead` function that maps over the `notifications` array, updating the `isRead` status of the target notification and returning a new array.",
      "Remove the notification from the array when it's marked as read.",
    ],
    mc_correct_option: "Create a `markAsRead` function that maps over the `notifications` array, updating the `isRead` status of the target notification and returning a new array.",
    mc_anchor: "markAsRead function",
    why_this_matters: "Properly updating state is crucial for predictable UI behavior. By creating a *new* array with the updated notification, we ensure immutability, which helps the rendering engine efficiently detect changes and prevents unexpected side effects in other parts of the application. This pattern is fundamental for managing lists of interactive data.",
    answer_keywords: ["state update", "immutability", "map array", "setter function"],
    seed_code: `import { useState } from 'react';

interface Notification {
  id: string;
  message: string;
  isRead: boolean;
}

function NotificationCenter() {
  const [notifications, setNotifications] = useState<Notification[]>([
    { id: '1', message: 'Welcome to your notification center!', isRead: false },
    { id: '2', message: 'Your report is ready for download.', isRead: false },
    { id: '3', message: 'System maintenance scheduled for tonight.', isRead: true },
  ]);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div>
      <h2>Notifications (\${unreadCount} unread)</h2>
      <div style={{ border: '1px solid #ccc', padding: '10px', marginTop: '10px' }}>
        {notifications.map(notification => (
          <div key={notification.id} style={{
            padding: '8px',
            margin: '5px 0',
            backgroundColor: notification.isRead ? '#f0f0f0' : '#e0f7fa',
            borderLeft: notification.isRead ? 'none' : '3px solid #00bcd4'
          }}>
            \${notification.message}
          </div>
        ))}
      </div>
    </div>
  );
}`,
    starter_code: `import { useState } from 'react';

interface Notification {
  id: string;
  message: string;
  isRead: boolean;
}

function NotificationCenter() {
  const [notifications, setNotifications] = useState<Notification[]>([
    { id: '1', message: 'Welcome to your notification center!', isRead: false },
    { id: '2', message: 'Your report is ready for download.', isRead: false },
    { id: '3', message: 'System maintenance scheduled for tonight.', isRead: true },
  ]);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  // Implement the markAsRead function here

  return (
    <div>
      <h2>Notifications (\${unreadCount} unread)</h2>
      <div style={{ border: '1px solid #ccc', padding: '10px', marginTop: '10px' }}>
        {notifications.map(notification => (
          <div key={notification.id} style={{
            padding: '8px',
            margin: '5px 0',
            backgroundColor: notification.isRead ? '#f0f0f0' : '#e0f7fa',
            borderLeft: notification.isRead ? 'none' : '3px solid #00bcd4'
          }}>
            \${notification.message}
          </div>
        ))}
      </div>
    </div>
  );
}`,
    feedback_correct: "Exactly! Creating a new array with `map` ensures immutability, which is key for reliable state updates.",
    feedback_partial: "You're on the right track with a `markAsRead` function, but remember to use `setNotifications` with a *new* array, not by directly modifying the existing one.",
    feedback_wrong: "Directly modifying the array won't trigger a re-render, leading to a stale UI. Removing the notification isn't marking it as read; it's deleting it.",
    expected: `import { useState } from 'react';

interface Notification {
  id: string;
  message: string;
  isRead: boolean;
}

function NotificationCenter() {
  const [notifications, setNotifications] = useState<Notification[]>([
    { id: '1', message: 'Welcome to your notification center!', isRead: false },
    { id: '2', message: 'Your report is ready for download.', isRead: false },
    { id: '3', message: 'System maintenance scheduled for tonight.', isRead: true },
  ]);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const markAsRead = (notificationId: string) => {
    setNotifications(prevNotifications =>
      prevNotifications.map(notification =>
        notification.id === notificationId
          ? { ...notification, isRead: true }
          : notification
      )
    );
  };

  return (
    <div>
      <h2>Notifications (\${unreadCount} unread)</h2>
      <div style={{ border: '1px solid #ccc', padding: '10px', marginTop: '10px' }}>
        {notifications.map(notification => (
          <div key={notification.id} style={{
            padding: '8px',
            margin: '5px 0',
            backgroundColor: notification.isRead ? '#f0f0f0' : '#e0f7fa',
            borderLeft: notification.isRead ? 'none' : '3px solid #00bcd4'
          }}>
            \${notification.message}
          </div>
        ))}
      </div>
    </div>
  );
}`,
    analog_example: `import { useState } from 'react';

interface Item {
  id: string;
  name: string;
  isSelected: boolean;
}

function ItemSelector() {
  const [items, setItems] = useState<Item[]>([
    { id: 'x', name: 'Option A', isSelected: false },
    { id: 'y', name: 'Option B', isSelected: true },
  ]);

  const toggleSelection = (itemId: string) => {
    setItems(prevItems =>
      prevItems.map(item =>
        item.id === itemId
          ? { ...item, isSelected: !item.isSelected }
          : item
      )
    );
  };

  return (
    <button onClick={() => toggleSelection('x')}>Toggle Option A</button>
  );
}`,
    deepDiveLabel: "Why do we create a *new* array when updating state?",
    deepDive: {
      hook: "Imagine you have a physical photo album. If you want to change a photo, you don't just magically alter the existing one in place; you take it out, make a copy, modify the copy, and then put the new copy back in. If you just drew on the original, you'd lose the ability to revert or track changes easily. In programming, especially with state management, directly modifying an existing array or object (mutation) can lead to subtle and frustrating bugs. The system might not realize a change has occurred, or other parts of your application might still be referencing the old, now-corrupted data, leading to unpredictable behavior and difficult-to-trace errors. This is a common pitfall for beginners.",
      pain: "⚠️ **Lesson:** Direct state mutation leads to unpredictable UI updates and hard-to-debug issues. Symptom: Components not re-rendering when expected, stale data being displayed, unexpected side effects in other components, and difficulty in implementing features like undo/redo. The application's state becomes inconsistent with what's displayed to the user.",
      mentalModel: "**Mental model:** The 'Immutable Snapshot.' When you update state, instead of altering the existing data, you create a brand new 'snapshot' of the data with the changes. This new snapshot is then given to the setter function. The rendering engine compares this new snapshot to the previous one. Because it's a *new* object or array (a new reference in memory), the engine can easily detect that something has changed and efficiently re-render only the affected parts of the UI. This approach guarantees predictability, makes debugging easier, and supports advanced features like time-travel debugging, as you always have distinct versions of your state.",
      discover: `const originalArray = [1, 2, 3];

// ❌ Bad: Direct mutation
// originalArray.push(4); // Modifies the original array

// ✅ Good: Create a new array
const newArray = [...originalArray, 4]; // Uses spread syntax to create a new array
// newArray is [1, 2, 3, 4], originalArray is still [1, 2, 3]

const originalObject = { name: 'Alice', age: 30 };

// ❌ Bad: Direct mutation
// originalObject.age = 31; // Modifies the original object

// ✅ Good: Create a new object
const newObject = { ...originalObject, age: 31 }; // Uses spread syntax to create a new object
// newObject is { name: 'Alice', age: 31 }, originalObject is still { name: 'Alice', age: 30 }
`,
      quickRules: `
- ✅ Always create new arrays or objects when updating state.
- ✅ Use the spread syntax (\`...\`) to copy existing arrays/objects.
- ✅ When updating an item in an array, \`map\` over the array and return a new object for the changed item.
- ✅ Immutability makes state changes predictable and easier to track.
- ❌ Don't use \`push()\`, \`pop()\`, \`splice()\`, or direct assignment on state arrays.
- ❌ Never directly assign new property values to state objects (e.g., \`state.property = value\`).
- ❌ Avoid modifying nested objects or arrays without creating new copies at each level.`,
      watchOut: "👀 **Watch out:** The spread syntax (`...`) performs a *shallow* copy. If your state contains nested objects or arrays, only the top-level object/array is copied. The nested structures still refer to the original objects. For deep updates, you'll need to spread at each level of nesting to ensure complete immutability. For beginners, focus on the top level first, but be aware of this for more complex state structures.",
      dryRun: "🔁 **Think:**\n1. `notifications` state: `[{id:'1', isRead:false}, {id:'2', isRead:false}]`.\n2. `markAsRead('1')` is called.\n3. `prevNotifications.map(...)` starts.\n4. For `id='1'`: `notification.id === '1'` is true. A *new* object `{ ...notification, isRead: true }` is created: `{id:'1', isRead:true}`.\n5. For `id='2'`: `notification.id === '1'` is false. The original `notification` object `{id:'2', isRead:false}` is returned.\n6. `setNotifications` is called with the *new* array: `[{id:'1', isRead:true}, {id:'2', isRead:false}]`.\n7. The component re-renders with the updated state.\n(Hint: `map` always returns a new array, making it ideal for immutable updates.)",
      build: "**Learning focus:** Implement a function to immutably update a notification's read status in the state.",
    },
  },
  {
    id: "step6",
    type: "question",
    phase: "Step 6 of 8",
    paal: "Now that we have the `markAsRead` function, we need to connect it to our UI. Each notification item should have a way for the user to interact with it and trigger this function.",
    hint: "Add a button or make the entire notification `div` clickable. Pass the `notification.id` to the `markAsRead` function when the click event occurs.",
    example_code: `function ClickableItem({ id, label, onClick }: { id: string; label: string; onClick: (id: string) => void }) {
  return (
    <button onClick={() => onClick(id)}>
      \${label}
    </button>
  );
}`,
    mc_options: [
      "Call `markAsRead(notification.id)` directly in the JSX without a wrapper function.",
      "Add an `onClick` handler to each notification `div` that calls `markAsRead` with the notification's ID.",
      "Use a global event listener to detect clicks on notification elements.",
    ],
    mc_correct_option: "Add an `onClick` handler to each notification `div` that calls `markAsRead` with the notification's ID.",
    mc_anchor: "onClick handler",
    why_this_matters: "Event handling is how users interact with our applications. By wiring the `markAsRead` function to a UI element, we create a direct and intuitive way for users to control the state of their notifications, making the application truly interactive and responsive to their input.",
    answer_keywords: ["event handler", "onClick", "callback function", "UI interaction"],
    seed_code: `import { useState } from 'react';

interface Notification {
  id: string;
  message: string;
  isRead: boolean;
}

function NotificationCenter() {
  const [notifications, setNotifications] = useState<Notification[]>([
    { id: '1', message: 'Welcome to your notification center!', isRead: false },
    { id: '2', message: 'Your report is ready for download.', isRead: false },
    { id: '3', message: 'System maintenance scheduled for tonight.', isRead: true },
  ]);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const markAsRead = (notificationId: string) => {
    setNotifications(prevNotifications =>
      prevNotifications.map(notification =>
        notification.id === notificationId
          ? { ...notification, isRead: true }
          : notification
      )
    );
  };

  return (
    <div>
      <h2>Notifications (\${unreadCount} unread)</h2>
      <div style={{ border: '1px solid #ccc', padding: '10px', marginTop: '10px' }}>
        {notifications.map(notification => (
          <div key={notification.id} style={{
            padding: '8px',
            margin: '5px 0',
            backgroundColor: notification.isRead ? '#f0f0f0' : '#e0f7fa',
            borderLeft: notification.isRead ? 'none' : '3px solid #00bcd4'
          }}>
            \${notification.message}
          </div>
        ))}
      </div>
    </div>
  );
}`,
    starter_code: `import { useState } from 'react';

interface Notification {
  id: string;
  message: string;
  isRead: boolean;
}

function NotificationCenter() {
  const [notifications, setNotifications] = useState<Notification[]>([
    { id: '1', message: 'Welcome to your notification center!', isRead: false },
    { id: '2', message: 'Your report is ready for download.', isRead: false },
    { id: '3', message: 'System maintenance scheduled for tonight.', isRead: true },
  ]);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const markAsRead = (notificationId: string) => {
    setNotifications(prevNotifications =>
      prevNotifications.map(notification =>
        notification.id === notificationId
          ? { ...notification, isRead: true }
          : notification
      )
    );
  };

  return (
    <div>
      <h2>Notifications (\${unreadCount} unread)</h2>
      <div style={{ border: '1px solid #ccc', padding: '10px', marginTop: '10px' }}>
        {notifications.map(notification => (
          <div key={notification.id} style={{
            padding: '8px',
            margin: '5px 0',
            backgroundColor: notification.isRead ? '#f0f0f0' : '#e0f7fa',
            borderLeft: notification.isRead ? 'none' : '3px solid #00bcd4',
            display: 'flex', // Added for button alignment
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <span>\${notification.message}</span>
            {/* Add a button here to mark as read */}
          </div>
        ))}
      </div>
    </div>
  );
}`,
    feedback_correct: "Fantastic! Wiring the `markAsRead` function to a button makes our notifications interactive and user-friendly.",
    feedback_partial: "You've added a button, but ensure its `onClick` handler correctly calls `markAsRead` and passes the specific `notification.id`.",
    feedback_wrong: "Calling the function directly in JSX executes it immediately, not on click. Global event listeners are generally avoided in declarative UI frameworks.",
    expected: `import { useState } from 'react';

interface Notification {
  id: string;
  message: string;
  isRead: boolean;
}

function NotificationCenter() {
  const [notifications, setNotifications] = useState<Notification[]>([
    { id: '1', message: 'Welcome to your notification center!', isRead: false },
    { id: '2', message: 'Your report is ready for download.', isRead: false },
    { id: '3', message: 'System maintenance scheduled for tonight.', isRead: true },
  ]);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const markAsRead = (notificationId: string) => {
    setNotifications(prevNotifications =>
      prevNotifications.map(notification =>
        notification.id === notificationId
          ? { ...notification, isRead: true }
          : notification
      )
    );
  };

  return (
    <div>
      <h2>Notifications (\${unreadCount} unread)</h2>
      <div style={{ border: '1px solid #ccc', padding: '10px', marginTop: '10px' }}>
        {notifications.map(notification => (
          <div key={notification.id} style={{
            padding: '8px',
            margin: '5px 0',
            backgroundColor: notification.isRead ? '#f0f0f0' : '#e0f7fa',
            borderLeft: notification.isRead ? 'none' : '3px solid #00bcd4',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <span>\${notification.message}</span>
            {!notification.isRead && (
              <button
                onClick={() => markAsRead(notification.id)}
                style={{
                  marginLeft: '10px',
                  padding: '5px 10px',
                  cursor: 'pointer',
                  backgroundColor: '#00bcd4',
                  color: 'white',
                  border: 'none',
                  borderRadius: '3px'
                }}
              >
                Mark as Read
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}`,
    analog_example: `import { useState } from 'react';

interface Task {
  id: string;
  description: string;
  isDone: boolean;
}

function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([
    { id: 't1', description: 'Buy groceries', isDone: false },
    { id: 't2', description: 'Walk the dog', isDone: true },
  ]);

  const toggleDone = (taskId: string) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === taskId ? { ...task, isDone: !task.isDone } : task
      )
    );
  };

  return (
    <div>
      {tasks.map(task => (
        <div key={task.id}>
          <span style={{ textDecoration: task.isDone ? 'line-through' : 'none' }}>
            \${task.description}
          </span>
          <button onClick={() => toggleDone(task.id)}>
            \${task.isDone ? 'Undo' : 'Complete'}
          </button>
        </div>
      ))}
    </div>
  );
}`,
    deepDiveLabel: "How do event handlers connect UI to logic?",
    deepDive: {
      hook: "Imagine a light switch on your wall. When you flip it, the light turns on or off. The switch itself doesn't generate the electricity; it just sends a signal to the light fixture. In software, your UI elements (buttons, inputs, divs) are like those switches. They don't inherently *do* anything when clicked or typed into. They need a mechanism to 'listen' for user actions and then 'tell' your application's logic what happened. Without this connection, your beautiful UI would be completely unresponsive, like a car with no engine – it looks good, but it doesn't go anywhere when you press the pedal. This is the fundamental problem event handlers solve.",
      pain: "⚠️ **Lesson:** UI elements are static without event handlers. Symptom: Applications that don't respond to user input, leading to a frustrating and non-functional user experience. Users cannot interact with or change the state of the application, making it feel broken or incomplete. This directly impacts usability and user satisfaction.",
      mentalModel: "**Mental model:** The 'UI Listener.' Event handlers are like dedicated listeners attached to specific UI elements. When a user performs an action (like clicking a button), the listener 'hears' it and then executes a predefined function (the event handler). This function acts as a bridge, taking the user's action and translating it into a change in your application's data or logic. It's the core mechanism that makes your application dynamic and interactive, allowing users to drive changes in the displayed information and receive immediate feedback.",
      discover: `function InteractiveButton() {
  const [clicks, setClicks] = useState(0);

  const handleButtonClick = () => { // 1. Define the event handler function
    setClicks(clicks + 1);
    console.log('Button clicked!');
  };

  return (
    <button onClick={handleButtonClick}> {/* 2. Attach the handler to the event */}
      Clicked \${clicks} times
    </button>
  );
}
`,
      quickRules: `
- ✅ Attach event handlers directly to JSX elements using \`onEventName\` props (e.g., \`onClick\`, \`onChange\`).
- ✅ Pass a function reference to the event handler prop.
- ✅ Use arrow functions (\`() => myFunction(arg)\`) to pass arguments to your handler.
- ✅ Event handlers are crucial for making UI interactive and responsive.
- ❌ Don't call the function directly in JSX (e.g., \`onClick={myFunction()}\`); this executes it immediately.
- ❌ Avoid complex logic directly within the JSX \`onClick\` attribute; define a separate function.
- ❌ Never use \`addEventListener\` directly on DOM elements in declarative UI frameworks.`,
      watchOut: "👀 **Watch out:** When you need to pass arguments to your event handler (like `notification.id` to `markAsRead`), you must wrap the function call in an arrow function: `onClick={() => markAsRead(notification.id)}`. If you just wrote `onClick={markAsRead(notification.id)}`, the `markAsRead` function would execute *immediately* when the component renders, not when the button is clicked, leading to unexpected behavior and potentially an infinite loop if it updates state during render.",
      dryRun: "🔁 **Think:**\n1. Component renders: The `markAsRead` function is defined. Each `button`'s `onClick` prop is set to an arrow function `() => markAsRead(notification.id)`.\n2. User clicks the 'Mark as Read' button for notification `id='2'`.\n3. The arrow function `() => markAsRead('2')` executes, which in turn calls `markAsRead('2')`.\n4. `markAsRead('2')` updates the `notifications` state, changing `isRead` for `id='2'` to `true`.\n5. The component re-renders, `unreadCount` is recalculated, and the UI for notification `id='2'` changes its background color and hides the button.\n(Hint: The arrow function delays the execution of `markAsRead` until the click event occurs.)",
      build: "**Learning focus:** Connect the 'Mark as Read' logic to a clickable UI element for each notification.",
    },
  },
  {
    id: "step7",
    type: "question",
    phase: "Step 7 of 8",
    paal: "Our notification center is good at managing existing notifications, but what about new ones? In a real application, new notifications would arrive asynchronously. For our learning purposes, we'll simulate this by adding a function that generates and adds a new notification to our list.",
    hint: "Create a function `addNewNotification`. Inside it, generate a unique ID and a generic message, then use `setNotifications` to add this new notification to the existing list.",
    example_code: `function ItemAdder() {
  const [items, setItems] = useState<string[]>([]);

  const addItem = (newItem: string) => {
    setItems(prevItems => [...prevItems, newItem]);
  };

  return (
    <button onClick={() => addItem(\`Item \${items.length + 1}\`)}>
      Add Item
    </button>
  );
}`,
    mc_options: [
      "Manually update the `notifications` array directly and hope it re-renders.",
      "Create an `addNewNotification` function that generates a new `Notification` object and adds it to the `notifications` state using `setNotifications`.",
      "Reload the entire component to fetch new notifications.",
    ],
    mc_correct_option: "Create an `addNewNotification` function that generates a new `Notification` object and adds it to the `notifications` state using `setNotifications`.",
    mc_anchor: "addNewNotification function",
    why_this_matters: "The ability to dynamically add items to a list is essential for any application dealing with evolving data. This pattern demonstrates how to safely extend an array in state, ensuring that the UI updates correctly to display the new information. It's a core building block for dynamic content.",
    answer_keywords: ["add to array", "state update", "new item", "unique ID"],
    seed_code: `import { useState } from 'react';

interface Notification {
  id: string;
  message: string;
  isRead: boolean;
}

function NotificationCenter() {
  const [notifications, setNotifications] = useState<Notification[]>([
    { id: '1', message: 'Welcome to your notification center!', isRead: false },
    { id: '2', message: 'Your report is ready for download.', isRead: false },
    { id: '3', message: 'System maintenance scheduled for tonight.', isRead: true },
  ]);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const markAsRead = (notificationId: string) => {
    setNotifications(prevNotifications =>
      prevNotifications.map(notification =>
        notification.id === notificationId
          ? { ...notification, isRead: true }
          : notification
      )
    );
  };

  return (
    <div>
      <h2>Notifications (\${unreadCount} unread)</h2>
      <div style={{ border: '1px solid #ccc', padding: '10px', marginTop: '10px' }}>
        {notifications.map(notification => (
          <div key={notification.id} style={{
            padding: '8px',
            margin: '5px 0',
            backgroundColor: notification.isRead ? '#f0f0f0' : '#e0f7fa',
            borderLeft: notification.isRead ? 'none' : '3px solid #00bcd4',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <span>\${notification.message}</span>
            {!notification.isRead && (
              <button
                onClick={() => markAsRead(notification.id)}
                style={{
                  marginLeft: '10px',
                  padding: '5px 10px',
                  cursor: 'pointer',
                  backgroundColor: '#00bcd4',
                  color: 'white',
                  border: 'none',
                  borderRadius: '3px'
                }}
              >
                Mark as Read
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}`,
    starter_code: `import { useState } from 'react';

interface Notification {
  id: string;
  message: string;
  isRead: boolean;
}

function NotificationCenter() {
  const [notifications, setNotifications] = useState<Notification[]>([
    { id: '1', message: 'Welcome to your notification center!', isRead: false },
    { id: '2', message: 'Your report is ready for download.', isRead: false },
    { id: '3', message: 'System maintenance scheduled for tonight.', isRead: true },
  ]);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const markAsRead = (notificationId: string) => {
    setNotifications(prevNotifications =>
      prevNotifications.map(notification =>
        notification.id === notificationId
          ? { ...notification, isRead: true }
          : notification
      )
    );
  };

  // Implement the addNewNotification function here

  return (
    <div>
      <h2>Notifications (\${unreadCount} unread)</h2>
      <div style={{ border: '1px solid #ccc', padding: '10px', marginTop: '10px' }}>
        {notifications.map(notification => (
          <div key={notification.id} style={{
            padding: '8px',
            margin: '5px 0',
            backgroundColor: notification.isRead ? '#f0f0f0' : '#e0f7fa',
            borderLeft: notification.isRead ? 'none' : '3px solid #00bcd4',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <span>\${notification.message}</span>
            {!notification.isRead && (
              <button
                onClick={() => markAsRead(notification.id)}
                style={{
                  marginLeft: '10px',
                  padding: '5px 10px',
                  cursor: 'pointer',
                  backgroundColor: '#00bcd4',
                  color: 'white',
                  border: 'none',
                  borderRadius: '3px'
                }}
              >
                Mark as Read
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}`,
    feedback_correct: "Perfect! Using the spread operator to add a new notification to the state array ensures proper re-rendering and immutability.",
    feedback_partial: "You've created the `addNewNotification` function, but ensure you're using `setNotifications` with a *new* array that includes the new notification, rather than modifying the old one.",
    feedback_wrong: "Directly modifying the array or reloading the component are incorrect approaches for dynamic state updates. `setNotifications` with a new array is the correct pattern.",
    expected: `import { useState } from 'react';

interface Notification {
  id: string;
  message: string;
  isRead: boolean;
}

function NotificationCenter() {
  const [notifications, setNotifications] = useState<Notification[]>([
    { id: '1', message: 'Welcome to your notification center!', isRead: false },
    { id: '2', message: 'Your report is ready for download.', isRead: false },
    { id: '3', message: 'System maintenance scheduled for tonight.', isRead: true },
  ]);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const markAsRead = (notificationId: string) => {
    setNotifications(prevNotifications =>
      prevNotifications.map(notification =>
        notification.id === notificationId
          ? { ...notification, isRead: true }
          : notification
      )
    );
  };

  const addNewNotification = () => {
    const newId = String(notifications.length + 1); // Simple unique ID for demo
    const newMessage = \`New update: Action required for item \${newId}!\`;
    const newNotification: Notification = {
      id: newId,
      message: newMessage,
      isRead: false,
    };
    setNotifications(prevNotifications => [newNotification, ...prevNotifications]); // Add to beginning
  };

  return (
    <div>
      <h2>Notifications (\${unreadCount} unread)</h2>
      <div style={{ border: '1px solid #ccc', padding: '10px', marginTop: '10px' }}>
        {notifications.map(notification => (
          <div key={notification.id} style={{
            padding: '8px',
            margin: '5px 0',
            backgroundColor: notification.isRead ? '#f0f0f0' : '#e0f7fa',
            borderLeft: notification.isRead ? 'none' : '3px solid #00bcd4',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <span>\${notification.message}</span>
            {!notification.isRead && (
              <button
                onClick={() => markAsRead(notification.id)}
                style={{
                  marginLeft: '10px',
                  padding: '5px 10px',
                  cursor: 'pointer',
                  backgroundColor: '#00bcd4',
                  color: 'white',
                  border: 'none',
                  borderRadius: '3px'
                }}
              >
                Mark as Read
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}`,
    analog_example: `import { useState } from 'react';

interface LogEntry {
  id: string;
  timestamp: string;
  message: string;
}

function SystemLogViewer() {
  const [logEntries, setLogEntries] = useState<LogEntry[]>([]);

  const addLogEntry = (message: string) => {
    const newId = String(logEntries.length + 1);
    const newEntry: LogEntry = {
      id: newId,
      timestamp: new Date().toLocaleTimeString(),
      message: message,
    };
    setLogEntries(prevEntries => [...prevEntries, newEntry]);
  };

  return (
    <div>
      <button onClick={() => addLogEntry('User logged in.')}>Add Log</button>
      {/* ... display log entries ... */}
    </div>
  );
}`,
    deepDiveLabel: "How do we add new items to a state array correctly?",
    deepDive: {
      hook: "Imagine you have a physical list of tasks written on a notepad. If you want to add a new task, you don't just magically insert it into the middle of an existing line. You write a *new* line at the bottom (or top) of the page. In programming, especially with state arrays, trying to directly `push` a new item onto an existing array in state is like trying to magically insert text into the middle of a physical line – it might seem to work sometimes, but it breaks the fundamental rule of immutability. The system won't detect that the array has changed because its reference in memory hasn't changed, only its contents have. This leads to the UI not updating, even though your data *seems* to be correct, causing confusion and bugs.",
      pain: "⚠️ **Lesson:** Direct mutation of state arrays prevents UI updates. Symptom: New items not appearing in lists, stale data being displayed, and components failing to re-render when the underlying array data has changed. This leads to a disconnect between the application's internal state and what the user sees.",
      mentalModel: "**Mental model:** The 'New List Blueprint.' When you add a new item to a state array, you're not modifying the old array. Instead, you're creating a *brand new array* that includes all the old items *plus* the new item. Think of it as taking a fresh sheet of paper, copying all the old tasks onto it, and then adding the new task. This new array is then given to the state setter. Because the setter receives a *new* array reference, it can easily detect the change and trigger a re-render, ensuring your UI always reflects the most current list of items. This pattern is consistent and predictable.",
      discover: `function ItemList() {
  const [items, setItems] = useState<string[]>(['Apple', 'Banana']);

  const addItem = (newItem: string) => {
    // ✅ Correct: Create a new array using spread syntax
    setItems(prevItems => [...prevItems, newItem]); // Adds to end
    // setItems(prevItems => [newItem, ...prevItems]); // Adds to beginning
  };

  return (
    <button onClick={() => addItem('Cherry')}>Add Cherry</button>
  );
}
`,
      quickRules: `
- ✅ Always create a new array when adding items to state.
- ✅ Use the spread syntax (\`...\`) to include existing items in the new array.
- ✅ Place the new item at the beginning (\`[newItem, ...prevItems]\`) or end (\`[...prevItems, newItem]\`) as needed.
- ✅ Use the functional update form of \`setX\` when the new state depends on the previous state.
- ❌ Don't use \`array.push()\` or \`array.unshift()\` directly on state arrays.
- ❌ Never modify the \`prevItems\` array directly within the \`setItems\` callback.
- ❌ Avoid creating new items with non-unique or unstable IDs if they are used as \`key\` props.`,
      watchOut: "👀 **Watch out:** When adding items, consider where you want the new item to appear. `[...prevItems, newItem]` adds to the end, while `[newItem, ...prevItems]` adds to the beginning. For notifications, adding new ones to the beginning (most recent first) is often preferred, but it depends on the desired user experience. Also, ensure your new items have truly unique `id`s, especially if you're using them as `key` props, to avoid rendering issues.",
      dryRun: "🔁 **Think:**\n1. Initial `notifications` state: `[{id:'1', isRead:false}]`.\n2. `addNewNotification()` is called.\n3. A `newNotification` object is created: `{id:'2', message:'...', isRead:false}`.\n4. `setNotifications` is called with `prevNotifications => [newNotification, ...prevNotifications]`.\n5. The new array becomes `[{id:'2', message:'...', isRead:false}, {id:'1', isRead:false}]`.\n6. The component re-renders. `unreadCount` becomes `2`. The UI now displays two notifications, with the newest one at the top.\n(Hint: The spread operator creates a new array, and the order of elements in the spread matters for display order.)",
      build: "**Learning focus:** Create a function to add new notifications to the state array.",
    },
  },
  {
    id: "step8",
    type: "question",
    phase: "Step 8 of 8",
    paal: "Finally, let's give users a way to trigger the `addNewNotification` function. We'll add a button to our `NotificationCenter` that, when clicked, will simulate the arrival of a new notification.",
    hint: "Add a `<button>` element to your component. Its `onClick` handler should directly call the `addNewNotification` function.",
    example_code: `function ToggleButton() {
  const [isOn, setIsOn] = useState(false);
  const toggle = () => setIsOn(!isOn);

  return (
    <button onClick={toggle}>
      \${isOn ? 'Turn Off' : 'Turn On'}
    </button>
  );
}`,
    mc_options: [
      "Call `addNewNotification()` directly in the JSX without an event handler.",
      "Add a button with an `onClick` handler that calls `addNewNotification`.",
      "Set up a timer to automatically call `addNewNotification` every few seconds.",
    ],
    mc_correct_option: "Add a button with an `onClick` handler that calls `addNewNotification`.",
    mc_anchor: "button onClick",
    why_this_matters: "Providing clear UI controls for actions is fundamental to good user experience. This button makes our simulation explicit and allows learners to directly observe the effect of adding new data to the component's state and seeing the UI update in real-time, reinforcing the concept of dynamic UI.",
    answer_keywords: ["button", "onClick", "event trigger", "user control"],
    seed_code: `import { useState } from 'react';

interface Notification {
  id: string;
  message: string;
  isRead: boolean;
}

function NotificationCenter() {
  const [notifications, setNotifications] = useState<Notification[]>([
    { id: '1', message: 'Welcome to your notification center!', isRead: false },
    { id: '2', message: 'Your report is ready for download.', isRead: false },
    { id: '3', message: 'System maintenance scheduled for tonight.', isRead: true },
  ]);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const markAsRead = (notificationId: string) => {
    setNotifications(prevNotifications =>
      prevNotifications.map(notification =>
        notification.id === notificationId
          ? { ...notification, isRead: true }
          : notification
      )
    );
  };

  const addNewNotification = () => {
    const newId = String(notifications.length + 1); // Simple unique ID for demo
    const newMessage = \`New update: Action required for item \${newId}!\`;
    const newNotification: Notification = {
      id: newId,
      message: newMessage,
      isRead: false,
    };
    setNotifications(prevNotifications => [newNotification, ...prevNotifications]); // Add to beginning
  };

  return (
    <div>
      <h2>Notifications (\${unreadCount} unread)</h2>
      <div style={{ border: '1px solid #ccc', padding: '10px', marginTop: '10px' }}>
        {notifications.map(notification => (
          <div key={notification.id} style={{
            padding: '8px',
            margin: '5px 0',
            backgroundColor: notification.isRead ? '#f0f0f0' : '#e0f7fa',
            borderLeft: notification.isRead ? 'none' : '3px solid #00bcd4',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <span>\${notification.message}</span>
            {!notification.isRead && (
              <button
                onClick={() => markAsRead(notification.id)}
                style={{
                  marginLeft: '10px',
                  padding: '5px 10px',
                  cursor: 'pointer',
                  backgroundColor: '#00bcd4',
                  color: 'white',
                  border: 'none',
                  borderRadius: '3px'
                }}
              >
                Mark as Read
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}`,
    starter_code: `import { useState } from 'react';

interface Notification {
  id: string;
  message: string;
  isRead: boolean;
}

function NotificationCenter() {
  const [notifications, setNotifications] = useState<Notification[]>([
    { id: '1', message: 'Welcome to your notification center!', isRead: false },
    { id: '2', message: 'Your report is ready for download.', isRead: false },
    { id: '3', message: 'System maintenance scheduled for tonight.', isRead: true },
  ]);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const markAsRead = (notificationId: string) => {
    setNotifications(prevNotifications =>
      prevNotifications.map(notification =>
        notification.id === notificationId
          ? { ...notification, isRead: true }
          : notification
      )
    );
  };

  const addNewNotification = () => {
    const newId = String(notifications.length + 1); // Simple unique ID for demo
    const newMessage = \`New update: Action required for item \${newId}!\`;
    const newNotification: Notification = {
      id: newId,
      message: newMessage,
      isRead: false,
    };
    setNotifications(prevNotifications => [newNotification, ...prevNotifications]); // Add to beginning
  };

  return (
    <div>
      <h2>Notifications (\${unreadCount} unread)</h2>
      {/* Add a button to trigger addNewNotification here */}
      <div style={{ border: '1px solid #ccc', padding: '10px', marginTop: '10px' }}>
        {notifications.map(notification => (
          <div key={notification.id} style={{
            padding: '8px',
            margin: '5px 0',
            backgroundColor: notification.isRead ? '#f0f0f0' : '#e0f7fa',
            borderLeft: notification.isRead ? 'none' : '3px solid #00bcd4',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <span>\${notification.message}</span>
            {!notification.isRead && (
              <button
                onClick={() => markAsRead(notification.id)}
                style={{
                  marginLeft: '10px',
                  padding: '5px 10px',
                  cursor: 'pointer',
                  backgroundColor: '#00bcd4',
                  color: 'white',
                  border: 'none',
                  borderRadius: '3px'
                }}
              >
                Mark as Read
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}`,
    feedback_correct: "Excellent! The button now provides a clear way to simulate new notifications and observe the dynamic updates.",
    feedback_partial: "You've added a button, but ensure its `onClick` handler correctly calls the `addNewNotification` function.",
    feedback_wrong: "Calling the function directly in JSX executes it immediately on render. Automatic timers are for advanced scenarios, not basic user interaction.",
    expected: `import { useState } from 'react';

interface Notification {
  id: string;
  message: string;
  isRead: boolean;
}

function NotificationCenter() {
  const [notifications, setNotifications] = useState<Notification[]>([
    { id: '1', message: 'Welcome to your notification center!', isRead: false },
    { id: '2', message: 'Your report is ready for download.', isRead: false },
    { id: '3', message: 'System maintenance scheduled for tonight.', isRead: true },
  ]);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const markAsRead = (notificationId: string) => {
    setNotifications(prevNotifications =>
      prevNotifications.map(notification =>
        notification.id === notificationId
          ? { ...notification, isRead: true }
          : notification
      )
    );
  };

  const addNewNotification = () => {
    const newId = String(notifications.length + 1); // Simple unique ID for demo
    const newMessage = \`New update: Action required for item \${newId}!\`;
    const newNotification: Notification = {
      id: newId,
      message: newMessage,
      isRead: false,
    };
    setNotifications(prevNotifications => [newNotification, ...prevNotifications]); // Add to beginning
  };

  return (
    <div>
      <h2>Notifications (\${unreadCount} unread)</h2>
      <button
        onClick={addNewNotification}
        style={{
          marginBottom: '15px',
          padding: '8px 15px',
          cursor: 'pointer',
          backgroundColor: '#4CAF50',
          color: 'white',
          border: 'none',
          borderRadius: '4px'
        }}
      >
        Simulate New Notification
      </button>
      <div style={{ border: '1px solid #ccc', padding: '10px', marginTop: '10px' }}>
        {notifications.map(notification => (
          <div key={notification.id} style={{
            padding: '8px',
            margin: '5px 0',
            backgroundColor: notification.isRead ? '#f0f0f0' : '#e0f7fa',
            borderLeft: notification.isRead ? 'none' : '3px solid #00bcd4',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <span>\${notification.message}</span>
            {!notification.isRead && (
              <button
                onClick={() => markAsRead(notification.id)}
                style={{
                  marginLeft: '10px',
                  padding: '5px 10px',
                  cursor: 'pointer',
                  backgroundColor: '#00bcd4',
                  color: 'white',
                  border: 'none',
                  borderRadius: '3px'
                }}
              >
                Mark as Read
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}`,
    analog_example: `import { useState } from 'react';

function ImageGallery() {
  const [imageCount, setImageCount] = useState(0);

  const addImage = () => {
    setImageCount(prevCount => prevCount + 1);
    console.log(\`Added image number \${imageCount + 1}\`);
  };

  return (
    <div>
      <p>Images in gallery: \${imageCount}</p>
      <button onClick={addImage}>
        Add New Image
      </button>
    </div>
  );
}`,
    deepDiveLabel: "Why is direct function reference often preferred for simple clicks?",
    deepDive: {
      hook: "Imagine you have a remote control for your TV. When you press the 'Power' button, it directly sends the 'power' signal. You don't need to press 'Function' then 'Power' then 'Execute'. In programming, sometimes you need to pass extra information with an event (like `notification.id`), which requires an intermediate function (an arrow function). But for simple actions that don't need extra data, adding an unnecessary wrapper function is like adding extra steps to your remote control – it works, but it's less direct and can be slightly less efficient. It's important to understand when to use a direct function reference versus an inline arrow function to keep your code clean and performant, especially as your application grows.",
      pain: "⚠️ **Lesson:** Unnecessary wrapper functions can add overhead and reduce readability. Symptom: Slightly degraded performance for very frequent events, increased bundle size, and code that is harder to read and maintain due to redundant function definitions. This can make debugging more complex and obscure the direct intent of the code.",
      mentalModel: "**Mental model:** The 'Direct Command.' When an event handler doesn't need any special arguments beyond the event object itself, you can give the UI element a 'direct command' by simply passing the function's name (its reference). The UI element then knows exactly which function to call when its event occurs. This is the most straightforward and efficient way to connect a simple user action to its corresponding logic, akin to a single-purpose button that just does one thing when pressed, without needing any extra instructions. It's a clean, concise way to express intent.",
      discover: `function ToggleDisplay() {
  const [isVisible, setIsVisible] = useState(true);

  const toggleVisibility = () => { // Function defined once
    setIsVisible(!isVisible);
  };

  return (
    <div>
      {isVisible && <p>Hello, world!</p>}
      <button onClick={toggleVisibility}> {/* Direct reference */}
        Toggle Display
      </button>
    </div>
  );
}
`,
      quickRules: `
- ✅ Use a direct function reference (\`onClick={myFunction}\`) when no arguments are needed beyond the event object.
- ✅ This is generally more performant as no new function is created on each render.
- ✅ Promotes cleaner, more readable code for simple interactions.
- ✅ Ideal for actions like toggling a boolean, incrementing a counter, or submitting a form without extra data.
- ❌ Don't use a direct reference if you need to pass specific arguments to the handler.
- ❌ Avoid defining complex logic directly inside the JSX \`onClick\` attribute.
- ❌ Never use \`onClick={myFunction()}\` as it calls the function immediately on render.`,
      watchOut: "👀 **Watch out:** While passing a direct function reference is often preferred for performance and readability, it's crucial to remember that the function will be called *without* any custom arguments you might expect, only the synthetic event object. If your function *does* require specific data (like an `id`), you *must* wrap it in an arrow function (e.g., `onClick={() => myFunction(id)}`) to ensure those arguments are passed correctly when the event fires. Misunderstanding this distinction is a common source of bugs.",
      dryRun: "🔁 **Think:**\n1. Component renders: The `addNewNotification` function is defined. The `button`'s `onClick` prop is set to `addNewNotification`.\n2. User clicks the 'Simulate New Notification' button.\n3. The `addNewNotification` function executes directly.\n4. Inside `addNewNotification`, a new notification object is created (e.g., `id='4'`).\n5. `setNotifications` is called with a new array `[{id:'4', ...}, {id:'1', ...}, {id:'2', ...}, {id:'3', ...}]`.\n6. The component re-renders. `unreadCount` is recalculated (e.g., from 1 to 2 if '4' is unread). The UI updates to show the new notification at the top of the list.\n(Hint: A direct function reference executes the function when the event occurs, without needing an intermediate wrapper if no custom arguments are passed.)",
      build: "**Learning focus:** Add a button to trigger the creation of new notifications, demonstrating dynamic list updates.",
    },
  },
];

const sideItems = [
  { label: "Lesson", id: "intro" },
  { label: "Objectives", id: "objectives" },
  { label: "Step 1: Define Type", id: "step1" },
  { label: "Step 2: Component Shell", id: "step2" },
  { label: "Step 3: Manage State", id: "step3" },
  { label: "Step 4: Render List", id: "step4" },
  { label: "Step 5: Mark as Read Logic", id: "step5" },
  { label: "Step 6: Wire Read Logic", id: "step6" },
  { label: "Step 7: New Notification Logic", id: "step7" },
  { label: "Step 8: Wire New Notification", id: "step8" },
];

export default createINPACTEngine({
  NODES,
  sideItems,
  lessonNum: 0,
  title: "In-App Notifications: Keeping Users Informed",
  shortName: "In-App Notifications",
});
