import type { FieldValues, Path, UseFormSetError } from 'react-hook-form';
import { ApiError } from './http';

/**
 * Puts the backend's per-field validation messages on the matching form fields.
 * Returns true when at least one field error was applied (so the caller can skip a generic alert).
 */
export function applyFieldErrors<T extends FieldValues>(
  err: unknown,
  setError: UseFormSetError<T>,
  fields: ReadonlyArray<Path<T>>,
): boolean {
  if (!(err instanceof ApiError)) return false;
  let applied = false;
  for (const { path, message } of err.fieldErrors) {
    const field = fields.find((f) => f === path);
    if (field) {
      setError(field, { type: 'server', message });
      applied = true;
    }
  }
  return applied;
}

/** Scrolls to and focuses the first field marked invalid, once React has rendered the errors. */
export function focusFirstInvalid(root: ParentNode = document) {
  requestAnimationFrame(() => {
    const el = root.querySelector<HTMLElement>('[aria-invalid="true"]');
    if (!el) return;
    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    el.focus({ preventScroll: true });
  });
}

/** The backend's per-field messages as a plain map, for forms that keep their own state. */
export function serverFieldErrors(err: unknown): Record<string, string> {
  if (!(err instanceof ApiError)) return {};
  return Object.fromEntries(err.fieldErrors.map((f) => [f.path.split('.')[0]!, f.message]));
}
