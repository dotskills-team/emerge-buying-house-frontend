import type { Metadata, Viewport } from 'next';
import { Fraunces, Inter, Noto_Sans_Bengali } from 'next/font/google';
import type { ReactNode } from 'react';
import { preconnect } from 'react-dom';
import { Providers } from '@/components/providers';
import { SITE } from '@/config/site';
import { THEME_INIT_SCRIPT } from '@/features/theme/theme';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });
// Display serif for website headlines.
const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces',
  display: 'swap',
  axes: ['opsz', 'SOFT'],
});
// Only downloaded when a page contains Bangla characters (unicode-range subsetting).
const bengali = Noto_Sans_Bengali({
  subsets: ['bengali'],
  variable: '--font-bengali',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: SITE.name, template: `%s | ${SITE.name}` },
  description: SITE.description,
};

export const viewport: Viewport = {
  themeColor: '#07130f',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  // Blog and product photos come from the image CDN; open the connection before they are needed.
  preconnect('https://res.cloudinary.com');
  return (
    // The theme script sets data-theme on <html> before React loads, hence suppressHydrationWarning.
    <html
      lang="en"
      className={`${inter.variable} ${fraunces.variable} ${bengali.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* Applies the visitor's light/dark choice before the first paint: no flash. */}
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
