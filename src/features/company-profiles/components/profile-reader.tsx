'use client';

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import {
  ChevronDown,
  ChevronUp,
  Download,
  ExternalLink,
  FileWarning,
  Loader2,
  X,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { loadPdf, type PDFDocumentProxy } from '../pdf';
import type { CompanyProfile } from '../types';
import { PdfPageCanvas } from './pdf-page-canvas';

const ZOOMS = [0.5, 0.75, 1, 1.25, 1.5, 2, 2.5, 3];
/** Widest a page is shown at 100%, so text stays a comfortable reading size on big screens. */
const MAX_FIT_WIDTH = 960;
const GUTTER = 16;

type LoadState =
  | { status: 'loading' }
  | { status: 'ready'; doc: PDFDocumentProxy; sizes: Array<{ w: number; h: number }> }
  | { status: 'error' };

/**
 * Full-screen reader for one profile: pages stacked for scrolling, drawn only near the screen
 * (and released after), with page navigation, zoom and download. Esc, the close button or the
 * browser back gesture on the dialog closes it.
 */
export function ProfileReader({
  profile,
  onClose,
}: {
  profile: CompanyProfile;
  onClose: () => void;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const slotRefs = useRef<Array<HTMLDivElement | null>>([]);
  const [state, setState] = useState<LoadState>({ status: 'loading' });
  const [fitWidth, setFitWidth] = useState(0);
  const [zoomIndex, setZoomIndex] = useState(ZOOMS.indexOf(1));
  const [current, setCurrent] = useState(1);
  const zoom = ZOOMS[zoomIndex] ?? 1;
  const pageWidth = Math.round(fitWidth * zoom);

  // Open as a modal (focus trap, Esc, inert page) and stop the page behind from scrolling.
  useLayoutEffect(() => {
    const dialog = dialogRef.current;
    if (dialog && !dialog.open) dialog.showModal();
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, []);

  useEffect(() => {
    let active = true;
    loadPdf(profile.url)
      .then(async (doc) => {
        // Every page starts at the first page's size (profiles rarely mix sizes); a page that
        // differs corrects its slot when it is drawn. Fetching all sizes first would download
        // part of every page before showing anything.
        const first = (await doc.getPage(1)).getViewport({ scale: 1 });
        const sizes = Array.from({ length: doc.numPages }, () => ({
          w: first.width,
          h: first.height,
        }));
        if (active) setState({ status: 'ready', doc, sizes });
      })
      .catch((err: unknown) => {
        console.error('Could not open the profile:', err);
        if (active) setState({ status: 'error' });
      });
    return () => {
      active = false;
    };
  }, [profile.url]);

  // "100%" = the page fills the reading area (up to a comfortable maximum).
  useLayoutEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const measure = () => setFitWidth(Math.min(el.clientWidth - GUTTER * 2, MAX_FIT_WIDTH));
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // The page counter follows the page that fills most of the upper part of the screen.
  useEffect(() => {
    const el = scrollRef.current;
    if (!el || state.status !== 'ready') return;
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const line = el.scrollTop + el.clientHeight * 0.35;
        let page = 1;
        slotRefs.current.forEach((slot, i) => {
          if (slot && slot.offsetTop <= line) page = i + 1;
        });
        setCurrent(page);
      });
    };
    onScroll();
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      el.removeEventListener('scroll', onScroll);
    };
  }, [state.status, pageWidth]);

  const total = state.status === 'ready' ? state.sizes.length : 0;

  const updateSize = useCallback((index: number, size: { w: number; h: number }) => {
    setState((s) => {
      if (s.status !== 'ready') return s;
      const old = s.sizes[index];
      if (!old || (Math.abs(old.w - size.w) < 1 && Math.abs(old.h - size.h) < 1)) return s;
      const sizes = [...s.sizes];
      sizes[index] = size;
      return { ...s, sizes };
    });
  }, []);

  const goTo = useCallback(
    (page: number) => {
      const target = Math.min(Math.max(page, 1), total);
      slotRefs.current[target - 1]?.scrollIntoView({ block: 'start', behavior: 'smooth' });
    },
    [total],
  );

  /** Zooms while keeping the same spot of the document in view. */
  const setZoom = useCallback((next: number) => {
    const el = scrollRef.current;
    const clamped = Math.min(Math.max(next, 0), ZOOMS.length - 1);
    setZoomIndex((prev) => {
      if (el && prev !== clamped) {
        const ratio = (ZOOMS[clamped] ?? 1) / (ZOOMS[prev] ?? 1);
        const centreY = el.scrollTop + el.clientHeight / 2;
        const centreX = el.scrollLeft + el.clientWidth / 2;
        requestAnimationFrame(() => {
          el.scrollTop = centreY * ratio - el.clientHeight / 2;
          el.scrollLeft = centreX * ratio - el.clientWidth / 2;
        });
      }
      return clamped;
    });
  }, []);

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.target instanceof HTMLInputElement) return;
    if (e.key === '+' || e.key === '=') {
      e.preventDefault();
      setZoom(zoomIndex + 1);
    } else if (e.key === '-') {
      e.preventDefault();
      setZoom(zoomIndex - 1);
    } else if (e.key === '0') {
      e.preventDefault();
      setZoom(ZOOMS.indexOf(1));
    }
  }

  const tool =
    'inline-flex size-10 shrink-0 items-center justify-center rounded-lg text-white/85 transition-colors hover:bg-white/10 hover:text-white disabled:pointer-events-none disabled:opacity-35';

  return (
    <dialog
      ref={dialogRef}
      aria-label={`${profile.title} (PDF reader)`}
      onClose={onClose}
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onKeyDown={onKeyDown}
      className="fixed inset-0 m-0 h-dvh max-h-none w-screen max-w-none bg-transparent p-0 backdrop:bg-black/80 backdrop:backdrop-blur-sm"
    >
      <div className="flex h-full flex-col bg-neutral-900 text-white">
        <header className="flex h-14 shrink-0 items-center gap-1 border-b border-white/10 bg-neutral-950/90 px-2 sm:gap-2 sm:px-4">
          <div className="min-w-0 flex-1 pl-1">
            <p className="truncate text-sm font-semibold sm:text-base">{profile.title}</p>
            <p className="hidden text-xs text-white/55 sm:block">
              {profile.language ? `${profile.language} · ` : ''}PDF
            </p>
          </div>

          {state.status === 'ready' && (
            <>
              <div className="flex items-center">
                <button
                  type="button"
                  className={tool}
                  onClick={() => goTo(current - 1)}
                  disabled={current <= 1}
                  aria-label="Previous page"
                  title="Previous page"
                >
                  <ChevronUp size={20} aria-hidden />
                </button>
                <PageInput current={current} total={total} onGo={goTo} />
                <button
                  type="button"
                  className={tool}
                  onClick={() => goTo(current + 1)}
                  disabled={current >= total}
                  aria-label="Next page"
                  title="Next page"
                >
                  <ChevronDown size={20} aria-hidden />
                </button>
              </div>
              <span aria-hidden className="mx-1 hidden h-6 w-px bg-white/15 sm:block" />
              <div className="hidden items-center sm:flex">
                <button
                  type="button"
                  className={tool}
                  onClick={() => setZoom(zoomIndex - 1)}
                  disabled={zoomIndex === 0}
                  aria-label="Zoom out"
                  title="Zoom out (−)"
                >
                  <ZoomOut size={18} aria-hidden />
                </button>
                <button
                  type="button"
                  onClick={() => setZoom(ZOOMS.indexOf(1))}
                  className="min-w-14 rounded-lg px-2 py-2 text-center text-sm text-white/85 tabular-nums hover:bg-white/10"
                  title="Fit to width (0)"
                >
                  {Math.round(zoom * 100)}%
                </button>
                <button
                  type="button"
                  className={tool}
                  onClick={() => setZoom(zoomIndex + 1)}
                  disabled={zoomIndex === ZOOMS.length - 1}
                  aria-label="Zoom in"
                  title="Zoom in (+)"
                >
                  <ZoomIn size={18} aria-hidden />
                </button>
              </div>
            </>
          )}

          <span aria-hidden className="mx-1 hidden h-6 w-px bg-white/15 sm:block" />
          <a
            href={profile.url}
            download={profile.fileName}
            className={tool}
            aria-label={`Download ${profile.title}`}
            title="Download PDF"
          >
            <Download size={18} aria-hidden />
          </a>
          <button
            type="button"
            className={tool}
            onClick={onClose}
            aria-label="Close reader"
            title="Close (Esc)"
          >
            <X size={20} aria-hidden />
          </button>
        </header>

        <div
          ref={scrollRef}
          className="relative min-h-0 flex-1 overflow-auto overscroll-contain"
          tabIndex={-1}
        >
          {state.status === 'loading' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-white/70">
              <Loader2 size={32} aria-hidden className="animate-spin" />
              <p className="text-sm" role="status">
                Opening {profile.title}…
              </p>
            </div>
          )}

          {state.status === 'error' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 px-6 text-center">
              <FileWarning size={40} aria-hidden className="text-white/60" />
              <div>
                <p className="font-semibold">This profile could not be opened here.</p>
                <p className="mt-1 text-sm text-white/65">
                  Check your connection, or open the PDF directly.
                </p>
              </div>
              <div className="flex flex-wrap justify-center gap-2">
                <a
                  href={profile.url}
                  target="_blank"
                  rel="noopener"
                  className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-white px-4 text-sm font-medium text-neutral-900"
                >
                  <ExternalLink size={16} aria-hidden /> Open PDF
                </a>
                <a
                  href={profile.url}
                  download={profile.fileName}
                  className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-white/30 px-4 text-sm font-medium"
                >
                  <Download size={16} aria-hidden /> Download
                </a>
              </div>
            </div>
          )}

          {state.status === 'ready' && pageWidth > 0 && (
            <div
              className="mx-auto flex w-max min-w-full flex-col items-center gap-4 py-4 sm:gap-6 sm:py-6"
              style={{ paddingInline: GUTTER }}
            >
              {state.sizes.map((size, i) => (
                <PageSlot
                  key={i}
                  ref={(el) => {
                    slotRefs.current[i] = el;
                  }}
                  root={scrollRef}
                  doc={state.doc}
                  pageNumber={i + 1}
                  total={state.sizes.length}
                  width={pageWidth}
                  height={Math.round((pageWidth * size.h) / size.w)}
                  onSize={(s) => updateSize(i, s)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </dialog>
  );
}

/** One page's place in the scroll: always the right size; the drawing only while near view. */
function PageSlot({
  ref,
  root,
  doc,
  pageNumber,
  total,
  width,
  height,
  onSize,
}: {
  ref: (el: HTMLDivElement | null) => void;
  root: React.RefObject<HTMLDivElement | null>;
  doc: PDFDocumentProxy;
  pageNumber: number;
  total: number;
  width: number;
  height: number;
  onSize: (size: { w: number; h: number }) => void;
}) {
  const slotRef = useRef<HTMLDivElement | null>(null);
  const [near, setNear] = useState(false);

  useEffect(() => {
    const el = slotRef.current;
    if (!el) return;
    // About two screens above and below are drawn ahead; farther pages are released.
    const observer = new IntersectionObserver(
      ([entry]) => setNear(Boolean(entry?.isIntersecting)),
      {
        root: root.current,
        rootMargin: '200% 0px',
      },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [root]);

  return (
    <div
      ref={(el) => {
        slotRef.current = el;
        ref(el);
      }}
      className={cn(
        'relative shrink-0 overflow-hidden rounded-sm bg-white shadow-2xl shadow-black/40',
        !near && 'bg-neutral-200',
      )}
      style={{ width, height }}
    >
      {near ? (
        <PdfPageCanvas
          doc={doc}
          pageNumber={pageNumber}
          width={width}
          label={`Page ${pageNumber} of ${total}`}
          className="absolute inset-0"
          onSize={onSize}
        />
      ) : (
        <span className="absolute inset-0 flex items-center justify-center text-sm text-neutral-400">
          {pageNumber}
        </span>
      )}
    </div>
  );
}

/** "3 / 24": type a page number and press Enter to jump there. */
function PageInput({
  current,
  total,
  onGo,
}: {
  current: number;
  total: number;
  onGo: (page: number) => void;
}) {
  const [draft, setDraft] = useState<string | null>(null);
  return (
    <form
      className="flex items-center gap-1.5 px-1 text-sm text-white/85 tabular-nums"
      onSubmit={(e) => {
        e.preventDefault();
        const n = Number(draft);
        if (Number.isInteger(n)) onGo(n);
        setDraft(null);
      }}
    >
      <label className="sr-only" htmlFor="profile-page">
        Page number
      </label>
      <input
        id="profile-page"
        inputMode="numeric"
        value={draft ?? String(current)}
        onFocus={(e) => {
          setDraft(String(current));
          e.target.select();
        }}
        onChange={(e) => setDraft(e.target.value.replace(/\D/g, '').slice(0, 4))}
        onBlur={() => setDraft(null)}
        className="h-9 w-11 rounded-md border border-white/15 bg-white/5 text-center text-white outline-none focus:border-white/50"
      />
      <span className="whitespace-nowrap">/ {total}</span>
    </form>
  );
}
