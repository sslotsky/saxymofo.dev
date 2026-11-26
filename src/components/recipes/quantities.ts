import type { Lang } from '~/i18n';

const unicode: Record<string, number> = { '½': 1/2, '¼': 1/4, '¾': 3/4, '⅓': 1/3, '⅔': 2/3, '⅛': 1/8 };
const localeOf: Record<Lang, string> = { en: 'en-US', ru: 'ru-RU', uk: 'uk-UA' };
const pattern = (lang: Lang) => {
  const decimal = lang === 'en' ? String.raw`\.` : '[.,]';
  const amount = String.raw`(?:\d+\s+\d+\/\d+|\d+\/\d+|\d+(?:${decimal}\d+)?\s*[½¼¾⅓⅔⅛]|\d+(?:${decimal}\d+)?|[½¼¾⅓⅔⅛])`;
  const range = lang === 'en' ? '-|–|to' : '-|–';
  return new RegExp(`^(${amount})(?:\\s*(?:${range})\\s*(${amount}))?(?=\\s|\\p{L}|$)(.*)$`, 'u');
};
const patterns = { en: pattern('en'), ru: pattern('ru'), uk: pattern('uk') };

function value(raw: string): number {
  const input = raw.replace(',', '.');
  const last = input.slice(-1);
  if (unicode[last]) return Number(input.slice(0, -1).trim() || 0) + unicode[last];
  if (input.includes('/')) {
    const parts = input.trim().split(/\s+/);
    const [n, d] = parts.pop()!.split('/').map(Number);
    return Number(parts[0] || 0) + n / d;
  }
  return Number(input);
}

export function parseQuantity(line: string, lang: Lang = 'en') {
  const match = line.match(patterns[lang]);
  if (!match) return null;
  const amounts = [value(match[1]), ...(match[2] ? [value(match[2])] : [])];
  if (amounts.some(n => !Number.isFinite(n))) return null;
  return { amounts, rest: match[3] };
}

const decimal = (n: number, lang: Lang) => String(Number(n.toFixed(2))).replace('.', lang === 'en' ? '.' : ',');

function format(n: number, unit: string, lang: Lang): string {
  if (/^(g|grams?|г)(?!\p{L})/iu.test(unit)) return String(Math.round(n));
  if (/^(kg|kilograms?|ml|millilit(?:er|re)s?|l|lit(?:er|re)s?|кг|мл|л)(?!\p{L})/iu.test(unit)) return decimal(n, lang);
  const fractions = [[0, ''], [1/8, '1/8'], [1/4, '1/4'], [1/3, '1/3'], [1/2, '1/2'], [2/3, '2/3'], [3/4, '3/4'], [1, ''] ] as const;
  let whole = Math.floor(n);
  const part = n - whole;
  const nearest = fractions.reduce((best, f) => Math.abs(f[0] - part) < Math.abs(best[0] - part) ? f : best);
  if (nearest[0] === 1) whole++;
  if (!whole && !nearest[1] && n > 0) return decimal(n, lang);
  return [whole || '', nearest[1]].filter(Boolean).join(' ') || '0';
}

const units: Record<string, string> = { cup: 'cups', can: 'cans', loaf: 'loaves', clove: 'cloves', head: 'heads', slice: 'slices', jar: 'jars', pinch: 'pinches', handful: 'handfuls', pepper: 'peppers', batch: 'batches', serving: 'servings', portion: 'portions', egg: 'eggs', orange: 'oranges' };

type Forms = Record<Intl.LDMLPluralRule, string>;
const forms = (one: string, few: string, many: string, other = few): Partial<Forms> => ({ one, few, many, other });
const cyrillicUnits: Record<'ru' | 'uk', Partial<Forms>[]> = {
  ru: [
    forms('стакан', 'стакана', 'стаканов'), forms('банка', 'банки', 'банок'), forms('буханка', 'буханки', 'буханок'),
    forms('зубчик', 'зубчика', 'зубчиков'), forms('головка', 'головки', 'головок'), forms('ломтик', 'ломтика', 'ломтиков'),
    forms('щепотка', 'щепотки', 'щепоток'), forms('горсть', 'горсти', 'горстей'), forms('яйцо', 'яйца', 'яиц'),
    forms('порция', 'порции', 'порций'), forms('штука', 'штуки', 'штук'), forms('пучок', 'пучка', 'пучков'),
    forms('лист', 'листа', 'листов'), forms('стручок', 'стручка', 'стручков'), forms('луковица', 'луковицы', 'луковиц'),
    forms('лайм', 'лайма', 'лаймов'), forms('лимон', 'лимона', 'лимонов'), forms('фунт', 'фунта', 'фунтов'), forms('апельсин', 'апельсина', 'апельсинов'),
    forms('батон', 'батона', 'батонов'), forms('перец', 'перца', 'перцев'),
    forms('блин', 'блина', 'блинов'), forms('тортилья', 'тортильи', 'тортилий'),
  ],
  uk: [
    forms('склянка', 'склянки', 'склянок'), forms('банка', 'банки', 'банок'), forms('буханка', 'буханки', 'буханок'),
    forms('зубчик', 'зубчики', 'зубчиків', 'зубчика'), forms('головка', 'головки', 'головок'), forms('скибочка', 'скибочки', 'скибочок'),
    forms('дрібка', 'дрібки', 'дрібок'), forms('жменя', 'жмені', 'жмень'), forms('яйце', 'яйця', 'яєць'),
    forms('порція', 'порції', 'порцій'), forms('штука', 'штуки', 'штук'), forms('пучок', 'пучки', 'пучків', 'пучка'),
    forms('лист', 'листи', 'листів', 'листа'), forms('стручок', 'стручки', 'стручків', 'стручка'), forms('цибулина', 'цибулини', 'цибулин'),
    forms('лайм', 'лайми', 'лаймів', 'лайма'), forms('лимон', 'лимони', 'лимонів', 'лимона'), forms('фунт', 'фунти', 'фунтів', 'фунта'), forms('апельсин', 'апельсини', 'апельсинів'),
    forms('батон', 'батони', 'батонів', 'батона'), forms('перець', 'перці', 'перців', 'перцю'),
    forms('млинець', 'млинці', 'млинців', 'млинця'), forms('тортилья', 'тортильї', 'тортилій'),
  ],
};
const invariant = /^(г|кг|мл|л|ст|ч|унц|шт|см|мм)$/;
const plurals = { ru: new Intl.PluralRules(localeOf.ru), uk: new Intl.PluralRules(localeOf.uk) };

function inflectCyrillic(text: string, n: number, lang: 'ru' | 'uk'): string {
  const category = plurals[lang].select(n);
  let found = false;
  return text.replace(/\([^()]*\)|\p{L}+/gu, word => {
    if (found || word.startsWith('(')) return word;
    const lower = word.toLowerCase();
    if (invariant.test(lower)) {
      found = true;
      return word;
    }
    const unit = cyrillicUnits[lang].find(f => Object.values(f).includes(lower));
    if (!unit) return word;
    found = true;
    const result = unit[category] ?? unit.other!;
    return word[0] === word[0].toUpperCase() ? result[0].toUpperCase() + result.slice(1) : result;
  });
}

function inflectUnit(text: string, plural: boolean): string {
  let found = false;
  return text.replace(/\([^()]*\)|\b[a-z]+\b/gi, word => {
    if (found || word.startsWith('(')) return word;
    const lower = word.toLowerCase();
    if (/^(g|kg|tbsp|tsp|oz|ml|l|grams?|kilograms?|milliliters?|liters?)$/.test(lower)) {
      found = true;
      return word;
    }
    const singular = Object.keys(units).find(unit => unit === lower || units[unit] === lower);
    if (!singular) return word;
    found = true;
    const result = plural ? units[singular] : singular;
    return word[0] === word[0].toUpperCase() ? result[0].toUpperCase() + result.slice(1) : result;
  });
}

export function scaleQuantity(line: string, scale: number, lang: Lang = 'en'): string {
  const parsed = parseQuantity(line, lang);
  if (!parsed || !Number.isFinite(scale) || scale <= 0) return line;
  const packageSize = parsed.rest.match(/^\s*\([^()]*\)\s+(?=\p{L})/u)?.[0] ?? '';
  const rest = packageSize + parsed.rest.slice(packageSize.length).replace(/\((about\s+|approx\.?\s+|около\s+|примерно\s+|приблизно\s+|близько\s+)?([^()]*)\)/gu, (original, prefix: string | undefined, contents: string) =>
    parseQuantity(contents, lang) ? `(${prefix ?? ''}${contents.split(/\s*\+\s*/).map(part => scaleQuantity(part, scale, lang)).join(' + ')})` : original);
  const amounts = parsed.amounts.map(n => format(n * scale, parsed.rest.trim(), lang));
  if (lang === 'en') return amounts.join('–') + inflectUnit(rest, Math.max(...parsed.amounts) * scale > 1);
  return amounts.join('–') + inflectCyrillic(rest, value(amounts[amounts.length - 1]), lang);
}
