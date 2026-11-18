import { CERTS } from '../data';
import type { CertId } from '../data/types';
import { normalize } from './text';

export type HitKind = 'cert' | 'domain' | 'concept' | 'branch' | 'card' | 'trap';

export interface SearchItem {
  kind: HitKind;
  cert: CertId;
  title: string;
  detail: string;
  /** Đường dẫn trong app. */
  to: string;
  /** Mục cần cuộn tới sau khi mở trang (id phần tử). */
  scrollTo?: string;
  color: string;
  haystack: string;
}

export const KIND_LABEL: Record<HitKind, string> = {
  cert: 'Chứng chỉ',
  domain: 'Nhóm kiến thức',
  concept: 'Khái niệm',
  branch: 'Bản đồ tư duy',
  card: 'Flashcard',
  trap: 'Bẫy đề thi',
};

function build(): SearchItem[] {
  const items: SearchItem[] = [];
  for (const c of CERTS) {
    const color = c.theme.color;
    const push = (it: Omit<SearchItem, 'haystack' | 'cert' | 'color'>) =>
      items.push({ ...it, cert: c.id, color, haystack: normalize(`${it.title} ${it.detail} ${c.short}`) });

    push({ kind: 'cert', title: c.title, detail: c.tagline, to: `/cert/${c.id}` });
    c.domains.forEach((d) =>
      push({ kind: 'domain', title: d.title, detail: `${d.sub} · ${d.points.join(' ')}`, to: `/cert/${c.id}`, scrollTo: 'domains' }),
    );
    c.concepts.forEach((k) => push({ kind: 'concept', title: k.term, detail: k.def, to: `/cert/${c.id}`, scrollTo: 'concepts' }));
    c.traps.forEach((t) => push({ kind: 'trap', title: t.title, detail: t.body, to: `/cert/${c.id}`, scrollTo: 'traps' }));
    c.mindmap.forEach((b, i) =>
      push({ kind: 'branch', title: b.title, detail: `${b.leaves.join(' · ')} — ${b.summary}`, to: `/cert/${c.id}/map?branch=${i}` }),
    );
    c.flashcards.forEach((f) => push({ kind: 'card', title: f.q, detail: f.a, to: `/review?cert=${c.id}` }));
  }
  return items;
}

const INDEX = build();

export function search(query: string, limit = 30): SearchItem[] {
  const q = normalize(query.trim());
  if (!q) return INDEX.filter((i) => i.kind === 'cert');
  const terms = q.split(/\s+/);
  return INDEX.map((it) => {
    const title = normalize(it.title);
    let score = 0;
    for (const t of terms) {
      if (!it.haystack.includes(t)) return null;
      score += title.includes(t) ? (title.startsWith(t) ? 6 : 4) : 1;
    }
    return { it, score };
  })
    .filter((x): x is { it: SearchItem; score: number } => x !== null)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((x) => x.it);
}
