import createINPACTEngine from "../inpact_engine_shared";

export const NODES = [
  {
    id: "intro",
    type: "reveal",
    phase: "Lesson",
    content: {
      tag: "database-schema-migrations",
      title: "Structuring Database Schemas with Migrations",
      body: `When building any application, the way data is stored and organized in a database is fundamental. As applications evolve, their data requirements change, meaning the database schema — the blueprint of tables, columns, and relationships — must also evolve. Manually changing a live database is risky and error-prone, especially in team environments. Database migrations provide a structured, version-controlled way to manage these changes, ensuring that every developer's local database, and eventually the production database, reflects the correct schema at any given point in time. This systematic approach prevents data inconsistencies, simplifies collaboration, and makes rollbacks or audits much more manageable.

This pattern is ubiquitous across all software development involving persistent data. You'll encounter it when adding a new field to a user profile, introducing a new feature that requires a new set of related tables (like a product catalog with categories and items), or refining existing data structures to improve performance or enforce new business rules. Whether you're working on a simple settings panel, a complex financial system, or an internal tool for managing resources, understanding how to evolve your database schema reliably using migrations is a core skill for maintaining robust and scalable applications.`,
      usecase: "Adding a new feature to an existing application that requires storing new types of data and establishing relationships between them, such as a 'comments' feature for 'posts', including user references and timestamps.",
    },
  },
  {
    id: "objectives",
    type: "objectives",
    phase: "Objectives",
    items: [
      "Understand the purpose of database schema migrations.",
      "Design and create database tables with appropriate column types and primary keys.",
      "Establish referential integrity using foreign key constraints.",
      "Enforce data validation rules with check constraints.",
      "Optimize data retrieval and ensure uniqueness with indexes.",
    ],
  },
  {
    id: "step1",
    type: "question",
    phase: "Step 1 of 4",
    paal: "Begin by defining the foundational tables for a library system. Create tables for `authors`, `books`, `members`, and `loans`, along with a `author_book` join table. Focus on basic column definitions and primary keys, without adding any foreign key constraints or advanced validation yet. Each table should have an `id` column as its primary key.",
    hint: "Use `CREATE TABLE` statements. Remember to specify column names, data types (e.g., `SERIAL`, `VARCHAR(255)`, `TEXT`, `DATE`), and `PRIMARY KEY` for the `id` column.",
    example_code: `
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE posts (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    title VARCHAR(255) NOT NULL,
    content TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
`,
    think_prompt: "Which SQL statements correctly define the initial tables for authors, books, members, loans, and the author_book join table, including primary keys?",
    mc_options: [
      `
CREATE TABLE authors (id INT PRIMARY KEY, name VARCHAR(255));
CREATE TABLE books (id INT PRIMARY KEY, title VARCHAR(255));
CREATE TABLE members (id INT PRIMARY KEY, name VARCHAR(255));
CREATE TABLE loans (id INT PRIMARY KEY, loan_date DATE);
CREATE TABLE author_book (author_id INT, book_id INT);
`,
      `
CREATE TABLE authors (author_id SERIAL PRIMARY KEY, author_name VARCHAR(255));
CREATE TABLE books (book_id SERIAL PRIMARY KEY, book_title VARCHAR(255));
CREATE TABLE members (member_id SERIAL PRIMARY KEY, member_name VARCHAR(255));
CREATE TABLE loans (loan_id SERIAL PRIMARY KEY, loan_start_date DATE);
CREATE TABLE author_book (author_id INT, book_id INT, PRIMARY KEY (author_id, book_id));
`,
      `
CREATE TABLE authors (id SERIAL PRIMARY KEY, name VARCHAR(255) NOT NULL);
CREATE TABLE books (id SERIAL PRIMARY KEY, title VARCHAR(255) NOT NULL, publication_year INTEGER);
CREATE TABLE members (id SERIAL PRIMARY KEY, name VARCHAR(255) NOT NULL, email VARCHAR(255) UNIQUE);
CREATE TABLE loans (id SERIAL PRIMARY KEY, loan_date DATE NOT NULL, due_date DATE);
CREATE TABLE author_book (author_id INTEGER NOT NULL, book_id INTEGER NOT NULL);
`,
    ],
    mc_correct_option: `
CREATE TABLE authors (id SERIAL PRIMARY KEY, name VARCHAR(255) NOT NULL);
CREATE TABLE books (id SERIAL PRIMARY KEY, title VARCHAR(255) NOT NULL, publication_year INTEGER);
CREATE TABLE members (id SERIAL PRIMARY KEY, name VARCHAR(255) NOT NULL, email VARCHAR(255) UNIQUE);
CREATE TABLE loans (id SERIAL PRIMARY KEY, loan_date DATE NOT NULL, due_date DATE);
CREATE TABLE author_book (author_id INTEGER NOT NULL, book_id INTEGER NOT NULL);
`,
    mc_anchor: "The correct option uses `SERIAL PRIMARY KEY` for auto-incrementing IDs, includes `NOT NULL` for essential fields, and defines appropriate data types.",
    why_this_matters: "Defining tables correctly with appropriate data types and primary keys is the first step in building a robust database schema. It lays the groundwork for storing data efficiently and uniquely identifying each record, which is crucial for all subsequent operations and relationships.",
    answer_keywords: ["CREATE TABLE", "SERIAL PRIMARY KEY", "VARCHAR", "INTEGER", "DATE", "NOT NULL"],
    seed_code: ``,
    starter_code: `
-- Define the 'authors' table
-- Define the 'books' table
-- Define the 'members' table
-- Define the 'loans' table
-- Define the 'author_book' join table
`,
    feedback_correct: "Excellent! You've correctly defined the initial tables with appropriate data types, primary keys, and essential `NOT NULL` constraints. This forms a solid foundation for our library system.",
    feedback_partial: "You're on the right track, but some tables might be missing `NOT NULL` constraints for critical fields, or the primary key definition might not be ideal for auto-incrementing IDs. Review the use of `SERIAL PRIMARY KEY` and `NOT NULL` for essential columns.",
    feedback_wrong: "Review the syntax for `CREATE TABLE` and how to define primary keys and column types. Ensure each table has an auto-incrementing primary key and that essential fields are marked as `NOT NULL`.",
    expected: `
CREATE TABLE authors (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

CREATE TABLE books (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    publication_year INTEGER
);

CREATE TABLE members (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE
);

CREATE TABLE loans (
    id SERIAL PRIMARY KEY,
    loan_date DATE NOT NULL,
    due_date DATE
);

CREATE TABLE author_book (
    author_id INTEGER NOT NULL,
    book_id INTEGER NOT NULL
);
`,
    analog_example: `
// In a programming language, defining basic data structures (classes/structs)
// without establishing explicit relationships or complex validation yet.

class Author {
    id: number;
    name: string;

    constructor(id: number, name: string) {
        this.id = id;
        this.name = name;
    }
}

class Book {
    id: number;
    title: string;
    publicationYear?: number; // Optional field

    constructor(id: number, title: string, publicationYear?: number) {
        this.id = id;
        this.title = title;
        this.publicationYear = publicationYear;
    }
}

class Member {
    id: number;
    name: string;
    email: string;

    constructor(id: number, name: string, email: string) {
        this.id = id;
        this.name = name;
        this.email = email;
    }
}

// A simple representation of a loan, without linking to specific book/member objects yet
class Loan {
    id: number;
    loanDate: Date;
    dueDate?: Date;

    constructor(id: number, loanDate: Date, dueDate?: Date) {
        this.id = id;
        this.loanDate = loanDate;
        this.dueDate = dueDate;
    }
}
`,
    deepDiveLabel: "Why are primary keys and data types so important from the start?",
    deepDive: {
      hook: `Imagine you're organizing a massive physical library. If every book just had a title, and multiple copies of the same book existed, how would you distinguish them? How would you track which specific copy was loaned out? Or if you had multiple authors named 'John Smith', how would you know which one wrote a particular book? Without a unique identifier for each item – each book, each author, each member – your system would quickly descend into chaos. You couldn't reliably update information, track relationships, or even guarantee that you're talking about the same entity twice. This is precisely the problem primary keys solve in a database. They are the absolute, undeniable identifier for every single record, making sure each row is distinct and traceable. Furthermore, if you store a book's publication year as plain text instead of a number, how would you sort books by age or search for books published after a certain date? The data type dictates what operations are possible and how efficiently the database can perform them.`,
      pain: `⚠️ **Lesson:** Without proper primary keys and correctly chosen data types, a database becomes a collection of ambiguous, untraceable, and unmanageable data.
**Symptom:** Inability to uniquely identify records, difficulty in establishing relationships between tables, inefficient data storage, and errors when performing data operations (e.g., sorting dates stored as text).`,
      mentalModel: `**Mental model:** The "Social Security Number" for your data. Just as a Social Security Number uniquely identifies an individual, a primary key uniquely identifies a row in a table. It's a non-negotiable, fundamental attribute. Similarly, data types are like "data containers" – you wouldn't store water in a sieve or a delicate antique in a rough burlap sack. Each data type is designed to hold a specific kind of data (numbers, text, dates) efficiently and allow specific operations on it. Choosing the right container ensures data integrity and optimal performance.`,
      discover: `**Pattern - Basic Table Creation:**
\`\`\`sql
CREATE TABLE table_name (
    id SERIAL PRIMARY KEY,            -- 1. Unique, auto-incrementing identifier
    column_name_1 VARCHAR(255) NOT NULL, -- 2. Text field, max 255 chars, cannot be empty
    column_name_2 INTEGER,            -- 3. Whole number
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP -- 4. Date/time, defaults to current time
);
\`\`\`
-   **1. \`SERIAL PRIMARY KEY\`**: \`SERIAL\` automatically assigns a unique, sequential integer to new rows, making it perfect for primary keys. \`PRIMARY KEY\` enforces uniqueness and \`NOT NULL\`, and creates an index for fast lookups.
-   **2. \`VARCHAR(255) NOT NULL\`**: \`VARCHAR\` is for variable-length strings. The number in parentheses is the maximum length. \`NOT NULL\` ensures that this column must always have a value.
-   **3. \`INTEGER\`**: Used for whole numbers. Other numeric types include \`SMALLINT\`, \`BIGINT\`, \`DECIMAL\`, \`NUMERIC\`.
-   **4. \`TIMESTAMP DEFAULT CURRENT_TIMESTAMP\`**: Stores date and time. \`DEFAULT CURRENT_TIMESTAMP\` automatically populates the column with the current time if no value is provided during insertion.`,
      quickRules: `**Quick rules:**
-   ✅ Always define a primary key for every table, typically an auto-incrementing integer (\`SERIAL\`).
-   ✅ Use \`NOT NULL\` for columns that must always contain data (e.g., a book's title, an author's name).
-   ✅ Choose the most appropriate data type for each column to ensure data integrity and efficient storage/querying (e.g., \`DATE\` for dates, \`INTEGER\` for counts, \`VARCHAR\` for short strings).
-   ✅ Consider adding \`UNIQUE\` constraints for columns that should hold distinct values (e.g., email addresses, ISBNs).
-   ❌ Never rely on external application logic alone to enforce uniqueness or identify records; use database-level primary keys.
-   ❌ Avoid using generic \`TEXT\` for short, fixed-length strings when \`VARCHAR(N)\` is more appropriate, as \`VARCHAR\` can sometimes be more efficient.
-   ❌ Do not omit \`NOT NULL\` from critical fields, as this can lead to inconsistent or incomplete data.`,
      watchOut: `👀 **Watch out:** While \`SERIAL\` is convenient, it's specific to PostgreSQL. Other databases use different syntaxes for auto-incrementing primary keys (e.g., \`AUTO_INCREMENT\` in MySQL, \`IDENTITY(1,1)\` in SQL Server). Always verify the correct syntax for your specific database system. Also, be mindful of the maximum length specified for \`VARCHAR\` fields; choosing too small a length can truncate data, while too large a length might consume more memory in some systems or imply a level of flexibility not actually needed.`,
      dryRun: `🔁 **Think:** A new book is added to the system.
1.  **\`INSERT INTO books (title, publication_year) VALUES ('The Great Adventure', 2023);\`**
    *   The database receives the request.
    *   It checks the \`books\` table definition.
    *   \`id\` column: \`SERIAL PRIMARY KEY\` automatically assigns the next available integer (e.g., 1).
    *   \`title\` column: \`VARCHAR(255) NOT NULL\`. Value 'The Great Adventure' fits within 255 characters and is not null. Valid.
    *   \`publication_year\` column: \`INTEGER\`. Value 2023 is an integer. Valid.
    *   The row is successfully inserted.
2.  **\`INSERT INTO authors (name) VALUES (NULL);\`**
    *   The database receives the request.
    *   It checks the \`authors\` table definition.
    *   \`id\` column: \`SERIAL PRIMARY KEY\` would assign an ID.
    *   \`name\` column: \`VARCHAR(255) NOT NULL\`. The provided value is \`NULL\`.
    *   Constraint violation: \`name\` cannot be \`NULL\`. The insertion fails.
(Hint: Pay attention to how \`SERIAL PRIMARY KEY\` assigns IDs and how \`NOT NULL\` prevents invalid data.)`,
      build: "**Learning focus:** Define the initial structure of database tables, including primary keys and basic column types, to establish a foundation for data storage.",
    },
  },
  {
    id: "step2",
    type: "question",
    phase: "Step 2 of 4",
    paal: "Now that the basic tables are defined, establish the relationships between them using foreign key constraints. Link `loans` to `books` and `loans` to `members`. Also, ensure the `author_book` join table correctly links `authors` and `books`. This ensures referential integrity, meaning you can't have a loan for a non-existent book or a book by a non-existent author.",
    hint: "First, add any necessary foreign key columns to tables like `loans`. Then, use `ALTER TABLE ADD CONSTRAINT` with `FOREIGN KEY (column_name) REFERENCES target_table (target_column_name)`.",
    example_code: `
ALTER TABLE posts
ADD CONSTRAINT fk_user
FOREIGN KEY (user_id) REFERENCES users (id);

ALTER TABLE comments
ADD COLUMN post_id INTEGER NOT NULL; -- First add the column if it doesn't exist
ALTER TABLE comments
ADD CONSTRAINT fk_post
FOREIGN KEY (post_id) REFERENCES posts (id);
`,
    think_prompt: "Which SQL statements correctly add the necessary columns to the `loans` table and then define foreign key constraints to link `loans` to `books` and `members`, and `author_book` to `authors` and `books`?",
    mc_options: [
      `
ALTER TABLE loans ADD CONSTRAINT fk_loan_book FOREIGN KEY (book_id) REFERENCES books (id);
ALTER TABLE loans ADD CONSTRAINT fk_loan_member FOREIGN KEY (member_id) REFERENCES members (id);
ALTER TABLE author_book ADD CONSTRAINT fk_author_book_author FOREIGN KEY (author_id) REFERENCES authors (id);
ALTER TABLE author_book ADD CONSTRAINT fk_author_book_book FOREIGN KEY (book_id) REFERENCES books (id);
`,
      `
ALTER TABLE books ADD COLUMN author_id INTEGER NOT NULL;
ALTER TABLE books ADD CONSTRAINT fk_book_author FOREIGN KEY (author_id) REFERENCES authors (id);
ALTER TABLE loans ADD COLUMN book_id INTEGER NOT NULL;
ALTER TABLE loans ADD COLUMN member_id INTEGER NOT NULL;
ALTER TABLE loans ADD CONSTRAINT fk_loan_book FOREIGN KEY (book_id) REFERENCES books (id);
ALTER TABLE loans ADD CONSTRAINT fk_loan_member FOREIGN KEY (member_id) REFERENCES members (id);
`,
      `
ALTER TABLE loans ADD COLUMN book_id INTEGER NOT NULL;
ALTER TABLE loans ADD COLUMN member_id INTEGER NOT NULL;

ALTER TABLE loans ADD CONSTRAINT fk_loan_book FOREIGN KEY (book_id) REFERENCES books (id);
ALTER TABLE loans ADD CONSTRAINT fk_loan_member FOREIGN KEY (member_id) REFERENCES members (id);

ALTER TABLE author_book ADD CONSTRAINT fk_author_book_author FOREIGN KEY (author_id) REFERENCES authors (id);
ALTER TABLE author_book ADD CONSTRAINT fk_author_book_book FOREIGN KEY (book_id) REFERENCES books (id);
`,
    ],
    mc_correct_option: `
ALTER TABLE loans ADD COLUMN book_id INTEGER NOT NULL;
ALTER TABLE loans ADD COLUMN member_id INTEGER NOT NULL;

ALTER TABLE loans ADD CONSTRAINT fk_loan_book FOREIGN KEY (book_id) REFERENCES books (id);
ALTER TABLE loans ADD CONSTRAINT fk_loan_member FOREIGN KEY (member_id) REFERENCES members (id);

ALTER TABLE author_book ADD CONSTRAINT fk_author_book_author FOREIGN KEY (author_id) REFERENCES authors (id);
ALTER TABLE author_book ADD CONSTRAINT fk_author_book_book FOREIGN KEY (book_id) REFERENCES books (id);
`,
    mc_anchor: "The correct option first adds the necessary foreign key columns to the `loans` table and then defines all foreign key constraints, ensuring referential integrity across the system.",
    why_this_matters: "Foreign key constraints are vital for maintaining referential integrity, preventing 'orphan' records (e.g., a loan referencing a non-existent book). They enforce the relationships defined in your schema at the database level, ensuring data consistency and reliability.",
    answer_keywords: ["ALTER TABLE", "ADD COLUMN", "FOREIGN KEY", "REFERENCES", "CONSTRAINT"],
    seed_code: `
CREATE TABLE authors (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

CREATE TABLE books (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    publication_year INTEGER
);

CREATE TABLE members (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE
);

CREATE TABLE loans (
    id SERIAL PRIMARY KEY,
    loan_date DATE NOT NULL,
    due_date DATE
);

CREATE TABLE author_book (
    author_id INTEGER NOT NULL,
    book_id INTEGER NOT NULL
);
`,
    starter_code: `
${`
CREATE TABLE authors (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

CREATE TABLE books (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    publication_year INTEGER
);

CREATE TABLE members (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE
);

CREATE TABLE loans (
    id SERIAL PRIMARY KEY,
    loan_date DATE NOT NULL,
    due_date DATE
);

CREATE TABLE author_book (
    author_id INTEGER NOT NULL,
    book_id INTEGER NOT NULL
);
`}
-- Add book_id and member_id columns to the loans table
-- Add foreign key constraints for loans to books and members
-- Add foreign key constraints for author_book to authors and books
`,
    feedback_correct: "Spot on! You've successfully added the necessary columns and established all foreign key constraints, creating a robust and interconnected data model.",
    feedback_partial: "You've added some foreign keys, but you might have missed adding the necessary columns to the `loans` table first, or some relationships are still missing. Review the relationships needed for `loans` and `author_book`.",
    feedback_wrong: "Remember that to create a foreign key, the referencing column must exist in the table. You need to add `book_id` and `member_id` columns to the `loans` table before you can define foreign keys on them. Also, ensure all relationships are covered.",
    expected: `
CREATE TABLE authors (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

CREATE TABLE books (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    publication_year INTEGER
);

CREATE TABLE members (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE
);

CREATE TABLE loans (
    id SERIAL PRIMARY KEY,
    loan_date DATE NOT NULL,
    due_date DATE,
    book_id INTEGER NOT NULL,
    member_id INTEGER NOT NULL
);

CREATE TABLE author_book (
    author_id INTEGER NOT NULL,
    book_id INTEGER NOT NULL
);

ALTER TABLE loans ADD CONSTRAINT fk_loan_book FOREIGN KEY (book_id) REFERENCES books (id);
ALTER TABLE loans ADD CONSTRAINT fk_loan_member FOREIGN KEY (member_id) REFERENCES members (id);

ALTER TABLE author_book ADD CONSTRAINT fk_author_book_author FOREIGN KEY (author_id) REFERENCES authors (id);
ALTER TABLE author_book ADD CONSTRAINT fk_author_book_book FOREIGN KEY (book_id) REFERENCES books (id);
`,
    analog_example: `
// In a programming language, establishing object relationships through references.

class Author {
    id: number;
    name: string;
    // No direct list of books here for many-to-many, handled externally
    constructor(id: number, name: string) { this.id = id; this.name = name; }
}

class Book {
    id: number;
    title: string;
    publicationYear?: number;
    // No direct list of authors here for many-to-many, handled externally
    constructor(id: number, title: string, publicationYear?: number) {
        this.id = id; this.title = title; this.publicationYear = publicationYear;
    }
}

class Member {
    id: number;
    name: string;
    email: string;
    constructor(id: number, name: string, email: string) {
        this.id = id; this.name = name; this.email = email;
    }
}

// Loan now holds references (IDs) to specific Book and Member objects
class Loan {
    id: number;
    loanDate: Date;
    dueDate?: Date;
    bookId: number; // Foreign key reference
    memberId: number; // Foreign key reference

    constructor(id: number, loanDate: Date, bookId: number, memberId: number, dueDate?: Date) {
        this.id = id;
        this.loanDate = loanDate;
        this.bookId = bookId;
        this.memberId = memberId;
        this.dueDate = dueDate;
    }
}

// A system to manage author-book relationships (like the author_book join table)
class AuthorBookRegistry {
    private relationships: Map<number, Set<number>>; // Map<Author ID, Set<Book IDs>>

    constructor() {
        this.relationships = new Map();
    }

    addRelationship(authorId: number, bookId: number): void {
        if (!this.relationships.has(authorId)) {
            this.relationships.set(authorId, new Set());
        }
        this.relationships.get(authorId)?.add(bookId);
    }

    getBooksByAuthor(authorId: number): Set<number> | undefined {
        return this.relationships.get(authorId);
    }
}
`,
    deepDiveLabel: "How do foreign keys prevent data integrity issues?",
    deepDive: {
      hook: `Imagine a scenario where you're managing a list of customer orders. Each order is supposed to be linked to a specific customer. What happens if, due to a bug or a manual error, an order is created with a customer ID that doesn't exist in your customer database? Or, even worse, what if a customer record is accidentally deleted, but there are still orders referencing that customer? Your order history would suddenly contain "ghost" orders, pointing to nothing. This kind of data inconsistency can lead to application crashes, incorrect reports, and a complete loss of trust in your data. Without a mechanism to enforce that every order's customer ID *must* correspond to an actual customer, your database becomes a minefield of potential errors.`,
      pain: `⚠️ **Lesson:** Without foreign key constraints, a database cannot guarantee referential integrity, leading to "orphan" records and inconsistent data.
**Symptom:** Application errors due to missing referenced data, incorrect reports, difficulty in debugging data-related issues, and a general loss of data trustworthiness.`,
      mentalModel: `**Mental model:** The "Parent-Child Relationship" in a family. A child (the referencing record, e.g., a loan) cannot exist without a parent (the referenced record, e.g., a book or a member). If a parent is removed, the child either must also be removed (cascading delete) or prevented from being created in the first place if its parent doesn't exist. Foreign keys enforce this fundamental rule, ensuring that every "child" record always has a valid "parent" record it refers to.`,
      discover: `**Pattern - Adding Foreign Key Constraints:**
\`\`\`sql
ALTER TABLE child_table
ADD COLUMN parent_id INTEGER NOT NULL; -- 1. Ensure the referencing column exists

ALTER TABLE child_table
ADD CONSTRAINT fk_child_parent -- 2. Name the constraint for clarity
FOREIGN KEY (parent_id)        -- 3. The column(s) in the child table
REFERENCES parent_table (id)   -- 4. The parent table and its primary key column(s)
ON DELETE CASCADE              -- Optional: What happens on parent deletion (e.g., CASCADE, SET NULL, RESTRICT)
ON UPDATE NO ACTION;           -- Optional: What happens on parent primary key update
\`\`\`
-   **1. \`ADD COLUMN\`**: If the foreign key column doesn't exist, you must add it first. It's often \`NOT NULL\` if the relationship is mandatory.
-   **2. \`ADD CONSTRAINT fk_child_parent\`**: Assigning a descriptive name to the constraint makes it easier to manage and understand error messages.
-   **3. \`FOREIGN KEY (parent_id)\`**: Specifies the column(s) in the \`child_table\` that will hold the reference to the \`parent_table\`.
-   **4. \`REFERENCES parent_table (id)\`**: Points to the \`parent_table\` and the column(s) (usually its primary key) that the \`parent_id\` column refers to.
-   **\`ON DELETE CASCADE\`**: An optional action. If a parent record is deleted, all referencing child records are also automatically deleted. Other options include \`SET NULL\` (set child FK to NULL), \`RESTRICT\` (prevent parent deletion if children exist), \`NO ACTION\` (similar to restrict, but checked at end of transaction).`,
      quickRules: `**Quick rules:**
-   ✅ Always use foreign keys to enforce relationships between tables at the database level.
-   ✅ Name your foreign key constraints descriptively (e.g., \`fk_loan_book\`) for easier debugging and schema understanding.
-   ✅ Ensure the data type of the foreign key column matches the data type of the referenced primary key column.
-   ✅ Consider \`ON DELETE\` and \`ON UPDATE\` actions carefully based on your application's data integrity requirements.
-   ❌ Never rely solely on application code to enforce referential integrity; database constraints are more robust.
-   ❌ Avoid creating foreign keys on columns that are not indexed, as this can lead to performance issues.
-   ❌ Do not create circular foreign key dependencies without careful consideration, as they can complicate data manipulation.`,
      watchOut: `👀 **Watch out:** When adding \`NOT NULL\` foreign key columns to existing tables, you might need to provide a \`DEFAULT\` value or ensure the table is empty, especially if the table already contains data. If you add a \`NOT NULL\` column without a default to a table with existing rows, the \`ALTER TABLE\` command will fail because existing rows would violate the \`NOT NULL\` constraint. For \`ON DELETE\` actions, \`CASCADE\` is powerful but can lead to unintended data loss if not used carefully. \`RESTRICT\` or \`NO ACTION\` are safer defaults if you prefer to handle deletions in your application logic.`,
      dryRun: `🔁 **Think:** A new loan is attempted for a non-existent book.
1.  **\`INSERT INTO loans (loan_date, book_id, member_id) VALUES ('2024-01-01', 999, 1);\`** (Assume book ID 999 does not exist, member ID 1 does)
    *   The database receives the request.
    *   It attempts to insert into the \`loans\` table.
    *   It checks the \`fk_loan_book\` foreign key constraint.
    *   The \`book_id\` value (999) is checked against the \`id\` column of the \`books\` table.
    *   Since \`books.id = 999\` does not exist, the foreign key constraint is violated.
    *   The \`INSERT\` operation fails, and an error is returned.
2.  **\`DELETE FROM authors WHERE id = 1;\`** (Assume author ID 1 exists and is linked to books via \`author_book\` with \`ON DELETE RESTRICT\` or \`NO ACTION\` on \`author_book\`'s FK)
    *   The database receives the request.
    *   It checks the \`fk_author_book_author\` foreign key constraint on the \`author_book\` table.
    *   Since there are entries in \`author_book\` referencing \`authors.id = 1\`, and the \`ON DELETE\` action is \`RESTRICT\` (or \`NO ACTION\`), the deletion is prevented.
    *   The \`DELETE\` operation fails, and an error is returned, indicating that dependent rows exist.
(Hint: Observe how the database prevents operations that would lead to inconsistent data.)`,
      build: "**Learning focus:** Establish relationships between tables using foreign key constraints to enforce referential integrity and maintain data consistency.",
    },
  },
  {
    id: "step3",
    type: "question",
    phase: "Step 3 of 4",
    paal: "Enhance data quality by adding `CHECK` constraints to enforce specific business rules. For the `loans` table, ensure the `loan_date` is not in the future and that `due_date` is not before `loan_date`. Also, add a `status` column to `loans` and `books` and enforce a limited set of valid values for these statuses.",
    hint: "Use `ALTER TABLE ADD COLUMN` to add the `status` columns, then `ALTER TABLE ADD CONSTRAINT` with `CHECK (condition)` for each rule. For status fields, use `IN ('value1', 'value2')`.",
    example_code: `
ALTER TABLE products
ADD COLUMN status VARCHAR(50) DEFAULT 'available';

ALTER TABLE products
ADD CONSTRAINT chk_product_status
CHECK (status IN ('available', 'out_of_stock', 'discontinued'));

ALTER TABLE orders
ADD CONSTRAINT chk_order_dates
CHECK (order_date <= ship_date);
`,
    think_prompt: "Which SQL statements correctly add `status` columns to `books` and `loans` tables with default values, and then define `CHECK` constraints for valid status values and date logic?",
    mc_options: [
      `
ALTER TABLE books ADD COLUMN status VARCHAR(50) DEFAULT 'available';
ALTER TABLE loans ADD COLUMN status VARCHAR(50) DEFAULT 'borrowed';

ALTER TABLE books ADD CONSTRAINT chk_book_status CHECK (status IN ('available', 'on_loan', 'archived'));
ALTER TABLE loans ADD CONSTRAINT chk_loan_status CHECK (status IN ('borrowed', 'returned', 'overdue'));
ALTER TABLE loans ADD CONSTRAINT chk_loan_dates CHECK (loan_date <= due_date);
`,
      `
ALTER TABLE books ADD COLUMN status TEXT;
ALTER TABLE loans ADD COLUMN status TEXT;

ALTER TABLE books ADD CONSTRAINT chk_book_status CHECK (status = 'available' OR status = 'on_loan');
ALTER TABLE loans ADD CONSTRAINT chk_loan_status CHECK (status = 'borrowed' OR status = 'returned');
ALTER TABLE loans ADD CONSTRAINT chk_loan_dates CHECK (loan_date < due_date);
`,
      `
ALTER TABLE books ADD COLUMN status VARCHAR(50) NOT NULL DEFAULT 'available';
ALTER TABLE loans ADD COLUMN status VARCHAR(50) NOT NULL DEFAULT 'borrowed';

ALTER TABLE books ADD CONSTRAINT chk_book_status CHECK (status IN ('available', 'on_loan', 'archived'));
ALTER TABLE loans ADD CONSTRAINT chk_loan_status CHECK (status IN ('borrowed', 'returned', 'overdue'));
ALTER TABLE loans ADD CONSTRAINT chk_loan_dates CHECK (loan_date <= CURRENT_DATE AND due_date >= loan_date);
`,
    ],
    mc_correct_option: `
ALTER TABLE books ADD COLUMN status VARCHAR(50) NOT NULL DEFAULT 'available';
ALTER TABLE loans ADD COLUMN status VARCHAR(50) NOT NULL DEFAULT 'borrowed';

ALTER TABLE books ADD CONSTRAINT chk_book_status CHECK (status IN ('available', 'on_loan', 'archived'));
ALTER TABLE loans ADD CONSTRAINT chk_loan_status CHECK (status IN ('borrowed', 'returned', 'overdue'));
ALTER TABLE loans ADD CONSTRAINT chk_loan_dates CHECK (loan_date <= CURRENT_DATE AND due_date >= loan_date);
`,
    mc_anchor: "The correct option adds `NOT NULL` status columns with sensible defaults, then defines `CHECK` constraints for valid status values and ensures logical date ordering, including a check for `loan_date` not being in the future.",
    why_this_matters: "Check constraints enforce domain-specific rules directly within the database, preventing invalid data from ever being stored. This adds an essential layer of data validation beyond what application logic might provide, ensuring consistency and reliability across all data operations.",
    answer_keywords: ["ALTER TABLE", "ADD COLUMN", "CHECK", "CONSTRAINT", "IN", "DEFAULT", "CURRENT_DATE"],
    seed_code: `
CREATE TABLE authors (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

CREATE TABLE books (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    publication_year INTEGER
);

CREATE TABLE members (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE
);

CREATE TABLE loans (
    id SERIAL PRIMARY KEY,
    loan_date DATE NOT NULL,
    due_date DATE,
    book_id INTEGER NOT NULL,
    member_id INTEGER NOT NULL
);

CREATE TABLE author_book (
    author_id INTEGER NOT NULL,
    book_id INTEGER NOT NULL
);

ALTER TABLE loans ADD CONSTRAINT fk_loan_book FOREIGN KEY (book_id) REFERENCES books (id);
ALTER TABLE loans ADD CONSTRAINT fk_loan_member FOREIGN KEY (member_id) REFERENCES members (id);

ALTER TABLE author_book ADD CONSTRAINT fk_author_book_author FOREIGN KEY (author_id) REFERENCES authors (id);
ALTER TABLE author_book ADD CONSTRAINT fk_author_book_book FOREIGN KEY (book_id) REFERENCES books (id);
`,
    starter_code: `
${`
CREATE TABLE authors (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

CREATE TABLE books (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    publication_year INTEGER
);

CREATE TABLE members (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE
);

CREATE TABLE loans (
    id SERIAL PRIMARY KEY,
    loan_date DATE NOT NULL,
    due_date DATE,
    book_id INTEGER NOT NULL,
    member_id INTEGER NOT NULL
);

CREATE TABLE author_book (
    author_id INTEGER NOT NULL,
    book_id INTEGER NOT NULL
);

ALTER TABLE loans ADD CONSTRAINT fk_loan_book FOREIGN KEY (book_id) REFERENCES books (id);
ALTER TABLE loans ADD CONSTRAINT fk_loan_member FOREIGN KEY (member_id) REFERENCES members (id);

ALTER TABLE author_book ADD CONSTRAINT fk_author_book_author FOREIGN KEY (author_id) REFERENCES authors (id);
ALTER TABLE author_book ADD CONSTRAINT fk_author_book_book FOREIGN KEY (book_id) REFERENCES books (id);
`}
-- Add 'status' column to books and loans tables with default values
-- Add CHECK constraints for valid status values for books and loans
-- Add CHECK constraint to loans for logical date ordering (loan_date not in future, due_date after loan_date)
`,
    feedback_correct: "Fantastic! You've successfully implemented `CHECK` constraints, adding a crucial layer of data validation directly into the database schema. This significantly improves data quality.",
    feedback_partial: "You've added some `CHECK` constraints, but you might have missed adding the `status` columns first, or some of the validation rules (like `loan_date` not being in the future or `due_date` being after `loan_date`) are incomplete. Review all the required constraints.",
    feedback_wrong: "Remember that `CHECK` constraints define rules for column values. You need to add the `status` columns to the tables before you can define constraints on them. Also, ensure your date logic correctly prevents future loan dates and ensures `due_date` is always after `loan_date`.",
    expected: `
CREATE TABLE authors (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

CREATE TABLE books (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    publication_year INTEGER,
    status VARCHAR(50) NOT NULL DEFAULT 'available'
);

CREATE TABLE members (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE
);

CREATE TABLE loans (
    id SERIAL PRIMARY KEY,
    loan_date DATE NOT NULL,
    due_date DATE,
    book_id INTEGER NOT NULL,
    member_id INTEGER NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'borrowed'
);

CREATE TABLE author_book (
    author_id INTEGER NOT NULL,
    book_id INTEGER NOT NULL
);

ALTER TABLE loans ADD CONSTRAINT fk_loan_book FOREIGN KEY (book_id) REFERENCES books (id);
ALTER TABLE loans ADD CONSTRAINT fk_loan_member FOREIGN KEY (member_id) REFERENCES members (id);

ALTER TABLE author_book ADD CONSTRAINT fk_author_book_author FOREIGN KEY (author_id) REFERENCES authors (id);
ALTER TABLE author_book ADD CONSTRAINT fk_author_book_book FOREIGN KEY (book_id) REFERENCES books (id);

ALTER TABLE books ADD CONSTRAINT chk_book_status CHECK (status IN ('available', 'on_loan', 'archived'));
ALTER TABLE loans ADD CONSTRAINT chk_loan_status CHECK (status IN ('borrowed', 'returned', 'overdue'));
ALTER TABLE loans ADD CONSTRAINT chk_loan_dates CHECK (loan_date <= CURRENT_DATE AND due_date >= loan_date);
`,
    analog_example: `
// In a programming language, implementing validation logic within a class or function.

enum BookStatus {
    Available = "available",
    OnLoan = "on_loan",
    Archived = "archived"
}

enum LoanStatus {
    Borrowed = "borrowed",
    Returned = "returned",
    Overdue = "overdue"
}

class Book {
    id: number;
    title: string;
    publicationYear?: number;
    status: BookStatus;

    constructor(id: number, title: string, status: BookStatus = BookStatus.Available, publicationYear?: number) {
        if (!Object.values(BookStatus).includes(status)) {
            throw new Error("Invalid book status.");
        }
        this.id = id;
        this.title = title;
        this.publicationYear = publicationYear;
        this.status = status;
    }
}

class Loan {
    id: number;
    loanDate: Date;
    dueDate: Date;
    bookId: number;
    memberId: number;
    status: LoanStatus;

    constructor(id: number, loanDate: Date, dueDate: Date, bookId: number, memberId: number, status: LoanStatus = LoanStatus.Borrowed) {
        if (loanDate > new Date()) {
            throw new Error("Loan date cannot be in the future.");
        }
        if (dueDate < loanDate) {
            throw new Error("Due date cannot be before loan date.");
        }
        if (!Object.values(LoanStatus).includes(status)) {
            throw new Error("Invalid loan status.");
        }
        this.id = id;
        this.loanDate = loanDate;
        this.dueDate = dueDate;
        this.bookId = bookId;
        this.memberId = memberId;
        this.status = status;
    }
}
`,
    deepDiveLabel: "How do CHECK constraints prevent invalid data at the source?",
    deepDive: {
      hook: `Imagine a form on a website where users can enter their birthdate. What if a user accidentally types a birthdate in the future? Or enters a negative age? While your application code might catch some of these errors, what if data is inserted directly into the database by an administrative script, a different microservice, or even a manual database edit? Without database-level validation, such invalid data could bypass your application's checks and corrupt your dataset. This leads to inconsistent data, broken business logic (e.g., calculating age from a future birthdate), and a general lack of trust in the information stored. Relying solely on application-level validation is like having a security guard at the front door but leaving the back door wide open.`,
      pain: `⚠️ **Lesson:** Without \`CHECK\` constraints, a database cannot enforce domain-specific business rules, allowing invalid data to be stored.
**Symptom:** Inconsistent data that violates business logic, application errors when processing invalid data, and a need for complex, redundant validation logic in every application interacting with the database.`,
      mentalModel: `**Mental model:** The "Quality Control Inspector" for your data. Just as a quality control inspector ensures that products meet certain standards before leaving the factory, \`CHECK\` constraints ensure that data meets predefined rules before it's allowed into the database. If a piece of data doesn't pass inspection (violates the constraint), it's rejected immediately, preventing faulty items from entering the system. This inspector works tirelessly, 24/7, for every single piece of data, regardless of its source.`,
      discover: `**Pattern - Adding CHECK Constraints:**
\`\`\`sql
ALTER TABLE table_name
ADD CONSTRAINT chk_constraint_name -- 1. Name the constraint
CHECK (
    column_name > 0 AND             -- 2. Numeric range check
    another_column IN ('value1', 'value2') AND -- 3. Enumerated values check
    date_column <= CURRENT_DATE     -- 4. Date comparison
);
\`\`\`
-   **1. \`ADD CONSTRAINT chk_constraint_name\`**: Provides a unique, descriptive name for the constraint, which is helpful for error messages and schema management.
-   **2. \`column_name > 0\`**: Enforces a numeric range. This could be \`age > 0\`, \`quantity >= 0\`, etc.
-   **3. \`another_column IN ('value1', 'value2')\`**: Restricts a column's values to a predefined set, similar to an enum in programming languages.
-   **4. \`date_column <= CURRENT_DATE\`**: Ensures a date column is not in the future. You can combine multiple conditions with \`AND\` or \`OR\`.`,
      quickRules: `**Quick rules:**
-   ✅ Use \`CHECK\` constraints for domain-specific business rules that must always hold true (e.g., age > 0, status in a list of valid values, start date before end date).
-   ✅ Name your \`CHECK\` constraints clearly to understand which rule was violated when an error occurs.
-   ✅ Combine multiple conditions using \`AND\` or \`OR\` within a single \`CHECK\` constraint for complex rules.
-   ✅ Leverage database functions like \`CURRENT_DATE\` or \`NOW()\` for dynamic date/time checks.
-   ❌ Do not rely solely on application-level validation for critical business rules; database constraints provide a stronger guarantee.
-   ❌ Avoid overly complex \`CHECK\` constraints that are difficult to read or maintain; sometimes, a trigger or a separate validation layer is more appropriate.
-   ❌ Do not use \`CHECK\` constraints for uniqueness (use \`UNIQUE\` constraints or \`PRIMARY KEY\`) or referential integrity (use \`FOREIGN KEY\`).`,
      watchOut: `👀 **Watch out:** When adding \`CHECK\` constraints to tables that already contain data, the constraint will immediately be validated against all existing rows. If any existing row violates the new constraint, the \`ALTER TABLE\` command will fail. You might need to clean up or migrate existing data before applying the constraint. Also, be aware that \`CHECK\` constraints can impact write performance, especially if they involve complex calculations or subqueries (though simple checks are usually fast).`,
      dryRun: `🔁 **Think:** A new loan is attempted with an invalid status and future date.
1.  **\`INSERT INTO loans (loan_date, due_date, book_id, member_id, status) VALUES ('2025-01-01', '2025-01-15', 1, 1, 'pending');\`**
    *   The database receives the request.
    *   It first checks \`chk_loan_status\`. \`status\` value 'pending' is not in \`('borrowed', 'returned', 'overdue')\`.
    *   Constraint violation: \`chk_loan_status\` fails. The insertion is immediately rejected.
    *   (If \`status\` was valid, it would then check \`chk_loan_dates\`).
2.  **\`INSERT INTO loans (loan_date, due_date, book_id, member_id, status) VALUES ('2024-03-01', '2024-02-28', 1, 1, 'borrowed');\`** (Assume current date is after 2024-03-01)
    *   The database receives the request.
    *   \`chk_loan_status\` passes ('borrowed' is valid).
    *   It checks \`chk_loan_dates\`. \`loan_date <= CURRENT_DATE\` passes. \`due_date >= loan_date\` (2024-02-28 >= 2024-03-01) fails.
    *   Constraint violation: \`chk_loan_dates\` fails. The insertion is rejected.
(Hint: Notice how the database validates against multiple rules and rejects the operation at the first violation.)`,
      build: "**Learning focus:** Implement `CHECK` constraints to enforce specific business rules and validate data values directly within the database schema.",
    },
  },
  {
    id: "step4",
    type: "question",
    phase: "Step 4 of 4",
    paal: "Finally, add unique indexes to improve query performance and enforce uniqueness where appropriate. For the `author_book` join table, ensure that each author-book pair is unique. Also, add a regular index to `loans.due_date` for faster lookup of overdue books.",
    hint: "Use `CREATE UNIQUE INDEX index_name ON table_name (column_name)` for uniqueness, and `CREATE INDEX index_name ON table_name (column_name)` for performance. For `author_book`, the unique index should be on both `author_id` and `book_id`.",
    example_code: `
CREATE UNIQUE INDEX idx_user_email ON users (email);
CREATE INDEX idx_posts_created_at ON posts (created_at);
CREATE UNIQUE INDEX idx_order_product ON order_items (order_id, product_id);
`,
    think_prompt: "Which SQL statements correctly add a unique index to the `author_book` table and a non-unique index to `loans.due_date`?",
    mc_options: [
      `
CREATE INDEX unique_author_book ON author_book (author_id, book_id);
CREATE UNIQUE INDEX idx_loans_due_date ON loans (due_date);
`,
      `
ALTER TABLE author_book ADD UNIQUE (author_id, book_id);
CREATE INDEX idx_loans_due_date ON loans (due_date);
`,
      `
CREATE UNIQUE INDEX unique_author_book ON author_book (author_id, book_id);
CREATE INDEX idx_loans_due_date ON loans (due_date);
`,
    ],
    mc_correct_option: `
CREATE UNIQUE INDEX unique_author_book ON author_book (author_id, book_id);
CREATE INDEX idx_loans_due_date ON loans (due_date);
`,
    mc_anchor: "The correct option uses `CREATE UNIQUE INDEX` for the composite key on `author_book` to enforce uniqueness and `CREATE INDEX` for `loans.due_date` to improve query performance.",
    why_this_matters: "Indexes are crucial for database performance, allowing the database to quickly locate data without scanning entire tables. Unique indexes also enforce data uniqueness, preventing duplicate entries in specified columns or combinations of columns, which is essential for maintaining data integrity and consistency.",
    answer_keywords: ["CREATE UNIQUE INDEX", "CREATE INDEX", "ON", "composite index", "performance"],
    seed_code: `
CREATE TABLE authors (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

CREATE TABLE books (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    publication_year INTEGER,
    status VARCHAR(50) NOT NULL DEFAULT 'available'
);

CREATE TABLE members (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE
);

CREATE TABLE loans (
    id SERIAL PRIMARY KEY,
    loan_date DATE NOT NULL,
    due_date DATE,
    book_id INTEGER NOT NULL,
    member_id INTEGER NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'borrowed'
);

CREATE TABLE author_book (
    author_id INTEGER NOT NULL,
    book_id INTEGER NOT NULL
);

ALTER TABLE loans ADD CONSTRAINT fk_loan_book FOREIGN KEY (book_id) REFERENCES books (id);
ALTER TABLE loans ADD CONSTRAINT fk_loan_member FOREIGN KEY (member_id) REFERENCES members (id);

ALTER TABLE author_book ADD CONSTRAINT fk_author_book_author FOREIGN KEY (author_id) REFERENCES authors (id);
ALTER TABLE author_book ADD CONSTRAINT fk_author_book_book FOREIGN KEY (book_id) REFERENCES books (id);

ALTER TABLE books ADD CONSTRAINT chk_book_status CHECK (status IN ('available', 'on_loan', 'archived'));
ALTER TABLE loans ADD CONSTRAINT chk_loan_status CHECK (status IN ('borrowed', 'returned', 'overdue'));
ALTER TABLE loans ADD CONSTRAINT chk_loan_dates CHECK (loan_date <= CURRENT_DATE AND due_date >= loan_date);
`,
    starter_code: `
${`
CREATE TABLE authors (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

CREATE TABLE books (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    publication_year INTEGER,
    status VARCHAR(50) NOT NULL DEFAULT 'available'
);

CREATE TABLE members (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE
);

CREATE TABLE loans (
    id SERIAL PRIMARY KEY,
    loan_date DATE NOT NULL,
    due_date DATE,
    book_id INTEGER NOT NULL,
    member_id INTEGER NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'borrowed'
);

CREATE TABLE author_book (
    author_id INTEGER NOT NULL,
    book_id INTEGER NOT NULL
);

ALTER TABLE loans ADD CONSTRAINT fk_loan_book FOREIGN KEY (book_id) REFERENCES books (id);
ALTER TABLE loans ADD CONSTRAINT fk_loan_member FOREIGN KEY (member_id) REFERENCES members (id);

ALTER TABLE author_book ADD CONSTRAINT fk_author_book_author FOREIGN KEY (author_id) REFERENCES authors (id);
ALTER TABLE author_book ADD CONSTRAINT fk_author_book_book FOREIGN KEY (book_id) REFERENCES books (id);

ALTER TABLE books ADD CONSTRAINT chk_book_status CHECK (status IN ('available', 'on_loan', 'archived'));
ALTER TABLE loans ADD CONSTRAINT chk_loan_status CHECK (status IN ('borrowed', 'returned', 'overdue'));
ALTER TABLE loans ADD CONSTRAINT chk_loan_dates CHECK (loan_date <= CURRENT_DATE AND due_date >= loan_date);
`}
-- Add a unique index to the author_book join table
-- Add a regular index to loans.due_date for performance
`,
    feedback_correct: "Excellent! You've successfully added both a unique composite index and a regular index. This completes the robust schema definition, ensuring both data integrity and efficient querying.",
    feedback_partial: "You've added an index, but check if it's the correct type (unique vs. non-unique) or if it covers all the necessary columns for the `author_book` table. Remember that `author_book` needs a unique index on *both* columns.",
    feedback_wrong: "Review the difference between `CREATE UNIQUE INDEX` and `CREATE INDEX`. The `author_book` table requires a unique index across both `author_id` and `book_id` to prevent duplicate pairings. Also, ensure you're indexing `loans.due_date` for performance, not uniqueness.",
    expected: `
CREATE TABLE authors (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

CREATE TABLE books (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    publication_year INTEGER,
    status VARCHAR(50) NOT NULL DEFAULT 'available'
);

CREATE TABLE members (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE
);

CREATE TABLE loans (
    id SERIAL PRIMARY KEY,
    loan_date DATE NOT NULL,
    due_date DATE,
    book_id INTEGER NOT NULL,
    member_id INTEGER NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'borrowed'
);

CREATE TABLE author_book (
    author_id INTEGER NOT NULL,
    book_id INTEGER NOT NULL
);

ALTER TABLE loans ADD CONSTRAINT fk_loan_book FOREIGN KEY (book_id) REFERENCES books (id);
ALTER TABLE loans ADD CONSTRAINT fk_loan_member FOREIGN KEY (member_id) REFERENCES members (id);

ALTER TABLE author_book ADD CONSTRAINT fk_author_book_author FOREIGN KEY (author_id) REFERENCES authors (id);
ALTER TABLE author_book ADD CONSTRAINT fk_author_book_book FOREIGN KEY (book_id) REFERENCES books (id);

ALTER TABLE books ADD CONSTRAINT chk_book_status CHECK (status IN ('available', 'on_loan', 'archived'));
ALTER TABLE loans ADD CONSTRAINT chk_loan_status CHECK (status IN ('borrowed', 'returned', 'overdue'));
ALTER TABLE loans ADD CONSTRAINT chk_loan_dates CHECK (loan_date <= CURRENT_DATE AND due_date >= loan_date);

CREATE UNIQUE INDEX unique_author_book ON author_book (author_id, book_id);
CREATE INDEX idx_loans_due_date ON loans (due_date);
`,
    analog_example: `
// In a programming language, using a Map or Set for unique key lookups and efficient data access.

class Author { /* ... */ }
class Book { /* ... */ }
class Member { /* ... */ }
class Loan { /* ... */ }

// Simulating a unique composite index for author-book relationships
class UniqueAuthorBookRegistry {
    private relationships: Set<string>; // Stores "authorId-bookId" strings for uniqueness

    constructor() {
        this.relationships = new Set();
    }

    addRelationship(authorId: number, bookId: number): boolean {
        const key = \`\${authorId}-\${bookId}\`;
        if (this.relationships.has(key)) {
            console.warn(\`Relationship (\${authorId}, \${bookId}) already exists. Not adding duplicate.\`);
            return false;
        }
        this.relationships.add(key);
        return true;
    }

    hasRelationship(authorId: number, bookId: number): boolean {
        return this.relationships.has(\`\${authorId}-\${bookId}\`);
    }
}

// Simulating an index for faster lookup of loans by due date
class LoanManager {
    private loans: Loan[];
    private loansByDueDate: Map<string, Loan[]>; // Map<"YYYY-MM-DD", Loan[]> for fast lookup

    constructor(initialLoans: Loan[] = []) {
        this.loans = [];
        this.loansByDueDate = new Map();
        initialLoans.forEach(loan => this.addLoan(loan));
    }

    addLoan(loan: Loan): void {
        this.loans.push(loan);
        const dateKey = loan.dueDate.toISOString().split('T')[0]; // "YYYY-MM-DD"
        if (!this.loansByDueDate.has(dateKey)) {
            this.loansByDueDate.set(dateKey, []);
        }
        this.loansByDueDate.get(dateKey)?.push(loan);
    }

    getLoansDueOn(date: Date): Loan[] {
        const dateKey = date.toISOString().split('T')[0];
        return this.loansByDueDate.get(dateKey) || [];
    }
}
`,
    deepDiveLabel: "How do indexes speed up queries and enforce uniqueness?",
    deepDive: {
      hook: `Imagine you have a physical dictionary with millions of words, but it's not alphabetized. If you wanted to find the definition of "ubiquitous," you'd have to read through every single word from the beginning until you found it. This would take an incredibly long time. Now, imagine the same dictionary, but it *is* alphabetized. You can quickly flip to the 'U' section, then the 'Ub' section, and find "ubiquitous" almost instantly. This is precisely the difference between querying a table without an index and querying one with an index. Without an index, the database has to perform a "full table scan," checking every single row. With an index, it can jump directly to the relevant data, dramatically reducing query time. For uniqueness, imagine trying to ensure no two people have the exact same name and address in a phone book without any sorting or unique identifier; it would be nearly impossible to prevent duplicates.`,
      pain: `⚠️ **Lesson:** Without proper indexing, database queries can be extremely slow, and enforcing uniqueness for non-primary key columns becomes difficult or impossible.
**Symptom:** Slow application performance, long loading times for data-intensive pages, and the inability to guarantee that certain data combinations (e.g., an author-book pair) are truly unique.`,
      mentalModel: `**Mental model:** The "Book Index" and "Unique ID Card." A book's index (at the back) doesn't contain all the content, but it tells you exactly which pages to go to for specific topics, saving you from reading the whole book. This is how a regular index works for query performance. A "Unique ID Card" (like a passport or driver's license) guarantees that no two people have the same unique identifier. This is how a unique index works, ensuring that a specific column or combination of columns holds only distinct values.`,
      discover: `**Pattern - Creating Indexes:**
\`\`\`sql
-- Regular index for query performance
CREATE INDEX idx_table_column ON table_name (column_name);

-- Unique index for uniqueness and performance
CREATE UNIQUE INDEX uidx_table_column ON table_name (column_name);

-- Composite unique index for uniqueness across multiple columns
CREATE UNIQUE INDEX uidx_table_col1_col2 ON table_name (column_name_1, column_name_2);
\`\`\`
-   **\`CREATE INDEX\`**: Creates a non-unique index. Useful for columns frequently used in \`WHERE\` clauses, \`ORDER BY\` clauses, or \`JOIN\` conditions.
-   **\`CREATE UNIQUE INDEX\`**: Creates an index that also enforces that all values in the indexed column(s) are unique. If you try to insert a duplicate value, the database will reject it.
-   **\`ON table_name (column_name)\`**: Specifies the table and the column(s) to be indexed. For composite indexes, list multiple columns.
-   **Composite Index**: An index on multiple columns (e.g., \`(author_id, book_id)\`). This is efficient for queries that filter or sort by these columns together.`,
      quickRules: `**Quick rules:**
-   ✅ Create indexes on columns frequently used in \`WHERE\` clauses, \`JOIN\` conditions, and \`ORDER BY\` clauses.
-   ✅ Use \`CREATE UNIQUE INDEX\` when you need to enforce uniqueness on a column or combination of columns that are not the primary key.
-   ✅ Consider composite indexes for queries that filter or sort by multiple columns together.
-   ✅ Regularly review query performance and add/remove indexes as needed based on actual usage patterns.
-   ❌ Do not over-index your tables; every index adds overhead to write operations (INSERT, UPDATE, DELETE) and consumes disk space.
-   ❌ Avoid indexing columns with very low cardinality (e.g., a boolean column with only two values) unless they are part of a composite index.
-   ❌ Do not create redundant indexes (e.g., an index on \`(A, B)\` and another on \`(A)\` if queries primarily use \`(A, B)\`).`,
      watchOut: `👀 **Watch out:** While indexes dramatically improve read performance, they come at a cost. Every time data is inserted, updated, or deleted in an indexed column, the index itself must also be updated. This adds overhead to write operations. Therefore, it's crucial to strike a balance: index what's necessary for performance, but avoid excessive indexing. Also, be aware that the order of columns in a composite index matters for query optimization; an index on \`(A, B)\` is not the same as \`(B, A)\` for all query patterns.`,
      dryRun: `🔁 **Think:** An attempt is made to add a duplicate author-book relationship.
1.  **\`INSERT INTO author_book (author_id, book_id) VALUES (1, 101);\`** (Assume this is the first time this pair is inserted)
    *   The database receives the request.
    *   It checks the \`unique_author_book\` index on \`(author_id, book_id)\`.
    *   The combination \`(1, 101)\` is not found in the index.
    *   The row is successfully inserted, and the index is updated to include \`(1, 101)\`.
2.  **\`INSERT INTO author_book (author_id, book_id) VALUES (1, 101);\`** (Attempting to insert the same pair again)
    *   The database receives the request.
    *   It checks the \`unique_author_book\` index on \`(author_id, book_id)\`.
    *   The combination \`(1, 101)\` is *already found* in the index.
    *   Constraint violation: The unique index prevents the insertion of duplicate values. The operation fails.
(Hint: Observe how the unique index prevents data duplication and how a regular index would behave differently.)`,
      build: "**Learning focus:** Implement unique and non-unique indexes to enforce data uniqueness and significantly improve database query performance.",
    },
  },
];

const sideItems = [
  { label: "Lesson", id: "intro" },
  { label: "Objectives", id: "objectives" },
  { label: "Step 1: Tables", id: "step1" },
  { label: "Step 2: Foreign Keys", id: "step2" },
  { label: "Step 3: Check Constraints", id: "step3" },
  { label: "Step 4: Indexes", id: "step4" },
];

export default createINPACTEngine({
  NODES,
  sideItems,
  lessonNum: 0,
  title: "Database Schema Migrations",
  shortName: "DB Migrations",
});
