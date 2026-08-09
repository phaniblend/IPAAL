import createINPACTEngine from "../inpact_engine_shared";

// Define a generic Request type for our workflow example
interface Request {
  id: string;
  amount: number;
  status: "pending" | "approved" | "manual_review";
}

// Initial configuration for our workflow rules
let currentWorkflowConfig = {
  minAmountForManualReview: 1000,
  autoApproveEnabled: true,
};

export const NODES = [
  {
    id: "intro",
    type: "reveal",
    phase: "Lesson",
    content: {
      tag: "configurable-auto-approval",
      title: "Implementing Configuration-Driven Workflow Rules",
      body: `Software systems often need to adapt their behavior without requiring a full code change and redeployment. Imagine a scenario where a business rule, like an approval threshold or a feature flag, needs to be adjusted frequently by an administrator, not a developer. Hardcoding these values directly into the application's source code creates a rigid system. Every minor tweak would necessitate a developer's time, a code review, testing, and a deployment cycle, slowing down business agility and increasing the risk of errors. Externalizing these rules into a configuration layer solves this problem by decoupling the rule definition from the application's core logic.

This pattern is incredibly versatile and appears in many forms across software engineering. You'll find it powering feature flags that enable or disable parts of an application for specific user groups, A/B testing parameters that control which version of a UI a user sees, user preference settings, localization settings, API rate limits, and dynamic form validation rules. Any time an application's behavior needs to be flexible and adjustable by non-developers or external systems, a configuration-driven approach is the robust solution. It empowers stakeholders to fine-tune the system's operation without direct code intervention.`,
      usecase: `A system that processes incoming financial requests needs to decide whether a request can be automatically approved or if it requires manual review. The criteria for this decision (e.g., a minimum amount for manual review, or whether auto-approval is even enabled) must be adjustable by an administrator via an API, without deploying new code.`,
    },
  },
  {
    id: "objectives",
    type: "objectives",
    phase: "Objectives",
    items: [
      "Define a structured configuration object for workflow rules.",
      "Implement a mechanism to store and retrieve application configuration.",
      "Create API endpoints to read and update configuration settings.",
      "Integrate dynamic configuration into core application logic to alter runtime behavior.",
    ],
  },
  {
    id: "step1",
    type: "question",
    phase: "Step 1 of 5",
    paal: "To make our workflow rules configurable, we first need a clear structure to define what those rules look like. This structure will serve as the blueprint for our configuration object, ensuring consistency and type safety.",
    hint: "Think about what properties would define a simple approval workflow. What kind of data types would they hold?",
    example_code: `interface FeatureFlags {
  isBetaFeatureEnabled: boolean;
  maxItemsInCart: number;
}`,
    think_prompt: "Define an interface named `WorkflowConfig` that includes properties for a minimum amount that triggers manual review (a number) and a boolean flag to enable or disable auto-approval.",
    mc_options: [
      "type WorkflowConfig = { minAmount: string; autoApprove: 'yes' | 'no'; }",
      "interface WorkflowConfig { minAmountForManualReview: number; autoApproveEnabled: boolean; }",
      "class WorkflowConfig { constructor(minAmount: any, autoApprove: any) { } }",
    ],
    mc_correct_option: "interface WorkflowConfig { minAmountForManualReview: number; autoApproveEnabled: boolean; }",
    mc_anchor: "interface WorkflowConfig {",
    why_this_matters: "Defining a clear interface for configuration ensures that all parts of the application interact with the configuration in a consistent and type-safe manner. This prevents errors, improves readability, and makes it easier to understand what settings are available and how they should be used.",
    answer_keywords: ["interface", "WorkflowConfig", "number", "boolean"],
    seed_code: `// Define a generic Request type for our workflow example
interface Request {
  id: string;
  amount: number;
  status: "pending" | "approved" | "manual_review";
}`,
    starter_code: `// Define a generic Request type for our workflow example
interface Request {
  id: string;
  amount: number;
  status: "pending" | "approved" | "manual_review";
}

// Add your WorkflowConfig interface here`,
    feedback_correct: "Excellent! Defining `WorkflowConfig` with `minAmountForManualReview: number` and `autoApproveEnabled: boolean` provides a robust and type-safe structure for our dynamic rules.",
    feedback_partial: "You're on the right track with defining a structure, but ensure you're using an `interface` for clarity and that the property names and types accurately reflect numeric thresholds and boolean flags for approval logic.",
    feedback_wrong: "Using a `class` or less precise types like `string` or `'yes' | 'no'` for configuration values can lead to less predictable behavior and harder-to-manage rules. An `interface` with specific numeric and boolean types is best for defining static data structures.",
    expected: `// Define a generic Request type for our workflow example
interface Request {
  id: string;
  amount: number;
  status: "pending" | "approved" | "manual_review";
}

interface WorkflowConfig {
  minAmountForManualReview: number;
  autoApproveEnabled: boolean;
}`,
    analog_example: `// Analog: Defining the structure for user preferences
interface UserPreferences {
  theme: "dark" | "light";
  notificationsEnabled: boolean;
  language: string;
}`,
    deepDiveLabel: "Why use an interface for configuration?",
    deepDive: {
      hook: `Imagine you're building a complex application, and various parts of it need to know how to behave based on certain settings. For instance, should a user see a "dark mode" toggle? What's the maximum number of items allowed in a shopping cart? If these settings are just loosely defined or passed around as generic objects, it becomes incredibly difficult to keep track of what's available, what type of value each setting expects, and whether a particular setting even exists. Developers might accidentally misspell a setting name, pass a string where a number is expected, or forget to handle a setting entirely, leading to runtime errors that are hard to debug. Without a clear contract, every part of the application that uses these settings has to guess or perform extensive runtime checks, making the code brittle and prone to breakage as the application evolves. This lack of structure creates a maintenance nightmare, where changes in one part of the system can silently break another, simply because the expected shape of the configuration changed without a formal declaration.`,
      pain: `⚠️ **Lesson:** Unstructured or weakly typed configuration leads to runtime errors, inconsistent behavior, and difficult-to-debug issues. Symptom: "Property 'featureFlag' does not exist on type 'object'" or "Expected type 'number' but got 'string' for 'threshold'."`,
      mentalModel: `**Mental model:** The Configuration Blueprint. Think of an interface as a detailed architectural blueprint for a building. Before construction begins, the blueprint specifies exactly what rooms will be in the house, their dimensions, what materials will be used for the walls, and where the plumbing and electrical outlets will go. It doesn't actually *build* the house, but it defines its exact shape and features. Similarly, a configuration interface defines the exact shape of your configuration object: what properties it must have, and what type of data each property holds. It acts as a contract that any configuration object must adhere to, ensuring that everyone working on the project understands and uses the configuration consistently, just as all contractors follow the same blueprint.`,
      discover: `**Pattern - name:** Configuration Interface Definition
\`\`\`tsx
interface AppSettings {
  // A boolean flag to enable/disable a specific feature
  isAnalyticsEnabled: boolean;
  // A numeric value for a threshold, e.g., max file size
  maxUploadSizeMB: number;
  // A string for a specific identifier or name
  environmentName: string;
  // An optional property, indicated by '?'
  debugMode?: boolean;
}
\`\`\`
-   \`interface\` keyword: Declares a new type that specifies the shape of an object.
-   Property names: Clearly describe the purpose of each configuration setting.
-   Type annotations (\`boolean\`, \`number\`, \`string\`): Enforce that values assigned to these properties match the expected data type, providing compile-time safety.
-   Optional properties (\`?\`): Allow for settings that might not always be present, making the configuration flexible.`,
      quickRules: `**Quick rules:**
-   ✅ Use \`interface\` for defining the shape of configuration objects.
-   ✅ Give descriptive names to your configuration properties.
-   ✅ Always specify explicit types (e.g., \`number\`, \`boolean\`, \`string\`) for each property.
-   ✅ Use optional properties (\`?\`) for settings that might not always be present.
-   ❌ Avoid using \`any\` or \`object\` as types for configuration properties; it defeats the purpose of type safety.
-   ❌ Do not use classes for simple data structures; interfaces are lighter and more appropriate for defining object shapes.
-   ❌ Never hardcode configuration values directly into the interface definition.`,
      watchOut: `👀 **Watch out:** While interfaces provide excellent compile-time safety, they don't enforce runtime validation. If configuration values are loaded from an external source (like an API or a file), it's crucial to add runtime validation to ensure the loaded data conforms to the interface's shape before your application uses it. Otherwise, a malformed external configuration could still lead to runtime errors, even with a perfectly defined interface.`,
      dryRun: `🔁 **Think:** Imagine we have a \`WorkflowConfig\` interface defined as:
\`\`\`typescript
interface WorkflowConfig {
  minAmountForManualReview: number;
  autoApproveEnabled: boolean;
}
\`\`\`
Now, consider two configuration objects:
1.  \`configA = { minAmountForManualReview: 500, autoApproveEnabled: true }\`
2.  \`configB = { minAmountForManualReview: '1000', autoApproveEnabled: 'yes' }\`

When \`configA\` is assigned to a variable of type \`WorkflowConfig\`, TypeScript checks:
-   Is \`minAmountForManualReview\` a \`number\`? Yes, \`500\` is a number.
-   Is \`autoApproveEnabled\` a \`boolean\`? Yes, \`true\` is a boolean.
Result: \`configA\` is valid.

When \`configB\` is assigned to a variable of type \`WorkflowConfig\`, TypeScript checks:
-   Is \`minAmountForManualReview\` a \`number\`? No, \`'1000'\` is a string.
-   Is \`autoApproveEnabled\` a \`boolean\`? No, \`'yes'\` is a string.
Result: \`configB\` is invalid, and TypeScript will report type errors *before* the code even runs. This prevents potential runtime issues where a string might be used in a numeric comparison. (Hint: Type checking happens at compile time, not runtime.)`,
      build: `**Learning focus:** Define the data structure for our dynamic workflow rules using a TypeScript interface.`,
    },
  },
  {
    id: "step2",
    type: "question",
    phase: "Step 2 of 5",
    paal: "Now that we have a structure for our configuration, we need a way to store and retrieve it. For simplicity, we'll use a module-scoped variable to simulate a configuration service that holds our current settings.",
    hint: "Declare a variable that holds an object conforming to `WorkflowConfig`. Initialize it with some default values.",
    example_code: `let currentSettings = {
  featureXEnabled: true,
  maxRetries: 3,
};`,
    think_prompt: "Declare a `let` variable named `currentWorkflowConfig` and initialize it with an object that matches the `WorkflowConfig` interface. Set `minAmountForManualReview` to `1000` and `autoApproveEnabled` to `true`.",
    mc_options: [
      "const currentWorkflowConfig: WorkflowConfig = { minAmountForManualReview: '1000', autoApproveEnabled: true };",
      "let currentWorkflowConfig: any = {};",
      "let currentWorkflowConfig: WorkflowConfig = { minAmountForManualReview: 1000, autoApproveEnabled: true };",
    ],
    mc_correct_option: "let currentWorkflowConfig: WorkflowConfig = { minAmountForManualReview: 1000, autoApproveEnabled: true };",
    mc_anchor: "let currentWorkflowConfig:",
    why_this_matters: "Storing the configuration in a central, accessible place (even a simple variable for now) is crucial. This variable acts as our single source of truth for all workflow rules, allowing different parts of the application to consistently access the same settings. Using `let` is important because we intend to update this configuration later.",
    answer_keywords: ["let", "currentWorkflowConfig", "WorkflowConfig", "1000", "true"],
    seed_code: `// Define a generic Request type for our workflow example
interface Request {
  id: string;
  amount: number;
  status: "pending" | "approved" | "manual_review";
}

interface WorkflowConfig {
  minAmountForManualReview: number;
  autoApproveEnabled: boolean;
}`,
    starter_code: `// Define a generic Request type for our workflow example
interface Request {
  id: string;
  amount: number;
  status: "pending" | "approved" | "manual_review";
}

interface WorkflowConfig {
  minAmountForManualReview: number;
  autoApproveEnabled: boolean;
}

// Add your configuration storage here`,
    feedback_correct: "Perfect! You've correctly declared `currentWorkflowConfig` as a `let` variable with the `WorkflowConfig` type and appropriate initial values. This sets up our dynamic configuration store.",
    feedback_partial: "You're close, but ensure the variable is declared with `let` so it can be updated later, and that the initial values strictly match the `number` and `boolean` types defined in `WorkflowConfig`.",
    feedback_wrong: "Using `const` would prevent updates to the configuration, and `any` defeats the purpose of defining `WorkflowConfig` for type safety. Ensure you use `let` and explicitly type the variable with `WorkflowConfig`.",
    expected: `// Define a generic Request type for our workflow example
interface Request {
  id: string;
  amount: number;
  status: "pending" | "approved" | "manual_review";
}

interface WorkflowConfig {
  minAmountForManualReview: number;
  autoApproveEnabled: boolean;
}

let currentWorkflowConfig: WorkflowConfig = {
  minAmountForManualReview: 1000,
  autoApproveEnabled: true,
};`,
    analog_example: `// Analog: Storing user preferences
let currentUserPreferences: UserPreferences = {
  theme: "dark",
  notificationsEnabled: true,
  language: "en-US",
};`,
    deepDiveLabel: "Why use `let` for configuration storage?",
    deepDive: {
      hook: `Imagine you've just launched a new feature, and you want to enable it for a small group of users first. Or, a critical bug is discovered, and you need to quickly disable a problematic part of the application without redeploying. If your configuration, like a feature flag or an approval threshold, is declared using \`const\`, it means its value can *never* change after initialization. This would force you to modify the source code, rebuild the application, and redeploy it every single time you need to flip a switch or adjust a number. This process is slow, costly, and completely defeats the purpose of having dynamic, configurable rules. The entire point of configuration-driven development is to allow flexibility and rapid response to changing business needs or operational issues without developer intervention for every minor adjustment.`,
      pain: `⚠️ **Lesson:** Using \`const\` for dynamic configuration prevents runtime updates, forcing code changes and redeployments for every adjustment. Symptom: "TypeError: Assignment to constant variable."`,
      mentalModel: `**Mental model:** The Adjustable Dial. Think of \`let\` as an adjustable dial on a piece of equipment, like the volume knob on a radio or the temperature control on an oven. You can set it to a specific value, and then later, you can freely turn the dial to a different setting. The equipment's behavior changes immediately based on the new setting, without needing to replace the entire radio or oven. In contrast, \`const\` is like a fixed, unchangeable component, like a resistor soldered onto a circuit board; its value is permanent. For configuration that needs to be updated at runtime, \`let\` provides the necessary "adjustability," allowing the application to respond to new settings without being rebuilt.`,
      discover: `**Pattern - name:** Mutable Configuration Store
\`\`\`tsx
interface SystemConfig {
  logLevel: "info" | "debug" | "error";
  maxConnections: number;
}

// Initial default configuration
let systemSettings: SystemConfig = {
  logLevel: "info",
  maxConnections: 50,
};

// Function to update the configuration
function updateSystemSettings(newSettings: SystemConfig): void {
  systemSettings = newSettings; // This assignment is possible because systemSettings is 'let'
  console.log("System settings updated:", systemSettings);
}

// Example usage
updateSystemSettings({ logLevel: "debug", maxConnections: 100 });
\`\`\`
-   \`let\` keyword: Declares a variable whose value can be reassigned later.
-   Type annotation (\`: SystemConfig\`): Ensures that any new value assigned to \`systemSettings\` conforms to the \`SystemConfig\` interface.
-   Initialization: Provides a default or starting configuration.
-   Reassignment: The \`systemSettings = newSettings;\` line demonstrates the mutability, allowing the configuration to be changed.`,
      quickRules: `**Quick rules:**
-   ✅ Use \`let\` for any configuration variable that needs to be updated at runtime.
-   ✅ Initialize \`let\` variables with sensible default values.
-   ✅ Always provide a type annotation for \`let\` configuration variables for type safety.
-   ✅ Ensure the updated configuration object fully conforms to the defined interface.
-   ❌ Never use \`const\` for configuration that needs to be dynamically changed.
-   ❌ Avoid \`any\` type for \`let\` configuration variables; it bypasses type checking.
-   ❌ Do not re-declare the \`let\` variable; simply reassign its value.`,
      watchOut: `👀 **Watch out:** While \`let\` allows reassignment, in larger applications, directly modifying a global \`let\` variable can lead to race conditions or unexpected behavior if multiple parts of the application try to update it concurrently. For production systems, a more robust solution involves a dedicated configuration service that handles updates, potentially with locking mechanisms or immutability patterns (where a new config object is created and swapped in atomically). For this module, a simple \`let\` is sufficient to demonstrate the core concept.`,
      dryRun: `🔁 **Think:** We have \`let currentWorkflowConfig: WorkflowConfig = { minAmountForManualReview: 1000, autoApproveEnabled: true };\`
An admin sends a request to change the config.

**Scenario 1: Initial state**
\`currentWorkflowConfig\` holds: \`{ minAmountForManualReview: 1000, autoApproveEnabled: true }\`

**Scenario 2: Update request arrives**
A function \`updateConfig(newConfig)\` is called with \`newConfig = { minAmountForManualReview: 500, autoApproveEnabled: false }\`.
Inside \`updateConfig\`, the line \`currentWorkflowConfig = newConfig;\` executes.
\`currentWorkflowConfig\` now holds: \`{ minAmountForManualReview: 500, autoApproveEnabled: false }\`

**Scenario 3: Another part of the system reads config**
A function \`getConfig()\` returns the current value of \`currentWorkflowConfig\`.
It will return \`{ minAmountForManualReview: 500, autoApproveEnabled: false }\`, reflecting the latest update.
(Hint: The \`let\` keyword allows the variable to point to a completely new object.)`,
      build: `**Learning focus:** Establish a mutable storage mechanism for our workflow configuration using a module-scoped \`let\` variable.`,
    },
  },
  {
    id: "step3",
    type: "question",
    phase: "Step 3 of 5",
    paal: "To allow other parts of our application, or even external clients, to retrieve the current workflow rules, we need to expose a read-only interface. This simulates a GET API endpoint.",
    hint: "Create a function that simply returns the `currentWorkflowConfig` variable.",
    example_code: `function getFeatureFlagStatus(): FeatureFlags {
  return currentSettings;
}`,
    think_prompt: "Create a function named `getWorkflowConfigApi` that takes no arguments and returns the `currentWorkflowConfig` object. Ensure it has the correct return type.",
    mc_options: [
      "function getWorkflowConfigApi(): any { return currentWorkflowConfig; }",
      "function getWorkflowConfigApi() { return currentWorkflowConfig; }",
      "function getWorkflowConfigApi(): WorkflowConfig { return currentWorkflowConfig; }",
    ],
    mc_correct_option: "function getWorkflowConfigApi(): WorkflowConfig { return currentWorkflowConfig; }",
    mc_anchor: "function getWorkflowConfigApi():",
    why_this_matters: "Providing a dedicated function to retrieve the configuration ensures that access is controlled and consistent. This function acts as a public interface, abstracting away the internal storage mechanism. It also allows for potential future enhancements like caching or validation before returning the config.",
    answer_keywords: ["function", "getWorkflowConfigApi", "WorkflowConfig", "return"],
    seed_code: `// Define a generic Request type for our workflow example
interface Request {
  id: string;
  amount: number;
  status: "pending" | "approved" | "manual_review";
}

interface WorkflowConfig {
  minAmountForManualReview: number;
  autoApproveEnabled: boolean;
}

let currentWorkflowConfig: WorkflowConfig = {
  minAmountForManualReview: 1000,
  autoApproveEnabled: true,
};`,
    starter_code: `// Define a generic Request type for our workflow example
interface Request {
  id: string;
  amount: number;
  status: "pending" | "approved" | "manual_review";
}

interface WorkflowConfig {
  minAmountForManualReview: number;
  autoApproveEnabled: boolean;
}

let currentWorkflowConfig: WorkflowConfig = {
  minAmountForManualReview: 1000,
  autoApproveEnabled: true,
};

// Add your API endpoint to read configuration here`,
    feedback_correct: "Spot on! `getWorkflowConfigApi` correctly returns `currentWorkflowConfig` with the `WorkflowConfig` type, providing a clear read-only interface.",
    feedback_partial: "You've created the function, but remember to explicitly define its return type as `WorkflowConfig` for better type safety and clarity, rather than relying on inference or `any`.",
    feedback_wrong: "Omitting the return type or using `any` weakens the type safety we established with `WorkflowConfig`. Always specify the expected return type to ensure consumers of this function know exactly what to expect.",
    expected: `// Define a generic Request type for our workflow example
interface Request {
  id: string;
  amount: number;
  status: "pending" | "approved" | "manual_review";
}

interface WorkflowConfig {
  minAmountForManualReview: number;
  autoApproveEnabled: boolean;
}

let currentWorkflowConfig: WorkflowConfig = {
  minAmountForManualReview: 1000,
  autoApproveEnabled: true,
};

function getWorkflowConfigApi(): WorkflowConfig {
  return currentWorkflowConfig;
}`,
    analog_example: `// Analog: API endpoint to get user preferences
function getUserPreferencesApi(): UserPreferences {
  return currentUserPreferences;
}`,
    deepDiveLabel: "Why wrap configuration access in a function?",
    deepDive: {
      hook: `Imagine your application grows, and suddenly you realize that fetching configuration directly from a global variable isn't ideal. Perhaps you need to add logging every time the config is accessed, or maybe you want to implement a caching layer to avoid repeatedly reading from a slow database. What if you later decide to fetch the configuration asynchronously from a remote service instead of an in-memory variable? If every part of your application directly accesses \`currentWorkflowConfig\`, you'd have to find and modify every single instance of that access point throughout your entire codebase. This is a massive, error-prone refactoring task. The lack of a single, controlled access point makes your system rigid and resistant to future changes, turning what seems like a simple enhancement into a daunting project.`,
      pain: `⚠️ **Lesson:** Direct access to configuration variables creates tight coupling and makes future enhancements or changes to the configuration source extremely difficult. Symptom: Extensive, risky refactoring required for simple changes like adding logging or caching.`,
      mentalModel: `**Mental model:** The Configuration Gatekeeper. Think of a configuration access function as a gatekeeper or a dedicated service desk for information. Instead of everyone in a large office directly rummaging through a central filing cabinet (the global variable), they go to the service desk. The service desk (the function) knows exactly where to find the information, how to retrieve it efficiently (maybe it has a cached copy), and can even log who accessed what information. If the filing cabinet is moved to a new room, or replaced by a digital system, only the service desk needs to update its internal process; everyone else still interacts with the same service desk. This abstraction shields the consumers of the configuration from the underlying implementation details, making the system more modular and adaptable.`,
      discover: `**Pattern - name:** Encapsulated Configuration Access
\`\`\`tsx
interface LoggerConfig {
  level: "info" | "warn" | "error";
  timestampFormat: string;
}

let currentLoggerConfig: LoggerConfig = {
  level: "info",
  timestampFormat: "ISO",
};

// Encapsulated access function
function getLoggerConfig(): LoggerConfig {
  // Potential future enhancements:
  // - Add logging here: console.log("Logger config accessed.");
  // - Implement caching: if (cache.has("loggerConfig")) return cache.get("loggerConfig");
  // - Fetch from remote: return await fetch('/api/logger-config');
  return currentLoggerConfig;
}

// Usage:
const config = getLoggerConfig();
console.log(config.level);
\`\`\`
-   \`function getLoggerConfig()\`: Provides a single, well-defined entry point for retrieving the configuration.
-   Abstraction: Hides the internal storage mechanism (\`currentLoggerConfig\`) from consumers.
-   Flexibility: Allows the internal implementation of how configuration is fetched or processed to change without affecting callers.
-   Centralized Logic: Future logic (logging, caching, validation) can be added in one place.`,
      quickRules: `**Quick rules:**
-   ✅ Always wrap access to configuration in dedicated getter functions.
-   ✅ Ensure getter functions have explicit return types matching the configuration interface.
-   ✅ Use these getter functions consistently throughout your application.
-   ✅ Design getter functions to be synchronous or asynchronous based on the actual configuration source.
-   ❌ Never directly access global configuration variables from application logic.
-   ❌ Avoid returning \`any\` from configuration getter functions; maintain type safety.
-   ❌ Do not embed complex business logic directly within configuration getters; their primary role is retrieval.`,
      watchOut: `👀 **Watch out:** While encapsulating access is good, be mindful of performance if your getter function performs expensive operations (like database reads) every time it's called. In such cases, consider implementing a caching layer *within* the getter function or a dedicated configuration service to optimize retrieval. For simple in-memory variables, the overhead is negligible.`,
      dryRun: `🔁 **Think:** We have \`let currentWorkflowConfig = { minAmountForManualReview: 1000, autoApproveEnabled: true };\` and \`function getWorkflowConfigApi(): WorkflowConfig { return currentWorkflowConfig; }\`

**Scenario 1: Initial state**
Call \`getWorkflowConfigApi()\`.
The function returns the current value of \`currentWorkflowConfig\`, which is \`{ minAmountForManualReview: 1000, autoApproveEnabled: true }\`.

**Scenario 2: Configuration is updated (hypothetically, by another function)**
\`currentWorkflowConfig\` is changed to \`{ minAmountForManualReview: 500, autoApproveEnabled: false }\`.

**Scenario 3: \`getWorkflowConfigApi()\` is called again**
Call \`getWorkflowConfigApi()\`.
The function returns the *new* current value of \`currentWorkflowConfig\`, which is \`{ minAmountForManualReview: 500, autoApproveEnabled: false }\`.
(Hint: The function always returns the current state of the \`currentWorkflowConfig\` variable, not a cached or old value.)`,
      build: `**Learning focus:** Create a read-only API endpoint function to expose the current workflow configuration.`,
    },
  },
  {
    id: "step4",
    type: "question",
    phase: "Step 4 of 5",
    paal: "For administrators to dynamically change the workflow rules, we need an API endpoint that allows updating the configuration. This simulates a PUT or POST API endpoint.",
    hint: "Create a function that takes a new `WorkflowConfig` object as an argument and updates the `currentWorkflowConfig` variable.",
    example_code: `function updateFeatureFlags(newFlags: FeatureFlags): void {
  currentSettings = newFlags;
}`,
    think_prompt: "Create a function named `updateWorkflowConfigApi` that accepts one argument, `newConfig`, typed as `WorkflowConfig`. Inside the function, update `currentWorkflowConfig` with the `newConfig` value. The function should return `void`.",
    mc_options: [
      "function updateWorkflowConfigApi(newConfig: any) { currentWorkflowConfig = newConfig; }",
      "function updateWorkflowConfigApi(newConfig: WorkflowConfig): WorkflowConfig { return currentWorkflowConfig = newConfig; }",
      "function updateWorkflowConfigApi(newConfig: WorkflowConfig): void { currentWorkflowConfig = newConfig; }",
    ],
    mc_correct_option: "function updateWorkflowConfigApi(newConfig: WorkflowConfig): void { currentWorkflowConfig = newConfig; }",
    mc_anchor: "function updateWorkflowConfigApi(",
    why_this_matters: "An update function is the cornerstone of dynamic configuration. It provides a controlled way for external systems or administrators to modify application behavior without code changes. By enforcing the `WorkflowConfig` type on the input, we ensure that only valid and expected configuration structures can be applied, preventing malformed updates.",
    answer_keywords: ["function", "updateWorkflowConfigApi", "newConfig", "WorkflowConfig", "void", "currentWorkflowConfig"],
    seed_code: `// Define a generic Request type for our workflow example
interface Request {
  id: string;
  amount: number;
  status: "pending" | "approved" | "manual_review";
}

interface WorkflowConfig {
  minAmountForManualReview: number;
  autoApproveEnabled: boolean;
}

let currentWorkflowConfig: WorkflowConfig = {
  minAmountForManualReview: 1000,
  autoApproveEnabled: true,
};

function getWorkflowConfigApi(): WorkflowConfig {
  return currentWorkflowConfig;
}`,
    starter_code: `// Define a generic Request type for our workflow example
interface Request {
  id: string;
  amount: number;
  status: "pending" | "approved" | "manual_review";
}

interface WorkflowConfig {
  minAmountForManualReview: number;
  autoApproveEnabled: boolean;
}

let currentWorkflowConfig: WorkflowConfig = {
  minAmountForManualReview: 1000,
  autoApproveEnabled: true,
};

function getWorkflowConfigApi(): WorkflowConfig {
  return currentWorkflowConfig;
}

// Add your API endpoint to update configuration here`,
    feedback_correct: "Excellent! `updateWorkflowConfigApi` correctly takes `newConfig` of type `WorkflowConfig` and updates `currentWorkflowConfig`, ensuring type safety and mutability.",
    feedback_partial: "You've got the update logic, but ensure the function's return type is `void` as it doesn't need to return anything, and explicitly type `newConfig` as `WorkflowConfig` for strong type checking.",
    feedback_wrong: "Using `any` for `newConfig` bypasses type validation, allowing potentially invalid configurations to be applied. Returning `WorkflowConfig` is also unnecessary; the function's purpose is to update, not return the new state. Stick to `void` and strong typing.",
    expected: `// Define a generic Request type for our workflow example
interface Request {
  id: string;
  amount: number;
  status: "pending" | "approved" | "manual_review";
}

interface WorkflowConfig {
  minAmountForManualReview: number;
  autoApproveEnabled: boolean;
}

let currentWorkflowConfig: WorkflowConfig = {
  minAmountForManualReview: 1000,
  autoApproveEnabled: true,
};

function getWorkflowConfigApi(): WorkflowConfig {
  return currentWorkflowConfig;
}

function updateWorkflowConfigApi(newConfig: WorkflowConfig): void {
  currentWorkflowConfig = newConfig;
}`,
    analog_example: `// Analog: API endpoint to update user preferences
function updateUserPreferencesApi(newPreferences: UserPreferences): void {
  currentUserPreferences = newPreferences;
}`,
    deepDiveLabel: "Why is input validation crucial for update APIs?",
    deepDive: {
      hook: `Imagine an administrator tries to update a workflow rule, but accidentally sends a configuration where \`minAmountForManualReview\` is a text string like "high" instead of a number, or \`autoApproveEnabled\` is \`null\` instead of a boolean. If your \`updateWorkflowConfigApi\` function simply assigns this malformed input directly to \`currentWorkflowConfig\`, your application will eventually encounter a runtime error when it tries to perform a numeric comparison with "high" or a boolean check with \`null\`. This could lead to unexpected behavior, system crashes, or even security vulnerabilities. The system would be operating with invalid rules, potentially auto-approving high-risk requests or incorrectly flagging low-risk ones for manual review, all because the input wasn't properly checked. This scenario highlights a critical vulnerability: an API that accepts any input without validation is an open door to system instability and incorrect behavior.`,
      pain: `⚠️ **Lesson:** Lack of input validation in update APIs can lead to corrupted configuration, runtime errors, and incorrect application behavior. Symptom: Unexpected crashes or illogical workflow decisions after an API-driven configuration update.`,
      mentalModel: `**Mental model:** The Security Checkpoint. Think of the \`updateWorkflowConfigApi\` function as a security checkpoint at an airport. Before any "luggage" (the \`newConfig\` object) is allowed into the secure area (your application's configuration store), it must pass through rigorous checks. Is it the right size and weight? Does it contain prohibited items? If the luggage doesn't meet the criteria, it's rejected. Similarly, an update API must validate incoming configuration data against the \`WorkflowConfig\` interface and any additional business rules (e.g., \`minAmountForManualReview\` cannot be negative). This checkpoint ensures that only valid, safe, and correctly structured configuration data makes it into your system, protecting its integrity and preventing operational failures.`,
      discover: `**Pattern - name:** Validated Configuration Update
\`\`\`tsx
interface ProductSettings {
  maxQuantity: number;
  allowDiscounts: boolean;
}

let currentProductSettings: ProductSettings = {
  maxQuantity: 10,
  allowDiscounts: true,
};

function updateProductSettingsApi(newSettings: ProductSettings): { success: boolean; message?: string } {
  // Basic type check (TypeScript handles this at compile time, but runtime validation is also crucial for API inputs)
  if (typeof newSettings.maxQuantity !== 'number' || typeof newSettings.allowDiscounts !== 'boolean') {
    return { success: false, message: "Invalid data types for settings." };
  }

  // Business rule validation
  if (newSettings.maxQuantity <= 0) {
    return { success: false, message: "Max quantity must be a positive number." };
  }

  currentProductSettings = newSettings;
  return { success: true, message: "Product settings updated successfully." };
}
\`\`\`
-   Input Type Annotation (\`newSettings: ProductSettings\`): TypeScript provides compile-time validation against the interface.
-   Runtime Type Checks (\`typeof\`): Essential for API inputs, as external data might not adhere to TypeScript types.
-   Business Rule Validation (\`newSettings.maxQuantity <= 0\`): Ensures the values make sense in the context of the application's logic.
-   Descriptive Return Value: Provides feedback to the caller about the success or failure of the update.`,
      quickRules: `**Quick rules:**
-   ✅ Always validate API input against the expected configuration interface at runtime.
-   ✅ Implement additional business rule validations (e.g., range checks, positive values).
-   ✅ Provide clear error messages when validation fails.
-   ✅ Consider using a validation library for complex schemas.
-   ❌ Never directly assign unvalidated API input to your configuration store.
-   ❌ Avoid relying solely on TypeScript for API input validation; it's compile-time only.
-   ❌ Do not return generic success/failure without specific reasons for failure.`,
      watchOut: `👀 **Watch out:** While basic \`typeof\` checks are useful, for complex configuration objects with nested structures or specific string patterns, consider using a schema validation library like Zod, Joi, or Yup. These libraries allow you to define a schema that mirrors your TypeScript interface and perform comprehensive runtime validation on incoming API payloads, providing robust error reporting and type inference.`,
      dryRun: `🔁 **Think:** We have \`let currentWorkflowConfig = { minAmountForManualReview: 1000, autoApproveEnabled: true };\` and \`function updateWorkflowConfigApi(newConfig: WorkflowConfig): void { currentWorkflowConfig = newConfig; }\`

**Scenario 1: Initial state**
\`currentWorkflowConfig\` is \`{ minAmountForManualReview: 1000, autoApproveEnabled: true }\`.

**Scenario 2: Valid update request**
Call \`updateWorkflowConfigApi({ minAmountForManualReview: 500, autoApproveEnabled: false })\`.
Inside the function, \`currentWorkflowConfig\` is reassigned to \`{ minAmountForManualReview: 500, autoApproveEnabled: false }\`.
The function returns \`void\`.
\`currentWorkflowConfig\` is now \`{ minAmountForManualReview: 500, autoApproveEnabled: false }\`.

**Scenario 3: Invalid update request (hypothetically, if validation were added)**
If \`updateWorkflowConfigApi\` had validation and was called with \`{ minAmountForManualReview: -100, autoApproveEnabled: true }\`, the validation logic would detect that \`-100\` is an invalid amount.
The function would *not* update \`currentWorkflowConfig\` and would return an error message (if designed to do so).
\`currentWorkflowConfig\` would remain \`{ minAmountForManualReview: 500, autoApproveEnabled: false }\`.
(Hint: The \`void\` return type means the function completes its action without explicitly returning a value.)`,
      build: `**Learning focus:** Implement an API endpoint function that allows administrators to update the workflow configuration dynamically.`,
    },
  },
  {
    id: "step5",
    type: "question",
    phase: "Step 5 of 5",
    paal: "Finally, we need to integrate our dynamic configuration into the actual workflow logic. This means our core processing function will fetch the latest rules and apply them to determine its behavior.",
    hint: "Inside the `processRequest` function, first retrieve the current configuration using `getWorkflowConfigApi()`. Then, use its properties to decide the request's status.",
    example_code: `function processOrder(order: Order): Order {
  const settings = getOrderProcessingSettings();
  if (order.total > settings.highValueThreshold && settings.manualReviewEnabled) {
    order.status = "pending_review";
  } else {
    order.status = "processed";
  }
  return order;
}`,
    think_prompt: "Create a function named `processRequest` that takes a `Request` object as an argument and returns an updated `Request` object. Inside this function, retrieve the `WorkflowConfig` using `getWorkflowConfigApi()`. Then, implement logic: if `autoApproveEnabled` is `false` OR if the request's `amount` is greater than `minAmountForManualReview`, set the request's `status` to `'manual_review'`. Otherwise, set its `status` to `'approved'`.",
    mc_options: [
      `function processRequest(request: Request): Request {
  const config = getWorkflowConfigApi();
  if (!config.autoApproveEnabled || request.amount > config.minAmountForManualReview) {
    request.status = 'manual_review';
  } else {
    request.status = 'approved';
  }
  return request;
}`,
      `function processRequest(request: Request): Request {
  const config = currentWorkflowConfig;
  if (config.autoApproveEnabled && request.amount < config.minAmountForManualReview) {
    request.status = 'approved';
  } else {
    request.status = 'manual_review';
  }
  return request;
}`,
      `function processRequest(request: Request): Request {
  request.status = 'approved'; // Always approve
  return request;
}`,
    ],
    mc_correct_option: `function processRequest(request: Request): Request {
  const config = getWorkflowConfigApi();
  if (!config.autoApproveEnabled || request.amount > config.minAmountForManualReview) {
    request.status = 'manual_review';
  } else {
    request.status = 'approved';
  }
  return request;
}`,
    mc_anchor: "function processRequest(",
    why_this_matters: "This step closes the loop: the configuration is defined, stored, and now actively used to drive application logic. By fetching the configuration at the point of use, the `processRequest` function always operates with the latest rules, making the workflow truly dynamic and responsive to administrative changes without requiring any code modifications or redeployments.",
    answer_keywords: ["function", "processRequest", "Request", "getWorkflowConfigApi", "autoApproveEnabled", "minAmountForManualReview", "manual_review", "approved"],
    seed_code: `// Define a generic Request type for our workflow example
interface Request {
  id: string;
  amount: number;
  status: "pending" | "approved" | "manual_review";
}

interface WorkflowConfig {
  minAmountForManualReview: number;
  autoApproveEnabled: boolean;
}

let currentWorkflowConfig: WorkflowConfig = {
  minAmountForManualReview: 1000,
  autoApproveEnabled: true,
};

function getWorkflowConfigApi(): WorkflowConfig {
  return currentWorkflowConfig;
}

function updateWorkflowConfigApi(newConfig: WorkflowConfig): void {
  currentWorkflowConfig = newConfig;
}`,
    starter_code: `// Define a generic Request type for our workflow example
interface Request {
  id: string;
  amount: number;
  status: "pending" | "approved" | "manual_review";
}

interface WorkflowConfig {
  minAmountForManualReview: number;
  autoApproveEnabled: boolean;
}

let currentWorkflowConfig: WorkflowConfig = {
  minAmountForManualReview: 1000,
  autoApproveEnabled: true,
};

function getWorkflowConfigApi(): WorkflowConfig {
  return currentWorkflowConfig;
}

function updateWorkflowConfigApi(newConfig: WorkflowConfig): void {
  currentWorkflowConfig = newConfig;
}

// Add your workflow processing logic here`,
    feedback_correct: "Fantastic! You've successfully integrated the dynamic configuration. `processRequest` now fetches the latest rules and applies them to determine the request's status, making our workflow truly configurable.",
    feedback_partial: "You're close to integrating the config, but double-check your conditional logic. The prompt specifies that if `autoApproveEnabled` is `false` OR if the `amount` is too high, it should be `manual_review`. Ensure your `if` condition reflects this precisely.",
    feedback_wrong: "Directly setting the status without consulting the configuration defeats the purpose of dynamic rules. Remember to call `getWorkflowConfigApi()` to retrieve the current settings and use them in your conditional logic to make decisions.",
    expected: `// Define a generic Request type for our workflow example
interface Request {
  id: string;
  amount: number;
  status: "pending" | "approved" | "manual_review";
}

interface WorkflowConfig {
  minAmountForManualReview: number;
  autoApproveEnabled: boolean;
}

let currentWorkflowConfig: WorkflowConfig = {
  minAmountForManualReview: 1000,
  autoApproveEnabled: true,
};

function getWorkflowConfigApi(): WorkflowConfig {
  return currentWorkflowConfig;
}

function updateWorkflowConfigApi(newConfig: WorkflowConfig): void {
  currentWorkflowConfig = newConfig;
}

function processRequest(request: Request): Request {
  const config = getWorkflowConfigApi();
  if (!config.autoApproveEnabled || request.amount > config.minAmountForManualReview) {
    request.status = 'manual_review';
  } else {
    request.status = 'approved';
  }
  return request;
}`,
    analog_example: `// Analog: Applying feature flags to UI rendering
interface FeatureFlagConfig {
  showNewDashboard: boolean;
  enableDarkMode: boolean;
}

let currentFeatureFlags: FeatureFlagConfig = {
  showNewDashboard: false,
  enableDarkMode: true,
};

function getFeatureFlags(): FeatureFlagConfig {
  return currentFeatureFlags;
}

function renderDashboard(user: { id: string }): string {
  const flags = getFeatureFlags();
  let dashboardHtml = "<h1>Welcome!</h1>";

  if (flags.showNewDashboard) {
    dashboardHtml += "<p>Here's your shiny new dashboard!</p>";
  } else {
    dashboardHtml += "<p>Here's the classic dashboard view.</p>";
  }

  if (flags.enableDarkMode) {
    dashboardHtml = \`<div class="dark-mode">\${dashboardHtml}</div>\`;
  }
  return dashboardHtml;
}`,
    deepDiveLabel: "How does dynamic configuration improve system adaptability?",
    deepDive: {
      hook: `Imagine a critical business rule changes overnight: suddenly, all requests over $500 need manual review instead of $1000, or a new compliance regulation requires auto-approval to be temporarily disabled for all transactions. If these rules are hardcoded into your application, responding to such changes means a frantic scramble: developers must modify code, push changes, go through testing, and then deploy. This process is not only slow and expensive but also introduces risk with every new deployment. During this time, your system might be operating with outdated or incorrect rules, leading to financial losses, regulatory non-compliance, or customer dissatisfaction. The inability to quickly adapt to evolving business requirements or urgent operational needs without a full software release cycle is a major bottleneck for any modern application.`,
      pain: `⚠️ **Lesson:** Hardcoded business rules lead to slow adaptation, high deployment costs, and operational risks when requirements change rapidly. Symptom: "We need a code change and redeployment for every minor rule adjustment."`,
      mentalModel: `**Mental model:** The Programmable Robot. Think of your application's core logic as a sophisticated robot designed to perform tasks. If the robot's instructions (its rules) are hardcoded into its physical circuits, changing its behavior requires physically rewiring it – a complex, time-consuming, and potentially damaging process. However, if the robot is "programmable" via an external control panel (our configuration API), you can simply input new instructions (update the configuration) and the robot immediately starts behaving differently, without any physical modification. This external control panel makes the robot incredibly adaptable, allowing it to perform a wide range of tasks or adjust its approach to existing tasks on the fly, simply by changing its program.`,
      discover: `**Pattern - name:** Runtime Rule Evaluation
\`\`\`tsx
interface DiscountConfig {
  minOrderValueForDiscount: number;
  discountPercentage: number;
  isDiscountEnabled: boolean;
}

let currentDiscountConfig: DiscountConfig = {
  minOrderValueForDiscount: 100,
  discountPercentage: 10,
  isDiscountEnabled: true,
};

function getDiscountConfig(): DiscountConfig {
  return currentDiscountConfig;
}

function calculateFinalPrice(orderValue: number): number {
  const config = getDiscountConfig(); // Fetch latest rules
  let finalPrice = orderValue;

  if (config.isDiscountEnabled && orderValue >= config.minOrderValueForDiscount) {
    finalPrice = orderValue * (1 - config.discountPercentage / 100);
    console.log(\`Applied \${config.discountPercentage}% discount.\`);
  } else {
    console.log("No discount applied.");
  }
  return finalPrice;
}
\`\`\`
-   \`getDiscountConfig()\`: The function retrieves the *current* configuration at the moment the \`calculateFinalPrice\` function is executed.
-   \`config.isDiscountEnabled\`: A boolean flag from the configuration directly controls a branch of logic.
-   \`orderValue >= config.minOrderValueForDiscount\`: A numeric threshold from the configuration is used in a comparison.
-   Dynamic Behavior: The output of \`calculateFinalPrice\` changes immediately if \`currentDiscountConfig\` is updated via an API, without \`calculateFinalPrice\` itself being modified or redeployed.`,
      quickRules: `**Quick rules:**
-   ✅ Always fetch the latest configuration using a getter function at the point of decision-making.
-   ✅ Use configuration values directly in conditional statements and calculations.
-   ✅ Design your core logic to be generic, relying on configuration for specific values and flags.
-   ✅ Ensure configuration values are type-safe when retrieved to prevent runtime errors.
-   ❌ Never hardcode business rules or thresholds directly into the processing logic.
-   ❌ Avoid caching configuration values for too long if real-time updates are critical.
-   ❌ Do not bypass the configuration getter function to access internal variables directly.`,
      watchOut: `👀 **Watch out:** While fetching configuration at the point of use ensures the latest rules are applied, frequent calls to a configuration service (especially if it involves network requests or database lookups) can introduce performance overhead. For high-throughput systems, consider implementing a short-lived cache for configuration values, ensuring that the cache is invalidated and refreshed periodically or upon an explicit update notification. This balances real-time adaptability with performance efficiency.`,
      dryRun: `🔁 **Think:** We have \`processRequest(request: Request)\` and \`currentWorkflowConfig\`.

**Initial state:**
\`currentWorkflowConfig = { minAmountForManualReview: 1000, autoApproveEnabled: true }\`

**Scenario 1: Request with amount 800**
\`request = { id: 'R1', amount: 800, status: 'pending' }\`
1.  \`config = getWorkflowConfigApi()\` returns \`{ minAmountForManualReview: 1000, autoApproveEnabled: true }\`.
2.  \`!config.autoApproveEnabled\` is \`!true\` which is \`false\`.
3.  \`request.amount > config.minAmountForManualReview\` is \`800 > 1000\` which is \`false\`.
4.  The \`if\` condition \`(false || false)\` is \`false\`.
5.  The \`else\` block executes: \`request.status = 'approved'\`.
Result: \`request.status\` becomes \`'approved'\`.

**Scenario 2: Update config**
\`updateWorkflowConfigApi({ minAmountForManualReview: 500, autoApproveEnabled: false })\` is called.
\`currentWorkflowConfig\` is now \`{ minAmountForManualReview: 500, autoApproveEnabled: false }\`.

**Scenario 3: Another request with amount 800**
\`request = { id: 'R2', amount: 800, status: 'pending' }\`
1.  \`config = getWorkflowConfigApi()\` returns \`{ minAmountForManualReview: 500, autoApproveEnabled: false }\`.
2.  \`!config.autoApproveEnabled\` is \`!false\` which is \`true\`.
3.  \`request.amount > config.minAmountForManualReview\` is \`800 > 500\` which is \`true\`.
4.  The \`if\` condition \`(true || true)\` is \`true\`.
5.  The \`if\` block executes: \`request.status = 'manual_review'\`.
Result: \`request.status\` becomes \`'manual_review'\`.
(Hint: The \`processRequest\` function adapts its behavior immediately based on the *latest* configuration fetched at runtime.)`,
      build: `**Learning focus:** Integrate the dynamic configuration into the core workflow logic to enable runtime adaptability.`,
    },
  },
];

const sideItems = [
  { label: "Lesson", id: "intro" },
  { label: "Objectives", id: "objectives" },
  { label: "Step 1: Config Structure", id: "step1" },
  { label: "Step 2: Config Storage", id: "step2" },
  { label: "Step 3: Read API", id: "step3" },
  { label: "Step 4: Update API", id: "step4" },
  { label: "Step 5: Integrate Logic", id: "step5" },
];

export default createINPACTEngine({
  NODES,
  sideItems,
  lessonNum: 0, // Assistance module, not part of a numbered track
  title: "Implementing Configuration-Driven Workflow Rules",
  shortName: "Config Rules",
});
