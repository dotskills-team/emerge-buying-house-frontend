import type { PDFDocumentProxy } from 'pdfjs-dist/legacy/build/pdf.mjs';

type PdfJs = typeof import('pdfjs-dist/legacy/build/pdf.mjs');

export type { PDFDocumentProxy };

let pdfjsPromise: Promise<PdfJs> | null = null;
const documents = new Map<string, Promise<PDFDocumentProxy>>();

/**
 * pdf.js, loaded on first use only. The legacy build also runs on older Safari (iPhones), which
 * the PDF viewers built into phone browsers cannot be relied on for.
 */
function loadPdfJs(): Promise<PdfJs> {
  pdfjsPromise ??= import('pdfjs-dist/legacy/build/pdf.mjs').then((pdfjs) => {
    pdfjs.GlobalWorkerOptions.workerSrc = new URL(
      'pdfjs-dist/legacy/build/pdf.worker.min.mjs',
      import.meta.url,
    ).toString();
    return pdfjs;
  });
  return pdfjsPromise;
}

/**
 * Opens a PDF once per page view and shares it between its cover and the reader. Only the bytes
 * for the pages actually shown are downloaded (HTTP range requests), so the cover of an 8 MB
 * profile appears without fetching the whole file.
 */
export function loadPdf(url: string): Promise<PDFDocumentProxy> {
  let doc = documents.get(url);
  if (!doc) {
    doc = loadPdfJs().then((pdfjs) => {
      // Fonts, character maps and image decoders a PDF may need, from the same pdf.js version.
      const assets = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjs.version}`;
      return pdfjs.getDocument({
        url,
        disableAutoFetch: true,
        disableStream: true,
        rangeChunkSize: 64 * 1024,
        cMapUrl: `${assets}/cmaps/`,
        cMapPacked: true,
        standardFontDataUrl: `${assets}/standard_fonts/`,
        wasmUrl: `${assets}/wasm/`,
      }).promise;
    });
    // A failed load (e.g. offline) may be retried later.
    doc.catch(() => documents.delete(url));
    documents.set(url, doc);
  }
  return doc;
}

/** Device pixels per CSS pixel for crisp pages, capped so large screens stay fast. */
export const renderScale = () =>
  typeof window === 'undefined' ? 1 : Math.min(window.devicePixelRatio || 1, 2);
