'use client';

import { useState } from 'react';
import { Lock } from 'lucide-react';
import { Alert } from '@/components/feedback/alert';
import { ErrorState } from '@/components/feedback/states';
import { PageHeader } from '@/components/layout/page-header';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, SectionCard } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/field';
import { Skeleton } from '@/components/ui/skeleton';
import { usePermissions } from '@/features/auth/hooks/use-permissions';
import { errorMessage } from '@/lib/http';
import { cn } from '@/lib/utils';
import { toast } from '@/store/toast-store';
import type { Permission, RoleKey } from '@/types/auth';
import type { PermissionDef, RoleSummary } from '@/types/users';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { usePermissionCatalog, useRoles, userKeys } from '../hooks/use-users';
import { updateRolePermissions } from '../services/users.service';
import { groupPermissions } from './permissions-editor';

function RolePermissions({ role, catalog }: { role: RoleSummary; catalog: PermissionDef[] }) {
  const { user, can } = usePermissions();
  const queryClient = useQueryClient();
  const [selected, setSelected] = useState<Set<Permission>>(() => new Set(role.permissions));
  const save = useMutation({
    mutationFn: (permissions: Permission[]) => updateRolePermissions(role.key, permissions),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: userKeys.roles });
      void queryClient.invalidateQueries({ queryKey: userKeys.all });
    },
  });

  // Same rules as the backend: Super Admin is fixed, nobody edits their own role (unless Super
  // Admin), and nobody adds a permission they do not hold.
  const editable =
    can('roles.manage') &&
    !role.protected &&
    (user?.role === 'super_admin' || user?.role !== role.key);
  const dirty = [...selected].sort().join() !== [...role.permissions].sort().join();

  async function submit() {
    try {
      await save.mutateAsync(catalog.map((d) => d.key).filter((k) => selected.has(k)));
      toast.success(`${role.name} permissions saved. They apply to everyone with this role now.`);
    } catch (err) {
      toast.error(errorMessage(err));
    }
  }

  return (
    <SectionCard
      title={role.name}
      description={role.description}
      actions={
        editable && (
          <Button
            size="sm"
            onClick={() => void submit()}
            loading={save.isPending}
            disabled={!dirty}
          >
            Save role
          </Button>
        )
      }
    >
      {role.protected && (
        <Alert tone="info" className="mb-5">
          The Super Admin role always has every permission and cannot be changed.
        </Alert>
      )}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {groupPermissions(catalog).map(([group, defs]) => (
          <fieldset key={group}>
            <legend className="text-fg text-sm font-semibold">{group}</legend>
            <div className="mt-2 space-y-1">
              {defs.map((def) => (
                <Checkbox
                  key={def.key}
                  label={def.label}
                  checked={selected.has(def.key)}
                  disabled={
                    !editable || (!selected.has(def.key) && !user?.permissions.includes(def.key))
                  }
                  onChange={(e) =>
                    setSelected((s) => {
                      const next = new Set(s);
                      if (e.target.checked) next.add(def.key);
                      else next.delete(def.key);
                      return next;
                    })
                  }
                />
              ))}
            </div>
          </fieldset>
        ))}
      </div>
    </SectionCard>
  );
}

export function RolesPage() {
  const roles = useRoles();
  const catalog = usePermissionCatalog();
  const [active, setActive] = useState<RoleKey>('admin');

  const header = (
    <PageHeader
      title="Roles & permissions"
      description="Each person has one role. A role is a set of permissions; individual users can also have permissions added or removed."
    />
  );

  if (roles.isError || catalog.isError) {
    return (
      <div className="space-y-6">
        {header}
        <Card>
          <ErrorState
            title="Could not load roles"
            message={(roles.error ?? catalog.error)?.message}
            onRetry={() => {
              void roles.refetch();
              void catalog.refetch();
            }}
          />
        </Card>
      </div>
    );
  }

  if (!roles.data || !catalog.data) {
    return (
      <div className="space-y-6">
        {header}
        <div role="status" aria-label="Loading roles" className="space-y-4">
          <Skeleton className="h-12" />
          <Skeleton className="h-80" />
        </div>
      </div>
    );
  }

  const current = roles.data.find((r) => r.key === active) ?? roles.data[0];

  return (
    <div className="space-y-6">
      {header}
      <div role="tablist" aria-label="Roles" className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
        {roles.data.map((r) => (
          <button
            key={r.key}
            type="button"
            role="tab"
            aria-selected={r.key === current?.key}
            onClick={() => setActive(r.key)}
            className={cn(
              'flex min-h-11 shrink-0 items-center gap-2 rounded-md border px-3.5 text-sm transition-colors',
              r.key === current?.key
                ? 'border-primary bg-primary-soft text-primary font-medium'
                : 'border-border bg-surface text-fg-muted hover:text-fg',
            )}
          >
            {r.protected && <Lock size={14} aria-hidden />}
            {r.name}
            <Badge>{r.userCount}</Badge>
          </button>
        ))}
      </div>
      {current && (
        <RolePermissions
          key={`${current.key}-${current.permissions.join()}`}
          role={current}
          catalog={catalog.data}
        />
      )}
    </div>
  );
}
