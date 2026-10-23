import { describe, expect, it } from 'vitest';
import { decodeFloat32Base64, reshapeFloat32Array2D } from './decode';

function encodeFloat32Base64(values: number[]): string {
  const bytes = new Uint8Array(values.length * Float32Array.BYTES_PER_ELEMENT);
  const view = new DataView(bytes.buffer);

  values.forEach((value, index) => {
    view.setFloat32(index * Float32Array.BYTES_PER_ELEMENT, value, true);
  });

  return btoa(String.fromCharCode(...bytes));
}

describe('decodeFloat32Base64', () => {
  it('decodes little-endian float32 values', () => {
    expect(Array.from(decodeFloat32Base64(encodeFloat32Base64([1.5, -2, 0])))).toEqual([
      1.5, -2, 0,
    ]);
  });

  it('decodes an empty array', () => {
    expect(decodeFloat32Base64('')).toHaveLength(0);
  });

  it('rejects invalid base64', () => {
    expect(() => decodeFloat32Base64('not base64!')).toThrow('Invalid base64 data');
  });

  it('rejects bytes that do not form whole float32 values', () => {
    expect(() => decodeFloat32Base64('AQ==')).toThrow('whole number of values');
  });
});

describe('reshapeFloat32Array2D', () => {
  it('returns rows as views over the original values', () => {
    const values = new Float32Array([1, 2, 3, 4, 5, 6]);
    const rows = reshapeFloat32Array2D(values, [2, 3]);

    expect(rows.map((row) => Array.from(row))).toEqual([
      [1, 2, 3],
      [4, 5, 6],
    ]);
    rows[0][0] = 9;
    expect(values[0]).toBe(9);
  });

  it('supports zero-length dimensions', () => {
    expect(reshapeFloat32Array2D(new Float32Array(), [2, 0])).toHaveLength(2);
  });

  it('rejects invalid shapes', () => {
    const invalidShapes = [[3], [1, 2, 3], [-1, 2], [1.5, 2]];

    for (const shape of invalidShapes) {
      expect(() => reshapeFloat32Array2D(new Float32Array(), shape)).toThrow(
        'two non-negative integers'
      );
    }
  });

  it('rejects a shape that does not match the number of values', () => {
    expect(() => reshapeFloat32Array2D(new Float32Array([1, 2, 3]), [2, 2])).toThrow(
      'does not match 3 values'
    );
  });
});
