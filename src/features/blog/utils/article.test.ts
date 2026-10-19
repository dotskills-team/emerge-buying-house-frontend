import { describe, expect, it } from 'vitest';
import { prepareArticle } from './article';
import { displayStatus, wordCount } from './status';

describe('prepareArticle', () => {
  it('adds unique ids to h2/h3 and builds the outline', () => {
    const { html, toc } = prepareArticle(
      '<h2>Why <strong>AQL</strong> matters</h2><p>x</p><h3>Sampling &amp; levels</h3><h2>Why AQL matters</h2><h4>Skip</h4>',
    );
    expect(toc).toEqual([
      { id: 'why-aql-matters', text: 'Why AQL matters', level: 2 },
      { id: 'sampling-levels', text: 'Sampling & levels', level: 3 },
      { id: 'why-aql-matters-2', text: 'Why AQL matters', level: 2 },
    ]);
    expect(html).toContain('<h2 id="why-aql-matters">Why <strong>AQL</strong> matters</h2>');
    expect(html).toContain('<h4>Skip</h4>');
  });
});

describe('displayStatus', () => {
  const now = Date.parse('2026-10-19T10:00:00Z');
  it('treats a published post with a future date as scheduled', () => {
    expect(displayStatus({ status: 'published', publishedAt: '2026-10-20T10:00:00Z' }, now)).toBe(
      'scheduled',
    );
    expect(displayStatus({ status: 'published', publishedAt: '2026-10-18T10:00:00Z' }, now)).toBe(
      'published',
    );
    expect(displayStatus({ status: 'draft', publishedAt: null }, now)).toBe('draft');
  });
});

describe('wordCount', () => {
  it('counts words across tags and entities', () => {
    expect(wordCount('<p>One&nbsp;two</p><p>three</p>')).toBe(3);
    expect(wordCount('')).toBe(0);
  });
});
