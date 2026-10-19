import type { Metadata } from 'next';
import { Clock, Mail, MapPin, Phone, type LucideIcon } from 'lucide-react';
import { MarketingShell } from '@/components/layout/marketing-shell';
import { ContactForm } from '@/components/site/contact-form';
import { PageHero } from '@/components/site/page-hero';
import { Reveal } from '@/components/site/reveal';
import { SectionHeading } from '@/components/site/section-heading';
import { SOCIAL_ICONS } from '@/components/site/social-icons';
import { Container } from '@/components/ui/container';
import { CONTACT, SITE, SOCIAL } from '@/config/site';
import { IMG } from '@/content/images';

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Get in touch with Emerge Buying House for quotes, partnerships and careers.',
};

function InfoCard({
  icon: Icon,
  title,
  children,
}: {
  icon: LucideIcon;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-surface border-border flex gap-4 rounded-2xl border p-5 shadow-sm">
      <span className="bg-brand-weave flex size-12 shrink-0 items-center justify-center rounded-xl text-white">
        <Icon size={20} aria-hidden />
      </span>
      <div className="min-w-0">
        <h3 className="text-fg font-semibold">{title}</h3>
        <div className="text-fg-muted mt-1 text-sm">{children}</div>
      </div>
    </div>
  );
}

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ product?: string }>;
}) {
  const email = SITE.contactEmail ?? CONTACT.email;
  // Arriving from a product page ("Request a quote") pre-fills the message.
  const product = (await searchParams).product?.trim().slice(0, 140) || undefined;
  return (
    <MarketingShell>
      <PageHero
        title="Contact us"
        lead="Tell us about your styles, quantities and target dates. A merchandiser will reply within one working day."
        image={IMG.heroSkyline}
        crumbs={[{ label: 'Contact' }]}
      />
      <section className="py-16 sm:py-20 lg:py-28">
        <Container className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_1.3fr] lg:gap-16">
          <Reveal className="space-y-4">
            <SectionHeading eyebrow="Get in touch" title="We would love to hear from you." />
            <div className="space-y-4 pt-4">
              <InfoCard icon={MapPin} title="Head office">
                <address className="not-italic">
                  {CONTACT.address.map((l) => (
                    <span key={l} className="block">
                      {l}
                    </span>
                  ))}
                </address>
              </InfoCard>
              <InfoCard icon={Phone} title="Phone">
                <a
                  href={`tel:${CONTACT.phone.replace(/[^+\d]/g, '')}`}
                  className="hover:text-primary"
                >
                  {CONTACT.phone}
                </a>
              </InfoCard>
              <InfoCard icon={Mail} title="Email">
                <a href={`mailto:${email}`} className="hover:text-primary break-all">
                  {email}
                </a>
              </InfoCard>
              <InfoCard icon={Clock} title="Office hours">
                {CONTACT.hours}
              </InfoCard>
            </div>
            <ul className="flex gap-2 pt-2" aria-label="Social media">
              {SOCIAL.map((s) => {
                const Icon = SOCIAL_ICONS[s.label];
                return (
                  <li key={s.label}>
                    <a
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${SITE.name} on ${s.label}`}
                      className="border-border text-fg-muted hover:text-primary hover:border-primary/40 flex size-11 items-center justify-center rounded-full border transition-colors"
                    >
                      <Icon size={17} />
                    </a>
                  </li>
                );
              })}
            </ul>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="bg-surface border-border rounded-3xl border p-6 shadow-lg sm:p-8 lg:p-10">
              <h2 className="text-h2 text-fg font-semibold">Send us a message</h2>
              <p className="text-fg-muted mt-2 text-sm">Fields marked * are required.</p>
              <div className="mt-8">
                <ContactForm to={email} product={product} />
              </div>
            </div>
          </Reveal>
        </Container>
      </section>
      <section aria-label="Map" className="border-border h-[clamp(18rem,45vh,28rem)] border-t">
        <iframe
          title="Map showing the Emerge head office in Uttara, Dhaka"
          src="https://www.google.com/maps?q=Uttara%20Sector%204%2C%20Dhaka&output=embed"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="h-full w-full grayscale-[30%]"
        />
      </section>
    </MarketingShell>
  );
}
