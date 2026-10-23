import type { ScalarOutput } from '../lume/types';
import { decodeFloat32Base64 } from '../lume/decode';
import Array1D from './plots/Array1D';
import ScalarValue from './plots/scalar/ScalarValue';

const exampleScalar: ScalarOutput = {
  kind: 'scalar',
  value: 0.25,
  unit: 'mm',
  variable_class: 'ScalarVariable',
};

const exampleArray = decodeFloat32Base64('zcxMPjMzsz4pXI8+AAAAPz0K1z4AAEA/mpkZPw==');

const Dashboard = () => {
  return (
    <main>
      <h1>LUME Visual Dashboard</h1>
      <p>Example data only. Not connected to a model.</p>
      <ScalarValue name="Beam size" value={exampleScalar.value} unit={exampleScalar.unit} />
      <Array1D name="Beam size along beamline" values={exampleArray} unit="mm" />
    </main>
  );
};

export default Dashboard;
