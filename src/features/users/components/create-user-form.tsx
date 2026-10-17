'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Alert } from '@/components/feedback/alert';
import { PageHeader } from '@/components/layout/page-header';
import { Button, ButtonLink } from '@/components/ui/button';
import { SectionCard } from '@/components/ui/card';
import { Field, Input, Select } from '@/components/ui/field';
import { usePermissions } from '@/features/auth/hooks/use-permissions';
import { newPassword } from '@/features/auth/schemas/auth.schemas';
import { applyFieldErrors } from '@/lib/forms';
import { errorMessage } from '@/lib/http';
import { toast } from '@/store/toast-store';
import { ROLE_KEYS, ROLE_LABELS, type RoleKey } from '@/types/auth';
import { useRoles, useUserMutation } from '../hooks/use-users';
import { createUser } from '../services/users.service';

const schema = z.object({
  name: z.string().trim().min(2, 'Enter at least 2 characters.').max(100),
  email: z
    .string()
    .trim()
    .min(1, 'Enter an email address.')
    .pipe(z.email('Enter a valid email address.')),
  password: newPassword,
  role: z.enum(ROLE_KEYS),
});
type Values = z.infer<typeof schema>;

export function CreateUserForm() {
  const router = useRouter();
  const { user, can } = usePermissions();
  const roles = useRoles(can('roles.read'));
  const [serverError, setServerError] = useState<string | null>(null);
  const create = useUserMutation(createUser);

  // Offer only roles this user can hand out: Super Admin only by a Super Admin, and nothing
  // with more permissions than their own (the backend enforces the same rules).
  const assignable = ROLE_KEYS.filter((key) => {
    if (!can('roles.assign')) return key === 'viewer';
    if (key === 'super_admin') return user?.role === 'super_admin';
    const def = roles.data?.find((r) => r.key === key);
    return !def || def.permissions.every((p) => user?.permissions.includes(p));
  });

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { name: '', email: '', password: '', role: 'viewer' },
  });

  async function onSubmit(values: Values) {
    setServerError(null);
    try {
      const created = await create.mutateAsync(values);
      toast.success(`${created.name} can now sign in.`);
      router.push(`/dashboard/users/${created.id}`);
    } catch (err) {
      if (!applyFieldErrors(err, setError, ['name', 'email', 'password', 'role'])) {
        setServerError(errorMessage(err));
      }
    }
  }

  return (
    <div className="mx-auto max-w-(--container-narrow) space-y-6">
      <PageHeader
        title="Add a user"
        description="Create a staff account and choose what they can do."
        back={{ href: '/dashboard/users', label: 'Back to users' }}
      />
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <SectionCard title="Account details">
          <div className="space-y-5">
            {serverError && <Alert tone="danger">{serverError}</Alert>}
            <Field label="Full name" required error={errors.name?.message}>
              <Input autoComplete="off" {...register('name')} />
            </Field>
            <Field label="Email" required error={errors.email?.message}>
              <Input type="email" autoComplete="off" inputMode="email" {...register('email')} />
            </Field>
            <Field
              label="Initial password"
              required
              hint="At least 12 characters. Share it privately; they can change it from their profile."
              error={errors.password?.message}
            >
              <Input type="password" autoComplete="new-password" {...register('password')} />
            </Field>
            <Field
              label="Role"
              required
              error={errors.role?.message}
              hint={can('roles.assign') ? undefined : 'You can only create Viewers.'}
            >
              <Select {...register('role')}>
                {assignable.map((key: RoleKey) => (
                  <option key={key} value={key}>
                    {ROLE_LABELS[key]}
                  </option>
                ))}
              </Select>
            </Field>
            <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end sm:gap-3">
              <ButtonLink href="/dashboard/users" variant="secondary">
                Cancel
              </ButtonLink>
              <Button type="submit" loading={isSubmitting}>
                Create user
              </Button>
            </div>
          </div>
        </SectionCard>
      </form>
    </div>
  );
}
