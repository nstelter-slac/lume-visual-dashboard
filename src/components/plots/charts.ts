import type { Output } from '../../api/types';

export type ChartId =
  | 'scalar-list'
  | 'line-vs-index'
  | 'line-vs-s'
  | 'image-2d'
  | 'array-table'
  | 'particle-stats-list';

export interface ChartInfo {
  id: ChartId;
  label: string;
}

const CHARTS: Record<ChartId, ChartInfo> = {
  'scalar-list': { id: 'scalar-list', label: 'List of values' },
  'line-vs-index': { id: 'line-vs-index', label: 'Line vs index' },
  'line-vs-s': { id: 'line-vs-s', label: 'Line vs s (or another array)' },
  'image-2d': { id: 'image-2d', label: '2D image' },
  'array-table': { id: 'array-table', label: 'Table / matrix' },
  'particle-stats-list': { id: 'particle-stats-list', label: 'Beam summary values' },
};

/** The part of a variable that decides its charts. Both `OutputInfo` and `Output` fit. */
export type VariableShape = Pick<Output, 'kind'> & {
  id?: string;
  shape?: number[] | null;
};

/** Arrays that can be the x axis of a 1D variable: other 1D arrays with the same length. */
export function axisCandidates(variable: VariableShape, all: VariableShape[]): string[] {
  if (variable.kind !== 'array' || variable.shape?.length !== 1) return [];
  const ids = all
    .filter(
      (o) =>
        o.kind === 'array' &&
        o.id !== variable.id &&
        o.shape?.length === 1 &&
        o.shape[0] === variable.shape?.[0]
    )
    .map((o) => o.id as string);
  // Position along the beamline first: `s`, `comb:s`, `s_ele`.
  const isS = (id: string) => /(^|:)s(_ele)?$/.test(id);
  return [...ids.filter(isS), ...ids.filter((id) => !isS(id))];
}

/**
 * The charts that can show a variable of this kind. The first one is the default.
 * Arrays with more than 2 dimensions, and `value` outputs (enums, strings), have no chart.
 */
export function chartsForVariable(variable: VariableShape, all: VariableShape[] = []): ChartInfo[] {
  switch (variable.kind) {
    case 'scalar':
      return [CHARTS['scalar-list']];
    case 'array': {
      const dims = variable.shape?.length ?? 0;
      if (dims === 1) {
        const hasAxis = axisCandidates(variable, all).length > 0;
        return [
          ...(hasAxis ? [CHARTS['line-vs-s']] : []),
          CHARTS['line-vs-index'],
          CHARTS['array-table'],
        ];
      }
      return dims === 2 ? [CHARTS['image-2d'], CHARTS['array-table']] : [];
    }
    case 'particles':
      return [CHARTS['particle-stats-list']];
    case 'value':
      return [];
  }
}
