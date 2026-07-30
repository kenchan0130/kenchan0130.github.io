import type { CollectionEntry } from "astro:content";
import { getCollection } from "astro:content";
import { isPublicPost } from "./publication";

export type Post = CollectionEntry<"posts">;

export async function getPublishedPosts(): Promise<Post[]> {
  const posts = await getCollection(
    "posts",
    ({ data }) => import.meta.env.DEV || isPublicPost(data),
  );
  return posts.sort((a, b) => b.data.published.valueOf() - a.data.published.valueOf());
}

export function postPath(post: Post): string {
  return `/post/${post.id}`;
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("ja-JP", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "Asia/Tokyo",
  }).format(date);
}

export function formatIsoDate(date: Date): string {
  return new Intl.DateTimeFormat("sv-SE", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    timeZone: "Asia/Tokyo",
  }).format(date);
}

export function getRelatedPosts(current: Post, posts: Post[], limit = 3): Post[] {
  const manual = current.data.references
    .map((id) => posts.find((post) => post.id === id))
    .filter((post): post is Post => Boolean(post) && post?.id !== current.id);
  const manualIds = new Set(manual.map((post) => post.id));

  const scored = posts
    .filter((post) => post.id !== current.id && !manualIds.has(post.id))
    .map((post) => {
      const categories = post.data.categories.filter((value) =>
        current.data.categories.includes(value),
      ).length;
      const tags = post.data.tags.filter((value) => current.data.tags.includes(value)).length;
      return { post, score: categories * 4 + tags * 2 };
    })
    .filter(({ score }) => score > 0)
    .sort(
      (a, b) =>
        b.score - a.score ||
        b.post.data.published.valueOf() - a.post.data.published.valueOf() ||
        a.post.id.localeCompare(b.post.id),
    )
    .map(({ post }) => post);

  return [...manual, ...scored].slice(0, limit);
}
