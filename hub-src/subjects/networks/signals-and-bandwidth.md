---
title: Signals and bandwidth
summary: How bits become a signal on a wire, and what bandwidth means in hertz and in bits a second.
practise:
- net/1.3 | Signal Studio
sources:
- Peterson and Davie, Computer Networks: A Systems Approach, section 2.2 (Encoding) | https://book.systemsapproach.org/direct/encoding.html
- Peterson and Davie, Computer Networks: A Systems Approach, section 1.5.1 (Bandwidth and Latency) | https://book.systemsapproach.org/foundation/performance.html
- Peterson and Davie, Computer Networks: A Systems Approach, section 2.1 (Perspectives on Connecting) | https://book.systemsapproach.org/direct/perspective.html
- Wikipedia, Line code | https://en.wikipedia.org/wiki/Line_code
check:
- A link carries a signal, and encoding turns bits into signal levels | Peterson and Davie 2.2
- In NRZ encoding a 1 is a high signal and a 0 is a low signal | Peterson and Davie 2.2
- In NRZI encoding a 1 is a change of level and a 0 is no change | Peterson and Davie 2.2
- Long runs of the same bit can make the receiver lose track of the clock | Peterson and Davie 2.2
- Bandwidth can mean the range of frequencies in hertz, or the data rate in bits per second | Peterson and Davie 1.5.1 and 2.1
---

A wire cannot carry the number 1 or the number 0. It carries a voltage, a pulse of light, or a radio wave. This page explains how bits turn into a signal, and what the word bandwidth means.

## Start with a torch

You could send a message with a torch: light on for 1, light off for 0. The other person watches. That is a signal, and the on and off pattern is the *encoding*.

## Encoding

The simplest encoding is *NRZ*. A high level means 1 and a low level means 0.

A second one, *NRZI*, uses changes. A 1 means "change the level". A 0 means "stay as you are".

:::example Worked example
The bits 1011001, with the signal starting low. H means high and L means low. This was worked out by a script.

| Bits | 1 | 0 | 1 | 1 | 0 | 0 | 1 |
|---|---|---|---|---|---|---|---|
| NRZ | H | L | H | H | L | L | H |
| NRZI | H | H | L | H | H | H | L |
:::

## The clock problem

The receiver has to know when one bit ends and the next begins. It works this out from the changes in the signal. In NRZ, a long run of 0s or of 1s gives no change in the signal. In NRZI, a long run of 0s does the same. The receiver can then lose its place. More advanced encodings add changes on purpose to prevent this.

## Two meanings of bandwidth

- **In hertz,** bandwidth is the range of frequencies a channel can pass.
- **In everyday talk,** bandwidth is the data rate: how many bits a second the link can carry.

The two are linked. A channel that passes a wider range of frequencies can carry more bits a second. The next page puts numbers on this.

## Common mistakes

- **"The wire carries the digits 1 and 0."** It carries a signal that stands for them.
- **"Bandwidth is speed."** It is how much the link can carry each second. A signal still takes time to travel.

## Check yourself

:::check
Q: In NRZI, what does a 1 do to the signal?
A: It changes the level.
Q: Why can a long run of 0s cause trouble in NRZ?
A: The signal does not change, so the receiver can lose track of the clock.
Q: Name the two meanings of bandwidth.
A: A range of frequencies in hertz, and a data rate in bits a second.
:::

:::deeper
**Manchester and 4B/5B.** Manchester encoding puts a change in the middle of every bit, so the clock is always there, but it needs twice the signal changes. 4B/5B sends 4 bits of data as 5 bits, chosen so that runs of zeros stay short.
:::
