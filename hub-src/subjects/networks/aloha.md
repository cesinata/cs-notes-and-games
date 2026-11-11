---
title: ALOHA
summary: The simplest way to share a channel, where anyone sends whenever they like, and how often that works.
practise:
- net/3.1 | ALOHA Party
sources:
- Wikipedia, ALOHAnet | https://en.wikipedia.org/wiki/ALOHAnet
- Peterson and Davie, Computer Networks: A Systems Approach, section 2.6 (Multi-Access Networks) | https://book.systemsapproach.org/direct/ethernet.html
check:
- In pure ALOHA a station sends whenever it has data, and if there is a collision it waits a random time and tries again | Wikipedia, ALOHAnet
- ALOHAnet was an early radio network at the University of Hawaii in the early 1970s | Wikipedia, ALOHAnet
- Pure ALOHA throughput is G times e to the power of minus 2G, with a maximum of about 18.4% | Wikipedia, ALOHAnet
- Slotted ALOHA throughput is G times e to the power of minus G, with a maximum of about 36.8% | Wikipedia, ALOHAnet
- Ethernet's design drew on ideas from ALOHA | Peterson and Davie 2.6
---

Many devices share one radio channel or one cable. If two send at once, their signals mix and both are lost. ALOHA is the simplest rule for dealing with that. It is where a lot of later ideas began.

## Start with a group chat on a walkie-talkie

Everyone has the same channel. If two people press the button at once, nobody can be understood. They each wait a random time and try again. That is ALOHA.

## Pure ALOHA

A station sends whenever it has data. If it does not hear an acknowledgement, it assumes a collision. It waits a random time and sends again. The random wait matters, because without it the two stations would collide again and again.

## Slotted ALOHA

Time is cut into equal slots, and a station may only start at the beginning of a slot. Two stations then either collide completely or not at all. That halves the time in which a collision can happen.

## How often does it work?

Let G be the average number of frames that stations try to send in one frame time. The share of time that carries a successful frame, called the throughput S, is:

- Pure ALOHA: S = G × e to the power of minus 2G
- Slotted ALOHA: S = G × e to the power of minus G

:::example Worked example
These values were computed by a script.

| Load G | Pure ALOHA S | Slotted ALOHA S |
|---|---|---|
| 0.1 | 0.082 | 0.090 |
| 0.5 | 0.184 | 0.303 |
| 1.0 | 0.135 | 0.368 |
| 2.0 | 0.037 | 0.271 |

Pure ALOHA peaks at about 18.4% at G = 0.5. Slotted ALOHA peaks at about 36.8% at G = 1. Past the peak, more load means more collisions, and less gets through.
:::

## Why it matters

ALOHA shows the basic trade-off of sharing a channel with no coordination: simple rules, but a lot of waste. Ethernet and Wi-Fi add rules that work better.

## Common mistakes

- **"More load means more throughput."** Past the peak, collisions reduce it.
- **"Slotted ALOHA removes collisions."** It makes them less likely. Two stations can still pick the same slot.

## Check yourself

:::check
Q: What does a station do after a collision in ALOHA?
A: It waits a random time and sends again.
Q: What is the best throughput of pure ALOHA?
A: About 18.4%.
Q: Why does slotted ALOHA do better?
A: A collision can only happen within one slot, so there is less time in which two stations can overlap.
:::

:::deeper
**Where it began.** ALOHAnet was a radio network in Hawaii in the early 1970s. Ethernet's designers used the idea of sending and retrying after a random wait.
:::
