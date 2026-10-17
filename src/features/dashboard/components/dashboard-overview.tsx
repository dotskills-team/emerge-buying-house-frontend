'use client';

import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import {
  ArrowRight,
  CalendarDays,
  FilePen,
  FolderTree,
  Globe,
  History,
  KeyRound,
  Plus,
  Trash2,
  UserCheck,
  UserPlus,
  UserX,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ButtonLink } from '@/components/ui/button';
import { SectionCard } from '@/components/ui/card';
import { ListSkeleton } from '@/components/ui/skeleton';
import { usePermissions } from '@/features/auth/hooks/use-permissions';
import { useCategories } from '@/features/blog/hooks/use-blog';
import { PostStatusBadge } from '@/features/blog/components/post-status-badge';
import { listPosts } from '@/features/blog/services/blog.service';
import { listAudit, listRoles, listUsers } from '@/features/users/services/users.service';
import { formatDate, formatDateTime } from '@/lib/utils';
import { ROLE_LABELS } from '@/types/auth';
import { MagnitudeBars, StackedBar } from './charts';
import { StatCard } from './stat-card';

/** A count from a list endpoint with limit=1: only `meta.total` is used. */
function useTotal(
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

const today = new Intl.DateTimeFormat('en-GB', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  year: 'numeric',
});

function greeting(date: Date) {
  const h = date.getHours();
  return h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening';
}

const ACTION_LABELS: Record<string, string> = {
  'user.create': 'created a user',
  'user.update': 'edited user details',
  'user.role.change': 'changed a role',
  'user.status.change': 'changed account status',
  'user.permissions.change': 'changed user permissions',
  'role.permissions.change': 'changed role permissions',
  'auth.password.reset': 'reset their password',
  'auth.password.change': 'changed their password',
};

export function DashboardOverview() {
  const { user, can, canAny } = usePermissions();
  const seePosts = canAny(['posts.read', 'posts.create']);
  const seeUsers = can('users.read');

  const published = useTotal('published', seePosts, () =>
    listPosts({ status: 'published', page: 1, limit: 1 }),
  );
  const drafts = useTotal('drafts', seePosts, () =>
    listPosts({ status: 'draft', page: 1, limit: 1 }),
  );
  const trash = useTotal('trash', seePosts && can('posts.delete'), () =>
    listPosts({ trash: true, page: 1, limit: 1 }),
  );
  const active = useTotal('active-users', seeUsers, () =>
    listUsers({ status: 'active', page: 1, limit: 1 }),
  );
  const inactive = useTotal('inactive-users', seeUsers, () =>
    listUsers({ status: 'inactive', page: 1, limit: 1 }),
  );
  const categories = useCategories();
  const roles = useQuery({
    queryKey: ['access', 'roles'],
    queryFn: listRoles,
    enabled: can('roles.read'),
  });
  const recentPosts = useQuery({
    queryKey: ['overview', 'recent-posts'],
    queryFn: () => listPosts({ sort: 'newest', page: 1, limit: 5 }),
    enabled: seePosts,
  });
  const activity = useQuery({
    queryKey: ['audit', 1],
    queryFn: () => listAudit(1),
    enabled: can('audit.read'),
  });

  if (!user) return null;
  const now = new Date();
  const firstName = user.name.split(' ')[0];

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Hero */}
      <section className="text-fg-inverse relative overflow-hidden rounded-2xl bg-(image:--gradient-brand) p-5 shadow-md sm:p-8">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-24 -right-24 size-72 rounded-full bg-white/10 blur-2xl"
        />
        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="min-w-0">
            <p className="text-fg-inverse-muted flex items-center gap-2 text-sm">
              <CalendarDays size={16} aria-hidden /> {today.format(now)}
            </p>
            <h1 className="text-h1 mt-2 font-semibold tracking-tight">
              {greeting(now)}, {firstName}
            </h1>
            <p className="text-fg-inverse-muted mt-2 max-w-2xl">
              You are signed in as{' '}
              <span className="text-fg-inverse font-medium">{ROLE_LABELS[user.role]}</span>. Here is
              an overview of the content and people you can manage.
            </p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
            {can('posts.create') && (
              <ButtonLink href="/dashboard/blog/new" variant="inverse">
                <Plus size={16} aria-hidden /> New post
              </ButtonLink>
            )}
            {can('users.create') && (
              <ButtonLink href="/dashboard/users/new" variant="glass">
                <UserPlus size={16} aria-hidden /> Add user
              </ButtonLink>
            )}
          </div>
        </div>
      </section>

      {/* KPI tiles: real counts only. */}
      {(seePosts || seeUsers) && (
        <section
          aria-label="Key figures"
          // As many columns as fit (each at least ~9.5rem): two per row on phones, all six in one
          // row on wide screens, and 3 or 6 tiles both fill the row.
          className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,9.5rem),1fr))] gap-3 sm:gap-4"
        >
          {seePosts && (
            <StatCard
              label="Published posts"
              value={published.data}
              loading={published.isPending}
              failed={published.isError}
              icon={Globe}
              tone="blue"
              href="/dashboard/blog"
              hint="Live on the website"
            />
          )}
          {seePosts && (
            <StatCard
              label="Drafts"
              value={drafts.data}
              loading={drafts.isPending}
              failed={drafts.isError}
              icon={FilePen}
              tone="violet"
              href="/dashboard/blog"
              hint="Waiting to be published"
            />
          )}
          {seePosts && can('posts.delete') && (
            <StatCard
              label="In trash"
              value={trash.data}
              loading={trash.isPending}
              failed={trash.isError}
              icon={Trash2}
              tone="slate"
              href="/dashboard/blog"
              hint="Restorable posts"
            />
          )}
          {seePosts && (
            <StatCard
              label="Categories"
              value={categories.data?.length}
              loading={categories.isPending}
              failed={categories.isError}
              icon={FolderTree}
              tone="teal"
              href={can('categories.manage') ? '/dashboard/blog/categories' : undefined}
              hint="Used to group posts"
            />
          )}
          {seeUsers && (
            <StatCard
              label="Active users"
              value={active.data}
              loading={active.isPending}
              failed={active.isError}
              icon={UserCheck}
              tone="emerald"
              href="/dashboard/users"
              hint="Can sign in"
            />
          )}
          {seeUsers && (
            <StatCard
              label="Inactive users"
              value={inactive.data}
              loading={inactive.isPending}
              failed={inactive.isError}
              icon={UserX}
              tone="red"
              href="/dashboard/users"
              hint="Access switched off"
            />
          )}
        </section>
      )}

      {/* Charts */}
      {(seePosts || can('roles.read')) && (
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          {seePosts && (
            <SectionCard
              title="Content status"
              description="How your posts are split between live, draft and trash."
              className={can('roles.read') ? 'xl:col-span-2' : 'xl:col-span-3'}
            >
              <StackedBar
                loading={published.isPending || drafts.isPending}
                emptyText="No posts yet. Your first article will show up here."
                segments={[
                  { label: 'Published', value: published.data ?? 0, colorClass: 'bg-series-1' },
                  { label: 'Drafts', value: drafts.data ?? 0, colorClass: 'bg-series-2' },
                  ...(can('posts.delete')
                    ? [{ label: 'In trash', value: trash.data ?? 0, colorClass: 'bg-series-3' }]
                    : []),
                ]}
              />
            </SectionCard>
          )}
          {can('roles.read') && (
            <SectionCard
              title="Team by role"
              description="Accounts in each role."
              className={seePosts ? undefined : 'xl:col-span-3'}
              actions={
                <Link
                  href="/dashboard/roles"
                  className="text-primary inline-flex items-center gap-1 text-sm hover:underline"
                >
                  <KeyRound size={14} aria-hidden /> Roles
                </Link>
              }
            >
              <MagnitudeBars
                loading={roles.isPending}
                rows={(roles.data ?? []).map((r) => ({ label: r.name, value: r.userCount }))}
              />
            </SectionCard>
          )}
        </div>
      )}

      {/* Lists */}
      {(seePosts || can('audit.read')) && (
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          {seePosts && (
            <SectionCard
              title="Recent posts"
              className={can('audit.read') ? 'xl:col-span-2' : 'xl:col-span-3'}
              bodyClassName="p-0 sm:p-0"
              actions={
                <Link
                  href="/dashboard/blog"
                  className="text-primary inline-flex items-center gap-1 text-sm hover:underline"
                >
                  View all <ArrowRight size={14} aria-hidden />
                </Link>
              }
            >
              {recentPosts.isPending ? (
                <ListSkeleton rows={4} label="Loading recent posts" />
              ) : recentPosts.isError ? (
                <p className="text-fg-muted px-5 py-8 text-center text-sm">
                  Could not load recent posts.
                </p>
              ) : recentPosts.data.items.length === 0 ? (
                <p className="text-fg-muted px-5 py-8 text-center text-sm">No posts yet.</p>
              ) : (
                <ul className="divide-border divide-y">
                  {recentPosts.data.items.map((p) => (
                    <li key={p.id}>
                      <Link
                        href={`/dashboard/blog/${p.id}`}
                        className="hover:bg-surface-muted flex items-center gap-4 px-4 py-3.5 transition-colors sm:px-5"
                      >
                        <div className="min-w-0 flex-1">
                          <p className="text-fg truncate text-sm font-medium">{p.title}</p>
                          <p className="text-fg-subtle mt-0.5 truncate text-xs">
                            {p.category?.name ?? 'Uncategorised'} · {p.author?.name ?? 'Unknown'} ·{' '}
                            {formatDate(p.updatedAt)}
                          </p>
                        </div>
                        <PostStatusBadge status={p.status} />
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </SectionCard>
          )}
          {can('audit.read') && (
            <SectionCard
              title="Recent activity"
              className={seePosts ? undefined : 'xl:col-span-3'}
              actions={
                <Link
                  href="/dashboard/audit"
                  className="text-primary inline-flex items-center gap-1 text-sm hover:underline"
                >
                  <History size={14} aria-hidden /> Audit log
                </Link>
              }
            >
              {activity.isPending ? (
                <ListSkeleton rows={4} label="Loading activity" />
              ) : activity.isError ? (
                <p className="text-fg-muted py-6 text-center text-sm">Could not load activity.</p>
              ) : activity.data.items.length === 0 ? (
                <p className="text-fg-muted py-6 text-center text-sm">
                  No administrative changes yet.
                </p>
              ) : (
                <ol className="border-border relative space-y-5 border-l pl-5">
                  {activity.data.items.slice(0, 6).map((e) => (
                    <li key={e.id} className="relative">
                      <span
                        aria-hidden
                        className="bg-surface ring-primary/40 absolute top-1 -left-[1.6875rem] size-2.5 rounded-full ring-2"
                      />
                      <p className="text-fg text-sm">
                        <span className="font-medium">{e.actor?.name ?? 'System'}</span>{' '}
                        {ACTION_LABELS[e.action] ?? e.action}
                      </p>
                      <time dateTime={e.createdAt} className="text-fg-subtle text-xs">
                        {formatDateTime(e.createdAt)}
                      </time>
                    </li>
                  ))}
                </ol>
              )}
            </SectionCard>
          )}
        </div>
      )}

      {!seePosts && !seeUsers && (
        <SectionCard title="Your account">
          <p className="text-fg-muted text-sm">
            Your role does not include content or user management.{' '}
            <Link href="/dashboard/profile" className="text-primary hover:underline">
              Open your profile
            </Link>{' '}
            to update your details or password. <Badge tone="info">{ROLE_LABELS[user.role]}</Badge>
          </p>
        </SectionCard>
      )}
    </div>
  );
}
