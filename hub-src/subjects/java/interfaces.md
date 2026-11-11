---
title: Interfaces
summary: How an interface lists what a class can do, without saying how, and why a class can have many.
sources:
- Dev.java, Defining an Interface | https://dev.java/learn/language/oop/interfaces/defining-interfaces/
- Dev.java, Using an Interface as a Type | https://dev.java/learn/language/oop/interfaces/interfaces-as-a-type/
- The Java Language Specification, Java SE 21, chapter 4 (Types, Values, and Variables) | https://docs.oracle.com/javase/specs/jls/se21/html/jls-4.html
- The Java Language Specification, Java SE 21, chapter 5 (Conversions and Contexts) | https://docs.oracle.com/javase/specs/jls/se21/html/jls-5.html
- The Java Language Specification, Java SE 21, chapter 8 (Classes) | https://docs.oracle.com/javase/specs/jls/se21/html/jls-8.html
- The Java Language Specification, Java SE 21, chapter 9 (Interfaces) | https://docs.oracle.com/javase/specs/jls/se21/html/jls-9.html
- Eck, Introduction to Programming Using Java, version 9 (free online, link only) | https://math.hws.edu/javanotes/
check:
- An interface declares methods that implementing classes must provide | JLS chapter 9
- A class can implement several interfaces but extends only one class | JLS section 8.1.5 and 8.1.4
- Interface methods are public, and implementing methods must be declared public | JLS section 9.4 and 8.4.8.3
- An interface can provide default methods with a body | JLS section 9.4.3
- A variable of an interface type can hold any object of an implementing class | JLS sections 5.2 and 4.10.2
- The example was run on Java 21 and Java 23 | this page's script run
---

An abstract class can hold some code. An interface is mostly a promise: "any class that implements me can do these things". This page shows how to use one.

## Start with a plug socket

A socket does not care what you plug in, as long as the plug fits. A kettle, a lamp and a phone charger all fit. The *interface* is the shape of the socket. Each device is a class that fits it.

## The idea

- An `interface` lists methods, with no body.
- A class that `implements` the interface must provide every method.
- A class can implement **many** interfaces, although it can extend only one class.
- Code can then work with the interface type, and not care which class is behind it.
- An interface can also have *default methods*, which come with a body.

:::example Worked example
Two ways of paying people, both seen as `Payable`. This program was run on Java 21 and Java 23.

```java
public class Pay {
    interface Payable { double amount(); }
    static class Salary implements Payable {
        public double amount() { return 5000; }
    }
    static class Hourly implements Payable {
        double rate = 40, hours = 12.5;
        public double amount() { return rate * hours; }
    }
    public static void main(String[] args) {
        Payable[] list = { new Salary(), new Hourly() };
        double total = 0;
        for (Payable p : list) total += p.amount();
        System.out.println("Total: " + total);
    }
}
```

Output:

```
Total: 5500.0
```

The loop does not know whether it has a salary or an hourly worker. It just calls `amount()`. 5000 plus 40 × 12.5 (which is 500) gives 5500.0.
:::

## Interface or abstract class?

Use an interface to say what something can do, especially across unrelated classes. Use an abstract class to share code among related classes.

## Common mistakes

- **Forgetting `public`.** The methods you write to implement an interface must be public.
- **Expecting an interface to hold fields that change.** Fields in an interface are constants.

## Check yourself

:::check
Q: How many interfaces can a class implement?
A: As many as it needs.
Q: Can you build an object from an interface?
A: No. You build an object of a class that implements it.
Q: What is a default method?
A: An interface method that comes with a body.
:::

:::deeper
**Comparable.** Java's own `Comparable` interface lets a class say how its objects are ordered. Sorting methods use it.
:::
