---
title: Minimum spanning trees
summary: How to connect every point in a network with the least total cost, using Kruskal's greedy method.
sources:
- Erickson, Algorithms (2019), chapter 7, Minimum Spanning Trees (CC BY 4.0) | https://jeffe.cs.illinois.edu/teaching/algorithms/book/07-mst.pdf
- Wikipedia, Minimum spanning tree | https://en.wikipedia.org/wiki/Minimum_spanning_tree
check:
- A spanning tree connects all vertices of a graph using no cycles | Erickson, chapter 7
- A spanning tree of a graph with V vertices has V minus 1 edges | Wikipedia, Minimum spanning tree ("each spanning tree has n − 1 edges"; not found in Erickson's chapter text)
- A minimum spanning tree is a spanning tree with the smallest total edge weight | Erickson, chapter 7 (first page)
- Kruskal's algorithm adds the lightest edge that does not make a cycle | Erickson, chapter 7 (Kruskal's Algorithm)
- Prim's algorithm grows a tree from one vertex by adding the lightest edge that leaves it | Erickson, chapter 7 (he calls it Jarník's, or Prim's, algorithm)
- If all edge weights are different, the minimum spanning tree is unique | Erickson, chapter 7, section "Distinct Edge Weights" (Lemma: "has a unique minimum spanning tree")
- The problem was first solved by Otakar Boruvka in 1926, for planning an electricity network | Erickson, chapter 7 (Borůvka and the electrical network; the year is not readable in the PDF text) and Wikipedia, Minimum spanning tree (1926)
---

Say you must connect several towns with cable, and every cable costs money. You want every town connected, as cheaply as possible. That is the minimum spanning tree problem.

## Start with joining villages

Five villages need a road network so that you can travel between any two. Each possible road has a cost. A road network with a loop wastes money, because one road in the loop could be dropped without cutting anyone off. The cheapest network has no loops.

## The idea

- A **spanning tree** of a graph connects all its points (vertices) using some of its edges, with no cycles. With V vertices, it always has V − 1 edges.
- A **minimum spanning tree** (MST) is the spanning tree with the smallest total weight.

## Kruskal's algorithm

1. Sort all the edges from lightest to heaviest.
2. Go through them in that order. Add an edge if it does *not* make a cycle. Skip it if it does.
3. Stop when every vertex is connected.

It is greedy: it always takes the cheapest edge that is safe.

:::example Worked example
Five points A to E. The weights are made up, and the steps were worked out by a script.

Edges: A–B 4, A–C 1, B–C 2, B–D 5, C–D 8, C–E 10, D–E 3.

| Edge | Weight | Decision |
|---|---|---|
| A–C | 1 | Add |
| B–C | 2 | Add |
| D–E | 3 | Add |
| A–B | 4 | Skip. A and B are already joined through C. |
| B–D | 5 | Add. This joins {A, B, C} to {D, E}. |
| C–D | 8 | Skip. Would make a cycle. |
| C–E | 10 | Skip. Would make a cycle. |

The tree has 4 edges (5 − 1): A–C, B–C, D–E and B–D. The total weight is 1 + 2 + 3 + 5 = 11.
:::

## Prim's algorithm

Prim's method starts from one vertex and grows a single tree. At each step it adds the lightest edge that connects the tree to a vertex not yet in it. It gives a tree of the same total weight.

## Why it matters

- **It solves a real design problem.** The problem was first solved by Otakar Borůvka in 1926, to plan an electricity network with the least wire. The same question appears for cable, pipes and roads.
- **It shows greedy working.** Unlike the coin example, picking the cheapest safe edge can be proved correct here.

## Common mistakes

- **"The tree is the shortest path between two points."** It minimises the total cost of connecting everything. A path between two points in it may be long.
- **"There is only one answer."** When weights tie, there can be several trees with the same total.

## Check yourself

:::check
Q: How many edges does a spanning tree of 5 vertices have?
A: 4.
Q: In the example, why is A–B skipped?
A: A and B are already connected through C, so the edge would make a cycle.
Q: What does Kruskal's algorithm do first?
A: Sorts the edges from lightest to heaviest.
:::

:::deeper
**Checking for a cycle.** Kruskal's algorithm needs a fast way to ask "are these two vertices already joined?". A structure called union-find answers this quickly.
:::
