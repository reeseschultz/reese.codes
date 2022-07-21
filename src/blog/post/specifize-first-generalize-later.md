---
url: /blog/post/specifize-first-maybe-generalize-later/ # for backward compatibility with old blog
title: Specifize First, Maybe Generalize Later
excerpt: Why you should focus on solving specific problems with code, rather than inventing work for yourself.
date: 2022-01-09
updatedDate: 2022-07-21
tags:
  - rambling
---

### Introduction

Language features such as generics and reflection give programmers false
confidence that any given problem ought to have a generalized solution. For
example, take a feature as transcendental as the function; yes, it _can_ support
a parametric hodgepodge soup, but does that mean it necessarily _should_? No,
not unless a situation calls for it. When generalizing solutions, programmers
tend not to avoid these common pitfalls:

- Solving problems that do not (and may never) exist
- Playing whack-a-mole while making one case work, breaking others
- Tanking readability and maintainability of the codebase

I have personally witnessed programmers of all experience levels catch
generalization fever, myself included. The time and cost involved in
[premature generalization](https://wiki.c2.com/?PrematureGeneralization) is
almost never scrutinized, because otherwise concerned stakeholders (assuming
there are any) are blissfully unaware of it. Thus, it's up to us, programmers,
to identify and confront potential wasted effort. While we should expect
generalization in libraries and middleware, products and services building upon
those things should be solving specific problems.

### Example

Let's say you are coding a game. The gameplay is dependent on simulated fluid
dynamics, but unfortunately there is no code to be licensed that adequately
fulfills the game's requirements, so you would have to code it yourself. This,
by the way, is an exceedingly common predicament, because it turns out that the
most generalized tools are not general enough. It is also a satisfying reason
for pivoting.

Assuming you must build this game based on fluid dynamics, you do at least have
enough experience to understand that there should be a fluid dynamics module
loosely coupled from the core game logic. In spite of that, your mind starts
racing...

> _What if I need the fluid dynamics for a future game?_

Doubtful, and even if you did, you'll probably rewrite almost everything.

> _What if I sold this code as an asset?_

Wait, weren't you building a game?

> _What if I made this module open-source?_

That's as time-consuming as producing an asset.

### Conclusion

For the vast majority of products and services, generalization increases scope,
when we should be searching for any possible reason to decrease it. We do not
necessarily need to cut features, but we should always consider simplifying
their implementation. Even if you are a corporate programmer cozily alienated
from tangible business impact, the more general your code, the more that can go
wrong. That may translate to job security for some, but will taint perceptions
of others.

I recommend solving specific problems first and foremost. Never generalize
without consideration of alternatives. Generalization that substantially
increases scope should require a sanity check by peers, and explicit consent
from (non-technical) stakeholders.
