---
title: Data types and console input and output
summary: The basic kinds of value in Java, how to read input and print output, and two traps with numbers.
practise:
- java/0.2 | Labelled Boxes
sources:
- Dev.java, Primitive Types | https://dev.java/learn/language/constructs/basics/primitive-types/
- The Java Language Specification, Java SE 21, chapter 4 (Types, Values, and Variables) | https://docs.oracle.com/javase/specs/jls/se21/html/jls-4.html
- The Java Language Specification, Java SE 21, chapter 15 (Expressions) | https://docs.oracle.com/javase/specs/jls/se21/html/jls-15.html
- Java SE 21 API, Scanner | https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/Scanner.html
check:
- Java has primitive types such as int, double, boolean and char, and String is a class | JLS chapter 4
- An int is a 32-bit whole number from -2,147,483,648 to 2,147,483,647 | JLS section 4.2.1
- Dividing one int by another gives a whole number, dropping the remainder | JLS section 15.17.2
- Adding 1 to Integer.MAX_VALUE wraps round to a negative number | JLS section 15.18.2 ("the low-order bits of the mathematical sum"; 4.2.2 adds that integer operators "do not indicate overflow")
- Scanner can read numbers and words from System.in | Java SE 21 API, Scanner
- The example was run on Java 21 and Java 23 with the input 7 4 | this page's script run
---

A program needs to keep values and to talk to the person using it. This page covers the kinds of value Java has, and how to read and print them.

## Start with labelled boxes

Think of a shelf of boxes. Each box has a label and holds one kind of thing: a whole number, a number with decimals, a yes or no. A *variable* is a labelled box in the computer's memory. Its *type* says what kind of value it can hold.

## The types

| Type | Holds | Example |
|---|---|---|
| `int` | whole numbers | `42` |
| `double` | numbers with decimals | `3.14` |
| `boolean` | true or false | `true` |
| `char` | one character | `'A'` |
| `String` | text | `"hello"` |

The first four are *primitive* types. `String` is a class, so a string is an object.

An `int` takes 32 bits. It can hold from -2,147,483,648 up to 2,147,483,647.

## Input and output

`System.out.println(...)` prints. A `Scanner` reads what a person types. `new Scanner(System.in)` reads from the keyboard, and `nextInt()` reads a whole number.

:::example Worked example
This program was run on Java 21 and Java 23, and the person typed `7 4`.

```java
import java.util.Scanner;

public class Average {
    public static void main(String[] args) {
        Scanner in = new Scanner(System.in);
        int a = in.nextInt();
        int b = in.nextInt();
        System.out.println("Sum: " + (a + b));
        System.out.println("Average: " + (a + b) / 2.0);
        System.out.println("Integer division: " + 7 / 2);
        System.out.println("Overflow: " + (Integer.MAX_VALUE + 1));
    }
}
```

Output:

```
Sum: 11
Average: 5.5
Integer division: 3
Overflow: -2147483648
```

- The sum is 11, and the average is 5.5. Dividing by `2.0` (a double) keeps the decimals.
- `7 / 2` is 3, not 3.5. When both sides are whole numbers, Java drops the remainder.
- `Integer.MAX_VALUE + 1` wraps round to a very large negative number. An `int` has no room for one more.
:::

## Common mistakes

- **Expecting 3.5 from `7 / 2`.** Use `7 / 2.0`, or make one side a `double`.
- **Forgetting an `int` can overflow.** The result wraps, and no error appears.

## Check yourself

:::check
Q: What is 9 / 2 in Java when both are ints?
A: 4, because the remainder is dropped.
Q: Which type holds true or false?
A: boolean.
Q: What does new Scanner(System.in) let a program do?
A: Read what the person types on the keyboard.
:::

:::deeper
**Other whole-number types.** Java also has `byte`, `short` and `long`. A `long` takes 64 bits, so it holds far larger numbers.
:::
