---
title: Classes, part 1
summary: What a class and an object are, and how fields and methods work together.
practise:
- java/1.3 | Recipe Cards
- java/3.1 | Blueprint and House
sources:
- Dev.java, Objects, Classes, Interfaces, Packages, and Inheritance | https://dev.java/learn/language/oop/classes/
- Dev.java, Creating Objects | https://dev.java/learn/language/oop/classes-objects/creating-objects/
- The Java Language Specification, Java SE 21, chapter 4 (Types, Values, and Variables) | https://docs.oracle.com/javase/specs/jls/se21/html/jls-4.html
- The Java Language Specification, Java SE 21, chapter 8 (Classes) | https://docs.oracle.com/javase/specs/jls/se21/html/jls-8.html
- The Java Language Specification, Java SE 21, chapter 15 (Expressions) | https://docs.oracle.com/javase/specs/jls/se21/html/jls-15.html
- Eck, Introduction to Programming Using Java, version 9 (free online, link only) | https://math.hws.edu/javanotes/
check:
- A class is a blueprint, and an object is one thing built from it | Dev.java, What is a Class? and JLS chapter 8
- Fields hold an object's data and methods hold its actions | JLS sections 8.3 and 8.4
- new creates an object | JLS section 15.9 and Dev.java, Creating Objects
- Fields of type double start as 0.0 if not set | JLS section 4.12.5
- A method that returns boolean gives back true or false | JLS section 8.4.5
- The example was run on Java 21 and Java 23 | this page's script run
---

Programs get big quickly. Classes let you group data and the actions that use it. This page explains a class and an object, with one small example.

## Start with a cookie cutter

A cookie cutter is a shape. You press it into dough to make cookies. The cutter is the *class*. Each cookie is an *object*. All cookies from one cutter have the same shape, but each one is its own cookie.

## The idea

- A **class** describes what its objects hold and what they can do.
- **Fields** are variables inside an object. They hold its *data*.
- **Methods** are the actions an object can do.
- `new Account()` builds one object. Each object has its own copy of the fields.

:::example Worked example
An account that can take money in and out. This program was run on Java 21 and Java 23.

```java
public class Account {
    double balance;

    void deposit(double amount) { balance += amount; }

    boolean withdraw(double amount) {
        if (amount > balance) return false;
        balance -= amount;
        return true;
    }

    public static void main(String[] args) {
        Account a = new Account();
        a.deposit(100);
        System.out.println(a.withdraw(30) + " " + a.balance);
        System.out.println(a.withdraw(500) + " " + a.balance);
    }
}
```

Output:

```
true 70.0
false 70.0
```

- `balance` is a field. A new account starts with 0.0.
- `deposit` adds to it. `withdraw` checks there is enough first. It returns `true` if it worked, and `false` if not.
- After a 100 deposit and a 30 withdrawal, the balance is 70.0. The 500 withdrawal fails, so the balance stays 70.0.
:::

## Common mistakes

- **Mixing up class and object.** `Account` is the class. `a` is an object built from it.
- **Forgetting `new`.** Without it, you have a variable but no object.

## Check yourself

:::check
Q: What is a field?
A: A variable inside an object that holds its data.
Q: What does new do?
A: It builds a new object from a class.
Q: In the example, why does the second withdrawal return false?
A: The amount, 500, is more than the balance of 70.
:::

:::deeper
**References.** A variable that holds an object really holds a reference to it. Two variables can refer to the same object.
:::
