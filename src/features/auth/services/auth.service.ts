import { apiFetch } from '@/lib/api';
import { rawRequest } from '@/lib/http';
import { endSession } from '@/lib/session';
import { tokenStore } from '@/lib/token-store';
import type { AuthPayload, PublicUser } from '@/types/auth';
import type { LoginValues } from '../schemas/login.schema';

export async function login(values: LoginValues): Promise<AuthPayload> {
  const data = await rawRequest<AuthPayload>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(values),
  });
  tokenStore.set(data.accessToken);
  return data;
}

export async function fetchMe(): Promise<PublicUser> {
  const data = await apiFetch<{ user: PublicUser }>('/auth/me', { auth: true });
  return data.user;
}

export const logout = endSession;