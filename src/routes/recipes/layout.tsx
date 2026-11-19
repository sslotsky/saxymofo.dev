import { $, component$, Slot, useComputed$, useContextProvider, useSignal, useStyles$, useTask$ } from '@builder.io/qwik';
import { useDocumentHead, useLocation } from '@builder.io/qwik-city';
import { mergeIngredients, recipeContext, variationSlug } from '~/components/recipes/recipe';
import { activeOption, BASE, recipeSearch } from '~/components/recipes/options';
import type { Recipe } from '~/components/recipes/recipe';
import { scaleQuantity } from '~/components/recipes/quantities';
import styles from './styles.css?inline';

export default component$(() => {
  useStyles$(styles);
  const head = useDocumentHead();
  const loc = useLocation();
  const search = useSignal(loc.url.search);
  useTask$(({ track }) => {
    search.value = track(() => loc.url.search);
  });
  const copied = useSignal('');
  const recipe = useComputed$(() => head.frontmatter as Recipe);
  const scale = useComputed$(() => {
    if (recipe.value.scalable === false) return 1;
    const number = Number(new URLSearchParams(search.value).get('scale') ?? 1);
    return Number.isFinite(number) && number > 0 ? number : 1;
  });
  const variation = useComputed$(() => activeOption(recipe.value.variations, new URLSearchParams(search.value).get('v')));
  const schedule = useComputed$(() => activeOption(recipe.value.schedules, new URLSearchParams(search.value).get('s')));
  useContextProvider(recipeContext, { scale, variation, schedule });
  const update = $((next: { scale?: number; variation?: string; schedule?: string }) => {
    const state = { scale: next.scale ?? scale.value, variation: next.variation ?? variation.value, schedule: next.schedule ?? schedule.value };
    if (!Number.isFinite(state.scale) || state.scale <= 0) return;
    const url = new URL(window.location.href);
    url.search = recipeSearch(url.search, state);
    window.history.replaceState(window.history.state, '', url);
    search.value = url.search;
  });
  const selected = useComputed$(() => recipe.value.variations?.find(v => variationSlug(v.name) === variation.value));
  const selectedSchedule = useComputed$(() => recipe.value.schedules?.find(s => variationSlug(s.name) === schedule.value));
  const time = useComputed$(() => selectedSchedule.value?.time ?? recipe.value.time);
  const groups = useComputed$(() => mergeIngredients(recipe.value.ingredients, selected.value));
  if (head.frontmatter.notARecipe) return <Slot />;
  return <div class="recipe">
    <a class="recipe-back" href="/recipes/">← All recipes</a>
    <h1>{head.title}</h1>
    <p class="recipe-description">{head.meta.find(m => m.name === 'description')?.content}</p>
    <div class="recipe-meta">
      {time.value && <span>Time: {time.value}</span>}
      {recipe.value.tags?.map(tag => <span class="recipe-tag" key={tag}>{tag}</span>)}
    </div>
    <section class="recipe-panel" aria-label="Recipe ingredients">
      {recipe.value.scalable !== false && <div class="recipe-controls">
        <strong>Make it your size</strong>
        <div class="recipe-buttons" role="group" aria-label="Recipe scale">
          {[0.5, 1, 2, 3].map(n => <button key={n} aria-pressed={scale.value === n} onClick$={() => update({ scale: n })}>{n === 0.5 ? '½' : n}×</button>)}
          <label>Custom <input type="number" min="0.01" step="any" value={scale.value} onChange$={(_, el) => update({ scale: el.valueAsNumber })} /></label>
        </div>
      </div>}
      {recipe.value.yield && <p class="recipe-yield">Yield: <strong>{scaleQuantity(String(recipe.value.yield), scale.value)}</strong></p>}
      {!!recipe.value.variations?.length && <div class="recipe-controls recipe-buttons" role="group" aria-label="Variation">
        <button aria-pressed={variation.value === BASE} onClick$={() => update({ variation: BASE })}>{recipe.value.baseVariationName ?? 'Classic'}</button>
        {recipe.value.variations.map(v => <button key={v.name} aria-pressed={variation.value === variationSlug(v.name)} onClick$={() => update({ variation: variationSlug(v.name) })}>{v.name}</button>)}
      </div>}
      {selected.value?.description && <p>{selected.value.description}</p>}
      {!!recipe.value.schedules?.length && <div class="recipe-controls">
        <strong>Schedule</strong>
        <div class="recipe-buttons" role="group" aria-label="Schedule">
          <button aria-pressed={schedule.value === BASE} onClick$={() => update({ schedule: BASE })}>{recipe.value.baseScheduleName ?? 'Standard'}</button>
          {recipe.value.schedules.map(s => <button key={s.name} aria-pressed={schedule.value === variationSlug(s.name)} onClick$={() => update({ schedule: variationSlug(s.name) })}>{s.name}</button>)}
        </div>
      </div>}
      {(selectedSchedule.value?.description || selectedSchedule.value?.time) && <p>
        {selectedSchedule.value.description}
        {selectedSchedule.value.time && <span class="recipe-schedule-time"> Time: <strong>{selectedSchedule.value.time}</strong></span>}
      </p>}
      <h2>{recipe.value.scalable === false ? 'Shopping list' : 'Ingredients'}</h2>
      {groups.value.map((group, i) => <div class="recipe-group" key={`${variation.value}-${i}`}>
        {group.group && <h3>{group.group}</h3>}
        <ul class="recipe-ingredients">{group.items.map((item, j) => <li key={j}><label><input type="checkbox" /> <span class="recipe-quantity">
          {recipe.value.scalable !== false && [0.5, 1, 2, 3].map(n => <span key={n} class="recipe-quantity-size" aria-hidden="true">{scaleQuantity(item, n)}</span>)}
          <span>{scaleQuantity(item, scale.value)}</span>
        </span></label></li>)}</ul>
      </div>)}
      <div class="recipe-controls"><button onClick$={async () => {
        try {
          await navigator.clipboard.writeText(groups.value.map(group => [group.group, ...group.items.map(item => scaleQuantity(item, scale.value))].filter(Boolean).join('\n')).join('\n\n'));
          copied.value = 'Ingredients copied';
        } catch { copied.value = 'Could not copy. Please select and copy the list manually.'; }
      }}>{recipe.value.scalable === false ? 'Copy shopping list' : 'Copy ingredients'}</button> <span role="status">{copied.value}</span></div>
    </section>
    <div class="recipe-body"><Slot /></div>
  </div>;
});
