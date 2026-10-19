import { slugify } from './slugify';

export interface TocEntry {
  id: string;
  text: string;
  level: 2 | 3;
}

const decode = (s: string) =>
  s
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .trim();

/**
 * Gives every h2/h3 in sanitized article HTML a stable, unique id and returns the outline for the
 * table of contents. The backend strips attributes from headings, so plain `<h2>` tags are matched.
 */
export function prepareArticle(html: string): { html: string; toc: TocEntry[] } {
  const toc: TocEntry[] = [];
  const used = new Map<string, number>();
  const out = html.replace(/<h([23])>([\s\S]*?)<\/h\1>/g, (_m, lvl: string, inner: string) => {
    const text = decode(inner);
    const base = slugify(text) || 'section';
    const n = (used.get(base) ?? 0) + 1;
    used.set(base, n);
    const id = n === 1 ? base : `${base}-${n}`;
    if (text) toc.push({ id, text, level: lvl === '2' ? 2 : 3 });
    return `<h${lvl} id="${id}">${inner}</h${lvl}>`;
  });
  return { html: out, toc };
}
