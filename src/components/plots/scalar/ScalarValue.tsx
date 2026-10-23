import './ScalarValue.css';

interface ScalarValueProps {
  name: string;
  value: number | null;
  unit: string;
}

export default function ScalarValue({ name, value, unit }: ScalarValueProps) {
  return (
    <dl className="scalar-value">
      <dt className="scalar-value__name">{name}</dt>
      <dd className="scalar-value__reading">
        {value === null ? <span aria-label="No value">{'\u2014'}</span> : value}
        {unit && <span className="scalar-value__unit"> {unit}</span>}
      </dd>
    </dl>
  );
}
