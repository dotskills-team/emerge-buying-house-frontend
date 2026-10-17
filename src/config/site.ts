// Public, non-secret site settings. The contact email is configured per deployment; when it is
// not set, the site simply does not show an email link rather than a made-up address.
export const SITE = {
  name: 'Emerge Buying House',
  shortName: 'Emerge',
  description:
    'International garments buying house connecting global brands with vetted manufacturers: sourcing, product development, quality assurance and shipment coordination.',
  contactEmail: process.env.NEXT_PUBLIC_CONTACT_EMAIL || null,
} as const;

export const MARKETING_NAV = [
  { href: '/#about', label: 'About' },
  { href: '/#services', label: 'Services' },
  { href: '/blog', label: 'Insights' },
  { href: '/#contact', label: 'Contact' },
] as const;
