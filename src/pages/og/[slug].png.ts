import { getOgImage, type OgOptions } from "../../lib/og";
import { getPublishedPosts } from "../../lib/posts";

// 公開記事ごとの`/og/記事ID.png`と、記事以外のページで使う`/og/default.png`をビルド時に生成する。
export async function getStaticPaths() {
  const posts = await getPublishedPosts();
  return [
    {
      params: { slug: "default" },
      props: { title: "実装と運用の記録", category: "Blog", date: "" },
    },
    ...posts.map((post) => ({
      params: { slug: post.id },
      props: {
        title: post.data.title,
        category: post.data.categories[0],
        date: post.data.published.toISOString().slice(0, 10),
      },
    })),
  ];
}

export async function GET({ params, props }: { params: { slug: string }; props: OgOptions }) {
  const image = await getOgImage(params.slug, props);
  return new Response(new Uint8Array(image), { headers: { "Content-Type": "image/png" } });
}
