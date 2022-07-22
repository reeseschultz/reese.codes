# `reese.codes`

> 🕹️ [Reese's](https://github.com/reeseschultz) website about programming. 🕹️

[Check it out 👀...](https://reese.codes)

## About

My website is generated with [Lume](https://lume.land), which runs on
[Deno](https://deno.land). The site used to be a fork of
[11r](https://github.com/reeseschultz/11r), but the trappings and quirks of the
Node/NPM ecosystem became unbearably annoying for this particular dev ⚰️. While
[Eleventy](https://www.11ty.dev), used by 11r, is a great solution that is
lightyears ahead of most static site generators, Lume is even more so. Find out
for yourself.

One reason for this site being open source is so you can fork it. That said,
it's opinionated. You'll notice these choices:

- Templating with [Pug](https://pugjs.org) (it's terse)
- Styling with [Sass](https://sass-lang.com/) for convenience
- Syntax highlighting via [highlight.js](https://highlightjs.org)
- Code copying made simple with [clipboard.js](https://highlightjs.org)
- Inclusion of a
  [Canvas](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API)-based
  game called `jongler`
- No other JavaScript required for significant content
- Occasional disregard for W3C spec because its rigidity impedes upon the free
  market
- RSS-like [JSON feed](https://www.jsonfeed.org) support since that should be a
  thing
- No creepy analytics

## Running & Deploying

1. Get [Deno](https://deno.land) and [Lume](https://lume.land)
2. `cd` to local clone or fork
3. `lume --serve`
4. `deno run --allow-all --unstable deploy.ts`

`deploy.ts` is hard-coded for deploying my website to GitHub Pages—you'll want
to modify it for your purposes, along with configuration and metadata. And
remember to replace the content!

## Contributing

Feel free to open issues or pull requests.

## Acknowledgments

Óscar Otero should be recognized for his contributions to Lume and other
projects.

Use Lume? Then [sponsor Óscar](https://github.com/sponsors/oscarotero)!

What's more, I am eternally grateful to the Deno community, and those who
maintain the other dependencies that make this site work. Thank you! Note that
all third-party dependencies are licensed separately from this site.

## License

Refer to [my license page](https://reese.codes/license).
