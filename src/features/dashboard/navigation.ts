import {
  FolderTree,
  History,
  Bot,
  Inbox,
  KeyRound,
  LayoutDashboard,
  Newspaper,
  Package,
  Tags,
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
  /** Shows a live count next to the label (e.g. unread messages). */
  badge?: 'newInquiries';
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
        href: '/dashboard/inquiries',
        label: 'Inquiries',
        icon: Inbox,
        anyOf: ['inquiries.read'],
        badge: 'newInquiries',
      },
      {
        href: '/dashboard/chatbot',
        label: 'Chatbot',
        icon: Bot,
        anyOf: ['chatbot.manage'],
      },
      {
        href: '/dashboard/blog',
        label: 'Blog posts',
        icon: Newspaper,
        anyOf: ['posts.read', 'posts.create'],
      },
      {
        href: '/dashboard/blog/categories',
        label: 'Blog categories',
        icon: FolderTree,
        anyOf: ['categories.manage'],
      },
    ],
  },
  {
    label: 'Catalogue',
    items: [
      {
        href: '/dashboard/products',
        label: 'Products',
        icon: Package,
        anyOf: ['products.read', 'products.manage'],
      },
      {
        href: '/dashboard/products/categories',
        label: 'Product categories',
        icon: Tags,
        anyOf: ['products.categories'],
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

export interface Crumb {
  href: string;
  label: string;
}

const NAV_LABELS = new Map(DASHBOARD_NAV.flatMap((g) => g.items.map((i) => [i.href, i.label])));

/** Labels for pages that are not in the sidebar: creation pages and record detail pages. */
const LEAF_LABELS: Record<string, { create: string; detail: string }> = {
  '/dashboard/users': { create: 'Add user', detail: 'User details' },
  '/dashboard/products': { create: 'New product', detail: 'Edit product' },
  '/dashboard/blog': { create: 'New post', detail: 'Edit post' },
  '/dashboard/inquiries': { create: 'New', detail: 'Message' },
};

function leafLabel(parent: string, segment: string): string {
  if (segment === 'preview') return 'Preview';
  const labels = LEAF_LABELS[parent] ?? { create: 'New', detail: 'Details' };
  return segment === 'new' ? labels.create : labels.detail;
}

/** Overview › Blog posts › Edit post, built from the URL. */
export function breadcrumbsFor(pathname: string): Crumb[] {
  const crumbs: Crumb[] = [{ href: '/dashboard', label: 'Overview' }];
  const segments = pathname.replace(/\/+$/, '').split('/').slice(2); // drop '', 'dashboard'
  let href = '/dashboard';
  for (const segment of segments) {
    const parent = href;
    href = `${href}/${segment}`;
    crumbs.push({ href, label: NAV_LABELS.get(href) ?? leafLabel(parent, segment) });
  }
  return crumbs;
}
