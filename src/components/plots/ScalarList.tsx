import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@carbon/react';

import type { ScalarOutput } from '../../api/types';
import PlotEmpty from './PlotEmpty';
import { formatNumber } from './format';

type ScalarListProps = {
  scalars: Record<string, ScalarOutput>;
};

/** Scalar variables as a table: id, value, unit. */
const ScalarList = ({ scalars }: ScalarListProps) => {
  const entries = Object.entries(scalars);
  if (entries.length === 0) return <PlotEmpty>No scalar values.</PlotEmpty>;

  return (
    <div className="plot-scroll">
      <Table size="sm" useZebraStyles aria-label="Scalar values">
        <TableHead>
          <TableRow>
            <TableHeader>ID</TableHeader>
            <TableHeader>Value</TableHeader>
            <TableHeader>Unit</TableHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          {entries.map(([id, scalar]) => (
            <TableRow key={id}>
              <TableCell>{id}</TableCell>
              <TableCell className="numeric">{formatNumber(scalar.value)}</TableCell>
              <TableCell>{scalar.unit || '—'}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ScalarList;
