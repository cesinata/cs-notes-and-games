---
title: Generics
summary: How type parameters let one class or method work with many types while the compiler checks them.
sources:
- Dev.java, Generics | https://dev.java/learn/language/fp/generics/
- The Java Language Specification, Java SE 21, chapter 4 (Types, Values, and Variables) | https://docs.oracle.com/javase/specs/jls/se21/html/jls-4.html
- The Java Language Specification, Java SE 21, chapter 8 (Classes) | https://docs.oracle.com/javase/specs/jls/se21/html/jls-8.html
- Eck, Introduction to Programming Using Java, version 9 (free online, link only) | https://math.hws.edu/javanotes/
check:
- A generic class has one or more type parameters, written in angle brackets | JLS section 8.1.2
- A generic method declares its own type parameter before the return type | JLS section 8.4.4
- A bound such as T extends Comparable<T> limits which types can be used | JLS section 4.4
- The compiler checks the types, so a Box<String> cannot hold an Integer | JLS section 4.5
- Generic type arguments must be reference types, so int becomes Integer | JLS section 4.5.1
- The example was run on Java 21 and Java 23 | this page's script run
---

You may want a box that holds a string today and a number tomorrow. Writing a new class for each would be wasteful. Generics solve this. This page shows how.

## Start with a labelled storage box

A storage box can hold anything. If you label it "books", you know what you will find. The label is a *type parameter*. The box is the same, and the label tells you and the compiler what it holds.

## The idea

- A class can take a **type parameter**, written in angle brackets: `Box<T>`. `T` stands for a type to be chosen later.
- `Box<String>` is a box of strings. The compiler stops you putting a number in it.
- A method can have its own type parameter: `static <T> T pick(T a, T b)`.
- A **bound** limits the choice: `T extends Comparable<T>` allows only types that can be compared with each other.
- Type arguments must be classes. For `int`, use `Integer`. Java converts automatically.

:::example Worked example
This program was run on Java 21 and Java 23.

```java
public class Generics {
    static class Box<T> {
        private T item;
        void set(T item) { this.item = item; }
        T get() { return item; }
    }

    static <T extends Comparable<T>> T larger(T a, T b) {
        return a.compareTo(b) >= 0 ? a : b;
    }

    public static void main(String[] args) {
        Box<String> b = new Box<>();
        b.set("hello");
        System.out.println(b.get().length() + " " + larger(3, 8) + " " + larger("pear", "apple"));
    }
}
```

Output:

```
5 8 pear
```

`Box<String>` holds a string, and `get()` gives back a `String` with no cast, so `.length()` works. `larger` works for any type that can be compared: it picks the bigger of 3 and 8, and the later in the alphabet of `"pear"` and `"apple"`.
:::

## Why it helps

Errors show up when you compile, not when the program is running. You also stop writing casts everywhere.

## Common mistakes

- **Writing `Box<int>`.** Use `Box<Integer>`.
- **Mixing types in one generic list.** The compiler will reject it, which is the point.

## Check yourself

:::check
Q: What does Box<String> tell the compiler?
A: The box holds strings, so it can reject anything else.
Q: What does T extends Comparable<T> do?
A: It limits T to types that can be compared with each other.
Q: Which type do you use for an int in a generic class?
A: Integer.
:::

:::deeper
**Type erasure.** The generic types are checked when you compile, then mostly removed. At run time, a `Box<String>` and a `Box<Integer>` are the same class.
:::
