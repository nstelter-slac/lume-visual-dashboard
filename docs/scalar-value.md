# Show one number

`ScalarValue` shows a name, a number and its unit. It does not fetch data or
change units. Passing a new value updates the readout.

```tsx
import ScalarValue from './components/plots/scalar/ScalarValue';

<ScalarValue name="Beam size" value={0.25} unit="mm" />;
```

| Prop | Type | Meaning |
| --- | --- | --- |
| `name` | `string` | Label shown above the number. |
| `value` | `number \| null` | Number to show. `null` shows a dash, labeled "No value" for screen readers. |
| `unit` | `string` | Unit shown beside the number. Use `""` when there is no unit. |

The `ScalarOutput` type in `src/lume/types.ts` describes a scalar response from
lume-model-api: `kind: "scalar"`, `value`, `unit` and `variable_class`. Pass its
`value` and `unit` to the component, and supply a label using `name`.

Run `pnpm dev` to see the example on the Dashboard. It uses fake data;
connecting to the backend will come later.
