# Pocket Atlas

Cozy pixel puzzles for learning, or re-learning, how computers really work. Each subject is a region on
the atlas, with its own map, story and short puzzle levels (3–8 minutes each).

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

## What's built so far

- Main page, region maps, saved progress (stars) and a "Reset progress" button for each region
- Packet Valley, Town Square: **0.1 Layer Cake** and **0.2 Encapsulation Express**
- Algo Archipelago, Lighthouse Point: **0.1 Lighthouse Keeper's Toolkit** and **0.2 Growth Race**
- Hooks (a real-life question at the start of each level) and Field Notes, collected in the Field Journal
- Daily Feed: about 10 bite-size review cards a day from finished levels, with spaced repetition
- Step Sim: runs an algorithm one step at a time (used by Algo Archipelago)

## Editing the text

All the words players see live in `content/`, so you can change them without touching code:

- `content/landing.json`: the main page
- `content/regions.json`: the list of regions (subjects) and their descriptions
- `content/<region>/world.json`: district names, map positions and the planned level list
- `content/<region>/zone-0.json`: everything for that district's levels (story, hook, learn card, puzzle text, hints, debrief, Field Notes, feed cards, read more)

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
js/engine/            shared parts: level template, saving, stars, sprites, content checks
js/levels/net/        one file per Packet Valley level (index.js lists them)
js/levels/algo/       one file per Algo Archipelago level
content/              all player-facing text
docs/                 design notes
```

## Credits and licences

Code: MIT. Written content: CC BY 4.0. See `LICENSE` and `CREDITS.md`.
