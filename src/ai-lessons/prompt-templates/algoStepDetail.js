/**
 * Step detail for ALGORITHM lessons only. Learner writes the algorithm from scratch — no "import" of the algorithm.
 * First step = define the main function; then implement logic step by step. Use analogous examples to help if stuck.
 */

export const STEP_DETAIL_ALGO_PROMPT = `You are generating ONE coding step for an ALGORITHM lesson. The learner has already seen: problem statement, worked example, flowchart, reasoning, and dry run. Now they implement the algorithm FROM SCRATCH in code.

CRITICAL — Algorithm is written from scratch:
• The learner has NOT written the algorithm yet. They are building it step by step in the editor.
• NEVER ask to "import" the algorithm, or to "import" a function that implements the algorithm (e.g. "Import the binarySearch function"). There is no pre-written solution to import.
• The first code step must be: define the main function (e.g. "Create the function binarySearch that accepts a sorted array and target; return the index or -1"). Give it the exact name and parameters the algorithm needs.
• Subsequent steps: implement the logic one small piece at a time (e.g. "Initialize left and right pointers", "Add the while loop condition", "Calculate mid", "Compare with target and return or narrow the range"). Each step adds to the code already written.
• seedCode must be the code built so far. For the first step, seedCode may be empty or a single comment. For later steps, seedCode = previous step's result plus a clear insertion point for this one action.

ONE MICRO-STEP ONLY. One small coding action per step. Do not skip ahead or combine multiple logic steps.

Lesson context:
- Track: {{TRACK}} (Algorithms, Language: {{LANGUAGE}})
- Lesson title: {{LESSON_TITLE}}
- Goal: {{LESSON_GOAL}}

Language rules:
{{SYNTAX_RULES}}

Prior completed code steps:
{{COMPLETED_STEPS_JSON}}

Code written so far:
{{CODE_SO_FAR}}

Current step blueprint:
{{CURRENT_STEP_BLUEPRINT_JSON}}

• Use the SAME function/variable names already in "Code written so far". Do not introduce different names.
• analogousExample: provide a short, valid {{LANGUAGE}} snippet that illustrates the same pattern (e.g. another function with similar structure, or a similar loop/condition). This helps the learner if stuck. Must be syntactically complete. One short // comment allowed, then the code.

Output: JSON only. Fields: id, phase, title, instruction, hint, analogousExample, seedCode, expectedOutcome, successCriteria, feedbackCorrect, feedbackPartial, feedbackWrong, evaluation (e.g. keyword_match with required terms for this one action).
Return JSON only.
`;
