# Next steps plan (after Session 3)

**For Cesilia and Claude Code.** Save this as `docs/next-steps-plan.md`. It continues `docs/two-day-build-plan.md` and `docs/progress.md`, and uses `docs/research-and-references.md` for design rules.

Rules that still apply: no subject codes or university/campus names anywhere public, our own words, plan first and wait for "yes", and `/clear` between sessions.

---

## 0. Do these first (Cesilia, about 1 hour, no Claude needed)

1. **Push now.** Sessions 2 and 3 exist only on your laptop. Run `git push`. One lost laptop shouldn't cost two sessions of work.
2. **Check `private/` is in `.gitignore`.** It holds the old translations. Run `git check-ignore private/id-levels-v1` and make sure it prints the path.
3. **Hand-play 3 units:** one from each of zones 1–3. Do one on your phone and one using only the keyboard (Tab, Enter, Space). Write anything odd in `docs/feedback.md`.
4. **Send the verify list to your correctness friend.** Run `node tools/check-content.mjs`, copy the "verify" items, and send them now. Their answers can arrive while we keep building.

---

## 1. The new order (and why)

| # | Session | Why it's here |
|---|---|---|
| 4 | Packet Valley zones 4–7 (as planned) | Completes the first whole region |
| **4b** | **Polish and soft launch** (moved forward from Session 7) | The research says launch early; real players improve every later unit |
| 5 | Algo Archipelago zones 0–3 (as planned) | Needs the graph-view fix from 4b first |
| 6 | Algo Archipelago zones 4–7 (as planned) | Completes the second region |
| **8** | **AI track groundwork:** 3 briefs, 3 region skeletons, references | One cheap planning session for all three subjects |
| **9** | **New Step Sim views:** scatter, tokens, grid world | The only new code the AI track needs |
| 10–11 | Machine Learning content (about 16 units) | AI track, in prerequisite order |
| 12–13 | NLP content (about 16 units) | Builds on Machine Learning |
| 14–15 | AI Planning content (about 16 units) | Builds on the graph search islands |
| 16 | Re-launch: link check, verify list, README, screenshots | — |

The rest of Session 7 (final verify list, README screenshots) merges into 4b and 16.

---

## 2. Session 4b: polish and soft launch

Fix the known gaps **before** more content copies the same problems:

- **Graph view empty vertical space.** Algo zone 3 and AI Planning both depend on this view.
- The sample unit's HUD title ("sample Sample unit").
- Trim the 5 over-length zone-0 lesson pages to 90 words or fewer, moving extra detail into "Go deeper".
- **"Re-read this page" button** after a wrong answer, using `taughtOn`. This is research rule 8: feedback should point back to the teaching. It's cheap because `taughtOn` already exists.
- **"Next recommended level" button** on each map, so players never have to hunt for what's next.
- A phone-width pass on every activity type, and a keyboard-only pass of one full unit.
- Turn on GitHub Pages. Unbuilt zones show "Coming soon".
- **Optional:** rename the GitHub repo to `couriers-atlas`. GitHub redirects the old name, but the Pages address will change.

---

## 3. The AI track: draft regions and zones

Topic scope comes from each subject's public handbook topic list (checked in chat, **never** linked or quoted in the repo). **Cesilia ticks or crosses each zone from memory before Session 8.** About 2 core units per zone.

### 3.1 Machine Learning: "Prediction Peaks" (a weather-station village)
*Opening moments:* spam filters, Netflix and Spotify recommendations, face unlock, weather apps.

| Zone | Topic | Notes |
|---|---|---|
| 0 Base Camp | What learning from data means: features, labels, training vs test data, supervised vs unsupervised | |
| 1 Data Dairy | Cleaning and normalising data: missing values, scaling, outliers | In the handbook |
| 2 Lookalike Lane | Nearest neighbours; Naive Bayes (probability made friendly) | |
| 3 Question Tree Grove | Decision trees, information gain (entropy in "Go deeper") | |
| 4 Slope Ridge | Linear regression, logistic regression, gradient descent ("walking downhill") | Linear models are in the handbook |
| 5 Neuron Nest | Perceptron, small neural networks, backpropagation intuition | Non-linear models |
| 6 Judge's Hut | Evaluation: accuracy, precision/recall, confusion matrix, cross-validation, overfitting, bias vs variance | |
| 7 Cluster Cove | Clustering: k-means, hierarchical | In the handbook |
| ★ Forecast Festival | Pick the right model for each villager's problem | Final level, later |

### 3.2 Natural Language Processing: "Echo Market" (traders speaking many languages)
*Opening moments:* phone autocomplete, auto-translate in apps, chatbots, spell check, sentiment in reviews.

| Zone | Topic | Notes |
|---|---|---|
| 0 Word Stall | Text basics: tokens, normalising, why language is hard (ambiguity) | |
| 1 Mood Market | Text classification and sentiment: bag of words, logistic regression | In the handbook |
| 2 Guessing Game Square | N-gram language models, probability, smoothing ("how autocomplete guesses") | In the handbook |
| 3 Meaning Map | Word vectors and similarity ("king − man + woman") | Vector space semantics |
| 4 Tag Lane | Part-of-speech tagging, sequence models (Viterbi in "Go deeper") | Structured prediction |
| 5 Sentence Scaffold | Parsing, grammar trees | In the handbook |
| 6 Attention Tower | Neural language models, attention, transformers, LLMs | **Verify scope:** likely in recent years; tick if you covered it |
| 7 Translator's Dock | Machine translation, named entities, relation extraction, coreference | In the handbook |
| ★ Grand Bazaar | Build a tiny assistant pipeline end to end | Final level, later |

### 3.3 AI Planning: "Rover Mesa" (a canyon of explorer robots)
*Opening moments:* robot vacuums, Google Maps routes, game enemies chasing you, delivery drones, Mars rovers.

| Zone | Topic | Notes |
|---|---|---|
| 0 Mission Control | Agents, states, actions, goals; turning a task into a search problem | |
| 1 Canyon Paths | Blind search recap (BFS, DFS, uniform cost), linked back to Algo Archipelago's graph islands | Search algorithms |
| 2 Hint Hill | Heuristics, greedy search, A*, admissible heuristics | Heuristic functions |
| 3 Blueprint Base | Classical planning: describing actions with preconditions and effects (PDDL-style), relaxed-plan heuristics | Classical planning |
| 4 Foggy Flats | Markov decision processes: uncertainty, rewards, policies, value iteration | MDPs |
| 5 Trial Trail | Reinforcement learning: Q-learning, exploration vs exploitation | RL |
| 6 Rival Ridge | Game theory: strategies, payoff tables, Nash equilibrium | Game theory |
| 7 Council Rock | Ethics of autonomous agents | Ethics |
| ★ Rover Rally | Plan a full mission | Final level, later |

---

## 4. Session 9: the only new code for the AI track

Add three Step Sim views. Each must be keyboard-usable, labelled with text (never colour alone), and covered by the sample unit at `#/sample`.

| View | Used for | Player interactions |
|---|---|---|
| **scatter** | Machine Learning: data points, a dividing line, clusters | Place or drag points; predict a class; watch k-means move its centres |
| **tokens** | NLP: words as tiles, tags, n-gram windows, attention lines | Split text, tag words, predict the next word |
| **grid world** | AI Planning: a rover on a grid with rewards, values and policy arrows | Step value iteration; watch Q-values update; trace A* |

This adds the "sandbox" interactive pattern from the research (Explorable Explanations, Polo Club, TensorFlow Playground) at low cost.

---

## 5. References to add for the AI track (Session 8 checks all of these)

All are **link only** unless the licence check says otherwise. **Verify every link and licence** before use; this list is from memory, not yet checked.

| Subject | Source | Notes |
|---|---|---|
| ML | Google Machine Learning Crash Course | Beginner-friendly, interactive |
| ML | Elements of AI | Non-technical |
| ML | R2D3: A visual introduction to machine learning | Scrollytelling |
| ML | TensorFlow Playground (playground.tensorflow.org) | Neural networks you can play with |
| ML | scikit-learn user guide | Accurate definitions |
| ML | *Dive into Deep Learning* (d2l.ai) | Check licence; likely CC BY-SA, so link only |
| NLP | Jurafsky & Martin, *Speech and Language Processing* (3rd ed. draft, free online) | The standard textbook; link and fact-check |
| NLP | Jay Alammar, *The Illustrated Transformer* | Link only |
| NLP | Polo Club Transformer Explainer | Already in the research file |
| NLP | Hugging Face NLP course | Check licence |
| Planning | Red Blob Games: Introduction to A* | Already in the research file |
| Planning | Sutton & Barto, *Reinforcement Learning: An Introduction* (free PDF) | Check licence; likely no derivatives, so link only |
| Planning | Russell & Norvig, *Artificial Intelligence: A Modern Approach* | **Fact-check only** |

---

## 6. Copy-paste prompts

### Session 4b
```
/clear
Read docs/progress.md and docs/next-steps-plan.md section 2. Plan, then do Session 4b: fix the graph view's empty space, the sample HUD title, trim the 5 long zone-0 pages (move extra into "Go deeper"), add a "Re-read this page" button after wrong answers using taughtOn, add a "Next recommended level" button on each map, do a phone-width check of every activity type and a keyboard-only run of one unit, then walk me through turning on GitHub Pages. Update docs/progress.md and commit.
```

### Session 8
```
/clear
Read docs/next-steps-plan.md sections 3 and 5, docs/story-bible.md, and the format of an existing brief in docs/briefs/. I've ticked or crossed zones in section 3 (crossed ones are out of scope).
1. Write a brief per AI subject, split per zone like the others: docs/briefs/machine-learning/, docs/briefs/nlp/, docs/briefs/ai-planning/. Each zone file has key concepts (high-school main path plus "Go deeper"), 2 core units with how they play, everyday opening moments, a common mistake, and original worked examples with numbers checked by a script.
2. Add the three regions to the landing page and world files as "Coming soon" maps, using the region names in section 3.
3. Extend docs/story-bible.md: how Kit reaches each new region, recurring characters, one cliffhanger per zone.
4. Check every link and licence in section 5, then add them to docs/research-and-references.md with a licence label.
No subject codes, no university names. Plan first; update docs/progress.md; commit.
```

### Session 9
```
/clear
Read docs/next-steps-plan.md section 4 and the Step Sim code. Plan, then add the scatter, tokens and grid-world views (keyboard usable, text labels, reduced motion), with one sample activity per view in #/sample, and update the content checker for them. Update docs/progress.md and commit.
```

### Sessions 10–15
Use the content-only prompt from `docs/two-day-build-plan.md` section 5, with the subject's brief folder and zone list. About 8 units per session.

---

## 7. Effort check

The AI track is about 48 units, built in 8 sessions: 1 briefs, 1 engine, and 6 content.

If usage runs short, follow the same cut order as before. You can also ship each subject with **zones 0–4 only** first. Each region still teaches a complete story arc that way.
