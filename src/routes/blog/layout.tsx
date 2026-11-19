import { Slot, component$, useStyles$ } from "@builder.io/qwik";
import styles from './styles.css?inline';
import { useLocation } from "@builder.io/qwik-city";
import { langOf, locales } from "~/i18n";
import { t } from "~/i18n/messages";
import { PageContent, useLocalizedHead } from "~/i18n/page";

export default component$(() => {
  useStyles$(styles);
  const { title, frontmatter, meta } = useLocalizedHead();
  const lang = langOf(useLocation().url);
  if (frontmatter.notABlog) {
    return <Slot />;
  }

  const author = meta.find((m) => m.name === 'author')?.content;
  const date = new Date(frontmatter.date);
  const dateString = date.toLocaleDateString(locales[lang], { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" })

  return (
    <>
      <div class="head">
        <time>{dateString}</time>
        <small>{t(lang, 'blog.by')} {author ?? t(lang, 'blog.unknownAuthor')}</small>
      </div>
      <h1 class="title">{title}</h1>
      <PageContent><Slot /></PageContent>
    </>
  );
});
