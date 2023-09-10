import type { JSXChildren } from "@builder.io/qwik";
import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";

export const head: DocumentHead = () => {
  return {
    title: "Sam Slotsky's Developer Blog",
    frontmatter: {
      notABlog: true,
    },
  };
};

interface PostModule {
  default: () => JSXChildren,
  frontmatter: {
    title?: string,
    date?: string,
  }
}

export async function sortPosts(imports: Record<string, () => Promise<PostModule>>) {
  const pairs = await Promise.all(
    Object.entries(imports).map(async ([filename, getPost]) => {
      return { filename, post: await getPost() };
    })
  );

  return pairs.sort((a, b) => {
    if (a.post.frontmatter.date && b.post.frontmatter.date) {
      return new Date(b.post.frontmatter.date).valueOf() -
        new Date(a.post.frontmatter.date).valueOf();
    }

    return 0;
  });
}

export default component$(() => {
  const posts = import.meta.glob<{
    default: () => JSXChildren,
    frontmatter: {
      title: string,
    }
  }>('./**/*.mdx');

  const sorted = sortPosts(posts);
  return (
    <>
      {sorted.then((sortedPosts) => {
        return sortedPosts.map(({ filename, post }, i) => {
          const parts = filename.split("/");
          const path = parts.slice(1, parts.length - 1).join('/');
          return (
            <div key={i} class="blog-preview">
              <h1><a href={`/blog/${path}`}>{post.frontmatter.title}</a></h1>
              {post.default()}
              <div class="bottom" />
            </div>
          );

        })
      })}
    </>
  )
});