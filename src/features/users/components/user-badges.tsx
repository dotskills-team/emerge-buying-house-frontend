import { Badge } from '@/components/ui/badge';
import { ROLE_LABELS, type RoleKey } from '@/types/auth';
import type { AdminUser } from '@/types/users';

export function RoleBadge({ role }: { role: RoleKey }) {
  return <Badge tone={role === 'super_admin' ? 'accent' : 'neutral'}>{ROLE_LABELS[role]}</Badge>;
}

export function StatusBadge({ user }: { user: Pick<AdminUser, 'isActive' | 'locked'> }) {
  if (!user.isActive) return <Badge tone="danger">Inactive</Badge>;
  if (user.locked) return <Badge tone="warning">Locked</Badge>;
  return <Badge tone="success">Active</Badge>;
}
