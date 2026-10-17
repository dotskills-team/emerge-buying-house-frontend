'use client';

import { useParams } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Alert } from '@/components/feedback/alert';
import { ErrorState } from '@/components/feedback/states';
import { PageHeader } from '@/components/layout/page-header';
import { Button } from '@/components/ui/button';
import { Card, SectionCard } from '@/components/ui/card';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { Field, Input, Select } from '@/components/ui/field';
import { Skeleton } from '@/components/ui/skeleton';
import { usePermissions } from '@/features/auth/hooks/use-permissions';
import { applyFieldErrors } from '@/lib/forms';
import { errorMessage } from '@/lib/http';
import { formatDateTime } from '@/lib/utils';
import { toast } from '@/store/toast-store';
import { ROLE_KEYS, ROLE_LABELS, isRoleKey, type RoleKey } from '@/types/auth';
import type { AdminUser } from '@/types/users';
import { useRoles, useUser, useUserMutation } from '../hooks/use-users';
import { changeUserRole, setUserStatus, updateUser } from '../services/users.service';
import { PermissionsEditor } from './permissions-editor';
import { RoleBadge, StatusBadge } from './user-badges';

const detailsSchema = z.object({
  name: z.string().trim().min(2, 'Enter at least 2 characters.').max(100),
  email: z
    .string()
    .trim()
    .min(1, 'Enter an email address.')
    .pipe(z.email('Enter a valid email address.')),
});
type DetailsValues = z.infer<typeof detailsSchema>;

function DetailsForm({ target }: { target: AdminUser }) {
  const [serverError, setServerError] = useState<string | null>(null);
  const save = useUserMutation((v: DetailsValues) => updateUser(target.id, v));
  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<DetailsValues>({
    resolver: zodResolver(detailsSchema),
    defaultValues: { name: target.name, email: target.email },
  });

  async function onSubmit(values: DetailsValues) {
    setServerError(null);
    try {
      const saved = await save.mutateAsync(values);
      reset({ name: saved.name, email: saved.email });
      toast.success('Details saved.');
    } catch (err) {
      if (!applyFieldErrors(err, setError, ['name', 'email'])) setServerError(errorMessage(err));
    }
  }

  return (
    <SectionCard title="Details">
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
        {serverError && <Alert tone="danger">{serverError}</Alert>}
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Full name" error={errors.name?.message}>
            <Input {...register('name')} />
          </Field>
          <Field label="Email" error={errors.email?.message}>
            <Input type="email" inputMode="email" {...register('email')} />
          </Field>
        </div>
        <div className="flex justify-end">
          <Button type="submit" loading={isSubmitting} disabled={!isDirty}>
            Save details
          </Button>
        </div>
      </form>
    </SectionCard>
  );
}

function RoleForm({ target }: { target: AdminUser }) {
  const { user, can } = usePermissions();
  const roles = useRoles(can('roles.read'));
  const [role, setRole] = useState<RoleKey>(target.role);
  const save = useUserMutation((r: RoleKey) => changeUserRole(target.id, r));

  const assignable = ROLE_KEYS.filter((key) => {
    if (key === target.role) return true;
    if (key === 'super_admin') return user?.role === 'super_admin';
    const def = roles.data?.find((r) => r.key === key);
    return !def || def.permissions.every((p) => user?.permissions.includes(p));
  });

  async function submit() {
    try {
      await save.mutateAsync(role);
      toast.success(`Role changed to ${ROLE_LABELS[role]}.`);
    } catch (err) {
      toast.error(errorMessage(err));
      setRole(target.role);
    }
  }

  return (
    <SectionCard title="Role" description="The role decides most of what this person can do.">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <Field label="Role" className="flex-1">
          <Select
            value={role}
            onChange={(e) => {
              const v = e.target.value;
              if (isRoleKey(v)) setRole(v);
            }}
          >
            {assignable.map((key) => (
              <option key={key} value={key}>
                {ROLE_LABELS[key]}
              </option>
            ))}
          </Select>
        </Field>
        <Button
          onClick={() => void submit()}
          loading={save.isPending}
          disabled={role === target.role}
        >
          Change role
        </Button>
      </div>
      {roles.data && (
        <p className="text-fg-muted mt-3 text-sm">
          {roles.data.find((r) => r.key === role)?.description}
        </p>
      )}
    </SectionCard>
  );
}

function StatusForm({ target }: { target: AdminUser }) {
  const [confirming, setConfirming] = useState(false);
  const save = useUserMutation((isActive: boolean) => setUserStatus(target.id, isActive));

  async function apply(isActive: boolean) {
    try {
      await save.mutateAsync(isActive);
      toast.success(
        isActive ? `${target.name} can sign in again.` : `${target.name} has been deactivated.`,
      );
    } catch (err) {
      toast.error(errorMessage(err));
    } finally {
      setConfirming(false);
    }
  }

  return (
    <SectionCard title="Access">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-fg-muted text-sm">
          {target.isActive
            ? 'This account can sign in. Deactivating it signs them out everywhere immediately.'
            : 'This account cannot sign in. Reactivate it to restore access.'}
        </p>
        {target.isActive ? (
          <Button variant="danger" onClick={() => setConfirming(true)} className="shrink-0">
            Deactivate account
          </Button>
        ) : (
          <Button onClick={() => void apply(true)} loading={save.isPending} className="shrink-0">
            Reactivate account
          </Button>
        )}
      </div>
      <ConfirmDialog
        open={confirming}
        tone="danger"
        pending={save.isPending}
        title={`Deactivate ${target.name}?`}
        message="They will be signed out on every device and will not be able to sign in until the account is reactivated. Their content is kept."
        confirmLabel="Deactivate"
        onConfirm={() => void apply(false)}
        onCancel={() => setConfirming(false)}
      />
    </SectionCard>
  );
}

export function UserDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { user: me, can } = usePermissions();
  const { data: target, isPending, isError, error, refetch } = useUser(id);

  if (isPending) {
    return (
      <div role="status" aria-label="Loading user" className="space-y-6">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-48" />
        <Skeleton className="h-32" />
      </div>
    );
  }
  if (isError) {
    return (
      <Card>
        <ErrorState
          title="Could not load this user"
          message={error.message}
          onRetry={() => void refetch()}
        />
      </Card>
    );
  }

  const isSelf = me?.id === target.id;
  const protectedTarget = target.role === 'super_admin' && me?.role !== 'super_admin';
  const manageable = !isSelf && !protectedTarget;

  return (
    <div className="mx-auto max-w-(--container-narrow) space-y-6">
      <PageHeader
        title={target.name}
        description={target.email}
        back={{ href: '/dashboard/users', label: 'Back to users' }}
        actions={
          <>
            <RoleBadge role={target.role} />
            <StatusBadge user={target} />
          </>
        }
      />

      <dl className="border-border bg-surface grid gap-4 rounded-lg border p-5 text-sm sm:grid-cols-3">
        <div>
          <dt className="text-fg-muted">Last sign-in</dt>
          <dd className="text-fg mt-0.5 font-medium">{formatDateTime(target.lastLoginAt)}</dd>
        </div>
        <div>
          <dt className="text-fg-muted">Created</dt>
          <dd className="text-fg mt-0.5 font-medium">{formatDateTime(target.createdAt)}</dd>
        </div>
        <div>
          <dt className="text-fg-muted">Sign-in lock</dt>
          <dd className="text-fg mt-0.5 font-medium">
            {target.locked ? 'Locked after failed attempts' : 'Not locked'}
          </dd>
        </div>
      </dl>

      {isSelf && (
        <Alert tone="info" title="This is your account">
          You cannot change your own role, status or permissions. Edit your name and password on
          your profile page.
        </Alert>
      )}
      {protectedTarget && (
        <Alert tone="info" title="Protected account">
          Only a Super Admin can change a Super Admin account.
        </Alert>
      )}

      {manageable && can('users.update') && <DetailsForm key={target.updatedAt} target={target} />}
      {manageable && can('roles.assign') && (
        <RoleForm key={`${target.id}-${target.role}`} target={target} />
      )}
      {manageable && can('users.status') && <StatusForm target={target} />}
      <PermissionsEditor
        key={`${target.role}-${target.grants.join()}-${target.revokes.join()}`}
        target={target}
        editable={manageable && can('permissions.assign') && target.role !== 'super_admin'}
      />
    </div>
  );
}
