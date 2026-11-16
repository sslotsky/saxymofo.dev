import { component$, createContextId, Slot, useContext } from '@builder.io/qwik';
import type { Signal } from '@builder.io/qwik';
import { scaleQuantity } from './quantities';
export { mergeIngredients } from './ingredients';
export type { Recipe } from './ingredients';

export const recipeContext = createContextId<{ scale: Signal<number>; variation: Signal<string> }>('recipe');
export const variationSlug = (name: string) => name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const InlineQuantity = component$((props: { text: string }) => {
  const state = useContext(recipeContext);
  return <span>{scaleQuantity(props.text, state.scale.value)}</span>;
});
export function Q(props: { children?: string }) {
  return <InlineQuantity text={props.children ?? ''} />;
}
export const Variation = component$((props: { name: string }) => {
  const state = useContext(recipeContext);
  return state.variation.value === variationSlug(props.name) ? <Slot /> : null;
});
