/**
 * Article typography, shared by the editor and the public post page so a post reads the same in
 * both places. Applied to sanitized HTML from the backend.
 */
export const PROSE = [
  'text-base leading-7 text-fg',
  '[&_h2]:mt-8 [&_h2]:mb-3 [&_h2]:text-h2 [&_h2]:font-semibold',
  '[&_h3]:mt-6 [&_h3]:mb-2 [&_h3]:text-h3 [&_h3]:font-semibold',
  '[&_h4]:mt-5 [&_h4]:mb-2 [&_h4]:font-semibold',
  '[&_p]:my-4',
  '[&_ul]:my-4 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:my-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_li]:my-1',
  '[&_blockquote]:my-5 [&_blockquote]:border-l-4 [&_blockquote]:border-primary [&_blockquote]:pl-4 [&_blockquote]:text-fg-muted',
  '[&_a]:text-primary [&_a]:underline [&_a]:underline-offset-2',
  '[&_img]:my-6 [&_img]:h-auto [&_img]:max-w-full [&_img]:rounded-md',
  '[&_code]:rounded-sm [&_code]:bg-surface-muted [&_code]:px-1 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-sm',
  '[&_pre]:my-5 [&_pre]:overflow-x-auto [&_pre]:rounded-md [&_pre]:bg-surface-inverse [&_pre]:p-4 [&_pre]:text-fg-inverse',
  '[&_pre_code]:bg-transparent [&_pre_code]:p-0',
  '[&_hr]:my-8 [&_hr]:border-border',
].join(' ');
