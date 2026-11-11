---
title: The TCP handshake
summary: How two computers agree to talk before any data is sent, and what each of the three messages says.
practise:
- net/5.2 | The Handshake
sources:
- Peterson and Davie, Computer Networks: A Systems Approach, section 5.2.3 (Connection Establishment and Termination) | https://book.systemsapproach.org/e2e/tcp.html
- RFC 9293, Transmission Control Protocol (TCP) | https://www.rfc-editor.org/rfc/rfc9293
- RFC 7413, TCP Fast Open | https://www.rfc-editor.org/rfc/rfc7413
- RFC 9112, HTTP/1.1 | https://www.rfc-editor.org/rfc/rfc9112
check:
- TCP numbers every byte it sends | RFC 9293 section 3.4
- Each side picks its own initial sequence number | Peterson and Davie 5.2.3 and RFC 9293 section 3.4.1
- A SYN uses up one sequence number, so the acknowledgement is the received number plus one | RFC 9293 sections 3.4 and 3.5
- The second message is one segment with both the SYN and ACK flags set | Peterson and Davie 5.2.3
- The three handshake segments normally carry no application data | RFC 9293 section 3.5 (TCP Fast Open is an exception, RFC 7413)
- The main reason for three steps is to stop old, delayed connection requests causing confusion | RFC 9293 section 3.5
- The client cannot send its request until the SYN-ACK arrives, so setup costs at least one round trip | Peterson and Davie 5.2.3
- Browsers reuse connections so the handshake is not repeated for every request | RFC 9112 section 9.3 (persistent connections are the default in HTTP/1.1)
- If the third segment is lost, the connection still works | Peterson and Davie 5.2.3
---

Before a browser can ask a website for a page, it has to open a connection. TCP does this with three short messages. This page explains what each message says and why all three are needed.

## Start with a phone call

When you call someone, the first few seconds go like this.

- You: "Hello, can you hear me?"
- Them: "Yes, I can hear you. Can you hear me?"
- You: "Yes."

Now you both know the line works in both directions. Only then do you start talking. TCP does the same thing before it sends any of your data.

## What TCP needs to agree on

TCP promises that your data arrives complete and in order. To keep that promise, it numbers every byte it sends. The receiver uses the numbers to put the bytes back in order and to tell the sender what has arrived.

Both sides need to know where the other side's counting starts. That starting number is called the *initial sequence number*. Each side picks its own.

## The three steps

A *segment* is one piece of TCP data with a small header on the front. The header has *flags*, which are switches that say what kind of segment it is. Two flags matter here:

- **SYN** (synchronise) means "my counting starts at this number".
- **ACK** (acknowledge) means "I have received your numbers up to here".

The *client* is the computer that starts the connection. The *server* is the one waiting for it.

1. **SYN.** The client sends a segment with the SYN flag set. It holds the client's starting number.
2. **SYN-ACK.** The server replies with one segment that has both the SYN and ACK flags set. The ACK part confirms the client's number. The SYN part gives the server's own starting number.
3. **ACK.** The client sends a segment with the ACK flag set. It confirms the server's number.

After step 3 the connection is open, and data can flow in both directions.

:::example Worked example
These numbers are made up for illustration. Real starting numbers are chosen by each computer and are usually much bigger.

The client's starting number is 1000. The server's is 5000.

| Step | Direction | Flags | Sequence number | Acknowledgement number |
|---|---|---|---|---|
| 1 | Client to server | SYN | 1000 | not used yet |
| 2 | Server to client | SYN and ACK | 5000 | 1001 |
| 3 | Client to server | ACK | 1001 | 5001 |

The rule is that the acknowledgement number is the next number you expect to receive. A SYN counts as one number. So the client's 1000 becomes 1001, and the server's 5000 becomes 5001.
:::

## Why three steps and not two?

The server needs proof that the client heard its starting number. With only two steps, the server would send its SYN-ACK and never know if it arrived. Step 3 is that proof.

Each starting number is announced and then confirmed. Steps 1 and 2 do this for the client's number. Steps 2 and 3 do it for the server's number.

The TCP standard gives another reason as the main one. The extra step stops old, delayed connection requests from causing confusion.

## What the handshake costs

Normally the client cannot send its request until the SYN-ACK comes back. That takes one round trip.

For example, if the round trip to a server is 100 milliseconds, the request cannot leave before about 100 milliseconds have passed. This is one reason a far-away server feels slower to reach. It is also why browsers reuse an open connection for several requests instead of starting a new one each time.

## Common mistakes

- **"The handshake sends my data."** Normally none of the three segments carries your data. They only set up the connection.
- **"Sequence numbers start at 0."** Each computer chooses its own starting number.
- **"SYN-ACK is two messages."** It is one segment with two flags set.

## Check yourself

:::check
Q: In the example, the server's reply has an acknowledgement number of 1001. What does that tell the client?
A: The server received the client's SYN, which had number 1000. It expects the next number to be 1001.
Q: Which flags are set in step 2?
A: Both SYN and ACK.
Q: The round trip to a server is 80 milliseconds. In normal TCP, what is the shortest time before the client can send its request?
A: About 80 milliseconds, because it must wait for the SYN-ACK to arrive.
:::

:::deeper
**States.** Before the handshake, the server is waiting in a state called LISTEN. This is called a passive open. The client does an active open and moves to SYN-SENT. The server moves to SYN-RECEIVED after it gets the SYN. Both sides end in ESTABLISHED. The textbook shows these as a state-transition diagram.

**Lost segments.** If a segment is lost, the sender waits and sends it again. The textbook also points out that the connection still works if the third segment is lost.

**An exception.** An extension called TCP Fast Open lets the first segment carry data, to save one round trip.

**The standard.** RFC 9293 is the current specification of TCP.
:::
