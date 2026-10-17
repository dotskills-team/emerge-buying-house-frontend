'use client';

import { useEffect, useRef } from 'react';
import { Button } from './button';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  tone?: 'default' | 'danger';
  pending?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

/** Built on the native <dialog>, which provides focus trapping, Esc handling and inertness. */
export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel,
  tone = 'default',
  pending = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      aria-labelledby="confirm-dialog-title"
      onCancel={(e) => {
        e.preventDefault();
        if (!pending) onCancel();
      }}
      onClick={(e) => {
        // The inner div fills the dialog, so a click on the dialog element itself is a backdrop click.
        if (e.target === ref.current && !pending) onCancel();
      }}
      className="border-border bg-surface text-fg m-auto max-h-[calc(100svh-2rem)] w-[min(28rem,calc(100vw-2rem))] overflow-y-auto rounded-lg border p-0 shadow-lg"
    >
      <div className="p-6">
        <h2 id="confirm-dialog-title" className="text-h3">
          {title}
        </h2>
        <p className="text-fg-muted mt-2 text-sm">{message}</p>
        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end sm:gap-3">
          <Button variant="secondary" onClick={onCancel} disabled={pending}>
            Cancel
          </Button>
          <Button
            variant={tone === 'danger' ? 'danger' : 'primary'}
            onClick={onConfirm}
            loading={pending}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </dialog>
  );
}
