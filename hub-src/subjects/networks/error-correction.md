---
title: Error correction
summary: How extra bits let a receiver fix a damaged bit by itself, using a small Hamming code.
sources:
- Wikipedia, Hamming(7,4) | https://en.wikipedia.org/wiki/Hamming(7,4)
- Wikipedia, Hamming code | https://en.wikipedia.org/wiki/Hamming_code
- Wikipedia, Error correction code | https://en.wikipedia.org/wiki/Error_correction_code
- Peterson and Davie, Computer Networks: A Systems Approach, section 2.4 (Error Detection, the part on error-correcting codes) | https://book.systemsapproach.org/direct/error.html
check:
- Error-correcting codes add redundant bits so the receiver can fix some errors without a resend | Peterson and Davie 2.4 and Wikipedia, Error correction code
- Hamming(7,4) adds 3 parity bits to 4 data bits, giving 7 bits | Wikipedia, Hamming(7,4)
- The parity bits sit in positions 1, 2 and 4, and each covers a set of positions | Wikipedia, Hamming(7,4)
- The pattern of failed parity checks spells the position of a single flipped bit | Wikipedia, Hamming(7,4)
- Hamming(7,4) fixes any single-bit error | Wikipedia, Hamming(7,4)
- Richard Hamming described these codes in 1950 | Wikipedia, Hamming code
---

Error detection only says that something went wrong. Error correction goes one step further and fixes it, with no resend. This page shows how with one small code.

## Start with a crossword

If you know a word has one wrong letter, and the crossing words give you hints, you can work out which letter it is and fix it. A correcting code gives the receiver those hints.

## The idea

The sender adds extra bits, called *parity bits*, to the data. Each parity bit checks a different group of bit positions. When the receiver checks all the groups, the pattern of failures points to the damaged bit.

The classic example is the *Hamming (7,4) code*. It sends 4 data bits and adds 3 parity bits, so each code word is 7 bits long. It can fix any one flipped bit.

The bits sit in positions 1 to 7. Positions 1, 2 and 4 hold the parity bits. Each parity bit makes the total number of 1s in its group even.

| Parity bit | Checks positions |
|---|---|
| p1 (position 1) | 1, 3, 5, 7 |
| p2 (position 2) | 2, 3, 6, 7 |
| p3 (position 4) | 4, 5, 6, 7 |

:::example Worked example
These values were worked out by a script. The data bits are 1011. They go in positions 3, 5, 6 and 7.

**Sending.** p1 covers positions 1, 3, 5, 7, and the data bits there (positions 3, 5, 7) are 1, 0, 1. Two 1s is already even, so p1 = 0. In the same way p2 = 1 and p3 = 0. The code word is 0110011.

**Receiving, with an error.** Bit 5 flips, so the receiver gets 0110111. It checks each group. Group 1 fails, group 2 passes and group 3 fails. Read as binary, with group 3 first, that is 101. That is 5, so bit 5 is wrong. The receiver flips it back and gets 0110011.
:::

## The cost

The code adds 3 bits for every 4 data bits. That is a lot of extra data. Correction pays off where resending is slow or impossible, such as a signal from deep space or a noisy radio link. Where a resend is cheap, links usually detect errors and ask again.

## Common mistakes

- **"Correction fixes any number of errors."** This code fixes one flipped bit per code word. Two errors in one word can fool it.
- **"The parity bits are added at the end."** In this code they sit at positions 1, 2 and 4.

## Check yourself

:::check
Q: How many bits long is a Hamming (7,4) code word?
A: Seven: four data bits and three parity bits.
Q: What does the pattern of failed checks tell the receiver?
A: The position of the flipped bit.
Q: Why not use correction on every link?
A: It adds many extra bits. Where resending is cheap, detecting and resending costs less.
:::

:::deeper
**Stronger codes.** Real systems use codes that fix many errors at once, such as Reed-Solomon codes in discs and QR codes.

**Forward error correction.** Sending extra data so the receiver can fix errors alone is called forward error correction.
:::
