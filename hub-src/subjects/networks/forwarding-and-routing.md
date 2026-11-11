---
title: Forwarding and routing
summary: The difference between moving one packet along and working out the routes, and how a router picks a row in its table.
practise:
- net/4.1 | Two Kinds of Post
sources:
- Peterson and Davie, Computer Networks: A Systems Approach, section 3.3 (Internet (IP)) | https://book.systemsapproach.org/internetworking/basic-ip.html
- Peterson and Davie, Computer Networks: A Systems Approach, section 3.4 (Routing) | https://book.systemsapproach.org/internetworking/routing.html
- RFC 4632, Classless Inter-domain Routing (CIDR) | https://www.rfc-editor.org/rfc/rfc4632
check:
- Forwarding is the action of sending a packet on, using the forwarding table | Peterson and Davie 3.4
- Routing is the process of building the forwarding table | Peterson and Davie 3.4
- A router chooses the table entry with the longest matching prefix | Peterson and Davie 3.3.5 and RFC 4632 section 5.1
- A default route matches everything and has a prefix length of 0 | Peterson and Davie 3.3.4 (default router; it does not mention prefix length 0)
- Forwarding happens for every packet, and routing runs in the background | Peterson and Davie 3.4
---

Two different jobs get a packet to its destination. One is quick and happens for every packet. The other is slower and happens in the background. This page keeps them apart.

## Start with a postal sorting office

A sorter looks at an address and drops each letter in a bin for the next truck. That is *forwarding*. Somewhere else, planners decide which trucks go where. That is *routing*.

## The two jobs

- **Forwarding** is moving one packet one step along. The router reads the destination address, looks it up in its *forwarding table*, and sends the packet out of the right port. It happens to every packet, so it has to be fast.
- **Routing** is building the forwarding table. Routers run routing protocols, talk to each other, and work out the best paths. This happens in the background and updates the table when things change.

## Picking a row: longest prefix

A forwarding table has rows made of a *prefix* and a port. A destination address can match several rows at once. The router picks the one with the *longest prefix*, which is the most specific. A *default route* has a prefix length of 0 and matches everything. It is used when nothing else fits.

:::example Worked example
A router has this table. The ports are made up.

| Prefix | Port |
|---|---|
| 192.168.10.0/24 | 1 |
| 192.168.0.0/16 | 2 |
| 0.0.0.0/0 (default) | 3 |

These matches were worked out by a script.

| Destination | Rows that match | Longest | Port |
|---|---|---|---|
| 192.168.10.70 | /24, /16, /0 | /24 | 1 |
| 192.168.77.5 | /16, /0 | /16 | 2 |
| 8.8.8.8 | /0 only | /0 | 3 |
:::

## Why two jobs

If a link fails, routing notices and updates the table. Packets in the meantime keep being forwarded using the table as it is. Keeping the jobs apart lets forwarding stay fast while routing does the slow thinking.

## Common mistakes

- **"Routing and forwarding mean the same thing."** Forwarding moves a packet. Routing builds the table.
- **"The first matching row wins."** The longest matching prefix wins.

## Check yourself

:::check
Q: Which job happens for every single packet?
A: Forwarding.
Q: A packet matches a /16 row and a /24 row. Which does the router use?
A: The /24 row, because it has the longer prefix.
Q: What is a default route for?
A: It catches any address that no other row matches.
:::

:::deeper
**Tables get big.** The internet's routers hold a very large number of prefixes. CIDR lets many addresses be joined into one row to keep tables smaller.
:::
