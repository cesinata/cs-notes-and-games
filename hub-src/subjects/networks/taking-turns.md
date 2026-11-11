---
title: Taking turns
summary: How stations share a channel by passing a turn around, with no collisions, and what that costs.
sources:
- Wikipedia, Token passing | https://en.wikipedia.org/wiki/Token_passing
- Wikipedia, Polling (computer science) | https://en.wikipedia.org/wiki/Polling_(computer_science)
- Wikipedia, Token ring | https://en.wikipedia.org/wiki/Token_ring
- Peterson and Davie, Computer Networks: A Systems Approach, section 2.6 (Multi-Access Networks) | https://book.systemsapproach.org/direct/ethernet.html
check:
- In token passing, a special message called a token goes around the stations, and only the holder may send | Wikipedia, Token passing
- Token passing avoids collisions | Wikipedia, Token passing
- In polling, a central controller asks each station in turn whether it has data | Wikipedia, Polling
- A station may have to wait for the token even when the channel is idle | Wikipedia, Token passing
- Token ring networks were standardised as IEEE 802.5 | Wikipedia, Token ring
---

Instead of competing for the channel, stations can take turns. Nobody collides, but everyone has to wait. This page shows two ways to take turns and what they cost.

## Start with a talking stick

In some meetings, only the person holding the stick may speak. When they finish, they pass it on. No two people talk at once. The price is that you must wait for the stick, even if nobody else has anything to say.

## Token passing

A small special message called a *token* travels around the stations in a fixed order. A station may send only while it holds the token. When it is done, or its time is up, it passes the token to the next station.

## Polling

In *polling*, one central device, the controller, asks each station in turn: "Do you have anything to send?" A station answers only when asked.

:::example Worked example
Four stations, A, B, C and D, pass the token in order. Each sends one 1-millisecond frame per turn. The 1 millisecond is made up. The token passing time is ignored.

| Turn | Holder | Sends |
|---|---|---|
| 1 | A | a frame |
| 2 | B | a frame |
| 3 | C | a frame |
| 4 | D | a frame |
| 5 | A | a frame |

Station A sends in turn 1 and again in turn 5. Between turns it waits while B, C and D each send, which is 3 × 1 = 3 milliseconds. A station has to wait that long even if the other stations have nothing to send, because the token still has to go around.
:::

## The trade-off

Turn-taking has no collisions, so it works well when the channel is busy. When the channel is quiet, it wastes time, because a station still waits for its turn. Random access, as in Ethernet, is quicker when few stations want to send.

## Common mistakes

- **"A token is a frame of data."** It is a small control message that gives permission to send.
- **"Turn-taking is always fairer and faster."** It is fair, but it adds waiting, especially on a quiet channel.

## Check yourself

:::check
Q: Who may send in a token passing network?
A: Only the station that holds the token.
Q: Does token passing have collisions?
A: No, because only one station sends at a time.
Q: What is the downside when the network is quiet?
A: A station still waits for the token to come around.
:::

:::deeper
**Token ring.** Token ring networks were standardised as IEEE 802.5. Ethernet has mostly replaced them, but the idea of passing a turn still appears in other systems.
:::
