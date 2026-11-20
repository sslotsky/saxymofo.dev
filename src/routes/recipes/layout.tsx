import { $, component$, Slot, useComputed$, useContextProvider, useSignal, useStyles$, useTask$ } from '@builder.io/qwik';
import { useLocation } from '@builder.io/qwik-city';
import { mergeIngredients, optionKey, recipeContext } from '~/components/recipes/recipe';
import { activeOption, BASE, recipeSearch } from '~/components/recipes/options';
import type { Recipe } from '~/components/recipes/recipe';
import { scaleQuantity } from '~/components/recipes/quantities';
import { axisParams, axisSearch, axisState, resolveGroups, selectedOptions } from '~/components/recipes/axes';
import type { AxisState } from '~/components/recipes/axes';
import styles from './styles.css?inline';
import { langOf, localHref } from '~/i18n';
import { t, tagLabel } from '~/i18n/messages';
import { PageContent, useLocalizedHead } from '~/i18n/page';

export default component$(() => {
  useStyles$(styles);
  const head = useLocalizedHead();
  const loc = useLocation();
  const lang = langOf(loc.url);
  const search = useSignal(loc.url.search);
  useTask$(({ track }) => {
    search.value = track(() => loc.url.search);
  });
  const copied = useSignal('');
  const frontmatter = head.frontmatter as Recipe;
  const recipe = useComputed$(() => frontmatter);
  const scale = useComputed$(() => {
    if (recipe.value.scalable === false) return 1;
    const number = Number(new URLSearchParams(search.value).get('scale') ?? 1);
    return Number.isFinite(number) && number > 0 ? number : 1;
  });
  const variation = useComputed$(() => activeOption(recipe.value.variations, new URLSearchParams(search.value).get('v')));
  const schedule = useComputed$(() => activeOption(recipe.value.schedules, new URLSearchParams(search.value).get('s')));
  const axes = useComputed$(() => axisState(recipe.value.axes, new URLSearchParams(search.value)));
  const params = useComputed$(() => axisParams(recipe.value.axes, axes.value));
  const chosen = useComputed$(() => selectedOptions(recipe.value.axes, axes.value));
  useContextProvider(recipeContext, { scale, variation, schedule, axes, params });
  const update = $((next: { scale?: number; variation?: string; schedule?: string; axes?: AxisState }) => {
    const state = { scale: next.scale ?? scale.value, variation: next.variation ?? variation.value, schedule: next.schedule ?? schedule.value };
    if (!Number.isFinite(state.scale) || state.scale <= 0) return;
    const url = new URL(window.location.href);
    url.search = axisSearch(recipeSearch(url.search, state), recipe.value.axes, { ...axes.value, ...next.axes });
    window.history.replaceState(window.history.state, '', url);
    search.value = url.search;
  });
  const selected = useComputed$(() => recipe.value.variations?.find(v => optionKey(v) === variation.value));
  const selectedSchedule = useComputed$(() => recipe.value.schedules?.find(s => optionKey(s) === schedule.value));
  const time = useComputed$(() => selectedSchedule.value?.time ?? chosen.value.map(c => c.option.time).find(Boolean) ?? recipe.value.time);
  const groups = useComputed$(() => resolveGroups(mergeIngredients(recipe.value.ingredients, selected.value), params.value));
  if (head.frontmatter.notARecipe) return <Slot />;
  return <div class="recipe">
    <a class="recipe-back" href={localHref('/recipes/', lang)}>{t(lang, 'recipes.back')}</a>
    <h1>{head.title}</h1>
    <p class="recipe-description">{head.meta.find(m => m.name === 'description')?.content}</p>
    <div class="recipe-meta">
      {time.value && <span>{t(lang, 'recipes.time')}: {time.value}</span>}
      {recipe.value.tags?.map(tag => <span class="recipe-tag" key={tag}>{tagLabel(lang, tag)}</span>)}
    </div>
    <section class="recipe-panel" aria-label={t(lang, 'recipes.panel')}>
      {recipe.value.scalable !== false && <div class="recipe-controls">
        <strong>{t(lang, 'recipes.scaleHeading')}</strong>
        <div class="recipe-buttons" role="group" aria-label={t(lang, 'recipes.scaleGroup')}>
          {[0.5, 1, 2, 3].map(n => <button key={n} aria-pressed={scale.value === n} onClick$={() => update({ scale: n })}>{n === 0.5 ? '½' : n}×</button>)}
          <label>{t(lang, 'recipes.custom')} <input type="number" min="0.01" step="any" value={scale.value} onChange$={(_, el) => update({ scale: el.valueAsNumber })} /></label>
        </div>
      </div>}
      {recipe.value.yield && <p class="recipe-yield">{t(lang, 'recipes.yield')}: <strong>{scaleQuantity(String(recipe.value.yield), scale.value, lang)}</strong></p>}
      {chosen.value.map(({ axis, option }) => <div key={axis.id}>
        <div class="recipe-controls">
          <strong>{axis.label}</strong>
          <div class="recipe-buttons" role="group" aria-label={axis.label}>
            {axis.options.map(o => <button key={o.slug} aria-pressed={option.slug === o.slug} onClick$={() => update({ axes: { [axis.id]: o.slug } })}>{o.label}</button>)}
          </div>
        </div>
        {(option.description || option.time) && <p>
          {option.description}
          {option.time && <span class="recipe-schedule-time"> {t(lang, 'recipes.time')}: <strong>{option.time}</strong></span>}
        </p>}
      </div>)}
      {!!recipe.value.variations?.length && <div class="recipe-controls">
        <strong>{recipe.value.variationLabel ?? t(lang, 'recipes.variation')}</strong>
        <div class="recipe-buttons" role="group" aria-label={recipe.value.variationLabel ?? t(lang, 'recipes.variation')}>
          <button aria-pressed={variation.value === BASE} onClick$={() => update({ variation: BASE })}>{recipe.value.baseVariationName ?? t(lang, 'recipes.classic')}</button>
          {recipe.value.variations.map(v => <button key={v.name} aria-pressed={variation.value === optionKey(v)} onClick$={() => update({ variation: optionKey(v) })}>{v.name}</button>)}
        </div>
      </div>}
      {selected.value?.description && <p>{selected.value.description}</p>}
      {!!recipe.value.schedules?.length && <div class="recipe-controls">
        <strong>{recipe.value.scheduleLabel ?? t(lang, 'recipes.schedule')}</strong>
        <div class="recipe-buttons" role="group" aria-label={recipe.value.scheduleLabel ?? t(lang, 'recipes.schedule')}>
          <button aria-pressed={schedule.value === BASE} onClick$={() => update({ schedule: BASE })}>{recipe.value.baseScheduleName ?? t(lang, 'recipes.standard')}</button>
          {recipe.value.schedules.map(s => <button key={s.name} aria-pressed={schedule.value === optionKey(s)} onClick$={() => update({ schedule: optionKey(s) })}>{s.name}</button>)}
        </div>
      </div>}
      {(selectedSchedule.value?.description || selectedSchedule.value?.time) && <p>
        {selectedSchedule.value.description}
        {selectedSchedule.value.time && <span class="recipe-schedule-time"> {t(lang, 'recipes.time')}: <strong>{selectedSchedule.value.time}</strong></span>}
      </p>}
      <h2>{t(lang, recipe.value.scalable === false ? 'recipes.shoppingList' : 'recipes.ingredients')}</h2>
      {groups.value.map((group, i) => <div class="recipe-group" key={`${variation.value}-${search.value}-${i}`}>
        {group.group && <h3>{group.group}</h3>}
        <ul class="recipe-ingredients">{group.items.map((item, j) => <li key={j}><label><input type="checkbox" /> <span class="recipe-quantity">
          {recipe.value.scalable !== false && [0.5, 1, 2, 3].map(n => <span key={n} class="recipe-quantity-size" aria-hidden="true">{scaleQuantity(item, n, lang)}</span>)}
          <span>{scaleQuantity(item, scale.value, lang)}</span>
        </span></label></li>)}</ul>
      </div>)}
      <div class="recipe-controls"><button onClick$={async () => {
        try {
          await navigator.clipboard.writeText(groups.value.map(group => [group.group, ...group.items.map(item => scaleQuantity(item, scale.value, lang))].filter(Boolean).join('\n')).join('\n\n'));
          copied.value = t(lang, 'recipes.copied');
        } catch { copied.value = t(lang, 'recipes.copyFailed'); }
      }}>{t(lang, recipe.value.scalable === false ? 'recipes.copyShopping' : 'recipes.copyIngredients')}</button> <span role="status">{copied.value}</span></div>
    </section>
    <div class="recipe-body"><PageContent><Slot /></PageContent></div>
  </div>;
});
