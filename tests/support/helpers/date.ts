// Deterministic date helpers for local-only app (no TZ conversions)

export function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

export function iso(date: Date): string {
  return date.toISOString().slice(0, 10);
}
