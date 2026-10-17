import { apiFetch } from '@/lib/api';
import type { Profile } from '@/types/users';

const send = (method: string, body: unknown) => ({
  auth: true as const,
  method,
  body: JSON.stringify(body),
});

export const getProfile = () => apiFetch<Profile>('/profile', { auth: true });
export const updateProfile = (name: string) =>
  apiFetch<Profile>('/profile', send('PATCH', { name }));
export const changePassword = (currentPassword: string, newPassword: string) =>
  apiFetch<null>('/profile/password', send('POST', { currentPassword, newPassword }));
