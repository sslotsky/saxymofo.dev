import { component$, useComputed$, useSignal } from '@builder.io/qwik';
import { useLocation } from '@builder.io/qwik-city';
import type { DocumentHead } from '@builder.io/qwik-city';
import type { Recipe } from '~/components/recipes/recipe';
import { langOf, localHref, locales } from '~/i18n';
import type { Lang } from '~/i18n';
import { translation } from '~/i18n/content';
import { t, t as translate, tagLabel } from '~/i18n/messages';

export const head: DocumentHead = ({ url }) => ({ title: t(langOf(url), 'recipes.title'), frontmatter: { notARecipe: true } });
const modules = import.meta.glob<{ frontmatter: Recipe }>('./**/index.mdx', { eager: true });
const tagOrder = ['plan', 'meals', 'bread', 'spreads', 'sauces', 'breakfast'];
const paths = Object.keys(modules).map(path => ({ path: `/recipes/${path.split('/').slice(1, -1).join('/')}/`, module: modules[path] }));
const rank = (tags: string[] = []) => Math.min(...tags.map(tag => tagOrder.indexOf(tag) < 0 ? tagOrder.length : tagOrder.indexOf(tag)), tagOrder.length);
const recipesIn = (lang: Lang) => paths.map(({ path, module }) => ({ path, ...module.frontmatter, ...translation(lang, path)?.frontmatter as Recipe | undefined }))
  .sort((a, b) => rank(a.tags) - rank(b.tags) || a.title.localeCompare(b.title, locales[lang]));
const tags = [...new Set(recipesIn('en').flatMap(recipe => recipe.tags ?? []))].sort();

export default component$(() => {
  const tag = useSignal('');
  const lang = langOf(useLocation().url);
  const recipes = useComputed$(() => recipesIn(lang));
  return <div class="recipes-index">
    <p class="recipe-eyebrow">{t(lang, 'recipes.eyebrow')}</p>
    <h1>{t(lang, 'recipes.title')}</h1>
    <p class="recipe-description">{t(lang, 'recipes.intro')}</p>
    <div class="recipe-buttons recipe-filters" role="group" aria-label={t(lang, 'recipes.filter')}>
      {['', ...tags].map(t => <button key={t} aria-pressed={tag.value === t} onClick$={() => tag.value = t}>{t ? tagLabel(lang, t) : translate(lang, 'recipes.all')}</button>)}
    </div>
    <div class="recipe-grid">{recipes.value.filter(recipe => !tag.value || recipe.tags?.includes(tag.value)).map(recipe => <section class="recipe-card" key={recipe.path}>
      <h2><a href={localHref(recipe.path, lang)}>{recipe.title}</a></h2>
      <p>{recipe.description}</p>
      <div class="recipe-meta">{recipe.tags?.map(tag => <span class="recipe-tag" key={tag}>{tagLabel(lang, tag)}</span>)}</div>
    </section>)}</div>
    {!recipes.value.length && <p>{t(lang, 'recipes.empty')}</p>}
  </div>;
});
