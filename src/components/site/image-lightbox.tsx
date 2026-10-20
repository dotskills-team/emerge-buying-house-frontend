'use client';

import Image from 'next/image';
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type PointerEvent,
  type WheelEvent,
} from 'react';
import { ChevronLeft, ChevronRight, RotateCcw, X, ZoomIn, ZoomOut } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface LightboxItem {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  specs?: Array<{ label: string; value: string }>;
  /**
   * A static import or a remote image with its intrinsic size (the original file, for sharp zoom).
   * `preview` is a lighter copy shown at once while the original downloads.
   */
  image: { src: string; width: number; height: number; preview?: string };
}

const MIN = 1;
const MAX = 5;
const STEP = 0.6;

interface View {
  scale: number;
  x: number;
  y: number;
}

const clampNum = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

/**
 * Full-screen viewer with real zoom: mouse wheel (towards the pointer), double-click/tap, pinch on
 * touch screens, drag to pan, swipe to change image, and keyboard shortcuts (← → + − 0 Esc).
 * The original high-resolution file is loaded so zoomed detail stays sharp.
 */
export function ImageLightbox({
  items,
  index,
  onIndexChange,
  onClose,
}: {
  items: LightboxItem[];
  index: number;
  onIndexChange: (index: number) => void;
  onClose: () => void;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const [view, setView] = useState<View>({ scale: 1, x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const pointers = useRef(new Map<number, { x: number; y: number }>());
  const gesture = useRef<{
    startDist: number;
    startScale: number;
    lastX: number;
    lastY: number;
    startX: number;
    moved: boolean;
  } | null>(null);
  const lastTap = useRef(0);

  const item = items[index] ?? items[0]!;

  // Open as a modal (focus trap, Esc, inert page) on mount.
  useLayoutEffect(() => {
    const dialog = dialogRef.current;
    if (dialog && !dialog.open) dialog.showModal();
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  // Reset zoom when the image changes. Done in the change handler, not an effect.
  const goTo = useCallback(
    (next: number) => {
      setView({ scale: 1, x: 0, y: 0 });
      setLoaded(false);
      onIndexChange((next + items.length) % items.length);
    },
    [items.length, onIndexChange],
  );

  /** Largest translation that keeps the zoomed image covering the stage. */
  const clampView = useCallback(
    (v: View): View => {
      const stage = stageRef.current;
      if (!stage) return v;
      const sw = stage.clientWidth;
      const sh = stage.clientHeight;
      const ratio = item.image.width / item.image.height;
      // Size of the image at scale 1 ("contain" inside the stage).
      const fitW = Math.min(sw, sh * ratio);
      const fitH = fitW / ratio;
      const maxX = Math.max(0, (fitW * v.scale - sw) / 2);
      const maxY = Math.max(0, (fitH * v.scale - sh) / 2);
      const scale = clampNum(v.scale, MIN, MAX);
      return scale === 1
        ? { scale: 1, x: 0, y: 0 }
        : { scale, x: clampNum(v.x, -maxX, maxX), y: clampNum(v.y, -maxY, maxY) };
    },
    [item.image.width, item.image.height],
  );

  /** Zoom to `scale` keeping the stage point (px, py), relative to the centre, fixed. */
  const zoomAt = useCallback(
    (scale: number, px = 0, py = 0) => {
      setView((v) => {
        const s2 = clampNum(scale, MIN, MAX);
        const k = s2 / v.scale;
        return clampView({ scale: s2, x: px - (px - v.x) * k, y: py - (py - v.y) * k });
      });
    },
    [clampView],
  );

  const relative = (clientX: number, clientY: number) => {
    const r = stageRef.current?.getBoundingClientRect();
    return r
      ? { px: clientX - r.left - r.width / 2, py: clientY - r.top - r.height / 2 }
      : { px: 0, py: 0 };
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') goTo(index + 1);
      else if (e.key === 'ArrowLeft') goTo(index - 1);
      else if (e.key === '+' || e.key === '=') zoomAt(view.scale + STEP);
      else if (e.key === '-') zoomAt(view.scale - STEP);
      else if (e.key === '0') setView({ scale: 1, x: 0, y: 0 });
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [goTo, index, view.scale, zoomAt]);

  // Keep the view valid when the window is resized.
  useEffect(() => {
    const onResize = () => setView((v) => clampView(v));
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [clampView]);

  function onWheel(e: WheelEvent<HTMLDivElement>) {
    const { px, py } = relative(e.clientX, e.clientY);
    zoomAt(view.scale * (e.deltaY < 0 ? 1.15 : 1 / 1.15), px, py);
  }

  function onPointerDown(e: PointerEvent<HTMLDivElement>) {
    e.currentTarget.setPointerCapture(e.pointerId);
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    const pts = [...pointers.current.values()];
    if (pts.length === 2) {
      const [a, b] = pts as [{ x: number; y: number }, { x: number; y: number }];
      gesture.current = {
        startDist: Math.hypot(a.x - b.x, a.y - b.y),
        startScale: view.scale,
        lastX: (a.x + b.x) / 2,
        lastY: (a.y + b.y) / 2,
        startX: (a.x + b.x) / 2,
        moved: true,
      };
    } else {
      gesture.current = {
        startDist: 0,
        startScale: view.scale,
        lastX: e.clientX,
        lastY: e.clientY,
        startX: e.clientX,
        moved: false,
      };
    }
    setDragging(true);
  }

  function onPointerMove(e: PointerEvent<HTMLDivElement>) {
    if (!pointers.current.has(e.pointerId) || !gesture.current) return;
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    const pts = [...pointers.current.values()];
    const g = gesture.current;
    if (pts.length === 2 && g.startDist > 0) {
      const [a, b] = pts as [{ x: number; y: number }, { x: number; y: number }];
      const dist = Math.hypot(a.x - b.x, a.y - b.y);
      const midX = (a.x + b.x) / 2;
      const midY = (a.y + b.y) / 2;
      const { px, py } = relative(midX, midY);
      zoomAt(g.startScale * (dist / g.startDist), px, py);
      g.lastX = midX;
      g.lastY = midY;
      return;
    }
    const dx = e.clientX - g.lastX;
    const dy = e.clientY - g.lastY;
    g.lastX = e.clientX;
    g.lastY = e.clientY;
    if (Math.abs(e.clientX - g.startX) > 6) g.moved = true;
    if (view.scale > 1) setView((v) => clampView({ ...v, x: v.x + dx, y: v.y + dy }));
  }

  function onPointerUp(e: PointerEvent<HTMLDivElement>) {
    const g = gesture.current;
    pointers.current.delete(e.pointerId);
    if (pointers.current.size > 0) return; // still pinching with one finger down
    setDragging(false);
    gesture.current = null;
    if (!g) return;

    const swipe = e.clientX - g.startX;
    if (view.scale === 1 && g.moved && Math.abs(swipe) > 60) {
      goTo(index + (swipe < 0 ? 1 : -1));
      return;
    }
    if (!g.moved) {
      // Double tap / double click toggles zoom at that point.
      const now = Date.now();
      if (now - lastTap.current < 300) {
        const { px, py } = relative(e.clientX, e.clientY);
        if (view.scale > 1) setView({ scale: 1, x: 0, y: 0 });
        else zoomAt(2.5, px, py);
        lastTap.current = 0;
      } else {
        lastTap.current = now;
      }
    }
  }

  const control =
    'flex size-11 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition-colors hover:bg-white/20 disabled:opacity-40';

  return (
    <dialog
      ref={dialogRef}
      aria-label={`${item.title}, image ${index + 1} of ${items.length}`}
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      className="bg-ink-deep/95 fixed inset-0 m-0 h-svh max-h-none w-screen max-w-none p-0 text-white backdrop:bg-black/80"
    >
      <div className="flex h-full flex-col lg:flex-row">
        {/* Stage */}
        <div className="relative flex min-h-0 flex-1 flex-col">
          <div className="flex items-center justify-between gap-3 p-3 sm:p-4">
            <p className="text-sm text-white/70 tabular-nums" aria-live="polite">
              {index + 1} / {items.length}
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => zoomAt(view.scale - STEP)}
                disabled={view.scale <= MIN}
                aria-label="Zoom out"
                className={control}
              >
                <ZoomOut size={18} aria-hidden />
              </button>
              <span className="w-12 text-center text-sm tabular-nums" aria-label="Zoom level">
                {Math.round(view.scale * 100)}%
              </span>
              <button
                type="button"
                onClick={() => zoomAt(view.scale + STEP)}
                disabled={view.scale >= MAX}
                aria-label="Zoom in"
                className={control}
              >
                <ZoomIn size={18} aria-hidden />
              </button>
              <button
                type="button"
                onClick={() => setView({ scale: 1, x: 0, y: 0 })}
                disabled={view.scale === 1}
                aria-label="Reset zoom"
                className={cn(control, 'hidden sm:flex')}
              >
                <RotateCcw size={18} aria-hidden />
              </button>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close viewer"
                className={cn(control, 'text-fg ml-1 bg-white hover:bg-white/90')}
              >
                <X size={20} aria-hidden />
              </button>
            </div>
          </div>

          <div
            ref={stageRef}
            className={cn(
              'relative min-h-0 flex-1 touch-none overflow-hidden select-none',
              view.scale > 1 ? (dragging ? 'cursor-grabbing' : 'cursor-grab') : 'cursor-zoom-in',
            )}
            onWheel={onWheel}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
          >
            {!loaded &&
              (item.image.preview ? (
                // eslint-disable-next-line @next/next/no-img-element -- same box and transform as the original below
                <img
                  key={`${item.id}-preview`}
                  src={item.image.preview}
                  width={item.image.width}
                  height={item.image.height}
                  alt=""
                  draggable={false}
                  className="absolute inset-0 m-auto max-h-full max-w-full object-contain"
                  style={{
                    transform: `translate3d(${view.x}px, ${view.y}px, 0) scale(${view.scale})`,
                  }}
                />
              ) : (
                <div aria-hidden className="absolute inset-0 flex items-center justify-center">
                  <span className="size-10 animate-spin rounded-full border-2 border-white/20 border-t-white" />
                </div>
              ))}
            {/* eslint-disable-next-line @next/next/no-img-element -- the original file is needed for sharp zoom */}
            <img
              key={item.id}
              src={item.image.src}
              width={item.image.width}
              height={item.image.height}
              alt={item.title}
              draggable={false}
              onLoad={() => setLoaded(true)}
              className={cn(
                'absolute inset-0 m-auto max-h-full max-w-full object-contain will-change-transform',
                !dragging && 'transition-transform duration-200 ease-out',
                loaded ? 'opacity-100' : 'opacity-0',
              )}
              style={{ transform: `translate3d(${view.x}px, ${view.y}px, 0) scale(${view.scale})` }}
            />
            <button
              type="button"
              onClick={() => goTo(index - 1)}
              aria-label="Previous image"
              className={cn(control, 'absolute top-1/2 left-3 -translate-y-1/2 sm:left-5')}
            >
              <ChevronLeft size={22} aria-hidden />
            </button>
            <button
              type="button"
              onClick={() => goTo(index + 1)}
              aria-label="Next image"
              className={cn(control, 'absolute top-1/2 right-3 -translate-y-1/2 sm:right-5')}
            >
              <ChevronRight size={22} aria-hidden />
            </button>
          </div>

          <p className="hidden px-4 py-2 text-center text-xs text-white/50 sm:block">
            Scroll or double-click to zoom · drag to move · ← → to browse
          </p>

          {/* Thumbnails */}
          <ul className="flex gap-2 overflow-x-auto p-3 sm:p-4" aria-label="All images">
            {items.map((it, i) => (
              <li key={it.id} className="shrink-0">
                <button
                  type="button"
                  onClick={() => goTo(i)}
                  aria-label={`Show ${it.title}`}
                  aria-current={i === index}
                  className={cn(
                    'relative block h-14 w-20 overflow-hidden rounded-lg ring-2 transition sm:h-16 sm:w-24',
                    i === index ? 'ring-white' : 'opacity-60 ring-transparent hover:opacity-100',
                  )}
                >
                  <Image src={it.image.src} alt="" fill sizes="96px" className="object-cover" />
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Details */}
        <aside className="max-h-[38svh] shrink-0 overflow-y-auto border-t border-white/10 p-5 sm:p-6 lg:max-h-none lg:w-96 lg:border-t-0 lg:border-l">
          {item.subtitle && (
            <p className="text-nav-active text-xs font-semibold tracking-[0.2em] uppercase">
              {item.subtitle}
            </p>
          )}
          <h2 className="mt-2 text-xl font-semibold sm:text-2xl">{item.title}</h2>
          {item.description && <p className="mt-3 text-sm text-white/75">{item.description}</p>}
          {item.specs && (
            <dl className="mt-6 divide-y divide-white/10 rounded-xl border border-white/10">
              {item.specs.map((s) => (
                <div key={s.label} className="flex justify-between gap-4 px-4 py-3 text-sm">
                  <dt className="text-white/60">{s.label}</dt>
                  <dd className="text-right font-medium">{s.value}</dd>
                </div>
              ))}
            </dl>
          )}
        </aside>
      </div>
    </dialog>
  );
}
