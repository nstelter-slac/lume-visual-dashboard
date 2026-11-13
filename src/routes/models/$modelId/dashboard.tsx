import { createFileRoute } from '@tanstack/react-router';
import DashboardPage from '../../../components/DashboardPage';

/** A grid of plots. Add, move and resize the plots. */
export const Route = createFileRoute('/models/$modelId/dashboard')({
  component: DashboardMode,
});

function DashboardMode() {
  const { modelId } = Route.useParams();
  return <DashboardPage name={modelId} />;
}
