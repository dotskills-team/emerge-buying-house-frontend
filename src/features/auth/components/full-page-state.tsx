import { AlertTriangle, Loader2 } from 'lucide-react';

export function FullPageLoader({ label }: { label: string }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="grid min-h-svh place-items-center bg-stone-wash px-5"
    >
      <div className="text-ink-soft flex items-center gap-3 text-sm">
        <Loader2 size={18} className="animate-spin text-navy-700" aria-hidden />
        {label}
      </div>
    </div>
  );
}

export function ErrorPanel({
  title = 'Something went wrong',
  message,
  onRetry,
  fullPage = false,
}: {
  title?: string;
  message?: string | null;
  onRetry: () => void;
  fullPage?: boolean;
}) {
  const panel = (
    <div role="alert" className="border-line max-w-md rounded-sm border bg-white p-8 text-center">
      <AlertTriangle size={28} className="mx-auto text-navy-700" aria-hidden />
      <h2 className="mt-4 font-serif text-xl text-navy-900">{title}</h2>
      {message && <p className="text-ink-soft mt-2 text-sm leading-relaxed">{message}</p>}
      <button
        type="button"
        onClick={onRetry}
        className="mt-6 rounded-sm bg-navy-900 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-navy-700"
      >
        Try again
      </button>
    </div>
  );
  return fullPage ? (
    <div className="grid min-h-svh place-items-center bg-stone-wash px-5">{panel}</div>
  ) : (
    panel
  );
}