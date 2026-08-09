import createINPACTEngine from "../inpact_engine_shared";

interface ValidationError {
  field: string;
  message: string;
  code: string;
}

interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

interface User {
  id: string;
  isActive: boolean;
  role: "admin" | "member" | "guest";
}

interface Resource {
  id: string;
  name: string;
  capacity: number;
  currentBookings: { start: Date; end: Date }[];
  baseRatePerHour: number;
}

interface BookingRequest {
  userId: string;
  resourceId: string;
  startTime: Date;
  endTime: Date;
  requestedRatePerHour: number;
}

// Mock database functions (to simulate async checks)
const mockDb = {
  fetchUser: async (userId: string): Promise<User | undefined> => {
    if (userId === "user123") return { id: "user123", isActive: true, role: "member" };
    if (userId === "user456") return { id: "user456", isActive: false, role: "member" };
    return undefined;
  },
  fetchResource: async (resourceId: string): Promise<Resource | undefined> => {
    if (resourceId === "resA")
      return {
        id: "resA",
        name: "Meeting Room A",
        capacity: 10,
        currentBookings: [{ start: new Date("2023-10-27T10:00:00Z"), end: new Date("2023-10-27T11:00:00Z") }],
        baseRatePerHour: 50,
      };
    return undefined;
  },
};

export const NODES = [
  {
    id: "intro",
    type: "reveal",
    phase: "Lesson",
    content: {
      tag: "business-rule-validation",
      title: "Validating Complex Business Rules",
      body: `In any software system, actions often depend on a set of conditions being met. These conditions, known as business rules, ensure data integrity, maintain operational consistency, and enforce policies. Without robust validation, an application might allow invalid states, leading to corrupted data, failed operations, or even security vulnerabilities. For instance, allowing a user to book a resource that's already occupied, or approving a transaction without sufficient funds, would quickly lead to chaos. This pattern provides a structured way to check all necessary conditions before proceeding with a critical operation, providing clear feedback when rules are violated.

This pattern is fundamental across a vast range of applications. You'll encounter it when a user tries to submit a form (e.g., ensuring all required fields are present and correctly formatted), when an item is added to an inventory (e.g., checking stock levels or expiry dates), or when a system attempts to schedule a task (e.g., verifying resource availability and time constraints). Any scenario where an action has preconditions benefits from a well-defined validation layer, separating the "what to check" from the "what to do if valid."`,
      usecase: `Imagine a system that manages resource bookings. Before a new booking can be confirmed, the system needs to verify several conditions: Is the user active? Is the requested resource available for the specified time? Is the booking duration within acceptable limits? Does the requested rate match the current rate? This module helps you build a robust validation layer for such a scenario.`,
    },
  },
  {
    id: "objectives",
    type: "objectives",
    phase: "Objectives",
    items: [
      "Define clear interfaces for validation errors and results.",
      "Implement individual validation functions for specific business rules.",
      "Combine multiple validation functions to create a comprehensive validation pipeline.",
      "Return structured error responses that clearly indicate which rules were violated.",
      "Understand how to separate validation logic from core application logic.",
    ],
  },

  // Step 1: Module-scope types
  {
    id: "step1",
    type: "question",
    phase: "Step 1 of 7",
    paal: "Begin by defining the necessary interfaces for our validation system: `ValidationError`, `ValidationResult`, and the data structures we'll be validating (`User`, `Resource`, `BookingRequest`). These types establish the contract for our validation functions and the data they operate on.",
    hint: "Think about what information an error needs to convey (field, message, code) and what a validation outcome should report (overall validity, list of errors).",
    example_code: `interface ValidationError {
  field: string;
  message: string;
  code: string;
}

interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

interface User {
  id: string;
  isActive: boolean;
  role: "admin" | "member" | "guest";
}

interface Resource {
  id: string;
  name: string;
  capacity: number;
  currentBookings: { start: Date; end: Date }[];
  baseRatePerHour: number;
}

interface BookingRequest {
  userId: string;
  resourceId: string;
  startTime: Date;
  endTime: Date;
  requestedRatePerHour: number;
}`,
    think_prompt: "What are the essential properties for a single validation error, and for the overall result of a validation process?",
    mc_options: [
      `interface Error { msg: string; } interface Result { ok: boolean; }`,
      `interface ValidationError { field: string; message: string; code: string; } interface ValidationResult { isValid: boolean; errors: ValidationError[]; }`,
      `type Error = string; type Result = boolean;`,
    ],
    mc_correct_option: `interface ValidationError { field: string; message: string; code: string; } interface ValidationResult { isValid: boolean; errors: ValidationError[]; }`,
    mc_anchor: "interface ValidationError { field: string; message: string; code: string; }",
    why_this_matters: "Well-defined types make your code predictable, easier to debug, and provide clear contracts for how data flows through your validation logic. This is especially crucial for error reporting, as consumers of your validation functions need to understand the structure of potential failures.",
    answer_keywords: ["interface", "ValidationError", "ValidationResult", "types"],
    seed_code: ``, // No seed code for the first step
    starter_code: `// Define your interfaces here
`,
    feedback_correct: "Excellent! Defining clear interfaces for errors and results sets a strong foundation for structured validation. The `field`, `message`, and `code` in `ValidationError` provide rich context for debugging and user feedback.",
    feedback_partial: "You've started defining types, but consider what specific information is most useful for an error (e.g., which field failed, a specific error code) and how to aggregate multiple errors.",
    feedback_wrong: "While simple types can work, they lack the detail needed for complex business rule validation. A `ValidationError` needs to specify *what* went wrong and *where*, and `ValidationResult` needs to collect *all* errors, not just a boolean.",
    expected: `interface ValidationError {
  field: string;
  message: string;
  code: string;
}

interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

interface User {
  id: string;
  isActive: boolean;
  role: "admin" | "member" | "guest";
}

interface Resource {
  id: string;
  name: string;
  capacity: number;
  currentBookings: { start: Date; end: Date }[];
  baseRatePerHour: number;
}

interface BookingRequest {
  userId: string;
  resourceId: string;
  startTime: Date;
  endTime: Date;
  requestedRatePerHour: number;
}

// Mock database functions (to simulate async checks)
const mockDb = {
  fetchUser: async (userId: string): Promise<User | undefined> => {
    if (userId === "user123") return { id: "user123", isActive: true, role: "member" };
    if (userId === "user456") return { id: "user456", isActive: false, role: "member" };
    return undefined;
  },
  fetchResource: async (resourceId: string): Promise<Resource | undefined> => {
    if (resourceId === "resA")
      return {
        id: "resA",
        name: "Meeting Room A",
        capacity: 10,
        currentBookings: [{ start: new Date("2023-10-27T10:00:00Z"), end: new Date("2023-10-27T11:00:00Z") }],
        baseRatePerHour: 50,
      };
    return undefined;
  },
};`,
    analog_example: `interface ConfigError {
  key: string;
  description: string;
}

interface ConfigValidationResult {
  valid: boolean;
  issues: ConfigError[];
}

interface SystemSettings {
  port: number;
  timeoutMs: number;
  logLevel: "debug" | "info" | "warn" | "error";
  maxConnections: number;
}

// Example usage of these types:
const settings: SystemSettings = {
  port: 8080,
  timeoutMs: 5000,
  logLevel: "info",
  maxConnections: 100,
};

const validationResult: ConfigValidationResult = {
  valid: true,
  issues: [],
};`,
    deepDiveLabel: "Why are explicit error codes important?",
    deepDive: {
      hook: `Imagine you're building a complex system, perhaps one that processes financial transactions or manages critical infrastructure. When something goes wrong, a simple "Error: Invalid input" message isn't enough. Was the input invalid because it was too short? Did it contain forbidden characters? Was the user unauthorized? Without specific details, debugging becomes a nightmare, and providing helpful feedback to end-users is impossible. Your support team will be flooded with vague reports, and developers will spend hours trying to reproduce obscure issues. The lack of precision in error reporting can cascade into significant operational inefficiencies and user frustration, making it difficult to diagnose, fix, and even prevent future problems.`,
      pain: `⚠️ **Lesson:** Vague error messages lead to debugging bottlenecks and poor user experience. Symptom: Developers struggle to pinpoint the root cause of failures, and users receive unhelpful feedback like "Something went wrong." This often results in increased support tickets and longer resolution times.`,
      mentalModel: `**Mental model:** The "Error Dispatcher" analogy. Think of your validation system as a dispatch center for emergency services. When an incident occurs, you don't just send "help." You dispatch specific units (fire, police, ambulance) based on the nature of the emergency. Each unit has a specific code (e.g., "Fire-101," "Medical-911") that tells the responders exactly what kind of situation they're walking into and what tools they need. Similarly, a structured error with a specific code allows your application (and its developers/users) to "dispatch" the correct handling logic or display the most relevant message, rather than a generic "something went wrong."`,
      discover: `**Pattern - name:** Structured Error Reporting
\`\`\`typescript
interface ValidationError {
  field: string;    // The specific data field that failed validation
  message: string;  // A human-readable description of the error
  code: string;     // A machine-readable, unique identifier for the error type
}
\`\`\`
-   **\`field\`**: Pinpoints the exact part of the input that caused the issue. This is invaluable for UI feedback (e.g., highlighting a specific form field).
-   **\`message\`**: Provides a user-friendly explanation. This can be localized or made more detailed for developers.
-   **\`code\`**: A unique, consistent identifier (e.g., "USER_INACTIVE", "RESOURCE_UNAVAILABLE"). This allows programmatic handling of specific error types, independent of the message text.
-   **Benefits**: Enables precise error handling, better user feedback, easier debugging, and robust API contracts.`,
      quickRules: `**Quick rules:**
-   ✅ Always include a machine-readable error code for programmatic handling.
-   ✅ Provide a \`field\` property to indicate the specific data point causing the error.
-   ✅ Ensure the \`message\` is human-readable and contextual.
-   ✅ Design error codes to be stable and versioned if exposed externally.
-   ❌ Never rely solely on error messages for programmatic logic (they can change).
-   ❌ Avoid generic error messages like "Invalid data" without further detail.
-   ❌ Don't omit the \`field\` property if the error relates to a specific input.`,
      watchOut: `👀 **Watch out:** While error codes are powerful, avoid creating an excessive number of overly granular codes that serve no distinct purpose. Each code should represent a unique type of failure that requires different handling or messaging. Also, be mindful of exposing sensitive information in error messages or codes, especially in public-facing APIs.`,
      dryRun: `🔁 **Think:** A booking request comes in. If the user ID is missing, the validation system needs to report an error.
1.  **Input:** \`{ resourceId: "resA", startTime: ..., endTime: ... }\` (missing \`userId\`).
2.  **Validation Rule (hypothetical):** Check if \`userId\` is present.
3.  **Error Generation:** The rule detects \`userId\` is missing. It generates a \`ValidationError\` like \`{ field: "userId", message: "User ID is required.", code: "USER_ID_MISSING" }\`.
4.  **Result Accumulation:** This error is added to the \`errors\` array of the \`ValidationResult\`.
5.  **Final Result:** \`{ isValid: false, errors: [{ field: "userId", message: "User ID is required.", code: "USER_ID_MISSING" }] }\`.
(Hint: The \`code\` allows the frontend to display a specific "User ID is missing" message, rather than a generic "Validation failed".)`,
      build: `**Learning focus:** Define the core data structures for errors and validation results, along with the input data types for our booking system.`,
    },
  },

  // Step 2: Component/function shell (Main validation function signature)
  {
    id: "step2",
    type: "question",
    phase: "Step 2 of 7",
    paal: "Now, let's create the main asynchronous function `validateBooking` that will orchestrate all our validation rules. It will take a `BookingRequest` and return a `Promise<ValidationResult>`, as some checks will involve asynchronous database lookups.",
    hint: "Remember to mark the function as `async` and specify its return type as `Promise<ValidationResult>`.",
    example_code: `async function validateBooking(request: BookingRequest): Promise<ValidationResult> {
  // Validation logic will go here
}`,
    think_prompt: "What is the correct signature for an asynchronous function that takes a `BookingRequest` and returns a `ValidationResult`?",
    mc_options: [
      `function validateBooking(request: BookingRequest): ValidationResult { }`,
      `async function validateBooking(request: BookingRequest): Promise<ValidationResult> { }`,
      `const validateBooking = (request: BookingRequest) => ValidationResult { }`,
    ],
    mc_correct_option: `async function validateBooking(request: BookingRequest): Promise<ValidationResult> { }`,
    mc_anchor: `async function validateBooking(request: BookingRequest): Promise<ValidationResult> {`,
    why_this_matters: "The function signature is the public contract of your validation logic. Specifying `async` and `Promise<ValidationResult>` clearly communicates that this function might perform operations that take time (like database calls) and will always return a structured outcome, not just a boolean.",
    answer_keywords: ["async", "Promise", "function signature"],
    seed_code: `interface ValidationError {
  field: string;
  message: string;
  code: string;
}

interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

interface User {
  id: string;
  isActive: boolean;
  role: "admin" | "member" | "guest";
}

interface Resource {
  id: string;
  name: string;
  capacity: number;
  currentBookings: { start: Date; end: Date }[];
  baseRatePerHour: number;
}

interface BookingRequest {
  userId: string;
  resourceId: string;
  startTime: Date;
  endTime: Date;
  requestedRatePerHour: number;
}

// Mock database functions (to simulate async checks)
const mockDb = {
  fetchUser: async (userId: string): Promise<User | undefined> => {
    if (userId === "user123") return { id: "user123", isActive: true, role: "member" };
    if (userId === "user456") return { id: "user456", isActive: false, role: "member" };
    return undefined;
  },
  fetchResource: async (resourceId: string): Promise<Resource | undefined> => {
    if (resourceId === "resA")
      return {
        id: "resA",
        name: "Meeting Room A",
        capacity: 10,
        currentBookings: [{ start: new Date("2023-10-27T10:00:00Z"), end: new Date("2023-10-27T11:00:00Z") }],
        baseRatePerHour: 50,
      };
    return undefined;
  },
};`,
    starter_code: `// Define your main validation function here
`,
    feedback_correct: "Spot on! The `async` keyword and `Promise<ValidationResult>` return type correctly indicate that this function will handle asynchronous operations and provide a structured result.",
    feedback_partial: "You've got the function name and parameter right, but don't forget that validation often involves database lookups, making it an asynchronous operation that returns a `Promise`.",
    feedback_wrong: "A synchronous function returning `ValidationResult` would block the event loop if it performed database lookups. For operations that might take time, `async` and `Promise` are essential.",
    expected: `interface ValidationError {
  field: string;
  message: string;
  code: string;
}

interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

interface User {
  id: string;
  isActive: boolean;
  role: "admin" | "member" | "guest";
}

interface Resource {
  id: string;
  name: string;
  capacity: number;
  currentBookings: { start: Date; end: Date }[];
  baseRatePerHour: number;
}

interface BookingRequest {
  userId: string;
  resourceId: string;
  startTime: Date;
  endTime: Date;
  requestedRatePerHour: number;
}

// Mock database functions (to simulate async checks)
const mockDb = {
  fetchUser: async (userId: string): Promise<User | undefined> => {
    if (userId === "user123") return { id: "user123", isActive: true, role: "member" };
    if (userId === "user456") return { id: "user456", isActive: false, role: "member" };
    return undefined;
  },
  fetchResource: async (resourceId: string): Promise<Resource | undefined> => {
    if (resourceId === "resA")
      return {
        id: "resA",
        name: "Meeting Room A",
        capacity: 10,
        currentBookings: [{ start: new Date("2023-10-27T10:00:00Z"), end: new Date("2023-10-27T11:00:00Z") }],
        baseRatePerHour: 50,
      };
    return undefined;
  },
};

async function validateBooking(request: BookingRequest): Promise<ValidationResult> {
  // Validation logic will go here
}`,
    analog_example: `interface SystemSettings {
  port: number;
  timeoutMs: number;
  logLevel: "debug" | "info" | "warn" | "error";
  maxConnections: number;
}

interface ConfigError {
  key: string;
  description: string;
}

interface ConfigValidationResult {
  valid: boolean;
  issues: ConfigError[];
}

// This example is synchronous as it doesn't involve external lookups
function validateSystemSettings(settings: SystemSettings): ConfigValidationResult {
  const issues: ConfigError[] = [];
  // ... validation logic ...
  return {
    valid: issues.length === 0,
    issues,
  };
}

// Example usage:
const settingsToValidate: SystemSettings = {
  port: 3000,
  timeoutMs: 10000,
  logLevel: "debug",
  maxConnections: 500,
};
const result = validateSystemSettings(settingsToValidate);
console.log(result.valid);`,
    deepDiveLabel: "Why use `async`/`await` for validation?",
    deepDive: {
      hook: `Imagine you're trying to validate a user's eligibility for a premium service. This check requires looking up their subscription status in a database, which is an inherently time-consuming operation. If your validation function were synchronous, it would halt the entire application's execution while waiting for the database response. In a web server, this means no other requests could be processed; in a desktop app, the UI would freeze. This blocking behavior leads to unresponsive applications, poor user experience, and inefficient resource utilization, especially in modern, concurrent environments where many operations happen simultaneously.`,
      pain: `⚠️ **Lesson:** Synchronous I/O operations in validation block the application, leading to unresponsiveness. Symptom: Your application freezes or becomes sluggish when performing validation checks that involve external resources like databases or network calls.`,
      mentalModel: `**Mental model:** The "Non-Blocking Waiter" analogy. In a busy restaurant, a good waiter doesn't stand by the kitchen door waiting for one dish to be ready before taking another order. Instead, they take an order, send it to the kitchen, and then move on to serve other tables or take new orders. When a dish is ready, the kitchen signals the waiter, who then delivers it. ` + "`async`/`await`" + ` allows your code to act like that efficient waiter: it "sends an order" (initiates a database query), "moves on" (allows other code to run), and then "picks up the dish" (resumes execution with the query result) when it's ready, without blocking the entire "restaurant" (application).`,
      discover: `**Pattern - name:** Asynchronous Validation
\`\`\`typescript
async function validateBooking(request: BookingRequest): Promise<ValidationResult> {
  const user = await mockDb.fetchUser(request.userId); // Asynchronous database call
  if (!user) {
    // Add error
  }
  // ... more validation ...
  return { isValid: true, errors: [] };
}
\`\`\`
-   **\`async\` keyword**: Marks the function as asynchronous, allowing it to use \`await\`.
-   **\`await\` keyword**: Pauses the execution of the \`async\` function until the \`Promise\` it's waiting for settles (resolves or rejects). Crucially, it *does not* block the main thread of execution.
-   **\`Promise<T>\` return type**: Indicates that the function will eventually produce a value of type \`T\` (or an error), but not immediately.
-   **Benefits**: Prevents blocking, improves responsiveness, and allows for efficient handling of I/O-bound operations within validation logic.`,
      quickRules: `**Quick rules:**
-   ✅ Use \`async\` functions when validation involves I/O operations (database, network, file system).
-   ✅ Always \`await\` promises returned by asynchronous operations within an \`async\` function.
-   ✅ Ensure \`async\` functions return a \`Promise\`.
-   ✅ Handle potential rejections of promises (e.g., with \`try...catch\` or \`.catch()\`).
-   ❌ Never perform blocking I/O directly in synchronous validation functions.
-   ❌ Avoid \`await\`ing inside a non-\`async\` function (it's a syntax error).
-   ❌ Don't forget to handle the \`Promise\` returned by an \`async\` function when calling it.`,
      watchOut: `👀 **Watch out:** While \`async\`/\`await\` makes asynchronous code look synchronous, it's still asynchronous under the hood. Be careful not to mix synchronous and asynchronous error handling without proper \`try...catch\` blocks, as unhandled promise rejections can crash your application. Also, be aware of potential race conditions if multiple asynchronous validations modify shared state without proper synchronization.`,
      dryRun: `🔁 **Think:** A \`validateBooking\` call is made.
1.  **Call:** \`validateBooking(someBookingRequest)\` is invoked.
2.  **\`fetchUser\`:** Inside \`validateBooking\`, \`await mockDb.fetchUser(request.userId)\` is called. This immediately returns a \`Promise\`.
3.  **Execution Pause:** The \`validateBooking\` function *pauses* its execution at the \`await\` keyword, but the JavaScript event loop continues to process other tasks (e.g., other incoming requests).
4.  **Database Response:** After some time, \`mockDb.fetchUser\` resolves its \`Promise\` with the user data.
5.  **Execution Resume:** The \`validateBooking\` function *resumes* execution from where it left off, with the \`user\` variable now holding the fetched data.
6.  **Further Logic:** The rest of the validation logic proceeds.
(Hint: The key is that the application remains responsive during the database lookup, not blocked.)`,
      build: `**Learning focus:** Define the main \`async\` function signature for \`validateBooking\` to handle asynchronous validation checks.`,
    },
  },

  // Step 3: State + local variables (Initialize errors array)
  {
    id: "step3",
    type: "question",
    phase: "Step 3 of 7",
    paal: "Inside `validateBooking`, initialize an empty array to accumulate any `ValidationError` objects. This array will collect all rule violations before returning the final `ValidationResult`.",
    hint: "Declare a `const` variable named `errors` and initialize it as an empty array of `ValidationError`.",
    example_code: `async function validateBooking(request: BookingRequest): Promise<ValidationResult> {
  const errors: ValidationError[] = [];
  // ... rest of the validation logic
}`,
    think_prompt: "How do you declare an empty array that will specifically hold `ValidationError` objects?",
    mc_options: [
      `let errors = [];`,
      `const errors: any[] = [];`,
      `const errors: ValidationError[] = [];`,
    ],
    mc_correct_option: `const errors: ValidationError[] = [];`,
    mc_anchor: `const errors: ValidationError[] = [];`,
    why_this_matters: "Accumulating errors in a dedicated array allows you to report *all* violations, not just the first one encountered. This provides comprehensive feedback to the user or calling system, enabling them to fix multiple issues at once rather than iteratively discovering them.",
    answer_keywords: ["array", "errors", "initialization", "ValidationError"],
    seed_code: `interface ValidationError {
  field: string;
  message: string;
  code: string;
}

interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

interface User {
  id: string;
  isActive: boolean;
  role: "admin" | "member" | "guest";
}

interface Resource {
  id: string;
  name: string;
  capacity: number;
  currentBookings: { start: Date; end: Date }[];
  baseRatePerHour: number;
}

interface BookingRequest {
  userId: string;
  resourceId: string;
  startTime: Date;
  endTime: Date;
  requestedRatePerHour: number;
}

// Mock database functions (to simulate async checks)
const mockDb = {
  fetchUser: async (userId: string): Promise<User | undefined> => {
    if (userId === "user123") return { id: "user123", isActive: true, role: "member" };
    if (userId === "user456") return { id: "user456", isActive: false, role: "member" };
    return undefined;
  },
  fetchResource: async (resourceId: string): Promise<Resource | undefined> => {
    if (resourceId === "resA")
      return {
        id: "resA",
        name: "Meeting Room A",
        capacity: 10,
        currentBookings: [{ start: new Date("2023-10-27T10:00:00Z"), end: new Date("2023-10-27T11:00:00Z") }],
        baseRatePerHour: 50,
      };
    return undefined;
  },
};

async function validateBooking(request: BookingRequest): Promise<ValidationResult> {
  // Validation logic will go here
}`,
    starter_code: `async function validateBooking(request: BookingRequest): Promise<ValidationResult> {
  // Initialize the errors array here
}`,
    feedback_correct: "Perfect! Initializing `errors: ValidationError[] = []` correctly sets up our error collection mechanism with strong type safety.",
    feedback_partial: "You've correctly initialized an empty array, but specifying the type `ValidationError[]` provides better type checking and clarity.",
    feedback_wrong: "Using `any[]` or `let` without a specific type reduces type safety. It's best practice to explicitly type your arrays to ensure they only contain the expected objects.",
    expected: `interface ValidationError {
  field: string;
  message: string;
  code: string;
}

interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

interface User {
  id: string;
  isActive: boolean;
  role: "admin" | "member" | "guest";
}

interface Resource {
  id: string;
  name: string;
  capacity: number;
  currentBookings: { start: Date; end: Date }[];
  baseRatePerHour: number;
}

interface BookingRequest {
  userId: string;
  resourceId: string;
  startTime: Date;
  endTime: Date;
  requestedRatePerHour: number;
}

// Mock database functions (to simulate async checks)
const mockDb = {
  fetchUser: async (userId: string): Promise<User | undefined> => {
    if (userId === "user123") return { id: "user123", isActive: true, role: "member" };
    if (userId === "user456") return { id: "user456", isActive: false, role: "member" };
    return undefined;
  },
  fetchResource: async (resourceId: string): Promise<Resource | undefined> => {
    if (resourceId === "resA")
      return {
        id: "resA",
        name: "Meeting Room A",
        capacity: 10,
        currentBookings: [{ start: new Date("2023-10-27T10:00:00Z"), end: new Date("2023-10-27T11:00:00Z") }],
        baseRatePerHour: 50,
      };
    return undefined;
  },
};

async function validateBooking(request: BookingRequest): Promise<ValidationResult> {
  const errors: ValidationError[] = [];
  // ... rest of the validation logic
}`,
    analog_example: `interface ConfigError {
  key: string;
  description: string;
}

interface ConfigValidationResult {
  valid: boolean;
  issues: ConfigError[];
}

interface SystemSettings {
  port: number;
  timeoutMs: number;
  logLevel: "debug" | "info" | "warn" | "error";
  maxConnections: number;
}

function validateSystemSettings(settings: SystemSettings): ConfigValidationResult {
  const issues: ConfigError[] = []; // Initializing the error accumulator
  // ... validation rules will add to 'issues'
  return {
    valid: issues.length === 0,
    issues,
  };
}

// Example of adding an issue:
// issues.push({ key: "port", description: "Port must be between 1024 and 65535" });`,
    deepDiveLabel: "Why accumulate errors instead of failing fast?",
    deepDive: {
      hook: `Imagine filling out a long online form, only to submit it and be told "Error: Field A is invalid." You fix Field A, resubmit, and then get "Error: Field B is invalid." This iterative, one-error-at-a-time feedback loop is incredibly frustrating and inefficient. Users want to know all the problems at once so they can fix them in a single pass. From a developer's perspective, failing fast might seem simpler, but it often leads to a worse user experience and more round trips between the client and server, increasing latency and resource usage.`,
      pain: `⚠️ **Lesson:** Failing fast in validation can lead to poor user experience and inefficient error resolution. Symptom: Users are forced to fix one error at a time, leading to frustration and multiple resubmissions.`,
      mentalModel: `**Mental model:** The "Comprehensive Checklist" approach. Instead of stopping at the first item on a checklist that's incorrect, a thorough inspector goes through *every* item, marking all deficiencies. Only after the entire checklist is complete does the inspector present a full report of all issues found. This allows the recipient to address all problems simultaneously. Similarly, accumulating all validation errors provides a complete picture of what needs to be fixed, enabling a single, efficient correction phase.`,
      discover: `**Pattern - name:** Error Accumulation
\`\`\`typescript
async function validateBooking(request: BookingRequest): Promise<ValidationResult> {
  const errors: ValidationError[] = []; // Initialize an empty array

  // Rule 1: Check user eligibility
  const user = await mockDb.fetchUser(request.userId);
  if (!user || !user.isActive) {
    errors.push({ field: "userId", message: "User is not active or does not exist.", code: "USER_INACTIVE_OR_NOT_FOUND" });
  }

  // Rule 2: Check resource availability (even if Rule 1 failed, we still check this)
  const resource = await mockDb.fetchResource(request.resourceId);
  if (!resource) {
    errors.push({ field: "resourceId", message: "Resource does not exist.", code: "RESOURCE_NOT_FOUND" });
  }

  // ... more rules ...

  return { isValid: errors.length === 0, errors }; // Return all collected errors
}
\`\`\`
-   **Initialization**: A mutable array (\`errors\`) is created at the start of the validation process.
-   **Conditional Pushing**: Each validation rule, upon detecting a violation, adds a new \`ValidationError\` object to this array.
-   **Non-Blocking**: Rules are executed independently, allowing all potential issues to be identified.
-   **Final Report**: The accumulated \`errors\` array is returned as part of the \`ValidationResult\`.`,
      quickRules: `**Quick rules:**
-   ✅ Always initialize an empty array to collect errors at the start of complex validation.
-   ✅ Add a new, specific \`ValidationError\` object to the array for each rule violation.
-   ✅ Execute all relevant validation rules, even if earlier ones have failed.
-   ✅ Return the full array of errors to the caller.
-   ❌ Never \`throw\` an error for every single validation failure if multiple errors are possible.
-   ❌ Avoid stopping validation after the first error if the goal is comprehensive feedback.
-   ❌ Don't use a simple boolean return if you need to convey *what* went wrong.`,
      watchOut: `👀 **Watch out:** While accumulating errors is generally good for user experience, be mindful of performance implications if you have an extremely large number of rules or very complex data structures. In rare, highly performance-critical scenarios, a "fail-fast" approach might be considered, but only if the trade-off for user experience is acceptable. Also, ensure that subsequent rules don't depend on the validity of previous rules if you're accumulating errors (e.g., don't try to access properties of a \`user\` object if \`user\` might be \`undefined\` due to an earlier validation failure).`,
      dryRun: `🔁 **Think:** A \`BookingRequest\` comes in with an invalid \`userId\` and an invalid \`resourceId\`.
1.  **Initialization:** \`errors\` array is \`[]\`.
2.  **User Check:** \`mockDb.fetchUser\` returns \`undefined\`. An error \`{ field: "userId", message: "...", code: "USER_NOT_FOUND" }\` is pushed to \`errors\`. \`errors\` is now \`[{...userId error...}]\`.
3.  **Resource Check:** \`mockDb.fetchResource\` returns \`undefined\`. An error \`{ field: "resourceId", message: "...", code: "RESOURCE_NOT_FOUND" }\` is pushed to \`errors\`. \`errors\` is now \`[{...userId error...}, {...resourceId error...}]\`.
4.  **Final Result:** The function returns \`{ isValid: false, errors: [{...userId error...}, {...resourceId error...}] }\`.
(Hint: Both errors are reported simultaneously, allowing the user to fix both at once.)`,
      build: `**Learning focus:** Initialize an empty array within \`validateBooking\` to accumulate all discovered validation errors.`,
    },
  },

  // Step 4: Structure skeleton - no handlers wired yet (Initial return statement)
  {
    id: "step4",
    type: "question",
    phase: "Step 4 of 7",
    paal: "Complete the basic structure of the `validateBooking` function by adding the final `return` statement. This statement will return the `ValidationResult` based on whether any errors were collected.",
    hint: "The `isValid` property should be `true` if the `errors` array is empty, and `false` otherwise. The `errors` property should simply be the `errors` array itself.",
    example_code: `async function validateBooking(request: BookingRequest): Promise<ValidationResult> {
  const errors: ValidationError[] = [];

  // ... validation rules will go here ...

  return {
    isValid: errors.length === 0,
    errors,
  };
}`,
    think_prompt: "How do you construct the `ValidationResult` object, setting `isValid` based on the `errors` array's length?",
    mc_options: [
      `return { isValid: true, errors: errors };`,
      `return { isValid: errors.length > 0, errors: errors };`,
      `return { isValid: errors.length === 0, errors: errors };`,
    ],
    mc_correct_option: `return { isValid: errors.length === 0, errors: errors };`,
    mc_anchor: `return { isValid: errors.length === 0, errors: errors };`,
    why_this_matters: "This return statement is the culmination of all validation efforts. It provides a clear, structured summary of the validation outcome, allowing the calling code to easily determine if an action can proceed and, if not, precisely why.",
    answer_keywords: ["return", "ValidationResult", "isValid", "errors.length"],
    seed_code: `interface ValidationError {
  field: string;
  message: string;
  code: string;
}

interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

interface User {
  id: string;
  isActive: boolean;
  role: "admin" | "member" | "guest";
}

interface Resource {
  id: string;
  name: string;
  capacity: number;
  currentBookings: { start: Date; end: Date }[];
  baseRatePerHour: number;
}

interface BookingRequest {
  userId: string;
  resourceId: string;
  startTime: Date;
  endTime: Date;
  requestedRatePerHour: number;
}

// Mock database functions (to simulate async checks)
const mockDb = {
  fetchUser: async (userId: string): Promise<User | undefined> => {
    if (userId === "user123") return { id: "user123", isActive: true, role: "member" };
    if (userId === "user456") return { id: "user456", isActive: false, role: "member" };
    return undefined;
  },
  fetchResource: async (resourceId: string): Promise<Resource | undefined> => {
    if (resourceId === "resA")
      return {
        id: "resA",
        name: "Meeting Room A",
        capacity: 10,
        currentBookings: [{ start: new Date("2023-10-27T10:00:00Z"), end: new Date("2023-10-27T11:00:00Z") }],
        baseRatePerHour: 50,
      };
    return undefined;
  },
};

async function validateBooking(request: BookingRequest): Promise<ValidationResult> {
  const errors: ValidationError[] = [];
  // ... rest of the validation logic
}`,
    starter_code: `async function validateBooking(request: BookingRequest): Promise<ValidationResult> {
  const errors: ValidationError[] = [];

  // Add the return statement here
}`,
    feedback_correct: "Exactly! Returning `{ isValid: errors.length === 0, errors }` correctly summarizes the validation outcome, indicating overall success or failure and providing all specific error details.",
    feedback_partial: "You've got the `errors` part right, but double-check the logic for `isValid`. It should be `true` only when *no* errors are present.",
    feedback_wrong: "If `errors.length > 0` means there are errors, then `isValid` should be `false`. The condition `errors.length === 0` correctly reflects a valid state.",
    expected: `interface ValidationError {
  field: string;
  message: string;
  code: string;
}

interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

interface User {
  id: string;
  isActive: boolean;
  role: "admin" | "member" | "guest";
}

interface Resource {
  id: string;
  name: string;
  capacity: number;
  currentBookings: { start: Date; end: Date }[];
  baseRatePerHour: number;
}

interface BookingRequest {
  userId: string;
  resourceId: string;
  startTime: Date;
  endTime: Date;
  requestedRatePerHour: number;
}

// Mock database functions (to simulate async checks)
const mockDb = {
  fetchUser: async (userId: string): Promise<User | undefined> => {
    if (userId === "user123") return { id: "user123", isActive: true, role: "member" };
    if (userId === "user456") return { id: "user456", isActive: false, role: "member" };
    return undefined;
  },
  fetchResource: async (resourceId: string): Promise<Resource | undefined> => {
    if (resourceId === "resA")
      return {
        id: "resA",
        name: "Meeting Room A",
        capacity: 10,
        currentBookings: [{ start: new Date("2023-10-27T10:00:00Z"), end: new Date("2023-10-27T11:00:00Z") }],
        baseRatePerHour: 50,
      };
    return undefined;
  },
};

async function validateBooking(request: BookingRequest): Promise<ValidationResult> {
  const errors: ValidationError[] = [];

  // ... validation rules will go here ...

  return {
    isValid: errors.length === 0,
    errors,
  };
}`,
    analog_example: `interface ConfigError {
  key: string;
  description: string;
}

interface ConfigValidationResult {
  valid: boolean;
  issues: ConfigError[];
}

interface SystemSettings {
  port: number;
  timeoutMs: number;
  logLevel: "debug" | "info" | "warn" | "error";
  maxConnections: number;
}

function validateSystemSettings(settings: SystemSettings): ConfigValidationResult {
  const issues: ConfigError[] = [];

  // ... validation rules ...
  if (settings.port < 1024 || settings.port > 65535) {
    issues.push({ key: "port", description: "Port must be between 1024 and 65535." });
  }

  return { // The final return statement
    valid: issues.length === 0,
    issues,
  };
}

// Example usage:
const invalidSettings: SystemSettings = {
  port: 80, // Invalid port
  timeoutMs: 1000,
  logLevel: "info",
  maxConnections: 10,
};
const result = validateSystemSettings(invalidSettings);
console.log(result.valid); // false
console.log(result.issues); // [{ key: "port", description: "Port must be between 1024 and 65535." }]`,
    deepDiveLabel: "How does `errors.length === 0` determine validity?",
    deepDive: {
      hook: `Imagine you're a quality control inspector for a factory. Your job is to check every product for defects. If you find even one defect, the product cannot be shipped. If you go through the entire inspection process and find *no* defects, then and only then is the product deemed acceptable. The number of defects directly dictates the product's quality status. Similarly, in validation, the presence of *any* error means the input is invalid, while the complete absence of errors signifies validity. This simple boolean check is the ultimate arbiter of whether an action can proceed.`,
      pain: `⚠️ **Lesson:** A single validation error should typically invalidate the entire operation. Symptom: Logic that proceeds with an action even when errors are present, leading to inconsistent states or unexpected behavior.`,
      mentalModel: `**Mental model:** The "Zero Tolerance" policy. For critical operations, the system often operates under a zero-tolerance policy for errors. Just like a single expired ingredient can spoil an entire dish, a single invalid input can compromise an entire operation. The ` + "`errors.length === 0`" + ` check embodies this policy: if the count of violations is zero, it's valid; otherwise, it's not. This clear threshold simplifies decision-making for the calling code.`,
      discover: `**Pattern - name:** Aggregate Validity Check
\`\`\`typescript
async function validateBooking(request: BookingRequest): Promise<ValidationResult> {
  const errors: ValidationError[] = [];

  // ... add errors to 'errors' array ...

  return {
    isValid: errors.length === 0, // This line is the aggregate validity check
    errors,
  };
}
\`\`\`
-   **\`errors.length\`**: This property gives the current count of validation errors collected.
-   **\`=== 0\`**: A strict equality check to determine if the count is exactly zero.
-   **Boolean Result**: The expression \`errors.length === 0\` evaluates to \`true\` if no errors were found, and \`false\` if one or more errors were found.
-   **Clarity**: This provides a concise and unambiguous way to summarize the overall validation outcome.`,
      quickRules: `**Quick rules:**
-   ✅ Use \`errors.length === 0\` to determine overall validity when accumulating errors.
-   ✅ Ensure all potential errors are added to the \`errors\` array before this check.
-   ✅ The \`isValid\` flag should be the primary indicator for the calling code.
-   ✅ Consider the \`isValid\` flag as a quick check, with \`errors\` providing details.
-   ❌ Never rely on \`errors.length > 0\` for \`isValid\` (it should be \`false\` if errors exist).
-   ❌ Don't return \`isValid: true\` if the \`errors\` array is not empty.
-   ❌ Avoid complex logic for \`isValid\` beyond checking the error count.`,
      watchOut: `👀 **Watch out:** If your validation logic has branches where some errors are "warnings" and others are "blocking," \`errors.length === 0\` might be too simplistic. In such cases, you might need a more nuanced \`ValidationResult\` that distinguishes between critical errors and warnings, or a separate \`isCriticalFailure\` flag. For most business rule validations, however, any error is a blocking error.`,
      dryRun: `🔁 **Think:** A \`validateBooking\` call completes its checks.
1.  **Scenario A (Valid):** No rules found issues. \`errors\` array is \`[]\`.
2.  **Return Calculation A:** \`errors.length\` is \`0\`. \`0 === 0\` is \`true\`. Result: \`{ isValid: true, errors: [] }\`.
3.  **Scenario B (Invalid):** Two rules found issues. \`errors\` array is \`[{...error1...}, {...error2...}]\`.
4.  **Return Calculation B:** \`errors.length\` is \`2\`. \`2 === 0\` is \`false\`. Result: \`{ isValid: false, errors: [{...error1...}, {...error2...}] }\`.
(Hint: The \`isValid\` flag directly reflects whether any errors were collected.)`,
      build: `**Learning focus:** Construct the final \`ValidationResult\` object, setting \`isValid\` based on the presence of errors.`,
    },
  },

  // Step 5: Handlers / logic (Add first validation rule: User eligibility)
  {
    id: "step5",
    type: "question",
    phase: "Step 5 of 7",
    paal: "Now, let's implement our first business rule: checking if the user making the booking request is active and exists. Fetch the user from the mock database and add an error if they are not found or not active.",
    hint: "Use `await mockDb.fetchUser(request.userId)` and check both `user` existence and `user.isActive`. If either fails, `push` a `ValidationError` to the `errors` array.",
    example_code: `async function validateBooking(request: BookingRequest): Promise<ValidationResult> {
  const errors: ValidationError[] = [];

  // Rule 1: Check user eligibility
  const user = await mockDb.fetchUser(request.userId);
  if (!user || !user.isActive) {
    errors.push({
      field: "userId",
      message: "User is not active or does not exist.",
      code: "USER_INACTIVE_OR_NOT_FOUND",
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}`,
    think_prompt: "What conditions must be true for a user to be considered eligible, and how do you add an error if they are not?",
    mc_options: [
      `if (user && user.isActive) { /* no error */ } else { errors.push(...) }`,
      `if (!user || !user.isActive) { errors.push(...) }`,
      `if (user.isActive) { /* no error */ } else { errors.push(...) }`,
    ],
    mc_correct_option: `if (!user || !user.isActive) { errors.push(...) }`,
    mc_anchor: `if (!user || !user.isActive) {`,
    why_this_matters: "This step demonstrates how to integrate asynchronous data fetching with validation logic. Real-world business rules often depend on external data, and correctly handling these dependencies while accumulating errors is key to robust validation.",
    answer_keywords: ["async", "await", "user", "isActive", "errors.push"],
    seed_code: `interface ValidationError {
  field: string;
  message: string;
  code: string;
}

interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

interface User {
  id: string;
  isActive: boolean;
  role: "admin" | "member" | "guest";
}

interface Resource {
  id: string;
  name: string;
  capacity: number;
  currentBookings: { start: Date; end: Date }[];
  baseRatePerHour: number;
}

interface BookingRequest {
  userId: string;
  resourceId: string;
  startTime: Date;
  endTime: Date;
  requestedRatePerHour: number;
}

// Mock database functions (to simulate async checks)
const mockDb = {
  fetchUser: async (userId: string): Promise<User | undefined> => {
    if (userId === "user123") return { id: "user123", isActive: true, role: "member" };
    if (userId === "user456") return { id: "user456", isActive: false, role: "member" };
    return undefined;
  },
  fetchResource: async (resourceId: string): Promise<Resource | undefined> => {
    if (resourceId === "resA")
      return {
        id: "resA",
        name: "Meeting Room A",
        capacity: 10,
        currentBookings: [{ start: new Date("2023-10-27T10:00:00Z"), end: new Date("2023-10-27T11:00:00Z") }],
        baseRatePerHour: 50,
      };
    return undefined;
  },
};

async function validateBooking(request: BookingRequest): Promise<ValidationResult> {
  const errors: ValidationError[] = [];

  // ... validation rules will go here ...

  return {
    isValid: errors.length === 0,
    errors,
  };
}`,
    starter_code: `async function validateBooking(request: BookingRequest): Promise<ValidationResult> {
  const errors: ValidationError[] = [];

  // Implement Rule 1: Check user eligibility here

  return {
    isValid: errors.length === 0,
    errors,
  };
}`,
    feedback_correct: "Excellent! You've correctly implemented the first rule, checking for both user existence and active status, and pushing a specific error if the conditions are not met.",
    feedback_partial: "You're on the right track with fetching the user, but ensure you check *both* if the user exists *and* if they are active. Also, remember to push a `ValidationError` with `field`, `message`, and `code`.",
    feedback_wrong: "Checking only `user.isActive` might lead to errors if `user` is `undefined`. Always check for the existence of an object before accessing its properties. Also, make sure to push a structured `ValidationError`.",
    expected: `interface ValidationError {
  field: string;
  message: string;
  code: string;
}

interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

interface User {
  id: string;
  isActive: boolean;
  role: "admin" | "member" | "guest";
}

interface Resource {
  id: string;
  name: string;
  capacity: number;
  currentBookings: { start: Date; end: Date }[];
  baseRatePerHour: number;
}

interface BookingRequest {
  userId: string;
  resourceId: string;
  startTime: Date;
  endTime: Date;
  requestedRatePerHour: number;
}

// Mock database functions (to simulate async checks)
const mockDb = {
  fetchUser: async (userId: string): Promise<User | undefined> => {
    if (userId === "user123") return { id: "user123", isActive: true, role: "member" };
    if (userId === "user456") return { id: "user456", isActive: false, role: "member" };
    return undefined;
  },
  fetchResource: async (resourceId: string): Promise<Resource | undefined> => {
    if (resourceId === "resA")
      return {
        id: "resA",
        name: "Meeting Room A",
        capacity: 10,
        currentBookings: [{ start: new Date("2023-10-27T10:00:00Z"), end: new Date("2023-10-27T11:00:00Z") }],
        baseRatePerHour: 50,
      };
    return undefined;
  },
};

async function validateBooking(request: BookingRequest): Promise<ValidationResult> {
  const errors: ValidationError[] = [];

  // Rule 1: Check user eligibility
  const user = await mockDb.fetchUser(request.userId);
  if (!user || !user.isActive) {
    errors.push({
      field: "userId",
      message: "User is not active or does not exist.",
      code: "USER_INACTIVE_OR_NOT_FOUND",
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}`,
    analog_example: `interface ConfigError {
  key: string;
  description: string;
}

interface ConfigValidationResult {
  valid: boolean;
  issues: ConfigError[];
}

interface SystemSettings {
  port: number;
  timeoutMs: number;
  logLevel: "debug" | "info" | "warn" | "error";
  maxConnections: number;
}

function validateSystemSettings(settings: SystemSettings): ConfigValidationResult {
  const issues: ConfigError[] = [];

  // Rule: Port must be within a valid range
  if (settings.port < 1024 || settings.port > 65535) {
    issues.push({ key: "port", description: "Port must be between 1024 and 65535." });
  }

  // Rule: Timeout must be positive
  if (settings.timeoutMs <= 0) {
    issues.push({ key: "timeoutMs", description: "Timeout must be a positive value." });
  }

  return {
    valid: issues.length === 0,
    issues,
  };
}

// Example usage:
const invalidSettings: SystemSettings = {
  port: 80, // Invalid
  timeoutMs: -100, // Invalid
  logLevel: "info",
  maxConnections: 10,
};
const result = validateSystemSettings(invalidSettings);
console.log(result.issues.length); // 2`,
    deepDiveLabel: "How do you handle missing external data in validation?",
    deepDive: {
      hook: `Imagine a scenario where your system needs to validate if a customer has enough credit to make a purchase. This requires looking up their credit score from an external service. What happens if that service is down, or if the customer ID provided doesn't exist in their records? If your validation logic doesn't explicitly account for these "missing data" scenarios, it could either crash, return an incorrect "valid" status, or simply hang indefinitely. This lack of robustness against external failures can lead to critical system errors, financial losses, or security vulnerabilities, as operations might proceed under false assumptions.`,
      pain: `⚠️ **Lesson:** Validation must explicitly handle cases where external data is missing or unavailable. Symptom: Application crashes or misbehaves when external dependencies fail to provide expected data, leading to incorrect validation outcomes.`,
      mentalModel: `**Mental model:** The "Fallback Plan" approach. When planning a journey, you don't just assume the main road will always be open. You have a fallback plan for detours, road closures, or if your GPS loses signal. Similarly, when fetching external data for validation, your code needs a fallback plan: what to do if the data isn't found? Treat "data not found" as a specific type of validation failure, rather than an unexpected error. This ensures the validation process remains robust and provides clear feedback even when external systems are uncooperative.`,
      discover: `**Pattern - name:** Defensive Data Fetching for Validation
\`\`\`typescript
async function validateBooking(request: BookingRequest): Promise<ValidationResult> {
  const errors: ValidationError[] = [];

  const user = await mockDb.fetchUser(request.userId); // Attempt to fetch user
  if (!user) { // Explicitly check if user was found
    errors.push({
      field: "userId",
      message: "User does not exist.",
      code: "USER_NOT_FOUND",
    });
    // Important: For critical missing data, an early exit can simplify subsequent logic.
    // return { isValid: false, errors }; 
  }

  // Only proceed with user-dependent checks if user was found
  if (user && !user.isActive) { 
    errors.push({
      field: "userId",
      message: "User is not active.",
      code: "USER_INACTIVE",
    });
  }
  // ... rest of validation ...
  return { isValid: errors.length === 0, errors };
}
\`\`\`
-   **Null/Undefined Check**: Immediately after an \`await\` for external data, check if the result is \`null\` or \`undefined\`.
-   **Specific Error**: Push a \`ValidationError\` with a specific code (e.g., \`USER_NOT_FOUND\`) for missing data.
-   **Conditional Logic**: Subsequent validation rules that depend on the fetched data should only execute if the data was successfully retrieved.
-   **Early Exit (Optional but Recommended for Critical Data)**: For critical missing data (like a user or resource that *must* exist), an early \`return\` can prevent cascading errors and simplify subsequent logic.`,
      quickRules: `**Quick rules:**
-   ✅ Always check for \`null\` or \`undefined\` after fetching optional external data.
-   ✅ Treat missing critical external data as a specific validation error.
-   ✅ Use conditional logic to prevent accessing properties of potentially \`undefined\` objects.
-   ✅ Consider an early \`return\` for critical "not found" errors to simplify subsequent logic.
-   ❌ Never assume external data will always be present.
-   ❌ Avoid accessing properties of an object before checking its existence.
-   ❌ Don't use a generic "internal server error" for missing external data if a specific validation error is more appropriate.`,
      watchOut: `👀 **Watch out:** While an early exit for critical missing data (like \`user\` or \`resource\` not found) can simplify code, it also means you won't collect other errors. If the goal is to show *all* possible errors to the user (e.g., "user not found" AND "booking time invalid"), you might need to structure your code to allow all checks to run, even if some data is missing. The example in this module prioritizes collecting all errors, so it doesn't use an early exit for missing entities. A common pattern is to fetch all necessary data first, then run all validations, carefully handling \`undefined\` values in subsequent checks.`,
      dryRun: `🔁 **Think:** A booking request comes in for \`userId: "user456"\` (inactive) and \`resourceId: "resB"\` (non-existent).
1.  **\`fetchUser("user456")\`:** Returns \`{ id: "user456", isActive: false, role: "member" }\`.
2.  **User Check:** \`user\` is not \`null\` or \`undefined\`. \`user.isActive\` is \`false\`.
3.  **Error Push:** \`{ field: "userId", message: "User is not active or does not exist.", code: "USER_INACTIVE_OR_NOT_FOUND" }\` is pushed to \`errors\`. \`errors\` is now \`[{...user inactive error...}]\`.
4.  **\`fetchResource("resB")\`:** Returns \`undefined\`.
5.  **Resource Check (hypothetical next step):** \`resource\` is \`undefined\`. An error \`{ field: "resourceId", message: "Resource does not exist.", code: "RESOURCE_NOT_FOUND" }\` is pushed. \`errors\` is now \`[{...user inactive error...}, {...resource not found error...}]\`.
(Hint: Both errors are collected because the \`user\` was found, even if inactive, allowing the resource check to proceed.)`,
      build: `**Learning focus:** Implement the first validation rule to check if the user exists and is active, adding an error if not.`,
    },
  },

  // Step 6: Handlers / logic (Add more validation rules: Resource availability, duration, rate)
  {
    id: "step6",
    type: "question",
    phase: "Step 6 of 7",
    paal: "Continue by adding more validation rules. Implement checks for resource existence, overlapping schedules, valid booking duration, and correct requested rate. Remember to only perform checks that depend on `user` or `resource` if those entities were successfully retrieved.",
    hint: "For resource availability, check if `resource` exists. If it does, iterate `resource.currentBookings` to find overlaps. For duration, calculate `endTime - startTime`. For rate, compare `request.requestedRatePerHour` with `resource.baseRatePerHour`.",
    example_code: `async function validateBooking(request: BookingRequest): Promise<ValidationResult> {
  const errors: ValidationError[] = [];

  // Rule 1: Check user eligibility
  const user = await mockDb.fetchUser(request.userId);
  if (!user || !user.isActive) {
    errors.push({
      field: "userId",
      message: "User is not active or does not exist.",
      code: "USER_INACTIVE_OR_NOT_FOUND",
    });
  }

  // Rule 2: Check resource existence and availability
  const resource = await mockDb.fetchResource(request.resourceId);
  if (!resource) {
    errors.push({
      field: "resourceId",
      message: "Resource does not exist.",
      code: "RESOURCE_NOT_FOUND",
    });
  } else {
    // Only check availability if resource exists
    const newBookingStart = request.startTime.getTime();
    const newBookingEnd = request.endTime.getTime();

    if (newBookingStart >= newBookingEnd) {
      errors.push({
        field: "startTime",
        message: "Booking start time must be before end time.",
        code: "INVALID_BOOKING_DURATION",
      });
    } else {
      // Check for overlaps with existing bookings
      const hasOverlap = resource.currentBookings.some(existingBooking => {
        const existingStart = existingBooking.start.getTime();
        const existingEnd = existingBooking.end.getTime();
        return (newBookingStart < existingEnd && newBookingEnd > existingStart);
      });

      if (hasOverlap) {
        errors.push({
          field: "startTime",
          message: "Resource is not available during the requested time.",
          code: "RESOURCE_UNAVAILABLE",
        });
      }

      // Rule 3: Check valid booking duration (e.g., max 4 hours)
      const durationMs = newBookingEnd - newBookingStart;
      const maxDurationMs = 4 * 60 * 60 * 1000; // 4 hours
      if (durationMs > maxDurationMs) {
        errors.push({
          field: "duration",
          message: "Booking duration exceeds maximum allowed (4 hours).",
          code: "DURATION_EXCEEDED",
        });
      }
    }

    // Rule 4: Check requested rate
    if (request.requestedRatePerHour !== resource.baseRatePerHour) {
      errors.push({
        field: "requestedRatePerHour",
        message: \`Requested rate must match resource base rate (\${resource.baseRatePerHour}/hr).\`,
        code: "INVALID_RATE",
      });
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}`,
    think_prompt: "How do you check for time overlaps between two time ranges, and how do you ensure dependent checks only run if the resource exists?",
    mc_options: [
      `if (resource) { /* check availability, duration, rate */ }`,
      `if (newBookingStart < existingEnd && newBookingEnd > existingStart)`,
      `Both of the above are correct approaches.`,
    ],
    mc_correct_option: `Both of the above are correct approaches.`,
    mc_anchor: `if (!resource) {`,
    why_this_matters: "This step showcases the composition of multiple, potentially complex, business rules. It also highlights the importance of conditional execution to prevent errors when dependent data (like `resource` details) might be missing, ensuring robustness.",
    answer_keywords: ["resource", "availability", "overlap", "duration", "rate", "conditional logic"],
    seed_code: `interface ValidationError {
  field: string;
  message: string;
  code: string;
}

interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

interface User {
  id: string;
  isActive: boolean;
  role: "admin" | "member" | "guest";
}

interface Resource {
  id: string;
  name: string;
  capacity: number;
  currentBookings: { start: Date; end: Date }[];
  baseRatePerHour: number;
}

interface BookingRequest {
  userId: string;
  resourceId: string;
  startTime: Date;
  endTime: Date;
  requestedRatePerHour: number;
}

// Mock database functions (to simulate async checks)
const mockDb = {
  fetchUser: async (userId: string): Promise<User | undefined> => {
    if (userId === "user123") return { id: "user123", isActive: true, role: "member" };
    if (userId === "user456") return { id: "user456", isActive: false, role: "member" };
    return undefined;
  },
  fetchResource: async (resourceId: string): Promise<Resource | undefined> => {
    if (resourceId === "resA")
      return {
        id: "resA",
        name: "Meeting Room A",
        capacity: 10,
        currentBookings: [{ start: new Date("2023-10-27T10:00:00Z"), end: new Date("2023-10-27T11:00:00Z") }],
        baseRatePerHour: 50,
      };
    return undefined;
  },
};

async function validateBooking(request: BookingRequest): Promise<ValidationResult> {
  const errors: ValidationError[] = [];

  // Rule 1: Check user eligibility
  const user = await mockDb.fetchUser(request.userId);
  if (!user || !user.isActive) {
    errors.push({
      field: "userId",
      message: "User is not active or does not exist.",
      code: "USER_INACTIVE_OR_NOT_FOUND",
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}`,
    starter_code: `async function validateBooking(request: BookingRequest): Promise<ValidationResult> {
  const errors: ValidationError[] = [];

  // Rule 1: Check user eligibility
  const user = await mockDb.fetchUser(request.userId);
  if (!user || !user.isActive) {
    errors.push({
      field: "userId",
      message: "User is not active or does not exist.",
      code: "USER_INACTIVE_OR_NOT_FOUND",
    });
  }

  // Implement Rule 2 (resource existence/availability), Rule 3 (duration), and Rule 4 (rate) here

  return {
    isValid: errors.length === 0,
    errors,
  };
}`,
    feedback_correct: "Fantastic! You've successfully integrated multiple complex rules, including time overlap detection and conditional checks, demonstrating a robust validation pipeline.",
    feedback_partial: "You've added some rules, but ensure you're checking for resource existence *before* accessing its properties like `currentBookings` or `baseRatePerHour`. Also, verify your time overlap logic.",
    feedback_wrong: "Your logic for time overlap or conditional execution might be incorrect. Remember that `if (!resource)` handles the 'resource not found' case, and the `else` block is where you perform checks that *require* the resource to exist.",
    expected: `interface ValidationError {
  field: string;
  message: string;
  code: string;
}

interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

interface User {
  id: string;
  isActive: boolean;
  role: "admin" | "member" | "guest";
}

interface Resource {
  id: string;
  name: string;
  capacity: number;
  currentBookings: { start: Date; end: Date }[];
  baseRatePerHour: number;
}

interface BookingRequest {
  userId: string;
  resourceId: string;
  startTime: Date;
  endTime: Date;
  requestedRatePerHour: number;
}

// Mock database functions (to simulate async checks)
const mockDb = {
  fetchUser: async (userId: string): Promise<User | undefined> => {
    if (userId === "user123") return { id: "user123", isActive: true, role: "member" };
    if (userId === "user456") return { id: "user456", isActive: false, role: "member" };
    return undefined;
  },
  fetchResource: async (resourceId: string): Promise<Resource | undefined> => {
    if (resourceId === "resA")
      return {
        id: "resA",
        name: "Meeting Room A",
        capacity: 10,
        currentBookings: [{ start: new Date("2023-10-27T10:00:00Z"), end: new Date("2023-10-27T11:00:00Z") }],
        baseRatePerHour: 50,
      };
    return undefined;
  },
};

async function validateBooking(request: BookingRequest): Promise<ValidationResult> {
  const errors: ValidationError[] = [];

  // Rule 1: Check user eligibility
  const user = await mockDb.fetchUser(request.userId);
  if (!user || !user.isActive) {
    errors.push({
      field: "userId",
      message: "User is not active or does not exist.",
      code: "USER_INACTIVE_OR_NOT_FOUND",
    });
  }

  // Rule 2: Check resource existence and availability
  const resource = await mockDb.fetchResource(request.resourceId);
  if (!resource) {
    errors.push({
      field: "resourceId",
      message: "Resource does not exist.",
      code: "RESOURCE_NOT_FOUND",
    });
  } else {
    // Only check availability if resource exists
    const newBookingStart = request.startTime.getTime();
    const newBookingEnd = request.endTime.getTime();

    if (newBookingStart >= newBookingEnd) {
      errors.push({
        field: "startTime",
        message: "Booking start time must be before end time.",
        code: "INVALID_BOOKING_DURATION",
      });
    } else {
      // Check for overlaps with existing bookings
      const hasOverlap = resource.currentBookings.some(existingBooking => {
        const existingStart = existingBooking.start.getTime();
        const existingEnd = existingBooking.end.getTime();
        return (newBookingStart < existingEnd && newBookingEnd > existingStart);
      });

      if (hasOverlap) {
        errors.push({
          field: "startTime",
          message: "Resource is not available during the requested time.",
          code: "RESOURCE_UNAVAILABLE",
        });
      }

      // Rule 3: Check valid booking duration (e.g., max 4 hours)
      const durationMs = newBookingEnd - newBookingStart;
      const maxDurationMs = 4 * 60 * 60 * 1000; // 4 hours
      if (durationMs > maxDurationMs) {
        errors.push({
          field: "duration",
          message: "Booking duration exceeds maximum allowed (4 hours).",
          code: "DURATION_EXCEEDED",
        });
      }
    }

    // Rule 4: Check requested rate
    if (request.requestedRatePerHour !== resource.baseRatePerHour) {
      errors.push({
        field: "requestedRatePerHour",
        message: \`Requested rate must match resource base rate (\${resource.baseRatePerHour}/hr).\`,
        code: "INVALID_RATE",
      });
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}`,
    analog_example: `interface ConfigError {
  key: string;
  description: string;
}

interface ConfigValidationResult {
  valid: boolean;
  issues: ConfigError[];
}

interface SystemSettings {
  port: number;
  timeoutMs: number;
  logLevel: "debug" | "info" | "warn" | "error";
  maxConnections: number;
}

function validateSystemSettings(settings: SystemSettings): ConfigValidationResult {
  const issues: ConfigError[] = [];

  // Rule: Port must be within a valid range
  if (settings.port < 1024 || settings.port > 65535) {
    issues.push({ key: "port", description: "Port must be between 1024 and 65535." });
  }

  // Rule: Timeout must be positive
  if (settings.timeoutMs <= 0) {
    issues.push({ key: "timeoutMs", description: "Timeout must be a positive value." });
  }

  // Rule: Max connections must be at least 1 and no more than 1000
  if (settings.maxConnections < 1 || settings.maxConnections > 1000) {
    issues.push({ key: "maxConnections", description: "Max connections must be between 1 and 1000." });
  }

  // Rule: Log level must be one of the allowed values
  const allowedLogLevels = ["debug", "info", "warn", "error"];
  if (!allowedLogLevels.includes(settings.logLevel)) {
    issues.push({ key: "logLevel", description: "Invalid log level provided." });
  }

  return {
    valid: issues.length === 0,
    issues,
  };
}

// Example usage:
const complexInvalidSettings: SystemSettings = {
  port: 80, // Invalid
  timeoutMs: 5000,
  logLevel: "critical", // Invalid
  maxConnections: 10000, // Invalid
};
const result = validateSystemSettings(complexInvalidSettings);
console.log(result.issues.map(i => i.key)); // ["port", "logLevel", "maxConnections"]`,
    deepDiveLabel: "How do you compose multiple validation rules effectively?",
    deepDive: {
      hook: `Imagine trying to assemble a complex piece of furniture. The instructions don't just tell you to "assemble it." They break it down into steps: attach leg A to panel B, then attach panel C to panel B, and so on. If you tried to do everything at once, or if the order of operations was unclear, you'd end up with a mess. Similarly, in software, if you cram all your business rules into one giant, monolithic ` + "`if/else`" + ` block, the code becomes unreadable, unmaintainable, and incredibly difficult to debug. Changes to one rule might inadvertently break another, and testing becomes a nightmare.`,
      pain: `⚠️ **Lesson:** Monolithic validation logic leads to unmaintainable, unreadable, and error-prone code. Symptom: A single, excessively long function containing all validation rules, making it hard to understand, modify, or test individual checks.`,
      mentalModel: `**Mental model:** The "Assembly Line" approach. Think of each validation rule as a distinct station on an assembly line. At each station, a specific check is performed. If a defect is found, it's tagged, but the product continues down the line to be checked at other stations. This allows multiple defects to be identified in a single pass. The key is that each station (rule) is independent and focuses on one specific concern, contributing its findings to a central collection point (the \`errors\` array).`,
      discover: `**Pattern - name:** Composed Validation Rules
\`\`\`typescript
async function validateBooking(request: BookingRequest): Promise<ValidationResult> {
  const errors: ValidationError[] = [];

  // Rule 1: User eligibility (independent check)
  const user = await mockDb.fetchUser(request.userId);
  if (!user || !user.isActive) { errors.push({ /* ... */ }); }

  // Rule 2: Resource existence & availability (conditional checks)
  const resource = await mockDb.fetchResource(request.resourceId);
  if (!resource) {
    errors.push({ /* ... */ });
  } else { // Dependent checks run only if resource exists
    // Rule 2a: Start/End time order
    if (request.startTime.getTime() >= request.endTime.getTime()) { errors.push({ /* ... */ }); }
    // Rule 2b: Overlap with existing bookings
    // Rule 2c: Max duration
    // Rule 2d: Rate check
  }

  return { isValid: errors.length === 0, errors };
}
\`\`\`
-   **Modularity**: Each distinct business rule is encapsulated in its own \`if\` block or a dedicated helper function.
-   **Independence**: Rules that don't depend on others (like user eligibility) can run unconditionally.
-   **Conditional Execution**: Rules that *do* depend on the successful outcome of a prior check (e.g., resource availability depends on resource existence) are nested within \`if/else\` blocks.
-   **Error Accumulation**: All rules contribute their findings to a single \`errors\` array, allowing for a comprehensive report.`,
      quickRules: `**Quick rules:**
-   ✅ Break down complex validation into distinct, single-responsibility rules.
-   ✅ Use \`if\` statements to encapsulate each rule's logic.
-   ✅ Nest dependent rules within \`if/else\` blocks that confirm prerequisites.
-   ✅ Always add a specific \`ValidationError\` for each failed rule.
-   ❌ Avoid creating one giant \`if/else if/else\` chain for all rules.
-   ❌ Don't let a rule access data that might be \`undefined\` due to a prior failure without checking.
-   ❌ Never combine multiple unrelated business rules into a single \`if\` condition.`,
      watchOut: `👀 **Watch out:** While composing rules, be careful about the order of execution if rules have strong dependencies. For instance, checking \`resource.currentBookings\` *before* checking if \`resource\` itself exists will lead to a runtime error. Always ensure that data is present and valid before attempting to access its properties or perform further checks on it. For very complex interdependencies, consider a validation pipeline pattern where rules are chained, and the output of one (e.g., fetched data) becomes the input for the next.`,
      dryRun: `🔁 **Think:** A booking request for \`userId: "user123"\` (active), \`resourceId: "resA"\` (exists, but booked 10-11 AM), \`startTime: 10:30 AM\`, \`endTime: 11:30 AM\`, \`requestedRate: 60\`.
1.  **User Check:** \`user123\` is active. No error. \`errors\` is \`[]\`.
2.  **Resource Check:** \`resA\` exists. Enters \`else\` block.
3.  **Start/End Time:** \`10:30 < 11:30\`. No error.
4.  **Overlap Check:** \`newBookingStart (10:30)\` is \`< existingEnd (11:00)\` AND \`newBookingEnd (11:30)\` is \`> existingStart (10:00)\`. **Overlap detected!** Error \`{ field: "startTime", message: "Resource unavailable...", code: "RESOURCE_UNAVAILABLE" }\` is pushed. \`errors\` is \`[{...overlap error...}]\`.
5.  **Duration Check:** \`durationMs\` is 1 hour. Max is 4 hours. No error.
6.  **Rate Check:** \`requestedRate (60)\` is \`!== baseRate (50)\`. **Rate mismatch!** Error \`{ field: "requestedRatePerHour", message: "Invalid rate...", code: "INVALID_RATE" }\` is pushed. \`errors\` is \`[{...overlap error...}, {...rate error...}]\`.
7.  **Final Result:** \`{ isValid: false, errors: [{...overlap error...}, {...rate error...}] }\`.
(Hint: All applicable rules run, and all detected errors are collected.)`,
      build: `**Learning focus:** Add multiple business rules to \`validateBooking\`, including checks for resource availability, booking duration, and rate, ensuring conditional execution for dependent checks.`,
    },
  },

  // Step 7: Wire handlers to structure (Usage example)
  {
    id: "step7",
    type: "question",
    phase: "Step 7 of 7",
    paal: "Finally, let's see how to use our `validateBooking` function. Call it with a sample `BookingRequest` and log the `ValidationResult` to observe its behavior.",
    hint: "Create a sample `BookingRequest` object, then `await` the result of `validateBooking` and log the `isValid` flag and the `errors` array.",
    example_code: `async function validateBooking(request: BookingRequest): Promise<ValidationResult> {
  const errors: ValidationError[] = [];

  // Rule 1: Check user eligibility
  const user = await mockDb.fetchUser(request.userId);
  if (!user || !user.isActive) {
    errors.push({
      field: "userId",
      message: "User is not active or does not exist.",
      code: "USER_INACTIVE_OR_NOT_FOUND",
    });
  }

  // Rule 2: Check resource existence and availability
  const resource = await mockDb.fetchResource(request.resourceId);
  if (!resource) {
    errors.push({
      field: "resourceId",
      message: "Resource does not exist.",
      code: "RESOURCE_NOT_FOUND",
    });
  } else {
    // Only check availability if resource exists
    const newBookingStart = request.startTime.getTime();
    const newBookingEnd = request.endTime.getTime();

    if (newBookingStart >= newBookingEnd) {
      errors.push({
        field: "startTime",
        message: "Booking start time must be before end time.",
        code: "INVALID_BOOKING_DURATION",
      });
    } else {
      // Check for overlaps with existing bookings
      const hasOverlap = resource.currentBookings.some(existingBooking => {
        const existingStart = existingBooking.start.getTime();
        const existingEnd = existingBooking.end.getTime();
        return (newBookingStart < existingEnd && newBookingEnd > existingStart);
      });

      if (hasOverlap) {
        errors.push({
          field: "startTime",
          message: "Resource is not available during the requested time.",
          code: "RESOURCE_UNAVAILABLE",
        });
      }

      // Rule 3: Check valid booking duration (e.g., max 4 hours)
      const durationMs = newBookingEnd - newBookingStart;
      const maxDurationMs = 4 * 60 * 60 * 1000; // 4 hours
      if (durationMs > maxDurationMs) {
        errors.push({
          field: "duration",
          message: "Booking duration exceeds maximum allowed (4 hours).",
          code: "DURATION_EXCEEDED",
        });
      }
    }

    // Rule 4: Check requested rate
    if (request.requestedRatePerHour !== resource.baseRatePerHour) {
      errors.push({
        field: "requestedRatePerHour",
        message: \`Requested rate must match resource base rate (\${resource.baseRatePerHour}/hr).\`,
        code: "INVALID_RATE",
      });
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

// --- Usage Example ---
async function runValidationExample() {
  const validRequest: BookingRequest = {
    userId: "user123",
    resourceId: "resA",
    startTime: new Date("2023-10-27T12:00:00Z"), // Available time
    endTime: new Date("2023-10-27T13:00:00Z"),
    requestedRatePerHour: 50,
  };

  const invalidRequest: BookingRequest = {
    userId: "user456", // Inactive user
    resourceId: "resA",
    startTime: new Date("2023-10-27T10:30:00Z"), // Overlap with existing booking
    endTime: new Date("2023-10-27T11:30:00Z"),
    requestedRatePerHour: 60, // Incorrect rate
  };

  console.log("--- Valid Request Validation ---");
  const validResult = await validateBooking(validRequest);
  console.log("Is Valid:", validResult.isValid);
  console.log("Errors:", validResult.errors);

  console.log("\\n--- Invalid Request Validation ---");
  const invalidResult = await validateBooking(invalidRequest);
  console.log("Is Valid:", invalidResult.isValid);
  console.log("Errors:", invalidResult.errors);
}

runValidationExample(); // Execute the example`,
    think_prompt: "How do you call an `async` function and handle its `Promise` return value to inspect the `ValidationResult`?",
    mc_options: [
      `const result = validateBooking(request); console.log(result);`,
      `async function main() { const result = await validateBooking(request); console.log(result); } main();`,
      `validateBooking(request).then(result => console.log(result));`,
    ],
    mc_correct_option: `async function main() { const result = await validateBooking(request); console.log(result); } main();`,
    mc_anchor: `async function runValidationExample() {`,
    why_this_matters: "This final step demonstrates the practical application of the validation module. Seeing the structured `ValidationResult` in action reinforces the value of clear error reporting and the separation of concerns between validation and core business logic.",
    answer_keywords: ["usage", "async", "await", "ValidationResult", "console.log"],
    seed_code: `interface ValidationError {
  field: string;
  message: string;
  code: string;
}

interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

interface User {
  id: string;
  isActive: boolean;
  role: "admin" | "member" | "guest";
}

interface Resource {
  id: string;
  name: string;
  capacity: number;
  currentBookings: { start: Date; end: Date }[];
  baseRatePerHour: number;
}

interface BookingRequest {
  userId: string;
  resourceId: string;
  startTime: Date;
  endTime: Date;
  requestedRatePerHour: number;
}

// Mock database functions (to simulate async checks)
const mockDb = {
  fetchUser: async (userId: string): Promise<User | undefined> => {
    if (userId === "user123") return { id: "user123", isActive: true, role: "member" };
    if (userId === "user456") return { id: "user456", isActive: false, role: "member" };
    return undefined;
  },
  fetchResource: async (resourceId: string): Promise<Resource | undefined> => {
    if (resourceId === "resA")
      return {
        id: "resA",
        name: "Meeting Room A",
        capacity: 10,
        currentBookings: [{ start: new Date("2023-10-27T10:00:00Z"), end: new Date("2023-10-27T11:00:00Z") }],
        baseRatePerHour: 50,
      };
    return undefined;
  },
};

async function validateBooking(request: BookingRequest): Promise<ValidationResult> {
  const errors: ValidationError[] = [];

  // Rule 1: Check user eligibility
  const user = await mockDb.fetchUser(request.userId);
  if (!user || !user.isActive) {
    errors.push({
      field: "userId",
      message: "User is not active or does not exist.",
      code: "USER_INACTIVE_OR_NOT_FOUND",
    });
  }

  // Rule 2: Check resource existence and availability
  const resource = await mockDb.fetchResource(request.resourceId);
  if (!resource) {
    errors.push({
      field: "resourceId",
      message: "Resource does not exist.",
      code: "RESOURCE_NOT_FOUND",
    });
  } else {
    // Only check availability if resource exists
    const newBookingStart = request.startTime.getTime();
    const newBookingEnd = request.endTime.getTime();

    if (newBookingStart >= newBookingEnd) {
      errors.push({
        field: "startTime",
        message: "Booking start time must be before end time.",
        code: "INVALID_BOOKING_DURATION",
      });
    } else {
      // Check for overlaps with existing bookings
      const hasOverlap = resource.currentBookings.some(existingBooking => {
        const existingStart = existingBooking.start.getTime();
        const existingEnd = existingBooking.end.getTime();
        return (newBookingStart < existingEnd && newBookingEnd > existingStart);
      });

      if (hasOverlap) {
        errors.push({
          field: "startTime",
          message: "Resource is not available during the requested time.",
          code: "RESOURCE_UNAVAILABLE",
        });
      }

      // Rule 3: Check valid booking duration (e.g., max 4 hours)
      const durationMs = newBookingEnd - newBookingStart;
      const maxDurationMs = 4 * 60 * 60 * 1000; // 4 hours
      if (durationMs > maxDurationMs) {
        errors.push({
          field: "duration",
          message: "Booking duration exceeds maximum allowed (4 hours).",
          code: "DURATION_EXCEEDED",
        });
      }
    }

    // Rule 4: Check requested rate
    if (request.requestedRatePerHour !== resource.baseRatePerHour) {
      errors.push({
        field: "requestedRatePerHour",
        message: \`Requested rate must match resource base rate (\${resource.baseRatePerHour}/hr).\`,
        code: "INVALID_RATE",
      });
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}`,
    starter_code: `// Add usage example here
`,
    feedback_correct: "Excellent! You've correctly demonstrated how to call the `async` `validateBooking` function and interpret its `ValidationResult`, showcasing the full pattern.",
    feedback_partial: "You've initiated the call, but remember to `await` the `validateBooking` function's result since it's `async`, and then log both `isValid` and the `errors` array for a complete picture.",
    feedback_wrong: "Calling an `async` function without `await` (or `.then()`) will result in a `Promise` object being logged, not the actual `ValidationResult`. Ensure you handle the asynchronous nature of the function call.",
    expected: `interface ValidationError {
  field: string;
  message: string;
  code: string;
}

interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

interface User {
  id: string;
  isActive: boolean;
  role: "admin" | "member" | "guest";
}

interface Resource {
  id: string;
  name: string;
  capacity: number;
  currentBookings: { start: Date; end: Date }[];
  baseRatePerHour: number;
}

interface BookingRequest {
  userId: string;
  resourceId: string;
  startTime: Date;
  endTime: Date;
  requestedRatePerHour: number;
}

// Mock database functions (to simulate async checks)
const mockDb = {
  fetchUser: async (userId: string): Promise<User | undefined> => {
    if (userId === "user123") return { id: "user123", isActive: true, role: "member" };
    if (userId === "user456") return { id: "user456", isActive: false, role: "member" };
    return undefined;
  },
  fetchResource: async (resourceId: string): Promise<Resource | undefined> => {
    if (resourceId === "resA")
      return {
        id: "resA",
        name: "Meeting Room A",
        capacity: 10,
        currentBookings: [{ start: new Date("2023-10-27T10:00:00Z"), end: new Date("2023-10-27T11:00:00Z") }],
        baseRatePerHour: 50,
      };
    return undefined;
  },
};

async function validateBooking(request: BookingRequest): Promise<ValidationResult> {
  const errors: ValidationError[] = [];

  // Rule 1: Check user eligibility
  const user = await mockDb.fetchUser(request.userId);
  if (!user || !user.isActive) {
    errors.push({
      field: "userId",
      message: "User is not active or does not exist.",
      code: "USER_INACTIVE_OR_NOT_FOUND",
    });
  }

  // Rule 2: Check resource existence and availability
  const resource = await mockDb.fetchResource(request.resourceId);
  if (!resource) {
    errors.push({
      field: "resourceId",
      message: "Resource does not exist.",
      code: "RESOURCE_NOT_FOUND",
    });
  } else {
    // Only check availability if resource exists
    const newBookingStart = request.startTime.getTime();
    const newBookingEnd = request.endTime.getTime();

    if (newBookingStart >= newBookingEnd) {
      errors.push({
        field: "startTime",
        message: "Booking start time must be before end time.",
        code: "INVALID_BOOKING_DURATION",
      });
    } else {
      // Check for overlaps with existing bookings
      const hasOverlap = resource.currentBookings.some(existingBooking => {
        const existingStart = existingBooking.start.getTime();
        const existingEnd = existingBooking.end.getTime();
        return (newBookingStart < existingEnd && newBookingEnd > existingStart);
      });

      if (hasOverlap) {
        errors.push({
          field: "startTime",
          message: "Resource is not available during the requested time.",
          code: "RESOURCE_UNAVAILABLE",
        });
      }

      // Rule 3: Check valid booking duration (e.g., max 4 hours)
      const durationMs = newBookingEnd - newBookingStart;
      const maxDurationMs = 4 * 60 * 60 * 1000; // 4 hours
      if (durationMs > maxDurationMs) {
        errors.push({
          field: "duration",
          message: "Booking duration exceeds maximum allowed (4 hours).",
          code: "DURATION_EXCEEDED",
        });
      }
    }

    // Rule 4: Check requested rate
    if (request.requestedRatePerHour !== resource.baseRatePerHour) {
      errors.push({
        field: "requestedRatePerHour",
        message: \`Requested rate must match resource base rate (\${resource.baseRatePerHour}/hr).\`,
        code: "INVALID_RATE",
      });
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

// --- Usage Example ---
async function runValidationExample() {
  const validRequest: BookingRequest = {
    userId: "user123",
    resourceId: "resA",
    startTime: new Date("2023-10-27T12:00:00Z"), // Available time
    endTime: new Date("2023-10-27T13:00:00Z"),
    requestedRatePerHour: 50,
  };

  const invalidRequest: BookingRequest = {
    userId: "user456", // Inactive user
    resourceId: "resA",
    startTime: new Date("2023-10-27T10:30:00Z"), // Overlap with existing booking
    endTime: new Date("2023-10-27T11:30:00Z"),
    requestedRatePerHour: 60, // Incorrect rate
  };

  console.log("--- Valid Request Validation ---");
  const validResult = await validateBooking(validRequest);
  console.log("Is Valid:", validResult.isValid);
  console.log("Errors:", validResult.errors);

  console.log("\\n--- Invalid Request Validation ---");
  const invalidResult = await validateBooking(invalidRequest);
  console.log("Is Valid:", invalidResult.isValid);
  console.log("Errors:", invalidResult.errors);
}

runValidationExample(); // Execute the example`,
    analog_example: `interface ConfigError {
  key: string;
  description: string;
}

interface ConfigValidationResult {
  valid: boolean;
  issues: ConfigError[];
}

interface SystemSettings {
  port: number;
  timeoutMs: number;
  logLevel: "debug" | "info" | "warn" | "error";
  maxConnections: number;
}

function validateSystemSettings(settings: SystemSettings): ConfigValidationResult {
  const issues: ConfigError[] = [];

  if (settings.port < 1024 || settings.port > 65535) {
    issues.push({ key: "port", description: "Port must be between 1024 and 65535." });
  }
  if (settings.timeoutMs <= 0) {
    issues.push({ key: "timeoutMs", description: "Timeout must be a positive value." });
  }
  const allowedLogLevels = ["debug", "info", "warn", "error"];
  if (!allowedLogLevels.includes(settings.logLevel)) {
    issues.push({ key: "logLevel", description: "Invalid log level provided." });
  }

  return {
    valid: issues.length === 0,
    issues,
  };
}

// --- Usage Example ---
const settings1: SystemSettings = {
  port: 8080,
  timeoutMs: 5000,
  logLevel: "info",
  maxConnections: 100,
};

const settings2: SystemSettings = {
  port: 80, // Invalid
  timeoutMs: -100, // Invalid
  logLevel: "critical", // Invalid
  maxConnections: 0, // Invalid
};

console.log("--- Settings 1 Validation ---");
const result1 = validateSystemSettings(settings1);
console.log("Is Valid:", result1.valid);
console.log("Issues:", result1.issues);

console.log("\\n--- Settings 2 Validation ---");
const result2 = validateSystemSettings(settings2);
console.log("Is Valid:", result2.valid);
console.log("Issues:", result2.issues);`,
    deepDiveLabel: "How do you integrate validation into an application's workflow?",
    deepDive: {
      hook: `You've built a robust validation function, but how does the rest of your application actually *use* it? If you simply call ` + "`validateBooking()`" + ` and then proceed with the booking regardless of the result, your validation is effectively useless. The application needs a clear decision point: if valid, proceed; if invalid, respond with errors. Without this integration, your carefully crafted validation logic becomes an isolated, unutilized component, leading to the same data integrity issues it was designed to prevent. The challenge is connecting the validation outcome to the application's control flow.`,
      pain: `⚠️ **Lesson:** Validation logic must be explicitly integrated into the application's workflow to be effective. Symptom: Validation functions exist but their results are ignored, leading to invalid data being processed.`,
      mentalModel: `**Mental model:** The "Security Checkpoint" analogy. Before entering a secure area, you must pass through a checkpoint. If you pass, you proceed. If you fail (e.g., have prohibited items), you are denied entry and given specific reasons for the denial. The checkpoint doesn't just *tell* you if you failed; it *prevents* you from moving forward. Similarly, your validation function acts as a checkpoint. The application's main logic should call this checkpoint, and only if it passes (\`isValid: true\`) should the core action (e.g., saving to database, sending email) be executed. If it fails, the errors are returned to the user or logged.`,
      discover: `**Pattern - name:** Pre-Action Validation Gate
\`\`\`typescript
async function handleBookingRequest(request: BookingRequest) {
  const validationResult = await validateBooking(request); // The validation gate

  if (!validationResult.isValid) {
    // If not valid, send back errors and stop the process
    console.error("Booking validation failed:", validationResult.errors);
    // In a real app, you'd send a 400 Bad Request response with errors
    return { success: false, errors: validationResult.errors };
  }

  // If valid, proceed with the core business logic
  console.log("Booking request is valid. Proceeding with booking creation...");
  // await saveBookingToDatabase(request);
  // await sendConfirmationEmail(request.userId);
  return { success: true, message: "Booking created successfully!" };
}

// Example usage:
// handleBookingRequest(validRequest);
// handleBookingRequest(invalidRequest);
\`\`\`
-   **Call Validation**: The first step in any action handler is to call the \`validate\` function.
-   **Conditional Branching**: An \`if (!validationResult.isValid)\` block immediately checks the outcome.
-   **Error Response**: If invalid, the errors are processed (e.g., logged, sent back to client) and the function exits.
-   **Proceed with Action**: Only if \`isValid\` is \`true\` does the core business logic (e.g., database writes, external API calls) execute.`,
      quickRules: `**Quick rules:**
-   ✅ Call your validation function at the very beginning of any action handler.
-   ✅ Use an \`if (!result.isValid)\` check to control the flow.
-   ✅ Return or throw an error immediately if validation fails.
-   ✅ Provide the \`errors\` array in your response to the client.
-   ❌ Never proceed with an action if \`result.isValid\` is \`false\`.
-   ❌ Don't ignore the \`ValidationResult\` and assume success.
-   ❌ Avoid performing partial actions if validation fails (e.g., saving only some data).`,
      watchOut: `👀 **Watch out:** Ensure that your application's error handling mechanism is equipped to receive and process the structured \`ValidationError\` objects. A common mistake is to simply log the errors on the server and return a generic "Internal Server Error" to the client, which defeats the purpose of detailed validation feedback. Also, be mindful of potential race conditions if validation is performed against a rapidly changing external state; consider transactional validation or optimistic concurrency control for highly sensitive operations.`,
      dryRun: `🔁 **Think:** The \`runValidationExample\` function is called.
1.  **\`validRequest\`:** \`validateBooking(validRequest)\` is called. It returns \`{ isValid: true, errors: [] }\`.
2.  **\`console.log\` (Valid):** Logs "Is Valid: true" and "Errors: []".
3.  **\`invalidRequest\`:** \`validateBooking(invalidRequest)\` is called. It returns \`{ isValid: false, errors: [{...user error...}, {...overlap error...}, {...rate error...}] }\`.
4.  **\`console.log\` (Invalid):** Logs "Is Valid: false" and "Errors: [...]" (showing all three specific errors).
(Hint: The calling code clearly distinguishes between valid and invalid outcomes and has access to all error details.)`,
      build: `**Learning focus:** Demonstrate how to integrate and use the \`validateBooking\` function within an application's workflow, handling both valid and invalid scenarios.`,
    },
  },
];

const sideItems = [
  { label: "Lesson", id: "intro" },
  { label: "Objectives", id: "objectives" },
  { label: "Step 1: Define Types", id: "step1" },
  { label: "Step 2: Function Shell", id: "step2" },
  { label: "Step 3: Init Errors", id: "step3" },
  { label: "Step 4: Return Structure", id: "step4" },
  { label: "Step 5: User Eligibility", id: "step5" },
  { label: "Step 6: More Rules", id: "step6" },
  { label: "Step 7: Usage Example", id: "step7" },
];

export default createINPACTEngine({
  NODES,
  sideItems,
  lessonNum: 0,
  title: "Business Rule Validation with Structured Errors",
  shortName: "Biz Rule Validation",
});
