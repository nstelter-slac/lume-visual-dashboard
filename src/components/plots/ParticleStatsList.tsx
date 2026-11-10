import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@carbon/react';

import type { ParticlesOutput } from '../../api/types';
import PlotEmpty from './PlotEmpty';
import { formatNumber } from './format';

type ParticleStatsListProps = {
  particles: ParticlesOutput;
};

/** The beam summary values (size, emittance, energy, charge) of a particle group. */
const ParticleStatsList = ({ particles }: ParticleStatsListProps) => {
  const entries = Object.entries(particles.stats);
  if (entries.length === 0) return <PlotEmpty>This beam has no summary values.</PlotEmpty>;

  return (
    <div className="plot-scroll">
      <Table size="sm" useZebraStyles aria-label="Beam summary values">
        <TableHead>
          <TableRow>
            <TableHeader>Quantity</TableHeader>
            <TableHeader>Value</TableHeader>
            <TableHeader>Unit</TableHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          {entries.map(([name, value]) => (
            <TableRow key={name}>
              <TableCell>{name}</TableCell>
              <TableCell className="numeric">{formatNumber(value)}</TableCell>
              <TableCell>{particles.stats_units[name] || '—'}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <p className="plot-note">{particles.n} particles</p>
    </div>
  );
};

export default ParticleStatsList;
