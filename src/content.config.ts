import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const posts = defineCollection({
  loader: glob({ base: "./src/content/posts", pattern: "**/*.{md,mdx}" }),
  schema: z.object({
    title: z.string(),
    description: z.string().default(""),
    published: z.coerce.date(),
    updated: z.coerce.date().optional(),
    categories: z.array(z.string()).min(1),
    tags: z.array(z.string()).default([]),
    references: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

export const collections = { posts };
