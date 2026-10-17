import { MarketingShell } from '@/components/layout/marketing-shell';
import { About } from '@/components/sections/about';
import { Hero } from '@/components/sections/hero';
import { Services } from '@/components/sections/services';

export default function HomePage() {
  return (
    <MarketingShell>
      <Hero />
      <About />
      <Services />
    </MarketingShell>
  );
}
