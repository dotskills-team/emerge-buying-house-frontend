'use client';

import { useEffect, useRef, useState } from 'react';
import { FileText } from 'lucide-react';
import { cn } from '@/lib/utils';
import { loadPdf, type PDFDocumentProxy } from '../pdf';
import { PdfPageCanvas } from './pdf-page-canvas';

/**
 * The profile's first page as its cover, drawn when the card comes near the screen. A branded
 * placeholder shows until then (and stays if the PDF cannot be read).
 */
export function ProfileCover({
  url,
  title,
  onPageCount,
  className,
}: {
  url: string;
  title: string;
  onPageCount?: (pages: number) => void;
  className?: string;
}) {
  const boxRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [width, setWidth] = useState(0);
  const [doc, setDoc] = useState<PDFDocumentProxy | null>(null);
  const [drawn, setDrawn] = useState(false);
  const onPageCountRef = useRef(onPageCount);
  useEffect(() => {
    onPageCountRef.current = onPageCount;
  });

  useEffect(() => {
    const el = boxRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { rootMargin: '300px 0px' },
    );
    io.observe(el);
    const ro = new ResizeObserver(() => setWidth(Math.round(el.clientWidth)));
    ro.observe(el);
    return () => {
      io.disconnect();
      ro.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!visible) return;
    let active = true;
    loadPdf(url)
      .then((d) => {
        if (!active) return;
        setDoc(d);
        onPageCountRef.current?.(d.numPages);
      })
      .catch(() => {
        // The placeholder stays; the reader shows its own error with a direct link.
      });
    return () => {
      active = false;
    };
  }, [visible, url]);

  return (
    <div ref={boxRef} className={cn('bg-surface-muted relative overflow-hidden', className)}>
      {!drawn && (
        <div className="bg-brand-weave absolute inset-0 flex flex-col items-center justify-center gap-3">
          <FileText aria-hidden className="text-gold-light/70 size-12" strokeWidth={1.2} />
          {visible && (
            <span
              aria-hidden
              className="h-1 w-16 animate-pulse rounded-full bg-white/25 motion-reduce:animate-none"
            />
          )}
        </div>
      )}
      {doc && width > 0 && (
        <PdfPageCanvas
          doc={doc}
          pageNumber={1}
          width={width}
          label={`Cover of ${title}`}
          className="absolute inset-x-0 top-0 h-auto"
          onRendered={() => setDrawn(true)}
        />
      )}
    </div>
  );
}
