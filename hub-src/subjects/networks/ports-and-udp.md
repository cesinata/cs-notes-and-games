---
title: Ports and UDP
summary: How port numbers get data to the right program, and how UDP sends data with no set-up and no repeats.
practise:
- net/5.1 | Dock Numbers
sources:
- Peterson and Davie, Computer Networks: A Systems Approach, section 5.1 (Simple Demultiplexor, UDP) | https://book.systemsapproach.org/e2e/udp.html
- RFC 768, User Datagram Protocol | https://www.rfc-editor.org/rfc/rfc768
- RFC 6335, IANA Procedures for Port Numbers | https://www.rfc-editor.org/rfc/rfc6335
- IANA, Service Name and Transport Protocol Port Number Registry | https://www.iana.org/assignments/service-names-port-numbers
check:
- A port number is a 16-bit number that identifies a program on a device | RFC 768 and Peterson and Davie 5.1
- Port numbers run from 0 to 65535 | RFC 6335 section 6
- Well-known (system) ports are 0 to 1023, user ports 1024 to 49151 and dynamic ports 49152 to 65535 | RFC 6335 section 6
- DNS uses port 53, HTTP uses port 80 and HTTPS uses port 443 | IANA service name and port number registry
- A UDP header has four 16-bit fields: source port, destination port, length and checksum | RFC 768
- UDP does not set up a connection and does not resend lost data | RFC 768 and Peterson and Davie 5.1
- Real-time media such as RTP typically runs over UDP | Peterson and Davie 5.4
- When a program sends a request, the operating system picks a free port as the source port | Peterson and Davie 5.1
- QUIC runs over UDP and adds its own connection set-up and repeating of lost data | Peterson and Davie 5.2.10
---

An IP address gets data to the right device. A device runs many programs at once, so something has to get the data to the right program. That is the job of a port.

## Start with an apartment block

A street address gets a letter to the building. The apartment number gets it to the right door. The IP address is like the street address. The port number is like the apartment number.

## Ports

A *port number* is a 16-bit number, so it runs from 0 to 65,535. A program that wants to receive data asks the operating system for a port. Data that arrives for that port goes to that program.

Port numbers fall in three groups:

| Range | Name |
|---|---|
| 0 to 1023 | Well-known (system) ports |
| 1024 to 49151 | User ports |
| 49152 to 65535 | Dynamic ports |

Some well-known ports: DNS uses 53, HTTP uses 80 and HTTPS uses 443.

An IP address together with a port number is called a *socket address*. It names one program on one device.

## UDP

The *User Datagram Protocol*, or UDP, is a transport protocol that does very little. It adds the port numbers and a check on the data, and nothing else.

- It does not set up a connection first.
- It does not resend lost data.
- It does not put data back in order.

:::example Worked example
The UDP header has four fields. Each is 16 bits, which is 2 bytes. That makes 4 × 2 = 8 bytes in all. This was added up by a script.

| Field | Bytes |
|---|---|
| Source port | 2 |
| Destination port | 2 |
| Length | 2 |
| Checksum | 2 |
| Total | 8 |

The TCP header is at least 20 bytes. UDP's small header is part of why it is light.
:::

## Why use UDP

When speed matters more than perfect delivery, UDP is a good fit. DNS questions are short, and the program can just ask again if there is no answer. Live audio and video usually run over UDP too. A late packet is no use in a live call, so there is no point in sending it again.

## Common mistakes

- **"A port is a physical socket."** It is only a number kept by the operating system.
- **"UDP is unreliable, so it is bad."** It gives up delivery guarantees to gain speed and simplicity. Programs that need guarantees use TCP, or add their own checks.

## Check yourself

:::check
Q: How many different port numbers are there?
A: 65,536, from 0 to 65,535.
Q: What does UDP not do that TCP does?
A: UDP does not set up a connection, resend lost data or reorder data.
Q: How many bytes is a UDP header?
A: 8 bytes.
:::

:::deeper
**Ports and replies.** When a program sends a request, the operating system picks a free dynamic port as the source port. The reply comes back to that port.

**Beyond UDP.** QUIC, a newer protocol, runs over UDP and adds its own set-up and repeating of lost data.
:::
