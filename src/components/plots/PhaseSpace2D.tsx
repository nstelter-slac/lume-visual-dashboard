import { useState } from 'react';
import type { ParticlesOutput } from '../../api/types';
import type { PhaseSpaceCoord } from './charts';
import EChart from './EChart';
import PlotEmpty from './PlotEmpty';
import { withUnit } from './format';

type PhaseSpace2DProps = {
  particles: ParticlesOutput;
  xKey: PhaseSpaceCoord;
  yKey: PhaseSpaceCoord;
};

type Range = { key: string; min: number; max: number };

const dataRange = (values: ArrayLike<number>): [number, number] => {
  let min = Infinity;
  let max = -Infinity;
  for (let i = 0; i < values.length; i++) {
    if (values[i] < min) min = values[i];
    if (values[i] > max) max = values[i];
  }
  return [min, max];
};

/** Keeps an axis range that can grow but never shrink, so the axes stay still. */
const useGrowingRange = (key: string, values: ArrayLike<number> | undefined) => {
  const [range, setRange] = useState<Range | null>(null);
  if (!values || values.length === 0) return range;
  const [min, max] = dataRange(values);
  const current = range?.key === key ? range : null;
  if (!current || min < current.min || max > current.max) {
    const next = {
      key,
      min: current ? Math.min(min, current.min) : min,
      max: current ? Math.max(max, current.max) : max,
    };
    setRange(next);
    return next;
  }
  return current;
};

/** A scatter plot of a beam: one coordinate against another. */
const PhaseSpace2D = ({ particles, xKey, yKey }: PhaseSpace2DProps) => {
  const xs = particles.coords[xKey];
  const ys = particles.coords[yKey];
  const xRange = useGrowingRange(`x:${xKey}`, xs);
  const yRange = useGrowingRange(`y:${yKey}`, ys);
  if (!xs || !ys) return <PlotEmpty>This beam has no {!xs ? xKey : yKey} coordinate.</PlotEmpty>;
  if (xs.length === 0) return <PlotEmpty>This beam has no particles.</PlotEmpty>;

  const points = Array.from(xs, (x, i) => [x, ys[i]]);

  return (
    <EChart
      height="28rem"
      option={{
        animation: false,
        grid: { containLabel: true, left: 16, right: 24, top: 24, bottom: 40 },
        tooltip: { trigger: 'item' },
        xAxis: {
          type: 'value',
          name: withUnit(xKey, particles.units[xKey]),
          nameLocation: 'middle',
          nameGap: 28,
          min: xRange?.min,
          max: xRange?.max,
        },
        yAxis: {
          type: 'value',
          name: withUnit(yKey, particles.units[yKey]),
          min: yRange?.min,
          max: yRange?.max,
        },
        series: [{ type: 'scatter', symbolSize: 3, large: true, data: points }],
      }}
    />
  );
};

export default PhaseSpace2D;
