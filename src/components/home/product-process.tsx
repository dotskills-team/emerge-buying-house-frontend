'use client';

import { useEffect, useState } from 'react';
import {
  ClipboardCheck,
  Factory,
  Layers,
  Lightbulb,
  Ruler,
  Scissors,
  ShieldCheck,
  TrendingUp,
  type LucideIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Container } from '@/components/ui/container';

const STEPS: Array<{ title: string; body: string; icon: LucideIcon }> = [
  {
    title: 'Research & Trend Analysis',
    body: 'Explore global fashion trends and market insights.',
    icon: TrendingUp,
  },
  {
    title: 'Design Concept',
    body: 'Create innovative design concepts and collections.',
    icon: Lightbulb,
  },
  {
    title: 'Material Selection',
    body: 'Choose the right fabrics, trims and accessories.',
    icon: Layers,
  },
  {
    title: 'Pattern & Technical Development',
    body: 'Develop precise patterns and technical specs.',
    icon: Ruler,
  },
  {
    title: 'Sample Execution',
    body: 'Create development and fit samples.',
    icon: Scissors,
  },
  {
    title: 'Fit & Quality Evaluation',
    body: 'Assess fit, quality and performance.',
    icon: ClipboardCheck,
  },
  {
    title: 'Final Approval',
    body: 'Confirm design, quality and commercial viability.',
    icon: ShieldCheck,
  },
  {
    title: 'Production Readiness',
    body: 'Prepare for bulk production.',
    icon: Factory,
  },
];

const AUTOPLAY_MS = 4500;

    /**
     * Product development process as an interactive stepper: a rail of eight stages, a line that
     * fills as the stages advance, and a detail panel. It cycles on its own until a visitor picks a
     * stage, and every stage can be reached by hover, click, or keyboard.
     */


export function ProductProcess() {
  const [active, setActive] = useState(0);
  const [auto, setAuto] = useState(true);

  useEffect(() => {
    if (!auto) return;
    const id = window.setInterval(() => setActive((a) => (a + 1) % STEPS.length), AUTOPLAY_MS);
    return () => window.clearInterval(id);
  }, [auto]);

  const step = STEPS[active]!;
  const Icon = step.icon;
  const progress = (active / (STEPS.length - 1)) * 100;

  const choose = (i: number) => {
    setAuto(false);
    setActive(i);
  };

  return (
    <section className="bg-surface-inverse py-16 text-white sm:py-20 lg:py-20 2xl:py-28">
      <Container>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-gold-light inline-flex items-center gap-3 text-xs font-semibold tracking-[0.24em] uppercase">
              <span aria-hidden className="h-px w-10 bg-(image:--gradient-gold)" />
              Product development
            </p>
            <h2 className="font-display mt-3 text-3xl font-semibold tracking-tight text-balance sm:text-4xl lg:text-5xl">
              Our product development process
            </h2>
          </div>
          <p className="max-w-md text-base text-white/70 sm:text-lg">
            From insight to innovation: a structured journey from concept to production.
          </p>
        </div>

        {/* Rail: a track with a gold line that fills as the stages advance. */}
        <div className="-mx-(--page-gutter) mt-14 overflow-x-auto px-(--page-gutter) pb-4 [scrollbar-width:none] lg:mx-0 lg:overflow-visible lg:px-0 [&::-webkit-scrollbar]:hidden">
          <div className="relative min-w-max lg:min-w-0">
            <span aria-hidden className="absolute inset-x-6 top-7 h-px bg-white/15" />
            <span
              aria-hidden
              className="bg-(image:--gradient-gold) absolute top-7 left-6 h-px transition-[width] duration-700 ease-out"
              style={{ width: `calc((100% - 3rem) * ${progress / 100})` }}
            />
            <ol className="relative grid grid-cols-8 gap-2 lg:gap-3">
              {STEPS.map((s, i) => {
                const StepIcon = s.icon;
                const isActive = i === active;
                const isDone = i < active;
                return (
                  <li key={s.title} className="w-28 lg:w-auto">
                    <button
                      type="button"
                      onClick={() => choose(i)}
                      onMouseEnter={() => choose(i)}
                      aria-pressed={isActive}
                      aria-label={`Stage ${i + 1}: ${s.title}`}
                      className="group flex w-full flex-col items-center gap-3 text-center outline-none focus-visible:ring-2 focus-visible:ring-gold rounded-xl"
                    >
                      <span
                        className={cn(
                          'relative flex size-14 items-center justify-center rounded-full border transition-all duration-500 ease-out',
                          isActive
                            ? 'border-gold bg-gold text-ink-deep scale-110 shadow-[0_0_0_8px_rgba(212,175,55,0.15)]'
                            : isDone
                              ? 'border-primary bg-primary text-on-fill'
                              : 'border-white/20 bg-white/5 text-white/70 group-hover:border-white/50 group-hover:text-white',
                        )}
                      >
                        <StepIcon size={22} strokeWidth={1.75} aria-hidden />
                      </span>
                      <span
                        className={cn(
                          'font-display text-xs font-semibold tabular-nums transition-colors duration-300',
                          isActive ? 'text-gold-light' : 'text-white/50',
                        )}
                      >
                        {String(i + 1).padStart(2, '0')}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ol>
          </div>
        </div>

        {/* Detail panel: swaps in with a short rise when the stage changes. */}
        <div
          key={active}
          aria-live="polite"
          className="animate-[process-rise_0.6s_ease-out] motion-reduce:animate-none mt-10 grid gap-8 rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-sm sm:p-10 lg:grid-cols-[auto_1fr] lg:items-center lg:gap-14"
        >
          <div className="flex items-center gap-6">
            <span className="font-display text-gold-light/30 text-7xl leading-none font-bold tabular-nums sm:text-8xl">
              {String(active + 1).padStart(2, '0')}
            </span>
            <span className="bg-gold/15 text-gold-light flex size-16 items-center justify-center rounded-2xl ring-1 ring-gold/30">
              <Icon size={28} strokeWidth={1.75} aria-hidden />
            </span>
          </div>
          <div>
            <p className="text-gold-light text-xs font-semibold tracking-[0.2em] uppercase">
              Stage {active + 1} of {STEPS.length}
            </p>
            <h3 className="font-display mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
              {step.title}
            </h3>
            <p className="mt-3 text-base leading-relaxed text-white/75 sm:text-lg">{step.body}</p>
          </div>
        </div>

        <div className="mt-10 flex items-center justify-center gap-3 text-sm font-semibold tracking-[0.16em] text-white/60 uppercase">
          <span>Innovation</span>
          <span aria-hidden className="text-gold">•</span>
          <span>Quality</span>
          <span aria-hidden className="text-gold">•</span>
          <span>Market Success</span>
        </div>
      </Container>
    </section>
  );
}
