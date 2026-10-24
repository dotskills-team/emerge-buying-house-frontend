'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { renderScale, type PDFDocumentProxy } from '../pdf';

/**
 * Draws one PDF page at `width` CSS pixels, sharp on high-density screens. A new size re-renders;
 * leaving (or a size change mid-render) cancels the work in progress. Fades in once drawn.
 */
export function PdfPageCanvas({
  doc,
  pageNumber,
  width,
  label,
  className,
  onRendered,
  onSize,
}: {
  doc: PDFDocumentProxy;
  pageNumber: number;
  width: number;
  label: string;
  className?: string;
  onRendered?: () => void;
  /** The page's size in PDF points, once known. */
  onSize?: (size: { w: number; h: number }) => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [drawn, setDrawn] = useState(false);
  const callbacks = useRef({ onRendered, onSize });
  useLayoutEffect(() => {
    callbacks.current = { onRendered, onSize };
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || width <= 0) return;
    let cancelled = false;
    let task: { cancel: () => void; promise: Promise<void> } | null = null;

    void (async () => {
      try {
        const page = await doc.getPage(pageNumber);
        if (cancelled) return;
        const base = page.getViewport({ scale: 1 });
        callbacks.current.onSize?.({ w: base.width, h: base.height });
        const viewport = page.getViewport({ scale: (width / base.width) * renderScale() });
        // Draw off-screen first, so a re-render (e.g. zoom) never flashes an empty page.
        const buffer = document.createElement('canvas');
        buffer.width = Math.floor(viewport.width);
        buffer.height = Math.floor(viewport.height);
        task = page.render({ canvas: buffer, viewport });
        await task.promise;
        if (cancelled) return;
        canvas.width = buffer.width;
        canvas.height = buffer.height;
        canvas.getContext('2d')?.drawImage(buffer, 0, 0);
        buffer.width = 0; // release the buffer's memory right away
        setDrawn(true);
        callbacks.current.onRendered?.();
      } catch (err) {
        // Cancelling a render rejects its promise; anything else leaves the placeholder visible.
        if ((err as { name?: string }).name !== 'RenderingCancelledException' && !cancelled) {
          console.error(`Could not draw page ${pageNumber}:`, err);
        }
      }
    })();

    return () => {
      cancelled = true;
      task?.cancel();
    };
  }, [doc, pageNumber, width]);

  // Free the canvas memory when the page leaves the screen (it is unmounted then).
  useEffect(() => {
    const canvas = canvasRef.current;
    return () => {
      if (canvas) {
        canvas.width = 0;
        canvas.height = 0;
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      role="img"
      aria-label={label}
      className={cn(
        'block h-full w-full transition-opacity duration-300',
        drawn ? 'opacity-100' : 'opacity-0',
        className,
      )}
    />
  );
}
