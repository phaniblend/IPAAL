/**
 * One-off live patch — QuoteEstimateDesk never had per-task prose descriptions or a real
 * "how this product works" overview. Same gap as ReviewReplyInbox (see
 * fix-reviewreplyinbox-descriptions.mjs), found live 2026-09-03 a second time when the user
 * applied fresh and got matched into this product.
 *
 * Run once: node scripts/fix-quoteestimatedesk-descriptions.mjs
 */
import "dotenv/config";
import { updateIssueDescription, updateProjectDescription } from "../server/onedev-client.js";

const PROJECT_ID = 23; // QuoteEstimateDesk — confirmed via GET /~api/projects

const PRODUCT_OVERVIEW = `QuoteEstimateDesk turns a scattered quoting process into one place to send, track, and win work.

1. Create: Send a quote with a client, total, and how long it stays valid — no more texting a price and hoping it's remembered.
2. Track: The system automatically marks each quote as open, expired, or accepted — nobody updates that by hand.
3. Review: Switch to the accepted view to see exactly what's actually been won, without digging through pending or expired quotes.`;

const TASK_DESCRIPTIONS = [
  {
    issueId: 469, // #1 Build quote list and create-estimate form
    description:
      "A contractor quoting a job by text or phone has no record of what was actually promised. Build the screen every estimate starts from: a list of quotes already sent, and a form to create a new one with the client, total, and how long it stays valid.",
  },
  {
    issueId: 470, // #2 Implement quotes API with open/expired/accepted status
    description:
      "Whether a quote is still open, has expired, or was accepted shouldn't be something anyone tracks by hand — it should be computed from the quote's own valid-until date and an accepted flag, never trusted straight from the client. Build the API that stores quotes and derives that status itself.",
  },
  {
    issueId: 471, // #3 Build quote line-items list and add-line form
    description:
      "A single total on a quote doesn't tell the client what they're actually paying for — a real estimate breaks the price into labor, materials, and whatever else makes up the job. Build the screen that lists a quote's line items and lets the contractor add another one.",
  },
  {
    issueId: 472, // #4 Implement quote-lines API blocking duplicate labels
    description:
      "Two line items both called \"Labor\" on the same quote is confusing for the client reading it and risks double-charging by accident. Build the API that rejects a second line with the same label on the same quote as a conflict, not a silent duplicate.",
  },
  {
    issueId: 473, // #5 Build accepted-quotes board filtered by status
    description:
      "A contractor checking what work is actually locked in doesn't want to scroll past every quote that's still pending or already expired — they want to see exactly what's been accepted. Build a filtered view that narrows the full quote list down to just the accepted ones, without losing the rest.",
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
  if (storyIdx === -1) return `${proseLine}\n\n${existingDescription}`;
  lines.splice(storyIdx + 1, 0, proseLine);
  return lines.join("\n");
}

async function main() {
  console.log(`Updating project ${PROJECT_ID} (QuoteEstimateDesk) description...`);
  await updateProjectDescription(PROJECT_ID, "QuoteEstimateDesk", PRODUCT_OVERVIEW);
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
