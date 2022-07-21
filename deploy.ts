#!/usr/bin/env deno

import { $, cd } from "https://deno.land/x/dzx@0.4.0/mod.ts";

await $`lume`;

cd("_site");

await $`git init`;
await $`git add -A`;
await $`git commit -m "build: GitHub Pages"`;
await $`git push -f git@github.com:reeseschultz/reese.codes.git master:gh-pages`;
