// @ts-ignore Node's native TypeScript runner needs the source extension.
import { axisErrors } from './axes.ts';
export const BASE = 'base';

export const optionSlug = (name: string) => name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

export const optionKey = (option: { name: string; slug?: string }) => optionSlug(option.slug ?? option.name);

export function activeOption(options: { name: string; slug?: string }[] | undefined, selected: string | null) {
  return selected && options?.some(option => optionKey(option) === selected) ? selected : BASE;
}

export const isActive = (active: string, name: string) => active === optionSlug(name);

export function recipeSearch(search: string, state: { scale: number; variation: string; schedule: string }) {
  const params = new URLSearchParams(search);
  params.set('scale', String(state.scale));
  params.set('v', state.variation);
  if (state.schedule === BASE) params.delete('s');
  else params.set('s', state.schedule);
  return `?${params}`;
}

export function optionErrors(field: string, options: unknown, stringFields: string[]) {
  if (options === undefined || options === null) return [];
  if (!Array.isArray(options)) return [`${field} must be a list`];
  const seen = new Set<string>();
  return options.flatMap((option, index) => {
    const label = `${field}[${index}]`;
    if (typeof option !== 'object' || option === null) return [`${label} must be an object`];
    const record = option as Record<string, unknown>;
    if (typeof record.name !== 'string' || !record.name.trim()) return [`${label}.name must be a non-empty string`];
    if (record.slug !== undefined && (typeof record.slug !== 'string' || !optionSlug(record.slug))) return [`${label}.slug must be a non-empty string`];
    const slug = optionSlug(typeof record.slug === 'string' ? record.slug : record.name);
    if (!slug) return [`${label} needs a slug when its name has no Latin letters or digits`];
    const errors = stringFields.filter(key => record[key] !== undefined && typeof record[key] !== 'string').map(key => `${label}.${key} must be a string`);
    if (slug === BASE) errors.push(`${label}.name "${record.name}" is reserved for the base option`);
    if (seen.has(slug)) errors.push(`${label}.name "${record.name}" duplicates slug "${slug}"`);
    seen.add(slug);
    return errors;
  });
}

export function recipeOptionErrors(recipe: Record<string, unknown>) {
  const names = ['baseVariationName', 'baseScheduleName', 'variationLabel', 'scheduleLabel'].filter(key => recipe[key] !== undefined && typeof recipe[key] !== 'string').map(key => `${key} must be a string`);
  return [...names, ...optionErrors('variations', recipe.variations, ['description']), ...optionErrors('schedules', recipe.schedules, ['description', 'time']), ...axisErrors(recipe.axes)];
}
