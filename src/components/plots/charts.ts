import type { Output } from '../../api/types';

export type ChartId = 'scalar-list' | 'array-table' | 'particle-stats-list';

export interface ChartInfo {
  id: ChartId;
  label: string;
}

const CHARTS: Record<ChartId, ChartInfo> = {
  'scalar-list': { id: 'scalar-list', label: 'List of values' },
  'array-table': { id: 'array-table', label: 'Table / matrix' },
  'particle-stats-list': { id: 'particle-stats-list', label: 'Beam summary values' },
};

/** The part of a variable that decides its charts. Both `OutputInfo` and `Output` fit. */
export type VariableShape = Pick<Output, 'kind'> & { shape?: number[] | null };

/**
 * The charts that can show a variable of this kind. The first one is the default.
 * Arrays with more than 2 dimensions, and `value` outputs (enums, strings), have no chart.
 */
export function chartsForVariable(variable: VariableShape): ChartInfo[] {
  switch (variable.kind) {
    case 'scalar':
      return [CHARTS['scalar-list']];
    case 'array': {
      const dims = variable.shape?.length ?? 0;
      return dims === 1 || dims === 2 ? [CHARTS['array-table']] : [];
    }
    case 'particles':
      return [CHARTS['particle-stats-list']];
    case 'value':
      return [];
  }
}
