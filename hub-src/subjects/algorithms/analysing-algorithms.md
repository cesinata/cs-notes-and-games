---
title: Analysing algorithms
summary: How to describe how an algorithm's work grows with the size of its input, using growth rates and Big-O.
practise:
- algo/0.2 | Growth Race
- algo/0.3 | Counting Steps
sources:
- Erickson, Algorithms (2019), CC BY 4.0, chapter 0 (Introduction) | https://jeffe.cs.illinois.edu/teaching/algorithms/book/00-intro.pdf
- Wikipedia, Big O notation | https://en.wikipedia.org/wiki/Big_O_notation
check:
- Analysis describes how the number of steps grows as the input size n grows | Erickson, chapter 0
- Big-O notation gives an upper bound on growth and ignores constant factors | Wikipedia, Big O notation
- Common growth rates in increasing order are log n, n, n log n, n squared and 2 to the power n | Wikipedia, Big O notation
- Binary search on 1,000,000 sorted items needs at most 20 comparisons | arithmetic, checked by the script run
- 2 to the power 100 has 31 digits | arithmetic, checked by the script run
---

Two algorithms can solve the same problem, and one can be a million times slower. To see this coming, we describe how an algorithm's work *grows* as its input grows. This page shows how.

## Start with a phone book

To find a name in an unsorted pile, you may have to check every page. In a sorted phone book you open the middle and halve the search each time. The pile takes work in proportion to its size. The book takes far less. The difference grows as the book gets bigger.

## Growth rates

Let *n* be the size of the input. We ask: how does the number of steps grow with n? The usual answers, from slowest growth to fastest:

| Growth | Name |
|---|---|
| log n | logarithmic |
| n | linear |
| n log n | linearithmic |
| n squared | quadratic |
| 2 to the power n | exponential |

## Big-O

*Big-O notation* describes an upper bound on growth and ignores constant factors. If an algorithm takes 3n + 10 steps, we say it is O(n). The 3 and the 10 do not change the shape of the growth.

:::example Worked example
Work for different growth rates. These values were computed by a script. The n log n column uses log base 2, rounded.

| n | n log n | n squared | 2 to the power n |
|---|---|---|---|
| 10 | 33 | 100 | 1,024 |
| 100 | 664 | 10,000 | 1,267,650,600,228,229,401,496,703,205,376 |
| 1,000 | 9,966 | 1,000,000 | far too many to write |

The last column for n = 100 has 31 digits. No computer could do that many steps.

For a sorted list of 1,000,000 items, a linear search may need up to 1,000,000 comparisons. Binary search halves the list each time, so it needs at most 20.
:::

## Best, worst and average

The work can depend on the input. *Worst case* is the most work for any input of size n. We usually quote the worst case, because it is a promise that always holds.

## Common mistakes

- **"O(n) means exactly n steps."** It means the growth is at most proportional to n.
- **"A faster computer fixes a slow algorithm."** A faster machine only changes the constant. It cannot fix exponential growth.

## Check yourself

:::check
Q: Which grows faster, n squared or n log n?
A: n squared.
Q: An algorithm takes 5n + 20 steps. What is its Big-O?
A: O(n).
Q: Why is the worst case often quoted?
A: It is a guarantee. No input can make the algorithm do more work.
:::

:::deeper
**Other bounds.** Big-O is an upper bound. Big-Omega is a lower bound, and Big-Theta says both match.
:::
