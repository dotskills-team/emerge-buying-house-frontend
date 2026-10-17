'use client';

import type { ReactNode } from 'react';
import { ForbiddenState } from '@/components/feedback/states';
import type { Permission } from '@/types/auth';
import { usePermissions } from '../hooks/use-permissions';

/** Page-level gate: renders a clear "no access" state instead of a page that would only fail. */
export function RequirePermission({
  any,
  all,
  children,
}: {
  any?: Permission[];
  all?: Permission[];
  children: ReactNode;
}) {
  const { can, canAny } = usePermissions();
  const allowed = (all ? can(all) : true) && (any ? canAny(any) : true);
  return allowed ? <>{children}</> : <ForbiddenState />;
}
