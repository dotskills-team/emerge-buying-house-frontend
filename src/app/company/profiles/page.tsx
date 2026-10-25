import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, FileText } from 'lucide-react';
import { MarketingShell } from '@/components/layout/marketing-shell';
import { PageHero } from '@/components/site/page-hero';
import { Reveal } from '@/components/site/reveal';
import { SectionHeading } from '@/components/site/section-heading';
import { Container } from '@/components/ui/container';
import { IMG } from '@/content/images';
import { ProfileLibrary } from '@/features/company-profiles/components/profile-library';
import { listCompanyProfiles } from '@/features/company-profiles/server';

export const metadata: Metadata = {
  title: 'Company Profiles',
  description:
    'Read the Emerge Buying House company profile online or download it as a PDF: our capabilities, sourcing network and quality systems.',
  alternates: { canonical: '/company/profiles' },
};

export default function CompanyProfilesPage() {
  // Read from public/company-profiles when the site is built: adding a PDF there is enough.
  const profiles = listCompanyProfiles();
  return (
    <MarketingShell>
      <PageHero
        title="Company profiles"
        lead="Everything a buyer needs to know about us in one document. Read it here or download the PDF to share with your team."
        image={IMG.textileFactory}
        crumbs={[{ label: 'Company' }, { label: 'Company Profiles' }]}
      />
      <section className="py-16 sm:py-20 lg:py-20 2xl:py-28">
        <Container>
          <SectionHeading
            align="center"
            eyebrow="Download centre"
            title={profiles.length > 1 ? 'Choose a profile' : 'Our company profile'}
            lead="Opens right here on any device. Use the download button to keep a copy."
          />
          <div className="mt-12 sm:mt-12 2xl:mt-16">
            {profiles.length > 0 ? (
              <ProfileLibrary profiles={profiles} />
            ) : (
              <div className="border-border bg-surface mx-auto flex max-w-lg flex-col items-center rounded-2xl border p-10 text-center">
                <FileText aria-hidden className="text-fg-subtle size-10" />
                <p className="text-fg mt-4 font-semibold">Our profile is being updated.</p>
                <p className="text-fg-muted mt-1 text-sm">
                  Ask us for the latest copy and we will email it to you.
                </p>
              </div>
            )}
          </div>
          <Reveal className="mt-12 text-center 2xl:mt-16">
            <p className="text-fg-muted">
              Need a printed copy, a profile in another language, or details for a specific
              category?
            </p>
            <Link
              href="/contact"
              className="text-primary mt-2 inline-flex items-center gap-1.5 font-semibold hover:underline"
            >
              Contact our team <ArrowRight size={16} aria-hidden />
            </Link>
          </Reveal>
        </Container>
      </section>
    </MarketingShell>
  );
}
