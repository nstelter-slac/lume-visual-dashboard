const EMPTY = '—';

/** A short, readable number: plain for ordinary values, exponent form for very large or small. */
export function formatNumber(value: number | null | undefined): string {
  if (value === null || value === undefined || !Number.isFinite(value)) return EMPTY;
  if (value === 0) return '0';
  const abs = Math.abs(value);
  if (abs >= 1e5 || abs < 1e-3) return value.toExponential(3);
  return String(Number(value.toPrecision(5)));
}

export function withUnit(label: string, unit: string | undefined): string {
  return unit ? `${label} (${unit})` : label;
}
