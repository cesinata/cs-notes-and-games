---
title: Delay
summary: The four kinds of delay a packet meets, and why a faster plan does not always make things feel faster.
practise:
- net/1.1 | Delay Dash
sources:
- Peterson and Davie, Computer Networks: A Systems Approach, section 1.5 (Performance) | https://book.systemsapproach.org/foundation/performance.html
- MDN Web Docs, Latency (glossary) | https://developer.mozilla.org/en-US/docs/Glossary/Latency
check:
- Latency is made up of propagation delay, transmission delay and queuing delay | Peterson and Davie 1.5.1
- Transmission delay is the packet size divided by the link bandwidth | Peterson and Davie 1.5.1
- Propagation delay is the distance divided by the speed of the signal | Peterson and Davie 1.5.1
- A signal in optical fibre travels at about 200,000 km a second | Peterson and Davie 1.5.1
- Bandwidth and latency are different measures | Peterson and Davie 1.5.1
- The delay times bandwidth product, using the one-way delay, is the amount of data on the link at once | Peterson and Davie 1.5.2
- To keep a sender busy for a whole round trip, it must send round-trip time times bandwidth | Peterson and Davie 1.5.2
---

Everyone has had a video call that lags on a fast connection. This page explains why. The short version is that a fast connection and a quick connection are not the same thing.

## Start with a delivery

Say you send a parcel by truck. How long it takes depends on three things: the time to load the truck, the distance, and any wait at the depot. Data on a network has the same three.

## The three delays

- **Transmission delay** is the time to push all the bits of a packet onto the link. It is the packet size divided by the *bandwidth* (the bits the link carries each second).
- **Propagation delay** is the time for the signal to travel along the link. It is the distance divided by the signal speed. In optical fibre that is about 200,000 km a second.
- **Queuing delay** is the time a packet waits in a router's line before it is sent. It changes from moment to moment.
*Latency* is the total delay. The time for a packet to go there and back is the *round-trip time*.

:::example Worked example
These numbers are made up, and were computed by a script. A link is 1,000 km long and carries 100 million bits a second. A packet is 1,500 bytes, which is 12,000 bits.

- Transmission delay: 12,000 ÷ 100,000,000 = 0.00012 seconds, which is 0.12 milliseconds.
- Propagation delay: 1,000 ÷ 200,000 = 0.005 seconds, which is 5 milliseconds.
- Round trip, propagation only: 10 milliseconds.

For this small packet, distance is the main delay. For a 100 MB file on the same link, transmission takes 800,000,000 ÷ 100,000,000 = 8 seconds, so size becomes the main delay.
:::

## Why faster internet does not fix lag

A faster plan raises the bandwidth. That shortens transmission delay, which helps big downloads. It does not change the distance or the speed of the signal, so propagation delay stays the same. A video call sends small packets, so propagation and queuing matter most.

## Common mistakes

- **"More bandwidth means less delay."** Bandwidth and delay are different. Bandwidth is how much per second. Delay is how long one trip takes.
- **"Signals travel instantly."** They do not. Even light in fibre takes about 5 milliseconds to cover 1,000 km.

## Check yourself

:::check
Q: How long does a signal take to travel 2,000 km in fibre, at 200,000 km a second?
A: 2,000 ÷ 200,000 = 0.01 seconds, which is 10 milliseconds.
Q: Which delay depends on the size of the packet?
A: Transmission delay.
Q: A 125,000-byte file goes over a 1 million bit a second link. What is the transmission delay?
A: 125,000 bytes is 1,000,000 bits. 1,000,000 ÷ 1,000,000 = 1 second.
:::

:::deeper
**Bandwidth-delay product.** Multiply the bandwidth by the one-way delay. The result is how much data is on the link at once. For 100 million bits a second and 5 milliseconds one way, that is 500,000 bits, or 62,500 bytes. To keep a sender busy for a whole round trip, multiply by the round-trip time instead. Here that is 1,000,000 bits, or 125,000 bytes.

**A fourth delay.** Some books also count the short time a router spends reading each packet. It is usually very small.
:::
