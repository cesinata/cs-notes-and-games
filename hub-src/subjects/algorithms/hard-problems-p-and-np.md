---
title: Hard problems, P and NP
summary: Why some problems have no known fast solution, what P and NP mean, and what to do when you meet one.
sources:
- Erickson, Algorithms (2019), chapter 12, NP-Hardness (CC BY 4.0) | https://jeffe.cs.illinois.edu/teaching/algorithms/book/12-nphard.pdf
- Clay Mathematics Institute, P vs NP | https://www.claymath.org/millennium/p-vs-np/
- Clay Mathematics Institute, The Millennium Prize Problems | https://www.claymath.org/millennium-problems/
check:
- P is the set of decision problems that can be solved in polynomial time | Erickson, chapter 12 (page 3 of the chapter PDF, where P, NP and co-NP are defined)
- NP is the set of decision problems where a proposed answer can be checked in polynomial time | Erickson, chapter 12 (page 3 of the chapter PDF, where P, NP and co-NP are defined)
- A problem is NP-hard if it is at least as hard as every problem in NP | Erickson, chapter 12, section "NP-hard, NP-easy, and NP-complete"
- Nobody has proved whether P equals NP | Erickson, chapter 12 and Clay Mathematics Institute, P vs NP (marked "Unsolved")
- P vs NP is one of the Clay Millennium Prize Problems, with a prize of 1,000,000 US dollars | Clay Mathematics Institute, The Millennium Prize Problems ("$1 million allocated to the solution of each problem")
- Subset sum, graph colouring and Hamiltonian cycle are NP-hard | Erickson, chapter 12 (sections on Graph Coloring, Hamiltonian Cycle and Subset Sum)
- 2 to the power of 40 is 1,099,511,627,776 | arithmetic, checked by the script run
---

Some problems are easy to check and very hard to solve. This page explains the idea, in plain words, and why it matters when you design programs.

## Start with a jigsaw

A 1,000-piece jigsaw takes hours to solve. But if a friend says "it's done", you can check it in seconds: look at the picture and see if every piece fits. Solving is hard. Checking is easy. Many important problems are like this.

## The idea

- **P** is the set of decision problems (questions with a yes or no answer) that a computer can *solve* in a reasonable amount of time, meaning polynomial time. Deciding whether a list is already sorted is in P.
- **NP** is the set of decision problems where, if someone hands you a proposed answer, you can *check* it in a reasonable time. Every problem in P is also in NP.
- A problem is **NP-hard** if it is at least as hard as every problem in NP. If you could solve it fast, you could solve all of NP fast.
- **NP-complete** problems are those that are both in NP and NP-hard.

Nobody has proved whether P equals NP. Most experts think they do not, but it is unproved. It is one of the Clay Mathematics Institute's seven Millennium Prize Problems. The prize for solving it is 1,000,000 US dollars.

## An example: subset sum

*Subset sum:* given some numbers and a target, can you pick some of them that add to the target? Subset sum is NP-hard.

:::example Worked example
The numbers are 3, 34, 4, 12, 5 and 2. The target is 9. These results were worked out by a script.

**Checking** an answer is quick. Someone says "4 and 5". Add them: 4 + 5 = 9. Correct.

**Finding** an answer means trying subsets. With 6 numbers there are 2 to the power of 6, which is 64 subsets. The script found two that work: {4, 5} and {3, 4, 2}.

The trouble is how fast that number grows.

| Numbers | Subsets to try |
|---|---|
| 10 | 1,024 |
| 20 | 1,048,576 |
| 30 | 1,073,741,824 |
| 40 | 1,099,511,627,776 |

Each extra number doubles the work. At 40 numbers, trying every subset is over a trillion checks.
:::

Other NP-hard problems include graph colouring and finding a Hamiltonian cycle (a loop that visits every point once).

## Why it matters

- **It saves effort.** If you can show your problem is NP-hard, you know that no fast method that works for every input is known. You can stop searching for one.
- **It points to other options.** You can look for a good-enough answer instead of a perfect one, solve only small inputs, or use a special case that is easier.
- **It shapes real choices.** Delivery routes, timetables and packing problems belong to this family.
- **It is a large open question.** Whether P equals NP is one of the biggest unsolved problems in mathematics and computer science.

## Common mistakes

- **"NP means not polynomial."** It stands for nondeterministic polynomial time. NP problems can still be easy.
- **"NP-hard means impossible."** It means no fast method is known for all inputs. Small inputs can still be solved.

## Check yourself

:::check
Q: Which is easy for an NP problem: finding an answer or checking one?
A: Checking one.
Q: In the example, how many subsets are there for 6 numbers?
A: 64, which is 2 to the power of 6.
Q: Has anyone proved that P is different from NP?
A: No. It is an open question.
:::

:::deeper
**Reductions.** To show a new problem is NP-hard, you show that a known NP-hard problem can be turned into it. This turning-into is called a reduction. It is the main tool in the theory.
:::
