---
title: Greedy methods
summary: How picking the best-looking choice at each step can give a perfect answer, and the cases where it does not.
sources:
- Erickson, Algorithms (2019), chapter 4, Greedy Algorithms (CC BY 4.0) | https://jeffe.cs.illinois.edu/teaching/algorithms/book/04-greedy.pdf
- Erickson, Algorithms (2019), chapter 7, Minimum Spanning Trees (CC BY 4.0) | https://jeffe.cs.illinois.edu/teaching/algorithms/book/07-mst.pdf
- RFC 1951, DEFLATE Compressed Data Format Specification | https://www.rfc-editor.org/rfc/rfc1951
check:
- A greedy algorithm makes the choice that looks best right now and never changes it | Erickson, chapter 4 (its example is "scan through the classes in order of finish time")
- Greedy choices give the best answer for some problems and not for others | Erickson, chapter 4 ("some of these exercises cannot be solved using greedy algorithms")
- For interval scheduling, picking the activity that finishes earliest gives the most activities | Erickson, chapter 4, section 4.2 (Scheduling Classes)
- Proving a greedy algorithm correct often uses an exchange argument | Erickson, chapter 4, section 4.2 ("we use an exchange argument")
- Prim's and Kruskal's algorithms are greedy | Erickson, chapter 7 (minimum spanning trees use a "greedy exchange argument")
- DEFLATE, used by gzip and zip, uses Huffman coding | RFC 1951
---

A greedy algorithm always grabs the best-looking option and never looks back. It is the simplest way to build an answer. This page shows when it works, when it fails, and why it is worth learning.

## Start with packing a suitcase

You have one suitcase and a pile of clothes. A greedy way is to put in the item you want most, then the next most wanted, and so on, until it is full. It is quick and needs no planning. It may not give the best suitcase, but sometimes it does.

## The idea

A *greedy algorithm* builds a solution one step at a time. At each step it makes the choice that looks best right now, and it never goes back to change it. It works when a locally best choice always fits in some best overall answer. When that is not true, a greedy algorithm can give a poor answer.

## It works: choosing activities

You have a list of activities with start and end times. You want to do as many as you can, with no overlaps. The greedy rule is: *always take the activity that finishes earliest*, among those that start after the last one ended.

:::example Worked example
Activities as (start, end). The times are made up, and the result was worked out by a script.

(1, 3), (2, 5), (4, 7), (6, 9), (8, 10), (9, 12), (11, 14)

The greedy rule picks (1, 3), then (4, 7) because 4 is after 3, then (8, 10), then (11, 14). That is 4 activities, the most possible here.
:::

## It fails: making change

Giving change with the fewest coins. With coins of 25, 10, 5 and 1, greedy works. For 41 it gives 25 + 10 + 5 + 1, which is 4 coins, and no better answer exists.

But take coins of 1, 3 and 4, and an amount of 6. Greedy takes 4 first, then 1 and 1. That is 3 coins. The best is 3 + 3, which is 2 coins. The greedy choice, 4, looked best and ruined the result.

## How to know

A greedy algorithm needs a proof. A common one is an *exchange argument*: show that any best answer can be changed to include the greedy choice without getting worse. Without a proof, do not trust it.

## Why it matters

- **It is fast and simple.** Greedy algorithms are often a sort plus one pass.
- **Famous algorithms are greedy.** Prim's and Kruskal's spanning tree algorithms (next page) are greedy. So is Huffman coding, which shrinks files. The DEFLATE format used by zip and gzip uses it.
- **It teaches a habit.** Before you trust a quick rule, test it on a case that could break it. The coin example is one.

## Common mistakes

- **"Greedy always gives the best answer."** Only when it can be proved.
- **"Test a few cases and call it correct."** The counter-example is often a small, odd case.

## Check yourself

:::check
Q: What is the greedy rule for choosing activities?
A: Take the one that finishes earliest, among those that start after the last chosen one ended.
Q: With coins 1, 3 and 4, how many coins does greedy use for 6?
A: Three, as 4 + 1 + 1. The best is two, as 3 + 3.
Q: Name a greedy algorithm you have met.
A: Any of Kruskal's algorithm, Prim's algorithm or Huffman coding.
:::

:::deeper
**Huffman coding.** Common symbols get short codes and rare ones get long codes. The greedy step joins the two rarest symbols into one, again and again, to build the code tree.
:::
