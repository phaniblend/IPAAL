/**
 * Run Stage 1+2+3 (spec -> screens/APIs -> tasks) for a batch of real product concepts, locally,
 * independent of live OneDev access — same Stage 1-3 functions run-specforge-product.mjs uses for
 * one product, looped here for a whole candidate slate. Deliberately stops before tutorial
 * drafting/module generation: that stage is slow and Gemini-reliability-limited (see
 * scripts/run-specforge-product.mjs's own history), and isn't needed to answer "what are this
 * product's real tasks" — only to answer "what teaches each task," a separate, slower pass.
 *
 *   node scripts/run-specforge-batch.mjs
 *
 * Writes one JSON file per product (scripts/_batch-output/<slug>.json) plus a summary printed to
 * stdout. Each file has {stage1, stage2, tasks} — everything needed to run tutorial drafting +
 * module generation for that product later, without re-spending the Stage 1-3 calls.
 */
import "dotenv/config";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { runStages1And2, runTaskBreakdown } from "../src/specforge/pipeline.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.join(__dirname, "_batch-output");
fs.mkdirSync(OUT_DIR, { recursive: true });

const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;
if (!DEEPSEEK_API_KEY) throw new Error("DEEPSEEK_API_KEY not set");

const PRODUCTS = [
  {
    product_name: "SignSlip",
    description:
      "A lightweight e-signature tool: send a document to one signer, track whether it's pending or signed, and get a timestamped signed copy back. No workflow builder, no multi-party routing, no templates library — just send, sign, done.",
    target_users: ["Freelancer sending a single contract", "Small shop owner collecting a signed waiver or agreement"],
    business_goal: "Get one document signed and tracked without paying per-envelope or per-seat fees for a full e-signature platform.",
    constraints: ["One signer per document — no multi-party routing", "No template library, no branding customization", "List + form + one derived pending/signed status, same grain as the rest of the seed"],
  },
  {
    product_name: "DealBoard",
    description:
      "A simple CRM: a contact list and a deal pipeline board with stages (new, contacted, won, lost). No automation, no email sequences, no reporting dashboards — just who you're talking to and where each deal stands.",
    target_users: ["Solo salesperson or small business owner tracking a handful of live deals"],
    business_goal: "See every contact and deal stage in one place without paying per-seat for a full CRM's automation and reporting tiers.",
    constraints: ["No automation, sequences, or scoring", "One pipeline, fixed stage set", "List + form + board grain, same as the rest of the seed"],
  },
  {
    product_name: "AskForm",
    description:
      "A minimal form builder: create a form with a few fields, share a link, and see responses in a list. No conditional logic, no payment collection, no design themes — just ask a question and collect answers.",
    target_users: ["Small business owner collecting intake info, RSVPs, or simple feedback"],
    business_goal: "Collect structured responses without hitting a paid tier's response cap or losing form branding to a free-tier watermark.",
    constraints: ["No conditional logic or branching", "No payment fields", "List of forms + create-form + response log, same grain as the rest of the seed"],
  },
  {
    product_name: "OneInbox",
    description:
      "A shared team inbox: incoming messages land in one list, anyone on the team can claim/assign one to themselves, and mark it resolved. No canned responses, no SLAs, no multi-channel routing — one inbox, one status per message.",
    target_users: ["Small team (2-6 people) sharing a support or contact inbox"],
    business_goal: "Give a small team one shared queue without per-seat help-desk pricing that scales badly under 5 people.",
    constraints: ["Single inbox, no multi-channel routing", "No canned responses or SLA timers", "List + assign action + resolved status, same grain as the rest of the seed"],
  },
  {
    product_name: "CardBoard",
    description:
      "A minimal project board: cards move across a fixed set of status columns (todo, in progress, done). No automations, no custom workflows, no time tracking — just a board and cards.",
    target_users: ["Small team coordinating a handful of concurrent tasks"],
    business_goal: "Track work on a simple board without per-seat pricing and feature-gated automations aimed at larger teams.",
    constraints: ["Fixed column set, no custom workflows", "No automations or integrations", "List/board + card form + status column grain, same as the rest of the seed"],
  },
  {
    product_name: "ShipCheck",
    description:
      "An order fulfillment tracker: log orders, move them through a status board (received, packed, shipped), and attach one fulfillment note per order. No inventory sync, no multi-channel listings — just tracking an order to done.",
    target_users: ["Small online seller fulfilling orders by hand"],
    business_goal: "Track fulfillment status without stacking a paid storefront-app fee on top of an existing platform's own cut.",
    constraints: ["No inventory sync or multi-channel listing", "One fulfillment note per order, not a full activity log", "List + form + status board grain, same as the rest of the seed"],
  },
  {
    product_name: "NoteBlast",
    description:
      "A minimal email-send tool: a subscriber list, one reusable template, and a send log showing what went out and when. No automation sequences, no segmentation, no A/B testing — just send an update to your list.",
    target_users: ["Small business owner sending occasional updates to a customer list"],
    business_goal: "Send updates to a subscriber list without hitting a subscriber-count pricing cliff on a full email marketing platform.",
    constraints: ["One template, no automation sequences or segmentation", "No A/B testing or analytics dashboards", "List + form + send log grain, same as the rest of the seed"],
  },
  {
    product_name: "QuoteSend",
    description:
      "A simple proposal tool: build a proposal with line items, send it, and track its status (sent, viewed, accepted). No e-signature integration, no payment collection, no templates library — just send a proposal and see what happened to it.",
    target_users: ["Freelancer or small service business sending project proposals"],
    business_goal: "Track proposal status without per-user and per-document fees on a full proposal/e-signature platform.",
    constraints: ["No e-signature or payment integration", "No template library", "List + line items + status board grain, same as the rest of the seed"],
  },
  {
    product_name: "RenewalWatch",
    description:
      "A contract renewal tracker: log recurring contracts (software, leases, services) with renewal dates, and see which are expiring soon. No document storage, no e-signature — just dates and a warning list.",
    target_users: ["Freelancer or small business owner juggling several recurring vendor contracts"],
    business_goal: "Never miss a renewal window without per-seat contract-management software built for a legal or procurement team.",
    constraints: ["No document storage or e-signature", "One derived expiring-soon status, no custom alert rules", "List + form + filtered view grain, same as the rest of the seed"],
  },
  {
    product_name: "TaxSetAside",
    description:
      "A tax set-aside tracker for freelancers: log invoices as they're paid, and see a running suggested tax set-aside amount plus which invoices still need their set-aside made. No filing, no accounting integration — just a savings-tracking companion.",
    target_users: ["Freelancer or solo contractor paying quarterly estimated taxes"],
    business_goal: "Avoid an end-of-year tax surprise without a full accounting platform's monthly subscription and higher-tier tax features.",
    constraints: ["No filing or accounting-software integration", "One fixed set-aside percentage rule, not full tax calculation", "List + derived set-aside status grain, same as the rest of the seed"],
  },
  {
    product_name: "FollowerWatch",
    description:
      "A follower-count tracker for small businesses on social media: log follower counts per profile over time and flag unusual jumps or drops. No scheduling, no content calendar, no auto-posting — just watching the numbers.",
    target_users: ["Small business owner managing a few social profiles without a marketing team"],
    business_goal: "Catch follower-count red flags without per-profile fees on a full social media management suite.",
    constraints: ["No scheduling or auto-posting", "One fixed change-threshold rule for flagging, not custom analytics", "List + form + flagged-profiles filtered view grain, same as the rest of the seed"],
  },
  {
    product_name: "ShowRate",
    description:
      "A meeting attendance tracker for service providers: log scheduled meetings, mark attendance, and see which clients are repeat no-shows. No scheduling/booking itself — just the attendance record and a risk flag.",
    target_users: ["Consultant, coach, or service provider scheduling client meetings"],
    business_goal: "Spot repeat no-show clients without paying for a full scheduling platform's reporting/analytics tier.",
    constraints: ["Not a booking/scheduling tool itself — attendance tracking only", "One fixed no-show-count threshold for the at-risk flag", "List + form + filtered at-risk view grain, same as the rest of the seed"],
  },
];

console.log(`=== Running Stage 1-3 for ${PRODUCTS.length} products ===\n`);

const summary = [];
for (const product of PRODUCTS) {
  const slug = product.product_name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  const start = Date.now();
  try {
    const { stage1, stage2 } = await runStages1And2(product, DEEPSEEK_API_KEY);
    const tasks = await runTaskBreakdown(stage1, stage2, DEEPSEEK_API_KEY);
    const codingCount = tasks.filter((t) => t.trade === "Coding").length;
    const nonCodingCount = tasks.length - codingCount;

    fs.writeFileSync(path.join(OUT_DIR, `${slug}.json`), JSON.stringify({ product, stage1, stage2, tasks }, null, 2), "utf8");

    const secs = Math.round((Date.now() - start) / 1000);
    console.log(`✓ ${product.product_name}: ${tasks.length} tasks (${codingCount} Coding, ${nonCodingCount} other) — ${secs}s`);
    summary.push({ name: product.product_name, ok: true, taskCount: tasks.length, codingCount, nonCodingCount, secs });
  } catch (err) {
    const secs = Math.round((Date.now() - start) / 1000);
    console.error(`✗ ${product.product_name} FAILED (${secs}s): ${err.message}`);
    summary.push({ name: product.product_name, ok: false, error: err.message, secs });
  }
}

console.log(`\n=== Summary ===`);
console.log(JSON.stringify(summary, null, 2));
const okCount = summary.filter((s) => s.ok).length;
const totalTasks = summary.reduce((s, r) => s + (r.taskCount || 0), 0);
console.log(`\n${okCount}/${PRODUCTS.length} products succeeded, ${totalTasks} total tasks generated.`);
