---
title: Services and interfaces
summary: What a layer offers to the layer above it, and the set of calls a program uses to ask for it.
sources:
- Peterson and Davie, Computer Networks: A Systems Approach, section 1.4 (Software) | https://book.systemsapproach.org/foundation/software.html
- Peterson and Davie, Computer Networks: A Systems Approach, section 1.3.1 (Layering and Protocols, which defines service and peer interfaces) | https://book.systemsapproach.org/foundation/architecture.html
- RFC 9293, Transmission Control Protocol (TCP), the user and TCP interface | https://www.rfc-editor.org/rfc/rfc9293
check:
- A service is what a layer offers to the layer above, and an interface is how the layer above asks for it | Peterson and Davie 1.3.1
- A connection-oriented service sets up a connection first, and a connectionless service does not | Peterson and Davie 1.4.1 and 5.1 (the exact terms appear in 6.1.1)
- TCP is reliable and connection-oriented, and UDP is connectionless | Peterson and Davie 5.1 and 5.2
- The socket interface has calls to create a socket, bind it to a port, listen, accept, connect, send, receive and close | Peterson and Davie 1.4.1
- A server calls listen and accept to wait for a client, and a client calls connect | Peterson and Davie 1.4.1
---

A program that wants to send data does not build packets by hand. It asks the layer below to do the job. This page explains what that layer offers and how a program asks.

## Start with a service counter

When you post a parcel, you do not care how it travels. You hand it to the counter and say where it goes. The counter offers a *service* (delivery). The way you ask is the *interface*: you fill in a form and pay.

## The idea

- A **service** is what a layer promises to the layer above it. For example, "deliver these bytes to that program".
- An **interface** is the set of calls the layer above uses to ask for the service.

Services come in two main kinds.

- **Connection-oriented.** The two sides set up a connection first, then send data, then close it. TCP works this way.
- **Connectionless.** Each message is sent on its own, with no set-up. UDP works this way.

A service can also be *reliable* (data arrives complete and in order, or you are told it failed) or *unreliable* (it might get lost). TCP is reliable. UDP is not.

## The socket interface

Most programs reach the network through *sockets*. A socket is a handle the program uses to send and receive data. The calls are almost the same on most systems.

:::example Worked example
The calls a server and a client make for a TCP connection, in order.

| Step | Server | Client |
|---|---|---|
| 1 | Create a socket | Create a socket |
| 2 | Bind it to a port | |
| 3 | Listen for connections | |
| 4 | Accept a connection (waits here) | Connect to the server |
| 5 | Receive and send data | Send and receive data |
| 6 | Close | Close |

The server waits at step 4 until a client connects at the same moment.
:::

## Why an interface matters

A program only needs to know the calls. It does not need to know how TCP numbers bytes or how the data crosses the network. This is the same idea as layering: each layer hides its details.

## Common mistakes

- **"A service and a protocol are the same."** A service is what the layer offers upward. A protocol is the set of rules between two copies of the same layer.
- **"The client and server do the same calls."** The server waits with listen and accept. The client starts with connect.

## Check yourself

:::check
Q: What does a connection-oriented service do first?
A: It sets up a connection between the two sides.
Q: Which call does a client make to reach a server?
A: Connect.
Q: Is UDP connection-oriented?
A: No. It is connectionless, so it sends each message on its own.
:::

:::deeper
**The TCP standard's version.** The TCP specification describes its own interface with calls such as OPEN, SEND, RECEIVE and CLOSE. Sockets are one way an operating system offers them.

**Other services.** An application can ask for a stream of bytes (TCP), a single message (UDP), or a request and a reply (remote procedure calls).
:::
