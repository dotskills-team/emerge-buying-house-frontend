import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRight,
  Building2,
  Check,
  Factory,
  PenTool,
  Truck,
  type LucideIcon,
} from 'lucide-react';
import { Reveal } from '@/components/site/reveal';
import { SectionHeading } from '@/components/site/section-heading';
import { Container } from '@/components/ui/container';
import {
  GROUP_COMPANIES,
  
  MANUFACTURING_COMPANIES,
  PARTNERS,
  SOURCING_INTRO,
} from '@/content/home';
import { SERVICES } from '@/content/services';
import { CLIENT_LOGOS } from '@/content/clients';
import { ClientLogoTile } from '@/components/site/client-logo-tile';
import { ImageAccents } from '@/components/site/image-accent';
import { IconBadge, toneAt } from '@/components/site/icon-badge';
import { IMG } from '@/content/images';

const section = 'py-16 sm:py-20 lg:py-20 2xl:py-28';

/** C. Our manufacturing strength: capacity in figures, and what the lines can do. */
export function ManufacturingStrength() {
  return (
    <section id="manufacturing-strength" className={section}>
      <Container className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <Reveal className="relative isolate">
          <ImageAccents preset="loom" />
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-lg">
            <Image
              src={IMG.productionLine}
              alt="A modern, well-lit garment production line"
              fill
              placeholder="blur"
              sizes="(min-width: 1024px) 45vw, 100vw"
              className="object-cover"
            />
          </div>
        </Reveal>
        <div>
          <SectionHeading
            eyebrow="Manufacturing strength"
            title="Capacity you can plan around."
            lead="A network of audited factories gives every order the right line, at the right time, without stretching anyone thin."
          />
          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2">
            {MANUFACTURING_COMPANIES.map((c, i) => (
              <Reveal
                key={c.name}
                delay={i * 0.06}
                className="border-border bg-surface rounded-2xl border p-6 shadow-sm"
              >
                <p className="text-secondary text-xs font-semibold tracking-[0.18em] uppercase">
                  {c.name}
                </p>
                <ul className="mt-4 space-y-4">
                  {c.items.map((item) => (
                    <li key={item.title}>
                      <p className="text-fg font-semibold">{item.title}</p>
                      <p className="text-fg-muted mt-1 text-sm">{item.body}</p>
                    </li>
                  ))}
                </ul>
              </Reveal>
            ))}
          </div>
          
        </div>
      </Container>
    </section>
  );
}

/** D. Sourcing strength: the buying house, and the offices where sourcing teams work. */
export function SourcingStrength() {
  return (
  
<section className={`text-black ${section}`}>
  <Container>
    <div className="mx-auto w-full">
      <h2 className="font-display text-primary text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
        {SOURCING_INTRO.eyebrow}
      </h2>

      <h3 className="font-display mt-4 text-2xl leading-snug font-semibold tracking-tight text-black sm:text-3xl">
        {SOURCING_INTRO.title}
      </h3>

      <div className="mt-6 space-y-4 text-base leading-relaxed text-black sm:text-lg text-justify">
        {SOURCING_INTRO.paragraphs.map((p) => (
          <p key={p} className="w-full">
            {p}
          </p>
        ))}
      </div>

      <p className="mt-8 text-base font-semibold tracking-[0.18em] uppercase text-black">
        {SOURCING_INTRO.closing}
      </p>
    </div>
  </Container>
</section>

  );
}

const SERVICE_ICONS: Record<string, LucideIcon> = {
  sourcing: Truck,
  'design-development': PenTool,
  manufacturing: Factory,
};

/** E. Service / what we are good at: sourcing, design & development and manufacturing. */
export function Services() {
  return (
    <section className={section}>
      <Container>
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            eyebrow="Our services"
            title="What we are good at."
            lead="One partner from the first sketch to the finished garment: take one service, or all three."
          />
          <Link
            href="/contact"
            className="text-primary inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold hover:underline"
          >
            Discuss a project <ArrowRight size={16} aria-hidden />
          </Link>
        </div>
        <ol className="mt-10 grid grid-cols-1 gap-3 lg:grid-cols-3">
          {SERVICES.map((s, i) => {
            const Icon = SERVICE_ICONS[s.slug] ?? PenTool;
            return (
              <li key={s.slug}>
                <Reveal delay={i * 0.06} className="h-full">
                  {/* Lifts on hover; a gold-to-emerald line draws across the top and the big
                      outlined number in the corner fills with colour. The whole card links to the
                      service page. */}
                  <Link
                    href={`/services/${s.slug}`}
                    className="group border-border bg-surface relative isolate flex h-full flex-col overflow-hidden rounded-2xl border p-7 shadow-sm transition-all duration-500 ease-out hover:-translate-y-1.5 hover:border-transparent hover:shadow-xl"
                  >
                    <span
                      aria-hidden
                      className="from-gold via-gold-light to-primary absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-gradient-to-r transition-transform duration-500 ease-out group-hover:scale-x-100"
                    />
                    <span
                      aria-hidden
                      className="bg-primary/5 absolute -top-16 -right-16 -z-10 size-44 rounded-full transition-transform duration-700 ease-out group-hover:scale-[2.6]"
                    />
                    <span
                      aria-hidden
                      className="font-display text-fg/10 group-hover:text-primary/15 absolute top-3 right-5 text-6xl leading-none font-bold tabular-nums transition-colors duration-500"
                    >
                      0{i + 1}
                    </span>

                    <IconBadge icon={Icon} tone={toneAt(i)} />
                    <h3 className="font-display text-fg mt-6 text-2xl font-semibold tracking-tight">
                      {s.title}
                    </h3>
                    <p className="text-fg-muted mt-2 text-sm leading-relaxed">{s.body}</p>
                    <ul className="border-border mt-6 space-y-2.5 border-t border-dashed pt-5">
                      {s.points.map((p) => (
                        <li key={p} className="text-fg flex gap-2.5 text-sm">
                          <span className="bg-primary-soft text-primary mt-0.5 flex size-4.5 shrink-0 items-center justify-center rounded-full">
                            <Check size={11} strokeWidth={3} aria-hidden />
                          </span>
                          {p}
                        </li>
                      ))}
                    </ul>
                    <span className="text-primary mt-auto inline-flex items-center gap-1.5 pt-6 text-sm font-semibold">
                      Explore {s.title.toLowerCase()}
                      <ArrowRight
                        size={15}
                        aria-hidden
                        className="transition-transform duration-300 group-hover:translate-x-1"
                      />
                    </span>
                  </Link>
                </Reveal>
              </li>
            );
          })}
        </ol>
      </Container>
    </section>
  );
}

/** F. Production and manufacturing partners: the factories behind the products. */
export function ManufacturingPartners() {
  return (
    <section id="manufacturing-partners" className={`bg-surface border-border border-y ${section}`}>
      <Container>
        <SectionHeading
          eyebrow="Manufacturing partners"
          title="The factories behind every order."
          lead="Each partner is audited before its first order and every year after, and matched to the products it does best."
        />
        <ul className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {PARTNERS.map((p, i) => (
            <li key={p.name}>
              <Reveal
                delay={(i % 3) * 0.05}
                className="group border-border bg-bg flex items-center gap-4 rounded-xl border p-5"
              >
                <IconBadge icon={Factory} tone={toneAt(i)} />
                <div className="min-w-0">
                  <p className="text-fg truncate font-semibold">{p.name}</p>
                  <p className="text-fg-muted mt-0.5 text-sm">
                    {p.speciality} · {p.location}
                  </p>
                </div>
              </Reveal>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}

/** G. Clients: the buyers who trust us, as a calm wordmark wall. */
export function Clients() {
  return (
    <section className={section}>
      <Container>
        <SectionHeading
          align="center"
          eyebrow="Our clients"
          title="Brands that trust us with their collections."
        />
        <ul className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 lg:gap-5">
          {CLIENT_LOGOS.map((c) => (
            <li key={c.name}>
              <ClientLogoTile client={c} />
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}

const COMPANY_IMAGES = [IMG.denim, IMG.operator, IMG.recycledThread];

/** Company: the businesses that make up Emerge Group. */
export function GroupCompanies() {
  return (
    <section className={`bg-surface border-border border-t ${section}`}>
      <Container>
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            eyebrow=""
            title="Our companies."
            lead="Specialist businesses under one group, each focused on what it makes best."
          />
          <span className="text-fg-subtle inline-flex items-center gap-2 text-sm">
            <Building2 size={16} aria-hidden /> {GROUP_COMPANIES.length} companies
          </span>
        </div>
        <ul className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-3">
          {GROUP_COMPANIES.map((c, i) => (
            <li key={c.name}>
              <Reveal
                delay={i * 0.06}
                className="border-border bg-bg group flex h-full flex-col overflow-hidden rounded-2xl border"
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Image
                    src={COMPANY_IMAGES[i % COMPANY_IMAGES.length]!}
                    alt=""
                    fill
                    placeholder="blur"
                    sizes="(min-width: 768px) 30vw, 100vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                  />
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <p className="text-secondary text-xs font-semibold tracking-[0.18em] uppercase">
                    {c.focus}
                  </p>
                  <h3 className="font-display text-fg mt-2 text-xl font-semibold tracking-tight">
                    {c.name}
                  </h3>
                  <p className="text-fg-muted mt-2 text-sm leading-relaxed">{c.body}</p>
                </div>
              </Reveal>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
