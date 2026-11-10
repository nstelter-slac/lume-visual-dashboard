import type { ArrayOutput, Output, ParticlesOutput, ScalarOutput } from '../../api/types';
import type { ChartId } from './charts';
import ArrayTable from './ArrayTable';
import Image2D from './Image2D';
import Line1D from './Line1D';
import ParticleStatsList from './ParticleStatsList';
import PlotEmpty from './PlotEmpty';
import ScalarList from './ScalarList';

type VariablePlotProps = {
  chart: ChartId;
  /** The variable to plot. */
  variableId: string;
  /** The array used as the x axis of `line-vs-s`. */
  axisId?: string;
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
const VariablePlot = ({ chart, variableId, axisId, outputs }: VariablePlotProps) => {
  if (!outputs) return <PlotEmpty>Waiting for the first values…</PlotEmpty>;

  if (chart === 'scalar-list') return <ScalarList scalars={scalarsOf(outputs)} />;

  const output = outputs[variableId];
  if (!output) return <PlotEmpty>No value for {variableId}.</PlotEmpty>;

  const array = output.kind === 'array' ? (output as ArrayOutput) : undefined;

  switch (chart) {
    case 'line-vs-index':
      return array ? <Line1D id={variableId} y={array} /> : null;
    case 'line-vs-s': {
      const axis = axisId ? outputs[axisId] : undefined;
      if (!array) return null;
      if (axis?.kind !== 'array') return <PlotEmpty>Pick an x axis array.</PlotEmpty>;
      return <Line1D id={variableId} y={array} x={axis as ArrayOutput} xId={axisId} />;
    }
    case 'image-2d':
      return array ? <Image2D image={array} /> : null;
    case 'array-table':
      return array ? <ArrayTable array={array} /> : null;
    case 'particle-stats-list':
      return output.kind === 'particles' ? (
        <ParticleStatsList particles={output as ParticlesOutput} />
      ) : null;
  }
};

export default VariablePlot;
