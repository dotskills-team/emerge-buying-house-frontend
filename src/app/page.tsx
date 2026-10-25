import { HeroSlider } from '@/components/home/hero-slider';
import {
  CertificationStrip,
  IntroSplit,
  JourneySection,
  LatestNews,
  ProcessTimeline,
  ProductionTeaser,
  StatsBand,
  VisionMission,
} from '@/components/home/home-sections';
import { IndustriesShowcase } from '@/components/home/industries-showcase';
import { MarqueeBand, TestimonialSlider } from '@/components/home/premium-sections';
import { MarketingShell } from '@/components/layout/marketing-shell';

export default function HomePage() {
  return (
    <MarketingShell overlayHeader>
      <HeroSlider />
      <IntroSplit />
      <StatsBand />
      <VisionMission />
      <IndustriesShowcase />
      <MarqueeBand />
      <ProcessTimeline />
      <ProductionTeaser />
      <JourneySection />
      <TestimonialSlider />
      <LatestNews />
      <CertificationStrip />
    </MarketingShell>
  );
}

// Super Admin->	mahim.dotskills@gmail.com	bneFu6mvJEBjvRRaMyTJ
// Admin->	admin@example.com	bneFu6mvJEBjvRRaMyTJ
// Content Manager->	content@example.com	bneFu6mvJEBjvRRaMyTJ
// Author->	author@example.com	bneFu6mvJEBjvRRaMyTJ
// Viewer->	viewer@example.com	bneFu6mvJEBjvRRaMyTJ
