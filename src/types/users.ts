import type { Permission, RoleKey } from './auth';
import type { PageMeta } from './api';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: RoleKey;
  grants: Permission[];
  revokes: Permission[];
  permissions: Permission[];
  isActive: boolean;
  locked: boolean;
  lastLoginAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface UserListParams {
  q?: string;
  role?: RoleKey;
  status?: 'active' | 'inactive';
  page: number;
  limit: number;
}

export interface UserListResult {
  items: AdminUser[];
  meta: PageMeta;
}

export interface CreateUserInput {
  name: string;
  email: string;
  password: string;
  role: RoleKey;
}

export interface RoleSummary {
  key: RoleKey;
  name: string;
  description: string;
  permissions: Permission[];
  protected: boolean;
  userCount: number;
}

export interface PermissionDef {
  key: Permission;
  group: string;
  label: string;
}

export interface AuditEntry {
  id: string;
  action: string;
  targetType: 'user' | 'role';
  targetId: string;
  details: Record<string, unknown>;
  actor: { id: string; name: string; email: string } | null;
  createdAt: string;
}

export interface Profile {
  id: string;
  name: string;
  email: string;
  role: RoleKey;
  roleName: string;
  permissions: Permission[];
  lastLoginAt: string | null;
  createdAt: string;
}
