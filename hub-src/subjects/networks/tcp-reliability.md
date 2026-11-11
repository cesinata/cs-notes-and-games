---
title: TCP reliability
summary: How TCP numbers bytes, confirms what arrived, and resends what did not.
sources:
- Peterson and Davie, Computer Networks: A Systems Approach, section 5.2 (Reliable Byte Stream, TCP) | https://book.systemsapproach.org/e2e/tcp.html
- RFC 9293, Transmission Control Protocol (TCP) | https://www.rfc-editor.org/rfc/rfc9293
- RFC 5681, TCP Congestion Control, fast retransmit | https://www.rfc-editor.org/rfc/rfc5681
check:
- TCP numbers the bytes it sends | RFC 9293 section 3.4
- An acknowledgement number is the next byte the receiver expects | Peterson and Davie 5.2.3
- TCP acknowledgements are cumulative | Peterson and Davie 5.2.3
- A sender resends a segment when its timer runs out | Peterson and Davie 5.2.6
- A receiver sends a duplicate acknowledgement when a segment arrives out of order | RFC 5681 section 3.2
- After three duplicate acknowledgements, a sender resends the missing segment without waiting for the timer (fast retransmit) | RFC 5681 section 3.2
---

The network can lose, delay and reorder packets. TCP hides this from the program, so the program sees a clean stream of bytes. This page shows how.

## Start with a numbered book

Say you send a book through the post one page at a time, and the pages are numbered. If the person gets pages 1, 3 and 4, they know page 2 is missing. They write back "I still need page 2". That is TCP's way.

## Numbers and acknowledgements

TCP numbers every byte. Each segment carries the number of its first byte, the *sequence number*. The receiver replies with an *acknowledgement number*: the number of the next byte it expects. Acknowledgements are *cumulative*. An acknowledgement of 1001 means "I have every byte up to 1000".

## Finding what is missing

- **Timer.** The sender keeps a timer for the oldest segment that has not been acknowledged. If no acknowledgement arrives in time, it sends that segment again.
- **Duplicate acknowledgements.** If a segment arrives out of order, the receiver acknowledges the same number again. If the sender sees three duplicates, it resends the missing segment at once, without waiting for the timer. This is *fast retransmit*.

:::example Worked example
The sender sends five segments of 1,000 bytes each. Their sequence numbers are 1, 1001, 2001, 3001 and 4001. The second segment is lost. The acknowledgements were worked out by a script.

| Segment arrives | Receiver sends |
|---|---|
| 1 (seq 1) | ack 1001 |
| 3 (seq 2001) | ack 1001 (duplicate) |
| 4 (seq 3001) | ack 1001 (duplicate) |
| 5 (seq 4001) | ack 1001 (duplicate) |
| 2 again (seq 1001) | ack 5001 |

The receiver kept segments 3 to 5. When segment 2 finally arrives, it now has every byte up to 5000, so it acknowledges 5001. The three duplicates told the sender to resend segment 2 early.
:::

## Why it is a stream

The receiver puts bytes back in order before handing them up. So the program sees every byte, once, in order, even when the network did not behave.

## Common mistakes

- **"Every segment is acknowledged one by one."** An acknowledgement covers everything up to the number.
- **"The acknowledgement number is the last byte received."** It is the next byte expected.

## Check yourself

:::check
Q: What does an acknowledgement of 3001 mean?
A: The receiver has all bytes up to 3000 and expects byte 3001 next.
Q: Why did the receiver repeat ack 1001 three times?
A: Segments after the missing one kept arriving, and each time it still needed byte 1001.
Q: What is fast retransmit?
A: Resending a segment after three duplicate acknowledgements, without waiting for the timer.
:::

:::deeper
**Selective acknowledgements.** An option called SACK lets the receiver say exactly which later segments it already has, so the sender resends only what is missing.
:::
