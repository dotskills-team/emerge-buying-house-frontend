'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Menu, X } from 'lucide-react';
import { ButtonLink } from '@/components/ui/button';
import { Container } from '@/components/ui/container';
import { MARKETING_NAV, SITE } from '@/config/site';
import { useUiStore } from '@/store/ui-store';
import { Logo } from './logo';

export function Navbar() {
  const { mobileMenuOpen, toggleMobileMenu, closeMobileMenu } = useUiStore();

  useEffect(() => {
    if (!mobileMenuOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && closeMobileMenu();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [mobileMenuOpen, closeMobileMenu]);

  return (
    <header className="border-border bg-surface/90 sticky top-0 z-(--z-header) border-b backdrop-blur">
      <Container className="flex h-(--header-height) items-center justify-between gap-4">
        <Link href="/" aria-label={`${SITE.name} home`} onClick={closeMobileMenu}>
          <Logo />
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-8 md:flex">
          {MARKETING_NAV.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-fg-muted hover:text-fg text-sm transition-colors"
            >
              {l.label}
            </Link>
          ))}
          <ButtonLink href="/#contact" size="sm">
            Request a quote
          </ButtonLink>
        </nav>

        <button
          type="button"
          onClick={toggleMobileMenu}
          aria-expanded={mobileMenuOpen}
          aria-controls="mobile-menu"
          aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
          className="text-fg -mr-2 inline-flex size-11 items-center justify-center rounded-md md:hidden"
        >
          {mobileMenuOpen ? <X size={22} aria-hidden /> : <Menu size={22} aria-hidden />}
        </button>
      </Container>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.nav
            id="mobile-menu"
            aria-label="Mobile"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="border-border bg-surface overflow-hidden border-t md:hidden"
          >
            <Container className="flex flex-col py-2">
              {MARKETING_NAV.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={closeMobileMenu}
                  className="border-border text-fg border-b py-4 text-base last:border-b-0"
                >
                  {l.label}
                </Link>
              ))}
            </Container>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
