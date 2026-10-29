// import Image from 'next/image';
// import Link from 'next/link';
// import {
//   ArrowRight,
//   Building2,
//   Check,
//   Compass,
//   Factory,
//   Layers,
//   MapPin,
//   PenTool,
//   Scissors,
//   ShieldCheck,
//   Truck,
//   type LucideIcon,
// } from 'lucide-react';
// import { Reveal } from '@/components/site/reveal';
// import { SectionHeading } from '@/components/site/section-heading';
// import { Container } from '@/components/ui/container';
// import {
//   CLIENTS,
//   GROUP_COMPANIES,
//   MANUFACTURING_CAPABILITIES,
//   MANUFACTURING_FIGURES,
//   PARTNERS,
//   SERVICES,
//   SOURCING_POINTS,
// } from '@/content/home';
// import { ImageAccents } from '@/components/site/image-accent';
// import { IconBadge, toneAt } from '@/components/site/icon-badge';
// import { IMG } from '@/content/images';

// const section = 'py-16 sm:py-20 lg:py-20 2xl:py-28';

// /** C. Our manufacturing strength: capacity in figures, and what the lines can do. */
// export function ManufacturingStrength() {
//   return (
//     <section id="manufacturing-strength" className={section}>
//       <Container className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16">
//         <Reveal className="relative isolate">
//           <ImageAccents preset="loom" />
//           <div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-lg">
//             <Image
//               src={IMG.productionLine}
//               alt="A modern, well-lit garment production line"
//               fill
//               placeholder="blur"
//               sizes="(min-width: 1024px) 45vw, 100vw"
//               className="object-cover"
//             />
//           </div>
//         </Reveal>
//         <div>
//           <SectionHeading
//             eyebrow="Manufacturing strength"
//             title="Capacity you can plan around."
//             lead="A network of audited factories gives every order the right line, at the right time, without stretching anyone thin."
//           />
//           <dl className="border-border mt-8 grid grid-cols-2 border-t">
//             {MANUFACTURING_FIGURES.map((f, i) => (
//               <div
//                 key={f.label}
//                 className="border-border flex flex-col border-b py-5 pr-4 odd:border-r even:pl-5"
//               >
//                 <dt className="text-fg-muted order-2 text-sm">{f.label}</dt>
//                 <dd className="text-primary font-display order-1 mb-1 text-3xl font-semibold tracking-tight">
//                   <Reveal delay={i * 0.05}>{f.value}</Reveal>
//                 </dd>
//               </div>
//             ))}
//           </dl>
//           <ul className="mt-6 grid grid-cols-1 gap-x-6 gap-y-2.5 sm:grid-cols-2">
//             {MANUFACTURING_CAPABILITIES.map((c) => (
//               <li key={c} className="text-fg-muted flex gap-2.5 text-sm">
//                 <Check size={16} aria-hidden className="text-primary mt-0.5 shrink-0" />
//                 {c}
//               </li>
//             ))}
//           </ul>
//         </div>
//       </Container>
//     </section>
//   );
// }

// const SOURCING_ICONS: LucideIcon[] = [Layers, Scissors, ShieldCheck, MapPin];

// /** D. Sourcing strength: where fabric, trims and factories come from. */
// export function SourcingStrength() {
//   return (
//     <section className={`bg-surface-inverse text-white ${section}`}>
//       <Container className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_1.15fr] lg:gap-16">
//         <div className="flex flex-col">
//           <SectionHeading
//             tone="inverse"
//             eyebrow="Emerge Style"
//             title="Fabric, trims and factories, sourced close to the line."
//             lead="Years of relationships with mills and suppliers in Bangladesh mean better prices, earlier bookings and fewer surprises."
//           />
//           <Reveal className="relative isolate mt-8 hidden lg:block">
//             <ImageAccents preset="night" />
//             <div className="relative aspect-[16/10] overflow-hidden rounded-2xl">
//               <Image
//                 src={IMG.sourcingFabricLibrary}
//                 alt="Fabric in many colours ready for cutting"
//                 fill
//                 placeholder="blur"
//                 sizes="40vw"
//                 className="object-cover"
//               />
//             </div>
//           </Reveal>
//         </div>
//         <ul className="grid grid-cols-1 gap-px self-start overflow-hidden rounded-2xl border border-white/10 bg-white/10 sm:grid-cols-2">
//           {SOURCING_POINTS.map((p, i) => {
//             const Icon = SOURCING_ICONS[i] ?? Layers;
//             return (
//               <li key={p.title} className="group bg-surface-inverse p-6 sm:p-7">
//                 <Reveal delay={i * 0.05}>
//                   <IconBadge icon={Icon} tone={toneAt(i + 1)} dark />
//                   <h3 className="mt-5 text-lg font-semibold">{p.title}</h3>
//                   <p className="mt-2 text-sm leading-relaxed text-white/70">{p.body}</p>
//                 </Reveal>
//               </li>
//             );
//           })}
//         </ul>
//       </Container>
//     </section>
//   );
// }

// const SERVICE_ICONS: LucideIcon[] = [PenTool, Compass, Truck, Factory];

// /** E. Service / what we are good at: design, development and sourcing. */
// export function Services() {
//   return (
//     <section className={section}>
//       <Container>
//         <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
//           <SectionHeading
//             eyebrow="Our services"
//             title="What we are good at."
//             lead="One partner from the first sketch to the finished garment: take one service, or all four."
//           />
//           <Link
//             href="/contact"
//             className="text-primary inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold hover:underline"
//           >
//             Discuss a project <ArrowRight size={16} aria-hidden />
//           </Link>
//         </div>
//         <ol className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">          {SERVICES.map((s, i) => {
//           const Icon = SERVICE_ICONS[i] ?? PenTool;
//           return (
//             <li key={s.title}>
//               <Reveal delay={i * 0.06} className="h-full">
//                 {/* Lifts on hover; a gold-to-emerald line draws across the top and the big
//                       outlined number in the corner fills with colour. */}
//                 <div className="group border-border bg-surface relative isolate flex h-full flex-col overflow-hidden rounded-2xl border p-7 shadow-sm transition-all duration-500 ease-out hover:-translate-y-1.5 hover:border-transparent hover:shadow-xl">
//                   <span
//                     aria-hidden
//                     className="from-gold via-gold-light to-primary absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-gradient-to-r transition-transform duration-500 ease-out group-hover:scale-x-100"
//                   />
//                   <span
//                     aria-hidden
//                     className="bg-primary/5 absolute -top-16 -right-16 -z-10 size-44 rounded-full transition-transform duration-700 ease-out group-hover:scale-[2.6]"
//                   />
//                   <span
//                     aria-hidden
//                     className="font-display text-fg/10 group-hover:text-primary/15 absolute top-3 right-5 text-6xl leading-none font-bold tabular-nums transition-colors duration-500"
//                   >
//                     0{i + 1}
//                   </span>

//                   <IconBadge icon={Icon} tone={toneAt(i)} />
//                   <h3 className="font-display text-fg mt-6 text-2xl font-semibold tracking-tight">
//                     {s.title}
//                   </h3>
//                   <p className="text-fg-muted mt-2 text-sm leading-relaxed">{s.body}</p>
//                   <ul className="border-border mt-6 space-y-2.5 border-t border-dashed pt-5">
//                     {s.points.map((p) => (
//                       <li key={p} className="text-fg flex gap-2.5 text-sm">
//                         <span className="bg-primary-soft text-primary mt-0.5 flex size-4.5 shrink-0 items-center justify-center rounded-full">
//                           <Check size={11} strokeWidth={3} aria-hidden />
//                         </span>
//                         {p}
//                       </li>
//                     ))}
//                   </ul>
//                   <Link
//                     href="/contact"
//                     className="text-primary mt-auto inline-flex items-center gap-1.5 pt-6 text-sm font-semibold"
//                   >
//                     Start with {s.title.toLowerCase()}
//                     <ArrowRight
//                       size={15}
//                       aria-hidden
//                       className="transition-transform duration-300 group-hover:translate-x-1"
//                     />
//                   </Link>
//                 </div>
//               </Reveal>
//             </li>
//           );
//         })}
//         </ol>
//       </Container>
//     </section>
//   );
// }

// /** F. Production and manufacturing partners: the factories behind the products. */
// export function ManufacturingPartners() {
//   return (
//     <section id="manufacturing-partners" className={`bg-surface border-border border-y ${section}`}>
//       <Container>
//         <SectionHeading
//           eyebrow="Manufacturing partners"
//           title="The factories behind every order."
//           lead="Each partner is audited before its first order and every year after, and matched to the products it does best."
//         />
//         <ul className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
//           {PARTNERS.map((p, i) => (
//             <li key={p.name}>
//               <Reveal
//                 delay={(i % 3) * 0.05}
//                 className="group border-border bg-bg flex items-center gap-4 rounded-xl border p-5"
//               >
//                 <IconBadge icon={Factory} tone={toneAt(i)} />
//                 <div className="min-w-0">
//                   <p className="text-fg truncate font-semibold">{p.name}</p>
//                   <p className="text-fg-muted mt-0.5 text-sm">
//                     {p.speciality} · {p.location}
//                   </p>
//                 </div>
//               </Reveal>
//             </li>
//           ))}
//         </ul>
//       </Container>
//     </section>
//   );
// }

// /** G. Clients: the buyers who trust us, as a calm wordmark wall. */
// export function Clients() {
//   return (
//     <section className={section}>
//       <Container>
//         <SectionHeading
//           align="center"
//           eyebrow="Our clients"
//           title="Brands that trust us with their collections."
//         />
//         <ul className="border-border mt-10 grid grid-cols-2 overflow-hidden rounded-2xl border sm:grid-cols-4">
//           {CLIENTS.map((c) => (
//             <li
//               key={c}
//               className="border-border text-fg-muted hover:text-fg flex min-h-24 items-center justify-center border-r border-b px-4 text-center transition-colors [&:nth-child(2n)]:border-r-0 sm:[&:nth-child(2n)]:border-r sm:[&:nth-child(4n)]:border-r-0"
//             >
//               <span className="font-display text-lg font-semibold tracking-tight">{c}</span>
//             </li>
//           ))}
//         </ul>
//       </Container>
//     </section>
//   );
// }

// const COMPANY_IMAGES = [IMG.denim, IMG.operator, IMG.recycledThread];

// /** Company: the businesses that make up Emerge Group. */
// export function GroupCompanies() {
//   return (
//     <section className={`bg-surface border-border border-t ${section}`}>
//       <Container>
//         <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
//           <SectionHeading
//             eyebrow="Emerge Group"
//             title="Our companies."
//             lead="Specialist businesses under one group, each focused on what it makes best."
//           />
//           <span className="text-fg-subtle inline-flex items-center gap-2 text-sm">
//             <Building2 size={16} aria-hidden /> {GROUP_COMPANIES.length} companies
//           </span>
//         </div>
//         <ul className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-3">
//           {GROUP_COMPANIES.map((c, i) => (
//             <li key={c.name}>
//               <Reveal
//                 delay={i * 0.06}
//                 className="border-border bg-bg group flex h-full flex-col overflow-hidden rounded-2xl border"
//               >
//                 <div className="relative aspect-[16/10] overflow-hidden">
//                   <Image
//                     src={COMPANY_IMAGES[i % COMPANY_IMAGES.length]!}
//                     alt=""
//                     fill
//                     placeholder="blur"
//                     sizes="(min-width: 768px) 30vw, 100vw"
//                     className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
//                   />
//                 </div>
//                 <div className="flex flex-1 flex-col p-6">
//                   <p className="text-secondary text-xs font-semibold tracking-[0.18em] uppercase">
//                     {c.focus}
//                   </p>
//                   <h3 className="font-display text-fg mt-2 text-xl font-semibold tracking-tight">
//                     {c.name}
//                   </h3>
//                   <p className="text-fg-muted mt-2 text-sm leading-relaxed">{c.body}</p>
//                 </div>
//               </Reveal>
//             </li>
//           ))}
//         </ul>
//       </Container>
//     </section>
//   );
// }
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRight,
  Building2,
  Check,
  Factory,
  FlaskConical,
  Layers,
  MapPin,
  PenTool,
  Scissors,
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

const SOURCING_ICONS: LucideIcon[] = [Scissors, MapPin];

/** D. Sourcing strength: where fabric, trims and factories come from. */
export function SourcingStrength() {
  return (
    <section className={`bg-surface-inverse text-white ${section}`}>
      <Container className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_1.15fr] lg:gap-16">
        <div className="flex flex-col">
          <SectionHeading
            tone="inverse"
            eyebrow="Emerge Style"
            title="Fabric, trims and factories, sourced close to the line."
            lead="Years of relationships with mills and suppliers in Bangladesh mean better prices, earlier bookings and fewer surprises."
          />
          <Reveal className="relative isolate mt-8 hidden lg:block">
            <ImageAccents preset="night" />
            <div className="relative aspect-[16/10] overflow-hidden rounded-2xl">
              <Image
                src={IMG.sourcingFabricLibrary}
                alt="Fabric in many colours ready for cutting"
                fill
                placeholder="blur"
                sizes="40vw"
                className="object-cover"
              />
            </div>
          </Reveal>
        </div>
        <ul className="grid grid-cols-1 gap-px self-center overflow-hidden rounded-2xl border border-white/10 bg-white/10">
          {SOURCING_POINTS.map((p, i) => {
            const Icon = SOURCING_ICONS[i] ?? Layers;
            return (
              <li key={p.title} className="group bg-surface-inverse p-8 sm:p-10">
                <Reveal delay={i * 0.05}>
                  <IconBadge icon={Icon} tone={toneAt(i + 1)} dark />
                  <h3 className="mt-6 text-2xl font-semibold sm:text-3xl">{p.title}</h3>
                  <p className="mt-3 text-base leading-relaxed text-white/70 sm:text-lg">
                    {p.body}
                  </p>
                </Reveal>
              </li>
            );
          })}
        </ul>
      </Container>
    </section>
  );
}

const SERVICE_ICONS: LucideIcon[] = [Truck, PenTool, FlaskConical, Factory];

/** E. Service / what we are good at: sourcing, design & development, R&D and manufacturing. */
export function Services() {
  return (
    <section className={section}>
      <Container>
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            eyebrow="Our services"
            title="What we are good at."
            lead="One partner from the first sketch to the finished garment: take one service, or all four."
          />
          <Link
            href="/contact"
            className="text-primary inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold hover:underline"
          >
            Discuss a project <ArrowRight size={16} aria-hidden />
          </Link>
        </div>
        <ol className="mt-10 grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4">
          {SERVICES.map((s, i) => {
            const Icon = SERVICE_ICONS[i] ?? PenTool;
            return (
              <li key={s.title}>
                <Reveal delay={i * 0.06} className="h-full">
                  {/* Lifts on hover; a gold-to-emerald line draws across the top and the big
                      outlined number in the corner fills with colour. */}
                  <div className="group border-border bg-surface relative isolate flex h-full flex-col overflow-hidden rounded-2xl border p-7 shadow-sm transition-all duration-500 ease-out hover:-translate-y-1.5 hover:border-transparent hover:shadow-xl">
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
                    <Link
                      href="/contact"
                      className="text-primary mt-auto inline-flex items-center gap-1.5 pt-6 text-sm font-semibold"
                    >
                      Start with {s.title.toLowerCase()}
                      <ArrowRight
                        size={15}
                        aria-hidden
                        className="transition-transform duration-300 group-hover:translate-x-1"
                      />
                    </Link>
                  </div>
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