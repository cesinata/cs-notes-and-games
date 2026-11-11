---
title: Collections
summary: The ready-made lists, sets and maps in Java, and how to choose between them.
sources:
- Dev.java, The Collections Framework | https://dev.java/learn/api/collections-and-streams/collections-framework/intro/
- Java SE 21 API, Collection | https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/Collection.html
- Java SE 21 API, Map | https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/Map.html
- Java SE 21 API, List | https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/List.html
- Java SE 21 API, Set | https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/Set.html
- Java SE 21 API, TreeMap | https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/TreeMap.html
- Java SE 21 API, HashSet | https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/HashSet.html
check:
- A List keeps items in order and allows duplicates | Java SE 21 API, List
- A Set holds no duplicates | Java SE 21 API, Set
- A Map stores key and value pairs with unique keys | Java SE 21 API, Map
- A TreeMap keeps its keys in sorted order | Java SE 21 API, TreeMap
- A HashSet ignores a duplicate that is added | Java SE 21 API, HashSet
- Map.merge combines a new value with an existing one | Java SE 21 API, Map.merge
- The example was run on Java 21 and Java 23 | this page's script run
---

Arrays have a fixed size. Real programs need collections that grow and shrink. Java ships with a set of them. This page covers the three you will use most.

## Start with ways to keep things

A shopping list is in order and can repeat items. A bag of unique badges has no repeats. A phone book matches names to numbers. Java has a collection for each.

## The three main kinds

- **List.** Items in order, duplicates allowed. `ArrayList` is the usual choice.
- **Set.** No duplicates. `HashSet` is the usual choice. A `TreeSet` keeps its items sorted.
- **Map.** Pairs of a *key* and a *value*, with each key used once. `HashMap` is the usual choice. A `TreeMap` keeps its keys sorted.

They are generic, so you write `List<String>` or `Map<String, Integer>`. You can visit every item with a `for` loop.

:::example Worked example
Counting how often each word appears. This program was run on Java 21 and Java 23.

```java
import java.util.*;

public class Words {
    public static void main(String[] args) {
        String text = "to be or not to be";
        Map<String, Integer> counts = new TreeMap<>();
        for (String w : text.split(" ")) counts.merge(w, 1, Integer::sum);
        System.out.println(counts);
        List<String> list = new ArrayList<>(counts.keySet());
        Set<String> set = new HashSet<>(List.of("a", "b", "a"));
        System.out.println(list + " " + set.size());
    }
}
```

Output:

```
{be=2, not=1, or=1, to=2}
[be, not, or, to] 2
```

- `counts` is a `TreeMap`, so its keys come out sorted. `merge` adds 1 to a word's count, or starts it at 1.
- `to` and `be` appear twice. Each of the other words once.
- The set was given `"a", "b", "a"`. It keeps one of each, so its size is 2.
:::

## Choosing

| Need | Use |
|---|---|
| Items in order, with repeats | List |
| Only unique items | Set |
| Look up a value by a key | Map |

## Common mistakes

- **Using a list to check "have I seen this?"** A set is made for that.
- **Changing a collection while looping over it.** This usually throws an error.

## Check yourself

:::check
Q: Which collection does not allow duplicates?
A: A Set.
Q: What is a Map made of?
A: Pairs of keys and values, with each key used only once.
Q: Which Map keeps its keys sorted?
A: A TreeMap.
:::

:::deeper
**Speed.** `ArrayList` is fast to read by position. `HashSet` and `HashMap` are fast to look things up. The Java documentation describes each one's behaviour.
:::
