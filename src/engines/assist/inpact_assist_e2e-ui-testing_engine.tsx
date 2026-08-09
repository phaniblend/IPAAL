import createINPACTEngine from "../inpact_engine_shared";

export const NODES = [
  {
    id: "intro",
    type: "reveal",
    phase: "Lesson",
    content: {
      tag: "e2e-ui-testing",
      title: "Automating User Journeys with End-to-End Tests",
      body: `When building software, individual components might work perfectly, and your backend APIs might respond as expected. But how do you ensure that the entire system — from the user interface in the browser, through your frontend application, to your backend services and database — functions seamlessly together from a real user's perspective? This is the critical problem that end-to-end (E2E) testing solves. It provides a high level of confidence that critical user flows, such as logging in, submitting a complex form, or navigating through a multi-step wizard, are fully operational across all layers of your application stack, catching integration issues that unit or API tests might miss.

This pattern is indispensable for any application with an interactive user interface. You'll find E2E tests validating the complete user authentication process, ensuring a user can successfully enter credentials, log in, and reach their intended dashboard. They are used to confirm that a multi-step checkout process correctly captures payment information and processes an order from start to finish. Any feature involving user input, dynamic content display, and navigation benefits immensely from E2E testing, providing a robust safety net against regressions in the most important user journeys.`,
      usecase: "Validating the complete user experience of a settings panel where a user updates their preferences and sees the changes reflected immediately.",
    },
  },
  {
    id: "objectives",
    type: "objectives",
    phase: "Objectives",
    items: [
      "Define a test suite for an end-to-end user journey.",
      "Simulate user navigation to a specific page within an application.",
      "Interact with UI elements by typing into input fields.",
      "Trigger actions by clicking on buttons.",
      "Assert expected UI changes and content after user interactions.",
      "Construct a full end-to-end test for a critical user flow.",
    ],
  },
  {
    id: "step1",
    type: "question",
    phase: "Step 1 of 7",
    paal: "To begin organizing our tests, we need a way to group related test cases together. This helps in structuring our test files and provides a clear context for what's being tested.",
    hint: "Think about how you'd group related functions or classes in other programming contexts. Testing frameworks provide a similar top-level grouping mechanism.",
    example_code: `describe('User Authentication Flow', () => {
  // Individual test cases will go here
});`,
    think_prompt: "Which option correctly sets up a test suite for a user authentication flow?",
    mc_options: [
      "testSuite('User Authentication Flow', () => { /* ... */ });",
      "describe('User Authentication Flow', () => { /* ... */ });",
      "groupTests('User Authentication Flow', () => { /* ... */ });",
    ],
    mc_correct_option: "describe('User Authentication Flow', () => { /* ... */ });",
    mc_anchor: "describe",
    why_this_matters: "Organizing tests into suites makes your test codebase maintainable, readable, and scalable. It allows you to run specific groups of tests and understand their purpose at a glance.",
    answer_keywords: ["describe", "test suite", "grouping"],
    seed_code: ``,
    starter_code: `// Start by defining a test suite for our user authentication journey.
// Use 'describe' to group related tests.
`,
    feedback_correct: "Excellent! The `describe` block is the standard way to define a test suite, providing a logical grouping for your tests.",
    feedback_partial: "You're on the right track with the idea of grouping tests, but the specific keyword for defining a test suite is `describe`.",
    feedback_wrong: "While the goal is to group tests, `testSuite` and `groupTests` are not the standard keywords. `describe` is used to define a test suite.",
    expected: `describe('User Authentication Flow', () => {
  // Individual test cases will go here
});`,
    analog_example: `// Analog Example: Grouping related unit tests for a Node.js utility
import { strict as assert } from 'node:assert';

describe('String Utility Functions', () => {
  // Setup or teardown for this suite
  // For example, a 'beforeAll' hook to initialize resources

  test('should correctly reverse a string', () => {
    assert.strictEqual('olleh', 'hello'.split('').reverse().join(''));
  });

  test('should correctly capitalize the first letter', () => {
    assert.strictEqual('World', 'world'.charAt(0).toUpperCase() + 'world'.slice(1));
  });
});`,
    deepDiveLabel: "Why do we group tests like this?",
    deepDive: {
      hook: `Imagine you're building a complex application with dozens of features: user profiles, product listings, payment gateways, admin dashboards. Each feature has multiple user interactions and thus, many tests. If you just write tests as standalone scripts or in one giant file, your test codebase quickly becomes unmanageable. Finding a specific test, understanding its context, or running a subset of tests becomes a nightmare. You might have "test1.js", "test2.js", "test_login.js", "test_profile_update.js" all mixed together, making it impossible to tell what belongs to what feature or user journey. This disorganization leads to wasted time, missed bugs, and a general lack of confidence in your testing efforts, as the sheer volume of unorganized tests makes them difficult to maintain or even trust.`,
      pain: `⚠️ **Lesson:** Unstructured tests lead to chaos and inefficiency. Symptom: Difficulty in locating specific tests, understanding their purpose, and managing test execution, resulting in a fragile and untrustworthy test suite.`,
      mentalModel: `**Mental model:** Test suites are like folders in a well-organized filing cabinet. Just as you group related documents (e.g., "Financial Records," "Project Plans") into specific folders, \`describe\` blocks allow you to group related test cases (e.g., "User Authentication," "Product Management") into logical units. This structure makes it easy to find, understand, and manage your tests, ensuring that your test codebase remains maintainable and scalable as your application grows, much like finding a specific document is trivial in a well-indexed filing system.`,
      discover: `\`describe\` is a global function provided by most JavaScript testing frameworks (like Cypress, Jest, Mocha). It defines a test suite, which is a collection of related tests.
\`\`\`typescript
describe('Feature Name or User Journey', () => {
  // All tests related to this feature/journey will be nested here.
  // This block provides a scope for variables and setup/teardown hooks.
});
\`\`\`
- \`describe\`: The function that defines a test suite.
- \`'Feature Name or User Journey'\`: A descriptive string that labels the test suite. This label is crucial for understanding test results in the test runner.
- \`() => { ... }\`: A callback function that contains the actual test cases and any setup/teardown logic specific to this suite.
- **Nesting:** \`describe\` blocks can be nested to create sub-groups for more granular organization, allowing for a highly structured test hierarchy.`,
      quickRules: `**Quick rules:**
- ✅ Use \`describe\` to group tests logically by feature, user flow, or component.
- ✅ Provide a clear, descriptive string for the \`describe\` block that explains its purpose.
- ✅ Nest \`describe\` blocks for finer-grained organization when a feature has multiple sub-flows.
- ✅ Place setup/teardown hooks (like \`beforeEach\`, \`afterEach\`) within the relevant \`describe\` block to apply to its tests.
- ❌ Avoid putting unrelated tests within the same \`describe\` block; keep them focused.
- ❌ Don't use generic or vague names like \`'Tests'\` or \`'My Feature'\` as they offer no context.
- ❌ Never place actual test logic directly inside the \`describe\` block; it belongs in \`it\` or \`test\` blocks.`,
      watchOut: `👀 **Watch out:** While \`describe\` blocks define a scope, variables declared directly inside a \`describe\` block (outside of \`beforeEach\` or \`it\` blocks) are evaluated once when the test file is loaded, not before each individual test. If you need fresh state for each test, ensure you initialize variables within a \`beforeEach\` hook or directly inside the \`it\` block.`,
      dryRun: `🔁 **Think:** When the test runner encounters \`describe('User Authentication Flow', () => { ... });\`, it first registers this as a test suite. It doesn't execute the inner logic immediately, but rather parses the structure to build a hierarchical tree of test suites. For example, if you had \`describe('User Auth', () => { describe('Login', () => { ... }); describe('Logout', () => { ... }); });\`, the runner would recognize a top-level suite 'User Auth' with two child suites 'Login' and 'Logout'. This structural information is then used to display tests in the test runner's UI and to determine how tests will be executed. (Hint: The \`describe\` block is primarily for organization and scope definition, not for direct test execution.)`,
      build: `**Learning focus:** Define the top-level structure for our end-to-end test suite using a \`describe\` block.`,
    },
  },
  {
    id: "step2",
    type: "question",
    phase: "Step 2 of 7",
    paal: "Within our test suite, we need to define individual test cases. Each test case should focus on a specific scenario or user action, making it easy to understand what's being verified.",
    hint: "Similar to `describe` for suites, there's a specific keyword for individual tests. It often sounds like 'it does this' or 'this test verifies'.",
    example_code: `describe('User Authentication Flow', () => {
  it('should allow a user to log in successfully', () => {
    // Test steps will go here
  });
});`,
    think_prompt: "How do you define a single, specific test case within the `describe` block?",
    mc_options: [
      "test('should allow a user to log in successfully', () => { /* ... */ });",
      "it('should allow a user to log in successfully', () => { /* ... */ });",
      "case('should allow a user to log in successfully', () => { /* ... */ });",
    ],
    mc_correct_option: "it('should allow a user to log in successfully', () => { /* ... */ });",
    mc_anchor: "it",
    why_this_matters: "Each `it` block represents an atomic test scenario. This isolation ensures that if a test fails, you know exactly which specific behavior is broken, simplifying debugging.",
    answer_keywords: ["it", "test case", "scenario"],
    seed_code: `describe('User Authentication Flow', () => {
  // Individual test cases will go here
});`,
    starter_code: `describe('User Authentication Flow', () => {
  // Now, define a specific test case for successful login.
  // Use 'it' to describe an individual test.
});`,
    feedback_correct: "Correct! The `it` block (or `test` in some frameworks) is used to define a single, focused test case within a suite.",
    feedback_partial: "You're close, but `it` is the more common and idiomatic keyword for defining individual test cases in many E2E frameworks.",
    feedback_wrong: "`case` is not the correct keyword. `it` is used to define a specific test scenario.",
    expected: `describe('User Authentication Flow', () => {
  it('should allow a user to log in successfully', () => {
    // Test steps will go here
  });
});`,
    analog_example: `// Analog Example: Defining individual unit tests for a string utility
import { strict as assert } from 'node:assert';

describe('String Utility Functions', () => {
  it('should correctly reverse a string', () => {
    const original = 'hello';
    const reversed = original.split('').reverse().join('');
    assert.strictEqual(reversed, 'olleh');
  });

  it('should correctly capitalize the first letter', () => {
    const word = 'world';
    const capitalized = word.charAt(0).toUpperCase() + word.slice(1);
    assert.strictEqual(capitalized, 'World');
  });
});`,
    deepDiveLabel: "What's the difference between `describe` and `it`?",
    deepDive: {
      hook: `Imagine you're writing a book. You wouldn't just write one long, continuous narrative without chapters or paragraphs. It would be impossible to follow, difficult to reference specific points, and overwhelming to read. Similarly, in testing, if you put all your assertions and actions into one giant block, it becomes a monolithic script. If one small part fails, you might have to wade through hundreds of lines of code to pinpoint the exact issue. This lack of granularity makes debugging a nightmare, slows down development, and makes your tests brittle and hard to maintain, undermining the very purpose of having tests.`,
      pain: `⚠️ **Lesson:** Monolithic tests are hard to debug and maintain. Symptom: A single test failure requires extensive investigation to identify the root cause, and tests become fragile to small changes.`,
      mentalModel: `**Mental model:** If \`describe\` is like a book's chapter, then \`it\` is like a specific paragraph within that chapter. Each paragraph (or \`it\` block) focuses on a single idea or point (a specific test scenario). This clear separation ensures that each test case is atomic and focused. If a paragraph has a grammatical error, you know exactly where to look. Similarly, if an \`it\` block fails, you immediately know which specific behavior or assertion is broken, making debugging efficient and straightforward.`,
      discover: `\`it\` (or \`test\` in some frameworks) is used to define an individual test case. It should describe a single, verifiable behavior or scenario.
\`\`\`typescript
it('should describe a specific behavior', () => {
  // Arrange: Set up the test environment (e.g., visit a page)
  // Act: Perform actions (e.g., type, click)
  // Assert: Verify the outcome (e.g., check UI content, visibility)
});
\`\`\`
- \`it\`: The function that defines a single test.
- \`'should describe a specific behavior'\`: A descriptive string explaining what this particular test case verifies. It's often phrased as "it should do X".
- \`() => { ... }\`: A callback function containing the actual test logic, including setup, actions, and assertions.
- **Isolation:** Each \`it\` block should ideally be isolated, meaning it can run independently without affecting or being affected by other tests.`,
      quickRules: `**Quick rules:**
- ✅ Use \`it\` to define a single, atomic test scenario.
- ✅ Give each \`it\` block a clear, descriptive name that explains its purpose.
- ✅ Keep \`it\` blocks focused on verifying one specific behavior or outcome.
- ✅ Ensure each \`it\` block is independent and can run in isolation.
- ❌ Avoid putting multiple unrelated assertions or complex flows into a single \`it\` block.
- ❌ Don't use vague names like \`'test1'\` or \`'check functionality'\`.
- ❌ Never rely on the order of \`it\` blocks for test success; they should be self-contained.`,
      watchOut: `👀 **Watch out:** Overly long or complex \`it\` blocks defeat the purpose of isolation. If an \`it\` block fails, you want to know immediately what specific behavior broke. If it's testing too many things, debugging becomes harder. Aim for one clear "Arrange, Act, Assert" cycle per \`it\` block.`,
      dryRun: `🔁 **Think:** When the test runner processes \`describe('User Auth', () => { it('should log in', () => { /* ... */ }); it('should log out', () => { /* ... */ }); });\`, it first registers the 'User Auth' suite. Then, it registers two distinct test cases: 'should log in' and 'should log out'. When it comes time to execute, it will run the 'should log in' test completely, then reset the environment (if \`beforeEach\` is used) and run the 'should log out' test. Each \`it\` block is treated as a separate execution unit, and its success or failure is reported individually. (Hint: Each \`it\` block is an independent unit of verification.)`,
      build: `**Learning focus:** Define an individual test case for a successful login within our test suite.`,
    },
  },
  {
    id: "step3",
    type: "question",
    phase: "Step 3 of 7",
    paal: "For an end-to-end test, the first step is usually to navigate the browser to the application's starting page. This simulates a user opening their browser and typing in a URL.",
    hint: "Most browser automation tools have a command that literally means 'go to this URL'. It often starts with `cy.` or `page.`",
    example_code: `describe('User Authentication Flow', () => {
  it('should allow a user to log in successfully', () => {
    cy.visit('/login'); // Navigate to the login page
  });
});`,
    think_prompt: "Which command correctly navigates the browser to the '/login' page?",
    mc_options: [
      "browser.goto('/login');",
      "cy.navigate('/login');",
      "cy.visit('/login');",
    ],
    mc_correct_option: "cy.visit('/login');",
    mc_anchor: "cy.visit",
    why_this_matters: "The `visit` command is fundamental for E2E tests, as it establishes the initial state of the application in the browser, allowing subsequent interactions to occur from a known starting point.",
    answer_keywords: ["visit", "navigation", "URL"],
    seed_code: `describe('User Authentication Flow', () => {
  it('should allow a user to log in successfully', () => {
    // Test steps will go here
  });
});`,
    starter_code: `describe('User Authentication Flow', () => {
  it('should allow a user to log in successfully', () => {
    // Navigate the browser to the login page.
    // Use 'cy.visit()' with the relative path '/login'.
  });
});`,
    feedback_correct: "Exactly! `cy.visit()` is the command used to navigate the browser to a specific URL in our E2E testing environment.",
    feedback_partial: "You're thinking about navigation, but `cy.visit()` is the specific command for this framework.",
    feedback_wrong: "`browser.goto()` is used in some other frameworks, but `cy.visit()` is the correct command here.",
    expected: `describe('User Authentication Flow', () => {
  it('should allow a user to log in successfully', () => {
    cy.visit('/login'); // Navigate to the login page
  });
});`,
    analog_example: `// Analog Example: Fetching data from an API endpoint
import fetch from 'node-fetch';
import { strict as assert } from 'node:assert';

describe('API Data Fetching', () => {
  it('should successfully fetch user data from /api/users/1', async () => {
    const baseUrl = 'https://api.example.com';
    const response = await fetch(\`\${baseUrl}/api/users/1\`);
    const data = await response.json();

    assert.strictEqual(response.status, 200);
    assert.ok(data.id === 1);
    assert.ok(typeof data.name === 'string');
  });
});`,
    deepDiveLabel: "How does `cy.visit()` work behind the scenes?",
    deepDive: {
      hook: `Imagine you're trying to test a web application, but every time you run your test, the browser starts blank. You'd have to manually type the URL, wait for the page to load, and then start your interactions. This manual step is not only tedious but also introduces inconsistencies. What if the page takes longer to load sometimes? What if you mistype the URL? Without a reliable way to get to a known starting point, your tests would be flaky, failing due to setup issues rather than actual application bugs. This fundamental step of navigating to a URL is critical for ensuring your tests always begin from a consistent and expected state.`,
      pain: `⚠️ **Lesson:** Inconsistent test starting points lead to flaky tests. Symptom: Tests fail intermittently due to setup issues (e.g., page not loaded), making it hard to trust test results.`,
      mentalModel: `**Mental model:** \`cy.visit()\` is like a robot hand opening a browser, typing a URL into the address bar, and pressing Enter. It doesn't just load the HTML; it waits for the page to fully render, including JavaScript execution and network requests, until the browser reports that the page is ready. This ensures that when your test proceeds to interact with elements, the page is in a stable and interactive state, just as a human user would expect after navigating to a new URL. It's a robust and patient navigator for your automated browser.`,
      discover: `The \`cy.visit()\` command is used to navigate the browser to a specific URL. It's typically the first command in most E2E tests.
\`\`\`typescript
cy.visit(url: string, options?: Partial<VisitOptions>): Chainable<Window>
\`\`\`
- \`url\`: The URL to visit. This can be an absolute URL (e.g., \`'https://example.com/login'\`) or a relative path (e.g., \`'/login'\`) if a \`baseUrl\` is configured in your testing setup.
- \`options\`: An optional object to configure behavior, such as \`timeout\` or \`headers\`.
- **Automatic Waiting:** \`cy.visit()\` automatically waits for the page to load, including all resources (HTML, CSS, JS, images) and for the \`load\` event to fire. It also waits for any XHR/Fetch requests initiated by the page to complete.
- **Context:** It sets the context for all subsequent commands, meaning all interactions will happen within the loaded page.`,
      quickRules: `**Quick rules:**
- ✅ Always use \`cy.visit()\` as the first interaction in an E2E test to establish a known starting point.
- ✅ Use relative paths for URLs if your testing configuration has a \`baseUrl\` defined.
- ✅ Ensure the URL points to a valid and accessible page within your application.
- ✅ Use \`cy.visit()\` to simulate a user directly navigating to a page.
- ❌ Avoid manually typing URLs into the browser during test execution; always use \`cy.visit()\`.
- ❌ Don't assume the page is immediately interactive after \`cy.visit()\`; trust the command's built-in waiting.
- ❌ Never use \`cy.visit()\` to navigate to external domains unless explicitly testing cross-origin interactions.`,
      watchOut: `👀 **Watch out:** If \`cy.visit()\` fails, it often indicates a problem with your application's server, network configuration, or an incorrect URL. Check your application's logs and ensure the URL is correct and the server is running. Sometimes, a very slow-loading page might require increasing the default timeout for \`cy.visit()\`.`,
      dryRun: `🔁 **Think:** When \`cy.visit('/login')\` is executed, the browser's current URL changes from 'about:blank' to 'http://localhost:3000/login' (assuming a base URL). The browser then initiates a request for the '/login' page. The test runner pauses, waiting for the browser to report that the page has fully loaded, including all scripts and assets. Once the page is stable and interactive, the command resolves, and the test proceeds to the next step. If the page fails to load or returns an error status (e.g., 404, 500), \`cy.visit()\` will fail, halting the test. (Hint: \`cy.visit()\` is more than just a URL change; it's a robust page load and readiness check.)`,
      build: `**Learning focus:** Navigate the browser to the application's login page using the appropriate command.`,
    },
  },
  {
    id: "step4",
    type: "question",
    phase: "Step 4 of 7",
    paal: "After navigating to the login page, the next step is to simulate a user entering their username. This involves selecting the correct input field and then typing text into it.",
    hint: "You'll need two chained commands: one to find the element, and another to perform the typing action. Think about how you select elements in CSS or JavaScript.",
    example_code: `describe('User Authentication Flow', () => {
  it('should allow a user to log in successfully', () => {
    cy.visit('/login');
    cy.get('input[name="username"]').type('testuser'); // Find username input and type
  });
});`,
    think_prompt: "Which command sequence correctly finds an input field by its `name` attribute and types 'testuser' into it?",
    mc_options: [
      "cy.find('input[name=\"username\"]').enter('testuser');",
      "cy.get('input[name=\"username\"]').type('testuser');",
      "cy.select('input[name=\"username\"]').input('testuser');",
    ],
    mc_correct_option: "cy.get('input[name=\"username\"]').type('testuser');",
    mc_anchor: "cy.get().type",
    why_this_matters: "Simulating user input is crucial for testing forms and interactive elements. `cy.get()` provides a powerful way to locate elements, and `.type()` accurately mimics keyboard input.",
    answer_keywords: ["get", "type", "input", "selector"],
    seed_code: `describe('User Authentication Flow', () => {
  it('should allow a user to log in successfully', () => {
    cy.visit('/login'); // Navigate to the login page
  });
});`,
    starter_code: `describe('User Authentication Flow', () => {
  it('should allow a user to log in successfully', () => {
    cy.visit('/login');
    // Find the username input field using its 'name' attribute and type 'testuser' into it.
    // Use 'cy.get()' for selection and '.type()' for input.
  });
});`,
    feedback_correct: "Spot on! `cy.get()` is used for selecting elements, and `.type()` simulates keyboard input, making this the correct sequence.",
    feedback_partial: "You've got the selector right, but `type()` is the command for simulating keyboard input, not `enter()` or `input()`.",
    feedback_wrong: "`cy.find()` and `cy.select()` are not the correct commands for element selection in this context. `cy.get()` is used to find elements, followed by `.type()` for input.",
    expected: `describe('User Authentication Flow', () => {
  it('should allow a user to log in successfully', () => {
    cy.visit('/login'); // Navigate to the login page
    cy.get('input[name="username"]').type('testuser'); // Find username input and type
  });
});`,
    analog_example: `// Analog Example: Interacting with a command-line interface (CLI) program
import { spawn } from 'node:child_process';
import { strict as assert } from 'node:assert';

describe('CLI Calculator Program', () => {
  it('should correctly add two numbers', (done) => {
    const cli = spawn('node', ['calculator.js']); // Assuming calculator.js is a simple CLI
    let output = '';

    cli.stdout.on('data', (data) => {
      output += data.toString();
    });

    cli.stdin.write('add 5 3\\n'); // Simulate typing 'add 5 3' and pressing Enter
    cli.stdin.end();

    cli.on('close', (code) => {
      assert.strictEqual(code, 0);
      assert.ok(output.includes('Result: 8'));
      done();
    });
  });
});`,
    deepDiveLabel: "How do we reliably select elements for interaction?",
    deepDive: {
      hook: `Imagine trying to tell a robot to click a button, but there are five identical buttons on the screen. How does the robot know which one to click? If your tests rely on fragile selectors like "the third button on the page," they will break every time the UI changes slightly. This leads to brittle tests that are constantly failing, not because of application bugs, but because the test itself can no longer find the element it's looking for. This constant maintenance overhead makes E2E testing a burden rather than a benefit, eroding trust in your test suite and slowing down development.`,
      pain: `⚠️ **Lesson:** Fragile element selectors lead to brittle tests. Symptom: Tests frequently break due to minor UI changes, requiring constant maintenance and reducing confidence in the test suite.`,
      mentalModel: `**Mental model:** \`cy.get()\` is like a highly skilled detective searching for a specific person in a crowd. Instead of just saying "find a person," it uses precise clues: "find the person wearing a red hat with a name tag 'John Doe'." In web testing, these clues are CSS selectors (like \`input[name="username"]\`), data attributes (\`[data-test-id="login-button"]\`), or unique IDs. The more specific and resilient your clues, the more reliably the detective (\`cy.get()\`) can find the correct element, even if the crowd (the UI) shifts around. Once the element is found, \`.type()\` is like the detective gently placing a note with specific text into the person's hand.`,
      discover: `\`cy.get()\` is the primary command for selecting DOM elements. It uses CSS selectors, similar to how you'd select elements in CSS or JavaScript's \`document.querySelector()\`. Once an element is selected, you can chain commands like \`.type()\` to interact with it.
\`\`\`typescript
cy.get(selector: string, options?: Partial<GetOptions>): Chainable<JQuery<HTMLElement>>
  .type(text: string, options?: Partial<TypeOptions>): Chainable<JQuery<HTMLElement>>
\`\`\`
- \`cy.get(selector)\`: Finds one or more DOM elements matching the CSS \`selector\`. It automatically waits for the element to exist in the DOM and become visible.
  - **Best practice selectors:** Use \`data-test-id\` attributes, unique IDs, or descriptive class names. Avoid relying on element order or generic tags.
- \`.type(text)\`: Simulates typing \`text\` into the selected input field or text area. It fires keyboard events (keydown, keypress, keyup) just like a real user.
  - **Special characters:** Can type special characters like \`{enter}\` or \`{esc}\`.`,
      quickRules: `**Quick rules:**
- ✅ Use \`cy.get()\` with specific and resilient CSS selectors (e.g., \`[data-test-id="username-input"]\`).
- ✅ Prioritize \`data-test-id\` attributes for element selection as they are less prone to breaking from styling changes.
- ✅ Use \`.type()\` for all text input into fields.
- ✅ Ensure the element you're typing into is an interactive input or textarea.
- ❌ Avoid using fragile selectors like \`div > div > input:nth-child(3)\` which break easily.
- ❌ Don't use \`.type()\` on non-input elements; it won't work as expected.
- ❌ Never rely on an element being immediately available after a page load; \`cy.get()\` handles waiting.`,
      watchOut: `👀 **Watch out:** If \`cy.get()\` fails to find an element, it will time out. This usually means your selector is incorrect, the element hasn't rendered yet, or it's not visible. Double-check your selector against the actual DOM in your browser's developer tools. If the element is dynamically loaded, \`cy.get()\` will wait, but if it never appears, the test will fail.`,
      dryRun: `🔁 **Think:** When \`cy.get('input[name="username"]').type('testuser')\` executes, first \`cy.get()\` scans the DOM for an \`<input>\` element with the \`name="username"\` attribute. If found, it becomes the subject of the next command. Then, \`.type('testuser')\` takes this found input element. The browser's focus shifts to this input, and it simulates typing 't', then 'e', then 's', etc., until 'testuser' is fully entered. The value of the input field visually updates from '' (empty) to 't', then 'te', ..., finally to 'testuser'. (Hint: \`cy.get()\` finds the target, and \`.type()\` changes its content, simulating user interaction.)`,
      build: `**Learning focus:** Select the username input field and type a value into it.`,
    },
  },
  {
    id: "step5",
    type: "question",
    phase: "Step 5 of 7",
    paal: "After entering the username, we need to do the same for the password field. This follows the exact same pattern: select the element, then type the value.",
    hint: "The command sequence is identical to the previous step, just with a different selector and input value.",
    example_code: `describe('User Authentication Flow', () => {
  it('should allow a user to log in successfully', () => {
    cy.visit('/login');
    cy.get('input[name="username"]').type('testuser');
    cy.get('input[name="password"]').type('password123'); // Find password input and type
  });
});`,
    think_prompt: "Which command sequence correctly finds the password input field and types 'password123' into it?",
    mc_options: [
      "cy.get('input[name=\"password\"]').input('password123');",
      "cy.find('input[name=\"password\"]').enter('password123');",
      "cy.get('input[name=\"password\"]').type('password123');",
    ],
    mc_correct_option: "cy.get('input[name=\"password\"]').type('password123');",
    mc_anchor: "cy.get().type",
    why_this_matters: "Repeating patterns for common interactions like input fields reinforces the core commands and demonstrates how to build up complex user flows from simple, reusable steps.",
    answer_keywords: ["get", "type", "password", "input"],
    seed_code: `describe('User Authentication Flow', () => {
  it('should allow a user to log in successfully', () => {
    cy.visit('/login'); // Navigate to the login page
    cy.get('input[name="username"]').type('testuser'); // Find username input and type
  });
});`,
    starter_code: `describe('User Authentication Flow', () => {
  it('should allow a user to log in successfully', () => {
    cy.visit('/login');
    cy.get('input[name="username"]').type('testuser');
    // Now, find the password input field using its 'name' attribute and type 'password123' into it.
    // Use 'cy.get()' for selection and '.type()' for input.
  });
});`,
    feedback_correct: "Perfect! You've correctly applied the `cy.get().type()` pattern to the password field.",
    feedback_partial: "You're on the right track with the selector, but remember to use `.type()` for inputting text.",
    feedback_wrong: "The commands `input()` and `enter()` are incorrect. The pattern is `cy.get()` followed by `.type()`.",
    expected: `describe('User Authentication Flow', () => {
  it('should allow a user to log in successfully', () => {
    cy.visit('/login'); // Navigate to the login page
    cy.get('input[name="username"]').type('testuser'); // Find username input and type
    cy.get('input[name="password"]').type('password123'); // Find password input and type
  });
});`,
    analog_example: `// Analog Example: Sending data to a remote server via an HTTP POST request
import fetch from 'node-fetch';
import { strict as assert } from 'node:assert';

describe('API User Registration', () => {
  it('should successfully register a new user', async () => {
    const baseUrl = 'https://api.example.com';
    const newUser = {
      email: 'newuser@example.com',
      password: 'securepassword',
      name: 'New User'
    };

    const response = await fetch(\`\${baseUrl}/api/register\`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newUser) // Simulate sending user data
    });
    const data = await response.json();

    assert.strictEqual(response.status, 201); // Expect 201 Created
    assert.ok(data.id);
    assert.strictEqual(data.email, newUser.email);
  });
});`,
    deepDiveLabel: "Why is it important to use specific selectors like `name`?",
    deepDive: {
      hook: `Imagine your application's design team decides to change the styling of your login form. They might add new CSS classes, wrap inputs in different \`div\`s, or even reorder elements for better accessibility. If your tests rely on selectors like \`div:nth-child(2) > input\` or \`.form-group > input\`, these seemingly minor UI changes will cause your tests to break. Your tests become coupled to the visual structure rather than the underlying functionality. This fragility means every design tweak leads to test failures, creating a constant cycle of test maintenance that distracts from actual development and erodes confidence in your test suite's ability to catch real bugs.`,
      pain: `⚠️ **Lesson:** Overly generic or structural selectors lead to brittle tests. Symptom: Tests break frequently due to minor UI/CSS changes, requiring constant updates and reducing developer trust.`,
      mentalModel: `**Mental model:** Using specific selectors like \`input[name="password"]\` is like giving each important interactive element a unique, functional label, similar to how you'd label a drawer in a filing cabinet as "Invoices" rather than "the third drawer from the top." Even if the cabinet is moved, or new drawers are added, the "Invoices" drawer remains identifiable by its functional label. This makes your tests resilient to visual or structural changes in the UI, ensuring they continue to find and interact with the correct elements as long as their core purpose (e.g., being the 'password' input) remains the same.`,
      discover: `When selecting elements, it's crucial to use selectors that are resilient to UI changes. Attributes like \`name\`, \`id\`, or custom \`data-test-id\` are generally preferred over structural selectors (like \`nth-child\`) or generic class names.
\`\`\`html
<!-- Example of good selectors -->
<input type="text" id="username-input" name="username" data-test-id="login-username">
<input type="password" name="password" data-test-id="login-password">
<button type="submit" data-test-id="login-button">Log In</button>
\`\`\`
- \`id\`: Unique identifier, highly reliable if guaranteed unique.
- \`name\`: Used for form submission, often unique within a form.
- \`data-test-id\` (or similar): Custom attributes explicitly added for testing purposes, providing the highest resilience as they are decoupled from styling or structure.
- **Why avoid generic selectors?** Selectors like \`div > input\` or \`.some-class\` are prone to breaking if the HTML structure or CSS classes change, even if the element's function remains the same.`,
      quickRules: `**Quick rules:**
- ✅ Prioritize \`data-test-id\` attributes for test selectors whenever possible.
- ✅ Use \`id\` attributes if they are unique and stable.
- ✅ Use \`name\` attributes for form inputs, as they are functionally relevant.
- ✅ Combine attributes for more specific targeting (e.g., \`input[type="password"][name="password"]\`).
- ❌ Avoid using \`nth-child\` or \`nth-of-type\` selectors; they are highly fragile.
- ❌ Don't rely solely on generic HTML tags (e.g., \`input\`) if multiple exist.
- ❌ Never use CSS classes that are primarily for styling, as they are subject to frequent change.`,
      watchOut: `👀 **Watch out:** While \`id\` is great, ensure it's truly unique across your entire application. Duplicate IDs can lead to unpredictable test behavior, as \`cy.get('#my-id')\` will only return the *first* matching element it finds, which might not be the one you intend to interact with.`,
      dryRun: `🔁 **Think:** After \`cy.get('input[name="username"]').type('testuser')\` completes, the username field contains 'testuser'. The next command, \`cy.get('input[name="password"]').type('password123')\`, first finds the password input. The browser's focus then shifts from the username field to the password field. The password field, initially empty, then receives characters 'p', 'a', 's', etc., until it displays 'password123' (often masked by asterisks). The state of the username field remains 'testuser', while the password field transitions from empty to 'password123'. (Hint: Each \`.type()\` command updates the content of a specific input element, building up the form's state.)`,
      build: `**Learning focus:** Select the password input field and type a value into it.`,
    },
  },
  {
    id: "step6",
    type: "question",
    phase: "Step 6 of 7",
    paal: "With both username and password entered, the final step in the login process is to click the 'Log In' button to submit the form.",
    hint: "You'll need to select the button element, then use a command that simulates a mouse click.",
    example_code: `describe('User Authentication Flow', () => {
  it('should allow a user to log in successfully', () => {
    cy.visit('/login');
    cy.get('input[name="username"]').type('testuser');
    cy.get('input[name="password"]').type('password123');
    cy.get('button[type="submit"]').click(); // Find the submit button and click it
  });
});`,
    think_prompt: "Which command sequence correctly finds a submit button and simulates a click?",
    mc_options: [
      "cy.get('button[type=\"submit\"]').press();",
      "cy.get('button[type=\"submit\"]').tap();",
      "cy.get('button[type=\"submit\"]').click();",
    ],
    mc_correct_option: "cy.get('button[type=\"submit\"]').click();",
    mc_anchor: "cy.get().click",
    why_this_matters: "Clicking elements is a fundamental user interaction. This command allows tests to trigger form submissions, navigation, and other interactive behaviors.",
    answer_keywords: ["click", "button", "submit", "interaction"],
    seed_code: `describe('User Authentication Flow', () => {
  it('should allow a user to log in successfully', () => {
    cy.visit('/login'); // Navigate to the login page
    cy.get('input[name="username"]').type('testuser'); // Find username input and type
    cy.get('input[name="password"]').type('password123'); // Find password input and type
  });
});`,
    starter_code: `describe('User Authentication Flow', () => {
  it('should allow a user to log in successfully', () => {
    cy.visit('/login');
    cy.get('input[name="username"]').type('testuser');
    cy.get('input[name="password"]').type('password123');
    // Find the 'Log In' button (e.g., a button with type="submit") and click it.
    // Use 'cy.get()' for selection and '.click()' for interaction.
  });
});`,
    feedback_correct: "That's right! `cy.get().click()` is the standard way to simulate a button click, triggering the form submission.",
    feedback_partial: "You've correctly identified the button, but `click()` is the command to simulate a mouse click.",
    feedback_wrong: "`press()` and `tap()` are not the correct commands. `click()` is used to simulate a mouse click on an element.",
    expected: `describe('User Authentication Flow', () => {
  it('should allow a user to log in successfully', () => {
    cy.visit('/login'); // Navigate to the login page
    cy.get('input[name="username"]').type('testuser'); // Find username input and type
    cy.get('input[name="password"]').type('password123'); // Find password input and type
    cy.get('button[type="submit"]').click(); // Find the submit button and click it
  });
});`,
    analog_example: `// Analog Example: Interacting with a database to update a record
import { Client } from 'pg'; // Assuming 'pg' for PostgreSQL
import { strict as assert } from 'node:assert';

describe('Database User Update', () => {
  let client;

  beforeEach(async () => {
    client = new Client({ connectionString: 'postgresql://user:password@host:port/database' });
    await client.connect();
    // Ensure a user exists for testing
    await client.query('INSERT INTO users (id, name, email) VALUES (1, $1, $2) ON CONFLICT (id) DO UPDATE SET name=$1, email=$2', ['Old Name', 'old@example.com']);
  });

  afterEach(async () => {
    await client.end();
  });

  it('should update a user\'s email address', async () => {
    const userId = 1;
    const newEmail = 'new@example.com';
    await client.query('UPDATE users SET email = $1 WHERE id = $2', [newEmail, userId]); // Simulate updating data

    const result = await client.query('SELECT email FROM users WHERE id = $1', [userId]);
    assert.strictEqual(result.rows[0].email, newEmail);
  });
});`,
    deepDiveLabel: "What happens when `click()` is called?",
    deepDive: {
      hook: `Imagine you've filled out a complex form, but when you try to submit it, nothing happens. Or worse, it submits, but the page doesn't update, leaving you unsure if your action was successful. In automated testing, if your "click" command doesn't properly trigger the underlying events, your tests will pass even when the application is broken. This creates a false sense of security, where tests appear green but critical user interactions are failing in production. A robust click mechanism is essential to accurately simulate user behavior and ensure that all associated events (like form submissions or navigation) are correctly fired and handled.`,
      pain: `⚠️ **Lesson:** Inaccurate click simulation leads to false positive tests. Symptom: Tests pass, but the application's interactive behavior is broken in reality, leading to production bugs.`,
      mentalModel: `**Mental model:** \`cy.get().click()\` is not just a simple mouse click; it's a comprehensive simulation of a user's interaction. It's like a highly trained finger that not only presses down on a button but also checks if the button is visible, enabled, and not covered by other elements. When it clicks, it fires a sequence of browser events (mousedown, mouseup, click) just like a real user would, triggering any associated JavaScript event handlers. It then intelligently waits for the application to react to this click, whether it's a form submission, a navigation, or a UI update, ensuring the test proceeds only when the application has processed the interaction.`,
      discover: `The \`.click()\` command simulates a user clicking on a DOM element. It's a powerful command that handles many complexities automatically.
\`\`\`typescript
cy.get(selector).click(options?: Partial<ClickOptions>): Chainable<JQuery<HTMLElement>>
\`\`\`
- \`cy.get(selector)\`: First, selects the target element (e.g., a button, link, checkbox).
- \`.click()\`: Simulates a click event on the selected element.
  - **Visibility and Interactivity:** Before clicking, it automatically waits for the element to become visible, not disabled, and not covered by another element. If these conditions aren't met, the command will fail.
  - **Event Firing:** It fires a sequence of browser events (\`mousedown\`, \`mouseup\`, \`click\`) at the center of the element, mimicking a real user interaction.
  - **Actionability:** It ensures the element is "actionable" before clicking, preventing clicks on elements that a real user couldn't interact with.
- **Form Submission:** For a \`<button type="submit">\` inside a \`<form>\`, a \`.click()\` will trigger the form's \`submit\` event.`,
      quickRules: `**Quick rules:**
- ✅ Use \`.click()\` for all button presses, link activations, and checkbox/radio selections.
- ✅ Ensure the element targeted by \`.click()\` is visible and enabled.
- ✅ Use specific selectors for buttons (e.g., \`button[type="submit"]\`, \`[data-test-id="login-button"]\`).
- ✅ Understand that \`.click()\` automatically waits for element actionability.
- ❌ Avoid trying to click elements that are hidden, disabled, or covered by overlays.
- ❌ Don't use \`.click()\` on elements that are not designed for user interaction (e.g., a plain \`div\` without event handlers).
- ❌ Never assume a click will immediately lead to a new page; always add assertions for the expected outcome.`,
      watchOut: `👀 **Watch out:** If a click doesn't seem to do anything, check if the element is actually clickable. Sometimes, an overlay might be covering the button, or JavaScript might be preventing the default action. The test runner will usually give a helpful error message if the element is not actionable.`,
      dryRun: `🔁 **Think:** After 'testuser' and 'password123' are typed, \`cy.get('button[type="submit"]').click()\` first locates the submit button. It then verifies the button is visible and enabled. Once confirmed, it simulates a click. This click triggers the form's submission, which typically sends a POST request to the server. The browser then navigates away from '/login' (e.g., to '/dashboard') or updates the current page. The UI state transitions from showing the login form to showing a loading spinner, then to the post-login dashboard or an error message. (Hint: The click triggers a chain of events, often involving network requests and UI changes.)`,
      build: `**Learning focus:** Simulate clicking the login button to submit the authentication form.`,
    },
  },
  {
    id: "step7",
    type: "question",
    phase: "Step 7 of 7",
    paal: "After clicking the login button, we need to verify that the login was successful. This means asserting that the UI has changed to reflect a logged-in state, for example, by displaying a welcome message or navigating to a dashboard.",
    hint: "You'll need to select an element that appears after successful login and assert its visibility or text content. The command for assertions often starts with `.should()`.",
    example_code: `describe('User Authentication Flow', () => {
  it('should allow a user to log in successfully', () => {
    cy.visit('/login');
    cy.get('input[name="username"]').type('testuser');
    cy.get('input[name="password"]').type('password123');
    cy.get('button[type="submit"]').click();

    // Assert that the user is logged in by checking for a welcome message
    cy.get('h1').should('contain.text', 'Welcome, testuser!'); // Assert welcome message
  });
});`,
    think_prompt: "Which command correctly asserts that an `<h1>` element contains the text 'Welcome, testuser!'?",
    mc_options: [
      "cy.get('h1').expect('Welcome, testuser!');",
      "cy.get('h1').assert('contain.text', 'Welcome, testuser!');",
      "cy.get('h1').should('contain.text', 'Welcome, testuser!');",
    ],
    mc_correct_option: "cy.get('h1').should('contain.text', 'Welcome, testuser!');",
    mc_anchor: "cy.get().should",
    why_this_matters: "Assertions are the core of any test. They confirm that the application behaves as expected after user interactions, providing confidence that the feature works correctly.",
    answer_keywords: ["assert", "should", "contain.text", "verification"],
    seed_code: `describe('User Authentication Flow', () => {
  it('should allow a user to log in successfully', () => {
    cy.visit('/login'); // Navigate to the login page
    cy.get('input[name="username"]').type('testuser'); // Find username input and type
    cy.get('input[name="password"]').type('password123'); // Find password input and type
    cy.get('button[type="submit"]').click(); // Find the submit button and click it
  });
});`,
    starter_code: `describe('User Authentication Flow', () => {
  it('should allow a user to log in successfully', () => {
    cy.visit('/login');
    cy.get('input[name="username"]').type('testuser');
    cy.get('input[name="password"]').type('password123');
    cy.get('button[type="submit"]').click();

    // After clicking login, assert that an <h1> element contains the text 'Welcome, testuser!'.
    // Use 'cy.get()' to find the element and '.should()' for the assertion.
  });
});`,
    feedback_correct: "Fantastic! `cy.get().should('contain.text', ...)` is the correct and robust way to assert text content after an action.",
    feedback_partial: "You're on the right track with the assertion, but `should()` is the command used for making assertions on elements.",
    feedback_wrong: "`expect()` and `assert()` are not the correct commands for making assertions on elements in this framework. `should()` is used for this purpose.",
    expected: `describe('User Authentication Flow', () => {
  it('should allow a user to log in successfully', () => {
    cy.visit('/login'); // Navigate to the login page
    cy.get('input[name="username"]').type('testuser'); // Find username input and type
    cy.get('input[name="password"]').type('password123'); // Find password input and type
    cy.get('button[type="submit"]').click(); // Find the submit button and click it

    // Assert that the user is logged in by checking for a welcome message
    cy.get('h1').should('contain.text', 'Welcome, testuser!'); // Assert welcome message
  });
});`,
    analog_example: `// Analog Example: Asserting the content of a generated file
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { strict as assert } from 'node:assert';

describe('File Generation Utility', () => {
  const outputDir = join(__dirname, 'output_files');
  const reportFilePath = join(outputDir, 'report.txt');

  // Assume a function 'generateReport(reportFilePath)' exists and is called before this test

  it('should generate a report file with expected content', async () => {
    const fileContent = await readFile(reportFilePath, 'utf-8');
    assert.ok(fileContent.includes('Report Generated:'));
    assert.ok(fileContent.includes('Total Items: 100'));
    assert.ok(fileContent.includes('Status: Completed'));
  });
});`,
    deepDiveLabel: "How do assertions make tests reliable?",
    deepDive: {
      hook: `Imagine you've built a complex machine, and you've pressed the "start" button. The machine whirs, lights flash, and sounds play. But how do you *know* it actually performed its intended function? Without a way to verify the outcome, you're just observing activity without confirming success. In E2E testing, if you perform actions (like clicking login) but don't verify the expected UI changes, your test might pass even if the login failed silently or redirected to the wrong page. This lack of verification means your tests are merely "doing" without "checking," leading to a dangerous situation where broken features appear to be working, only to be discovered by real users in production.`,
      pain: `⚠️ **Lesson:** Missing or weak assertions lead to unreliable tests. Symptom: Tests pass even when the application is broken, creating a false sense of security and allowing bugs to reach production.`,
      mentalModel: `**Mental model:** Assertions are like the quality control inspector on an assembly line. After each step of the process (an action like clicking a button), the inspector (\`.should()\`) meticulously checks if the product (the UI state) meets the exact specifications (e.g., "contains 'Welcome' text," "is visible"). If the product doesn't meet the standard, the inspector immediately stops the line and flags the defect. This rigorous checking at every critical juncture ensures that the final product (the user journey) is flawless, providing confidence that the application is behaving exactly as intended.`,
      discover: `Assertions are the backbone of any test. They verify that the application's state or UI matches expectations after an action. The \`.should()\` command is used to make assertions on the subject yielded by the previous command.
\`\`\`typescript
cy.get(selector).should(chainers: string, value?: any, options?: Partial<Timeoutable>): Chainable<JQuery<HTMLElement>>
\`\`\`
- \`cy.get(selector)\`: Selects the element you want to assert against.
- \`.should(chainer, value)\`: Makes an assertion.
  - \`chainer\`: A string representing the assertion (e.g., \`'be.visible'\`, \`'have.text'\`, \`'contain.text'\`, \`'not.exist'\`).
  - \`value\`: An optional value to compare against (e.g., the expected text).
- **Automatic Retries:** \`.should()\` commands automatically retry until the assertion passes or the command times out. This is crucial for E2E tests, as UI changes might not be instantaneous.
- **Common Assertions:**
  - \`should('be.visible')\`: Asserts the element is visible.
  - \`should('not.exist')\`: Asserts the element is not in the DOM.
  - \`should('have.class', 'active')\`: Asserts the element has a specific class.`,
      quickRules: `**Quick rules:**
- ✅ Always include assertions after critical user actions to verify the expected outcome.
- ✅ Use \`.should()\` for all UI-related assertions, leveraging its automatic retry mechanism.
- ✅ Assert specific, verifiable changes in the UI (e.g., text content, visibility, URL changes).
- ✅ Write assertions that are clear and directly relate to the user's expected experience.
- ❌ Avoid making assumptions about the UI state without an explicit assertion.
- ❌ Don't use overly broad assertions that might pass even if something is subtly wrong.
- ❌ Never rely on \`cy.wait()\` as a primary assertion mechanism; use \`.should()\` for explicit verification.`,
      watchOut: `👀 **Watch out:** If an assertion fails, it means the application did not reach the expected state. This is a real bug! Don't just remove the assertion. Investigate why the UI didn't update as expected. Also, be mindful of race conditions: if your application is very slow, an assertion might time out. Consider increasing the timeout for specific assertions if necessary, but first, try to optimize your application's performance.`,
      dryRun: `🔁 **Think:** After \`cy.get('button[type="submit"]').click()\` is executed, the browser navigates to a new page or updates the current one. The UI initially shows a login form, then potentially a loading state, and finally the dashboard. When \`cy.get('h1').should('contain.text', 'Welcome, testuser!')\` runs, \`cy.get('h1')\` first tries to find an \`<h1>\` element. If found, \`.should('contain.text', ...)\` then checks its text content. If the \`<h1>\` element's text is 'Welcome, testuser!', the assertion passes. If the \`<h1>\` element is not found, or its text is 'Login Failed' or 'Dashboard', the assertion fails, and the test stops. The UI state transitions from a login form to a dashboard with a specific welcome message. (Hint: The assertion verifies the final, stable state of the UI after all actions and network requests have completed.)`,
      build: `**Learning focus:** Add an assertion to verify that the user is successfully logged in by checking for a specific welcome message.`,
    },
  },
];

const sideItems = [
  { label: "Lesson", id: "intro" },
  { label: "Objectives", id: "objectives" },
  { label: "Step 1: Suite Structure", id: "step1" },
  { label: "Step 2: Test Case", id: "step2" },
  { label: "Step 3: Navigation", id: "step3" },
  { label: "Step 4: Type Username", id: "step4" },
  { label: "Step 5: Type Password", id: "step5" },
  { label: "Step 6: Click Login", id: "step6" },
  { label: "Step 7: Assert Success", id: "step7" },
];

export default createINPACTEngine({
  NODES,
  sideItems,
  lessonNum: 0,
  title: "Automating User Journeys with End-to-End Tests",
  shortName: "E2E UI Testing",
});
