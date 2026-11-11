---
title: Inheritance
summary: How one class can build on another, reuse its code and change what it does.
sources:
- Dev.java, What Is Inheritance? | https://dev.java/learn/language/oop/inheritance/what-is-inheritance/
- Dev.java, Overriding and Hiding Methods | https://dev.java/learn/language/oop/inheritance/overriding/
- The Java Language Specification, Java SE 21, chapter 8 (Classes) | https://docs.oracle.com/javase/specs/jls/se21/html/jls-8.html
- The Java Language Specification, Java SE 21, chapter 9 (Interfaces) | https://docs.oracle.com/javase/specs/jls/se21/html/jls-9.html
- Eck, Introduction to Programming Using Java, version 9 (free online, link only) | https://math.hws.edu/javanotes/
check:
- A subclass extends a superclass and inherits its accessible fields and methods | JLS section 8.1.4 and 8.4.8
- super(...) calls the superclass constructor | JLS section 8.8.7.1
- A subclass can override a method, and @Override asks the compiler to check it | JLS section 8.4.8.1 and 9.6.4.4
- Every class extends Object, directly or indirectly | JLS section 8.1.4
- Java classes have one superclass | JLS section 8.1.4
- The example was run on Java 21 and Java 23 | this page's script run
---

Many things are special cases of something more general. A dog is an animal. Inheritance lets code say this. This page shows how a class builds on another.

## Start with a family recipe

A cake recipe says how to make a basic cake. A chocolate cake recipe says "make the basic cake, but add cocoa". It reuses the base and changes one part. A *subclass* does the same with a *superclass*.

## The idea

- `class Dog extends Animal` makes `Dog` a subclass of `Animal`. `Dog` gets the fields and methods of `Animal`.
- A subclass can *override* a method, which means giving it new behaviour. Write `@Override` above it, and the compiler checks that you really are overriding.
- `super(name)` runs the superclass's constructor. `super.speak()` calls the superclass's version of a method.
- A class can extend only one other class. Every class ends up extending `Object`, which is the root.

:::example Worked example
This program was run on Java 21 and Java 23.

```java
public class Zoo {
    static class Animal {
        String name;
        Animal(String name) { this.name = name; }
        String speak() { return name + " makes a sound"; }
    }
    static class Dog extends Animal {
        Dog(String name) { super(name); }
        @Override String speak() { return name + " barks"; }
    }
    public static void main(String[] args) {
        System.out.println(new Animal("Generic").speak());
        System.out.println(new Dog("Rex").speak());
    }
}
```

Output:

```
Generic makes a sound
Rex barks
```

`Dog` gets `name` from `Animal`, and replaces `speak`. A plain `Animal` makes a sound. A `Dog` barks.
:::

## Common mistakes

- **Using inheritance for "has a".** Use it for "is a". A dog is an animal. A car has an engine, so an engine is a field, not a parent.
- **Forgetting `super(...)`.** If the superclass needs inputs, the subclass has to pass them.

## Check yourself

:::check
Q: What does extends do?
A: It makes one class a subclass of another, so it inherits the other's fields and methods.
Q: What does @Override do?
A: It asks the compiler to check that the method really replaces one from the superclass.
Q: How many classes can a Java class extend?
A: One.
:::

:::deeper
**protected.** A `protected` member can be used by subclasses as well as by the class itself. It sits between `private` and `public`.
:::
