import createINPACTEngine from "../inpact_engine_shared";

export const NODES = [
  {
    id: "intro",
    type: "reveal",
    phase: "Lesson",
    content: {
      tag: "role-based-api-access",
      title: "Securing API Endpoints with Role-Based Access",
      body: `When building applications, not all users should have the same level of access to data or functionality. A common problem is ensuring that sensitive operations, like deleting user accounts or modifying critical system settings, are only accessible to authorized personnel, while regular users can only interact with their own data or perform actions relevant to their permissions. Without a structured approach, developers might end up scattering permission checks throughout their code, leading to a brittle, hard-to-maintain system prone to security vulnerabilities. Role-based access control (RBAC) provides a robust solution by centralizing these checks, ensuring that access decisions are made consistently and securely at the entry point of your API.

This pattern is fundamental to almost any multi-user application. You'll encounter it when designing a settings panel where only administrators can change global configurations, in a content management system where editors can publish articles but regular users can only read them, or in a financial application where different roles have varying levels of access to transaction data. By understanding and implementing RBAC, you gain the ability to create secure, scalable, and maintainable systems where every user interacts with the application according to their defined permissions, preventing unauthorized actions and protecting sensitive information.`,
      usecase: "Designing a user profile service where users can view their own profile, but only administrators can manage all user accounts.",
    },
  },
  {
    id: "objectives",
    type: "objectives",
    phase: "Objectives",
    items: [
      "Understand the purpose of role-based access control (RBAC) in APIs.",
      "Define user roles and associate them with specific permissions.",
      "Implement middleware to authenticate users and extract their roles.",
      "Create authorization middleware to restrict API access based on user roles.",
      "Apply authorization middleware to specific API routes to secure them.",
    ],
  },
  {
    id: "step1",
    type: "question",
    phase: "Step 1 of 7",
    paal: "To begin, we need to set up a basic Express application and import the necessary module. This forms the foundation for our API.",
    hint: "Start by importing the 'express' module and initializing an Express app instance.",
    example_code: `import express from 'express';
const app = express();`,
    think_prompt: "Which code snippet correctly imports the 'express' module and initializes an Express application?",
    mc_options: [
      "const express = require('express'); const app = express();",
      "import express from 'express'; const app = express();",
      "import { Express } from 'express'; const app = new Express();",
    ],
    mc_correct_option: "import express from 'express'; const app = express();",
    mc_anchor: "import-express-app",
    why_this_matters: "The `express` module is the core of our API server. Initializing an `app` instance is the first step to defining routes and middleware.",
    answer_keywords: ["import", "express", "app", "initialize"],
    seed_code: ``,
    starter_code: `// TODO: Import express and initialize the app
`,
    feedback_correct: "Excellent! Importing 'express' and creating an app instance is the standard way to start an Express server.",
    feedback_partial: "You're close! While `require` works, modern Node.js development often uses `import` for modules. Ensure you're initializing the app correctly after importing.",
    feedback_wrong: "That's not quite right. Remember to use `import` for modules in modern JavaScript and correctly call `express()` to create an application instance.",
    expected: `import express from 'express';
const app = express();`,
    analog_example: `// Python: Basic Flask application setup
from flask import Flask
app = Flask(__name__)`,
    deepDiveLabel: "Why 'import express' vs 'require'?",
    deepDive: {
      hook: `Imagine you're building a complex machine, and you need specific tools for different tasks. In older workshops, you might have had to manually fetch each tool from a central toolbox every time you needed it, explicitly stating 'I require this wrench, I require that screwdriver.' This is analogous to the 'require()' syntax in JavaScript. It works, it gets the job done, but as your workshop grows and your tools become more specialized, managing these individual fetches can become cumbersome. You might forget which tool you've already fetched, or accidentally fetch the same one multiple times. This can lead to less organized code and potential conflicts in larger projects, especially when dealing with modules that have their own dependencies. The traditional 'require' approach, while foundational, doesn't offer the same level of static analysis and modularity benefits that modern JavaScript environments now support.`,
      pain: `⚠️ **Lesson:** Using older module loading mechanisms like 'require()' can lead to less optimized bundle sizes, prevent static analysis tools from effectively identifying unused dependencies, and make it harder to manage module interdependencies in large-scale projects. Symptom: Your development environment might not provide helpful autocompletion or error checking for modules until runtime, making refactoring more challenging.`,
      mentalModel: `**Mental model:** The Modern Library Card. Instead of manually fetching each book (module) from the shelves (file system) with a 'require' slip, you now have a modern library card system ('import'). When you 'import' a book, the system automatically checks if it's available, resolves any dependencies it might have, and makes it ready for you to use. This system is more efficient, helps prevent errors before you even start reading, and allows the library to optimize how books are stored and retrieved. It's a declarative way of stating your dependencies upfront.`,
      discover: `**Pattern - ES Module Imports:**
\`\`\`typescript
// CommonJS (older Node.js)
// const express = require('express');

// ES Modules (modern JavaScript/TypeScript)
import express from 'express';
\`\`\`
-   \`import express from 'express';\` is the modern syntax for importing modules in JavaScript and TypeScript.
-   It's part of the ECMAScript Modules (ESM) standard, offering benefits like static analysis and better tree-shaking.
-   For Node.js, you typically need to configure your \`package.json\` with \`"type": "module"\` or use \`.mjs\` file extensions to enable ESM.
-   This syntax allows for cleaner, more explicit dependency management compared to \`require()\`.`,
      quickRules: `**Quick rules:**
-   ✅ Use \`import ... from 'module';\` for new projects and modern JavaScript.
-   ✅ Configure \`"type": "module"\` in \`package.json\` for ESM in Node.js.
-   ✅ Benefit from static analysis and better tooling support with ESM.
-   ✅ Use named imports like \`import { specificFunction } from 'module';\` for specific exports.
-   ❌ Avoid mixing \`import\` and \`require()\` in the same file if possible, as it can lead to confusion.
-   ❌ Don't forget to transpile ESM if targeting environments that don't fully support it (though modern Node.js does).
-   ❌ Don't use \`require()\` for modules that are exclusively designed for ESM.`,
      watchOut: `👀 **Watch out:** When working with Node.js, ensure your project is configured to use ES Modules if you're using the \`import\` syntax. If you encounter errors like "SyntaxError: Cannot use import statement outside a module", it means Node.js is trying to interpret your file as CommonJS. The fix is usually adding \`"type": "module"\` to your \`package.json\` file or renaming your file to \`.mjs\`.`,
      dryRun: `🔁 **Think:** A Node.js application starts. It encounters 'import express from 'express';'. The module loader looks for the 'express' package in 'node_modules'. Once found, the default export of 'express' (which is a function) is assigned to the 'express' variable. Then, 'const app = express();' is executed. The 'express' function is called, returning an Express application instance, which is assigned to 'app'. This 'app' instance is now ready to have routes and middleware defined on it. (Hint: What does the 'express()' function return?)`,
      build: "**Learning focus:** Establish the foundational Express application setup by correctly importing the `express` module and initializing an `app` instance.",
    },
  },
  {
    id: "step2",
    type: "question",
    phase: "Step 2 of 7",
    paal: "Next, we need to define the structure for our user data, including their roles. This will allow us to assign different permissions.",
    hint: "Create a TypeScript `interface` for `User` with `id`, `username`, and `role` properties. Also, define a `Role` `enum` with `ADMIN` and `USER` values.",
    example_code: `enum Role {
  ADMIN = 'admin',
  USER = 'user',
}

interface User {
  id: string;
  username: string;
  role: Role;
}`,
    think_prompt: "Which code snippet correctly defines a `Role` enum and a `User` interface with `id`, `username`, and `role`?",
    mc_options: [
      `type Role = 'admin' | 'user'; interface User { id: string; username: string; role: Role; }`,
      `enum Role { ADMIN, USER }; interface User { id: string; username: string; role: Role; }`,
      `enum Role { ADMIN = 'admin', USER = 'user', }; interface User { id: string; username: string; role: Role; }`,
    ],
    mc_correct_option: `enum Role { ADMIN = 'admin', USER = 'user', }; interface User { id: string; username: string; role: Role; }`,
    mc_anchor: "define-user-role-types",
    why_this_matters: "Clearly defining `User` and `Role` types ensures type safety and makes our authorization logic robust and easier to understand.",
    answer_keywords: ["enum", "interface", "Role", "User", "types"],
    seed_code: `import express from 'express';
const app = express();`,
    starter_code: `import express from 'express';
const app = express();

// TODO: Define Role enum and User interface
`,
    feedback_correct: "Perfect! Defining your roles as an enum and your user structure with an interface provides strong typing and clarity.",
    feedback_partial: "You've defined the interface correctly, but check the `Role` definition. Using string literal values for enum members is a good practice for clarity and debugging.",
    feedback_wrong: "Not quite. Remember to use `enum` for `Role` to create a distinct type with specific named values, and `interface` for `User` to describe its shape.",
    expected: `import express from 'express';
const app = express();

enum Role {
  ADMIN = 'admin',
  USER = 'user',
}

interface User {
  id: string;
  username: string;
  role: Role;
}`,
    analog_example: `// C#: Defining user roles and a user class
public enum UserRole
{
    Administrator,
    StandardUser
}

public class ApplicationUser
{
    public int Id { get; set; }
    public string Username { get; set; }
    public UserRole Role { get; set; }
}`,
    deepDiveLabel: "Why use enums for roles?",
    deepDive: {
      hook: `Imagine you're managing a team, and you need to assign specific job titles: 'Manager', 'Developer', 'Designer'. If you just write these titles as plain strings everywhere in your code ('"Manager"', '"Developer"'), it's very easy to introduce typos ('"Manger"', '"Develper"'). A single typo can lead to a user not having the correct permissions, causing frustrating bugs or even security vulnerabilities. Furthermore, if you decide to change a job title later (e.g., 'Developer' becomes 'Software Engineer'), you'd have to find and replace every instance of that string throughout your entire codebase, which is a tedious and error-prone task. This lack of centralized control over a fixed set of values is a common source of bugs and maintenance headaches in applications that rely on distinct categories.`,
      pain: `⚠️ **Lesson:** Using raw string literals for categorical data like roles can lead to runtime errors due to typos, make refactoring difficult, and reduce code readability. Symptom: Debugging issues where a user's role isn't recognized, only to find a subtle spelling mistake in a comparison.`,
      mentalModel: `**Mental model:** The Pre-Printed Badge System. Instead of writing someone's job title on a sticky note every time they enter a restricted area, you give them a pre-printed, official badge with their role clearly stated (e.g., "ADMINISTRATOR"). There are only a few types of badges available, and everyone knows exactly what each badge means. If a role name changes, you just update the template for the badge, and all new badges reflect the change. This system ensures consistency, prevents misspellings, and makes it clear what roles exist and what they represent.`,
      discover: `**Pattern - String Enums:**
\`\`\`typescript
enum Role {
  ADMIN = 'admin',
  USER = 'user',
  GUEST = 'guest', // Easily add new roles
}

const currentUserRole: Role = Role.ADMIN; // Type-safe assignment

if (currentUserRole === Role.ADMIN) {
  // ...
}
\`\`\`
-   **Type Safety:** Enums provide a compile-time check, preventing assignment of invalid string values.
-   **Readability:** Using \`Role.ADMIN\` is more descriptive and less error-prone than \`"admin"\`.
-   **Refactoring:** If a role's underlying string value needs to change, you only update it in one place (the enum definition).
-   **Autocompletion:** IDEs can suggest available enum members, improving developer experience.`,
      quickRules: `**Quick rules:**
-   ✅ Use enums for a fixed set of related values (e.g., roles, statuses, directions).
-   ✅ Prefer string enums (\`ADMIN = 'admin'\`) for better debugging and serialization.
-   ✅ Leverage enums for type safety and compile-time validation.
-   ✅ Centralize your categorical definitions in one place for easy maintenance.
-   ❌ Avoid using enums for values that are truly dynamic or unbounded.
-   ❌ Don't use enums if a simple string literal type (\`type Status = 'active' | 'inactive';\`) is sufficient and you don't need the extra enum features.
-   ❌ Don't rely on enum numeric values if the order might change, as this can break existing code.`,
      watchOut: `👀 **Watch out:** While string enums are generally preferred, be aware that they add a small amount of runtime overhead compared to simple string literal types. For very performance-critical scenarios or extremely simple sets of values, a union type of string literals might be marginally more efficient, but for roles, enums are typically the better choice for maintainability and safety.`,
      dryRun: `🔁 **Think:** A variable \`userRole\` is declared with type \`Role\`. When \`userRole\` is assigned \`Role.ADMIN\`, TypeScript checks if \`Role.ADMIN\` is a valid member of the \`Role\` enum. It is, so the assignment is successful, and \`userRole\` internally holds the string value 'admin'. If an attempt was made to assign \`userRole = 'super_admin'\`, TypeScript would issue a compile-time error because 'super_admin' is not a defined member of the \`Role\` enum. (Hint: What is the actual value stored when \`Role.USER\` is assigned?)`,
      build: "**Learning focus:** Define `Role` as a string enum and `User` as an interface to establish clear, type-safe data structures for user permissions.",
    },
  },
  {
    id: "step3",
    type: "question",
    phase: "Step 3 of 7",
    paal: "We need a way to simulate user authentication and store some mock user data. This will allow our middleware to identify who is making a request.",
    hint: "Create a mock `users` array of type `User[]` and a placeholder `authenticateToken` middleware function that sets `req.user`.",
    example_code: `// Mock user data
const users: User[] = [
  { id: '1', username: 'alice', role: Role.ADMIN },
  { id: '2', username: 'bob', role: Role.USER },
];

// Mock authentication middleware
// In a real app, this would verify a JWT or session token
const authenticateToken = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const userId = req.headers['x-user-id'] as string; // Simulate user ID from header
  const user = users.find(u => u.id === userId);

  if (!user) {
    return res.status(401).send('Authentication required.');
  }

  // Attach user to request for later use by authorization middleware
  (req as any).user = user; // Type assertion for simplicity in example
  next();
};`,
    think_prompt: "Which code snippet correctly defines a mock `users` array and a basic `authenticateToken` middleware that attaches a `user` object to the request?",
    mc_options: [
      `const users: User[] = []; const authenticateToken = (req, res, next) => { req.user = users[0]; next(); };`,
      `const users: User[] = [{ id: '1', username: 'alice', role: Role.ADMIN }]; const authenticateToken = (req: express.Request, res: express.Response, next: express.NextFunction) => { const userId = req.headers['x-user-id'] as string; const user = users.find(u => u.id === userId); if (!user) return res.status(401).send('Auth required.'); (req as any).user = user; next(); };`,
      `const users = [{ id: '1', username: 'alice', role: 'admin' }]; const authenticateToken = (req, res, next) => { req.user = users[0]; next(); };`,
    ],
    mc_correct_option: `const users: User[] = [{ id: '1', username: 'alice', role: Role.ADMIN }]; const authenticateToken = (req: express.Request, res: express.Response, next: express.NextFunction) => { const userId = req.headers['x-user-id'] as string; const user = users.find(u => u.id === userId); if (!user) return res.status(401).send('Auth required.'); (req as any).user = user; next(); };`,
    mc_anchor: "mock-auth-middleware",
    why_this_matters: "Authentication is the first line of defense. This mock middleware simulates a real authentication process, allowing us to attach user identity and roles to the request for subsequent authorization checks.",
    answer_keywords: ["mock", "users", "authenticateToken", "middleware", "req.user"],
    seed_code: `import express from 'express';
const app = express();

enum Role {
  ADMIN = 'admin',
  USER = 'user',
}

interface User {
  id: string;
  username: string;
  role: Role;
}`,
    starter_code: `import express from 'express';
const app = express();

enum Role {
  ADMIN = 'admin',
  USER = 'user',
}

interface User {
  id: string;
  username: string;
  role: Role;
}

// TODO: Add mock user data and authentication middleware
`,
    feedback_correct: "Excellent! This mock setup provides a realistic way to test authentication and pass user data through the request pipeline.",
    feedback_partial: "You've got the `users` array, but the `authenticateToken` middleware needs to correctly find a user based on a simulated ID and attach that user to `req.user` before calling `next()`.",
    feedback_wrong: "Remember that middleware functions take `req`, `res`, and `next` as arguments. The authentication middleware's job is to identify the user and attach their data to the request object, or send an error if authentication fails.",
    expected: `import express from 'express';
const app = express();

enum Role {
  ADMIN = 'admin',
  USER = 'user',
}

interface User {
  id: string;
  username: string;
  role: Role;
}

// Mock user data
const users: User[] = [
  { id: '1', username: 'alice', role: Role.ADMIN },
  { id: '2', username: 'bob', role: Role.USER },
];

// Mock authentication middleware
// In a real app, this would verify a JWT or session token
const authenticateToken = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const userId = req.headers['x-user-id'] as string; // Simulate user ID from header
  const user = users.find(u => u.id === userId);

  if (!user) {
    return res.status(401).send('Authentication required.');
  }

  // Attach user to request for later use by authorization middleware
  (req as any).user = user; // Type assertion for simplicity in example
  next();
};`,
    analog_example: `// PHP: Basic authentication check for a web page
<?php
session_start();

function authenticateUser() {
    if (!isset($_SESSION['user_id'])) {
        header('Location: /login.php');
        exit();
    }
    // In a real app, fetch user details from DB
    $_REQUEST['user'] = ['id' => $_SESSION['user_id'], 'role' => $_SESSION['user_role']];
}

// Usage before rendering a protected page:
// authenticateUser();
// $currentUser = $_REQUEST['user'];
?>`,
    deepDiveLabel: "How does Express middleware work?",
    deepDive: {
      hook: `Imagine a factory assembly line. Each station on the line performs a specific task: one station checks the quality of incoming materials, another adds a component, a third paints the product, and so on. If any station finds a problem, it can stop the line and send the product back for rework. In web development, when a request hits your server, it's like a product entering this assembly line. Without middleware, every single route handler would have to perform all these checks and transformations itself: parse the body, check authentication, validate input, handle errors. This leads to massive duplication of code, makes your route handlers bloated, and makes it incredibly difficult to introduce new cross-cutting concerns or change existing ones without touching every single route.`,
      pain: `⚠️ **Lesson:** Without middleware, common tasks like authentication, logging, and data parsing must be duplicated in every route handler, leading to code repetition, increased maintenance burden, and higher risk of inconsistencies or security flaws. Symptom: Your route handlers become long and complex, mixing business logic with infrastructure concerns.`,
      mentalModel: `**Mental model:** The Security Checkpoint and Processing Stations. Before you can enter a secure area (your route handler), you must pass through several checkpoints (middleware). First, a guard checks your ID (authentication middleware). If your ID is valid, you proceed. Then, another station might scan your bag (body parsing middleware). Only after passing all necessary checkpoints do you reach your final destination. Each checkpoint has a specific job, and if you fail at any point, you're stopped and redirected. This modular approach keeps concerns separated and ensures a consistent flow for all requests.`,
      discover: `**Pattern - Express Middleware:**
\`\`\`typescript
// Middleware function signature
const myMiddleware = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  // 1. Perform operations (e.g., logging, authentication, data modification)
  console.log('Request received:', req.method, req.url);

  // 2. Optionally modify the request or response objects
  (req as any).timestamp = new Date();

  // 3. Decide whether to pass control to the next middleware/route handler
  //    - Call next() to proceed
  //    - Send a response (e.g., res.status(401).send()) to terminate the request
  next();
};

// Applying middleware globally
app.use(myMiddleware);

// Applying middleware to a specific route
app.get('/protected', myMiddleware, (req, res) => {
  res.send('This route was protected!');
});
\`\`\`
-   Middleware functions have access to the \`req\` (request), \`res\` (response), and \`next\` (next middleware in the stack) objects.
-   They can execute any code, make changes to the request and response objects, and end the request-response cycle.
-   Calling \`next()\` passes control to the next middleware function or route handler in the stack.
-   If a middleware function sends a response (e.g., \`res.send()\`), it should not call \`next()\`, as this terminates the cycle.`,
      quickRules: `**Quick rules:**
-   ✅ Use middleware for cross-cutting concerns like authentication, logging, and error handling.
-   ✅ Always call \`next()\` to pass control, unless you are terminating the request-response cycle.
-   ✅ Attach data to the \`req\` object (e.g., \`req.user\`) for subsequent middleware or route handlers.
-   ✅ Order your middleware logically (e.g., authentication before authorization).
-   ❌ Don't forget to call \`next()\` if the middleware is not meant to terminate the request.
-   ❌ Avoid putting core business logic inside generic middleware; keep it focused on infrastructure concerns.
-   ❌ Don't send multiple responses for a single request (e.g., \`res.send()\` and then \`next()\`).`,
      watchOut: `👀 **Watch out:** The order in which you apply middleware matters significantly. Middleware functions are executed sequentially. If you place an authorization middleware before an authentication middleware, the authorization middleware won't have the user's identity available on \`req.user\`, leading to errors or incorrect access decisions. Always ensure authentication happens before authorization.`,
      dryRun: `🔁 **Think:** A request arrives at the server with \`x-user-id: '1'\`. The \`authenticateToken\` middleware is invoked. It extracts '1' from the header. It searches the \`users\` array and finds the user \`{ id: '1', username: 'alice', role: Role.ADMIN }\`. Since a user is found, \`req.user\` is set to this user object. Finally, \`next()\` is called, passing control to the next middleware or route handler, which now has access to \`req.user\`. If \`x-user-id\` was '99', no user would be found, and the middleware would send a 401 response, terminating the request. (Hint: What happens if \`x-user-id\` is missing?)`,
      build: "**Learning focus:** Implement mock user data and an authentication middleware to simulate user identification and attach user information to the request object.",
    },
  },
  {
    id: "step4",
    type: "question",
    phase: "Step 4 of 7",
    paal: "Now we'll create the core authorization middleware. This function will check if the authenticated user has one of the required roles to access a specific route.",
    hint: "Define a `authorizeRole` function that takes an array of `Role`s and returns an Express middleware function. Inside, check `req.user.role` against the required roles.",
    example_code: `// Authorization middleware factory
const authorizeRole = (requiredRoles: Role[]) => {
  return (req: express.Request, res: express.Response, next: express.NextFunction) => {
    // Ensure user is authenticated first
    if (!(req as any).user) {
      return res.status(403).send('Access denied: No user information.');
    }

    const userRole = (req as any).user.role;

    if (!requiredRoles.includes(userRole)) {
      return res.status(403).send('Access denied: Insufficient role.');
    }

    next(); // User has the required role, proceed
  };
};`,
    think_prompt: "Which code snippet correctly implements the `authorizeRole` middleware factory, checking if `req.user.role` is among the `requiredRoles`?",
    mc_options: [
      `const authorizeRole = (roles: Role[]) => (req, res, next) => { if (roles.includes(req.user.role)) next(); else res.status(403).send('Denied'); };`,
      `const authorizeRole = (requiredRoles: Role[]) => { return (req: express.Request, res: express.Response, next: express.NextFunction) => { if (!(req as any).user) return res.status(403).send('No user.'); const userRole = (req as any).user.role; if (!requiredRoles.includes(userRole)) return res.status(403).send('Denied.'); next(); }; };`,
      `const authorizeRole = (requiredRoles: string[]) => (req, res, next) => { if (requiredRoles.includes(req.user.role)) next(); else res.status(401).send('Unauthorized'); };`,
    ],
    mc_correct_option: `const authorizeRole = (requiredRoles: Role[]) => { return (req: express.Request, res: express.Response, next: express.NextFunction) => { if (!(req as any).user) return res.status(403).send('No user.'); const userRole = (req as any).user.role; if (!requiredRoles.includes(userRole)) return res.status(403).send('Denied.'); next(); }; };`,
    mc_anchor: "authorization-middleware",
    why_this_matters: "This authorization middleware is the gatekeeper. It enforces role-based access control, preventing unauthorized users from reaching sensitive API endpoints.",
    answer_keywords: ["authorizeRole", "middleware", "roles", "access control", "403"],
    seed_code: `import express from 'express';
const app = express();

enum Role {
  ADMIN = 'admin',
  USER = 'user',
}

interface User {
  id: string;
  username: string;
  role: Role;
}

// Mock user data
const users: User[] = [
  { id: '1', username: 'alice', role: Role.ADMIN },
  { id: '2', username: 'bob', role: Role.USER },
];

// Mock authentication middleware
// In a real app, this would verify a JWT or session token
const authenticateToken = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const userId = req.headers['x-user-id'] as string; // Simulate user ID from header
  const user = users.find(u => u.id === userId);

  if (!user) {
    return res.status(401).send('Authentication required.');
  }

  // Attach user to request for later use by authorization middleware
  (req as any).user = user; // Type assertion for simplicity in example
  next();
};`,
    starter_code: `import express from 'express';
const app = express();

enum Role {
  ADMIN = 'admin',
  USER = 'user',
}

interface User {
  id: string;
  username: string;
  role: Role;
}

// Mock user data
const users: User[] = [
  { id: '1', username: 'alice', role: Role.ADMIN },
  { id: '2', username: 'bob', role: Role.USER },
];

// Mock authentication middleware
// In a real app, this would verify a JWT or session token
const authenticateToken = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const userId = req.headers['x-user-id'] as string; // Simulate user ID from header
  const user = users.find(u => u.id === userId);

  if (!user) {
    return res.status(401).send('Authentication required.');
  }

  // Attach user to request for later use by authorization middleware
  (req as any).user = user; // Type assertion for simplicity in example
  next();
};

// TODO: Implement authorization middleware factory
`,
    feedback_correct: "Fantastic! This `authorizeRole` factory correctly generates middleware that checks for required roles, centralizing your access control logic.",
    feedback_partial: "You're on the right track, but ensure your `authorizeRole` function returns another function (the actual middleware) and correctly checks if the user's role is included in the `requiredRoles` array.",
    feedback_wrong: "Remember that `authorizeRole` is a *factory* function that takes roles and *returns* a middleware function. The middleware itself then performs the check on `req.user.role`.",
    expected: `import express from 'express';
const app = express();

enum Role {
  ADMIN = 'admin',
  USER = 'user',
}

interface User {
  id: string;
  username: string;
  role: Role;
}

// Mock user data
const users: User[] = [
  { id: '1', username: 'alice', role: Role.ADMIN },
  { id: '2', username: 'bob', role: Role.USER },
];

// Mock authentication middleware
// In a real app, this would verify a JWT or session token
const authenticateToken = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const userId = req.headers['x-user-id'] as string; // Simulate user ID from header
  const user = users.find(u => u.id === userId);

  if (!user) {
    return res.status(401).send('Authentication required.');
  }

  // Attach user to request for later use by authorization middleware
  (req as any).user = user; // Type assertion for simplicity in example
  next();
};

// Authorization middleware factory
const authorizeRole = (requiredRoles: Role[]) => {
  return (req: express.Request, res: express.Response, next: express.NextFunction) => {
    // Ensure user is authenticated first
    if (!(req as any).user) {
      return res.status(403).send('Access denied: No user information.');
    }

    const userRole = (req as any).user.role;

    if (!requiredRoles.includes(userRole)) {
      return res.status(403).send('Access denied: Insufficient role.');
    }

    next(); // User has the required role, proceed
  };
};`,
    analog_example: `// File System Permissions (Conceptual)
// This isn't executable code, but illustrates the concept of a "permission factory"
// function createPermissionChecker(allowedGroups) {
//   return function(file, user) {
//     if (!user.isAuthenticated) return false;
//     if (allowedGroups.some(group => user.groups.includes(group))) {
//       return true;
//     }
//     return false;
//   };
// }

// const adminOnly = createPermissionChecker(['admin', 'root']);
// const userAndAdmin = createPermissionChecker(['user', 'admin']);

// if (adminOnly(someFile, currentUser)) { /* allow access */ }
// else { /* deny */ }
`,
    deepDiveLabel: "What is a middleware 'factory'?",
    deepDive: {
      hook: `Imagine you're a chef, and you need to prepare different sauces for various dishes. Instead of writing out the full recipe for each sauce every single time you need it (e.g., "make a béchamel for the lasagna, make a béchamel for the croque monsieur"), you have a master recipe for "béchamel sauce." You can then customize this master recipe slightly for each dish – perhaps adding nutmeg for one, or cheese for another. If you had to hardcode the nutmeg or cheese into the *master* recipe, it wouldn't be reusable. Similarly, in Express, if your authorization middleware could only check for *one specific role* (e.g., always 'admin'), it wouldn't be flexible enough to protect different routes with different permission requirements. You'd end up writing many almost-identical middleware functions.`,
      pain: `⚠️ **Lesson:** Hardcoding specific values (like required roles) directly into a middleware function makes it inflexible and non-reusable. This leads to code duplication and a maintenance nightmare when different routes require different authorization rules. Symptom: You find yourself copying and pasting middleware code, only changing a single role string.`,
      mentalModel: `**Mental model:** The Customizable Stamp. Instead of having a separate stamp for "Approved for Admin," "Approved for User," etc., you have one "Approval Stamp" machine. You feed it a list of who is allowed (e.g., "Admins and Editors"), and it produces a custom stamp that only approves those specific roles. The machine itself (the factory) is generic, but the stamp it *produces* (the middleware) is tailored to the specific requirements you fed it. This allows you to create many different, specialized stamps from a single, reusable machine.`,
      discover: `**Pattern - Middleware Factory:**
\`\`\`typescript
// Middleware factory function
const logRequestsFrom = (source: string) => {
  // This inner function is the actual Express middleware
  return (req: express.Request, res: express.Response, next: express.NextFunction) => {
    if (req.headers['x-request-source'] === source) {
      console.log(\`Request from \${source} detected!\`);
    }
    next();
  };
};

// Usage: creating specific middleware instances
app.use(logRequestsFrom('mobile-app'));
app.use(logRequestsFrom('web-browser'));
\`\`\`
-   A middleware factory is a function that takes arguments (like \`requiredRoles\` or \`source\`).
-   It then *returns* another function, which is the actual Express middleware (\`(req, res, next) => { ... }\`).
-   This allows you to configure the middleware's behavior dynamically based on the arguments passed to the factory.
-   It promotes reusability and keeps your route definitions clean by abstracting away the configuration details.`,
      quickRules: `**Quick rules:**
-   ✅ Use a middleware factory when your middleware needs dynamic configuration (e.g., a list of roles, a specific logging level).
-   ✅ The factory function should return an actual Express middleware function (\`(req, res, next) => { ... }\`).
-   ✅ Pass configuration parameters to the outer factory function.
-   ✅ This pattern significantly improves middleware reusability and reduces code duplication.
-   ❌ Don't use a factory if your middleware's logic is entirely static and requires no external configuration.
-   ❌ Avoid making the factory function too complex; its primary role is to configure and return the middleware.
-   ❌ Ensure the returned middleware correctly uses the configured parameters from its closure.`,
      watchOut: `👀 **Watch out:** When using middleware factories, be mindful of closures. The inner middleware function will "remember" the arguments passed to the outer factory function, even after the factory has finished executing. This is exactly what we want for configuration, but it's important to understand how it works to avoid unexpected behavior, especially with mutable objects.`,
      dryRun: `🔁 **Think:** The \`authorizeRole\` factory is called with \`[Role.ADMIN]\`. It returns a new middleware function. This returned middleware is then applied to a route. When a request comes to that route, the middleware executes. It checks \`req.user.role\`. If \`req.user.role\` is \`Role.ADMIN\`, \`requiredRoles.includes(userRole)\` evaluates to \`true\`, and \`next()\` is called. If \`req.user.role\` is \`Role.USER\`, \`requiredRoles.includes(userRole)\` evaluates to \`false\`, and a 403 response is sent, terminating the request. (Hint: What happens if \`requiredRoles\` is an empty array?)`,
      build: "**Learning focus:** Create a reusable authorization middleware factory that accepts an array of required roles and enforces access based on the authenticated user's role.",
    },
  },
  {
    id: "step5",
    type: "question",
    phase: "Step 5 of 7",
    paal: "Now we'll define our API endpoints. We'll start with a public route and a user-specific route, without applying any middleware yet.",
    hint: "Add a simple public `/` route and a `/profile` route that returns `req.user` (assuming authentication will happen later).",
    example_code: `// Public route
app.get('/', (req, res) => {
  res.send('Welcome to the API!');
});

// User profile route (requires authentication, but not yet applied)
app.get('/profile', (req, res) => {
  // In a real app, you'd fetch specific profile data
  res.json({ message: 'Your profile data', user: (req as any).user });
});`,
    think_prompt: "Which code snippet correctly defines a public root route and a `/profile` route that returns user data?",
    mc_options: [
      `app.get('/', (req, res) => res.send('Hello')); app.get('/profile', (req, res) => res.json(req.user));`,
      `app.get('/', (req, res) => { res.send('Welcome'); }); app.get('/profile', (req, res) => { res.json({ user: (req as any).user }); });`,
      `app.post('/', (req, res) => res.send('Welcome')); app.get('/profile', (req, res) => res.json({ user: req.user }));`,
    ],
    mc_correct_option: `app.get('/', (req, res) => { res.send('Welcome'); }); app.get('/profile', (req, res) => { res.json({ user: (req as any).user }); });`,
    mc_anchor: "define-routes-skeleton",
    why_this_matters: "Defining the basic route structure is essential before we apply security. It allows us to see the paths users will try to access.",
    answer_keywords: ["app.get", "route", "public", "profile", "endpoint"],
    seed_code: `import express from 'express';
const app = express();

enum Role {
  ADMIN = 'admin',
  USER = 'user',
}

interface User {
  id: string;
  username: string;
  role: Role;
}

// Mock user data
const users: User[] = [
  { id: '1', username: 'alice', role: Role.ADMIN },
  { id: '2', username: 'bob', role: Role.USER },
];

// Mock authentication middleware
// In a real app, this would verify a JWT or session token
const authenticateToken = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const userId = req.headers['x-user-id'] as string; // Simulate user ID from header
  const user = users.find(u => u.id === userId);

  if (!user) {
    return res.status(401).send('Authentication required.');
  }

  // Attach user to request for later use by authorization middleware
  (req as any).user = user; // Type assertion for simplicity in example
  next();
};

// Authorization middleware factory
const authorizeRole = (requiredRoles: Role[]) => {
  return (req: express.Request, res: express.Response, next: express.NextFunction) => {
    // Ensure user is authenticated first
    if (!(req as any).user) {
      return res.status(403).send('Access denied: No user information.');
    }

    const userRole = (req as any).user.role;

    if (!requiredRoles.includes(userRole)) {
      return res.status(403).send('Access denied: Insufficient role.');
    }

    next(); // User has the required role, proceed
  };
};`,
    starter_code: `import express from 'express';
const app = express();

enum Role {
  ADMIN = 'admin',
  USER = 'user',
}

interface User {
  id: string;
  username: string;
  role: Role;
}

// Mock user data
const users: User[] = [
  { id: '1', username: 'alice', role: Role.ADMIN },
  { id: '2', username: 'bob', role: Role.USER },
];

// Mock authentication middleware
// In a real app, this would verify a JWT or session token
const authenticateToken = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const userId = req.headers['x-user-id'] as string; // Simulate user ID from header
  const user = users.find(u => u.id === userId);

  if (!user) {
    return res.status(401).send('Authentication required.');
  }

  // Attach user to request for later use by authorization middleware
  (req as any).user = user; // Type assertion for simplicity in example
  next();
};

// Authorization middleware factory
const authorizeRole = (requiredRoles: Role[]) => {
  return (req: express.Request, res: express.Response, next: express.NextFunction) => {
    // Ensure user is authenticated first
    if (!(req as any).user) {
      return res.status(403).send('Access denied: No user information.');
    }

    const userRole = (req as any).user.role;

    if (!requiredRoles.includes(userRole)) {
      return res.status(403).send('Access denied: Insufficient role.');
    }

    next(); // User has the required role, proceed
  };
};

// TODO: Define public and user profile routes
`,
    feedback_correct: "Great! You've set up the basic routes. Now we can proceed to secure them with our middleware.",
    feedback_partial: "You've defined one of the routes, but ensure both the public root route and the `/profile` route are present and return appropriate responses.",
    feedback_wrong: "Make sure you're using `app.get` for defining GET requests and providing a response using `res.send` or `res.json` for each route.",
    expected: `import express from 'express';
const app = express();

enum Role {
  ADMIN = 'admin',
  USER = 'user',
}

interface User {
  id: string;
  username: string;
  role: Role;
}

// Mock user data
const users: User[] = [
  { id: '1', username: 'alice', role: Role.ADMIN },
  { id: '2', username: 'bob', role: Role.USER },
];

// Mock authentication middleware
// In a real app, this would verify a JWT or session token
const authenticateToken = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const userId = req.headers['x-user-id'] as string; // Simulate user ID from header
  const user = users.find(u => u.id === userId);

  if (!user) {
    return res.status(401).send('Authentication required.');
  }

  // Attach user to request for later use by authorization middleware
  (req as any).user = user; // Type assertion for simplicity in example
  next();
};

// Authorization middleware factory
const authorizeRole = (requiredRoles: Role[]) => {
  return (req: express.Request, res: express.Response, next: express.NextFunction) => {
    // Ensure user is authenticated first
    if (!(req as any).user) {
      return res.status(403).send('Access denied: No user information.');
    }

    const userRole = (req as any).user.role;

    if (!requiredRoles.includes(userRole)) {
      return res.status(403).send('Access denied: Insufficient role.');
    }

    next(); // User has the required role, proceed
  };
};

// Public route
app.get('/', (req, res) => {
  res.send('Welcome to the API!');
});

// User profile route (requires authentication, but not yet applied)
app.get('/profile', (req, res) => {
  // In a real app, you'd fetch specific profile data
  res.json({ message: 'Your profile data', user: (req as any).user });
});`,
    analog_example: `// Go: Defining HTTP handlers
package main

import (
	"fmt"
	"net/http"
)

func publicHandler(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintf(w, "Welcome to the Go API!")
}

func profileHandler(w http.ResponseWriter, r *http.Request) {
	// In Go, you might pass user data via context or a custom request type
	// For simplicity, imagine user data is available here
	fmt.Fprintf(w, "Your profile data (user: %v)", r.Context().Value("user"))
}

// func main() {
// 	http.HandleFunc("/", publicHandler)
// 	http.HandleFunc("/profile", profileHandler)
// 	// http.ListenAndServe(":8080", nil)
// }`,
    deepDiveLabel: "How do API routes work in Express?",
    deepDive: {
      hook: `Imagine a post office where different counters handle different types of mail: one for packages, one for letters, one for international mail. If a customer just walks in and asks to "send something," the post office needs a clear system to direct them to the correct counter. In an API, when a client sends a request (e.g., to \`/users\` or \`/products/123\`), your server needs to know exactly which piece of code should handle that specific request. Without a clear routing mechanism, every incoming request would either be handled by a single, monolithic function (which would be impossible to maintain) or simply ignored. This is where API routes come in, acting as the traffic controllers for your server.`,
      pain: `⚠️ **Lesson:** Without a structured routing system, an API server cannot efficiently direct incoming requests to the correct logic, leading to unmanageable code, difficulty in adding new features, and potential security gaps if requests are mishandled. Symptom: A single, massive function attempting to parse URLs and HTTP methods manually, or requests failing because no handler is defined.`,
      mentalModel: `**Mental model:** The API Traffic Cop. When a request (a car) arrives at your server (the intersection), the API traffic cop (Express router) looks at its destination (the URL path, e.g., \`/users\`) and its intention (the HTTP method, e.g., GET, POST). Based on these, the cop directs the car to the correct lane (the route handler function) to be processed. If there's no lane for that destination or intention, the cop signals a "404 Not Found" or "405 Method Not Allowed."`,
      discover: `**Pattern - Express Routing:**
\`\`\`typescript
// Basic GET route
app.get('/items', (req, res) => {
  res.send('List of items');
});

// POST route for creating resources
app.post('/items', (req, res) => {
  res.status(201).send('Item created');
});

// Route with a URL parameter
app.get('/items/:id', (req, res) => {
  const itemId = req.params.id; // Access the 'id' parameter
  res.send(\`Details for item \${itemId}\`);
});

// Chaining multiple handlers for a single route
app.route('/users')
  .get((req, res) => { /* Get all users */ })
  .post((req, res) => { /* Create a new user */ });
\`\`\`
-   \`app.METHOD(path, handler)\`: The primary way to define routes, where \`METHOD\` is an HTTP verb (get, post, put, delete).
-   \`path\`: A string representing the URL path. Can include parameters (e.g., \`/users/:id\`).
-   \`handler\`: A function \`(req, res) => { ... }\` that executes when the route matches.
-   \`req.params\`: An object containing route parameters (e.g., \`req.params.id\`).
-   \`req.query\`: An object containing URL query parameters (e.g., \`?name=value\`).`,
      quickRules: `**Quick rules:**
-   ✅ Use \`app.get()\` for retrieving data.
-   ✅ Use \`app.post()\` for creating new data.
-   ✅ Use \`app.put()\` or \`app.patch()\` for updating existing data.
-   ✅ Use \`app.delete()\` for removing data.
-   ❌ Don't use the same HTTP method and path for fundamentally different operations.
-   ❌ Avoid putting sensitive logic in public routes without proper authentication/authorization.
-   ❌ Don't forget to send a response (\`res.send()\`, \`res.json()\`, \`res.status().end()\`) in every route handler.`,
      watchOut: `👀 **Watch out:** The order of your routes matters! If you have a more general route (e.g., \`/users/:id\`) defined before a more specific one (e.g., \`/users/me\`), the general route might capture requests intended for the specific one. Always define more specific routes before more general ones.`,
      dryRun: `🔁 **Think:** A GET request arrives at \`/\`. Express matches it to \`app.get('/')\`. The handler \`(req, res) => { res.send('Welcome to the API!'); }\` executes, and the server sends "Welcome to the API!" as the response. A GET request arrives at \`/profile\`. Express matches it to \`app.get('/profile')\`. The handler \`(req, res) => { res.json({ message: 'Your profile data', user: (req as any).user }); }\` executes, and the server sends a JSON object containing a message and the (currently undefined) user data. (Hint: What HTTP status code is typically sent for a successful GET request?)`,
      build: "**Learning focus:** Define basic API routes for a public endpoint and a user profile endpoint, preparing them for middleware integration.",
    },
  },
  {
    id: "step6",
    type: "question",
    phase: "Step 6 of 7",
    paal: "Now, let's add an admin-specific route. This route will be used for managing all user data, so it must be highly restricted.",
    hint: "Add a `/admin/users` route that returns a list of all users. This route will later be protected by our authorization middleware.",
    example_code: `// Admin-only route (requires ADMIN role, not yet applied)
app.get('/admin/users', (req, res) => {
  res.json({ message: 'All user data (admin view)', users: users });
});`,
    think_prompt: "Which code snippet correctly defines an `/admin/users` route that returns the `users` array?",
    mc_options: [
      `app.get('/admin/users', (req, res) => res.json(users));`,
      `app.get('/admin/users', (req, res) => { res.json({ users: users }); });`,
      `app.post('/admin/users', (req, res) => res.json({ users: users }));`,
    ],
    mc_correct_option: `app.get('/admin/users', (req, res) => { res.json({ users: users }); });`,
    mc_anchor: "define-admin-route",
    why_this_matters: "This route represents a sensitive operation that absolutely requires robust access control. It's a prime candidate for our authorization middleware.",
    answer_keywords: ["admin", "route", "users", "sensitive", "endpoint"],
    seed_code: `import express from 'express';
const app = express();

enum Role {
  ADMIN = 'admin',
  USER = 'user',
}

interface User {
  id: string;
  username: string;
  role: Role;
}

// Mock user data
const users: User[] = [
  { id: '1', username: 'alice', role: Role.ADMIN },
  { id: '2', username: 'bob', role: Role.USER },
];

// Mock authentication middleware
// In a real app, this would verify a JWT or session token
const authenticateToken = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const userId = req.headers['x-user-id'] as string; // Simulate user ID from header
  const user = users.find(u => u.id === userId);

  if (!user) {
    return res.status(401).send('Authentication required.');
  }

  // Attach user to request for later use by authorization middleware
  (req as any).user = user; // Type assertion for simplicity in example
  next();
};

// Authorization middleware factory
const authorizeRole = (requiredRoles: Role[]) => {
  return (req: express.Request, res: express.Response, next: express.NextFunction) => {
    // Ensure user is authenticated first
    if (!(req as any).user) {
      return res.status(403).send('Access denied: No user information.');
    }

    const userRole = (req as any).user.role;

    if (!requiredRoles.includes(userRole)) {
      return res.status(403).send('Access denied: Insufficient role.');
    }

    next(); // User has the required role, proceed
  };
};

// Public route
app.get('/', (req, res) => {
  res.send('Welcome to the API!');
});

// User profile route (requires authentication, but not yet applied)
app.get('/profile', (req, res) => {
  // In a real app, you'd fetch specific profile data
  res.json({ message: 'Your profile data', user: (req as any).user });
});`,
    starter_code: `import express from 'express';
const app = express();

enum Role {
  ADMIN = 'admin',
  USER = 'user',
}

interface User {
  id: string;
  username: string;
  role: Role;
}

// Mock user data
const users: User[] = [
  { id: '1', username: 'alice', role: Role.ADMIN },
  { id: '2', username: 'bob', role: Role.USER },
];

// Mock authentication middleware
// In a real app, this would verify a JWT or session token
const authenticateToken = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const userId = req.headers['x-user-id'] as string; // Simulate user ID from header
  const user = users.find(u => u.id === userId);

  if (!user) {
    return res.status(401).send('Authentication required.');
  }

  // Attach user to request for later use by authorization middleware
  (req as any).user = user; // Type assertion for simplicity in example
  next();
};

// Authorization middleware factory
const authorizeRole = (requiredRoles: Role[]) => {
  return (req: express.Request, res: express.Response, next: express.NextFunction) => {
    // Ensure user is authenticated first
    if (!(req as any).user) {
      return res.status(403).send('Access denied: No user information.');
    }

    const userRole = (req as any).user.role;

    if (!requiredRoles.includes(userRole)) {
      return res.status(403).send('Access denied: Insufficient role.');
    }

    next(); // User has the required role, proceed
  };
};

// Public route
app.get('/', (req, res) => {
  res.send('Welcome to the API!');
});

// User profile route (requires authentication, but not yet applied)
app.get('/profile', (req, res) => {
  // In a real app, you'd fetch specific profile data
  res.json({ message: 'Your profile data', user: (req as any).user });
});

// TODO: Define admin-only route
`,
    feedback_correct: "Excellent! The admin route is now defined. We're ready to secure all our routes.",
    feedback_partial: "You've started the admin route, but ensure it's a GET request to `/admin/users` and returns the `users` array in its response.",
    feedback_wrong: "Remember to use `app.get` for retrieving data and provide a JSON response containing the `users` array for the admin route.",
    expected: `import express from 'express';
const app = express();

enum Role {
  ADMIN = 'admin',
  USER = 'user',
}

interface User {
  id: string;
  username: string;
  role: Role;
}

// Mock user data
const users: User[] = [
  { id: '1', username: 'alice', role: Role.ADMIN },
  { id: '2', username: 'bob', role: Role.USER },
];

// Mock authentication middleware
// In a real app, this would verify a JWT or session token
const authenticateToken = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const userId = req.headers['x-user-id'] as string; // Simulate user ID from header
  const user = users.find(u => u.id === userId);

  if (!user) {
    return res.status(401).send('Authentication required.');
  }

  // Attach user to request for later use by authorization middleware
  (req as any).user = user; // Type assertion for simplicity in example
  next();
};

// Authorization middleware factory
const authorizeRole = (requiredRoles: Role[]) => {
  return (req: express.Request, res: express.Response, next: express.NextFunction) => {
    // Ensure user is authenticated first
    if (!(req as any).user) {
      return res.status(403).send('Access denied: No user information.');
    }

    const userRole = (req as any).user.role;

    if (!requiredRoles.includes(userRole)) {
      return res.status(403).send('Access denied: Insufficient role.');
    }

    next(); // User has the required role, proceed
  };
};

// Public route
app.get('/', (req, res) => {
  res.send('Welcome to the API!');
});

// User profile route (requires authentication, but not yet applied)
app.get('/profile', (req, res) => {
  // In a real app, you'd fetch specific profile data
  res.json({ message: 'Your profile data', user: (req as any).user });
});

// Admin-only route (requires ADMIN role, not yet applied)
app.get('/admin/users', (req, res) => {
  res.json({ message: 'All user data (admin view)', users: users });
});`,
    analog_example: `// Java: Defining a Spring Boot REST endpoint
// @RestController
// @RequestMapping("/api")
// public class AdminController {
//
//     @GetMapping("/admin/users")
//     // @PreAuthorize("hasRole('ADMIN')") // This is where authorization would be applied
//     public List<User> getAllUsers() {
//         // return service.findAllUsers();
//         return List.of(new User("Alice", "admin"), new User("Bob", "user"));
//     }
// }`,
    deepDiveLabel: "How do different API paths relate to security?",
    deepDive: {
      hook: `Imagine a building with different entrances: a main lobby, an employee entrance, and a vault door. Each entrance leads to different areas and has different security requirements. The main lobby might be open to the public, the employee entrance requires a badge, and the vault door requires multiple keys, biometric scans, and perhaps even a manager's override. In an API, different URL paths (like \`/profile\` vs. \`/admin/users\`) are like these different entrances. If you treat all paths with the same level of security, you either over-secure public information (making your app cumbersome) or under-secure sensitive data (creating massive security holes). The challenge is to apply the *right* level of security to each "entrance."`,
      pain: `⚠️ **Lesson:** Treating all API endpoints with the same security measures (or lack thereof) leads to either unnecessary complexity for public data or, more dangerously, exposure of sensitive data to unauthorized users. Symptom: Public-facing endpoints requiring login, or admin-level data being accessible to regular users.`,
      mentalModel: `**Mental model:** The Layered Security Building. Your API is a building with different floors and rooms. The ground floor (public routes like \`/\`) is open. The first floor (user routes like \`/profile\`) requires a general access card (authentication). The top floor (admin routes like \`/admin/users\`) requires a special master key (admin role authorization) in addition to the general access card. Each layer of the building has its own specific security protocols, and you must pass through the lower layers to reach the higher, more restricted ones.`,
      discover: `**Pattern - Granular Endpoint Security:**
\`\`\`typescript
// Public endpoint - no auth/auth needed
app.get('/', (req, res) => { /* ... */ });

// User-specific endpoint - needs authentication
app.get('/profile', authenticateToken, (req, res) => { /* ... */ });

// Admin-specific endpoint - needs authentication AND admin role
app.get('/admin/users', authenticateToken, authorizeRole([Role.ADMIN]), (req, res) => { /* ... */ });

// Endpoint requiring multiple roles
app.post('/reports', authenticateToken, authorizeRole([Role.ADMIN, Role.MANAGER]), (req, res) => { /* ... */ });
\`\`\`
-   **Public Routes:** No middleware needed. Accessible to anyone.
-   **Authenticated Routes:** Require \`authenticateToken\` middleware to verify user identity.
-   **Authorized Routes:** Require both \`authenticateToken\` and \`authorizeRole\` middleware to verify identity *and* specific permissions.
-   **Specificity:** Apply middleware directly to the routes that need them, not globally, unless truly global.`,
      quickRules: `**Quick rules:**
-   ✅ Identify which endpoints are public, which require authentication, and which require specific roles.
-   ✅ Apply authentication middleware to all routes that need to know who the user is.
-   ✅ Apply authorization middleware *after* authentication middleware for role-based checks.
-   ✅ Use the most restrictive authorization necessary for each sensitive endpoint.
-   ❌ Don't expose sensitive data or actions on public routes.
-   ❌ Don't apply authorization middleware without prior authentication.
-   ❌ Avoid making all routes require the same high level of authorization if not necessary.`,
      watchOut: `👀 **Watch out:** It's a common mistake to apply authorization middleware *before* authentication. If \`authenticateToken\` hasn't run yet, \`req.user\` will be undefined, and your \`authorizeRole\` middleware will incorrectly deny access or throw an error, even for legitimate users. Always ensure authentication precedes authorization in your middleware chain.`,
      dryRun: `🔁 **Think:** A GET request arrives at \`/admin/users\` with \`x-user-id: '2'\` (Bob, a USER). The \`authenticateToken\` middleware runs, finds Bob, and sets \`req.user = { id: '2', username: 'bob', role: Role.USER }\`. Then, the \`authorizeRole([Role.ADMIN])\` middleware runs. It checks if \`Role.USER\` is included in \`[Role.ADMIN]\`. It is not. The middleware sends a 403 Forbidden response, terminating the request. The route handler for \`/admin/users\` is never reached. (Hint: What would happen if Alice, an ADMIN, made the request?)`,
      build: "**Learning focus:** Define an admin-specific API route that will require the highest level of access control.",
    },
  },
  {
    id: "step7",
    type: "question",
    phase: "Step 7 of 7",
    paal: "Finally, let's wire up our authentication and authorization middleware to the appropriate routes and start the server.",
    hint: "Apply `authenticateToken` to `/profile` and both `authenticateToken` and `authorizeRole([Role.ADMIN])` to `/admin/users`. Then, add `app.listen`.",
    example_code: `// Public route
app.get('/', (req, res) => {
  res.send('Welcome to the API!');
});

// User profile route (requires authentication)
app.get('/profile', authenticateToken, (req, res) => {
  res.json({ message: 'Your profile data', user: (req as any).user });
});

// Admin-only route (requires ADMIN role)
app.get('/admin/users', authenticateToken, authorizeRole([Role.ADMIN]), (req, res) => {
  res.json({ message: 'All user data (admin view)', users: users });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(\`Server running on http://localhost:\${PORT}\`);
});`,
    think_prompt: "Which code snippet correctly applies the middleware to the `/profile` and `/admin/users` routes and starts the server?",
    mc_options: [
      `app.get('/profile', authenticateToken, (req, res) => {}); app.get('/admin/users', authorizeRole([Role.ADMIN]), (req, res) => {}); app.listen(3000);`,
      `app.get('/profile', authenticateToken, (req, res) => {}); app.get('/admin/users', authenticateToken, authorizeRole([Role.ADMIN]), (req, res) => {}); app.listen(3000, () => console.log('Server running'));`,
      `app.use(authenticateToken); app.get('/admin/users', authorizeRole([Role.ADMIN]), (req, res) => {}); app.listen(3000);`,
    ],
    mc_correct_option: `app.get('/profile', authenticateToken, (req, res) => {}); app.get('/admin/users', authenticateToken, authorizeRole([Role.ADMIN]), (req, res) => {}); app.listen(3000, () => console.log('Server running'));`,
    mc_anchor: "wire-middleware-start-server",
    why_this_matters: "This step brings everything together. By applying the middleware, we activate our security measures, and starting the server makes our API accessible.",
    answer_keywords: ["middleware", "apply", "authenticateToken", "authorizeRole", "listen", "server"],
    seed_code: `import express from 'express';
const app = express();

enum Role {
  ADMIN = 'admin',
  USER = 'user',
}

interface User {
  id: string;
  username: string;
  role: Role;
}

// Mock user data
const users: User[] = [
  { id: '1', username: 'alice', role: Role.ADMIN },
  { id: '2', username: 'bob', role: Role.USER },
];

// Mock authentication middleware
// In a real app, this would verify a JWT or session token
const authenticateToken = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const userId = req.headers['x-user-id'] as string; // Simulate user ID from header
  const user = users.find(u => u.id === userId);

  if (!user) {
    return res.status(401).send('Authentication required.');
  }

  // Attach user to request for later use by authorization middleware
  (req as any).user = user; // Type assertion for simplicity in example
  next();
};

// Authorization middleware factory
const authorizeRole = (requiredRoles: Role[]) => {
  return (req: express.Request, res: express.Response, next: express.NextFunction) => {
    // Ensure user is authenticated first
    if (!(req as any).user) {
      return res.status(403).send('Access denied: No user information.');
    }

    const userRole = (req as any).user.role;

    if (!requiredRoles.includes(userRole)) {
      return res.status(403).send('Access denied: Insufficient role.');
    }

    next(); // User has the required role, proceed
  };
};

// Public route
app.get('/', (req, res) => {
  res.send('Welcome to the API!');
});

// User profile route (requires authentication, but not yet applied)
app.get('/profile', (req, res) => {
  // In a real app, you'd fetch specific profile data
  res.json({ message: 'Your profile data', user: (req as any).user });
});

// Admin-only route (requires ADMIN role, not yet applied)
app.get('/admin/users', (req, res) => {
  res.json({ message: 'All user data (admin view)', users: users });
});`,
    starter_code: `import express from 'express';
const app = express();

enum Role {
  ADMIN = 'admin',
  USER = 'user',
}

interface User {
  id: string;
  username: string;
  role: Role;
}

// Mock user data
const users: User[] = [
  { id: '1', username: 'alice', role: Role.ADMIN },
  { id: '2', username: 'bob', role: Role.USER },
];

// Mock authentication middleware
// In a real app, this would verify a JWT or session token
const authenticateToken = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const userId = req.headers['x-user-id'] as string; // Simulate user ID from header
  const user = users.find(u => u.id === userId);

  if (!user) {
    return res.status(401).send('Authentication required.');
  }

  // Attach user to request for later use by authorization middleware
  (req as any).user = user; // Type assertion for simplicity in example
  next();
};

// Authorization middleware factory
const authorizeRole = (requiredRoles: Role[]) => {
  return (req: express.Request, res: express.Response, next: express.NextFunction) => {
    // Ensure user is authenticated first
    if (!(req as any).user) {
      return res.status(403).send('Access denied: No user information.');
    }

    const userRole = (req as any).user.role;

    if (!requiredRoles.includes(userRole)) {
      return res.status(403).send('Access denied: Insufficient role.');
    }

    next(); // User has the required role, proceed
  };
};

// Public route
app.get('/', (req, res) => {
  res.send('Welcome to the API!');
});

// TODO: Apply middleware to profile and admin routes, then start the server

// User profile route (requires authentication, but not yet applied)
app.get('/profile', (req, res) => {
  // In a real app, you'd fetch specific profile data
  res.json({ message: 'Your profile data', user: (req as any).user });
});

// Admin-only route (requires ADMIN role, not yet applied)
app.get('/admin/users', (req, res) => {
  res.json({ message: 'All user data (admin view)', users: users });
});
`,
    feedback_correct: "Fantastic! Your API is now secured with role-based access control. You've successfully implemented a robust authorization system.",
    feedback_partial: "You've applied some middleware, but ensure `authenticateToken` is applied to `/profile`, and *both* `authenticateToken` and `authorizeRole([Role.ADMIN])` are applied to `/admin/users` in the correct order. Don't forget to start the server with `app.listen`!",
    feedback_wrong: "Remember that middleware functions are passed as arguments *before* the final route handler. For `/admin/users`, you need both authentication and authorization middleware, in that specific order.",
    expected: `import express from 'express';
const app = express();

enum Role {
  ADMIN = 'admin',
  USER = 'user',
}

interface User {
  id: string;
  username: string;
  role: Role;
}

// Mock user data
const users: User[] = [
  { id: '1', username: 'alice', role: Role.ADMIN },
  { id: '2', username: 'bob', role: Role.USER },
];

// Mock authentication middleware
// In a real app, this would verify a JWT or session token
const authenticateToken = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const userId = req.headers['x-user-id'] as string; // Simulate user ID from header
  const user = users.find(u => u.id === userId);

  if (!user) {
    return res.status(401).send('Authentication required.');
  }

  // Attach user to request for later use by authorization middleware
  (req as any).user = user; // Type assertion for simplicity in example
  next();
};

// Authorization middleware factory
const authorizeRole = (requiredRoles: Role[]) => {
  return (req: express.Request, res: express.Response, next: express.NextFunction) => {
    // Ensure user is authenticated first
    if (!(req as any).user) {
      return res.status(403).send('Access denied: No user information.');
    }

    const userRole = (req as any).user.role;

    if (!requiredRoles.includes(userRole)) {
      return res.status(403).send('Access denied: Insufficient role.');
    }

    next(); // User has the required role, proceed
  };
};

// Public route
app.get('/', (req, res) => {
  res.send('Welcome to the API!');
});

// User profile route (requires authentication)
app.get('/profile', authenticateToken, (req, res) => {
  res.json({ message: 'Your profile data', user: (req as any).user });
});

// Admin-only route (requires ADMIN role)
app.get('/admin/users', authenticateToken, authorizeRole([Role.ADMIN]), (req, res) => {
  res.json({ message: 'All user data (admin view)', users: users });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(\`Server running on http://localhost:\${PORT}\`);
});`,
    analog_example: `// Ruby on Rails: Applying before_action filters
# class ApplicationController < ActionController::Base
#   # This is like global middleware
#   # before_action :authenticate_user!
# end

# class UsersController < ApplicationController
#   # This is like route-specific middleware
#   before_action :authenticate_user!, only: [:show, :edit, :update, :destroy]
#   before_action :authorize_admin!, only: [:destroy, :index] # Admin-only actions

#   def show
#     # ... logic for showing user profile
#   end

#   def index
#     # ... logic for listing all users (admin only)
#   end

#   private

#   def authorize_admin!
#     unless current_user.admin?
#       redirect_to root_path, alert: "Not authorized."
#     end
#   end
# end`,
    deepDiveLabel: "What's the significance of middleware order?",
    deepDive: {
      hook: `Imagine a highly secure building with multiple layers of access control. First, you need to show your ID at the main gate. If your ID is valid, you proceed to the next checkpoint. At the second checkpoint, a guard checks your specific clearance level – are you allowed into the server room, or only the cafeteria? If you tried to get your clearance checked *before* showing your ID, the guard wouldn't even know who you are, and the whole system would break down. In Express, middleware functions are executed in the exact order they are defined. If you place an authorization check before an authentication check, the authorization middleware won't have any user information to act upon, leading to either errors or incorrect access decisions.`,
      pain: `⚠️ **Lesson:** Incorrect ordering of middleware can lead to runtime errors, security vulnerabilities (e.g., authorization checks failing because user data is missing), or unexpected behavior. Symptom: Users receiving "Access Denied" messages even when they should have access, or server crashes due to attempts to access undefined user properties.`,
      mentalModel: `**Mental model:** The Sequential Security Gauntlet. Every request must pass through a series of security gates in a specific order. The first gate is Authentication (Who are you?). Only if you pass this gate do you get your identity confirmed. The second gate is Authorization (What are you allowed to do?). This gate relies on the information gathered from the first. If you try to jump ahead or skip a gate, the system won't work correctly. Each gate builds upon the information provided by the previous one.`,
      discover: `**Pattern - Middleware Chaining Order:**
\`\`\`typescript
// 1. Global middleware (e.g., body parser, logging)
app.use(express.json()); // Parses request body

// 2. Authentication middleware (identifies the user)
// app.use(authenticateToken); // Can be global or route-specific

// 3. Authorization middleware (checks user's permissions)
// app.get('/admin', authenticateToken, authorizeRole([Role.ADMIN]), (req, res) => { /* ... */ });

// 4. Route handler (executes business logic)
// app.get('/data', (req, res) => { /* ... */ });
\`\`\`
-   **Authentication first:** Always place authentication middleware before authorization middleware. Authentication establishes \`req.user\`, which authorization relies on.
-   **General to Specific:** Global middleware (\`app.use()\`) runs for all requests. Route-specific middleware runs only for matching routes.
-   **Order within a route:** Middleware functions passed as arguments to \`app.get()\`, \`app.post()\`, etc., are executed from left to right.
-   **Error Handling:** Error handling middleware is typically placed last in the chain.`,
      quickRules: `**Quick rules:**
-   ✅ Authentication middleware must always precede authorization middleware.
-   ✅ Place global middleware (like \`express.json()\`) at the very beginning of your application setup.
-   ✅ Middleware functions within a route definition execute in the order they are listed.
-   ✅ More general middleware should come before more specific middleware if both apply to the same path.
-   ❌ Never place authorization middleware before authentication middleware.
-   ❌ Avoid placing route handlers before middleware that they depend on (e.g., a handler that expects \`req.user\` before \`authenticateToken\` runs).
-   ❌ Don't put error handling middleware before all other routes and middleware, as it won't catch errors from them.`,
      watchOut: `👀 **Watch out:** If you apply \`authenticateToken\` globally with \`app.use(authenticateToken)\`, then *all* routes, including your public \`/\` route, will require authentication. This is usually not desired. For granular control, apply middleware directly to the specific routes that need it, as shown in the example for \`/profile\` and \`/admin/users\`.`,
      dryRun: `🔁 **Think:** A request for \`/admin/users\` arrives with \`x-user-id: '1'\` (Alice, an ADMIN).
1.  \`authenticateToken\` runs: Finds Alice, sets \`req.user = { id: '1', username: 'alice', role: Role.ADMIN }\`, calls \`next()\`.
2.  \`authorizeRole([Role.ADMIN])\` runs: Checks \`req.user.role\` (which is \`Role.ADMIN\`). \`Role.ADMIN\` is in \`[Role.ADMIN]\`. Calls \`next()\`.
3.  The route handler \`(req, res) => { res.json(...) }\` runs: Alice's user data is returned.

Now, consider a request for \`/profile\` with \`x-user-id: '2'\` (Bob, a USER).
1.  \`authenticateToken\` runs: Finds Bob, sets \`req.user = { id: '2', username: 'bob', role: Role.USER }\`, calls \`next()\`.
2.  The route handler \`(req, res) => { res.json(...) }\` runs: Bob's user data is returned. (Hint: What would happen if \`authorizeRole([Role.USER])\` was also applied to \`/profile\`?)`,
      build: "**Learning focus:** Integrate authentication and authorization middleware into specific API routes and start the Express server to enable the secured endpoints.",
    },
  },
];

const sideItems = [
  { label: "Lesson", id: "intro" },
  { label: "Objectives", id: "objectives" },
  { label: "Step 1: Setup Express App", id: "step1" },
  { label: "Step 2: Define User & Role Types", id: "step2" },
  { label: "Step 3: Mock Auth Middleware", id: "step3" },
  { label: "Step 4: Authorization Middleware", id: "step4" },
  { label: "Step 5: Define Public & User Routes", id: "step5" },
  { label: "Step 6: Define Admin Route", id: "step6" },
  { label: "Step 7: Wire Middleware & Start Server", id: "step7" },
];

export default createINPACTEngine({
  NODES,
  sideItems,
  lessonNum: 0,
  title: "Role-Based API Access",
  shortName: "RBAC API",
});
