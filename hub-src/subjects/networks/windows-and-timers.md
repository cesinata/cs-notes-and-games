---
title: Windows and timers
summary: How TCP limits how much the receiver has to hold, and how it works out how long to wait before resending.
sources:
- Peterson and Davie, Computer Networks: A Systems Approach, sections 5.2.4 to 5.2.6 (Sliding Window, Triggering Transmission, Adaptive Retransmission) | https://book.systemsapproach.org/e2e/tcp.html
- RFC 6298, Computing TCP's Retransmission Timer | https://www.rfc-editor.org/rfc/rfc6298
check:
- The receiver advertises a window, and the sender must not have more unacknowledged data than that | Peterson and Davie 5.2.4
- The sender estimates the round-trip time from samples | Peterson and Davie 5.2.6 and RFC 6298
- SRTT is updated as 7/8 of the old value plus 1/8 of the new sample | RFC 6298 section 2
- RTTVAR is updated as 3/4 of the old value plus 1/4 of the difference between SRTT and the sample | RFC 6298 section 2
- RTO equals SRTT plus 4 times RTTVAR | RFC 6298 section 2
- The first sample sets SRTT to the sample and RTTVAR to half the sample | RFC 6298 section 2
- RTO should be rounded up to at least 1 second | RFC 6298 section 2
---

TCP has two numbers to manage: how much data to send, and how long to wait for an answer. This page covers both.

## Start with a bookshelf

A friend lends you a shelf. You can only send as many books as the shelf holds. You also need to guess how long to wait before you decide a parcel is lost. Too short, and you send duplicates. Too long, and you waste time.

## The advertised window

The receiver has limited space. In each acknowledgement, it says how many more bytes it can take. This is the *advertised window*. The sender never has more unacknowledged data in flight than that.

:::example Worked example: the window
The receiver advertises a window of 5,000 bytes. The sender has sent 3,000 bytes that are not yet acknowledged. It may send another 5,000 − 3,000 = 2,000 bytes. If the receiver's program is slow to read, the window shrinks, and the sender slows down. This protects the receiver.
:::

## The retransmission timer

TCP waits a certain time, the *retransmission timeout* (RTO), before it resends. It bases this on the round-trip time (RTT), which changes. TCP keeps two smoothed values:

- **SRTT**, the smoothed RTT: new SRTT = 7/8 × old SRTT + 1/8 × sample
- **RTTVAR**, how much the RTT varies: new RTTVAR = 3/4 × old RTTVAR + 1/4 × |SRTT − sample|

And then: **RTO = SRTT + 4 × RTTVAR**.

For the first sample, SRTT is the sample and RTTVAR is half the sample.

:::example Worked example: the timer
The samples are made up, in milliseconds. These values were calculated by a script.

| Sample | SRTT | RTTVAR | RTO |
|---|---|---|---|
| 100 (first) | 100 | 50 | 300 |
| 120 | 102.5 | 42.5 | 272.5 |

After the second sample, the estimate has moved a little towards 120, and the variation has gone down. A standard also says the timer should never be below 1 second, so a real sender would round these up.
:::

## Common mistakes

- **"The window is the congestion window."** The advertised window protects the receiver. The congestion window protects the network. The sender obeys the smaller one.
- **"The timer is a fixed number."** It follows the measured round-trip time.

## Check yourself

:::check
Q: The window is 6,000 bytes and 4,500 bytes are unacknowledged. How much more can be sent?
A: 1,500 bytes.
Q: Which part of RTO covers how much the round trip varies?
A: 4 × RTTVAR.
Q: Why not use a fixed timer?
A: Round-trip times differ between paths, so a fixed value would be too short on some and too long on others.
:::

:::deeper
**Karn's rule.** TCP does not take an RTT sample from a segment that was sent twice, because it cannot tell which copy the acknowledgement was for.
:::
