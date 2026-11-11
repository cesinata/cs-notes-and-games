---
title: Cables and wireless
summary: The main ways a signal travels between devices, and what each one is good for.
sources:
- Peterson and Davie, Computer Networks: A Systems Approach, section 2.1 (Perspectives on Connecting) | https://book.systemsapproach.org/direct/perspective.html
- Peterson and Davie, Computer Networks: A Systems Approach, section 2.7 (Wireless Networks) | https://book.systemsapproach.org/direct/wireless.html
- Wikipedia, Ethernet over twisted pair | https://en.wikipedia.org/wiki/Ethernet_over_twisted_pair
- Wikipedia, Wi-Fi 6E | https://en.wikipedia.org/wiki/Wi-Fi_6E
- TeleGeography, Submarine Cable Map | https://www.submarinecablemap.com
- ITU, press release on the submarine cables summit (2025) | https://www.itu.int/en/mediacentre/Pages/PR-2025-02-27-submarine-cables-summit-nigeria.aspx
check:
- Twisted pair, coaxial cable, optical fibre and wireless are the main kinds of link | Peterson and Davie 2.1
- Twisted pair is two copper wires twisted together and is used for office and home wiring | Peterson and Davie 2.1
- Ethernet over twisted pair is limited to about 100 metres per segment | Wikipedia, Ethernet over twisted pair (not stated in Peterson and Davie)
- Optical fibre sends light pulses through glass and can span very long distances | Peterson and Davie 2.1
- Wi-Fi uses unlicensed radio bands around 2.4 GHz and 5 GHz, and newer versions also use 6 GHz | Peterson and Davie 2.7.2 (2.4 and 5 GHz) and Wikipedia, Wi-Fi 6E (6 GHz)
- More than 99 per cent of international data traffic travels through undersea cables | ITU press release, February 2025
---

A signal needs something to travel through. That something is the *medium*. This page covers the four you will meet most often.

## Start with how you talk to someone

You can speak to a friend across a table, shout across a field, or pass a note. Each way reaches a different distance, costs something different, and can be overheard in different ways. Network media are the same.

## The four kinds

- **Twisted pair.** Two copper wires twisted together. It is cheap and is used for wiring offices and homes. A single twisted-pair Ethernet cable run is limited to about 100 metres.
- **Coaxial cable.** A copper wire inside a shield. It was common in older Ethernet, and cable TV and some home internet still use it.
- **Optical fibre.** Thin glass strands that carry pulses of light. It can run very long distances. More than 99 per cent of international data traffic travels through undersea fibre cables, according to the ITU.
- **Wireless.** Radio waves through the air. Nothing is plugged in, but everyone nearby shares the same air. Wi-Fi uses radio bands around 2.4 GHz and 5 GHz, and newer versions also use 6 GHz.

:::example Worked example
Pick a medium for each job.

| Job | Medium | Why |
|---|---|---|
| Connect a desktop to a router in the same room | Twisted pair | Cheap, and the distance is short |
| Connect two cities | Optical fibre | Carries a lot over long distances |
| Let a phone join a network in a cafe | Wireless | Nothing to plug in |
:::

## Wired against wireless

A cable keeps the signal inside it. Wireless is shared. Walls, distance and other devices change how well it works, and a signal in the air can be picked up by anyone nearby, so it needs protection such as encryption.

## Common mistakes

- **"Wireless means no wires anywhere."** The access point is wired to the rest of the network.
- **"Satellites carry most internet traffic."** Undersea cables carry more than 99 per cent of international data traffic.

## Check yourself

:::check
Q: Which medium sends light through glass?
A: Optical fibre.
Q: Why does wireless need extra protection?
A: The signal goes through the air, so anyone nearby can receive it.
Q: About how long can one Ethernet twisted-pair cable run be?
A: About 100 metres.
:::

:::deeper
**Single-mode and multi-mode fibre.** Single-mode fibre has a very thin core and is used for long distances. Multi-mode fibre has a wider core and is used over shorter runs.

**Look at the map.** The TeleGeography Submarine Cable Map shows where the undersea cables run and where they come ashore.
:::
