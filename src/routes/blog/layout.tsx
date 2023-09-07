import { Slot, component$, useStyles$ } from "@builder.io/qwik";
import styles from './styles.css?inline';
import { useDocumentHead } from "@builder.io/qwik-city";

export default component$(() => {
  useStyles$(styles);
  const { title, frontmatter, meta } = useDocumentHead();
  if (frontmatter.notABlog) {
    return <Slot />;
  }

  const author = meta.find((m) => m.name === 'author')?.content;
  const date = new Date(frontmatter.date);
  const dateString = date.toLocaleDateString('en-us', { year:"numeric", month:"long", day:"numeric"})

  return (
    <>
      <article>
        <div class="head">
          <time>{dateString}</time>
          <small>By {author ?? 'unknown author'}</small>
        </div>
        <h1 class="title">{title}</h1>
        <Slot />
      </article>
    </>
  );
});
