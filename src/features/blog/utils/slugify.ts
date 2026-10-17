/** Mirrors the backend slugify so the preview matches what gets saved. Keeps Bangla letters. */
export function slugify(input: string): string {
  return input
    .normalize('NFKC')
    .toLowerCase()
    .trim()
    .replace(/[^\p{L}\p{N}\p{M}]+/gu, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 120);
}
