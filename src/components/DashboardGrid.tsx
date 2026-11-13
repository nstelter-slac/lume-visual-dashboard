import { useState } from 'react';
import { Button, Stack } from '@carbon/react';
import { Add, Close, Draggable } from '@carbon/icons-react';
import { GridLayout, useContainerWidth, type Layout } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';

import type { ConfigResponse } from '../api/types';
import ModelSummary from './ModelSummary';
import PlotPanel from './PlotPanel';

type DashboardGridProps = {
  name?: string;
  config: ConfigResponse;
};

const COLUMNS = 12;
const ROW_HEIGHT = 60;
const TILE_SIZE = { w: 6, h: 9 };

/** A grid of plot panels. Drag a tile by its handle. Resize it from the lower right corner. */
const DashboardGrid = ({ name, config }: DashboardGridProps) => {
  const { width, containerRef, mounted } = useContainerWidth();
  const [layout, setLayout] = useState<Layout>([{ i: 'plot-1', x: 0, y: 0, ...TILE_SIZE }]);
  const [nextId, setNextId] = useState(2);

  const addTile = () => {
    // Placed at the bottom. The grid moves the tile up into free space.
    setLayout((current) => [
      ...current,
      {
        i: `plot-${nextId}`,
        x: (current.length * TILE_SIZE.w) % COLUMNS,
        y: Infinity,
        ...TILE_SIZE,
      },
    ]);
    setNextId(nextId + 1);
  };
  const removeTile = (id: string) => setLayout((current) => current.filter((t) => t.i !== id));

  return (
    <Stack gap={7}>
      <ModelSummary config={config} />
      <div className="stream-toolbar">
        <Button size="sm" renderIcon={Add} onClick={addTile}>
          Add plot
        </Button>
      </div>
      <div ref={containerRef}>
        {mounted ? (
          <GridLayout
            width={width}
            layout={layout}
            gridConfig={{ cols: COLUMNS, rowHeight: ROW_HEIGHT, margin: [16, 16] }}
            dragConfig={{ handle: '.dashboard-tile-handle' }}
            onLayoutChange={setLayout}
          >
            {layout.map((tile) => (
              <div key={tile.i} className="dashboard-tile">
                <div className="dashboard-tile-header">
                  <span className="dashboard-tile-handle" title="Drag to move">
                    <Draggable size={16} />
                    Drag
                  </span>
                  <Button
                    kind="ghost"
                    size="sm"
                    hasIconOnly
                    renderIcon={Close}
                    iconDescription="Remove plot"
                    onClick={() => removeTile(tile.i)}
                  />
                </div>
                <div className="dashboard-tile-body">
                  <PlotPanel name={name} config={config} />
                </div>
              </div>
            ))}
          </GridLayout>
        ) : null}
      </div>
    </Stack>
  );
};

export default DashboardGrid;
