import type { EChartsOption } from 'echarts';

export function buildArray1DOption(
  name: string,
  values: Float32Array,
  unit: string
): EChartsOption {
  return {
    backgroundColor: 'transparent',
    textStyle: { color: '#f4f4f4' },
    title: {
      text: `${name} vs. index`,
      textStyle: { color: '#f4f4f4' },
    },
    tooltip: { trigger: 'axis' },
    grid: { left: 72, right: 24, top: 64, bottom: 56, containLabel: true },
    xAxis: {
      type: 'category',
      name: 'Index',
      nameLocation: 'middle',
      nameGap: 30,
      data: Array.from({ length: values.length }, (_, index) => index),
      axisLabel: { color: '#c6c6c6' },
      axisLine: { lineStyle: { color: '#8d8d8d' } },
    },
    yAxis: {
      type: 'value',
      name: unit ? `Value (${unit})` : 'Value',
      nameLocation: 'middle',
      nameGap: 48,
      axisLabel: { color: '#c6c6c6' },
      axisLine: { lineStyle: { color: '#8d8d8d' } },
      splitLine: { lineStyle: { color: '#393939' } },
    },
    series: [
      {
        name,
        type: 'line',
        data: Array.from(values),
        showSymbol: false,
        lineStyle: { color: '#78a9ff', width: 2 },
      },
    ],
  };
}
