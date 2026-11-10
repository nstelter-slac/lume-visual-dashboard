import type { HistoryPoint } from '../../hooks/useSeriesHistory';
import EChart from './EChart';
import PlotEmpty from './PlotEmpty';
import { withUnit } from './format';

type TimeSeriesProps = {
  points: HistoryPoint[];
  name: string;
  unit?: string | null;
};

/** One value over time. The chart starts empty and fills as new values arrive. */
const TimeSeries = ({ points, name, unit }: TimeSeriesProps) => {
  if (points.length === 0) {
    return <PlotEmpty>Collecting data… The chart fills as new values arrive.</PlotEmpty>;
  }

  return (
    <EChart
      option={{
        animation: false,
        grid: { containLabel: true, left: 16, right: 24, top: 24, bottom: 24 },
        tooltip: { trigger: 'axis' },
        xAxis: { type: 'time' },
        yAxis: { type: 'value', name: withUnit(name, unit ?? undefined), scale: true },
        series: [
          {
            type: 'line',
            name,
            showSymbol: points.length < 40,
            symbolSize: 5,
            data: points.map((p) => [p.t, p.value]),
          },
        ],
      }}
    />
  );
};

export default TimeSeries;
