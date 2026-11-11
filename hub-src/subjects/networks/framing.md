---
title: Framing
summary: How a stream of bits is cut into frames, and how a frame marks where it starts and ends.
practise:
- net/2.1 | Frame Fences
sources:
- Peterson and Davie, Computer Networks: A Systems Approach, section 2.3 (Framing) | https://book.systemsapproach.org/direct/framing.html
- RFC 1662, PPP in HDLC-like Framing | https://www.rfc-editor.org/rfc/rfc1662
check:
- A link layer sends frames, and the receiver must find where each frame starts and ends | Peterson and Davie 2.3
- A byte-count header has a weakness: if the count is corrupted, the receiver loses its place | Peterson and Davie 2.3.1
- Sentinel-based framing marks the start and end with a special flag, and escapes that value inside the data (byte stuffing) | Peterson and Davie 2.3.1
- In bit-oriented framing (HDLC), the flag is 01111110 and the sender adds a 0 after five consecutive 1s | Peterson and Davie 2.3.2
- PPP uses 0x7E as the flag and 0x7D as the escape byte, and also flips a bit of the escaped byte | RFC 1662 section 4.2
---

Wires carry a stream of bits with no gaps in it. The receiver needs to know where one message ends and the next begins. Framing solves this.

## Start with a sentence

You can read a page of writing because full stops and capital letters mark where each sentence starts and ends. A stream of bits has no such marks. So the sender adds them.

## The idea

The data link layer cuts the stream into *frames*. A frame needs a way to show its start and its end. There are three common methods.

- **Byte count.** The header says how many bytes the frame holds. The weakness is that if the count is damaged, the receiver loses its place.
- **Flag bytes.** A special byte marks the start and the end. If that byte shows up inside the data, the sender puts an *escape* byte in front of it. This is called byte stuffing.
- **Flag bits.** A special pattern of bits marks the start and end. The sender adds an extra 0 to the data whenever it would look like the flag. This is called bit stuffing.

:::example Worked example: byte stuffing
This is a simplified version, and it was worked out by a script. The flag is the byte 7E. The escape byte is 7D. The data bytes are 41 7E 42 7D 43.

The sender puts 7D in front of every 7E or 7D that is inside the data:

| Step | Bytes |
|---|---|
| Data | 41 7E 42 7D 43 |
| After stuffing | 41 7D 7E 42 7D 7D 43 |
| Frame on the wire | 7E 41 7D 7E 42 7D 7D 43 7E |

The receiver reads until it meets a 7E that is not behind a 7D. It removes each 7D escape and keeps the byte after it. That gives back 41 7E 42 7D 43.
:::

:::example Worked example: bit stuffing
The flag is 01111110. The rule is to add a 0 after any five 1s in a row. The data is 0111110111111001.

After stuffing it is 011111001111101001. The receiver removes any 0 that follows five 1s, and gets the data back.
:::

## Why stuffing works

The flag can never appear by accident inside a frame, because any copy of it in the data has been changed. So a flag always means the start or end.

## Common mistakes

- **"The flag is never in the data."** It can be. Stuffing is what makes this safe.
- **"Stuffing changes the data."** It changes the frame on the wire. The receiver undoes it, so the data is the same.

## Check yourself

:::check
Q: Why can a byte-count header cause trouble?
A: If the count is damaged, the receiver finds the end of the frame in the wrong place and loses track of the next frame.
Q: In the byte example, why does 7D appear twice in a row on the wire?
A: The data had a 7D, so the sender put an escape 7D in front of it.
Q: In bit stuffing, what makes the sender add a 0?
A: Five 1s in a row in the data.
:::

:::deeper
**PPP.** The Point-to-Point Protocol uses 7E as its flag and 7D as the escape byte. It also flips one bit of the escaped byte, so the escaped byte no longer looks like a flag. Real protocols differ in details like this.

**Clock-based framing.** Some links, such as SONET, send frames at fixed times and do not use flags.
:::
