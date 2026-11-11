---
title: Operators
summary: The symbols that calculate, compare and combine values, the order they run in, and the difference between == and equals.
sources:
- Dev.java, Using Operators | https://dev.java/learn/language/constructs/basics/using-operators/
- Dev.java, Summary of Operators | https://dev.java/learn/language/constructs/basics/all-operators/
- The Java Language Specification, Java SE 21, chapter 15 (Expressions) | https://docs.oracle.com/javase/specs/jls/se21/html/jls-15.html
- Java SE 21 API, String | https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/lang/String.html
check:
- Multiplication happens before addition unless brackets say otherwise | JLS section 15.7.3 and Dev.java, Using Operators (precedence table)
- i++ gives the old value, then adds one | JLS section 15.14.2
- && is true only when both sides are true, and it skips the right side when the left is false | JLS section 15.23
- == on objects compares whether they are the same object, and equals compares contents for String | Java SE 21 API, String and JLS section 15.21.3
- new String("hi") creates a new object each time | Java SE 21 API, String
- The example was run on Java 21 and Java 23 | this page's script run
---

Operators are the symbols that do the work in an expression. This page covers the ones you use most, and one that catches almost everyone out.

## Start with a calculator

A calculator has plus, minus, times and divide. Java has those, and also ways to compare values and to combine yes or no answers.

## The main groups

- **Arithmetic:** `+  -  *  /  %`. The `%` gives the remainder, so `7 % 2` is 1.
- **Comparison:** `==  !=  <  >  <=  >=`. They give true or false.
- **Logical:** `&&` (and), `||` (or), `!` (not). `&&` stops early. If the left side is false, it does not look at the right.
- **Assignment:** `=` stores a value. `x += 5` means `x = x + 5`.
- **Increase and decrease:** `i++` gives the current value and then adds 1.

Multiplication and division happen before addition and subtraction. Brackets come first.

:::example Worked example
This program was run on Java 21 and Java 23.

```java
public class Operators {
    public static void main(String[] args) {
        int x = 2 + 3 * 4;
        int y = (2 + 3) * 4;
        int i = 5;
        int j = i++;
        boolean ok = (i > 3) && (i < 10);
        String a = new String("hi"), b = new String("hi");
        System.out.println(x + " " + y + " " + i + " " + j + " " + ok);
        System.out.println((a == b) + " " + a.equals(b));
    }
}
```

Output:

```
14 20 6 5 true
false true
```

- `2 + 3 * 4` is 14, and `(2 + 3) * 4` is 20.
- `j = i++` stores the old value 5 in `j`, then `i` becomes 6.
- `a == b` is false. It asks whether `a` and `b` are the same object, and `new String` made two. `a.equals(b)` is true, because the text is the same.
:::

## Common mistakes

- **Using `==` to compare text.** Use `equals`. Use `==` for numbers and other primitive values.
- **Using `=` instead of `==`.** One stores a value. The other compares.

## Check yourself

:::check
Q: What is 17 % 5?
A: 2, the remainder when 17 is divided by 5.
Q: What does && do when its left side is false?
A: The whole expression is false, and the right side is not checked.
Q: How do you compare the text of two Strings?
A: With equals.
:::

:::deeper
**Short-circuit as a guard.** Because `&&` stops early, `x != 0 && 10 / x > 2` never divides by zero.
:::
