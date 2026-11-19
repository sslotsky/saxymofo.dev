import { component$, createContextId, Slot, useContext } from '@builder.io/qwik';
import type { Signal } from '@builder.io/qwik';
import { scaleQuantity } from './quantities';
import { isActive, optionSlug } from './options';
export { mergeIngredients } from './ingredients';
export type { Recipe } from './ingredients';

export const recipeContext = createContextId<{ scale: Signal<number>; variation: Signal<string>; schedule: Signal<string> }>('recipe');
export const variationSlug = optionSlug;
const InlineQuantity = component$((props: { text: string }) => {
  const state = useContext(recipeContext);
  return <span>{scaleQuantity(props.text, state.scale.value)}</span>;
});
export function Q(props: { children?: string }) {
  return <InlineQuantity text={props.children ?? ''} />;
}
export const Variation = component$((props: { name: string }) => {
  const state = useContext(recipeContext);
  return isActive(state.variation.value, props.name) ? <Slot /> : null;
});
export const Schedule = component$((props: { name: string }) => {
  const state = useContext(recipeContext);
  return isActive(state.schedule.value, props.name) ? <Slot /> : null;
});
