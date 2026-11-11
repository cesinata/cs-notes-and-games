---
title: Exception handling
summary: What happens when something goes wrong while a program runs, and how try, catch and finally deal with it.
sources:
- Dev.java, What Is an Exception? | https://dev.java/learn/language/annotations-exceptions/exceptions/what-is-an-exception/
- Dev.java, Catching and Handling Exceptions | https://dev.java/learn/language/annotations-exceptions/exceptions/catching-handling/
- The Java Language Specification, Java SE 21, chapter 11 (Exceptions) | https://docs.oracle.com/javase/specs/jls/se21/html/jls-11.html
- The Java Language Specification, Java SE 21, chapter 14 (Blocks, Statements, and Patterns) | https://docs.oracle.com/javase/specs/jls/se21/html/jls-14.html
- The Java Language Specification, Java SE 21, chapter 15 (Expressions) | https://docs.oracle.com/javase/specs/jls/se21/html/jls-15.html
- Java SE 21 API, Integer | https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/lang/Integer.html
- Eck, Introduction to Programming Using Java, version 9 (free online, link only) | https://math.hws.edu/javanotes/
check:
- An exception is an event that disrupts normal flow, and it can be caught with try and catch | Dev.java, What Is an Exception? and JLS chapter 11
- finally runs whether or not an exception happened | JLS section 14.20.2 and Dev.java, Catching and Handling Exceptions
- Integer.parseInt throws NumberFormatException for text that is not a number | Java SE 21 API, Integer
- Dividing an int by zero throws ArithmeticException with the message / by zero | JLS section 15.17.2 (the exception only; the message text "/ by zero" is not in the JLS, and comes from the program run)
- Checked exceptions must be caught or declared, and unchecked ones need not be | JLS section 11.1.1
- The example was run on Java 21 and Java 23 | this page's script run
---

Things go wrong: a file is missing, someone types text where a number was expected, a calculation divides by zero. An *exception* is Java's way of reporting this. This page shows how to deal with them.

## Start with a smoke alarm

A smoke alarm does not stop fires. It gives a clear signal so someone can respond. An exception is a signal that something went wrong. The program can catch it and respond, or it crashes with a message.

## try, catch and finally

- Put the risky code in a `try` block.
- A `catch` block runs if an exception of that kind happens.
- A `finally` block runs either way. It is good for tidying up.

Some exceptions are *checked*: the compiler makes you catch them or declare them with `throws`. Others are *unchecked*, such as dividing by zero. You can write `throw new SomeException("message")` to raise one yourself.

:::example Worked example
This program was run on Java 21 and Java 23.

```java
public class Safe {
    static int parse(String s) {
        try { return Integer.parseInt(s); }
        catch (NumberFormatException e) { System.out.println("Not a number: " + s); return -1; }
        finally { System.out.println("Checked " + s); }
    }
    public static void main(String[] args) {
        System.out.println(parse("42"));
        System.out.println(parse("4x2"));
        try { System.out.println(10 / args.length); }
        catch (ArithmeticException e) { System.out.println("Caught: " + e.getMessage()); }
    }
}
```

Output:

```
Checked 42
42
Not a number: 4x2
Checked 4x2
-1
Caught: / by zero
```

- `"42"` converts, so no exception happens. `finally` still prints.
- `"4x2"` is not a number, so `parseInt` throws a `NumberFormatException`. The catch prints a message and returns -1.
- `10 / args.length` has no arguments, so it divides by 0. The catch prints the message, which is `/ by zero`.
:::

## Common mistakes

- **An empty catch block.** It hides the problem. At least print a message.
- **Catching everything.** Catch the specific kind you can handle.

## Check yourself

:::check
Q: When does a finally block run?
A: Whether or not an exception happened.
Q: Which exception does parseInt throw for "abc"?
A: NumberFormatException.
Q: What does throws do in a method header?
A: It declares that the method might throw that kind of exception.
:::

:::deeper
**Custom exceptions.** You can make your own by extending `Exception` (checked) or `RuntimeException` (unchecked), so errors in your program have clear names.
:::
