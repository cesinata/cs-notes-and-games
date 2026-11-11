---
title: Distance-vector routing
summary: How routers that only talk to their neighbours still learn the best routes, and what goes wrong when a link fails.
practise:
- net/4.5 | Rumour Mill
sources:
- Peterson and Davie, Computer Networks: A Systems Approach, section 3.4.2 (Distance-Vector (RIP)) | https://book.systemsapproach.org/internetworking/routing.html
- RFC 2453, RIP Version 2 | https://www.rfc-editor.org/rfc/rfc2453
check:
- In distance-vector routing, each router keeps a table of distance to every destination and shares it with its neighbours | Peterson and Davie 3.4.2
- A router updates an entry if the neighbour's distance plus the link cost is smaller | Peterson and Davie 3.4.2
- RIP uses hop count as its cost | RFC 2453 section 3.2 and Peterson and Davie 3.4.2
- RIP treats a distance of 16 as infinity, so the longest usable path is 15 hops | RFC 2453 section 3.4.1
- After a link failure, routers can count up slowly towards infinity | Peterson and Davie 3.4.2
- Split horizon helps to avoid routing loops | Peterson and Davie 3.4.2 and RFC 2453 section 3.4.3
---

Link-state routing gives every router the whole map. Distance-vector routing is humbler. Each router knows only its own neighbours, and learns the rest by listening. This page shows how that works.

## Start with asking for directions

You do not know the way to a town. You ask a neighbour, who says "I'm two streets from there". Add the one street to your neighbour, and you know the town is three streets away. Routers do the same.

## The idea

Each router keeps a table with one row for each destination: how far away it is, and which neighbour to go through. Every so often, it sends its table to its neighbours. When a router receives a table, it checks each row:

*my distance to the destination through that neighbour = the neighbour's distance + the cost of the link to that neighbour*

If that is smaller than what the router has now, it updates its row.

:::example Worked example
Three routers in a line: X, Y and Z. Each link costs 1. Each router starts knowing only itself. This was worked out by a script.

| After round | X's table | Z's table |
|---|---|---|
| 0 | X: 0 | Z: 0 |
| 1 | X: 0, Y: 1 | Z: 0, Y: 1 |
| 2 | X: 0, Y: 1, Z: 2 | Z: 0, Y: 1, X: 2 |

In round 2, Y tells X "I am 1 away from Z". X adds the 1 it takes to reach Y, so Z is 2 away through Y. After round 2, nothing changes, so the tables are settled.
:::

## When a link fails

Bad news travels slowly. If a link breaks, routers that still believe in old routes can hand the news back and forth, each time adding one, and the distance climbs slowly. This is called counting to infinity.

Two common remedies:

- A small limit on the distance that counts as infinity. RIP, a distance-vector protocol, uses hop count, and treats 16 as infinity. So the longest usable path is 15 hops.
- *Split horizon*: a router does not tell a neighbour about a route that goes through that same neighbour.

## Common mistakes

- **"Each router sends its whole map."** It only sends its distances.
- **"The tables are settled after one round."** It takes as many rounds as the longest path.

## Check yourself

:::check
Q: In the example, how does X learn the distance to Z?
A: Y tells X it is 1 away from Z, and X adds the link cost to Y: 1 + 1 = 2.
Q: What does RIP treat as infinity?
A: A distance of 16 hops.
Q: What does split horizon do?
A: It stops a router telling a neighbour about a route that goes through that neighbour.
:::

:::deeper
**Bellman-Ford.** The update rule is the heart of the Bellman-Ford algorithm, which finds shortest paths from one node to all others.
:::
