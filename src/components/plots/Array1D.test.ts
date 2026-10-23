import { describe, expect, it } from 'vitest';
import { buildArray1DOption } from './array1DOptions';

describe('buildArray1DOption', () => {
  it('plots values against their index and labels the unit', () => {
    const option = buildArray1DOption('Beam size', new Float32Array([0.2, 0.35, 0.28]), 'mm');

    expect(option.title).toMatchObject({ text: 'Beam size vs. index' });
    expect(option.xAxis).toMatchObject({
      type: 'category',
      name: 'Index',
      data: [0, 1, 2],
    });
    expect(option.yAxis).toMatchObject({ name: 'Value (mm)' });
    expect(option.series).toMatchObject([
      {
        name: 'Beam size',
        type: 'line',
        data: Array.from(new Float32Array([0.2, 0.35, 0.28])),
        showSymbol: false,
      },
    ]);
  });

  it('uses a general value label when there is no unit', () => {
    const option = buildArray1DOption('Signal', new Float32Array([1]), '');

    expect(option.yAxis).toMatchObject({ name: 'Value' });
  });
});
