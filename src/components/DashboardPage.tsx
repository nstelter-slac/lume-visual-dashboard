import { useModelConfig } from '../hooks/useLumeApi';
import DashboardGrid from './DashboardGrid';

type DashboardPageProps = { name?: string };

const DashboardPage = ({ name }: DashboardPageProps) => {
  const { data: modelConfig, isPending, isError, error } = useModelConfig(name);

  if (isPending) return <div>Loading model configuration…</div>;
  if (isError) return <div role="alert">Failed to load model configuration: {error.message}</div>;

  return <DashboardGrid key={name} name={name} config={modelConfig} />;
};

export default DashboardPage;
