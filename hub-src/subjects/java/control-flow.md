---
title: Control flow
summary: How a program chooses between paths with if and switch, and repeats steps with loops.
practise:
- java/1.1 | Pick a Path
- java/1.2 | Round and Round
sources:
- Dev.java, Controlling the Flow of Your Programs | https://dev.java/learn/language/constructs/basics/controlling-flow/
- The Java Language Specification, Java SE 21, chapter 14 (Blocks, Statements, and Patterns) | https://docs.oracle.com/javase/specs/jls/se21/html/jls-14.html
- Eck, Introduction to Programming Using Java, version 9 (free online, link only) | https://math.hws.edu/javanotes/
check:
- if runs a block only when its condition is true, and else runs otherwise | JLS section 14.9
- A for loop has an initialiser, a condition and an update | JLS section 14.14.1
- A while loop repeats while its condition is true | JLS section 14.12
- continue skips the rest of the current pass, and break leaves the loop | JLS sections 14.16 and 14.15
- The sum of the odd numbers from 1 to 10 is 25 | arithmetic, checked by the script run
- The example was run on Java 21 and Java 23 | this page's script run
---

A program that only runs top to bottom is not much use. Control flow lets it choose, and repeat. This page covers the main tools.

## Start with a to-do list

"If it is raining, take an umbrella." That is a choice. "Wash plates until the sink is empty." That is a loop.

## Choosing

- `if (condition) { ... } else { ... }` runs one block or the other.
- `switch` picks between many fixed values.

## Repeating

- `for (int n = 1; n <= 10; n++) { ... }` repeats a set number of times. It has a start, a test and a step.
- `while (condition) { ... }` repeats as long as the test is true. If the test is false at the start, it never runs.
- `break` leaves a loop early. `continue` skips to the next pass.

:::example Worked example
This program was run on Java 21 and Java 23.

```java
public class Loops {
    public static void main(String[] args) {
        int sum = 0;
        for (int n = 1; n <= 10; n++) {
            if (n % 2 == 0) continue;
            sum += n;
        }
        System.out.println("Sum of odd numbers 1 to 10: " + sum);
        int k = 1;
        while (k < 100) k *= 3;
        System.out.println("First power of 3 over 100: " + k);
    }
}
```

Output:

```
Sum of odd numbers 1 to 10: 25
First power of 3 over 100: 243
```

The `for` loop skips even numbers with `continue`, and adds 1 + 3 + 5 + 7 + 9 = 25. The `while` loop multiplies by 3 until the value is 100 or more. The values are 1, 3, 9, 27, 81, then 243.
:::

## Common mistakes

- **A loop that never ends.** Check that something in the loop changes the test.
- **Off by one.** `n < 10` and `n <= 10` give different counts. Check the first and last value.

## Check yourself

:::check
Q: What does continue do inside a loop?
A: It skips the rest of that pass and goes to the next one.
Q: When does a while loop stop?
A: When its test becomes false.
Q: How many times does for (int n = 0; n < 5; n++) run?
A: 5 times, for n = 0, 1, 2, 3 and 4.
:::

:::deeper
**The enhanced for loop.** `for (int s : scores)` visits each item in an array or list in turn. The arrays page uses it.
:::
