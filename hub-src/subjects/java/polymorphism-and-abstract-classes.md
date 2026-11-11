---
title: Polymorphism and abstract classes
summary: How one variable can hold many kinds of object and still do the right thing, and how an abstract class sets the rules.
sources:
- Dev.java, Polymorphism | https://dev.java/learn/language/oop/inheritance/polymorphism/
- Dev.java, Abstract Methods and Classes | https://dev.java/learn/language/oop/inheritance/abstract-classes/
- The Java Language Specification, Java SE 21, chapter 5 (Conversions and Contexts) | https://docs.oracle.com/javase/specs/jls/se21/html/jls-5.html
- The Java Language Specification, Java SE 21, chapter 8 (Classes) | https://docs.oracle.com/javase/specs/jls/se21/html/jls-8.html
- The Java Language Specification, Java SE 21, chapter 10 (Arrays) | https://docs.oracle.com/javase/specs/jls/se21/html/jls-10.html
- The Java Language Specification, Java SE 21, chapter 15 (Expressions) | https://docs.oracle.com/javase/specs/jls/se21/html/jls-15.html
- Java SE 21 API, Formatter | https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/Formatter.html
- Eck, Introduction to Programming Using Java, version 9 (free online, link only) | https://math.hws.edu/javanotes/
check:
- Polymorphism means a call on a superclass-typed variable runs the method of the actual object | JLS section 15.12.4
- An abstract class cannot be instantiated and may have abstract methods without a body | JLS section 8.1.1.1
- A concrete subclass must implement every inherited abstract method | JLS section 8.1.1.1
- An array declared with a superclass type can hold subclass objects | JLS sections 10.5 and 5.2
- printf with %.2f prints a number to two decimal places | Java SE 21 API, Formatter
- The example was run on Java 21 and Java 23 | this page's script run
---

Inheritance gives a family of classes. Polymorphism lets code treat them as one family and still get the right behaviour for each. This page shows how, and how an abstract class sets the rules.

## Start with a remote control

A universal remote has one "play" button. It works for the TV, the speaker and the projector. Each device does the right thing when it is told to play. The remote does not need to know which is which.

## Polymorphism

A variable of a superclass type can refer to an object of any subclass. When you call a method on it, Java runs the version that belongs to the *actual* object. The word *polymorphism* means "many forms".

## Abstract classes

Sometimes a superclass is too general to make objects from. What is the area of a "shape"? You cannot say. An *abstract class* is a class you cannot build objects from. It can declare *abstract methods*, which have no body. Each concrete subclass must fill them in.

:::example Worked example
This program was run on Java 21 and Java 23.

```java
public class Shapes {
    abstract static class Shape { abstract double area(); }
    static class Circle extends Shape {
        double r;
        Circle(double r) { this.r = r; }
        double area() { return Math.PI * r * r; }
    }
    static class Rect extends Shape {
        double w, h;
        Rect(double w, double h) { this.w = w; this.h = h; }
        double area() { return w * h; }
    }
    public static void main(String[] args) {
        Shape[] shapes = { new Circle(2), new Rect(3, 4) };
        for (Shape s : shapes) System.out.printf("%.2f%n", s.area());
    }
}
```

Output:

```
12.57
12.00
```

`Shape` declares `area()` without a body. `Circle` and `Rect` each provide one. The array is of type `Shape`, so one loop works for both. A circle of radius 2 has an area of about 12.57. A 3 by 4 rectangle has an area of 12.00.
:::

## Common mistakes

- **Trying `new Shape()`.** An abstract class cannot be built.
- **Thinking the variable's type chooses the method.** The object's real type chooses it.

## Check yourself

:::check
Q: Can you create an object from an abstract class?
A: No.
Q: If a Shape variable holds a Circle, whose area method runs?
A: The Circle's.
Q: What must a concrete subclass do with an abstract method?
A: Provide a body for it.
:::

:::deeper
**Casting.** To use something only the subclass has, you can cast with `(Circle) s`. Check with `instanceof` first, or Java may throw an error.
:::
