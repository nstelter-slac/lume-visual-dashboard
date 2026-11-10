import type { ArrayOutput, Output, ParticlesOutput, ScalarOutput } from '../../api/types';
import type { HistoryPoint } from '../../hooks/useSeriesHistory';
import type { ChartId, PhaseSpaceCoord } from './charts';
import ArrayTable from './ArrayTable';
import Image2D from './Image2D';
import Line1D from './Line1D';
import ParticleStatsList from './ParticleStatsList';
import PhaseSpace2D from './PhaseSpace2D';
import PlotEmpty from './PlotEmpty';
import ScalarVsScalar from './ScalarVsScalar';
import ScalarList from './ScalarList';
import TimeSeries from './TimeSeries';

type VariablePlotProps = {
  chart: ChartId;
  /** The variable to plot. */
  variableId: string;
  /** The array used as the x axis of `line-vs-s`. */
  axisId?: string;
  /** The coordinates of `phase-space-2d`. */
  phaseSpace?: { x: PhaseSpaceCoord; y: PhaseSpaceCoord };
  /** The scalar on the x axis of `scalar-vs-scalar`. */
  xScalarId?: string;
  /** The past values of `xScalarId`. */
  xHistory?: HistoryPoint[];
  /** The beam summary value of `particle-stats-time-series`. */
  stat?: string;
  /** The past values of `variableId`, for the time-series charts. */
  history?: HistoryPoint[];
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
const VariablePlot = ({
  chart,
  variableId,
  axisId,
  phaseSpace = { x: 'x', y: 'px' },
  stat,
  xScalarId,
  xHistory = [],
  history = [],
  outputs,
}: VariablePlotProps) => {
  if (chart === 'scalar-vs-scalar') {
    const unitOf = (id?: string) => {
      const o = id ? outputs?.[id] : undefined;
      return o?.kind === 'scalar' ? o.unit : undefined;
    };
    if (!xScalarId) return <PlotEmpty>Pick a scalar for the x axis.</PlotEmpty>;
    return (
      <ScalarVsScalar
        xName={xScalarId}
        yName={variableId}
        xUnit={unitOf(xScalarId)}
        yUnit={unitOf(variableId)}
        xPoints={xHistory}
        yPoints={history}
      />
    );
  }

  if (chart === 'scalar-time-series') {
    const scalar = outputs?.[variableId];
    return (
      <TimeSeries
        points={history}
        name={variableId}
        unit={scalar?.kind === 'scalar' ? scalar.unit : undefined}
      />
    );
  }

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
    case 'phase-space-2d':
      return output.kind === 'particles' ? (
        <PhaseSpace2D
          key={variableId}
          particles={output as ParticlesOutput}
          xKey={phaseSpace.x}
          yKey={phaseSpace.y}
        />
      ) : null;
    case 'particle-stats-time-series':
      if (output.kind !== 'particles') return null;
      return (
        <TimeSeries
          points={history}
          name={stat ?? ''}
          unit={stat ? (output as ParticlesOutput).stats_units[stat] : undefined}
        />
      );
    case 'particle-stats-list':
      return output.kind === 'particles' ? (
        <ParticleStatsList particles={output as ParticlesOutput} />
      ) : null;
  }
};

export default VariablePlot;
