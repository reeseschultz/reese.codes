// Adapted from https://github.com/lumeland/theme-simple-blog by Óscar Otero. MIT.

const FEED_PATH = "/blog/feed.json";

export const url = FEED_PATH;

export default function (
  { metas, search },
  { md, url, date, htmlUrl },
) {
  const feed = {
    version: "https://jsonfeed.org/version/1.1",
    title: metas.site,
    home_page_url: url("/blog", true),
    feed_url: url(FEED_PATH, true),
    description: metas.description,
    author: {
      name: metas.site,
      url: `https://${metas.domain}`,
    },
    language: metas.lang,
    favicon: url("/favicon.ico", true),
    items: [],
  };

  for (
    const post of search.pages(
      "type=post",
      "date=desc",
      Number.MAX_SAFE_INTEGER,
    )
  ) {
    feed.items.push({
      id: url(post.data.url, true),
      url: url(post.data.url, true),
      title: post.data.title,
      summary: post.data.excerpt,
      content_html: htmlUrl(md(post.data.content), true),
      date_published: date(post.data.date, "ATOM"),
      date_modified: date(post.data.updatedDate, "ATOM"),
      language: metas.lang,
      tags: post.data.tags,
    });
  }

  return JSON.stringify(feed, null, 2);
}
