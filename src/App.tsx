import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';
import PublisherProducts from './components/PublisherProducts';
import SharedView from './components/SharedView';
import Login from './components/Login';

// TODO: Cambiar las rutas relativas por @ para mayor flexibilidad en el futuro
function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/published" element={<PublisherProducts />} />
        <Route path="/shared/:token" element={<SharedView />} />
        <Route path="*" element={<LandingPage />} />
      </Routes>
    </Router>
  );
}

export default App;
