import { useEffect, useState } from 'react';

export type HistoryPoint = {
  /** Time the value arrived, in ms since the epoch. */
  t: number;
  value: number | null;
};

type History = { key: string; points: HistoryPoint[] };

const NO_POINTS: HistoryPoint[] = [];

/**
 * Keeps the values of one series over time. The history starts empty when the page opens,
 * because the API stores no history. One point is added each time `frame` changes.
 * The history resets when `resetKey` changes (for example, a new variable).
 */
export function useSeriesHistory(
  frame: unknown,
  value: number | null | undefined,
  resetKey: string,
  maxPoints = 900
): HistoryPoint[] {
  const [history, setHistory] = useState<History>({ key: resetKey, points: NO_POINTS });

  useEffect(() => {
    if (!frame || value === undefined) return;
    const point = { t: Date.now(), value };
    // Deferred, so the effect does not set state while it runs.
    queueMicrotask(() =>
      setHistory((prev) => ({
        key: resetKey,
        points: [...(prev.key === resetKey ? prev.points : NO_POINTS), point].slice(-maxPoints),
      }))
    );
    // `value` comes from `frame`; a new point is added only when the frame changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [frame, resetKey, maxPoints]);

  return history.key === resetKey ? history.points : NO_POINTS;
}
