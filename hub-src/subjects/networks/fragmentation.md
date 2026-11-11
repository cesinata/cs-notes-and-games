---
title: Fragmentation
summary: What happens when a packet is too big for a link, and how fragments are labelled so they can be put back together.
sources:
- RFC 791, Internet Protocol, fragmentation and reassembly | https://www.rfc-editor.org/rfc/rfc791
- Peterson and Davie, Computer Networks: A Systems Approach, section 3.3.2 (Service Model, with fragmentation and reassembly) | https://book.systemsapproach.org/internetworking/basic-ip.html
- RFC 8200, Internet Protocol, Version 6 (IPv6) Specification | https://www.rfc-editor.org/rfc/rfc8200
check:
- Each link has a maximum transmission unit (MTU), the largest packet it can carry | Peterson and Davie 3.3.2
- Ethernet's MTU is 1500 bytes | Peterson and Davie 2.6.2 and 3.3.2
- IPv4 can split a packet into fragments, and the destination puts them back together | RFC 791 section 2.3 and Peterson and Davie 3.3.2
- The fragment offset field counts in units of 8 bytes | RFC 791 section 3.1
- The more-fragments flag is set on every fragment except the last | RFC 791 section 3.1
- In IPv6, routers do not fragment packets, and only the source can | RFC 8200 section 4.5
---

Different links can carry different packet sizes. A packet that is fine on one link may be too big for the next. This page shows how IPv4 deals with that.

## Start with a long sofa

A sofa fits through the front door but not around a tight stairwell. You can take it apart, carry the pieces up, and put it together at the top. Fragmentation does this to packets.

## The idea

Every link has a *maximum transmission unit* (MTU): the largest packet it can carry. Ethernet's MTU is 1,500 bytes. If a packet is larger than the next link's MTU, a router can split it into *fragments*. Each fragment is a packet of its own. The destination collects them and joins them again. Routers in between do not.

To make that work, each fragment's header says where it belongs:

- **Fragment offset:** the position of the data in the original packet, counted in units of 8 bytes.
- **More fragments (MF) flag:** set to 1 on every fragment except the last.
- **Identification:** the same number on all fragments of one packet.

:::example Worked example
A packet of 4,000 bytes (20 bytes of header and 3,980 bytes of data) meets a link with an MTU of 1,500. Each fragment has its own 20-byte header, so it can hold up to 1,480 bytes of data. 1,480 is a multiple of 8. These values were worked out by a script.

| Fragment | Data bytes | Packet size | Offset | MF |
|---|---|---|---|---|
| 1 | 1,480 | 1,500 | 0 | 1 |
| 2 | 1,480 | 1,500 | 185 | 1 |
| 3 | 1,020 | 1,040 | 370 | 0 |

The offsets are in units of 8 bytes: 185 × 8 = 1,480 and 370 × 8 = 2,960. The total data is 1,480 + 1,480 + 1,020 = 3,980 bytes.
:::

## What it costs

Fragments add extra headers. If one fragment is lost, the whole packet is lost, because the destination cannot rebuild it. Fragmentation also makes work for the receiver. So senders try to send packets that fit.

## Common mistakes

- **"Routers rejoin the fragments."** Only the destination does.
- **"The offset counts bytes."** It counts in units of 8 bytes.

## Check yourself

:::check
Q: What is an MTU?
A: The largest packet a link can carry.
Q: Which fragment has the more-fragments flag set to 0?
A: The last one.
Q: In the example, why is the third fragment's offset 370?
A: Two earlier fragments carried 2,960 bytes of data, and 2,960 ÷ 8 = 370.
:::

:::deeper
**IPv6.** IPv6 routers do not fragment. If a packet is too big, the router drops it and sends back a message, and the sender uses a smaller size. This is called path MTU discovery.
:::
