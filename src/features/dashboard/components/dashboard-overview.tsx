'use client';

import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { ArrowRight } from 'lucide-react';
import { PageHeader } from '@/components/layout/page-header';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { usePermissions } from '@/features/auth/hooks/use-permissions';
import { listPosts } from '@/features/blog/services/blog.service';
import { listUsers } from '@/features/users/services/users.service';
import { ROLE_LABELS } from '@/types/auth';
import { DASHBOARD_NAV } from '../navigation';

function Stat({ label, value, loading }: { label: string; value?: number; loading: boolean }) {
  return (
    <Card className="p-5">
      <p className="text-fg-muted text-sm">{label}</p>
      {loading ? (
        <Skeleton className="mt-2 h-8 w-16" />
      ) : (
        <p className="text-h1 text-fg mt-1">{value ?? '—'}</p>
      )}
    </Card>
  );
}

/** Counts come from list endpoints with limit=1: only `meta.total` is used. */
function useCount(
  key: string,
  enabled: boolean,
  fetcher: () => Promise<{ meta: { total: number } }>,
) {
  return useQuery({
    queryKey: ['overview', key],
    queryFn: fetcher,
    enabled,
    select: (r) => r.meta.total,
  });
}

export function DashboardOverview() {
  const { user, can, canAny } = usePermissions();
  const seePosts = canAny(['posts.read', 'posts.create']);
  const published = useCount('published', seePosts, () =>
    listPosts({ status: 'published', page: 1, limit: 1 }),
  );
  const drafts = useCount('drafts', seePosts, () =>
    listPosts({ status: 'draft', page: 1, limit: 1 }),
  );
  const users = useCount('users', can('users.read'), () =>
    listUsers({ status: 'active', page: 1, limit: 1 }),
  );

  if (!user) return null;
  const shortcuts = DASHBOARD_NAV.flatMap((g) => g.items).filter(
    (i) => i.href !== '/dashboard' && (!i.anyOf || canAny(i.anyOf)),
  );

  return (
    <div className="space-y-8">
      <PageHeader
        title={`Welcome back, ${user.name.split(' ')[0]}`}
        description="Here is what you can work on today."
        actions={<Badge tone="info">{ROLE_LABELS[user.role]}</Badge>}
      />

      {(seePosts || can('users.read')) && (
        <section aria-label="Summary" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {seePosts && (
            <Stat label="Published posts" value={published.data} loading={published.isPending} />
          )}
          {seePosts && <Stat label="Drafts" value={drafts.data} loading={drafts.isPending} />}
          {can('users.read') && (
            <Stat label="Active users" value={users.data} loading={users.isPending} />
          )}
        </section>
      )}

      <section aria-labelledby="shortcuts-heading" className="space-y-4">
        <h2 id="shortcuts-heading" className="text-h3 text-fg">
          Go to
        </h2>
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {shortcuts.map(({ href, label, icon: Icon }) => (
            <li key={href}>
              <Link
                href={href}
                className="group border-border bg-surface hover:border-primary/40 flex min-h-16 items-center gap-4 rounded-lg border p-4 shadow-sm transition-colors"
              >
                <span className="bg-primary-soft text-primary flex size-10 shrink-0 items-center justify-center rounded-md">
                  <Icon size={20} aria-hidden />
                </span>
                <span className="text-fg flex-1 font-medium">{label}</span>
                <ArrowRight
                  size={16}
                  aria-hidden
                  className="text-fg-subtle transition-transform group-hover:translate-x-0.5"
                />
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
