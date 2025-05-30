import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import Builder from './pages/Builder';
import Backup from './pages/Backup';
import Wallets from './pages/Wallets';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="projects" element={<Projects />} />
          <Route path="builder" element={<Builder />} />
          <Route path="backup" element={<Backup />} />
          <Route path="wallets" element={<Wallets />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;