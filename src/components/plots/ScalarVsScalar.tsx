import type { HistoryPoint } from '../../hooks/useSeriesHistory';
import EChart from './EChart';
import PlotEmpty from './PlotEmpty';
import { withUnit } from './format';

type ScalarVsScalarProps = {
  xName: string;
  yName: string;
  xUnit?: string | null;
  yUnit?: string | null;
  /** Both histories grow together: point `i` of each came from the same update. */
  xPoints: HistoryPoint[];
  yPoints: HistoryPoint[];
};

/** One scalar against another. Each update adds one point. */
const ScalarVsScalar = ({ xName, yName, xUnit, yUnit, xPoints, yPoints }: ScalarVsScalarProps) => {
  const count = Math.min(xPoints.length, yPoints.length);
  const data: [number, number][] = [];
  for (let i = 0; i < count; i++) {
    const x = xPoints[i].value;
    const y = yPoints[i].value;
    if (x !== null && y !== null) data.push([x, y]);
  }
  if (data.length === 0) {
    return <PlotEmpty>Collecting data… A point is added for each new update.</PlotEmpty>;
  }

  return (
    <EChart
      option={{
        animation: false,
        grid: { containLabel: true, left: 16, right: 24, top: 24, bottom: 40 },
        tooltip: { trigger: 'item' },
        xAxis: {
          type: 'value',
          name: withUnit(xName, xUnit ?? undefined),
          nameLocation: 'middle',
          nameGap: 28,
          scale: true,
        },
        yAxis: { type: 'value', name: withUnit(yName, yUnit ?? undefined), scale: true },
        series: [{ type: 'scatter', symbolSize: 6, data }],
      }}
    />
  );
};

export default ScalarVsScalar;
