import type { ReactNode } from 'react';

const TOKEN = /(https?:\/\/[^\s<>()]+[^\s<>().,;:!?'"]|[\w.+-]+@[\w-]+(?:\.[\w-]+)+)/g;

/**
 * Answer text as React nodes: web addresses and emails become links, everything else stays plain
 * text (never HTML), and line breaks are kept by the caller's `whitespace-pre-line`.
 */
export function linkify(text: string): ReactNode[] {
  return text.split(TOKEN).map((part, i) => {
    if (i % 2 === 0) return part;
    const isEmail = !part.startsWith('http');
    return (
      <a
        key={i}
        href={isEmail ? `mailto:${part}` : part}
        target={isEmail ? undefined : '_blank'}
        rel={isEmail ? undefined : 'noopener noreferrer'}
        className="font-medium break-all underline underline-offset-2"
      >
        {part}
      </a>
    );
  });
}
