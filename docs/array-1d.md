# Plot a list of numbers

`Array1D` draws a line chart for a list of numbers. The horizontal axis shows
each number's position in the list, starting at zero. The vertical axis shows
the number and its unit.

```tsx
import Array1D from './components/plots/Array1D';
import { decodeFloat32Base64 } from './lume/decode';

const values = decodeFloat32Base64(output.data_b64);

<Array1D name="Beam size" values={values} unit="mm" />;
```

| Prop | Type | Meaning |
| --- | --- | --- |
| `name` | `string` | Chart title and name shown to screen readers. |
| `values` | `Float32Array` | Numbers to plot, in order. |
| `unit` | `string` | Unit shown on the vertical axis. Use `""` if there is no unit. |

The chart is made with Apache ECharts. If the list is empty, the component
shows a message instead of a blank chart. The Dashboard example uses fake
encoded data; it does not connect to a model.
