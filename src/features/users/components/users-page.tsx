'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Plus, Search, Users } from 'lucide-react';
import { EmptyState, ErrorState } from '@/components/feedback/states';
import { PageHeader } from '@/components/layout/page-header';
import { ButtonLink } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input, Select } from '@/components/ui/field';
import { Pagination } from '@/components/ui/pagination';
import { ListSkeleton } from '@/components/ui/skeleton';
import { usePermissions } from '@/features/auth/hooks/use-permissions';
import { formatDate } from '@/lib/utils';
import { ROLE_KEYS, ROLE_LABELS, isRoleKey, type RoleKey } from '@/types/auth';
import { useUsers } from '../hooks/use-users';
import { RoleBadge, StatusBadge } from './user-badges';

export function UsersPage() {
  const { can } = usePermissions();
  const [search, setSearch] = useState('');
  const [q, setQ] = useState('');
  const [role, setRole] = useState<RoleKey | ''>('');
  const [status, setStatus] = useState<'active' | 'inactive' | ''>('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    const t = setTimeout(() => {
      setQ(search.trim());
      setPage(1);
    }, 350);
    return () => clearTimeout(t);
  }, [search]);

  const { data, isPending, isError, error, refetch, isPlaceholderData } = useUsers({
    q: q || undefined,
    role: role || undefined,
    status: status || undefined,
    page,
    limit: 20,
  });
  const filtered = Boolean(q || role || status);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Users"
        description="Staff accounts, their roles and whether they can sign in."
        actions={
          can('users.create') && (
            <ButtonLink href="/dashboard/users/new">
              <Plus size={16} aria-hidden /> Add user
            </ButtonLink>
          )
        }
      />

      <div className="grid gap-3 sm:grid-cols-[1fr_auto_auto]">
        <label className="relative">
          <span className="sr-only">Search users</span>
          <Search
            size={16}
            aria-hidden
            className="text-fg-subtle pointer-events-none absolute top-1/2 left-3 -translate-y-1/2"
          />
          <Input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email"
            className="pl-9"
          />
        </label>
        <label>
          <span className="sr-only">Filter by role</span>
          <Select
            value={role}
            onChange={(e) => {
              const v = e.target.value;
              setRole(isRoleKey(v) ? v : '');
              setPage(1);
            }}
          >
            <option value="">All roles</option>
            {ROLE_KEYS.map((k) => (
              <option key={k} value={k}>
                {ROLE_LABELS[k]}
              </option>
            ))}
          </Select>
        </label>
        <label>
          <span className="sr-only">Filter by status</span>
          <Select
            value={status}
            onChange={(e) => {
              const v = e.target.value;
              setStatus(v === 'active' || v === 'inactive' ? v : '');
              setPage(1);
            }}
          >
            <option value="">Any status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </Select>
        </label>
      </div>

      {isError ? (
        <Card>
          <ErrorState
            title="Could not load users"
            message={error.message}
            onRetry={() => void refetch()}
          />
        </Card>
      ) : (
        <Card className={isPlaceholderData ? 'opacity-70 transition-opacity' : undefined}>
          {isPending ? (
            <ListSkeleton label="Loading users" />
          ) : data.items.length === 0 ? (
            <EmptyState
              icon={Users}
              title={filtered ? 'No users match your filters' : 'No users yet'}
              message={filtered ? 'Try a different search or clear the filters.' : undefined}
            />
          ) : (
            <>
              {/* Phones: one card per user. */}
              <ul className="divide-border divide-y md:hidden">
                {data.items.map((u) => (
                  <li key={u.id}>
                    <Link
                      href={`/dashboard/users/${u.id}`}
                      className="hover:bg-surface-muted block px-4 py-4"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="text-fg truncate font-medium">{u.name}</p>
                          <p className="text-fg-muted truncate text-sm">{u.email}</p>
                        </div>
                        <StatusBadge user={u} />
                      </div>
                      <div className="text-fg-subtle mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
                        <RoleBadge role={u.role} />
                        <span>Last sign-in {formatDate(u.lastLoginAt)}</span>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>

              {/* Tablets and up: a table. */}
              <table className="hidden w-full text-left text-sm md:table">
                <caption className="sr-only">Users</caption>
                <thead className="border-border text-fg-muted border-b">
                  <tr>
                    <th scope="col" className="px-5 py-3 font-medium">
                      Name
                    </th>
                    <th scope="col" className="px-3 py-3 font-medium">
                      Role
                    </th>
                    <th scope="col" className="px-3 py-3 font-medium">
                      Status
                    </th>
                    <th scope="col" className="px-5 py-3 font-medium">
                      Last sign-in
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-border divide-y">
                  {data.items.map((u) => (
                    <tr key={u.id} className="hover:bg-surface-muted">
                      <td className="max-w-80 px-5 py-3.5">
                        <Link
                          href={`/dashboard/users/${u.id}`}
                          className="text-fg hover:text-primary font-medium hover:underline"
                        >
                          {u.name}
                        </Link>
                        <p className="text-fg-muted truncate">{u.email}</p>
                      </td>
                      <td className="px-3 py-3.5">
                        <RoleBadge role={u.role} />
                      </td>
                      <td className="px-3 py-3.5">
                        <StatusBadge user={u} />
                      </td>
                      <td className="text-fg-muted px-5 py-3.5 whitespace-nowrap">
                        {formatDate(u.lastLoginAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}
        </Card>
      )}

      {data && <Pagination meta={data.meta} noun={['user', 'users']} onPage={setPage} />}
    </div>
  );
}
