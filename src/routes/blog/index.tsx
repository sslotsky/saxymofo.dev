import type { JSXChildren } from "@builder.io/qwik";
import { component$, useStyles$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import styles from './styles.css?inline';
import { useLocation } from "@builder.io/qwik-city";
import { langOf, localHref, locales } from "~/i18n";
import { translation } from "~/i18n/content";
import { t } from "~/i18n/messages";

export const head: DocumentHead = ({ url }) => {
  return {
    title: t(langOf(url), 'blog.title'),
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
  const lang = langOf(useLocation().url);

  const sorted = sortPosts(posts);
  return (
    <>
      <div class="blog-intro">
        <h1>{t(lang, 'blog.heading')}</h1>
        <p>{t(lang, 'blog.intro')}</p>
      </div>
      {sorted.then((sortedPosts) => {
        return sortedPosts.map(({ filename, post: english }, i) => {
          const parts = filename.split("/");
          const path = parts.slice(1, parts.length - 1).join('/');
          const post = (translation(lang, `/blog/${path}/`) ?? english) as PostModule;
          return (
            <div key={i} class="blog-preview">
              {post.frontmatter.date && (
                <time>
                  {new Date(post.frontmatter.date).toLocaleDateString(locales[lang], { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" })}
                </time>
              )}
              <h2><a href={localHref(`/blog/${path}/`, lang)}>{post.frontmatter.title}</a></h2>
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