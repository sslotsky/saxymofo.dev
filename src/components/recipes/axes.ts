import type { IngredientGroup } from "./ingredients";

export type ParamValue = string | number;
export interface AxisOption {
  slug: string;
  label: string;
  description?: string;
  time?: string;
  params?: Record<string, ParamValue>;
  legacy?: string[];
}
export interface Axis {
  id: string;
  label: string;
  default: string;
  legacyParam?: string;
  options: AxisOption[];
}
export type AxisState = Record<string, string>;

const RESERVED = new Set(["scale", "lang", "v", "s"]);

export function axisState(
  axes: Axis[] | undefined,
  search: URLSearchParams,
): AxisState {
  const state: AxisState = {};
  for (const axis of axes ?? []) {
    const value = search.get(axis.id);
    const legacy = axis.legacyParam ? search.get(axis.legacyParam) : null;
    const option =
      axis.options.find((o) => o.slug === value) ??
      (legacy
        ? axis.options.find((o) => o.legacy?.includes(legacy))
        : undefined);
    state[axis.id] = option?.slug ?? axis.default;
  }
  return state;
}

export function selectedOptions(axes: Axis[] | undefined, state: AxisState) {
  return (axes ?? []).map((axis) => ({
    axis,
    option:
      axis.options.find((o) => o.slug === state[axis.id]) ??
      axis.options.find((o) => o.slug === axis.default)!,
  }));
}

export function axisParams(
  axes: Axis[] | undefined,
  state: AxisState,
): Record<string, ParamValue> {
  return Object.assign(
    {},
    ...selectedOptions(axes, state).map(({ option }) => option.params ?? {}),
  );
}

export function resolveLine(
  line: string,
  params: Record<string, ParamValue>,
): string | null {
  const result = { hidden: false };
  const text = line.replace(/\{(\w+)\}/g, (token, name: string) => {
    if (!(name in params)) return token;
    if (params[name] === 0) result.hidden = true;
    return String(params[name]);
  });
  return result.hidden ? null : text;
}

export function resolveGroups(
  groups: IngredientGroup[] = [],
  params: Record<string, ParamValue>,
): IngredientGroup[] {
  return groups
    .map((group) => ({
      ...group,
      items: group.items
        .map((item) => resolveLine(item, params))
        .filter((item): item is string => item !== null),
    }))
    .filter((group) => group.items.length);
}

export function axisSearch(
  search: string,
  axes: Axis[] | undefined,
  state: AxisState,
) {
  const params = new URLSearchParams(search);
  for (const axis of axes ?? []) {
    if (axis.legacyParam) params.delete(axis.legacyParam);
    if (!state[axis.id] || state[axis.id] === axis.default)
      params.delete(axis.id);
    else params.set(axis.id, state[axis.id]);
  }
  const query = params.toString();
  return query ? `?${query}` : "";
}

export function matchesWhen(
  conditions: Record<string, unknown>,
  state: AxisState,
) {
  return Object.entries(conditions).every(
    ([id, value]) =>
      !(id in state) ||
      typeof value !== "string" ||
      value
        .split(",")
        .map((v) => v.trim())
        .includes(state[id]),
  );
}

export function axisErrors(axes: unknown): string[] {
  if (axes === undefined || axes === null) return [];
  if (!Array.isArray(axes)) return ["axes must be a list"];
  const ids = new Set<string>();
  return axes.flatMap((axis, index) => {
    const label = `axes[${index}]`;
    if (typeof axis !== "object" || axis === null)
      return [`${label} must be an object`];
    const a = axis as Record<string, unknown>;
    const errors: string[] = [];
    if (typeof a.id !== "string" || !/^[a-z][a-z0-9-]*$/.test(a.id))
      return [`${label}.id must be a lowercase identifier`];
    if (RESERVED.has(a.id))
      errors.push(`${label}.id "${a.id}" is a reserved URL parameter`);
    if (ids.has(a.id)) errors.push(`${label}.id "${a.id}" is duplicated`);
    ids.add(a.id);
    if (typeof a.label !== "string")
      errors.push(`${label}.label must be a string`);
    if (!Array.isArray(a.options) || !a.options.length)
      return [...errors, `${label}.options must be a non-empty list`];
    const slugs = new Set<string>();
    a.options.forEach((option, i) => {
      const ol = `${label}.options[${i}]`;
      if (typeof option !== "object" || option === null)
        return errors.push(`${ol} must be an object`);
      const o = option as Record<string, unknown>;
      if (typeof o.slug !== "string" || !/^[a-z0-9][a-z0-9-]*$/.test(o.slug))
        return errors.push(
          `${ol}.slug must be lowercase letters, digits and dashes`,
        );
      if (slugs.has(o.slug))
        errors.push(`${ol}.slug "${o.slug}" is duplicated`);
      slugs.add(o.slug);
      if (typeof o.label !== "string")
        errors.push(`${ol}.label must be a string`);
      for (const key of ["description", "time"])
        if (o[key] !== undefined && typeof o[key] !== "string")
          errors.push(`${ol}.${key} must be a string`);
      if (
        o.params !== undefined &&
        (typeof o.params !== "object" ||
          o.params === null ||
          Object.values(o.params).some(
            (v) => typeof v !== "string" && typeof v !== "number",
          ))
      )
        errors.push(`${ol}.params values must be strings or numbers`);
    });
    if (typeof a.default !== "string" || !slugs.has(a.default))
      errors.push(`${label}.default must be one of its option slugs`);
    return errors;
  });
}
