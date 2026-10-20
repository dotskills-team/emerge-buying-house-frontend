// Mirrors the backend contract in emerge-buying-house-backend/src/modules/access/permissions.ts.
// The backend is the authority: these values only decide what the UI shows.
export const ROLE_KEYS = ['super_admin', 'admin', 'content_manager', 'author', 'viewer'] as const;
export type RoleKey = (typeof ROLE_KEYS)[number];

export const ROLE_LABELS: Record<RoleKey, string> = {
  super_admin: 'Super Admin',
  admin: 'Admin',
  content_manager: 'Content Manager',
  author: 'Author',
  viewer: 'Viewer',
};

export type Permission =
  | 'users.read'
  | 'users.create'
  | 'users.update'
  | 'users.status'
  | 'roles.read'
  | 'roles.assign'
  | 'roles.manage'
  | 'permissions.read'
  | 'permissions.assign'
  | 'audit.read'
  | 'posts.read'
  | 'posts.create'
  | 'posts.update'
  | 'posts.publish'
  | 'posts.delete'
  | 'categories.manage'
  | 'products.read'
  | 'products.manage'
  | 'products.publish'
  | 'products.delete'
  | 'products.categories'
  | 'media.upload'
  | 'inquiries.read'
  | 'inquiries.manage'
  | 'inquiries.delete'
  | 'profile.read'
  | 'profile.update'
  | 'auth.password.change';

export interface PublicUser {
  id: string;
  name: string;
  email: string;
  role: RoleKey;
  permissions: Permission[];
}

export interface AuthPayload {
  accessToken: string;
  expiresIn: number;
  user: PublicUser;
}

export const isRoleKey = (value: string): value is RoleKey =>
  (ROLE_KEYS as readonly string[]).includes(value);
