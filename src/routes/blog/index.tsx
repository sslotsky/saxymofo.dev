import type { JSXChildren } from "@builder.io/qwik";
import { component$, useStyles$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import styles from './styles.css?inline';

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
    description?: string,
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
  useStyles$(styles);
  const posts = import.meta.glob<PostModule>('./**/*.mdx');

  const sorted = sortPosts(posts);
  return (
    <>
      <div class="blog-intro">
        <h1>Blog</h1>
        <p>Notes on TypeScript, functional programming and whatever else I'm tinkering with.</p>
      </div>
      {sorted.then((sortedPosts) => {
        return sortedPosts.map(({ filename, post }, i) => {
          const parts = filename.split("/");
          const path = parts.slice(1, parts.length - 1).join('/');
          return (
            <div key={i} class="blog-preview">
              {post.frontmatter.date && (
                <time>
                  {new Date(post.frontmatter.date).toLocaleDateString('en-us', { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" })}
                </time>
              )}
              <h2><a href={`/blog/${path}`}>{post.frontmatter.title}</a></h2>
              {post.frontmatter.description ? (
                <p>{post.frontmatter.description}</p>
              ) : (
                <>
                  {post.default()}
                  <div class="bottom" />
                </>
              )}
            </div>
          );
        })
      })}
    </>
  )
});