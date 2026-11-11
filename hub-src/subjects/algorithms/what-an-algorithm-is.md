---
title: What an algorithm is
summary: A set of clear steps that solves a problem, what makes a good one, and Euclid's method for the greatest common divisor as a first example.
practise:
- algo/0.1 | Lighthouse Keeper's Toolkit
- algo/0.4 | Euclid's Ferry
sources:
- Erickson, Algorithms (2019), CC BY 4.0, chapter 0 (Introduction) | https://jeffe.cs.illinois.edu/teaching/algorithms/book/00-intro.pdf
- Wikipedia, Euclidean algorithm | https://en.wikipedia.org/wiki/Euclidean_algorithm
check:
- An algorithm is a finite list of precise steps that turns an input into an output | Erickson, chapter 0
- Each step of an algorithm must be clear enough to carry out without guessing | Erickson, chapter 0
- Euclid's algorithm finds the greatest common divisor by replacing the pair (a, b) with (b, a mod b) until b is 0 | Wikipedia, Euclidean algorithm
- The greatest common divisor of 48 and 18 is 6 | arithmetic, checked by the script run
- A program is an algorithm written in a programming language | Erickson, chapter 0
---

An algorithm is a way of solving a problem that anyone, or any computer, can follow without having to think. This page explains what that means, and shows one of the oldest examples.

## Start with a recipe

A recipe says: take these ingredients, do these steps in this order, and you get a cake. You do not need to understand baking. You only follow the steps. An algorithm is the same, but for a problem instead of a dish.

## What makes an algorithm

- It takes an *input* and gives an *output*.
- It has a *finite* number of steps, so it ends.
- Each step is *precise*, so there is no guessing.
- It works for every input of its kind, not only one case.

A *program* is an algorithm written in a programming language a computer can run. The same algorithm can be written in many languages.

## An example: Euclid's method

The *greatest common divisor* (GCD) of two numbers is the largest number that divides both. To find it, Euclid's method repeats one step: replace the pair (a, b) with (b, remainder of a ÷ b). Stop when the second number is 0. The first number is the answer.

:::example Worked example
Find the GCD of 48 and 18. These steps were worked out by a script.

| a | b | a mod b |
|---|---|---|
| 48 | 18 | 12 |
| 18 | 12 | 6 |
| 12 | 6 | 0 |

When b is 0, the answer is a. Here the GCD of 48 and 18 is 6.
:::

## Why study algorithms

The same problem often has several algorithms, and they can differ hugely in speed. Later pages show how to compare them.

## Common mistakes

- **"An algorithm is the same as a program."** An algorithm is the idea. A program is one way of writing it down.
- **"Any list of steps is an algorithm."** It must be precise and must end.

## Check yourself

:::check
Q: Name two properties of an algorithm.
A: Any two of: it has an input and output, it is finite, each step is precise, it works for every input of its kind.
Q: In Euclid's method, what do you replace (a, b) with?
A: (b, a mod b).
Q: When does Euclid's method stop?
A: When b is 0. The answer is then a.
:::

:::deeper
**Pseudocode.** Algorithms are often written in *pseudocode*, a plain mix of English and programming ideas, so the idea does not depend on one language.
:::
