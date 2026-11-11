---
title: Recursion
summary: How a problem can be solved by solving smaller copies of itself, with factorials, Fibonacci numbers and the Tower of Hanoi.
sources:
- Erickson, Algorithms (2019), CC BY 4.0, chapter 1 (Recursion) | https://jeffe.cs.illinois.edu/teaching/algorithms/book/01-recursion.pdf
- Wikipedia, Tower of Hanoi | https://en.wikipedia.org/wiki/Tower_of_Hanoi
check:
- A recursive algorithm solves a problem by solving smaller instances of the same problem | Erickson, chapter 1
- A recursive algorithm needs a base case that stops the recursion | Erickson, chapter 1
- The Tower of Hanoi with n disks needs 2 to the power n minus 1 moves | Erickson, chapter 1 and Wikipedia, Tower of Hanoi
- The naive recursive Fibonacci method makes 15 calls for fib(5) | arithmetic, checked by the script run
- The factorial of 5 is 120 | arithmetic
---

Some problems contain smaller copies of themselves. Recursion is a way to solve such a problem by using the same method on the smaller copies. This page shows how it works, and how it can go wrong.

## Start with Russian dolls

To find the smallest doll, open the biggest. Inside is a smaller doll with the same job: find the smallest doll inside it. You repeat until you open one with nothing inside. That one is your answer.

## The idea

A *recursive* algorithm has two parts:

- **Base case:** the smallest case, which has a direct answer. It stops the recursion.
- **Recursive case:** reduce the problem to a smaller one of the same kind, solve that, and use the result.

Factorial is the usual first example. The factorial of 5 is 5 × 4 × 3 × 2 × 1 = 120. In recursive form: the factorial of 0 is 1, and the factorial of n is n times the factorial of (n − 1).

## When recursion repeats work

The Fibonacci numbers: fib(0) = 1, fib(1) = 1, and fib(n) = fib(n − 1) + fib(n − 2). A naive recursive method calls itself twice each time, and it recomputes the same values again and again.

:::example Worked example
The number of function calls the naive method makes. These counts were computed by a script.

| n | Calls to compute fib(n) |
|---|---|
| 2 | 3 |
| 3 | 5 |
| 4 | 9 |
| 5 | 15 |
| 6 | 25 |
| 7 | 41 |

The count grows very fast, because the same smaller values are worked out many times. Dynamic programming, in a later page, fixes this by saving results.
:::

## The Tower of Hanoi

A puzzle: move n disks from one peg to another, one at a time, never putting a bigger disk on a smaller one. The recursive idea is to move the top n − 1 disks to the spare peg, move the biggest, then move the n − 1 disks on top of it. The number of moves is 2 to the power n minus 1. For 3 disks that is 7. For 10 disks it is 1,023.

## Common mistakes

- **No base case.** The method calls itself forever, until the program runs out of memory.
- **Not making the problem smaller.** Each call must move towards the base case.

## Check yourself

:::check
Q: What is the base case in the factorial definition?
A: The factorial of 0 is 1.
Q: How many moves does the Tower of Hanoi need for 4 disks?
A: 2 to the power 4, minus 1, which is 15.
Q: Why is naive recursive Fibonacci slow?
A: It works out the same smaller values many times over.
:::

:::deeper
**The call stack.** Each active call is kept in memory on a *stack*. A very deep recursion can fill it and cause an error called a stack overflow.
:::
