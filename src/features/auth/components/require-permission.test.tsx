import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { useAuthStore } from '@/store/auth-store';
import type { PublicUser } from '@/types/auth';
import { RequirePermission } from './require-permission';

vi.mock('next/link', () => ({
  default: ({ href, children, ...rest }: { href: string; children: React.ReactNode }) => (
    <a href={href} {...rest}>
      {children}
    </a>
  ),
}));

const viewer: PublicUser = {
  id: '1',
  name: 'Vera Viewer',
  email: 'vera@example.com',
  role: 'viewer',
  permissions: ['posts.read', 'profile.read'],
};

afterEach(() => {
  cleanup();
  useAuthStore.getState().setUnauthenticated();
});

describe('RequirePermission', () => {
  it('renders the page when every required permission is held', () => {
    useAuthStore.getState().setAuthenticated(viewer);
    render(
      <RequirePermission all={['posts.read']}>
        <p>Posts page</p>
      </RequirePermission>,
    );
    expect(screen.getByText('Posts page')).toBeTruthy();
  });

  it('shows a clear no-access state instead of the page otherwise', () => {
    useAuthStore.getState().setAuthenticated(viewer);
    render(
      <RequirePermission all={['users.read']}>
        <p>Users page</p>
      </RequirePermission>,
    );
    expect(screen.queryByText('Users page')).toBeNull();
    expect(screen.getByRole('alert').textContent).toContain('You do not have access to this page');
  });

  it('accepts any one of several permissions', () => {
    useAuthStore.getState().setAuthenticated(viewer);
    render(
      <RequirePermission any={['posts.create', 'posts.read']}>
        <p>Blog</p>
      </RequirePermission>,
    );
    expect(screen.getByText('Blog')).toBeTruthy();
  });
});
