import BasePlot from './BasePlot';
import { buildArray1DOption } from './array1DOptions';

interface Array1DProps {
  name: string;
  values: Float32Array;
  unit: string;
}

export default function Array1D({ name, values, unit }: Array1DProps) {
  if (values.length === 0) {
    return <p role="status">No data to plot.</p>;
  }

  return (
    <BasePlot
      ariaLabel={`${name} plotted against index`}
      option={buildArray1DOption(name, values, unit)}
    />
  );
}
