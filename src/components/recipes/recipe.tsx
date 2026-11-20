import { component$, createContextId, Slot, useContext } from '@builder.io/qwik';
import type { Signal } from '@builder.io/qwik';
import { useLocation } from '@builder.io/qwik-city';
import { langOf } from '~/i18n';
import { scaleQuantity } from './quantities';
import { isActive, optionKey, optionSlug } from './options';
import { matchesWhen } from './axes';
import type { AxisState, ParamValue } from './axes';
export { mergeIngredients } from './ingredients';
export type { Recipe } from './ingredients';

export const recipeContext = createContextId<{ scale: Signal<number>; variation: Signal<string>; schedule: Signal<string>; axes: Signal<AxisState>; params: Signal<Record<string, ParamValue>> }>('recipe');
export const variationSlug = optionSlug;
export { optionKey };
const InlineQuantity = component$((props: { text: string; param?: string; unit?: string }) => {
  const state = useContext(recipeContext);
  const lang = langOf(useLocation().url);
  const text = props.param ? `${props.param in state.params.value ? state.params.value[props.param] : ''}${props.unit ? ` ${props.unit}` : ''}` : props.text;
  return <span>{scaleQuantity(text, state.scale.value, lang)}</span>;
});
export function Q(props: { children?: string; param?: string; unit?: string }) {
  return <InlineQuantity text={props.children ?? ''} param={props.param} unit={props.unit} />;
}
export const When = component$((props: Record<string, string>) => {
  const state = useContext(recipeContext);
  return matchesWhen(props, state.axes.value) ? <Slot /> : null;
});
export const Variation = component$((props: { name: string }) => {
  const state = useContext(recipeContext);
  return isActive(state.variation.value, props.name) ? <Slot /> : null;
});
export const Schedule = component$((props: { name: string }) => {
  const state = useContext(recipeContext);
  return isActive(state.schedule.value, props.name) ? <Slot /> : null;
});
