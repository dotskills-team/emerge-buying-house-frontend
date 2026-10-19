import { MarketingShell } from '@/components/layout/marketing-shell';
import { Container } from '@/components/ui/container';
import { Skeleton } from '@/components/ui/skeleton';

export default function BlogLoading() {
  return (
    <MarketingShell>
      <div className="bg-ink-deep h-[clamp(17rem,46vh,28rem)] bg-(image:--gradient-ink)" />
      <Container role="status" aria-label="Loading articles" className="py-12 sm:py-16">
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }, (_, i) => (
            <div key={i} className="border-border bg-surface overflow-hidden rounded-2xl border">
              <Skeleton className="aspect-[16/10] rounded-none" />
              <div className="space-y-3 p-6">
                <Skeleton className="h-3 w-1/3" />
                <Skeleton className="h-6 w-4/5" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            </div>
          ))}
        </div>
      </Container>
    </MarketingShell>
  );
}
