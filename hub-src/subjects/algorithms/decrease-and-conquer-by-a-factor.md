---
title: Decrease and conquer by a factor
summary: Solving a problem by cutting it down by a fraction each step, shown with binary search and fast powers.
practise:
- algo/2.1 | Guess the Tide
- algo/2.2 | Power Shell
sources:
- Wikipedia, Binary search algorithm | https://en.wikipedia.org/wiki/Binary_search_algorithm
- Wikipedia, Exponentiation by squaring | https://en.wikipedia.org/wiki/Exponentiation_by_squaring
- Erickson, Algorithms (2019), CC BY 4.0, chapter 1 (Recursion) | https://jeffe.cs.illinois.edu/teaching/algorithms/book/01-recursion.pdf
check:
- Binary search compares the target with the middle item of a sorted list and discards half | Wikipedia, Binary search algorithm
- Binary search on n items needs at most about log base 2 of n comparisons | Wikipedia, Binary search algorithm
- Exponentiation by squaring computes a power using about log base 2 of the exponent multiplications | Wikipedia, Exponentiation by squaring
- 3 to the power of 13 is 1,594,323 | arithmetic, checked by the script run
- Reducing by a factor makes the work grow much more slowly than reducing by a constant | Erickson, chapter 1
---

Cutting a problem down by one step each time is good. Cutting it in half each time is far better. This page shows the two best-known examples.

## Start with guessing a number

Think of a number from 1 to 100. A friend guesses 50. You say "higher". Now they guess 75. Each guess throws away half of the possibilities. In at most 7 guesses, they find it.

## The idea

*Decrease and conquer by a factor* reduces the problem by a fixed fraction, usually half, on each step. The number of steps is about log base 2 of n, which grows very slowly.

## Binary search

To find a target in a *sorted* list, compare it with the middle item. If it matches, you are done. If the target is smaller, keep only the left half. If larger, keep only the right half. Repeat.

:::example Worked example
Find 70 in this sorted list of 11 items: 3, 9, 14, 22, 31, 40, 55, 62, 70, 88, 91. These steps were worked out by a script.

| Step | Search positions | Middle item | Decision |
|---|---|---|---|
| 1 | 0 to 10 | 40 | 70 is larger, keep the right half |
| 2 | 6 to 10 | 70 | Found |

Two comparisons. In the worst case, a list of 11 items needs at most 4. A sorted list of 1,000,000 items needs at most 20.
:::

## Fast powers

To compute 3 to the power of 13, the slow way multiplies 12 times. A faster way is *exponentiation by squaring*: square repeatedly and combine the parts you need.

:::example Worked example
13 in binary is 1101, which means 13 = 8 + 4 + 1. These values were checked by a script.

Squaring gives 3 squared = 9, then 3 to the 4th = 81, then 3 to the 8th = 6,561. That is 3 multiplications.

Then combine: 6,561 × 81 = 531,441, and 531,441 × 3 = 1,594,323. That is 2 more.

Total: 5 multiplications, against 12 the slow way. The answer is 1,594,323.
:::

## Common mistakes

- **Using binary search on an unsorted list.** The halving only works if the list is sorted.
- **Off by one at the edges.** The ends of the search range are the usual place for bugs.

## Check yourself

:::check
Q: At most how many guesses find a number from 1 to 100 by halving?
A: 7, because 2 to the power 7 is 128, which is more than 100.
Q: What must be true of a list before binary search?
A: It must be sorted.
Q: How many multiplications does the fast method use for 3 to the power 13?
A: 5.
:::

:::deeper
**Why log n.** Halving n items again and again takes log base 2 of n steps to reach 1. That is why the work grows so slowly.
:::
