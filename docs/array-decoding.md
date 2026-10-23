# Decode array data

The model API sends arrays as base64 text containing little-endian 32-bit
numbers. It also sends a `shape` that tells how many rows and columns the data
has. Decode the data before using it in a chart.

```ts
import {
  decodeFloat32Base64,
  reshapeFloat32Array2D,
} from './lume/decode';

const values = decodeFloat32Base64(output.data_b64);
const rows = reshapeFloat32Array2D(values, output.shape);
```

`decodeFloat32Base64` returns a `Float32Array`, which is a compact list of
numbers. `reshapeFloat32Array2D` returns one view for each row. The rows refer
to the same underlying numbers, so this does not make another copy of the data.

The 2D helper checks that `shape` has two whole, non-negative numbers and that
the dimensions match the number of values. It throws an error if either check
fails. It also supports empty arrays.

The helper only reshapes 2D arrays. A 1D array can be used directly after
decoding.
