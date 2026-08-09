import createINPACTEngine from "../inpact_engine_shared";

// Define a generic type for configuration settings
interface ConfigurationSetting {
  id: string;
  name: string;
  value: string; // Could be any type, but string simplifies examples
  isSensitive: boolean;
  version: number;
}

// Simulate a database/storage for configuration settings
const mockSettingsDb: ConfigurationSetting[] = [
  { id: "cfg-1", name: "featureA_enabled", value: "true", isSensitive: false, version: 1 },
  { id: "cfg-2", name: "api_key_prod", value: "sk_prod_xyz123", isSensitive: true, version: 1 },
];

// Simulate a current user/actor
const currentActorId = "user-admin-456";

export const NODES = [
  {
    id: "intro",
    type: "reveal",
    phase: "Lesson",
    content: {
      tag: "audit-logging-pattern",
      title: "Building Immutable Audit Trails",
      body: `
        In software engineering, understanding "who did what, when, and to what" is not just a good practice—it's often a critical requirement for security, compliance, and debugging. An immutable audit trail provides a chronological, tamper-proof record of all significant events within a system, such as data modifications, user actions, or access to sensitive information. Without a robust audit logging mechanism, it becomes incredibly difficult to trace the origin of an issue, prove compliance with regulatory standards, or detect malicious activity. This pattern ensures that every critical interaction leaves a clear, unalterable footprint.

        This fundamental pattern extends across virtually all types of applications. You'll find audit logging essential in financial systems tracking transactions, healthcare applications managing patient records, e-commerce platforms monitoring order changes, and even in simple administrative tools that manage user permissions or system configurations. Any system where data integrity, accountability, or security is paramount benefits immensely from a well-designed audit trail, providing a historical context that is invaluable for operational oversight and incident response.
      `,
      usecase: "Tracking all changes made to critical system configuration settings and logging access to sensitive API keys in an administrative panel.",
    },
  },
  {
    id: "objectives",
    type: "objectives",
    phase: "Objectives",
    items: [
      "Design a robust data structure for audit log entries.",
      "Implement a centralized function for recording audit events.",
      "Integrate audit logging into operations that modify data, capturing before and after states.",
      "Apply audit logging to track access to sensitive data, even without modification.",
    ],
  },
  {
    id: "step1",
    type: "question",
    phase: "Step 1 of 4",
    paal: "To begin building an audit trail, we first need to define the structure of a single audit log entry. This structure will ensure consistency and provide all necessary details for compliance and debugging.",
    hint: "Think about what information is absolutely essential to reconstruct an event: who, what, when, and to what entity, including its state.",
    example_code: `
interface AuditEntry {
  id: string;
  timestamp: string;
  actorId: string;
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'READ';
  entityType: string;
  entityId: string;
  beforeState?: Record<string, any>;
  afterState?: Record<string, any>;
  details?: Record<string, any>;
}
    `,
    think_prompt: "What fields are essential to capture for every change or sensitive access event to ensure a complete and immutable record?",
    mc_options: [
      "actorId, action, timestamp",
      "actorId, action, entityId, timestamp, beforeState, afterState",
      "action, details, message",
    ],
    mc_correct_option: "actorId, action, entityId, timestamp, beforeState, afterState",
    mc_anchor: "interface AuditEntry {",
    why_this_matters: "A well-defined `AuditEntry` interface is the foundation of any reliable audit system. It standardizes the data, making logs queryable, understandable, and useful for forensic analysis, compliance reporting, and debugging. Without a consistent structure, audit logs become a chaotic collection of disparate information, losing their value.",
    answer_keywords: ["interface", "audit entry", "structure", "fields"],
    seed_code: `
// Define a generic type for configuration settings
interface ConfigurationSetting {
  id: string;
  name: string;
  value: string; // Could be any type, but string simplifies examples
  isSensitive: boolean;
  version: number;
}

// Simulate a database/storage for configuration settings
const mockSettingsDb: ConfigurationSetting[] = [
  { id: "cfg-1", name: "featureA_enabled", value: "true", isSensitive: false, version: 1 },
  { id: "cfg-2", name: "api_key_prod", value: "sk_prod_xyz123", isSensitive: true, version: 1 },
];

// Simulate a current user/actor
const currentActorId = "user-admin-456";
`,
    starter_code: `
// Define a generic type for configuration settings
interface ConfigurationSetting {
  id: string;
  name: string;
  value: string; // Could be any type, but string simplifies examples
  isSensitive: boolean;
  version: number;
}

// Simulate a database/storage for configuration settings
const mockSettingsDb: ConfigurationSetting[] = [
  { id: "cfg-1", name: "featureA_enabled", value: "true", isSensitive: false, version: 1 },
  { id: "cfg-2", name: "api_key_prod", value: "sk_prod_xyz123", isSensitive: true, version: 1 },
];

// Simulate a current user/actor
const currentActorId = "user-admin-456";

// Add your AuditEntry interface here
`,
    feedback_correct: "Excellent! Capturing the actor, action, entity, timestamp, and both before/after states provides a comprehensive and immutable record for any event.",
    feedback_partial: "You've identified some key fields, but a complete audit entry needs to capture the specific entity affected (entityId), its type (entityType), and crucially, the state of the entity both before and after the action for full traceability.",
    feedback_wrong: "While action, details, and a message are useful, they don't provide the structured, immutable record needed for an audit trail. You need to identify the actor, the specific entity, and its state changes.",
    expected: `
// Define a generic type for configuration settings
interface ConfigurationSetting {
  id: string;
  name: string;
  value: string; // Could be any type, but string simplifies examples
  isSensitive: boolean;
  version: number;
}

// Simulate a database/storage for configuration settings
const mockSettingsDb: ConfigurationSetting[] = [
  { id: "cfg-1", name: "featureA_enabled", value: "true", isSensitive: false, version: 1 },
  { id: "cfg-2", name: "api_key_prod", value: "sk_prod_xyz123", isSensitive: true, version: 1 },
];

// Simulate a current user/actor
const currentActorId = "user-admin-456";

interface AuditEntry {
  id: string;
  timestamp: string;
  actorId: string;
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'READ';
  entityType: string;
  entityId: string;
  beforeState?: Record<string, any>;
  afterState?: Record<string, any>;
  details?: Record<string, any>;
}
`,
    analog_example: `
// Analog: A simple transaction log for a game's in-game currency
interface GameTransaction {
  transactionId: string;
  timestamp: string;
  playerId: string;
  type: 'PURCHASE' | 'SELL' | 'GIFT' | 'EARN';
  itemId?: string;
  currencyAmount: number;
  balanceBefore: number;
  balanceAfter: number;
}

// This interface captures all necessary details for auditing in-game currency flow.
`,
    deepDiveLabel: "Why is 'beforeState' and 'afterState' so important?",
    deepDive: {
      hook: `
        Imagine a critical system configuration setting, say 'max_concurrent_users', was changed from '100' to '10'. Suddenly, your application grinds to a halt, users can't log in, and your support channels are flooded. You know *when* it happened, and *who* made the change, but you can't immediately tell *what* the value was before, or *what* it became after, without digging through backups or guessing. The immediate question is: "What exactly changed?" Without a clear record of both the old and new values, diagnosing the problem and potentially reverting the change becomes a much more complex, time-consuming, and stressful ordeal.
      `,
      pain: `
        ⚠️ **Lesson:** Without capturing both the 'before' and 'after' states of an entity during an update or delete operation, audit trails lose significant forensic value.
        **Symptom:** Difficulty in debugging unexpected system behavior, inability to perform precise rollbacks, challenges in proving compliance, and a lack of clear accountability for data modifications. It's like having a security camera that records *when* someone entered a room and *who* it was, but doesn't show *what* they did inside.
      `,
      mentalModel: `
        **Mental model:** The "Snapshot Comparison." Think of an audit entry with 'beforeState' and 'afterState' as a pair of photographs taken milliseconds apart: one just before a change, and one just after. These two snapshots, when compared, reveal the exact delta of the modification. This isn't just about knowing *that* something changed, but precisely *how* it changed, allowing for detailed analysis, impact assessment, and precise reconstruction of events. It's the difference between saying "the house changed" and saying "the house's roof color changed from red to blue."
      `,
      discover: `
        **Pattern - Audit Entry State Capture:**
        \`\`\`typescript
        interface AuditEntry {
          // ... other fields ...
          beforeState?: Record<string, any>; // Optional, for UPDATE/DELETE
          afterState?: Record<string, any>;  // Optional, for CREATE/UPDATE
        }
        \`\`\`
        - \`beforeState\`: Captures the full or relevant subset of the entity's data *immediately prior* to the action being performed. This is crucial for understanding the starting point of a change.
        - \`afterState\`: Captures the full or relevant subset of the entity's data *immediately after* the action has completed. This shows the resulting state.
        - \`Record<string, any>\`: A flexible type to store key-value pairs representing the entity's attributes. It allows for different entity types to be logged consistently.
        - \`?\` (optional): These fields are optional because 'CREATE' actions only have an \`afterState\`, 'DELETE' actions only have a \`beforeState\`, and 'READ' actions typically have neither (or only metadata in \`details\`).
      `,
      quickRules: `
        **Quick rules:**
        - ✅ Always capture \`beforeState\` and \`afterState\` for \`UPDATE\` operations.
        - ✅ Capture \`afterState\` for \`CREATE\` operations to record the initial state.
        - ✅ Capture \`beforeState\` for \`DELETE\` operations to record what was removed.
        - ✅ Ensure the captured state is a deep copy, not a reference, to prevent future modifications from altering the audit record.
        - ❌ Never omit \`beforeState\` or \`afterState\` for \`UPDATE\` operations on critical data.
        - ❌ Do not store references to mutable objects in \`beforeState\` or \`afterState\`; always serialize or clone.
        - ❌ Avoid logging excessively large or irrelevant data in states; focus on the critical attributes.
      `,
      watchOut: `
        👀 **Watch out:** A common pitfall is to store a reference to the original object in \`beforeState\` or \`afterState\` instead of a deep copy. If the object is mutable and later modified, your audit log entry will inadvertently change, violating the immutability principle. Always ensure you're logging a snapshot of the data at that specific point in time, typically by serializing it (e.g., \`JSON.parse(JSON.stringify(obj))\`) or using a deep cloning utility. Also, be mindful of sensitive data; avoid logging raw passwords or private keys directly in states.
      `,
      dryRun: `
        🔁 **Think:** A \`ConfigurationSetting\` named "featureX_enabled" has \`value: "false"\`. An admin updates it to \`value: "true"\`.
        1. Before the update, \`beforeState\` is captured as \`{ id: "cfg-3", name: "featureX_enabled", value: "false", isSensitive: false, version: 1 }\`.
        2. The update function modifies the setting in \`mockSettingsDb\`.
        3. After the update, \`afterState\` is captured as \`{ id: "cfg-3", name: "featureX_enabled", value: "true", isSensitive: false, version: 2 }\`.
        4. The \`AuditEntry\` is created with \`action: 'UPDATE'\`, \`beforeState\` (false), and \`afterState\` (true).
        (Hint: The \`version\` field would also increment, showing another change in the state.)
      `,
      build: "**Learning focus:** Defining the `AuditEntry` interface with `beforeState` and `afterState` is crucial for creating a comprehensive and traceable record of data changes.",
    },
  },
  {
    id: "step2",
    type: "question",
    phase: "Step 2 of 4",
    paal: "With our `AuditEntry` defined, the next step is to create a dedicated function responsible for receiving and storing these entries. This centralizes the logging logic, making it easier to manage and ensuring all logs follow the same process.",
    hint: "You'll need a place to store the logs (a simple array for now) and a function to add new entries to it.",
    example_code: `
const auditLogStore: AuditEntry[] = [];

function logAuditEntry(entry: AuditEntry): void {
  auditLogStore.push(entry);
  console.log("Audit Logged:", entry); // For demonstration
}
    `,
    think_prompt: "How would you design a function that accepts an `AuditEntry` and adds it to a collection, simulating a persistent log?",
    mc_options: [
      "function logAuditEntry(entry: any) { console.log(entry); }",
      "const auditLogStore: AuditEntry[] = []; function logAuditEntry(entry: AuditEntry) { auditLogStore.push(entry); }",
      "function logAuditEntry(actor: string, action: string) { /* ... */ }",
    ],
    mc_correct_option: "const auditLogStore: AuditEntry[] = []; function logAuditEntry(entry: AuditEntry) { auditLogStore.push(entry); }",
    mc_anchor: "const auditLogStore: AuditEntry[] = [];",
    why_this_matters: "A centralized logging function (`logAuditEntry`) acts as a single gateway for all audit events. This promotes consistency, simplifies maintenance, and allows for future enhancements (like sending logs to a remote service, adding metadata, or filtering) without modifying every part of the application that generates an audit event. It enforces the 'single source of truth' for logging.",
    answer_keywords: ["centralized", "logging function", "store", "array"],
    seed_code: `
// Define a generic type for configuration settings
interface ConfigurationSetting {
  id: string;
  name: string;
  value: string; // Could be any type, but string simplifies examples
  isSensitive: boolean;
  version: number;
}

// Simulate a database/storage for configuration settings
const mockSettingsDb: ConfigurationSetting[] = [
  { id: "cfg-1", name: "featureA_enabled", value: "true", isSensitive: false, version: 1 },
  { id: "cfg-2", name: "api_key_prod", value: "sk_prod_xyz123", isSensitive: true, version: 1 },
];

// Simulate a current user/actor
const currentActorId = "user-admin-456";

interface AuditEntry {
  id: string;
  timestamp: string;
  actorId: string;
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'READ';
  entityType: string;
  entityId: string;
  beforeState?: Record<string, any>;
  afterState?: Record<string, any>;
  details?: Record<string, any>;
}
`,
    starter_code: `
// Define a generic type for configuration settings
interface ConfigurationSetting {
  id: string;
  name: string;
  value: string; // Could be any type, but string simplifies examples
  isSensitive: boolean;
  version: number;
}

// Simulate a database/storage for configuration settings
const mockSettingsDb: ConfigurationSetting[] = [
  { id: "cfg-1", name: "featureA_enabled", value: "true", isSensitive: false, version: 1 },
  { id: "cfg-2", name: "api_key_prod", value: "sk_prod_xyz123", isSensitive: true, version: 1 },
];

// Simulate a current user/actor
const currentActorId = "user-admin-456";

interface AuditEntry {
  id: string;
  timestamp: string;
  actorId: string;
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'READ';
  entityType: string;
  entityId: string;
  beforeState?: Record<string, any>;
  afterState?: Record<string, any>;
  details?: Record<string, any>;
}

// Add your audit log store and logging function here
`,
    feedback_correct: "Exactly! A dedicated array to store `AuditEntry` objects and a function to push new entries into it creates a simple, centralized logging mechanism.",
    feedback_partial: "You've correctly identified the need for a function, but it's crucial to define a specific type for the `entry` parameter (`AuditEntry`) to ensure type safety and consistency. Also, you need a place to actually *store* these entries, not just print them.",
    feedback_wrong: "Logging to the console is useful for debugging, but it doesn't create a persistent or queryable audit trail. The function also needs to accept a structured `AuditEntry` object, not just generic parameters, to maintain consistency.",
    expected: `
// Define a generic type for configuration settings
interface ConfigurationSetting {
  id: string;
  name: string;
  value: string; // Could be any type, but string simplifies examples
  isSensitive: boolean;
  version: number;
}

// Simulate a database/storage for configuration settings
const mockSettingsDb: ConfigurationSetting[] = [
  { id: "cfg-1", name: "featureA_enabled", value: "true", isSensitive: false, version: 1 },
  { id: "cfg-2", name: "api_key_prod", value: "sk_prod_xyz123", isSensitive: true, version: 1 },
];

// Simulate a current user/actor
const currentActorId = "user-admin-456";

interface AuditEntry {
  id: string;
  timestamp: string;
  actorId: string;
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'READ';
  entityType: string;
  entityId: string;
  beforeState?: Record<string, any>;
  afterState?: Record<string, any>;
  details?: Record<string, any>;
}

const auditLogStore: AuditEntry[] = [];

function logAuditEntry(entry: AuditEntry): void {
  auditLogStore.push(entry);
  console.log("Audit Logged:", entry); // For demonstration
}
`,
    analog_example: `
// Analog: A simple event recorder for a user interface
interface UIEvent {
  eventId: string;
  timestamp: string;
  userId: string;
  eventType: 'CLICK' | 'HOVER' | 'SUBMIT';
  elementId: string;
  details?: Record<string, any>;
}

const uiEventHistory: UIEvent[] = [];

function recordUIEvent(event: UIEvent): void {
  uiEventHistory.push(event);
  // In a real app, this might send to an analytics service
}
`,
    deepDiveLabel: "Why centralize the logging function?",
    deepDive: {
      hook: `
        Imagine you're building a large application with many different features: user management, product catalog, order processing, and more. Each of these features needs to log various audit events. If every developer implements their own logging logic directly within each feature's code—some using \`console.log\`, others writing to a file, some using different log formats—you'd end up with a chaotic, inconsistent, and unmanageable mess. Debugging would be a nightmare, compliance audits impossible, and any change to the logging infrastructure (like switching from local files to a cloud logging service) would require touching hundreds of files.
      `,
      pain: `
        ⚠️ **Lesson:** Decentralized and inconsistent logging logic leads to maintainability nightmares, makes compliance impossible, and hinders effective debugging and security monitoring.
        **Symptom:** Inconsistent log formats, missing critical information in some logs, difficulty in aggregating and querying audit data, and high effort required to update or change logging infrastructure. It's like having every department in a company keep their own records in their own way, making it impossible for the CEO to get a unified view of operations.
      `,
      mentalModel: `
        **Mental model:** The "Audit Gatekeeper." Think of the \`logAuditEntry\` function as a single, trusted gatekeeper for all audit events in your system. Every piece of information that needs to be part of the official audit trail *must* pass through this gate. This gatekeeper ensures that every entry is properly formatted, contains all required fields, and is stored in the designated, immutable log. It provides a consistent interface and a single point of control for all audit-related operations, regardless of where the event originated in the application.
      `,
      discover: `
        **Pattern - Centralized Audit Logging Function:**
        \`\`\`typescript
        const auditLogStore: AuditEntry[] = []; // Central storage
        
        function logAuditEntry(entry: AuditEntry): void {
          // Add validation, enrichment, or send to external service here
          auditLogStore.push(entry);
          // In a real system, this would write to a database, file, or log service
        }
        \`\`\`
        - \`auditLogStore\`: A module-scoped array (or a more persistent storage in a real application) that holds all \`AuditEntry\` objects.
        - \`logAuditEntry(entry: AuditEntry)\`: A function that strictly accepts an \`AuditEntry\` object, ensuring type safety and adherence to the defined schema.
        - **Single Responsibility:** This function's primary job is to record the audit event, separating logging concerns from business logic.
        - **Extensibility:** Future changes to how logs are stored or processed (e.g., adding encryption, sending to a SIEM system) only need to be implemented here.
      `,
      quickRules: `
        **Quick rules:**
        - ✅ Create a single, dedicated function for all audit logging.
        - ✅ Ensure the logging function accepts a well-defined \`AuditEntry\` type.
        - ✅ Place the logging function in a shared utility or service layer.
        - ✅ Use a persistent storage mechanism (database, file, cloud service) for \`auditLogStore\` in production.
        - ❌ Never embed direct database writes or complex logging logic directly into business functions.
        - ❌ Avoid having multiple, disparate logging functions for audit events.
        - ❌ Do not allow audit entries to be modified after being passed to the logging function.
      `,
      watchOut: `
        👀 **Watch out:** While \`console.log\` is convenient for demonstration, it's not suitable for production audit trails. In a real application, \`auditLogStore\` would interact with a persistent storage solution (e.g., a database table, a dedicated log file, or a cloud logging service like AWS CloudWatch or Splunk). Ensure that the chosen storage mechanism is secure, durable, and supports efficient querying of audit data. Also, consider asynchronous logging to avoid blocking critical application operations.
      `,
      dryRun: `
        🔁 **Think:** An admin changes a setting.
        1. An \`AuditEntry\` object is fully constructed: \`{ id: "...", timestamp: "...", actorId: "user-admin-456", action: "UPDATE", entityType: "ConfigurationSetting", entityId: "cfg-1", beforeState: { value: "true" }, afterState: { value: "false" } }\`.
        2. This \`AuditEntry\` is passed to \`logAuditEntry()\`.
        3. Inside \`logAuditEntry()\`, the \`auditLogStore\` array, which was initially \`[]\`, now becomes \`[{ ...the_audit_entry... }]\`.
        4. If another event occurs, say a \`READ\`, a new \`AuditEntry\` is created and pushed, making \`auditLogStore\` contain two entries.
        (Hint: The \`auditLogStore\` grows with each call, maintaining an immutable history.)
      `,
      build: "**Learning focus:** Implementing a centralized `logAuditEntry` function ensures consistency and manageability for all audit events within the system.",
    },
  },
  {
    id: "step3",
    type: "question",
    phase: "Step 3 of 4",
    paal: "Now, let's integrate our logging function into a real-world scenario where data is modified. When a critical piece of data changes, we need to capture both its state *before* the change and its state *after* the change.",
    hint: "Before modifying the data, capture its current state. After modification, capture the new state. Then, construct and log the `UPDATE` audit entry.",
    example_code: `
function updateConfigurationSetting(
  settingId: string,
  newValue: string,
  actorId: string
): ConfigurationSetting | undefined {
  const settingIndex = mockSettingsDb.findIndex((s) => s.id === settingId);
  if (settingIndex === -1) {
    console.warn(\`Setting with ID \${settingId} not found.\`);
    return undefined;
  }

  const oldSetting = { ...mockSettingsDb[settingIndex] }; // Capture beforeState
  
  // Perform the update
  mockSettingsDb[settingIndex].value = newValue;
  mockSettingsDb[settingIndex].version++;
  const updatedSetting = { ...mockSettingsDb[settingIndex] }; // Capture afterState

  // Log the audit entry
  logAuditEntry({
    id: \`log-\${Date.now()}-\${Math.random().toString(36).substring(2, 9)}\`,
    timestamp: new Date().toISOString(),
    actorId: actorId,
    action: 'UPDATE',
    entityType: 'ConfigurationSetting',
    entityId: settingId,
    beforeState: { value: oldSetting.value, version: oldSetting.version },
    afterState: { value: updatedSetting.value, version: updatedSetting.version },
    details: { changeReason: "Admin panel update" },
  });

  return updatedSetting;
}
`,
    think_prompt: "Given a function that updates a `ConfigurationSetting`, how would you modify it to capture both the `beforeState` and `afterState` and log the `UPDATE` action?",
    mc_options: [
      "logAuditEntry({ actorId, action: 'UPDATE', ... }); updateSetting(newVal);",
      "const before = currentSetting; updateSetting(newVal); const after = currentSetting; logAuditEntry({ actorId, action: 'UPDATE', beforeState: before, afterState: after, ... });",
      "updateSetting(newVal); logAuditEntry({ actorId, action: 'UPDATE', ... });",
    ],
    mc_correct_option: "const before = currentSetting; updateSetting(newVal); const after = currentSetting; logAuditEntry({ actorId, action: 'UPDATE', beforeState: before, afterState: after, ... });",
    mc_anchor: "function updateConfigurationSetting(",
    why_this_matters: "Integrating audit logging directly into data modification functions ensures that every significant change is automatically recorded. This prevents omissions, provides a complete historical record, and ties the audit event directly to the business operation that caused it. It's the practical application of the `AuditEntry` structure and `logAuditEntry` function.",
    answer_keywords: ["integrate", "update", "beforeState", "afterState", "logAuditEntry"],
    seed_code: `
// Define a generic type for configuration settings
interface ConfigurationSetting {
  id: string;
  name: string;
  value: string; // Could be any type, but string simplifies examples
  isSensitive: boolean;
  version: number;
}

// Simulate a database/storage for configuration settings
const mockSettingsDb: ConfigurationSetting[] = [
  { id: "cfg-1", name: "featureA_enabled", value: "true", isSensitive: false, version: 1 },
  { id: "cfg-2", name: "api_key_prod", value: "sk_prod_xyz123", isSensitive: true, version: 1 },
];

// Simulate a current user/actor
const currentActorId = "user-admin-456";

interface AuditEntry {
  id: string;
  timestamp: string;
  actorId: string;
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'READ';
  entityType: string;
  entityId: string;
  beforeState?: Record<string, any>;
  afterState?: Record<string, any>;
  details?: Record<string, any>;
}

const auditLogStore: AuditEntry[] = [];

function logAuditEntry(entry: AuditEntry): void {
  auditLogStore.push(entry);
  console.log("Audit Logged:", entry); // For demonstration
}
`,
    starter_code: `
// Define a generic type for configuration settings
interface ConfigurationSetting {
  id: string;
  name: string;
  value: string; // Could be any type, but string simplifies examples
  isSensitive: boolean;
  version: number;
}

// Simulate a database/storage for configuration settings
const mockSettingsDb: ConfigurationSetting[] = [
  { id: "cfg-1", name: "featureA_enabled", value: "true", isSensitive: false, version: 1 },
  { id: "cfg-2", name: "api_key_prod", value: "sk_prod_xyz123", isSensitive: true, version: 1 },
];

// Simulate a current user/actor
const currentActorId = "user-admin-456";

interface AuditEntry {
  id: string;
  timestamp: string;
  actorId: string;
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'READ';
  entityType: string;
  entityId: string;
  beforeState?: Record<string, any>;
  afterState?: Record<string, any>;
  details?: Record<string, any>;
}

const auditLogStore: AuditEntry[] = [];

function logAuditEntry(entry: AuditEntry): void {
  auditLogStore.push(entry);
  console.log("Audit Logged:", entry); // For demonstration
}

// Add your updateConfigurationSetting function here, integrating audit logging
`,
    feedback_correct: "Spot on! Capturing the state before the change, performing the update, then capturing the state after, and finally logging all this information, creates a robust audit record.",
    feedback_partial: "You're close, but it's critical to capture the `beforeState` *before* the update occurs and the `afterState` *after* it completes. Logging only after the update, or without both states, loses valuable forensic detail.",
    feedback_wrong: "Simply calling `logAuditEntry` without explicitly capturing `beforeState` and `afterState` means your audit record will lack the crucial context of what exactly changed. The order of operations is also important: capture before, then update, then capture after, then log.",
    expected: `
// Define a generic type for configuration settings
interface ConfigurationSetting {
  id: string;
  name: string;
  value: string; // Could be any type, but string simplifies examples
  isSensitive: boolean;
  version: number;
}

// Simulate a database/storage for configuration settings
const mockSettingsDb: ConfigurationSetting[] = [
  { id: "cfg-1", name: "featureA_enabled", value: "true", isSensitive: false, version: 1 },
  { id: "cfg-2", name: "api_key_prod", value: "sk_prod_xyz123", isSensitive: true, version: 1 },
];

// Simulate a current user/actor
const currentActorId = "user-admin-456";

interface AuditEntry {
  id: string;
  timestamp: string;
  actorId: string;
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'READ';
  entityType: string;
  entityId: string;
  beforeState?: Record<string, any>;
  afterState?: Record<string, any>;
  details?: Record<string, any>;
}

const auditLogStore: AuditEntry[] = [];

function logAuditEntry(entry: AuditEntry): void {
  auditLogStore.push(entry);
  console.log("Audit Logged:", entry); // For demonstration
}

function updateConfigurationSetting(
  settingId: string,
  newValue: string,
  actorId: string
): ConfigurationSetting | undefined {
  const settingIndex = mockSettingsDb.findIndex((s) => s.id === settingId);
  if (settingIndex === -1) {
    console.warn(\`Setting with ID \${settingId} not found.\`);
    return undefined;
  }

  const oldSetting = { ...mockSettingsDb[settingIndex] }; // Capture beforeState
  
  // Perform the update
  mockSettingsDb[settingIndex].value = newValue;
  mockSettingsDb[settingIndex].version++;
  const updatedSetting = { ...mockSettingsDb[settingIndex] }; // Capture afterState

  // Log the audit entry
  logAuditEntry({
    id: \`log-\${Date.now()}-\${Math.random().toString(36).substring(2, 9)}\`,
    timestamp: new Date().toISOString(),
    actorId: actorId,
    action: 'UPDATE',
    entityType: 'ConfigurationSetting',
    entityId: settingId,
    beforeState: { value: oldSetting.value, version: oldSetting.version },
    afterState: { value: updatedSetting.value, version: updatedSetting.version },
    details: { changeReason: "Admin panel update" },
  });

  return updatedSetting;
}
`,
    analog_example: `
// Analog: Updating a player's score in a game and logging the change
interface PlayerScore {
  playerId: string;
  score: number;
  lastUpdated: string;
}

const gameScores: PlayerScore[] = [{ playerId: "player-1", score: 100, lastUpdated: new Date().toISOString() }];
const gameAuditLog: string[] = []; // Simplified log for this analog

function updatePlayerScore(playerId: string, newScore: number): void {
  const playerIndex = gameScores.findIndex(p => p.playerId === playerId);
  if (playerIndex === -1) return;

  const oldScore = gameScores[playerIndex].score; // Capture before
  gameScores[playerIndex].score = newScore;
  gameScores[playerIndex].lastUpdated = new Date().toISOString();
  const updatedScore = gameScores[playerIndex].score; // Capture after

  gameAuditLog.push(
    \`[${new Date().toISOString()}] Player \${playerId} score changed from \${oldScore} to \${updatedScore}\`
  );
}

// Example usage:
// updatePlayerScore("player-1", 150);
// console.log(gameAuditLog); // Shows the score change
`,
    deepDiveLabel: "How does this integration ensure data integrity and accountability?",
    deepDive: {
      hook: `
        Consider a scenario where a critical feature flag, 'enable_beta_program', is accidentally toggled off by an administrator. This immediately impacts thousands of users who were participating in the beta. Without a clear, integrated audit trail, you might know *that* the flag is off, but you wouldn't easily know *who* turned it off, *when*, or what its state was *before* the change. This lack of immediate clarity can lead to prolonged outages, finger-pointing, and a breakdown in trust, as there's no undeniable record of the event.
      `,
      pain: `
        ⚠️ **Lesson:** Failing to integrate audit logging directly into data modification operations leads to gaps in the audit trail, making it impossible to establish clear accountability or reconstruct the full sequence of events.
        **Symptom:** Incomplete or missing audit records for critical changes, difficulty in identifying the source of data corruption, inability to prove compliance with regulations requiring full traceability, and prolonged incident response times due to lack of historical context. It's like trying to solve a crime without any eyewitnesses or forensic evidence.
      `,
      mentalModel: `
        **Mental model:** The "Transaction Recorder." Imagine every data modification as a financial transaction. Just as a bank meticulously records every deposit, withdrawal, and transfer, including the account balance before and after, our \`updateConfigurationSetting\` function acts as a transaction recorder. It ensures that the "books" (the audit log) are always balanced and reflect the precise state changes, providing an indisputable record of every "transaction" that alters the system's data. This makes the audit trail a reliable ledger of all changes.
      `,
      discover: `
        **Pattern - Integrated State-Change Logging:**
        \`\`\`typescript
        function updateConfigurationSetting(settingId: string, newValue: string, actorId: string): ConfigurationSetting | undefined {
          const settingIndex = mockSettingsDb.findIndex((s) => s.id === settingId);
          if (settingIndex === -1) return undefined;

          const oldSetting = { ...mockSettingsDb[settingIndex] }; // ① Capture BEFORE state
          
          // ② Perform the actual data modification
          mockSettingsDb[settingIndex].value = newValue;
          mockSettingsDb[settingIndex].version++;
          const updatedSetting = { ...mockSettingsDb[settingIndex] }; // ③ Capture AFTER state

          // ④ Construct and log the AuditEntry
          logAuditEntry({
            id: \`log-\${Date.now()}-\${Math.random().toString(36).substring(2, 9)}\`,
            timestamp: new Date().toISOString(),
            actorId: actorId,
            action: 'UPDATE',
            entityType: 'ConfigurationSetting',
            entityId: settingId,
            beforeState: { value: oldSetting.value, version: oldSetting.version },
            afterState: { value: updatedSetting.value, version: updatedSetting.version },
          });
          return updatedSetting;
        }
        \`\`\`
        - **① Capture \`beforeState\`:** A snapshot of the entity's state is taken *before* any modifications. This is crucial for understanding the starting point.
        - **② Perform Modification:** The core business logic to change the data is executed.
        - **③ Capture \`afterState\`:** A snapshot of the entity's state is taken *after* all modifications are complete. This shows the result.
        - **④ Log Audit Entry:** The \`logAuditEntry\` function is called with a fully constructed \`AuditEntry\`, including the \`beforeState\` and \`afterState\`, ensuring the event is recorded.
      `,
      quickRules: `
        **Quick rules:**
        - ✅ Always capture \`beforeState\` as a deep copy *before* modifying the entity.
        - ✅ Always capture \`afterState\` as a deep copy *after* modifying the entity.
        - ✅ Call the centralized \`logAuditEntry\` function immediately after the data modification.
        - ✅ Ensure the \`actorId\` is correctly passed and recorded for accountability.
        - ❌ Never log only the \`afterState\` for an \`UPDATE\` operation.
        - ❌ Do not perform the logging operation *before* the data modification is complete.
        - ❌ Avoid skipping logging for any critical data modification, even if it seems minor.
      `,
      watchOut: `
        👀 **Watch out:** Ensure that the \`beforeState\` and \`afterState\` are true snapshots (deep copies) of the data at those specific moments. If you pass references to mutable objects, and those objects are changed later in the application's lifecycle, your audit log will be corrupted. Using \`{ ...originalObject }\` for shallow copies or \`JSON.parse(JSON.stringify(originalObject))\` for deep copies is a common practice to ensure immutability of the logged state. Also, be mindful of performance implications for very large objects; sometimes, logging only the *changed* fields is sufficient.
      `,
      dryRun: `
        🔁 **Think:** \`mockSettingsDb\` contains \`cfg-1: { value: "true", version: 1 }\`. \`updateConfigurationSetting("cfg-1", "false", "user-admin-456")\` is called.
        1. \`oldSetting\` is \`{ id: "cfg-1", name: "featureA_enabled", value: "true", isSensitive: false, version: 1 }\`.
        2. \`mockSettingsDb[0].value\` becomes \`"false"\`, \`mockSettingsDb[0].version\` becomes \`2\`.
        3. \`updatedSetting\` is \`{ id: "cfg-1", name: "featureA_enabled", value: "false", isSensitive: false, version: 2 }\`.
        4. \`logAuditEntry\` is called with \`action: 'UPDATE'\`, \`beforeState: { value: "true", version: 1 }\`, \`afterState: { value: "false", version: 2 }\`.
        (Hint: The \`auditLogStore\` will now contain an entry showing the exact value and version change.)
      `,
      build: "**Learning focus:** Integrating audit logging into data modification functions ensures comprehensive and accurate records of all state changes, capturing both `beforeState` and `afterState`.",
    },
  },
  {
    id: "step4",
    type: "question",
    phase: "Step 4 of 4",
    paal: "Beyond state changes, auditing also extends to tracking access to sensitive information, even if no data is modified. This is crucial for security compliance and detecting unauthorized data access.",
    hint: "When sensitive data is accessed, you need to log the `READ` action, who accessed it, when, and what entity was involved, but typically *not* the sensitive value itself in the `afterState`.",
    example_code: `
function getSensitiveConfigurationSetting(
  settingId: string,
  actorId: string
): ConfigurationSetting | undefined {
  const setting = mockSettingsDb.find((s) => s.id === settingId);

  if (!setting || !setting.isSensitive) {
    console.warn(\`Sensitive setting with ID \${settingId} not found or not marked sensitive.\`);
    return undefined;
  }

  // Log the audit entry for sensitive read access
  logAuditEntry({
    id: \`log-\${Date.now()}-\${Math.random().toString(36).substring(2, 9)}\`,
    timestamp: new Date().toISOString(),
    actorId: actorId,
    action: 'READ',
    entityType: 'ConfigurationSetting',
    entityId: settingId,
    // For sensitive reads, we typically don't log the 'value' in afterState
    details: { accessPurpose: "Display to admin" },
  });

  return setting;
}
`,
    think_prompt: "How would you log a `READ` action when a user accesses a sensitive `ConfigurationSetting`, ensuring the log captures who accessed what and when, without including the sensitive value itself in `afterState`?",
    mc_options: [
      "logAuditEntry({ actorId, action: 'READ', entityType: 'ConfigurationSetting', entityId: settingId, timestamp: new Date().toISOString() }); return getSensitiveSetting(settingId);",
      "return getSensitiveSetting(settingId);",
      "logAuditEntry({ actorId, action: 'READ', afterState: sensitiveValue, ... });",
    ],
    mc_correct_option: "logAuditEntry({ actorId, action: 'READ', entityType: 'ConfigurationSetting', entityId: settingId, timestamp: new Date().toISOString() }); return getSensitiveSetting(settingId);",
    mc_anchor: "function getSensitiveConfigurationSetting(",
    why_this_matters: "Logging sensitive data access is a cornerstone of security and compliance. It enables detection of unauthorized access, helps investigate data breaches, and demonstrates adherence to privacy regulations (like GDPR, HIPAA). Even if data isn't changed, knowing who viewed it is critical for maintaining a secure and accountable system.",
    answer_keywords: ["read access", "sensitive data", "log", "security", "compliance"],
    seed_code: `
// Define a generic type for configuration settings
interface ConfigurationSetting {
  id: string;
  name: string;
  value: string; // Could be any type, but string simplifies examples
  isSensitive: boolean;
  version: number;
}

// Simulate a database/storage for configuration settings
const mockSettingsDb: ConfigurationSetting[] = [
  { id: "cfg-1", name: "featureA_enabled", value: "true", isSensitive: false, version: 1 },
  { id: "cfg-2", name: "api_key_prod", value: "sk_prod_xyz123", isSensitive: true, version: 1 },
];

// Simulate a current user/actor
const currentActorId = "user-admin-456";

interface AuditEntry {
  id: string;
  timestamp: string;
  actorId: string;
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'READ';
  entityType: string;
  entityId: string;
  beforeState?: Record<string, any>;
  afterState?: Record<string, any>;
  details?: Record<string, any>;
}

const auditLogStore: AuditEntry[] = [];

function logAuditEntry(entry: AuditEntry): void {
  auditLogStore.push(entry);
  console.log("Audit Logged:", entry); // For demonstration
}

function updateConfigurationSetting(
  settingId: string,
  newValue: string,
  actorId: string
): ConfigurationSetting | undefined {
  const settingIndex = mockSettingsDb.findIndex((s) => s.id === settingId);
  if (settingIndex === -1) {
    console.warn(\`Setting with ID \${settingId} not found.\`);
    return undefined;
  }

  const oldSetting = { ...mockSettingsDb[settingIndex] }; // Capture beforeState
  
  // Perform the update
  mockSettingsDb[settingIndex].value = newValue;
  mockSettingsDb[settingIndex].version++;
  const updatedSetting = { ...mockSettingsDb[settingIndex] }; // Capture afterState

  // Log the audit entry
  logAuditEntry({
    id: \`log-\${Date.now()}-\${Math.random().toString(36).substring(2, 9)}\`,
    timestamp: new Date().toISOString(),
    actorId: actorId,
    action: 'UPDATE',
    entityType: 'ConfigurationSetting',
    entityId: settingId,
    beforeState: { value: oldSetting.value, version: oldSetting.version },
    afterState: { value: updatedSetting.value, version: updatedSetting.version },
    details: { changeReason: "Admin panel update" },
  });

  return updatedSetting;
}
`,
    starter_code: `
// Define a generic type for configuration settings
interface ConfigurationSetting {
  id: string;
  name: string;
  value: string; // Could be any type, but string simplifies examples
  isSensitive: boolean;
  version: number;
}

// Simulate a database/storage for configuration settings
const mockSettingsDb: ConfigurationSetting[] = [
  { id: "cfg-1", name: "featureA_enabled", value: "true", isSensitive: false, version: 1 },
  { id: "cfg-2", name: "api_key_prod", value: "sk_prod_xyz123", isSensitive: true, version: 1 },
];

// Simulate a current user/actor
const currentActorId = "user-admin-456";

interface AuditEntry {
  id: string;
  timestamp: string;
  actorId: string;
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'READ';
  entityType: string;
  entityId: string;
  beforeState?: Record<string, any>;
  afterState?: Record<string, any>;
  details?: Record<string, any>;
}

const auditLogStore: AuditEntry[] = [];

function logAuditEntry(entry: AuditEntry): void {
  auditLogStore.push(entry);
  console.log("Audit Logged:", entry); // For demonstration
}

function updateConfigurationSetting(
  settingId: string,
  newValue: string,
  actorId: string
): ConfigurationSetting | undefined {
  const settingIndex = mockSettingsDb.findIndex((s) => s.id === settingId);
  if (settingIndex === -1) {
    console.warn(\`Setting with ID \${settingId} not found.\`);
    return undefined;
  }

  const oldSetting = { ...mockSettingsDb[settingIndex] }; // Capture beforeState
  
  // Perform the update
  mockSettingsDb[settingIndex].value = newValue;
  mockSettingsDb[settingIndex].version++;
  const updatedSetting = { ...mockSettingsDb[settingIndex] }; // Capture afterState

  // Log the audit entry
  logAuditEntry({
    id: \`log-\${Date.now()}-\${Math.random().toString(36).substring(2, 9)}\`,
    timestamp: new Date().toISOString(),
    actorId: actorId,
    action: 'UPDATE',
    entityType: 'ConfigurationSetting',
    entityId: settingId,
    beforeState: { value: oldSetting.value, version: oldSetting.version },
    afterState: { value: updatedSetting.value, version: updatedSetting.version },
    details: { changeReason: "Admin panel update" },
  });

  return updatedSetting;
}

// Add your getSensitiveConfigurationSetting function here, integrating audit logging for reads
`,
    feedback_correct: "Perfect! Logging the `READ` action with the actor, timestamp, and entity ID, while carefully omitting the sensitive value itself from `afterState`, is the correct approach for sensitive data access auditing.",
    feedback_partial: "You've correctly identified the need to log the `READ` action, but remember that for sensitive data, you should generally avoid including the actual sensitive `value` in the `afterState` of the audit log. The log should confirm *access*, not expose the data again.",
    feedback_wrong: "Simply returning the sensitive setting without logging the access event defeats the purpose of auditing sensitive data reads. It's crucial to record *who* accessed *what* and *when* for security and compliance, even if no data was modified.",
    expected: `
// Define a generic type for configuration settings
interface ConfigurationSetting {
  id: string;
  name: string;
  value: string; // Could be any type, but string simplifies examples
  isSensitive: boolean;
  version: number;
}

// Simulate a database/storage for configuration settings
const mockSettingsDb: ConfigurationSetting[] = [
  { id: "cfg-1", name: "featureA_enabled", value: "true", isSensitive: false, version: 1 },
  { id: "cfg-2", name: "api_key_prod", value: "sk_prod_xyz123", isSensitive: true, version: 1 },
];

// Simulate a current user/actor
const currentActorId = "user-admin-456";

interface AuditEntry {
  id: string;
  timestamp: string;
  actorId: string;
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'READ';
  entityType: string;
  entityId: string;
  beforeState?: Record<string, any>;
  afterState?: Record<string, any>;
  details?: Record<string, any>;
}

const auditLogStore: AuditEntry[] = [];

function logAuditEntry(entry: AuditEntry): void {
  auditLogStore.push(entry);
  console.log("Audit Logged:", entry); // For demonstration
}

function updateConfigurationSetting(
  settingId: string,
  newValue: string,
  actorId: string
): ConfigurationSetting | undefined {
  const settingIndex = mockSettingsDb.findIndex((s) => s.id === settingId);
  if (settingIndex === -1) {
    console.warn(\`Setting with ID \${settingId} not found.\`);
    return undefined;
  }

  const oldSetting = { ...mockSettingsDb[settingIndex] }; // Capture beforeState
  
  // Perform the update
  mockSettingsDb[settingIndex].value = newValue;
  mockSettingsDb[settingIndex].version++;
  const updatedSetting = { ...mockSettingsDb[settingIndex] }; // Capture afterState

  // Log the audit entry
  logAuditEntry({
    id: \`log-\${Date.now()}-\${Math.random().toString(36).substring(2, 9)}\`,
    timestamp: new Date().toISOString(),
    actorId: actorId,
    action: 'UPDATE',
    entityType: 'ConfigurationSetting',
    entityId: settingId,
    beforeState: { value: oldSetting.value, version: oldSetting.version },
    afterState: { value: updatedSetting.value, version: updatedSetting.version },
    details: { changeReason: "Admin panel update" },
  });

  return updatedSetting;
}

function getSensitiveConfigurationSetting(
  settingId: string,
  actorId: string
): ConfigurationSetting | undefined {
  const setting = mockSettingsDb.find((s) => s.id === settingId);

  if (!setting || !setting.isSensitive) {
    console.warn(\`Sensitive setting with ID \${settingId} not found or not marked sensitive.\`);
    return undefined;
  }

  // Log the audit entry for sensitive read access
  logAuditEntry({
    id: \`log-\${Date.now()}-\${Math.random().toString(36).substring(2, 9)}\`,
    timestamp: new Date().toISOString(),
    actorId: actorId,
    action: 'READ',
    entityType: 'ConfigurationSetting',
    entityId: settingId,
    // For sensitive reads, we typically don't log the 'value' in afterState
    details: { accessPurpose: "Display to admin" },
  });

  return setting;
}
`,
    analog_example: `
// Analog: Logging access to a confidential document in a document management system
interface Document {
  docId: string;
  title: string;
  isConfidential: boolean;
  content: string; // The actual sensitive content
}

const mockDocuments: Document[] = [
  { docId: "doc-1", title: "Public Report", isConfidential: false, content: "..." },
  { docId: "doc-2", title: "Confidential HR Data", isConfidential: true, content: "Sensitive Employee Info" },
];

const documentAccessLog: string[] = []; // Simplified log for this analog

function viewDocument(docId: string, viewerId: string): Document | undefined {
  const document = mockDocuments.find(d => d.docId === docId);
  if (!document) return undefined;

  if (document.isConfidential) {
    documentAccessLog.push(
      \`[${new Date().toISOString()}] User \${viewerId} accessed confidential document \${docId} (\${document.title})\`
    );
  }
  return document;
}

// Example usage:
// viewDocument("doc-2", "hr-manager-123");
// console.log(documentAccessLog); // Shows the access event
`,
    deepDiveLabel: "What are the key differences in logging reads vs. writes?",
    deepDive: {
      hook: `
        Imagine a system that stores highly sensitive customer financial data. If an attacker manages to gain access to an administrator's account, they might not *change* any data, but they could *view* every customer's bank details. If your audit system only logs data modifications, this critical breach of privacy would go completely unnoticed. You'd have no record of who viewed what sensitive information, making it impossible to detect the breach, notify affected customers, or comply with data protection regulations. The absence of a log is as dangerous as a missing security camera.
      `,
      pain: `
        ⚠️ **Lesson:** Omitting audit logging for sensitive data read access creates critical security and compliance blind spots, making it impossible to detect data exfiltration or unauthorized viewing.
        **Symptom:** Inability to detect or investigate data breaches involving sensitive information, non-compliance with privacy regulations (e.g., GDPR, HIPAA), and a severe lack of accountability for access to confidential data. It's like having a vault with a log for who *puts things in* and *takes things out*, but no log for who *opens the door and looks inside*.
      `,
      mentalModel: `
        **Mental model:** The "Security Guard's Sign-in Sheet." Think of sensitive data access as entering a restricted area. Even if you don't touch anything inside, you must sign a logbook upon entry and exit. This logbook records *who* entered, *when*, and *which area* they accessed. It doesn't record *what* they saw or read, but simply the fact of their presence. This ensures that every interaction with sensitive resources is accounted for, providing a crucial layer of security monitoring.
      `,
      discover: `
        **Pattern - Sensitive Read Access Logging:**
        \`\`\`typescript
        function getSensitiveConfigurationSetting(settingId: string, actorId: string): ConfigurationSetting | undefined {
          const setting = mockSettingsDb.find((s) => s.id === settingId);
          if (!setting || !setting.isSensitive) return undefined;

          // Log the audit entry for sensitive read access
          logAuditEntry({
            id: \`log-\${Date.now()}-\${Math.random().toString(36).substring(2, 9)}\`,
            timestamp: new Date().toISOString(),
            actorId: actorId,
            action: 'READ', // Key difference: action is 'READ'
            entityType: 'ConfigurationSetting',
            entityId: settingId,
            // Crucially, no beforeState or afterState with the sensitive value
            details: { accessPurpose: "Display to admin" },
          });
          return setting;
        }
        \`\`\`
        - **Action Type:** The \`action\` field is explicitly set to \`'READ'\`, distinguishing it from modification events.
        - **No State Capture:** For sensitive reads, \`beforeState\` and \`afterState\` are typically omitted or contain only metadata, *not* the sensitive data itself. This prevents the audit log from becoming a secondary source of sensitive information.
        - **Contextual Details:** The \`details\` field can be used to add context, such as the purpose of the access or the source IP address, without exposing the data.
        - **Placement:** The logging occurs *before* or *during* the retrieval of the sensitive data, ensuring that access is recorded even if the operation fails later.
      `,
      quickRules: `
        **Quick rules:**
        - ✅ Log \`READ\` actions for all access to sensitive data or critical resources.
        - ✅ Include \`actorId\`, \`timestamp\`, \`entityType\`, and \`entityId\` for read logs.
        - ✅ Avoid including the actual sensitive data in \`beforeState\` or \`afterState\` for read logs.
        - ✅ Log read events as close as possible to the point of data access.
        - ❌ Never assume that only write operations need auditing.
        - ❌ Do not log sensitive data directly into the audit trail for read events.
        - ❌ Avoid making read logging optional for highly sensitive data.
      `,
      watchOut: `
        👀 **Watch out:** The primary goal of sensitive read logging is to record *that* access occurred, *who* did it, and *when*, not to duplicate the sensitive data itself. Logging the actual sensitive value in the audit trail can create a new security vulnerability, as the audit log itself might then become a target for attackers. Always sanitize or redact sensitive values before including them in any log, or better yet, omit them entirely from \`beforeState\`/\`afterState\` for read events, relying on \`entityId\` to identify what was accessed.
      `,
      dryRun: `
        🔁 **Think:** An admin calls \`getSensitiveConfigurationSetting("cfg-2", "user-admin-456")\`.
        1. The function finds \`cfg-2: { id: "cfg-2", name: "api_key_prod", value: "sk_prod_xyz123", isSensitive: true, version: 1 }\`.
        2. An \`AuditEntry\` is constructed with \`actorId: "user-admin-456"\`, \`action: 'READ'\`, \`entityType: 'ConfigurationSetting'\`, \`entityId: "cfg-2"\`.
        3. Crucially, \`beforeState\` and \`afterState\` are omitted or empty, ensuring the sensitive \`value: "sk_prod_xyz123"\` is *not* logged.
        4. \`logAuditEntry\` is called, adding this \`READ\` entry to \`auditLogStore\`.
        5. The actual \`ConfigurationSetting\` object (including its sensitive value) is returned to the caller.
        (Hint: The audit log records the access event without compromising the sensitive data itself.)
      `,
      build: "**Learning focus:** Implementing audit logging for sensitive data reads ensures accountability and security compliance by recording access events without exposing the sensitive data in the log itself.",
    },
  },
];

const sideItems = [
  { label: "Lesson", id: "intro" },
  { label: "Objectives", id: "objectives" },
  { label: "Step 1: Define Entry", id: "step1" },
  { label: "Step 2: Log Function", id: "step2" },
  { label: "Step 3: Log Updates", id: "step3" },
  { label: "Step 4: Log Reads", id: "step4" },
];

export default createINPACTEngine({
  NODES,
  sideItems,
  lessonNum: 0,
  title: "Building Immutable Audit Trails",
  shortName: "Audit Trails",
});
