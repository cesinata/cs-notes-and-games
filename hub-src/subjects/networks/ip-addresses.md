---
title: IP addresses
summary: What an IP address is, how IPv4 and IPv6 addresses are written, and a few addresses with special jobs.
practise:
- net/4.2 | Address Orchard
sources:
- Peterson and Davie, Computer Networks: A Systems Approach, section 3.3.3 (Global Addresses) | https://book.systemsapproach.org/internetworking/basic-ip.html
- Peterson and Davie, Computer Networks: A Systems Approach, section 4.2 (IP Version 6) | https://book.systemsapproach.org/scaling/ipv6.html
- RFC 791, Internet Protocol | https://www.rfc-editor.org/rfc/rfc791
- RFC 5737, IPv4 Address Blocks Reserved for Documentation | https://www.rfc-editor.org/rfc/rfc5737
- RFC 1122, Requirements for Internet Hosts: Communication Layers | https://www.rfc-editor.org/rfc/rfc1122
check:
- An IP address identifies a network interface, so a device with several connections has several addresses | Peterson and Davie 3.3.3
- An IPv4 address is 32 bits, written as four numbers separated by dots | RFC 791 section 2.3 and Peterson and Davie 3.3.3
- 2 to the power of 32 is 4,294,967,296 | arithmetic
- An IPv6 address is 128 bits | Peterson and Davie 4.2
- IPv6 was designed to deal with exhaustion of the IPv4 address space | Peterson and Davie 4.2
- 127.0.0.0/8 is reserved for loopback, so 127.0.0.1 means this device itself | RFC 1122 section 3.2.1.3
- 192.0.2.0/24 is reserved for use in documentation and examples | RFC 5737 section 3
---

Every device on the internet needs an address, so data knows where to go. That address is the IP address. This page explains how addresses are written and a few special ones.

## Start with a phone number

A phone number has an area code and a local number. The area code gets the call to the right region. The local number finds the phone. An IP address has the same two parts: one for the network and one for the device.

## What an address belongs to

An IP address belongs to a *network interface*, the point where a device connects to a network. A laptop with Wi-Fi and a cable port has two interfaces, so it can have two addresses. A router has an address on each network it connects.

## IPv4

An IPv4 address is 32 bits long. It is written as four numbers separated by dots, and each number stands for 8 bits. That gives each number a range from 0 to 255.

Thirty-two bits allow 2 to the power of 32 addresses. That is 4,294,967,296, about 4.3 billion.

:::example Worked example
The address 192.168.10.70 written in binary. This was converted by a script.

| Number | Binary |
|---|---|
| 192 | 11000000 |
| 168 | 10101000 |
| 10 | 00001010 |
| 70 | 01000110 |

So the full 32 bits are 11000000.10101000.00001010.01000110.
:::

## IPv6

The world has far more devices than 4.3 billion, so IPv6 was designed to deal with the shortage of IPv4 addresses. An IPv6 address is 128 bits long. That allows 2 to the power of 128 addresses, which is about 3.4 followed by 38 zeros. It is written in hexadecimal, in groups separated by colons.

## Addresses with special jobs

- **127.0.0.1** means "this device itself". It is called the loopback address. Traffic sent to it never leaves the computer.
- **192.0.2.0 to 192.0.2.255** are kept for examples in books and documents. They are never given to real devices.
- **Private ranges**, such as the ones starting 192.168, are used inside homes and offices. The subnetting page explains these.

## Common mistakes

- **"An address belongs to a person or a device."** It belongs to an interface. A device with two connections has two.
- **"Each number can go up to 256."** The largest is 255, because 8 bits hold 0 to 255.

## Check yourself

:::check
Q: How many bits are in an IPv4 address?
A: 32.
Q: What does 127.0.0.1 mean?
A: This device itself. It is the loopback address.
Q: Write 10.0.0.1 in binary.
A: 00001010.00000000.00000000.00000001.
:::

:::deeper
**Getting an address.** A device usually gets its address automatically from a server on the network, using a protocol called DHCP.

**Sharing one address.** Many homes share one public address among all their devices, by using a technique called network address translation (NAT).
:::
