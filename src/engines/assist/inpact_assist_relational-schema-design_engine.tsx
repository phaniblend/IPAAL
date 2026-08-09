import createINPACTEngine from "../inpact_engine_shared";

export const NODES = [
  {
    id: "intro",
    type: "reveal",
    phase: "Lesson",
    content: {
      tag: "relational-schema-design",
      title: "Designing Normalized Relational Schemas",
      body: `When building any data-driven application, one of the most critical foundational steps is designing how your data will be stored. Without a well-structured plan, data can become redundant, inconsistent, and incredibly difficult to query efficiently. Relational schemas provide a robust framework to organize information, defining clear entities, their attributes, and the precise ways they relate to each other. This structured approach is essential for maintaining data integrity, preventing common anomalies like update or deletion errors, and ensuring that your application can retrieve information quickly and reliably as it scales. It's the blueprint that dictates how your application interacts with its underlying information store.

This fundamental pattern is ubiquitous across software engineering. You'll find it at the heart of managing user profiles and their associated settings in a configuration panel, organizing product catalogs and customer orders in an e-commerce system, or tracking events and attendees in a scheduling tool. Any system that needs to store interconnected pieces of information reliably, enforce business rules, and query them efficiently relies heavily on these principles. Mastering relational schema design equips you with the ability to build scalable, maintainable, and high-performance data backends for virtually any application domain.`,
      usecase: "Managing user accounts, their associated preferences, and a log of actions they've performed within a generic application.",
    },
  },
  {
    id: "objectives",
    type: "objectives",
    phase: "Objectives",
    items: [
      "Model core entities with primary keys.",
      "Establish one-to-many and many-to-many relationships using foreign keys.",
      "Apply constraints to maintain data integrity.",
      "Add indexes to optimize common query patterns.",
      "Understand the principles of normalization for efficient data storage.",
    ],
  },
  {
    id: "step1",
    type: "question",
    phase: "Step 1 of 7",
    paal: "Begin by defining the foundational entity in your system: users. Every user needs a unique identifier and a way to store their name.",
    hint: "Think about how to declare a table, define an integer primary key, and a string column that cannot be empty.",
    example_code: `CREATE TABLE MyTable (
  ID INT PRIMARY KEY,
  Name VARCHAR(255) NOT NULL
);`,
    think_prompt: "How do you create a table for users with a unique ID and a way to store their name?",
    mc_options: [
      "CREATE TABLE Users (UserID INT, UserName VARCHAR(255));",
      "CREATE TABLE Users (UserID INT PRIMARY KEY, UserName VARCHAR(255) NOT NULL);",
      "CREATE TABLE Users (ID INT, Name TEXT);",
    ],
    mc_correct_option: "CREATE TABLE Users (UserID INT PRIMARY KEY, UserName VARCHAR(255) NOT NULL);",
    mc_anchor: "UserID INT PRIMARY KEY",
    why_this_matters: "Defining a primary key is the first step in ensuring data integrity and enabling reliable relationships between tables. It guarantees that each record is uniquely identifiable.",
    answer_keywords: ["CREATE TABLE", "PRIMARY KEY", "NOT NULL", "INT", "VARCHAR"],
    seed_code: ``,
    starter_code: `/*
 * Define the Users table here.
 * It needs a unique ID and a non-empty name.
 */`,
    feedback_correct: "Excellent! You've correctly defined the Users table with a primary key and a non-nullable username, establishing a solid foundation for your data.",
    feedback_partial: "You're close! While you've defined the columns, ensure the UserID is explicitly marked as a PRIMARY KEY and UserName is NOT NULL for robust data integrity.",
    feedback_wrong: "Not quite. Remember that a primary key must be explicitly declared to ensure uniqueness and efficient lookup, and essential fields like UserName should often be marked as NOT NULL.",
    expected: `CREATE TABLE Users (
  UserID INT PRIMARY KEY,
  UserName VARCHAR(255) NOT NULL
);`,
    analog_example: `CREATE TABLE Books (
  BookID INT PRIMARY KEY,
  Title VARCHAR(255) NOT NULL,
  PublicationYear INT
);`,
    deepDiveLabel: "Why is a Primary Key so important?",
    deepDive: {
      hook: `Imagine a library where books are just thrown onto shelves without any system. Finding a specific book would be a nightmare. If you wanted to know how many copies of "Moby Dick" you had, you'd have to manually check every single book. If two books had the same title but were different editions, how would you tell them apart? This chaos is what happens when data lacks a primary key. Without a unique identifier, every piece of information becomes a floating, indistinguishable blob. You can't reliably reference it, update it, or ensure its uniqueness. This leads to duplicate entries, inconsistent information, and an inability to accurately track anything. The system becomes unreliable, and any operation on the data is prone to error and inefficiency, making it impossible to build a functional application on top of such disorganized data.`,
      pain: `⚠️ **Lesson:** Without a primary key, individual records cannot be uniquely identified or referenced. Symptom: Data redundancy, difficulty in updating specific records, inability to establish reliable relationships with other tables, and potential for inconsistent data.`,
      mentalModel: `**Mental model:** The Social Security Number (SSN) for data. Just as an SSN uniquely identifies an individual in a country, a primary key uniquely identifies a row in a table. It's the definitive handle you use to point to that specific piece of information, ensuring no two individuals (rows) are confused, even if they share the same name or other attributes. It's the absolute truth for that record's identity, providing a stable, immutable reference point that the database can use for all operations, from simple lookups to complex joins.`,
      discover: `\`\`\`sql
CREATE TABLE Users (
  UserID INT PRIMARY KEY,
  UserName VARCHAR(255) NOT NULL
);
\`\`\`
- \`CREATE TABLE Users\`: This statement initiates the creation of a new table named \`Users\`.
- \`UserID INT PRIMARY KEY\`: This defines a column named \`UserID\` of integer type. \`PRIMARY KEY\` is a constraint that ensures two things: every value in this column must be unique, and no value can be NULL. It's the designated identifier for each row.
- \`UserName VARCHAR(255) NOT NULL\`: This defines a column named \`UserName\` that can store variable-length strings up to 255 characters. The \`NOT NULL\` constraint ensures that every user record must have a name; this field cannot be left empty.
- Data Types (\`INT\`, \`VARCHAR\`): Choosing appropriate data types is crucial for efficient storage and validation, ensuring that only valid data types are stored in each column.`,
      quickRules: `**Quick rules:**
- ✅ Every table should have a primary key to uniquely identify each record.
- ✅ Primary keys should be unique and non-null by definition.
- ✅ Choose appropriate data types (e.g., \`INT\` for IDs, \`VARCHAR\` for names) for efficient storage and validation.
- ✅ Use \`NOT NULL\` for essential columns that must always contain a value.
- ❌ Do not use non-unique or nullable columns as primary keys.
- ❌ Avoid generic column names like \`id\` without context (e.g., \`UserID\` is more descriptive).
- ❌ Do not store multiple distinct pieces of information in a single column (e.g., \`FullName\` instead of \`FirstName\`, \`LastName\` if you need to query by parts).
- ❌ Never omit a primary key, even for small tables, as it's fundamental for relationships and integrity.`,
      watchOut: `Be careful when choosing a primary key. While a natural key like \`UserName\` might seem unique initially, it's often safer to use a surrogate key, such as an auto-incrementing integer (\`INT\`), as the primary key. Natural keys can sometimes change or, in rare cases, become non-unique (e.g., two users with the exact same name), which can break referential integrity. A surrogate key provides a stable, immutable identifier that is independent of the actual data.`,
      dryRun: `🔁 **Think:** A new user, 'Alice', signs up. The system assigns \`UserID = 1\` and stores \`UserName = 'Alice'\`. Later, 'Bob' signs up, receiving \`UserID = 2\` and \`UserName = 'Bob'\`. If another 'Alice' attempts to sign up, the system would assign \`UserID = 3\`, distinguishing her from the first 'Alice' even with the same name. If an attempt is made to insert a user record without providing a \`UserName\`, the \`NOT NULL\` constraint on \`UserName\` would prevent the insertion, ensuring data completeness. (Hint: Focus on how \`PRIMARY KEY\` ensures uniqueness and \`NOT NULL\` enforces presence).`,
      build: `**Learning focus:** Define a core entity table with a primary key and essential attributes.`,
    },
  },
  {
    id: "step2",
    type: "question",
    phase: "Step 2 of 7",
    paal: "Now, define another core entity that users might interact with: items. Each item also needs a unique identifier and a way to store its name and a potentially long description.",
    hint: "Remember to use an appropriate data type for potentially long text content.",
    example_code: `CREATE TABLE Products (
  ProductID INT PRIMARY KEY,
  ProductName VARCHAR(255) NOT NULL,
  Details TEXT
);`,
    think_prompt: "How do you create a table for items, similar to users, with a unique ID, a name, and a detailed description?",
    mc_options: [
      "CREATE TABLE Items (ItemID INT PRIMARY KEY, ItemName VARCHAR(50));",
      "CREATE TABLE Items (ItemID INT PRIMARY KEY, ItemName VARCHAR(255) NOT NULL, Description TEXT);",
      "CREATE TABLE Items (ItemID INT, ItemName TEXT, Description VARCHAR(255));",
    ],
    mc_correct_option: "CREATE TABLE Items (ItemID INT PRIMARY KEY, ItemName VARCHAR(255) NOT NULL, Description TEXT);",
    mc_anchor: "Description TEXT",
    why_this_matters: "Choosing the correct data type for textual content, especially long descriptions, is vital for efficient storage and retrieval without truncation, ensuring all necessary information can be stored.",
    answer_keywords: ["CREATE TABLE", "PRIMARY KEY", "NOT NULL", "TEXT"],
    seed_code: `CREATE TABLE Users (
  UserID INT PRIMARY KEY,
  UserName VARCHAR(255) NOT NULL
);`,
    starter_code: `CREATE TABLE Users (
  UserID INT PRIMARY KEY,
  UserName VARCHAR(255) NOT NULL
);

/*
 * Define the Items table here.
 * It needs a unique ID, a non-empty name, and a detailed description.
 */`,
    feedback_correct: "Spot on! You've correctly created the Items table, using TEXT for the description to accommodate potentially long content, which is crucial for rich data.",
    feedback_partial: "You're close, but consider the best data type for a 'detailed description'. VARCHAR might be too restrictive for very long text.",
    feedback_wrong: "Not quite. While you've defined an ID and name, the choice of data type for a detailed description is important. VARCHAR has a length limit, which might not be suitable for extensive text.",
    expected: `CREATE TABLE Users (
  UserID INT PRIMARY KEY,
  UserName VARCHAR(255) NOT NULL
);

CREATE TABLE Items (
  ItemID INT PRIMARY KEY,
  ItemName VARCHAR(255) NOT NULL,
  Description TEXT
);`,
    analog_example: `CREATE TABLE Authors (
  AuthorID INT PRIMARY KEY,
  AuthorName VARCHAR(255) NOT NULL,
  Biography TEXT
);`,
    deepDiveLabel: "When should I use TEXT vs VARCHAR?",
    deepDive: {
      hook: `Imagine a digital storefront where you sell various products. If you only had a list of product names, how would you store detailed information about each product, like its specifications, features, usage instructions, or customer reviews? Without a dedicated field for a longer description, you'd be forced to either truncate important information, store it in an external, disconnected system, or cram it into a field not designed for it, making it unreadable and unsearchable. This leads to a poor user experience, incomplete product data, and difficulty in providing comprehensive information to customers or internal teams. The system becomes less informative and less useful, failing to deliver the rich content that modern applications demand.`,
      pain: `⚠️ **Lesson:** Not all textual data is short. Symptom: Truncated information, inability to store rich textual content, or misuse of \`VARCHAR\` for very long strings, leading to potential performance issues or data loss.`,
      mentalModel: `**Mental model:** The "notebook" field. While \`VARCHAR\` is like a short label on a file folder, \`TEXT\` is like the actual notebook inside, where you can write pages and pages of detailed notes without worrying about running out of space. It's designed for extensive, free-form textual content, allowing for comprehensive descriptions, comments, or articles, without the strict character limits of \`VARCHAR\`, making it ideal for content-heavy fields.`,
      discover: `\`\`\`sql
CREATE TABLE Items (
  ItemID INT PRIMARY KEY,
  ItemName VARCHAR(255) NOT NULL,
  Description TEXT
);
\`\`\`
- \`ItemID INT PRIMARY KEY\`: This is the unique identifier for each item, ensuring that every item record is distinct and can be referenced reliably.
- \`ItemName VARCHAR(255) NOT NULL\`: This column stores the short, essential name of the item. \`VARCHAR(255)\` is suitable for names and titles, and \`NOT NULL\` ensures every item has a name.
- \`Description TEXT\`: This column is specifically for storing long, detailed textual content for the item's description. The \`TEXT\` data type is optimized for large strings, typically without a fixed maximum length (though databases have internal limits), making it ideal for rich content.
- \`TEXT\` vs \`VARCHAR\`: \`VARCHAR\` is for shorter, bounded strings (e.g., names, codes), while \`TEXT\` is for potentially very long, unbounded strings (e.g., articles, comments, detailed descriptions).`,
      quickRules: `**Quick rules:**
- ✅ Use \`TEXT\` for potentially long, multi-paragraph descriptions, notes, or articles.
- ✅ Use \`VARCHAR\` for shorter, fixed-length-ish strings like names, titles, codes, or URLs.
- ✅ Always consider the maximum expected length of your data when choosing string types.
- ✅ Ensure essential text fields are \`NOT NULL\` if a description or name is always required.
- ❌ Do not use \`VARCHAR\` for very long descriptions (e.g., blog posts, product specifications that exceed a few hundred characters).
- ❌ Do not use \`TEXT\` for short, fixed-length data (e.g., a two-character country code or a short status).
- ❌ Avoid storing binary data directly in \`TEXT\` fields; use appropriate binary types (like \`BLOB\`) or file storage for such content.
- ❌ Do not assume \`TEXT\` has infinite length; all databases have internal limits, though they are usually very large.`,
      watchOut: `While \`TEXT\` can store a lot of data, querying very large \`TEXT\` fields can be slower than querying shorter \`VARCHAR\` fields, especially if you're performing full-text searches. If you need to search within the \`TEXT\` field frequently, consider exploring full-text indexing options specific to your database (e.g., MySQL's \`FULLTEXT\` index, PostgreSQL's \`tsvector\`). Also, be mindful of the storage implications, as \`TEXT\` fields can consume significant disk space.`,
      dryRun: `🔁 **Think:** An item 'Laptop' is added with \`ItemID = 1\`, \`ItemName = 'Laptop'\`, and a \`Description\` of "High-performance computing device with 16GB RAM, 512GB SSD, and a 14-inch display, ideal for professional use and gaming." Later, 'Mouse' is added with \`ItemID = 2\`, \`ItemName = 'Mouse'\`, and a shorter \`Description\` "Ergonomic input device with optical sensor." The \`TEXT\` field successfully accommodates both the extensive laptop description and the concise mouse description without any issues or truncation, demonstrating its flexibility for varying content lengths. (Hint: Observe how \`TEXT\` handles varying lengths of descriptive content without a fixed character limit).`,
      build: `**Learning focus:** Define another core entity and use an appropriate data type for potentially long text.`,
    },
  },
  {
    id: "step3",
    type: "question",
    phase: "Step 3 of 7",
    paal: "Users often make requests for items. This implies a relationship between `Users` and `Items`. Create a table to track these requests, linking them to both a user and an item, and include a timestamp for when the request was made.",
    hint: "You'll need foreign keys to link to the `Users` and `Items` tables, and a `DATETIME` type for the timestamp.",
    example_code: `CREATE TABLE Orders (
  OrderID INT PRIMARY KEY,
  CustomerID INT NOT NULL,
  ProductID INT NOT NULL,
  OrderDate DATETIME NOT NULL,
  FOREIGN KEY (CustomerID) REFERENCES Customers(CustomerID),
  FOREIGN KEY (ProductID) REFERENCES Products(ProductID)
);`,
    think_prompt: "How do you create a table for requests that includes a unique ID, a timestamp, and links to both the `Users` and `Items` tables?",
    mc_options: [
      "CREATE TABLE Requests (RequestID INT PRIMARY KEY, UserID INT, ItemID INT, RequestDate DATE);",
      "CREATE TABLE Requests (RequestID INT PRIMARY KEY, UserID INT NOT NULL, ItemID INT NOT NULL, RequestDate DATETIME NOT NULL, FOREIGN KEY (UserID) REFERENCES Users(UserID), FOREIGN KEY (ItemID) REFERENCES Items(ItemID));",
      "CREATE TABLE Requests (RequestID INT PRIMARY KEY, UserID INT, ItemID INT, RequestDate DATETIME);",
    ],
    mc_correct_option: "CREATE TABLE Requests (RequestID INT PRIMARY KEY, UserID INT NOT NULL, ItemID INT NOT NULL, RequestDate DATETIME NOT NULL, FOREIGN KEY (UserID) REFERENCES Users(UserID), FOREIGN KEY (ItemID) REFERENCES Items(ItemID));",
    mc_anchor: "FOREIGN KEY (UserID) REFERENCES Users(UserID)",
    why_this_matters: "Foreign keys are essential for establishing and enforcing relationships between tables, ensuring referential integrity and preventing orphaned records.",
    answer_keywords: ["CREATE TABLE", "FOREIGN KEY", "REFERENCES", "DATETIME", "NOT NULL"],
    seed_code: `CREATE TABLE Users (
  UserID INT PRIMARY KEY,
  UserName VARCHAR(255) NOT NULL
);

CREATE TABLE Items (
  ItemID INT PRIMARY KEY,
  ItemName VARCHAR(255) NOT NULL,
  Description TEXT
);`,
    starter_code: `CREATE TABLE Users (
  UserID INT PRIMARY KEY,
  UserName VARCHAR(255) NOT NULL
);

CREATE TABLE Items (
  ItemID INT PRIMARY KEY,
  ItemName VARCHAR(255) NOT NULL,
  Description TEXT
);

/*
 * Define the Requests table here.
 * It needs a unique ID, links to Users and Items, and a request timestamp.
 */`,
    feedback_correct: "Perfect! You've correctly created the Requests table, linking it to Users and Items with foreign keys and including a non-nullable datetime for the request timestamp.",
    feedback_partial: "You're on the right track with the columns, but remember to explicitly define the FOREIGN KEY constraints to enforce the relationships between tables.",
    feedback_wrong: "Not quite. While you've identified the necessary columns, you're missing the crucial FOREIGN KEY declarations that tell the database how Requests relates to Users and Items, which is vital for data integrity.",
    expected: `CREATE TABLE Users (
  UserID INT PRIMARY KEY,
  UserName VARCHAR(255) NOT NULL
);

CREATE TABLE Items (
  ItemID INT PRIMARY KEY,
  ItemName VARCHAR(255) NOT NULL,
  Description TEXT
);

CREATE TABLE Requests (
  RequestID INT PRIMARY KEY,
  UserID INT NOT NULL,
  ItemID INT NOT NULL,
  RequestDate DATETIME NOT NULL,
  FOREIGN KEY (UserID) REFERENCES Users(UserID),
  FOREIGN KEY (ItemID) REFERENCES Items(ItemID)
);`,
    analog_example: `CREATE TABLE Orders (
  OrderID INT PRIMARY KEY,
  CustomerID INT NOT NULL,
  BookID INT NOT NULL,
  OrderDate DATETIME NOT NULL,
  FOREIGN KEY (CustomerID) REFERENCES Customers(CustomerID),
  FOREIGN KEY (BookID) REFERENCES Books(BookID)
);`,
    deepDiveLabel: "How do Foreign Keys enforce relationships?",
    deepDive: {
      hook: `Imagine a school where students borrow books, but there's no system to record *which* student borrowed *which* book. You'd have a list of students and a list of books, but no way to connect them. If a book went missing, you wouldn't know who had it last. If a student claimed they returned a book, you couldn't verify it. Even worse, what if a student record was accidentally deleted, but they still had books checked out? The books would then be "orphaned," linked to a non-existent student. This lack of connection between entities makes it impossible to track interactions, enforce rules, or maintain accountability. Data becomes isolated and meaningless in context, leading to chaos and unreliable information.`,
      pain: `⚠️ **Lesson:** Without foreign keys, relationships between tables are purely conceptual, not enforced by the database. Symptom: Orphaned records (e.g., a request for a non-existent user), inconsistent data, difficulty in querying related information, and manual data validation required in application code.`,
      mentalModel: `**Mental model:** The "address book" for data. A foreign key is like writing down someone's unique address (their primary key from another table) in your address book. You don't copy their entire life story; you just store their unique address. This allows you to quickly find all their details in their own dedicated entry whenever you need them, without duplicating information. It's a direct, enforced link, ensuring that every address you write down actually corresponds to a real person in your main contact list.`,
      discover: `\`\`\`sql
CREATE TABLE Requests (
  RequestID INT PRIMARY KEY,
  UserID INT NOT NULL,
  ItemID INT NOT NULL,
  RequestDate DATETIME NOT NULL,
  FOREIGN KEY (UserID) REFERENCES Users(UserID),
  FOREIGN KEY (ItemID) REFERENCES Items(ItemID)
);
\`\`\`
- \`RequestID INT PRIMARY KEY\`: This is the unique identifier for each individual request.
- \`UserID INT NOT NULL\`, \`ItemID INT NOT NULL\`: These columns are designed to hold the primary key values from the \`Users\` and \`Items\` tables, respectively. They are marked \`NOT NULL\` because a request must always be associated with a user and an item.
- \`RequestDate DATETIME NOT NULL\`: This column stores the exact date and time when the request was made, ensuring a timestamp is always present.
- \`FOREIGN KEY (UserID) REFERENCES Users(UserID)\`: This statement establishes a foreign key constraint. It declares that the \`UserID\` column in the \`Requests\` table must contain values that already exist in the \`UserID\` (primary key) column of the \`Users\` table. This prevents creating requests for non-existent users.
- \`FOREIGN KEY (ItemID) REFERENCES Items(ItemID)\`: Similarly, this establishes a foreign key constraint ensuring that the \`ItemID\` in \`Requests\` must correspond to an existing \`ItemID\` in the \`Items\` table.`,
      quickRules: `**Quick rules:**
- ✅ Use foreign keys to establish and enforce relationships between tables.
- ✅ The data type of the foreign key column must exactly match the primary key it references.
- ✅ Foreign keys should always reference primary keys (or columns with a \`UNIQUE\` constraint) in other tables.
- ✅ Consider \`ON DELETE\` and \`ON UPDATE\` actions for foreign keys (e.g., \`CASCADE\`, \`SET NULL\`, \`RESTRICT\`) to define behavior when parent records are modified or deleted.
- ❌ Do not create foreign keys to non-primary key columns unless those columns have a \`UNIQUE\` constraint.
- ❌ Avoid creating foreign keys that reference columns with different data types, as this will result in errors.
- ❌ Do not omit foreign key constraints when a relationship logically exists, relying solely on application logic for data integrity.
- ❌ Never insert a record into a child table if its foreign key value does not exist in the parent table.`,
      watchOut: `When deleting a record from a parent table (e.g., a \`User\`), what should happen to related records in child tables (e.g., \`Requests\`)? By default, many databases will prevent the deletion if child records exist (\`RESTRICT\` behavior). You might need to explicitly specify \`ON DELETE CASCADE\` to automatically delete child records, or \`ON DELETE SET NULL\` to nullify the foreign key in child records. Choose the behavior carefully based on your application's business rules, as an incorrect choice can lead to unintended data loss or integrity issues.`,
      dryRun: `🔁 **Think:** User \`UserID = 1\` (Alice) requests \`ItemID = 101\` (Laptop) on '2023-10-26 10:00:00'. A record \`(1, 1, 101, '2023-10-26 10:00:00')\` is successfully inserted into \`Requests\`. If a subsequent request attempts to link to \`UserID = 999\` (which does not exist in the \`Users\` table), the foreign key constraint on \`UserID\` in \`Requests\` will immediately reject the insertion, preventing an orphaned request. If \`UserID = 1\` is later deleted from \`Users\` (assuming \`ON DELETE RESTRICT\` is active), the database would prevent this deletion because \`RequestID = 1\` still references it, ensuring referential integrity. (Hint: Trace how the foreign key ensures that only valid \`UserID\` and \`ItemID\` values can be used in the \`Requests\` table).`,
      build: `**Learning focus:** Create a relationship table using foreign keys to link two existing entities.`,
    },
  },
  {
    id: "step4",
    type: "question",
    phase: "Step 4 of 7",
    paal: "Requests often require approval. Create a table to track these approvals, linking each approval to a specific request and the user who performed the approval. Include an approval status and the approval date.",
    hint: "This table will need two foreign keys, one referencing `Requests` and another referencing `Users` (for the approver).",
    example_code: `CREATE TABLE Payments (
  PaymentID INT PRIMARY KEY,
  OrderID INT NOT NULL,
  ProcessorID INT NOT NULL,
  Amount DECIMAL(10, 2) NOT NULL,
  PaymentDate DATETIME NOT NULL,
  FOREIGN KEY (OrderID) REFERENCES Orders(OrderID),
  FOREIGN KEY (ProcessorID) REFERENCES PaymentProcessors(ProcessorID)
);`,
    think_prompt: "How do you create a table for approvals that links to a `Request` and the `User` who performed the approval, including an approval status?",
    mc_options: [
      "CREATE TABLE Approvals (ApprovalID INT PRIMARY KEY, RequestID INT, Status VARCHAR(50));",
      "CREATE TABLE Approvals (ApprovalID INT PRIMARY KEY, RequestID INT NOT NULL, ApproverUserID INT NOT NULL, ApprovalStatus VARCHAR(50) NOT NULL, ApprovalDate DATETIME NOT NULL, FOREIGN KEY (RequestID) REFERENCES Requests(RequestID), FOREIGN KEY (ApproverUserID) REFERENCES Users(UserID));",
      "CREATE TABLE Approvals (ApprovalID INT PRIMARY KEY, RequestID INT, UserID INT, Status TEXT);",
    ],
    mc_correct_option: "CREATE TABLE Approvals (ApprovalID INT PRIMARY KEY, RequestID INT NOT NULL, ApproverUserID INT NOT NULL, ApprovalStatus VARCHAR(50) NOT NULL, ApprovalDate DATETIME NOT NULL, FOREIGN KEY (RequestID) REFERENCES Requests(RequestID), FOREIGN KEY (ApproverUserID) REFERENCES Users(UserID));",
    mc_anchor: "FOREIGN KEY (ApproverUserID) REFERENCES Users(UserID)",
    why_this_matters: "Tables often need to relate to multiple other entities to capture complete context. Using multiple foreign keys correctly ensures all necessary relationships are maintained.",
    answer_keywords: ["CREATE TABLE", "FOREIGN KEY", "REFERENCES", "multiple foreign keys"],
    seed_code: `CREATE TABLE Users (
  UserID INT PRIMARY KEY,
  UserName VARCHAR(255) NOT NULL
);

CREATE TABLE Items (
  ItemID INT PRIMARY KEY,
  ItemName VARCHAR(255) NOT NULL,
  Description TEXT
);

CREATE TABLE Requests (
  RequestID INT PRIMARY KEY,
  UserID INT NOT NULL,
  ItemID INT NOT NULL,
  RequestDate DATETIME NOT NULL,
  FOREIGN KEY (UserID) REFERENCES Users(UserID),
  FOREIGN KEY (ItemID) REFERENCES Items(ItemID)
);`,
    starter_code: `CREATE TABLE Users (
  UserID INT PRIMARY KEY,
  UserName VARCHAR(255) NOT NULL
);

CREATE TABLE Items (
  ItemID INT PRIMARY KEY,
  ItemName VARCHAR(255) NOT NULL,
  Description TEXT
);

CREATE TABLE Requests (
  RequestID INT PRIMARY KEY,
  UserID INT NOT NULL,
  ItemID INT NOT NULL,
  RequestDate DATETIME NOT NULL,
  FOREIGN KEY (UserID) REFERENCES Users(UserID),
  FOREIGN KEY (ItemID) REFERENCES Items(ItemID)
);

/*
 * Define the Approvals table here.
 * It needs a unique ID, links to a Request, links to the approving User,
 * an approval status, and an approval timestamp.
 */`,
    feedback_correct: "Excellent! You've successfully created the Approvals table, correctly linking it to both Requests and Users with distinct foreign keys, and including all necessary status and date fields.",
    feedback_partial: "You've got the columns mostly right, but ensure both foreign key constraints are explicitly defined to link to both the Requests table and the Users table (for the approver).",
    feedback_wrong: "Not quite. This table needs to link to two different entities: the specific Request being approved, and the User who performed the approval. You need two distinct foreign key columns and their corresponding constraints.",
    expected: `CREATE TABLE Users (
  UserID INT PRIMARY KEY,
  UserName VARCHAR(255) NOT NULL
);

CREATE TABLE Items (
  ItemID INT PRIMARY KEY,
  ItemName VARCHAR(255) NOT NULL,
  Description TEXT
);

CREATE TABLE Requests (
  RequestID INT PRIMARY KEY,
  UserID INT NOT NULL,
  ItemID INT NOT NULL,
  RequestDate DATETIME NOT NULL,
  FOREIGN KEY (UserID) REFERENCES Users(UserID),
  FOREIGN KEY (ItemID) REFERENCES Items(ItemID)
);

CREATE TABLE Approvals (
  ApprovalID INT PRIMARY KEY,
  RequestID INT NOT NULL,
  ApproverUserID INT NOT NULL,
  ApprovalStatus VARCHAR(50) NOT NULL,
  ApprovalDate DATETIME NOT NULL,
  FOREIGN KEY (RequestID) REFERENCES Requests(RequestID),
  FOREIGN KEY (ApproverUserID) REFERENCES Users(UserID)
);`,
    analog_example: `CREATE TABLE Shipments (
  ShipmentID INT PRIMARY KEY,
  OrderID INT NOT NULL,
  CarrierID INT NOT NULL,
  ShipmentDate DATETIME NOT NULL,
  DeliveryStatus VARCHAR(50) NOT NULL,
  FOREIGN KEY (OrderID) REFERENCES Orders(OrderID),
  FOREIGN KEY (CarrierID) REFERENCES Carriers(CarrierID)
);`,
    deepDiveLabel: "Can a table have multiple Foreign Keys?",
    deepDive: {
      hook: `Imagine a workflow where a task needs to be reviewed, but the review records only state "approved" or "rejected" without indicating *which* task was reviewed or *who* performed the review. You'd have a list of approvals floating in space, unable to connect them to the original tasks or the individuals responsible for the decision. This makes auditing impossible, accountability non-existent, and understanding the history of any task a guessing game. The system loses its ability to track progress and assign responsibility, becoming a black box where actions are recorded but their context is lost, leading to frustration and potential compliance issues.`,
      pain: `⚠️ **Lesson:** Complex entities often depend on multiple other entities. Symptom: Incomplete tracking, inability to fully reconstruct a process, and difficulty in querying the full context of an event.`,
      mentalModel: `**Mental model:** The "meeting minutes" document. A single set of meeting minutes (an \`Approval\` record) might reference the specific project it pertains to (a \`Request\`) and also list the attendees who were present and made decisions (the \`ApproverUserID\` from \`Users\`). It brings together multiple pieces of context into one coherent record, ensuring that all relevant information for a specific event is linked and easily retrievable, just like a well-structured meeting summary.`,
      discover: `\`\`\`sql
CREATE TABLE Approvals (
  ApprovalID INT PRIMARY KEY,
  RequestID INT NOT NULL,
  ApproverUserID INT NOT NULL,
  ApprovalStatus VARCHAR(50) NOT NULL,
  ApprovalDate DATETIME NOT NULL,
  FOREIGN KEY (RequestID) REFERENCES Requests(RequestID),
  FOREIGN KEY (ApproverUserID) REFERENCES Users(UserID)
);
\`\`\`
- \`ApprovalID INT PRIMARY KEY\`: This is the unique identifier for each individual approval record.
- \`RequestID INT NOT NULL\`: This column acts as a foreign key, linking each approval to a specific record in the \`Requests\` table. It's \`NOT NULL\` because every approval must pertain to an existing request.
- \`ApproverUserID INT NOT NULL\`: This column also acts as a foreign key, but it links to the \`Users\` table, specifically identifying the user who performed the approval. It's crucial to distinguish this from the \`UserID\` in the \`Requests\` table, which refers to the user who *made* the request.
- \`ApprovalStatus VARCHAR(50) NOT NULL\`: This column stores the status of the approval (e.g., 'Approved', 'Rejected', 'Pending').
- \`ApprovalDate DATETIME NOT NULL\`: This column records the date and time when the approval action took place.
- \`FOREIGN KEY (RequestID) REFERENCES Requests(RequestID)\`: This constraint ensures that every \`RequestID\` in \`Approvals\` corresponds to an existing \`RequestID\` in the \`Requests\` table.
- \`FOREIGN KEY (ApproverUserID) REFERENCES Users(UserID)\`: This constraint ensures that every \`ApproverUserID\` in \`Approvals\` corresponds to an existing \`UserID\` in the \`Users\` table.`,
      quickRules: `**Quick rules:**
- ✅ A table can, and often should, have multiple foreign keys to represent its relationships with different parent entities.
- ✅ Each foreign key should clearly define its purpose and what specific parent table and column it references.
- ✅ Ensure that the referenced primary key exists in the parent table before inserting a record with a foreign key value.
- ✅ Use descriptive names for foreign key columns (e.g., \`ApproverUserID\` instead of just \`UserID\`) to avoid ambiguity when multiple keys reference the same table.
- ❌ Do not create redundant foreign keys if a path already exists through another table (e.g., don't link \`Approvals\` directly to \`Items\` if it already links to \`Requests\` which links to \`Items\`).
- ❌ Avoid ambiguity in foreign key names if multiple keys reference the same table without clear distinction.
- ❌ Do not forget to add \`NOT NULL\` to foreign key columns if they are always required for a valid record.
- ❌ Never assume that a single foreign key can capture all necessary relationships for a complex entity.`,
      watchOut: `When a table has multiple foreign keys, consider the order of data insertion. You must ensure that the records in all parent tables (e.g., \`Users\` and \`Requests\`) exist *before* you can successfully insert a record into the child table (\`Approvals\`). This is a common source of "foreign key constraint failed" errors. Always insert parent data first, then child data.`,
      dryRun: `🔁 **Think:** \`RequestID = 1\` (Alice's Laptop request) is approved by \`UserID = 2\` (Bob) on '2023-10-26 11:00:00' with \`ApprovalStatus = 'Approved'\`. An \`ApprovalID = 1\` record is inserted into \`Approvals\`. If \`RequestID = 1\` did not exist in \`Requests\`, or \`UserID = 2\` did not exist in \`Users\`, the insertion would fail due to the respective foreign key constraints. If \`UserID = 2\` (Bob) is later deleted from \`Users\`, the \`Approvals\` table would prevent this deletion if \`ON DELETE RESTRICT\` is active, because \`ApprovalID = 1\` still references Bob as the approver. (Hint: Trace how two foreign keys work together to establish a complete context for an approval).`,
      build: `**Learning focus:** Create a table that depends on multiple other entities using multiple foreign keys.`,
    },
  },
  {
    id: "step5",
    type: "question",
    phase: "Step 5 of 7",
    paal: "To categorize users or items, you might need a set of predefined qualifications or categories. Create a simple lookup table for these, ensuring that each qualification name is unique.",
    hint: "Think about how to enforce uniqueness on a non-primary key column.",
    example_code: `CREATE TABLE Categories (
  CategoryID INT PRIMARY KEY,
  CategoryName VARCHAR(100) NOT NULL UNIQUE
);`,
    think_prompt: "How do you create a table for `Qualifications` with a unique ID and a descriptive name that must also be unique?",
    mc_options: [
      "CREATE TABLE Qualifications (QualificationID INT PRIMARY KEY, QualificationName VARCHAR(100));",
      "CREATE TABLE Qualifications (QualificationID INT, QualificationName VARCHAR(100) UNIQUE);",
      "CREATE TABLE Qualifications (QualificationID INT PRIMARY KEY, QualificationName VARCHAR(100) NOT NULL UNIQUE);",
    ],
    mc_correct_option: "CREATE TABLE Qualifications (QualificationID INT PRIMARY KEY, QualificationName VARCHAR(100) NOT NULL UNIQUE);",
    mc_anchor: "QualificationName VARCHAR(100) NOT NULL UNIQUE",
    why_this_matters: "Enforcing uniqueness on descriptive fields in lookup tables prevents data inconsistencies and ensures that categories or qualifications are well-defined and distinct.",
    answer_keywords: ["CREATE TABLE", "PRIMARY KEY", "NOT NULL", "UNIQUE"],
    seed_code: `CREATE TABLE Users (
  UserID INT PRIMARY KEY,
  UserName VARCHAR(255) NOT NULL
);

CREATE TABLE Items (
  ItemID INT PRIMARY KEY,
  ItemName VARCHAR(255) NOT NULL,
  Description TEXT
);

CREATE TABLE Requests (
  RequestID INT PRIMARY KEY,
  UserID INT NOT NULL,
  ItemID INT NOT NULL,
  RequestDate DATETIME NOT NULL,
  FOREIGN KEY (UserID) REFERENCES Users(UserID),
  FOREIGN KEY (ItemID) REFERENCES Items(ItemID)
);

CREATE TABLE Approvals (
  ApprovalID INT PRIMARY KEY,
  RequestID INT NOT NULL,
  ApproverUserID INT NOT NULL,
  ApprovalStatus VARCHAR(50) NOT NULL,
  ApprovalDate DATETIME NOT NULL,
  FOREIGN KEY (RequestID) REFERENCES Requests(RequestID),
  FOREIGN KEY (ApproverUserID) REFERENCES Users(UserID)
);`,
    starter_code: `CREATE TABLE Users (
  UserID INT PRIMARY KEY,
  UserName VARCHAR(255) NOT NULL
);

CREATE TABLE Items (
  ItemID INT PRIMARY KEY,
  ItemName VARCHAR(255) NOT NULL,
  Description TEXT
);

CREATE TABLE Requests (
  RequestID INT PRIMARY KEY,
  UserID INT NOT NULL,
  ItemID INT NOT NULL,
  RequestDate DATETIME NOT NULL,
  FOREIGN KEY (UserID) REFERENCES Users(UserID),
  FOREIGN KEY (ItemID) REFERENCES Items(ItemID)
);

CREATE TABLE Approvals (
  ApprovalID INT PRIMARY KEY,
  RequestID INT NOT NULL,
  ApproverUserID INT NOT NULL,
  ApprovalStatus VARCHAR(50) NOT NULL,
  ApprovalDate DATETIME NOT NULL,
  FOREIGN KEY (RequestID) REFERENCES Requests(RequestID),
  FOREIGN KEY (ApproverUserID) REFERENCES Users(UserID)
);

/*
 * Define the Qualifications lookup table here.
 * It needs a unique ID and a unique, non-empty name for each qualification.
 */`,
    feedback_correct: "Excellent! You've correctly created the Qualifications table, ensuring both a unique ID and a unique, non-empty name for each qualification, which is ideal for lookup data.",
    feedback_partial: "You're close! While you've defined the columns, remember to explicitly enforce that the QualificationName must be UNIQUE to prevent duplicate category entries.",
    feedback_wrong: "Not quite. For a lookup table, it's crucial that the descriptive name itself is unique, not just the ID. You need to add a UNIQUE constraint to the QualificationName column.",
    expected: `CREATE TABLE Users (
  UserID INT PRIMARY KEY,
  UserName VARCHAR(255) NOT NULL
);

CREATE TABLE Items (
  ItemID INT PRIMARY KEY,
  ItemName VARCHAR(255) NOT NULL,
  Description TEXT
);

CREATE TABLE Requests (
  RequestID INT PRIMARY KEY,
  UserID INT NOT NULL,
  ItemID INT NOT NULL,
  RequestDate DATETIME NOT NULL,
  FOREIGN KEY (UserID) REFERENCES Users(UserID),
  FOREIGN KEY (ItemID) REFERENCES Items(ItemID)
);

CREATE TABLE Approvals (
  ApprovalID INT PRIMARY KEY,
  RequestID INT NOT NULL,
  ApproverUserID INT NOT NULL,
  ApprovalStatus VARCHAR(50) NOT NULL,
  ApprovalDate DATETIME NOT NULL,
  FOREIGN KEY (RequestID) REFERENCES Requests(RequestID),
  FOREIGN KEY (ApproverUserID) REFERENCES Users(UserID)
);

CREATE TABLE Qualifications (
  QualificationID INT PRIMARY KEY,
  QualificationName VARCHAR(100) NOT NULL UNIQUE
);`,
    analog_example: `CREATE TABLE Genres (
  GenreID INT PRIMARY KEY,
  GenreName VARCHAR(100) NOT NULL UNIQUE
);`,
    deepDiveLabel: "What is the UNIQUE constraint for?",
    deepDive: {
      hook: `Imagine a system where you're trying to categorize users by their skills, but you allow free-form text input for skills. Soon, you'd have "JavaScript," "javascript," "JS," "Javascrpt," all referring to the same skill, but stored inconsistently. This makes it impossible to accurately filter, count, or manage users based on their skills. You can't reliably query for all users with "JavaScript" skills because of the variations. This leads to messy data, inaccurate reporting, and a frustrating user experience when trying to find specific groups. Without a way to ensure that each category or qualification has only one canonical name, your data becomes unreliable and difficult to manage.`,
      pain: `⚠️ **Lesson:** Without a unique constraint on descriptive fields, data consistency is compromised. Symptom: Duplicate entries for the same logical concept, difficulty in filtering and grouping, and inaccurate reporting.`,
      mentalModel: `**Mental model:** The "controlled vocabulary" list. Instead of letting everyone invent their own words, a controlled vocabulary (like a dictionary or a list of approved tags) ensures that everyone uses the exact same term for the same concept. The \`UNIQUE\` constraint enforces this, making sure that 'Administrator' is only ever stored once as a qualification name, preventing variations and ensuring consistency across your data. It's like having a single, authoritative entry for each term.`,
      discover: `\`\`\`sql
CREATE TABLE Qualifications (
  QualificationID INT PRIMARY KEY,
  QualificationName VARCHAR(100) NOT NULL UNIQUE
);
\`\`\`
- \`QualificationID INT PRIMARY KEY\`: This column serves as the unique identifier for each qualification, ensuring that every qualification record is distinct.
- \`QualificationName VARCHAR(100) NOT NULL UNIQUE\`: This column stores the descriptive name of the qualification. It has two important constraints:
    - \`NOT NULL\`: Ensures that every qualification must have a name.
    - \`UNIQUE\`: This constraint ensures that all values in the \`QualificationName\` column are distinct. No two qualifications can have the exact same name, preventing duplicates and maintaining data consistency for lookup values.
- \`UNIQUE\` constraint: While a primary key automatically implies uniqueness, the \`UNIQUE\` constraint can be applied to any other column (or set of columns) where you need to guarantee that all values are distinct, even if they are not the primary identifier for the row.`,
      quickRules: `**Quick rules:**
- ✅ Use \`UNIQUE\` constraints on columns that should not have duplicate values, even if they are not the primary key.
- ✅ \`UNIQUE\` constraints are particularly useful for natural keys or descriptive fields that must be distinct (e.g., email addresses, product SKUs, category names).
- ✅ Combine \`UNIQUE\` with \`NOT NULL\` for truly unique and always-present values, ensuring both distinctness and completeness.
- ✅ Consider if a \`UNIQUE\` constraint is needed for lookup tables to prevent duplicate categories or labels.
- ❌ Do not apply \`UNIQUE\` to columns where duplicate values are expected or acceptable (e.g., \`RequestDate\` in the \`Requests\` table).
- ❌ Avoid using \`UNIQUE\` on very long text fields unless absolutely necessary, as it can impact performance and index size.
- ❌ Do not confuse \`UNIQUE\` with \`PRIMARY KEY\`; a table can have multiple \`UNIQUE\` columns but only one \`PRIMARY KEY\`.
- ❌ Never rely on application logic alone to enforce uniqueness for critical data; use database constraints.`,
      watchOut: `While \`UNIQUE\` ensures no two rows have the same value in that column, it typically allows \`NULL\` values (and usually allows multiple \`NULL\` values, as \`NULL\` is not considered equal to \`NULL\` in SQL's comparison logic). If you need to ensure uniqueness *and* presence (i.e., no duplicates and no empty values), you must combine \`UNIQUE\` with \`NOT NULL\`, as demonstrated in this step.`,
      dryRun: `🔁 **Think:** A qualification 'Administrator' is added with \`QualificationID = 1\`. Then 'Editor' is added with \`QualificationID = 2\`. If an attempt is made to add another qualification named 'Administrator', the \`UNIQUE\` constraint on \`QualificationName\` will prevent the insertion, ensuring there's only one 'Administrator' entry in the \`Qualifications\` table. If an attempt is made to add a qualification without a name, the \`NOT NULL\` constraint would prevent it. (Hint: Focus on how the \`UNIQUE\` constraint prevents duplicate names for qualifications).`,
      build: `**Learning focus:** Create a lookup table and enforce uniqueness on a descriptive field.`,
    },
  },
  {
    id: "step6",
    type: "question",
    phase: "Step 6 of 7",
    paal: "Users can have multiple qualifications, and a single qualification can apply to many users. This is a many-to-many relationship, which requires an intermediary 'junction' table to link them.",
    hint: "The junction table will contain foreign keys to both `Users` and `Qualifications`, and these two foreign keys together will form its composite primary key.",
    example_code: `CREATE TABLE BookAuthors (
  BookID INT NOT NULL,
  AuthorID INT NOT NULL,
  PRIMARY KEY (BookID, AuthorID),
  FOREIGN KEY (BookID) REFERENCES Books(BookID),
  FOREIGN KEY (AuthorID) REFERENCES Authors(AuthorID)
);`,
    think_prompt: "How do you create a table to link users to their qualifications, allowing each user to have many qualifications and each qualification to be assigned to many users?",
    mc_options: [
      "CREATE TABLE UserQualifications (UserID INT, QualificationID INT);",
      "CREATE TABLE UserQualifications (UserQualificationID INT PRIMARY KEY, UserID INT NOT NULL, QualificationID INT NOT NULL, FOREIGN KEY (UserID) REFERENCES Users(UserID), FOREIGN KEY (QualificationID) REFERENCES Qualifications(QualificationID));",
      "CREATE TABLE UserQualifications (UserID INT NOT NULL, QualificationID INT NOT NULL, PRIMARY KEY (UserID, QualificationID), FOREIGN KEY (UserID) REFERENCES Users(UserID), FOREIGN KEY (QualificationID) REFERENCES Qualifications(QualificationID));",
    ],
    mc_correct_option: "CREATE TABLE UserQualifications (UserID INT NOT NULL, QualificationID INT NOT NULL, PRIMARY KEY (UserID, QualificationID), FOREIGN KEY (UserID) REFERENCES Users(UserID), FOREIGN KEY (QualificationID) REFERENCES Qualifications(QualificationID));",
    mc_anchor: "PRIMARY KEY (UserID, QualificationID)",
    why_this_matters: "Many-to-many relationships are common and require a dedicated junction table with a composite primary key to correctly model the associations without data redundancy.",
    answer_keywords: ["CREATE TABLE", "junction table", "many-to-many", "composite primary key", "FOREIGN KEY"],
    seed_code: `CREATE TABLE Users (
  UserID INT PRIMARY KEY,
  UserName VARCHAR(255) NOT NULL
);

CREATE TABLE Items (
  ItemID INT PRIMARY KEY,
  ItemName VARCHAR(255) NOT NULL,
  Description TEXT
);

CREATE TABLE Requests (
  RequestID INT PRIMARY KEY,
  UserID INT NOT NULL,
  ItemID INT NOT NULL,
  RequestDate DATETIME NOT NULL,
  FOREIGN KEY (UserID) REFERENCES Users(UserID),
  FOREIGN KEY (ItemID) REFERENCES Items(ItemID)
);

CREATE TABLE Approvals (
  ApprovalID INT PRIMARY KEY,
  RequestID INT NOT NULL,
  ApproverUserID INT NOT NULL,
  ApprovalStatus VARCHAR(50) NOT NULL,
  ApprovalDate DATETIME NOT NULL,
  FOREIGN KEY (RequestID) REFERENCES Requests(RequestID),
  FOREIGN KEY (ApproverUserID) REFERENCES Users(UserID)
);

CREATE TABLE Qualifications (
  QualificationID INT PRIMARY KEY,
  QualificationName VARCHAR(100) NOT NULL UNIQUE
);`,
    starter_code: `CREATE TABLE Users (
  UserID INT PRIMARY KEY,
  UserName VARCHAR(255) NOT NULL
);

CREATE TABLE Items (
  ItemID INT PRIMARY KEY,
  ItemName VARCHAR(255) NOT NULL,
  Description TEXT
);

CREATE TABLE Requests (
  RequestID INT PRIMARY KEY,
  UserID INT NOT NULL,
  ItemID INT NOT NULL,
  RequestDate DATETIME NOT NULL,
  FOREIGN KEY (UserID) REFERENCES Users(UserID),
  FOREIGN KEY (ItemID) REFERENCES Items(ItemID)
);

CREATE TABLE Approvals (
  ApprovalID INT PRIMARY KEY,
  RequestID INT NOT NULL,
  ApproverUserID INT NOT NULL,
  ApprovalStatus VARCHAR(50) NOT NULL,
  ApprovalDate DATETIME NOT NULL,
  FOREIGN KEY (RequestID) REFERENCES Requests(RequestID),
  FOREIGN KEY (ApproverUserID) REFERENCES Users(UserID)
);

CREATE TABLE Qualifications (
  QualificationID INT PRIMARY KEY,
  QualificationName VARCHAR(100) NOT NULL UNIQUE
);

/*
 * Define the UserQualifications junction table here.
 * It needs to link Users to Qualifications, forming a many-to-many relationship.
 */`,
    feedback_correct: "Excellent! You've correctly implemented the many-to-many relationship using a junction table with a composite primary key, ensuring each user-qualification pair is unique.",
    feedback_partial: "You're close! While you've identified the foreign keys, remember that the combination of UserID and QualificationID should form the PRIMARY KEY for the junction table to ensure uniqueness of the relationship.",
    feedback_wrong: "Not quite. For a many-to-many relationship, you need a junction table where the combination of the two foreign keys acts as the primary key. This ensures that a user can only have a specific qualification once.",
    expected: `CREATE TABLE Users (
  UserID INT PRIMARY KEY,
  UserName VARCHAR(255) NOT NULL
);

CREATE TABLE Items (
  ItemID INT PRIMARY KEY,
  ItemName VARCHAR(255) NOT NULL,
  Description TEXT
);

CREATE TABLE Requests (
  RequestID INT PRIMARY KEY,
  UserID INT NOT NULL,
  ItemID INT NOT NULL,
  RequestDate DATETIME NOT NULL,
  FOREIGN KEY (UserID) REFERENCES Users(UserID),
  FOREIGN KEY (ItemID) REFERENCES Items(ItemID)
);

CREATE TABLE Approvals (
  ApprovalID INT PRIMARY KEY,
  RequestID INT NOT NULL,
  ApproverUserID INT NOT NULL,
  ApprovalStatus VARCHAR(50) NOT NULL,
  ApprovalDate DATETIME NOT NULL,
  FOREIGN KEY (RequestID) REFERENCES Requests(RequestID),
  FOREIGN KEY (ApproverUserID) REFERENCES Users(UserID)
);

CREATE TABLE Qualifications (
  QualificationID INT PRIMARY KEY,
  QualificationName VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE UserQualifications (
  UserID INT NOT NULL,
  QualificationID INT NOT NULL,
  PRIMARY KEY (UserID, QualificationID),
  FOREIGN KEY (UserID) REFERENCES Users(UserID),
  FOREIGN KEY (QualificationID) REFERENCES Qualifications(QualificationID)
);`,
    analog_example: `CREATE TABLE BookGenres (
  BookID INT NOT NULL,
  GenreID INT NOT NULL,
  PRIMARY KEY (BookID, GenreID),
  FOREIGN KEY (BookID) REFERENCES Books(BookID),
  FOREIGN KEY (GenreID) REFERENCES Genres(GenreID)
);`,
    deepDiveLabel: "How do I model Many-to-Many relationships?",
    deepDive: {
      hook: `Imagine a social media platform where users can follow multiple topics, and each topic is followed by many users. If you tried to store this in the \`Users\` table, you'd have to add a \`TopicID\` column, but then how would you store multiple topics for one user? You'd end up with duplicate user rows, or a messy comma-separated list in a single column, violating normalization. If you tried to store it in the \`Topics\` table, how would you list all users following it? This problem, where a single record needs to relate to multiple records in another table (and vice-versa), is a classic many-to-many scenario. Without a proper junction table, you face data redundancy, difficulty in querying, and a violation of normalization principles, making your data model inefficient and prone to errors.`,
      pain: `⚠️ **Lesson:** Direct representation of many-to-many relationships in a single table leads to redundancy or complex, unmanageable data. Symptom: Duplication of data, difficulty in adding/removing relationships, and inefficient querying.`,
      mentalModel: `**Mental model:** The "event attendee list." An event can have many attendees, and an attendee can go to many events. You don't list all events in the attendee's record, nor all attendees in the event's record. Instead, you create a separate "AttendeeList" (junction) table that simply pairs \`EventID\` with \`AttendeeID\`. Each row in this table represents one specific instance of an attendee attending an event, acting as the bridge between the two main entities.`,
      discover: `\`\`\`sql
CREATE TABLE UserQualifications (
  UserID INT NOT NULL,
  QualificationID INT NOT NULL,
  PRIMARY KEY (UserID, QualificationID),
  FOREIGN KEY (UserID) REFERENCES Users(UserID),
  FOREIGN KEY (QualificationID) REFERENCES Qualifications(QualificationID)
);
\`\`\`
- \`UserID INT NOT NULL\`, \`QualificationID INT NOT NULL\`: These columns are foreign keys that link to the \`Users\` and \`Qualifications\` tables, respectively. They are \`NOT NULL\` because each entry in this table must link to both a user and a qualification.
- \`PRIMARY KEY (UserID, QualificationID)\`: This defines a *composite primary key*. This means that the combination of \`UserID\` and \`QualificationID\` must be unique across all rows. This ensures that a specific user can only be associated with a specific qualification once, preventing duplicate relationship entries.
- \`FOREIGN KEY (UserID) REFERENCES Users(UserID)\`: This constraint ensures that every \`UserID\` in \`UserQualifications\` corresponds to an existing user.
- \`FOREIGN KEY (QualificationID) REFERENCES Qualifications(QualificationID)\`: This constraint ensures that every \`QualificationID\` in \`UserQualifications\` corresponds to an existing qualification.`,
      quickRules: `**Quick rules:**
- ✅ Use a junction table (also called an associative table or bridge table) for all many-to-many relationships.
- ✅ The junction table typically contains only the foreign keys of the two related tables.
- ✅ The primary key of the junction table is usually a composite key formed by these two foreign keys.
- ✅ Add any additional attributes specific to the *relationship itself* (e.g., \`DateAcquired\` for a qualification) to the junction table, if needed.
- ❌ Do not try to store multiple foreign keys in a single column (e.g., \`QualificationIDs\` as a comma-separated string in the \`Users\` table).
- ❌ Avoid duplicating data from the parent tables in the junction table; only store the foreign keys.
- ❌ Do not forget to define foreign key constraints from the junction table to both parent tables.
- ❌ Never use a single auto-incrementing primary key on a junction table if the combination of foreign keys should be unique.`,
      watchOut: `While the composite primary key \`(UserID, QualificationID)\` ensures a user can't have the *same* qualification twice, if your business logic requires tracking *multiple instances* of the same qualification (e.g., a user gets "Certified" twice on different dates, and you need to record both instances), you would need to add an additional column (like \`DateAcquired\`) to the primary key to make it unique, or add an auto-incrementing surrogate primary key to the junction table itself, making the composite key a \`UNIQUE\` constraint instead of the \`PRIMARY KEY\`.`,
      dryRun: `🔁 **Think:** User \`UserID = 1\` (Alice) acquires \`QualificationID = 1\` (Administrator). A record \`(1, 1)\` is successfully inserted into \`UserQualifications\`. Alice then acquires \`QualificationID = 2\` (Editor), so \`(1, 2)\` is inserted. If Alice tries to acquire \`QualificationID = 1\` again, the composite primary key \`(1, 1)\` already exists, and the insertion will fail, preventing duplicate entries for the same user-qualification pair. This ensures that each user-qualification association is recorded only once. (Hint: Focus on how the composite primary key prevents redundant relationship entries).`,
      build: `**Learning focus:** Implement a many-to-many relationship using a junction table with a composite primary key.`,
    },
  },
  {
    id: "step7",
    type: "question",
    phase: "Step 7 of 7",
    paal: "As your database grows, queries can become slow. Indexes are crucial for speeding up data retrieval on frequently searched columns. Let's add indexes to columns that are likely to be filtered or sorted.",
    hint: "Use the `CREATE INDEX` statement, specifying the table and column(s) to index. Give your indexes descriptive names.",
    example_code: `CREATE INDEX IX_Customers_LastName ON Customers (LastName);
CREATE INDEX IX_Orders_OrderDate ON Orders (OrderDate);`,
    think_prompt: "How do you add an index to the `RequestDate` column in the `Requests` table and the `ItemName` column in the `Items` table to speed up searches?",
    mc_options: [
      "ADD INDEX RequestDate ON Requests; ADD INDEX ItemName ON Items;",
      "CREATE INDEX IX_Requests_RequestDate ON Requests (RequestDate); CREATE INDEX IX_Items_ItemName ON Items (ItemName);",
      "INDEX Requests.RequestDate; INDEX Items.ItemName;",
    ],
    mc_correct_option: "CREATE INDEX IX_Requests_RequestDate ON Requests (RequestDate); CREATE INDEX IX_Items_ItemName ON Items (ItemName);",
    mc_anchor: "CREATE INDEX IX_Requests_RequestDate ON Requests (RequestDate);",
    why_this_matters: "Indexes dramatically improve query performance by allowing the database to quickly locate data without scanning entire tables, which is critical for responsive applications.",
    answer_keywords: ["CREATE INDEX", "performance", "query optimization"],
    seed_code: `CREATE TABLE Users (
  UserID INT PRIMARY KEY,
  UserName VARCHAR(255) NOT NULL
);

CREATE TABLE Items (
  ItemID INT PRIMARY KEY,
  ItemName VARCHAR(255) NOT NULL,
  Description TEXT
);

CREATE TABLE Requests (
  RequestID INT PRIMARY KEY,
  UserID INT NOT NULL,
  ItemID INT NOT NULL,
  RequestDate DATETIME NOT NULL,
  FOREIGN KEY (UserID) REFERENCES Users(UserID),
  FOREIGN KEY (ItemID) REFERENCES Items(ItemID)
);

CREATE TABLE Approvals (
  ApprovalID INT PRIMARY KEY,
  RequestID INT NOT NULL,
  ApproverUserID INT NOT NULL,
  ApprovalStatus VARCHAR(50) NOT NULL,
  ApprovalDate DATETIME NOT NULL,
  FOREIGN KEY (RequestID) REFERENCES Requests(RequestID),
  FOREIGN KEY (ApproverUserID) REFERENCES Users(UserID)
);

CREATE TABLE Qualifications (
  QualificationID INT PRIMARY KEY,
  QualificationName VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE UserQualifications (
  UserID INT NOT NULL,
  QualificationID INT NOT NULL,
  PRIMARY KEY (UserID, QualificationID),
  FOREIGN KEY (UserID) REFERENCES Users(UserID),
  FOREIGN KEY (QualificationID) REFERENCES Qualifications(QualificationID)
);`,
    starter_code: `CREATE TABLE Users (
  UserID INT PRIMARY KEY,
  UserName VARCHAR(255) NOT NULL
);

CREATE TABLE Items (
  ItemID INT PRIMARY KEY,
  ItemName VARCHAR(255) NOT NULL,
  Description TEXT
);

CREATE TABLE Requests (
  RequestID INT PRIMARY KEY,
  UserID INT NOT NULL,
  ItemID INT NOT NULL,
  RequestDate DATETIME NOT NULL,
  FOREIGN KEY (UserID) REFERENCES Users(UserID),
  FOREIGN KEY (ItemID) REFERENCES Items(ItemID)
);

CREATE TABLE Approvals (
  ApprovalID INT PRIMARY KEY,
  RequestID INT NOT NULL,
  ApproverUserID INT NOT NULL,
  ApprovalStatus VARCHAR(50) NOT NULL,
  ApprovalDate DATETIME NOT NULL,
  FOREIGN KEY (RequestID) REFERENCES Requests(RequestID),
  FOREIGN KEY (ApproverUserID) REFERENCES Users(UserID)
);

CREATE TABLE Qualifications (
  QualificationID INT PRIMARY KEY,
  QualificationName VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE UserQualifications (
  UserID INT NOT NULL,
  QualificationID INT NOT NULL,
  PRIMARY KEY (UserID, QualificationID),
  FOREIGN KEY (UserID) REFERENCES Users(UserID),
  FOREIGN KEY (QualificationID) REFERENCES Qualifications(QualificationID)
);

/*
 * Add indexes to RequestDate in Requests and ItemName in Items.
 */`,
    feedback_correct: "Fantastic! You've correctly added indexes to the RequestDate and ItemName columns. This will significantly boost query performance on these frequently accessed fields.",
    feedback_partial: "You're close! Remember to use the CREATE INDEX syntax and specify both the index name and the table/column it applies to for each index you want to create.",
    feedback_wrong: "Not quite. The syntax for creating an index involves the CREATE INDEX statement, followed by a descriptive name, and then specifying the table and column(s) in parentheses.",
    expected: `CREATE TABLE Users (
  UserID INT PRIMARY KEY,
  UserName VARCHAR(255) NOT NULL
);

CREATE TABLE Items (
  ItemID INT PRIMARY KEY,
  ItemName VARCHAR(255) NOT NULL,
  Description TEXT
);

CREATE TABLE Requests (
  RequestID INT PRIMARY KEY,
  UserID INT NOT NULL,
  ItemID INT NOT NULL,
  RequestDate DATETIME NOT NULL,
  FOREIGN KEY (UserID) REFERENCES Users(UserID),
  FOREIGN KEY (ItemID) REFERENCES Items(ItemID)
);

CREATE TABLE Approvals (
  ApprovalID INT PRIMARY KEY,
  RequestID INT NOT NULL,
  ApproverUserID INT NOT NULL,
  ApprovalStatus VARCHAR(50) NOT NULL,
  ApprovalDate DATETIME NOT NULL,
  FOREIGN KEY (RequestID) REFERENCES Requests(RequestID),
  FOREIGN KEY (ApproverUserID) REFERENCES Users(UserID)
);

CREATE TABLE Qualifications (
  QualificationID INT PRIMARY KEY,
  QualificationName VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE UserQualifications (
  UserID INT NOT NULL,
  QualificationID INT NOT NULL,
  PRIMARY KEY (UserID, QualificationID),
  FOREIGN KEY (UserID) REFERENCES Users(UserID),
  FOREIGN KEY (QualificationID) REFERENCES Qualifications(QualificationID)
);

CREATE INDEX IX_Requests_RequestDate ON Requests (RequestDate);
CREATE INDEX IX_Items_ItemName ON Items (ItemName);`,
    analog_example: `CREATE INDEX IX_Books_Title ON Books (Title);
CREATE INDEX IX_Orders_CustomerID ON Orders (CustomerID);`,
    deepDiveLabel: "How do Indexes speed up queries?",
    deepDive: {
      hook: `Imagine a physical dictionary where the words aren't alphabetized, and there's no index at the back. If you wanted to find the definition of "serendipity," you'd have to read through every single word from the beginning until you found it. This is what happens in a database without indexes: the database has to perform a "full table scan," checking every single row to find the data you're looking for. As the table grows, this process becomes incredibly slow, making your application unresponsive and frustrating for users. Even a simple filter or sort operation can bring a large application to a crawl, leading to poor user experience and wasted computing resources.`,
      pain: `⚠️ **Lesson:** Without indexes, queries on non-primary key columns can be very slow. Symptom: Long query times, unresponsive application, and high database resource usage during searches or sorts.`,
      mentalModel: `**Mental model:** The "library catalog." Instead of searching every book on every shelf (a full table scan), you go to the catalog (the index). The catalog is a separate, highly organized structure that tells you exactly where to find the book (the row in the table) based on its title, author, or subject (the indexed columns). It's a pre-sorted, quick-reference guide that points directly to the data you need, allowing you to bypass the slow process of sifting through irrelevant information.`,
      discover: `\`\`\`sql
CREATE INDEX IX_Requests_RequestDate ON Requests (RequestDate);
CREATE INDEX IX_Items_ItemName ON Items (ItemName);
\`\`\`
- \`CREATE INDEX\`: This is the SQL command used to create a new index.
- \`IX_Requests_RequestDate\`: This is a descriptive name for the index. A common convention is \`IX_TableName_ColumnName\` to easily identify which table and column the index applies to.
- \`ON Requests (RequestDate)\`: This specifies that the index should be created on the \`RequestDate\` column within the \`Requests\` table. The database will build a sorted data structure (like a B-tree) based on the values in this column.
- \`ON Items (ItemName)\`: Similarly, this creates an index on the \`ItemName\` column of the \`Items\` table.
- How it works: When a query filters or sorts by an indexed column, the database can use the index to quickly find the relevant rows, much faster than scanning the entire table.`,
      quickRules: `**Quick rules:**
- ✅ Create indexes on columns frequently used in \`WHERE\` clauses (for filtering data).
- ✅ Create indexes on columns used in \`ORDER BY\` clauses (for sorting results).
- ✅ Create indexes on columns used in \`JOIN\` conditions (especially foreign keys, which are often automatically indexed by the database).
- ✅ Use descriptive names for your indexes to improve readability and maintainability.
- ❌ Do not index every column; indexes consume storage space and can slow down \`INSERT\`, \`UPDATE\`, and \`DELETE\` operations because the index structure itself must also be updated.
- ❌ Avoid indexing columns with very few unique values (e.g., a boolean \`IsActive\` column), as they offer little benefit.
- ❌ Do not create redundant indexes (e.g., an index on \`(A, B)\` and another on \`(A)\` if \`(A, B)\` is sufficient for queries on \`A\`).
- ❌ Never add indexes without understanding your query patterns; unnecessary indexes can hurt performance.`,
      watchOut: `While indexes speed up reads, they come with a cost: they slow down writes (inserts, updates, deletes) because the index structure itself must also be updated every time data changes. There's a trade-off. Analyze your application's query patterns: if you read data far more often than you write it, indexes are usually beneficial. If you have a write-heavy workload, be selective with indexing and monitor performance closely. Over-indexing can sometimes be worse than under-indexing.`,
      dryRun: `🔁 **Think:** A query \`SELECT * FROM Requests WHERE RequestDate > '2023-01-01'\` is executed. Without an index, the database would perform a full table scan, checking every row in \`Requests\`. With \`IX_Requests_RequestDate\` in place, the database quickly navigates the index (which is sorted by \`RequestDate\`) to find the starting point for '2023-01-01' and then reads only the relevant rows from the table, skipping all earlier dates. Similarly, a query \`SELECT * FROM Items WHERE ItemName LIKE 'L%'\` uses \`IX_Items_ItemName\` to quickly locate items starting with 'L' without scanning the entire \`Items\` table. (Hint: Focus on how the index allows the database to skip scanning irrelevant data, directly jumping to the needed records).`,
      build: `**Learning focus:** Add indexes to columns that are frequently queried to improve performance.`,
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
  title: "Designing Normalized Relational Schemas",
  shortName: "Relational Schemas",
});
