---
title: Channel limits
summary: The two limits on how fast a channel can carry data, from the number of signal levels and from noise.
practise:
- net/1.4 | Channel Limits
sources:
- Wikipedia, Shannon-Hartley theorem | https://en.wikipedia.org/wiki/Shannon%E2%80%93Hartley_theorem
- Wikipedia, Decibel | https://en.wikipedia.org/wiki/Decibel
- Peterson and Davie, Computer Networks: A Systems Approach, section 2.1 (Perspectives on Connecting) | https://book.systemsapproach.org/direct/perspective.html
check:
- With no noise, the maximum bit rate is 2 times the bandwidth times log base 2 of the number of signal levels | Wikipedia, Shannon-Hartley theorem (Hartley's law)
- With noise, the capacity is the bandwidth times log base 2 of (1 plus the signal-to-noise ratio) | Wikipedia, Shannon-Hartley theorem
- A signal-to-noise ratio in decibels converts to a ratio as 10 to the power of (decibels divided by 10) | Wikipedia, Decibel
- Claude Shannon published this result in 1948 | Wikipedia, Shannon-Hartley theorem
- No coding scheme can go above the Shannon capacity with a vanishing error rate | Wikipedia, Shannon-Hartley theorem
---

A faster link takes more than trying harder. Two limits stop a channel from carrying more. This page gives the formulas and works through numbers.

## Start with a crowded room

Two people talk in a quiet room. They can speak fast and still be understood. Add loud music and they have to slow down or repeat themselves. The music is *noise*. The room has a limit on how much can be said.

## Limit 1: signal levels

A signal can have several levels, such as 2, 4 or 8 voltage steps. More levels let each pulse carry more bits. For a channel with no noise, the most you can send is:

bits per second = 2 × bandwidth × log base 2 of the number of levels

## Limit 2: noise

Noise blurs the levels together, so there is a limit no matter how many you use. The *signal-to-noise ratio* compares the strength of the signal to the strength of the noise. The limit is called the *capacity*:

capacity = bandwidth × log base 2 of (1 + signal-to-noise ratio)

Claude Shannon published this in 1948. No scheme can go above it and still have almost no errors.

:::example Worked example
A channel has a bandwidth of 3,000 hertz. These numbers were computed by a script.

**With no noise:**

| Levels | Maximum bits a second |
|---|---|
| 2 | 6,000 |
| 4 | 12,000 |
| 8 | 18,000 |

**With noise:** the signal-to-noise ratio is 30 decibels. That is a ratio of 10 to the power of 3, which is 1,000. The capacity is 3,000 × log base 2 of 1,001, which is about 29,900 bits a second.

So even with more levels, this channel cannot go above about 29,900 bits a second.
:::

## What the limits mean

Doubling the number of levels adds only one extra bit per pulse. Noise sets a hard ceiling. To go faster, you widen the bandwidth, cut the noise, or use both.

## Common mistakes

- **"More levels means unlimited speed."** Noise stops it.
- **"Decibels are the ratio."** A decibel figure has to be converted. 30 decibels is a ratio of 1,000.

## Check yourself

:::check
Q: A noiseless channel has 4,000 hertz of bandwidth and 2 levels. What is the most it can carry?
A: 2 × 4,000 × log base 2 of 2 = 8,000 bits a second.
Q: What does a 30 decibel signal-to-noise ratio mean as a plain ratio?
A: 1,000.
Q: Name two ways to raise the capacity of a channel.
A: Widen the bandwidth, or reduce the noise.
:::

:::deeper
**Where the first formula comes from.** It is often called Nyquist's limit or Hartley's law. It is about how many separate pulses a channel can pass each second.

**Real links.** Modern links use clever coding to get close to the Shannon limit, but never over it.
:::
