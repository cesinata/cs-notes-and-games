# Two-day build plan (Claude Pro + Claude Code)

**For Cesilia and Claude Code.** Save this as `docs/two-day-build-plan.md`. Read it with CLAUDE.md, `docs/research-and-references.md` and the redesign prompt.

Rules that still apply: no subject codes, no university or campus names, everything in our own words, and plan first, then wait for "yes".

---

## 0. Decisions already made

- **Umbrella name:** **Courier's Atlas.** Each subject is a region (a page of the atlas). The networking region stays "Packet Valley" and the algorithms region stays "Algo Archipelago". Use this name unless Cesilia changes it.
- **Far Horizon** (greedy algorithms and P vs NP) is **skipped for now**, because it may be outside the subject's scope. Hide it from the map, or show it as "Coming later".
- **Main audience: high-school students (about 15–18),** with university-level depth kept in "Go deeper" sections. See §3a.

---

## 1. Reality check (read this first)

The original plan was about 80 hand-built puzzle levels across 17 zones, each with its own custom code. That's weeks of work. It isn't possible in 2 days on a Pro plan.

What *is* realistic is **full coverage with less custom code**:

- **Every zone of both subjects gets playable content,** built from a small set of reusable activity types.
- **Each level becomes a "unit": mostly content (JSON), not code.** Claude Code builds the activity engine **once**. After that, every new unit is just a content file it writes from the subject briefs, and the briefs already contain the facts and original worked examples.
- **Core levels only** (46 units). Optional levels, the two final levels and polish come later.
- **The 4 levels already built stay as they are,** as the "deluxe" examples.

**What decides whether 2 days is enough:** Pro usage is a shared pool across Claude chat and Claude Code. It resets on a rolling window, and there's also a weekly limit. Anthropic doesn't publish a fixed prompt count. Check yours under **Settings → Usage**, or with `/status` in Claude Code.

- **If you run out mid-session:** wait for the reset, or turn on extra usage in your settings.
- **If you still run short, cut in this order** (see §7):
  1. Field Notes
  2. Feed cards
  3. The third unit in big zones

---

## 2. How to make your usage go furthest

These come from Anthropic's own guidance for Claude Code:

1. **`/clear` between tasks.** Every message resends the whole conversation so far. Start each session (and each zone) fresh. CLAUDE.md and the files stay available.
2. **Use `/compact`** when you're mid-task and the conversation is getting long.
3. **Stay on Sonnet** (the default) for almost everything. Use a stronger model only to plan the engine. Opus uses much more of your quota, if it's available to you at all. `/model` shows your options.
4. **Point at file paths; don't paste files.** Avoid the `@file` shortcut when saving usage, because it loads the whole file.
5. **Ask for a short plan before big changes.** A plan is cheap; a wrong 10-file edit is expensive.
6. **Keep CLAUDE.md lean** (under about 200 lines). It's sent with every message.

On top of those, the plan below saves usage by design:

7. **Split the briefs into small per-zone files once** (Session 1). Later sessions read only the zone they're writing (a few hundred lines, not 700).
8. **Freeze the content format early,** with one perfect example unit. Every later session copies that pattern instead of rethinking.
9. **Use a content checker script** so mistakes are caught for free, instead of by asking Claude to re-read everything.
10. **Check links in one batch at the end,** not one by one while writing.
11. **You playtest; Claude doesn't screenshot-test everything.** Use one quick smoke test per session.

---

## 3. The unit format (what "a level" becomes)

Every unit follows the redesign's flow:

```
Everyday moment  →  Story lessons (2–4 pages, each with References)  →  Activities (4–8)  →  Debrief
```

**Activity types.** Build these once and reuse them everywhere:

| Type | What the player does | Covers topics like |
|---|---|---|
| `choice` | Pick one answer, see why | Almost everything |
| `order` | Put items in the right order | Layers, handshakes, algorithm steps, growth rates |
| `match` | Pair items (term ↔ meaning, need ↔ tool) | Record types, ports, data structures |
| `buckets` | Sort items into 2–4 groups | Connection-oriented vs connectionless, O / Ω / Θ, greedy vs not |
| `numeric` | Type a number (with tolerance and an on-screen calculator) | Delays, Nyquist and Shannon, utilisation, subnet sizes, RSA, DP tables |
| `stepsim` | Step Sim in Watch, Predict or Count mode (exists) | Sorting, stacks, searching, CRC/XOR rows, cwnd rounds |
| `stepsim` graph view **(new)** | Nodes and edges, highlighting the visited ones | DFS, BFS, Dijkstra, distance vector, topological sort, Warshall |

**Per unit content** (keep it small):
- 1 everyday moment,
- 2–4 lesson pages,
- 4–8 activities,
- 1 common mistake,
- 4 feed cards,
- 1 Field Note,
- 2–3 Read more links.

**Every activity must trace back to a lesson page.** Add a `"taughtOn": "page-id"` field to each activity, so the checker can prove "teach before test".

---

## 3a. Writing for high-school students (one story, two depths)

**One continuous story, not separate lessons.**
- Kit, a new courier, starts in Town Square and learns the internet by delivering one letter (Packet Valley). Kit then takes the ferry to help islanders with their problems (Algo Archipelago).
- Recurring characters, small running jokes, and a tiny cliffhanger at the end of each zone ("…but the letter came back stamped *Too Big to Fit*").
- Keep all of this in **`docs/story-bible.md`** (one page: characters, places, tone, running threads). Session 1 writes it. Every content session reads it, so the story stays consistent at almost no extra cost.

**Two depths, one set of content.**
- **Main path (high school):**
  - About Year 10 reading level.
  - Every technical word is defined the first time it appears.
  - No maths beyond everyday algebra. Logs, exponents and powers of 2 are explained with pictures when first needed.
  - Formulas are introduced through a worked story example before any symbols.
- **"Go deeper" expanders (university revision):** the formal versions, such as Θ notation details, Shannon with dB, the Master Theorem, and RSA working. Optional, never needed to earn stars.
- Activities on the main path only test main-path ideas. Put harder "Go deeper" questions in a clearly labelled **Challenge** activity that's worth a bonus, not required.

**Safety and privacy, because players may be minors.**
- No accounts, no sign-ups, no analytics or trackers, no chat, no ads. Progress stays in the browser only.
- External links go only to reputable sources (§5 of the research file) and open in a new tab.
- **Security topics stay conceptual and defensive.** Explain *why* a weakness exists and how it's prevented. Never give step-by-step instructions for attacking real systems.

**Honest limits.**
- A few topics will feel hard for high schoolers even with good storytelling. For example: Shannon's formula, the Master Theorem, RSA, and dynamic programming tables. For these, the main path teaches the *idea* (what it's for, and a small worked example with a calculator), and "Go deeper" holds the full maths.
- Your clarity friend is the right tester here. If possible, also ask one real high-school student to play the first zone of each region.

---

## 4. The schedule: 7 sessions over 2 days

A "session" means one focused block of work. Each one starts with `/clear`, has one goal, and ends with a commit. If a session runs out of usage, the next one simply continues from the same prompt.

### Before you start (you, about 30 min, no Claude needed)
- [ ] Put CLAUDE.md, `docs/research-and-references.md` and this file in the repo.
- [ ] Already decided (§0): the name is Courier's Atlas, Far Horizon is skipped, and the audience is high school with "Go deeper" for university.
- [ ] `git push` a backup.

### Day 1

**Session 1: Foundation and redesign** (the biggest one)
- Landing page, new routes, no codes or campus names.
- The new level flow (everyday → lessons with references → activities → debrief).
- Content format v2. Migrate the 4 existing levels to it.
- Split the briefs into `docs/briefs/<subject>/zone-N.md`.
- Write `docs/story-bible.md` (§3a).
- Commit.

**Session 2: Activity engine and checker**
- Build the unit player, the 5 new activity types, and the Step Sim graph view.
- Write `tools/check-content.mjs`: a plain Node script with **no npm packages**, checking format, `taughtOn` links, exactly one correct answer, and that links start with https.
- Add one sample unit that uses every activity type.
- Commit.

**Session 3: Networking content, zones 1–3** (10 units)
- Wire Woods 1.1, 1.3, 1.4.
- Frame Farm 2.1, 2.2, 2.3, 2.5.
- Crowded Plaza 3.1, 3.2, 3.4.

### Day 2

**Session 4: Networking content, zones 4–7** (12 units)
- Router Ranch 4.1, 4.2, 4.4, 4.5.
- Harbour of Ports 5.1, 5.2, 5.5.
- Market Street 6.1, 6.2.
- Castle Keep 7.1, 7.3, 7.4.

**Session 5: Algorithms content, zones 0–3** (10 units)
- Lighthouse Point 0.3.
- Brute Bay 1.1, 1.2, 1.4.
- Shrinking Sands 2.1, 2.3, 2.4.
- Bridge Isles 3.1, 3.2, 3.3.

**Session 6: Algorithms content, zones 4–7** (14 units)
- Split Rock 4.1–4.4.
- Orchard Atoll 5.1, 5.3, 5.4, 5.5.
- Trade Wind Cove 6.1–6.3.
- Logbook Lagoon 7.1–7.3.

**Session 7: Finish and launch**
- Batch link check.
- Compile one `docs/verify-list.md` from every `"verify": true`.
- Run the smoke test.
- Unlock rules: core units only.
- README and screenshots.
- Deploy to GitHub Pages.

**Sessions 3–6 are content only.** Claude reads one zone brief, the format and the example unit, then writes JSON and runs the checker. It doesn't need to read the engine code. That's what makes them cheap.

---

## 5. Copy-paste prompts

### Session 1
```
/clear
Read CLAUDE.md, docs/two-day-build-plan.md (sections 1–4), docs/research-and-references.md (sections 1 and 4), and the redesign prompt I'll paste next. Then give me a short plan in bullets for Session 1 only, and wait for my "yes". Keep the 4 existing levels and saved progress working. Use the umbrella name: Courier's Atlas. Audience: high-school students, with university depth in "Go deeper" sections (see section 3a). Also write docs/story-bible.md.
```
(Then paste the redesign prompt from earlier, including item 5 about removing the campus name.)

### Session 2
```
/clear
Read docs/two-day-build-plan.md sections 3 and 4 (Session 2). Plan, then build: the unit player, the activity types choice/order/match/buckets/numeric (with an on-screen calculator), a Step Sim graph view, and tools/check-content.mjs (plain Node, no npm packages). Add one sample unit that uses every activity type, and run the checker on all content. Keep it accessible (keyboard, touch, never colour alone, reduced motion). Commit when it works.
```

### Sessions 3–6 (change the subject and zone list each time)
```
/clear
Content-only session. Read: docs/two-day-build-plan.md sections 3 and 3a, docs/story-bible.md, the content format notes, the sample unit, and ONLY these brief files: docs/briefs/<subject>/zone-<N>.md (one at a time).
For each unit in this list: <unit ids and titles>
  1. Write it in content JSON, following the sample unit exactly.
  2. Our own words; original numbers and scenarios; open with a familiar everyday moment; every activity has "taughtOn". Write the main path for high-school students (define every term, no maths beyond everyday algebra) and put university-level detail in "Go deeper" plus an optional Challenge activity. Continue the story from docs/story-bible.md, and end each zone with a small cliffhanger.
  3. References on every lesson page from docs/research-and-references.md section 5 (link only unless the licence says adapt). Mark anything uncertain "verify": true with a verifyNote.
  4. Run node tools/check-content.mjs and fix all errors.
After each zone: commit ("Add <zone> units"), then tell me in 3 lines what you added. Don't read engine code unless the checker fails because of it. If usage runs low, stop after finishing the current unit and commit.
```

### Session 7
```
/clear
Read docs/two-day-build-plan.md section 4 (Session 7). Plan, then: check every link in content/ in one batch (list broken ones; don't guess replacements), compile docs/verify-list.md from all "verify": true items grouped by subject and zone, run the smoke test, update README (no codes, no campus names), and walk me through enabling GitHub Pages. Commit.
```

---

## 6. Your job each day (about 1–2 hours)

- **After Sessions 1 and 2:** play the sample unit on your laptop *and* phone. These two sessions decide the quality of everything after them, so be picky here.
- **After each content session:** play one unit per zone (about 5 minutes each). Note anything confusing in `docs/feedback.md`, so the next session can fix it in one go.
- **After launch:** send `docs/verify-list.md` to your correctness friend, and the live link to your clarity friend.

---

## 7. If you run short: cut in this order

1. Field Notes (keep the Read more links).
2. Feed cards down to 2 per unit.
3. Big zones down to 2 units (keep the ones with calculations or algorithms).
4. Algorithms zones 6–7 (move them to "after launch").

**Never cut:** the everyday moment, the lesson references, `taughtOn`, the verify flags, or the story continuity. Those are what make it correct and trustworthy.

## 8. Later (after the 2 days)

- Optional levels.
- The final levels for both subjects.
- Deluxe hand-built puzzles for the most-played units.
- Sound and a credits page.
- Your friends' fact fixes. These always go first.
