# Progress

Last updated: 2026-11-01 (end of Session 3)

## In one line

Courier's Atlas has a working foundation, a data-driven level engine, and **13 playable units** (2 foundations + 10 in zones 1–3 for Packet Valley, plus 2 for Algo Archipelago). Packet Valley zones 4–7 and all other Algo Archipelago zones are still to build.

## Build plan status

Following `docs/two-day-build-plan.md`.

| Session | Scope | Status |
|---|---|---|
| 1 | Foundation and redesign (name, story bible, level flow v2, two regions) | Done |
| 2 | Activity engine, unit player, content checker, sample unit | Done |
| 3 | Packet Valley zones 1–3 (10 units) | Done |
| 4 | Packet Valley zones 4–7 (12 units) | Not started |
| 5 | Algo Archipelago zones 0–3 (10 units) | Not started |
| 6 | Algo Archipelago zones 4–7 (14 units) | Not started |
| 7 | Launch: batch link check, verify list, smoke test, README, GitHub Pages | Not started |

## What is playable now

**Packet Valley** (Internet Technologies)

| Zone | Units |
|---|---|
| 0 Town Square | 0.1 Layer Cake, 0.2 Encapsulation Express |
| 1 Wire Woods | 1.1 Delay Dash, 1.3 Signal Studio, 1.4 Channel Limits |
| 2 Frame Farm | 2.1 Frame Fences, 2.2 Bug Detectives, 2.3 CRC Mill, 2.5 Window Waltz |
| 3 Crowded Plaza | 3.1 ALOHA Party, 3.2 Listen Before You Talk, 3.4 Hidden Hills |

**Algo Archipelago** (Algorithms and Complexity)

| Zone | Units |
|---|---|
| 0 Lighthouse Point | 0.1 Lighthouse Keeper's Toolkit, 0.2 Growth Race |

**Still "Coming soon" (optional levels):** Packet Valley 0.3, 1.2, 1.5, 2.4, 3.3, 3.5. Algo Archipelago zone 8 (Far Horizon) is skipped on purpose and shown as "Coming later".

## What the engine can do

- Level flow: everyday moment → 2–4 lesson pages (with "Go deeper" and references) → activities → debrief.
- Activity types: choice (optionally with a wave picture), order, match, buckets, numeric (with an on-screen calculator), step simulator.
- Step Sim views: array, bars and graph. Modes: watch, predict, count.
- Optional Challenge activities that never cost stars; clearing one gives a bonus.
- Daily Feed (spaced repetition) and Field Journal.
- Progress and stars saved in the browser, with a Reset progress button and a safe fallback if storage fails.
- English and Bahasa Indonesia interface; level text is English only for now.
- Content checker: `node tools/check-content.mjs` (Node 22+, no packages).
- Test page for every activity type at `#/sample`.

## Quality checks so far

- Content checker: no errors. Only warnings are 5 over-length lesson pages in the older zone-0 levels (115–127 words).
- All 10 new units (zones 1–3) were played end to end in headless Chrome: 3/3 stars, Challenge cleared, no JavaScript errors.
- All 41 new reference links return HTTP 200.
- Every worked number in the maths units was computed by a script.

## Known gaps

- Not yet played by hand, with keyboard only, or with a screen reader.
- Phone width has been checked for the sample unit only.
- Level text has no Indonesian version yet (falls back to English). Old translations are kept in `private/id-levels-v1/`.
- Zone-0 lessons are a little long and should be trimmed.
- The graph view leaves empty vertical space.
- The sample unit's HUD title reads "sample Sample unit".

## Facts waiting for the correctness reviewer

Everything marked `"verify": true`. Run `node tools/check-content.mjs` for the full list. From Session 3, one Field Note per unit:

- 1.1 Sydney–London distance and round-trip time
- 1.3 QAM sizes in Wi-Fi 6 and Wi-Fi 7
- 1.4 Shannon's 1948 date and the "close to the limit" claim
- 2.1 PPP flag 7E and the escape byte
- 2.2 Weak IP checksum; IPv6 has no header checksum
- 2.3 Ethernet CRC-32 is 4 bytes; bad frames are dropped
- 2.5 TCP window growth (slow start)
- 3.1 ALOHAnet in 1971 and its link to Ethernet
- 3.2 Why Wi-Fi uses collision avoidance
- 3.4 When Wi-Fi uses RTS/CTS

Older items also still open: region fun facts, TCP/IP link-layer wording, the tunnelling Field Note link (Cloudflare blocks automated checks), the 64-byte frame note, the segment vs datagram note, the physical-layer preamble note, the message-queue and algorithm Field Notes, and the Bonaventure licence.

## Git and GitHub

- Repo: `cesinata/packet-valley`.
- Session 1 is pushed. Session 2 and 3 commits (`df863a2`, `c6cdc93`, `5e2f27e`, `610eea7`, `5e0de11`) are local only and not yet pushed.

## Later (not scheduled)

- Indonesian translation of all level text.
- Trim over-length zone-0 lessons.
- "Re-read this page" button driven by `taughtOn`.
- Optional levels 1.2, 1.5, 2.4, 3.3, 3.5.
- Replace code-drawn sprites with CC0 art, if wanted.
