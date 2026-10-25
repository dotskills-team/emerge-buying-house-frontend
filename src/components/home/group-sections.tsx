import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRight,
  Building2,
  Check,
  Compass,
  Factory,
  Layers,
  MapPin,
  PenTool,
  Scissors,
  ShieldCheck,
  Truck,
  type LucideIcon,
} from 'lucide-react';
import { Reveal } from '@/components/site/reveal';
import { SectionHeading } from '@/components/site/section-heading';
import { Container } from '@/components/ui/container';
import {
  CLIENTS,
  GROUP_COMPANIES,
  MANUFACTURING_CAPABILITIES,
  MANUFACTURING_FIGURES,
  PARTNERS,
  SERVICES,
  SOURCING_POINTS,
} from '@/content/home';
import { IMG } from '@/content/images';

const section = 'py-16 sm:py-20 lg:py-20 2xl:py-28';

/** C. Our manufacturing strength: capacity in figures, and what the lines can do. */
export function ManufacturingStrength() {
  return (
    <section className={section}>
      <Container className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <Reveal className="relative aspect-[4/3] overflow-hidden rounded-2xl">
          <Image
            src={IMG.factoryFloor}
            alt="Sewing lines in a partner factory"
            fill
            placeholder="blur"
            sizes="(min-width: 1024px) 45vw, 100vw"
            className="object-cover"
          />
        </Reveal>
        <div>
          <SectionHeading
            eyebrow="Manufacturing strength"
            title="Capacity you can plan around."
            lead="A network of audited factories gives every order the right line, at the right time, without stretching anyone thin."
          />
          <dl className="border-border mt-8 grid grid-cols-2 border-t">
            {MANUFACTURING_FIGURES.map((f, i) => (
              <div
                key={f.label}
                className="border-border flex flex-col border-b py-5 pr-4 odd:border-r even:pl-5"
              >
                <dt className="text-fg-muted order-2 text-sm">{f.label}</dt>
                <dd className="text-primary font-display order-1 mb-1 text-3xl font-semibold tracking-tight">
                  <Reveal delay={i * 0.05}>{f.value}</Reveal>
                </dd>
              </div>
            ))}
          </dl>
          <ul className="mt-6 grid grid-cols-1 gap-x-6 gap-y-2.5 sm:grid-cols-2">
            {MANUFACTURING_CAPABILITIES.map((c) => (
              <li key={c} className="text-fg-muted flex gap-2.5 text-sm">
                <Check size={16} aria-hidden className="text-primary mt-0.5 shrink-0" />
                {c}
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}

const SOURCING_ICONS: LucideIcon[] = [Layers, Scissors, ShieldCheck, MapPin];

/** D. Sourcing strength: where fabric, trims and factories come from. */
export function SourcingStrength() {
  return (
    <section className={`bg-surface-inverse text-white ${section}`}>
      <Container className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_1.15fr] lg:gap-16">
        <div className="flex flex-col">
          <SectionHeading
            tone="inverse"
            eyebrow="Sourcing strength"
            title="Fabric, trims and factories, sourced close to the line."
            lead="Years of relationships with mills and suppliers in Bangladesh mean better prices, earlier bookings and fewer surprises."
          />
          <Reveal className="relative mt-8 hidden aspect-[16/10] overflow-hidden rounded-2xl lg:block">
            <Image
              src={IMG.fabricRolls}
              alt="Fabric in many colours ready for cutting"
              fill
              placeholder="blur"
              sizes="40vw"
              className="object-cover"
            />
          </Reveal>
        </div>
        <ul className="grid grid-cols-1 gap-px self-start overflow-hidden rounded-2xl border border-white/10 bg-white/10 sm:grid-cols-2">
          {SOURCING_POINTS.map((p, i) => {
            const Icon = SOURCING_ICONS[i] ?? Layers;
            return (
              <li key={p.title} className="bg-surface-inverse p-6 sm:p-7">
                <Reveal delay={i * 0.05}>
                  <Icon size={22} aria-hidden className="text-gold-light" strokeWidth={1.6} />
                  <h3 className="mt-5 text-lg font-semibold">{p.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/70">{p.body}</p>
                </Reveal>
              </li>
            );
          })}
        </ul>
      </Container>
    </section>
  );
}

const SERVICE_ICONS: LucideIcon[] = [PenTool, Compass, Truck];

/** E. Service / what we are good at: design, development and sourcing. */
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
        <ol className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-3">
          {SERVICES.map((s, i) => {
            const Icon = SERVICE_ICONS[i] ?? PenTool;
            return (
              <li key={s.title}>
                <Reveal
                  delay={i * 0.06}
                  className="border-border bg-surface hover:border-primary/30 flex h-full flex-col rounded-2xl border p-7 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="bg-primary-soft text-primary flex size-11 items-center justify-center rounded-xl">
                      <Icon size={20} aria-hidden />
                    </span>
                    <span className="text-fg-subtle font-display text-sm tabular-nums">
                      0{i + 1}
                    </span>
                  </div>
                  <h3 className="font-display text-fg mt-6 text-2xl font-semibold tracking-tight">
                    {s.title}
                  </h3>
                  <p className="text-fg-muted mt-2 text-sm leading-relaxed">{s.body}</p>
                  <ul className="border-border mt-6 space-y-2 border-t pt-5">
                    {s.points.map((p) => (
                      <li key={p} className="text-fg flex gap-2 text-sm">
                        <Check size={16} aria-hidden className="text-primary mt-0.5 shrink-0" />
                        {p}
                      </li>
                    ))}
                  </ul>
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
    <section className={`bg-surface border-border border-y ${section}`}>
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
                className="border-border bg-bg flex items-center gap-4 rounded-xl border p-5"
              >
                <span className="bg-surface text-primary border-border flex size-12 shrink-0 items-center justify-center rounded-lg border">
                  <Factory size={20} aria-hidden strokeWidth={1.6} />
                </span>
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
        <ul className="border-border mt-10 grid grid-cols-2 overflow-hidden rounded-2xl border sm:grid-cols-4">
          {CLIENTS.map((c) => (
            <li
              key={c}
              className="border-border text-fg-muted hover:text-fg flex min-h-24 items-center justify-center border-r border-b px-4 text-center transition-colors [&:nth-child(2n)]:border-r-0 sm:[&:nth-child(2n)]:border-r sm:[&:nth-child(4n)]:border-r-0"
            >
              <span className="font-display text-lg font-semibold tracking-tight">{c}</span>
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
            eyebrow="Emerge Group"
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
