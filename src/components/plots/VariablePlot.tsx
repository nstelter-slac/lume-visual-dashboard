import type { ArrayOutput, Output, ParticlesOutput, ScalarOutput } from '../../api/types';
import type { ChartId } from './charts';
import ArrayTable from './ArrayTable';
import ParticleStatsList from './ParticleStatsList';
import PlotEmpty from './PlotEmpty';
import ScalarList from './ScalarList';

type VariablePlotProps = {
  chart: ChartId;
  /** The variable to plot. */
  variableId: string;
  /** The latest values by id. `undefined` until the first values arrive. */
  outputs: Record<string, Output> | undefined;
};

const scalarsOf = (outputs: Record<string, Output>) =>
  Object.fromEntries(
    Object.entries(outputs).filter((entry): entry is [string, ScalarOutput] => {
      return entry[1].kind === 'scalar';
    })
  );

/** Draws one variable with the chart type that was picked. */
const VariablePlot = ({ chart, variableId, outputs }: VariablePlotProps) => {
  if (!outputs) return <PlotEmpty>Waiting for the first values…</PlotEmpty>;

  if (chart === 'scalar-list') return <ScalarList scalars={scalarsOf(outputs)} />;

  const output = outputs[variableId];
  if (!output) return <PlotEmpty>No value for {variableId}.</PlotEmpty>;

  switch (chart) {
    case 'array-table':
      return output.kind === 'array' ? <ArrayTable array={output as ArrayOutput} /> : null;
    case 'particle-stats-list':
      return output.kind === 'particles' ? (
        <ParticleStatsList particles={output as ParticlesOutput} />
      ) : null;
  }
};

export default VariablePlot;
