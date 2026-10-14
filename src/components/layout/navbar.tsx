'use client';

import { useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Menu, X } from 'lucide-react';
import { Container } from '@/components/ui/container';
import { NAV_LINKS, SITE } from '@/lib/constants';
import { useUiStore } from '@/store/ui-store';

export function Navbar() {
  const { mobileMenuOpen, toggleMobileMenu, closeMobileMenu } = useUiStore();

  useEffect(() => {
    if (!mobileMenuOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && closeMobileMenu();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [mobileMenuOpen, closeMobileMenu]);

  return (
    <header className="border-line sticky top-0 z-40 border-b bg-white/90 backdrop-blur">
      <Container className="flex h-16 items-center justify-between">
        <a href="#top" className="flex items-baseline gap-2" aria-label={`${SITE.name} home`}>
          <span className="text-navy-900 font-serif text-xl font-semibold">{SITE.name}</span>
          <span className="text-ink-soft hidden text-sm sm:inline">{SITE.suffix}</span>
        </a>

        <nav aria-label="Primary" className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-ink-soft hover:text-navy-900 text-sm transition-colors"
            >
              {l.label}
            </a>
          ))}
          <a
            href="#contact"
            className="bg-navy-900 hover:bg-navy-700 rounded-sm px-4 py-2 text-sm font-medium text-white transition-colors"
          >
            Request a quote
          </a>
        </nav>

        <button
          type="button"
          onClick={toggleMobileMenu}
          aria-expanded={mobileMenuOpen}
          aria-controls="mobile-menu"
          aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
          className="text-navy-900 -mr-2 p-2 md:hidden"
        >
          {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
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
            className="border-line overflow-hidden border-t bg-white md:hidden"
          >
            <Container className="flex flex-col py-2">
              {NAV_LINKS.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={closeMobileMenu}
                  className="border-line text-navy-900 border-b py-4 text-base last:border-b-0"
                >
                  {l.label}
                </a>
              ))}
            </Container>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
