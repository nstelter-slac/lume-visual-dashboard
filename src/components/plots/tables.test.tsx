import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import ArrayTable from './ArrayTable';
import ParticleStatsList from './ParticleStatsList';
import ScalarList from './ScalarList';

describe('plot tables', () => {
  it('lists scalars with value and unit', () => {
    render(
      <ScalarList
        scalars={{
          q: { kind: 'scalar', value: 1.5, unit: 'kG', variable_class: '' },
          bad: { kind: 'scalar', value: null, unit: '', variable_class: '' },
        }}
      />
    );
    expect(screen.getByText('1.5')).toBeTruthy();
    expect(screen.getByText('kG')).toBeTruthy();
    // A value the server could not encode arrives as null.
    expect(screen.getAllByText('—').length).toBeGreaterThan(0);
  });

  it('shows a 2D array as a matrix and cuts off large ones', () => {
    const data = Float32Array.from({ length: 150 * 2 }, (_, i) => i);
    render(
      <ArrayTable
        array={{
          kind: 'array',
          shape: [150, 2],
          dtype: 'float32',
          unit: '',
          variable_class: '',
          data,
        }}
      />
    );
    expect(screen.getByText(/Showing 100 of 150 rows/)).toBeTruthy();
    expect(screen.getAllByRole('row')).toHaveLength(101);
  });

  it('shows beam summary values with units', () => {
    render(
      <ParticleStatsList
        particles={{
          kind: 'particles',
          n: 1000,
          units: {},
          coords: {},
          stats: { sigma_x: 0.0003 },
          stats_units: { sigma_x: 'm' },
          variable_class: '',
        }}
      />
    );
    expect(screen.getByText('sigma_x')).toBeTruthy();
    expect(screen.getByText('3.000e-4')).toBeTruthy();
    expect(screen.getByText('1000 particles')).toBeTruthy();
  });
});
