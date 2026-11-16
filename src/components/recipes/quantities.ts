const unicode: Record<string, number> = { '½': 1/2, '¼': 1/4, '¾': 3/4, '⅓': 1/3, '⅔': 2/3, '⅛': 1/8 };
const amount = String.raw`(?:\d+\s+\d+\/\d+|\d+\/\d+|\d+(?:\.\d+)?\s*[½¼¾⅓⅔⅛]|\d+(?:\.\d+)?|[½¼¾⅓⅔⅛])`;
const leading = new RegExp(`^(${amount})(?:\\s*(?:-|–|to)\\s*(${amount}))?(?=\\s|[a-zA-Z]|$)(.*)$`);

function value(input: string): number {
  const last = input.slice(-1);
  if (unicode[last]) return Number(input.slice(0, -1).trim() || 0) + unicode[last];
  if (input.includes('/')) {
    const parts = input.trim().split(/\s+/);
    const [n, d] = parts.pop()!.split('/').map(Number);
    return Number(parts[0] || 0) + n / d;
  }
  return Number(input);
}

export function parseQuantity(line: string) {
  const match = line.match(leading);
  if (!match) return null;
  const amounts = [value(match[1]), ...(match[2] ? [value(match[2])] : [])];
  if (amounts.some(n => !Number.isFinite(n))) return null;
  return { amounts, rest: match[3] };
}

function format(n: number, unit: string): string {
  if (/^(g|grams?)\b/i.test(unit)) return String(Math.round(n));
  if (/^(kg|kilograms?|ml|millilit(?:er|re)s?|l|lit(?:er|re)s?)\b/i.test(unit)) return String(Number(n.toFixed(2)));
  const fractions = [[0, ''], [1/8, '1/8'], [1/4, '1/4'], [1/3, '1/3'], [1/2, '1/2'], [2/3, '2/3'], [3/4, '3/4'], [1, ''] ] as const;
  let whole = Math.floor(n);
  const part = n - whole;
  const nearest = fractions.reduce((best, f) => Math.abs(f[0] - part) < Math.abs(best[0] - part) ? f : best);
  if (nearest[0] === 1) whole++;
  if (!whole && !nearest[1] && n > 0) return String(Number(n.toFixed(2)));
  return [whole || '', nearest[1]].filter(Boolean).join(' ') || '0';
}

const units: Record<string, string> = { cup: 'cups', can: 'cans', loaf: 'loaves', clove: 'cloves', head: 'heads', slice: 'slices', jar: 'jars', pinch: 'pinches', handful: 'handfuls' };

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

export function scaleQuantity(line: string, scale: number): string {
  const parsed = parseQuantity(line);
  if (!parsed || !Number.isFinite(scale) || scale <= 0) return line;
  const packageSize = parsed.rest.match(/^\s*\([^()]*\)\s+(?=[a-z])/i)?.[0] ?? '';
  const rest = packageSize + parsed.rest.slice(packageSize.length).replace(/\((about\s+|approx\.?\s+)?([^()]*)\)/g, (original, prefix: string | undefined, contents: string) =>
    parseQuantity(contents) ? `(${prefix ?? ''}${contents.split(/\s*\+\s*/).map(part => scaleQuantity(part, scale)).join(' + ')})` : original);
  return parsed.amounts.map(n => format(n * scale, parsed.rest.trim())).join('–') + inflectUnit(rest, Math.max(...parsed.amounts) * scale > 1);
}
