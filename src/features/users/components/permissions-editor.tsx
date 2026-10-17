'use client';

import { useMemo, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { SectionCard } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/field';
import { Skeleton } from '@/components/ui/skeleton';
import { usePermissions } from '@/features/auth/hooks/use-permissions';
import { errorMessage } from '@/lib/http';
import { toast } from '@/store/toast-store';
import type { Permission } from '@/types/auth';
import type { AdminUser, PermissionDef } from '@/types/users';
import { usePermissionCatalog, useRoles, useUserMutation } from '../hooks/use-users';
import { setUserPermissions } from '../services/users.service';

export function groupPermissions(defs: PermissionDef[]) {
  const groups = new Map<string, PermissionDef[]>();
  for (const def of defs) groups.set(def.group, [...(groups.get(def.group) ?? []), def]);
  return [...groups.entries()];
}

/**
 * Shows effective permissions; when editable, ticking a permission the role lacks becomes a grant
 * and unticking one the role has becomes a revoke.
 */
export function PermissionsEditor({ target, editable }: { target: AdminUser; editable: boolean }) {
  const { user: me, can } = usePermissions();
  const catalog = usePermissionCatalog(can('permissions.read'));
  const roles = useRoles(can('roles.read'));
  const [selected, setSelected] = useState<Set<Permission>>(() => new Set(target.permissions));
  const save = useUserMutation((v: { grants: Permission[]; revokes: Permission[] }) =>
    setUserPermissions(target.id, v.grants, v.revokes),
  );

  const rolePermissions = useMemo(
    () => new Set(roles.data?.find((r) => r.key === target.role)?.permissions ?? []),
    [roles.data, target.role],
  );
  const grants = [...selected].filter((p) => !rolePermissions.has(p));
  const revokes = [...rolePermissions].filter((p) => !selected.has(p));
  const key = (list: Permission[]) => [...list].sort().join();
  const dirty = key(grants) !== key(target.grants) || key(revokes) !== key(target.revokes);

  function toggle(p: Permission, on: boolean) {
    setSelected((s) => {
      const next = new Set(s);
      if (on) next.add(p);
      else next.delete(p);
      return next;
    });
  }

  async function submit() {
    try {
      await save.mutateAsync({ grants, revokes });
      toast.success('Permissions updated. They apply on the next request.');
    } catch (err) {
      toast.error(errorMessage(err));
    }
  }

  const description =
    target.role === 'super_admin'
      ? 'Super Admins always have every permission.'
      : editable
        ? 'Changes here override the role for this person only.'
        : 'What this person can do: their role plus any individual changes.';

  if (!catalog.data || (editable && !roles.data)) {
    return (
      <SectionCard title="Permissions" description={description}>
        {catalog.isPending || roles.isPending ? (
          <div role="status" aria-label="Loading permissions" className="space-y-2">
            <Skeleton className="h-5 w-1/2" />
            <Skeleton className="h-5 w-2/3" />
            <Skeleton className="h-5 w-1/3" />
          </div>
        ) : (
          <ul className="flex flex-wrap gap-2">
            {target.permissions.map((p) => (
              <li key={p}>
                <Badge>{p}</Badge>
              </li>
            ))}
          </ul>
        )}
      </SectionCard>
    );
  }

  return (
    <SectionCard
      title="Permissions"
      description={description}
      actions={
        editable && (
          <Button
            onClick={() => void submit()}
            loading={save.isPending}
            disabled={!dirty}
            size="sm"
          >
            Save permissions
          </Button>
        )
      }
    >
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {groupPermissions(catalog.data).map(([group, defs]) => (
          <fieldset key={group}>
            <legend className="text-fg text-sm font-semibold">{group}</legend>
            <div className="mt-2 space-y-1">
              {defs.map((def) => {
                const on = selected.has(def.key);
                const fromRole = rolePermissions.has(def.key);
                // Nobody can grant what they do not hold themselves (the backend enforces this too).
                const cannotGrant = !on && !fromRole && !me?.permissions.includes(def.key);
                const note = !roles.data
                  ? undefined
                  : on && !fromRole
                    ? 'Added for this person'
                    : !on && fromRole
                      ? 'Removed for this person'
                      : undefined;
                return (
                  <Checkbox
                    key={def.key}
                    label={def.label}
                    description={note}
                    checked={on}
                    disabled={!editable || cannotGrant}
                    onChange={(e) => toggle(def.key, e.target.checked)}
                  />
                );
              })}
            </div>
          </fieldset>
        ))}
      </div>
    </SectionCard>
  );
}
