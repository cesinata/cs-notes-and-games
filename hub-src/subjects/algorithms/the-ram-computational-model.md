---
title: The RAM computational model
summary: The simple model of a computer that algorithm analysis uses, where basic steps each count as one.
sources:
- Wikipedia, Random-access machine | https://en.wikipedia.org/wiki/Random-access_machine
- Erickson, Algorithms (2019), CC BY 4.0, chapter 0 (Introduction) | https://jeffe.cs.illinois.edu/teaching/algorithms/book/00-intro.pdf
check:
- The RAM model has memory cells that can be read or written directly by position | Wikipedia, Random-access machine
- In the model, basic operations such as arithmetic, comparing and reading or writing a cell each take one unit of time | Wikipedia, Random-access machine
- Counting operations lets us compare algorithms without depending on one machine | Erickson, chapter 0
- Summing n numbers in an array takes about n additions | arithmetic
- The model ignores effects such as caches and memory speed | Wikipedia, Random-access machine
---

To compare algorithms, we need a simple, fair way to count their work. This page explains the model that is used, and what it leaves out on purpose.

## Start with a calculator

Say a calculator takes one second per button press, whatever the button. You can count the presses a task needs, and so compare two methods, without worrying about the brand of calculator. The RAM model does this for computers.

## The model

*RAM* stands for *random-access machine*. It is an imagined computer with:

- A long row of memory cells.
- The ability to reach any cell directly by its position, in one step. This is "random access".
- A set of basic operations, each counted as **one unit of time**: adding, subtracting, comparing, reading a cell, writing a cell.

We count the units an algorithm uses. That count depends only on the algorithm and the size of the input, not on a particular machine.

:::example Worked example
Adding up an array of n numbers. For n = 1,000, the loop reads each cell once and adds it once. That is about 1,000 additions, plus about 1,000 reads. The exact count is not important. What matters is that the work grows in step with n. Twice as many numbers is about twice the work.
:::

## What the model ignores

A real computer has caches, different speeds for different memory, and parallel parts. The model ignores these. It is a good guide to how an algorithm *scales*, though not to its exact time on one machine.

## Common mistakes

- **"One unit means one second."** A unit is a count of steps. The real time depends on the machine.
- **"The model is wrong because computers are more complex."** It is simplified on purpose, so that comparing algorithms is fair.

## Check yourself

:::check
Q: What does random access mean?
A: Any memory cell can be reached directly by its position in one step.
Q: About how many additions does summing 500 numbers take?
A: About 500.
Q: Name one thing the RAM model ignores.
A: Any of: caches, differences in memory speed, parallel processing.
:::

:::deeper
**Other models.** Some problems need other models, such as ones that count memory accesses between a fast cache and a slow disk.
:::
