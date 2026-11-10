import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@carbon/react';

import type { ArrayOutput } from '../../api/types';
import PlotEmpty from './PlotEmpty';
import { formatNumber } from './format';

/** Large arrays are cut off so the table stays fast. */
const ARRAY_TABLE_LIMITS = { rows: 100, cols: 20 };

type ArrayTableProps = {
  array: ArrayOutput;
};

/** A 1D array as index/value rows, or a 2D array as a matrix. */
const ArrayTable = ({ array }: ArrayTableProps) => {
  const { shape, data, unit } = array;
  if (shape.length !== 1 && shape.length !== 2) {
    return <PlotEmpty>Tables show 1D and 2D arrays. This array has {shape.length}D.</PlotEmpty>;
  }

  const rows = shape[0];
  const cols = shape.length === 2 ? shape[1] : 1;
  const shownRows = Math.min(rows, ARRAY_TABLE_LIMITS.rows);
  const shownCols = Math.min(cols, ARRAY_TABLE_LIMITS.cols);
  const truncated = shownRows < rows || shownCols < cols;

  return (
    <div className="plot-scroll">
      <Table size="sm" useZebraStyles aria-label="Array values">
        <TableHead>
          <TableRow>
            <TableHeader>{shape.length === 1 ? 'Index' : 'Row'}</TableHeader>
            {shape.length === 1 ? (
              <TableHeader>{unit ? `Value (${unit})` : 'Value'}</TableHeader>
            ) : (
              Array.from({ length: shownCols }, (_, c) => <TableHeader key={c}>{c}</TableHeader>)
            )}
          </TableRow>
        </TableHead>
        <TableBody>
          {Array.from({ length: shownRows }, (_, r) => (
            <TableRow key={r}>
              <TableCell>{r}</TableCell>
              {Array.from({ length: shownCols }, (_, c) => (
                <TableCell key={c} className="numeric">
                  {formatNumber(data[r * cols + c])}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {truncated ? (
        <p className="plot-note">
          Showing {shownRows} of {rows} rows
          {shape.length === 2 ? ` and ${shownCols} of ${cols} columns` : ''}.
        </p>
      ) : null}
    </div>
  );
};

export default ArrayTable;
