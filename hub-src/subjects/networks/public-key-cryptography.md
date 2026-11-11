---
title: Public-key cryptography
summary: How two people who have never met can share secrets, shown with a small RSA example you can check by hand.
practise:
- net/7.3 | Key Pairs
sources:
- Peterson and Davie, Computer Networks: A Systems Approach, section 8.2.3 (Public-Key Ciphers) | https://book.systemsapproach.org/security/crypto.html
- Wikipedia, RSA (cryptosystem) | https://en.wikipedia.org/wiki/RSA_(cryptosystem)
- NIST, SP 800-57 Part 1, Recommendation for Key Management | https://csrc.nist.gov/pubs/sp/800/57/pt1/r5/final
check:
- In public-key cryptography each person has a public key and a private key | Peterson and Davie 8.2.3
- Encrypting with the public key means only the private key can decrypt | Peterson and Davie 8.2.3
- RSA uses a modulus n that is the product of two primes | Peterson and Davie 8.2.3 and Wikipedia, RSA
- In RSA the public exponent e and private exponent d satisfy e times d equals 1 modulo (p minus 1)(q minus 1) | Peterson and Davie 8.2.3 and Wikipedia, RSA
- The security of RSA relies on the difficulty of factoring n | Peterson and Davie 8.2.3
- Real RSA keys are far longer, with 2048 bits as a common minimum | NIST SP 800-57 Part 1
- RSA was first described in 1977 and published in 1978 | Wikipedia, RSA and Peterson and Davie 8.2.3
---

Symmetric ciphers have a problem: both sides need the same key, and sharing it safely is hard. Public-key cryptography solves this. This page shows how, with numbers small enough to check by hand.

## Start with a padlock

Imagine you make thousands of open padlocks and hand them out to anyone. You keep the only key. A friend can snap a padlock on a box and send it to you. Nobody else, not even your friend, can open it. The padlock is your *public key*. The key is your *private key*.

## The idea

A person makes a pair of keys that fit together. What one scrambles, only the other can decrypt. The public key is shared with everyone. The private key stays secret. Anyone can encrypt a message with your public key. Only you can decrypt it.

The best known system is *RSA*, first described in 1977 and published in 1978. Its security rests on a fact: it is easy to multiply two large primes, but very hard to take the answer apart again.

:::example Worked example
Tiny numbers, for learning only. They were worked out by a script.

**Making the keys.** Pick two primes, p = 11 and q = 13. Then n = 11 × 13 = 143. Next (p − 1) × (q − 1) = 10 × 12 = 120. Pick e = 7. Find d so that 7 × d leaves 1 when divided by 120. That is d = 103, because 7 × 103 = 721, and 721 = 6 × 120 + 1.

- Public key: (e = 7, n = 143)
- Private key: (d = 103, n = 143)

**Sending.** The message is the number 9. The sender calculates 9 to the power of 7, and takes the remainder when divided by 143. The result is 48. That is the ciphertext.

**Receiving.** The owner calculates 48 to the power of 103, and takes the remainder when divided by 143. The result is 9, the original message.
:::

## Real keys

143 is easy to take apart: 11 × 13. Real RSA uses primes hundreds of digits long, so that the product cannot be taken apart in any reasonable time. A common minimum size for the number n is 2,048 bits.

## How it is used

Public-key methods are slower than symmetric ones. So they are used briefly: to agree a shared secret key, or to make a signature. The shared key then does the heavy work.

## Common mistakes

- **"The public key can decrypt."** It can only encrypt. Only the private key decrypts.
- **"Tiny numbers are safe enough."** The example is only for learning. It can be broken at once.

## Check yourself

:::check
Q: Which key does the sender use to encrypt?
A: The receiver's public key.
Q: In the example, what is n?
A: 143, which is 11 × 13.
Q: Why do real keys use huge primes?
A: So that n cannot be taken apart into its primes in any reasonable time.
:::

:::deeper
**Key agreement.** A different method, Diffie-Hellman, lets two people agree on a shared secret over an open channel. Many secure connections use a version of it.
:::
