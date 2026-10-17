import {
  FolderTree,
  History,
  KeyRound,
  LayoutDashboard,
  Newspaper,
  UserCircle,
  Users,
  type LucideIcon,
} from 'lucide-react';
import type { Permission } from '@/types/auth';

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  /** Shown when the user holds any of these. Omitted: shown to every signed-in user. */
  anyOf?: Permission[];
}

export interface NavGroup {
  label: string;
  items: NavItem[];
}

export const DASHBOARD_NAV: NavGroup[] = [
  {
    label: 'Workspace',
    items: [
      { href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
      {
        href: '/dashboard/blog',
        label: 'Blog posts',
        icon: Newspaper,
        anyOf: ['posts.read', 'posts.create'],
      },
      {
        href: '/dashboard/blog/categories',
        label: 'Categories',
        icon: FolderTree,
        anyOf: ['categories.manage'],
      },
    ],
  },
  {
    label: 'Administration',
    items: [
      { href: '/dashboard/users', label: 'Users', icon: Users, anyOf: ['users.read'] },
      {
        href: '/dashboard/roles',
        label: 'Roles & permissions',
        icon: KeyRound,
        anyOf: ['roles.read'],
      },
      { href: '/dashboard/audit', label: 'Audit log', icon: History, anyOf: ['audit.read'] },
    ],
  },
  {
    label: 'Account',
    items: [
      { href: '/dashboard/profile', label: 'Profile', icon: UserCircle, anyOf: ['profile.read'] },
    ],
  },
];

/** The most specific nav entry for a path, so /dashboard/blog/categories highlights only Categories. */
export function activeHref(pathname: string, hrefs: string[]): string | undefined {
  return hrefs
    .filter((h) => pathname === h || pathname.startsWith(`${h}/`))
    .sort((a, b) => b.length - a.length)[0];
}
