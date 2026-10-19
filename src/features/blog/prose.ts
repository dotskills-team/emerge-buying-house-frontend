/**
 * Article typography, shared by the editor and the public post page so a post reads the same in
 * both places. Applied to sanitized HTML from the backend.
 */
export const PROSE = [
  'text-[1.0625rem] leading-8 text-fg',
  '[&_h2]:mt-12 [&_h2]:mb-4 [&_h2]:font-display [&_h2]:text-h2 [&_h2]:font-semibold [&_h2]:tracking-tight [&_h2]:scroll-mt-28',
  '[&_h3]:mt-8 [&_h3]:mb-3 [&_h3]:font-display [&_h3]:text-h3 [&_h3]:font-semibold [&_h3]:scroll-mt-28',
  '[&_h4]:mt-6 [&_h4]:mb-2 [&_h4]:font-semibold',
  '[&_p]:my-5',
  '[&_ul]:my-5 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:my-5 [&_ol]:list-decimal [&_ol]:pl-6 [&_li]:my-1.5 [&_li]:pl-1 [&_li::marker]:text-secondary',
  '[&_blockquote]:my-8 [&_blockquote]:rounded-r-2xl [&_blockquote]:border-l-4 [&_blockquote]:border-gold [&_blockquote]:bg-secondary-soft/60 [&_blockquote]:px-6 [&_blockquote]:py-4 [&_blockquote]:font-display [&_blockquote]:text-xl [&_blockquote]:leading-relaxed [&_blockquote]:text-fg [&_blockquote_p]:my-2',
  '[&_a]:text-primary [&_a]:font-medium [&_a]:underline [&_a]:decoration-primary/30 [&_a]:underline-offset-4 hover:[&_a]:decoration-primary',
  '[&_strong]:font-semibold [&_strong]:text-fg',
  '[&_img]:my-8 [&_img]:h-auto [&_img]:max-w-full [&_img]:rounded-2xl',
  '[&_figcaption]:-mt-5 [&_figcaption]:mb-8 [&_figcaption]:text-center [&_figcaption]:text-sm [&_figcaption]:text-fg-subtle',
  '[&_code]:rounded-sm [&_code]:bg-surface-muted [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-[0.9em]',
  '[&_pre]:my-6 [&_pre]:overflow-x-auto [&_pre]:rounded-2xl [&_pre]:bg-surface-inverse [&_pre]:p-5 [&_pre]:text-sm [&_pre]:leading-6 [&_pre]:text-fg-inverse',
  '[&_pre_code]:bg-transparent [&_pre_code]:p-0',
  '[&_hr]:my-12 [&_hr]:border-border',
].join(' ');
