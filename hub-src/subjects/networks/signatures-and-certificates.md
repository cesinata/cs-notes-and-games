---
title: Signatures and certificates
summary: How a signature proves who sent something, and how a chain of certificates lets your browser trust a website's key.
practise:
- net/7.4 | Seal of Approval
sources:
- Peterson and Davie, Computer Networks: A Systems Approach, section 8.3 (Key Predistribution) | https://book.systemsapproach.org/security/key-distro.html
- RFC 5280, Internet X.509 Public Key Infrastructure Certificate and CRL Profile | https://www.rfc-editor.org/rfc/rfc5280
- RFC 8446, The Transport Layer Security (TLS) Protocol Version 1.3 | https://www.rfc-editor.org/rfc/rfc8446
- RFC 9110, HTTP Semantics | https://www.rfc-editor.org/rfc/rfc9110
check:
- A certificate binds a public key to a name | Peterson and Davie 8.3.1 and RFC 5280
- A certificate holds the subject's name, public key, issuer, validity dates and the issuer's signature | RFC 5280 section 4.1
- A certificate authority signs certificates | Peterson and Davie 8.3.1
- Browsers and operating systems hold a list of trusted root certificate authorities | Peterson and Davie 8.3.1 (it covers trusted roots, not browser lists)
- A server's certificate is often signed by an intermediate authority, which is signed by a root | RFC 5280 section 3 and Peterson and Davie 8.3.1
- A client checks the chain of signatures, the name and the validity dates | RFC 8446 section 4.4.2 and RFC 5280 section 6
- A certificate can be revoked before it expires | RFC 5280 sections 3.3 and 5
- A client checks that the name in the certificate matches the host it asked for | RFC 9110 section 4.3.4 (https certificate verification)
---

A signature shows who sent a message. But how do you know a public key really belongs to the person who claims it? Certificates answer that. This page shows how a chain of them builds trust.

## Start with an ID card

A shop assistant does not know you. They look at your ID. They trust it because a government issued it, and they trust the government. A certificate is an ID card for a public key.

## What a certificate holds

A *certificate* says: "this public key belongs to this name". It holds:

- the name of the owner, for example a website's name,
- the owner's public key,
- the name of the issuer,
- the dates between which it is valid,
- the issuer's digital signature over all of that.

A *certificate authority* (CA) is an organisation that issues and signs certificates.

## The chain

You cannot know every site's issuer. So trust is passed along a chain.

:::example Worked example
These names are made up.

| Certificate | Signed by | Trusted because |
|---|---|---|
| shop.example.com | Example Intermediate CA | Its signature checks out against the intermediate's key |
| Example Intermediate CA | Example Root CA | Its signature checks out against the root's key |
| Example Root CA | itself | It is in your browser's list of trusted roots |

The browser follows the chain upwards and stops at a root it already trusts. If any link is broken, it shows a warning.
:::

## What the browser checks

When you visit a site over HTTPS, the browser checks several things:

1. Every signature in the chain is valid.
2. The chain ends at a trusted root.
3. The name in the certificate matches the site's address.
4. Today's date is within the validity dates.

If any check fails, you get a warning page.

## Revoking

A certificate can be revoked before its end date, for example if its private key is stolen. Browsers have ways to check for this, but they are not perfect.

## Common mistakes

- **"A certificate means the site is safe."** It means the key belongs to that name. It says nothing about what the site does.
- **"The browser trusts every authority."** It trusts the ones in its own list.

## Check yourself

:::check
Q: What does a certificate link together?
A: A name and a public key.
Q: Where does a chain of certificates end?
A: At a root authority that the browser already trusts.
Q: Name two things a browser checks on a certificate.
A: Any two of: the signatures, the trusted root, that the name matches, that it is within its dates.
:::

:::deeper
**Certificate transparency.** Public logs now record issued certificates, so a wrongly issued one can be spotted.
:::
