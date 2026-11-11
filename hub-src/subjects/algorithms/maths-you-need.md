---
title: Maths you need
summary: The few pieces of maths that algorithm analysis uses, sums, powers and logarithms, with small examples.
sources:
- Erickson, Algorithms (2019), CC BY 4.0, chapter 0 (Introduction), the mathematical background | https://jeffe.cs.illinois.edu/teaching/algorithms/book/00-intro.pdf
- Morin, Open Data Structures, section 1.2 (Mathematical Background) | https://opendatastructures.org/
check:
- The sum 1 + 2 + ... + n equals n times (n + 1) divided by 2 | Open Data Structures 1.2 and Erickson, chapter 0
- A logarithm is the power a base must be raised to: log base 2 of 1024 is 10 because 2 to the power of 10 is 1024 | Open Data Structures 1.2
- The sum 1 + 2 + 4 + ... + 2 to the power k equals 2 to the power (k + 1) minus 1 | Open Data Structures 1.2
- Logarithms grow very slowly: log base 2 of one million is about 20 | arithmetic, checked by the script run
- Floor rounds down and ceiling rounds up | Open Data Structures 1.2
---

Analysing algorithms uses a small amount of maths. This page covers the pieces you need, with examples you can check by hand.

## Start with counting

If you shake hands with everyone in a room of 5, how many handshakes? You add 4 + 3 + 2 + 1 = 10. That kind of adding-up appears everywhere in algorithms.

## Sums

The sum of the first n whole numbers is n × (n + 1) ÷ 2. For example, 1 + 2 + ... + 100 = 100 × 101 ÷ 2 = 5,050.

A sum where each term doubles also has a short form: 1 + 2 + 4 + ... + 2 to the power k = 2 to the power (k + 1) minus 1. For k = 9: 1 + 2 + 4 + ... + 512 = 1,023.

## Powers and logarithms

A *power* multiplies a number by itself: 2 to the power of 10 is 1,024.

A *logarithm* goes the other way. *log base 2 of 1,024 is 10*, because 2 to the power of 10 is 1,024. In words: "how many times can you halve 1,024 before you reach 1?" The answer is 10.

:::example Worked example
These values were computed by a script.

| Expression | Value |
|---|---|
| 1 + 2 + ... + 100 | 5,050 |
| 1 + 2 + 4 + ... + 512 | 1,023 |
| log base 2 of 1,024 | 10 |
| log base 2 of 1,000,000 | about 20 |

Logarithms grow very slowly. A million items can be halved down to one in only about 20 steps.
:::

## Rounding

*Floor* rounds down. *Ceiling* rounds up. The floor of 3.7 is 3, and the ceiling is 4. Algorithm counts are often rounded this way.

## Common mistakes

- **"A logarithm is a division."** It is the power you raise a base to.
- **"Doubling the input doubles a logarithm."** Doubling the input adds 1 to log base 2.

## Check yourself

:::check
Q: What is 1 + 2 + 3 + ... + 10?
A: 10 × 11 ÷ 2 = 55.
Q: What is log base 2 of 8?
A: 3, because 2 to the power of 3 is 8.
Q: What is the ceiling of 2.1?
A: 3.
:::

:::deeper
**Induction.** To prove a formula such as the sum of the first n numbers, you show it works for the first case, and that if it works for one case it works for the next.
:::
