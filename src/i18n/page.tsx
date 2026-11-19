import { component$, Slot } from '@builder.io/qwik';
import { useDocumentHead, useLocation } from '@builder.io/qwik-city';
import { langOf } from './index';
import { localizeHead, translation } from './content';

export const useLang = () => langOf(useLocation().url);

export const useLocalizedHead = () => {
  const loc = useLocation();
  return localizeHead(useDocumentHead(), langOf(loc.url), loc.url.pathname);
};

export const PageContent = component$(() => {
  const loc = useLocation();
  const translated = translation(langOf(loc.url), loc.url.pathname);
  if (!translated) return <Slot />;
  const Content = translated.default;
  return <Content />;
});
