import type { ReactNode } from 'react';

type PlotEmptyProps = { children: ReactNode };

/** What a plot shows in place of data: "collecting data", "no image for this screen", errors. */
const PlotEmpty = ({ children }: PlotEmptyProps) => (
  <p className="plot-empty" role="status">
    {children}
  </p>
);

export default PlotEmpty;
