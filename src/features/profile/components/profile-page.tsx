'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';
import { Alert } from '@/components/feedback/alert';
import { ErrorState } from '@/components/feedback/states';
import { PageHeader } from '@/components/layout/page-header';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, SectionCard } from '@/components/ui/card';
import { Field, Input } from '@/components/ui/field';
import { Skeleton } from '@/components/ui/skeleton';
import { usePermissions } from '@/features/auth/hooks/use-permissions';
import {
  changePasswordSchema,
  type ChangePasswordValues,
} from '@/features/auth/schemas/auth.schemas';
import { changePassword, getProfile, updateProfile } from '../services/profile.service';
import { applyFieldErrors } from '@/lib/forms';
import { ApiError, errorMessage } from '@/lib/http';
import { formatDateTime } from '@/lib/utils';
import { useAuthStore } from '@/store/auth-store';
import { toast } from '@/store/toast-store';
import type { Profile } from '@/types/users';

const nameSchema = z.object({
  name: z.string().trim().min(2, 'Enter at least 2 characters.').max(100),
});
type NameValues = z.infer<typeof nameSchema>;

function NameForm({ profile }: { profile: Profile }) {
  const queryClient = useQueryClient();
  const [serverError, setServerError] = useState<string | null>(null);
  const save = useMutation({ mutationFn: (v: NameValues) => updateProfile(v.name) });
  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<NameValues>({
    resolver: zodResolver(nameSchema),
    defaultValues: { name: profile.name },
  });

  async function onSubmit(values: NameValues) {
    setServerError(null);
    try {
      const saved = await save.mutateAsync(values);
      queryClient.setQueryData(['profile'], saved);
      const current = useAuthStore.getState().user;
      if (current) useAuthStore.getState().setUser({ ...current, name: saved.name });
      reset({ name: saved.name });
      toast.success('Your name has been updated.');
    } catch (err) {
      if (!applyFieldErrors(err, setError, ['name'])) setServerError(errorMessage(err));
    }
  }

  return (
    <SectionCard
      title="Personal details"
      description="Your email, role and permissions are managed by an administrator."
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
        {serverError && <Alert tone="danger">{serverError}</Alert>}
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Full name" error={errors.name?.message}>
            <Input autoComplete="name" {...register('name')} />
          </Field>
          <Field label="Email" hint="Ask an administrator to change your email.">
            <Input value={profile.email} readOnly disabled />
          </Field>
        </div>
        <div className="flex justify-end">
          <Button type="submit" loading={isSubmitting} disabled={!isDirty}>
            Save
          </Button>
        </div>
      </form>
    </SectionCard>
  );
}

function PasswordForm() {
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ChangePasswordValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: { currentPassword: '', newPassword: '', confirm: '' },
  });

  async function onSubmit(values: ChangePasswordValues) {
    setServerError(null);
    try {
      await changePassword(values.currentPassword, values.newPassword);
      reset();
      toast.success('Password changed. You have been signed out on your other devices.');
    } catch (err) {
      if (err instanceof ApiError && err.code === 'INVALID_CURRENT_PASSWORD') {
        setError('currentPassword', { message: err.message });
      } else if (err instanceof ApiError && err.code === 'PASSWORD_UNCHANGED') {
        setError('newPassword', { message: err.message });
      } else if (!applyFieldErrors(err, setError, ['currentPassword', 'newPassword'])) {
        setServerError(errorMessage(err));
      }
    }
  }

  return (
    <SectionCard
      title="Change password"
      description="Other devices are signed out when you change it."
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
        {serverError && <Alert tone="danger">{serverError}</Alert>}
        <Field label="Current password" error={errors.currentPassword?.message}>
          <Input type="password" autoComplete="current-password" {...register('currentPassword')} />
        </Field>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field
            label="New password"
            hint="At least 12 characters."
            error={errors.newPassword?.message}
          >
            <Input type="password" autoComplete="new-password" {...register('newPassword')} />
          </Field>
          <Field label="Confirm new password" error={errors.confirm?.message}>
            <Input type="password" autoComplete="new-password" {...register('confirm')} />
          </Field>
        </div>
        <div className="flex justify-end">
          <Button type="submit" loading={isSubmitting}>
            Change password
          </Button>
        </div>
      </form>
    </SectionCard>
  );
}

export function ProfilePage() {
  const { can } = usePermissions();
  const { data, isPending, isError, error, refetch } = useQuery({
    queryKey: ['profile'],
    queryFn: getProfile,
  });

  const header = (
    <PageHeader title="Your profile" description="Your account details and password." />
  );

  if (isPending) {
    return (
      <div className="mx-auto max-w-(--container-narrow) space-y-6">
        {header}
        <div role="status" aria-label="Loading your profile" className="space-y-4">
          <Skeleton className="h-24" />
          <Skeleton className="h-48" />
        </div>
      </div>
    );
  }
  if (isError) {
    return (
      <div className="mx-auto max-w-(--container-narrow) space-y-6">
        {header}
        <Card>
          <ErrorState
            title="Could not load your profile"
            message={error.message}
            onRetry={() => void refetch()}
          />
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-(--container-narrow) space-y-6">
      {header}
      <dl className="border-border bg-surface grid gap-4 rounded-lg border p-5 text-sm sm:grid-cols-3">
        <div>
          <dt className="text-fg-muted">Role</dt>
          <dd className="mt-1">
            <Badge tone="info">{data.roleName}</Badge>
          </dd>
        </div>
        <div>
          <dt className="text-fg-muted">Last sign-in</dt>
          <dd className="text-fg mt-0.5 font-medium">{formatDateTime(data.lastLoginAt)}</dd>
        </div>
        <div>
          <dt className="text-fg-muted">Member since</dt>
          <dd className="text-fg mt-0.5 font-medium">{formatDateTime(data.createdAt)}</dd>
        </div>
      </dl>
      {can('profile.update') && <NameForm key={data.name} profile={data} />}
      {can('auth.password.change') && <PasswordForm />}
    </div>
  );
}
