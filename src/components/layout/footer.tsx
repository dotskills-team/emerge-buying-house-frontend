import { Mail } from 'lucide-react';
import { Container } from '@/components/ui/container';
import { NAV_LINKS, SITE } from '@/lib/constants';
import { ApiStatus } from './api-status';

export function Footer() {
  return (
    <footer id="contact" className="bg-navy-950 text-white">
      <Container className="grid gap-12 py-16 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <p className="font-serif text-2xl">
            {SITE.name} <span className="text-navy-200 text-base">{SITE.suffix}</span>
          </p>
          <p className="text-navy-200 mt-4 max-w-sm text-sm leading-relaxed">
            Tell us about your styles, volumes and target dates and we will come back with a
            sourcing plan.
          </p>
          <a
            href={`mailto:${SITE.email}`}
            className="hover:text-navy-100 mt-6 inline-flex items-center gap-2 text-sm underline underline-offset-4"
          >
            <Mail size={16} aria-hidden /> {SITE.email}
          </a>
        </div>

        <nav aria-label="Footer">
          <p className="text-sm font-medium">Explore</p>
          <ul className="text-navy-200 mt-4 space-y-3 text-sm">
            {NAV_LINKS.map((l) => (
              <li key={l.href}>
                <a href={l.href} className="hover:text-white">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <p className="text-sm font-medium">System</p>
          <div className="mt-4">
            <ApiStatus />
          </div>
        </div>
      </Container>
      <div className="border-navy-800 border-t">
        <Container className="text-navy-200 py-6 text-xs">
          &copy; {new Date().getFullYear()} {SITE.name} {SITE.suffix}. All rights reserved.
        </Container>
      </div>
    </footer>
  );
}
