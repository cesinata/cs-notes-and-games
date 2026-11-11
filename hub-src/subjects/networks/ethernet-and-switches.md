---
title: Ethernet and switches
summary: What an Ethernet frame holds, and how a switch learns where each device is.
sources:
- Peterson and Davie, Computer Networks: A Systems Approach, section 2.6 (Multi-Access Networks) | https://book.systemsapproach.org/direct/ethernet.html
- Peterson and Davie, Computer Networks: A Systems Approach, section 3.2 (Switched Ethernet) | https://book.systemsapproach.org/internetworking/ethernet.html
- Wikipedia, Ethernet frame | https://en.wikipedia.org/wiki/Ethernet_frame
- Wikipedia, Ethernet hub | https://en.wikipedia.org/wiki/Ethernet_hub
check:
- An Ethernet address (MAC address) is 48 bits, written as six pairs of hexadecimal digits | Peterson and Davie 2.6.2
- An Ethernet frame has a destination address, a source address, a type field, the data and a CRC | Peterson and Davie 2.6.2
- The data part of a frame is at most 1500 bytes, and a frame is at least 64 bytes | Peterson and Davie 2.6.2
- A switch learns which port a device is on by reading the source address of frames it receives | Peterson and Davie 3.2.1
- A switch sends a frame for an unknown destination out of all other ports | Peterson and Davie 3.2.1
- A hub repeats a frame out of every port | Wikipedia, Ethernet hub
---

Ethernet is the wired network in most homes and offices. This page covers what is inside a frame and how a switch moves frames to the right place.

## Start with a post room

A post room reads the address on each envelope. After a while it learns which desk is where, and takes each envelope straight there. A switch does the same job for frames.

## The frame

Every Ethernet device has a *MAC address*, a 48-bit number written as six pairs of hexadecimal digits, such as `00:1A:2B:3C:4D:5E`. A frame has these fields:

| Field | What it holds |
|---|---|
| Destination address | Who the frame is for |
| Source address | Who sent it |
| Type | What kind of data follows (for example, IP) |
| Data | The payload, up to 1500 bytes |
| CRC | A check of the whole frame |

A frame is at least 64 bytes and at most 1,518 bytes long, not counting the preamble.

## Switches

A *hub* simply repeats every frame out of every port. A *switch* is smarter. It keeps a table of which MAC address is reachable through which port, and builds it by watching traffic:

1. When a frame arrives, the switch notes the source address and the port it came in on.
2. If it knows the destination, it sends the frame out of that one port.
3. If it does not, it sends the frame out of every other port. This is called flooding.

:::example Worked example
A switch has three ports. Device A is on port 1, B on port 2 and C on port 3. The switch starts with an empty table.

| Frame | Table before | What the switch does | Table after |
|---|---|---|---|
| A sends to B | empty | Learns A is on port 1. B is unknown, so it floods ports 2 and 3. | A: 1 |
| B sends to A | A: 1 | Learns B is on port 2. A is known, so it sends to port 1 only. | A: 1, B: 2 |
| A sends to B | A: 1, B: 2 | Both known. It sends to port 2 only. | A: 1, B: 2 |
:::

After this, A and B talk without bothering C.

## Common mistakes

- **"A switch reads IP addresses."** A plain switch reads MAC addresses. Routers read IP addresses.
- **"The table is set up by hand."** A switch builds it by itself from the traffic.

## Check yourself

:::check
Q: How long is a MAC address?
A: 48 bits.
Q: What does a switch do with a frame for an address it does not know?
A: It sends it out of every port except the one it came in on.
Q: How does a switch learn where a device is?
A: It reads the source address of each frame and notes the port.
:::

:::deeper
**Loops.** If switches are joined in a loop, frames can circle forever. A protocol called the spanning tree protocol switches off some links to prevent this.
:::
