import {
  Clients,
  GroupCompanies,
  ManufacturingPartners,
  ManufacturingStrength,
  Services,
  SourcingStrength,
} from '@/components/home/group-sections';
import { HeroSlider } from '@/components/home/hero-slider';
import {
  CertificationStrip,
  IntroSplit,
  ProductionTeaser,
  StatsBand,
} from '@/components/home/home-sections';
import { ProductProcess } from '@/components/home/product-process';
import { TestimonialSlider } from '@/components/home/premium-sections';
import { MarketingShell } from '@/components/layout/marketing-shell';

/**
 * In the order of the client's brief: slider, about, manufacturing strength, sourcing strength,
 * services, manufacturing partners, products, clients, group companies. Vision, industries,
 * history and news live on their own pages.
 */
export default function HomePage() {
  return (
    <MarketingShell>
      <HeroSlider />
      <IntroSplit />
      <StatsBand />
            <Services />
<GroupCompanies />
      <ManufacturingStrength />
      <SourcingStrength />
      <ProductProcess />
      {/* <ManufacturingPartners /> */}
      <CertificationStrip />
      <ProductionTeaser />
      <Clients />
      {/* <TestimonialSlider /> */}
      
    </MarketingShell>
  );
}

// Super Admin->	mahim.dotskills@gmail.com	bneFu6mvJEBjvRRaMyTJ
// Admin->	admin@example.com	bneFu6mvJEBjvRRaMyTJ
// Content Manager->	content@example.com	bneFu6mvJEBjvRRaMyTJ
// Author->	author@example.com	bneFu6mvJEBjvRRaMyTJ
// Viewer->	viewer@example.com	bneFu6mvJEBjvRRaMyTJ
