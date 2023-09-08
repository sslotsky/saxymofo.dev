import { component$, Slot, useSignal, useStyles$, useTask$ } from "@builder.io/qwik";
import { routeLoader$, useContent } from "@builder.io/qwik-city";
import type { ContentHeading, RequestHandler } from "@builder.io/qwik-city";
import styles from './styles.css?inline';
import Samo from '~/components/samo.svg?jsx';
import Home from '~/components/svg/home.svg?jsx';
import Writing from '~/components/svg/writing.svg?jsx';
import Briefcase from '~/components/svg/briefcase.svg?jsx';

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

export default component$(() => {
  useStyles$(styles);
  const structuredHeadings = useSignal<Array<StructuredHeading>>([]);
  const content = useContent();
  useTask$(({ track }) => {
    track(() => content.headings);

    structuredHeadings.value = structure(content.headings || []);
  });

  // const hash = 
  const gravatarUrl = `https://www.gravatar.com/avatar/aa021790422f28010526a0d8973d4315`;

  return (
    <div class="site-container">
      <header>
        <a href="/">
          <Samo class="site-logo" />
        </a>
      </header>
      <nav class="site-nav">
        <h5>
          <a href="/">
            <Home /> Home
          </a>
        </h5>
        <h5>
          <a href="/blog">
            <Writing /> Blog
          </a>
        </h5>
        <h5>
          <a href="/projects">
            <Briefcase /> Projects
          </a>
        </h5>
      </nav>
      <main>
        <article>
          <Slot />
        </article>
        <aside>
          <div class="my-card">
            <img src={gravatarUrl} height={60} width={60} />
            <div class="details">
              <h5>Sam Slotsky</h5>
              <p>Software Engineer</p>
            </div>
            <a class="twitter-link" href="https://twitter.com/TheSaxyMofo" target="_blank">
              Follow on &#120143;
            </a>
          </div>
          {content.headings && (
            <nav>
              <strong>On This Page</strong>
              <RenderStructuredList list={structuredHeadings.value} />
            </nav>
          )}
        </aside>
      </main>
    </div>
  );
});
