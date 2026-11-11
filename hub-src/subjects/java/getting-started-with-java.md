---
title: Getting started with Java
summary: What Java is, how a program goes from text to running, and the smallest complete program.
practise:
- java/0.1 | Hello, Workshop
sources:
- Dev.java, Getting Started with Java | https://dev.java/learn/first-steps/first-java-code/getting-started/
- JEP 330, Launch Single-File Source-Code Programs | https://openjdk.org/jeps/330
- The Java Language Specification, Java SE 21, chapter 1 (Introduction) | https://docs.oracle.com/javase/specs/jls/se21/html/jls-1.html
- The Java Language Specification, Java SE 21, chapter 12 (Execution) | https://docs.oracle.com/javase/specs/jls/se21/html/jls-12.html
- Java SE 21 API, PrintStream | https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/io/PrintStream.html
- Eck, Introduction to Programming Using Java, version 9 (free online, link only) | https://math.hws.edu/javanotes/
check:
- Java source code is compiled to bytecode, which the Java Virtual Machine runs | Dev.java, Getting Started with Java and JLS chapter 1
- The JDK includes the compiler (javac), and older versions also had a smaller JRE that only ran programs | Dev.java, Getting Started with Java (OpenJDK no longer distributes a separate JRE)
- Since Java 11 a single source file can be run directly with the java command | JEP 330
- A program starts in a method named main with the signature public static void main(String[] args) | JLS section 12.1.4 (it also allows String... args)
- System.out.println prints a line of text | Java SE 21 API, PrintStream
- The example was run on Java 21 and Java 23 | this page's script run
---

Every program starts as plain text. Java turns that text into something a computer can run. This page shows how, with the smallest complete program.

## Start with a recipe

A recipe is a list of steps written for a cook. A program is a list of steps written for a computer. The computer cannot read plain English, so the steps have to be in a language it understands. Java is one such language.

## From text to running

- You write *source code* in a file that ends in `.java`.
- A tool called the *compiler* (`javac`) checks it and turns it into *bytecode*, in a `.class` file.
- The *Java Virtual Machine* (JVM) runs the bytecode.

The *JDK* (Java Development Kit) has the compiler and the tools you need to write programs. Older versions also had a smaller package, the JRE, that could only run programs. Since Java 11 you can also run one source file straight away with `java Hello.java`. It compiles in memory first.

:::example Worked example
This program was run on Java 21 and Java 23.

```java
public class Hello {
    public static void main(String[] args) {
        System.out.println("Hello, world");
    }
}
```

Output:

```
Hello, world
```

- `public class Hello` starts a class. Every Java program lives in a class.
- `public static void main(String[] args)` is where the program starts. The JVM looks for a method with this name and shape.
- `System.out.println("Hello, world");` prints the text, then moves to a new line. Each statement ends with a semicolon.
:::

## Common mistakes

- **Missing semicolons or brackets.** The compiler stops and reports the line. Read the first error first.
- **Wrong capital letters.** Java cares about case. `Main` and `main` are different.

## Check yourself

:::check
Q: What does the compiler turn source code into?
A: Bytecode, in a .class file.
Q: Which method does a Java program start in?
A: main.
Q: What does System.out.println do?
A: It prints a line of text.
:::

:::deeper
**Why bytecode.** The same bytecode runs on any computer that has a JVM, whatever the operating system. The JVM turns it into instructions for that machine.
:::
