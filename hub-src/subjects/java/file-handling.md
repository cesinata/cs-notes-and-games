---
title: File handling
summary: How a program reads from and writes to files, and why try-with-resources closes them for you.
sources:
- Dev.java, Common I/O Tasks in Modern Java | https://dev.java/learn/api/io/modernio/
- Java SE 21 API, Files | https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/nio/file/Files.html
- Java SE 21 API, Path | https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/nio/file/Path.html
- Java SE 21 API, IOException | https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/io/IOException.html
- The Java Language Specification, Java SE 21, chapter 11 (Exceptions) | https://docs.oracle.com/javase/specs/jls/se21/html/jls-11.html
- The Java Language Specification, Java SE 21, chapter 14 (Blocks, Statements, and Patterns) | https://docs.oracle.com/javase/specs/jls/se21/html/jls-14.html
- Eck, Introduction to Programming Using Java, version 9 (free online, link only) | https://math.hws.edu/javanotes/
check:
- Files.writeString writes text to a file and Files.readAllLines reads its lines | Java SE 21 API, Files
- Path.of creates a path to a file | Java SE 21 API, Path
- try-with-resources closes a resource automatically when the block ends | JLS section 14.20.3
- File operations can throw IOException, which is a checked exception | Java SE 21 API, IOException (it extends Exception) and JLS section 11.1.1
- A relative path is found from the folder the program runs in | Java SE 21 API, Path (an example there says "relative to the current working directory")
- The example was run on Java 21 and Java 23 | this page's script run
---

Variables vanish when a program ends. A file keeps data after it stops. This page shows how to write a text file and read it back.

## Start with a notebook

You write notes in a notebook. Later you open it and read them. If you leave it open, the pages can get damaged, so you close it when you finish. A file works the same way.

## The tools

- A `Path` names a file, such as `Path.of("notes.txt")`. A name with no folder is *relative* to the folder the program runs in.
- `Files.writeString(path, text)` writes text to a file.
- `Files.readAllLines(path)` reads every line into a list.
- For a large file, read line by line with a `BufferedReader`.
- Anything that holds a file open must be closed. A `try (...) { }` block, called *try-with-resources*, closes it for you at the end.
- File operations can fail, for example when a file is missing. They throw an `IOException`, which Java makes you catch or declare.

:::example Worked example
This program was run on Java 21 and Java 23. It writes three lines and reads them back.

```java
import java.nio.file.*;
import java.util.List;

public class Files1 {
    public static void main(String[] args) throws Exception {
        Path p = Path.of("notes.txt");
        Files.writeString(p, "alpha\nbeta\ngamma\n");
        List<String> lines = Files.readAllLines(p);
        System.out.println(lines.size() + " lines, first: " + lines.get(0));
        try (var in = Files.newBufferedReader(p)) {
            System.out.println(in.readLine());
        }
    }
}
```

Output:

```
3 lines, first: alpha
alpha
```

The file has three lines, and the first is `alpha`. The second read, with a `BufferedReader` in a try-with-resources block, gives the first line again.
:::

## Common mistakes

- **Forgetting the file closes.** Use try-with-resources.
- **Assuming the file exists.** Handle the missing-file case.

## Check yourself

:::check
Q: What does Files.readAllLines return?
A: A list with one string for each line of the file.
Q: Why use try-with-resources?
A: It closes the file for you, even if something goes wrong.
Q: What kind of exception can file methods throw?
A: IOException.
:::

:::deeper
**Binary files and streams.** Text files are read as characters. Other files, such as images, are read as bytes using streams.
:::
