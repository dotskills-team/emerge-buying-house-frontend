'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  ChevronDown,
  ChevronRight,
  ExternalLink,
  LogOut,
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
  UserCircle,
  X,
} from 'lucide-react';
import { SITE } from '@/config/site';
import { usePermissions } from '@/features/auth/hooks/use-permissions';
import { fetchMe, logout } from '@/features/auth/services/auth.service';
import { useInquiryStats } from '@/features/inquiries/hooks/use-inquiries';
import { ThemeToggle } from '@/features/theme/theme-toggle';
import { errorMessage } from '@/lib/http';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store/auth-store';
import { toast } from '@/store/toast-store';
import { ROLE_LABELS } from '@/types/auth';
import { DASHBOARD_NAV, activeHref, breadcrumbsFor, type NavItem } from '../navigation';

const COLLAPSE_KEY = 'dashboard.sidebar.collapsed';

/**
 * The shell only renders on the client, after the auth guard has confirmed a session, so reading
 * the saved preference during the first render cannot cause a hydration mismatch.
 */
function readCollapsed(): boolean {
  try {
    return window.localStorage.getItem(COLLAPSE_KEY) === '1';
  } catch {
    return false;
  }
}

function saveCollapsed(value: boolean) {
  try {
    window.localStorage.setItem(COLLAPSE_KEY, value ? '1' : '0');
  } catch {
    // Storage blocked (private mode): the preference simply is not remembered.
  }
}

const initialsOf = (name: string) =>
  name
    .split(/\s+/)
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

/**
 * `drawer`: always full width (mobile off-canvas).
 * `docked`: an icon rail on tablets, full width on laptops and up unless the user collapsed it.
 * Class names are written out literally so Tailwind can see them.
 */
type SidebarMode = 'drawer' | 'docked';

function Sidebar({
  mode,
  collapsed = false,
  onToggleCollapsed,
  onNavigate,
}: {
  mode: SidebarMode;
  collapsed?: boolean;
  onToggleCollapsed?: () => void;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const { canAny } = usePermissions();
  const inquiryStats = useInquiryStats(canAny(['inquiries.read']));
  const badges: Record<NonNullable<NavItem['badge']>, number | undefined> = {
    newInquiries: inquiryStats.data?.new,
  };
  const groups = DASHBOARD_NAV.map((g) => ({
    ...g,
    items: g.items.filter((i) => !i.anyOf || canAny(i.anyOf)),
  })).filter((g) => g.items.length > 0);
  const current = activeHref(
    pathname,
    groups.flatMap((g) => g.items.map((i) => i.href)),
  );

  // Rail = icons only. In docked mode the rail applies below `lg`, or everywhere when collapsed.
  const docked = mode === 'docked';
  const railHide = !docked ? '' : collapsed ? 'sr-only' : 'max-lg:sr-only';
  const railCenter = !docked
    ? ''
    : collapsed
      ? 'justify-center px-0'
      : 'max-lg:justify-center max-lg:px-0';
  const railShow = !docked ? 'hidden' : collapsed ? 'block' : 'block lg:hidden';

  return (
    <div className="text-fg-inverse flex h-full flex-col bg-(image:--gradient-sidebar)">
      <div
        className={cn(
          'flex h-(--header-height) shrink-0 items-center gap-3 border-b border-white/10 px-5',
          railCenter,
        )}
      >
        <Link
          href="/"
          onClick={onNavigate}
          aria-label={`${SITE.name}: go to the website`}
          className="flex min-w-0 items-center gap-3"
        >
          <span
            aria-hidden
            className="shadow-glow flex size-9 shrink-0 items-center justify-center rounded-lg bg-(image:--gradient-brand) text-sm font-bold"
          >
            E
          </span>
          <span className={cn('min-w-0 leading-tight', railHide)}>
            <span className="block truncate text-sm font-semibold">{SITE.name}</span>
            <span className="text-fg-inverse-muted block text-xs">Management</span>
          </span>
        </Link>
      </div>

      <nav
        aria-label="Dashboard"
        className="flex-1 space-y-6 overflow-x-hidden overflow-y-auto px-3 py-5"
      >
        {groups.map((group, index) => (
          <div key={group.label}>
            <p
              className={cn(
                'text-fg-inverse-muted/70 px-3 pb-2 text-xs font-semibold tracking-wider uppercase',
                railHide,
              )}
            >
              {group.label}
            </p>
            {index > 0 && <hr aria-hidden className={cn('mx-3 mb-3 border-white/10', railShow)} />}
            <ul className="space-y-1">
              {group.items.map(({ href, label, icon: Icon, badge }) => {
                const active = href === current;
                const count = badge ? badges[badge] : undefined;
                return (
                  <li key={href}>
                    <Link
                      href={href}
                      onClick={onNavigate}
                      title={label}
                      aria-current={active ? 'page' : undefined}
                      className={cn(
                        'group/link relative flex min-h-10 items-center gap-3 rounded-lg px-3 text-sm transition-colors duration-(--duration-fast)',
                        active
                          ? 'text-fg-inverse bg-(image:--gradient-active) font-medium'
                          : 'text-fg-inverse-muted hover:text-fg-inverse hover:bg-white/5',
                        railCenter,
                      )}
                    >
                      {active && (
                        <span
                          aria-hidden
                          className="absolute top-2 bottom-2 left-0 w-1 rounded-r-full bg-(image:--gradient-indicator)"
                        />
                      )}
                      <Icon
                        size={18}
                        aria-hidden
                        className={cn(
                          'shrink-0 transition-colors',
                          active ? 'text-nav-active' : 'group-hover/link:text-fg-inverse',
                        )}
                      />
                      <span className={cn('truncate', railHide)}>{label}</span>
                      {count ? (
                        <>
                          <span
                            className={cn(
                              'bg-gold-light text-ink-deep ml-auto rounded-full px-2 py-0.5 text-xs font-semibold tabular-nums',
                              railHide,
                            )}
                          >
                            {count > 99 ? '99+' : count}
                            <span className="sr-only"> new</span>
                          </span>
                          <span
                            aria-hidden
                            className={cn(
                              'bg-gold-light absolute top-2 left-1/2 ml-2 size-2 rounded-full',
                              railShow,
                            )}
                          />
                        </>
                      ) : null}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="space-y-1 border-t border-white/10 p-3">
        <Link
          href="/"
          onClick={onNavigate}
          title="View website"
          className={cn(
            'text-fg-inverse-muted hover:text-fg-inverse flex min-h-10 items-center gap-3 rounded-lg px-3 text-sm hover:bg-white/5',
            railCenter,
          )}
        >
          <ExternalLink size={18} aria-hidden className="shrink-0" />
          <span className={railHide}>View website</span>
        </Link>
        {docked && onToggleCollapsed && (
          <button
            type="button"
            onClick={onToggleCollapsed}
            aria-pressed={collapsed}
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            className={cn(
              'text-fg-inverse-muted hover:text-fg-inverse hidden min-h-10 w-full items-center gap-3 rounded-lg px-3 text-sm hover:bg-white/5 lg:flex',
              collapsed && 'justify-center px-0',
            )}
          >
            {collapsed ? (
              <PanelLeftOpen size={18} aria-hidden className="shrink-0" />
            ) : (
              <PanelLeftClose size={18} aria-hidden className="shrink-0" />
            )}
            <span className={collapsed ? 'sr-only' : undefined}>
              {collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            </span>
          </button>
        )}
      </div>
    </div>
  );
}

function Breadcrumbs() {
  const crumbs = breadcrumbsFor(usePathname());
  const last = crumbs.at(-1);
  return (
    <nav aria-label="Breadcrumb" className="min-w-0">
      {/* Phones: just the current page. */}
      <p className="text-fg truncate text-sm font-semibold sm:hidden">{last?.label}</p>
      <ol className="hidden min-w-0 items-center gap-1.5 text-sm sm:flex">
        {crumbs.map((c, i) => (
          <li key={c.href} className="flex min-w-0 items-center gap-1.5">
            {i > 0 && <ChevronRight size={14} aria-hidden className="text-fg-subtle shrink-0" />}
            {i === crumbs.length - 1 ? (
              <span aria-current="page" className="text-fg truncate font-semibold">
                {c.label}
              </span>
            ) : (
              <Link href={c.href} className="text-fg-muted hover:text-primary truncate">
                {c.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

function UserMenu({ onSignOut, signingOut }: { onSignOut: () => void; signingOut: boolean }) {
  const user = useAuthStore((s) => s.user);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

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
        className="hover:bg-surface-muted flex min-h-11 items-center gap-3 rounded-xl px-1.5 transition-colors md:pr-3"
      >
        <span
          aria-hidden
          className="text-fg-inverse flex size-9 items-center justify-center rounded-full bg-(image:--gradient-brand) text-xs font-semibold ring-2 ring-white"
        >
          {initialsOf(user.name)}
        </span>
        <span className="hidden text-left leading-tight md:block">
          <span className="text-fg block max-w-44 truncate text-sm font-medium">{user.name}</span>
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
          className="border-border bg-surface absolute right-0 z-(--z-drawer) mt-2 w-[min(17rem,calc(100vw-2rem))] overflow-hidden rounded-xl border shadow-lg"
        >
          <div className="border-border flex items-center gap-3 border-b px-4 py-3">
            <span
              aria-hidden
              className="text-fg-inverse flex size-10 shrink-0 items-center justify-center rounded-full bg-(image:--gradient-brand) text-sm font-semibold"
            >
              {initialsOf(user.name)}
            </span>
            <div className="min-w-0">
              <p className="text-fg truncate text-sm font-medium">{user.name}</p>
              <p className="text-fg-subtle truncate text-xs">{user.email}</p>
            </div>
          </div>
          <div className="p-1.5">
            <Link
              role="menuitem"
              href="/dashboard/profile"
              onClick={() => setOpen(false)}
              className="text-fg hover:bg-surface-muted flex min-h-10 items-center gap-3 rounded-lg px-3 text-sm"
            >
              <UserCircle size={16} aria-hidden /> Profile
            </Link>
            <button
              role="menuitem"
              type="button"
              onClick={onSignOut}
              disabled={signingOut}
              className="text-danger hover:bg-danger-soft flex min-h-10 w-full items-center gap-3 rounded-lg px-3 text-sm disabled:opacity-60"
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
  const [collapsed, setCollapsed] = useState(readCollapsed);
  const [signingOut, setSigningOut] = useState(false);

  // Picks up role or permission changes an administrator made, e.g. when the tab regains focus.
  const me = useQuery({ queryKey: ['auth', 'me'], queryFn: fetchMe, refetchOnWindowFocus: true });
  useEffect(() => {
    if (me.data) useAuthStore.getState().setUser(me.data);
  }, [me.data]);

  function toggleCollapsed() {
    setCollapsed((c) => {
      saveCollapsed(!c);
      return !c;
    });
  }

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
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-(--z-drawer) hidden w-(--sidebar-rail) shadow-lg transition-[width] duration-(--duration-base) md:block',
          !collapsed && 'lg:w-(--sidebar-width)',
        )}
      >
        <Sidebar mode="docked" collapsed={collapsed} onToggleCollapsed={toggleCollapsed} />
      </aside>

      {drawerOpen && (
        <div
          className="fixed inset-0 z-(--z-modal) md:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Navigation"
        >
          <button
            type="button"
            aria-label="Close navigation"
            onClick={() => setDrawerOpen(false)}
            className="bg-surface-inverse/60 absolute inset-0 backdrop-blur-sm"
          />
          <aside className="relative h-full w-(--sidebar-width) max-w-[82vw] shadow-lg">
            <Sidebar mode="drawer" onNavigate={() => setDrawerOpen(false)} />
            <button
              type="button"
              onClick={() => setDrawerOpen(false)}
              aria-label="Close navigation"
              className="bg-surface text-fg absolute top-3 -right-13 inline-flex size-11 items-center justify-center rounded-lg shadow-md"
            >
              <X size={18} aria-hidden />
            </button>
          </aside>
        </div>
      )}

      <div
        className={cn(
          'transition-[padding] duration-(--duration-base) md:pl-(--sidebar-rail)',
          !collapsed && 'lg:pl-(--sidebar-width)',
        )}
      >
        <header className="border-border bg-surface/85 sticky top-0 z-(--z-header) border-b backdrop-blur-md">
          <div className="flex h-(--header-height) items-center gap-3 px-(--page-gutter)">
            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              aria-label="Open navigation"
              className="text-fg hover:bg-surface-muted -ml-2 inline-flex size-11 shrink-0 items-center justify-center rounded-lg md:hidden"
            >
              <Menu size={20} aria-hidden />
            </button>
            <Breadcrumbs />
            <div className="ml-auto flex shrink-0 items-center gap-1">
              <ThemeToggle />
              <UserMenu onSignOut={() => void handleLogout()} signingOut={signingOut} />
            </div>
          </div>
        </header>
        <main className="mx-auto w-full max-w-(--container-wide) px-(--page-gutter) py-6 sm:py-8">
          {children}
        </main>
      </div>
    </div>
  );
}
