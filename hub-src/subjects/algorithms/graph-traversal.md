---
title: Graph traversal
summary: Two ways of visiting every vertex of a graph, depth-first and breadth-first, and how their orders differ.
practise:
- algo/3.1 | Island Census
- algo/3.2 | Deep Dive
- algo/3.3 | Ripple Out
- algo/3.4 | Same Map, Two Explorers
sources:
- Erickson, Algorithms (2019), CC BY 4.0, chapter 5 (Basic Graph Algorithms) | https://jeffe.cs.illinois.edu/teaching/algorithms/book/05-graphs.pdf
- Erickson, Algorithms (2019), CC BY 4.0, chapter 6 (Depth-First Search) | https://jeffe.cs.illinois.edu/teaching/algorithms/book/06-dfs.pdf
check:
- Depth-first search goes as far as it can along one path before backing up | Erickson, chapters 5 and 6
- Breadth-first search visits all vertices at distance 1, then distance 2, and so on | Erickson, chapter 5
- Breadth-first search uses a queue and depth-first search uses a stack, or recursion | Erickson, chapter 5
- Breadth-first search finds the fewest-edge path from the start to each vertex | Erickson, chapter 5
- Both visit every vertex and edge once, so the work grows with vertices plus edges | Erickson, chapter 5
---

To explore a graph, you have to visit its vertices one by one without going round in circles. There are two classic ways. They give different orders and are good for different jobs.

## Start with exploring a maze

One way is to pick a corridor and follow it as far as it goes. When you reach a dead end, you back up to the last junction and try another turn. That is *depth-first*. Another way is to check every corridor one step out, then every corridor two steps out, and so on. That is *breadth-first*.

## Depth-first search (DFS)

Go as deep as you can along one path. Mark each vertex when you visit it, so you never visit it twice. When you cannot go further, back up and try the next choice. It is easy to write with recursion.

## Breadth-first search (BFS)

Visit the start, then all its neighbours, then all of their unvisited neighbours, and so on, in rings. A *queue* keeps the vertices waiting to be visited, in order. BFS finds the fewest-edge path from the start to every other vertex.

:::example Worked example
The graph from the last page: A–B, A–C, B–D, C–D and D–E. Neighbours are taken in alphabetical order. These results were worked out by a script.

| Method | Order of visiting |
|---|---|
| DFS from A | A, B, D, C, E |
| BFS from A | A, B, C, D, E |

BFS also gives the distance (number of edges) from A:

| Vertex | A | B | C | D | E |
|---|---|---|---|---|---|
| Distance | 0 | 1 | 1 | 2 | 3 |

DFS from A went A, then B, then D, then C, before E, because it followed one path as far as it could. BFS visited B and C (one step away) before D (two steps), then E (three).
:::

## Which to use

Use BFS to find the shortest path in terms of edges. Use DFS to explore everything along a path, check for cycles, or order tasks (see the next pages).

## Common mistakes

- **Forgetting to mark visited vertices.** The search can loop forever in a graph with cycles.
- **"DFS and BFS visit different vertices."** They visit the same ones, in a different order.

## Check yourself

:::check
Q: Which search uses a queue?
A: Breadth-first search.
Q: In the example, how far is E from A?
A: 3 edges.
Q: What does BFS find that DFS does not?
A: The fewest-edge path from the start to every vertex.
:::

:::deeper
**Cost.** Both methods look at each vertex and each edge once. With adjacency lists, the work grows in proportion to the number of vertices plus the number of edges.
:::
