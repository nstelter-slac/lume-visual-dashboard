import { useState } from 'react';
import { InlineNotification, Select, SelectItem, Stack, Tag } from '@carbon/react';

import type { ConfigResponse, OutputKind } from '../api/types';
import { modelStreamTiming } from '../hooks/useModelStream';
import { useSeriesHistory } from '../hooks/useSeriesHistory';
import { useLiveStream } from '../hooks/useLiveStream';
import { useThrottledValue } from '../hooks/useThrottledValue';
import Panel from './Panel';
import {
  axisCandidates,
  chartsForVariable,
  PHASE_SPACE_COORDS,
  type PhaseSpaceCoord,
  type ChartId,
} from './plots/charts';
import VariablePlot from './plots/VariablePlot';

type PlotPanelProps = {
  name?: string;
  config: ConfigResponse;
};

type KindFilter = OutputKind | 'all';

const KIND_LABELS: Record<KindFilter, string> = {
  all: 'All variables',
  scalar: 'Scalar',
  array: 'NDVariable (array)',
  particles: 'Particle group',
  value: 'Other values',
};

/** One plot with its own pickers and live stream. */
const PlotPanel = ({ name, config }: PlotPanelProps) => {
  const [kind, setKind] = useState<KindFilter>('all');
  const [variableId, setVariableId] = useState('');
  const [chartChoice, setChartChoice] = useState<ChartId>();
  const [phaseX, setPhaseX] = useState<PhaseSpaceCoord>('x');
  const [phaseY, setPhaseY] = useState<PhaseSpaceCoord>('px');
  const [statChoice, setStatChoice] = useState<string>();
  const [xScalarChoice, setXScalarChoice] = useState<string>();
  const [axisChoice, setAxisChoice] = useState<string>();

  const variables = config.outputs.filter((output) => kind === 'all' || output.kind === kind);
  const variable = config.outputs.find((output) => output.id === variableId);

  const charts = variable ? chartsForVariable(variable, config.outputs) : [];
  // A variable change can leave the old chart choice invalid; fall back to the first fit.
  const chart = charts.find((c) => c.id === chartChoice) ?? charts[0];

  const axes = variable ? axisCandidates(variable, config.outputs) : [];
  const axisId =
    chart?.id === 'line-vs-s'
      ? axisChoice && axes.includes(axisChoice)
        ? axisChoice
        : axes[0]
      : undefined;

  const otherScalars = config.outputs.filter((o) => o.kind === 'scalar' && o.id !== variable?.id);
  const xScalarId =
    chart?.id === 'scalar-vs-scalar'
      ? (otherScalars.find((o) => o.id === xScalarChoice)?.id ?? otherScalars[0]?.id)
      : undefined;

  // useLiveStream keys on the content, so a fresh array each render is fine.
  const outputIds =
    variable && chart
      ? chart.id === 'scalar-list'
        ? config.outputs.filter((o) => o.kind === 'scalar').map((o) => o.id)
        : [variable.id, ...(axisId ? [axisId] : []), ...(xScalarId ? [xScalarId] : [])]
      : [];

  const live = useLiveStream(name, { outputs: outputIds });
  const frame = useThrottledValue(live.frame, modelStreamTiming.displayIntervalMs);

  const sampled = variable ? frame?.outputs[variable.id] : undefined;
  const statNames = sampled?.kind === 'particles' ? Object.keys(sampled.stats) : [];
  const stat = statChoice && statNames.includes(statChoice) ? statChoice : statNames[0];
  const sampleValue =
    sampled?.kind === 'scalar'
      ? sampled.value
      : sampled?.kind === 'particles' && chart?.id === 'particle-stats-time-series' && stat
        ? (sampled.stats[stat] ?? null)
        : undefined;
  const pairKey = `${variable?.id ?? ''}:${stat ?? ''}|${xScalarId ?? ''}`;
  const history = useSeriesHistory(frame, sampleValue, pairKey);
  const xSampled = xScalarId ? frame?.outputs[xScalarId] : undefined;
  const xHistory = useSeriesHistory(
    frame,
    xSampled?.kind === 'scalar' ? xSampled.value : undefined,
    pairKey
  );

  const changeKind = (next: KindFilter) => {
    setKind(next);
    setVariableId('');
  };

  return (
    <Stack gap={7}>
      <Panel
        title="Plots"
        description="Pick a variable. The chart list shows only the charts that fit it."
      >
        <Stack gap={6}>
          <Select
            id="plot-kind-select"
            labelText="Variable type"
            value={kind}
            onChange={(e) => changeKind(e.target.value as KindFilter)}
          >
            {(Object.keys(KIND_LABELS) as KindFilter[]).map((k) => (
              <SelectItem key={k} value={k} text={KIND_LABELS[k]} />
            ))}
          </Select>
          <Select
            id="plot-variable-select"
            labelText="Variable"
            value={variableId}
            onChange={(e) => setVariableId(e.target.value)}
          >
            <SelectItem value="" text="Choose a variable…" />
            {variables.map((output) => (
              <SelectItem
                key={output.id}
                value={output.id}
                text={`${output.id} (${output.kind})`}
              />
            ))}
          </Select>
          <Select
            id="plot-chart-select"
            labelText="Chart type"
            value={chart?.id ?? ''}
            disabled={charts.length === 0}
            onChange={(e) => setChartChoice(e.target.value as ChartId)}
          >
            {charts.length === 0 ? (
              <SelectItem value="" text={variable ? 'No chart for this variable' : '—'} />
            ) : (
              charts.map((c) => <SelectItem key={c.id} value={c.id} text={c.label} />)
            )}
          </Select>
          {axisId ? (
            <Select
              id="plot-axis-select"
              labelText="x axis array"
              value={axisId}
              onChange={(e) => setAxisChoice(e.target.value)}
            >
              {axes.map((id) => (
                <SelectItem key={id} value={id} text={id} />
              ))}
            </Select>
          ) : null}
          {chart?.id === 'phase-space-2d' ? (
            <>
              <Select
                id="plot-phase-x-select"
                labelText="Horizontal axis"
                value={phaseX}
                onChange={(e) => setPhaseX(e.target.value as PhaseSpaceCoord)}
              >
                {PHASE_SPACE_COORDS.map((c) => (
                  <SelectItem key={c} value={c} text={c} />
                ))}
              </Select>
              <Select
                id="plot-phase-y-select"
                labelText="Vertical axis"
                value={phaseY}
                onChange={(e) => setPhaseY(e.target.value as PhaseSpaceCoord)}
              >
                {PHASE_SPACE_COORDS.map((c) => (
                  <SelectItem key={c} value={c} text={c} />
                ))}
              </Select>
            </>
          ) : null}
          {xScalarId ? (
            <Select
              id="plot-x-scalar-select"
              labelText="x axis scalar"
              value={xScalarId}
              onChange={(e) => setXScalarChoice(e.target.value)}
            >
              {otherScalars.map((o) => (
                <SelectItem key={o.id} value={o.id} text={o.id} />
              ))}
            </Select>
          ) : null}
          {chart?.id === 'particle-stats-time-series' && statNames.length > 0 ? (
            <Select
              id="plot-stat-select"
              labelText="Beam summary value"
              value={stat}
              onChange={(e) => setStatChoice(e.target.value)}
            >
              {statNames.map((n) => (
                <SelectItem key={n} value={n} text={n} />
              ))}
            </Select>
          ) : null}
          {variable && chart ? (
            <div className="stream-toolbar">
              <Tag type={live.status === 'open' ? 'green' : 'gray'}>{live.status}</Tag>
            </div>
          ) : null}
          {live.status === 'closed' ? (
            <InlineNotification
              kind="error"
              title="Live stream closed"
              subtitle={live.error?.message}
              hideCloseButton
              lowContrast
            />
          ) : null}
        </Stack>
      </Panel>
      {variable && chart ? (
        <Panel title={variable.id} description={chart.label}>
          <VariablePlot
            chart={chart.id}
            variableId={variable.id}
            axisId={axisId}
            stat={stat}
            xScalarId={xScalarId}
            xHistory={xHistory}
            history={history}
            outputs={frame?.outputs}
          />
        </Panel>
      ) : null}
    </Stack>
  );
};

export default PlotPanel;
