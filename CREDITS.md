# Credits

## Written content

All text in `game/content/` (the game) and `hub-src/` (the hub chapters) is original, written for this project. No text, figures or examples have been adapted from any source so far. The hub chapters list their sources on each page, under "Where to check these facts". If open-licensed material is adapted later, it is recorded here with its credit line.

### Credit line for Peterson and Davie

If text or figures from *Computer Networks: A Systems Approach* are adapted, include this attribution (the form the authors ask for):

> Title: Computer Networks: A Systems Approach. Authors: Larry Peterson and Bruce Davie. Copyright: Elsevier, 2012. Source: https://github.com/SystemsApproach. License: CC BY 4.0.

The book's pages describe later releases of the open-source text too. Check the edition and the copyright line on the page you adapt from.

### Credit line for Erickson

If text or figures from Jeff Erickson's *Algorithms* are adapted, include this attribution:

> Jeff Erickson, *Algorithms* (1st edition, 2019), licensed under CC BY 4.0 (https://creativecommons.org/licenses/by/4.0/). Source: https://jeffe.cs.illinois.edu/teaching/algorithms/.

The textbook is CC BY 4.0. His other lecture notes are CC BY-NC-SA 4.0, so they are linked only. The hub's chapters on Algorithms are written in new words and cite his chapters as sources. Nothing is adapted from them so far.

## Linked sources ("Read more")

These are linked from levels, not copied.

### Packet Valley (Internet Technologies)

| Source | Licence | Used in |
|---|---|---|
| Peterson & Davie, *Computer Networks: A Systems Approach*, book.systemsapproach.org | CC BY 4.0 (stated in the book's GitHub repository) | 0.1, 0.2 |
| Bonaventure, *Computer Networking: Principles, Protocols and Practice*, computer-networking.info (home page; the old 1st-edition chapter link stopped working) | Open ebook (**verify the licence before adapting**) | 0.1 |
| RFC 1122, Requirements for Internet Hosts, rfc-editor.org | IETF document (linked only) | 0.1, 0.2 |
| Wireshark, wireshark.org | Free, open-source tool (linked only) | 0.2 |
| Cloudflare docs: Network layers, developers.cloudflare.com | Linked only, not copied | 0.1 Field Note |
| Cloudflare Learning: What is tunneling?, cloudflare.com/learning | Linked only, not copied | 0.2 Field Note |
| RFC 9114 (HTTP/3) and RFC 9293 (TCP), rfc-editor.org | IETF documents (linked only) | Field Notes |

### Algo Archipelago (Algorithms and Complexity)

| Source | Licence | Used in |
|---|---|---|
| Pat Morin, *Open Data Structures*, opendatastructures.org | CC BY (linked only so far) | 0.1 |
| Jeff Erickson, *Algorithms*, jeffe.cs.illinois.edu | Creative Commons (linked only so far; **verify the exact licence before adapting**) | 0.1, 0.2 |
| VisuAlgo, visualgo.net | Linked only | 0.1 |
| MDN Web Docs: Call stack | CC BY-SA (linked only, not adapted) | 0.1 Field Note |
| Wikipedia: Big O notation; Wheat and chessboard problem | CC BY-SA (linked only) | 0.2 |
| MIT OpenCourseWare 6.006 | CC BY-NC-SA (linked only) | 0.2 |

## Hub chapters: sources

Linked from the pages, not copied. "Where to check these facts" on each page lists the sources used for that page. Peterson and Davie is cited by section, and the pages are written in new words, not adapted from the book.

| Source | Licence | Used in |
|---|---|---|
| Peterson & Davie, *Computer Networks: A Systems Approach*, book.systemsapproach.org | CC BY 4.0 | the-tcp-handshake, subnetting, network-security-basics |
| RFC 791, 950, 1918, 3021, 4632, 7413, 8446, 9110, 9112 and 9293, rfc-editor.org | IETF documents (linked only) | the-tcp-handshake, subnetting, network-security-basics |
| NIST FIPS 180-4, Secure Hash Standard | US government publication (linked only) | network-security-basics |
| Erickson, *Algorithms* (2019), jeffe.cs.illinois.edu | Textbook CC BY 4.0, lecture notes CC BY-NC-SA 4.0 (linked only) | the algorithms chapters |
| Eck, *Introduction to Programming Using Java*, version 9, math.hws.edu/javanotes | CC BY-NC-SA 4.0 (linked only) | the Java chapters |
| Dev.java, the Java Language Specification and the Java SE 21 API, oracle.com | Oracle documentation (linked only) | the Java chapters |
| ITU, press release on the submarine cables summit (2025), itu.int | Linked only | cables-and-wireless |
| Chromium Blog, "An Update on the Lock Icon" (2023), blog.chromium.org | Linked only | network-security-basics |

The reference lists for the other subjects are kept in the author's private notes until each source is checked.

## Fonts

| Font | Licence | Loaded from |
|---|---|---|
| Pixelify Sans | SIL Open Font License 1.1 | Google Fonts |
| Atkinson Hyperlegible | SIL Open Font License 1.1 | Google Fonts |
| Zen Kaku Gothic New (hub pages) | SIL Open Font License 1.1 (**verify on the font's Google Fonts page**) | Google Fonts |

## Art

All pixel art (houses, trees, courier, stars, map) is original and drawn in code in `game/js/engine/sprites.js`.
The hub's illustrations are simple vector shapes drawn in code in `tools/build-hub.mjs`. No image assets are used yet.
