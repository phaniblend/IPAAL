import createINPACTEngine from "../inpact_engine_shared";
import express from 'express'; // Mocking a backend environment
import { Request, Response } from 'express'; // For type hints

// Module-scope types
interface Resource {
  id: string;
  name: string;
  status: 'active' | 'inactive' | 'pending';
  category: 'tool' | 'material' | 'service';
  createdAt: string;
}

interface PaginationMeta {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

interface PaginatedResponse<T> {
  meta: PaginationMeta;
  items: T[];
}

// Mock database for demonstration
const mockDatabase: Resource[] = Array.from({ length: 100 }, (_, i) => ({
  id: `res-${i + 1}`,
  name: `Resource ${i + 1}`,
  status: i % 3 === 0 ? 'active' : (i % 3 === 1 ? 'inactive' : 'pending'),
  category: i % 2 === 0 ? 'tool' : (i % 4 === 1 ? 'material' : 'service'),
  createdAt: new Date(Date.now() - (i * 1000 * 60 * 60 * 24)).toISOString(),
}));

export const NODES = [
  {
    id: "intro",
    type: "reveal",
    phase: "Lesson",
    content: {
      tag: "filterable-pagination-endpoints",
      title: "Building Scalable List Endpoints with Pagination and Filtering",
      body: `When building applications that display lists of data, such as user profiles, product catalogs, or event schedules, simply returning all items at once quickly becomes unmanageable. Imagine an application with thousands or even millions of records; fetching all of them in a single request would overwhelm both the server and the client, leading to slow load times, high memory usage, and a poor user experience. This is where pagination and filtering become indispensable, allowing clients to request specific subsets of data efficiently.

This pattern is fundamental to creating robust and performant APIs. By implementing pagination, you enable clients to retrieve data in manageable chunks, improving responsiveness and reducing network overhead. Filtering further enhances usability by allowing users to narrow down results based on specific criteria, making it easier to find relevant information without sifting through irrelevant data. Together, these techniques ensure that your API can scale gracefully as your data grows, providing a smooth and efficient experience for application users.`,
      usecase: "A settings panel displaying a list of user-created templates, where users can browse through pages of templates and filter them by 'status' (e.g., 'draft', 'published') or 'category' (e.g., 'email', 'document').",
    },
  },
  {
    id: "objectives",
    type: "objectives",
    phase: "Objectives",
    items: [
      "Define a consistent API response structure for paginated data.",
      "Extract and validate pagination parameters (page number, page size) from incoming requests.",
      "Implement server-side logic to paginate a dataset.",
      "Extract and apply filtering parameters to a dataset.",
      "Construct and send a paginated and filtered JSON response.",
    ],
  },
  {
    id: "step1",
    type: "question",
    phase: "Step 1 of 7",
    paal: "Begin by setting up a basic Express server and defining the initial route handler for `/resources`. We'll also include a mock database to simulate data storage.",
    hint: "Remember to import `express` and initialize an app. The route handler will take `Request` and `Response` objects.",
    example_code: `
import express from 'express';
import { Request, Response } from 'express';

const app = express();
const PORT = 3000;

// Mock database (already defined in module scope)

app.get('/resources', (req: Request, res: Response) => {
  // Logic will go here
});

app.listen(PORT, () => {
  console.log(\`Server running on http://localhost:\${PORT}\`);
});
`,
    think_prompt: "Which code snippet correctly sets up an Express server and a basic GET route handler for `/resources`?",
    mc_options: [
      "const app = express(); app.get('/resources', (req, res) => {}); app.listen(3000);",
      "function getResources(req, res) {}; export default getResources;",
      "import { server } from 'http'; server.create((req, res) => {});",
    ],
    mc_correct_option: "const app = express(); app.get('/resources', (req, res) => {}); app.listen(3000);",
    mc_anchor: "app.get('/resources', (req: Request, res: Response) => {",
    why_this_matters: "Establishing the server and route handler is the foundational step for any API. It defines the entry point for client requests and the environment where our pagination and filtering logic will reside. Without this, there's no API to interact with.",
    answer_keywords: ["express", "route", "get", "server"],
    seed_code: `
import express from 'express';
import { Request, Response } from 'express';

// Module-scope types (Resource, PaginationMeta, PaginatedResponse) and mockDatabase are implicitly available.
// For the purpose of this step, we'll focus on the server setup.
`,
    starter_code: `
import express from 'express';
import { Request, Response } from 'express';

const app = express();
const PORT = 3000;

// Mock database (already defined in module scope)

// Add your server setup and route handler here
`,
    feedback_correct: "Excellent! You've correctly set up the Express server and defined the initial GET route for `/resources`. This is the canvas for our API logic.",
    feedback_partial: "You're close, but ensure you're using the `express` framework correctly to initialize the app and define the route. The `listen` call is also essential.",
    feedback_wrong: "This approach doesn't use the Express framework for setting up the server and routing. Express provides a more structured and widely adopted way to build web APIs.",
    expected: `
import express from 'express';
import { Request, Response } from 'express';

const app = express();
const PORT = 3000;

// Mock database (already defined in module scope)

app.get('/resources', (req: Request, res: Response) => {
  // Logic will go here
});

app.listen(PORT, () => {
  console.log(\`Server running on http://localhost:\${PORT}\`);
});
`,
    analog_example: `
// Analog: A simple command-line tool for listing files
import * as fs from 'fs';
import * as path from 'path';

function listDirectoryContents(dirPath: string): string[] {
  try {
    return fs.readdirSync(dirPath);
  } catch (error) {
    console.error(\`Error reading directory \${dirPath}: \${error}\`);
    return [];
  }
}

// Example usage:
// const files = listDirectoryContents('./');
// console.log('Files in current directory:', files);
`,
    deepDiveLabel: "Why use a framework like Express?",
    deepDive: {
      hook: `Imagine you're building a house. You *could* mill all your own lumber, forge your own nails, and mix your own concrete from raw materials. It's possible, but it's incredibly time-consuming, error-prone, and requires deep expertise in many different crafts. Most builders, even expert ones, use pre-fabricated components, power tools, and established construction methods. They focus their energy on the unique design and features of the house, not reinventing the wheel for every basic structural element.

Building a web server from scratch with Node.js's built-in 'http' module is akin to building that house from raw materials. You'd have to manually parse URLs, handle different HTTP methods, manage request and response streams, set headers, and much more. While it offers ultimate control, it quickly becomes a complex and repetitive task for anything beyond the simplest 'Hello World'. This is where web frameworks come in.`,
      pain: `⚠️ **Lesson:** Without a web framework, building even a moderately complex API involves a significant amount of boilerplate code for common tasks like routing, request parsing, and middleware management. Symptom: Developers spend more time implementing basic server infrastructure than focusing on the unique business logic of their application, leading to slower development cycles and increased potential for bugs in foundational components.`,
      mentalModel: `**Mental model:** The "API Construction Kit." Think of a web framework like Express as a comprehensive toolkit for building APIs. Instead of starting with raw lumber (Node.js's 'http' module), you get pre-assembled walls (routing), plumbing fixtures (middleware), and electrical wiring (request/response handling). This kit provides a standardized, efficient way to assemble your API, allowing you to focus on the custom features (your application's specific data and logic) rather than the underlying infrastructure.`,
      discover: `**Pattern - API Framework Setup:**
\`\`\`typescript
import express from 'express'; // 1. Import the framework
import { Request, Response } from 'express'; // 2. Import types for better safety

const app = express(); // 3. Initialize the application instance
const PORT = 3000; // 4. Define a port for the server

// 5. Define a route handler for a specific HTTP method and path
app.get('/api/data', (req: Request, res: Response) => {
  res.json({ message: 'Data fetched!' }); // 6. Send a response
});

app.listen(PORT, () => { // 7. Start the server and listen for requests
  console.log(\`Server running on http://localhost:\${PORT}\`);
});
\`\`\`
-   **1. Import:** Bring in the necessary framework library.
-   **2. Types:** Use type definitions (like \`Request\`, \`Response\`) for better code completion and error checking.
-   **3. Initialize:** Create an instance of the Express application.
-   **4. Port:** Specify which network port the server will listen on.
-   **5. Route Handler:** Define how the server should respond to requests matching a specific HTTP method (GET, POST, etc.) and URL path.
-   **6. Response:** Use \`res.json()\` or \`res.send()\` to send data back to the client.
-   **7. Listen:** Start the server process, making it available to receive incoming client requests.`,
      quickRules: `**Quick rules:**
-   ✅ Use a framework like Express for rapid API development and standardized practices.
-   ✅ Define clear route paths and HTTP methods for each API endpoint.
-   ✅ Always start your server using \`app.listen()\` to make it accessible.
-   ✅ Use type annotations (\`Request\`, \`Response\`) for clarity and error prevention.
-   ❌ Avoid building raw HTTP servers for complex applications unless absolutely necessary for extreme performance tuning.
-   ❌ Don't forget to handle different HTTP methods (GET, POST, PUT, DELETE) appropriately for each resource.
-   ❌ Never hardcode sensitive information like API keys directly in your server code.`,
      watchOut: `👀 **Watch out:** While Express simplifies server creation, it's easy to fall into the trap of putting all your logic directly inside route handlers. As your API grows, this leads to "fat routes" that are hard to read, test, and maintain. Consider separating concerns by moving business logic into dedicated service functions or modules.`,
      dryRun: `🔁 **Think:**
1.  A client sends a GET request to \`http://localhost:3000/resources\`.
2.  The Express application, listening on port 3000, receives this request.
3.  Express matches the request path \`/resources\` and HTTP method GET to the \`app.get('/resources', ...)\` handler.
4.  The callback function \`(req: Request, res: Response) => { // Logic will go here }\` is executed.
5.  Currently, this handler is empty, so no response is sent yet. The client would likely time out or receive an empty response depending on the server's default behavior.
(Hint: The server is running, but the endpoint doesn't do anything yet.)`,
      build: "**Learning focus:** Set up the foundational Express server and define the initial GET route for `/resources` to establish the API's entry point.",
    },
  },
  {
    id: "step2",
    type: "question",
    phase: "Step 2 of 7",
    paal: "A consistent API response structure is crucial for client-side development. Define the `PaginatedResponse` type, which includes `meta` (for pagination details) and `items` (the actual data).",
    hint: "The `PaginatedResponse` type should be generic, taking a type parameter `T` for the `items` array. The `meta` property should be of type `PaginationMeta`.",
    example_code: `
// Module-scope types (Resource, PaginationMeta) are already defined.

interface PaginatedResponse<T> {
  meta: PaginationMeta;
  items: T[];
}
`,
    think_prompt: "Which definition correctly sets up the `PaginatedResponse` interface to hold both pagination metadata and a generic array of items?",
    mc_options: [
      "interface PaginatedResponse { meta: any; items: any[]; }",
      "interface PaginatedResponse<T> { meta: PaginationMeta; items: T[]; }",
      "type PaginatedResponse = { meta: PaginationMeta, data: Resource[] };",
    ],
    mc_correct_option: "interface PaginatedResponse<T> { meta: PaginationMeta; items: T[]; }",
    mc_anchor: "interface PaginatedResponse<T> {",
    why_this_matters: "A well-defined API response structure makes it predictable for clients to consume data. By separating metadata (like pagination details) from the actual data items, clients can easily access both, leading to more robust and maintainable frontend code.",
    answer_keywords: ["interface", "generic", "pagination", "response", "meta", "items"],
    seed_code: `
import express from 'express';
import { Request, Response } from 'express';

interface Resource {
  id: string;
  name: string;
  status: 'active' | 'inactive' | 'pending';
  category: 'tool' | 'material' | 'service';
  createdAt: string;
}

interface PaginationMeta {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

const app = express();
const PORT = 3000;

// Mock database (already defined in module scope)

app.get('/resources', (req: Request, res: Response) => {
  // Logic will go here
});

app.listen(PORT, () => {
  console.log(\`Server running on http://localhost:\${PORT}\`);
});
`,
    starter_code: `
import express from 'express';
import { Request, Response } from 'express';

interface Resource {
  id: string;
  name: string;
  status: 'active' | 'inactive' | 'pending';
  category: 'tool' | 'material' | 'service';
  createdAt: string;
}

interface PaginationMeta {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

// Define the PaginatedResponse interface here

const app = express();
const PORT = 3000;

// Mock database (already defined in module scope)

app.get('/resources', (req: Request, res: Response) => {
  // Logic will go here
});

app.listen(PORT, () => {
  console.log(\`Server running on http://localhost:\${PORT}\`);
});
`,
    feedback_correct: "Spot on! Defining `PaginatedResponse<T>` with `meta` and `items` ensures a clear and reusable structure for all paginated API responses.",
    feedback_partial: "You've got the right idea, but remember to make the `PaginatedResponse` generic (`<T>`) so it can work with any type of item, not just `Resource`.",
    feedback_wrong: "Using `any` types defeats the purpose of TypeScript's type safety. The `PaginatedResponse` should explicitly define `meta` as `PaginationMeta` and `items` as a generic array `T[]`.",
    expected: `
import express from 'express';
import { Request, Response } from 'express';

interface Resource {
  id: string;
  name: string;
  status: 'active' | 'inactive' | 'pending';
  category: 'tool' | 'material' | 'service';
  createdAt: string;
}

interface PaginationMeta {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

interface PaginatedResponse<T> {
  meta: PaginationMeta;
  items: T[];
}

const app = express();
const PORT = 3000;

// Mock database (already defined in module scope)

app.get('/resources', (req: Request, res: Response) => {
  // Logic will go here
});

app.listen(PORT, () => {
  console.log(\`Server running on http://localhost:\${PORT}\`);
});
`,
    analog_example: `
// Analog: A client-side component displaying paginated data
interface ClientPaginationProps<T> {
  data: T[];
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}

// This component expects data and pagination info in a structured way
function PaginatedList<T>(props: ClientPaginationProps<T>) {
  const totalPages = Math.ceil(props.totalItems / props.itemsPerPage);

  // ... rendering logic for current page items and pagination controls
  return \`<div>Displaying \${props.data.length} items. Total pages: \${totalPages}</div>\`;
}

// Example usage:
// const myItems = [{id:1, name:'A'}, {id:2, name:'B'}];
// PaginatedList({ data: myItems, totalItems: 100, itemsPerPage: 10, onPageChange: (p) => console.log(p) });
`,
    deepDiveLabel: "Why is a consistent API response structure important?",
    deepDive: {
      hook: `Imagine trying to read a book where every chapter has a different format: one chapter is a poem, the next is a screenplay, then a comic book, and finally a technical manual. While each might contain valuable information, the sheer inconsistency would make it incredibly difficult and frustrating to extract the story. You'd spend more time deciphering the format than understanding the content.

The same principle applies to API responses. If one endpoint returns data directly as an array, another wraps it in an object with a 'data' key, and a third uses 'results' with 'count' and 'next' links, client-side developers face a constant challenge. They have to write custom parsing logic for every single endpoint, increasing development time, introducing bugs, and making the client application fragile to API changes.`,
      pain: `⚠️ **Lesson:** Inconsistent API response structures lead to brittle client-side code, increased development overhead, and a poor developer experience. Symptom: Frontend developers constantly writing conditional logic or custom mappers for each API call, leading to code duplication and difficulty in maintaining or extending the application.`,
      mentalModel: `**Mental model:** The "Standardized Shipping Container." Think of your API response as goods being shipped. If every item were shipped in a unique, custom-made box, logistics would be a nightmare. Instead, we use standardized shipping containers (like ISO containers). They have a predictable size and structure, allowing for efficient loading, unloading, and tracking, regardless of what's inside. A consistent API response structure (like \`PaginatedResponse\`) acts as this standardized container, ensuring that clients always know where to find the data (\`items\`) and its associated metadata (\`meta\`), regardless of the specific resource being fetched.`,
      discover: `**Pattern - Standardized Paginated Response:**
\`\`\`typescript
interface PaginationMeta {
  totalItems: number;    // 1. Total count of all items (across all pages)
  totalPages: number;    // 2. Total number of pages available
  currentPage: number;   // 3. The current page number being returned
  pageSize: number;      // 4. The number of items requested per page
  hasNextPage: boolean;  // 5. Flag indicating if there's a next page
  hasPreviousPage: boolean; // 6. Flag indicating if there's a previous page
}

interface PaginatedResponse<T> {
  meta: PaginationMeta;  // 7. Container for all pagination-related metadata
  items: T[];            // 8. The actual array of data items for the current page
}
\`\`\`
-   **1. \`totalItems\`:** Provides the client with the full scope of available data.
-   **2. \`totalPages\`:** Allows the client to render appropriate pagination controls (e.g., "Page 1 of 10").
-   **3. \`currentPage\`:** Informs the client which page they are currently viewing.
-   **4. \`pageSize\`:** Confirms the number of items per page, useful for client-side calculations.
-   **5. \`hasNextPage\` / 6. \`hasPreviousPage\`:** Simplifies logic for enabling/disabling "Next" and "Previous" buttons.
-   **7. \`meta\` object:** Encapsulates all non-data information, keeping the response clean.
-   **8. \`items\` array:** Holds the core data requested, making it easy to iterate and display.`,
      quickRules: `**Quick rules:**
-   ✅ Always wrap list data in an object that includes both \`items\` (or \`data\`, \`results\`) and \`meta\` (or \`pagination\`, \`metadata\`).
-   ✅ Ensure \`meta\` contains \`totalItems\`, \`totalPages\`, \`currentPage\`, and \`pageSize\`.
-   ✅ Use boolean flags like \`hasNextPage\` and \`hasPreviousPage\` for simpler client-side navigation logic.
-   ✅ Make your response types generic (\`<T>\`) to maximize reusability across different resource types.
-   ❌ Never return a raw array of items for paginated endpoints; it lacks crucial context.
-   ❌ Avoid inconsistent naming conventions (e.g., \`total_items\` in one endpoint, \`totalItems\` in another).
-   ❌ Do not embed pagination logic directly into the \`items\` array itself.`,
      watchOut: `👀 **Watch out:** While consistency is key, avoid over-engineering your response structure for simple endpoints that will never be paginated or filtered. A simple \`res.json(item)\` is perfectly fine for fetching a single resource by ID. Apply the \`PaginatedResponse\` pattern where it genuinely adds value for collections.`,
      dryRun: `🔁 **Think:**
1.  A client makes a request to \`/resources?page=1&pageSize=10\`.
2.  The server processes the request and retrieves 10 \`Resource\` objects for page 1.
3.  The server calculates \`totalItems\` (e.g., 100), \`totalPages\` (e.g., 10), \`currentPage\` (1), \`pageSize\` (10), \`hasNextPage\` (true), \`hasPreviousPage\` (false).
4.  The server constructs a \`PaginatedResponse<Resource>\` object:
    \`\`\`json
    {
      "meta": {
        "totalItems": 100,
        "totalPages": 10,
        "currentPage": 1,
        "pageSize": 10,
        "hasNextPage": true,
        "hasPreviousPage": false
      },
      "items": [ /* 10 Resource objects */ ]
    }
    \`\`\`
5.  The client receives this JSON. It can immediately access \`response.meta.totalPages\` to render pagination controls and \`response.items\` to display the data, without needing to guess the structure.
(Hint: The structure provides a clear contract between client and server.)`,
      build: "**Learning focus:** Define the `PaginatedResponse` interface to standardize how paginated data and its metadata are returned from the API.",
    },
  },
  {
    id: "step3",
    type: "question",
    phase: "Step 3 of 7",
    paal: "Now, let's extract the pagination parameters (`page` and `pageSize`) from the request's query string. We need to parse them as numbers and provide sensible default values if they are missing or invalid.",
    hint: "Use `req.query` to access query parameters. Remember to convert them to numbers using `parseInt` and provide default values like `1` for page and `10` for pageSize.",
    example_code: `
  const page = parseInt(req.query.page as string) || 1;
  const pageSize = parseInt(req.query.pageSize as string) || 10;
`,
    think_prompt: "How do you correctly extract `page` and `pageSize` from `req.query`, ensuring they are numbers and have default values?",
    mc_options: [
      "const page = req.query.page; const pageSize = req.query.pageSize;",
      "const page = Number(req.query.page) || 1; const pageSize = Number(req.query.pageSize) || 10;",
      "const page = parseInt(req.query.page as string) || 1; const pageSize = parseInt(req.query.pageSize as string) || 10;",
    ],
    mc_correct_option: "const page = parseInt(req.query.page as string) || 1; const pageSize = parseInt(req.query.pageSize as string) || 10;",
    mc_anchor: "const page = parseInt(req.query.page as string) || 1;",
    why_this_matters: "Robust parameter extraction is vital for API stability. By parsing query parameters correctly, handling potential `undefined` values, and providing defaults, we make our API resilient to malformed requests and ensure a consistent experience for clients.",
    answer_keywords: ["req.query", "parseInt", "default values", "pagination parameters"],
    seed_code: `
import express from 'express';
import { Request, Response } from 'express';

interface Resource {
  id: string;
  name: string;
  status: 'active' | 'inactive' | 'pending';
  category: 'tool' | 'material' | 'service';
  createdAt: string;
}

interface PaginationMeta {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

interface PaginatedResponse<T> {
  meta: PaginationMeta;
  items: T[];
}

const app = express();
const PORT = 3000;

// Mock database (already defined in module scope)

app.get('/resources', (req: Request, res: Response) => {
  // Logic will go here
});

app.listen(PORT, () => {
  console.log(\`Server running on http://localhost:\${PORT}\`);
});
`,
    starter_code: `
import express from 'express';
import { Request, Response } from 'express';

interface Resource {
  id: string;
  name: string;
  status: 'active' | 'inactive' | 'pending';
  category: 'tool' | 'material' | 'service';
  createdAt: string;
}

interface PaginationMeta {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

interface PaginatedResponse<T> {
  meta: PaginationMeta;
  items: T[];
}

const app = express();
const PORT = 3000;

// Mock database (already defined in module scope)

app.get('/resources', (req: Request, res: Response) => {
  // Extract page and pageSize here
});

app.listen(PORT, () => {
  console.log(\`Server running on http://localhost:\${PORT}\`);
});
`,
    feedback_correct: "Perfect! Using `parseInt` with a fallback `||` operator is the robust way to extract and default numeric query parameters.",
    feedback_partial: "You're correctly accessing `req.query`, but remember that query parameters are strings. They need to be explicitly converted to numbers, and you should provide default values if they're not present.",
    feedback_wrong: "Simply assigning `req.query.page` will leave you with string values, which can cause issues in calculations. Also, without default values, your logic might break if the parameters are missing.",
    expected: `
import express from 'express';
import { Request, Response } from 'express';

interface Resource {
  id: string;
  name: string;
  status: 'active' | 'inactive' | 'pending';
  category: 'tool' | 'material' | 'service';
  createdAt: string;
}

interface PaginationMeta {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

interface PaginatedResponse<T> {
  meta: PaginationMeta;
  items: T[];
}

const app = express();
const PORT = 3000;

// Mock database (already defined in module scope)

app.get('/resources', (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const pageSize = parseInt(req.query.pageSize as string) || 10;
});

app.listen(PORT, () => {
  console.log(\`Server running on http://localhost:\${PORT}\`);
});
`,
    analog_example: `
// Analog: Parsing URL search parameters in a web browser
const url = new URL('http://example.com/search?query=test&limit=5');
const searchParams = url.searchParams;

const query = searchParams.get('query') || 'default';
const limit = parseInt(searchParams.get('limit') || '10'); // Default to '10' then parse

// console.log('Query:', query); // Output: Query: test
// console.log('Limit:', limit); // Output: Limit: 5

const missingParam = parseInt(searchParams.get('offset') || '0');
// console.log('Missing Param (with default):', missingParam); // Output: Missing Param (with default): 0
`,
    deepDiveLabel: "How do `parseInt` and `||` work together for robust parameter handling?",
    deepDive: {
      hook: `Imagine you're trying to measure ingredients for a recipe, but some of the measurements are written ambiguously or are missing entirely. If a recipe says "sugar: 2 cups" but you read "sugar: a lot," or if the sugar measurement is simply absent, you'd be stuck. You need a way to interpret vague instructions and to have a fallback plan when instructions are missing, otherwise your recipe (or your API) will fail.

In web development, client requests often come with optional query parameters. These parameters are always strings, and they might be missing, empty, or contain non-numeric characters when a number is expected. Directly using these raw string values in calculations would lead to errors, crashes, or unexpected behavior. This is why robust parsing and defaulting mechanisms are essential.`,
      pain: `⚠️ **Lesson:** Failing to properly parse and default query parameters can lead to runtime errors, unexpected API behavior, and a poor developer experience for clients. Symptom: API crashes when a client sends a request without a specific query parameter, or calculations produce \`NaN\` because a string was used where a number was expected.`,
      mentalModel: `**Mental model:** The "Smart Interpreter with a Safety Net." Think of \`parseInt\` as an interpreter that tries to understand a string as a number. If it succeeds, great. If it encounters something it can't interpret (like "abc" or an empty string), it returns \`NaN\` (Not a Number). The \`||\` (logical OR) operator then acts as a safety net. If the result of \`parseInt\` is "falsy" (like \`NaN\` or \`0\`), the \`||\` operator steps in and provides a predefined, safe default value. This two-part mechanism ensures that you always end up with a valid number, even if the client's input is imperfect.`,
      discover: `**Pattern - Robust Query Parameter Parsing:**
\`\`\`typescript
const rawPage = req.query.page as string | undefined; // 1. Access the raw string value (can be undefined)
const page = parseInt(rawPage || '1', 10);          // 2. Provide a default string, then parse with radix
const rawPageSize = req.query.pageSize as string | undefined;
const pageSize = parseInt(rawPageSize || '10', 10); // 3. Repeat for pageSize

// Example with a non-numeric input:
// URL: /resources?page=abc&pageSize=5
// rawPage = 'abc'
// parseInt('abc' || '1', 10) => parseInt('abc', 10) => NaN
// page = NaN || 1 => 1 (because NaN is falsy)

// Example with missing input:
// URL: /resources?pageSize=5
// rawPage = undefined
// parseInt(undefined || '1', 10) => parseInt('1', 10) => 1
// page = 1 || 1 => 1
\`\`\`
-   **1. \`req.query.param as string | undefined\`:** Accesses the query parameter, which Express provides as a string or \`undefined\`. The \`as string\` is a TypeScript assertion.
-   **2. \`rawParam || 'defaultValue'\`:** This is the crucial part for handling missing or empty parameters. If \`rawParam\` is \`undefined\` or an empty string (both are falsy), it defaults to \`'defaultValue'\` (a string).
-   **3. \`parseInt(..., 10)\`:** Attempts to convert the resulting string into an integer. The \`10\` is the radix, ensuring it's parsed as a base-10 number. If \`parseInt\` fails (e.g., \`parseInt('abc', 10)\`), it returns \`NaN\`.
-   **4. \`parsedValue || finalDefault\`:** If \`parseInt\` returns \`NaN\` (which is falsy), the \`||\` operator provides a final numeric default. This handles cases where the client provides a non-numeric string.`,
      quickRules: `**Quick rules:**
-   ✅ Always use \`parseInt()\` or \`Number()\` to convert string query parameters to numbers.
-   ✅ Provide a default string value to \`parseInt()\` using \`||\` before parsing, to handle missing parameters.
-   ✅ Provide a final numeric default using \`||\` after \`parseInt()\` to handle non-numeric inputs (which result in \`NaN\`).
-   ✅ Specify the radix (e.g., \`10\`) in \`parseInt()\` to avoid unexpected behavior.
-   ❌ Never use raw \`req.query\` values directly in arithmetic operations without conversion.
-   ❌ Don't rely solely on \`Number()\` without a fallback, as \`Number('abc')\` also results in \`NaN\`.
-   ❌ Avoid complex regex for simple numeric parsing; \`parseInt\` is usually sufficient.`,
      watchOut: `👀 **Watch out:** Be mindful of negative numbers or zero for \`page\` and \`pageSize\`. While \`parseInt\` handles them correctly, your application logic might require additional validation (e.g., \`page\` must be >= 1, \`pageSize\` must be > 0). Add explicit checks for these edge cases to prevent unexpected pagination behavior or infinite loops.`,
      dryRun: `🔁 **Think:**
1.  **Request 1:** \`GET /resources\` (no query params)
    *   \`req.query.page\` is \`undefined\`.
    *   \`parseInt(undefined as string)\` becomes \`parseInt('undefined')\`, which is \`NaN\`.
    *   \`NaN || 1\` evaluates to \`1\`. So, \`page\` becomes \`1\`.
    *   \`req.query.pageSize\` is \`undefined\`.
    *   \`parseInt(undefined as string)\` becomes \`parseInt('undefined')\`, which is \`NaN\`.
    *   \`NaN || 10\` evaluates to \`10\`. So, \`pageSize\` becomes \`10\`.
2.  **Request 2:** \`GET /resources?page=2&pageSize=invalid\`
    *   \`req.query.page\` is \`'2'\`.
    *   \`parseInt('2' as string)\` is \`2\`.
    *   \`2 || 1\` evaluates to \`2\`. So, \`page\` becomes \`2\`.
    *   \`req.query.pageSize\` is \`'invalid'\`.
    *   \`parseInt('invalid' as string)\` is \`NaN\`.
    *   \`NaN || 10\` evaluates to \`10\`. So, \`pageSize\` becomes \`10\`.
(Hint: The \`||\` operator provides a robust fallback for both missing and invalid string inputs.)`,
      build: "**Learning focus:** Extract `page` and `pageSize` from `req.query`, ensuring they are parsed as numbers and default to `1` and `10` respectively.",
    },
  },
  {
    id: "step4",
    type: "question",
    phase: "Step 4 of 7",
    paal: "With `page` and `pageSize` extracted, implement the core pagination logic. Calculate the `startIndex`, `endIndex`, and then slice the `mockDatabase` to get the items for the current page. Also, calculate `totalItems` and `totalPages` for the metadata.",
    hint: "The `startIndex` is `(page - 1) * pageSize`. The `endIndex` is `startIndex + pageSize`. Use `Math.ceil` for `totalPages`.",
    example_code: `
  const totalItems = mockDatabase.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;

  const paginatedItems = mockDatabase.slice(startIndex, endIndex);
`,
    think_prompt: "Which set of calculations correctly determines the pagination indices and slices the data?",
    mc_options: [
      "const startIndex = page * pageSize; const endIndex = startIndex + pageSize; const paginatedItems = mockDatabase.slice(startIndex, endIndex);",
      "const startIndex = (page - 1) * pageSize; const endIndex = startIndex + pageSize; const paginatedItems = mockDatabase.slice(startIndex, endIndex);",
      "const startIndex = page * pageSize; const endIndex = page * pageSize + pageSize; const paginatedItems = mockDatabase.filter(...);",
    ],
    mc_correct_option: "const startIndex = (page - 1) * pageSize; const endIndex = startIndex + pageSize; const paginatedItems = mockDatabase.slice(startIndex, endIndex);",
    mc_anchor: "const startIndex = (page - 1) * pageSize;",
    why_this_matters: "Correct pagination logic is the heart of a scalable list API. It ensures that only the requested subset of data is processed and sent, preventing performance bottlenecks and providing a smooth user experience, especially with large datasets.",
    answer_keywords: ["pagination", "startIndex", "endIndex", "slice", "totalPages", "totalItems"],
    seed_code: `
import express from 'express';
import { Request, Response } from 'express';

interface Resource {
  id: string;
  name: string;
  status: 'active' | 'inactive' | 'pending';
  category: 'tool' | 'material' | 'service';
  createdAt: string;
}

interface PaginationMeta {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

interface PaginatedResponse<T> {
  meta: PaginationMeta;
  items: T[];
}

const app = express();
const PORT = 3000;

// Mock database (already defined in module scope)

app.get('/resources', (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const pageSize = parseInt(req.query.pageSize as string) || 10;
});

app.listen(PORT, () => {
  console.log(\`Server running on http://localhost:\${PORT}\`);
});
`,
    starter_code: `
import express from 'express';
import { Request, Response } from 'express';

interface Resource {
  id: string;
  name: string;
  status: 'active' | 'inactive' | 'pending';
  category: 'tool' | 'material' | 'service';
  createdAt: string;
}

interface PaginationMeta {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

interface PaginatedResponse<T> {
  meta: PaginationMeta;
  items: T[];
}

const app = express();
const PORT = 3000;

// Mock database (already defined in module scope)

app.get('/resources', (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const pageSize = parseInt(req.query.pageSize as string) || 10;

  // Implement pagination logic here
});

app.listen(PORT, () => {
  console.log(\`Server running on http://localhost:\${PORT}\`);
});
`,
    feedback_correct: "Excellent! Your pagination calculations are correct. Using `(page - 1) * pageSize` correctly accounts for 1-based page numbering and `slice` is the right method for extracting the subset.",
    feedback_partial: "You're on the right track with `startIndex` and `endIndex`, but remember that page numbers are typically 1-based, so `page 1` should start at index `0`. Adjust your `startIndex` calculation accordingly.",
    feedback_wrong: "Calculating `startIndex` as `page * pageSize` would mean page 1 starts at index `pageSize`, skipping the first page of results. Also, ensure you're using `slice` for array subsetting, not `filter` for pagination.",
    expected: `
import express from 'express';
import { Request, Response } from 'express';

interface Resource {
  id: string;
  name: string;
  status: 'active' | 'inactive' | 'pending';
  category: 'tool' | 'material' | 'service';
  createdAt: string;
}

interface PaginationMeta {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

interface PaginatedResponse<T> {
  meta: PaginationMeta;
  items: T[];
}

const app = express();
const PORT = 3000;

// Mock database (already defined in module scope)

app.get('/resources', (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const pageSize = parseInt(req.query.pageSize as string) || 10;

  const totalItems = mockDatabase.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;

  const paginatedItems = mockDatabase.slice(startIndex, endIndex);
});

app.listen(PORT, () => {
  console.log(\`Server running on http://localhost:\${PORT}\`);
});
`,
    analog_example: `
// Analog: Client-side pagination for a UI table
function paginateArray<T>(data: T[], page: number, pageSize: number): T[] {
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  return data.slice(startIndex, endIndex);
}

const allUsers = [
  { id: 1, name: 'Alice' }, { id: 2, name: 'Bob' }, { id: 3, name: 'Charlie' },
  { id: 4, name: 'David' }, { id: 5, name: 'Eve' }, { id: 6, name: 'Frank' },
  { id: 7, name: 'Grace' }, { id: 8, name: 'Heidi' }, { id: 9, name: 'Ivan' },
  { id: 10, name: 'Judy' }, { id: 11, name: 'Kyle' }, { id: 12, name: 'Liam' },
];

// const currentPage = 2;
// const itemsPerPage = 5;
// const usersOnPage = paginateArray(allUsers, currentPage, itemsPerPage);
// console.log(usersOnPage); // Output: [{ id: 6, name: 'Frank' }, { id: 7, name: 'Grace' }, { id: 8, name: 'Heidi' }, { id: 9, name: 'Ivan' }, { id: 10, name: 'Judy' }]
`,
    deepDiveLabel: "What's the math behind pagination?",
    deepDive: {
      hook: `Imagine you have a very long scroll of ancient text, too long to read all at once. To make it manageable, you decide to cut it into smaller, equal-sized pages. You need a system to know where each page starts and ends, how many pages there are in total, and which page you're currently looking at. If your cuts are off, you might miss parts of the text, read the same part twice, or end up with pages that are too long or too short.

This is precisely the challenge of pagination in software. We have a large dataset (the long scroll), and we need to present it in smaller, digestible chunks (pages) to a user. The "math" of pagination is about precisely calculating these chunks to ensure every item is shown exactly once, and the navigation between pages is seamless and correct.`,
      pain: `⚠️ **Lesson:** Incorrect pagination calculations lead to missing data, duplicate data across pages, or out-of-bounds errors. Symptom: Users report that some items never appear, or they see the same items on multiple pages, or the application crashes when trying to access a page that doesn't exist.`,
      mentalModel: `**Mental model:** The "Library Shelf System." Think of your entire dataset as a vast library. Pagination is like organizing this library into shelves (pages). Each shelf has a fixed capacity (\`pageSize\`). To find a specific book (item) on a specific shelf (page), you need to know which shelf it's on and its position on that shelf. The \`startIndex\` and \`endIndex\` are like the markers for where each shelf begins and ends in the entire library collection. \`totalPages\` tells you how many shelves you need in total to hold all the books.`,
      discover: `**Pattern - Core Pagination Calculations:**
\`\`\`typescript
const totalItems = data.length; // 1. Get the total count of all items
const totalPages = Math.ceil(totalItems / pageSize); // 2. Calculate total pages, rounding up
const startIndex = (page - 1) * pageSize; // 3. Calculate the starting index for the current page
const endIndex = startIndex + pageSize; // 4. Calculate the ending index (exclusive)
const paginatedItems = data.slice(startIndex, endIndex); // 5. Extract the subset of items

// Example: totalItems = 100, pageSize = 10, page = 3
// 1. totalItems = 100
// 2. totalPages = Math.ceil(100 / 10) = 10
// 3. startIndex = (3 - 1) * 10 = 2 * 10 = 20
// 4. endIndex = 20 + 10 = 30
// 5. paginatedItems = data.slice(20, 30) // Items at index 20 through 29
\`\`\`
-   **1. \`totalItems\`:** This is the count of *all* items in the dataset, *before* any pagination is applied. It's crucial for calculating \`totalPages\`.
-   **2. \`totalPages\`:** Calculated by dividing \`totalItems\` by \`pageSize\` and rounding up using \`Math.ceil\`. This ensures that even if there's a partial last page, it's counted as a full page.
-   **3. \`startIndex\`:** This is the 0-based index in the original dataset where the current page's items begin. Since \`page\` is typically 1-based, we subtract 1 before multiplying by \`pageSize\`.
-   **4. \`endIndex\`:** This is the 0-based index *after* the last item of the current page. JavaScript's \`slice()\` method uses an exclusive end index, so \`startIndex + pageSize\` is perfect.
-   **5. \`data.slice(startIndex, endIndex)\`:** The \`slice()\` method extracts a portion of an array from \`startIndex\` up to (but not including) \`endIndex\`. This gives us exactly the items for the current page.`,
      quickRules: `**Quick rules:**
-   ✅ Always calculate \`totalItems\` from the *full* dataset (or filtered dataset) before pagination.
-   ✅ Use \`Math.ceil()\` when calculating \`totalPages\` to account for partial last pages.
-   ✅ Ensure \`startIndex\` is \`(page - 1) * pageSize\` for 1-based page numbers.
-   ✅ Use \`array.slice(startIndex, endIndex)\` for efficient array subsetting.
-   ❌ Never use \`Math.floor()\` or \`Math.round()\` for \`totalPages\`; it can hide the last page.
-   ❌ Don't calculate \`startIndex\` as \`page * pageSize\` if \`page\` is 1-based.
-   ❌ Avoid fetching all data from the database and *then* slicing if the dataset is extremely large; use database-level pagination.`,
      watchOut: `👀 **Watch out:** If your \`page\` or \`pageSize\` parameters are invalid (e.g., \`page=0\` or \`pageSize=-5\`), these calculations can lead to unexpected results or errors. Always add validation to ensure \`page\` is at least 1 and \`pageSize\` is at least 1 (or a reasonable minimum). For example, \`page = Math.max(1, page); pageSize = Math.max(1, pageSize);\`.`,
      dryRun: `🔁 **Think:**
1.  **Initial state:** \`mockDatabase\` has 100 items. Client requests \`page=2\`, \`pageSize=10\`.
2.  \`totalItems\` is \`100\`.
3.  \`totalPages\` is \`Math.ceil(100 / 10)\` which is \`10\`.
4.  \`startIndex\` is \`(2 - 1) * 10\` which is \`1 * 10 = 10\`.
5.  \`endIndex\` is \`10 + 10\` which is \`20\`.
6.  \`paginatedItems\` becomes \`mockDatabase.slice(10, 20)\`. This extracts items from index 10 up to (but not including) index 20.
7.  **Next request:** Client requests \`page=11\`, \`pageSize=10\`.
8.  \`totalItems\` is \`100\`.
9.  \`totalPages\` is \`10\`.
10. \`startIndex\` is \`(11 - 1) * 10\` which is \`10 * 10 = 100\`.
11. \`endIndex\` is \`100 + 10\` which is \`110\`.
12. \`paginatedItems\` becomes \`mockDatabase.slice(100, 110)\`. Since \`mockDatabase\` only has 100 items (indices 0-99), this slice will return an empty array, which is correct for a page beyond the \`totalPages\`.
(Hint: The \`slice\` method gracefully handles \`endIndex\` being out of bounds.)`,
      build: "**Learning focus:** Implement the core pagination calculations to determine `startIndex`, `endIndex`, `totalItems`, and `totalPages`, then slice the data.",
    },
  },
  {
    id: "step5",
    type: "question",
    phase: "Step 5 of 7",
    paal: "Beyond pagination, users often need to filter data. Let's add support for a generic `status` filter. Extract the `status` query parameter and store it for later use.",
    hint: "Access `req.query.status`. It will be a string or `undefined`. No need for `parseInt` here.",
    example_code: `
  const statusFilter = req.query.status as string | undefined;
`,
    think_prompt: "How do you correctly extract a `status` filter parameter from the request query?",
    mc_options: [
      "const statusFilter = req.params.status;",
      "const statusFilter = req.query.status as string | undefined;",
      "const statusFilter = parseInt(req.query.status as string);",
    ],
    mc_correct_option: "const statusFilter = req.query.status as string | undefined;",
    mc_anchor: "const statusFilter = req.query.status as string | undefined;",
    why_this_matters: "Filtering is crucial for usability, allowing users to quickly find relevant information in large datasets. Extracting filter parameters correctly is the first step in enabling this powerful feature, making our API more versatile and user-friendly.",
    answer_keywords: ["filter", "req.query", "status", "query parameter"],
    seed_code: `
import express from 'express';
import { Request, Response } from 'express';

interface Resource {
  id: string;
  name: string;
  status: 'active' | 'inactive' | 'pending';
  category: 'tool' | 'material' | 'service';
  createdAt: string;
}

interface PaginationMeta {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

interface PaginatedResponse<T> {
  meta: PaginationMeta;
  items: T[];
}

const app = express();
const PORT = 3000;

// Mock database (already defined in module scope)

app.get('/resources', (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const pageSize = parseInt(req.query.pageSize as string) || 10;

  const totalItems = mockDatabase.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;

  const paginatedItems = mockDatabase.slice(startIndex, endIndex);
});

app.listen(PORT, () => {
  console.log(\`Server running on http://localhost:\${PORT}\`);
});
`,
    starter_code: `
import express from 'express';
import { Request, Response } from 'express';

interface Resource {
  id: string;
  name: string;
  status: 'active' | 'inactive' | 'pending';
  category: 'tool' | 'material' | 'service';
  createdAt: string;
}

interface PaginationMeta {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

interface PaginatedResponse<T> {
  meta: PaginationMeta;
  items: T[];
}

const app = express();
const PORT = 3000;

// Mock database (already defined in module scope)

app.get('/resources', (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const pageSize = parseInt(req.query.pageSize as string) || 10;

  // Extract filter parameters here
  
  const totalItems = mockDatabase.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;

  const paginatedItems = mockDatabase.slice(startIndex, endIndex);
});

app.listen(PORT, () => {
  console.log(\`Server running on http://localhost:\${PORT}\`);
});
`,
    feedback_correct: "Exactly! You've correctly extracted the `status` filter. Since it's a string, no `parseInt` is needed, but `as string | undefined` is good for type safety.",
    feedback_partial: "You're accessing `req.query` correctly, but remember that filter parameters are typically strings, so `parseInt` is not appropriate here. Just extract the string value.",
    feedback_wrong: "`req.params` is used for route parameters (e.g., `/users/:id`), not query parameters (e.g., `/users?status=active`). Use `req.query` for filter parameters.",
    expected: `
import express from 'express';
import { Request, Response } from 'express';

interface Resource {
  id: string;
  name: string;
  status: 'active' | 'inactive' | 'pending';
  category: 'tool' | 'material' | 'service';
  createdAt: string;
}

interface PaginationMeta {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

interface PaginatedResponse<T> {
  meta: PaginationMeta;
  items: T[];
}

const app = express();
const PORT = 3000;

// Mock database (already defined in module scope)

app.get('/resources', (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const pageSize = parseInt(req.query.pageSize as string) || 10;

  const statusFilter = req.query.status as string | undefined;
  
  const totalItems = mockDatabase.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;

  const paginatedItems = mockDatabase.slice(startIndex, endIndex);
});

app.listen(PORT, () => {
  console.log(\`Server running on http://localhost:\${PORT}\`);
});
`,
    analog_example: `
// Analog: Filtering a list of items in a client-side search bar
interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
}

const allProducts: Product[] = [
  { id: 1, name: 'Laptop', category: 'Electronics', price: 1200 },
  { id: 2, name: 'Keyboard', category: 'Electronics', price: 75 },
  { id: 3, name: 'Desk Chair', category: 'Furniture', price: 300 },
  { id: 4, name: 'Monitor', category: 'Electronics', price: 250 },
  { id: 5, name: 'Table Lamp', category: 'Furniture', price: 50 },
];

function applyClientFilter(products: Product[], category: string | undefined): Product[] {
  if (!category) {
    return products;
  }
  return products.filter(p => p.category.toLowerCase() === category.toLowerCase());
}

// const filterCategory = 'electronics';
// const filteredProducts = applyClientFilter(allProducts, filterCategory);
// console.log(filteredProducts);
// Output: [{ id: 1, name: 'Laptop', category: 'Electronics', price: 1200 }, ...]
`,
    deepDiveLabel: "How do you handle multiple filter parameters effectively?",
    deepDive: {
      hook: `Imagine you're trying to find a specific book in a massive library, but you can only ask for one criterion at a time. "Give me all books by author X." Then, from that list, "Now, from *those*, give me books published after year Y." And then, "From *those*, give me books with genre Z." This sequential, manual filtering is incredibly inefficient and frustrating.

In an API, users often need to combine multiple criteria to narrow down their search. If your API only supports one filter at a time, or if adding new filters requires extensive code changes, it quickly becomes cumbersome for both developers and users. A flexible and extensible filtering mechanism is crucial for any data-rich application.`,
      pain: `⚠️ **Lesson:** Inflexible filtering mechanisms lead to limited user search capabilities and complex, repetitive server-side code. Symptom: Users cannot combine search criteria, or adding a new filter requires modifying every part of the data retrieval logic, leading to maintenance headaches.`,
      mentalModel: `**Mental model:** The "Layered Sieve." Think of filtering as passing your raw data through a series of sieves, each designed to catch items that meet a specific criterion. First, you might have a "category" sieve, then a "status" sieve, then a "date range" sieve. Each sieve reduces the dataset, and the order in which you apply them can sometimes matter (though for simple equality filters, it often doesn't). The key is that each sieve operates independently but on the *result* of the previous sieve, progressively refining the dataset.`,
      discover: `**Pattern - Chained Filtering:**
\`\`\`typescript
let filteredData = [...mockDatabase]; // 1. Start with a copy of the full dataset

const statusFilter = req.query.status as string | undefined; // 2. Extract filter parameters
const categoryFilter = req.query.category as string | undefined;

if (statusFilter) { // 3. Apply the first filter if present
  filteredData = filteredData.filter(item => item.status === statusFilter);
}

if (categoryFilter) { // 4. Apply the second filter if present, on the *already filtered* data
  filteredData = filteredData.filter(item => item.category === categoryFilter);
}

// ... more filters can be added here
\`\`\`
-   **1. Start with a copy:** It's good practice to work with a copy of the original data to avoid unintended side effects on the source.
-   **2. Extract Parameters:** Retrieve all potential filter parameters from \`req.query\`.
-   **3. Conditional Filtering:** For each filter parameter, check if it's present (not \`undefined\` or empty).
-   **4. Chain Filters:** If a filter is present, apply it using \`Array.prototype.filter()\` to the \`filteredData\` array. The result of one filter becomes the input for the next, effectively chaining them. This ensures that all active filters are applied cumulatively.`,
      quickRules: `**Quick rules:**
-   ✅ Extract all potential filter parameters from \`req.query\` at the beginning of the handler.
-   ✅ Initialize a mutable variable (e.g., \`let filteredData\`) with the full dataset.
-   ✅ Apply each filter conditionally using \`if (filterParam)\` and \`filteredData = filteredData.filter(...)\`.
-   ✅ Ensure filters are applied *before* pagination to get accurate \`totalItems\` for the filtered set.
-   ❌ Avoid hardcoding filter values; always derive them from request parameters.
-   ❌ Don't apply filters after pagination; this would lead to incorrect \`totalItems\` and \`totalPages\`.
-   ❌ Never modify the original \`mockDatabase\` directly when filtering; always work with a copy.`,
      watchOut: `👀 **Watch out:** For complex filtering scenarios (e.g., full-text search, range queries, multiple values for a single filter), simple \`filter()\` calls might not be sufficient. Consider using a dedicated query builder library or a database's native query language (like SQL \`WHERE\` clauses) for more efficient and powerful filtering. Also, be mindful of performance if filtering a very large in-memory array.`,
      dryRun: `🔁 **Think:**
1.  **Initial state:** \`mockDatabase\` has 100 items.
2.  **Request:** \`GET /resources?status=active\`
3.  \`statusFilter\` becomes \`'active'\`. \`categoryFilter\` is \`undefined\`.
4.  \`filteredData\` starts as \`[...mockDatabase]\` (100 items).
5.  The \`if (statusFilter)\` condition is true.
6.  \`filteredData\` is updated to \`mockDatabase.filter(item => item.status === 'active')\`. Let's say this results in 33 items.
7.  The \`if (categoryFilter)\` condition is false (since \`categoryFilter\` is \`undefined\`).
8.  The \`filteredData\` array now contains only the 33 active resources. This filtered array will then be used for pagination.
(Hint: Each filter refines the dataset, reducing its size for subsequent operations.)`,
      build: "**Learning focus:** Extract the `status` query parameter to prepare for applying filtering logic to the dataset.",
    },
  },
  {
    id: "step6",
    type: "question",
    phase: "Step 6 of 7",
    paal: "Now, apply the extracted `statusFilter` to the `mockDatabase`. It's crucial to filter the data *before* applying pagination so that `totalItems` and `totalPages` reflect the filtered set, not the entire database.",
    hint: "Use `Array.prototype.filter()` on the `mockDatabase` based on `statusFilter`. Remember to only apply the filter if `statusFilter` is present.",
    example_code: `
  let currentData = [...mockDatabase]; // Start with a copy of the full data

  if (statusFilter) {
    currentData = currentData.filter(resource => resource.status === statusFilter);
  }

  const totalItems = currentData.length; // Calculate totalItems from the filtered data
  const totalPages = Math.ceil(totalItems / pageSize);
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;

  const paginatedItems = currentData.slice(startIndex, endIndex);
`,
    think_prompt: "Where should the filtering logic be placed relative to pagination, and how should `totalItems` be calculated?",
    mc_options: [
      "Filter after pagination; `totalItems` from full database.",
      "Filter before pagination; `totalItems` from filtered data.",
      "Filter and paginate simultaneously; `totalItems` is not needed.",
    ],
    mc_correct_option: "Filter before pagination; `totalItems` from filtered data.",
    mc_anchor: "if (statusFilter) {",
    why_this_matters: "The order of operations (filter then paginate) is critical. Filtering first ensures that pagination metadata (like `totalItems` and `totalPages`) accurately reflects the *relevant* data, providing a correct and intuitive experience for the user. If we paginate first, `totalItems` would be misleading.",
    answer_keywords: ["filter", "paginate", "order of operations", "totalItems", "filtered data"],
    seed_code: `
import express from 'express';
import { Request, Response } from 'express';

interface Resource {
  id: string;
  name: string;
  status: 'active' | 'inactive' | 'pending';
  category: 'tool' | 'material' | 'service';
  createdAt: string;
}

interface PaginationMeta {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

interface PaginatedResponse<T> {
  meta: PaginationMeta;
  items: T[];
}

const app = express();
const PORT = 3000;

// Mock database (already defined in module scope)

app.get('/resources', (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const pageSize = parseInt(req.query.pageSize as string) || 10;

  const statusFilter = req.query.status as string | undefined;
  
  const totalItems = mockDatabase.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;

  const paginatedItems = mockDatabase.slice(startIndex, endIndex);
});

app.listen(PORT, () => {
  console.log(\`Server running on http://localhost:\${PORT}\`);
});
`,
    starter_code: `
import express from 'express';
import { Request, Response } from 'express';

interface Resource {
  id: string;
  name: string;
  status: 'active' | 'inactive' | 'pending';
  category: 'tool' | 'material' | 'service';
  createdAt: string;
}

interface PaginationMeta {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

interface PaginatedResponse<T> {
  meta: PaginationMeta;
  items: T[];
}

const app = express();
const PORT = 3000;

// Mock database (already defined in module scope)

app.get('/resources', (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const pageSize = parseInt(req.query.pageSize as string) || 10;

  const statusFilter = req.query.status as string | undefined;
  
  // Apply filtering logic here, then calculate pagination based on filtered data
  let currentData = [...mockDatabase]; // Start with a copy of the full data

  // Apply filter if statusFilter is present
  // Then calculate totalItems, totalPages, startIndex, endIndex, and paginatedItems from currentData

});

app.listen(PORT, () => {
  console.log(\`Server running on http://localhost:\${PORT}\`);
});
`,
    feedback_correct: "Absolutely correct! Filtering the data first ensures that all subsequent pagination calculations (like `totalItems` and `totalPages`) are based on the relevant subset of data, providing accurate metadata to the client.",
    feedback_partial: "You're correctly applying the filter, but ensure that `totalItems` and `totalPages` are calculated *after* the filtering has occurred, using the length of the `currentData` array.",
    feedback_wrong: "If you paginate before filtering, `totalItems` will reflect the entire database, not the filtered results, which is misleading. Always filter first to get the correct context for pagination.",
    expected: `
import express from 'express';
import { Request, Response } from 'express';

interface Resource {
  id: string;
  name: string;
  status: 'active' | 'inactive' | 'pending';
  category: 'tool' | 'material' | 'service';
  createdAt: string;
}

interface PaginationMeta {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

interface PaginatedResponse<T> {
  meta: PaginationMeta;
  items: T[];
}

const app = express();
const PORT = 3000;

// Mock database (already defined in module scope)

app.get('/resources', (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const pageSize = parseInt(req.query.pageSize as string) || 10;

  const statusFilter = req.query.status as string | undefined;
  
  let currentData = [...mockDatabase]; // Start with a copy of the full data

  if (statusFilter) {
    currentData = currentData.filter(resource => resource.status === statusFilter);
  }

  const totalItems = currentData.length; // Calculate totalItems from the filtered data
  const totalPages = Math.ceil(totalItems / pageSize);
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;

  const paginatedItems = currentData.slice(startIndex, endIndex);
});

app.listen(PORT, () => {
  console.log(\`Server running on http://localhost:\${PORT}\`);
});
`,
    analog_example: `
// Analog: A spreadsheet application filtering rows before displaying them in a paginated view
interface SpreadsheetRow {
  id: number;
  data: string[];
  isVisible: boolean;
}

const allRows: SpreadsheetRow[] = [
  { id: 1, data: ['A', 'B'], isVisible: true },
  { id: 2, data: ['C', 'D'], isVisible: false },
  { id: 3, data: ['E', 'F'], isVisible: true },
  { id: 4, data: ['G', 'H'], isVisible: true },
  { id: 5, data: ['I', 'J'], isVisible: false },
];

function getVisibleAndPaginatedRows(rows: SpreadsheetRow[], page: number, pageSize: number): SpreadsheetRow[] {
  const visibleRows = rows.filter(row => row.isVisible); // Filter first
  
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  
  return visibleRows.slice(startIndex, endIndex); // Then paginate
}

// const currentPage = 1;
// const itemsPerPage = 2;
// const displayedRows = getVisibleAndPaginatedRows(allRows, currentPage, itemsPerPage);
// console.log(displayedRows);
// Output: [{ id: 1, data: ['A', 'B'], isVisible: true }, { id: 3, data: ['E', 'F'], isVisible: true }]
`,
    deepDiveLabel: "Why is the order of filtering and pagination critical?",
    deepDive: {
      hook: `Imagine you're trying to find "all red cars on page 3" of a car dealership's inventory. If you first go to page 3, you might see 10 cars, none of which are red. You'd conclude there are no red cars on page 3, and perhaps no red cars at all. But what if there are hundreds of red cars, just not on that specific page? You've missed them because you paginated *before* filtering.

The order of operations profoundly impacts the accuracy and usefulness of your API's response. If you paginate a large dataset first, and then try to filter the small subset you received, you're only filtering a fraction of the data. This leads to incomplete results and misleading pagination metadata, frustrating users who expect to see all relevant items across all pages.`,
      pain: `⚠️ **Lesson:** Incorrectly ordering filtering and pagination leads to incomplete search results and inaccurate pagination metadata. Symptom: Users complain that their filters aren't working correctly, or they see "Page 1 of 10" when there are actually only 2 pages of filtered results.`,
      mentalModel: `**Mental model:** The "Funnel and Slicer." Think of your entire dataset as a large pool of raw material. Filtering is like passing this material through a funnel, which narrows down the pool to only the relevant items. Once you have this smaller, refined pool of *filtered* items, pagination is like using a precise slicer to cut this refined pool into equal-sized pages. If you try to slice the *entire* raw pool first and then funnel each slice, you're doing extra work and might miss items that were in other slices but fit your funnel criteria. The funnel (filter) must come before the slicer (pagination).`,
      discover: `**Pattern - Filter First, Then Paginate:**
\`\`\`typescript
// 1. Start with the complete dataset (or a base query result)
let workingData = [...fullDataset];

// 2. Apply all filters to the workingData
if (filterA) {
  workingData = workingData.filter(item => item.propertyA === filterA);
}
if (filterB) {
  workingData = workingData.filter(item => item.propertyB === filterB);
}
// ... apply all other filters

// 3. NOW, calculate totalItems and totalPages based on the *filtered* workingData
const totalItems = workingData.length;
const totalPages = Math.ceil(totalItems / pageSize);

// 4. Finally, apply pagination (slice) to the *filtered* workingData
const startIndex = (page - 1) * pageSize;
const endIndex = startIndex + pageSize;
const paginatedItems = workingData.slice(startIndex, endIndex);
\`\`\`
-   **1. \`workingData\`:** Start with the full, unfiltered dataset.
-   **2. Apply Filters:** Each \`if\` block conditionally applies a filter, progressively reducing the size of \`workingData\`. This ensures \`workingData\` contains only items matching *all* active filters.
-   **3. Calculate Metadata:** \`totalItems\` and \`totalPages\` are derived from the \`length\` of the *filtered* \`workingData\`. This is crucial for accurate client-side pagination controls.
-   **4. Apply Pagination:** The \`slice\` operation is performed on the \`filtered\` \`workingData\`, extracting the specific page requested from the relevant subset.`,
      quickRules: `**Quick rules:**
-   ✅ Always apply all active filters to the dataset first.
-   ✅ Calculate \`totalItems\` and \`totalPages\` based on the *filtered* dataset's length.
-   ✅ Perform the \`slice\` operation for pagination on the *filtered* dataset.
-   ✅ Ensure your database queries (if not using in-memory arrays) apply \`WHERE\` clauses before \`LIMIT\`/\`OFFSET\`.
-   ❌ Never calculate \`totalItems\` from the original, unfiltered dataset if filters are applied.
-   ❌ Don't paginate the data and then attempt to filter the small page you received.
-   ❌ Avoid sending \`totalItems\` that don't match the number of items that *could* be returned by the current filters.`,
      watchOut: `👀 **Watch out:** While filtering first is generally correct, for extremely large datasets stored in a database, filtering and pagination should ideally be pushed down to the database layer (e.g., using SQL \`WHERE\` and \`LIMIT\`/\`OFFSET\`). Fetching the entire dataset into memory just to filter and paginate can be very inefficient. The \`mockDatabase\` example here simplifies this for teaching purposes.`,
      dryRun: `🔁 **Think:**
1.  **Initial state:** \`mockDatabase\` has 100 items (33 active, 33 inactive, 34 pending).
2.  **Request:** \`GET /resources?status=active&page=1&pageSize=5\`
3.  \`page=1\`, \`pageSize=5\`, \`statusFilter='active'\`.
4.  \`currentData\` starts as \`[...mockDatabase]\` (100 items).
5.  \`if (statusFilter)\` is true. \`currentData\` becomes \`mockDatabase.filter(r => r.status === 'active')\`. Now \`currentData\` has 33 items.
6.  \`totalItems\` is \`currentData.length\`, which is \`33\`.
7.  \`totalPages\` is \`Math.ceil(33 / 5)\`, which is \`7\`.
8.  \`startIndex\` is \`(1 - 1) * 5 = 0\`.
9.  \`endIndex\` is \`0 + 5 = 5\`.
10. \`paginatedItems\` becomes \`currentData.slice(0, 5)\`. This returns the first 5 active resources.
(Hint: \`totalItems\` and \`totalPages\` are now accurate for *only* the active resources.)`,
      build: "**Learning focus:** Apply the `statusFilter` to the data *before* pagination, and ensure `totalItems` and `totalPages` are calculated from the filtered dataset.",
    },
  },
  {
    id: "step7",
    type: "question",
    phase: "Step 7 of 7",
    paal: "Finally, construct the `PaginatedResponse` object using the calculated `meta` data and the `paginatedItems`. Send this object as a JSON response.",
    hint: "Create an object with `meta` and `items` properties. The `meta` object needs `totalItems`, `totalPages`, `currentPage`, `pageSize`, `hasNextPage`, and `hasPreviousPage`.",
    example_code: `
  const meta: PaginationMeta = {
    totalItems,
    totalPages,
    currentPage: page,
    pageSize,
    hasNextPage: page < totalPages,
    hasPreviousPage: page > 1,
  };

  const response: PaginatedResponse<Resource> = {
    meta,
    items: paginatedItems,
  };

  res.json(response);
`,
    think_prompt: "How do you correctly assemble the `PaginatedResponse` and send it as a JSON response?",
    mc_options: [
      "res.send(paginatedItems);",
      "res.json({ data: paginatedItems, total: totalItems });",
      "const meta = { ... }; const response = { meta, items: paginatedItems }; res.json(response);",
    ],
    mc_correct_option: "const meta = { ... }; const response = { meta, items: paginatedItems }; res.json(response);",
    mc_anchor: "const meta: PaginationMeta = {",
    why_this_matters: "Sending a structured, consistent response is the final step in fulfilling the API contract. It ensures clients receive all necessary data (items) and context (pagination metadata) in an easily consumable format, completing the cycle of a well-designed API endpoint.",
    answer_keywords: ["response", "json", "meta", "items", "PaginatedResponse"],
    seed_code: `
import express from 'express';
import { Request, Response } from 'express';

interface Resource {
  id: string;
  name: string;
  status: 'active' | 'inactive' | 'pending';
  category: 'tool' | 'material' | 'service';
  createdAt: string;
}

interface PaginationMeta {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

interface PaginatedResponse<T> {
  meta: PaginationMeta;
  items: T[];
}

const app = express();
const PORT = 3000;

// Mock database (already defined in module scope)

app.get('/resources', (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const pageSize = parseInt(req.query.pageSize as string) || 10;

  const statusFilter = req.query.status as string | undefined;
  
  let currentData = [...mockDatabase]; // Start with a copy of the full data

  if (statusFilter) {
    currentData = currentData.filter(resource => resource.status === statusFilter);
  }

  const totalItems = currentData.length; // Calculate totalItems from the filtered data
  const totalPages = Math.ceil(totalItems / pageSize);
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;

  const paginatedItems = currentData.slice(startIndex, endIndex);
});

app.listen(PORT, () => {
  console.log(\`Server running on http://localhost:\${PORT}\`);
});
`,
    starter_code: `
import express from 'express';
import { Request, Response } from 'express';

interface Resource {
  id: string;
  name: string;
  status: 'active' | 'inactive' | 'pending';
  category: 'tool' | 'material' | 'service';
  createdAt: string;
}

interface PaginationMeta {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

interface PaginatedResponse<T> {
  meta: PaginationMeta;
  items: T[];
}

const app = express();
const PORT = 3000;

// Mock database (already defined in module scope)

app.get('/resources', (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const pageSize = parseInt(req.query.pageSize as string) || 10;

  const statusFilter = req.query.status as string | undefined;
  
  let currentData = [...mockDatabase]; // Start with a copy of the full data

  if (statusFilter) {
    currentData = currentData.filter(resource => resource.status === statusFilter);
  }

  const totalItems = currentData.length; // Calculate totalItems from the filtered data
  const totalPages = Math.ceil(totalItems / pageSize);
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;

  const paginatedItems = currentData.slice(startIndex, endIndex);

  // Construct and send the paginated response here
});

app.listen(PORT, () => {
  console.log(\`Server running on http://localhost:\${PORT}\`);
});
`,
    feedback_correct: "Fantastic! You've successfully assembled the `PaginatedResponse` object with all the necessary metadata and items, and sent it as a JSON response. Your API endpoint is now complete!",
    feedback_partial: "You're close to sending the response, but ensure you're creating the `meta` object with all its required properties (`totalItems`, `totalPages`, `currentPage`, `pageSize`, `hasNextPage`, `hasPreviousPage`) and then wrapping it with `items` in the `PaginatedResponse`.",
    feedback_wrong: "Sending just `paginatedItems` or a custom object without the `meta` property violates the `PaginatedResponse` contract we defined earlier. The client needs the full metadata to properly handle pagination.",
    expected: `
import express from 'express';
import { Request, Response } from 'express';

interface Resource {
  id: string;
  name: string;
  status: 'active' | 'inactive' | 'pending';
  category: 'tool' | 'material' | 'service';
  createdAt: string;
}

interface PaginationMeta {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

interface PaginatedResponse<T> {
  meta: PaginationMeta;
  items: T[];
}

const app = express();
const PORT = 3000;

// Mock database (already defined in module scope)

app.get('/resources', (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const pageSize = parseInt(req.query.pageSize as string) || 10;

  const statusFilter = req.query.status as string | undefined;
  
  let currentData = [...mockDatabase]; // Start with a copy of the full data

  if (statusFilter) {
    currentData = currentData.filter(resource => resource.status === statusFilter);
  }

  const totalItems = currentData.length; // Calculate totalItems from the filtered data
  const totalPages = Math.ceil(totalItems / pageSize);
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;

  const paginatedItems = currentData.slice(startIndex, endIndex);

  const meta: PaginationMeta = {
    totalItems,
    totalPages,
    currentPage: page,
    pageSize,
    hasNextPage: page < totalPages,
    hasPreviousPage: page > 1,
  };

  const response: PaginatedResponse<Resource> = {
    meta,
    items: paginatedItems,
  };

  res.json(response);
});

app.listen(PORT, () => {
  console.log(\`Server running on http://localhost:\${PORT}\`);
});
`,
    analog_example: `
// Analog: A client-side data fetching utility that processes and stores API responses
interface ClientDataStore<T> {
  data: T[];
  pagination: PaginationMeta;
  lastFetched: Date;
}

function processApiResponse<T>(apiResponse: PaginatedResponse<T>): ClientDataStore<T> {
  return {
    data: apiResponse.items,
    pagination: apiResponse.meta,
    lastFetched: new Date(),
  };
}

// Example API response (mocked)
// const mockApiResponse: PaginatedResponse<any> = {
//   meta: {
//     totalItems: 50,
//     totalPages: 5,
//     currentPage: 1,
//     pageSize: 10,
//     hasNextPage: true,
//     hasPreviousPage: false,
//   },
//   items: [{ id: 1, name: 'Item A' }, { id: 2, name: 'Item B' }],
// };

// const store = processApiResponse(mockApiResponse);
// console.log(store.pagination.totalItems); // Output: 50
// console.log(store.data[0].name); // Output: Item A
`,
    deepDiveLabel: "What are the best practices for API response design?",
    deepDive: {
      hook: `Imagine receiving a package from an online store. If the package just contained your item loosely, without a packing slip, a return label, or any branding, it would be a confusing and potentially frustrating experience. You wouldn't know if all parts were included, how to return it, or even who sent it.

API responses are similar to these packages. They deliver data, but they also need to deliver context, instructions, and a clear identity. A poorly designed API response can make it incredibly difficult for client applications to consume the data, leading to brittle integrations, increased development time, and a poor developer experience. Best practices in API response design aim to make your data as easy and intuitive to use as possible.`,
      pain: `⚠️ **Lesson:** Poorly designed API responses lead to client-side parsing errors, lack of necessary context, and difficult integration. Symptom: Frontend developers struggle to understand the data structure, write excessive error-handling for missing fields, or cannot implement features like pagination because critical metadata is absent.`,
      mentalModel: `**Mental model:** The "Self-Describing Data Package." Think of your API response as a meticulously prepared package. It doesn't just contain the goods (your \`items\`); it also includes a clear manifest (\`meta\`) that describes what's inside, how much there is, and how to navigate related contents. This package is designed to be immediately understandable and usable by anyone who receives it, without needing external documentation for every detail. The structure itself communicates its purpose.`,
      discover: `**Pattern - Comprehensive Paginated Response:**
\`\`\`typescript
interface PaginationMeta {
  totalItems: number;       // Total count of items matching filters
  totalPages: number;       // Total pages for the filtered set
  currentPage: number;      // The page number returned (1-based)
  pageSize: number;         // Items per page
  hasNextPage: boolean;     // True if there are more pages after this one
  hasPreviousPage: boolean; // True if there are pages before this one
}

interface PaginatedResponse<T> {
  meta: PaginationMeta;     // All pagination and contextual metadata
  items: T[];               // The actual array of data for the current page
}

// Example of constructing and sending:
// const response: PaginatedResponse<Resource> = {
//   meta: {
//     totalItems: 33,
//     totalPages: 7,
//     currentPage: 1,
//     pageSize: 5,
//     hasNextPage: true,
//     hasPreviousPage: false,
//   },
//   items: [ /* 5 Resource objects */ ],
// };
// res.json(response);
\`\`\`
-   **\`meta\` object:** This is the dedicated container for all non-data information. It provides context about the current response, such as how many total items exist, how many pages there are, and the current page details.
-   **\`items\` array:** This holds the core data payload. It's typically an array of objects, each representing a single resource.
-   **\`hasNextPage\` / \`hasPreviousPage\`:** These boolean flags simplify client-side UI logic for enabling/disabling navigation buttons, preventing unnecessary requests for non-existent pages.
-   **Consistency:** Adhering to this structure across all list endpoints ensures that clients can use a single, reusable parsing logic.`,
      quickRules: `**Quick rules:**
-   ✅ Always return a consistent top-level object for list endpoints, containing \`meta\` and \`items\`.
-   ✅ Include \`totalItems\`, \`totalPages\`, \`currentPage\`, and \`pageSize\` in your \`meta\` object.
-   ✅ Add \`hasNextPage\` and \`hasPreviousPage\` for easy client-side navigation.
-   ✅ Use \`res.json()\` to automatically set the \`Content-Type\` header to \`application/json\`.
-   ❌ Never return a raw array of items from a paginated endpoint.
-   ❌ Avoid inconsistent field names (e.g., \`total_count\` in one place, \`totalItems\` in another).
-   ❌ Do not embed pagination links (e.g., \`next_page_url\`) directly in the \`meta\` if simple page numbers suffice.`,
      watchOut: `👀 **Watch out:** While \`meta\` and \`items\` is a common pattern, some APIs use \`data\` instead of \`items\`, or include a \`links\` object for HATEOAS (Hypermedia as the Engine of Application State). The key is to choose a convention and stick to it consistently across your entire API, documenting it clearly for consumers.`,
      dryRun: `🔁 **Think:**
1.  **Calculations from previous step:** \`totalItems=33\`, \`totalPages=7\`, \`page=1\`, \`pageSize=5\`, \`paginatedItems\` (first 5 active resources).
2.  \`hasNextPage\` is \`page < totalPages\` (1 < 7), which is \`true\`.
3.  \`hasPreviousPage\` is \`page > 1\` (1 > 1), which is \`false\`.
4.  The \`meta\` object is constructed:
    \`\`\`json
    {
      "totalItems": 33,
      "totalPages": 7,
      "currentPage": 1,
      "pageSize": 5,
      "hasNextPage": true,
      "hasPreviousPage": false
    }
    \`\`\`
5.  The \`response\` object is constructed:
    \`\`\`json
    {
      "meta": { /* ... above meta object ... */ },
      "items": [ /* first 5 active Resource objects */ ]
    }
    \`\`\`
6.  \`res.json(response)\` sends this JSON object to the client.
(Hint: The client now has all the information needed to display the current page and render correct pagination controls.)`,
      build: "**Learning focus:** Construct the final `PaginatedResponse` object, including `meta` and `items`, and send it as a JSON response to complete the API endpoint.",
    },
  },
];

const sideItems = [
  { label: "Lesson", id: "intro" },
  { label: "Objectives", id: "objectives" },
  { label: "Step 1: Server Setup", id: "step1" },
  { label: "Step 2: Response Structure", id: "step2" },
  { label: "Step 3: Extract Pagination Params", id: "step3" },
  { label: "Step 4: Implement Pagination", id: "step4" },
  { label: "Step 5: Extract Filter Params", id: "step5" },
  { label: "Step 6: Apply Filtering", id: "step6" },
  { label: "Step 7: Send Response", id: "step7" },
];

export default createINPACTEngine({
  NODES,
  sideItems,
  lessonNum: 0, // Assistance modules are not part of a numbered track
  title: "Filterable & Paginated Endpoints",
  shortName: "API Pagination & Filtering",
});
