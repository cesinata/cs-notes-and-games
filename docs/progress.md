# Progress

Last updated: 2026-11-02 (end of Session 4)

## In one line

Courier's Atlas has a working foundation, a data-driven level engine, and **26 playable units**: all 24 core units of Packet Valley, plus 2 for Algo Archipelago. Packet Valley's core path is finished. Algo Archipelago zones 1–7 are still to build.

## Build plan status

Following `docs/two-day-build-plan.md`.

| Session | Scope | Status |
|---|---|---|
| 1 | Foundation and redesign (name, story bible, level flow v2, two regions) | Done |
| 2 | Activity engine, unit player, content checker, sample unit | Done |
| 3 | Packet Valley zones 1–3 (10 units) | Done |
| 4 | Packet Valley zones 4–7 (12 units) | Done |
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
| 4 Router Ranch | 4.1 Two Kinds of Post, 4.2 Address Orchard, 4.4 Shortest Trail, 4.5 Rumour Mill |
| 5 Harbour of Ports | 5.1 Dock Numbers, 5.2 The Handshake, 5.5 Traffic Jam |
| 6 Market Street | 6.1 Name Finder, 6.2 Web Waiter |
| 7 Castle Keep | 7.1 Secret Notes, 7.3 Key Pairs, 7.4 Seal of Approval |

**Algo Archipelago** (Algorithms and Complexity)

| Zone | Units |
|---|---|
| 0 Lighthouse Point | 0.1 Lighthouse Keeper's Toolkit, 0.2 Growth Race |

**Still "Coming soon" (optional levels):** Packet Valley 0.3, 1.2, 1.5, 2.4, 3.3, 3.5, 4.3, 4.6, 5.3, 5.4, 6.3–6.5, 7.2, 7.5. The Grand Delivery (final level) is also not built. Algo Archipelago zone 8 (Far Horizon) is skipped on purpose and shown as "Coming later".

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

- Glossary words (like "server", "message") get extra spacing when they appear inside Match buttons. Seen in 5.2. Worth fixing in 4b.
- The graph view puts the "waiting" tag over a road number in 4.4 (B and the 7). Minor.
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

## Session 4 facts for the reviewer

One Field Note per unit is marked verify where unsure: 4.5 (OSPF/RIP/BGP summary), 5.1 (client port ranges), 5.2 (RFC 6528 summary), 5.5 (CUBIC as Linux default), 6.1 (13 root names, A to M), 6.2 (418 teapot, 1998), 7.1 (Caesar's shift of three), 7.3 (RSA 1977, earlier secret discovery, 2,048-bit keys), 7.4 (padlock wording). Also the 7.4 toy hash is deliberately weak and is labelled as a toy.

## Git and GitHub

- Repo: `cesinata/packet-valley`.
- Session 1 is pushed. Sessions 2 to 4 are local only and not yet pushed (run `git push`).

## Later (not scheduled)

- Indonesian translation of all level text.
- Trim over-length zone-0 lessons.
- "Re-read this page" button driven by `taughtOn`.
- Optional levels 1.2, 1.5, 2.4, 3.3, 3.5.
- Replace code-drawn sprites with CC0 art, if wanted.
