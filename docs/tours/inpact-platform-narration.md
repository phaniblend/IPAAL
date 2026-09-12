# Inpact Platform walkthrough — narration script (v1)

Script-first pass for `public/product-tours/inpact-platform.html`, drafted 2026-09-11/12 before
building/adjusting the animation to match. Audience: an **already-registered, already-matched**
student — no Apply/registration content (cut per founder note). Grounded in the real component tree,
not an invented mockup — see the accuracy note below before treating any beat as final.

## Accuracy note (read before animating)

The "Assist option → algorithmic steps" beat is **not** on the task landing page itself. A real
commit, `6395683` *"Remove the task-page-level Assist Me entry point"*, deliberately moved it: steps
now live inside the online code editor's own sidebar, behind a **🤖 Assist Me** toggle, reachable only
after **🚀 Start Dev → Continue here online** (`src/workbench-ide/DevWorkspace.jsx`,
`src/workbench-ide/TaskStepsPanel.jsx`). This script follows the real flow, not the page layout
recalled from memory.

Also worth knowing: the real task page has **two separate "watch it first" entry points** today —
a one-line curiosity teaser right under the task title (`WalkthroughNudge`, e.g. *"Curious how the
books balance themselves before you write a line of code?"*, opening the in-app animated
`GuidedTour`/`ProductWalkthrough`), and a separate, bigger "New to `<Product>`? Watch the 2-minute
product tour" card lower on the page (opening the narrated HTML tour, e.g.
`public/product-tours/minierp.html`). This script uses the first one (`WalkthroughNudge`) since it's
positioned first on the real page — swap to the second if that's the one meant.

## The script

**Timeframe 01 — 0:00–0:45**
Introduce the task landing page. *"This is your task — #42, Build the low-stock reorder board.
Everything you need to actually build this is on this one page, top to bottom. Let's go through it
before you touch a single line of code."*

**Timeframe 02 — 0:45–1:30**
The curiosity nudge under the title. *"See this line — 'Curious how the books balance themselves
before you write a line of code?' That's not filler. Click it, and run it, before you start. It shows
you what the finished product actually does, so the task you're about to build stops feeling
abstract."*

**Timeframe 03 — 1:30–2:15**
The Product overview panel. *"Below that, this section is your plain-language explainer — what this
product is, in a few real sentences, no jargon. If the nudge above was the 'wow,' this is the
'here's actually how it works.'"*

**Timeframe 04 — 2:15–3:00**
Task description + acceptance criteria. *"This is the actual job: what you're building, and the
specific, checkable criteria your work has to satisfy. Read this twice before you open the editor —
every one of these bullets is something Check My Code will actually verify later."*

**Timeframe 05 — 3:00–3:45**
"▶ Try the mock" / inline API contract. *"Click 'Try the mock' and you'll see exactly what this screen
should look like when it's done — or, if this is a backend task, the exact request and response shape
your API needs to return. Not a guess. The real contract."*

**Timeframe 06 — 3:45–4:30**
"🚀 Start Dev" button and the choice modal. *"When you're ready, click Start Dev. You'll get two
options — work right here online, or clone it to your own editor. We're going to stay online."*

**Timeframe 07 — 4:30–5:15**
Inside the editor — the 3-pane layout. *"This is your real workspace: file tree on the left, your
code in the middle, and a live preview of what you're building on the right. This is a real clone of
the real project — nothing here is a simulation."*

**Timeframe 08 — 5:15–6:00**
The "🤖 Assist Me" toggle. *"Now here's the part you were asking about — click 'Assist Me' in the
toolbar, and this sidebar opens. This is where the algorithm is actually broken down for you."*

**Timeframe 09 — 6:00–6:45**
The "📋 Steps" panel, one step expanded. *"Every step in the list breaks the task into one small,
doable move. Click one open and you get the goal — what this step is actually for — and how — a hint
on the pattern, without just handing you the answer."*

**Timeframe 10 — 6:45–7:30**
The per-step "💡 Assist me" button. *"Still stuck on this one specific step? Click 'Assist me' right
here, on the step itself — not a generic course, help for exactly this move, right where you are."*

**Timeframe 11 — 7:30–8:15**
"✓ Check my code." *"When you think a step's done, mark it — or better, click 'Check my code.' This
reads your real, actual changed files and tells you if this step is genuinely satisfied, not just
'looks about right.'"*

**Timeframe 12 — 8:15–9:00**
The "🌿 Git" tab, commit + push. *"Once every step checks out, switch to the Git tab. Commit, push —
this goes to your real branch on your real project. From here, it's in the queue for a real engineer
to review."*

## Status

~9 minutes across 12 beats. Not yet re-animated against — `public/product-tours/inpact-platform.html`
still reflects the earlier (pre-correction) 6-chapter cut. Candidates for merging if a shorter runtime
is wanted: 09+10 (both step-panel beats), 11+12 (both wrap-up/shipping beats).
