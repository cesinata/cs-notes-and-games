# Design notes

Decisions we've made, so we stay consistent as the game grows.

## Stars (js/engine/progress.js)
- 3 stars: no mistakes and no hints. 2 stars: up to 2 mistakes. 1 star: finished.
- No timers. Using a hint doesn't count as a mistake, but it costs the third star.
- The best result is kept; replaying never lowers your stars.

## Unlocking (js/engine/progress.js)
- Town Square is always open.
- A district opens when every **core** level in the district before it has at least 1 star.
- All levels inside an open district can be played in any order.
- A district with no levels built yet shows "Being built".

## Hints
- Each step has two hints: a gentle nudge, then a clearer one.
- The first mistake on a step shows hint 1, the second shows hint 2.
- The HUD's Hint button shows the next unused hint.

## Content
- Level titles appear in `world.json` (the plan) and in the zone file (the built level). The zone file wins.
- Text that needs checking: write it as `{ "text": "...", "verify": true, "verifyNote": "why" }`.
- Every level ends with a Read more list. It is built automatically from the References on its lesson pages (de-duplicated).

## Level flow and content format v2
- **Everyday moment** (a familiar scene and a question) → **Story lessons** (2 to 4 pages) → **Play** → **Debrief**.
- A level in `zone-N.json` has: `id`, `title`, `story` (Kit's job), `everyday` (`scene`, `question`, `answer`), `lessons`, `play`, `feed`, `fieldNotes`, `debrief`.
- A lesson page has: `id`, `title`, `text` (paragraphs, about 60 to 90 words in total), optional `terms` (words to know), `diagram` (a picture the level's file draws) or `table`, `diagramCaption`, `predict` (think first, then open), `deeper` ("Go deeper", optional, never needed for stars), and `references` (at least one, https links only).
- **Teach, then test:** every question, Feed card and activity has `taughtOn`: the id of the lesson page that taught it. In `play`, a section can set it once for everything inside, and stages built in code use a key like `rankTaughtOn`. `js/engine/content.js` checks that each one points to a real page.
- **Challenge:** optional bonus questions (harder, with `Go deeper` ideas). Mistakes and hints there never cost stars. Clearing it adds a small "Challenge cleared" mark.
- Written for about age 15 to 18: every term defined when first used, no maths beyond everyday algebra on the main path.

## Data-driven levels and activities (js/engine/unit-player.js)
- A level can skip level code: give it an `activities` list in its content file and the unit player runs it. The four hand-built levels keep their own files.
- Every activity has `id`, `type`, `prompt`, `hints` (exactly 2: a nudge, then a clearer one), `explain` and `taughtOn`. Add `"challenge": true` for optional bonus work (these must come last, and never cost stars).
- Types: **choice** (`options`, one `correct`), **order** (`items` in the correct order; the game shuffles), **match** (`pairs` of `left`/`right`, 3 to 6), **buckets** (`buckets` names and `items` with a `bucket`), **numeric** (`answer`, optional `tolerance` or `tolerancePercent`, `unit`, `calculator: false` to hide the calculator) and **stepsim** (`mode`: watch, predict or count, and a `script`).
- Order, match and buckets work by tapping or keyboard, never drag only. Right and wrong show ✓ / ✗ and words.
- The calculator (js/engine/calc-eval.js) does + − × ÷, ^, mod, brackets, √ and log₂ without using eval. The numeric answer box accepts sums too, like `2^10 - 24`.
- Step Sim graph view: `nodes` (`id`, `x` 0 to 300, `y` 0 to 180, `label`, `mark`: current, visited or queued) and `edges` (`from`, `to`, `weight`, `mark`: used or skipped). Marks use ring shapes, a tick and a word under the node, so colour is never the only signal.
- `#/sample` plays `content/sample-unit.json`, a test unit with every activity type. It is not linked from the menus and records no stars.

- A `choice` activity or a lesson page can show a wave picture with `wave: { bits, kind }` (kind: ask, fsk or psk). The calculator understands the constant `e`.
- The Step Sim array view can hide its index numbers (`hideIndex`), and a graph step can carry its own `legend` text, for pictures that aren't about visiting nodes.

## Content checker (tools/check-content.mjs)
- Run `node tools/check-content.mjs` (Node 22 or newer, no packages). It uses the same rules as the game (`js/engine/content-rules.js`).
- Errors stop the game loading a file. Warnings (lesson page length, a lesson nothing tests, translations with a different list length) are worth a look. It ends with the list of `verify` items.
- It does not check that links open. That is one batch near launch.

## Level 0.2: the router hut
- Added beyond the brief: a router stop between the two houses, so the player *does* the
  "routers only unwrap to the network layer" idea instead of just reading it.
- The debrief says "a plain router" because NAT boxes do look at ports (covered in Zone 4).

## Accessibility
- Every interactive thing is a real button or link (mouse, touch and keyboard all work).
- Right and wrong are shown with ✓ / ✗ and words, not just colour.
- The map is decorative; the same districts are listed as text below it.
- Animations switch off when the device asks for reduced motion.
- Dark mode follows the device setting.

## Everyday moments and Field Notes
- Each level opens with an **everyday moment**: a familiar scene plus a question the player can't answer yet.
  The debrief answers it straight after the summary, so the curiosity pays off.
- Each level has 2 **Field Notes**: where the idea shows up in today's apps and networks, with a source link.
  They unlock when the level is finished (1+ star) and collect in the **Field Journal** (`#/journal`).
- Locked notes show their title only, so players can see what's waiting.
- Field Notes follow the same rules as all content: own words, link sources, `verify` anything uncertain.

## Daily Feed (js/feed.js, js/engine/feed-schedule.js)
- A swipe-through stack of bite-size cards, shaped like a social feed but with a **natural end**:
  up to 8 practice cards plus up to 2 Field Notes, then "Done for today".
- Only cards from finished levels appear. Card types: **quiz**, **why** (pick the reason) and
  **predict** (think, flip, then say honestly whether you got it).
- **Spaced repetition:** each card has a box from 0 to 4. Right → up a box, waiting 1, 2, 4, 7 or 14 days.
  Wrong → box 0, it comes back once more later in the session, and again tomorrow, even if the retry is right.
- **Streak:** days in a row with a finished session. A missed day silently restarts at day 1. We never
  show a "streak lost" message. This is deliberate: guilt keeps people scrolling, not learning.
- Card ids (like "0.1-f3") must never change, or saved progress won't match the card.
- Swipe left for the next card on touch screens. A "Next card" button always works too.

## Regions (one per subject)
- `content/regions.json` lists the regions. Each one lives under its own route: Packet Valley at `#/net/`, Algo Archipelago at `#/algo/`.
- `#/` is the main page (Courier's Atlas): what the project is, how a level works, and a card per subject.
  Its words are in `content/landing.json`.
- Old links with no region (`#/zone/0`, `#/level/0.1`, `#/feed`, `#/journal`) are redirected to `#/net/...`.
- Each region has its own world file, content folder (`content/net/`, `content/algo/`) and level folder (`js/levels/net/`, `js/levels/algo/`).
- Progress is saved per region (keys like `net:0.1` and `algo:0.1`). Old saves upgrade automatically.
  "Reset progress" only resets the region you're in.
- The region links (with an "All subjects" link) are always shown, so someone studying only algorithms can go straight there.
  (The brief suggests the ferry leaves from Harbour of Ports, but that district is locked until late in Packet Valley.)
- No public text names a university or a subject code. Subjects are described in plain words
  ("Internet Technologies", "Algorithms and Complexity"). The planning briefs are private (in `private/`, which is gitignored).

## Step Sim (js/engine/step-sim.js)
- Runs an algorithm one step at a time. A level builds a "script" (a list of steps with a picture and a sentence).
- Views built so far: **array** (crates, with text pointers like "top", "front", "comparing") and **bars**.
  The tree, graph and table views will be added with the islands that need them.
- Modes: **watch** (Back/Next), **predict** (guess each marked step: a hint first, then the answer),
  **count** (predict a total, then run and compare).

## Languages (js/engine/i18n.js)
- English and Bahasa Indonesia. The choice is saved on the device (`pocketAtlas.lang`); the first visit follows the browser.
- Reader assumed: intermediate English. So technical terms stay English, and the first mention carries the Indonesian
  meaning in brackets: "layer (lapisan)". Tone is casual (*kamu*).
- `content/glossary.json` lists terms that always stay English. `el()` wraps them in `translate="no"` spans, so a
  browser translator leaves them alone (this also helps people who translate the English version).
- An Indonesian file `content/id/<same path>` is laid over the English one: objects merge by key, lists whose items
  have an `id` merge by id, other lists are replaced whole. Missing lines fall back to English.
- Place and level names (Town Square, Layer Cake) are story names and stay English. Topics and descriptions are translated.
- Button and label text is in `content/ui.json`, read with `t('key')`. The content-error screen stays English
  (it's for whoever edits the files).
- Level files still hold a few English labels (diagram captions, tray names). They move into level content during the
  lessons rework, and get translated with the levels.
- Progress ids (`net:0.1`) are the same in every language, so stars carry over.
