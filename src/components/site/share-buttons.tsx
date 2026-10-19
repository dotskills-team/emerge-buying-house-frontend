'use client';

import { useState, useSyncExternalStore } from 'react';
import { Check, Link2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { FacebookIcon, LinkedinIcon, XIcon } from './social-icons';

const noSubscribe = () => () => {};
/** The page origin on the client, '' during server rendering (no hydration mismatch). */
const useOrigin = () =>
  useSyncExternalStore(
    noSubscribe,
    () => window.location.origin,
    () => '',
  );

/** Facebook, LinkedIn and X share links plus copy-link, for the page at `path`. */
export function ShareButtons({
  path,
  title,
  className,
}: {
  path: string;
  title: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);
  const url = `${useOrigin()}${path}`;
  const enc = encodeURIComponent;
  const links = [
    {
      label: 'Share on Facebook',
      icon: FacebookIcon,
      href: `https://www.facebook.com/sharer/sharer.php?u=${enc(url)}`,
    },
    {
      label: 'Share on LinkedIn',
      icon: LinkedinIcon,
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${enc(url)}`,
    },
    {
      label: 'Share on X',
      icon: XIcon,
      href: `https://x.com/intent/post?url=${enc(url)}&text=${enc(title)}`,
    },
  ];

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  const button =
    'border-border text-fg-muted hover:border-primary/40 hover:text-primary flex size-11 items-center justify-center rounded-full border transition-colors';

  return (
    <div className={cn('flex flex-wrap gap-2', className)}>
      {links.map(({ label, icon: Icon, href }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={label}
          title={label}
          className={button}
        >
          <Icon size={17} />
        </a>
      ))}
      <button
        type="button"
        onClick={() => void copy()}
        aria-label={copied ? 'Link copied' : 'Copy link'}
        title={copied ? 'Link copied' : 'Copy link'}
        className={button}
      >
        {copied ? (
          <Check size={17} aria-hidden className="text-success" />
        ) : (
          <Link2 size={17} aria-hidden />
        )}
      </button>
      <span className="sr-only" aria-live="polite">
        {copied ? 'Link copied to clipboard' : ''}
      </span>
    </div>
  );
}
