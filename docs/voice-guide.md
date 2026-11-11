# Voice guide

Last updated: 2026-11-10

Read this before writing or editing any page on the hub. `node tools/build-hub.mjs --check` enforces the parts that a script can check.

## What the site is

CS Notes & Games explains computer science, with a game to practise. The site tagline is "Computer science explained, with a game to practise." Say what a page is and what it does. Nothing more.

## Voice

1. Say what the thing is. A title names the thing. It does not try to sound good.
2. Short sentences. Everyday words. One idea per sentence.
3. Speak to the reader as "you". Refer to the site as "this site". Do not use "I" or "we" on the site, and do not use a personal name.
4. Start from an everyday example the reader already knows, then name the idea.
5. Define every technical word the first time it appears, in plain words.
6. No slogans, metaphors for their own sake, or "X. Y." contrast lines. No questions as headlines.
7. A concrete example beats a big claim.
8. Do not announce the tone. Show it.
9. Australian spelling (organise, colour, practise as a verb, practice as a noun). No buzzwords.
10. Only write claims that are true and that a source on the page supports.

### Words to avoid

journey, unlock, dive in, delve, seamless, "whether you're", "not just X but Y", game-changer, landscape, "in today's", embark, leverage, robust, crucial. Avoid lists of exactly three used for rhythm. The build check flags the single words.

### Emoji

Allowed in headings, subject names and list items. Never in the middle of a paragraph. The site name uses two (📝🎮). They are decorative and hidden from screen readers.

### Numbers

Label every number: *computed* (by a script, with the script or method stated), *made up* (for an example), *measured* (with who measured it and when), or *estimated*. Examples use made-up numbers and say so.

## Reading level

Write the main path for a complete beginner. The build script estimates a Flesch-Kincaid grade. Aim for 7 to 9 and stay under 10. The syllable count is a rough guess, so treat the number as a guide. Do not mention reading levels on the site. University-level detail goes in "Go deeper".

## Chapter template

Each chapter is one Markdown file in `hub-src/subjects/<subject>/<chapter-slug>.md`, in this order:

1. One or two sentences saying what the page covers.
2. An everyday example.
3. The idea in plain words, with terms defined.
4. A worked example in an `:::example` block, with labelled numbers.
5. Why or how it works (the reason, not only the rule).
6. Common mistakes.
7. Check yourself: three questions with answers in a `:::check` block.
8. Go deeper in a `:::deeper` block (university level, optional).

The build adds "Practise in the game", "Where to check these facts" and a mistake-report link after the body.

## Sources

- Link to the original. Do not copy or closely paraphrase a source unless its licence allows it and the credit is in `CREDITS.md`.
- Adaptable with credit: Peterson and Davie (CC BY 4.0), Jeff Erickson's 2019 *Algorithms* (CC BY 4.0). Link only: Wikipedia, MDN, GeeksforGeeks, W3Schools, Oracle tutorials, news articles.
- Every chapter needs at least 2 sources and at least 3 `check` lines in its front matter. A `check` line is a claim and where to confirm it. It is not shown on the page. It tells a reviewer, or Claude Code, what to confirm.
- A fact with no source is cut.
- Never use exam papers, tutorial solutions, assignment material, third-party notes sites, or course slides as a source or a source of text.

## AI use

The footer says: "AI helped build this site and write the first drafts. Not every page has been fully checked yet. If something looks wrong, please report it." Keep that line true. Change it only if the facts change.

## Indonesian

English comes first. The Indonesian version is a translation, in a casual tone, and it is a later stage.

- Use *kamu*. Short sentences. Everyday words.
- Keep technical terms in English (network, algorithm, TCP). Give the Indonesian meaning the first time, in brackets.
- Light casual wording ("dijelasin", "buat", "ngulang") is fine. Avoid heavy slang, so the text stays clear for everyone.
- Read it aloud. If it does not sound like something a person would say, change it.

Samples:

- Title: "Computer science dijelasin, plus game buat latihan."
- About: "Dibuat buat ngulang lagi materi yang pernah dipelajari. Tiap panduan bahas satu topik, dan game-nya buat latihan."
