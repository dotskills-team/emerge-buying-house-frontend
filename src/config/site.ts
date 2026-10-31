// Public, non-secret site settings. The contact email is configured per deployment; when it is
// not set, the site falls back to the general address below (placeholder until confirmed).
export const SITE = {
  name: 'Emerge Buying House',
  shortName: 'Emerge',
  tagline: 'Sourcing, made accountable.',
  description:
    'International garments buying house connecting global brands with vetted manufacturers: sourcing, product development, quality assurance and shipment coordination.',
  contactEmail: process.env.NEXT_PUBLIC_CONTACT_EMAIL || null,
  /** Absolute origin for canonical links, social previews, the sitemap and RSS. */
  url: (
    process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL}`
      : 'http://localhost:3000')
  ).replace(/\/+$/, ''),
} as const;

export interface NavLink {
  label: string;
  href: string;
  description?: string;
}

export interface NavEntry {
  label: string;
  /** Top-level link; entries with children open a dropdown instead. */
  href?: string;
  children?: NavLink[];
}

/** Same structure as the reference site's menu, plus Products. */
export const MAIN_NAV: NavEntry[] = [
  {
    label: 'Company',
    children: [
      { label: 'About Us', href: '/company/about-us', description: 'Who we are and how we work' },
      {
        label: 'Manufacturing Strength',
        href: '/#manufacturing-strength',
        description: 'Capacity, lines and quality standards',
      },
      // {
      //   label: 'Manufacturing Partners',
      //   href: '/#manufacturing-partners',
      //   description: 'The audited factories behind every order',
      // },
      {
        label: 'Company Profiles',
        href: '/company/profiles',
        description: 'Read or download our profile (PDF)',
      },
    ],
  },
  {
    label: 'Industries',
    children: [
      {
        label: 'RMG',
        href: '/industries/textile',
        description: 'Ready-made garments: knit, woven and denim',
      },
    ],
  },
  // { label: 'Products', href: '/products' },
  {
  label: 'Products',
  href: '/products',
  children: [
    { label: 'All products', href: '/products', description: 'Browse the full catalogue' },
    { label: 'Denim', href: '/products?category=denim' },
    { label: 'Twill', href: '/products?category=twill' },
    { label: 'Padded jacket', href: '/products?category=padded-jacket' },
    { label: 'Not padded jacket', href: '/products?category=not-padded-jacket' },
    { label: 'Shirts', href: '/products?category=shirts' },
    { label: 'Over shirts', href: '/products?category=over-shirts' },
    { label: 'Joggers', href: '/products?category=joggers' },
    { label: 'Swimming shorts', href: '/products?category=swimming-shorts' },
    { label: 'Kids wear', href: '/products?category=kids-wear' },
  ],
},
  // {
  //   label: 'Sustainability',
  //   children: [
  //     {
  //       label: 'Environmental Sustainability',
  //       href: '/sustainability/environmental-sustainability',
  //       description: 'Water, energy and materials',
  //     },
  //     {
  //       label: 'Employee Welfare',
  //       href: '/sustainability/employee-welfare',
  //       description: 'Safe, fair and rewarding work',
  //     },
  //   ],
  // },
  { label: 'Clients', href: '/clients' },
  { label: 'News & Events', href: '/news-events' },
  // Hidden for now; uncomment to show Blog in the menu again.
  // { label: 'Blog', href: '/blog' },
  // Hidden while the Career page is off (see CAREER_PAGE_ENABLED below).
  // { label: 'Career', href: '/career' },
  { label: 'Contact', href: '/contact' },
];

/** Dummy contact details shown until the company confirms its own. */
export const CONTACT = {
  address: ['House 12, Road 7, Sector 4', 'Uttara, Dhaka-1230', 'Bangladesh'],
  phone: '+880 1700-000000',
  email: 'info@emergebuyinghouse.com',
  hours: 'Sunday – Thursday, 9:00 – 18:00 (GMT+6)',
} as const;

export const SOCIAL = [
  { label: 'Facebook', href: 'https://www.facebook.com/' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/' },
  { label: 'Instagram', href: 'https://www.instagram.com/' },
  { label: 'YouTube', href: 'https://www.youtube.com/' },
] as const;

/**
 * The Career page is switched off for now: /career answers "page not found" and it is left out of
 * the menus and the sitemap. To bring it back, set this to true and uncomment the Career links in
 * MAIN_NAV above and in components/layout/footer.tsx.
 */
export const CAREER_PAGE_ENABLED = false;
