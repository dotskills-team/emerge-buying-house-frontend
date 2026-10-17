import { apiFetch } from '@/lib/api';
import { toQuery } from '@/lib/utils';
import type { Paginated } from '@/types/api';
import type { Permission, RoleKey } from '@/types/auth';
import type {
  AdminUser,
  AuditEntry,
  CreateUserInput,
  PermissionDef,
  RoleSummary,
  UserListParams,
  UserListResult,
} from '@/types/users';

const send = (method: string, body?: unknown) => ({
  auth: true as const,
  method,
  ...(body === undefined ? {} : { body: JSON.stringify(body) }),
});

/* Users (administration) */
export const listUsers = (params: UserListParams) =>
  apiFetch<UserListResult>(`/users${toQuery({ ...params })}`, { auth: true });
export const getUser = (id: string) => apiFetch<AdminUser>(`/users/${id}`, { auth: true });
export const createUser = (input: CreateUserInput) =>
  apiFetch<AdminUser>('/users', send('POST', input));
export const updateUser = (id: string, input: { name?: string; email?: string }) =>
  apiFetch<AdminUser>(`/users/${id}`, send('PATCH', input));
export const changeUserRole = (id: string, role: RoleKey) =>
  apiFetch<AdminUser>(`/users/${id}/role`, send('PATCH', { role }));
export const setUserStatus = (id: string, isActive: boolean) =>
  apiFetch<AdminUser>(`/users/${id}/status`, send('PATCH', { isActive }));
export const setUserPermissions = (id: string, grants: Permission[], revokes: Permission[]) =>
  apiFetch<AdminUser>(`/users/${id}/permissions`, send('PUT', { grants, revokes }));

/* Roles and permissions */
export const listRoles = () => apiFetch<RoleSummary[]>('/roles', { auth: true });
export const listPermissions = () => apiFetch<PermissionDef[]>('/permissions', { auth: true });
export const updateRolePermissions = (key: RoleKey, permissions: Permission[]) =>
  apiFetch<RoleSummary>(`/roles/${key}/permissions`, send('PUT', { permissions }));

/* Audit */
export const listAudit = (page: number) =>
  apiFetch<Paginated<AuditEntry>>(`/audit-logs${toQuery({ page, limit: 25 })}`, { auth: true });
