// Adapted from https://github.com/lumeland/theme-simple-blog by Óscar Otero. MIT.

export const layout = "blog.pug";

// Returns posts as `results` in blog.pug:
export default function* ({ search, paginate }) {
  const posts = search.pages("type=post", "date=desc");

  for (
    const page of paginate(posts, { url, size: 10 })
  ) {
    page.pathToPage = "/blog/";

    yield page;
  }
}

function url(n) {
  if (n === 1) {
    return "/blog/";
  }

  return `/blog/${n}/`;
}
