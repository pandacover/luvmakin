import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

const blogsDirectory = path.join(process.cwd(), "public", "blogs");

export interface BlogPost {
  title: string;
  excerpt: string;
  href: string;
  category: string;
  categorySlug: string;
  slug: string;
  filePath: string;
}

export interface BlogCategory {
  name: string;
  posts: BlogPost[];
}

const formatTitle = (value: string) =>
  value
    .replace(/\.[^/.]+$/, "")
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const getExcerpt = (content: string) => {
  const paragraph = content
    .split(/\r?\n\r?\n/)
    .map((block) => block.trim())
    .find((block) => block && !block.startsWith("#"));

  if (!paragraph) return "";

  return paragraph
    .replace(/```[\s\S]*?```/g, "")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/[*_~>#]/g, "")
    .replace(/\s+/g, " ")
    .trim();
};

const getHeading = (content: string) =>
  content.match(/^#{1,6}\s+(.+)$/m)?.[1]?.trim();

export async function getBlogCategories(): Promise<BlogCategory[]> {
  const categories = await Promise.all(
    (await readdir(blogsDirectory, { withFileTypes: true }))
      .filter((entry) => entry.isDirectory())
      .sort((a, b) => a.name.localeCompare(b.name))
      .map(async (category) => {
        const categoryDirectory = path.join(blogsDirectory, category.name);
        const categoryName = formatTitle(category.name);
        const posts = await Promise.all(
          (await readdir(categoryDirectory, { withFileTypes: true }))
            .filter(
              (entry) => entry.isFile() && /\.(md|mdx)$/i.test(entry.name),
            )
            .sort((a, b) => a.name.localeCompare(b.name))
            .map(async (post) => {
              const filePath = path.join(categoryDirectory, post.name);
              const content = await readFile(filePath, "utf-8");
              const slug = post.name.replace(/\.(md|mdx)$/i, "");

              return {
                title: getHeading(content) ?? formatTitle(post.name),
                excerpt: getExcerpt(content),
                href: `/blogs/${category.name}/${slug}`,
                category: categoryName,
                categorySlug: category.name,
                slug,
                filePath,
              };
            }),
        );

        return {
          name: categoryName,
          posts,
        };
      }),
  );

  return categories;
}

export async function getBlogPosts(): Promise<BlogPost[]> {
  const categories = await getBlogCategories();
  return categories.flatMap((category) => category.posts);
}

export async function getBlogPost(
  categorySlug: string,
  slug: string,
): Promise<BlogPost | undefined> {
  const posts = await getBlogPosts();
  return posts.find(
    (post) => post.categorySlug === categorySlug && post.slug === slug,
  );
}

export async function getBlogPostContent(post: BlogPost): Promise<string> {
  return readFile(post.filePath, "utf-8");
}
