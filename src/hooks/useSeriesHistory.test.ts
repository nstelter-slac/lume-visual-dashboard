import { act, renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { useSeriesHistory } from './useSeriesHistory';

describe('useSeriesHistory', () => {
  it('starts empty, adds one point for each new frame, and resets with the key', async () => {
    const frameA = {};
    const frameB = {};
    const { result, rerender } = renderHook(
      ({ frame, value, key }) => useSeriesHistory(frame, value, key),
      {
        initialProps: {
          frame: undefined as unknown,
          value: undefined as number | undefined,
          key: 'a',
        },
      }
    );
    expect(result.current).toEqual([]);

    await act(async () => rerender({ frame: frameA, value: 1, key: 'a' }));
    await act(async () => rerender({ frame: frameA, value: 1, key: 'a' }));
    expect(result.current.map((p) => p.value)).toEqual([1]);

    await act(async () => rerender({ frame: frameB, value: 2, key: 'a' }));
    expect(result.current.map((p) => p.value)).toEqual([1, 2]);

    await act(async () => rerender({ frame: undefined, value: undefined, key: 'b' }));
    expect(result.current).toEqual([]);
  });
});
