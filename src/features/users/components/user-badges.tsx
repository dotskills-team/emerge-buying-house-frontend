import { Badge } from '@/components/ui/badge';
import { ROLE_LABELS, type RoleKey } from '@/types/auth';
import type { AdminUser } from '@/types/users';

export function RoleBadge({ role }: { role: RoleKey }) {
  return <Badge tone={role === 'super_admin' ? 'secondary' : 'neutral'}>{ROLE_LABELS[role]}</Badge>;
}

export function StatusBadge({ user }: { user: Pick<AdminUser, 'isActive' | 'locked'> }) {
  if (!user.isActive)
    return (
      <Badge tone="danger" dot>
        Inactive
      </Badge>
    );
  if (user.locked)
    return (
      <Badge tone="warning" dot>
        Locked
      </Badge>
    );
  return (
    <Badge tone="success" dot>
      Active
    </Badge>
  );
}

/** Initials avatar; Super Admins get the brand gradient so they stand out in lists. */
export function UserAvatar({ name, role }: { name: string; role: RoleKey }) {
  const initials = name
    .split(/\s+/)
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
  return (
    <span
      aria-hidden
      className={
        role === 'super_admin'
          ? 'text-fg-inverse flex size-9 shrink-0 items-center justify-center rounded-full bg-(image:--gradient-brand) text-xs font-semibold'
          : 'bg-primary-soft text-primary flex size-9 shrink-0 items-center justify-center rounded-full text-xs font-semibold'
      }
    >
      {initials}
    </span>
  );
}
