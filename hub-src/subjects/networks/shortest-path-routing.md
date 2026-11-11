---
title: Shortest-path routing
summary: How a router works out the cheapest route to every other router when it knows the whole map, using Dijkstra's algorithm.
practise:
- net/4.4 | Shortest Trail
sources:
- Peterson and Davie, Computer Networks: A Systems Approach, section 3.4.3 (Link State (OSPF)) | https://book.systemsapproach.org/internetworking/routing.html
- RFC 2328, OSPF Version 2 | https://www.rfc-editor.org/rfc/rfc2328
check:
- In link-state routing, each router tells all the others about its links, so every router has the whole map | Peterson and Davie 3.4.3
- Each router then computes the shortest paths with Dijkstra's algorithm | Peterson and Davie 3.4.3
- OSPF is a link-state routing protocol | RFC 2328 and Peterson and Davie 3.4.3
- Dijkstra's algorithm repeatedly picks the unvisited node with the smallest known distance | Peterson and Davie 3.4.3 (it calls them the tentative and confirmed lists)
---

If a router knew the whole network map, it could work out the best route to every other router. This page shows how, with a small map.

## Start with a road map

You know every road and how long each takes. To find the quickest way to every town, you start at home, then look at the nearest town, then the next nearest, and so on. At each step you check whether going through the newest town gives a shorter way to its neighbours.

## Link-state routing

In *link-state routing*, every router tells every other router about its own links and their costs. After this, each router has the same map. Each then works out the shortest paths with *Dijkstra's algorithm*. OSPF is a widely used link-state protocol.

## Dijkstra's algorithm

1. Give the start node distance 0, and every other node infinity.
2. Take the unvisited node with the smallest distance.
3. For each neighbour, check whether going through this node gives a shorter distance. If so, update it.
4. Repeat until every node is done.

:::example Worked example
A map of five routers, with the cost of each link. The costs are made up, and the results were worked out by a script.

Links: A–B 2, A–C 5, B–C 1, B–D 4, C–D 2, C–E 6, D–E 3.

Starting at A:

| Step | Node taken | Distance | Reached through |
|---|---|---|---|
| 1 | A | 0 | start |
| 2 | B | 2 | A |
| 3 | C | 3 | B |
| 4 | D | 5 | C |
| 5 | E | 8 | D |

The direct link A–C costs 5, but A to B to C costs 2 + 1 = 3, so the route through B wins. All of A's best routes begin with the link to B, so A's forwarding table sends everything towards B.
:::

## What it needs

Every router has to know the whole map, and has to recompute when a link changes. That works well inside one organisation, but it would not scale to the whole internet. Larger networks use other methods between organisations.

## Common mistakes

- **"The direct link is always the shortest."** The direct A–C link costs 5. The route through B costs 3.
- **"Each router only knows its neighbours."** In link-state routing, every router knows the whole map.

## Check yourself

:::check
Q: In the example, what is the shortest distance from A to D?
A: 5, by A to B to C to D.
Q: What does a link-state router tell the others?
A: The state and cost of its own links.
Q: What algorithm does each router run?
A: Dijkstra's algorithm.
:::

:::deeper
**Costs.** A link's cost can be anything an operator chooses, such as delay or the inverse of bandwidth. A cost of 1 on every link gives the fewest hops.
:::
