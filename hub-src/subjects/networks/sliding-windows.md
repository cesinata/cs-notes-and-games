---
title: Sliding windows
summary: How a sender keeps several frames in flight at once, and why that keeps a long link busy.
practise:
- net/2.5 | Window Waltz
sources:
- Peterson and Davie, Computer Networks: A Systems Approach, section 2.5 (Reliable Transmission) | https://book.systemsapproach.org/direct/reliable.html
- RFC 9293, Transmission Control Protocol (TCP), flow control and the window | https://www.rfc-editor.org/rfc/rfc9293
check:
- In stop-and-wait, the sender sends one frame and waits for its acknowledgement | Peterson and Davie 2.5.1
- A sliding window lets the sender have several unacknowledged frames at once | Peterson and Davie 2.5.2
- Frames carry sequence numbers and the receiver sends acknowledgements | Peterson and Davie 2.5
- The window slides forward as acknowledgements arrive | Peterson and Davie 2.5.2
- To keep a link busy, the window must hold about round-trip time times bandwidth of data | Peterson and Davie 2.5.1 and 2.5.2
---

Waiting for an answer after every message wastes time on a long link. A sliding window fixes this. This page shows the problem in numbers, then the fix.

## Start with a queue at a bakery

If you sent one customer in, waited for them to leave, then sent the next, the shop would be slow. It is quicker to let several people be inside at once. A sliding window lets the sender have several frames "inside" the network at once.

## Stop-and-wait

In *stop-and-wait*, the sender sends one frame and waits for its *acknowledgement* (a short message saying "got it") before sending the next. This is simple, but the link sits idle while the sender waits.

## Sliding window

The sender may have up to a fixed number of frames sent but not yet acknowledged. That number is the *window size*. Frames carry *sequence numbers* so the receiver can tell them apart and put them in order. Each acknowledgement lets the window slide forward, so the sender can send more.

:::example Worked example
These numbers are made up, and were worked out by a script. Frames are 8,000 bits. The link carries 10 million bits a second. The round-trip time is 20 milliseconds.

- Sending one frame takes 8,000 ÷ 10,000,000 = 0.8 milliseconds.
- With stop-and-wait, one frame goes out for every 0.8 + 20 = 20.8 milliseconds. That is about 385,000 bits a second, which is about 3.8% of the link.
- To keep the link full, the sender needs 20.8 ÷ 0.8 = 26 frames in flight. So a window of 26 frames uses the whole link.
:::

## Choosing a window

A window that is too small leaves the link idle. A larger window sends more, but the receiver has to be able to hold the frames, and the network can only carry so much. TCP's window also limits how much the receiver can take.

## Common mistakes

- **"A bigger window is always better."** It is limited by the receiver and by the network.
- **"Acknowledgements are only for lost frames."** They are sent for every frame that arrives. Their arrival is what moves the window.

## Check yourself

:::check
Q: What does stop-and-wait do after sending a frame?
A: It waits for the acknowledgement before sending the next.
Q: In the example, why is stop-and-wait so poor?
A: The frame takes 0.8 milliseconds to send, but the sender then waits 20 milliseconds for a reply.
Q: What does the window slide on?
A: The arrival of acknowledgements.
:::

:::deeper
**Go-back-N and selective repeat.** When a frame is lost, a sender can resend everything from that frame (go-back-N) or only the lost one (selective repeat).

**Flow control.** In TCP the receiver tells the sender how much room it has. The sender's window cannot be bigger than that.
:::
