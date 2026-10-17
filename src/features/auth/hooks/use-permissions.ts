'use client';

import { useCallback } from 'react';
import { useAuthStore } from '@/store/auth-store';
import type { Permission } from '@/types/auth';

/**
 * `can('posts.publish')` or `can(['users.read', 'users.update'])` (all required).
 * This only decides what the UI shows; the backend checks every request itself.
 */
export function usePermissions() {
  const user = useAuthStore((s) => s.user);
  const can = useCallback(
    (required: Permission | Permission[]) => {
      if (!user) return false;
      const list = Array.isArray(required) ? required : [required];
      return list.every((p) => user.permissions.includes(p));
    },
    [user],
  );
  const canAny = useCallback(
    (options: Permission[]) => Boolean(user && options.some((p) => user.permissions.includes(p))),
    [user],
  );
  return { user, can, canAny };
}
