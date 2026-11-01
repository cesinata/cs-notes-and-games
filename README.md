# Courier's Atlas

Cozy pixel puzzles that teach how computers and the internet really work, written for students about 15 and up
(with optional "Go deeper" parts for university level). You play Kit, a new courier. Each subject is a region on
the atlas, with its own map, story and short levels (8–10 minutes each).

Two regions so far:

- **Packet Valley** (Internet Technologies): carry one letter across a valley and learn every layer of the internet on the way.
- **Algo Archipelago** (Algorithms and Complexity): island-hop through how to organise data, count the cost of a method, and choose a smarter one.

It started as a way to re-learn a university networking subject and an algorithms subject. All the
explanations, stories and puzzles are original. No course materials are included.

## Play it locally

The game uses JavaScript modules, which browsers won't run from a file opened directly. Start a tiny
local server from this folder instead:

```
python3 -m http.server 8000
```

Then open http://localhost:8000 in your browser. Press Ctrl+C in the terminal to stop the server.

## Where things live on the site

- `#/` is the main page: about the project, how a level works, and a card for each subject.
- `#/net/` is Packet Valley and `#/algo/` is Algo Archipelago. Each has its own map, Daily Feed (`feed`) and Field Journal (`journal`).
- Older links without a region (like `#/zone/0` or `#/feed`) are sent to the matching page under `#/net/`.

## Languages

The game is in **English** and **Bahasa Indonesia**. Pick a language with the buttons at the top of the main page
or a region's map. The choice is remembered on that device, and the first visit follows the browser's language.

- Technical terms (like *network*, *data link*, *dynamic programming*) stay in English on purpose. They are listed
  in `content/glossary.json`, and the game marks them so a browser translator can't change them.
- In Indonesian text, an English term is followed by its Indonesian meaning the first time, like "layer (lapisan)".
- Indonesian files live in `content/id/`, with the same names as the English ones. They only need the lines that
  change. Anything missing shows in English. The writing style is casual (*kamu*), short, and keeps English terms.
- Level texts (`zone-0.json`) are being rewritten in a new format, so for now they show in English. The Indonesian version comes back after that.
- Buttons and labels are in `content/ui.json` (English) and `content/id/ui.json` (Indonesian).

## What's built so far

- Main page (with one big fact per subject), region maps with fun facts, saved progress (stars) and a "Reset progress" button for each region
- Packet Valley, Town Square: **0.1 Layer Cake** and **0.2 Encapsulation Express**
- Packet Valley, Wire Woods: **1.1 Delay Dash**, **1.3 Signal Studio**, **1.4 Channel Limits**
- Packet Valley, Frame Farm: **2.1 Frame Fences**, **2.2 Bug Detectives**, **2.3 CRC Mill**, **2.5 Window Waltz**
- Packet Valley, Crowded Plaza: **3.1 ALOHA Party**, **3.2 Listen Before You Talk**, **3.4 Hidden Hills**
- Algo Archipelago, Lighthouse Point: **0.1 Lighthouse Keeper's Toolkit** and **0.2 Growth Race**
- A new level flow: an everyday moment, 2 to 4 story lessons (each with References and an optional "Go deeper"), the activities, then a debrief
- Field Notes, collected in the Field Journal
- Daily Feed: about 10 bite-size review cards a day from finished levels, with spaced repetition
- Step Sim: runs an algorithm one step at a time, as crates, bars or a graph of nodes and edges
- Unit player: a level can be written entirely as data (an `activities` list in its content file), using the activity types choice, order, match, buckets, numeric (with an on-screen calculator) and stepsim. A test page for all of them is at `#/sample`
- Content checker: `node tools/check-content.mjs` checks every content file (needs Node 22 or newer, no packages)

## Editing the text

All the words players see live in `content/`, so you can change them without touching code:

- `content/landing.json`: the main page
- `content/ui.json`: buttons and labels. `content/glossary.json`: terms that stay in English
- `content/id/`: the Indonesian version of any of these files
- `content/regions.json`: the list of regions (subjects) and their descriptions
- `content/<region>/world.json`: district names, map positions, the planned level list, and the "Did you know?" fun facts (`funFacts`, 3 to 5) shown at the top of the region page
- `content/<region>/zone-N.json`: everything for that district's levels (Kit's job, everyday moment, lesson pages, puzzle text, hints, debrief, Field Notes, feed cards). The Read more list is built from the lesson pages' references

`<region>` is `net` or `algo`.

If you break the JSON (a missing comma, say), the game shows an error naming the file and the problem
instead of a blank page. Facts that need checking are marked `"verify": true` with a `"verifyNote"`.

## How the code is organised

```
index.html            the page that loads the game
css/style.css         all the styles
js/main.js            starts the game, switches between pages by web address
js/landing.js         the main page
js/hub.js             a region's map and district pages
js/engine/            shared parts: level template, saving, stars, sprites, content checks, languages (i18n.js)
js/levels/net/        one file per Packet Valley level (index.js lists them)
js/levels/algo/       one file per Algo Archipelago level
content/              all player-facing text
docs/                 design notes
```

## Credits and licences

Code: MIT. Written content: CC BY 4.0. See `LICENSE` and `CREDITS.md`.
