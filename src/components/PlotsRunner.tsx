import { Stack } from '@carbon/react';

import type { ConfigResponse } from '../api/types';
import ModelSummary from './ModelSummary';
import PlotPanel from './PlotPanel';

type PlotsRunnerProps = {
  name?: string;
  config: ConfigResponse;
};

const PlotsRunner = ({ name, config }: PlotsRunnerProps) => (
  <Stack gap={7}>
    <ModelSummary config={config} />
    <PlotPanel name={name} config={config} />
  </Stack>
);

export default PlotsRunner;
