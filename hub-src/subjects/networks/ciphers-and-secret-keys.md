---
title: Ciphers and secret keys
summary: How a message is scrambled with a secret key, why simple ciphers fail, and the one rule every good cipher follows.
practise:
- net/7.1 | Secret Notes
sources:
- Peterson and Davie, Computer Networks: A Systems Approach, section 8.2.1 (Principles of Ciphers) | https://book.systemsapproach.org/security/crypto.html
- Wikipedia, Caesar cipher | https://en.wikipedia.org/wiki/Caesar_cipher
- Wikipedia, Kerckhoffs's principle | https://en.wikipedia.org/wiki/Kerckhoffs%27s_principle
- Wikipedia, Substitution cipher | https://en.wikipedia.org/wiki/Substitution_cipher
- Wikipedia, One-time pad | https://en.wikipedia.org/wiki/One-time_pad
check:
- A cipher turns plaintext into ciphertext using a key, and the reverse turns it back | Peterson and Davie 8.2.1
- A Caesar cipher shifts each letter a fixed number of places along the alphabet | Wikipedia, Caesar cipher
- Caesar's own shift is traditionally said to be 3 | Wikipedia, Caesar cipher
- A Caesar cipher has only 25 useful keys, so all can be tried | Wikipedia, Caesar cipher
- A simple substitution cipher has 26 factorial possible keys but can be broken by counting letter frequencies | Wikipedia, Substitution cipher (not covered in Peterson and Davie 8.2.1)
- Kerckhoffs's principle says a cipher should stay secure even if everything except the key is public | Wikipedia, Kerckhoffs's principle
- A one-time pad is unbreakable if the key is random, as long as the message, and never reused | Wikipedia, One-time pad
---

People have hidden messages for thousands of years. The ideas are old, and they still explain how modern encryption is judged. This page starts with the simplest cipher.

## Start with a decoder wheel

Two friends agree on a secret: "shift every letter three places along the alphabet". A is D, B is E, and so on. Anyone who does not know the secret sees nonsense. The friends read it easily.

## The words

- *Plaintext* is the readable message.
- *Ciphertext* is the scrambled version.
- A *cipher* is the method of scrambling.
- The *key* is the secret value that the method uses.

## The Caesar cipher

The *Caesar cipher* shifts each letter by a fixed number of places. The shift is the key. Julius Caesar is said to have used a shift of 3.

:::example Worked example
With a key of 3, the word HELLO becomes KHOOR. H goes to K, E to H, L to O, and O to R. To decrypt, shift back by 3. This was worked out by a script.
:::

## Why it is weak

There are only 25 useful shifts. Someone who intercepts a message can try all of them in a minute.

A better idea is a *substitution cipher*, where each letter is swapped for a different, chosen letter. The number of possible keys is 26 × 25 × 24 × ... × 1, written 26 factorial. A script gives 403,291,461,126,605,635,584,000,000, about 4 × 10 to the power of 26. That is far too many to try. But the cipher still falls to counting: in English, E is the most common letter, so the most common letter in the ciphertext is probably E.

## The rule: the key is the secret

*Kerckhoffs's principle* says a cipher should stay safe even if an attacker knows everything about how it works, except the key. Hiding the method is not security. A good cipher is public, tested by many people, and relies only on a secret key.

## Common mistakes

- **"More possible keys always means a stronger cipher."** A substitution cipher has a huge number of keys but is still easy to break.
- **"Keeping the method secret keeps it safe."** The secret should be only the key.

## Check yourself

:::check
Q: With a Caesar key of 3, what does B become?
A: E.
Q: Why is a Caesar cipher easy to break?
A: Only 25 shifts are possible, so an attacker can try them all.
Q: What does Kerckhoffs's principle say?
A: A cipher should be safe even when everything but the key is known.
:::

:::deeper
**One-time pad.** If the key is truly random, as long as the message, and used only once, the cipher cannot be broken. It is hard to use, because the key has to be shared safely and is as long as the message.
:::
