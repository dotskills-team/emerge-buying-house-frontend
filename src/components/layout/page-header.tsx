import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import type { MouseEvent, ReactNode } from 'react';

/** Title, optional description and back link, with the page's actions on the right. */
export function PageHeader({
  title,
  description,
  actions,
  back,
}: {
  title: string;
  description?: string;
  actions?: ReactNode;
  back?: {
    href: string;
    label: string;
    /** E.g. to confirm before leaving a form with unsaved changes (call preventDefault to stay). */
    onClick?: (e: MouseEvent<HTMLAnchorElement>) => void;
  };
}) {
  return (
    <header className="space-y-3">
      {back && (
        <Link
          href={back.href}
          onClick={back.onClick}
          className="text-fg-muted hover:text-fg inline-flex min-h-8 items-center gap-1.5 text-sm"
        >
          <ArrowLeft size={14} aria-hidden /> {back.label}
        </Link>
      )}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-h1 text-fg">{title}</h1>
          {description && <p className="text-fg-muted mt-1">{description}</p>}
        </div>
        {actions && <div className="flex flex-wrap items-center gap-2 sm:gap-3">{actions}</div>}
      </div>
    </header>
  );
}
