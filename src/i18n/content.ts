import type { ContentHeading, DocumentMeta } from '@builder.io/qwik-city';
import type { Lang } from './index';

export interface Translation {
  default: () => any;
  frontmatter?: Record<string, any>;
  head?: { title?: string; meta?: DocumentMeta[] };
  headings?: ContentHeading[];
}

const toPath = (segments: string[]) => (segments.length ? `/${segments.join('/')}/` : '/');

const modules = import.meta.glob<Translation>('./content/*/**/index.mdx', { eager: true });
const translations = new Map(Object.entries(modules).map(([file, module]) => {
  const [lang, ...segments] = file.replace('./content/', '').split('/').slice(0, -1);
  return [`${lang}:${toPath(segments)}`, module];
}));

const englishMdx = new Set(Object.keys(import.meta.glob('../routes/**/index.mdx')).map(file => toPath(file.replace('../routes/', '').split('/').slice(0, -1))));

export const translation = (lang: Lang, pathname: string) => (lang === 'en' ? undefined : translations.get(`${lang}:${pathname}`));

export const isUntranslated = (lang: Lang, pathname: string) => lang !== 'en' && englishMdx.has(pathname) && !translation(lang, pathname);

export const nestedContent = (pathname: string) => ['/blog/', '/recipes/'].some(prefix => pathname.startsWith(prefix) && pathname !== prefix);

export function localizeHead<T extends { title: string; meta: readonly DocumentMeta[]; frontmatter: Record<string, any> }>(head: T, lang: Lang, pathname: string): T {
  const translated = translation(lang, pathname);
  if (!translated) return head;
  const meta = translated.head?.meta ?? [];
  const key = (m: DocumentMeta) => m.name ?? m.property;
  return {
    ...head,
    title: translated.head?.title ?? head.title,
    meta: [...head.meta.filter(m => !meta.some(t => key(t) === key(m))), ...meta],
    frontmatter: translated.frontmatter ?? head.frontmatter,
  };
}
