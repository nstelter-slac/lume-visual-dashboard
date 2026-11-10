import type { Output } from '../../api/types';

export type ChartId =
  | 'scalar-time-series'
  | 'scalar-list'
  | 'line-vs-index'
  | 'line-vs-s'
  | 'image-2d'
  | 'array-table'
  | 'phase-space-2d'
  | 'particle-stats-list'
  | 'particle-stats-time-series';

export interface ChartInfo {
  id: ChartId;
  label: string;
}

const CHARTS: Record<ChartId, ChartInfo> = {
  'scalar-time-series': { id: 'scalar-time-series', label: 'Value over time' },
  'scalar-list': { id: 'scalar-list', label: 'List of values' },
  'line-vs-index': { id: 'line-vs-index', label: 'Line vs index' },
  'line-vs-s': { id: 'line-vs-s', label: 'Line vs s (or another array)' },
  'image-2d': { id: 'image-2d', label: '2D image' },
  'array-table': { id: 'array-table', label: 'Table / matrix' },
  'phase-space-2d': { id: 'phase-space-2d', label: '2D phase space' },
  'particle-stats-time-series': {
    id: 'particle-stats-time-series',
    label: 'Beam summary value over time',
  },
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
      return [CHARTS['scalar-time-series'], CHARTS['scalar-list']];
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
      return [
        CHARTS['phase-space-2d'],
        CHARTS['particle-stats-list'],
        CHARTS['particle-stats-time-series'],
      ];
    case 'value':
      return [];
  }
}

/** The particle coordinates a phase-space plot can use. */
export const PHASE_SPACE_COORDS = ['x', 'px', 'y', 'py', 'z', 'pz'] as const;
export type PhaseSpaceCoord = (typeof PHASE_SPACE_COORDS)[number];
