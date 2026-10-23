import type { ScalarOutput } from '../lume/types';
import ScalarValue from './plots/scalar/ScalarValue';

const exampleScalar: ScalarOutput = {
  kind: 'scalar',
  value: 0.25,
  unit: 'mm',
  variable_class: 'ScalarVariable',
};

const Dashboard = () => {
  return (
    <main>
      <h1>LUME Visual Dashboard</h1>
      <p>Example data only. Not connected to a model.</p>
      <ScalarValue name="Beam size" value={exampleScalar.value} unit={exampleScalar.unit} />
    </main>
  );
};

export default Dashboard;
