---
title: DNS
summary: How a name like example.com is turned into an IP address, and why the answer is saved along the way.
practise:
- net/6.1 | Name Finder
sources:
- Peterson and Davie, Computer Networks: A Systems Approach, section 9.3.1 (Name Service (DNS)) | https://book.systemsapproach.org/applications/infrastructure.html
- RFC 1034, Domain Names: Concepts and Facilities | https://www.rfc-editor.org/rfc/rfc1034
- RFC 1035, Domain Names: Implementation and Specification | https://www.rfc-editor.org/rfc/rfc1035
- RFC 5737, IPv4 Address Blocks Reserved for Documentation | https://www.rfc-editor.org/rfc/rfc5737
- RFC 3596, DNS Extensions to Support IP Version 6 | https://www.rfc-editor.org/rfc/rfc3596
check:
- DNS maps names to IP addresses | RFC 1034 section 2 and Peterson and Davie 9.3.1
- DNS names form a hierarchy, read from the right: root, top-level domain, then lower levels | RFC 1034 section 3
- A resolver asks the root servers, then top-level domain servers, then the domain's own servers | RFC 1034 section 5.3 and Peterson and Davie 9.3.1
- Answers carry a time to live (TTL), and a resolver can keep them until it runs out | RFC 1034 section 3.6 and RFC 1035 section 3.2.1
- DNS uses port 53, usually over UDP | RFC 1035 section 4.2
- 192.0.2.0/24 is reserved for examples | RFC 5737
- An AAAA record holds an IPv6 address | RFC 3596
---

People use names such as example.com. Computers use IP addresses. The Domain Name System, or DNS, is the service that turns one into the other.

## Start with a phone book

You know a friend's name, but a call needs a number. You look the name up. DNS is a phone book that anyone can ask, and the whole internet shares it.

## Names have a shape

A name is read from the right. In www.example.com, the last part, com, is the *top-level domain*. Next is example, then www. The names form a tree. At the top is the *root*, then the top-level domains, then the names below them.

No one computer holds all the names. Each part of the tree is run by servers responsible for it.

## How a lookup works

Your computer asks a *resolver*, usually run by your internet provider or your network. The resolver does the work:

1. It asks a root server where to find the servers for com.
2. It asks a com server where to find the servers for example.com.
3. It asks example.com's own server for the address of www.example.com.
4. It sends the answer back to your computer.

:::example Worked example
These addresses are made up. 192.0.2.10 is in a block reserved for examples.

| Step | Question | Answer |
|---|---|---|
| 1 | Root server: who handles com? | Ask the com servers. |
| 2 | com server: who handles example.com? | Ask example.com's server. |
| 3 | example.com's server: what is www.example.com? | 192.0.2.10, valid for 300 seconds. |

The 300 seconds is the *time to live* (TTL). For the next 5 minutes, the resolver can answer from its saved copy and skip steps 1 to 3.
:::

## Why answers are saved

Asking three servers takes time. A resolver keeps answers for as long as the TTL allows. This saving is called *caching*. It makes most lookups fast, and it spares the root servers from a flood of questions.

DNS questions are short, so they usually go over UDP, to port 53.

## Common mistakes

- **"DNS finds the web page."** It only finds the address. The browser then asks that address for the page.
- **"One server knows every name."** Each part of the tree has its own servers.

## Check yourself

:::check
Q: In the name www.example.com, which part is the top-level domain?
A: com, the part on the right.
Q: What does a TTL of 300 seconds mean?
A: The answer can be saved and reused for 300 seconds.
Q: Why does caching make DNS faster?
A: The resolver can answer from its saved copy and skip asking other servers.
:::

:::deeper
**Record types.** An address answer is called an A record for IPv4 and an AAAA record for IPv6. Other records give things like mail servers.

**Over TCP.** DNS can also use TCP, for larger answers.
:::
