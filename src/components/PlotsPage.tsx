import { useModelConfig } from '../hooks/useLumeApi';
import PlotsRunner from './PlotsRunner';

type PlotsPageProps = { name?: string };

const PlotsPage = ({ name }: PlotsPageProps) => {
  const { data: modelConfig, isPending, isError, error } = useModelConfig(name);

  if (isPending) return <div>Loading model configuration…</div>;
  if (isError) return <div role="alert">Failed to load model configuration: {error.message}</div>;

  return <PlotsRunner key={name} name={name} config={modelConfig} />;
};

export default PlotsPage;
