---
title: Arrays
summary: How an array stores a fixed number of values of one type, and how to loop over it safely.
practise:
- java/2.1 | Numbered Lockers
sources:
- Dev.java, Arrays | https://dev.java/learn/language/constructs/basics/arrays/
- The Java Language Specification, Java SE 21, chapter 10 (Arrays) | https://docs.oracle.com/javase/specs/jls/se21/html/jls-10.html
- Java SE 21 API, Arrays | https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/Arrays.html
check:
- An array holds a fixed number of values of one type | JLS chapter 10 ("its length never changes") and Dev.java, Arrays
- Array positions are counted from 0, and length gives the number of items | JLS section 10.7
- Using a position outside the array throws ArrayIndexOutOfBoundsException | JLS section 10.4
- An array of arrays can model a grid, and new int[2][3] makes 2 rows of 3 zeros | JLS section 10.3 (components start at their default value, 4.12.5)
- Arrays.toString and Arrays.deepToString turn arrays into text | Java SE 21 API, Arrays
- The example was run on Java 21 and Java 23, and the error message is from that version | this page's script run
---

Often you have many values of the same kind, such as the marks of a class. An array holds them under one name. This page shows how.

## Start with a row of lockers

A row of lockers is numbered. You can go straight to locker 3 without opening the others. An array is a row of numbered slots in memory.

## The idea

- An array has a fixed size. It cannot grow after you make it.
- All its values are the same type.
- Positions are numbered from **0**. An array of 4 has positions 0, 1, 2 and 3.
- `scores.length` gives the size, with no brackets.
- Asking for a position that does not exist causes an error: `ArrayIndexOutOfBoundsException`.

A *two-dimensional* array is an array of arrays, like a grid. `new int[2][3]` is 2 rows of 3, all starting at 0.

:::example Worked example
This program was run on Java 21 and Java 23.

```java
import java.util.Arrays;

public class Arrays1 {
    public static void main(String[] args) {
        int[] scores = {72, 85, 90, 64};
        int max = scores[0];
        for (int s : scores) if (s > max) max = s;
        System.out.println(Arrays.toString(scores) + " length " + scores.length + " max " + max);
        int[][] grid = new int[2][3];
        grid[1][2] = 7;
        System.out.println(Arrays.deepToString(grid));
        try { System.out.println(scores[4]); }
        catch (ArrayIndexOutOfBoundsException e) { System.out.println("Error: " + e.getMessage()); }
    }
}
```

Output:

```
[72, 85, 90, 64] length 4 max 90
[[0, 0, 0], [0, 0, 7]]
Error: Index 4 out of bounds for length 4
```

The loop finds the largest of the four scores, 90. The grid has 2 rows of 3, with one cell set to 7. `scores[4]` does not exist, so the program catches the error and prints its message.
:::

## Common mistakes

- **Using `length` as the last position.** An array of 4 ends at position 3.
- **Forgetting arrays do not grow.** For a collection that grows, use a list (see the collections page).

## Check yourself

:::check
Q: What is the position of the first item?
A: 0.
Q: An array has length 6. What is the last valid position?
A: 5.
Q: What happens if you ask for scores[4] in an array of 4?
A: Java throws an ArrayIndexOutOfBoundsException.
:::

:::deeper
**Arrays of objects.** An array of objects holds references. Each slot starts as `null` until you put an object there.
:::
