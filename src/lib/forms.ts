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
