import { describe, expect, it } from 'vitest';
import { chartsForVariable } from './charts';

const ids = (v: Parameters<typeof chartsForVariable>[0]) => chartsForVariable(v).map((c) => c.id);

describe('chartsForVariable', () => {
  it('gives a scalar the list chart', () => {
    expect(ids({ kind: 'scalar' })).toContain('scalar-list');
  });

  it('gives 1D and 2D arrays a table, and other arrays nothing', () => {
    expect(ids({ kind: 'array', shape: [8] })).toContain('array-table');
    expect(ids({ kind: 'array', shape: [4, 4] })).toContain('array-table');
    expect(ids({ kind: 'array', shape: [8, 6, 6] })).toEqual([]);
    expect(ids({ kind: 'array', shape: null })).toEqual([]);
  });

  it('gives particles the summary list, and plain values nothing', () => {
    expect(ids({ kind: 'particles' })).toContain('particle-stats-list');
    expect(ids({ kind: 'value' })).toEqual([]);
  });
});
