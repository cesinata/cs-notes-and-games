---
title: Carrier sense
summary: How listening before sending, and backing off after a collision, makes Ethernet far better than ALOHA.
practise:
- net/3.2 | Listen Before You Talk
sources:
- Peterson and Davie, Computer Networks: A Systems Approach, section 2.6 (Multi-Access Networks) | https://book.systemsapproach.org/direct/ethernet.html
- Peterson and Davie, Computer Networks: A Systems Approach, section 2.7 (Wireless Networks) | https://book.systemsapproach.org/direct/wireless.html
- Wikipedia, Carrier-sense multiple access with collision detection | https://en.wikipedia.org/wiki/Carrier-sense_multiple_access_with_collision_detection
check:
- A station using carrier sense listens before it transmits and waits while the line is busy | Peterson and Davie 2.6.2
- Collision detection means a sender keeps listening while it transmits and stops if it detects a collision | Peterson and Davie 2.6.2
- After a collision, Ethernet backs off a random number of slot times, with the range doubling each time | Peterson and Davie 2.6.2
- A slot time is 512 bit times, which is 51.2 microseconds at 10 Mbit/s | Peterson and Davie 2.6.2
- An Ethernet sender gives up after a set number of attempts | Peterson and Davie 2.6.2 ("a given number of tries")
- Wi-Fi uses collision avoidance because a radio cannot reliably listen while it sends | Peterson and Davie 2.7.2
---

ALOHA wastes a lot of time on collisions. A cheap trick helps a great deal: listen before you speak. This page shows how Ethernet does it, and what happens when two stations speak at the same moment anyway.

## Start with a conversation

In a meeting, you wait for a gap before you talk. If you and someone else start together, you both stop and then try again after a short, different pause.

## Carrier sense and collision detection

Ethernet's older shared-cable form used *CSMA/CD*:

1. **Carrier sense.** Listen. If someone is sending, wait.
2. **Multiple access.** When the cable is quiet, anyone may send.
3. **Collision detection.** While sending, keep listening. If another signal mixes in, stop at once.

Collisions can still happen, because a signal takes time to cross the cable. Two stations can both hear silence and start before they hear each other.

## Backing off

After a collision, a station waits a random number of *slot times* before trying again. A slot time is 512 bit times. On a 10 million bit a second link, that is 512 ÷ 10,000,000 = 51.2 microseconds.

The range of the random wait doubles with each repeated collision, up to a limit. This is called *binary exponential backoff*. After a set number of failed tries, the sender gives up.

:::example Worked example
The number of slot times a station may wait after its n-th collision, picked at random from 0 up to 2 to the power of n, minus 1.

| Collision number | Wait is one of |
|---|---|
| 1 | 0 or 1 slot |
| 2 | 0 to 3 slots |
| 3 | 0 to 7 slots |
| 4 | 0 to 15 slots |

The longer a station has been unlucky, the more spread out the waits get, so repeat collisions become less likely.
:::

## Wi-Fi

Wi-Fi uses *collision avoidance* (CSMA/CA) instead. A radio cannot reliably listen while it sends, so Wi-Fi waits for a quiet channel, then adds a random wait before it sends, and uses acknowledgements to find out whether a frame got through.

## Common mistakes

- **"Carrier sense prevents all collisions."** Signal travel time means two stations can still start together.
- **"The backoff stays the same."** It doubles each time, up to a limit.

## Check yourself

:::check
Q: What does a CSMA/CD station do while it sends?
A: It keeps listening for a collision, and stops if it detects one.
Q: After a third collision, which waits are possible?
A: 0 to 7 slot times.
Q: Why does Wi-Fi not use collision detection?
A: A radio cannot reliably listen while it is sending.
:::

:::deeper
**Switches.** Modern wired Ethernet uses switches, so each cable has only two devices on it. On full-duplex switched links, collisions no longer happen. CSMA/CD is mostly of historical interest, but it is the base for understanding shared channels.
:::
