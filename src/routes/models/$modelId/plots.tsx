import { createFileRoute } from '@tanstack/react-router';
import PlotsPage from '../../../components/PlotsPage';

/** Pick any output variable and view it with a chart that fits its type. */
export const Route = createFileRoute('/models/$modelId/plots')({
  component: PlotsMode,
});

function PlotsMode() {
  const { modelId } = Route.useParams();
  return <PlotsPage name={modelId} />;
}
