---
title: Network security basics
summary: The ideas behind keeping messages private and knowing who sent them, and what the padlock in your browser does and does not mean.
practise:
- net/7.1 | Secret Notes
- net/7.3 | Key Pairs
- net/7.4 | Seal of Approval
sources:
- Peterson and Davie, section 8.2 (Cryptographic Building Blocks) | https://book.systemsapproach.org/security/crypto.html
- Peterson and Davie, section 8.3 (Key Predistribution, including certification authorities) | https://book.systemsapproach.org/security/key-distro.html
- Peterson and Davie, section 8.5.3 (Transport Layer Security and HTTPS) | https://book.systemsapproach.org/security/systems.html
- RFC 8446, The Transport Layer Security (TLS) Protocol Version 1.3 | https://www.rfc-editor.org/rfc/rfc8446
- RFC 9110, HTTP Semantics | https://www.rfc-editor.org/rfc/rfc9110
- NIST FIPS 180-4, Secure Hash Standard | https://csrc.nist.gov/pubs/fips/180-4/upd1/final
- Chromium Blog, An Update on the Lock Icon (2023) | https://blog.chromium.org/2023/05/an-update-on-lock-icon.html
check:
- With public-key encryption, the public key encrypts and only the matching private key decrypts | Peterson and Davie 8.2.3
- Symmetric encryption uses one shared key and is faster than public-key encryption | Peterson and Davie 8.2.2 and 8.2.3
- Real systems use public-key methods to set up a shared key, then symmetric encryption for the data | Peterson and Davie 8.3 and RFC 8446 section 2
- A hash function turns any input into a fixed-length output, and the same input always gives the same output | NIST FIPS 180-4 (confirmed here only by the worked example, because the full standard was not read)
- A good hash function is one-way: it is not practical to find a message that produces a given fingerprint | Peterson and Davie 8.2.4
- A digital signature is made with the private key and checked with the public key | Peterson and Davie 8.2.4
- A certificate authority signs a certificate that links a website name to a public key | Peterson and Davie 8.3.1 and 8.5.3, and RFC 8446 section 4.4.2.2
- HTTPS is HTTP carried over TLS | Peterson and Davie 8.5.3 and RFC 9110 section 4.2.2
- The padlock does not prove a site is trustworthy, because phishing sites can also use HTTPS | Chromium Blog, An Update on the Lock Icon (2023)
- Some browsers now show a different icon instead of a padlock | Chromium Blog, An Update on the Lock Icon (2023). Check what each browser shows today
- SHA-256 of "hello" starts 2cf24dba5fb0 and of "hellp" starts fdd7585e08c4 (computed in Python on 10 Nov 2026) | recompute with any SHA-256 tool
---

Sending data over a network is like sending a postcard. Anyone who handles it on the way can read it, and anyone could have written it. Network security is a set of tools that fix those problems.

## Three goals

- **Privacy.** Only the right people can read the message. The word for this is *confidentiality*.
- **Honesty.** The message has not been changed on the way. The word is *integrity*.
- **Identity.** You know who really sent it. The word is *authentication*.

Each tool below does one or more of these jobs.

## Encryption

*Encryption* scrambles a message so that only someone with the right *key* can read it. Reading it again is called *decrypting*. There are two kinds.

**Symmetric encryption** uses one key to scramble a message and the same key to decrypt it. It is fast. The problem is sharing the key: if you send the key over the network, someone could copy it.

**Public-key encryption** uses a pair of keys. The *public key* can be given to anyone, and it scrambles messages. Only the matching *private key* can decrypt them. You keep the private key secret. Anyone can send you a secret message, but only you can read it. It is slower than symmetric encryption.

Real systems use both. They use public-key methods to agree on a shared key safely. Then they use that key with symmetric encryption for the actual data.

## Hashes

A *hash* is a short fingerprint of some data. A hash function turns any input into an output of fixed length. The same input always gives the same output. A tiny change gives a completely different output. A good hash function is also one-way: given a fingerprint, it is not practical to find a message that produces it.

:::example Worked example
This was computed with SHA-256, a common hash function. Changing one letter changes the whole fingerprint. The outputs are 64 characters long, and only the start is shown here.

| Input | SHA-256 starts with |
|---|---|
| hello | 2cf24dba5fb0… |
| hellp | fdd7585e08c4… |
:::

Hashes help with integrity. If the fingerprint of a file you downloaded matches the one the publisher posted on their own site, that is a good sign the file was not changed on the way. It only helps if you got the fingerprint from a source you trust.

## Digital signatures

A *digital signature* proves who sent something and that it has not been changed. The sender makes a hash of the message and signs that hash with their private key. The result is the signature. Anyone can check it with the sender's public key.

This is the public-key idea in reverse. For encryption, the public key scrambles and the private key decrypts. For a signature, the private key signs and the public key checks.

## Certificates

When you visit a website, how do you know a public key really belongs to that site? A *certificate* answers this. It links a website's name to its public key. A *certificate authority* that your browser already trusts signs it.

## What the padlock means

HTTPS is the normal web protocol, HTTP, carried over a secure layer called TLS. When your browser shows a padlock (some browsers now use a different icon), it means the connection is encrypted and the site has proved it is the one named in the address.

It does not mean the site is honest. A fake site pretending to be your bank can have a padlock too. Always check the address as well.

## Common mistakes

- **"Encryption and hashing are the same."** Encryption can be undone with the key. A hash cannot be undone.
- **"A padlock means the site is safe."** It means the connection is private. It says nothing about who runs the site.
- **"Both keys must be kept secret."** Only the private key is secret. The public key is meant to be shared.

## Check yourself

:::check
Q: Which key do you use to scramble a message for someone else with public-key encryption?
A: Their public key. Only their private key can decrypt it.
Q: A downloaded file's hash does not match the one the publisher posted. What does that suggest?
A: The file was changed or damaged, so you should not trust it.
Q: Does a padlock in the browser prove a website is trustworthy?
A: No. It shows the connection is encrypted and the certificate matches the site name. A fake site can have one too.
:::

:::deeper
**TLS.** TLS is the protocol behind HTTPS. Its job is to agree on keys, check certificates, and then protect the data. Version 1.3 is the current one, described in RFC 8446.

**A fourth goal.** Some lists add *availability*: keeping a service working so people can use it.
:::
