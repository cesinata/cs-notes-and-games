---
title: Error detection
summary: How a receiver can tell that bits were damaged on the way, using parity bits and checksums.
practise:
- net/2.2 | Bug Detectives
sources:
- Peterson and Davie, Computer Networks: A Systems Approach, section 2.4 (Error Detection) | https://book.systemsapproach.org/direct/error.html
- RFC 1071, Computing the Internet Checksum | https://www.rfc-editor.org/rfc/rfc1071
- RFC 8200, Internet Protocol, Version 6 (IPv6) Specification | https://www.rfc-editor.org/rfc/rfc8200
- Wikipedia, Parity bit | https://en.wikipedia.org/wiki/Parity_bit
check:
- Bits can be changed by noise on a link, so a receiver needs a way to detect errors | Peterson and Davie 2.4
- The sender adds redundant bits and the receiver uses them to check the data | Peterson and Davie 2.4
- A single parity bit detects any single flipped bit | Wikipedia, Parity bit (the even-number case follows from counting)
- The Internet checksum adds up the data in 16-bit pieces, and IPv4, TCP and UDP use it | Peterson and Davie 2.4.1 and RFC 1071
- IPv6 has no header checksum | RFC 8200 section 3 (the header has no checksum field) and section 8.1
---

Wires and radio links make mistakes. Noise can flip a bit from 0 to 1. The receiver has no way to know unless the sender adds some extra information. This page shows two simple ways to do that.

## Start with a phone number

Say you read a long number to a friend, and you add, "the digits add up to 41". If your friend adds them up and gets 38, they know they misheard something. They do not know which digit is wrong, only that something is.

That is error detection. The extra information is called *redundancy*.

## Parity bit

The simplest method adds one extra bit, the *parity bit*. With *even parity*, the sender sets it so that the total number of 1s is even.

:::example Worked example
These bits were counted by a script. The data is 1011001. It has four 1s, which is already even, so the parity bit is 0. The sender sends 10110010.

- **One bit flips.** The receiver counts five 1s, which is odd. It knows something is wrong.
- **Two bits flip.** The count is still even, so the receiver sees nothing wrong. The error is missed.
:::

So a single parity bit catches any odd number of flipped bits and misses an even number.

## Checksum

A *checksum* is a number made by adding up the data in chunks. The sender puts the number in the header. The receiver adds up the chunks again and compares. The Internet checksum adds up the data in 16-bit pieces. It is quick to work out, so IPv4, TCP and UDP use it.

## Detecting is not fixing

These methods say that something is wrong. They do not say what. When the receiver detects an error, it throws the data away, and a higher layer such as TCP asks for it again.

## Common mistakes

- **"Parity catches every error."** It misses any even number of flipped bits.
- **"Detection repairs the data."** It only tells you the data is damaged.

## Check yourself

:::check
Q: The data 1100 has two 1s. What is the even-parity bit?
A: 0, because the count of 1s is already even.
Q: Two bits flip in a message that uses one parity bit. Does the receiver notice?
A: No. The number of 1s stays even, so the error is missed.
Q: What does a receiver do when it detects an error?
A: It discards the data. A higher layer, such as TCP, can ask for it to be sent again.
:::

:::deeper
**Stronger methods.** Cyclic redundancy checks (CRCs) catch many more errors than parity or a checksum. They are the topic of the next page.

**IPv6.** IPv6 does not have a checksum in its header. It leaves error checking to the link layer and the transport layer.
:::
