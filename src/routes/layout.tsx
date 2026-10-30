import { component$, Slot, useSignal, useStyles$, useTask$ } from "@builder.io/qwik";
import { routeLoader$, useContent, useDocumentHead, useLocation } from "@builder.io/qwik-city";
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

const sections = [
  { href: '/', label: 'Home', Icon: Home },
  { href: '/projects/', label: 'Projects', Icon: Briefcase },
  { href: '/blog/', label: 'Blog', Icon: Writing },
  { href: '/resume/', label: 'Resume', Icon: News },
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

export function SiteNav(props: { pathname: string }) {
  return (
    <nav class="site-nav" aria-label="Site">
      {sections.map(({ href, label, Icon }) => (
        <a key={href} href={href} aria-current={isCurrent(props.pathname, href) ? 'page' : undefined}>
          <Icon /> {label}
        </a>
      ))}
    </nav>
  );
}

export function Socials() {
  return (
    <nav class="socials" aria-label="Elsewhere">
      {elsewhere.map(({ href, label, Icon }) => (
        <a key={href} href={href} target="_blank" rel="noreferrer" aria-label={label} title={label}>
          <Icon />
        </a>
      ))}
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
  const { frontmatter } = useDocumentHead();
  const loc = useLocation();
  useTask$(({ track }) => {
    track(() => content.headings);

    structuredHeadings.value = structure(content.headings || []);
  });

  const pathname = loc.url.pathname;
  const showToc = Boolean(frontmatter.date) && (content.headings?.length ?? 0) > 1;
  const layout = wideRoutes.includes(pathname) ? 'wide' : showToc ? 'with-toc' : '';

  return (
    <div class="site-container">
      <header class="site-header">
        <div class="inner">
          <a class="brand" href="/">
            <Logo class="site-logo" aria-hidden="true" />
            <span>
              <strong>Sam Slotsky</strong>
              <small>Saxophonist. Code slinger.</small>
            </span>
          </a>
          <SiteNav pathname={pathname} />
          <Socials />
        </div>
      </header>
      <main class={layout}>
        <article>
          <Slot />
        </article>
        {showToc && (
          <nav class="toc" aria-label="On this page">
            <strong>On this page</strong>
            <RenderStructuredList list={structuredHeadings.value} />
          </nav>
        )}
      </main>
      <footer class="site-footer">
        <div class="inner">
          <span>© {new Date().getFullYear()} Sam Slotsky · Minneapolis, MN</span>
          <Socials />
        </div>
      </footer>
    </div>
  );
});
