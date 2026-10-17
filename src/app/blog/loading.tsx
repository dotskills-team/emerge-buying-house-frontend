import { Container } from '@/components/ui/container';
import { Skeleton } from '@/components/ui/skeleton';

export default function BlogLoading() {
  return (
    <Container role="status" aria-label="Loading articles" className="py-12 sm:py-16">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="mt-3 h-5 w-full max-w-xl" />
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }, (_, i) => (
          <div key={i} className="border-border bg-surface overflow-hidden rounded-lg border">
            <Skeleton className="aspect-video rounded-none" />
            <div className="space-y-2 p-5">
              <Skeleton className="h-3 w-1/3" />
              <Skeleton className="h-5 w-4/5" />
              <Skeleton className="h-4 w-full" />
            </div>
          </div>
        ))}
      </div>
    </Container>
  );
}
