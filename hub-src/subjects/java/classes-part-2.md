---
title: Classes, part 2
summary: Constructors, private fields, static members and toString, and why hiding data is a good habit.
practise:
- java/3.2 | The Front Door
sources:
- Dev.java, Defining Constructors | https://dev.java/learn/language/oop/classes-objects/defining-constructors/
- Dev.java, More on Classes | https://dev.java/learn/language/oop/classes-objects/more-on-classes/
- The Java Language Specification, Java SE 21, chapter 6 (Names) | https://docs.oracle.com/javase/specs/jls/se21/html/jls-6.html
- The Java Language Specification, Java SE 21, chapter 8 (Classes) | https://docs.oracle.com/javase/specs/jls/se21/html/jls-8.html
- The Java Language Specification, Java SE 21, chapter 15 (Expressions) | https://docs.oracle.com/javase/specs/jls/se21/html/jls-15.html
- Java SE 21 API, Object | https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/lang/Object.html
- Eck, Introduction to Programming Using Java, version 9 (free online, link only) | https://math.hws.edu/javanotes/
check:
- A constructor has the same name as the class and runs when an object is built | JLS section 8.8
- this(...) calls another constructor in the same class | JLS section 8.8.7.1
- A private field can only be used inside its own class | JLS section 6.6
- A static field belongs to the class and is shared by all objects | JLS section 8.3.1.1
- toString supplies the text used when an object is printed or joined to a string | Java SE 21 API, Object.toString and JLS section 15.18.1 (string concatenation)
- The example was run on Java 21 and Java 23 | this page's script run
---

The first classes page showed fields and methods. This page adds the tools that make classes safe and tidy.

## Start with a vending machine

A vending machine has buttons and a slot. You cannot reach the stock inside. You use the buttons, and the machine decides what to do. A well-made class works like that.

## The tools

- **Constructors.** A constructor has the class's name and no return type. It runs when you use `new`, and sets up the object. You can write several with different inputs. This is *overloading*. `this(0, 0)` calls another constructor.
- **Private fields.** Marking a field `private` means only the class itself can use it. Other code uses *getter* methods. This idea is *encapsulation*.
- **Static members.** A `static` field or method belongs to the class, not to one object. Every object shares one `static` field.
- **`toString`.** This method says how an object is turned into text.

:::example Worked example
A point with two ways to build it, private fields and a count of points made. This program was run on Java 21 and Java 23.

```java
public class Point {
    private final int x, y;
    private static int count = 0;

    public Point() { this(0, 0); }
    public Point(int x, int y) { this.x = x; this.y = y; count++; }
    public int getX() { return x; }
    public static int getCount() { return count; }
    @Override public String toString() { return "(" + x + ", " + y + ")"; }

    public static void main(String[] args) {
        Point p = new Point(3, 4), q = new Point();
        System.out.println(p + " " + q + " " + p.getX() + " " + Point.getCount());
    }
}
```

Output:

```
(3, 4) (0, 0) 3 2
```

- `new Point(3, 4)` and `new Point()` use different constructors. The second passes `(0, 0)`.
- `count` is shared, so after two points it is 2.
- Joining `p` to a string calls `toString`, which gives `(3, 4)`.
:::

## Common mistakes

- **Making every field public.** Other code can then put the object in a bad state.
- **Calling a `static` method on an object and expecting it to use that object's fields.** A `static` method has no object.

## Check yourself

:::check
Q: What does a private field stop?
A: Code outside the class from using it directly.
Q: Does each object get its own copy of a static field?
A: No. All objects share one copy.
Q: What is overloading a constructor?
A: Writing several constructors that take different inputs.
:::

:::deeper
**Immutable objects.** A class whose fields are `final` and have no setters cannot change after it is built. This makes objects simpler to reason about.
:::
