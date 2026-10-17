'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { ChevronDown, LogOut, Menu, UserCircle, X } from 'lucide-react';
import { Logo } from '@/components/layout/logo';
import { Button } from '@/components/ui/button';
import { usePermissions } from '@/features/auth/hooks/use-permissions';
import { fetchMe, logout } from '@/features/auth/services/auth.service';
import { errorMessage } from '@/lib/http';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store/auth-store';
import { toast } from '@/store/toast-store';
import { ROLE_LABELS } from '@/types/auth';
import { DASHBOARD_NAV, activeHref } from '../navigation';

function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const { canAny } = usePermissions();
  const groups = DASHBOARD_NAV.map((g) => ({
    ...g,
    items: g.items.filter((i) => !i.anyOf || canAny(i.anyOf)),
  })).filter((g) => g.items.length > 0);
  const current = activeHref(
    pathname,
    groups.flatMap((g) => g.items.map((i) => i.href)),
  );

  return (
    <div className="bg-surface-inverse text-fg-inverse flex h-full flex-col">
      <div className="flex h-(--header-height) shrink-0 items-center border-b border-white/10 px-5">
        <Link href="/" onClick={onNavigate} aria-label="Go to the website">
          <Logo inverse />
        </Link>
      </div>
      <nav aria-label="Dashboard" className="flex-1 space-y-6 overflow-y-auto px-3 py-5">
        {groups.map((group) => (
          <div key={group.label}>
            <p className="text-fg-inverse-muted px-3 pb-2 text-xs font-medium tracking-wide uppercase">
              {group.label}
            </p>
            <ul className="space-y-0.5">
              {group.items.map(({ href, label, icon: Icon }) => {
                const active = href === current;
                return (
                  <li key={href}>
                    <Link
                      href={href}
                      onClick={onNavigate}
                      aria-current={active ? 'page' : undefined}
                      className={cn(
                        'flex min-h-10 items-center gap-3 rounded-md px-3 text-sm transition-colors',
                        active
                          ? 'text-fg-inverse bg-white/10 font-medium'
                          : 'text-fg-inverse-muted hover:text-fg-inverse hover:bg-white/5',
                      )}
                    >
                      <Icon size={18} className="shrink-0" aria-hidden />
                      {label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>
    </div>
  );
}

function UserMenu({ onSignOut, signingOut }: { onSignOut: () => void; signingOut: boolean }) {
  const user = useAuthStore((s) => s.user);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const initials =
    user?.name
      .split(/\s+/)
      .map((p) => p[0])
      .slice(0, 2)
      .join('')
      .toUpperCase() ?? '';

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  if (!user) return null;

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="hover:bg-surface-muted flex min-h-11 items-center gap-3 rounded-md px-1.5 transition-colors"
      >
        <span
          aria-hidden
          className="bg-primary text-fg-inverse flex size-9 items-center justify-center rounded-full text-xs font-semibold"
        >
          {initials}
        </span>
        <span className="hidden text-left leading-tight md:block">
          <span className="text-fg block max-w-48 truncate text-sm font-medium">{user.name}</span>
          <span className="text-fg-subtle text-xs">{ROLE_LABELS[user.role]}</span>
        </span>
        <ChevronDown
          size={16}
          aria-hidden
          className={cn(
            'text-fg-subtle hidden transition-transform md:block',
            open && 'rotate-180',
          )}
        />
        <span className="sr-only">Account menu</span>
      </button>

      {open && (
        <div
          role="menu"
          className="border-border bg-surface absolute right-0 z-(--z-drawer) mt-2 w-[min(16rem,calc(100vw-2rem))] overflow-hidden rounded-lg border shadow-md"
        >
          <div className="border-border border-b px-4 py-3">
            <p className="text-fg truncate text-sm font-medium">{user.name}</p>
            <p className="text-fg-subtle truncate text-xs">{user.email}</p>
          </div>
          <div className="p-1">
            <Link
              role="menuitem"
              href="/dashboard/profile"
              onClick={() => setOpen(false)}
              className="text-fg hover:bg-surface-muted flex min-h-10 items-center gap-3 rounded-md px-3 text-sm"
            >
              <UserCircle size={16} aria-hidden /> Profile
            </Link>
            <button
              role="menuitem"
              type="button"
              onClick={onSignOut}
              disabled={signingOut}
              className="text-fg hover:bg-surface-muted flex min-h-10 w-full items-center gap-3 rounded-md px-3 text-sm disabled:opacity-60"
            >
              <LogOut size={16} aria-hidden /> {signingOut ? 'Signing out…' : 'Sign out'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export function DashboardShell({ children }: { children: ReactNode }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  // Picks up role or permission changes an administrator made, e.g. when the tab regains focus.
  const me = useQuery({ queryKey: ['auth', 'me'], queryFn: fetchMe, refetchOnWindowFocus: true });
  useEffect(() => {
    if (me.data) useAuthStore.getState().setUser(me.data);
  }, [me.data]);

  async function handleLogout() {
    setSigningOut(true);
    try {
      await logout();
      queryClient.clear();
      useAuthStore.getState().setUnauthenticated(true);
      router.replace('/login');
    } catch (err) {
      toast.error(errorMessage(err, 'Could not sign out. Try again.'));
      setSigningOut(false);
    }
  }

  useEffect(() => {
    if (!drawerOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setDrawerOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [drawerOpen]);

  return (
    <div className="min-h-svh">
      <aside className="fixed inset-y-0 left-0 z-(--z-drawer) hidden w-(--sidebar-width) lg:block">
        <Sidebar />
      </aside>

      {drawerOpen && (
        <div
          className="fixed inset-0 z-(--z-modal) lg:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Navigation"
        >
          <button
            type="button"
            aria-label="Close navigation"
            onClick={() => setDrawerOpen(false)}
            className="bg-surface-inverse/50 absolute inset-0"
          />
          <aside className="relative h-full w-(--sidebar-width) max-w-[85vw] shadow-lg">
            <Sidebar onNavigate={() => setDrawerOpen(false)} />
            <button
              type="button"
              onClick={() => setDrawerOpen(false)}
              aria-label="Close navigation"
              className="bg-surface text-fg absolute top-3 -right-13 inline-flex size-11 items-center justify-center rounded-md"
            >
              <X size={18} aria-hidden />
            </button>
          </aside>
        </div>
      )}

      <div className="lg:pl-(--sidebar-width)">
        <header className="border-border bg-surface/90 sticky top-0 z-(--z-header) border-b backdrop-blur">
          <div className="flex h-(--header-height) items-center gap-3 px-(--page-gutter)">
            <Button
              variant="ghost"
              onClick={() => setDrawerOpen(true)}
              aria-label="Open navigation"
              className="-ml-2 size-11 px-0 lg:hidden"
            >
              <Menu size={20} aria-hidden />
            </Button>
            <div className="ml-auto">
              <UserMenu onSignOut={() => void handleLogout()} signingOut={signingOut} />
            </div>
          </div>
        </header>
        <main className="mx-auto w-full max-w-(--container-content) px-(--page-gutter) py-6 sm:py-8">
          {children}
        </main>
      </div>
    </div>
  );
}
