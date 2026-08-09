import createINPACTEngine from "../inpact_engine_shared";

export const NODES = [
  {
    id: "intro",
    type: "reveal",
    phase: "Lesson",
    content: {
      tag: "healthcheck-metrics-endpoint",
      title: "Making Your Application Observable: Health & Metrics Endpoints",
      body: `Modern software applications, especially those deployed in dynamic cloud environments, cannot simply run in isolation. They need to communicate their internal state to external systems, such as orchestrators, load balancers, and monitoring tools. This communication is crucial for ensuring reliability, scalability, and efficient operations. Without a way for external systems to query an application's health or performance, issues can go undetected, leading to service disruptions or inefficient resource allocation. Exposing dedicated endpoints for health checks and operational metrics provides a standardized, programmatic interface for these external systems to understand and react to your application's condition.

This pattern is fundamental across various application architectures, from microservices to monolithic backend services, and even some client-side applications that report their status to a central logging service. You'll find health checks used by container orchestrators like Kubernetes to determine if a service instance should receive traffic or be restarted. Metrics endpoints are consumed by monitoring dashboards (e.g., Prometheus, Grafana) to visualize performance trends, trigger alerts, and inform capacity planning. Understanding how to implement these basic observability features is a core skill for any software engineer building robust and maintainable systems.`,
      usecase: "A backend service responsible for processing user authentication requests needs to report its operational status and current request load to a central service orchestrator and a monitoring dashboard. This allows the orchestrator to automatically remove unhealthy instances from a load balancer and enables engineers to visualize real-time performance.",
    },
  },
  {
    id: "objectives",
    type: "objectives",
    phase: "Objectives",
    items: [
      "Understand the purpose of health and metrics endpoints for application observability.",
      "Define a structured data type for reporting application health and performance.",
      "Implement basic logic to track application health status.",
      "Implement simple counters for tracking operational metrics like request count.",
      "Expose these health and metrics as distinct, queryable endpoints within an application.",
    ],
  },
  {
    id: "step1",
    type: "question",
    phase: "Step 1 of 7",
    paal: "Every application needs a starting point and a way to listen for incoming requests. For our purposes, we'll simulate a simple application server that can be started and will eventually handle requests. Let's define a function that represents the entry point for our application, taking a port number as an argument.",
    hint: "Think about a function that initializes and 'starts' your application, perhaps logging a message to indicate it's running.",
    example_code: `function initializeApplication(port: number) {
  console.log(\`Application starting on port \${port}...\`);
  // Further setup would go here
}`,
    think_prompt: "Write a function named `startApplication` that accepts a `port` number (type `number`) and logs a message indicating the application is starting on that port.",
    mc_options: [
      "const startApplication = (port: string) => { console.log(`Starting on ${port}`); }",
      "function startApplication(port: number): void { console.log(`Application online at ${port}`); }",
      "function startApplication(port) { console.log(`App starting on port: ${port}`); }",
    ],
    mc_correct_option: "function startApplication(port: number): void { console.log(`Application online at ${port}`); }",
    mc_anchor: "function startApplication(port: number): void {",
    why_this_matters: "The entry point function is where all application setup, configuration, and resource initialization typically occur. It's the first piece of code executed to bring your service online, making its definition fundamental to any application's structure.",
    answer_keywords: ["function", "startApplication", "port", "number", "void", "console.log"],
    seed_code: ``,
    starter_code: `// Define the main application startup function here
`,
    feedback_correct: "Excellent! Defining a clear `startApplication` function with proper type annotations is the first step to a well-structured application. This function will be our entry point.",
    feedback_partial: "You're close! The function name and purpose are correct, but double-check the type annotation for the `port` parameter and the return type. TypeScript helps ensure correctness.",
    feedback_wrong: "Not quite. Remember to use the `function` keyword for a named function, specify the type for the `port` parameter as `number`, and explicitly declare a `void` return type if nothing is returned. Pay attention to the exact function signature.",
    expected: `function startApplication(port: number): void {
  console.log(\`Application online at \${port}\`);
}`,
    analog_example: `function setupGameEngine(initialLevel: number) {
  console.log(\`Game engine initializing at level \${initialLevel}...\`);
  // Load assets, configure physics, etc.
}

// Later: setupGameEngine(1);`,
    deepDiveLabel: "Why are explicit return types important?",
    deepDive: {
      hook: `Imagine you're building a complex machine, like a factory assembly line. Each robot on the line performs a specific task, and it's crucial to know exactly what each robot is expected to produce or if it just performs an action without producing anything. If one robot is supposed to output a finished widget but sometimes just makes a whirring sound, the next robot in line might break because it's expecting a widget. In programming, functions are like these robots. If a function is supposed to return a specific type of data (like a number or a string), but sometimes returns nothing, or a different type, other parts of your code that rely on that function's output can crash or behave unpredictably. This becomes especially problematic in large codebases where many developers are working together, or when revisiting code after a long time. Without clear expectations, debugging becomes a nightmare, and the risk of introducing subtle bugs increases significantly.`,
      pain: `⚠️ **Lesson:** Unspecified or incorrect return types can lead to runtime errors, unexpected behavior, and difficult-to-diagnose bugs, especially when functions are used by other parts of the application that expect a specific data shape. Symptom: Functions that are supposed to return data sometimes return 'undefined', causing subsequent operations to fail with errors like 'Cannot read properties of undefined'.`,
      mentalModel: `**Mental model:** The Function Contract. Think of a function's signature (its name, parameters, and return type) as a legally binding contract. When you call a function, you're agreeing to provide inputs that match its parameter types, and in return, the function promises to deliver an output that matches its declared return type. If either party violates this contract, the agreement is broken, and the system can become unstable. Explicitly stating the return type makes this contract clear and enforceable by the TypeScript compiler, preventing misunderstandings and errors.`,
      discover: `**Pattern - Function with Explicit Return Type:**
\`\`\`tsx
function calculateArea(width: number, height: number): number {
  return width * height;
}

function logMessage(message: string): void {
  console.log(message);
}
\`\`\`
- \`calculateArea\` explicitly states it will return a \`number\`. If it tried to return a string, TypeScript would flag an error.
- \`logMessage\` explicitly states it returns \`void\`, meaning it performs an action but doesn't produce a value to be used elsewhere.
- Explicit return types improve code readability and maintainability by clearly communicating the function's intent.
- They enable the TypeScript compiler to catch type-related errors at compile-time, before the code even runs.`,
      quickRules: `**Quick rules:**
- ✅ Always specify a return type for functions that produce a value.
- ✅ Use \`void\` as the return type for functions that perform an action but don't return a meaningful value.
- ✅ Explicit return types help the compiler catch errors early.
- ✅ Explicit return types improve code clarity for other developers.
- ❌ Avoid omitting return types in TypeScript, as it can lead to implicit \`any\` or less precise type inference.
- ❌ Never return a value from a function declared with a \`void\` return type.
- ❌ Don't rely solely on type inference for complex return types; be explicit for clarity.`,
      watchOut: `👀 **Watch out:** While TypeScript can often infer return types, explicitly stating them is a best practice, especially for public API functions or when the inferred type might be broader than intended. Forgetting to specify \`void\` for functions that don't return anything can sometimes lead to confusion, though TypeScript often handles this gracefully. The key is to be intentional about what your function produces (or doesn't produce).`,
      dryRun: `🔁 **Think:** Consider a function \`processData(data: string): string\`. If \`processData("hello")\` returns \`"HELLO"\`, that's fine. But if it sometimes returns \`undefined\` (e.g., due to an error path), and another function \`displayResult(result: string)\` tries to call \`result.toUpperCase()\`, it will crash because \`undefined\` doesn't have a \`toUpperCase\` method. An explicit return type of \`string\` would force \`processData\` to always return a string or throw an error, preventing the crash. (Hint: The contract ensures expected output.)`,
      build: "**Learning focus:** Define the application's main entry point function with correct type annotations.",
    },
  },
  {
    id: "step2",
    type: "question",
    phase: "Step 2 of 7",
    paal: "To report our application's status and performance, we need a consistent way to structure that information. Let's define a TypeScript `interface` for our `ApplicationMetrics`. This interface will specify the properties our health and metrics endpoints will expose.",
    hint: "An `interface` is a good way to define the shape of an object. Think about what basic health status, request count, and how long the app has been running (uptime) would look like.",
    example_code: `interface UserProfile {
  id: string;
  name: string;
  email?: string; // Optional property
}`,
    think_prompt: "Define an interface named `ApplicationMetrics` with the following properties: `status` (a string literal type 'ok' | 'degraded' | 'unavailable'), `requestCount` (a number), and `uptimeSeconds` (a number).",
    mc_options: [
      "type ApplicationMetrics = { status: string; requestCount: number; uptimeSeconds: number; }",
      "interface ApplicationMetrics { status: 'ok' | 'degraded' | 'unavailable'; requestCount: number; uptimeSeconds: number; }",
      "interface ApplicationMetrics { healthStatus: string; totalRequests: number; appUptime: number; }",
    ],
    mc_correct_option: "interface ApplicationMetrics { status: 'ok' | 'degraded' | 'unavailable'; requestCount: number; uptimeSeconds: number; }",
    mc_anchor: "interface ApplicationMetrics {",
    why_this_matters: "Defining interfaces for data structures is crucial for type safety and clarity. It ensures that any object representing application metrics will always conform to a predictable shape, making it easier to consume and reason about the data across different parts of your application and by external monitoring systems.",
    answer_keywords: ["interface", "ApplicationMetrics", "status", "ok", "degraded", "unavailable", "requestCount", "number", "uptimeSeconds"],
    seed_code: `function startApplication(port: number): void {
  console.log(\`Application online at \${port}\`);
}`,
    starter_code: `function startApplication(port: number): void {
  console.log(\`Application online at \${port}\`);
}

// Define your metrics data structure here
`,
    feedback_correct: "Spot on! Using a string literal type for `status` is excellent for clearly defining the possible states, and `interface` is the perfect construct for this data shape.",
    feedback_partial: "You've got the right idea with the interface, but review the `status` property. It should be a specific set of string literals, not just a generic `string`, to enforce valid health states.",
    feedback_wrong: "Not quite. Remember that `interface` is the preferred way to describe object shapes. Also, for the `status` property, we want to restrict it to specific values like 'ok', 'degraded', or 'unavailable' using a union of string literal types, not just a generic `string`.",
    expected: `function startApplication(port: number): void {
  console.log(\`Application online at \${port}\`);
}

interface ApplicationMetrics {
  status: 'ok' | 'degraded' | 'unavailable';
  requestCount: number;
  uptimeSeconds: number;
}`,
    analog_example: `interface SensorReading {
  sensorId: string;
  temperatureCelsius: number;
  humidityPercent: number;
  timestamp: number;
}

// Later: const reading: SensorReading = { sensorId: "A1", temperatureCelsius: 22.5, humidityPercent: 60, timestamp: Date.now() };`,
    deepDiveLabel: "Why use string literal types for status?",
    deepDive: {
      hook: `Imagine you're building a traffic light system. Each light can be 'red', 'yellow', or 'green'. If you simply define the light's state as a generic 'string', what prevents someone from accidentally setting it to 'blue', 'flashing', or even a typo like 'reddd'? In a real traffic system, such an error could have catastrophic consequences. In software, allowing any string for a status field can lead to invalid states, unexpected behavior, and difficult-to-debug issues. When a system expects one of a few specific values, but receives something else, it can crash, display incorrect information, or simply fail to operate as intended. This problem is especially acute when different parts of a large system need to interpret these status values consistently.`,
      pain: `⚠️ **Lesson:** Using generic string types for status fields allows for invalid or unexpected values, leading to runtime errors, inconsistent behavior, and increased debugging effort. Symptom: A status field that should only be 'active' or 'inactive' sometimes contains 'Active', 'pending', or even empty strings, causing conditional logic to fail.`,
      mentalModel: `**Mental model:** The Closed Set of Options. Think of string literal types as defining a "closed set" of allowed options for a particular value. Instead of an open-ended text field where anything goes, you're providing a dropdown menu with only specific, predefined choices. This mental model ensures that anyone interacting with this value knows exactly what inputs are valid and what outputs to expect. It's like a strict vocabulary for a specific concept, preventing miscommunication and ensuring everyone speaks the same language when referring to a status.`,
      discover: `**Pattern - String Literal Types:**
\`\`\`tsx
type TrafficLightState = 'red' | 'yellow' | 'green';

function changeLight(state: TrafficLightState) {
  console.log(\`Changing light to: \${state}\`);
}

changeLight('red'); // ✅ Valid
// changeLight('blue'); // ❌ TypeScript error: Argument of type '"blue"' is not assignable to parameter of type 'TrafficLightState'.
\`\`\`
- A string literal type is created using a union of specific string values (e.g., \`'ok' | 'degraded'\`).
- It restricts a variable or parameter to only accept one of the specified string values.
- This provides compile-time safety, catching errors where an invalid string is assigned.
- Improves code readability by clearly documenting the expected values for a given property.`,
      quickRules: `**Quick rules:**
- ✅ Use string literal types when a property can only take a few specific string values.
- ✅ Combine string literals with union types (\`|\`) to define the set of allowed values.
- ✅ Leverage string literal types for status indicators, modes, or fixed categories.
- ✅ They provide strong type checking at compile-time, preventing invalid assignments.
- ❌ Avoid using generic \`string\` when the domain of values is truly limited and known.
- ❌ Don't use string literal types for free-form text inputs or dynamic content.
- ❌ Never rely on runtime checks alone for these values if compile-time checks are possible.`,
      watchOut: `👀 **Watch out:** While powerful, don't overuse string literal types for every string. They are best suited for situations where the set of possible string values is finite, known, and semantically important. For example, a user's name should be a \`string\`, not a string literal type, because names are free-form.`,
      dryRun: `🔁 **Think:** If \`ApplicationMetrics.status\` was just \`string\`, \`metrics.status = "broken"\` would compile. But if it's \`'ok' | 'degraded' | 'unavailable'\`, then \`metrics.status = "broken"\` would cause a compile-time error. This prevents the application from ever entering an undefined or unexpected health state. (Hint: Compile-time safety prevents invalid states.)`,
      build: "**Learning focus:** Define a type-safe structure for application metrics using an interface and string literal types.",
    },
  },
  {
    id: "step3",
    type: "question",
    phase: "Step 3 of 7",
    paal: "Now that we have our application's entry point and a type for its metrics, let's encapsulate the core logic that will manage our application's state and respond to requests. We'll define a function that acts as a factory for our application's operational logic.",
    hint: "Think about a function that returns an object containing methods for our application's behavior. This pattern helps keep related logic together.",
    example_code: `function createCounter() {
  let count = 0;
  return {
    increment: () => count++,
    getCount: () => count
  };
}`,
    think_prompt: "Define a function named `createApplicationLogic` that takes no arguments and returns an object. For now, this object can be empty, but it will eventually hold our application's core functions.",
    mc_options: [
      "const createApplicationLogic = () => ({});",
      "function createApplicationLogic() { return {}; }",
      "function createApplicationLogic(): object { return {}; }",
    ],
    mc_correct_option: "function createApplicationLogic(): object { return {}; }",
    mc_anchor: "function createApplicationLogic(): object {",
    why_this_matters: "Encapsulating related logic within a single function or object (often called a 'module pattern' or 'factory function') helps manage complexity. It creates a clear boundary for responsibilities and can help prevent global variable pollution, making the codebase more organized and easier to test.",
    answer_keywords: ["function", "createApplicationLogic", "object", "return", "{}"],
    seed_code: `function startApplication(port: number): void {
  console.log(\`Application online at \${port}\`);
}

interface ApplicationMetrics {
  status: 'ok' | 'degraded' | 'unavailable';
  requestCount: number;
  uptimeSeconds: number;
}`,
    starter_code: `function startApplication(port: number): void {
  console.log(\`Application online at \${port}\`);
}

interface ApplicationMetrics {
  status: 'ok' | 'degraded' | 'unavailable';
  requestCount: number;
  uptimeSeconds: number;
}

// Define the core application logic function here
`,
    feedback_correct: "Perfect! You've created the `createApplicationLogic` function that returns an empty object. This sets the stage for adding our state and behavior.",
    feedback_partial: "You're on the right track with the function and returning an object. Just ensure you explicitly declare the return type as `object` for clarity and type safety.",
    feedback_wrong: "Not quite. Remember to define a named function using the `function` keyword, and it should return an empty object (`{}`). Also, consider adding an explicit return type for the object.",
    expected: `function startApplication(port: number): void {
  console.log(\`Application online at \${port}\`);
}

interface ApplicationMetrics {
  status: 'ok' | 'degraded' | 'unavailable';
  requestCount: number;
  uptimeSeconds: number;
}

function createApplicationLogic(): object {
  return {};
}`,
    analog_example: `function createMediaPlayer() {
  let currentTrack = '';
  let isPlaying = false;

  return {
    play: (track: string) => { currentTrack = track; isPlaying = true; console.log(\`Playing \${track}\`); },
    pause: () => { isPlaying = false; console.log('Paused'); },
    getStatus: () => ({ currentTrack, isPlaying })
  };
}

// Later: const player = createMediaPlayer(); player.play("Song A");`,
    deepDiveLabel: "What is a 'factory function' pattern?",
    deepDive: {
      hook: `Imagine you're running a custom car manufacturing plant. Instead of building each car from scratch every time, you have a blueprint and a dedicated assembly line that, when activated, produces a brand new, fully functional car. Each car is independent, has its own engine, wheels, and interior, and can be driven separately. In software, when you need multiple independent instances of a complex object or a set of related functionalities, writing the creation logic repeatedly is inefficient and error-prone. A factory function solves this by providing a single, reusable 'assembly line' that generates new instances, each with its own encapsulated state and methods, without you having to manually set up everything every time. This is especially useful when you want to hide internal details and only expose a public interface.`,
      pain: `⚠️ **Lesson:** Duplicating object creation logic or exposing internal state directly can lead to inconsistent objects, tight coupling, and difficult maintenance. Symptom: Multiple parts of the codebase manually initialize complex objects, leading to subtle differences or errors in configuration, or direct manipulation of an object's internal properties, breaking its intended behavior.`,
      mentalModel: `**Mental model:** The Blueprint and Assembly Line. A factory function is like a blueprint for creating objects, combined with an automated assembly line. You define the blueprint once (the function itself), and every time you call the factory function, it runs through its 'assembly line' to construct and return a new, independent instance of the object. This new instance comes pre-configured and ready to use, often with its internal workings hidden from the outside world, exposing only the necessary public methods. This ensures consistency and simplifies the creation process for complex entities.`,
      discover: `**Pattern - Factory Function:**
\`\`\`tsx
function createLogger(prefix: string) {
  const timestamp = new Date().toISOString(); // Internal state

  return {
    log: (message: string) => {
      console.log(\`[\${timestamp}] [\${prefix}] \${message}\`);
    },
    warn: (message: string) => {
      console.warn(\`[\${timestamp}] [\${prefix}] WARNING: \${message}\`);
    }
  };
}

const appLogger = createLogger('APP');
const dbLogger = createLogger('DB');

appLogger.log('Application started'); // [2023-10-27T...] [APP] Application started
dbLogger.warn('Database connection lost'); // [2023-10-27T...] [DB] WARNING: Database connection lost
\`\`\`
- \`createLogger\` is a factory function that returns an object with \`log\` and \`warn\` methods.
- Each call to \`createLogger\` creates a *new*, independent logger instance with its own \`timestamp\` and \`prefix\`.
- Internal state (\`timestamp\`) is encapsulated and not directly accessible from outside the returned object.
- This promotes modularity and reusability, allowing you to create multiple instances of similar functionality.`,
      quickRules: `**Quick rules:**
- ✅ Use factory functions when you need to create multiple instances of an object with encapsulated state.
- ✅ They are excellent for hiding implementation details and exposing only a public API.
- ✅ Factory functions can take arguments to customize the created object's initial state.
- ✅ They promote code reusability and reduce duplication in object creation.
- ❌ Don't use factory functions if you only ever need a single instance of an object (a simple object literal or singleton might be better).
- ❌ Avoid over-complicating simple object creation with a factory if it doesn't add clear value.
- ❌ Never expose the internal state directly from a factory function's returned object if encapsulation is desired.`,
      watchOut: `👀 **Watch out:** While factory functions are powerful for encapsulation, be mindful of memory usage if you're creating a very large number of instances, as each instance will hold its own copy of the encapsulated state and methods (though methods often share references if defined outside the closure). For very performance-critical scenarios with many instances, class-based approaches might offer different optimization characteristics.`,
      dryRun: `🔁 **Think:** If \`createCounter()\` is called twice: \`const counter1 = createCounter(); const counter2 = createCounter();\`. \`counter1.increment()\` makes \`counter1.getCount()\` return \`1\`. \`counter2.increment()\` makes \`counter2.getCount()\` return \`1\`. \`counter1.getCount()\` still returns \`1\`. This shows each instance has its own \`count\` variable, isolated from the other. (Hint: Each factory-created object has independent state.)`,
      build: "**Learning focus:** Create a factory function to encapsulate the application's core logic.",
    },
  },
  {
    id: "step4",
    type: "question",
    phase: "Step 4 of 7",
    paal: "Inside our `createApplicationLogic` function, we need to declare variables to hold the dynamic data for our application's health and metrics. These will be the 'state' that our endpoints report.",
    hint: "Think about the properties defined in your `ApplicationMetrics` interface: `requestCount`, `uptimeSeconds`, and `status`. How would you store these as variables within the `createApplicationLogic` scope?",
    example_code: `function createGame() {
  let score = 0;
  let gameOver = false;
  // ...
}`,
    think_prompt: "Inside the `createApplicationLogic` function, declare the following variables: `requestCount` initialized to `0` (type `number`), `startTime` initialized to `Date.now()` (type `number`), and `isHealthy` initialized to `true` (type `boolean`).",
    mc_options: [
      "let requestCount: number = 0; let startTime: number = Date.now(); let isHealthy: boolean = true;",
      "const requestCount = 0; const startTime = Date.now(); const isHealthy = true;",
      "var requestCount = 0, startTime = Date.now(), isHealthy = true;",
    ],
    mc_correct_option: "let requestCount: number = 0; let startTime: number = Date.now(); let isHealthy: boolean = true;",
    mc_anchor: "let requestCount: number = 0;",
    why_this_matters: "These variables represent the application's internal state. By declaring them within the `createApplicationLogic` function, they are encapsulated and private to the logic created by this factory, preventing accidental modification from outside and ensuring each instance of the logic has its own independent state.",
    answer_keywords: ["let", "requestCount", "number", "0", "startTime", "Date.now", "isHealthy", "boolean", "true"],
    seed_code: `function startApplication(port: number): void {
  console.log(\`Application online at \${port}\`);
}

interface ApplicationMetrics {
  status: 'ok' | 'degraded' | 'unavailable';
  requestCount: number;
  uptimeSeconds: number;
}

function createApplicationLogic(): object {
  return {};
}`,
    starter_code: `function startApplication(port: number): void {
  console.log(\`Application online at \${port}\`);
}

interface ApplicationMetrics {
  status: 'ok' | 'degraded' | 'unavailable';
  requestCount: number;
  uptimeSeconds: number;
}

function createApplicationLogic(): object {
  // Declare variables to hold application state and metrics
  return {};
}`,
    feedback_correct: "Excellent! You've correctly declared the state variables with their initial values and types inside the `createApplicationLogic` function. These will be the foundation for our metrics.",
    feedback_partial: "You're close! You've declared the variables, but remember to use `let` for variables that will change, and explicitly add type annotations for clarity and type safety.",
    feedback_wrong: "Not quite. Ensure you're using `let` for variables that will be modified (like `requestCount` and `isHealthy`), and `Date.now()` is a function call. Also, explicitly add type annotations for `number` and `boolean`.",
    expected: `function startApplication(port: number): void {
  console.log(\`Application online at \${port}\`);
}

interface ApplicationMetrics {
  status: 'ok' | 'degraded' | 'unavailable';
  requestCount: number;
  uptimeSeconds: number;
}

function createApplicationLogic(): object {
  let requestCount: number = 0;
  let startTime: number = Date.now();
  let isHealthy: boolean = true;
  return {};
}`,
    analog_example: `function createTimer() {
  let elapsedSeconds: number = 0;
  let isRunning: boolean = false;
  let intervalId: NodeJS.Timeout | null = null; // For a real timer

  // ... methods to start/stop/reset ...
}`,
    deepDiveLabel: "Why use `let` instead of `const` for these variables?",
    deepDive: {
      hook: `Imagine you're tracking the number of laps a runner has completed in a race. If you used a permanent marker (like \`const\`) to write down '0 laps' on a whiteboard, you wouldn't be able to update it as the runner completes more laps. You'd be stuck at zero! Similarly, if you're managing a toggle switch that can be 'on' or 'off', and you declare its state with \`const\`, you can't change it from 'on' to 'off' when the user interacts with it. In programming, many values need to change over time – a counter increments, a status flips, a timestamp updates. Using the wrong declaration keyword (\`const\` when \`let\` is needed) leads to immutable values when mutability is required, causing your program to fail to update its state, or even crash with errors.`,
      pain: `⚠️ **Lesson:** Using \`const\` for variables that are intended to change over time prevents state updates, leading to static or incorrect application behavior and runtime errors. Symptom: A counter variable declared with \`const\` cannot be incremented, resulting in an error like 'Cannot assign to 'count' because it is a constant or read-only property.'`,
      mentalModel: `**Mental model:** The Mutable vs. Immutable Label. Think of \`const\` as a permanent, unchangeable label for a value. Once you stick it on, that label always points to the *exact same value*. If that value is a primitive (like a number or string), the value itself cannot change. If it's an object, the label still points to the same object, but the *contents* of the object might be mutable. In contrast, \`let\` is like a sticky note that you can peel off and re-stick to a *different* value. It signifies that the variable's assignment can change over time. For our metrics, \`requestCount\` and \`isHealthy\` are inherently dynamic, so \`let\` is the appropriate choice to allow their values to be updated.`,
      discover: `**Pattern - Variable Declaration with \`let\` and \`const\`:**
\`\`\`tsx
let mutableCount: number = 0;
mutableCount = 1; // ✅ Allowed

const immutableId: string = "abc";
// immutableId = "xyz"; // ❌ TypeScript error: Cannot assign to 'immutableId' because it is a constant.

const settings = { theme: "dark" };
settings.theme = "light"; // ✅ Allowed (object content is mutable, but 'settings' still points to the same object)
// settings = { theme: "light" }; // ❌ TypeScript error: Cannot assign to 'settings' because it is a constant.
\`\`\`
- \`let\` declares a variable whose value can be reassigned. Use it for state that changes.
- \`const\` declares a constant whose value cannot be reassigned after initialization. Use it for values that should never change their reference.
- For primitive types (number, string, boolean), \`const\` makes the value itself immutable.
- For objects/arrays, \`const\` makes the *reference* to the object/array immutable, but the object's *contents* can still be modified.`,
      quickRules: `**Quick rules:**
- ✅ Use \`let\` for variables whose values will change or be reassigned.
- ✅ Use \`const\` for variables whose values will not change after their initial assignment.
- ✅ Prefer \`const\` by default, and only switch to \`let\` when reassignment is truly necessary.
- ✅ For object/array state, \`const\` prevents reassignment of the entire object, but allows modification of its properties.
- ❌ Never use \`const\` for counters, flags, or other state that must be updated.
- ❌ Don't use \`var\` in modern TypeScript/JavaScript; prefer \`let\` or \`const\`.
- ❌ Avoid declaring variables without \`let\` or \`const\` (implicit globals).`,
      watchOut: `👀 **Watch out:** A common misconception is that \`const\` makes an object entirely immutable. It only prevents reassignment of the variable itself. If you need deep immutability for objects or arrays, you'll need to use techniques like freezing objects (\`Object.freeze()\`) or immutable data structures. For our simple metrics, \`let\` is appropriate because we're reassigning primitive values.`,
      dryRun: `🔁 **Think:** If \`requestCount\` was \`const requestCount = 0;\`, then \`requestCount++\` would fail. With \`let requestCount = 0;\`, \`requestCount++\` changes \`requestCount\` from \`0\` to \`1\`. Then \`requestCount++\` again changes it from \`1\` to \`2\`. This allows the counter to update. (Hint: \`let\` allows value changes, \`const\` prevents them.)`,
      build: "**Learning focus:** Declare mutable state variables within the application logic function.",
    },
  },
  {
    id: "step5",
    type: "question",
    phase: "Step 5 of 7",
    paal: "Before we implement specific health and metrics endpoints, our application needs a way to process *any* incoming request. This generic request handler will be responsible for common tasks, like incrementing our `requestCount`.",
    hint: "Think about a function that takes a request path and updates the `requestCount` variable. This function will be part of the object returned by `createApplicationLogic`.",
    example_code: `function createTodoManager() {
  let todos: string[] = [];
  return {
    addTodo: (text: string) => { todos.push(text); },
    getTodos: () => todos
  };
}`,
    think_prompt: "Inside `createApplicationLogic`, add a method named `handleIncomingRequest` to the returned object. This method should accept a `path` (type `string`), increment `requestCount`, and return a string indicating the request was processed.",
    mc_options: [
      "return { handleIncomingRequest: (path: string) => { requestCount++; return `Processed ${path}`; } };",
      "return { handleIncomingRequest: function(path: string) { requestCount++; return `Request for ${path} received.`; } };",
      "return { handleIncomingRequest(path: string): string { requestCount++; return `Request for ${path} received.`; } };",
    ],
    mc_correct_option: "return { handleIncomingRequest(path: string): string { requestCount++; return `Request for ${path} received.`; } };",
    mc_anchor: "return { handleIncomingRequest(path: string): string {",
    why_this_matters: "A generic request handler is the first point of contact for all incoming requests. It's the ideal place to implement cross-cutting concerns like request logging, authentication checks, or, in our case, incrementing a global request counter. This ensures that every request contributes to our metrics, regardless of its specific purpose.",
    answer_keywords: ["handleIncomingRequest", "path", "string", "requestCount++", "return", "string"],
    seed_code: `function startApplication(port: number): void {
  console.log(\`Application online at \${port}\`);
}

interface ApplicationMetrics {
  status: 'ok' | 'degraded' | 'unavailable';
  requestCount: number;
  uptimeSeconds: number;
}

function createApplicationLogic(): object {
  let requestCount: number = 0;
  let startTime: number = Date.now();
  let isHealthy: boolean = true;
  return {};
}`,
    starter_code: `function startApplication(port: number): void {
  console.log(\`Application online at \${port}\`);
}

interface ApplicationMetrics {
  status: 'ok' | 'degraded' | 'unavailable';
  requestCount: number;
  uptimeSeconds: number;
}

function createApplicationLogic(): object {
  let requestCount: number = 0;
  let startTime: number = Date.now();
  let isHealthy: boolean = true;
  // Implement a generic request handler
  return {};
}`,
    feedback_correct: "Fantastic! You've successfully added the `handleIncomingRequest` method, incrementing the `requestCount` and returning a confirmation. This is our basic request processing structure.",
    feedback_partial: "You're very close! The logic for incrementing and returning a string is correct. Just ensure the method is defined directly within the returned object literal using the shorthand method syntax for cleaner code, and explicitly add the return type.",
    feedback_wrong: "Not quite. Remember that methods within an object literal can use a shorthand syntax. Ensure the `handleIncomingRequest` method is correctly defined, takes a `path` of type `string`, increments `requestCount`, and returns a `string`.",
    expected: `function startApplication(port: number): void {
  console.log(\`Application online at \${port}\`);
}

interface ApplicationMetrics {
  status: 'ok' | 'degraded' | 'unavailable';
  requestCount: number;
  uptimeSeconds: number;
}

function createApplicationLogic(): {
  handleIncomingRequest(path: string): string;
} {
  let requestCount: number = 0;
  let startTime: number = Date.now();
  let isHealthy: boolean = true;
  return {
    handleIncomingRequest(path: string): string {
      requestCount++;
      return \`Request for \${path} received.\`;
    }
  };
}`,
    analog_example: `function createLoggerService() {
  let logEntries: string[] = [];
  return {
    logEvent(message: string) {
      const timestamp = new Date().toISOString();
      logEntries.push(\`[\${timestamp}] \${message}\`);
    },
    getLogs: () => [...logEntries] // Return a copy
  };
}

// Later: const logger = createLoggerService(); logger.logEvent("User logged in");`,
    deepDiveLabel: "What is method shorthand syntax in object literals?",
    deepDive: {
      hook: `Imagine you're writing a recipe book, and for every recipe, you have to write "function cookMeal() { ... }" or "cookMeal: function() { ... }". It's repetitive and adds visual clutter. What if you could just write "cookMeal() { ... }"? This is exactly the kind of convenience that modern JavaScript (and TypeScript) offers for defining methods within object literals. Before this shorthand, you'd either use the older \`key: function() {}\` syntax or assign arrow functions. While functional, these approaches can be verbose. The shorthand syntax makes object definitions cleaner and more concise, especially when you have many methods, improving readability and reducing boilerplate.`,
      pain: `⚠️ **Lesson:** Verbose method definitions in object literals can reduce readability and increase boilerplate code, making objects harder to scan and understand quickly. Symptom: Object definitions become long and visually heavy due to repeated \`function\` keywords or arrow function assignments, obscuring the core logic.`,
      mentalModel: `**Mental model:** The Direct Action. Think of the method shorthand as directly stating the action an object can perform, without needing extra ceremonial words. Instead of saying "Here's a property named 'doSomething', and its value is a function that does something," you simply say "Here's 'doSomething', and *this is what it does*." It's a more direct and intuitive way to express behavior within an object, much like how you'd list actions in a bulleted list.`,
      discover: `**Pattern - Object Method Shorthand:**
\`\`\`tsx
const calculator = {
  value: 0,
  add(num: number) { // Shorthand syntax
    this.value += num;
  },
  subtract: function(num: number) { // Traditional syntax
    this.value -= num;
  },
  getResult: () => { // Arrow function syntax
    return calculator.value; // 'this' context is tricky with arrow functions here
  }
};

calculator.add(5);
console.log(calculator.getResult()); // Outputs: 5
\`\`\`
- The method shorthand \`add(num: number) { ... }\` is a concise way to define a function as a property of an object.
- It automatically binds \`this\` to the object itself, which is crucial for accessing other properties (like \`this.value\`).
- It's equivalent to \`add: function(num: number) { ... }\` but more compact.
- Arrow functions (\`getResult: () => { ... }\`) do not bind their own \`this\`, inheriting it from the surrounding scope, which can be a source of confusion if not used carefully within object methods.`,
      quickRules: `**Quick rules:**
- ✅ Use method shorthand for most methods within object literals.
- ✅ It provides a concise syntax and correctly binds \`this\` to the object.
- ✅ Improves readability by reducing boilerplate.
- ✅ It's the modern, idiomatic way to define methods in objects.
- ❌ Avoid using \`function\` keyword for methods in object literals when shorthand is available.
- ❌ Don't use arrow functions for methods that need their own \`this\` context (e.g., accessing \`this.property\`).
- ❌ Never mix and match too many different method definition styles within the same object if consistency is desired.`,
      watchOut: `👀 **Watch out:** The main pitfall with method shorthand (and traditional \`function\` syntax) versus arrow functions is how \`this\` is bound. Method shorthand correctly binds \`this\` to the object itself, allowing you to access \`this.requestCount\`. Arrow functions, however, do not bind their own \`this\`; they inherit it from their lexical parent. For our \`handleIncomingRequest\` that needs to modify \`requestCount\`, the shorthand is ideal.`,
      dryRun: `🔁 **Think:** If \`myObject = { value: 0, increment() { this.value++; } }\`, then \`myObject.increment()\` changes \`myObject.value\` from \`0\` to \`1\`. If it was \`increment: () => { this.value++; }\`, \`this\` would not refer to \`myObject\`, and \`this.value++\` would likely cause an error or modify a global \`value\` if one existed. (Hint: \`this\` context is key for object methods.)`,
      build: "**Learning focus:** Add a generic request handler method to the application logic object using method shorthand.",
    },
  },
  {
    id: "step6",
    type: "question",
    phase: "Step 6 of 7",
    paal: "Now that we have our state variables and a generic request handler, let's implement the specific logic for our health and metrics endpoints. We'll add methods to `createApplicationLogic` that calculate and return the appropriate data.",
    hint: "You'll need two new methods: one to get the current health status (using `isHealthy`) and another to compile the `ApplicationMetrics` object (using `requestCount`, `startTime`, and `isHealthy`).",
    example_code: `function createSensorReader() {
  let currentTemp = 20;
  return {
    getTemperature: () => currentTemp,
    setTemperature: (temp: number) => { currentTemp = temp; }
  };
}`,
    think_prompt: "Inside `createApplicationLogic`, add two new methods: `getHealthStatus` (returns `'ok'` if `isHealthy` is true, otherwise `'degraded'`) and `getMetrics` (returns an `ApplicationMetrics` object). Remember to calculate `uptimeSeconds`.",
    mc_options: [
      `getHealthStatus(): 'ok' | 'degraded' { return isHealthy ? 'ok' : 'degraded'; }, getMetrics(): ApplicationMetrics { const uptime = Math.floor((Date.now() - startTime) / 1000); return { status: this.getHealthStatus(), requestCount, uptimeSeconds: uptime }; }`,
      `getHealthStatus() { return isHealthy ? 'ok' : 'degraded'; }, getMetrics(): ApplicationMetrics { const uptime = Math.floor((Date.now() - startTime) / 1000); return { status: isHealthy ? 'ok' : 'degraded', requestCount: requestCount, uptimeSeconds: uptime }; }`,
      `getHealthStatus(): 'ok' | 'degraded' { return isHealthy ? 'ok' : 'degraded'; }, getMetrics(): ApplicationMetrics { const uptime = Math.floor((Date.now() - startTime) / 1000); return { status: isHealthy ? 'ok' : 'degraded', requestCount, uptimeSeconds: uptime }; }`,
    ],
    mc_correct_option: `getHealthStatus(): 'ok' | 'degraded' { return isHealthy ? 'ok' : 'degraded'; }, getMetrics(): ApplicationMetrics { const uptime = Math.floor((Date.now() - startTime) / 1000); return { status: isHealthy ? 'ok' : 'degraded', requestCount, uptimeSeconds: uptime }; }`,
    mc_anchor: `getHealthStatus(): 'ok' | 'degraded' {`,
    why_this_matters: "These methods are the heart of our observability. `getHealthStatus` provides a quick, binary check for external systems, while `getMetrics` offers a richer dataset for detailed monitoring. Separating these concerns into distinct, focused methods makes the code easier to understand, test, and maintain.",
    answer_keywords: ["getHealthStatus", "isHealthy", "ok", "degraded", "getMetrics", "ApplicationMetrics", "uptime", "Date.now", "startTime", "requestCount"],
    seed_code: `function startApplication(port: number): void {
  console.log(\`Application online at \${port}\`);
}

interface ApplicationMetrics {
  status: 'ok' | 'degraded' | 'unavailable';
  requestCount: number;
  uptimeSeconds: number;
}

function createApplicationLogic(): {
  handleIncomingRequest(path: string): string;
} {
  let requestCount: number = 0;
  let startTime: number = Date.now();
  let isHealthy: boolean = true;
  return {
    handleIncomingRequest(path: string): string {
      requestCount++;
      return \`Request for \${path} received.\`;
    }
  };
}`,
    starter_code: `function startApplication(port: number): void {
  console.log(\`Application online at \${port}\`);
}

interface ApplicationMetrics {
  status: 'ok' | 'degraded' | 'unavailable';
  requestCount: number;
  uptimeSeconds: number;
}

function createApplicationLogic(): {
  handleIncomingRequest(path: string): string;
} {
  let requestCount: number = 0;
  let startTime: number = Date.now();
  let isHealthy: boolean = true;
  return {
    handleIncomingRequest(path: string): string {
      requestCount++;
      return \`Request for \${path} received.\`;
    }
    // Implement specific logic for health and metrics here
  };
}`,
    feedback_correct: "Excellent work! You've correctly implemented both `getHealthStatus` and `getMetrics`, including the `uptimeSeconds` calculation. This completes the core logic for our observability endpoints.",
    feedback_partial: "You're very close! Both methods are defined, but double-check the return type for `getHealthStatus` to ensure it uses the string literal union. Also, ensure `getMetrics` correctly uses the `ApplicationMetrics` interface and calculates `uptimeSeconds`.",
    feedback_wrong: "Not quite. Remember to define `getHealthStatus` to return either 'ok' or 'degraded' based on `isHealthy`. For `getMetrics`, ensure you're constructing an object that matches the `ApplicationMetrics` interface, calculating `uptimeSeconds` from `startTime` and `Date.now()`, and explicitly setting the `status` based on `isHealthy`.",
    expected: `function startApplication(port: number): void {
  console.log(\`Application online at \${port}\`);
}

interface ApplicationMetrics {
  status: 'ok' | 'degraded' | 'unavailable';
  requestCount: number;
  uptimeSeconds: number;
}

function createApplicationLogic(): {
  handleIncomingRequest(path: string): string;
  getHealthStatus(): 'ok' | 'degraded' | 'unavailable';
  getMetrics(): ApplicationMetrics;
} {
  let requestCount: number = 0;
  let startTime: number = Date.now();
  let isHealthy: boolean = true; // This could be toggled by other app logic
  return {
    handleIncomingRequest(path: string): string {
      requestCount++;
      return \`Request for \${path} received.\`;
    },
    getHealthStatus(): 'ok' | 'degraded' | 'unavailable' {
      // In a real app, this would check database connections, external services, etc.
      return isHealthy ? 'ok' : 'degraded';
    },
    getMetrics(): ApplicationMetrics {
      const uptime = Math.floor((Date.now() - startTime) / 1000);
      return {
        status: isHealthy ? 'ok' : 'degraded', // Use the health status directly here
        requestCount: requestCount,
        uptimeSeconds: uptime,
      };
    }
  };
}`,
    analog_example: `function createWeatherStation() {
  let currentTemperature = 25; // Celsius
  let currentHumidity = 60; // Percent
  let sensorError = false;

  return {
    readTemperature(): number {
      return currentTemperature;
    },
    readHumidity(): number {
      return currentHumidity;
    },
    getSensorStatus(): 'online' | 'offline' {
      return sensorError ? 'offline' : 'online';
    },
    simulateError: (error: boolean) => { sensorError = error; }
  };
}

// Later: const station = createWeatherStation(); console.log(station.readTemperature());`,
    deepDiveLabel: "How do you ensure `this` refers to the correct object in `getMetrics`?",
    deepDive: {
      hook: `Imagine you're at a party, and someone says, "Pass me *that*." Without pointing, it's unclear what "that" refers to. In JavaScript, the keyword \`this\` can be similarly ambiguous. Its value depends entirely on *how* a function is called, not where it's defined. If you have a method inside an object that needs to call another method on the *same* object (like \`getMetrics\` needing to call \`getHealthStatus\`), and \`this\` isn't correctly bound, you'll get an error like "TypeError: this.getHealthStatus is not a function." This is a very common source of bugs for beginners and experienced developers alike, leading to frustrating debugging sessions trying to figure out what "this" actually is at any given moment.`,
      pain: `⚠️ **Lesson:** Incorrect \`this\` binding can lead to runtime errors when methods try to access other methods or properties on their parent object. Symptom: \`TypeError: this.someMethod is not a function\` or \`Cannot read properties of undefined (reading 'someProperty')\` when calling a method within an object.`,
      mentalModel: `**Mental model:** The Caller's Context. Think of \`this\` as a spotlight that points to the object that *invoked* the function. When you call \`myObject.myMethod()\`, the spotlight shines on \`myObject\`, so \`this\` inside \`myMethod\` refers to \`myObject\`. If you call a function standalone, \`myMethod()\`, the spotlight might shine on the global object (in non-strict mode) or be \`undefined\` (in strict mode). For methods defined using the shorthand syntax (like \`getMetrics() { ... }\`), JavaScript automatically ensures the spotlight is on the parent object when the method is called directly on that object.`,
      discover: `**Pattern - \`this\` in Object Methods:**
\`\`\`tsx
const user = {
  firstName: "Alice",
  lastName: "Smith",
  getFullName() { // Method shorthand
    return \`\${this.firstName} \${this.lastName}\`;
  },
  greet: () => { // Arrow function
    // 'this' here refers to the lexical 'this' (e.g., global object or undefined)
    // NOT the 'user' object itself.
    return \`Hello, \${user.firstName}!\`; // Must explicitly reference 'user'
  }
};

console.log(user.getFullName()); // ✅ 'this' refers to 'user' -> "Alice Smith"

const standaloneGreet = user.getFullName;
// console.log(standaloneGreet()); // ❌ TypeError: Cannot read properties of undefined (reading 'firstName') in strict mode
\`\`\`
- When using method shorthand (\`getFullName() { ... }\`), \`this\` inside the method refers to the object on which the method was called (\`user\` in \`user.getFullName()\`).
- Arrow functions (\`greet: () => { ... }\`) do not have their own \`this\` context; they inherit \`this\` from their surrounding lexical scope. This makes them unsuitable for methods that need to access \`this\` of the object they belong to.
- To ensure \`this\` refers to the correct object when a method is passed around (e.g., as a callback), you might need to \`bind\` it or use an arrow function wrapper. However, for direct calls like \`this.getHealthStatus()\`, the shorthand works perfectly.`,
      quickRules: `**Quick rules:**
- ✅ Use method shorthand (\`methodName() { ... }\`) for methods that need to access \`this\` of their parent object.
- ✅ \`this\` in method shorthand refers to the object that owns the method when called directly on that object.
- ✅ When calling a method like \`obj.method()\`, \`this\` inside \`method\` will be \`obj\`.
- ✅ Be explicit about \`this\` if passing methods as callbacks (e.g., \`myObject.myMethod.bind(myObject)\`).
- ❌ Avoid arrow functions for methods that need to access \`this\` of the object they belong to.
- ❌ Don't assume \`this\` will always refer to the object if the method is extracted and called standalone.
- ❌ Never forget that \`this\` binding is dynamic and depends on the call site.`,
      watchOut: `👀 **Watch out:** The most common mistake is extracting a method from an object (e.g., \`const func = myObject.myMethod;\`) and then calling it standalone (\`func()\`). In this scenario, \`this\` inside \`myMethod\` will no longer refer to \`myObject\`, leading to errors. Always call object methods directly on the object (\`myObject.myMethod()\`) or explicitly bind \`this\` if you need to pass them as callbacks.`,
      dryRun: `🔁 **Think:** In \`getMetrics(): ApplicationMetrics { return { status: this.getHealthStatus(), ... } }\`, when \`getMetrics\` is called as \`appLogic.getMetrics()\`, \`this\` inside \`getMetrics\` refers to \`appLogic\`. Therefore, \`this.getHealthStatus()\` correctly calls the \`getHealthStatus\` method *on the \`appLogic\` object itself*. If \`this\` were \`undefined\`, \`this.getHealthStatus()\` would throw an error. (Hint: The method call context determines \`this\`.)`,
      build: "**Learning focus:** Implement specific methods for calculating and returning health status and metrics data.",
    },
  },
  {
    id: "step7",
    type: "question",
    phase: "Step 7 of 7",
    paal: "Finally, we need to wire our specific health and metrics logic to distinct 'endpoints' or paths. We'll enhance our `handleIncomingRequest` to act as a router, directing requests to the correct handler based on the incoming `path`.",
    hint: "Modify `handleIncomingRequest` to use `if/else if` statements to check the `path`. If the path is `/health`, return the result of `getHealthStatus`. If it's `/metrics`, return the result of `getMetrics` (converted to a string, as we're simulating a simple text response). Otherwise, use the generic response.",
    example_code: `function createRouter() {
  return {
    route(path: string): string {
      if (path === '/home') {
        return 'Welcome home!';
      } else if (path === '/about') {
        return 'About us page.';
      }
      return 'Page not found.';
    }
  };
}`,
    think_prompt: "Update the `handleIncomingRequest` method to route requests: if `path` is `/health`, return the result of `getHealthStatus()`. If `path` is `/metrics`, return a JSON string representation of `getMetrics()` (use `JSON.stringify`). Otherwise, return the generic 'Request received' message.",
    mc_options: [
      `handleIncomingRequest(path: string): string { requestCount++; if (path === '/health') { return this.getHealthStatus(); } else if (path === '/metrics') { return JSON.stringify(this.getMetrics()); } return \`Request for \${path} received.\`; }`,
      `handleIncomingRequest(path: string): string { requestCount++; if (path === '/health') { return this.getHealthStatus(); } if (path === '/metrics') { return JSON.stringify(this.getMetrics()); } return \`Request for \${path} received.\`; }`,
      `handleIncomingRequest(path: string): string { requestCount++; if (path === '/health') return this.getHealthStatus(); else if (path === '/metrics') return JSON.stringify(this.getMetrics()); return \`Request for \${path} received.\`; }`,
    ],
    mc_correct_option: `handleIncomingRequest(path: string): string { requestCount++; if (path === '/health') { return this.getHealthStatus(); } else if (path === '/metrics') { return JSON.stringify(this.getMetrics()); } return \`Request for \${path} received.\`; }`,
    mc_anchor: `handleIncomingRequest(path: string): string {`,
    why_this_matters: "Routing is how an application directs incoming requests to the appropriate logic. By implementing a simple router, we create distinct, addressable endpoints for our health and metrics data. This is how external systems will interact with our application to query its operational status, making it truly observable.",
    answer_keywords: ["handleIncomingRequest", "path", "if", "else if", "health", "metrics", "getHealthStatus", "getMetrics", "JSON.stringify"],
    seed_code: `function startApplication(port: number): void {
  console.log(\`Application online at \${port}\`);
}

interface ApplicationMetrics {
  status: 'ok' | 'degraded' | 'unavailable';
  requestCount: number;
  uptimeSeconds: number;
}

function createApplicationLogic(): {
  handleIncomingRequest(path: string): string;
  getHealthStatus(): 'ok' | 'degraded' | 'unavailable';
  getMetrics(): ApplicationMetrics;
} {
  let requestCount: number = 0;
  let startTime: number = Date.now();
  let isHealthy: boolean = true; // This could be toggled by other app logic
  return {
    handleIncomingRequest(path: string): string {
      requestCount++;
      return \`Request for \${path} received.\`;
    },
    getHealthStatus(): 'ok' | 'degraded' | 'unavailable' {
      // In a real app, this would check database connections, external services, etc.
      return isHealthy ? 'ok' : 'degraded';
    },
    getMetrics(): ApplicationMetrics {
      const uptime = Math.floor((Date.now() - startTime) / 1000);
      return {
        status: isHealthy ? 'ok' : 'degraded', // Use the health status directly here
        requestCount: requestCount,
        uptimeSeconds: uptime,
      };
    }
  };
}`,
    starter_code: `function startApplication(port: number): void {
  console.log(\`Application online at \${port}\`);
}

interface ApplicationMetrics {
  status: 'ok' | 'degraded' | 'unavailable';
  requestCount: number;
  uptimeSeconds: number;
}

function createApplicationLogic(): {
  handleIncomingRequest(path: string): string;
  getHealthStatus(): 'ok' | 'degraded' | 'unavailable';
  getMetrics(): ApplicationMetrics;
} {
  let requestCount: number = 0;
  let startTime: number = Date.now();
  let isHealthy: boolean = true; // This could be toggled by other app logic
  return {
    handleIncomingRequest(path: string): string {
      requestCount++;
      // Wire the specific logic to distinct application paths
      return \`Request for \${path} received.\`;
    },
    getHealthStatus(): 'ok' | 'degraded' | 'unavailable' {
      // In a real app, this would check database connections, external services, etc.
      return isHealthy ? 'ok' : 'degraded';
    },
    getMetrics(): ApplicationMetrics {
      const uptime = Math.floor((Date.now() - startTime) / 1000);
      return {
        status: isHealthy ? 'ok' : 'degraded', // Use the health status directly here
        requestCount: requestCount,
        uptimeSeconds: uptime,
      };
    }
  };
}`,
    feedback_correct: "Fantastic! You've successfully implemented the routing logic within `handleIncomingRequest`, directing requests to the correct health or metrics handlers. Your application now has observable endpoints!",
    feedback_partial: "You're very close! The `if/else if` structure is correct, and you're calling the right methods. Just ensure that the `/metrics` endpoint returns a *stringified* JSON representation of the metrics object, as endpoints typically return text or JSON.",
    feedback_wrong: "Not quite. Remember to use `if/else if` statements to check for specific paths like `/health` and `/metrics`. For `/metrics`, you need to convert the `ApplicationMetrics` object into a JSON string using `JSON.stringify()` before returning it.",
    expected: `function startApplication(port: number): void {
  console.log(\`Application online at \${port}\`);
}

interface ApplicationMetrics {
  status: 'ok' | 'degraded' | 'unavailable';
  requestCount: number;
  uptimeSeconds: number;
}

function createApplicationLogic(): {
  handleIncomingRequest(path: string): string;
  getHealthStatus(): 'ok' | 'degraded' | 'unavailable';
  getMetrics(): ApplicationMetrics;
} {
  let requestCount: number = 0;
  let startTime: number = Date.now();
  let isHealthy: boolean = true; // This could be toggled by other app logic
  return {
    handleIncomingRequest(path: string): string {
      requestCount++; // Increment for every request
      if (path === '/health') {
        return this.getHealthStatus();
      } else if (path === '/metrics') {
        return JSON.stringify(this.getMetrics()); // Return JSON string
      }
      return \`Request for \${path} received.\`; // Generic response for other paths
    },
    getHealthStatus(): 'ok' | 'degraded' | 'unavailable' {
      // In a real app, this would check database connections, external services, etc.
      return isHealthy ? 'ok' : 'degraded';
    },
    getMetrics(): ApplicationMetrics {
      const uptime = Math.floor((Date.now() - startTime) / 1000);
      return {
        status: isHealthy ? 'ok' : 'degraded', // Use the health status directly here
        requestCount: requestCount,
        uptimeSeconds: uptime,
      };
    }
  };
}`,
    analog_example: `function createCommandProcessor() {
  let lastCommand = 'none';
  return {
    processCommand(command: string): string {
      lastCommand = command;
      if (command === 'status') {
        return \`Last command: \${lastCommand}\`;
      } else if (command === 'reset') {
        lastCommand = 'none';
        return 'System reset.';
      }
      return \`Unknown command: \${command}\`;
    }
  };
}

// Later: const processor = createCommandProcessor(); console.log(processor.processCommand('status'));`,
    deepDiveLabel: "Why is `JSON.stringify` necessary for the metrics endpoint?",
    deepDive: {
      hook: `Imagine you're trying to send a complex, multi-part instruction manual to someone, but the only way you can communicate is by writing on a single, continuous scroll of paper. You can't send separate booklets or diagrams; everything has to be flattened into a single, readable text stream. This is similar to how web servers often communicate. While your application might internally work with rich JavaScript objects, when it sends data over the network (especially for a simple HTTP response), that data needs to be converted into a universally understood text format. If you try to send a raw JavaScript object, the receiving system won't know how to interpret it, leading to errors or unreadable output.`,
      pain: `⚠️ **Lesson:** Sending raw JavaScript objects over a network without serialization results in unreadable or uninterpretable data for the client. Symptom: A client receives \`[object Object]\` or malformed data instead of structured information, leading to parsing errors or incorrect display.`,
      mentalModel: `**Mental model:** The Universal Language Translator. Think of \`JSON.stringify\` as a universal language translator that converts a complex JavaScript object (which is like a thought in your application's native language) into a standardized, text-based format called JSON (JavaScript Object Notation). JSON is a widely adopted "lingua franca" for data exchange across different programming languages and systems. The receiving system can then use its own "translator" (\`JSON.parse\`) to convert the JSON text back into its native object representation. This ensures that structured data can be reliably transmitted and understood by any compatible system.`,
      discover: `**Pattern - JSON Serialization and Deserialization:**
\`\`\`tsx
const myObject = {
  name: "Widget",
  id: 123,
  isActive: true,
  tags: ["tool", "utility"]
};

// Serialization: JavaScript object -> JSON string
const jsonString = JSON.stringify(myObject);
console.log(jsonString); // Output: {"name":"Widget","id":123,"isActive":true,"tags":["tool","utility"]}

// Deserialization: JSON string -> JavaScript object
const parsedObject = JSON.parse(jsonString);
console.log(parsedObject.name); // Output: Widget
\`\`\`
- \`JSON.stringify(value)\` converts a JavaScript value (object, array, primitive) into a JSON string.
- \`JSON.parse(text)\` parses a JSON string, constructing the JavaScript value or object described by the string.
- JSON is a text format that is completely language-independent, making it ideal for data exchange between different systems.
- For web endpoints, returning JSON strings is standard practice for structured data responses.`,
      quickRules: `**Quick rules:**
- ✅ Use \`JSON.stringify()\` to convert JavaScript objects into a string format for network transmission or storage.
- ✅ Use \`JSON.parse()\` to convert JSON strings received from a network or storage back into JavaScript objects.
- ✅ Always ensure the data being stringified is compatible with JSON (e.g., no functions, \`undefined\` values will be omitted).
- ✅ Set the \`Content-Type\` header to \`application/json\` when sending JSON responses from a server.
- ❌ Never send raw JavaScript objects directly over HTTP responses.
- ❌ Don't try to \`JSON.parse()\` non-JSON strings; it will throw an error.
- ❌ Avoid including functions or circular references in objects you intend to stringify, as they won't serialize correctly.`,
      watchOut: `👀 **Watch out:** \`JSON.stringify\` will silently omit properties that are functions, \`undefined\`, or \`Symbol\` values. It also cannot handle circular references in objects (where an object directly or indirectly refers back to itself), which will cause a \`TypeError\`. For complex objects, ensure they are 'plain' data objects suitable for serialization.`,
      dryRun: `🔁 **Think:** If \`metrics = { status: 'ok', requestCount: 5 }\`, then \`JSON.stringify(metrics)\` produces the string \`'{"status":"ok","requestCount":5}'\`. If we tried to return \`metrics\` directly, the client might receive \`[object Object]\`, which is not a parseable data format. The stringified version is what a browser or another service expects to \`JSON.parse()\` into its own object. (Hint: Network communication requires data serialization.)`,
      build: "**Learning focus:** Implement routing logic to expose health and metrics data as distinct, stringified endpoints.",
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
  { label: "Step 6", id: "step6" },
  { label: "Step 7", id: "step7" },
];

export default createINPACTEngine({
  NODES,
  sideItems,
  lessonNum: 0,
  title: "Making Your Application Observable: Health & Metrics Endpoints",
  shortName: "Health & Metrics",
});
