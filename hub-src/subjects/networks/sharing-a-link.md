---
title: Sharing a link
summary: How many conversations use one link at the same time, by splitting it up by time, by frequency, or by packet.
sources:
- Peterson and Davie, Computer Networks: A Systems Approach, section 1.2.3 (Cost-Effective Resource Sharing) | https://book.systemsapproach.org/foundation/requirements.html
- Peterson and Davie, Computer Networks: A Systems Approach, section 3.1 (Switching Basics) | https://book.systemsapproach.org/internetworking/switching.html
check:
- Multiplexing lets several flows share one link | Peterson and Davie 1.2.3
- Synchronous time-division multiplexing gives each flow a fixed time slot | Peterson and Davie 1.2.3
- Frequency-division multiplexing gives each flow its own band of frequencies | Peterson and Davie 1.2.3
- Statistical multiplexing sends packets on demand and shares the link as needed | Peterson and Davie 1.2.3
- Packet switching uses statistical multiplexing | Peterson and Davie 1.2.3 (3.1 introduces packet switching)
---

A network has a lot more conversations than it has cables. So many conversations have to share each cable. This page shows three ways to share.

## Start with a road

A road carries cars from many drivers. Some roads give each driver a fixed turn. Others let anyone drive when there is room. Both share the road, and the result feels different.

## Three ways to share

- **Time-division multiplexing (TDM).** Time is cut into slots, and each conversation gets its own slot in a repeating cycle. A slot goes unused if its owner has nothing to send.
- **Frequency-division multiplexing (FDM).** Each conversation gets its own band of frequencies on the same medium, like radio stations on different channels.
- **Statistical multiplexing.** Data is cut into packets, and packets from all the conversations are sent as they arrive. If one conversation is quiet, the others use its share.

The internet is built on statistical multiplexing. It is the idea behind *packet switching*.

:::example Worked example
A link carries 10 million bits a second. Five users share it. These figures were calculated by a script.

| Method | Each user gets | If only 2 of the 5 are active |
|---|---|---|
| TDM (fixed slots) | 2 million bits a second | Still 2 million each. The other slots sit empty. |
| Statistical multiplexing | Shares as needed | 5 million each |

The numbers show the trade-off. Fixed slots give a guaranteed share but waste capacity. Sharing on demand uses the link better, but a user can get less when many others are busy.
:::

## What goes wrong with sharing

With statistical multiplexing, too many users at once can fill the queues at a router, and packets wait or get dropped. This is why networks need ways to handle congestion.

## Common mistakes

- **"Each conversation has its own wire."** Many conversations share most links.
- **"Sharing is always slower."** If others are quiet, you can use more than a fixed share.

## Check yourself

:::check
Q: In TDM, what happens to a slot whose owner has nothing to send?
A: It goes unused.
Q: Which method does packet switching use?
A: Statistical multiplexing.
Q: Five users share a 10 million bit a second link with TDM. What does each get?
A: 2 million bits a second.
:::

:::deeper
**Circuit switching.** Old telephone networks set up a dedicated path, called a circuit, for each call. It guarantees a steady rate, but it ties up capacity while the line is quiet.
:::
