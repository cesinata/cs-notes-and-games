---
title: Firewalls
summary: How a firewall decides which traffic may pass, using rules checked in order, and why a default of deny is the safe choice.
sources:
- NIST, SP 800-41 Revision 1, Guidelines on Firewalls and Firewall Policy | https://csrc.nist.gov/pubs/sp/800/41/r1/final
- Peterson and Davie, Computer Networks: A Systems Approach, section 8.5.6 (Firewalls) | https://book.systemsapproach.org/security/systems.html
check:
- A firewall controls traffic between networks according to rules | NIST SP 800-41 section 2
- A packet filter checks fields such as address, protocol and port | NIST SP 800-41 section 2.1.1
- Rules are checked in order and the first match applies | NIST SP 800-41 section 5.2.2 (it says "some firewalls" work this way)
- A default-deny policy blocks anything not explicitly allowed | NIST SP 800-41 section 4
- A stateful firewall tracks connections and allows replies to connections that were started from inside | NIST SP 800-41 section 2.1.2
- A firewall does not protect against threats that arrive through allowed traffic | NIST SP 800-41 section 2.3 and Peterson and Davie 8.5.6
---

A firewall sits between a network and the outside. It decides which traffic is allowed through. This page shows how those decisions are made, and why the order of the rules matters.

## Start with a security desk

A building has a desk at the entrance. The guard has a list: visitors for the shop may go in, deliveries use the side door, and nobody else enters. The guard checks each person against the list. A firewall checks each packet.

## Rules

A *packet filter* looks at each packet's header: the addresses, the protocol (TCP or UDP) and the port numbers. It compares the packet with a list of *rules*. In most simple packet filters, the rules are checked in order, and the *first rule that matches* decides what happens.

The safest policy is *default deny*: the last rule blocks everything not explicitly allowed.

:::example Worked example
A firewall in front of a web server has these rules, checked from the top. These results were worked out by a script.

| Rule | Action | Matches |
|---|---|---|
| 1 | Allow | TCP, port 443 (secure web) |
| 2 | Allow | TCP, port 80 (web) |
| 3 | Deny | Everything else |

| Packet | First matching rule | Result |
|---|---|---|
| TCP, port 443 | 1 | Allow |
| TCP, port 22 | 3 | Deny |
| UDP, port 53 | 3 | Deny |
| TCP, port 80 | 2 | Allow |

If rule 3 were missing, packets matching nothing might get through. That is why the last rule is a deny.
:::

## Stateful firewalls

A plain packet filter looks at each packet alone. A *stateful* firewall also remembers connections. If a computer inside the network starts a connection, the firewall allows the replies back in, and blocks traffic from outside that nobody asked for.

## What a firewall cannot do

A firewall works at the edge. It cannot protect against a danger that comes through traffic it allows, such as a harmful file in a web page, or a danger that starts inside. It is one layer of protection, not the only one.

## Common mistakes

- **"A firewall stops all attacks."** It limits what can reach the network. Allowed traffic can still be harmful.
- **"The order of the rules does not matter."** The first match wins, so the order changes the result.

## Check yourself

:::check
Q: A packet matches rule 2 and rule 3. Which applies?
A: Rule 2, because the first match applies.
Q: What does default deny mean?
A: Anything not explicitly allowed is blocked.
Q: What does a stateful firewall add?
A: It remembers connections, so it can allow replies to connections started from inside.
:::

:::deeper
**Where firewalls sit.** Home routers have one built in. Large organisations also run firewalls inside the network, so that a problem in one part does not spread to the rest.
:::
