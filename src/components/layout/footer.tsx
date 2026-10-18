import Link from 'next/link';
import { ArrowRight, Clock, Mail, MapPin, Phone } from 'lucide-react';
import { SOCIAL_ICONS } from '@/components/site/social-icons';
import { Container } from '@/components/ui/container';
import { CONTACT, MAIN_NAV, SITE, SOCIAL } from '@/config/site';
import { Logo } from './logo';

const group = (label: string) => MAIN_NAV.find((e) => e.label === label)?.children ?? [];

const EXPLORE = [
  { label: 'Production', href: '/production' },
  { label: 'Environmental Sustainability', href: '/sustainability/environmental-sustainability' },
  { label: 'Employee Welfare', href: '/sustainability/employee-welfare' },
  { label: 'CSR', href: '/csr' },
  { label: 'News & Events', href: '/news-events' },
  { label: 'Career', href: '/career' },
];

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: Array<{ label: string; href: string }>;
}) {
  return (
    <nav aria-label={title}>
      <h2 className="text-sm font-semibold text-white">{title}</h2>
      <ul className="mt-5 space-y-3">
        {links.map((l) => (
          <li key={l.href}>
            <Link
              href={l.href}
              className="text-fg-inverse-muted inline-flex items-center gap-1.5 text-sm transition-colors hover:text-white"
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export function Footer() {
  const email = SITE.contactEmail ?? CONTACT.email;
  return (
    <footer className="bg-surface-inverse text-fg-inverse relative">
      {/* Call to action */}
      <div className="bg-brand-weave relative overflow-hidden">
        <Container className="flex flex-col items-start justify-between gap-6 py-12 sm:py-14 lg:flex-row lg:items-center">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold tracking-[0.2em] text-white/70 uppercase">
              Start a conversation
            </p>
            <h2 className="text-h1 mt-2 font-semibold tracking-tight text-white">
              Have a style, a volume and a date? We will build the plan.
            </h2>
          </div>
          <Link
            href="/contact"
            className="group text-ink-deep shadow-gold inline-flex min-h-12 shrink-0 items-center gap-2 rounded-full bg-(image:--gradient-gold) px-7 text-sm font-semibold transition-transform hover:-translate-y-0.5"
          >
            Request a quote
            <ArrowRight
              size={16}
              aria-hidden
              className="transition-transform group-hover:translate-x-0.5"
            />
          </Link>
        </Container>
      </div>

      <Container className="grid grid-cols-1 gap-10 py-14 sm:grid-cols-2 sm:py-16 lg:grid-cols-[1.5fr_1fr_1fr_1fr_1.3fr]">
        <div className="sm:col-span-2 lg:col-span-1">
          <Logo inverse className="h-12" />
          <p className="text-fg-inverse-muted mt-3 max-w-sm text-sm">{SITE.description}</p>
          <ul className="mt-6 flex gap-2" aria-label="Social media">
            {SOCIAL.map((s) => {
              const Icon = SOCIAL_ICONS[s.label];
              return (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${SITE.name} on ${s.label}`}
                    className="text-fg-inverse-muted hover:text-fg flex size-10 items-center justify-center rounded-full border border-white/15 transition-colors hover:border-transparent hover:bg-white"
                  >
                    <Icon size={16} />
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
        <FooterColumn title="Company" links={group('Company')} />
        <FooterColumn title="Industries" links={group('Industries')} />
        <FooterColumn title="Explore" links={EXPLORE} />
        <div>
          <h2 className="text-sm font-semibold text-white">Contact</h2>
          <ul className="text-fg-inverse-muted mt-5 space-y-4 text-sm">
            <li className="flex gap-3">
              <MapPin size={18} aria-hidden className="mt-0.5 shrink-0 text-white/60" />
              <address className="not-italic">
                {CONTACT.address.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </address>
            </li>
            <li className="flex gap-3">
              <Phone size={18} aria-hidden className="mt-0.5 shrink-0 text-white/60" />
              <a href={`tel:${CONTACT.phone.replace(/[^+\d]/g, '')}`} className="hover:text-white">
                {CONTACT.phone}
              </a>
            </li>
            <li className="flex gap-3">
              <Mail size={18} aria-hidden className="mt-0.5 shrink-0 text-white/60" />
              <a href={`mailto:${email}`} className="break-all hover:text-white">
                {email}
              </a>
            </li>
            <li className="flex gap-3">
              <Clock size={18} aria-hidden className="mt-0.5 shrink-0 text-white/60" />
              <span>{CONTACT.hours}</span>
            </li>
          </ul>
        </div>
      </Container>

      <div className="border-t border-white/10">
        <Container className="text-fg-inverse-muted flex flex-col gap-3 py-6 text-xs sm:flex-row sm:items-center sm:justify-between">
          <p>
            &copy; {new Date().getFullYear()} {SITE.name}. All rights reserved.
          </p>
          <Link href="/login" className="hover:text-white">
            Staff sign in
          </Link>
        </Container>
      </div>
    </footer>
  );
}
