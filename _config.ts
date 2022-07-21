import lume from "lume/mod.ts";
import sass from "lume/plugins/sass.ts";
import terser from "lume/plugins/terser.ts";
import relative_urls from "lume/plugins/relative_urls.ts";
import postcss from "lume/plugins/postcss.ts";
import basePath from "lume/plugins/base_path.ts";
import pug from "lume/plugins/pug.ts";
import metas from "lume/plugins/metas.ts";
import date from "lume/plugins/date.ts";
import md from "https://jspm.dev/markdown-it-container";

const site = lume({
  src: "./src",
}, {
  markdown: {
    plugins: [md],
  },
});

const mdInstance = site.formats.get(".md").engine;

// Add `target="_blank"` to all Markdown links:
// TODO: Use new feature added per https://github.com/lumeland/lume/issues/218.
mdInstance.engine.renderer.rules.link_open = (
  tokens,
  idx,
  options,
  env,
  self,
) => {
  tokens[idx].attrPush(["target", "_blank"]);
  return self.renderToken(tokens, idx, options, env, self);
};

site.use(pug());
site.use(relative_urls());
site.use(sass({ extensions: [".scss"] }));
site.use(postcss());
site.use(terser());
site.use(basePath());
site.use(metas());
site.use(date());

site.copy("favicon.ico");
site.copy("blog/media");

export default site;
