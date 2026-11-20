import { component$, Slot } from '@builder.io/qwik';
import type { JSXChildren } from '@builder.io/qwik';
import { LINKS } from '../../data/links';
import type { LinkId, ReferenceLink } from '../../data/links';

const ReferenceAnchor = component$((props: { entry: ReferenceLink; hasChildren: boolean }) => (
  <a href={props.entry.url} target="_blank" rel={props.entry.affiliate ? 'sponsored noopener noreferrer' : 'noopener noreferrer'}>
    {props.hasChildren ? <Slot /> : props.entry.label}
  </a>
));

export function Ref(props: { id: LinkId; children?: JSXChildren }) {
  const entry: ReferenceLink | undefined = Object.hasOwn(LINKS, props.id) ? LINKS[props.id] : undefined;
  if (!entry) throw Error(`Unknown reference link id: ${props.id}`);
  return <ReferenceAnchor entry={entry} hasChildren={props.children !== undefined}>{props.children}</ReferenceAnchor>;
}
