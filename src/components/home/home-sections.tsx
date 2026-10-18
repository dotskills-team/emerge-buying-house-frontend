import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRight,
  BadgeCheck,
  Eye,
  Gem,
  HeartHandshake,
  Quote,
  ShieldCheck,
  Target,
  type LucideIcon,
} from 'lucide-react';
import { Counter } from '@/components/site/counter';
import { NewsCard } from '@/components/site/news-card';
import { Reveal } from '@/components/site/reveal';
import { SectionHeading } from '@/components/site/section-heading';
import { RotatingWords } from '@/components/site/text-effects';
import { Container } from '@/components/ui/container';
import {
  CERTIFICATIONS,
  HISTORY,
  MISSION,
  PROCESS,
  STATS,
  VALUES,
  VISION,
} from '@/content/company';
import { IMG } from '@/content/images';
import { NEWS_SORTED } from '@/content/news';
import { PRODUCTS } from '@/content/products';

export function IntroSplit() {
  return (
    <section id="intro" className="grid grid-cols-1 lg:grid-cols-2">
      <div className="bg-brand-weave relative isolate flex items-center overflow-hidden text-white">
        {/* Brand motif: stacked chevrons that echo the "E" of the wordmark. */}
        <svg
          aria-hidden
          viewBox="0 0 400 400"
          className="absolute -bottom-24 -left-24 -z-10 size-[28rem] text-white/10"
        >
          <path d="M0 400 L200 200 L400 400 Z" fill="currentColor" />
          <path d="M80 400 L200 280 L320 400 Z" fill="currentColor" />
        </svg>
        <div className="w-full px-(--page-gutter) py-16 sm:py-20 lg:max-w-[46rem] lg:py-28 lg:pl-[max(var(--page-gutter),calc((100vw-var(--container-site))/2+var(--page-gutter)))]">
          <Reveal>
            <p className="text-gold-light inline-flex items-center gap-3 text-xs font-semibold tracking-[0.24em] uppercase">
              <span aria-hidden className="h-px w-10 bg-(image:--gradient-gold)" />
              Who we are
            </p>
            <h2 className="font-display text-h1 mt-3 font-semibold tracking-tight">
              A sourcing partner that is{' '}
              <RotatingWords
                className="text-gold-light grid italic"
                words={[
                  'accountable.',
                  'transparent.',
                  'sustainable.',
                  'on time.',
                  'close to the line.',
                ]}
              />
            </h2>
            <p className="mt-5 text-white/85 sm:text-lg">
              We are an international garments buying house working across knitwear, woven and
              denim. Our teams act as the brand’s eyes and hands in Bangladesh: finding the right
              factory, protecting quality and keeping delivery dates realistic.
            </p>
            <Link
              href="/company/about-us"
              className="group text-ink-deep shadow-gold mt-8 inline-flex min-h-12 items-center gap-2 rounded-full bg-(image:--gradient-gold) px-7 text-sm font-semibold transition-transform hover:-translate-y-0.5"
            >
              View details
              <ArrowRight
                size={16}
                aria-hidden
                className="transition-transform group-hover:translate-x-0.5"
              />
            </Link>
          </Reveal>
        </div>
      </div>
      <div className="relative min-h-[22rem] sm:min-h-[28rem]">
        <Image
          src={IMG.garmentLine}
          alt="A worker folding fabric on a garment production line"
          fill
          placeholder="blur"
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="object-cover"
        />
      </div>
    </section>
  );
}

export function StatsBand() {
  return (
    <section aria-label="Emerge in numbers" className="bg-surface border-border border-b">
      <Container>
        <dl className="grid grid-cols-2 lg:grid-cols-4">
          {STATS.map((s, i) => (
            <div
              key={s.label}
              className="border-border flex flex-col gap-1 border-b px-2 py-8 even:border-l sm:px-6 sm:py-10 lg:border-b-0 lg:border-l lg:first:border-l-0"
            >
              <dt className="text-fg-muted order-2 text-sm">{s.label}</dt>
              <dd className="order-1 bg-(image:--gradient-brand) bg-clip-text text-[clamp(2.25rem,1.6rem+2.4vw,3.5rem)] leading-none font-bold tracking-tight text-transparent">
                <Reveal delay={i * 0.08}>
                  <Counter to={s.value} suffix={s.suffix} />
                </Reveal>
              </dd>
            </div>
          ))}
        </dl>
      </Container>
    </section>
  );
}

const VALUE_ICONS: LucideIcon[] = [Target, Gem, Eye, HeartHandshake];

export function VisionMission() {
  return (
    <section className="bg-weave-dark relative py-20 sm:py-24 lg:py-32">
      <Container>
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1.1fr_1fr] lg:gap-20">
          <Reveal>
            <SectionHeading
              eyebrow="Our purpose"
              title="Moving forward, with high environmental and ethical standards."
            />
            <figure className="border-primary/20 bg-surface relative mt-10 rounded-2xl border p-6 shadow-md sm:p-8">
              <Quote size={36} aria-hidden className="text-primary/25 absolute top-5 right-5" />
              <figcaption className="text-primary text-sm font-semibold tracking-wider uppercase">
                Vision
              </figcaption>
              <blockquote className="text-fg mt-3 text-xl font-medium sm:text-2xl">
                {VISION}
              </blockquote>
            </figure>
          </Reveal>
          <Reveal delay={0.1}>
            <h3 className="text-primary text-sm font-semibold tracking-wider uppercase">Mission</h3>
            <ol className="mt-5 space-y-4">
              {MISSION.map((m, i) => (
                <li
                  key={m}
                  className="bg-surface border-border flex gap-4 rounded-2xl border p-5 shadow-sm"
                >
                  <span className="bg-primary-soft text-primary flex size-10 shrink-0 items-center justify-center rounded-xl text-sm font-bold">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <p className="text-fg-muted pt-2">{m}</p>
                </li>
              ))}
            </ol>
          </Reveal>
        </div>

        <ul className="mt-16 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {VALUES.map((v, i) => {
            const Icon = VALUE_ICONS[i] ?? BadgeCheck;
            return (
              <Reveal as="li" key={v.title} delay={i * 0.08}>
                <div className="group bg-surface border-border hover:border-primary/30 relative h-full overflow-hidden rounded-2xl border p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg">
                  <span
                    aria-hidden
                    className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-(image:--gradient-brand) transition-transform duration-(--duration-base) group-hover:scale-x-100"
                  />
                  <span className="bg-brand-weave flex size-12 items-center justify-center rounded-xl text-white shadow-md">
                    <Icon size={22} aria-hidden />
                  </span>
                  <h3 className="text-fg mt-5 text-lg font-semibold">{v.title}</h3>
                  <p className="text-fg-muted mt-2 text-sm">{v.body}</p>
                </div>
              </Reveal>
            );
          })}
        </ul>
      </Container>
    </section>
  );
}

export function ProcessTimeline() {
  return (
    <section className="bg-ink-deep relative isolate overflow-hidden bg-(image:--gradient-ink) py-20 text-white sm:py-24 lg:py-32">
      <div aria-hidden className="bg-weave absolute inset-0 -z-10 opacity-50" />
      <div aria-hidden className="bg-grain absolute inset-0 -z-10" />
      <div
        aria-hidden
        className="bg-primary/30 absolute -top-40 right-0 -z-10 size-[36rem] rounded-full blur-3xl"
      />
      <Container>
        <SectionHeading
          tone="inverse"
          eyebrow="How we work"
          title="Five steps from brief to warehouse."
          lead="One merchandiser owns your order the whole way, with a quality checkpoint at every step."
        />
        <ol className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5 lg:gap-0">
          {PROCESS.map((p, i) => (
            <Reveal as="li" key={p.step} delay={i * 0.08} className="relative">
              <div className="h-full rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm lg:rounded-none lg:border-y-0 lg:border-r-0 lg:border-l lg:bg-transparent lg:p-7 lg:first:border-l-0">
                <span className="bg-(image:--gradient-indicator) bg-clip-text text-4xl font-bold text-transparent">
                  {p.step}
                </span>
                <h3 className="mt-4 text-lg font-semibold">{p.title}</h3>
                <p className="mt-2 text-sm text-white/70">{p.body}</p>
              </div>
            </Reveal>
          ))}
        </ol>
      </Container>
    </section>
  );
}

export function ProductionTeaser() {
  const picks = PRODUCTS.slice(0, 5);
  return (
    <section className="py-20 sm:py-24 lg:py-32">
      <Container>
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <SectionHeading
            eyebrow="Production"
            title="Products made with care, at scale."
            lead="A look at the categories we source and the lines that make them."
          />
          <Link
            href="/production"
            className="group text-primary inline-flex shrink-0 items-center gap-2 text-sm font-semibold"
          >
            View the full gallery
            <ArrowRight
              size={16}
              aria-hidden
              className="transition-transform group-hover:translate-x-1"
            />
          </Link>
        </div>
        <ul className="mt-12 grid auto-rows-[14rem] grid-cols-2 gap-3 sm:auto-rows-[16rem] sm:gap-4 lg:auto-rows-[15rem] lg:grid-cols-4">
          {picks.map((p, i) => (
            <Reveal
              as="li"
              key={p.id}
              delay={i * 0.06}
              className={i === 0 ? 'col-span-2 row-span-2' : undefined}
            >
              <Link
                href={`/production?item=${p.id}`}
                className="group relative block h-full overflow-hidden rounded-2xl"
              >
                <Image
                  src={p.image}
                  alt={p.name}
                  fill
                  placeholder="blur"
                  sizes={
                    i === 0 ? '(min-width: 1024px) 50vw, 100vw' : '(min-width: 1024px) 25vw, 50vw'
                  }
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <span
                  aria-hidden
                  className="from-ink-deep/85 absolute inset-0 bg-gradient-to-t via-transparent to-transparent"
                />
                <span className="absolute inset-x-0 bottom-0 p-4 text-white sm:p-5">
                  <span className="text-xs font-semibold tracking-wider text-white/70 uppercase">
                    {p.category}
                  </span>
                  <span className="mt-1 block font-semibold sm:text-lg">{p.name}</span>
                </span>
              </Link>
            </Reveal>
          ))}
        </ul>
      </Container>
    </section>
  );
}

export function JourneySection() {
  return (
    <section className="bg-surface border-border grid grid-cols-1 border-y lg:grid-cols-2">
      <div className="flex items-center px-(--page-gutter) py-16 sm:py-20 lg:py-28 lg:pl-[max(var(--page-gutter),calc((100vw-var(--container-site))/2+var(--page-gutter)))]">
        <Reveal className="max-w-xl">
          <SectionHeading eyebrow="The journey" title="Emerge’s evolution." />
          <p className="text-fg-muted mt-5 sm:text-lg">
            Since our first order in 2011, Emerge has grown from three people to a team of
            merchandisers, inspectors and engineers who follow millions of garments every year.
          </p>
          <ol className="border-border mt-8 space-y-5 border-l pl-6">
            {HISTORY.slice(-3).map((h) => (
              <li key={h.year} className="relative">
                <span
                  aria-hidden
                  className="ring-surface absolute top-1.5 -left-[1.95rem] size-3 rounded-full bg-(image:--gradient-brand) ring-4"
                />
                <p className="text-primary text-sm font-bold">{h.year}</p>
                <p className="text-fg font-semibold">{h.title}</p>
                <p className="text-fg-muted text-sm">{h.body}</p>
              </li>
            ))}
          </ol>
          <Link
            href="/company/history"
            className="group text-primary mt-8 inline-flex items-center gap-2 text-sm font-semibold"
          >
            Read our full history
            <ArrowRight
              size={16}
              aria-hidden
              className="transition-transform group-hover:translate-x-1"
            />
          </Link>
        </Reveal>
      </div>
      <div className="bg-ink-deep relative isolate flex min-h-[26rem] items-end overflow-hidden">
        <Image
          src={IMG.textileFactory}
          alt=""
          fill
          placeholder="blur"
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="-z-10 object-cover opacity-60"
        />
        <figure className="bg-surface/95 m-6 max-w-lg rounded-2xl p-6 shadow-lg backdrop-blur-sm sm:m-10 sm:p-8">
          <Quote size={32} aria-hidden className="text-primary" />
          <blockquote className="text-fg mt-4 text-lg font-medium">
            “Our promise is simple: the date we give a buyer is the date we work to, and the quality
            we approve is the quality that ships.”
          </blockquote>
          <figcaption className="mt-5 flex items-center gap-3">
            <span
              aria-hidden
              className="flex size-11 items-center justify-center rounded-full bg-(image:--gradient-brand) text-sm font-bold text-white"
            >
              C
            </span>
            <span>
              <span className="text-fg block text-sm font-semibold">Chairman</span>
              <span className="text-fg-subtle text-xs">Emerge Buying House</span>
            </span>
          </figcaption>
        </figure>
      </div>
    </section>
  );
}

export function LatestNews() {
  return (
    <section className="py-20 sm:py-24 lg:py-32">
      <Container>
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <SectionHeading eyebrow="News & events" title="What is happening at Emerge." />
          <Link
            href="/news-events"
            className="group text-primary inline-flex shrink-0 items-center gap-2 text-sm font-semibold"
          >
            All news & events
            <ArrowRight
              size={16}
              aria-hidden
              className="transition-transform group-hover:translate-x-1"
            />
          </Link>
        </div>
        <ul className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {NEWS_SORTED.slice(0, 3).map((n, i) => (
            <Reveal as="li" key={n.slug} delay={i * 0.08}>
              <NewsCard item={n} />
            </Reveal>
          ))}
        </ul>
      </Container>
    </section>
  );
}

export function CertificationStrip() {
  const items = [...CERTIFICATIONS, ...CERTIFICATIONS];
  return (
    <section
      aria-label="Standards and certifications"
      className="bg-surface border-border border-y py-10"
    >
      <Container className="flex flex-col items-center gap-6 lg:flex-row lg:gap-10">
        <p className="text-fg-muted flex shrink-0 items-center gap-2 text-sm font-medium">
          <ShieldCheck size={18} aria-hidden className="text-primary" />
          Standards our partner factories work to
        </p>
        <div className="relative w-full overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_10%,black_90%,transparent)]">
          <ul className="flex w-max gap-4 motion-safe:animate-[marquee_28s_linear_infinite] motion-safe:hover:[animation-play-state:paused]">
            {items.map((c, i) => (
              <li
                key={`${c}-${i}`}
                aria-hidden={i >= CERTIFICATIONS.length}
                className="border-border text-fg-muted flex h-12 items-center gap-2 rounded-xl border px-5 text-sm font-semibold whitespace-nowrap"
              >
                <BadgeCheck size={16} aria-hidden className="text-primary" />
                {c}
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}
