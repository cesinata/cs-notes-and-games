---
title: Hidden terminals
summary: Why two Wi-Fi devices can collide without hearing each other, and how a short request-and-reply fixes it.
practise:
- net/3.4 | Hidden Hills
sources:
- Peterson and Davie, Computer Networks: A Systems Approach, section 2.7 (Wireless Networks) | https://book.systemsapproach.org/direct/wireless.html
- Wikipedia, Hidden node problem | https://en.wikipedia.org/wiki/Hidden_node_problem
- Wikipedia, IEEE 802.11 RTS/CTS | https://en.wikipedia.org/wiki/IEEE_802.11_RTS/CTS
check:
- A hidden terminal is a station that one sender cannot hear but that can still interfere at the receiver | Peterson and Davie 2.7.2
- Wireless range is limited, so not every station hears every other | Peterson and Davie 2.7.1
- In 802.11, a sender can send a Request to Send (RTS) and the receiver replies with a Clear to Send (CTS) | Peterson and Davie 2.7.2
- Stations that hear the CTS stay quiet for the time named in it | Peterson and Davie 2.7.2
- RTS/CTS is optional in Wi-Fi | Wikipedia, IEEE 802.11 RTS/CTS
- The exposed terminal problem is the opposite case, where a station waits unnecessarily | Peterson and Davie 2.7.2
---

Listening before you send works well on a cable. On radio it can fail. A device can be too far from another to hear it, even though both reach the same access point. This page shows the problem and the fix.

## Start with three friends in a park

Ann and Cy are at opposite ends of a long field. Bo is in the middle and can hear both. Ann and Cy cannot hear each other. If both call out to Bo at the same moment, Bo hears a jumble. Neither Ann nor Cy knew the other was talking.

## The problem

Wireless range is limited. A station checks the channel before it sends, but it only hears the stations within its own range. A *hidden terminal* is a station that the sender cannot hear, but whose signal still reaches the receiver. When both send, they collide at the receiver, and carrier sense could not have helped.

## The fix: ask first

Wi-Fi can add a short exchange before a long frame:

1. The sender sends a short *Request to Send* (RTS) to the receiver.
2. The receiver replies with a short *Clear to Send* (CTS).
3. Any station that hears the CTS stays quiet for the time the CTS names.
4. The sender sends its frame.

The CTS reaches stations that cannot hear the sender, so the hidden station now knows to wait.

:::example Worked example
Stations A and C cannot hear each other. Both are in range of B.

| Step | What happens | Who hears it |
|---|---|---|
| 1 | A sends RTS to B | B (C does not hear A) |
| 2 | B sends CTS | A and C both hear B |
| 3 | C reads the CTS and stays quiet | |
| 4 | A sends its data to B | B |
| 5 | B sends an acknowledgement | A and C |

C was hidden from A, but it hears B, and that is enough.
:::

## What it costs

RTS and CTS add small messages to every exchange. They are worth the cost when frames are long and collisions are expensive. They are optional in Wi-Fi.

## Common mistakes

- **"Carrier sense would have caught it."** The hidden station cannot hear the sender, so there is nothing to sense.
- **"RTS and CTS go to the whole network."** They go only as far as radio range.

## Check yourself

:::check
Q: What is a hidden terminal?
A: A station that the sender cannot hear but that can still disturb the receiver.
Q: Which message tells hidden stations to wait?
A: The Clear to Send, sent by the receiver.
Q: Why are RTS and CTS optional?
A: They add extra messages, so they only pay off when collisions would be costly.
:::

:::deeper
**Exposed terminals.** The opposite case: a station hears a nearby sender and waits, even though its own signal would not have disturbed the receiver. It wastes time.
:::
