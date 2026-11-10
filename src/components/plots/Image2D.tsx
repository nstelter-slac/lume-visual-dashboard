import { useEffect, useRef } from 'react';

import type { ArrayOutput } from '../../api/types';
import PlotEmpty from './PlotEmpty';
import { formatNumber } from './format';

// Viridis, sampled at 5 points and interpolated.
const COLORMAP = [
  [68, 1, 84],
  [59, 82, 139],
  [33, 145, 140],
  [94, 201, 98],
  [253, 231, 37],
];

function colorAt(t: number): [number, number, number] {
  const scaled = Math.min(Math.max(t, 0), 1) * (COLORMAP.length - 1);
  const i = Math.min(Math.floor(scaled), COLORMAP.length - 2);
  const f = scaled - i;
  const a = COLORMAP[i];
  const b = COLORMAP[i + 1];
  return [a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f, a[2] + (b[2] - a[2]) * f];
}

/** Min and max of the finite values, or `undefined` if there are none. */
function valueRange(data: Float32Array): [number, number] | undefined {
  let min = Infinity;
  let max = -Infinity;
  for (const v of data) {
    if (!Number.isFinite(v)) continue;
    if (v < min) min = v;
    if (v > max) max = v;
  }
  return min <= max ? [min, max] : undefined;
}

type Image2DProps = {
  image: ArrayOutput;
};

/** A 2D array (for example a screen image) as a color image. Row 0 is at the top. */
const Image2D = ({ image }: Image2DProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [height, width] = image.shape;
  const range = image.shape.length === 2 ? valueRange(image.data) : undefined;

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if (!canvas || !context || !range) return;
    const [min, max] = range;
    const span = max - min || 1;
    const pixels = context.createImageData(width, height);
    for (let i = 0; i < width * height; i++) {
      const [r, g, b] = colorAt((image.data[i] - min) / span);
      pixels.data[i * 4] = r;
      pixels.data[i * 4 + 1] = g;
      pixels.data[i * 4 + 2] = b;
      pixels.data[i * 4 + 3] = Number.isFinite(image.data[i]) ? 255 : 0;
    }
    context.putImageData(pixels, 0, 0);
  }, [image, range, width, height]);

  if (image.shape.length !== 2) return <PlotEmpty>An image needs a 2D array.</PlotEmpty>;
  if (!range) return <PlotEmpty>This image has no finite values.</PlotEmpty>;

  return (
    <figure className="plot-image">
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        role="img"
        aria-label={`${width} by ${height} image`}
      />
      <figcaption className="plot-note">
        {width} × {height} · min {formatNumber(range[0])} · max {formatNumber(range[1])}
        {image.unit ? ` ${image.unit}` : ''}
      </figcaption>
    </figure>
  );
};

export default Image2D;
