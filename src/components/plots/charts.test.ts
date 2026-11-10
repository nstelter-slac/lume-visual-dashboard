import { describe, expect, it } from 'vitest';
import { axisCandidates, chartsForVariable } from './charts';

const ids = (
  v: Parameters<typeof chartsForVariable>[0],
  all: Parameters<typeof chartsForVariable>[0][] = []
) => chartsForVariable(v, all).map((c) => c.id);

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
    expect(ids({ kind: 'particles' })).toEqual(['phase-space-2d', 'particle-stats-list']);
    expect(ids({ kind: 'value' })).toEqual([]);
  });
});

describe('1D arrays and x axes', () => {
  const all = [
    { id: 'comb:x.beta', kind: 'array' as const, shape: [11] },
    { id: 'comb:x', kind: 'array' as const, shape: [11] },
    { id: 'comb:s', kind: 'array' as const, shape: [11] },
    { id: 's_ele', kind: 'array' as const, shape: [8] },
  ];

  it('offers line vs s only when another array of the same length exists', () => {
    expect(ids(all[0], all)).toEqual(['line-vs-s', 'line-vs-index', 'array-table']);
    expect(ids(all[3], all)).toEqual(['line-vs-index', 'array-table']);
  });

  it('lists position arrays first as x axis candidates', () => {
    expect(axisCandidates(all[0], all)).toEqual(['comb:s', 'comb:x']);
  });

  it('offers the image chart for 2D arrays', () => {
    expect(ids({ kind: 'array', shape: [4, 4] })).toEqual(['image-2d', 'array-table']);
  });
});
