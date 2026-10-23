# Show model data

So far, we can show one number or draw a line chart from a list of numbers.
The Dashboard has an example of each. Run `pnpm dev` to see them.

These examples use made-up data. We'll connect to the real backend later.
The components just display whatever data you give them; they don't fetch it
or change its units.

## Show one number

Use `ScalarValue` for a single reading, like a beam size:

```tsx
import ScalarValue from './components/plots/scalar/ScalarValue';

<ScalarValue name="Beam size" value={0.25} unit="mm" />;
```

This shows **Beam size**, **0.25**, and **mm**. Give it a new value and the
display updates.

| What you pass in | What it does |
| --- | --- |
| `name` | The label above the number. |
| `value` | The number to show. Use `null` if it's missing. |
| `unit` | The unit beside the number. Use `""` if there isn't one. |

A missing value shows a dash. Screen readers get the label "No value" so
the dash has a clear meaning.

When we connect to the backend, a single-number result will have
`kind: "scalar"`, `value`, `unit`, and `variable_class`. The `ScalarOutput`
type in `src/lume/types.ts` describes that format. You only need to pass
`value` and `unit` to this component, along with your own `name`.

## Draw a line chart

Use `Array1D` for a list of numbers:

```tsx
import Array1D from './components/plots/Array1D';

const values = new Float32Array([0.2, 0.35, 0.28, 0.5]);

<Array1D name="Beam size" values={values} unit="mm" />;
```

`Float32Array` is just a compact way to store a list of numbers. The chart
puts the list positions (0, 1, 2, 3) along the bottom and the values up the
side. It uses Apache ECharts.

| What you pass in | What it does |
| --- | --- |
| `name` | The chart title and the name read by screen readers. |
| `values` | The list of numbers, as a `Float32Array`. |
| `unit` | The unit shown on the vertical axis. Use `""` if there isn't one. |

An empty list shows "No data to plot." instead of a blank chart.

## Turn backend array data into numbers

The backend sends lists and grids as base64, a way of packing numbers into
text. Before plotting them, turn that text back into numbers:

```ts
import { decodeFloat32Base64 } from './lume/decode';

const values = decodeFloat32Base64(output.data_b64);
```

The result is a `Float32Array`, ready to pass to `Array1D`. The decoder reads
the backend's little-endian float32 format. It throws an error if the text
isn't valid base64 or doesn't contain complete 32-bit numbers.

For a grid, the backend also sends a `shape`. For example, `[2, 3]` means
two rows with three numbers in each. To split the decoded list into rows:

```ts
import { reshapeFloat32Array2D } from './lume/decode';

const rows = reshapeFloat32Array2D(values, output.shape);
```

This helper only handles 2D shapes. It checks that both dimensions are whole,
non-negative numbers and that the number of values matches the shape.
If something doesn't match, it throws an error rather than guessing.
Empty grids are OK.

The rows share the original list's data instead of copying it. That means
changing a number in a row also changes it in the original list.
