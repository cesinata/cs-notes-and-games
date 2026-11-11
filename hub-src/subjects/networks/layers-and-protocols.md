---
title: Layers and protocols
summary: Why networks are split into layers, what a protocol is, and the two layer models you will meet.
practise:
- net/0.1 | Layer Cake
sources:
- Peterson and Davie, Computer Networks: A Systems Approach, section 1.3 (Architecture) | https://book.systemsapproach.org/foundation/architecture.html
- RFC 1122, Requirements for Internet Hosts: Communication Layers | https://www.rfc-editor.org/rfc/rfc1122
check:
- A protocol is a set of rules that two parties agree on | Peterson and Davie 1.3.1
- Each layer uses the service of the layer below and offers a service to the layer above | Peterson and Davie 1.3.1
- The OSI model has 7 layers: Physical, Data link, Network, Transport, Session, Presentation, Application | Peterson and Davie 1.3.4
- The internet architecture is usually described with four layers: link, internet, transport, application | RFC 1122 section 1.1.3 and Peterson and Davie 1.3.5
- Internet software follows the TCP/IP model and OSI is mainly a reference model | Peterson and Davie 1.3.4 and 1.3.5
- The internet architecture does not enforce strict layering, because an application can bypass the transport layer | Peterson and Davie 1.3.5
- IP sits at the narrow waist of an hourglass-shaped protocol graph | Peterson and Davie 1.3.5
---

A network does many jobs at once: carrying signals, finding routes, fixing errors and running apps. Layers split those jobs into groups. This page explains what a layer and a protocol are, and the two layer models you will meet.

## Start with posting a letter

To send a letter, you write it and put it in an envelope. You drop it in a postbox. After that, trucks and sorting offices do the rest. You do not drive the truck, and the driver does not read your letter. Each person does one job and trusts the next person to do theirs.

Networks work the same way.

## Protocols and layers

- A *protocol* is a set of rules that two parties agree on. It says what a message looks like and what to do when one arrives.
- A *layer* is a group of related jobs. A layer uses the layer below it and offers a service to the layer above it.
- Layers hide details. The layer that sends a web page does not need to know whether the cable is copper or fibre.

## Two models

Two models describe the layers. Both list layers from the top (closest to the user) to the bottom (closest to the wire).

- **The OSI model** has 7 layers: Application, Presentation, Session, Transport, Network, Data link and Physical.
- **The TCP/IP model** is the one the internet follows. It is usually drawn with 4 layers: Application, Transport, Internet and Link. Some books split the link layer into data link and physical, which gives 5.

| Layer | Its job in plain words |
|---|---|
| Application | The programs people use, such as a web browser or email. |
| Transport | Delivers data between programs, using port numbers. TCP can also repeat anything that gets lost. |
| Network (Internet) | Moves packets across many networks, using addresses. |
| Data link | Moves frames across one link, such as one cable or one Wi-Fi connection. |
| Physical | Sends the raw signals along the wire or through the air. |

:::example Worked example
A browser asks for a web page. On your computer the request passes down the layers. The browser writes the request (application). TCP adds a port number (transport). IP adds the sender and receiver addresses (network). Wi-Fi or Ethernet adds the address of the next device (data link). Then the signal goes out (physical).

At the other end, the request passes up the same layers in reverse order.
:::

## Why layers help

Each layer can change without the others, as long as its service stays the same. That is why the same browser works over Wi-Fi, over a cable, or over a phone network.

## Common mistakes

- **"The internet runs on the OSI model."** Internet software follows the TCP/IP model. OSI is mostly used as a reference for teaching and discussion.
- **"Layers never overlap."** The model is a guide. Real software sometimes skips a layer for speed.

## Check yourself

:::check
Q: What is a protocol?
A: A set of rules that two parties agree on, covering what a message looks like and what to do when it arrives.
Q: Which layer moves data across one link, such as one cable?
A: The data link layer.
Q: How many layers does the OSI model have?
A: Seven.
:::

:::deeper
**The hourglass.** Many protocols sit above IP and many technologies sit below it, but IP is the one protocol in the middle. This is called the narrow waist, and it is why almost anything can run over almost any network.

**Not strict.** The internet's design does not force strict layering. An application is free to skip the standard transport protocols and talk to IP more directly.
:::
