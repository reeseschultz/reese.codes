export const layout = "tags.pug";

let lastTag = "";

// Returns posts as `results` in tags.pug:
export default function* ({ search, paginate }) {
  for (const tag of search.values("tags")) {
    lastTag = tag;

    const posts = search.pages(`type=post '${tag}'`, "date=desc");

    for (
      const page of paginate(posts, { url, size: 10 })
    ) {
      page.pathToPage = `/blog/tag/${tag}/`;
      page.filteredBy = tag;

      yield page;
    }
  }
}

function url(n) {
  if (n === 1) {
    return `/blog/tag/${lastTag}/`;
  }

  return `/blog/tag/${lastTag}/${n}/`;
}
