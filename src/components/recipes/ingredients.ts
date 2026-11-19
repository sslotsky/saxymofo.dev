export interface IngredientGroup { group?: string; items: string[] }
export interface RecipeVariation { name: string; description?: string; ingredients?: IngredientGroup[]; add?: IngredientGroup[]; remove?: string[] }
export interface RecipeSchedule { name: string; description?: string; time?: string }
export interface Recipe { title: string; description: string; tags?: string[]; yield?: string; time?: string; scalable?: boolean; baseVariationName?: string; baseScheduleName?: string; variationLabel?: string; scheduleLabel?: string; ingredients: IngredientGroup[]; variations?: RecipeVariation[]; schedules?: RecipeSchedule[] }

export function mergeIngredients(base: IngredientGroup[] = [], variation?: RecipeVariation) {
  const groups = base.map(group => ({ ...group, items: group.items.filter(item => !variation?.remove?.some(text => item.toLowerCase().includes(text.toLowerCase()))) }));
  for (const group of variation?.ingredients ?? []) {
    const index = groups.findIndex(existing => existing.group === group.group);
    const replacement = { ...group, items: [...group.items] };
    if (index < 0) groups.push(replacement);
    else groups[index] = replacement;
  }
  for (const group of variation?.add ?? []) {
    const existing = groups.find(existing => existing.group === group.group);
    if (existing) existing.items = [...existing.items, ...group.items];
    else groups.push({ ...group, items: [...group.items] });
  }
  return groups;
}
