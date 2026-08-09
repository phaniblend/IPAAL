import createINPACTEngine from "../inpact_engine_shared";
import express from 'express';
import request from 'supertest'; // Used in tests, but not directly in the server code itself.

// Define a simple in-memory data store for our resources
interface Resource {
  id: string;
  name: string;
  category: string;
}

const initialResources: Resource[] = [
  { id: "res1", name: "Item A", category: "Electronics" },
  { id: "res2", name: "Item B", category: "Books" },
  { id: "res3", name: "Item C", category: "Electronics" },
  { id: "res4", name: "Item D", category: "Home Goods" },
  { id: "res5", name: "Item E", category: "Books" },
  { id: "res6", name: "Item F", category: "Electronics" },
];

// This will be the server instance we test against
let app: express.Application;
let server: any; // To hold the server instance for closing

export const NODES = [
  {
    id: "intro",
    type: "reveal",
    phase: "Lesson",
    content: {
      tag: "filtered-list-query",
      title: "Querying a List Endpoint with Filters",
      body: `When building applications, it's common for an API to provide access to large collections of data. However, clients often don't need *all* the data at once. Fetching an entire dataset when only a small subset is required can lead to significant performance issues, including slow load times, increased network traffic, and unnecessary processing on both the server and client. This pattern addresses that by allowing clients to specify criteria to narrow down the results, ensuring they receive only the relevant information. It's a fundamental optimization technique for efficient data retrieval.

This pattern is ubiquitous across many software systems. You'll encounter it when searching for products on an e-commerce site (filtering by brand, price, or category), managing user accounts (filtering by role or status), or viewing logs (filtering by severity or date range). Any time you see a search bar, dropdown filters, or checkboxes that refine a list of items, there's a high probability that a filtered list query pattern is at play on the backend. Mastering this allows you to build more responsive and scalable applications.`,
      usecase: "A settings panel displaying a list of 'preferences' that can be filtered by 'type' (e.g., 'display', 'notification', 'privacy').",
    },
  },
  {
    id: "objectives",
    type: "objectives",
    phase: "Objectives",
    items: [
      "Understand the purpose of filtering API list endpoints.",
      "Implement server-side logic to filter data based on query parameters.",
      "Write integration tests to verify filter correctness and edge cases.",
      "Recognize common pitfalls and best practices for filtered list queries.",
    ],
  },
  {
    id: "step1",
    type: "question",
    phase: "Step 1 of 7",
    paal: "To begin, set up the basic server infrastructure and define the in-memory data store that your API will serve. This involves importing necessary modules and creating an array of objects to simulate a database.",
    hint: "Remember to import `express` and define your `initialResources` array. You'll also need `request` from `supertest` for testing later, but it doesn't need to be used in the server setup itself yet.",
    example_code: `
import express from 'express';
import request from 'supertest'; // For testing later

interface Resource {
  id: string;
  name: string;
  category: string;
}

const initialResources: Resource[] = [
  { id: "res1", name: "Item A", category: "Electronics" },
  { id: "res2", name: "Item B", category: "Books" },
  { id: "res3", name: "Item C", category: "Electronics" },
];

let app: express.Application;
let server: any;
`,
    think_prompt: "What are the essential components for a minimal Express server and a dataset it can operate on?",
    mc_options: [
      "Importing React and defining a component state.",
      "Importing Express and defining an array of data objects.",
      "Setting up a database connection and a frontend UI.",
    ],
    mc_correct_option: "Importing Express and defining an array of data objects.",
    mc_anchor: "Importing Express and defining an array of data objects.",
    why_this_matters: "Establishing a clear data source and the server framework is the foundational step for any API. Without these, there's no data to filter and no endpoint to serve it from.",
    answer_keywords: ["express", "data store", "interface", "resources"],
    seed_code: ``,
    starter_code: `
import express from 'express';
import request from 'supertest';

// Define a simple in-memory data store for our resources
interface Resource {
  id: string;
  name: string;
  category: string;
}

const initialResources: Resource[] = [
  { id: "res1", name: "Item A", category: "Electronics" },
  { id: "res2", name: "Item B", category: "Books" },
  { id: "res3", name: "Item C", category: "Electronics" },
  { id: "res4", name: "Item D", category: "Home Goods" },
  { id: "res5", name: "Item E", category: "Books" },
  { id: "res6", name: "Item F", category: "Electronics" },
];

// This will be the server instance we test against
let app: express.Application;
let server: any; // To hold the server instance for closing

// Add your Express app setup here
`,
    feedback_correct: "Excellent! You've laid the groundwork by importing Express and defining your resource data. This provides the necessary context for building the API.",
    feedback_partial: "You've made a good start with imports, but ensure you've defined the `Resource` interface and the `initialResources` array to simulate your data source.",
    feedback_wrong: "While frontend components are important for applications, this module focuses on backend API patterns. The core setup for an API involves a server framework like Express and a data source.",
    expected: `
import express from 'express';
import request from 'supertest';

// Define a simple in-memory data store for our resources
interface Resource {
  id: string;
  name: string;
  category: string;
}

const initialResources: Resource[] = [
  { id: "res1", name: "Item A", category: "Electronics" },
  { id: "res2", name: "Item B", category: "Books" },
  { id: "res3", name: "Item C", category: "Electronics" },
  { id: "res4", name: "Item D", category: "Home Goods" },
  { id: "res5", name: "Item E", category: "Books" },
  { id: "res6", name: "Item F", category: "Electronics" },
];

// This will be the server instance we test against
let app: express.Application;
let server: any; // To hold the server instance for closing

app = express();
`,
    analog_example: `
// Analogous: Setting up a simple data array and a function to process it
const products = [
  { id: 1, name: "Laptop", type: "Electronics" },
  { id: 2, name: "Novel", type: "Books" },
  { id: 3, name: "Mouse", type: "Electronics" },
];

function getProductsByType(type: string | undefined) {
  if (type) {
    return products.filter(p => p.type === type);
  }
  return products;
}

// console.log(getProductsByType("Electronics"));
// console.log(getProductsByType(undefined));
`,
    deepDiveLabel: "Why use an in-memory array instead of a real database?",
    deepDive: {
      hook: `Imagine you're just starting to learn how to build a house. Would you immediately begin by digging a massive foundation for a skyscraper, or would you first practice building a small, simple shed with readily available materials? The latter approach allows you to focus on the core construction techniques without getting bogged down by the complexities of heavy machinery, soil analysis, and large-scale logistics. Similarly, when learning API concepts, directly integrating with a full-fledged database like PostgreSQL or MongoDB introduces a significant layer of complexity: connection strings, ORMs, schema migrations, and asynchronous query handling. This can quickly overshadow the primary learning objective, making it harder to grasp the fundamental API patterns.`,
      pain: `⚠️ **Lesson:** Over-complicating initial learning setups. Symptom: Learners get overwhelmed by tangential technologies, struggle to isolate the core concept, and spend more time debugging setup issues than understanding the pattern. This leads to frustration and slower progress.`,
      mentalModel: `**Mental model:** The "Sandbox Simulation." Think of an in-memory array as a temporary, self-contained sandbox. It behaves enough like a real database for you to practice API interactions, filtering, and data manipulation, but without the persistent storage, network latency, or complex setup of a production-grade system. It allows you to rapidly iterate, test, and understand the logic of your API without external dependencies. Once you master the sandbox, you can confidently transition to a real database, knowing the core API logic remains largely the same.`,
      discover: `**Pattern - In-Memory Data Store:**
\`\`\`typescript
interface Item {
  id: string;
  value: string;
}

const dataStore: Item[] = [
  { id: "a", value: "First" },
  { id: "b", value: "Second" },
];

// This data is available immediately when the server starts
// and is reset every time the server restarts.
\`\`\`
-   **Simplicity:** No external database setup, configuration, or connection management is required.
-   **Isolation:** The data is entirely self-contained within the application's memory, making tests faster and more predictable.
-   **Focus:** Allows learners to concentrate solely on API routing, request handling, and data manipulation logic.
-   **Ephemeral:** Data is lost when the application restarts, which is ideal for learning and testing environments but unsuitable for production.`,
      quickRules: `**Quick rules:**
-   ✅ Use in-memory data for rapid prototyping and concept validation.
-   ✅ Employ in-memory data for unit and integration tests where database setup is overkill.
-   ✅ Keep in-memory datasets small and representative of real data.
-   ✅ Understand that in-memory data is not persistent across server restarts.
-   ❌ Use in-memory data for production applications requiring persistence.
-   ❌ Store sensitive or large datasets in memory without proper caching strategies.
-   ❌ Rely on in-memory data for complex query operations that a database is optimized for.`,
      watchOut: `👀 **Watch out:** While convenient, relying too heavily on in-memory data can mask performance issues that would arise with a real database. Complex filtering or sorting on large in-memory arrays can be inefficient. Always remember it's a temporary stand-in, not a production solution.`,
      dryRun: `🔁 **Think:** When the server starts, the \`initialResources\` array is initialized once. If a request comes in, the server accesses this array directly. If the server restarts, this array is re-initialized to its original state, losing any changes that might have occurred during the previous run. (Hint: Consider the lifecycle of the data relative to the server process.)`,
      build: "**Learning focus:** Set up the basic server application instance and define the static, in-memory data that your API will operate on.",
    },
  },
  {
    id: "step2",
    type: "question",
    phase: "Step 2 of 7",
    paal: "Now, create the main API endpoint. This involves initializing an Express application and defining a GET route for `/resources` that, for now, simply returns all available resources.",
    hint: "Use `app = express();` to initialize your application and `app.get('/resources', ...)` to define the route. The handler function should send back the `initialResources` array.",
    example_code: `
app = express();

app.get('/resources', (req, res) => {
  res.json(initialResources);
});
`,
    think_prompt: "How do you set up a basic Express GET route to serve static data?",
    mc_options: [
      "Using `app.post('/resources', ...)` to send data.",
      "Initializing `app` with `new Express()` and defining `app.route('/resources').get(...)`.",
      "Initializing `app` with `express()` and defining `app.get('/resources', ...)`.",
    ],
    mc_correct_option: "Initializing `app` with `express()` and defining `app.get('/resources', ...)`.",
    mc_anchor: "Initializing `app` with `express()` and defining `app.get('/resources', ...)`.",
    why_this_matters: "Defining the endpoint is the entry point for clients to interact with your API. Without it, there's no way to request or receive data.",
    answer_keywords: ["express", "app.get", "route", "res.json"],
    seed_code: `
import express from 'express';
import request from 'supertest';

// Define a simple in-memory data store for our resources
interface Resource {
  id: string;
  name: string;
  category: string;
}

const initialResources: Resource[] = [
  { id: "res1", name: "Item A", category: "Electronics" },
  { id: "res2", name: "Item B", category: "Books" },
  { id: "res3", name: "Item C", category: "Electronics" },
  { id: "res4", name: "Item D", category: "Home Goods" },
  { id: "res5", name: "Item E", category: "Books" },
  { id: "res6", name: "Item F", category: "Electronics" },
];

// This will be the server instance we test against
let app: express.Application;
let server: any; // To hold the server instance for closing

app = express();
`,
    starter_code: `
import express from 'express';
import request from 'supertest';

// Define a simple in-memory data store for our resources
interface Resource {
  id: string;
  name: string;
  category: string;
}

const initialResources: Resource[] = [
  { id: "res1", name: "Item A", category: "Electronics" },
  { id: "res2", name: "Item B", category: "Books" },
  { id: "res3", name: "Item C", category: "Electronics" },
  { id: "res4", name: "Item D", category: "Home Goods" },
  { id: "res5", name: "Item E", category: "Books" },
  { id: "res6", name: "Item F", category: "Electronics" },
];

// This will be the server instance we test against
let app: express.Application;
let server: any; // To hold the server instance for closing

app = express();

// Add your GET /resources route here
`,
    feedback_correct: "Spot on! You've successfully created the `/resources` endpoint, which is now ready to serve all items. This is the base for adding filtering logic.",
    feedback_partial: "You've initialized the app, but ensure the `app.get` route is correctly defined with the path `/resources` and sends `initialResources` as JSON.",
    feedback_wrong: "Remember that `app.post` is for creating or submitting data, not for retrieving it. For fetching resources, `app.get` is the correct HTTP method.",
    expected: `
import express from 'express';
import request from 'supertest';

// Define a simple in-memory data store for our resources
interface Resource {
  id: string;
  name: string;
  category: string;
}

const initialResources: Resource[] = [
  { id: "res1", name: "Item A", category: "Electronics" },
  { id: "res2", name: "Item B", category: "Books" },
  { id: "res3", name: "Item C", category: "Electronics" },
  { id: "res4", name: "Item D", category: "Home Goods" },
  { id: "res5", name: "Item E", category: "Books" },
  { id: "res6", name: "Item F", category: "Electronics" },
];

// This will be the server instance we test against
let app: express.Application;
let server: any; // To hold the server instance for closing

app = express();

app.get('/resources', (req, res) => {
  res.json(initialResources);
});
`,
    analog_example: `
// Analogous: A function that returns all items from a list
const allUsers = [
  { id: 1, name: "Alice" },
  { id: 2, name: "Bob" },
];

function getAllUsers() {
  return allUsers;
}

// console.log(getAllUsers()); // Returns all users
`,
    deepDiveLabel: "What's the difference between `res.send()` and `res.json()`?",
    deepDive: {
      hook: `Imagine you're sending a package. You could just put the item in a box and send it (\`res.send()\`), or you could carefully wrap it, add a label indicating its contents (e.g., "JSON data"), and then send it (\`res.json()\`). While both methods deliver the package, the latter provides crucial metadata that helps the recipient understand how to handle the contents. In web development, this metadata is the 'Content-Type' header. Without it, a client might receive data but not know if it's plain text, HTML, or structured JSON, leading to parsing errors or incorrect rendering.`,
      pain: `⚠️ **Lesson:** Sending data without proper content type headers. Symptom: Client-side parsing errors, browsers rendering JSON as plain text, or incorrect API consumption due to ambiguity about the data format. This leads to debugging headaches and fragile integrations.`,
      mentalModel: `**Mental model:** The "API Data Labeler." Think of \`res.json()\` as a specialized labeling service for your API responses. When you use it, Express automatically sets the \`Content-Type\` HTTP header to \`application/json\`. This is like putting a "JSON" sticker on your data package. Clients (browsers, other applications) see this label and immediately know to parse the response as JSON. \`res.send()\` is more general, like a generic shipping label; it tries to guess the content type or defaults to plain text, which can be less reliable for structured data.`,
      discover: `**Pattern - Sending JSON Responses:**
\`\`\`typescript
app.get('/data', (req, res) => {
  const data = { message: "Hello", status: "success" };
  res.json(data); // Automatically sets Content-Type: application/json
});

app.get('/text', (req, res) => {
  res.send("Hello World"); // Content-Type might be text/html or text/plain
});
\`\`\`
-   **\`res.json(data)\`:** Sends a JSON response. It automatically stringifies the JavaScript object or array into a JSON string and sets the \`Content-Type\` header to \`application/json\`.
-   **\`res.send(body)\`:** A more general method. It can send various types of responses (Buffer, String, Object, Boolean, Array). Express attempts to infer the \`Content-Type\` based on the \`body\` type.
-   **Consistency:** For APIs, \`res.json()\` ensures consistent and correct \`Content-Type\` headers, which is crucial for client-side parsing.
-   **Convenience:** It handles \`JSON.stringify()\` for you, preventing common serialization errors.`,
      quickRules: `**Quick rules:**
-   ✅ Use \`res.json()\` when sending structured data (objects, arrays) from an API.
-   ✅ Rely on \`res.json()\` for automatic \`Content-Type: application/json\` header setting.
-   ✅ Use \`res.send()\` for simple strings, HTML, or when you need more control over headers.
-   ✅ Always send a response to prevent requests from hanging.
-   ❌ Use \`res.send()\` for JSON data if you want explicit \`application/json\` headers without manual setting.
-   ❌ Forget to send any response, leaving the client waiting indefinitely.
-   ❌ Manually call \`JSON.stringify()\` before \`res.json()\`, as it does it automatically.`,
      watchOut: `👀 **Watch out:** While \`res.send()\` can sometimes infer JSON, it's not guaranteed, especially if the data structure is ambiguous or if other middleware interferes. Always prefer \`res.json()\` for API responses to ensure correct content negotiation and client-side parsing.`,
      dryRun: `🔁 **Think:** A client makes a GET request to \`/resources\`. The Express route handler is invoked. Inside the handler, \`res.json(initialResources)\` is called. Express takes the \`initialResources\` array, converts it into a JSON string, and sets the \`Content-Type\` header to \`application/json\`. The client then receives this JSON string and can parse it as a JavaScript array. (Hint: Focus on the transformation of the data and the header setting.)`,
      build: "**Learning focus:** Create the `/resources` GET endpoint that currently serves all items from the in-memory data store without any filtering.",
    },
  },
  {
    id: "step3",
    type: "question",
    phase: "Step 3 of 7",
    paal: "Now, enhance the `/resources` endpoint to accept a `category` query parameter. If provided, the endpoint should filter the `initialResources` array and return only items matching that category. If no `category` is provided, it should return all resources.",
    hint: "Access query parameters using `req.query`. Use `Array.prototype.filter()` to conditionally filter the `initialResources` array.",
    example_code: `
app.get('/resources', (req, res) => {
  const { category } = req.query;
  let filteredResources = initialResources;

  if (typeof category === 'string') {
    filteredResources = initialResources.filter(
      (resource) => resource.category.toLowerCase() === category.toLowerCase()
    );
  }

  res.json(filteredResources);
});
`,
    think_prompt: "How do you conditionally apply a filter based on an optional query parameter?",
    mc_options: [
      "Use `req.params` to get the category and `map` the array.",
      "Check `req.query.category`, then use `filter` on the array if it exists.",
      "Always `filter` the array, even if `req.query.category` is undefined.",
    ],
    mc_correct_option: "Check `req.query.category`, then use `filter` on the array if it exists.",
    mc_anchor: "Check `req.query.category`, then use `filter` on the array if it exists.",
    why_this_matters: "Implementing server-side filtering is the core of this pattern, allowing clients to request specific subsets of data efficiently. This reduces network load and client-side processing.",
    answer_keywords: ["req.query", "filter", "category", "conditional logic"],
    seed_code: `
import express from 'express';
import request from 'supertest';

// Define a simple in-memory data store for our resources
interface Resource {
  id: string;
  name: string;
  category: string;
}

const initialResources: Resource[] = [
  { id: "res1", name: "Item A", category: "Electronics" },
  { id: "res2", name: "Item B", category: "Books" },
  { id: "res3", name: "Item C", category: "Electronics" },
  { id: "res4", name: "Item D", category: "Home Goods" },
  { id: "res5", name: "Item E", category: "Books" },
  { id: "res6", name: "Item F", category: "Electronics" },
];

// This will be the server instance we test against
let app: express.Application;
let server: any; // To hold the server instance for closing

app = express();

app.get('/resources', (req, res) => {
  res.json(initialResources);
});
`,
    starter_code: `
import express from 'express';
import request from 'supertest';

// Define a simple in-memory data store for our resources
interface Resource {
  id: string;
  name: string;
  category: string;
}

const initialResources: Resource[] = [
  { id: "res1", name: "Item A", category: "Electronics" },
  { id: "res2", name: "Item B", category: "Books" },
  { id: "res3", name: "Item C", category: "Electronics" },
  { id: "res4", name: "Item D", category: "Home Goods" },
  { id: "res5", name: "Item E", category: "Books" },
  { id: "res6", name: "Item F", category: "Electronics" },
];

// This will be the server instance we test against
let app: express.Application;
let server: any; // To hold the server instance for closing

app = express();

app.get('/resources', (req, res) => {
  // Add filtering logic here
  res.json(initialResources); // Modify this line
});
`,
    feedback_correct: "Fantastic! Your endpoint now correctly handles the `category` query parameter, filtering the resources dynamically. This is a robust implementation of the filtering pattern.",
    feedback_partial: "You're close! Ensure you're correctly extracting `category` from `req.query` and applying the `filter` method only when `category` is present. Also, consider case-insensitivity for the category match.",
    feedback_wrong: "Using `req.params` is for path segments (like `/resources/:id`), not query parameters (like `/resources?category=X`). Also, `map` transforms an array, while `filter` selects elements.",
    expected: `
import express from 'express';
import request from 'supertest';

// Define a simple in-memory data store for our resources
interface Resource {
  id: string;
  name: string;
  category: string;
}

const initialResources: Resource[] = [
  { id: "res1", name: "Item A", category: "Electronics" },
  { id: "res2", name: "Item B", category: "Books" },
  { id: "res3", name: "Item C", category: "Electronics" },
  { id: "res4", name: "Item D", category: "Home Goods" },
  { id: "res5", name: "Item E", category: "Books" },
  { id: "res6", name: "Item F", category: "Electronics" },
];

// This will be the server instance we test against
let app: express.Application;
let server: any; // To hold the server instance for closing

app = express();

app.get('/resources', (req, res) => {
  const { category } = req.query;
  let filteredResources = initialResources;

  if (typeof category === 'string') {
    filteredResources = initialResources.filter(
      (resource) => resource.category.toLowerCase() === category.toLowerCase()
    );
  }

  res.json(filteredResources);
});
`,
    analog_example: `
// Analogous: Client-side filtering of an array based on a search input
const products = [
  { id: 1, name: "Laptop", type: "Electronics" },
  { id: 2, name: "Novel", type: "Books" },
  { id: 3, name: "Mouse", type: "Electronics" },
];

function filterProducts(searchTerm: string | undefined) {
  if (searchTerm) {
    return products.filter(product =>
      product.type.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }
  return products;
}

// console.log(filterProducts("electronics")); // Returns Laptop, Mouse
// console.log(filterProducts(undefined));    // Returns all products
`,
    deepDiveLabel: "Why is `req.query` an object, and how does it handle multiple parameters?",
    deepDive: {
      hook: `Imagine you're ordering food online. You don't just say "pizza"; you might say "pizza, large, pepperoni, no olives, delivery to 123 Main St." Each of these details is a separate piece of information, but they all relate to the same order. In web requests, query parameters work similarly. A URL like \`/search?query=laptop&category=electronics&sort=price_asc\` contains multiple distinct instructions for the server. If \`req.query\` were just a single string or an array, parsing these individual instructions would be a manual, error-prone process, requiring you to split strings and handle edge cases.`,
      pain: `⚠️ **Lesson:** Manually parsing query strings. Symptom: Fragile code, increased development time, potential for parsing errors, and difficulty in handling complex query structures. This leads to maintenance nightmares and bugs.`,
      mentalModel: `**Mental model:** The "URL Parameter Decoder Ring." Express's \`req.query\` acts like a decoder ring that automatically translates the jumbled query string (e.g., \`?key1=value1&key2=value2\`) into a neatly organized JavaScript object (\`{ key1: "value1", key2: "value2" }\`). This abstraction saves you from writing complex string manipulation logic, allowing you to access parameters directly by their names. It handles URL decoding and separates parameters, making your code cleaner and more robust.`,
      discover: `**Pattern - Accessing Query Parameters:**
\`\`\`typescript
app.get('/search', (req, res) => {
  // For a request like /search?q=apple&type=fruit&sort=asc
  const searchTerm = req.query.q;    // "apple"
  const itemType = req.query.type;    // "fruit"
  const sortOrder = req.query.sort;   // "asc"

  // If a parameter is repeated, e.g., ?tag=red&tag=green
  // req.query.tag would be ["red", "green"]
  const tags = req.query.tag; // string[] | string | undefined

  res.json({ searchTerm, itemType, sortOrder, tags });
});
\`\`\`
-   **Object Structure:** \`req.query\` is an object where keys are the parameter names (e.g., \`category\`) and values are their corresponding string values.
-   **Automatic Parsing:** Express (via its underlying \`query\` middleware) automatically parses the URL's query string into this convenient object.
-   **Type \`string | string[] | undefined\`:** A query parameter's value is typically a \`string\`. If a parameter appears multiple times (e.g., \`?tag=A&tag=B\`), its value becomes an array of strings. If a parameter is not present, its value is \`undefined\`.
-   **Case Sensitivity:** Parameter names in the URL are case-sensitive by default, but you can normalize them in your code (e.g., \`toLowerCase()\`).`,
      quickRules: `**Quick rules:**
-   ✅ Use \`req.query\` for optional parameters that filter, sort, or paginate collections.
-   ✅ Validate and sanitize all query parameters on the server side.
-   ✅ Handle cases where query parameters might be missing or have unexpected types.
-   ✅ Convert string query parameters to appropriate types (numbers, booleans) if needed.
-   ❌ Use \`req.params\` for filtering or sorting (that's for identifying specific resources).
-   ❌ Trust query parameters directly without validation or sanitization.
-   ❌ Expect query parameters to always be a single string; account for arrays if applicable.`,
      watchOut: `👀 **Watch out:** Query parameters are always strings, even if they represent numbers or booleans. You'll need to explicitly convert them (e.g., \`parseInt(req.query.limit as string)\`) if you intend to use them as non-string types. Also, be mindful of potential SQL injection or XSS if you're directly using query values in database queries or HTML responses without sanitization.`,
      dryRun: `🔁 **Think:** A request comes in: \`GET /resources?category=Books\`.
1.  \`req.query\` becomes \`{ category: "Books" }\`.
2.  \`const { category } = req.query;\` extracts \`category = "Books"\`.
3.  The \`if (typeof category === 'string')\` condition is true.
4.  \`initialResources.filter(...)\` is called. For each resource, \`resource.category.toLowerCase() === "books"\` is evaluated.
5.  Resources with category "Books" (Item B, Item E) are kept.
6.  \`filteredResources\` now contains only Item B and Item E.
7.  \`res.json(filteredResources)\` sends these two items.
(Hint: Trace the value of \`category\` and the result of the \`filter\` operation.)`,
      build: "**Learning focus:** Implement the logic within the `/resources` endpoint to filter the `initialResources` array based on the `category` query parameter.",
    },
  },
  {
    id: "step4",
    type: "question",
    phase: "Step 4 of 7",
    paal: "With the API endpoint ready, it's time to set up the testing environment. This involves configuring Jest and Supertest to start and stop your Express server before and after all tests run.",
    hint: "Use `describe` to group your tests, `beforeAll` to start the server (using `app.listen`), and `afterAll` to close it (using `server.close`).",
    example_code: `
describe('GET /resources', () => {
  beforeAll((done) => {
    server = app.listen(3000, () => {
      done();
    });
  });

  afterAll((done) => {
    server.close(() => {
      done();
    });
  });

  // Test cases will go here
});
`,
    think_prompt: "How do you manage the lifecycle of a server for integration tests?",
    mc_options: [
      "Start the server manually before running tests and keep it running.",
      "Use `beforeEach` and `afterEach` to start/stop the server for every test.",
      "Use `beforeAll` to start the server once and `afterAll` to stop it once for the entire suite.",
    ],
    mc_correct_option: "Use `beforeAll` to start the server once and `afterAll` to stop it once for the entire suite.",
    mc_anchor: "Use `beforeAll` to start the server once and `afterAll` to stop it once for the entire suite.",
    why_this_matters: "Proper test setup ensures that your server is in a known state for each test run, preventing conflicts and making tests reliable and repeatable. `beforeAll`/`afterAll` optimize performance by avoiding redundant server restarts.",
    answer_keywords: ["jest", "supertest", "beforeAll", "afterAll", "server lifecycle"],
    seed_code: `
import express from 'express';
import request from 'supertest';

// Define a simple in-memory data store for our resources
interface Resource {
  id: string;
  name: string;
  category: string;
}

const initialResources: Resource[] = [
  { id: "res1", name: "Item A", category: "Electronics" },
  { id: "res2", name: "Item B", category: "Books" },
  { id: "res3", name: "Item C", category: "Electronics" },
  { id: "res4", name: "Item D", category: "Home Goods" },
  { id: "res5", name: "Item E", category: "Books" },
  { id: "res6", name: "Item F", category: "Electronics" },
];

// This will be the server instance we test against
let app: express.Application;
let server: any; // To hold the server instance for closing

app = express();

app.get('/resources', (req, res) => {
  const { category } = req.query;
  let filteredResources = initialResources;

  if (typeof category === 'string') {
    filteredResources = initialResources.filter(
      (resource) => resource.category.toLowerCase() === category.toLowerCase()
    );
  }

  res.json(filteredResources);
});
`,
    starter_code: `
import express from 'express';
import request from 'supertest';

// Define a simple in-memory data store for our resources
interface Resource {
  id: string;
  name: string;
  category: string;
}

const initialResources: Resource[] = [
  { id: "res1", name: "Item A", category: "Electronics" },
  { id: "res2", name: "Item B", category: "Books" },
  { id: "res3", name: "Item C", category: "Electronics" },
  { id: "res4", name: "Item D", category: "Home Goods" },
  { id: "res5", name: "Item E", category: "Books" },
  { id: "res6", name: "Item F", category: "Electronics" },
];

// This will be the server instance we test against
let app: express.Application;
let server: any; // To hold the server instance for closing

app = express();

app.get('/resources', (req, res) => {
  const { category } = req.query;
  let filteredResources = initialResources;

  if (typeof category === 'string') {
    filteredResources = initialResources.filter(
      (resource) => resource.category.toLowerCase() === category.toLowerCase()
    );
  }

  res.json(filteredResources);
});

// Add your test suite structure here
`,
    feedback_correct: "Perfect! You've correctly set up the test suite to manage the server's lifecycle. This ensures your tests are efficient and reliable.",
    feedback_partial: "You're on the right track with `describe`, `beforeAll`, and `afterAll`. Ensure you're using `app.listen` to start the server and `server.close` to shut it down, and remember to call `done()` for asynchronous setup/teardown.",
    feedback_wrong: "Starting and stopping the server for *every* test with `beforeEach`/`afterEach` is inefficient for integration tests. `beforeAll`/`afterAll` are designed for one-time setup/teardown for the entire test suite.",
    expected: `
import express from 'express';
import request from 'supertest';

// Define a simple in-memory data store for our resources
interface Resource {
  id: string;
  name: string;
  category: string;
}

const initialResources: Resource[] = [
  { id: "res1", name: "Item A", category: "Electronics" },
  { id: "res2", name: "Item B", category: "Books" },
  { id: "res3", name: "Item C", category: "Electronics" },
  { id: "res4", name: "Item D", category: "Home Goods" },
  { id: "res5", name: "Item E", category: "Books" },
  { id: "res6", name: "Item F", category: "Electronics" },
];

// This will be the server instance we test against
let app: express.Application;
let server: any; // To hold the server instance for closing

app = express();

app.get('/resources', (req, res) => {
  const { category } = req.query;
  let filteredResources = initialResources;

  if (typeof category === 'string') {
    filteredResources = initialResources.filter(
      (resource) => resource.category.toLowerCase() === category.toLowerCase()
    );
  }

  res.json(filteredResources);
});

describe('GET /resources', () => {
  beforeAll((done) => {
    server = app.listen(3000, () => {
      done();
    });
  });

  afterAll((done) => {
    server.close(() => {
      done();
    });
  });

  // Test cases will go here
});
`,
    analog_example: `
// Analogous: Setting up a test suite for a utility function
const sum = (a: number, b: number) => a + b;
const subtract = (a: number, b: number) => a - b;

describe('Math operations', () => {
  let initialValue: number;

  beforeAll(() => {
    // One-time setup for the entire suite
    initialValue = 10;
    // console.log('Suite setup complete, initialValue:', initialValue);
  });

  afterAll(() => {
    // One-time teardown for the entire suite
    initialValue = 0; // Resetting for clarity
    // console.log('Suite teardown complete, initialValue:', initialValue);
  });

  it('should correctly add two numbers', () => {
    expect(sum(initialValue, 5)).toBe(15);
  });

  it('should correctly subtract two numbers', () => {
    expect(subtract(initialValue, 3)).toBe(7);
  });
});
`,
    deepDiveLabel: "Why is `done()` important in `beforeAll` and `afterAll`?",
    deepDive: {
      hook: `Imagine you're coordinating a complex stage play. Before the show can start, you need to ensure all props are in place, actors are in costume, and lighting is set. If you just tell everyone "start!" without confirming these asynchronous tasks are complete, you'd have chaos: actors on stage without props, or lights not working. In testing, starting a server or connecting to a database are asynchronous operations. If your test runner doesn't wait for these to finish before running tests, it will try to make requests to a server that isn't listening yet, leading to connection errors and flaky tests.`,
      pain: `⚠️ **Lesson:** Not handling asynchronous setup/teardown in tests. Symptom: Flaky tests, "connection refused" errors, tests failing intermittently, and difficulty diagnosing root causes. This leads to distrust in the test suite and wasted debugging time.`,
      mentalModel: `**Mental model:** The "Asynchronous Task Acknowledgment." The \`done\` callback is like a signal flag. When Jest (or other test runners) sees a \`done\` parameter in your \`beforeAll\`, \`afterAll\`, or \`it\` function, it knows that the function contains asynchronous operations. It will pause execution of the test suite until that \`done()\` function is explicitly called. This signals, "I've finished my asynchronous work; you can proceed." Without this flag, Jest assumes the function is synchronous and immediately moves on, often before your server is ready or shut down.`,
      discover: `**Pattern - Asynchronous Test Hooks:**
\`\`\`typescript
describe('Async Operations', () => {
  let resource: any;

  beforeAll((done) => { // Jest expects 'done' for async
    setTimeout(() => {
      resource = { id: 1, name: "Loaded" };
      done(); // Signal completion after 1 second
    }, 1000);
  });

  afterAll((done) => {
    setTimeout(() => {
      resource = null; // Clean up
      done();
    }, 500);
  });

  it('should have loaded the resource', () => {
    expect(resource).toEqual({ id: 1, name: "Loaded" });
  });
});
\`\`\`
-   **\`done\` Callback:** When a test hook (like \`beforeAll\`, \`afterAll\`, \`it\`) receives a \`done\` argument, Jest waits for \`done()\` to be called before proceeding.
-   **Asynchronous Operations:** This is crucial for operations like starting a server (\`app.listen\`), connecting to a database, or making API calls, which don't complete immediately.
-   **Error Handling:** If an error occurs before \`done()\` is called, Jest will catch it and fail the test, preventing silent failures.
-   **Alternative: Promises/Async-Await:** Modern Jest also supports returning a Promise or using \`async/await\` in hooks, which can be cleaner than \`done()\` for some scenarios.`,
      quickRules: `**Quick rules:**
-   ✅ Use \`done()\` or return a Promise/use \`async/await\` for any asynchronous test hook or test case.
-   ✅ Call \`done()\` exactly once when the asynchronous operation is complete.
-   ✅ Ensure all asynchronous setup is finished before tests begin.
-   ✅ Ensure all asynchronous teardown is finished before the test runner exits.
-   ❌ Forget to call \`done()\` in an asynchronous hook, leading to timeouts.
-   ❌ Call \`done()\` multiple times, which can cause unexpected behavior.
-   ❌ Mix \`done()\` with returning a Promise/using \`async/await\` in the same hook.`,
      watchOut: `👀 **Watch out:** If you forget to call \`done()\` in an asynchronous hook, Jest will eventually time out, reporting a "timeout" error. This can be confusing if you're not expecting asynchronous behavior. Always ensure your asynchronous operations have a clear completion signal.`,
      dryRun: `🔁 **Think:**
1.  Jest starts the test suite. It sees \`beforeAll((done) => { ... })\`.
2.  \`app.listen(3000, () => { done(); })\` is called. The server starts listening on port 3000.
3.  The callback \`() => { done(); }\` is executed *only after* the server has successfully started and is listening.
4.  \`done()\` is called, signaling to Jest that \`beforeAll\` is complete.
5.  Jest then proceeds to run the \`it\` tests.
6.  After all \`it\` tests finish, Jest sees \`afterAll((done) => { ... })\`.
7.  \`server.close(() => { done(); })\` is called. The server begins shutting down.
8.  The callback \`() => { done(); }\` is executed *only after* the server has successfully closed.
9.  \`done()\` is called, signaling to Jest that \`afterAll\` is complete.
(Hint: The \`done()\` call is the critical synchronization point for asynchronous operations.)`,
      build: "**Learning focus:** Structure the test file with `describe`, `beforeAll`, and `afterAll` to manage the Express server's lifecycle for integration tests.",
    },
  },
  {
    id: "step5",
    type: "question",
    phase: "Step 5 of 7",
    paal: "Now, write your first integration test. This test should call the `/resources` endpoint with a specific `category` query parameter and assert that the response contains only items belonging to that category, and that the count is correct.",
    hint: "Use `request(app).get('/resources?category=...')` to make the API call. Use `.expect(200)` for the status code and `.expect((res) => { ... })` to assert on the response body.",
    example_code: `
  it('should return resources filtered by category "Electronics"', async () => {
    const res = await request(app).get('/resources?category=Electronics');
    expect(res.statusCode).toEqual(200);
    expect(res.body.length).toEqual(3);
    expect(res.body.every((r: Resource) => r.category === 'Electronics')).toBe(true);
  });
`,
    think_prompt: "How do you make an API call in a test and verify both the status code and the content of the filtered response?",
    mc_options: [
      "Call `fetch('/resources?category=...')` and check `res.data`.",
      "Use `request(app).get('/resources?category=...')` and assert on `res.statusCode` and `res.body`.",
      "Directly call the Express route handler function with mock `req` and `res` objects.",
    ],
    mc_correct_option: "Use `request(app).get('/resources?category=...')` and assert on `res.statusCode` and `res.body`.",
    mc_anchor: "Use `request(app).get('/resources?category=...')` and assert on `res.statusCode` and `res.body`.",
    why_this_matters: "This test directly verifies that your filtering logic works as expected for a common, valid scenario. It's crucial for ensuring the core functionality of your API.",
    answer_keywords: ["supertest", "request", "get", "expect", "statusCode", "body", "filter"],
    seed_code: `
import express from 'express';
import request from 'supertest';

// Define a simple in-memory data store for our resources
interface Resource {
  id: string;
  name: string;
  category: string;
}

const initialResources: Resource[] = [
  { id: "res1", name: "Item A", category: "Electronics" },
  { id: "res2", name: "Item B", category: "Books" },
  { id: "res3", name: "Item C", category: "Electronics" },
  { id: "res4", name: "Item D", category: "Home Goods" },
  { id: "res5", name: "Item E", category: "Books" },
  { id: "res6", name: "Item F", category: "Electronics" },
];

// This will be the server instance we test against
let app: express.Application;
let server: any; // To hold the server instance for closing

app = express();

app.get('/resources', (req, res) => {
  const { category } = req.query;
  let filteredResources = initialResources;

  if (typeof category === 'string') {
    filteredResources = initialResources.filter(
      (resource) => resource.category.toLowerCase() === category.toLowerCase()
    );
  }

  res.json(filteredResources);
});

describe('GET /resources', () => {
  beforeAll((done) => {
    server = app.listen(3000, () => {
      done();
    });
  });

  afterAll((done) => {
    server.close(() => {
      done();
    });
  });

  // Test cases will go here
});
`,
    starter_code: `
import express from 'express';
import request from 'supertest';

// Define a simple in-memory data store for our resources
interface Resource {
  id: string;
  name: string;
  category: string;
}

const initialResources: Resource[] = [
  { id: "res1", name: "Item A", category: "Electronics" },
  { id: "res2", name: "Item B", category: "Books" },
  { id: "res3", name: "Item C", category: "Electronics" },
  { id: "res4", name: "Item D", category: "Home Goods" },
  { id: "res5", name: "Item E", category: "Books" },
  { id: "res6", name: "Item F", category: "Electronics" },
];

// This will be the server instance we test against
let app: express.Application;
let server: any; // To hold the server instance for closing

app = express();

app.get('/resources', (req, res) => {
  const { category } = req.query;
  let filteredResources = initialResources;

  if (typeof category === 'string') {
    filteredResources = initialResources.filter(
      (resource) => resource.category.toLowerCase() === category.toLowerCase()
    );
  }

  res.json(filteredResources);
});

describe('GET /resources', () => {
  beforeAll((done) => {
    server = app.listen(3000, () => {
      done();
    });
  });

  afterAll((done) => {
    server.close(() => {
      done();
    });
  });

  // Add your test for filtering by category here
});
`,
    feedback_correct: "Excellent! You've successfully written a test that verifies the filtered results. This confirms your API's core filtering logic is sound.",
    feedback_partial: "You're on the right track with using `request(app)`. Ensure you're making a GET request with the `category` query parameter, checking for a `200` status, and then asserting that *all* items in `res.body` match the requested category and the count is correct.",
    feedback_wrong: "While `fetch` is used for client-side API calls, `supertest` is the standard for integration testing Node.js APIs. Directly calling the handler bypasses the HTTP layer, making it a unit test, not an integration test.",
    expected: `
import express from 'express';
import request from 'supertest';

// Define a simple in-memory data store for our resources
interface Resource {
  id: string;
  name: string;
  category: string;
}

const initialResources: Resource[] = [
  { id: "res1", name: "Item A", category: "Electronics" },
  { id: "res2", name: "Item B", category: "Books" },
  { id: "res3", name: "Item C", category: "Electronics" },
  { id: "res4", name: "Item D", category: "Home Goods" },
  { id: "res5", name: "Item E", category: "Books" },
  { id: "res6", name: "Item F", category: "Electronics" },
];

// This will be the server instance we test against
let app: express.Application;
let server: any; // To hold the server instance for closing

app = express();

app.get('/resources', (req, res) => {
  const { category } = req.query;
  let filteredResources = initialResources;

  if (typeof category === 'string') {
    filteredResources = initialResources.filter(
      (resource) => resource.category.toLowerCase() === category.toLowerCase()
    );
  }

  res.json(filteredResources);
});

describe('GET /resources', () => {
  beforeAll((done) => {
    server = app.listen(3000, () => {
      done();
    });
  });

  afterAll((done) => {
    server.close(() => {
      done();
    });
  });

  it('should return resources filtered by category "Electronics"', async () => {
    const res = await request(app).get('/resources?category=Electronics');
    expect(res.statusCode).toEqual(200);
    expect(res.body.length).toEqual(3);
    expect(res.body.every((r: Resource) => r.category.toLowerCase() === 'electronics')).toBe(true);
  });
});
`,
    analog_example: `
// Analogous: Testing a function that filters a local array
const items = [
  { id: 1, type: "Fruit", name: "Apple" },
  { id: 2, type: "Vegetable", name: "Carrot" },
  { id: 3, type: "Fruit", name: "Banana" },
];

function filterByType(list: typeof items, type: string) {
  return list.filter(item => item.type === type);
}

describe('filterByType', () => {
  it('should return only fruits when filtered by "Fruit"', () => {
    const result = filterByType(items, "Fruit");
    expect(result.length).toBe(2);
    expect(result.every(item => item.type === "Fruit")).toBe(true);
    expect(result).toEqual([
      { id: 1, type: "Fruit", name: "Apple" },
      { id: 3, type: "Fruit", name: "Banana" },
    ]);
  });
});
`,
    deepDiveLabel: "What's the difference between unit and integration tests?",
    deepDive: {
      hook: `Imagine you're testing a car. A unit test would be like testing if the engine's spark plugs fire correctly in isolation, or if the brake pads apply pressure. You're focusing on the smallest, individual components. An integration test, however, is like testing if pressing the brake pedal actually stops the car, or if turning the steering wheel changes the car's direction. You're verifying that different components (brakes, wheels, steering column, driver input) work together as expected to achieve a larger goal. If only unit tests are done, you might have perfectly working individual parts that don't fit together or communicate correctly, leading to a non-functional system.`,
      pain: `⚠️ **Lesson:** Relying solely on unit tests for complex systems. Symptom: Code that passes all unit tests but fails in production, unexpected interactions between modules, and difficulty pinpointing failures that span multiple components. This leads to a false sense of security and costly runtime bugs.`,
      mentalModel: `**Mental model:** "The Component vs. The Assembly Line."
**Unit Test:** Focuses on a single, isolated "component" (a function, a class method) without external dependencies. It's like testing if a single gear in a watch works perfectly on its own.
**Integration Test:** Focuses on how multiple "components" or "modules" interact and work together. It's like testing if the entire watch mechanism (all the gears, springs, and hands) correctly tells time when assembled.
The goal of integration tests is to catch bugs that arise from the *interactions* between parts, which unit tests, by design, cannot detect.`,
      discover: `**Pattern - Integration Testing with Supertest:**
\`\`\`typescript
import request from 'supertest';
import express from 'express';

const app = express();
app.get('/greet/:name', (req, res) => {
  res.send(\`Hello, \${req.params.name}!\`);
});

describe('GET /greet/:name', () => {
  it('should respond with a greeting', async () => {
    const res = await request(app).get('/greet/World');
    expect(res.statusCode).toEqual(200);
    expect(res.text).toEqual('Hello, World!');
  });
});
\`\`\`
-   **Unit Tests:** Test individual functions or methods in isolation, often using mocks for dependencies. They are fast and pinpoint exact failures.
-   **Integration Tests:** Verify that different parts of a system (e.g., API endpoint, database, external service) work correctly when combined. They operate at a higher level, often involving actual HTTP requests.
-   **Supertest:** A library specifically designed for testing HTTP servers. It allows you to make requests to your Express app (or any HTTP server) without actually starting a server on a port, or by interacting with a running server.
-   **Coverage:** Integration tests provide confidence that the entire flow, from request to response, functions correctly, including routing, middleware, and data handling.`,
      quickRules: `**Quick rules:**
-   ✅ Use unit tests for granular logic and individual function correctness.
-   ✅ Use integration tests to verify interactions between modules and external systems (like APIs).
-   ✅ Aim for high unit test coverage, but don't neglect integration tests for critical paths.
-   ✅ Keep integration tests focused on a specific interaction or flow.
-   ❌ Use unit tests to verify complex end-to-end user journeys.
-   ❌ Write integration tests that are too broad, making failures hard to diagnose.
-   ❌ Mock away all dependencies in integration tests; they should interact with real components.`,
      watchOut: `👀 **Watch out:** Integration tests are typically slower than unit tests because they involve more components and potentially network I/O. Balance your test suite with a good mix of both. Over-relying on integration tests can lead to a slow feedback loop during development.`,
      dryRun: `🔁 **Think:**
1.  \`request(app).get('/resources?category=Electronics')\` sends an HTTP GET request to the Express app.
2.  The Express app's \`/resources\` route handler receives the request.
3.  The handler processes the \`category=Electronics\` query parameter, filters the \`initialResources\`.
4.  The filtered data (3 electronics items) is sent back as a JSON response with status 200.
5.  Supertest receives this response.
6.  \`expect(res.statusCode).toEqual(200)\` passes.
7.  \`expect(res.body.length).toEqual(3)\` passes.
8.  \`expect(res.body.every((r: Resource) => r.category.toLowerCase() === 'electronics'))\` iterates through the 3 items, confirming each is 'Electronics', and passes.
(Hint: Trace the request through the server and back to the test's assertions.)`,
      build: "**Learning focus:** Write an integration test that calls the filtered list endpoint and asserts that the returned data matches the specified category and count.",
    },
  },
  {
    id: "step6",
    type: "question",
    phase: "Step 6 of 7",
    paal: "It's important to test edge cases. Add a new test case that queries for a `category` that has no matching resources. Assert that the API returns an empty array and a `200` status code.",
    hint: "Use a category like 'NonExistent' that is not present in your `initialResources`. The expected `res.body` should be an empty array.",
    example_code: `
  it('should return an empty array for a non-existent category', async () => {
    const res = await request(app).get('/resources?category=NonExistent');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual([]);
  });
`,
    think_prompt: "How do you verify the behavior of the API when a filter yields no results?",
    mc_options: [
      "Expect a `404 Not Found` status code.",
      "Expect a `200 OK` status code with an empty array.",
      "Expect an error message in the response body.",
    ],
    mc_correct_option: "Expect a `200 OK` status code with an empty array.",
    mc_anchor: "Expect a `200 OK` status code with an empty array.",
    why_this_matters: "Testing edge cases like 'no matches' ensures your API behaves gracefully and predictably, providing a consistent experience for clients even when no data fits the criteria.",
    answer_keywords: ["edge case", "empty array", "200 status", "no matches"],
    seed_code: `
import express from 'express';
import request from 'supertest';

// Define a simple in-memory data store for our resources
interface Resource {
  id: string;
  name: string;
  category: string;
}

const initialResources: Resource[] = [
  { id: "res1", name: "Item A", category: "Electronics" },
  { id: "res2", name: "Item B", category: "Books" },
  { id: "res3", name: "Item C", category: "Electronics" },
  { id: "res4", name: "Item D", category: "Home Goods" },
  { id: "res5", name: "Item E", category: "Books" },
  { id: "res6", name: "Item F", category: "Electronics" },
];

// This will be the server instance we test against
let app: express.Application;
let server: any; // To hold the server instance for closing

app = express();

app.get('/resources', (req, res) => {
  const { category } = req.query;
  let filteredResources = initialResources;

  if (typeof category === 'string') {
    filteredResources = initialResources.filter(
      (resource) => resource.category.toLowerCase() === category.toLowerCase()
    );
  }

  res.json(filteredResources);
});

describe('GET /resources', () => {
  beforeAll((done) => {
    server = app.listen(3000, () => {
      done();
    });
  });

  afterAll((done) => {
    server.close(() => {
      done();
    });
  });

  it('should return resources filtered by category "Electronics"', async () => {
    const res = await request(app).get('/resources?category=Electronics');
    expect(res.statusCode).toEqual(200);
    expect(res.body.length).toEqual(3);
    expect(res.body.every((r: Resource) => r.category.toLowerCase() === 'electronics')).toBe(true);
  });
});
`,
    starter_code: `
import express from 'express';
import request from 'supertest';

// Define a simple in-memory data store for our resources
interface Resource {
  id: string;
  name: string;
  category: string;
}

const initialResources: Resource[] = [
  { id: "res1", name: "Item A", category: "Electronics" },
  { id: "res2", name: "Item B", category: "Books" },
  { id: "res3", name: "Item C", category: "Electronics" },
  { id: "res4", name: "Item D", category: "Home Goods" },
  { id: "res5", name: "Item E", category: "Books" },
  { id: "res6", name: "Item F", category: "Electronics" },
];

// This will be the server instance we test against
let app: express.Application;
let server: any; // To hold the server instance for closing

app = express();

app.get('/resources', (req, res) => {
  const { category } = req.query;
  let filteredResources = initialResources;

  if (typeof category === 'string') {
    filteredResources = initialResources.filter(
      (resource) => resource.category.toLowerCase() === category.toLowerCase()
    );
  }

  res.json(filteredResources);
});

describe('GET /resources', () => {
  beforeAll((done) => {
    server = app.listen(3000, () => {
      done();
    });
  });

  afterAll((done) => {
    server.close(() => {
      done();
    });
  });

  it('should return resources filtered by category "Electronics"', async () => {
    const res = await request(app).get('/resources?category=Electronics');
    expect(res.statusCode).toEqual(200);
    expect(res.body.length).toEqual(3);
    expect(res.body.every((r: Resource) => r.category.toLowerCase() === 'electronics')).toBe(true);
  });

  // Add your test for a non-existent category here
});
`,
    feedback_correct: "Excellent! You've successfully added a test for a non-existent category, confirming your API handles this edge case gracefully by returning an empty array.",
    feedback_partial: "You're close! Ensure your test calls the endpoint with a category that genuinely doesn't exist in your data. The assertion should check for a `200` status code and an `empty array` for `res.body`.",
    feedback_wrong: "A `404 Not Found` status code is typically for when the *endpoint itself* doesn't exist, or a specific resource by ID is not found. For a filter that yields no results, a `200 OK` with an empty array is the standard and expected behavior.",
    expected: `
import express from 'express';
import request from 'supertest';

// Define a simple in-memory data store for our resources
interface Resource {
  id: string;
  name: string;
  category: string;
}

const initialResources: Resource[] = [
  { id: "res1", name: "Item A", category: "Electronics" },
  { id: "res2", name: "Item B", category: "Books" },
  { id: "res3", name: "Item C", category: "Electronics" },
  { id: "res4", name: "Item D", category: "Home Goods" },
  { id: "res5", name: "Item E", category: "Books" },
  { id: "res6", name: "Item F", category: "Electronics" },
];

// This will be the server instance we test against
let app: express.Application;
let server: any; // To hold the server instance for closing

app = express();

app.get('/resources', (req, res) => {
  const { category } = req.query;
  let filteredResources = initialResources;

  if (typeof category === 'string') {
    filteredResources = initialResources.filter(
      (resource) => resource.category.toLowerCase() === category.toLowerCase()
    );
  }

  res.json(filteredResources);
});

describe('GET /resources', () => {
  beforeAll((done) => {
    server = app.listen(3000, () => {
      done();
    });
  });

  afterAll((done) => {
    server.close(() => {
      done();
    });
  });

  it('should return resources filtered by category "Electronics"', async () => {
    const res = await request(app).get('/resources?category=Electronics');
    expect(res.statusCode).toEqual(200);
    expect(res.body.length).toEqual(3);
    expect(res.body.every((r: Resource) => r.category.toLowerCase() === 'electronics')).toBe(true);
  });

  it('should return an empty array for a non-existent category', async () => {
    const res = await request(app).get('/resources?category=NonExistent');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual([]);
  });
});
`,
    analog_example: `
// Analogous: Testing a function that filters a local array for no matches
const items = [
  { id: 1, type: "Fruit", name: "Apple" },
  { id: 2, type: "Vegetable", name: "Carrot" },
];

function filterByType(list: typeof items, type: string) {
  return list.filter(item => item.type === type);
}

describe('filterByType - no matches', () => {
  it('should return an empty array for a type that does not exist', () => {
    const result = filterByType(items, "Dairy");
    expect(result.length).toBe(0);
    expect(result).toEqual([]);
  });
});
`,
    deepDiveLabel: "Why is an empty array (200 OK) preferred over 404 for no filter matches?",
    deepDive: {
      hook: `Imagine you walk into a library and ask the librarian, "Do you have any books on quantum physics written by cats?" If the librarian says, "Sorry, we don't have any," that's a clear and helpful response. You understand the request was valid, but there were no matching items. Now, imagine if the librarian instead said, "I don't understand your request!" or "The library doesn't exist!" That would be confusing and incorrect. In APIs, a 404 (Not Found) implies that the *resource itself* (e.g., the \`/resources\` endpoint) or a specific identified item (e.g., \`/resources/123\`) doesn't exist. When a filter yields no results, the endpoint *does* exist, and the request *was* understood; there just happened to be no data matching the criteria.`,
      pain: `⚠️ **Lesson:** Misusing HTTP status codes. Symptom: Confusing API clients, inconsistent error handling, and difficulty distinguishing between a valid request with no data and an invalid request or missing resource. This leads to client-side bugs and poor developer experience.`,
      mentalModel: `**Mental model:** The "Librarian's Accurate Response." A 200 OK with an empty array is like the librarian saying, "Yes, I understand your request for 'books on quantum physics by cats,' and I've checked, but there are currently zero matching books." This is an accurate and expected response for a valid query that simply yields no results. A 404, on the other hand, is like the librarian saying, "I don't even have a 'quantum physics by cats' section, or perhaps this isn't even a library!" It implies a fundamental misunderstanding or absence of the requested *type* of resource, not just an empty set of results for a valid query.`,
      discover: `**Pattern - Handling No Filter Matches:**
\`\`\`typescript
app.get('/items', (req, res) => {
  const { color } = req.query;
  let items = [
    { id: 1, color: 'red' },
    { id: 2, color: 'blue' }
  ];

  if (color) {
    items = items.filter(item => item.color === color);
  }

  // If items is empty, it still sends 200 OK with []
  res.status(200).json(items);
});

// Request: GET /items?color=green
// Response: 200 OK, Body: []
\`\`\`
-   **200 OK:** Indicates that the request was successfully processed and the server is returning the requested data. An empty array \`[]\` is a valid form of data, representing "no items found matching your criteria."
-   **404 Not Found:** Reserved for situations where the requested resource *itself* does not exist (e.g., \`/non-existent-endpoint\` or \`/users/999\` where user 999 doesn't exist).
-   **Client Expectation:** Clients typically expect a \`200 OK\` with an empty array when a filter yields no results, allowing them to easily check \`response.data.length === 0\` without handling a separate error status.
-   **Consistency:** Maintaining consistent status codes for successful operations (even if the result set is empty) simplifies client-side logic and error handling.`,
      quickRules: `**Quick rules:**
-   ✅ Return \`200 OK\` with an empty array \`[]\` when a filter yields no results.
-   ✅ Use \`200 OK\` for any successful request, even if the payload is minimal.
-   ✅ Use \`404 Not Found\` when the requested *resource path* or *specific resource ID* does not exist.
-   ✅ Provide clear, consistent API responses for all scenarios.
-   ❌ Return \`404 Not Found\` when a filter parameter results in no matches.
-   ❌ Return a custom error object with a \`200 OK\` status for "no results."
-   ❌ Send a \`204 No Content\` for an empty array; \`204\` implies no body, but \`[]\` is a body.`,
      watchOut: `👀 **Watch out:** While a \`204 No Content\` might seem appropriate for an empty result set, it explicitly states that the response *must not* contain a message body. Sending \`[]\` with a \`204\` status would violate the HTTP specification. Stick to \`200 OK\` with an empty array for filtered lists with no matches.`,
      dryRun: `🔁 **Think:**
1.  \`request(app).get('/resources?category=NonExistent')\` sends a GET request.
2.  The server receives the request. \`req.query.category\` is "NonExistent".
3.  The \`filter\` method is applied to \`initialResources\`.
4.  No resource has \`category.toLowerCase() === "nonexistent"\`.
5.  \`filteredResources\` becomes \`[]\` (an empty array).
6.  \`res.json([])\` is called, sending an empty array with a \`200 OK\` status.
7.  The test receives the response.
8.  \`expect(res.statusCode).toEqual(200)\` passes.
9.  \`expect(res.body).toEqual([])\` passes.
(Hint: The key is that the filter operation *completes successfully* but yields no elements.)`,
      build: "**Learning focus:** Add an integration test to verify that the API correctly returns an empty array with a `200 OK` status when a filter parameter yields no matching resources.",
    },
  },
  {
    id: "step7",
    type: "question",
    phase: "Step 7 of 7",
    paal: "Finally, add a test case to ensure the API returns *all* resources when no `category` query parameter is provided. This verifies the default behavior of your endpoint.",
    hint: "Make a GET request to `/resources` without any query parameters. Assert that the `res.body.length` matches the total number of items in `initialResources`.",
    example_code: `
  it('should return all resources when no category filter is provided', async () => {
    const res = await request(app).get('/resources');
    expect(res.statusCode).toEqual(200);
    expect(res.body.length).toEqual(initialResources.length);
    expect(res.body).toEqual(expect.arrayContaining(initialResources));
  });
`,
    think_prompt: "How do you test the unfiltered default behavior of an API endpoint?",
    mc_options: [
      "Send a request with `category='all'`.",
      "Send a request without the `category` parameter and check for all items.",
      "Send a POST request to `/resources`.",
    ],
    mc_correct_option: "Send a request without the `category` parameter and check for all items.",
    mc_anchor: "Send a request without the `category` parameter and check for all items.",
    why_this_matters: "Verifying the default behavior is crucial. It ensures that if a client doesn't specify a filter, they still receive a complete and expected dataset, preventing accidental data omissions.",
    answer_keywords: ["no filter", "all resources", "default behavior", "initialResources.length"],
    seed_code: `
import express from 'express';
import request from 'supertest';

// Define a simple in-memory data store for our resources
interface Resource {
  id: string;
  name: string;
  category: string;
}

const initialResources: Resource[] = [
  { id: "res1", name: "Item A", category: "Electronics" },
  { id: "res2", name: "Item B", category: "Books" },
  { id: "res3", name: "Item C", category: "Electronics" },
  { id: "res4", name: "Item D", category: "Home Goods" },
  { id: "res5", name: "Item E", category: "Books" },
  { id: "res6", name: "Item F", category: "Electronics" },
];

// This will be the server instance we test against
let app: express.Application;
let server: any; // To hold the server instance for closing

app = express();

app.get('/resources', (req, res) => {
  const { category } = req.query;
  let filteredResources = initialResources;

  if (typeof category === 'string') {
    filteredResources = initialResources.filter(
      (resource) => resource.category.toLowerCase() === category.toLowerCase()
    );
  }

  res.json(filteredResources);
});

describe('GET /resources', () => {
  beforeAll((done) => {
    server = app.listen(3000, () => {
      done();
    });
  });

  afterAll((done) => {
    server.close(() => {
      done();
    });
  });

  it('should return resources filtered by category "Electronics"', async () => {
    const res = await request(app).get('/resources?category=Electronics');
    expect(res.statusCode).toEqual(200);
    expect(res.body.length).toEqual(3);
    expect(res.body.every((r: Resource) => r.category.toLowerCase() === 'electronics')).toBe(true);
  });

  it('should return an empty array for a non-existent category', async () => {
    const res = await request(app).get('/resources?category=NonExistent');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual([]);
  });
});
`,
    starter_code: `
import express from 'express';
import request from 'supertest';

// Define a simple in-memory data store for our resources
interface Resource {
  id: string;
  name: string;
  category: string;
}

const initialResources: Resource[] = [
  { id: "res1", name: "Item A", category: "Electronics" },
  { id: "res2", name: "Item B", category: "Books" },
  { id: "res3", name: "Item C", category: "Electronics" },
  { id: "res4", name: "Item D", category: "Home Goods" },
  { id: "res5", name: "Item E", category: "Books" },
  { id: "res6", name: "Item F", category: "Electronics" },
];

// This will be the server instance we test against
let app: express.Application;
let server: any; // To hold the server instance for closing

app = express();

app.get('/resources', (req, res) => {
  const { category } = req.query;
  let filteredResources = initialResources;

  if (typeof category === 'string') {
    filteredResources = initialResources.filter(
      (resource) => resource.category.toLowerCase() === category.toLowerCase()
    );
  }

  res.json(filteredResources);
});

describe('GET /resources', () => {
  beforeAll((done) => {
    server = app.listen(3000, () => {
      done();
    });
  });

  afterAll((done) => {
    server.close(() => {
      done();
    });
  });

  it('should return resources filtered by category "Electronics"', async () => {
    const res = await request(app).get('/resources?category=Electronics');
    expect(res.statusCode).toEqual(200);
    expect(res.body.length).toEqual(3);
    expect(res.body.every((r: Resource) => r.category.toLowerCase() === 'electronics')).toBe(true);
  });

  it('should return an empty array for a non-existent category', async () => {
    const res = await request(app).get('/resources?category=NonExistent');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual([]);
  });

  // Add your test for no category filter here
});
`,
    feedback_correct: "Superb! You've covered all the main scenarios, including the default unfiltered behavior. Your API is now well-tested for its filtering capabilities.",
    feedback_partial: "You're on the right track! Ensure your test makes a request to `/resources` *without* any query parameters. Then, assert that the response body contains *all* `initialResources` and has the correct total length.",
    feedback_wrong: "Sending `category='all'` would still be a filtered request, just for a category named 'all'. To test the *unfiltered* default, omit the parameter entirely. A POST request is for creating data, not retrieving it.",
    expected: `
import express from 'express';
import request from 'supertest';

// Define a simple in-memory data store for our resources
interface Resource {
  id: string;
  name: string;
  category: string;
}

const initialResources: Resource[] = [
  { id: "res1", name: "Item A", category: "Electronics" },
  { id: "res2", name: "Item B", category: "Books" },
  { id: "res3", name: "Item C", category: "Electronics" },
  { id: "res4", name: "Item D", category: "Home Goods" },
  { id: "res5", name: "Item E", category: "Books" },
  { id: "res6", name: "Item F", category: "Electronics" },
];

// This will be the server instance we test against
let app: express.Application;
let server: any; // To hold the server instance for closing

app = express();

app.get('/resources', (req, res) => {
  const { category } = req.query;
  let filteredResources = initialResources;

  if (typeof category === 'string') {
    filteredResources = initialResources.filter(
      (resource) => resource.category.toLowerCase() === category.toLowerCase()
    );
  }

  res.json(filteredResources);
});

describe('GET /resources', () => {
  beforeAll((done) => {
    server = app.listen(3000, () => {
      done();
    });
  });

  afterAll((done) => {
    server.close(() => {
      done();
    });
  });

  it('should return resources filtered by category "Electronics"', async () => {
    const res = await request(app).get('/resources?category=Electronics');
    expect(res.statusCode).toEqual(200);
    expect(res.body.length).toEqual(3);
    expect(res.body.every((r: Resource) => r.category.toLowerCase() === 'electronics')).toBe(true);
  });

  it('should return an empty array for a non-existent category', async () => {
    const res = await request(app).get('/resources?category=NonExistent');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual([]);
  });

  it('should return all resources when no category filter is provided', async () => {
    const res = await request(app).get('/resources');
    expect(res.statusCode).toEqual(200);
    expect(res.body.length).toEqual(initialResources.length);
    expect(res.body).toEqual(expect.arrayContaining(initialResources));
  });
});
`,
    analog_example: `
// Analogous: Testing a function's default behavior when no filter is applied
const allTasks = [
  { id: 1, status: "pending", description: "Buy groceries" },
  { id: 2, status: "completed", description: "Walk dog" },
  { id: 3, status: "pending", description: "Pay bills" },
];

function getTasks(statusFilter: string | undefined) {
  if (statusFilter) {
    return allTasks.filter(task => task.status === statusFilter);
  }
  return allTasks; // Default: return all
}

describe('getTasks - no filter', () => {
  it('should return all tasks when no status filter is provided', () => {
    const result = getTasks(undefined);
    expect(result.length).toBe(allTasks.length);
    expect(result).toEqual(expect.arrayContaining(allTasks));
  });
});
`,
    deepDiveLabel: "Why is `expect.arrayContaining` useful for comparing arrays?",
    deepDive: {
      hook: `Imagine you're checking a grocery list. You have "Milk," "Eggs," and "Bread" on your list. When you get home, you might have "Milk," "Eggs," "Bread," and "Juice." If you strictly compare your shopping cart to your list, it would fail because you bought an extra item. But if your goal was simply to ensure you got *at least* everything on the list, then the extra "Juice" shouldn't cause a failure. In testing, sometimes you don't need an exact, element-by-element match of two arrays, especially if the order might vary or if the response might contain additional, non-critical fields. A strict \`toEqual\` would fail in such cases, even if the core data you care about is present.`,
      pain: `⚠️ **Lesson:** Overly strict array comparisons in tests. Symptom: Flaky tests that fail due to minor differences (like order or extra items), leading to frustration and wasted time fixing non-issues. This can make tests brittle and hard to maintain.`,
      mentalModel: `**Mental model:** The "Flexible Checklist." \`expect.arrayContaining()\` is like a flexible checklist for arrays. Instead of demanding that two arrays be *identical* in every way (like \`toEqual\`), it only checks if the *expected items* are present in the *received array*. It doesn't care about the order of items in the received array, nor does it fail if the received array contains *more* items than specified in the \`expect.arrayContaining\` argument. This is particularly useful when an API might return additional metadata or when the order of elements isn't guaranteed.`,
      discover: `**Pattern - Flexible Array Matching:**
\`\`\`typescript
const actualResponse = [
  { id: 1, name: "Apple", price: 1.0 },
  { id: 2, name: "Banana", price: 0.5 },
  { id: 3, name: "Orange", price: 1.2 },
];

const expectedSubset = [
  { id: 1, name: "Apple" }, // Note: no price
  { id: 2, name: "Banana" },
];

// This will pass because actualResponse contains all items in expectedSubset
expect(actualResponse).toEqual(expect.arrayContaining(expectedSubset));

// This would fail because actualResponse has a 'price' field
// expect(actualResponse).toEqual(expectedSubset);

// This would also pass, as order doesn't matter for arrayContaining
const shuffledResponse = [
  { id: 2, name: "Banana", price: 0.5 },
  { id: 1, name: "Apple", price: 1.0 },
  { id: 3, name: "Orange", price: 1.2 },
];
expect(shuffledResponse).toEqual(expect.arrayContaining(expectedSubset));
\`\`\`
-   **\`expect.arrayContaining(array)\`:** Asserts that the received array contains *at least* all the elements of the expected \`array\`.
-   **Flexibility:** It ignores the order of elements and allows the received array to contain additional elements not specified in the \`expect.arrayContaining\` argument.
-   **Object Matching:** When comparing arrays of objects, \`expect.arrayContaining\` performs a deep comparison for each object, ensuring that the properties you specify in your expected objects match.
-   **Use Cases:** Ideal for testing API responses where the order of items might not be guaranteed, or where the response might include extra fields (like timestamps or metadata) that aren't relevant to the core assertion.`,
      quickRules: `**Quick rules:**
-   ✅ Use \`expect.arrayContaining()\` when you need to verify that a subset of items exists in an array, regardless of order or extra items.
-   ✅ Employ it when testing API responses where the exact order or full object structure isn't critical.
-   ✅ Combine with \`expect.objectContaining()\` for flexible matching of objects within arrays.
-   ✅ Use \`toEqual()\` for strict, element-by-element, order-sensitive array comparisons.
-   ❌ Use \`expect.arrayContaining()\` if the exact order of elements is crucial to your test.
-   ❌ Use \`expect.arrayContaining()\` if the received array *must not* contain any extra elements.
-   ❌ Rely on \`expect.arrayContaining()\` to verify the *absence* of specific items (use \`not.arrayContaining\` or direct filtering for that).`,
      watchOut: `👀 **Watch out:** While \`expect.arrayContaining\` is flexible, it can sometimes be *too* lenient. If you truly need to assert that an array contains *only* specific items in a specific order, then \`toEqual\` is the correct matcher. Always choose the matcher that precisely reflects the assertion you intend to make.`,
      dryRun: `🔁 **Think:**
1.  \`request(app).get('/resources')\` sends a GET request with no query parameters.
2.  The server receives the request. \`req.query.category\` is \`undefined\`.
3.  The \`if (typeof category === 'string')\` condition is false.
4.  \`filteredResources\` remains \`initialResources\` (all 6 items).
5.  \`res.json(initialResources)\` is called, sending all 6 items with a \`200 OK\` status.
6.  The test receives the response.
7.  \`expect(res.statusCode).toEqual(200)\` passes.
8.  \`expect(res.body.length).toEqual(initialResources.length)\` passes (6 === 6).
9.  \`expect(res.body).toEqual(expect.arrayContaining(initialResources))\` checks if the received body contains all elements of \`initialResources\`, which it does, and passes.
(Hint: The conditional filtering logic is skipped, and the original array is returned.)`,
      build: "**Learning focus:** Write an integration test to confirm that the API returns all resources when no filter parameter is provided, verifying its default behavior.",
    },
  },
];

const sideItems = [
  { label: "Lesson", id: "intro" },
  { label: "Objectives", id: "objectives" },
  { label: "Step 1: Server Setup", id: "step1" },
  { label: "Step 2: Endpoint Shell", id: "step2" },
  { label: "Step 3: Filtering Logic", id: "step3" },
  { label: "Step 4: Test Suite Setup", id: "step4" },
  { label: "Step 5: Filtered Test", id: "step5" },
  { label: "Step 6: No Match Test", id: "step6" },
  { label: "Step 7: Unfiltered Test", id: "step7" },
];

export default createINPACTEngine({
  NODES,
  sideItems,
  lessonNum: 0,
  title: "Querying a List Endpoint with Filters",
  shortName: "Filtered List Query",
});
