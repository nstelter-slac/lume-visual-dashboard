import type { EChartsOption } from 'echarts';
import ReactECharts from 'echarts-for-react';
import './BasePlot.css';

interface BasePlotProps {
  ariaLabel: string;
  option: EChartsOption;
}

export default function BasePlot({ ariaLabel, option }: BasePlotProps) {
  return (
    <div className="base-plot" role="img" aria-label={ariaLabel}>
      <ReactECharts option={option} style={{ height: '320px', width: '100%' }} lazyUpdate />
    </div>
  );
}
