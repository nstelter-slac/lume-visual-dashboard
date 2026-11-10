---
icon: lucide/chart-line
---

# Plot components

The dashboard shows model data with plot components. They are in
`src/components/plots/`. Use them to build panels.

## The rule: the variable type decides the charts

The API gives each output a **kind**. The kind decides which charts can show it.

| Variable kind | Charts | Chart id |
| --- | --- | --- |
| Scalar (one number) | Value over time | `scalar-time-series` |
| | Scalar vs scalar | `scalar-vs-scalar` |
| | List of values | `scalar-list` |
| NDVariable, 1D array | Line vs s (or another array) | `line-vs-s` |
| | Line vs index | `line-vs-index` |
| | Table | `array-table` |
| NDVariable, 2D array | 2D image | `image-2d` |
| | Table | `array-table` |
| Particle group | 2D phase space | `phase-space-2d` |
| | Beam summary list | `particle-stats-list` |
| | Beam summary value over time | `particle-stats-time-series` |
| Other values (enums, strings) | No chart | |

Arrays with more than 2 dimensions have no chart.
`chartsForVariable()` in `charts.ts` is the single place that holds this rule.
The first chart in the list is the default.

## Try it

1. Start the stack: `docker compose up`.
2. Open `http://localhost:5173/models/cu_hxr_staged/plots`.
3. Pick a variable type, a variable, and a chart type.

Some charts show more menus. For example, "Line vs s" has an x axis array menu.
"Phase space" has two menus for the axes.

## Components

| File | Purpose |
| --- | --- |
| `charts.ts` | Chart ids, and which charts fit each variable kind |
| `VariablePlot.tsx` | Takes a chart id and the latest values. Draws the right chart. |
| `Line1D.tsx` | A 1D array against its index or against another array |
| `Image2D.tsx` | A 2D array as an image (canvas, viridis colors) |
| `PhaseSpace2D.tsx` | Scatter plot of two particle coordinates |
| `TimeSeries.tsx` | One value over time |
| `ScalarVsScalar.tsx` | One scalar against another |
| `ScalarList.tsx`, `ArrayTable.tsx`, `ParticleStatsList.tsx` | Table views |
| `EChart.tsx` | Shared ECharts wrapper. It loads only the parts the plots use. |
| `PlotEmpty.tsx` | The message shown when there is nothing to draw |

`src/components/PlotsRunner.tsx` is the page logic. It holds the menus and opens
the live stream.

## Behavior to know

- **No stored history.** The API gives only the latest value. The hook
  `useSeriesHistory` keeps values from the time the page opens. A time chart
  starts empty and shows "Collecting data…". It keeps the last 900 points.
- **Stable phase-space axes.** The axis range can grow but never shrinks. This
  stops the axes from jumping when each new beam arrives. It resets when you
  change the variable or the axis.
- **Updates about once each second.** `useThrottledValue` limits the rate.
- **Tables are limited** to 100 rows and 20 columns.

## Add a new chart

1. Add the id to `ChartId` and `CHARTS` in `charts.ts`.
2. Add it to the list for its variable kind in `chartsForVariable()`.
3. Write the component. Keep it free of data fetching. It gets data as props.
4. Add a `case` for it in `VariablePlot.tsx`.
5. Add a menu in `PlotsRunner.tsx` if the chart needs more choices.
6. Update `charts.test.ts` and this page.

Check your work in the container:

```sh
docker compose exec lume-visual-dashboard pnpm exec tsc -b
docker compose exec lume-visual-dashboard pnpm lint
docker compose exec lume-visual-dashboard pnpm test
```
