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

/** A scatter plot of a beam: one coordinate against another. */
const PhaseSpace2D = ({ particles, xKey, yKey }: PhaseSpace2DProps) => {
  const xs = particles.coords[xKey];
  const ys = particles.coords[yKey];
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
          scale: true,
        },
        yAxis: { type: 'value', name: withUnit(yKey, particles.units[yKey]), scale: true },
        series: [{ type: 'scatter', symbolSize: 3, large: true, data: points }],
      }}
    />
  );
};

export default PhaseSpace2D;
