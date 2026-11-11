# Hub architecture

Last updated: 2026-11-10

How the learning hub is built, and how to add a chapter.

## Layout of the repo

```
index.html, about/, subjects/, 404.html, .nojekyll   generated hub pages (do not edit by hand)
hub/hub.css                                           styles for the hub
hub-src/site.config.json                              site name, tagline, subjects, full chapter outline
hub-src/subjects/<subject>/<chapter>.md               one file per written chapter
tools/build-hub.mjs                                   the builder (Node 22+, no packages)
game/                                                 the game (Courier's Atlas), unchanged apart from a link back to the hub
game/tools/check-content.mjs                          the game's content checker
docs/                                                 notes for the author
```

GitHub Pages serves the repo root (Settings, Pages, Deploy from a branch, `main`, `/ (root)`). All links are relative, so the site works at `https://<user>.github.io/<repo>/`.

## Why a builder

There are about 170 planned chapters. One template keeps every page consistent, and the pages are plain HTML that works without JavaScript. The generated files are committed, because Pages serves them as they are.

## Commands

```
node tools/build-hub.mjs --check    check chapters (front matter, voice, reading level); writes nothing
node tools/build-hub.mjs            check, then rebuild the pages
node game/tools/check-content.mjs   check the game's content files
python3 -m http.server 8000         then open http://localhost:8000/ to look at the site
```

The build refuses to run if `game/index.html` is missing, so it can never overwrite the game.

## Adding a chapter

1. Find the chapter in `hub-src/site.config.json`. The chapter's file name is its `slug` plus `.md`. To add a new chapter to the outline, add `{ "slug": "...", "title": "..." }` to a group. The slug must equal the title lower-cased with hyphens (the build warns if not).
2. Create `hub-src/subjects/<subject>/<slug>.md` with front matter:

```
---
title: The TCP handshake
summary: One sentence for the subject page and search results.
practise:
- net/5.2 | The Handshake
sources:
- Label | https://address
check:
- A claim on the page | where to confirm it
---
```

3. Write the body in Markdown. Supported: `##` to `####` headings, paragraphs, bold, italic, `code`, links, bullet and numbered lists, tables, quotes, fenced code, and these blocks:

```
:::example Worked example
...
:::

:::check
Q: question
A: answer
:::

:::deeper
...
:::
```

4. Run `node tools/build-hub.mjs --check`, fix anything it reports, then run the build and look at the page.

`practise` lines link to game levels: `net/` is Packet Valley and `algo/` is Algo Archipelago. Other regions will be added to `site.config.json` when their game levels exist.

## Subjects and the game

| Subject | Game region | State |
|---|---|---|
| Networks | Packet Valley (`net`) | 24 levels |
| Algorithms | Algo Archipelago (`algo`) | 2 levels so far |
| The other six | none yet | game first half planned |

## What is not done

Indonesian pages, search, and most chapters. The outline lists every planned chapter; unwritten ones show "Coming soon".
