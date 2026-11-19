import { component$, Slot, useSignal, useStyles$, useTask$ } from "@builder.io/qwik";
import { routeLoader$, useContent, useLocation } from "@builder.io/qwik-city";
import type { ContentHeading, RequestHandler } from "@builder.io/qwik-city";
import styles from './styles.css?inline';
import Logo from '~/components/samo-badge.svg?jsx';
import Home from '~/components/svg/home.svg?jsx';
import Writing from '~/components/svg/writing.svg?jsx';
import News from '~/components/svg/news.svg?jsx';
import Briefcase from '~/components/svg/briefcase.svg?jsx';
import Github from '~/components/svg/brand-github.svg?jsx';
import X from '~/components/svg/brand-x.svg?jsx';
import Instagram from '~/components/svg/brand-instagram.svg?jsx';
import LinkedIn from '~/components/svg/brand-linkedin.svg?jsx';
import Envelope from '~/components/svg/envelope.svg?jsx';
import Utensils from '~/components/svg/utensils.svg?jsx';
import { languageHref, languageNames, languages, langOf, localHref } from '~/i18n';
import type { Lang } from '~/i18n';
import { isUntranslated, nestedContent, translation } from '~/i18n/content';
import { t } from '~/i18n/messages';
import type { MessageKey } from '~/i18n/messages';
import { PageContent, useLocalizedHead } from '~/i18n/page';

const sections: { href: string; label: MessageKey; Icon: typeof Home }[] = [
  { href: '/', label: 'nav.home', Icon: Home },
  { href: '/projects/', label: 'nav.projects', Icon: Briefcase },
  { href: '/blog/', label: 'nav.blog', Icon: Writing },
  { href: '/recipes/', label: 'nav.recipes', Icon: Utensils },
  { href: '/resume/', label: 'nav.resume', Icon: News },
];

const elsewhere = [
  { href: 'https://github.com/sslotsky', label: 'GitHub', Icon: Github },
  { href: 'https://www.linkedin.com/in/sam-slotsky-62024519/', label: 'LinkedIn', Icon: LinkedIn },
  { href: 'https://www.instagram.com/saxymofo/', label: 'Instagram', Icon: Instagram },
  { href: 'https://x.com/TheSaxyMofo', label: 'X', Icon: X },
  { href: 'mailto:sam@saxymofo.com', label: 'Email', Icon: Envelope },
];

const isCurrent = (pathname: string, href: string) =>
  href === '/' ? pathname === '/' : pathname.startsWith(href);

export function SiteNav(props: { pathname: string; lang: Lang }) {
  return (
    <nav class="site-nav" aria-label={t(props.lang, 'nav.site')}>
      {sections.map(({ href, label, Icon }) => (
        <a key={href} href={localHref(href, props.lang)} aria-current={isCurrent(props.pathname, href) ? 'page' : undefined}>
          <Icon /> {t(props.lang, label)}
        </a>
      ))}
    </nav>
  );
}

export function Socials(props: { lang: Lang }) {
  return (
    <nav class="socials" aria-label={t(props.lang, 'nav.elsewhere')}>
      {elsewhere.map(({ href, label, Icon }) => {
        const name = label === 'Email' ? t(props.lang, 'social.email') : label;
        return (
          <a key={href} href={href} target="_blank" rel="noreferrer" aria-label={name} title={name}>
            <Icon />
          </a>
        );
      })}
    </nav>
  );
}

export function RenderStructuredList(props: { list: Array<StructuredHeading> }) {
  if (props.list.length === 0) {
    return null;
  }

  return (
    <ol>
      {props.list.map((item, index) => {
        return (
          <li key={index}>
            <a href={`#${item.id}`}>{item.text}</a>
            <RenderStructuredList list={item.children} />
          </li>
        )
      })}
    </ol>
  )
}

interface StructuredHeading extends ContentHeading {
  children: Array<StructuredHeading>;
}

export function structure(unstructuredList: Array<ContentHeading>): Array<StructuredHeading> {
  const items = [];
  const list: Array<StructuredHeading> = unstructuredList.map((item) => ({
    id: item.id,
    level: item.level,
    text: item.text,
    children: []
  }));

  for (let i = list.length - 1; i > -1; i--) {
    const item = list[i];
    let j = i - 1;
    let prev = list.at(j);
    let parent = null;

    if (prev && item.level > prev.level) {
      parent = prev;
    } else {
      while (prev && item.level <= prev.level) {
        prev = list.at(--j);
      }

      if (prev) {
        parent = prev;
      }
    }

    if (parent) {
      parent.children.unshift(item);
    } else {
      items.unshift(item);
    }
  }

  return items;
}

export const onGet: RequestHandler = async ({ cacheControl }) => {
  // Control caching for this request for best performance and to reduce hosting costs:
  // https://qwik.builder.io/docs/caching/
  cacheControl({
    // Always serve a cached response by default, up to a week stale
    staleWhileRevalidate: 60 * 60 * 24 * 7,
    // Max once every 5 seconds, revalidate on the server to get a fresh version of this page
    maxAge: 5,
  });
};

export function LanguageReview(props: { url: URL; lang: Lang }) {
  return (
    <aside class="lang-review" aria-label={t(props.lang, 'review.languages')}>
      <p>
        {t(props.lang, 'review.notice')}
        {isUntranslated(props.lang, props.url.pathname) && <> {t(props.lang, 'review.untranslated')}</>}
      </p>
      <nav aria-label={t(props.lang, 'review.languages')}>
        {languages.map(lang => (
          <a key={lang} href={languageHref(props.url, lang)} hreflang={lang} lang={lang} aria-current={lang === props.lang ? 'true' : undefined}>
            {languageNames[lang]}
          </a>
        ))}
      </nav>
    </aside>
  );
}

export const useServerTimeLoader = routeLoader$(() => {
  return {
    date: new Date().toISOString(),
  };
});

const wideRoutes = ['/', '/projects/'];

export default component$(() => {
  useStyles$(styles);
  const structuredHeadings = useSignal<Array<StructuredHeading>>([]);
  const content = useContent();
  const { frontmatter } = useLocalizedHead();
  const loc = useLocation();
  const lang = langOf(loc.url);
  useTask$(({ track }) => {
    const url = track(() => loc.url);
    const headings = translation(langOf(url), url.pathname)?.headings ?? track(() => content.headings);

    structuredHeadings.value = structure(headings || []);
  });

  const pathname = loc.url.pathname;
  const headings = translation(lang, pathname)?.headings ?? content.headings;
  const showToc = Boolean(frontmatter.date) && (headings?.length ?? 0) > 1;
  const layout = wideRoutes.includes(pathname) ? 'wide' : showToc ? 'with-toc' : '';

  return (
    <div class="site-container" lang={lang === 'en' ? undefined : lang}>
      {lang !== 'en' && <LanguageReview url={loc.url} lang={lang} />}
      <header class="site-header">
        <div class="inner">
          <a class="brand" href={localHref('/', lang)}>
            <Logo class="site-logo" aria-hidden="true" />
            <span>
              <strong>{t(lang, 'brand.name')}</strong>
              <small>{t(lang, 'brand.tagline')}</small>
            </span>
          </a>
          <SiteNav pathname={pathname} lang={lang} />
          <Socials lang={lang} />
        </div>
      </header>
      <main class={layout}>
        <article>
          {nestedContent(pathname) ? <Slot /> : <PageContent><Slot /></PageContent>}
        </article>
        {showToc && (
          <nav class="toc" aria-label={t(lang, 'toc.heading')}>
            <strong>{t(lang, 'toc.heading')}</strong>
            <RenderStructuredList list={structuredHeadings.value} />
          </nav>
        )}
      </main>
      <footer class="site-footer">
        <div class="inner">
          <span>© {new Date().getFullYear()} {t(lang, 'brand.name')} · {t(lang, 'footer.location')}</span>
          <Socials lang={lang} />
        </div>
      </footer>
    </div>
  );
});
