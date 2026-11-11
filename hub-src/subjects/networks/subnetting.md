---
title: Subnetting
summary: How one network is split into smaller ones, and how to tell which one an address belongs to.
practise:
- net/4.2 | Address Orchard
sources:
- Peterson and Davie, Computer Networks: A Systems Approach, sections 3.3.3 (Global Addresses) and 3.3.5 (Subnetting and Classless Addressing) | https://book.systemsapproach.org/internetworking/basic-ip.html
- Peterson and Davie, section 4.2 (IP Version 6) | https://book.systemsapproach.org/scaling/ipv6.html
- RFC 791, Internet Protocol | https://www.rfc-editor.org/rfc/rfc791
- RFC 950, Internet Standard Subnetting Procedure | https://www.rfc-editor.org/rfc/rfc950
- RFC 1918, Address Allocation for Private Internets | https://www.rfc-editor.org/rfc/rfc1918
- RFC 3021, Using 31-Bit Prefixes on IPv4 Point-to-Point Links | https://www.rfc-editor.org/rfc/rfc3021
- RFC 4632, Classless Inter-domain Routing (CIDR) | https://www.rfc-editor.org/rfc/rfc4632
check:
- An IPv4 address has 32 bits, written as four numbers from 0 to 255 | RFC 791 section 2.3 and Peterson and Davie 3.3.3
- A prefix length such as /24 says how many leading bits are the network part | Peterson and Davie 3.3.5 and RFC 4632
- A network's all-zeros host address is the network itself and its all-ones address is the broadcast address, so usable devices = 2 to the power of the host bits, minus 2 | Peterson and Davie 3.3.3 and RFC 3021 section 1 (the subtraction is arithmetic from that)
- /31 point-to-point links are a special case that uses both addresses | RFC 3021
- 192.168.0.0/16, 10.0.0.0/8 and 172.16.0.0/12 are private ranges, not meant for the public internet | RFC 1918 section 3
- Subnetting lets one network number be shared by several physical networks | Peterson and Davie 3.3.5
- CIDR allows any prefix length and lets routers combine routes | Peterson and Davie 3.3.5 and RFC 4632
- A host decides whether a destination is on its own subnet by using the subnet mask, and sends other traffic to a router | Peterson and Davie 3.3.5
- IPv6 addresses are 128 bits long and also use prefixes | Peterson and Davie 4.2
---

An IP address has two parts. One part names the network. The other part names a device on that network. Subnetting moves the split between the two parts, so one big network can be cut into smaller ones.

## Start with a street address

Take "12 Smith Street". "Smith Street" tells you which street. "12" tells you which house on it. An IPv4 address works the same way. The first part is the network, and the last part is the device.

## How an IPv4 address is written

An IPv4 address is 32 bits long. We write it as four numbers from 0 to 255, like 192.168.10.70. Each number stands for 8 bits.

Where does the network part end? The *prefix length* tells you. It is written after a slash. In 192.168.10.0/24, the "/24" means the first 24 bits are the network part. The last 8 bits are for devices.

The same information can be written as a *subnet mask*. For /24 the mask is 255.255.255.0. Each 255 means that all 8 bits of that number belong to the network part.

## How many devices fit

With /24, there are 8 bits left for devices. Eight bits give 256 combinations. Two of them have special jobs. The all-zeros address names the network itself. The all-ones address, called the broadcast address, reaches every device on the network. That leaves 254 usable addresses.

The rule is: usable devices = 2 to the power of the host bits, minus 2.

## Splitting a network

Say a school has 192.168.10.0/24 and wants four separate networks, one for each building.

Move the split two bits to the right. The prefix becomes /26. Two extra network bits give 4 combinations, so there are four subnets. Each subnet has 6 bits left for devices. That is 64 addresses, and 62 of them can be used by devices.

:::example Worked example
The four subnets of 192.168.10.0/24 when the prefix is /26. The mask is 255.255.255.192. These were computed with a script.

| Subnet | All addresses | Usable devices | Broadcast address |
|---|---|---|---|
| 192.168.10.0/26 | .0 to .63 | .1 to .62 | .63 |
| 192.168.10.64/26 | .64 to .127 | .65 to .126 | .127 |
| 192.168.10.128/26 | .128 to .191 | .129 to .190 | .191 |
| 192.168.10.192/26 | .192 to .255 | .193 to .254 | .255 |
:::

## Which subnet is an address in?

Look at the last number and find the range it falls in.

- 192.168.10.70 is in the range 64 to 127. It belongs to 192.168.10.64/26.
- 192.168.10.130 is in the range 128 to 191. It belongs to 192.168.10.128/26.

These two devices are on different subnets. To reach each other, their traffic has to go through a router. A device makes this decision by using the subnet mask to check whether the destination is on its own subnet.

## Why split a network?

- **Smaller groups.** A broadcast message only reaches the devices in one subnet.
- **Tidier layout.** You can give each building or team its own subnet.
- **Easier rules.** You can set rules for traffic between subnets.

Subnetting also lets one network number be shared by several physical networks.

## Private addresses

Some address ranges are private. For example, addresses that start with 192.168 are private. Two other private ranges are 10.0.0.0/8 and 172.16.0.0/12. Homes and offices use them inside their own networks. They are not meant to be used on the public internet.

## Common mistakes

- **Forgetting to subtract 2.** The network and broadcast addresses are not for devices.
- **Reading the prefix backwards.** A bigger number after the slash means a smaller network. A /26 is smaller than a /24.
- **Thinking the mask changes the address.** It does not. It only says where the split is.

## Check yourself

:::check
Q: How many usable device addresses does a /27 give?
A: A /27 leaves 5 bits for devices. That is 32 addresses, minus 2, so 30 devices.
Q: Which /26 subnet of 192.168.10.0/24 contains 192.168.10.200?
A: 192.168.10.192/26. It covers .192 to .255.
Q: What is the subnet mask for /28, and how many devices does it allow?
A: The mask is 255.255.255.240. It allows 14 devices.
:::

:::deeper
**CIDR.** Classless addressing (CIDR) lets a network use any prefix length. Before it, addresses came in a few fixed sizes called classes. CIDR also lets routers join several routes into one, which keeps routing tables smaller.

**Special cases.** A /32 is a single address. A /31 is used for links between exactly two devices, and it uses both addresses.

**IPv6.** IPv6 addresses are 128 bits long, and they use prefixes too.
:::
