export function decodeFloat32Base64(data: string): Float32Array {
  if (!/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(data)) {
    throw new Error('Invalid base64 data');
  }

  const binary = atob(data);
  if (binary.length % Float32Array.BYTES_PER_ELEMENT !== 0) {
    throw new Error('Float32 base64 data must contain a whole number of values');
  }

  const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0));
  const view = new DataView(bytes.buffer);
  const values = new Float32Array(bytes.length / Float32Array.BYTES_PER_ELEMENT);

  for (let index = 0; index < values.length; index += 1) {
    values[index] = view.getFloat32(index * Float32Array.BYTES_PER_ELEMENT, true);
  }

  return values;
}

export function reshapeFloat32Array2D(
  values: Float32Array,
  shape: readonly number[]
): Float32Array[] {
  if (
    shape.length !== 2 ||
    shape.some((dimension) => !Number.isInteger(dimension) || dimension < 0)
  ) {
    throw new Error('Array shape must contain two non-negative integers');
  }

  const [rows, columns] = shape;

  if (rows * columns !== values.length) {
    throw new Error(`Array shape [${rows}, ${columns}] does not match ${values.length} values`);
  }

  return Array.from({ length: rows }, (_, row) =>
    values.subarray(row * columns, (row + 1) * columns)
  );
}
