import createINPACTEngine from "../inpact_engine_shared";

// Module-scope types (if applicable)
// For this module, we're testing an API that manages items, so a simple Item interface is helpful.
interface Item {
  id: string;
  name: string;
  quantity: number;
}

export const NODES = [
  {
    id: "intro",
    type: "reveal",
    phase: "Lesson",
    content: {
      tag: "integration-testing-framework",
      title: "Testing Full Workflows with Integration Tests",
      body: `When building complex software systems, individual components might work perfectly in isolation, but issues often arise when these components interact. A user interface might send data to an API, which then processes it, stores it in a database, and perhaps triggers another service. If any part of this chain breaks, the entire feature fails. Integration tests are designed to catch these interaction failures by exercising multiple parts of the system together, simulating real-world usage and ensuring that data flows correctly and logic executes as expected across different layers. They provide confidence that the system's various pieces can communicate and cooperate to achieve a desired outcome.

This pattern of testing is crucial for maintaining system reliability and preventing regressions as features evolve. It applies broadly across many software domains, from validating complex data transformations in a backend service to ensuring that a user's actions in a settings panel correctly update their preferences in a persistent store. Any time multiple distinct modules or services need to work in concert, integration tests become an indispensable tool. They complement unit tests (which focus on individual functions) by verifying the "glue" that holds the system together, ensuring that the entire system behaves as a cohesive unit.`,
      usecase: "Validating a user registration flow where a new user account is created, an email is sent, and a welcome message is displayed, ensuring all backend services and UI interactions function correctly.",
    },
  },
  {
    id: "objectives",
    type: "objectives",
    phase: "Objectives",
    items: [
      "Understand the purpose and benefits of integration testing.",
      "Set up a dedicated test database environment for integration tests.",
      "Seed test data (fixtures) to create realistic testing scenarios.",
      "Write integration tests that interact with an API client to simulate user actions.",
      "Verify system behavior and data persistence across multiple components.",
    ],
  },
  {
    id: "step1",
    type: "question",
    phase: "Step 1 of 5",
    paal: "To begin writing integration tests, we first need to import the necessary testing utilities and our application's entry point. This typically includes a testing framework, an HTTP request library, and the application instance itself.",
    hint: "Think about what modules you'd need to bring into a test file to make HTTP requests and run tests.",
    example_code: `import request from 'supertest';
import { app } from '../src/app';
import { setupTestDb, teardownTestDb, seedData } from './test-utils';`,
    think_prompt: "Which imports are essential for an integration test that interacts with an API and a database?",
    mc_options: [
      "import { render } from '@testing-library/react'; import { MyComponent } from '../src/components/MyComponent';",
      "import request from 'supertest'; import { app } from '../src/app'; import { setupTestDb } from './test-utils';",
      "import { sum } from '../src/utils'; import { expect } from 'chai';",
    ],
    mc_correct_option: "import request from 'supertest'; import { app } from '../src/app'; import { setupTestDb } from './test-utils';",
    mc_anchor: "The correct option brings in an HTTP client (`supertest`), the application instance (`app`), and a utility for database setup (`setupTestDb`).",
    why_this_matters: "Properly importing dependencies is the first step to making your test file functional. Without `supertest`, you can't make HTTP requests to your application. Without `app`, `supertest` doesn't know what to test. And without database utilities, your tests can't interact with a realistic data store.",
    answer_keywords: ["import", "supertest", "app", "test-utils"],
    seed_code: ``,
    starter_code: `// Add your integration test imports here
`,
    feedback_correct: "Excellent! These imports provide the tools to make HTTP requests, access the application, and manage the test database.",
    feedback_partial: "You're on the right track, but ensure you're importing both the HTTP client (`supertest`), the application instance (`app`), and the database setup utility (`setupTestDb`).",
    feedback_wrong: "This looks more like imports for unit tests or UI component tests. Integration tests need tools to interact with the application's API and database.",
    expected: `import request from 'supertest';
import { app } from '../src/app';
import { setupTestDb, teardownTestDb, seedData } from './test-utils';`,
    analog_example: `// Analogous: Importing modules for a file system utility test
import { expect } from 'chai';
import { createTempFile, readTempFile, deleteTempFile } from './file-system-utils';
import path from 'path';`,
    deepDiveLabel: "Why do we need a special 'request' library?",
    deepDive: {
      hook: `Imagine you're building a complex web application. You've written all your backend logic, defined your API endpoints, and now you want to make sure that when a user clicks a button on the frontend, the correct data is sent to the backend, processed, and stored. You could manually open your browser, navigate to the page, fill out a form, and click submit. But what if you have hundreds of such interactions? What if you need to test edge cases, like invalid input or specific user roles? Manually testing becomes tedious, error-prone, and impossible to scale. You need a programmatic way to simulate these interactions, send HTTP requests, and inspect the responses, all within an automated test environment.`,
      pain: `⚠️ **Lesson:** Without a dedicated HTTP client for testing, you'd be forced to either manually test your API (slow, unreliable) or mock out the entire HTTP layer (defeating the purpose of an integration test). Symptom: Your tests only verify internal logic, not how the system behaves when exposed to real network requests, leading to integration bugs slipping into production.`,
      mentalModel: `**Mental model:** The "API Client Robot." Think of 'supertest' (or similar libraries) as a specialized robot that can perfectly mimic a web browser or any other client making requests to your server. It knows how to construct HTTP requests (GET, POST, PUT, DELETE), attach headers, send JSON bodies, and then meticulously examine the server's response, including status codes, response bodies, and headers. This robot operates entirely within your test environment, allowing for rapid, repeatable, and automated interaction with your application's API.`,
      discover: `**Pattern - API Client for Testing:**
\`\`\`typescript
import request from 'supertest'; // The "API Client Robot"

// ... your application instance ...
const app = require('../src/app'); // Your application's HTTP server

describe('API Endpoint Test', () => {
  it('should respond with 200 for GET /health', async () => {
    const response = await request(app).get('/health'); // Robot makes a GET request
    expect(response.statusCode).toBe(200); // Robot checks the status code
  });
});
\`\`\`
- \`request\`: The core function from 'supertest' that initializes the client.
- \`request(app)\`: Tells the client which application instance to send requests to.
- \`.get('/health')\`: Specifies the HTTP method (GET) and the path.
- \`await\`: Important for asynchronous operations, as HTTP requests are non-blocking.
- \`response.statusCode\`: Accesses properties of the server's response for assertions.`,
      quickRules: `**Quick rules:**
- ✅ Use a dedicated HTTP testing client (e.g., Supertest, Axios with a test server).
- ✅ Point the client directly at your application's HTTP server instance.
- ✅ Simulate real HTTP methods (GET, POST, PUT, DELETE) and paths.
- ✅ Assert on HTTP status codes, response bodies, and headers.
- ❌ Manually make requests using tools like Postman during automated tests.
- ❌ Mock the entire HTTP layer if the goal is true integration testing.
- ❌ Forget to \`await\` asynchronous HTTP requests, leading to flaky tests.`,
      watchOut: `👀 **Watch out:** Ensure your test client is configured to hit the *actual* application instance, not a mocked version, and that your application is running in a test-specific environment (e.g., using a test database). If your client accidentally hits a production or development instance, you could corrupt real data or get inconsistent test results. Always verify the target of your requests.`,
      dryRun: `🔁 **Think:**
1.  \`request(app)\` is called. The 'supertest' library now has a reference to our \`app\` instance, which is an Express application (or similar HTTP server).
2.  \`.get('/health')\` is chained. 'supertest' constructs an internal HTTP GET request targeting the \`/health\` endpoint of the \`app\` instance.
3.  \`await\` pauses execution until the \`app\` instance processes the request and sends back a response.
4.  The \`response\` object is populated with the server's reply (e.g., \`statusCode: 200\`, \`body: { status: 'ok' }\`).
5.  \`expect(response.statusCode).toBe(200)\` compares the received status code (200) with the expected value (200). Since they match, the assertion passes.
(Hint: The \`request\` object is a fluent API, allowing method chaining to build the request.)`,
      build: `**Learning focus:** The first step in integration testing is importing the tools that allow your tests to interact with your application's API and manage its data store.`,
    },
  },
  {
    id: "step2",
    type: "question",
    phase: "Step 2 of 5",
    paal: "Integration tests often require a clean, predictable database state before each test or test suite. This involves setting up a dedicated test database and seeding it with specific data, known as fixtures. We'll use `describe` and `beforeEach`/`afterEach` blocks to manage this setup and teardown.",
    hint: "How do testing frameworks typically provide hooks for running code before and after tests?",
    example_code: `describe('Item Management API', () => {
  beforeEach(async () => {
    await setupTestDb(); // Connect to and clear the test database
    await seedData();    // Populate with initial test data
  });

  afterEach(async () => {
    await teardownTestDb(); // Disconnect or clean up the test database
  });

  // Tests will go here
});`,
    think_prompt: "What is the correct structure for setting up and tearing down a test environment for a suite of integration tests?",
    mc_options: [
      "test('setup', () => { setupTestDb(); }); test('teardown', () => { teardownTestDb(); });",
      "describe('Test Suite', () => { beforeAll(setupTestDb); afterAll(teardownTestDb); });",
      "describe('Test Suite', () => { beforeEach(async () => { await setupTestDb(); await seedData(); }); afterEach(async () => { await teardownTestDb(); }); });",
    ],
    mc_correct_option: "describe('Test Suite', () => { beforeEach(async () => { await setupTestDb(); await seedData(); }); afterEach(async () => { await teardownTestDb(); }); });",
    mc_anchor: "The correct option uses `describe` for grouping, and `beforeEach`/`afterEach` for per-test setup/teardown, which is ideal for integration tests requiring a fresh state.",
    why_this_matters: "A consistent and isolated test environment is paramount for reliable integration tests. `beforeEach` ensures each test starts with the same known database state, preventing tests from interfering with each other. `afterEach` cleans up, leaving no residue for subsequent test runs.",
    answer_keywords: ["describe", "beforeEach", "afterEach", "setupTestDb", "seedData", "teardownTestDb"],
    seed_code: `import request from 'supertest';
import { app } from '../src/app';
import { setupTestDb, teardownTestDb, seedData } from './test-utils';
`,
    starter_code: `import request from 'supertest';
import { app } from '../src/app';
import { setupTestDb, teardownTestDb, seedData } from './test-utils';

// Add your test suite structure with setup/teardown here
`,
    feedback_correct: "Spot on! Using `describe` with `beforeEach` and `afterEach` ensures a clean, isolated database state for every integration test.",
    feedback_partial: "You've got the `describe` block, but remember that `beforeEach` and `afterEach` are generally preferred over `beforeAll`/`afterAll` for integration tests to ensure maximum isolation between tests.",
    feedback_wrong: "This structure is not how test frameworks typically handle setup and teardown for a suite of tests. Look into `describe`, `beforeEach`, and `afterEach`.",
    expected: `import request from 'supertest';
import { app } from '../src/app';
import { setupTestDb, teardownTestDb, seedData } from './test-utils';

describe('Item Management API', () => {
  beforeEach(async () => {
    await setupTestDb(); // Connect to and clear the test database
    await seedData();    // Populate with initial test data
  });

  afterEach(async () => {
    await teardownTestDb(); // Disconnect or clean up the test database
  });

  // Tests will go here
});`,
    analog_example: `// Analogous: Setting up and tearing down a temporary directory for file system tests
import { expect } from 'chai';
import { createTempDir, cleanupTempDir, writeToFile, readFromFile } from './file-system-utils';
import path from 'path';

describe('File System Operations', () => {
  let tempDirPath: string;

  beforeEach(async () => {
    tempDirPath = await createTempDir(); // Create a fresh temporary directory
  });

  afterEach(async () => {
    await cleanupTempDir(tempDirPath); // Remove the temporary directory
  });

  // File system tests will go here
});`,
    deepDiveLabel: "Why is `beforeEach` better than `beforeAll` for integration tests?",
    deepDive: {
      hook: `Imagine you have a suite of 10 integration tests, all interacting with the same database. Test 1 creates a user, Test 2 updates that user, Test 3 deletes the user. If Test 1 fails to create the user, Test 2 will likely fail because the user it expects to update doesn't exist. Even worse, if Test 1 *succeeds* but leaves the database in a specific state (e.g., a user with a specific ID), Test 2 might then unexpectedly pass or fail depending on whether it *also* expects a user with that ID. This creates "flaky" tests where the outcome depends on the order of execution or the state left by a previous test. This interdependency makes debugging a nightmare.`,
      pain: `⚠️ **Lesson:** Tests that depend on the state left by previous tests are brittle and hard to debug. Symptom: Tests pass inconsistently, sometimes failing for no apparent reason, or a single test failure cascades into many others, making it difficult to pinpoint the root cause. This often happens when \`beforeAll\` is used to set up a shared state that is then modified by individual tests.`,
      mentalModel: `**Mental model:** The "Clean Room" approach. Each integration test should run in its own pristine, isolated environment, just like a scientist conducting an experiment in a clean room. Before each experiment (test), the room is completely sterilized and reset to a known baseline. This ensures that the results of one experiment are not influenced by the residue or conditions left over from a previous one. For databases, this means clearing all relevant tables and re-seeding them with a fresh set of known data (fixtures) before *every single test*.`,
      discover: `**Pattern - Per-Test Isolation:**
\`\`\`typescript
describe('User API', () => {
  // This runs ONCE before all tests in this describe block
  // Use for expensive, non-mutating setup (e.g., starting a server)
  beforeAll(async () => { /* ... */ }); 

  // This runs BEFORE EACH test (it block)
  // Ideal for database cleanup and seeding to ensure isolation
  beforeEach(async () => {
    await clearDatabase(); // Ensure a blank slate
    await seedFixtures();  // Populate with known, fresh data
  });

  // This runs AFTER EACH test (it block)
  afterEach(async () => { /* ... */ });

  // This runs ONCE after all tests in this describe block
  afterAll(async () => { /* ... */ });

  it('should create a user successfully', async () => { /* ... */ });
  it('should retrieve a user by ID', async () => { /* ... */ });
});
\`\`\`
- \`beforeAll\`: Executes once before any test in the \`describe\` block. Good for starting a server.
- \`beforeEach\`: Executes before *each* \`it\` block. Essential for database state isolation.
- \`afterEach\`: Executes after *each* \`it\` block. Good for per-test cleanup.
- \`afterAll\`: Executes once after all tests in the \`describe\` block. Good for stopping a server.`,
      quickRules: `**Quick rules:**
- ✅ Use \`beforeEach\` and \`afterEach\` for database setup and teardown to ensure test isolation.
- ✅ Seed a minimal, relevant set of fixtures for each test or test group.
- ✅ Ensure your database cleanup truly resets the state (e.g., truncate tables).
- ✅ Make setup/teardown functions asynchronous if they involve I/O (e.g., database calls).
- ❌ Rely on \`beforeAll\` for mutable database state that tests will modify.
- ❌ Allow tests to depend on the order of execution or state left by previous tests.
- ❌ Skip database cleanup, leading to test pollution and flakiness.`,
      watchOut: `👀 **Watch out:** While \`beforeEach\` provides excellent isolation, it can make your test suite significantly slower if your database setup and seeding process is very complex or involves large amounts of data. For very large suites, consider strategies like transactional tests (rolling back changes after each test) or intelligent partial seeding to optimize performance without sacrificing isolation.`,
      dryRun: `🔁 **Think:**
1.  The \`describe('Item Management API', ...)\` block is entered.
2.  \`beforeEach\` is encountered.
3.  \`await setupTestDb()\` is called, connecting to the test database and clearing existing data. Database state: Empty.
4.  \`await seedData()\` is called, inserting a predefined set of items into the database. Database state: Known items (e.g., {id: '1', name: 'Widget', quantity: 10}).
5.  The first \`it\` block (test) runs, interacting with the database.
6.  The first \`it\` block completes.
7.  \`afterEach\` is encountered.
8.  \`await teardownTestDb()\` is called, cleaning up or disconnecting the database. Database state: Cleaned.
9.  The next \`it\` block runs, repeating steps 2-8, ensuring it starts with the same known database state as the first test.
(Hint: The \`beforeEach\` and \`afterEach\` hooks create a consistent "sandwich" around each individual test.)`,
      build: `**Learning focus:** Structuring your test file to ensure a clean, isolated database state for every test is fundamental for reliable integration testing.`,
    },
  },
  {
    id: "step3",
    type: "question",
    phase: "Step 3 of 5",
    paal: "Now that our test environment is set up, we can write our first integration test. This test will simulate creating a new item via our API and then verify that the item was successfully created and stored in the database.",
    hint: "Remember to use the `request` client to make a `POST` request and then assert on the response status and body.",
    example_code: `  it('should create a new item successfully', async () => {
    const newItem = { name: 'Test Item', quantity: 5 };
    const response = await request(app)
      .post('/items')
      .send(newItem)
      .expect(201); // Expect HTTP 201 Created

    expect(response.body).toHaveProperty('id');
    expect(response.body.name).toBe(newItem.name);
    expect(response.body.quantity).toBe(newItem.quantity);

    // Verify persistence in the database (optional but good practice)
    const getResponse = await request(app).get(\`/items/\${response.body.id}\`).expect(200);
    expect(getResponse.body.name).toBe(newItem.name);
  });`,
    think_prompt: "How do you write an integration test that creates a resource via a POST request and verifies its creation?",
    mc_options: [
      "it('should create item', () => { expect(true).toBe(false); });",
      "it('should create item', async () => { const response = await request(app).post('/items').send({ name: 'A', quantity: 1 }); expect(response.statusCode).toBe(200); });",
      "it('should create item', async () => { const newItem = { name: 'Widget', quantity: 10 }; const response = await request(app).post('/items').send(newItem).expect(201); expect(response.body.name).toBe(newItem.name); });",
    ],
    mc_correct_option: "it('should create item', async () => { const newItem = { name: 'Widget', quantity: 10 }; const response = await request(app).post('/items').send(newItem).expect(201); expect(response.body.name).toBe(newItem.name); });",
    mc_anchor: "The correct option correctly uses `it` with `async`, makes a `POST` request with `send`, expects a `201` status, and asserts on the response body.",
    why_this_matters: "This test verifies a fundamental 'create' operation, ensuring that your API endpoint correctly handles incoming data, persists it, and returns the appropriate response. It's a critical happy-path test that confirms the basic functionality of a key workflow.",
    answer_keywords: ["it", "async", "request", "post", "send", "expect", "201", "response.body", "toHaveProperty", "toBe"],
    seed_code: `import request from 'supertest';
import { app } from '../src/app';
import { setupTestDb, teardownTestDb, seedData } from './test-utils';

describe('Item Management API', () => {
  beforeEach(async () => {
    await setupTestDb(); // Connect to and clear the test database
    await seedData();    // Populate with initial test data
  });

  afterEach(async () => {
    await teardownTestDb(); // Disconnect or clean up the test database
  });
});
`,
    starter_code: `import request from 'supertest';
import { app } from '../src/app';
import { setupTestDb, teardownTestDb, seedData } from './test-utils';

describe('Item Management API', () => {
  beforeEach(async () => {
    await setupTestDb(); // Connect to and clear the test database
    await seedData();    // Populate with initial test data
  });

  afterEach(async () => {
    await teardownTestDb(); // Disconnect or clean up the test database
  });

  // Add your 'create item' integration test here
});
`,
    feedback_correct: "Fantastic! You've successfully written an integration test that creates an item and verifies its properties and persistence.",
    feedback_partial: "You're close! Make sure your `POST` request sends the correct data using `.send()` and that you're asserting on the expected HTTP status code (201 for creation) and the response body.",
    feedback_wrong: "This test is either empty or doesn't correctly simulate an API call and assertion. Remember to use `request(app).post().send().expect()` and then assert on the `response.body`.",
    expected: `import request from 'supertest';
import { app } from '../src/app';
import { setupTestDb, teardownTestDb, seedData } from './test-utils';

describe('Item Management API', () => {
  beforeEach(async () => {
    await setupTestDb(); // Connect to and clear the test database
    await seedData();    // Populate with initial test data
  });

  afterEach(async () => {
    await teardownTestDb(); // Disconnect or clean up the test database
  });

  it('should create a new item successfully', async () => {
    const newItem = { name: 'Test Item', quantity: 5 };
    const response = await request(app)
      .post('/items')
      .send(newItem)
      .expect(201); // Expect HTTP 201 Created

    expect(response.body).toHaveProperty('id');
    expect(response.body.name).toBe(newItem.name);
    expect(response.body.quantity).toBe(newItem.quantity);

    // Verify persistence in the database (optional but good practice)
    const getResponse = await request(app).get(\`/items/\${response.body.id}\`).expect(200);
    expect(getResponse.body.name).toBe(newItem.name);
  });
});`,
    analog_example: `// Analogous: Testing a file creation and content verification
import { expect } from 'chai';
import { createTempDir, cleanupTempDir, writeToFile, readFromFile } from './file-system-utils';
import path from 'path';

describe('File System Operations', () => {
  let tempDirPath: string;

  beforeEach(async () => {
    tempDirPath = await createTempDir();
  });

  afterEach(async () => {
    await cleanupTempDir(tempDirPath);
  });

  it('should create a file with specified content', async () => {
    const fileName = 'test.txt';
    const fileContent = 'Hello, Integration!';
    const filePath = path.join(tempDirPath, fileName);

    await writeToFile(filePath, fileContent); // Simulate creating a file

    const readContent = await readFromFile(filePath); // Simulate reading it back
    expect(readContent).to.equal(fileContent);
  });
});`,
    deepDiveLabel: "How do we know the item is *really* in the database?",
    deepDive: {
      hook: `You've just sent a POST request to your API, and it returned a '201 Created' status code and a JSON object with the new item's details. Great! But how do you know for sure that the item wasn't just returned from a temporary cache, or that the database operation didn't silently fail after the API responded? In an integration test, the whole point is to verify that all layers, including the database, are working together. Relying solely on the immediate API response can sometimes give a false sense of security if the persistence layer isn't truly integrated.`,
      pain: `⚠️ **Lesson:** Asserting only on the immediate API response can miss issues in the data persistence layer. Symptom: Tests pass, but data isn't actually saved or is saved incorrectly, leading to data integrity issues in production that were not caught by tests. This often happens when the API layer is decoupled from the database in a way that allows the API to respond before the database transaction is fully committed or validated.`,
      mentalModel: `**Mental model:** The "Double-Check Inspector." After the initial action (like creating an item), the inspector doesn't just trust the first report. Instead, they perform a secondary, independent verification. For an API integration test, this means making a *second* API call (e.g., a GET request) to retrieve the newly created resource. If the second call successfully retrieves the resource with the expected data, it provides strong evidence that the item was indeed persisted correctly in the database and is retrievable through the system's normal channels.`,
      discover: `**Pattern - Verify Persistence with a Follow-Up Request:**
\`\`\`typescript
it('should create and retrieve a user', async () => {
  const newUser = { username: 'testuser', email: 'test@example.com' };

  // 1. Action: Create the user
  const createResponse = await request(app)
    .post('/users')
    .send(newUser)
    .expect(201);

  const userId = createResponse.body.id; // Get the ID from the creation response
  expect(userId).toBeDefined();
  expect(createResponse.body.username).toBe(newUser.username);

  // 2. Verification: Retrieve the user independently
  const getResponse = await request(app)
    .get(\`/users/\${userId}\`) // Use the ID to fetch the user
    .expect(200);

  expect(getResponse.body.username).toBe(newUser.username); // Assert retrieved data
  expect(getResponse.body.email).toBe(newUser.email);
});
\`\`\`
- \`createResponse\`: The initial response from the \`POST\` request.
- \`userId\`: Extracted from the \`createResponse\` body, crucial for the follow-up.
- \`getResponse\`: The response from the subsequent \`GET\` request.
- \`expect(getResponse.body.username).toBe(newUser.username)\`: Confirms the data was correctly stored and retrieved.`,
      quickRules: `**Quick rules:**
- ✅ After a creation/update operation, perform a read operation (e.g., GET) to verify persistence.
- ✅ Use the ID or unique identifier returned by the creation/update API for the follow-up read.
- ✅ Assert that the data retrieved matches the data sent in the initial request.
- ✅ Consider verifying related data (e.g., a counter incremented in another table).
- ❌ Rely solely on the status code and body of the initial write operation.
- ❌ Assume success without independent verification, especially for critical data.
- ❌ Directly query the database in your test if the goal is to test the API's full stack.`,
      watchOut: `👀 **Watch out:** While directly querying the database in your test *can* provide ultimate verification, it blurs the line between integration and unit testing of your data access layer. For true end-to-end API integration tests, it's generally better to verify persistence by making another API call (e.g., a GET request) to ensure the data is retrievable through the same public interface your application uses. This keeps the test focused on the API's behavior.`,
      dryRun: `🔁 **Think:**
1.  \`newItem\` is defined: \`{ name: 'Test Item', quantity: 5 }\`.
2.  \`request(app).post('/items').send(newItem)\` sends this data to the API.
3.  The API processes the request, saves the item to the database, and returns a \`201\` status with the created item (e.g., \`{ id: 'abc', name: 'Test Item', quantity: 5 }\`). This is stored in \`response\`.
4.  \`expect(response.body).toHaveProperty('id')\` passes because 'id' exists.
5.  \`expect(response.body.name).toBe(newItem.name)\` passes because 'Test Item' === 'Test Item'.
6.  \`expect(response.body.quantity).toBe(newItem.quantity)\` passes because 5 === 5.
7.  \`request(app).get(\`/items/\${response.body.id}\`)\` makes a *new* request to fetch the item by its ID ('abc').
8.  The API retrieves the item from the database and returns it. This is stored in \`getResponse\`.
9.  \`expect(getResponse.body.name).toBe(newItem.name)\` passes, confirming the item was indeed saved and retrieved correctly.
(Hint: The second GET request acts as an independent confirmation of the POST's effect on the system's state.)`,
      build: `**Learning focus:** Writing a complete integration test involves not just sending data but also verifying that the system's state has changed as expected, often through a follow-up read operation.`,
    },
  },
  {
    id: "step4",
    type: "question",
    phase: "Step 4 of 5",
    paal: "Beyond happy paths, robust integration tests also cover edge cases like invalid input. Let's add a test that attempts to create an item with missing required fields and verifies that the API responds with an appropriate error.",
    hint: "What HTTP status code typically indicates a client-side error due to bad input?",
    example_code: `  it('should return 400 if item name is missing', async () => {
    const invalidItem = { quantity: 10 }; // Missing 'name'
    await request(app)
      .post('/items')
      .send(invalidItem)
      .expect(400); // Expect HTTP 400 Bad Request
  });

  it('should return 400 if item quantity is negative', async () => {
    const invalidItem = { name: 'Bad Item', quantity: -5 }; // Negative quantity
    await request(app)
      .post('/items')
      .send(invalidItem)
      .expect(400); // Expect HTTP 400 Bad Request
  });`,
    think_prompt: "How do you test an API's validation logic for invalid input?",
    mc_options: [
      "it('should handle bad input', async () => { await request(app).post('/items').send({}).expect(500); });",
      "it('should handle bad input', async () => { await request(app).post('/items').send({ name: 'A' }).expect(200); });",
      "it('should handle bad input', async () => { await request(app).post('/items').send({}).expect(400); });",
    ],
    mc_correct_option: "it('should handle bad input', async () => { await request(app).post('/items').send({}).expect(400); });",
    mc_anchor: "The correct option sends an empty object (missing required fields) and expects a `400 Bad Request` status, which is typical for validation errors.",
    why_this_matters: "Testing validation ensures that your API is resilient to incorrect or malicious input. It confirms that your backend correctly rejects invalid data before it can cause issues in your system or database, providing a secure and predictable API.",
    answer_keywords: ["validation", "bad request", "400", "expect", "send", "invalid input"],
    seed_code: `import request from 'supertest';
import { app } from '../src/app';
import { setupTestDb, teardownTestDb, seedData } from './test-utils';

describe('Item Management API', () => {
  beforeEach(async () => {
    await setupTestDb(); // Connect to and clear the test database
    await seedData();    // Populate with initial test data
  });

  afterEach(async () => {
    await teardownTestDb(); // Disconnect or clean up the test database
  });

  it('should create a new item successfully', async () => {
    const newItem = { name: 'Test Item', quantity: 5 };
    const response = await request(app)
      .post('/items')
      .send(newItem)
      .expect(201); // Expect HTTP 201 Created

    expect(response.body).toHaveProperty('id');
    expect(response.body.name).toBe(newItem.name);
    expect(response.body.quantity).toBe(newItem.quantity);

    // Verify persistence in the database (optional but good practice)
    const getResponse = await request(app).get(\`/items/\${response.body.id}\`).expect(200);
    expect(getResponse.body.name).toBe(newItem.name);
  });
});
`,
    starter_code: `import request from 'supertest';
import { app } from '../src/app';
import { setupTestDb, teardownTestDb, seedData } from './test-utils';

describe('Item Management API', () => {
  beforeEach(async () => {
    await setupTestDb(); // Connect to and clear the test database
    await seedData();    // Populate with initial test data
  });

  afterEach(async () => {
    await teardownTestDb(); // Disconnect or clean up the test database
  });

  it('should create a new item successfully', async () => {
    const newItem = { name: 'Test Item', quantity: 5 };
    const response = await request(app)
      .post('/items')
      .send(newItem)
      .expect(201); // Expect HTTP 201 Created

    expect(response.body).toHaveProperty('id');
    expect(response.body.name).toBe(newItem.name);
    expect(response.body.quantity).toBe(newItem.quantity);

    // Verify persistence in the database (optional but good practice)
    const getResponse = await request(app).get(\`/items/\${response.body.id}\`).expect(200);
    expect(getResponse.body.name).toBe(newItem.name);
  });

  // Add your validation integration tests here
});
`,
    feedback_correct: "Excellent! Testing for invalid input is crucial for a robust API. You've correctly asserted the `400 Bad Request` status.",
    feedback_partial: "You're on the right track with sending invalid data, but ensure you're asserting the correct HTTP status code for client-side validation errors, which is typically `400`.",
    feedback_wrong: "This test doesn't correctly simulate invalid input or assert the expected error response. Remember to send data that violates your API's validation rules and expect a `400` status.",
    expected: `import request from 'supertest';
import { app } from '../src/app';
import { setupTestDb, teardownTestDb, seedData } from './test-utils';

describe('Item Management API', () => {
  beforeEach(async () => {
    await setupTestDb(); // Connect to and clear the test database
    await seedData();    // Populate with initial test data
  });

  afterEach(async () => {
    await teardownTestDb(); // Disconnect or clean up the test database
  });

  it('should create a new item successfully', async () => {
    const newItem = { name: 'Test Item', quantity: 5 };
    const response = await request(app)
      .post('/items')
      .send(newItem)
      .expect(201); // Expect HTTP 201 Created

    expect(response.body).toHaveProperty('id');
    expect(response.body.name).toBe(newItem.name);
    expect(response.body.quantity).toBe(newItem.quantity);

    // Verify persistence in the database (optional but good practice)
    const getResponse = await request(app).get(\`/items/\${response.body.id}\`).expect(200);
    expect(getResponse.body.name).toBe(newItem.name);
  });

  it('should return 400 if item name is missing', async () => {
    const invalidItem = { quantity: 10 }; // Missing 'name'
    await request(app)
      .post('/items')
      .send(invalidItem)
      .expect(400); // Expect HTTP 400 Bad Request
  });

  it('should return 400 if item quantity is negative', async () => {
    const invalidItem = { name: 'Bad Item', quantity: -5 }; // Negative quantity
    await request(app)
      .post('/items')
      .send(invalidItem)
      .expect(400); // Expect HTTP 400 Bad Request
  });
});`,
    analog_example: `// Analogous: Testing validation for a file system utility
import { expect } from 'chai';
import { createTempDir, cleanupTempDir, writeToFile, readFromFile } from './file-system-utils';
import path from 'path';

describe('File System Operations', () => {
  let tempDirPath: string;

  beforeEach(async () => {
    tempDirPath = await createTempDir();
  });

  afterEach(async () => {
    await cleanupTempDir(tempDirPath);
  });

  it('should throw error if file path is invalid', async () => {
    const invalidPath = '/nonexistent/dir/file.txt';
    const content = 'some content';
    let error: Error | undefined;
    try {
      await writeToFile(invalidPath, content); // Attempt to write to an invalid path
    } catch (e) {
      error = e as Error;
    }
    expect(error).to.exist;
    expect(error?.message).to.include('No such file or directory');
  });
});`,
    deepDiveLabel: "Why is it important to test for *invalid* input?",
    deepDive: {
      hook: `Imagine your application is used to manage critical data, like financial transactions or patient records. What happens if a user (or a malicious actor) tries to submit incomplete data, negative quantities, or text where a number is expected? If your API blindly accepts this input, it could lead to corrupted data in your database, unexpected application crashes, or even security vulnerabilities. Your application needs to be robust enough to gracefully handle and reject anything that doesn't conform to its expected data model and business rules.`,
      pain: `⚠️ **Lesson:** Unvalidated input can lead to data corruption, application errors, and security vulnerabilities. Symptom: Your application crashes when users enter unexpected data, or invalid data appears in your database, causing downstream processes to fail. This often indicates a lack of comprehensive input validation at the API layer.`,
      mentalModel: `**Mental model:** The "Bouncer at the Club." Your API acts like a bouncer at an exclusive club. It has a clear set of rules for who can enter (what data is valid) and what they must carry (required fields, correct data types, valid ranges). If someone tries to enter without an ID (missing required field), or tries to bring in prohibited items (negative quantity), the bouncer immediately rejects them at the door, preventing them from causing trouble inside the club (your application and database). The bouncer doesn't just let everyone in and hope for the best; they actively enforce the rules.`,
      discover: `**Pattern - Testing Input Validation:**
\`\`\`typescript
it('should return 400 for invalid email format', async () => {
  const invalidUser = { username: 'user1', email: 'invalid-email' }; // Bad email format

  const response = await request(app)
    .post('/users')
    .send(invalidUser)
    .expect(400); // Expect HTTP 400 Bad Request

  // Optionally, assert on the error message for more specific feedback
  expect(response.body.message).toContain('Invalid email format');
});

it('should return 400 for missing required field', async () => {
  const incompleteUser = { email: 'valid@example.com' }; // Missing 'username'

  const response = await request(app)
    .post('/users')
    .send(incompleteUser)
    .expect(400); // Expect HTTP 400 Bad Request

  expect(response.body.message).toContain('Username is required');
});
\`\`\`
- \`invalidUser\`: Data intentionally crafted to violate validation rules.
- \`.send(invalidUser)\`: Sends the malformed data to the API.
- \`.expect(400)\`: Asserts that the API responds with a \`400 Bad Request\` status.
- \`expect(response.body.message).toContain(...)\`: Verifies that the error message provides helpful context.`,
      quickRules: `**Quick rules:**
- ✅ Test all validation rules: required fields, data types, min/max lengths, ranges, formats (email, date).
- ✅ Send data that specifically violates one rule at a time to isolate failures.
- ✅ Expect appropriate HTTP error codes (e.g., 400 Bad Request, 422 Unprocessable Entity).
- ✅ Assert on the error message or error structure in the response body for clarity.
- ❌ Assume valid input will always be provided by clients.
- ❌ Only test happy paths and ignore edge cases or error conditions.
- ❌ Return a generic 500 error for client-side validation issues.`,
      watchOut: `👀 **Watch out:** While testing for invalid input, ensure your tests don't just check the status code but also, if possible, the *content* of the error message. A generic '400 Bad Request' is less helpful than '400 Bad Request: 'name' field is required'. Specific error messages help debug issues faster and provide better feedback to API consumers.`,
      dryRun: `🔁 **Think:**
1.  \`invalidItem\` is defined: \`{ quantity: 10 }\`. The \`name\` field is missing, which is a validation rule.
2.  \`request(app).post('/items').send(invalidItem)\` sends this incomplete data to the API.
3.  The API's validation middleware (or logic within the route handler) detects that the \`name\` field is required but absent.
4.  Instead of processing the request, the API immediately sends back an HTTP response with status \`400 Bad Request\` and potentially an error message in the body.
5.  \`.expect(400)\` asserts that the received status code is \`400\`. Since it matches, the test passes.
(Hint: The API's validation logic intercepts the request *before* it reaches the database layer.)`,
      build: `**Learning focus:** Validating input is a critical aspect of API robustness, and integration tests are ideal for verifying that these validation rules are correctly enforced across the system.`,
    },
  },
  {
    id: "step5",
    type: "question",
    phase: "Step 5 of 5",
    paal: "Finally, let's test a state transition: updating an existing item. This involves making a `PUT` request and then verifying that the changes are reflected when the item is retrieved again.",
    hint: "You'll need to create an item first (or use a seeded one), then make a `PUT` request to its specific ID, and finally `GET` it again to confirm the update.",
    example_code: `  it('should update an existing item successfully', async () => {
    // Use a seeded item or create one
    const initialItem = { name: 'Initial Widget', quantity: 10 };
    const createResponse = await request(app).post('/items').send(initialItem).expect(201);
    const itemId = createResponse.body.id;

    const updatedItemData = { name: 'Updated Widget', quantity: 15 };
    await request(app)
      .put(\`/items/\${itemId}\`)
      .send(updatedItemData)
      .expect(200); // Expect HTTP 200 OK for successful update

    // Verify the update by fetching the item again
    const getResponse = await request(app).get(\`/items/\${itemId}\`).expect(200);
    expect(getResponse.body.name).toBe(updatedItemData.name);
    expect(getResponse.body.quantity).toBe(updatedItemData.quantity);
  });

  it('should return 404 if trying to update a non-existent item', async () => {
    const nonExistentId = 'non-existent-id-123';
    const updatedItemData = { name: 'Ghost Item', quantity: 1 };
    await request(app)
      .put(\`/items/\${nonExistentId}\`)
      .send(updatedItemData)
      .expect(404); // Expect HTTP 404 Not Found
  });`,
    think_prompt: "How do you write an integration test for updating an existing resource and verifying the change?",
    mc_options: [
      "it('should update item', async () => { await request(app).put('/items/1').send({ name: 'New' }).expect(200); });",
      "it('should update item', async () => { const id = 'abc'; const updated = { name: 'New' }; await request(app).put(`/items/${id}`).send(updated).expect(200); const res = await request(app).get(`/items/${id}`); expect(res.body.name).toBe(updated.name); });",
      "it('should update item', async () => { await request(app).post('/items').send({ name: 'New' }).expect(200); });",
    ],
    mc_correct_option: "it('should update item', async () => { const id = 'abc'; const updated = { name: 'New' }; await request(app).put(`/items/${id}`).send(updated).expect(200); const res = await request(app).get(`/items/${id}`); expect(res.body.name).toBe(updated.name); });",
    mc_anchor: "The correct option makes a `PUT` request to a specific ID, sends update data, expects `200`, and then performs a `GET` to verify the change.",
    why_this_matters: "Testing updates ensures that your API can correctly modify existing data while maintaining data integrity. It verifies the full lifecycle of a resource, from creation to modification, and confirms that your system accurately reflects state changes.",
    answer_keywords: ["update", "put", "get", "verify", "state transition", "200", "404"],
    seed_code: `import request from 'supertest';
import { app } from '../src/app';
import { setupTestDb, teardownTestDb, seedData } from './test-utils';

describe('Item Management API', () => {
  beforeEach(async () => {
    await setupTestDb(); // Connect to and clear the test database
    await seedData();    // Populate with initial test data
  });

  afterEach(async () => {
    await teardownTestDb(); // Disconnect or clean up the test database
  });

  it('should create a new item successfully', async () => {
    const newItem = { name: 'Test Item', quantity: 5 };
    const response = await request(app)
      .post('/items')
      .send(newItem)
      .expect(201); // Expect HTTP 201 Created

    expect(response.body).toHaveProperty('id');
    expect(response.body.name).toBe(newItem.name);
    expect(response.body.quantity).toBe(newItem.quantity);

    // Verify persistence in the database (optional but good practice)
    const getResponse = await request(app).get(\`/items/\${response.body.id}\`).expect(200);
    expect(getResponse.body.name).toBe(newItem.name);
  });

  it('should return 400 if item name is missing', async () => {
    const invalidItem = { quantity: 10 }; // Missing 'name'
    await request(app)
      .post('/items')
      .send(invalidItem)
      .expect(400); // Expect HTTP 400 Bad Request
  });

  it('should return 400 if item quantity is negative', async () => {
    const invalidItem = { name: 'Bad Item', quantity: -5 }; // Negative quantity
    await request(app)
      .post('/items')
      .send(invalidItem)
      .expect(400); // Expect HTTP 400 Bad Request
  });
});
`,
    starter_code: `import request from 'supertest';
import { app } from '../src/app';
import { setupTestDb, teardownTestDb, seedData } from './test-utils';

describe('Item Management API', () => {
  beforeEach(async () => {
    await setupTestDb(); // Connect to and clear the test database
    await seedData();    // Populate with initial test data
  });

  afterEach(async () => {
    await teardownTestDb(); // Disconnect or clean up the test database
  });

  it('should create a new item successfully', async () => {
    const newItem = { name: 'Test Item', quantity: 5 };
    const response = await request(app)
      .post('/items')
      .send(newItem)
      .expect(201); // Expect HTTP 201 Created

    expect(response.body).toHaveProperty('id');
    expect(response.body.name).toBe(newItem.name);
    expect(response.body.quantity).toBe(newItem.quantity);

    // Verify persistence in the database (optional but good practice)
    const getResponse = await request(app).get(\`/items/\${response.body.id}\`).expect(200);
    expect(getResponse.body.name).toBe(newItem.name);
  });

  it('should return 400 if item name is missing', async () => {
    const invalidItem = { quantity: 10 }; // Missing 'name'
    await request(app)
      .post('/items')
      .send(invalidItem)
      .expect(400); // Expect HTTP 400 Bad Request
  });

  it('should return 400 if item quantity is negative', async () => {
    const invalidItem = { name: 'Bad Item', quantity: -5 }; // Negative quantity
    await request(app)
      .post('/items')
      .send(invalidItem)
      .expect(400); // Expect HTTP 400 Bad Request
  });

  // Add your update item integration tests here
});
`,
    feedback_correct: "Excellent! You've successfully tested the update workflow, including verifying the changes and handling non-existent resources.",
    feedback_partial: "You've got the `PUT` request, but remember to verify the update by making a subsequent `GET` request to ensure the changes were persisted and are retrievable.",
    feedback_wrong: "This test doesn't correctly simulate an update. Remember to target a specific resource ID with a `PUT` request, send the updated data, and then verify the changes.",
    expected: `import request from 'supertest';
import { app } from '../src/app';
import { setupTestDb, teardownTestDb, seedData } from './test-utils';

describe('Item Management API', () => {
  beforeEach(async () => {
    await setupTestDb(); // Connect to and clear the test database
    await seedData();    // Populate with initial test data
  });

  afterEach(async () => {
    await teardownTestDb(); // Disconnect or clean up the test database
  });

  it('should create a new item successfully', async () => {
    const newItem = { name: 'Test Item', quantity: 5 };
    const response = await request(app)
      .post('/items')
      .send(newItem)
      .expect(201); // Expect HTTP 201 Created

    expect(response.body).toHaveProperty('id');
    expect(response.body.name).toBe(newItem.name);
    expect(response.body.quantity).toBe(newItem.quantity);

    // Verify persistence in the database (optional but good practice)
    const getResponse = await request(app).get(\`/items/\${response.body.id}\`).expect(200);
    expect(getResponse.body.name).toBe(newItem.name);
  });

  it('should return 400 if item name is missing', async () => {
    const invalidItem = { quantity: 10 }; // Missing 'name'
    await request(app)
      .post('/items')
      .send(invalidItem)
      .expect(400); // Expect HTTP 400 Bad Request
  });

  it('should return 400 if item quantity is negative', async () => {
    const invalidItem = { name: 'Bad Item', quantity: -5 }; // Negative quantity
    await request(app)
      .post('/items')
      .send(invalidItem)
      .expect(400); // Expect HTTP 400 Bad Request
  });

  it('should update an existing item successfully', async () => {
    // Use a seeded item or create one
    const initialItem = { name: 'Initial Widget', quantity: 10 };
    const createResponse = await request(app).post('/items').send(initialItem).expect(201);
    const itemId = createResponse.body.id;

    const updatedItemData = { name: 'Updated Widget', quantity: 15 };
    await request(app)
      .put(\`/items/\${itemId}\`)
      .send(updatedItemData)
      .expect(200); // Expect HTTP 200 OK for successful update

    // Verify the update by fetching the item again
    const getResponse = await request(app).get(\`/items/\${itemId}\`).expect(200);
    expect(getResponse.body.name).toBe(updatedItemData.name);
    expect(getResponse.body.quantity).toBe(updatedItemData.quantity);
  });

  it('should return 404 if trying to update a non-existent item', async () => {
    const nonExistentId = 'non-existent-id-123';
    const updatedItemData = { name: 'Ghost Item', quantity: 1 };
    await request(app)
      .put(\`/items/\${nonExistentId}\`)
      .send(updatedItemData)
      .expect(404); // Expect HTTP 404 Not Found
  });
});`,
    analog_example: `// Analogous: Testing updating content in an existing file
import { expect } from 'chai';
import { createTempDir, cleanupTempDir, writeToFile, readFromFile } from './file-system-utils';
import path from 'path';

describe('File System Operations', () => {
  let tempDirPath: string;

  beforeEach(async () => {
    tempDirPath = await createTempDir();
  });

  afterEach(async () => {
    await cleanupTempDir(tempDirPath);
  });

  it('should update content of an existing file', async () => {
    const fileName = 'update_me.txt';
    const initialContent = 'Original content.';
    const updatedContent = 'New and improved content.';
    const filePath = path.join(tempDirPath, fileName);

    await writeToFile(filePath, initialContent); // Create file with initial content
    let readContent = await readFromFile(filePath);
    expect(readContent).to.equal(initialContent);

    await writeToFile(filePath, updatedContent); // Update file content
    readContent = await readFromFile(filePath); // Read again to verify
    expect(readContent).to.equal(updatedContent);
  });
});`,
    deepDiveLabel: "Why is it important to test the full 'lifecycle' of data?",
    deepDive: {
      hook: `Your application isn't just about creating new data; it's about managing that data throughout its entire lifespan. A user might create a profile, then update their email address, change their password, and eventually delete their account. Each of these actions represents a state transition for that user's data. If you only test that a user can be created, but never verify that they can be updated or deleted correctly, you're only seeing a fraction of the picture. Bugs in update or delete operations can lead to stale data, data integrity issues, or even data loss, which can be far more damaging than a simple creation failure.`,
      pain: `⚠️ **Lesson:** Incomplete testing of data lifecycle operations (create, read, update, delete - CRUD) leaves critical gaps where bugs can hide. Symptom: Users report being unable to change their settings, old data reappears, or data is permanently lost without proper deletion. This indicates that the full interaction between the application, API, and database for state changes hasn't been thoroughly verified.`,
      mentalModel: `**Mental model:** The "Data Journey Map." Imagine your data as a traveler moving through different stages: born (created), growing (updated), and eventually departing (deleted). An integration test for state transitions is like tracing this traveler's entire journey. You ensure that at each stage, the traveler (data) arrives at the correct destination, has the expected attributes, and that the system accurately reflects their current status. This comprehensive map ensures no part of the journey is broken or leads to an unexpected outcome.`,
      discover: `**Pattern - Testing Data Lifecycle (CRUD):**
\`\`\`typescript
describe('Product API Lifecycle', () => {
  // ... beforeEach/afterEach setup ...

  it('should complete the full product lifecycle (create, update, delete)', async () => {
    // 1. Create a product
    const createResponse = await request(app).post('/products').send({ name: 'Laptop', price: 1200 }).expect(201);
    const productId = createResponse.body.id;

    // 2. Read the created product
    let getResponse = await request(app).get(\`/products/\${productId}\`).expect(200);
    expect(getResponse.body.name).toBe('Laptop');

    // 3. Update the product
    await request(app).put(\`/products/\${productId}\`).send({ price: 1150 }).expect(200);

    // 4. Read the updated product to verify
    getResponse = await request(app).get(\`/products/\${productId}\`).expect(200);
    expect(getResponse.body.price).toBe(1150);

    // 5. Delete the product
    await request(app).delete(\`/products/\${productId}\`).expect(204); // 204 No Content for successful deletion

    // 6. Attempt to read the deleted product (expect 404)
    await request(app).get(\`/products/\${productId}\`).expect(404);
  });
});
\`\`\`
- **Create (POST)**: Adds a new resource.
- **Read (GET)**: Retrieves a resource.
- **Update (PUT/PATCH)**: Modifies an existing resource.
- **Delete (DELETE)**: Removes a resource.
- Each step verifies the system's state change before proceeding.`,
      quickRules: `**Quick rules:**
- ✅ Test all CRUD operations (Create, Read, Update, Delete) for critical resources.
- ✅ Chain operations within a single test to simulate a full workflow.
- ✅ Verify the state after each operation (e.g., GET after PUT).
- ✅ Test edge cases like updating non-existent resources (expect 404).
- ❌ Only test creation and neglect updates or deletions.
- ❌ Assume an update or delete succeeded without verifying the new state.
- ❌ Test only happy paths; ignore error conditions for state transitions.`,
      watchOut: `👀 **Watch out:** When chaining operations in a single test (like create -> update -> delete), if an early step fails, subsequent steps will also fail, potentially obscuring the root cause. While this is acceptable for demonstrating a full lifecycle, for very complex workflows, consider breaking them into smaller, more focused tests that each set up their own initial state (e.g., a test specifically for 'update existing item' that starts with a pre-created item).`,
      dryRun: `🔁 **Think:**
1.  \`initialItem\` is created via \`POST /items\`. The API returns \`201\` and \`{ id: 'xyz', name: 'Initial Widget', quantity: 10 }\`. \`itemId\` becomes 'xyz'.
2.  \`updatedItemData\` is \`{ name: 'Updated Widget', quantity: 15 }\`.
3.  \`request(app).put('/items/xyz').send(updatedItemData)\` is sent. The API updates the item in the database.
4.  The API returns \`200 OK\`. The \`expect(200)\` assertion passes.
5.  \`request(app).get('/items/xyz')\` is sent. The API retrieves the *updated* item from the database.
6.  The API returns \`200 OK\` and \`{ id: 'xyz', name: 'Updated Widget', quantity: 15 }\`.
7.  \`expect(getResponse.body.name).toBe(updatedItemData.name)\` passes because 'Updated Widget' === 'Updated Widget'.
8.  \`expect(getResponse.body.quantity).toBe(updatedItemData.quantity)\` passes because 15 === 15.
(Hint: The \`PUT\` request changes the persistent state, and the subsequent \`GET\` verifies that change.)`,
      build: `**Learning focus:** Testing the full lifecycle of data, including updates and deletions, ensures that your application correctly manages state transitions and maintains data integrity over time.`,
    },
  },
];

const sideItems = [
  { label: "Lesson", id: "intro" },
  { label: "Objectives", id: "objectives" },
  { label: "Imports", id: "step1" },
  { label: "Test Setup", id: "step2" },
  { label: "Create Item", id: "step3" },
  { label: "Validate Input", id: "step4" },
  { label: "Update Item", id: "step5" },
];

export default createINPACTEngine({
  NODES,
  sideItems,
  lessonNum: 0, // Assistance modules have lessonNum 0
  title: "Integration Testing Full Workflows",
  shortName: "Integration Tests",
});
