import { Theme } from '@carbon/react';
import Dashboard from './components/Dashboard';
import './App.css';

function App() {
  return (
    <Theme theme="g100">
      <Dashboard />
    </Theme>
  );
}

export default App;
