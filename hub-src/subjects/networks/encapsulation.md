---
title: Encapsulation
summary: How each layer wraps the data from the layer above, and what that wrapping costs.
practise:
- net/0.2 | Encapsulation Express
sources:
- Peterson and Davie, Computer Networks: A Systems Approach, section 1.3.2 (Encapsulation) | https://book.systemsapproach.org/foundation/architecture.html
- Peterson and Davie, Computer Networks: A Systems Approach, section 2.6.2 (Access Protocol, which includes the frame format) | https://book.systemsapproach.org/direct/ethernet.html
- Peterson and Davie, Computer Networks: A Systems Approach, section 3.3 (Internet (IP), sections 3.3.4 and 3.3.9) | https://book.systemsapproach.org/internetworking/basic-ip.html
- RFC 9293, Transmission Control Protocol (TCP) | https://www.rfc-editor.org/rfc/rfc9293
- RFC 791, Internet Protocol | https://www.rfc-editor.org/rfc/rfc791
check:
- Each layer adds its own header to the data from the layer above (encapsulation) | Peterson and Davie 1.3.2
- The minimum TCP header is 20 bytes | RFC 9293 section 3.1 (data offset of 5 words)
- The minimum IPv4 header is 20 bytes | RFC 791 section 3.1 (header length of 5 words)
- An Ethernet frame has a 14-byte header (destination, source, type) and a 4-byte CRC at the end | Peterson and Davie 2.6.2
- The largest Ethernet payload is 1500 bytes | Peterson and Davie 2.6.2
- A router reads the IP header and builds a new link frame for the next hop | Peterson and Davie 3.3.4
- A whole packet can be wrapped inside another packet (tunnelling) | Peterson and Davie 3.3.9
---

When data goes down the layers, each layer adds some information of its own. This is called encapsulation. This page shows what is added, and what it costs.

## Start with envelopes

Say you post a letter inside a courier bag. The post office reads the address on the courier bag. It does not open the bag. The person at the other end takes out the letter and reads it.

Each layer in a network treats the data from the layer above as a sealed bag.

## The idea

Each layer adds a *header* to the front of the data it gets from the layer above. The header holds information for the same layer on the other side. The data from above is called the *payload*. One layer, the data link layer, also adds a small *trailer* at the end.

The pieces have names:

- A **segment** is TCP data with its header.
- A **packet** is IP data with its header.
- A **frame** is link data with its header and trailer.

At the receiving end, each layer reads its own header, removes it, and passes the payload up.

:::example Worked example
An app sends 100 bytes of data over TCP, IP and Ethernet. These are the smallest possible headers. Real ones can be longer. The sizes were added up by a script.

| Layer | Adds | Bytes |
|---|---|---|
| Application | the data itself | 100 |
| Transport (TCP) | header | 20 |
| Network (IP) | header | 20 |
| Data link (Ethernet) | header | 14 |
| Data link (Ethernet) | trailer | 4 |
| Total frame size | | 158 |

Of the 158 bytes, 58 are wrapping. That is about 36.7%. Ethernet also sends an 8-byte preamble before each frame, which this total does not include.
:::

## What it costs

Wrapping is a fixed cost for each frame. For small messages it is a big share. For a large message it is small. A frame with 1,460 bytes of data has 58 bytes of wrapping out of 1,518 bytes. That is about 3.8%.

## Who reads what

A router opens the frame it receives, reads the IP header, and then builds a new frame for the next link. It does not read the TCP header or your data.

## Common mistakes

- **"Each layer sends its own separate message."** No. The layers build one frame, with one header per layer.
- **"The headers are the data."** The headers carry control information. The data is the payload.

## Check yourself

:::check
Q: In the example, how many bytes are wrapping?
A: 58 bytes: 20 for TCP, 20 for IP, 14 for the Ethernet header and 4 for the Ethernet trailer.
Q: Which layer's header does a router read?
A: The IP header, which is the network layer.
Q: Why is wrapping a bigger share of a small message?
A: The headers are the same size whatever the message size, so they are a bigger fraction of a small one.
:::

:::deeper
**Tunnelling.** Sometimes a whole packet is wrapped inside another packet, so it can cross a network that would not carry it otherwise. This is called tunnelling.

**Longer headers.** TCP and IP both have optional fields that make their headers longer than 20 bytes.
:::
