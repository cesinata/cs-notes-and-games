---
title: Email
summary: How a message travels from one mailbox to another, and which protocol does which part.
sources:
- Peterson and Davie, Computer Networks: A Systems Approach, section 9.1.1 (Electronic Mail (SMTP, MIME, IMAP)) | https://book.systemsapproach.org/applications/traditional.html
- RFC 5321, Simple Mail Transfer Protocol | https://www.rfc-editor.org/rfc/rfc5321
- RFC 3501, Internet Message Access Protocol, version 4rev1 | https://www.rfc-editor.org/rfc/rfc3501
- RFC 6409, Message Submission for Mail | https://www.rfc-editor.org/rfc/rfc6409
- RFC 1939, Post Office Protocol, Version 3 | https://www.rfc-editor.org/rfc/rfc1939
- RFC 2606, Reserved Top Level DNS Names | https://www.rfc-editor.org/rfc/rfc2606
- IANA, Service Name and Transport Protocol Port Number Registry | https://www.iana.org/assignments/service-names-port-numbers
check:
- SMTP is used to send mail from a client to a server and between servers | RFC 5321 section 1.1 and Peterson and Davie 9.1.1
- IMAP and POP3 are used by a client to read mail from a server | RFC 3501 and RFC 1939
- A sending server finds the receiver's mail server using the MX record in DNS | RFC 5321 section 5
- SMTP between servers uses port 25, and message submission uses port 587 | IANA registry and RFC 6409
- IMAP uses port 143 and 993 for IMAP over TLS | IANA registry
- POP3 uses port 110 and 995 for POP3 over TLS | IANA registry
- example.com and example.net are reserved for examples | RFC 2606
---

Email is older than the web, and it still runs on a set of simple protocols. This page follows one message from the sender to the reader.

## Start with a post box and a pigeonhole

You drop a letter in a post box. It goes between sorting offices until it reaches the recipient's pigeonhole. Later the recipient comes and collects it. Sending and collecting are two separate jobs, and email has a protocol for each.

## The parts

- **SMTP** (Simple Mail Transfer Protocol) *sends* mail. Your email program uses it to hand a message to your mail server. Mail servers use it to pass the message to each other.
- **IMAP** and **POP3** let a program *collect* mail from a server. IMAP keeps the mail on the server, so you can read it from several devices. POP3 usually downloads it.

Each uses a well-known port:

| Job | Protocol | Port |
|---|---|---|
| Your program sends to your server | SMTP submission | 587 |
| Server to server | SMTP | 25 |
| Read mail | IMAP | 143 (993 with TLS) |
| Read mail | POP3 | 110 (995 with TLS) |

## Finding the right server

A server needs to know where to send mail for `bob@example.net`. It asks DNS for the *MX record* of `example.net`, which lists that domain's mail servers.

:::example Worked example
`ann@example.com` writes to `bob@example.net`. The domains are reserved for examples.

| Step | What happens | Protocol |
|---|---|---|
| 1 | Ann's program sends the message to her mail server. | SMTP submission |
| 2 | Her server asks DNS for the MX record of example.net. | DNS |
| 3 | Her server passes the message to Bob's mail server. | SMTP |
| 4 | Bob's server stores it in his mailbox. | |
| 5 | Bob's program collects it. | IMAP |
:::

## Common mistakes

- **"Email goes straight from sender to receiver."** It usually passes through at least two mail servers.
- **"One protocol does it all."** Sending and collecting use different ones.

## Check yourself

:::check
Q: Which protocol sends mail between servers?
A: SMTP.
Q: How does a server find where to send mail for example.net?
A: It looks up the MX record for the domain in DNS.
Q: What is the difference between IMAP and POP3?
A: IMAP keeps the mail on the server for use from many devices. POP3 usually downloads it.
:::

:::deeper
**Spam and forged senders.** Plain SMTP does not check who the sender really is. Extra systems, such as SPF, DKIM and DMARC, let a receiving server check that a message is from the domain it claims.
:::
