import createINPACTEngine from "../inpact_engine_shared";

export const NODES = [
  {
    id: "intro",
    type: "reveal",
    phase: "Lesson",
    content: {
      tag: "define-entity-with-conversion-unit",
      title: "Defining Entities with Normalized Units and Constraints",
      body: `When building applications that deal with quantities, such as measurements, ingredients, or inventory levels, a common challenge arises: how to store these quantities consistently when they might be expressed in various units (e.g., "grams," "kilograms," "pounds"). This pattern addresses the problem of maintaining data integrity and simplifying calculations by establishing a base unit for each entity and providing conversion factors for alternative units. It ensures that all quantities can be normalized to a common internal representation, preventing errors from mixed units and making data aggregation and analysis straightforward.

This robust pattern is crucial in many systems where precise measurements and data consistency are paramount. You'll encounter it in settings panels where users define custom units for display, in data ingestion pipelines that normalize incoming measurements from different sources, or in inventory management systems tracking diverse items with varying packaging sizes. Any time an application needs to handle quantities that might be expressed in different units but require consistent internal storage and processing, this underlying structure provides a reliable and scalable solution.`,
      usecase:
        "A system that allows users to define various types of items, each with a primary unit of measure (e.g., 'length' measured in 'meters') and potentially alternative units (e.g., 'feet,' 'inches') along with their conversion factors to the primary unit.",
    },
  },
  {
    id: "objectives",
    type: "objectives",
    phase: "Objectives",
    items: [
      "Understand the importance of normalized units for data consistency.",
      "Define a database table with required and optional fields.",
      "Apply `NOT NULL` constraints for essential data integrity.",
      "Implement `CHECK` constraints to validate data values conditionally.",
    ],
  },
  {
    id: "step1",
    type: "question",
    phase: "Step 1 of 5",
    paal: "To begin, we need to establish the foundational structure for our entity. This involves creating a new table and defining a unique identifier for each record.",
    hint: "Remember the basic SQL command for creating a table and specifying a primary key.",
    example_code: "CREATE TABLE items (\n  id INTEGER PRIMARY KEY\n);",
    think_prompt:
      "What is the fundamental SQL statement for creating a new table, and how do you define a column that uniquely identifies each row?",
    mc_options: [
      "CREATE TABLE items (id INT);",
      "CREATE TABLE items (id INTEGER PRIMARY KEY);",
      "ADD TABLE items (id INT UNIQUE);",
    ],
    mc_correct_option: "CREATE TABLE items (id INTEGER PRIMARY KEY);",
    mc_anchor: "CREATE TABLE items (id INTEGER PRIMARY KEY);",
    why_this_matters:
      "A primary key is essential for uniquely identifying each record, enabling efficient data retrieval, updates, and relationships with other tables.",
    answer_keywords: ["CREATE TABLE", "PRIMARY KEY", "id"],
    seed_code: "",
    starter_code: "-- Your code here",
    feedback_correct:
      "Excellent! Defining `id INTEGER PRIMARY KEY` correctly sets up the unique identifier for each entity.",
    feedback_partial:
      "You've started the table creation, but the `id` column needs to be explicitly marked as a `PRIMARY KEY` to ensure uniqueness and optimize lookups.",
    feedback_wrong:
      "While `INT` is a valid type, `PRIMARY KEY` is crucial for uniquely identifying records and is missing here.",
    expected: "CREATE TABLE items (\n  id INTEGER PRIMARY KEY\n);",
    analog_example: `CREATE TABLE users (
  user_id INTEGER PRIMARY KEY
);`,
    deepDiveLabel: "Why are primary keys so important?",
    deepDive: {
      hook: "Imagine a library where every book has a title, author, and publication year, but no unique identifier. If two books have the exact same title and author, how would you distinguish them? How would you tell a librarian to fetch 'the red book by Smith' if there are five identical red books by Smith? Without a unique identifier, updating a specific book's status (e.g., 'checked out') becomes a nightmare, and linking it to a borrower record is impossible. Data becomes ambiguous, operations are inefficient, and the entire system quickly breaks down.",
      pain: "⚠️ **Lesson:** Without a primary key, database records lack a guaranteed unique identifier. Symptom: Ambiguous data, difficulty in updating or retrieving specific records, inability to establish reliable relationships between tables, and poor query performance.",
      mentalModel:
        "**Mental model:** The 'Social Security Number' of a record. Just as every person in a country might have a unique SSN (or similar ID) to distinguish them from others, even if they share a name or birthdate, a primary key serves the same purpose for a database row. It's the one piece of information you can always rely on to point to *that specific* record and no other. It's the ultimate reference point.",
      discover: `\`\`\`sql
CREATE TABLE products (
  product_id INTEGER PRIMARY KEY, -- 1. Uniquely identifies each product
  name VARCHAR(255) NOT NULL,    -- 2. Product name
  price DECIMAL(10, 2)           -- 3. Product price
);
\`\`\`
- \`PRIMARY KEY\`: A constraint that ensures all values in the column are unique and not null. A table can have only one primary key.
- \`INTEGER\`: A common data type for whole numbers, often used for IDs.
- \`id\`: A conventional name for the primary key column.
- \`CREATE TABLE\`: The SQL command to define a new table in the database schema.`,
      quickRules: `**Quick rules:**
- ✅ Always define a primary key for every table.
- ✅ Use an auto-incrementing integer type for primary keys when possible (e.g., \`SERIAL\` in PostgreSQL, \`AUTO_INCREMENT\` in MySQL).
- ✅ Primary keys should be stable and never change.
- ✅ Primary keys should be simple, typically a single column.
- ❌ Never use data that might change (like a name or email) as a primary key.
- ❌ Never allow primary key columns to be null.
- ❌ Avoid composite primary keys unless absolutely necessary.`,
      watchOut:
        "👀 **Watch out:** While `UNIQUE` also ensures uniqueness, `PRIMARY KEY` additionally implies `NOT NULL` and is the designated identifier for the table, often used by the database engine for indexing and foreign key relationships. Don't confuse `UNIQUE` with `PRIMARY KEY`.",
      dryRun: `🔁 **Think:**
1.  \`CREATE TABLE users (user_id INTEGER PRIMARY KEY);\` is executed.
2.  A new table named \`users\` is created in the database.
3.  It has one column, \`user_id\`, which is set to store integers.
4.  The \`PRIMARY KEY\` constraint is applied to \`user_id\`, meaning every value inserted into this column *must* be unique and *cannot* be \`NULL\`.
5.  Attempting to \`INSERT INTO users (user_id) VALUES (1);\` succeeds.
6.  Attempting to \`INSERT INTO users (user_id) VALUES (1);\` again will fail due to the \`PRIMARY KEY\` constraint violation.
(Hint: What properties does \`PRIMARY KEY\` enforce on the \`user_id\` column?)`,
      build:
        "**Learning focus:** Create the basic table structure and define a unique identifier for each record.",
    },
  },
  {
    id: "step2",
    type: "question",
    phase: "Step 2 of 5",
    paal: "Now, let's ensure each entity has a descriptive name. This name is crucial for identification and must always be present.",
    hint: "How do you define a text column that cannot be empty?",
    example_code: "ALTER TABLE items\nADD COLUMN name VARCHAR(255) NOT NULL;",
    think_prompt:
      "What SQL command is used to add a new column to an existing table, and how do you specify that this column must always contain a string value and cannot be null?",
    mc_options: [
      "MODIFY TABLE items ADD name TEXT;",
      "ALTER TABLE items ADD COLUMN name VARCHAR(255) NOT NULL;",
      "UPDATE items SET name = '';",
    ],
    mc_correct_option: "ALTER TABLE items ADD COLUMN name VARCHAR(255) NOT NULL;",
    mc_anchor: "ALTER TABLE items ADD COLUMN name VARCHAR(255) NOT NULL;",
    why_this_matters:
      "Requiring a name ensures that every entity is clearly identifiable and prevents records from being created without essential descriptive information.",
    answer_keywords: ["ALTER TABLE", "ADD COLUMN", "VARCHAR", "NOT NULL"],
    seed_code: "CREATE TABLE items (\n  id INTEGER PRIMARY KEY\n);",
    starter_code:
      "CREATE TABLE items (\n  id INTEGER PRIMARY KEY\n);\n\n-- Your code here",
    feedback_correct:
      "Exactly right! `ALTER TABLE ADD COLUMN name VARCHAR(255) NOT NULL` correctly adds a required string column.",
    feedback_partial:
      "You're on the right track with `ALTER TABLE`, but remember to specify the column type and the `NOT NULL` constraint to make it mandatory.",
    feedback_wrong:
      "`UPDATE` is for modifying existing data, not for changing the table structure. You need to `ALTER` the table.",
    expected:
      "CREATE TABLE items (\n  id INTEGER PRIMARY KEY,\n  name VARCHAR(255) NOT NULL\n);",
    analog_example: `ALTER TABLE users
ADD COLUMN username VARCHAR(50) NOT NULL UNIQUE;`,
    deepDiveLabel: "What's the difference between `VARCHAR` and `TEXT`?",
    deepDive: {
      hook: "Imagine you're designing a database for a social media platform. You need to store user bios. Some users write a single sentence, others write a paragraph, and a few might write a short essay. If you pick a fixed-size field like `CHAR(100)`, longer bios get truncated, and shorter ones waste space. If you pick an arbitrary large `VARCHAR(65535)`, it works, but what about performance? Or if you just use `TEXT`, what are the implications? Choosing the right string type impacts storage efficiency, performance, and data integrity.",
      pain: "⚠️ **Lesson:** Incorrect string data type selection leads to wasted storage, truncated data, or suboptimal query performance. Symptom: Database bloat, unexpected data loss, or slow operations on text fields.",
      mentalModel:
        "**Mental model:** `VARCHAR` is like a flexible-sized box with a maximum capacity you define (e.g., a 'small box, max 255 items'). `TEXT` is like a much larger, often unbounded, flexible-sized container (e.g., a 'warehouse shelf, practically unlimited items'). Both adapt to the actual content size, but `VARCHAR` has a more explicit, often smaller, upper limit, which can sometimes allow for in-row storage optimizations.",
      discover: `\`\`\`sql
CREATE TABLE posts (
  id INTEGER PRIMARY KEY,
  title VARCHAR(255) NOT NULL, -- 1. Good for short, fixed-max-length strings
  content TEXT                 -- 2. Good for potentially very long strings
);
\`\`\`
- \`VARCHAR(N)\`: Stores variable-length strings up to \`N\` characters. \`N\` is a required maximum length. Efficiently uses space.
- \`TEXT\`: Stores variable-length strings of potentially very large size. The maximum length is typically much larger than \`VARCHAR\` and often implementation-dependent.
- \`NOT NULL\`: A constraint ensuring that the column cannot contain \`NULL\` values.
- \`ALTER TABLE ... ADD COLUMN\`: The command to add a new column to an existing table.`,
      quickRules: `**Quick rules:**
- ✅ Use \`VARCHAR(N)\` for strings with a known, reasonable maximum length (e.g., names, emails, short descriptions).
- ✅ Use \`TEXT\` for potentially very long strings where the maximum length is unknown or extremely large (e.g., article bodies, comments, JSON blobs).
- ✅ Always specify \`NOT NULL\` for columns that must contain data.
- ✅ Choose \`N\` for \`VARCHAR\` carefully, balancing potential future growth with storage efficiency.
- ❌ Don't use \`CHAR(N)\` unless you truly need fixed-length strings and are okay with padding.
- ❌ Don't use \`TEXT\` for short strings if \`VARCHAR(N)\` is sufficient, as \`TEXT\` might have different storage characteristics (e.g., out-of-row storage).
- ❌ Never omit \`NOT NULL\` for essential fields that should always have a value.`,
      watchOut:
        "👀 **Watch out:** While `VARCHAR` and `TEXT` both store variable-length strings, `TEXT` often implies that the data might be stored 'out-of-row' if it exceeds a certain size, which can have performance implications for very frequent access compared to `VARCHAR` which is often stored directly within the row up to its limit.",
      dryRun: `🔁 **Think:**
1.  \`CREATE TABLE products (id INTEGER PRIMARY KEY);\` is executed.
2.  \`ALTER TABLE products ADD COLUMN name VARCHAR(100) NOT NULL;\` is executed.
3.  The \`products\` table now has \`id\` (PK) and \`name\` (VARCHAR(100) NOT NULL).
4.  \`INSERT INTO products (id, name) VALUES (1, 'Widget');\` succeeds.
5.  \`INSERT INTO products (id) VALUES (2);\` will fail because \`name\` is \`NOT NULL\` and no value was provided.
6.  \`INSERT INTO products (id, name) VALUES (3, NULL);\` will also fail because \`name\` is \`NOT NULL\`.
(Hint: What happens if you try to insert a row without a value for \`name\`?)`,
      build: "**Learning focus:** Add a mandatory descriptive name to the entity.",
    },
  },
  {
    id: "step3",
    type: "question",
    phase: "Step 3 of 5",
    paal: "To enable consistent quantity handling, each entity needs a designated default unit of measure. This unit will be the baseline for all conversions and must always be specified.",
    hint: "Similar to the name, this column needs to be a string and cannot be null.",
    example_code:
      "ALTER TABLE items\nADD COLUMN default_unit VARCHAR(50) NOT NULL;",
    think_prompt:
      "How do you add another mandatory string column to the table, specifically for the default unit?",
    mc_options: [
      "ADD default_unit VARCHAR(50);",
      "ALTER TABLE items ADD default_unit VARCHAR(50) NOT NULL;",
      "CREATE COLUMN default_unit VARCHAR(50) NOT NULL;",
    ],
    mc_correct_option: "ALTER TABLE items ADD default_unit VARCHAR(50) NOT NULL;",
    mc_anchor: "ALTER TABLE items ADD default_unit VARCHAR(50) NOT NULL;",
    why_this_matters:
      "Establishing a `default_unit` is fundamental for normalizing quantities. It provides a consistent base for calculations and comparisons across different items.",
    answer_keywords: ["ALTER TABLE", "ADD COLUMN", "VARCHAR", "NOT NULL", "default_unit"],
    seed_code:
      "CREATE TABLE items (\n  id INTEGER PRIMARY KEY,\n  name VARCHAR(255) NOT NULL\n);",
    starter_code:
      "CREATE TABLE items (\n  id INTEGER PRIMARY KEY,\n  name VARCHAR(255) NOT NULL\n);\n\n-- Your code here",
    feedback_correct:
      "Perfect! Adding `default_unit VARCHAR(50) NOT NULL` ensures every item has a required base unit.",
    feedback_partial:
      "You've identified the column and type, but don't forget the `NOT NULL` constraint to make it mandatory.",
    feedback_wrong:
      "`CREATE COLUMN` is not a valid SQL command for adding a column to an existing table. You need to `ALTER` the table.",
    expected:
      "CREATE TABLE items (\n  id INTEGER PRIMARY KEY,\n  name VARCHAR(255) NOT NULL,\n  default_unit VARCHAR(50) NOT NULL\n);",
    analog_example: `ALTER TABLE users
ADD COLUMN email VARCHAR(255) NOT NULL UNIQUE;`,
    deepDiveLabel: "What are the best practices for naming columns?",
    deepDive: {
      hook: "Imagine joining a new project where the database columns are named `usr_nm`, `df_unt`, `cnv_fct`. Or worse, `user_name`, `defaultunit`, `conversionfactor`. Some use camelCase, others snake_case, some abbreviations, some full words. When you need to write a complex query involving multiple tables, inconsistent naming conventions become a cognitive burden. You spend more time deciphering names than understanding the logic, leading to errors, slower development, and frustration for anyone interacting with the database.",
      pain: "⚠️ **Lesson:** Inconsistent or unclear column naming conventions hinder readability, maintainability, and collaboration. Symptom: Confusion, increased error rates in queries, and a steep learning curve for new team members.",
      mentalModel:
        "**Mental model:** Column names are like the labels on filing cabinet drawers. If some drawers are labeled 'Customer Name,' others 'Cust. Nm,' and a third 'ClientFullName,' finding what you need becomes a chore. A consistent labeling system (e.g., always 'customer_name') makes it intuitive to locate information, even if you've never seen that specific drawer before. It's about predictability and clarity.",
      discover: `\`\`\`sql
CREATE TABLE orders (
  order_id INTEGER PRIMARY KEY,        -- 1. Use snake_case for multi-word names
  customer_name VARCHAR(255) NOT NULL, -- 2. Be descriptive and avoid abbreviations
  order_date DATE,                     -- 3. Use singular nouns for column names
  total_amount DECIMAL(10, 2)          -- 4. Be consistent across the entire schema
);
\`\`\`
- Use \`snake_case\` (e.g., \`default_unit\`, \`conversion_factor\`) for multi-word column names.
- Be descriptive and avoid overly cryptic abbreviations.
- Use singular nouns for column names (e.g., \`unit\`, not \`units\`).
- Be consistent with data types and constraints (e.g., \`VARCHAR\` for text, \`NOT NULL\` for required fields).`,
      quickRules: `**Quick rules:**
- ✅ Use \`snake_case\` for all column names (e.g., \`first_name\`).
- ✅ Use singular nouns for column names (e.g., \`product_id\`, not \`product_ids\`).
- ✅ Be descriptive and avoid unnecessary abbreviations (e.g., \`default_unit\` is better than \`df_unt\`).
- ✅ Keep names concise but clear.
- ❌ Avoid \`camelCase\` or \`PascalCase\` in SQL column names.
- ❌ Don't use reserved keywords as column names (e.g., \`SELECT\`, \`ORDER\`).
- ❌ Never use spaces or special characters in column names.`,
      watchOut:
        "👀 **Watch out:** While some databases allow mixed-case names or spaces if quoted, it's a bad practice that leads to portability issues and requires quoting every time you reference the column, which is error-prone. Stick to lowercase `snake_case`.",
      dryRun: `🔁 **Think:**
1.  \`CREATE TABLE products (id INTEGER PRIMARY KEY, name VARCHAR(255) NOT NULL);\` is executed.
2.  \`ALTER TABLE products ADD COLUMN category VARCHAR(50) NOT NULL;\` is executed.
3.  The \`products\` table now has \`id\`, \`name\`, and \`category\`. All are \`NOT NULL\` except \`id\` which is \`PRIMARY KEY\` (implicitly \`NOT NULL\`).
4.  \`INSERT INTO products (id, name, category) VALUES (1, 'Laptop', 'Electronics');\` succeeds.
5.  \`INSERT INTO products (id, name) VALUES (2, 'Mouse');\` will fail because \`category\` is \`NOT NULL\` and no value was provided.
(Hint: What happens if you try to insert a row without a value for the new \`category\` column?)`,
      build:
        "**Learning focus:** Add a mandatory default unit of measure to the entity.",
    },
  },
  {
    id: "step4",
    type: "question",
    phase: "Step 4 of 5",
    paal: "Some entities might have alternative units that require a conversion factor to the `default_unit`. This factor is optional, as not all entities will have alternative units.",
    hint: "How do you define a decimal number column that can be left empty?",
    example_code:
      "ALTER TABLE items\nADD COLUMN conversion_factor DECIMAL(10, 4);",
    think_prompt:
      "What data type is suitable for storing decimal numbers, and how do you make a column optional (allowing it to be null)?",
    mc_options: [
      "ADD conversion_factor FLOAT;",
      "ALTER TABLE items ADD COLUMN conversion_factor DECIMAL(10, 4);",
      "ALTER TABLE items ADD COLUMN conversion_factor INT NULL;",
    ],
    mc_correct_option: "ALTER TABLE items ADD COLUMN conversion_factor DECIMAL(10, 4);",
    mc_anchor: "ALTER TABLE items ADD COLUMN conversion_factor DECIMAL(10, 4);",
    why_this_matters:
      "An optional `conversion_factor` allows flexibility for entities that need unit normalization without forcing a value where it's not applicable. `DECIMAL` ensures precision for calculations.",
    answer_keywords: ["ALTER TABLE", "ADD COLUMN", "DECIMAL", "NULL"],
    seed_code:
      "CREATE TABLE items (\n  id INTEGER PRIMARY KEY,\n  name VARCHAR(255) NOT NULL,\n  default_unit VARCHAR(50) NOT NULL\n);",
    starter_code:
      "CREATE TABLE items (\n  id INTEGER PRIMARY KEY,\n  name VARCHAR(255) NOT NULL,\n  default_unit VARCHAR(50) NOT NULL\n);\n\n-- Your code here",
    feedback_correct:
      "Correct! `DECIMAL(10, 4)` is ideal for precise conversion factors, and omitting `NOT NULL` makes it optional.",
    feedback_partial:
      "You've got the `ALTER TABLE` part, but `FLOAT` can have precision issues. `DECIMAL` is generally preferred for financial or precise calculations. Also, ensure it's implicitly nullable.",
    feedback_wrong:
      "`INT` is for whole numbers, not decimals. You need a data type that can store fractional values, and it should be optional.",
    expected:
      "CREATE TABLE items (\n  id INTEGER PRIMARY KEY,\n  name VARCHAR(255) NOT NULL,\n  default_unit VARCHAR(50) NOT NULL,\n  conversion_factor DECIMAL(10, 4)\n);",
    analog_example: `ALTER TABLE tasks
ADD COLUMN completed_at TIMESTAMP; -- Implicitly nullable`,
    deepDiveLabel: "When should I use `DECIMAL` vs. `FLOAT`?",
    deepDive: {
      hook: "Imagine you're building a financial application. You need to store currency values and perform calculations. If you use `FLOAT` (floating-point numbers), you might encounter issues like `0.1 + 0.2` not exactly equaling `0.3` due to the way computers represent these numbers in binary. A small error of `0.00000000000000004` might seem insignificant, but in financial systems, even tiny inaccuracies accumulate, leading to major discrepancies and potentially legal issues. Choosing the wrong numeric type can have severe consequences for data integrity and business logic.",
      pain: "⚠️ **Lesson:** Using floating-point types (`FLOAT`, `REAL`, `DOUBLE PRECISION`) for precise calculations (e.g., currency, measurements) can lead to unexpected rounding errors. Symptom: Inaccurate sums, comparisons failing, and data integrity issues in critical applications.",
      mentalModel:
        "**Mental model:** `DECIMAL` is like using pen and paper for arithmetic, where you can represent numbers exactly, including fractions, up to a defined precision. `FLOAT` is like using a calculator with a fixed number of digits after the decimal point, where very long decimals get rounded or approximated. For money, you want pen and paper; for scientific approximations, a calculator might be fine.",
      discover: `\`\`\`sql
CREATE TABLE transactions (
  id INTEGER PRIMARY KEY,
  amount DECIMAL(19, 4) NOT NULL, -- 1. Exact precision for currency/measurements
  exchange_rate FLOAT             -- 2. Approximate for scientific/less critical values
);
\`\`\`
- \`DECIMAL(P, S)\`: Stores exact numeric values. \`P\` is the total number of digits (precision), \`S\` is the number of digits after the decimal point (scale).
- \`FLOAT\` / \`REAL\` / \`DOUBLE PRECISION\`: Stores approximate numeric values. These are floating-point numbers and can suffer from precision issues.
- \`NULL\` (implicit): When \`NOT NULL\` is omitted, the column can store \`NULL\` values.
- \`conversion_factor\`: A common name for a multiplier used to change units.`,
      quickRules: `**Quick rules:**
- ✅ Use \`DECIMAL\` or \`NUMERIC\` for all financial data, precise measurements, and anything requiring exact arithmetic.
- ✅ Specify appropriate precision and scale for \`DECIMAL\` based on your data's maximum value and required decimal places.
- ✅ Use \`FLOAT\` or \`REAL\` for scientific calculations where approximation is acceptable and performance is critical (e.g., sensor readings, graphics).
- ✅ Understand that \`NULL\` means "unknown" or "not applicable," not "zero" or "empty string."
- ❌ Never use \`FLOAT\` for currency or critical measurements.
- ❌ Don't use \`INTEGER\` for values that inherently require fractional parts.
- ❌ Avoid excessive precision and scale for \`DECIMAL\` if not needed, as it can consume more storage.`,
      watchOut:
        "👀 **Watch out:** When comparing `FLOAT` values, direct equality checks (`=`) can be problematic due to their approximate nature. Instead, check if the absolute difference between two floats is less than a very small epsilon value. This issue does not apply to `DECIMAL` values.",
      dryRun: `🔁 **Think:**
1.  \`CREATE TABLE products (id INTEGER PRIMARY KEY, name VARCHAR(255) NOT NULL, price DECIMAL(10, 2));\` is executed.
2.  \`ALTER TABLE products ADD COLUMN discount_percentage DECIMAL(5, 2);\` is executed.
3.  The \`products\` table now has \`id\`, \`name\`, \`price\` (NOT NULL), and \`discount_percentage\` (implicitly NULL).
4.  \`INSERT INTO products (id, name, price, discount_percentage) VALUES (1, 'Shirt', 25.99, 0.15);\` succeeds.
5.  \`INSERT INTO products (id, name, price) VALUES (2, 'Pants', 49.99);\` succeeds because \`discount_percentage\` is nullable. It will be \`NULL\`.
6.  \`INSERT INTO products (id, name, price, discount_percentage) VALUES (3, 'Hat', 12.50, NULL);\` also succeeds.
(Hint: What value does \`discount_percentage\` take if it's not provided during an insert?)`,
      build:
        "**Learning focus:** Add an optional decimal column for conversion factors, ensuring precision.",
    },
  },
  {
    id: "step5",
    type: "question",
    phase: "Step 5 of 5",
    paal: "Finally, to maintain data integrity, we need to ensure that if a `conversion_factor` is provided, it must always be a positive value. A conversion factor of zero or negative would be nonsensical.",
    hint: "Use a `CHECK` constraint, and remember to handle the `NULL` case for optional columns.",
    example_code:
      "ALTER TABLE items\nADD CONSTRAINT chk_positive_conversion CHECK (conversion_factor IS NULL OR conversion_factor > 0);",
    think_prompt:
      "How do you add a constraint that validates a column's value, and how do you make this validation conditional so it only applies when the column is not null?",
    mc_options: [
      "ADD CONSTRAINT CHECK (conversion_factor > 0);",
      "ALTER TABLE items ADD CONSTRAINT chk_positive_conversion CHECK (conversion_factor > 0);",
      "ALTER TABLE items ADD CONSTRAINT chk_positive_conversion CHECK (conversion_factor IS NULL OR conversion_factor > 0);",
    ],
    mc_correct_option:
      "ALTER TABLE items ADD CONSTRAINT chk_positive_conversion CHECK (conversion_factor IS NULL OR conversion_factor > 0);",
    mc_anchor:
      "ALTER TABLE items ADD CONSTRAINT chk_positive_conversion CHECK (conversion_factor IS NULL OR conversion_factor > 0);",
    why_this_matters:
      "`CHECK` constraints enforce business rules directly in the database, preventing invalid data from ever being stored. This ensures the logical consistency of conversion factors.",
    answer_keywords: ["ALTER TABLE", "ADD CONSTRAINT", "CHECK", "IS NULL", "OR", ">"],
    seed_code:
      "CREATE TABLE items (\n  id INTEGER PRIMARY KEY,\n  name VARCHAR(255) NOT NULL,\n  default_unit VARCHAR(50) NOT NULL,\n  conversion_factor DECIMAL(10, 4)\n);",
    starter_code:
      "CREATE TABLE items (\n  id INTEGER PRIMARY KEY,\n  name VARCHAR(255) NOT NULL,\n  default_unit VARCHAR(50) NOT NULL,\n  conversion_factor DECIMAL(10, 4)\n);\n\n-- Your code here",
    feedback_correct:
      "Spot on! Naming the constraint and using `IS NULL OR` correctly handles the optional nature of the `conversion_factor`.",
    feedback_partial:
      "You've got the `CHECK` constraint, but it needs a name (`ADD CONSTRAINT chk_name`) and must explicitly allow `NULL` values for the `conversion_factor` to be optional.",
    feedback_wrong:
      "A `CHECK` constraint without `IS NULL OR` will prevent any `NULL` values from being inserted, making the column effectively `NOT NULL`, which contradicts its optional nature.",
    expected:
      "CREATE TABLE items (\n  id INTEGER PRIMARY KEY,\n  name VARCHAR(255) NOT NULL,\n  default_unit VARCHAR(50) NOT NULL,\n  conversion_factor DECIMAL(10, 4),\n  CONSTRAINT chk_positive_conversion CHECK (conversion_factor IS NULL OR conversion_factor > 0)\n);",
    analog_example: `ALTER TABLE tasks
ADD CONSTRAINT chk_completion_date CHECK (completed_at IS NULL OR completed_at >= created_at);`,
    deepDiveLabel: "How do `CHECK` constraints differ from `NOT NULL`?",
    deepDive: {
      hook: "Imagine a system where users can enter their age. A `NOT NULL` constraint ensures they *must* enter something. But what if they enter `0` or `-5` or `200`? The database accepts these values because they are not `NULL`. Later, when your application tries to calculate something based on age, these nonsensical values cause crashes or incorrect results. You need a way to enforce *validity* beyond just presence. This is where `CHECK` constraints become indispensable, acting as a gatekeeper for the actual *content* of your data.",
      pain: "⚠️ **Lesson:** `NOT NULL` only ensures data presence, not data validity. Without `CHECK` constraints, invalid but non-null data can pollute your database, leading to application errors and logical inconsistencies. Symptom: Application crashes due to unexpected data, incorrect reports, and difficulty in debugging.",
      mentalModel:
        "**Mental model:** `NOT NULL` is like a bouncer at a club checking if you have *any* ID. `CHECK` is like the bouncer then *verifying* that the ID is valid (e.g., not expired, age is appropriate). `NOT NULL` ensures a value exists; `CHECK` ensures the *value itself* adheres to specific rules or conditions.",
      discover: `\`\`\`sql
CREATE TABLE employees (
  employee_id INTEGER PRIMARY KEY,
  name VARCHAR(255) NOT NULL,             -- 1. Ensures a name is always provided
  age INTEGER,                            -- 2. Can be NULL if age is unknown
  CONSTRAINT chk_age CHECK (age IS NULL OR age >= 18 AND age <= 120) -- 3. Validates age range if provided
);
\`\`\`
- \`NOT NULL\`: Ensures a column cannot contain \`NULL\` values. It's a basic presence check.
- \`CHECK\`: A constraint that enforces a boolean condition on the values in a column or set of columns.
- \`CONSTRAINT name\`: Allows you to give a name to the constraint, making it easier to reference for modification or error messages.
- \`IS NULL OR condition\`: A common pattern for \`CHECK\` constraints on optional columns, ensuring the condition only applies if the value is not \`NULL\`.`,
      quickRules: `**Quick rules:**
- ✅ Use \`CHECK\` constraints to enforce business rules and data validity beyond simple presence.
- ✅ Name your \`CHECK\` constraints for clarity and easier management.
- ✅ Combine \`IS NULL OR\` with your condition for optional columns.
- ✅ Use \`CHECK\` for range validation, pattern matching (with \`LIKE\`), or complex logical conditions.
- ❌ Don't rely solely on \`NOT NULL\` for data validity.
- ❌ Avoid overly complex \`CHECK\` constraints that are hard to read or maintain; consider triggers or application-level validation for very intricate logic.
- ❌ Never forget to handle \`NULL\` explicitly in \`CHECK\` constraints for optional fields if the condition shouldn't apply to \`NULL\`s.`,
      watchOut:
        "👀 **Watch out:** `CHECK` constraints are evaluated *before* the data is inserted or updated. If your `CHECK` constraint references other columns, ensure the logic correctly handles the state of those columns during the transaction. Also, some older database versions might have limited `CHECK` constraint capabilities.",
      dryRun: `🔁 **Think:**
1.  \`CREATE TABLE users (id INTEGER PRIMARY KEY, age INTEGER, CONSTRAINT chk_age CHECK (age IS NULL OR age >= 0));\` is executed.
2.  \`INSERT INTO users (id, age) VALUES (1, 25);\` succeeds because \`25\` is not \`NULL\` and \`25 >= 0\` is true.
3.  \`INSERT INTO users (id, age) VALUES (2, NULL);\` succeeds because \`age IS NULL\` is true.
4.  \`INSERT INTO users (id, age) VALUES (3, -5);\` fails because \`-5\` is not \`NULL\` and \`-5 >= 0\` is false, violating \`chk_age\`.
(Hint: What happens when you try to insert a negative age?)`,
      build:
        "**Learning focus:** Implement a `CHECK` constraint to ensure the optional conversion factor is positive when provided.",
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
  lessonNum: 0,
  title: "Defining Entities with Normalized Units and Constraints",
  shortName: "Normalized Units",
});
