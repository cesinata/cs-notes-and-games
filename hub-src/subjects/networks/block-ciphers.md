---
title: Block ciphers
summary: How modern encryption works on fixed-size blocks, why the mode matters, and what AES is.
sources:
- NIST, FIPS 197, Advanced Encryption Standard (AES) | https://csrc.nist.gov/pubs/fips/197/final
- NIST, SP 800-38A, Recommendation for Block Cipher Modes of Operation | https://csrc.nist.gov/pubs/sp/800/38/a/final
- Peterson and Davie, Computer Networks: A Systems Approach, sections 8.2.1 and 8.2.2 (Principles of Ciphers, Secret-Key Ciphers) | https://book.systemsapproach.org/security/crypto.html
- RFC 8446, The Transport Layer Security (TLS) Protocol Version 1.3 | https://www.rfc-editor.org/rfc/rfc8446
check:
- A block cipher encrypts a fixed-size block of data using a key | Peterson and Davie 8.2.1 and FIPS 197
- AES has a block size of 128 bits | FIPS 197
- AES keys are 128, 192 or 256 bits long | FIPS 197
- A message shorter than a whole number of blocks is padded | NIST SP 800-38A section 5.2 and Appendix A
- In ECB mode, identical plaintext blocks give identical ciphertext blocks | NIST SP 800-38A section 6.1 (each block is enciphered on its own) and Peterson and Davie 8.2.1
- Modes such as CBC and CTR avoid that by mixing in earlier data or a counter | NIST SP 800-38A sections 6.2 and 6.5
- 2 to the power of 128 is about 3.4 times 10 to the power of 38 | arithmetic
- TLS 1.3 only allows authenticated encryption modes | RFC 8446 section 5.2
---

A Caesar cipher works on one letter at a time. Modern ciphers work on whole blocks of data. This page explains what that means, and why the way blocks are joined matters.

## Start with a shredder that takes sheets

Imagine a machine that takes a whole sheet of 16 characters and mixes them thoroughly with a secret key. A long document goes through it a sheet at a time. That is a block cipher.

## The idea

A *block cipher* takes a fixed-size block of data and a key, and produces a block of the same size. The standard in use today is AES, the Advanced Encryption Standard. It works on 128-bit blocks, which is 16 bytes. Its keys are 128, 192 or 256 bits.

A longer message is cut into blocks. If the last block is short, it is filled with *padding*.

:::example Worked example
A message is 40 bytes long. This was worked out by a script.

40 ÷ 16 = 2.5, so the message needs 3 blocks. Three blocks hold 48 bytes. So 8 bytes of padding are added.

A 128-bit key has 2 to the power of 128 possible values, which is about 3.4 followed by 38 zeros. That is far too many to try one by one.
:::

## The mode matters

The simplest way to use a block cipher is to encrypt each block on its own. This is *ECB* mode. It has a flaw: two identical blocks of plaintext give two identical blocks of ciphertext, so patterns in the data show through. A picture encrypted this way can still be recognised.

Better *modes of operation* mix something extra into each block, such as the previous ciphertext block (CBC) or a counter (CTR). With a fresh starting value or counter each time, identical plaintext blocks then give different ciphertext.

## Common mistakes

- **"A strong cipher is enough."** A strong cipher used in a weak mode can still leak.
- **"The key is the same size as the message."** The key is fixed, such as 128 bits, however long the message.

## Check yourself

:::check
Q: How many bytes are in an AES block?
A: 16 bytes, which is 128 bits.
Q: A message is 20 bytes long. How many AES blocks does it need?
A: Two blocks. 20 ÷ 16 is more than 1, so it needs 2, and 12 bytes of padding.
Q: What is the problem with ECB mode?
A: Identical plaintext blocks give identical ciphertext blocks, so patterns show.
:::

:::deeper
**Authenticated modes.** Modes such as GCM also check that the data has not been changed, so they give privacy and integrity together. TLS 1.3 only allows modes like these.
:::
