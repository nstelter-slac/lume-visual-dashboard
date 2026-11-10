import { useMemo } from 'react';
import ReactEChartsCoreImport from 'echarts-for-react/lib/core';
import { HeatmapChart, LineChart, ScatterChart } from 'echarts/charts';
import {
  DataZoomComponent,
  GridComponent,
  LegendComponent,
  TitleComponent,
  TooltipComponent,
  VisualMapComponent,
} from 'echarts/components';
import * as echarts from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import type { EChartsCoreOption } from 'echarts/core';

// Only the parts the plots need, to keep the bundle small.
echarts.use([
  LineChart,
  ScatterChart,
  HeatmapChart,
  GridComponent,
  TooltipComponent,
  LegendComponent,
  TitleComponent,
  DataZoomComponent,
  VisualMapComponent,
  CanvasRenderer,
]);

// The package is CommonJS; depending on the bundler, the default import is the module object.
const ReactEChartsCore: typeof ReactEChartsCoreImport =
  (ReactEChartsCoreImport as unknown as { default?: typeof ReactEChartsCoreImport }).default ??
  ReactEChartsCoreImport;

type EChartProps = {
  option: EChartsCoreOption;
  /** CSS height. The chart fills the width of its panel and resizes with it. */
  height?: string;
};

/** The shared ECharts wrapper for all plots. */
const EChart = ({ option, height = '24rem' }: EChartProps) => {
  const style = useMemo(() => ({ height, width: '100%' }), [height]);
  return <ReactEChartsCore echarts={echarts} option={option} style={style} notMerge lazyUpdate />;
};

export default EChart;
