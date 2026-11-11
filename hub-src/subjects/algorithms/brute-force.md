---
title: Brute force
summary: The simplest way to solve a problem, trying everything, shown with sorting and with counting the pairs of points.
practise:
- algo/1.1 | Crate Sorter
- algo/1.3 | Closest Lighthouses
sources:
- Wikipedia, Brute-force search | https://en.wikipedia.org/wiki/Brute-force_search
- Wikipedia, Selection sort | https://en.wikipedia.org/wiki/Selection_sort
- Erickson, Algorithms (2019), CC BY 4.0, chapter 2 (Backtracking) | https://jeffe.cs.illinois.edu/teaching/algorithms/book/02-backtracking.pdf
check:
- A brute-force algorithm tries every possibility, or follows the problem's definition directly | Wikipedia, Brute-force search
- Selection sort repeatedly finds the smallest remaining item and swaps it into place | Wikipedia, Selection sort
- Selection sort makes n times (n minus 1) divided by 2 comparisons | Wikipedia, Selection sort
- The number of pairs among n items is n times (n minus 1) divided by 2 | arithmetic, checked by the script run
- Brute force is often slow, but it is simple and correct | Erickson, chapter 2
---

The first idea for solving a problem is often the most direct one: try everything. This is *brute force*. It is simple, and it is a useful baseline. This page shows it on two problems.

## Start with a lost key

You lose your key somewhere in the house. A brute-force search checks every room, every drawer, every pocket. It will find the key if it exists. It might take a long time.

## The idea

A *brute-force* algorithm follows the definition of the problem as directly as it can, or tries every possible answer. It is easy to write and easy to check. It can be slow, because the number of possibilities can grow quickly.

## Example 1: selection sort

To sort a list, find the smallest item and put it first. Then find the smallest of the rest and put it second, and so on.

:::example Worked example
Sort 29, 10, 14, 37, 13. These steps were worked out by a script.

| Pass | List after the pass |
|---|---|
| 1 | 10, 29, 14, 37, 13 |
| 2 | 10, 13, 14, 37, 29 |
| 3 | 10, 13, 14, 37, 29 |
| 4 | 10, 13, 14, 29, 37 |

It made 4 + 3 + 2 + 1 = 10 comparisons. In general, n items need n × (n − 1) ÷ 2. That is about n squared work, so doubling the list roughly quadruples the time.
:::

## Example 2: the closest pair of points

To find the two closest of n points by brute force, measure the distance between every pair and keep the smallest. The number of pairs is n × (n − 1) ÷ 2. For 5 points that is 10 pairs. For 20 points it is 190 pairs.

## When brute force is fine

If the input is small, brute force is often good enough, and its simplicity means fewer mistakes. It is also a good way to check a cleverer algorithm.

## Common mistakes

- **"Brute force is always bad."** It is simple and correct, and fine for small inputs.
- **"The first idea is the fastest."** Cleverer methods, in later pages, can be much faster.

## Check yourself

:::check
Q: How many comparisons does selection sort make on 6 items?
A: 6 × 5 ÷ 2 = 15.
Q: How many pairs are there among 8 points?
A: 8 × 7 ÷ 2 = 28.
Q: What is a good use for a brute-force algorithm?
A: As a simple baseline, and to check a cleverer algorithm's answers.
:::

:::deeper
**Exhaustive search.** For some problems, such as the travelling salesman problem, brute force means trying every possible route. The number of routes grows extremely fast.
:::
