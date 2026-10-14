'use client';

import { useHealth } from '@/hooks/use-health';

export function ApiStatus() {
  const { data, isPending, isError } = useHealth();

  const label = isPending ? 'Checking API…' : isError ? 'API unreachable' : 'API online';
  const dot = isPending ? 'bg-navy-500' : isError ? 'bg-red-400' : 'bg-emerald-400';

  return (
    <p className="text-navy-200 flex items-center gap-2 text-xs" role="status" aria-live="polite">
      <span className={`h-2 w-2 rounded-full ${dot}`} aria-hidden />
      {label}
      {data && <span className="text-navy-500">(database {data.database})</span>}
    </p>
  );
}
