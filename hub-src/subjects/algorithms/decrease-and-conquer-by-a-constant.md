---
title: Decrease and conquer by a constant
summary: Solving a problem by reducing it by one step at a time, shown with insertion sort and ordering tasks by their dependencies.
practise:
- algo/2.3 | Recipe Order
sources:
- Wikipedia, Insertion sort | https://en.wikipedia.org/wiki/Insertion_sort
- Erickson, Algorithms (2019), CC BY 4.0, chapter 6 (Depth-First Search), topological sort | https://jeffe.cs.illinois.edu/teaching/algorithms/book/06-dfs.pdf
check:
- Decrease and conquer reduces a problem to a smaller instance, solves that, and extends the answer | Wikipedia, Insertion sort and Erickson, chapter 1
- Insertion sort builds a sorted list by inserting one item at a time into its place | Wikipedia, Insertion sort
- A topological order lists the vertices of a directed acyclic graph so that every edge points forwards | Erickson, chapter 6
- A topological order exists only if the directed graph has no cycle | Erickson, chapter 6
- The insertion sort example takes 8 comparisons | arithmetic, checked by the script run
---

Some problems get easier if you solve them for one fewer item, and then deal with the last item. This page shows two examples of that "decrease by one" idea.

## Start with sorting playing cards

You hold a sorted hand and pick up a new card. You slide it into the right place. Then you pick up the next. At each step the hand stays sorted. That is how many people sort cards.

## The idea

*Decrease and conquer* means: reduce the problem to a smaller instance, solve that, then extend the answer to the full problem. When the reduction is by a constant, such as one item, the problem shrinks a little each time.

## Insertion sort

Treat the first item as a sorted list of 1. Take the next item, and insert it into its place in the sorted part by moving larger items to the right. Repeat for every item.

:::example Worked example
Sort 29, 10, 14, 37, 13. These steps were worked out by a script.

| After inserting | The list |
|---|---|
| 10 | 10, 29, 14, 37, 13 |
| 14 | 10, 14, 29, 37, 13 |
| 37 | 10, 14, 29, 37, 13 |
| 13 | 10, 13, 14, 29, 37 |

It made 8 comparisons. Insertion sort is quick on a list that is nearly sorted, because most items stay where they are.
:::

## Ordering tasks

A *dependency graph* has an arrow from task A to task B if A must be done first. A *topological order* is a list of all tasks in which every arrow points forwards. One exists only if the graph has no cycles.

One method: repeatedly pick a task with nothing left that it waits for, add it to the list, and remove it from the graph. This is decrease and conquer by one task.

:::example Worked example
Getting dressed. The dependencies are: shirt before tie, tie before jacket, trousers before shoes, trousers before belt, belt before jacket, socks before shoes. Picking the first available task in alphabetical order each time gives, from the script:

shirt, socks, tie, trousers, belt, jacket, shoes

Every dependency is respected. Other valid orders exist.
:::

## Common mistakes

- **"There is only one right order."** There can be many valid topological orders.
- **"Insertion sort is always slow."** It is fast on nearly sorted input.

## Check yourself

:::check
Q: What does insertion sort do with each new item?
A: It inserts it into its correct place among the items already sorted.
Q: When is there no topological order?
A: When the dependency graph has a cycle.
Q: What does decrease and conquer by a constant mean?
A: Reducing the problem by a fixed amount, such as one item, each step.
:::

:::deeper
**Worst case.** On a reversed list, every item moves all the way to the front. The work then grows like n squared.
:::
