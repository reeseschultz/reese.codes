---
url: /blog/post/mocking-the-unmockable-in-typescript-and-javascript/ # for backward compatibility with old blog
title: Mocking the Unmockable in TypeScript and JavaScript
excerpt: Yes, you can mock ES6 function exports! Here's how.
date: 2022-06-28
updatedDate: 2022-06-28
tags:
  - typescript
---

### Scenario

Consider the following scenario. You're using a package or module that directly
exports functions, so you're unable to mock them. Let's presume this is the
source code of one such function:

```typescript
export function theirFunction(): string {
  return "";
}
```

> We're using TypeScript in this example, but, if you remove the types, then you
> have ES6-compliant JavaScript.

Let's say your code uses `theirFunction` like so:

```typescript
function yourFunction(): boolean {
  return "" === theirFunction();
}
```

We'll assume you must always depend on `theirFunction` returning an empty
string, and maybe you want a test to fail if the output changes per an upgrade.
You _could_ directly test `theirFunction`, although you only care about its
output changing in the context of `yourFunction`, not any others.

This may be an arbitrary example, but it has practical implications; after all,
how do we mock `theirFunction`? It's immutable, so reassignment goes out the
window, meaning that a conventional mocking library won't work here, at least
not directly.

### Solution

To solve this problem, I suggest making a loosely-coupled, mockable extension of
the library encapsulating `theirFunction`. Consider creating a file like this:

```typescript
import { theirFunction as theirUnmockableFunction } from "./..";

export default new (class {
  // ...

  theirFunction(): string {
    return theirUnmockableFunction();
  }

  // ...
})();
```

The exported anonymous class is effectively a singleton that we must now use as
a stand-in for their library, as is the case in `yourFunction`:

```typescript
import theirMockableLibrary from "./../theirMockableLibrary.ts";

function yourFunction(): boolean {
  return "" === theirMockableLibrary.theirFunction();
}
```

Congratulations, now your stubs and spies should work!

For example, with Deno, we could stub `theirFunction` in this way:

```typescript
import yourLibrary from "./../yourLibrary.ts";
import theirMockableLibrary from "./../theirMockableLibrary.ts";

import { returnsNext, stub } from "https://deno.land/std/testing/mock.ts";

import { assertEquals } from "https://deno.land/std/testing/asserts.ts";

// ...

const theirFunctionStub = stub(
  theirMockableLibrary,
  "theirFunction",
  returnsNext(["not an empty string!"]),
);

// This should fail (because the mocking works!):
assertEquals(yourLibrary.yourFunction(), true);

theirFunctionStub.restore();

// ...
```

### Conclusion

It's clear that there are two major downsides to this approach:

1. All of the parameters of your mockable functions should be the same as those
   of the unmockable ones; you must also passthrough arguments appropriately.
2. You must directly reference, via dot notation, the exported object of any
   mocked functions being called, whether in a test file or not. Fortunately,
   the flipside is that you may refer to the object by whatever name you
   like—probably not something unwieldly like `theirMockableLibary`.

Hopefully this steers you away from hacking your package cache or something. And
consider submitting a pull request to improve the mockability of whichever
library you're using. The maintainers may be willing to hear you out. Have fun!
