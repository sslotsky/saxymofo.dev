// @ts-ignore Node's native TypeScript runner needs the source extension.
import { LINKS } from '../../data/links.ts';
import type { LinkId, ReferenceLink } from '../../data/links';

export function referenceIds(source: string): string[] {
  return [...source.matchAll(/<Ref\s+[^>]*id=["']([^"']+)["']/g)].map(match => match[1]);
}

export function hasAffiliateReferences(source: string): boolean {
  return referenceIds(source).some(id => Object.hasOwn(LINKS, id) && (LINKS[id as LinkId] as ReferenceLink).affiliate === true);
}
