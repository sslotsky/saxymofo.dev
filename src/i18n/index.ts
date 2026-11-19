export const languages = ['en', 'ru', 'uk'] as const;
export type Lang = (typeof languages)[number];

export const locales: Record<Lang, string> = { en: 'en-US', ru: 'ru-RU', uk: 'uk-UA' };
export const languageNames: Record<Lang, string> = { en: 'English', ru: 'Русский', uk: 'Українська' };

export const isLang = (value: unknown): value is Lang => languages.includes(value as Lang);

export const langOf = (url: URL): Lang => {
  const lang = url.searchParams.get('lang');
  return isLang(lang) ? lang : 'en';
};

export function localHref<T extends string | undefined>(href: T, lang: Lang): T {
  if (!href || lang === 'en' || !href.startsWith('/') || href.startsWith('//')) return href;
  const url = new URL(href, 'https://local.invalid');
  url.searchParams.set('lang', lang);
  return `${url.pathname}${url.search}${url.hash}` as T;
}

export function languageHref(current: URL, lang: Lang) {
  const url = new URL(current);
  if (lang === 'en') url.searchParams.delete('lang');
  else url.searchParams.set('lang', lang);
  return `${url.pathname}${url.search}${url.hash}`;
}
