import createINPACTEngine from "../inpact_engine_shared";

export const NODES = [
  {
    id: "intro",
    type: "reveal",
    phase: "Lesson",
    content: {
      tag: "ci-cd-pipeline-setup",
      title: "Automating Your Development Workflow with CI/CD",
      body: `Imagine a world where every change you make to your codebase is automatically checked for errors, built into a deployable package, and then made available for testing without any manual intervention. This isn't a futuristic dream; it's the core promise of Continuous Integration (CI) and Continuous Delivery/Deployment (CD) pipelines. Without CI/CD, developers often face a slow, error-prone process of manually building their applications, running tests, and then deploying them. This can lead to bugs being discovered late in the development cycle, long feedback loops, and significant delays in getting new features or fixes to users. CI/CD solves this by automating these repetitive tasks, ensuring that code is always in a releasable state and that issues are caught as early as possible.

This powerful pattern isn't limited to large-scale enterprise applications. You'll find the principles of CI/CD applied across various software engineering contexts: from small web services that automatically deploy new versions to a staging environment after every commit, to mobile applications that build and distribute beta versions to testers, and even to infrastructure-as-code projects that validate and apply configuration changes. Any project that benefits from consistent quality checks, rapid feedback, and streamlined delivery can leverage CI/CD to improve efficiency and reliability. Understanding how to set up these automated workflows is a fundamental skill for modern software development, enabling teams to deliver value faster and with greater confidence.`,
      usecase: "A web service that automatically builds, tests, and deploys new features to a staging environment every time a developer pushes code to the main branch.",
    },
  },
  {
    id: "objectives",
    type: "objectives",
    phase: "Objectives",
    items: [
      "Understand the purpose of Continuous Integration and Continuous Delivery.",
      "Identify key stages in a typical CI/CD pipeline.",
      "Configure a pipeline to trigger automatically on code commits.",
      "Implement steps for building and testing application code.",
      "Define a stage for creating deployable artifacts.",
      "Set up automated deployment to a staging environment.",
    ],
  },
  {
    id: "step1",
    type: "question",
    phase: "Step 1 of 5",
    paal: "The first step in any CI/CD pipeline is defining *when* it should run. This is called the trigger. We want our pipeline to start automatically whenever new code is pushed to the main branch. How would you configure this trigger?",
    hint: "Think about the event that initiates the pipeline and the specific branch to monitor.",
    example_code: `
# .github/workflows/main.yml (simplified example)
name: Web Service CI/CD

on:
  push:
    branches: [main]

jobs:
  # ... pipeline stages will go here
`,
    think_prompt: "Which option correctly specifies that the pipeline should run on a 'push' event to the 'main' branch?",
    mc_options: [
      "trigger: on_commit: branch: main",
      "on: push: branches: [main]",
      "start: event: commit, branch: main",
    ],
    mc_correct_option: "on: push: branches: [main]",
    mc_anchor: "on:",
    why_this_matters: "Automating triggers ensures that every code change is immediately validated, preventing manual oversight and establishing a consistent feedback loop for developers.",
    answer_keywords: ["on", "push", "branches", "main"],
    seed_code: `
# .github/workflows/main.yml (simplified example)
name: Web Service CI/CD
`,
    starter_code: `
# .github/workflows/main.yml (simplified example)
name: Web Service CI/CD

# Add the trigger configuration here
`,
    feedback_correct: "Excellent! Specifying 'on: push: branches: [main]' correctly configures the pipeline to run automatically whenever new code is pushed to the main branch, initiating our automated workflow.",
    feedback_partial: "You're on the right track with triggering on a push, but double-check the exact syntax for specifying the 'main' branch within the 'on' block.",
    feedback_wrong: "The syntax 'trigger: on_commit: branch: main' isn't standard for common CI/CD platforms. We need to use a structure that clearly defines the event ('push') and the target branches.",
    expected: `
# .github/workflows/main.yml (simplified example)
name: Web Service CI/CD

on:
  push:
    branches: [main]

jobs:
  # ... pipeline stages will go here
`,
    analog_example: `
# Analog Example: Automated Coffee Brewing System Configuration
# This configures when the coffee machine should start brewing.

trigger:
  event: "morning_alarm"
  time: "07:00 AM"
  condition: "kitchen_occupancy_sensor_active"

actions:
  # ... brewing steps will go here
`,
    deepDiveLabel: "Why is an automated trigger so important?",
    deepDive: {
      hook: `Imagine you're building a complex web application with a team of developers. Every day, multiple team members push their code changes. If you had to manually remember to run a script to build the application, then another script to run tests, and then yet another script to deploy it to a testing server, what would happen? You'd inevitably forget, or run the wrong script, or run it out of order. Bugs would slip through, deployments would be inconsistent, and the entire team would waste valuable time waiting for manual processes or debugging issues that could have been caught earlier. The sheer cognitive load and potential for human error would cripple your development velocity. This is the pain that automated triggers alleviate, transforming a chaotic manual process into a reliable, hands-off operation.`,
      pain: `⚠️ **Lesson:** Manual initiation of development workflows is a significant source of errors, delays, and developer frustration. Symptom: Inconsistent builds, missed test runs, and delayed feedback on code quality, leading to a build-up of technical debt and slower delivery cycles.`,
      mentalModel: `**Mental model:** The "Always-On Sentry." Think of the trigger as a vigilant sentry standing guard over your codebase. The moment a predefined event occurs (like a new commit to a specific branch), the sentry immediately springs into action, initiating the entire automated workflow. It doesn't sleep, it doesn't forget, and it doesn't get distracted. This ensures that every single change is subjected to the same rigorous process, providing immediate feedback and maintaining a high standard of quality without requiring human intervention to start the process.`,
      discover: `**Pattern - Trigger Configuration:**
\`\`\`yaml
on:
  push:
    branches:
      - main
      - feature/* # Also trigger on pushes to any feature branch
  pull_request:
    branches: [main] # Trigger for pull requests targeting main
\`\`\`
-   **\`on:\`**: This top-level key defines the events that will cause the workflow to run.
-   **\`push:\`**: Specifies that the workflow should run when code is pushed to the repository.
-   **\`branches:\`**: Under \`push:\`, this filters which branches will trigger the workflow. Here, it's configured for the \`main\` branch.
-   **\`pull_request:\`**: An alternative event type, triggering when a pull request is opened or updated. This is often used for pre-merge checks.`,
      quickRules: `**Quick rules:**
-   ✅ Always define triggers for relevant events (e.g., push, pull_request).
-   ✅ Specify target branches to control when the pipeline runs (e.g., \`main\`, \`develop\`).
-   ✅ Use wildcard patterns (e.g., \`feature/*\`) for broader branch matching where appropriate.
-   ✅ Consider different triggers for different environments (e.g., \`main\` for production, \`develop\` for staging).
-   ❌ Never rely solely on manual triggers for core CI/CD workflows.
-   ❌ Avoid triggering on *all* branches indiscriminately, as this can waste resources.
-   ❌ Don't forget to configure triggers for pull requests to validate changes *before* merging.`,
      watchOut: `👀 **Watch out:** Be careful with overly broad triggers, such as triggering on *every* branch or *every* tag, as this can lead to excessive resource consumption and slow down your CI/CD system. Conversely, too narrow triggers might miss important changes. Always balance automation with efficiency. Also, ensure your trigger configuration is version-controlled alongside your code.`,
      dryRun: `🔁 **Think:** A developer pushes a commit to their \`feature/new-dashboard\` branch.
1.  The CI/CD system detects the \`push\` event.
2.  It checks the \`on: push: branches:\` configuration.
3.  If \`feature/new-dashboard\` is *not* listed (e.g., only \`main\` is listed), the pipeline *does not* run.
4.  If the developer then merges \`feature/new-dashboard\` into \`main\` and pushes, the system detects the \`push\` to \`main\`.
5.  It checks the \`on: push: branches:\` configuration.
6.  Since \`main\` *is* listed, the pipeline *is triggered*.
(Hint: The pipeline only runs when the branch specified in the trigger configuration receives a push.)`,
      build: `**Learning focus:** Configure the initial trigger for the CI/CD pipeline, ensuring it automatically starts on pushes to the main branch.`,
    },
  },
  {
    id: "step2",
    type: "question",
    phase: "Step 2 of 5",
    paal: "Once the pipeline is triggered, the first logical step is to prepare our application. This usually involves installing dependencies and compiling the code. How would you add a 'build' job with steps to install Node.js dependencies and then build the application?",
    hint: "Think about defining a new job, giving it a name, and then listing the commands to execute as 'steps'.",
    example_code: `
# .github/workflows/main.yml (simplified example)
name: Web Service CI/CD

on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Set up Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
      - name: Install dependencies
        run: npm install
      - name: Build application
        run: npm run build
`,
    think_prompt: "Which option correctly defines a 'build' job with steps for installing dependencies and building the application?",
    mc_options: [
      "job: build: tasks: - install - build",
      "jobs: build: steps: - run: npm install - run: npm run build",
      "pipeline: build_stage: actions: install_deps, build_app",
    ],
    mc_correct_option: "jobs: build: steps: - run: npm install - run: npm run build",
    mc_anchor: "jobs:",
    why_this_matters: "A consistent build process ensures that the application can always be compiled and its dependencies managed reliably, forming the foundation for all subsequent quality checks and deployments.",
    answer_keywords: ["jobs", "build", "steps", "run", "npm install", "npm run build"],
    seed_code: `
# .github/workflows/main.yml (simplified example)
name: Web Service CI/CD

on:
  push:
    branches: [main]

jobs:
  # ... pipeline stages will go here
`,
    starter_code: `
# .github/workflows/main.yml (simplified example)
name: Web Service CI/CD

on:
  push:
    branches: [main]

jobs:
  # Add the 'build' job here, including steps for installing dependencies and building the application.
  # Remember to include 'uses: actions/checkout@v4' and 'actions/setup-node@v4' for a complete setup.
`,
    feedback_correct: "Spot on! Defining a 'build' job under 'jobs:' with 'steps:' that execute 'npm install' and 'npm run build' correctly sets up the initial preparation phase of our pipeline.",
    feedback_partial: "You've correctly identified the need for 'npm install' and 'npm run build', but ensure these are nested correctly under 'steps:' within a 'build' job, and that each command uses the 'run:' keyword.",
    feedback_wrong: "The syntax 'job: build: tasks:' is not standard. CI/CD configurations typically use 'jobs:' to define individual jobs, and 'steps:' to list the commands or actions within each job, using 'run:' for shell commands.",
    expected: `
# .github/workflows/main.yml (simplified example)
name: Web Service CI/CD

on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Set up Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
      - name: Install dependencies
        run: npm install
      - name: Build application
        run: npm run build
`,
    analog_example: `
# Analog Example: Automated Coffee Brewing System Configuration - Brewing Process
# This defines the steps to actually brew the coffee.

actions:
  brew_coffee:
    machine: "espresso_maker_v2"
    steps:
      - name: Grind beans
        command: "grinder --fine 20g"
      - name: Tamp grounds
        command: "tamper --pressure 30lb"
      - name: Extract espresso
        command: "espresso_machine --shot-time 25s --volume 30ml"
      - name: Add hot water (for Americano)
        command: "water_dispenser --temp 90C --volume 120ml"
`,
    deepDiveLabel: "What's the significance of a dedicated build stage?",
    deepDive: {
      hook: `Imagine a chef trying to cook a meal without first gathering all the ingredients and preparing them. They'd be constantly stopping to chop vegetables, measure spices, or find utensils, leading to a chaotic and inefficient cooking process. Similarly, in software, if every subsequent step (like testing or deployment) had to individually figure out how to get the source code, install its dependencies, and compile it, the entire pipeline would be incredibly slow, redundant, and error-prone. A dedicated build stage centralizes these preparatory tasks, creating a consistent, ready-to-use output that all downstream stages can rely on, much like a well-organized mise en place for a chef.`,
      pain: `⚠️ **Lesson:** Inconsistent or manual build processes introduce variability and inefficiency into the development workflow. Symptom: "Works on my machine" syndrome, build failures in later stages due to missing dependencies, and wasted time recompiling or reinstalling dependencies repeatedly.`,
      mentalModel: `**Mental model:** The "Factory Floor Assembly Line." Think of the build stage as the initial part of a factory assembly line where raw materials are transformed into standardized components. Here, your source code (raw material) is fetched, dependencies are installed (parts are gathered), and the code is compiled (components are assembled). The output is a consistent, ready-to-use artifact (a sub-assembly) that can then be passed down the line for quality control (testing) and final packaging (deployment). This ensures that every subsequent station on the assembly line receives a uniform product, streamlining the entire manufacturing process.`,
      discover: `**Pattern - Build Job:**
\`\`\`yaml
jobs:
  build:
    runs-on: ubuntu-latest # Specifies the environment for the job
    steps:
      - uses: actions/checkout@v4 # Action to check out your repository code
      - name: Set up Node.js # Descriptive name for the step
        uses: actions/setup-node@v4
        with:
          node-version: '20' # Specify the Node.js version
      - name: Install dependencies
        run: npm install # Executes a shell command
      - name: Build application
        run: npm run build # Executes another shell command
\`\`\`
-   **\`jobs:\`**: The top-level key for defining all jobs in the workflow.
-   **\`build:\`**: The unique identifier for this specific job.
-   **\`runs-on:\`**: Specifies the operating system environment where the job will run (e.g., \`ubuntu-latest\`, \`windows-latest\`).
-   **\`steps:\`**: A sequence of tasks to be executed within this job. Each step can be a shell command (\`run:\`) or a reusable action (\`uses:\`).`,
      quickRules: `**Quick rules:**
-   ✅ Always include a step to check out the code from your repository.
-   ✅ Explicitly define the runtime environment (e.g., Node.js version, Python version).
-   ✅ Cache dependencies (e.g., \`node_modules\`) between runs to speed up subsequent builds.
-   ✅ Ensure your build command is robust and handles potential errors gracefully.
-   ❌ Never hardcode sensitive credentials directly in build scripts.
-   ❌ Avoid running tests or deployments within the build stage; keep concerns separated.
-   ❌ Don't rely on manual local environment configurations; the pipeline should be self-contained.`,
      watchOut: `👀 **Watch out:** Long-running dependency installations or build commands can significantly slow down your pipeline. Consider optimizing your dependency graph, using caching mechanisms provided by your CI/CD platform, or parallelizing build steps if possible. Also, ensure your build environment matches your target deployment environment as closely as possible to prevent "works on my machine" issues.`,
      dryRun: `🔁 **Think:** A developer pushes code. The trigger fires.
1.  The \`build\` job starts on an \`ubuntu-latest\` runner.
2.  \`actions/checkout@v4\` fetches the latest code from the repository.
3.  \`actions/setup-node@v4\` installs Node.js version '20'.
4.  \`npm install\` executes, downloading and installing all project dependencies into \`node_modules\`. If this fails, the job stops.
5.  \`npm run build\` executes, compiling the application source code into a deployable output (e.g., a \`dist/\` folder). If this fails, the job stops.
6.  If all steps succeed, the \`build\` job completes successfully.
(Hint: Each step must succeed for the job to continue to the next step.)`,
      build: `**Learning focus:** Implement the 'build' job, including steps for checking out code, setting up the environment, installing dependencies, and compiling the application.`,
    },
  },
  {
    id: "step3",
    type: "question",
    phase: "Step 3 of 5",
    paal: "After successfully building the application, the next critical step is to validate its quality through automated tests. We need to add steps to run unit, integration, and end-to-end (E2E) tests. How would you extend the 'build' job to include these test commands?",
    hint: "Add more 'run:' steps to the existing 'build' job, using common commands for testing.",
    example_code: `
# .github/workflows/main.yml (simplified example)
name: Web Service CI/CD

on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Set up Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
      - name: Install dependencies
        run: npm install
      - name: Build application
        run: npm run build
      - name: Run unit tests
        run: npm test -- --coverage # Example: runs unit tests with coverage
      - name: Run integration tests
        run: npm run test:integration # Example: runs integration tests
      - name: Run E2E tests
        run: npm run test:e2e # Example: runs end-to-end tests
`,
    think_prompt: "Which option correctly adds steps for unit, integration, and E2E tests to the 'build' job?",
    mc_options: [
      "steps: - run: npm test - run: npm run integration - run: npm run e2e",
      "test_stage: unit: run_tests, integration: run_tests, e2e: run_tests",
      "jobs: test: steps: - run: npm test",
    ],
    mc_correct_option: "steps: - run: npm test - run: npm run integration - run: npm run e2e",
    mc_anchor: "steps:",
    why_this_matters: "Automated testing provides immediate feedback on code quality, catching regressions and bugs early in the development cycle, which significantly reduces the cost and effort of fixing them later.",
    answer_keywords: ["steps", "run", "npm test", "npm run test:integration", "npm run test:e2e"],
    seed_code: `
# .github/workflows/main.yml (simplified example)
name: Web Service CI/CD

on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Set up Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
      - name: Install dependencies
        run: npm install
      - name: Build application
        run: npm run build
`,
    starter_code: `
# .github/workflows/main.yml (simplified example)
name: Web Service CI/CD

on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Set up Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
      - name: Install dependencies
        run: npm install
      - name: Build application
        run: npm run build
      # Add steps here to run unit, integration, and E2E tests.
`,
    feedback_correct: "Excellent! Adding 'run:' commands for 'npm test', 'npm run test:integration', and 'npm run test:e2e' within the 'build' job ensures our application is thoroughly validated after compilation.",
    feedback_partial: "You've correctly identified the need for test commands, but remember to use the 'run:' keyword for each command and ensure they are properly indented as new steps within the existing 'build' job.",
    feedback_wrong: "Creating a separate 'test' job is a valid architectural choice, but for this exercise, we're adding the test steps directly to the existing 'build' job to keep it consolidated. Also, ensure you're using 'run:' for each command.",
    expected: `
# .github/workflows/main.yml (simplified example)
name: Web Service CI/CD

on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Set up Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
      - name: Install dependencies
        run: npm install
      - name: Build application
        run: npm run build
      - name: Run unit tests
        run: npm test -- --coverage # Example: runs unit tests with coverage
      - name: Run integration tests
        run: npm run test:integration # Example: runs integration tests
      - name: Run E2E tests
        run: npm run test:e2e # Example: runs end-to-end tests
`,
    analog_example: `
# Analog Example: Automated Coffee Brewing System Configuration - Quality Control
# This defines the steps to ensure the coffee meets quality standards.

actions:
  brew_coffee:
    # ... previous steps ...
    steps:
      # ... previous steps ...
      - name: Check temperature
        command: "thermometer --target 90C --tolerance 2C"
      - name: Taste test (automated sensor)
        command: "taste_sensor --profile 'espresso_standard'"
      - name: Check volume
        command: "volume_sensor --target 30ml --tolerance 2ml"
      - name: Visual inspection (AI camera)
        command: "camera_ai --check 'crema_quality'"
`,
    deepDiveLabel: "Why are different types of tests crucial in a pipeline?",
    deepDive: {
      hook: `Imagine you're building a complex machine, say a car. You wouldn't just build the whole car and then drive it off a cliff to see if it works. Instead, you'd test individual components (engine, brakes), then sub-assemblies (engine with transmission), and finally the entire vehicle in a controlled environment. In software, relying on just one type of test (e.g., only unit tests) is like only checking if individual nuts and bolts are tight – it doesn't tell you if the engine actually starts or if the car can stop. Without a comprehensive testing strategy in your pipeline, critical flaws can easily slip through, leading to embarrassing bugs in production, frustrated users, and costly emergency fixes.`,
      pain: `⚠️ **Lesson:** Inadequate or incomplete automated testing leads to undetected bugs and regressions. Symptom: Bugs discovered late in the development cycle, frequent production incidents, and a lack of confidence in deploying new features.`,
      mentalModel: `**Mental model:** The "Layered Security System." Think of different test types as layers in a security system, each designed to catch different kinds of threats. Unit tests are like individual door locks, checking small, isolated components. Integration tests are like checking if the doors and windows are sealed and the alarm system works together. End-to-end tests are like a full security patrol, simulating a real intruder's path through the entire building. Each layer provides a different level of assurance, and together they form a robust defense against defects, ensuring that the system is secure from various angles.`,
      discover: `**Pattern - Test Steps:**
\`\`\`yaml
jobs:
  build:
    # ...
    steps:
      # ... build steps ...
      - name: Run unit tests
        run: npm test # Fast, isolated checks of small code units
      - name: Run integration tests
        run: npm run test:integration # Verify interactions between components
      - name: Run E2E tests
        run: npm run test:e2e # Simulate user behavior across the entire application
\`\`\`
-   **Unit Tests**: Focus on the smallest testable parts of an application, like individual functions or methods, in isolation. They are fast and provide immediate feedback on code correctness.
-   **Integration Tests**: Verify that different modules or services used in your application work together correctly. They ensure that the interfaces between components are functioning as expected.
-   **End-to-End (E2E) Tests**: Simulate real user scenarios across the entire application stack, from the UI to the database. They are slower but provide the highest confidence that the whole system works as intended.
-   **Test Coverage**: Often, testing steps will also collect code coverage metrics to ensure a sufficient portion of the codebase is being tested.`,
      quickRules: `**Quick rules:**
-   ✅ Prioritize fast-running unit tests for immediate feedback on code changes.
-   ✅ Include integration tests to verify component interactions and data flow.
-   ✅ Implement E2E tests for critical user journeys to ensure overall system health.
-   ✅ Ensure tests are deterministic and reliable (not "flaky").
-   ❌ Never skip testing stages, even for minor changes.
-   ❌ Avoid overly complex or slow unit tests that behave like integration tests.
-   ❌ Don't rely solely on manual testing; automate as much as possible.`,
      watchOut: `👀 **Watch out:** Flaky tests (tests that sometimes pass and sometimes fail without any code change) are a major productivity killer. They erode trust in the pipeline and lead to developers ignoring failures. Invest time in making your tests reliable. Also, ensure your tests run in an isolated environment to prevent interference from previous runs or other tests.`,
      dryRun: `🔁 **Think:** The build job has successfully compiled the application.
1.  The \`Run unit tests\` step executes \`npm test\`.
2.  If all unit tests pass, the job proceeds. If any fail, the job immediately stops and marks the pipeline as failed.
3.  Assuming unit tests passed, the \`Run integration tests\` step executes \`npm run test:integration\`.
4.  If all integration tests pass, the job proceeds. If any fail, the job immediately stops and marks the pipeline as failed.
5.  Assuming integration tests passed, the \`Run E2E tests\` step executes \`npm run test:e2e\`.
6.  If all E2E tests pass, the \`build\` job completes successfully. If any fail, the job immediately stops and marks the pipeline as failed.
(Hint: Each test type acts as a gate; failure at any gate stops the entire pipeline.)`,
      build: `**Learning focus:** Add automated test steps (unit, integration, E2E) to the 'build' job to ensure comprehensive code quality validation.`,
    },
  },
  {
    id: "step4",
    type: "question",
    phase: "Step 4 of 5",
    paal: "After our application is built and thoroughly tested, we need to package it into a deployable artifact. This artifact should be stored so it can be used by subsequent deployment stages. How would you add a step to create and upload a build artifact, specifically the 'dist' folder containing our compiled application?",
    hint: "Look for an action that handles uploading artifacts, specifying the path and a name for the artifact.",
    example_code: `
# .github/workflows/main.yml (simplified example)
name: Web Service CI/CD

on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Set up Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
      - name: Install dependencies
        run: npm install
      - name: Build application
        run: npm run build
      - name: Run unit tests
        run: npm test -- --coverage
      - name: Run integration tests
        run: npm run test:integration
      - name: Run E2E tests
        run: npm run test:e2e
      - name: Upload build artifact
        uses: actions/upload-artifact@v4
        with:
          name: web-app-dist
          path: dist/ # The folder containing our compiled application
`,
    think_prompt: "Which option correctly uses an action to upload the 'dist/' folder as an artifact named 'web-app-dist'?",
    mc_options: [
      "upload: artifact: dist/, name: web-app-dist",
      "steps: - uses: actions/upload-artifact@v4 with: name: web-app-dist path: dist/",
      "save_output: folder: dist/, as: web-app-dist",
    ],
    mc_correct_option: "steps: - uses: actions/upload-artifact@v4 with: name: web-app-dist path: dist/",
    mc_anchor: "uses: actions/upload-artifact@v4",
    why_this_matters: "Creating and storing deployable artifacts ensures that the exact same tested code is deployed to all environments, preventing 'works on my machine' issues and ensuring consistency.",
    answer_keywords: ["steps", "uses", "actions/upload-artifact@v4", "with", "name", "web-app-dist", "path", "dist/"],
    seed_code: `
# .github/workflows/main.yml (simplified example)
name: Web Service CI/CD

on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Set up Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
      - name: Install dependencies
        run: npm install
      - name: Build application
        run: npm run build
      - name: Run unit tests
        run: npm test -- --coverage
      - name: Run integration tests
        run: npm run test:integration
      - name: Run E2E tests
        run: npm run test:e2e
`,
    starter_code: `
# .github/workflows/main.yml (simplified example)
name: Web Service CI/CD

on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Set up Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
      - name: Install dependencies
        run: npm install
      - name: Build application
        run: npm run build
      - name: Run unit tests
        run: npm test -- --coverage
      - name: Run integration tests
        run: npm run test:integration
      - name: Run E2E tests
        run: npm run test:e2e
      # Add a step here to upload the 'dist/' folder as an artifact named 'web-app-dist'.
`,
    feedback_correct: "Perfect! Using 'actions/upload-artifact@v4' with the correct 'name' and 'path' ensures that our compiled application is saved as a reusable artifact, ready for deployment.",
    feedback_partial: "You're close to uploading the artifact, but ensure you're using the correct action ('actions/upload-artifact@v4') and that the 'with:' block correctly specifies both 'name' and 'path'.",
    feedback_wrong: "The syntax 'upload: artifact:' is not recognized. We need to use a specific action, like 'actions/upload-artifact@v4', and configure it with 'name' and 'path' parameters under a 'with:' block.",
    expected: `
# .github/workflows/main.yml (simplified example)
name: Web Service CI/CD

on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Set up Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
      - name: Install dependencies
        run: npm install
      - name: Build application
        run: npm run build
      - name: Run unit tests
        run: npm test -- --coverage
      - name: Run integration tests
        run: npm run test:integration
      - name: Run E2E tests
        run: npm run test:e2E
      - name: Upload build artifact
        uses: actions/upload-artifact@v4
        with:
          name: web-app-dist
          path: dist/ # The folder containing our compiled application
`,
    analog_example: `
# Analog Example: Automated Coffee Brewing System Configuration - Packaging
# This defines the step to package the brewed coffee for delivery.

actions:
  brew_coffee:
    # ... previous steps ...
    steps:
      # ... previous steps ...
      - name: Package coffee
        command: "packaging_machine --container 'cup' --lid 'secure'"
      - name: Label package
        command: "label_printer --text 'Freshly Brewed' --barcode 'XYZ123'"
      - name: Store for delivery
        command: "conveyor_belt --destination 'delivery_staging_area'"
`,
    deepDiveLabel: "Why is artifact creation a separate, crucial step?",
    deepDive: {
      hook: `Imagine a factory producing a product. If each quality control station and each shipping department had to re-manufacture the product from scratch, the process would be incredibly wasteful, slow, and prone to inconsistencies. What if the second manufacturing run introduced a subtle defect that wasn't present in the first? This is precisely why factories create a single, verified product that then moves through subsequent stages. In software, if your deployment stage rebuilds the application, you lose the guarantee that the code deployed is *exactly* what was tested. This can lead to "it worked in CI, but not in production" scenarios, causing immense debugging headaches and undermining the entire purpose of your automated testing.`,
      pain: `⚠️ **Lesson:** Rebuilding code at deployment time or using inconsistent build outputs leads to deployment failures and "works on my machine" issues. Symptom: Discrepancies between tested and deployed code, difficulty reproducing bugs, and wasted resources on redundant builds.`,
      mentalModel: `**Mental model:** The "Sealed, Certified Package." Think of the build artifact as a sealed, tamper-proof package that has been certified by all the previous quality checks (build and test stages). Once this package is created, it is immutable – it cannot be changed. Any subsequent stage, like deployment, simply takes this exact package and moves it to its destination. This ensures that what was built and tested is precisely what gets deployed, eliminating variables and guaranteeing consistency across environments.`,
      discover: `**Pattern - Artifact Upload:**
\`\`\`yaml
jobs:
  build:
    # ...
    steps:
      # ... test steps ...
      - name: Upload build artifact
        uses: actions/upload-artifact@v4 # Action to upload files as artifacts
        with:
          name: web-app-dist # A unique name for your artifact
          path: dist/ # The path to the files/folder to upload
          retention-days: 7 # Optional: how long to keep the artifact
\`\`\`
-   **Artifact**: A file or collection of files produced by a CI/CD pipeline, intended for use by later stages or for download.
-   **Immutability**: Once an artifact is created, it should not be modified. This ensures that the exact same tested code is deployed.
-   **Versioning**: Artifacts are often implicitly versioned by the pipeline run ID or explicitly with a semantic version.
-   **Storage**: CI/CD platforms typically provide a way to store these artifacts, making them accessible to other jobs or for manual download.`,
      quickRules: `**Quick rules:**
-   ✅ Always create a single, immutable artifact from a successful build.
-   ✅ Name your artifacts clearly and consistently for easy identification.
-   ✅ Store artifacts in a location accessible to deployment jobs.
-   ✅ Consider artifact retention policies to manage storage costs.
-   ❌ Never rebuild the application in a deployment stage; always use the pre-built artifact.
-   ❌ Avoid modifying an artifact after it has been created and tested.
-   ❌ Don't include sensitive credentials directly within the artifact itself.`,
      watchOut: `👀 **Watch out:** Ensure that your artifact includes *all* necessary files for deployment (e.g., compiled code, static assets, configuration files, but *not* \`node_modules\` if they are installed on the target server). Incorrectly packaged artifacts can lead to runtime errors in deployed environments. Also, be mindful of artifact size, as very large artifacts can slow down uploads and downloads.`,
      dryRun: `🔁 **Think:** The build job has successfully passed all tests.
1.  The \`Upload build artifact\` step executes \`actions/upload-artifact@v4\`.
2.  It looks for the directory specified by \`path: dist/\`.
3.  It bundles all contents of the \`dist/\` directory into a compressed file.
4.  It uploads this compressed file to the CI/CD platform's artifact storage, naming it \`web-app-dist\`.
5.  The \`build\` job completes, and the artifact is now available for download by other jobs or manually.
(Hint: The artifact is a snapshot of the application's deployable output at a specific point in the pipeline.)`,
      build: `**Learning focus:** Add a step to create and upload a deployable artifact (the 'dist' folder) from the successful build.`,
    },
  },
  {
    id: "step5",
    type: "question",
    phase: "Step 5 of 5",
    paal: "Finally, with our tested artifact ready, we can automate its deployment to a staging environment. This typically involves downloading the artifact and then executing a deployment script. How would you add a new 'deploy-staging' job that depends on the 'build' job, downloads the 'web-app-dist' artifact, and then runs a deployment script?",
    hint: "Think about defining a new job, specifying its dependency, and using actions to download the artifact and run a script.",
    example_code: `
# .github/workflows/main.yml (simplified example)
name: Web Service CI/CD

on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Set up Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
      - name: Install dependencies
        run: npm install
      - name: Build application
        run: npm run build
      - name: Run unit tests
        run: npm test -- --coverage
      - name: Run integration tests
        run: npm run test:integration
      - name: Run E2E tests
        run: npm run test:e2e
      - name: Upload build artifact
        uses: actions/upload-artifact@v4
        with:
          name: web-app-dist
          path: dist/

  deploy-staging:
    needs: build # This job depends on the 'build' job
    runs-on: ubuntu-latest
    steps:
      - name: Download build artifact
        uses: actions/download-artifact@v4
        with:
          name: web-app-dist
          path: ./app-to-deploy # Download to a specific path
      - name: Deploy to staging
        run: |
          echo "Deploying web-app-dist to staging environment..."
          # In a real scenario, this would involve SCP, SSH, or a deployment tool
          ls -l ./app-to-deploy # Verify artifact is present
          # ./deploy-script.sh ./app-to-deploy # Example deployment script
          echo "Deployment to staging complete!"
`,
    think_prompt: "Which option correctly defines a 'deploy-staging' job that depends on 'build', downloads the artifact, and runs a deployment command?",
    mc_options: [
      "jobs: deploy-staging: depends_on: build: steps: - download: web-app-dist - run: deploy.sh",
      "jobs: deploy-staging: needs: build: steps: - uses: actions/download-artifact@v4 with: name: web-app-dist - run: echo 'Deploying...'",
      "deploy_to_staging: after: build: actions: get_artifact, run_deploy_script",
    ],
    mc_correct_option: "jobs: deploy-staging: needs: build: steps: - uses: actions/download-artifact@v4 with: name: web-app-dist - run: echo 'Deploying...'",
    mc_anchor: "jobs: deploy-staging:",
    why_this_matters: "Automated deployment to staging provides a consistent, up-to-date environment for testing and review, accelerating feedback cycles and reducing the risk of manual deployment errors.",
    answer_keywords: ["jobs", "deploy-staging", "needs", "build", "steps", "uses", "actions/download-artifact@v4", "with", "name", "web-app-dist", "run", "echo 'Deploying...'"],
    seed_code: `
# .github/workflows/main.yml (simplified example)
name: Web Service CI/CD

on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Set up Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
      - name: Install dependencies
        run: npm install
      - name: Build application
        run: npm run build
      - name: Run unit tests
        run: npm test -- --coverage
      - name: Run integration tests
        run: npm run test:integration
      - name: Run E2E tests
        run: npm run test:e2e
      - name: Upload build artifact
        uses: actions/upload-artifact@v4
        with:
          name: web-app-dist
          path: dist/
`,
    starter_code: `
# .github/workflows/main.yml (simplified example)
name: Web Service CI/CD

on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Set up Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
      - name: Install dependencies
        run: npm install
      - name: Build application
        run: npm run build
      - name: Run unit tests
        run: npm test -- --coverage
      - name: Run integration tests
        run: npm run test:integration
      - name: Run E2E tests
        run: npm run test:e2e
      - name: Upload build artifact
        uses: actions/upload-artifact@v4
        with:
          name: web-app-dist
          path: dist/

  # Add the 'deploy-staging' job here.
  # It should depend on the 'build' job, download the 'web-app-dist' artifact,
  # and then include steps to simulate deployment to a staging environment.
`,
    feedback_correct: "Fantastic! Defining 'deploy-staging' with 'needs: build', using 'actions/download-artifact@v4' for 'web-app-dist', and including a 'run:' command for deployment correctly sets up our automated staging deployment.",
    feedback_partial: "You've correctly identified the need for a 'deploy-staging' job and its dependency, but ensure you're using 'actions/download-artifact@v4' with the correct artifact 'name' and that the deployment command is a 'run:' step.",
    feedback_wrong: "The syntax 'depends_on:' is not standard. We use 'needs:' to specify job dependencies. Also, ensure you're using the correct action for downloading artifacts and a 'run:' command for the deployment script.",
    expected: `
# .github/workflows/main.yml (simplified example)
name: Web Service CI/CD

on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Set up Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
      - name: Install dependencies
        run: npm install
      - name: Build application
        run: npm run build
      - name: Run unit tests
        run: npm test -- --coverage
      - name: Run integration tests
        run: npm run test:integration
      - name: Run E2E tests
        run: npm run test:e2e
      - name: Upload build artifact
        uses: actions/upload-artifact@v4
        with:
          name: web-app-dist
          path: dist/

  deploy-staging:
    needs: build # This job depends on the 'build' job
    runs-on: ubuntu-latest
    steps:
      - name: Download build artifact
        uses: actions/download-artifact@v4
        with:
          name: web-app-dist
          path: ./app-to-deploy # Download to a specific path
      - name: Deploy to staging
        run: |
          echo "Deploying web-app-dist to staging environment..."
          # In a real scenario, this would involve SCP, SSH, or a deployment tool
          ls -l ./app-to-deploy # Verify artifact is present
          # ./deploy-script.sh ./app-to-deploy # Example deployment script
          echo "Deployment to staging complete!"
`,
    analog_example: `
# Analog Example: Automated Coffee Brewing System Configuration - Delivery
# This defines the steps to deliver the packaged coffee to a customer.

actions:
  deliver_coffee:
    needs: brew_coffee # This action depends on the 'brew_coffee' action
    vehicle: "delivery_drone_v1"
    steps:
      - name: Load packaged coffee
        command: "robot_arm --pickup 'delivery_staging_area' --load 'drone_cargo_bay'"
      - name: Fly to customer address
        command: "drone_navigation --destination 'customer_address_XYZ'"
      - name: Drop off coffee
        command: "drone_delivery --release 'cargo_bay'"
      - name: Confirm delivery
        command: "drone_sensor --check 'package_delivered_status'"
`,
    deepDiveLabel: "What are the benefits of automated deployment to staging?",
    deepDive: {
      hook: `Imagine a scenario where every time a new feature is ready for review, someone has to manually log into a server, copy files, restart services, and then notify the QA team. This process is not only tedious and time-consuming but also highly susceptible to human error – a forgotten file, a typo in a command, or an incorrect server configuration can lead to hours of debugging. The QA team might be testing an outdated version, or worse, a broken one. This manual bottleneck slows down the entire development cycle, delays feedback, and creates friction between teams. Automated deployment to staging eliminates this pain, ensuring that a fresh, consistent, and working version of the application is always available for testing and review.`,
      pain: `⚠️ **Lesson:** Manual deployment processes are slow, error-prone, and create bottlenecks in the delivery pipeline. Symptom: Inconsistent staging environments, delayed feedback for QA and stakeholders, and increased risk of deployment-related bugs.`,
      mentalModel: `**Mental model:** The "Automated Showroom." Think of the staging environment as a dedicated showroom where the latest version of your product is always on display, impeccably set up and ready for inspection. Automated deployment is the process of instantly updating this showroom with the newest, fully tested model as soon as it's ready from the factory (your CI/CD pipeline). This ensures that reviewers, testers, and stakeholders always see the most current and stable version, allowing them to provide rapid feedback without any manual setup or delays, much like a car dealership always having the latest models ready for test drives.`,
      discover: `**Pattern - Deploy Job:**
\`\`\`yaml
jobs:
  deploy-staging:
    needs: build # Ensures 'build' job completes successfully first
    runs-on: ubuntu-latest
    environment: staging # Optional: links to environment-specific secrets
    steps:
      - name: Download build artifact
        uses: actions/download-artifact@v4 # Action to download previously uploaded artifacts
        with:
          name: web-app-dist # The name of the artifact to download
          path: ./app-to-deploy # The local path where the artifact will be downloaded
      - name: Deploy to staging
        run: |
          # Commands to deploy the application to your staging server
          # e.g., using SSH, a cloud provider CLI, or a deployment tool
          echo "Deploying artifact to staging..."
          # scp -r ./app-to-deploy/* user@staging-server:/var/www/html/
          # ssh user@staging-server "sudo systemctl restart web-service"
          echo "Deployment complete."
\`\`\`
-   **\`needs:\`**: Specifies that this job will only run after the listed jobs (here, \`build\`) have completed successfully. This creates a dependency chain.
-   **\`environment:\`**: (Optional) Links the job to a specific environment, allowing for environment-specific secrets and protection rules.
-   **\`actions/download-artifact@v4\`**: Retrieves an artifact that was uploaded by a previous job in the same workflow.
-   **Deployment Script**: The \`run:\` command executes the actual deployment logic, which can vary widely depending on the target environment and infrastructure.`,
      quickRules: `**Quick rules:**
-   ✅ Always deploy the *exact* artifact produced by the build and test stages.
-   ✅ Ensure the deployment job has the necessary permissions and credentials (stored securely).
-   ✅ Use environment-specific configurations for staging (e.g., database connections, API keys).
-   ✅ Implement rollback mechanisms or blue/green deployments for zero-downtime updates.
-   ❌ Never deploy directly to production without additional gates (e.g., manual approval, more extensive testing).
-   ❌ Avoid hardcoding sensitive credentials directly in the deployment script.
-   ❌ Don't skip validation steps after deployment (e.g., health checks, smoke tests).`,
      watchOut: `👀 **Watch out:** Security is paramount in deployment. Ensure that credentials used for deployment are stored securely (e.g., as encrypted secrets in your CI/CD platform) and are only accessible to the deployment job. Also, consider adding post-deployment smoke tests or health checks to verify that the application is running correctly in the staging environment immediately after deployment.`,
      dryRun: `🔁 **Think:** The \`build\` job has completed successfully, and the \`web-app-dist\` artifact is available.
1.  The \`deploy-staging\` job starts because its \`needs: build\` dependency is met.
2.  The \`Download build artifact\` step executes \`actions/download-artifact@v4\`.
3.  It downloads the \`web-app-dist\` artifact from storage to the local path \`./app-to-deploy\` on the runner.
4.  The \`Deploy to staging\` step executes the \`echo "Deploying..."\` command. In a real scenario, this would transfer the contents of \`./app-to-deploy\` to the staging server and restart services.
5.  If the deployment commands succeed, the \`deploy-staging\` job completes successfully, and the application is now live in staging. If any command fails, the job stops and marks the pipeline as failed.
(Hint: The 'needs' keyword ensures sequential execution and dependency satisfaction.)`,
      build: `**Learning focus:** Create a 'deploy-staging' job that depends on the 'build' job, downloads the artifact, and automates deployment to a staging environment.`,
    },
  },
];

const sideItems = [
  { label: "Lesson", id: "intro" },
  { label: "Objectives", id: "objectives" },
  { label: "Step 1: Trigger", id: "step1" },
  { label: "Step 2: Build Stage", id: "step2" },
  { label: "Step 3: Test Stage", id: "step3" },
  { label: "Step 4: Artifact Stage", id: "step4" },
  { label: "Step 5: Deploy Stage", id: "step5" },
];

export default createINPACTEngine({
  NODES,
  sideItems,
  lessonNum: 0,
  title: "Setting up a Basic CI/CD Pipeline",
  shortName: "CI/CD Pipeline",
});
