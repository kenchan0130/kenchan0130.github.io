import rss from "@astrojs/rss";
import { SITE } from "../config/site";
import { getPublishedPosts, postPath } from "../lib/posts";

export async function GET(context: { site?: URL }) {
  const posts = await getPublishedPosts();
  return rss({
    title: SITE.title,
    description: SITE.description,
    site: context.site ?? new URL(SITE.url),
    // 記事は`/post/YYYY-MM-DD-N`で公開しており、末尾にスラッシュを付けたURLは404になる。
    trailingSlash: false,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.published,
      link: postPath(post),
      categories: [...post.data.categories, ...post.data.tags],
    })),
  });
}
