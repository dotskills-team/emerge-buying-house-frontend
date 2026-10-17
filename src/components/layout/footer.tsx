import Link from 'next/link';
import { Mail } from 'lucide-react';
import { Container } from '@/components/ui/container';
import { MARKETING_NAV, SITE } from '@/config/site';
import { Logo } from './logo';

export function Footer() {
  return (
    <footer id="contact" className="bg-surface-inverse text-fg-inverse">
      <Container className="grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr]">
        <div className="sm:col-span-2 lg:col-span-1">
          <Logo inverse />
          <p className="text-fg-inverse-muted mt-4 max-w-sm text-sm">
            Tell us about your styles, volumes and target dates and we will come back with a
            sourcing plan.
          </p>
          {SITE.contactEmail && (
            <a
              href={`mailto:${SITE.contactEmail}`}
              className="hover:text-fg-inverse-muted mt-5 inline-flex items-center gap-2 text-sm underline underline-offset-4"
            >
              <Mail size={16} aria-hidden /> {SITE.contactEmail}
            </a>
          )}
        </div>

        <nav aria-label="Footer">
          <p className="text-sm font-semibold">Explore</p>
          <ul className="text-fg-inverse-muted mt-4 space-y-3 text-sm">
            {MARKETING_NAV.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="hover:text-fg-inverse">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <p className="text-sm font-semibold">Staff</p>
          <ul className="text-fg-inverse-muted mt-4 space-y-3 text-sm">
            <li>
              <Link href="/login" className="hover:text-fg-inverse">
                Sign in to the dashboard
              </Link>
            </li>
          </ul>
        </div>
      </Container>
      <div className="border-t border-white/10">
        <Container className="text-fg-inverse-muted py-6 text-xs">
          &copy; {new Date().getFullYear()} {SITE.name}. All rights reserved.
        </Container>
      </div>
    </footer>
  );
}
