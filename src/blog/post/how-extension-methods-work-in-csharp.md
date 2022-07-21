---
url: /blog/post/how-extension-methods-work-in-csharp/ # for backward compatibility with old blog
title: How Extension Methods Work in C#
excerpt: Learn how to "add" methods to an existing type.
date: 2021-08-31
updatedDate: 2021-08-31
path: /blog/post/how-extension-methods-work-in-csharp/
tags:
  - csharp
---

### Introduction

Suppose you have a type called `Cat`. But! `Cat` has no `Meow` method due to
short-sighted vision on the part of its designers. How can you be expected to
complete your work without a meowing cat?

How? By creating an _extension method_, as in a method that extends a given
type. I'll show you what's involved.

Know that there are different ways to organize your extension methods. For any
given project, I tend to throw those methods in a namespaced, static class
called `Util`, along with other static methods. As to why, it's because I don't
feel like creating a class to encapsulate a single method. Most of the time, you
may only require one or two extension methods per type. As the number of methods
increases, and the need arises for more fine-grained organization, it's
productive to refactor, grouping like methods by class. The popular convention,
in this case, would be to create a class called `CatExtensions`.

Let's go with that—create a file called `CatExtensions.cs`. That's where we'll
write our code.

### Walkthrough

First, we'll import the `System` dependency for the sake of this example, and
declare a namespace:

```csharp
using System;

namespace SomeNamespace
{
  // TODO
}
```

Be sure to replace `SomeNamespace` with a different name.

Second, we'll add this scaffolding inside the namespace:

```csharp
public class Cat { }

public static class CatExtensions
{
  // TODO
}
```

I'm including a minimal implementation of `Cat` just to prevent compiler errors,
in case you want to run this code. While in this example `Cat` is a `class`, it
could also be a `struct`, or even an `interface`! Yep, extension methods are
applicable for interfaces too.

Anyway, bear in mind that extension methods must be `static`, hence why
`CatExtensions` is `static`—there's no reason for it to ever be instantiated.

Finally, add the extension method to the `CatExtensions` class:

```csharp
public static void Meow(this Cat cat, int meowCount)
{
  Console.WriteLine($"The cat meows {meowCount} times!");
}
```

Note that extension methods must be `static`. To extend `Cat`, we supply the
`this` keyword followed by the `Cat` type and `cat` variable name. If we wanted,
we could modify `cat` via its accessible members, if it had any. In this case,
we pass another parameter called `meowCount`, simulating the number of times the
cat meows through console output. Here, we're using string interpolation since
it flows better than concatenation.

### Final Result

Putting everything together:

```csharp
using System;

namespace SomeNamespace
{
  public class Cat { }

  public static class CatExtensions
  {
    public static void Meow(this Cat cat, int meowCount)
    {
      Console.WriteLine($"The cat meows {meowCount} times!");
    }
  }
}
```

### Usage

Let's assume a cat has been instantiated like this:

```csharp
var cat = new Cat();
```

Now, there are two ways you can call `Meow` on `cat`. The first, and preferred
way, is to do this:

```csharp
cat.Meow(3);
```

The output of that would be:

```plaintext
The cat meows 3 times!
```

The second way is much more verbose:

```csharp
CatExtensions.Meow(cat, 5);
```

The output of this would be:

```plaintext
The cat meows 5 times!
```

Calling `Meow` like a typical static method, which it technically is, kind of
defeats the point of it also being an extension method. Extension methods are,
after all, an avenue for writing more terse, readable code. In other words, they
permit an arguably more elegant style as opposed to the alternative.

I hope this helped demystify extension methods for you.
