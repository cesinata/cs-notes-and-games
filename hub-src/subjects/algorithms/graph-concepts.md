---
title: Graph concepts
summary: What a graph is, the words used to describe one, and two ways to store it in a computer.
practise:
- algo/1.5 | Bridge Walker
sources:
- Erickson, Algorithms (2019), CC BY 4.0, chapter 5 (Basic Graph Algorithms) | https://jeffe.cs.illinois.edu/teaching/algorithms/book/05-graphs.pdf
- Morin, Open Data Structures, chapter 12 (Graphs) | https://opendatastructures.org/
check:
- A graph is a set of vertices and a set of edges that connect pairs of vertices | Erickson, chapter 5
- The degree of a vertex is the number of edges that touch it | Erickson, chapter 5
- The degrees of all vertices add up to twice the number of edges | Erickson, chapter 5
- A path is a sequence of vertices joined by edges, and a cycle is a path that returns to its start | Erickson, chapter 5
- A graph can be stored as an adjacency matrix or as adjacency lists | Erickson, chapter 5 and Open Data Structures, chapter 12
---

A graph is a way to describe things and the connections between them. Maps, social networks and the internet are all graphs. This page covers the words and the ways of storing one.

## Start with a map of towns

Towns are dots. Roads between towns are lines. That is a graph. It does not matter how the dots are placed on paper. It only matters which towns are joined.

## The words

- A **vertex** (plural vertices) is a dot. An **edge** is a line joining two vertices.
- A graph is **undirected** if edges work both ways, and **directed** if each edge has a direction.
- A **weighted** graph has a number on each edge, such as a distance.
- The **degree** of a vertex is the number of edges that touch it.
- A **path** is a sequence of vertices joined by edges. A **cycle** is a path that comes back to where it started.
- A graph is **connected** if there is a path between every pair of vertices.
- A **tree** is a connected graph with no cycles.

## Two ways to store a graph

An **adjacency matrix** is a table with a row and a column for every vertex. A 1 means the two vertices are joined. For n vertices it always takes n × n cells.

An **adjacency list** keeps, for each vertex, a list of its neighbours. It takes space in proportion to the number of vertices plus the number of edges.

:::example Worked example
A graph with 5 vertices and 5 edges: A–B, A–C, B–D, C–D and D–E. These values were worked out by a script.

Adjacency lists:

| Vertex | Neighbours | Degree |
|---|---|---|
| A | B, C | 2 |
| B | A, D | 2 |
| C | A, D | 2 |
| D | B, C, E | 3 |
| E | D | 1 |

The degrees add up to 2 + 2 + 2 + 3 + 1 = 10, which is twice the number of edges (5). Every edge adds 1 to the degree of each of its two ends.

A matrix for this graph would need 5 × 5 = 25 cells. The lists hold 10 entries.
:::

## Which to choose

A matrix is quick to check "is there an edge between these two?". Lists use less space when there are few edges, which is true of most real graphs.

## Common mistakes

- **"Edges and vertices are the same."** Vertices are the things. Edges are the connections.
- **"A map's drawing is the graph."** The graph is only what is connected to what.

## Check yourself

:::check
Q: A graph has 6 edges. What do all its degrees add up to?
A: 12, which is twice the number of edges.
Q: What is a cycle?
A: A path that returns to its starting vertex.
Q: When is an adjacency list better than a matrix?
A: When the graph has few edges compared with the number of vertices.
:::

:::deeper
**Directed graphs.** In a directed graph, a vertex has an *in-degree* and an *out-degree*. Web links are a directed graph.
:::
