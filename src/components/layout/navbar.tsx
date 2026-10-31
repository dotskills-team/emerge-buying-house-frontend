'use client';

import Image, { type StaticImageData } from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  ArrowRight,
  BookOpenText,
  Building2,
  ChevronDown,
  FileText,
  Cpu,
  HeartHandshake,
  Leaf,
  Mail,
  Menu,
  Phone,
  Pill,
  Shirt,
  ShoppingBag,
  Factory,
  Handshake,
  X,
  type LucideIcon,
  Layers,
  Scissors,
  Snowflake,
  Wind,
  Footprints,
  Waves,
  Baby,
} from 'lucide-react';
import { SOCIAL_ICONS } from '@/components/site/social-icons';
import { Container } from '@/components/ui/container';
import { CONTACT, MAIN_NAV, SITE, SOCIAL, type NavEntry } from '@/config/site';
import { IMG } from '@/content/images';
import { ThemeSegmented, ThemeToggle } from '@/features/theme/theme-toggle';
import { cn } from '@/lib/utils';
import { useUiStore } from '@/store/ui-store';
import { Logo } from './logo';

const ICONS: Record<string, LucideIcon> = {
  '/company/about-us': BookOpenText,
  '/#manufacturing-strength': Factory,
  // '/#manufacturing-partners': Handshake,
  '/company/profiles': FileText,
  '/industries/textile': Shirt,
  '/industries/retail': ShoppingBag,
  '/industries/pharmaceuticals': Pill,
  '/industries/information-technology': Cpu,
  '/industries/real-estate': Building2,
  // '/sustainability/environmental-sustainability': Leaf,
  // '/sustainability/employee-welfare': HeartHandshake,
  '/products': ShoppingBag,
  '/products?category=denim': Layers,
  '/products?category=twill': Scissors,
  '/products?category=padded-jacket': Snowflake,
  '/products?category=not-padded-jacket': Wind,
  '/products?category=shirts': Shirt,
  '/products?category=over-shirts': Shirt,
  '/products?category=joggers': Footprints,
  '/products?category=swimming-shorts': Waves,
  '/products?category=kids-wear': Baby,
};


/** The highlight shown beside each dropdown's links: a photo, a line of text and one link. */
const FEATURES: Record<
  string,
  { title: string; body: string; href: string; cta: string; image: StaticImageData }
> = {
  Company: {
    title: '15 years of accountable sourcing',
    body: 'One team that owns every order, from first sketch to loaded container.',
    href: '/company/about-us',
    cta: 'About us',
    image: IMG.garmentLine,
  },
  Industries: {
    title: 'See what we make',
    body: 'Zoom into our knitwear, woven, denim and fabric programmes.',
    href: '/products',
    cta: 'Explore products',
    image: IMG.textileFactory,
  },
  // Sustainability: {
  //   title: 'Responsible by design',
  //   body: 'Audited factories, cleaner energy and traceable fibres.',
  //   href: '/csr',
  //   cta: 'Our CSR work',
  //   image: IMG.cottonField,
  // },
  Products: {
  title: 'Made to be inspected',
  body: 'Open any product to zoom into the fabric and check specifications.',
  href: '/products',
  cta: 'View catalogue',
  image: IMG.heroSewing,
},
};

const isActive = (pathname: string, entry: NavEntry) =>
  entry.href
    ? pathname === entry.href || pathname.startsWith(`${entry.href}/`)
    : (entry.children ?? []).some((c) => pathname === c.href || pathname.startsWith(`${c.href}/`));

const telHref = `tel:${CONTACT.phone.replace(/[^+\d]/g, '')}`;
const contactEmail = SITE.contactEmail ?? CONTACT.email;

/** Desktop dropdown: opens on hover, click and keyboard focus; Esc closes it. */
function DesktopDropdown({
  entry,
  light,
  active,
}: {
  entry: NavEntry;
  light: boolean;
  active: boolean;
}) {
  const [open, setOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pointerType = useRef<string | null>(null);
  const id = `menu-${entry.label.toLowerCase().replace(/\W+/g, '-')}`;
  const feature = FEATURES[entry.label];
  const children = entry.children ?? [];

  // The panel is centred under its item; near a screen edge (e.g. "Company", the first item, on a
  // laptop) it is shifted just enough to stay fully visible with a small margin.
  const keepOnScreen = (el: HTMLDivElement | null) => {
    if (!el) return;
    el.style.marginLeft = '0px';
    // Measured from its centre and real width, as the opening animation starts it slightly scaled.
    const rect = el.getBoundingClientRect();
    const centre = rect.left + rect.width / 2;
    const left = centre - el.offsetWidth / 2;
    const right = centre + el.offsetWidth / 2;
    const margin = 16;
    const viewport = document.documentElement.clientWidth;
    let shift = 0;
    if (left < margin) shift = margin - left;
    else if (right > viewport - margin) shift = viewport - margin - right;
    el.style.marginLeft = `${Math.round(shift)}px`;
  };

  const show = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpen(true);
  };
  const hide = () => {
    closeTimer.current = setTimeout(() => setOpen(false), 140);
  };

  return (
    <li
      className="relative"
      onMouseEnter={show}
      onMouseLeave={hide}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setOpen(false);
      }}
      onKeyDown={(e) => e.key === 'Escape' && setOpen(false)}
    >
      <button
        type="button"
        aria-expanded={open}
        aria-controls={id}
        onPointerDown={(e) => {
          pointerType.current = e.pointerType;
        }}
        onClick={() => {
          // Hover already opened it for a mouse; a click must not toggle it shut again.
          if (pointerType.current === 'mouse') show();
          else setOpen((o) => !o);
          pointerType.current = null;
        }}
        className={cn(
          'relative flex h-10 items-center gap-1 rounded-md px-2.5 text-sm font-medium whitespace-nowrap transition-colors lg:px-1.5 lg:text-[0.95rem] xl:px-2.5 xl:text-[1.05rem] 2xl:px-3.5 2xl:text-[0.9375rem]',
          light ? 'text-white/85 hover:text-white' : 'text-fg/80 hover:text-primary',
          active && (light ? 'text-white' : 'text-primary'),
          open && (light ? 'text-white' : 'text-fg'),
        )}
      >
        {entry.label}
        <ChevronDown
          size={15}
          aria-hidden
          className={cn(
            'opacity-70 transition-transform duration-(--duration-fast)',
            open && 'rotate-180',
          )}
        />
        {active && (
          <span
            aria-hidden
            className="absolute inset-x-3.5 -bottom-1 h-0.5 rounded-full bg-(image:--gradient-brand)"
          />
        )}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            ref={keepOnScreen}
            id={id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.16, ease: [0.22, 1, 0.36, 1] }}
            className="absolute top-full left-1/2 z-(--z-drawer) w-[min(40rem,calc(100vw-4rem))] -translate-x-1/2 pt-3"
          >
            <div className="border-border bg-surface grid grid-cols-[minmax(0,1fr)_13.5rem] overflow-hidden rounded-xl border shadow-[0_18px_40px_-16px_rgb(15_23_42/0.22)]">
              <div className="p-2.5">
                <p className="text-fg-subtle px-3 pt-2 pb-1.5 text-[0.6875rem] font-semibold tracking-[0.18em] uppercase">
                  {entry.label}
                </p>
                <ul>
                  {children.map((c) => {
                    const Icon = ICONS[c.href] ?? ArrowRight;
                    return (
                      <li key={c.href}>
                        <Link
                          href={c.href}
                          onClick={() => setOpen(false)}
                          className="group/item hover:bg-surface-muted flex items-start gap-3 rounded-lg px-3 py-2.5 transition-colors"
                        >
                          <Icon
                            size={17}
                            aria-hidden
                            strokeWidth={1.6}
                            className="text-fg-subtle group-hover/item:text-primary mt-0.5 shrink-0 transition-colors"
                          />
                          <span className="min-w-0 flex-1">
                            <span className="text-fg group-hover/item:text-primary block text-sm font-medium transition-colors">
                              {c.label}
                            </span>
                            {c.description && (
                              <span className="text-fg-subtle mt-0.5 block truncate text-xs">
                                {c.description}
                              </span>
                            )}
                          </span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
              {feature && (
                <Link
                  href={feature.href}
                  onClick={() => setOpen(false)}
                  className="group/cta bg-surface-muted border-border flex flex-col border-l p-4"
                >
                  <span className="relative block aspect-[4/3] overflow-hidden rounded-md">
                    <Image
                      src={feature.image}
                      alt=""
                      fill
                      placeholder="blur"
                      sizes="13rem"
                      className="object-cover transition-transform duration-500 group-hover/cta:scale-[1.04]"
                    />
                  </span>
                  <span className="text-fg mt-3.5 block text-sm leading-snug font-semibold">
                    {feature.title}
                  </span>
                  <span className="text-fg-muted mt-1 block text-xs leading-relaxed">
                    {feature.body}
                  </span>
                  <span className="text-primary mt-3 inline-flex items-center gap-1 text-xs font-semibold">
                    {feature.cta}
                    <ArrowRight
                      size={13}
                      aria-hidden
                      className="transition-transform group-hover/cta:translate-x-0.5"
                    />
                  </span>
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </li>
  );
}

function MobileMenu({ onClose }: { onClose: () => void }) {
  const pathname = usePathname();
  const [expanded, setExpanded] = useState<string | null>(
    () => MAIN_NAV.find((e) => e.children && isActive(pathname, e))?.label ?? null,
  );

  return (
    <motion.div
      className="fixed inset-0 z-(--z-modal) lg:hidden"
      role="dialog"
      aria-modal="true"
      aria-label="Site menu"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <button
        type="button"
        aria-label="Close menu"
        onClick={onClose}
        className="bg-ink-deep/60 absolute inset-0 backdrop-blur-sm"
      />
      <motion.nav
        aria-label="Mobile"
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'tween', duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
        className="bg-surface absolute inset-y-0 right-0 flex w-[min(25rem,90vw)] flex-col shadow-lg"
      >
        <div className="border-border flex h-20 shrink-0 items-center justify-between border-b px-5">
          <Link href="/" onClick={onClose} aria-label={`${SITE.name} home`}>
            <Logo className="h-11" />
          </Link>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="text-fg hover:bg-surface-muted border-border -mr-1 inline-flex size-11 items-center justify-center rounded-full border"
          >
            <X size={20} aria-hidden />
          </button>
        </div>

        <ul className="flex-1 overflow-y-auto px-3 py-4">
          {MAIN_NAV.map((entry) => {
            const active = isActive(pathname, entry);
            if (!entry.children) {
              return (
                <li key={entry.label}>
                  <Link
                    href={entry.href ?? '/'}
                    onClick={onClose}
                    aria-current={active ? 'page' : undefined}
                    className={cn(
                      'flex min-h-12 items-center justify-between rounded-2xl px-4 text-base font-semibold',
                      active ? 'bg-primary-soft text-primary' : 'text-fg hover:bg-surface-muted',
                    )}
                  >
                    {entry.label}
                    <ArrowRight size={16} aria-hidden className="text-fg-subtle" />
                  </Link>
                </li>
              );
            }
            const isOpen = expanded === entry.label;
            return (
              <li key={entry.label}>
                <button
                  type="button"
                  aria-expanded={isOpen}
                  onClick={() => setExpanded(isOpen ? null : entry.label)}
                  className={cn(
                    'flex min-h-12 w-full items-center justify-between rounded-2xl px-4 text-left text-base font-semibold',
                    active || isOpen ? 'text-primary' : 'text-fg',
                    isOpen ? 'bg-primary-soft/60' : 'hover:bg-surface-muted',
                  )}
                >
                  {entry.label}
                  <ChevronDown
                    size={18}
                    aria-hidden
                    className={cn('transition-transform', isOpen && 'rotate-180')}
                  />
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.ul
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.22 }}
                      className="overflow-hidden px-2 py-1"
                    >
                      {entry.children.map((c) => {
                        const current = pathname === c.href;
                        const Icon = ICONS[c.href] ?? ArrowRight;
                        return (
                          <li key={c.href}>
                            <Link
                              href={c.href}
                              onClick={onClose}
                              aria-current={current ? 'page' : undefined}
                              className={cn(
                                'flex min-h-12 items-center gap-3 rounded-xl px-3 text-sm',
                                current
                                  ? 'text-primary font-semibold'
                                  : 'text-fg-muted hover:text-fg',
                              )}
                            >
                              <span
                                className={cn(
                                  'flex size-9 shrink-0 items-center justify-center rounded-lg',
                                  current
                                    ? 'bg-brand-weave text-white'
                                    : 'bg-surface-muted text-primary',
                                )}
                              >
                                <Icon size={17} aria-hidden />
                              </span>
                              {c.label}
                            </Link>
                          </li>
                        );
                      })}
                    </motion.ul>
                  )}
                </AnimatePresence>
              </li>
            );
          })}
        </ul>

        <div className="border-border space-y-4 border-t p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
          <div className="grid grid-cols-2 gap-2">
            <a
              href={telHref}
              className="border-border text-fg hover:bg-surface-muted flex min-h-11 items-center justify-center gap-2 rounded-xl border text-sm font-medium"
            >
              <Phone size={16} aria-hidden className="text-primary" /> Call us
            </a>
            <a
              href={`mailto:${contactEmail}`}
              className="border-border text-fg hover:bg-surface-muted flex min-h-11 items-center justify-center gap-2 rounded-xl border text-sm font-medium"
            >
              <Mail size={16} aria-hidden className="text-primary" /> Email us
            </a>
          </div>
          <ThemeSegmented />
          <Link
            href="/contact"
            onClick={onClose}
            className="shadow-gold text-ink-deep flex min-h-12 items-center justify-center gap-2 rounded-xl bg-(image:--gradient-gold) text-sm font-semibold"
          >
            Get a quote <ArrowRight size={16} aria-hidden />
          </Link>
          <ul className="flex justify-center gap-2" aria-label="Social media">
            {SOCIAL.map((s) => {
              const Icon = SOCIAL_ICONS[s.label];
              return (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${SITE.name} on ${s.label}`}
                    className="text-fg-muted hover:text-primary flex size-10 items-center justify-center rounded-full"
                  >
                    <Icon size={17} />
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      </motion.nav>
    </motion.div>
  );
}

/**
 * Site header: a slim contact bar, then the main bar with the logo, menu and call to action.
 * `overlay` floats it transparently over a dark hero until the page scrolls; it then becomes a
 * compact frosted-glass bar. The contact bar folds away once the page scrolls.
 */
export function Navbar({ overlay = false }: { overlay?: boolean }) {
  const pathname = usePathname();
  const { mobileMenuOpen, openMobileMenu, closeMobileMenu } = useUiStore();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    // Two thresholds so the state cannot flip back and forth around a single scroll position.
    const onScroll = () => setScrolled((was) => (was ? window.scrollY > 8 : window.scrollY > 64));
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!mobileMenuOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && closeMobileMenu();
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen, closeMobileMenu]);

  const light = overlay && !scrolled;

  return (
    <>
      <header
        className={cn(
          'fixed top-0 z-(--z-header) w-full transition-[background-color,box-shadow,border-color] duration-(--duration-base)',
          light
            ? 'bg-gradient-to-b from-black/55 via-black/25 to-transparent'
            : 'border-border bg-surface border-b shadow-sm',
        )}
      >
        <Container
          className={cn(
            'flex items-center justify-between gap-6 transition-[height] duration-(--duration-base) lg:gap-5 xl:gap-10',
            // 'h-16 lg:h-[4.25rem] 2xl:h-[4.5rem]',
            'h-16 lg:h-20 2xl:h-[4.5rem]',
          )}
        >
          <Link href="/" aria-label={`${SITE.name} home`} className="shrink-0">
            <Logo
              inverse={light}
              priority
              // className={cn(
              //   'transition-[height] duration-(--duration-base)',
              //   'h-11 lg:h-11 2xl:h-11',
              // )}
              className={cn(
  'transition-[height] duration-(--duration-base)',
  'h-11 lg:h-14 2xl:h-12',
)}
            />
          </Link>

          <nav aria-label="Primary" className="hidden lg:block">
            <ul className="flex items-center gap-0.5 xl:gap-2">
              {MAIN_NAV.map((entry) => {
                const active = isActive(pathname, entry);
                return entry.children ? (
                  <DesktopDropdown key={entry.label} entry={entry} light={light} active={active} />
                ) : (
                  <li key={entry.label}>
                    <Link
                      href={entry.href ?? '/'}
                      aria-current={active ? 'page' : undefined}
                      className={cn(
                        'relative flex h-10 items-center rounded-full px-2.5 text-sm font-medium whitespace-nowrap transition-colors lg:px-1.5 lg:text-[0.95rem] xl:px-2.5 xl:text-[1.05rem] 2xl:px-3.5 2xl:text-[0.9375rem]',
                        light
                          ? 'text-white/85 hover:bg-white/10 hover:text-white'
                          : 'text-fg/80 hover:text-primary',
                        active && (light ? 'text-white' : 'text-primary'),
                      )}
                    >
                      {entry.label}
                      {active && (
                        <span
                          aria-hidden
                          className="absolute inset-x-3.5 -bottom-1 h-0.5 rounded-full bg-(image:--gradient-brand)"
                        />
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="flex shrink-0 items-center gap-2 lg:gap-3">
            <ThemeToggle onDark={light} />
            <Link
              href="/contact"
              className="group shadow-gold text-ink-deep hidden min-h-11 shrink-0 items-center gap-2 rounded-lg bg-(image:--gradient-gold) pr-2 pl-5 text-sm font-semibold whitespace-nowrap transition-transform sm:inline-flex lg:min-h-12 lg:pl-5 lg:text-[0.95rem]"
            >
              Get a quote
              <span className="bg-ink-deep/10 flex size-7 items-center justify-center rounded-full transition-transform group-hover:translate-x-0.5">
                <ArrowRight size={14} aria-hidden />
              </span>
            </Link>
            <button
              type="button"
              onClick={openMobileMenu}
              aria-expanded={mobileMenuOpen}
              aria-label="Open menu"
              className={cn(
                '-mr-1 inline-flex size-11 items-center justify-center rounded-full border transition-colors lg:hidden',
                light
                  ? 'border-white/25 text-white hover:bg-white/10'
                  : 'border-border text-fg hover:bg-surface-muted',
              )}
            >
              <Menu size={20} aria-hidden />
            </button>
          </div>
        </Container>
      </header>
      {/* The header is always fixed; this keeps its full height in the flow so folding the
          contact bar never shifts the page (which would re-trigger the scroll threshold). */}
      {/* {!overlay && <div aria-hidden className="h-16 lg:h-[4.25rem] 2xl:h-[4.5rem]" />} */}
      {!overlay && <div aria-hidden className="h-16 lg:h-20 2xl:h-[4.5rem]" />}
      <AnimatePresence>
        {mobileMenuOpen && <MobileMenu onClose={closeMobileMenu} />}
      </AnimatePresence>
    </>
  );
}
