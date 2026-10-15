'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import {
  Bell,
  ChevronDown,
  ClipboardList,
  Factory,
  FileText,
  LayoutDashboard,
  Loader2,
  LogOut,
  Menu,
  Scissors,
  Search,
  Settings,
  Ship,
  ShieldCheck,
  Users,
  X,
} from 'lucide-react';
import { SITE } from '@/lib/constants';
import { useAuthStore } from '@/store/auth-store';
import { logout } from '../services/auth.service';

const NAV = [
  {
    label: 'Workspace',
    items: [
      { href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
      { href: '/dashboard/orders', label: 'Orders', icon: ClipboardList },
      { href: '/dashboard/sampling', label: 'Sampling', icon: Scissors },
      { href: '/dashboard/shipments', label: 'Shipments', icon: Ship },
    ],
  },
  {
    label: 'Partners',
    items: [
      { href: '/dashboard/buyers', label: 'Buyers', icon: Users },
      { href: '/dashboard/factories', label: 'Factories', icon: Factory },
    ],
  },
  {
    label: 'Compliance',
    items: [
      { href: '/dashboard/quality', label: 'Quality control', icon: ShieldCheck },
      { href: '/dashboard/documents', label: 'Documents', icon: FileText },
    ],
  },
];

function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col bg-navy-900 text-white">
      <div className="flex h-16 items-center gap-3 border-b border-white/10 px-6">
        <span
          aria-hidden
          className="flex h-8 w-8 items-center justify-center rounded-sm bg-amber-400 font-serif text-lg font-semibold text-navy-900"
        >
          {SITE.name.charAt(0)}
        </span>
        <div className="leading-tight">
          <p className="font-serif text-lg">{SITE.name}</p>
          <p className="text-xs text-white/50">Buying house</p>
        </div>
      </div>

      <nav aria-label="Main" className="flex-1 space-y-7 overflow-y-auto px-3 py-6">
        {NAV.map((group) => (
          <div key={group.label}>
            <p className="px-3 pb-2 text-xs text-white/40">{group.label}</p>
            <ul className="space-y-0.5">
              {group.items.map(({ href, label, icon: Icon }) => {
                const active =
                  href === '/dashboard' ? pathname === href : pathname.startsWith(href);
                return (
                  <li key={href}>
                    <Link
                      href={href}
                      onClick={onNavigate}
                      aria-current={active ? 'page' : undefined}
                      className={`relative flex items-center gap-3 rounded-sm px-3 py-2.5 text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400 ${
                        active
                          ? 'bg-white/10 font-medium text-white'
                          : 'text-white/65 hover:bg-white/5 hover:text-white'
                      }`}
                    >
                      {active && (
                        <span className="absolute top-2 bottom-2 left-0 w-0.5 rounded-full bg-amber-400" />
                      )}
                      <Icon className="h-4 w-4 shrink-0" aria-hidden />
                      {label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="border-t border-white/10 p-3">
        <Link
          href="/dashboard/settings"
          onClick={onNavigate}
          className="flex items-center gap-3 rounded-sm px-3 py-2.5 text-sm text-white/65 transition-colors hover:bg-white/5 hover:text-white focus-visible:outline-2 focus-visible:outline-amber-400"
        >
          <Settings className="h-4 w-4" aria-hidden />
          Settings
        </Link>
      </div>
    </div>
  );
}

function UserMenu({ onSignOut, signingOut }: { onSignOut: () => void; signingOut: boolean }) {
  const user = useAuthStore((s) => s.user);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const initials =
    user?.name
      ?.split(' ')
      .map((p: string) => p[0])
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

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="flex items-center gap-3 rounded-sm py-1 pr-2 pl-1 transition-colors hover:bg-navy-100 focus-visible:outline-2 focus-visible:outline-navy-900"
      >
        <span
          aria-hidden
          className="flex h-9 w-9 items-center justify-center rounded-full bg-navy-900 text-xs font-medium text-white"
        >
          {initials}
        </span>
        <span className="hidden text-left text-sm leading-tight md:block">
          <span className="block font-medium text-navy-900">{user?.name}</span>
          <span className="text-ink-soft text-xs">{user?.email}</span>
        </span>
        <ChevronDown
          aria-hidden
          className={`text-ink-soft hidden h-4 w-4 transition-transform md:block ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <div
          role="menu"
          className="border-line absolute right-0 mt-2 w-64 overflow-hidden rounded-sm border bg-white shadow-[0_12px_32px_-8px_rgba(15,23,42,0.18)]"
        >
          <div className="border-line border-b px-4 py-3">
            <p className="truncate text-sm font-medium text-navy-900">{user?.name}</p>
            <p className="text-ink-soft truncate text-xs">{user?.email}</p>
          </div>
          <div className="p-1">
            <Link
              role="menuitem"
              href="/dashboard/settings"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 rounded-sm px-3 py-2 text-sm text-navy-900 hover:bg-navy-100"
            >
              <Settings className="h-4 w-4" aria-hidden />
              Account settings
            </Link>
            <button
              role="menuitem"
              type="button"
              onClick={onSignOut}
              disabled={signingOut}
              className="flex w-full items-center gap-3 rounded-sm px-3 py-2 text-sm text-navy-900 hover:bg-navy-100 disabled:opacity-60"
            >
              {signingOut ? (
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
              ) : (
                <LogOut className="h-4 w-4" aria-hidden />
              )}
              {signingOut ? 'Signing out…' : 'Sign out'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function Topbar(props: {
  onMenu: () => void;
  onSignOut: () => void;
  signingOut: boolean;
  error: string | null;
  onDismissError: () => void;
}) {
  return (
    <header className="border-line sticky top-0 z-30 border-b bg-white/90 backdrop-blur">
      <div className="flex h-16 items-center gap-3 px-4 sm:px-8">
        <button
          type="button"
          onClick={props.onMenu}
          aria-label="Open navigation"
          className="rounded-sm p-2 text-navy-900 hover:bg-navy-100 focus-visible:outline-2 focus-visible:outline-navy-900 lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>

        <label className="relative hidden max-w-md flex-1 sm:block">
          <span className="sr-only">Search orders, styles or buyers</span>
          <Search
            className="text-ink-soft pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2"
            aria-hidden
          />
          <input
            type="search"
            placeholder="Search orders, styles or buyers"
            className="border-line placeholder:text-ink-soft w-full rounded-sm border bg-white py-2 pr-3 pl-9 text-sm text-navy-900 focus:border-navy-900 focus:outline-none"
          />
        </label>

        <div className="ml-auto flex items-center gap-1 sm:gap-3">
          <button
            type="button"
            aria-label="Notifications"
            className="relative rounded-sm p-2 text-navy-900 hover:bg-navy-100 focus-visible:outline-2 focus-visible:outline-navy-900"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-amber-500 ring-2 ring-white" />
          </button>
          <div className="border-line border-l pl-2 sm:pl-4">
            <UserMenu onSignOut={props.onSignOut} signingOut={props.signingOut} />
          </div>
        </div>
      </div>

      {props.error && (
        <div
          role="alert"
          className="flex items-center justify-between gap-4 border-t border-red-200 bg-red-50 px-4 py-2 text-sm text-red-800 sm:px-8"
        >
          <p>{props.error}</p>
          <button
            type="button"
            onClick={props.onDismissError}
            aria-label="Dismiss"
            className="rounded-sm p-1 hover:bg-red-100"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}
    </header>
  );
}

export function DashboardShell({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const queryClient = useQueryClient();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleLogout() {
    setSigningOut(true);
    setError(null);
    try {
      await logout();
      queryClient.clear();
      useAuthStore.getState().setUnauthenticated(true);
      router.replace('/login');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not sign out. Try again.');
      setSigningOut(false);
    }
  }

  useEffect(() => setDrawerOpen(false), [pathname]);

  useEffect(() => {
    if (!drawerOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setDrawerOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [drawerOpen]);

  return (
    <div className="min-h-svh bg-stone-wash">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 lg:block">
        <Sidebar />
      </aside>

      {drawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true">
          <button
            type="button"
            aria-label="Close navigation"
            onClick={() => setDrawerOpen(false)}
            className="absolute inset-0 bg-navy-900/50"
          />
          <aside className="relative h-full w-64 max-w-[85vw]">
            <Sidebar onNavigate={() => setDrawerOpen(false)} />
            <button
              type="button"
              onClick={() => setDrawerOpen(false)}
              aria-label="Close navigation"
              className="absolute top-4 -right-12 rounded-sm bg-white p-2 text-navy-900"
            >
              <X className="h-4 w-4" />
            </button>
          </aside>
        </div>
      )}

      <div className="lg:pl-64">
        <Topbar
          onMenu={() => setDrawerOpen(true)}
          onSignOut={() => void handleLogout()}
          signingOut={signingOut}
          error={error}
          onDismissError={() => setError(null)}
        />
        <main className="mx-auto max-w-6xl px-4 py-8 sm:px-8 sm:py-10">{children}</main>
      </div>
    </div>
  );
}
