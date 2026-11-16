import { component$, useSignal } from '@builder.io/qwik';
import type { DocumentHead } from '@builder.io/qwik-city';
import type { Recipe } from '~/components/recipes/recipe';

export const head: DocumentHead = { title: 'Recipes', frontmatter: { notARecipe: true } };
const modules = import.meta.glob<{ frontmatter: Recipe }>('./**/index.mdx', { eager: true });
const tagOrder = ['plan', 'meals', 'bread', 'spreads', 'sauces', 'breakfast'];
const recipes = Object.entries(modules).map(([path, module]) => ({ path: `/recipes/${path.split('/').slice(1, -1).join('/')}/`, ...module.frontmatter })).sort((a, b) => {
  const rank = (tags: string[] = []) => Math.min(...tags.map(tag => tagOrder.indexOf(tag) < 0 ? tagOrder.length : tagOrder.indexOf(tag)), tagOrder.length);
  return rank(a.tags) - rank(b.tags) || a.title.localeCompare(b.title);
});
const tags = [...new Set(recipes.flatMap(recipe => recipe.tags ?? []))].sort();

export default component$(() => {
  const tag = useSignal('');
  return <div class="recipes-index">
    <p class="recipe-eyebrow">From my kitchen</p>
    <h1>Recipes</h1>
    <p class="recipe-description">Good things to make, share, and make your own.</p>
    <div class="recipe-buttons recipe-filters" role="group" aria-label="Filter recipes by tag">
      {['', ...tags].map(t => <button key={t} aria-pressed={tag.value === t} onClick$={() => tag.value = t}>{t || 'All recipes'}</button>)}
    </div>
    <div class="recipe-grid">{recipes.filter(recipe => !tag.value || recipe.tags?.includes(tag.value)).map(recipe => <section class="recipe-card" key={recipe.path}>
      <h2><a href={recipe.path}>{recipe.title}</a></h2>
      <p>{recipe.description}</p>
      <div class="recipe-meta">{recipe.tags?.map(t => <span class="recipe-tag" key={t}>{t}</span>)}</div>
    </section>)}</div>
    {!recipes.length && <p>No recipes yet. Something good is on the way.</p>}
  </div>;
});
