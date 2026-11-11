# Game regions plan

Last updated: 2026-11-10

The goal for the first public version is a game that covers the first half of each of the eight subjects. This file lists the regions and levels to build. Names are working names and can change. Each level matches a hub chapter, which holds the full explanation. The game's lessons stay short.

Building order, one region per Claude Code run (see `private/CLAUDE_CODE_GAME_REGION.md`): Algo Archipelago (the rest of the first half), Ledger Library, Blueprint Borough, Vault Harbour, Learning Fields, Wordwood, Waypoint Woods.

Counts are an estimate. About 80 levels remain, so expect about 7 runs at 10 to 12 levels each, based on earlier sessions.

## Packet Valley (Networks) and Algo Archipelago (Algorithms)

- **Packet Valley** (`net`): all 24 core levels are built. Nothing more is needed for the first half.
- **Algo Archipelago** (`algo`): 2 levels are built. Build the rest of the first half: zones 0 to 4, which cover foundations, brute force, decrease and conquer, and divide and conquer. The level lists are in `game/content/algo/world.json`.
  - Zone 0 (Lighthouse Point): 0.3 Counting Steps, 0.4 Euclid's Ferry.
  - Zone 1 (Brute Bay): 1.1 to 1.5.
  - Zone 2 (Shrinking Sands): 2.1 to 2.4.
  - Zone 3 (Bridge Isles): 3.1 to 3.4.
  - Zone 4 (Split Rock): 4.1 to 4.6.

## Ledger Library (`db`): Databases

A grand library where every record has its place. Kit works the front desk.

| Level | Title | Topic (hub chapter) |
|---|---|---|
| 0.1 | Shelves and Cards | What a database is |
| 0.2 | Who Knows Whom | Modelling data with ER diagrams |
| 1.1 | Unique Stamps | The relational model and keys |
| 1.2 | Matching Cards | Keys that link tables |
| 1.3 | Tidy Shelves | Normalisation |
| 2.1 | Ask the Librarian | SQL: reading data |
| 2.2 | Count and Group | SQL: joins and grouping |
| 2.3 | Two Shelves at Once | SQL: joins |

## Blueprint Borough (`java`): Java

A small town where every building starts as a blueprint.

| Level | Title | Topic |
|---|---|---|
| 0.1 | Hello, Workshop | Your first Java program |
| 0.2 | Labelled Boxes | Variables and types |
| 1.1 | Pick a Path | Making decisions |
| 1.2 | Round and Round | Loops |
| 1.3 | Recipe Cards | Methods |
| 2.1 | Numbered Lockers | Arrays |
| 3.1 | Blueprint and House | Classes and objects |
| 3.2 | The Front Door | Constructors and encapsulation |

## Vault Harbour (`adb`): Advanced Databases

A busy harbour where cargo, ledgers and clerks must all stay in step.

| Level | Title | Topic |
|---|---|---|
| 0.1 | Slow Docks, Fast Docks | Disks, SSDs and memory |
| 0.2 | Many Kinds of Warehouse | Types of databases |
| 0.3 | Near and Far Harbours | Database architectures |
| 1.1 | Plan the Route | How a query runs |
| 1.2 | Cost of a Crossing | Cost estimates and joins |
| 2.1 | Climbing the Tree | B+ trees |
| 2.2 | Pigeonholes | Hash and bitmap indexes |
| 2.3 | Pins on a Map | Indexes for places and distance |
| 3.1 | All or Nothing | What a transaction is |
| 3.2 | Two Clerks, One Ledger | Concurrency problems |

## Learning Fields (`ml`): Machine Learning

Open country where Kit helps a farm learn from samples.

| Level | Title | Topic |
|---|---|---|
| 0.1 | Sorting Seeds | What machine learning is |
| 0.2 | Labels and Features | Data, features and labels |
| 1.1 | Ask Your Neighbours | k-nearest neighbours |
| 2.1 | Twenty Questions | Decision trees |
| 3.1 | Odds and Evens | Probability and models |
| 3.2 | Count the Clues | Naive Bayes |
| 4.1 | Best Fit Line | Linear regression |
| 4.2 | Yes or No | Logistic regression |
| 5.1 | Widest Road | Support vector machines: margins |
| 5.2 | Bend the Map | Support vector machines: kernels |
| 6.1 | Right and Wrong | Evaluating a model |
| 6.2 | Honest Tests | Bias, variance and model choice |

## Wordwood (`nlp`): Natural Language Processing

A wood where the trees are words and the paths are sentences.

| Level | Title | Topic |
|---|---|---|
| 0.1 | Letters to Words | What NLP is |
| 0.2 | Chop and Tidy | Preparing text |
| 1.1 | What Comes Next? | Language models with n-grams |
| 2.1 | Sort the Mail | Text classification |
| 3.1 | Name the Parts | Part-of-speech tagging |
| 3.2 | Hidden Weather | Hidden Markov models (inside the tagging chapter) |
| 4.1 | Remember the Last Word | Recurrent networks |
| 5.1 | Words as Points | Word embeddings |
| 6.1 | Who Looks at Whom | Transformers |
| 7.1 | Read First, Learn Later | Pretrained models |

## Waypoint Woods (`plan`): AI Planning

Forest trails where Kit plans each step to reach a goal.

| Level | Title | Topic |
|---|---|---|
| 0.1 | Find the Steps | What planning is |
| 1.1 | Fan Out | Search |
| 1.2 | Guess the Distance | Search with a heuristic (A*) |
| 1.3 | Never the Same Spot Twice | Search without repeats |
| 2.1 | Facts and Moves | STRIPS |
| 2.2 | Write the Domain | PDDL |
| 3.1 | Good Guess, Bad Guess | Heuristics |
| 4.1 | Ignore the Deletes | Delete relaxation |
| 5.1 | Few New Facts | Width-based planning |

## Notes

- Topics come from the hub's chapter outline in `hub-src/site.config.json`, which is an outline in my own words. Check each topic against the real subject before a level is built.
- The hub's "Practise in the game" links use the region ids above (`net`, `algo`, `db`, `java`, `adb`, `ml`, `nlp`, `plan`). When a region is built, add its `game` entry to the matching subject in `site.config.json`.
- The game stays English only until the hub's Indonesian pages are done.
