---
title: Announcing routes
summary: How separate networks on the internet tell each other which addresses they can reach, using BGP and AS paths.
sources:
- RFC 4271, A Border Gateway Protocol 4 (BGP-4) | https://www.rfc-editor.org/rfc/rfc4271
- RFC 5398, Autonomous System (AS) Number Reservation for Documentation Use | https://www.rfc-editor.org/rfc/rfc5398
- Peterson and Davie, Computer Networks: A Systems Approach, section 4.1 (Global Internet) | https://book.systemsapproach.org/scaling/global.html
check:
- An autonomous system (AS) is a network under one administration with a common routing policy | Peterson and Davie 4.1 and RFC 4271 section 1.1
- BGP is the protocol used between autonomous systems | RFC 4271 section 1.1 and Peterson and Davie 4.1.2
- A BGP advertisement carries the prefix and the list of ASes it has passed through (the AS path) | RFC 4271 section 5.1.2
- A BGP speaker rejects a route whose AS path already contains its own AS number | RFC 4271 section 9.1.2
- AS numbers 64496 to 64511 are reserved for documentation | RFC 5398 section 4
- BGP route choice is driven by policy, not only by the shortest path | Peterson and Davie 4.1.2
---

The internet is not one network. It is tens of thousands of separate networks that agree to carry each other's traffic. This page explains how they tell each other what they can reach.

## Start with phone companies

Each phone company has its own customers and its own rules. Companies swap calls with each other by agreement. No one company knows every number, but each knows who to hand a call to. Internet networks work the same way.

## Autonomous systems

An *autonomous system* (AS) is a network run by one organisation under its own routing policy, such as an internet provider, a university or a large company. Each AS has an AS number.

Inside an AS, the operator picks its own routing method, such as the ones in earlier pages. Between ASes, the internet uses one protocol: the *Border Gateway Protocol*, or BGP.

## Announcements

An AS announces the address prefixes it can reach to its neighbours. Each announcement carries the *AS path*: the list of ASes it has passed through. A neighbour that passes it on adds its own AS number to the front.

:::example Worked example
The AS numbers and the prefix here are reserved for documentation, so they are not real networks. AS 64500 owns the prefix 192.0.2.0/24.

| Step | Who announces | AS path in the announcement |
|---|---|---|
| 1 | AS 64500 to AS 64501 | 64500 |
| 2 | AS 64501 to AS 64502 | 64501 64500 |
| 3 | AS 64502 to AS 64500 | 64502 64501 64500 |

At step 3, AS 64500 sees its own number in the path. That means the route has come full circle, so it ignores it. This is how BGP avoids loops.
:::

## Policy comes first

BGP does not simply pick the shortest path. An operator can prefer a route because it is cheaper or because of an agreement with a neighbour. Each AS decides which routes to accept and which to pass on.

## Common mistakes

- **"BGP finds the fastest route."** It follows policy. The shortest AS path is only one of the things it can consider.
- **"One network runs BGP for the whole internet."** Each AS runs it and decides for itself.

## Check yourself

:::check
Q: What is an autonomous system?
A: A network run by one organisation under its own routing policy.
Q: What does an AS path list?
A: The ASes that an announcement has passed through.
Q: How does a router notice a loop in BGP?
A: Its own AS number already appears in the AS path.
:::

:::deeper
**Mistakes spread.** Because networks believe each other's announcements, a wrong announcement can send traffic to the wrong place. Operators use filters and checks to limit this.
:::
