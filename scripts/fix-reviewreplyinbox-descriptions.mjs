/**
 * One-off live patch — ReviewReplyInbox never had per-task prose descriptions or a real
 * "how this product works" overview (found live 2026-09-03: learner opened task #1 and had
 * nothing telling them what to build beyond a terse Story: phrase and a bulleted AC list).
 * scripts/seed-smb-pipeline.mjs and codingTasks.data.mjs are already fixed for future re-seeds —
 * this patches the issues/project that already exist in real OneDev, the same way
 * scripts/fix-crh-task-descriptions.mjs patched ClientReminderHub earlier this session.
 *
 * Run once: node scripts/fix-reviewreplyinbox-descriptions.mjs
 */
import "dotenv/config";
import { updateIssueDescription, updateProjectDescription } from "../server/onedev-client.js";

const PROJECT_ID = 24; // ReviewReplyInbox — confirmed via GET /~api/projects

// Hook sentence, blank line, then short `N. Label: detail` lines — Workbench.jsx's
// parseProductOverview() renders this as a bold-label numbered list, not a dense paragraph.
// Rewritten to this shape live 2026-09-03: the first version was five numbered clauses run
// together inside one paragraph — technically complete, but read as a wall of text instead of
// "how it works at a glance" for a first-time learner.
const PRODUCT_OVERVIEW = `ReviewReplyInbox collects every customer review into one inbox so your team never leaves a customer hanging.

1. Collect: Every review — from Google, Yelp, or anywhere else — lands here automatically, with its author, rating, and body.
2. Filter: Switch to "Unanswered" to instantly see exactly what still needs a reply.
3. Respond: Reply right from the inbox — the system won't let the same reply go out twice.`;

// { issueId, description } — inserted right after the `Story:` line, matching the exact
// insertion point server/specforge-router.js's buildTaskDescription() uses for the AI pipeline,
// so Workbench.jsx's humanDescription() (strips every `Key: value` line, keeps the rest) picks it
// up as the task's prose the same way either path produces it.
const TASK_DESCRIPTIONS = [
  {
    issueId: 495, // #1 Build review inbox list and log-review form
    description:
      "A salon or clinic's reviews show up scattered across Google, Yelp, and word of mouth — nothing catches them in one place yet. Build the screen every review lands on first: a list of what's already logged, and a form to log a new one the moment it comes in.",
  },
  {
    issueId: 496, // #2 Implement reviews API with needs-reply status
    description:
      "Whether a review still needs a reply shouldn't rely on anyone's memory — it should be computed straight from whether a reply exists yet. Build the API that stores reviews and derives that needs-reply flag itself, the same way a real reputation tool would.",
  },
  {
    issueId: 497, // #3 Build review replies list and write-reply form
    description:
      "Answering a review out loud on the phone leaves no trail — the owner needs a written record of what was actually said back, tied to the review it answers. Build the screen that lists existing replies and lets the owner write a new one.",
  },
  {
    issueId: 498, // #4 Implement review-replies API — one reply per channel
    description:
      "Posting the same reply twice on the same channel reads as careless to a customer scrolling past it. Build the API that accepts one reply per review per channel, and rejects a second attempt on that same pair as a conflict, not a silent duplicate.",
  },
  {
    issueId: 499, // #5 Build unanswered-reviews board filtered by status
    description:
      "An owner opening this first thing in the morning doesn't want to scroll the entire review history — they want to see exactly what's still waiting on a reply. Build a filtered view that narrows the full review list down to just the unanswered ones, without losing the rest.",
  },
];

function authHeader() {
  const user = process.env.ONEDEV_API_USER || "";
  const pass = process.env.ONEDEV_API_PASS || "";
  return "Basic " + Buffer.from(`${user}:${pass}`).toString("base64");
}

async function fetchIssue(issueId) {
  const base = (process.env.ONEDEV_INTERNAL_URL || "http://localhost:6610").replace(/\/+$/, "");
  const res = await fetch(`${base}/~api/issues/${issueId}`, { headers: { Authorization: authHeader() } });
  if (!res.ok) throw new Error(`GET issue ${issueId} failed (${res.status})`);
  return res.json();
}

function insertAfterStory(existingDescription, proseLine) {
  const lines = existingDescription.split("\n");
  const storyIdx = lines.findIndex((l) => /^Story:\s*/.test(l));
  if (storyIdx === -1) {
    // No Story: line found — fall back to prepending, rather than silently dropping the prose.
    return `${proseLine}\n\n${existingDescription}`;
  }
  lines.splice(storyIdx + 1, 0, proseLine);
  return lines.join("\n");
}

async function main() {
  console.log(`Updating project ${PROJECT_ID} (ReviewReplyInbox) description...`);
  await updateProjectDescription(PROJECT_ID, "ReviewReplyInbox", PRODUCT_OVERVIEW);
  console.log("  done.");

  for (const { issueId, description } of TASK_DESCRIPTIONS) {
    const issue = await fetchIssue(issueId);
    const lines = (issue.description || "").split("\n");
    const storyIdx = lines.findIndex((l) => /^Story:\s*/.test(l));
    const tradeIdx = lines.findIndex((l) => /^Trade:\s*/.test(l));
    const alreadyHasProse = storyIdx !== -1 && tradeIdx !== -1 && tradeIdx - storyIdx > 1;
    if (alreadyHasProse) {
      console.log(`  #${issueId} already has a prose line between Story: and Trade: — skipping.`);
      continue;
    }
    const next = insertAfterStory(issue.description || "", description);
    await updateIssueDescription(issueId, next);
    console.log(`  #${issueId} updated.`);
  }

  console.log("Done.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
