# Research brief and reference library

**For Claude Code.** Save this as `docs/research-and-references.md`. Read it together with CLAUDE.md and the redesign prompt. It's **research input, not a spec**: use it to propose a plan, then wait for approval.

Rules that still apply:
- No subject codes and no university or campus names anywhere public.
- Everything is written in our own words.
- Sources marked "link only" must never be adapted or paraphrased closely.
- Anything marked **verify** must be checked before it's used in the game.

---

## 1. The short version: 12 design rules for our game

1. **Open with something familiar.** Every level starts with an everyday moment the player already knows (undo, buffering, a slow app), framed as a question they can't answer yet. Curiosity measurably improves memory (§3.1).
2. **Teach, then test. Never quiz on something not taught yet.** Every question and feed card must map to a lesson page.
3. **One idea per screen.** Short, user-paced pages beat one long page (Mayer's *segmenting* principle, §3.2). Aim for about 60–90 words of story per lesson page.
4. **Words + a picture, placed together.** Each lesson page gets one small labelled diagram next to the text it explains (*multimedia* and *contiguity*). Cut decoration that doesn't teach (*coherence*).
5. **Talk like a friendly human.** Use a conversational voice, not textbook voice (*personalization*). Julia Evans's zines are the gold standard for networking (§2.9).
6. **Do, don't just read.** Every lesson should include at least one thing to *touch*: a slider, a drag, or a "predict, then reveal". This is the shared core of Brilliant, Google's ML course, the explorable-explanations movement and the Polo Club explainers (§2).
7. **Predict before you reveal.** Asking the player to commit to a guess before showing the answer turns reading into active retrieval (§3.3).
8. **Always give feedback.** Retrieval without feedback helps little, and can even hurt (§3.3). Every answer, right or wrong, says *why*.
9. **Overview first, details on demand.** Show the big picture, and let players expand "go deeper" sections (*progressive disclosure*, §3.5; the multi-level design of Transformer Explainer, §2.7).
10. **Short daily sessions beat binges.** Duolingo found learners who binge are more likely to quit than learners who pace themselves (§2.4). Keep the Valley Feed's natural end and the shame-free streak.
11. **Mastery, not points.** Show progress as skills getting stronger (like Khan Academy's Familiar → Proficient → Mastered, §2.3), not just stars collected.
12. **Every lesson page cites its sources.** Each one ends with a small References list linking to what it was based on (§5).

---

## 2. What the best learning sites do (and what we borrow)

### 2.1 Brilliant (math, CS and AI, interactive)
- **What they do:** "Learn by doing" with no lecture videos. Bite-sized interactive lessons, instant feedback, visual storytelling, and a recommended 15 minutes a day.
- **We borrow:**
  - Every concept gets a hands-on moment.
  - Lessons are short enough for a daily habit.
  - The puzzle *is* the explanation.
- **Link:** https://brilliant.org

### 2.2 Google Machine Learning Crash Course
- **What they do:** Each module mixes short explainers, interactive visualisations and practice exercises. The 2024 refresh focused on making it more approachable for beginners, with more interactive visuals.
- **We borrow:**
  - Each module combines read, see and do.
  - Interactive visualisations of the algorithm actually running (our Step Sim).
- **Link:** https://developers.google.com/machine-learning/crash-course (announcement: https://blog.google/technology/developers/machine-learning-crash-course/)

### 2.3 Khan Academy (mastery learning)
- **What they do:** Skills move through Attempted → Familiar → Proficient → Mastered as learners answer correctly on exercises and later on mixed reviews. Mastery is deliberately hard to earn, and skills can drop if later answers are wrong.
- **We borrow:**
  - Show per-concept strength, not just per-level stars.
  - Mixed review (our Feed) is what confirms mastery.
- **Links:** https://support.khanacademy.org/hc/en-us/articles/115002552631 · https://blog.khanacademy.org/?p=13201

### 2.4 Duolingo (habit design)
- **What they do:** Streaks with a visible flame and reminders. Their own team noted that losing a streak is very discouraging, so they built ways to protect streaks during breaks. Their data showed that bingers abandon the app more than learners who pace themselves.
- **We borrow:**
  - Daily small sessions.
  - A streak that never shames you.
  - **Avoid:** loss-aversion pressure and endless sessions.
- **Link:** https://making.duolingo.com/how-streaks-keep-duolingo-learners-committed-to-their-language-goals

### 2.5 Elements of AI (non-technical AI course)
- **What they do:** 6 chapters, each split into about 3 sections, in bite-sized chunks, with exercises after each section. No heavy maths or coding required.
- **We borrow:**
  - A predictable rhythm: chapter → short sections → exercise.
  - Plain language for complete beginners.
- **Link:** https://www.elementsofai.com

### 2.6 Explorable explanations (Bret Victor, Nicky Case)
- **What they do:** Text you can *play with*. Change a number and the explanation updates. Bret Victor's essay coined the term, arguing that readers should be active, not passive. Nicky Case curates a hub of "games that teach", and has written design patterns for them: puzzle, bet, role-play and sandbox.
- **We borrow:**
  - "Bet" (predict) and "sandbox" (free play) moments inside lessons.
  - Small, bouncy, focused interactives. Their community tip: keep scope small.
- **Links:** https://worrydream.com/ExplorableExplanations/ · https://explorabl.es · Nicky Case's design-patterns post on https://blog.ncase.me (**verify** the exact post address)

### 2.7 Polo Club explainers (CNN, Transformer and Diffusion Explainer)
- **What they do:** Browser-based visual tools for non-experts. Transformer Explainer runs a small GPT-2 model in the browser and shows the overview and the low-level maths at **multiple levels of abstraction**, so learners aren't overloaded.
- **We borrow:**
  - The zoom-in pattern: a whole-system view first, then click to open one part.
  - This suits the Grand Delivery level and the network stack.
- **Links:** https://poloclub.github.io/cnn-explainer/ · https://github.com/poloclub/transformer-explainer · https://poloclub.github.io/diffusion-explainer

### 2.8 Red Blob Games (Amit Patel)
- **What they do:** Interactive algorithm explanations driven by game examples. The famous A* guide starts from breadth-first search and builds up, letting you drag things and see the effect.
- **We borrow:**
  - Build each algorithm from a simpler one we already taught.
  - Draggable inputs in Step Sim.
  - Perfect references for the graph islands.
- **Links:** https://www.redblobgames.com/pathfinding/a-star/introduction.html · https://www.redblobgames.com/pathfinding/grids/graphs.html

### 2.9 Julia Evans / Wizard Zines (networking, DNS, HTTP)
- **What they do:** Hand-drawn comics that explain one idea per page in a warm, human voice. There's a whole networking zine built around "what happens when you download a cat picture". Mess with DNS is a playground where you make real DNS records.
- **We borrow:**
  - Tone and one-idea pages.
  - The "follow one real request end to end" structure (our Grand Delivery).
- **Licence:** her comics are **all rights reserved**, so **link only**.
- **Links:** https://wizardzines.com/zines/networking · https://messwithdns.net · https://jvns.ca/blog/2021/05/11/what-s-the-osi-model-/ (a great "OSI vs real life" caveat for Layer Cake)

### 2.10 VisuAlgo
- **What they do:** Step-through animations of data structures and algorithms.
- **We borrow:** link it from matching Algo Archipelago levels.
- **Link:** https://visualgo.net

---

## 3. Learning science behind the rules

### 3.1 Curiosity first (rule 1)
In a trivia-question study, people remembered answers better when they were curious about them. They even remembered unrelated material better if they saw it while curious. Brain scans linked curiosity to reward circuits and the hippocampus.
Gruber, Gelman & Ranganath (2014), *Neuron* 84(2): https://pmc.ncbi.nlm.nih.gov/articles/PMC4252494/

### 3.2 Mayer's multimedia principles (rules 3–5)
The most useful ones for us:
- **Coherence:** cut extraneous material.
- **Signalling:** highlight the key structure.
- **Contiguity:** words next to their pictures.
- **Segmenting:** user-paced chunks.
- **Pre-training:** teach the names of key parts first.
- **Multimedia:** words and pictures beat words alone.
- **Personalisation:** conversational style.
- **Generative activity:** guided doing.

Source: Mayer, *Multimedia Learning* (3rd ed., Cambridge University Press, 2020); Mayer (2008), "Applying the science of learning", *American Psychologist* 63(8) (**verify** DOI before citing).

### 3.3 Retrieval practice, spacing and interleaving (rules 7, 8 and 10)
- Low-stakes testing beats re-reading, and spacing practice over time beats cramming.
- **Caveats:** when learners can't retrieve the answer *and get no feedback*, retrieval practice gives little or even negative benefit. Interleaving often helps but sometimes doesn't.
- **Takeaway:** always show feedback with the explanation. Mix topics in the Feed, but not inside a first lesson.

Sources: "One size does not fit all" review: https://pmc.ncbi.nlm.nih.gov/articles/PMC10950551 · Dunlosky et al. (2013), *Psychological Science in the Public Interest* 14(1) (**verify** citation details).

### 3.4 Mastery learning (rule 11)
Learners practise until they reach a high success level before moving on (see Khan Academy, §2.3).

### 3.5 Progressive disclosure (rule 9)
Show the most important things first, and reveal advanced detail only when asked. This reduces errors and overload.
Nielsen Norman Group: https://www.nngroup.com/articles/progressive-disclosure/

---

## 4. Proposed page structure (for Claude Code to plan from)

**Landing page (#/)**
- Project name and a one-line promise.
- A short "how it works" strip: Everyday moment → Story lessons → Play → Review in the Feed.
- One card per subject: plain-language name, what you'll be able to do, progress, and an Enter button.
- An optional "Continue where you left off" button.
- About / credits / how it was built.

**Subject page (each region's map)**
- The map, plus a clear "next recommended level" button. Don't make players hunt.
- The Feed and Journal cards.
- Each zone card shows "Where you've seen this", e.g. "Every time you type a web address…".

**Level flow (one idea per screen, Back always works)**
1. **Everyday moment:** a familiar scene and a curiosity question. Answer it in your head; no quiz yet.
2. **Story lessons:** 2–5 pages. Each page has 60–90 words of story, one labelled diagram, an optional "Go deeper" expander, and a **References** list.
3. **Try it (guided):** a single low-stakes interactive with full hints, like a worked example. It doesn't count towards stars.
4. **Play:** the scored puzzle (stars). Every question traces back to a lesson page.
5. **Debrief:**
   - The answer to the everyday question.
   - The common mistake.
   - Stars and skill strength.
   - Field Notes.
   - Read more.

**Design rules for every screen**
- Readable at phone width.
- Never colour alone.
- Respects reduced motion.
- At most one primary button.
- Text in content JSON.

---

## 5. Reference library (everything so far, plus new)

**Licence key:**
- **Adapt (with attribution):** may be rewritten in our own words with credit, after checking the licence page.
- **Link only:** never adapted.
- **Fact-check only:** never cited in the game as a source of content.

### 5.1 Networking region: used in the game so far

| Where | Source | Licence | Link |
|---|---|---|---|
| 0.1 and 0.2 Read more | Peterson & Davie, *Computer Networks: A Systems Approach*, §1.3 Architecture | CC BY 4.0, Adapt | https://book.systemsapproach.org/foundation/architecture.html |
| 0.1 Read more | Bonaventure, *Computer Networking: Principles, Protocols and Practice*, "The reference models" | CC BY (1st ed.; **verify** version), Adapt | https://www.computer-networking.info/1st/html/intro/referencemodels.html |
| 0.1 and 0.2 | RFC 1122, Requirements for Internet Hosts (§1.1.3 layers, **verify** section) | IETF, Link only | https://www.rfc-editor.org/rfc/rfc1122 |
| 0.2 | Wireshark | Free tool, Link only | https://www.wireshark.org |
| 0.1 Field Note | Cloudflare docs: Network layers | Link only | https://developers.cloudflare.com/fundamentals/reference/network-layers/ |
| 0.1 Field Note | RFC 9114, HTTP/3 | IETF, Link only | https://www.rfc-editor.org/rfc/rfc9114 |
| 0.2 Field Note | Cloudflare Learning: What is tunneling? | Link only | https://www.cloudflare.com/learning/network-layer/what-is-tunneling/ |
| 0.2 Field Note | RFC 9293, TCP | IETF, Link only | https://www.rfc-editor.org/rfc/rfc9293 |

### 5.2 Networking region: from the subject brief (for future levels)

| Source | Licence | Link |
|---|---|---|
| Peterson & Davie (whole book) | CC BY 4.0, Adapt | https://book.systemsapproach.org |
| Bonaventure (whole book) | CC BY, Adapt (**verify**) | https://www.computer-networking.info |
| MDN Web Docs (HTTP, cookies, caching) | CC BY-SA, **Link only** (to avoid share-alike) | https://developer.mozilla.org |
| RFC 791 (IPv4), 8200 (IPv6), 9293 (TCP), 768 (UDP), 1034/1035 (DNS), 9110 (HTTP semantics), 5321 (SMTP), 8446 (TLS 1.3) | IETF, Link only | https://www.rfc-editor.org |
| Cloudflare Learning Center | Link only | https://www.cloudflare.com/learning/ |
| Tanenbaum, Feamster & Wetherall, *Computer Networks* (6th ed.) | **Fact-check only** | — |

### 5.3 Networking region: new recommendations

| Use for | Source | Licence | Link |
|---|---|---|---|
| Layer Cake caveat (OSI vs real life) | Julia Evans, "The OSI model doesn't map well to TCP/IP" | Link only | https://jvns.ca/blog/2021/05/11/what-s-the-osi-model-/ |
| Grand Delivery and the DNS levels | Julia Evans, *Networking! ACK!* zine | All rights reserved, Link only | https://wizardzines.com/zines/networking |
| DNS levels (hands-on) | Mess with DNS | Link only | https://messwithdns.net |
| DNS levels | Wizard Zines: "life of a DNS query" comic | Link only | https://wizardzines.com/comics/life-of-a-dns-query/ (**verify**) |

### 5.4 Algorithms region: used in the game so far

| Where | Source | Licence | Link |
|---|---|---|---|
| 0.1 Read more and Field Note | Pat Morin, *Open Data Structures* | CC BY, Adapt | https://opendatastructures.org |
| 0.1 Read more | VisuAlgo: lists, stacks, queues | Link only | https://visualgo.net/en/list (**verify**) |
| 0.1 and 0.2 | Jeff Erickson, *Algorithms* (free book) | Creative Commons (**verify** exact licence), Adapt | https://jeffe.cs.illinois.edu/teaching/algorithms/ |
| 0.1 Field Note | MDN: Call stack | CC BY-SA, Link only | https://developer.mozilla.org/en-US/docs/Glossary/Call_stack |
| 0.2 Read more | Wikipedia: Big O notation | CC BY-SA, Link only | https://en.wikipedia.org/wiki/Big_O_notation |
| 0.2 Field Note | Wikipedia: Wheat and chessboard problem | CC BY-SA, Link only | https://en.wikipedia.org/wiki/Wheat_and_chessboard_problem |
| 0.2 Read more | MIT OpenCourseWare 6.006, *Introduction to Algorithms* | CC BY-NC-SA, Link only | https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/ (**verify** current) |

### 5.5 Algorithms region: from the brief and new recommendations

| Use for | Source | Licence | Link |
|---|---|---|---|
| Graph islands (DFS, BFS, shortest paths) | Red Blob Games: Introduction to A*; Introduction to graphs | Link only | https://www.redblobgames.com/pathfinding/a-star/introduction.html · https://www.redblobgames.com/pathfinding/grids/graphs.html |
| Sorting, heaps, BSTs, hashing, graph traversal | VisuAlgo | Link only | https://visualgo.net |
| Fact-checking | Levitin, *Introduction to the Design and Analysis of Algorithms*; Cormen et al., *Introduction to Algorithms*; Skiena, *The Algorithm Design Manual* | **Fact-check only** | — |

### 5.6 Design and learning-science references (for the redesign)

| Topic | Source | Link |
|---|---|---|
| Learn-by-doing lessons | Brilliant | https://brilliant.org |
| Read + see + do modules | Google Machine Learning Crash Course | https://developers.google.com/machine-learning/crash-course |
| Mastery levels | Khan Academy Help Center | https://support.khanacademy.org/hc/en-us/articles/115002552631 |
| Streaks and pacing | Duolingo blog | https://making.duolingo.com/how-streaks-keep-duolingo-learners-committed-to-their-language-goals |
| Bite-sized course structure | Elements of AI | https://www.elementsofai.com |
| Active reading | Bret Victor, *Explorable Explanations* | https://worrydream.com/ExplorableExplanations/ |
| Games that teach | Nicky Case, Explorable Explanations hub | https://explorabl.es |
| Multi-level visual explainers | Polo Club: CNN / Transformer / Diffusion Explainer | https://poloclub.github.io/cnn-explainer/ · https://github.com/poloclub/transformer-explainer |
| Visual intro to ML (scrollytelling style) | R2D3, *A visual introduction to machine learning* | http://www.r2d3.us/visual-intro-to-machine-learning-part-1/ |
| Curiosity and memory | Gruber et al. (2014), *Neuron* | https://pmc.ncbi.nlm.nih.gov/articles/PMC4252494/ |
| Spacing, retrieval, interleaving (with caveats) | "One size does not fit all" review | https://pmc.ncbi.nlm.nih.gov/articles/PMC10950551 |
| Multimedia principles | Mayer, *Multimedia Learning* (3rd ed., 2020) | (book) |
| Progressive disclosure | Nielsen Norman Group | https://www.nngroup.com/articles/progressive-disclosure/ |

---

## 6. Open questions for Cesilia (Claude Code: ask, don't assume)

1. **The umbrella name** for the whole project (the networking region keeps "Packet Valley").
2. **Should "skill strength" (mastery) replace or sit beside stars?**
3. **"Try it (guided)" step:** add it to all levels, or only to calculation-heavy levels?
4. **Which new references to adopt** from §5.3 and §5.5. Remember Julia Evans and Red Blob Games are link only.
5. **Should the landing page have an "About / how I built this" section** for the portfolio?
