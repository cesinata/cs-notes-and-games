---
title: CRC
summary: How a cyclic redundancy check uses a special kind of division to catch errors that a checksum would miss.
practise:
- net/2.3 | CRC Mill
sources:
- Peterson and Davie, Computer Networks: A Systems Approach, section 2.4.2 (Cyclic Redundancy Check) | https://book.systemsapproach.org/direct/error.html
- Wikipedia, Cyclic redundancy check | https://en.wikipedia.org/wiki/Cyclic_redundancy_check
check:
- A CRC divides the data, treated as a long binary number, by a fixed generator and sends the remainder | Peterson and Davie 2.4.2
- The division uses XOR instead of subtraction, with no carries | Peterson and Davie 2.4.2
- The sender appends the remainder to the data, and the receiver divides again and expects zero | Peterson and Davie 2.4.2
- Ethernet uses a 32-bit CRC, so 4 bytes | Peterson and Davie 2.4.2 and 2.6.2
- A CRC with an n-bit remainder detects every burst error of n bits or fewer | Peterson and Davie 2.4.2 (it says "less than k bits")
- A CRC detects errors but does not correct them | Peterson and Davie 2.4.2
- An Ethernet receiver drops a frame whose CRC check fails | not confirmed: Peterson and Davie 2.6.2 describes the CRC field but not the discard
---

A cyclic redundancy check, or CRC, is the error check that Ethernet and many other links use. It catches more errors than parity or a checksum. This page shows how the sum works with a small example.

## Start with a remainder

When you divide 17 by 5, you get 3 and a remainder of 2. If someone changes the 17 to an 18, the remainder changes to 3. A remainder reacts to changes in the number.

A CRC uses the same idea. The data is treated as one long binary number. The sender divides it by a fixed number, called the *generator*, and attaches the remainder.

## The steps

1. The sender and receiver agree on a generator, for example 10011.
2. The sender adds zeros to the end of the data. The number of zeros is one fewer than the number of bits in the generator.
3. The sender divides, using XOR instead of subtraction. XOR has no carries. The remainder is the CRC.
4. The sender sends the data followed by the CRC.
5. The receiver divides everything it received by the same generator. A remainder of zero means no error was found. Anything else means there was an error.

:::example Worked example
This was worked out by a script. The data is 1101100110 and the generator is 10011. The generator has 5 bits, so the sender adds 4 zeros: 11011001100000.

Each line shows the bits after one XOR with 10011, lined up under the leftmost 1:

```
11011001100000   start
01000001100000
00001101100000
00000100000000
00000000110000
00000000010110
00000000000101   the last 4 bits are the remainder: 0101
```

The sender transmits 11011001100101, which is the data followed by 0101.

The receiver divides 11011001100101 by 10011 and gets a remainder of 0000, so the frame is accepted.

If bit 5 flips on the way, the receiver gets 11010001100101. Dividing gives 1010, not 0000, so the error is caught.
:::

## What a CRC can and cannot do

A CRC with an n-bit remainder catches every burst of errors that is n bits long or shorter. Ethernet uses a 32-bit CRC, which is 4 bytes at the end of each frame. A CRC cannot catch every possible error. A very small number of damaged frames can still have a remainder of zero.

A CRC only detects errors. It cannot tell you which bits are wrong, so it cannot fix them.

## Common mistakes

- **"A CRC fixes errors."** It only detects them.
- **"A CRC catches every error."** It catches almost all of them, but a few get through.
- **"The CRC is added to the front."** It goes at the end of the frame.

## Check yourself

:::check
Q: A generator has 6 bits. How long is the CRC?
A: 5 bits, which is one fewer than the generator.
Q: The receiver's remainder is not zero. What does that mean?
A: The frame was damaged on the way. A device like Ethernet drops it.
Q: Does a CRC correct the bits it finds wrong?
A: No. It only detects that something is wrong.
:::

:::deeper
**Polynomials.** Textbooks write a generator as a polynomial. The generator 10011 is x to the power of 4, plus x, plus 1. The maths is the same, written in a different way.

**Cyclic.** The word cyclic comes from the maths behind it. You do not need it to use a CRC.
:::
