import type { ArrayOutput } from '../../api/types';
import EChart from './EChart';
import PlotEmpty from './PlotEmpty';
import { withUnit } from './format';

type Line1DProps = {
  id: string;
  /** The values to plot. */
  y: ArrayOutput;
  /** The x values (for example position s along the beamline). Plots against the index if omitted. */
  x?: ArrayOutput;
  xId?: string;
};

/** A 1D array as a line, against another array or against the index. */
const Line1D = ({ id, y, x, xId }: Line1DProps) => {
  if (x && x.data.length !== y.data.length) {
    return <PlotEmpty>The x array and the y array have different lengths.</PlotEmpty>;
  }

  const points = Array.from(y.data, (value, i) => [x ? x.data[i] : i, value]);
  const xName = x ? withUnit(xId ?? 'x', x.unit) : 'Index';

  return (
    <EChart
      option={{
        animation: false,
        grid: { containLabel: true, left: 16, right: 24, top: 24, bottom: 40 },
        tooltip: { trigger: 'axis' },
        xAxis: { type: 'value', name: xName, nameLocation: 'middle', nameGap: 28, scale: true },
        yAxis: { type: 'value', name: withUnit(id, y.unit), scale: true },
        series: [{ type: 'line', showSymbol: points.length < 60, data: points }],
      }}
    />
  );
};

export default Line1D;
