# `reese.codes`

> 🕹️ [Reese's](https://github.com/reeseschultz) website. 🕹️

[Check it out 👀...](https://reese.codes)

## About

My website is generated with [Lume](https://lume.land), which runs on
[Deno](https://deno.land).

This site is open source mainly so you can fork it to use with your own content. That said,
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

## Running

### With Deno

1. Get [Deno](https://deno.land)
1. Get [Lume](https://lume.land)
1. `cd` to local clone or fork
1. `lume --serve`

### With Docker Compose

1. Get [Docker](https://www.docker.com)
1. `cd` to local clone or fork
1. `docker-compose up`

## Manual Deployment

1. Get [Deno](https://deno.land)
1. `cd` to local clone or fork
1. `deno run --allow-all --unstable deploy.ts`

`deploy.ts` is hard-coded for deploying my website to GitHub Pages—you'll want
to modify it for your purposes, along with configuration and metadata. And
remember to replace the content!

## Configuring

- `src/_data.yml` file for customizing general data across the site.
- `src/blog` folder for the blog content.

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
