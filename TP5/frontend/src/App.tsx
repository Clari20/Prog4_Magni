import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import FormularioPage from './pages/FormularioPage';
import EditarPage from './pages/EditarPage';
import Navbar from './components/Navbar';

export default function App() {
  return (
    <div className="app">
      <Navbar />
      <main className="container" style={{ marginTop: '20px' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/nuevo" element={<FormularioPage />} />
          <Route path="/editar/:id" element={<EditarPage />} />
        </Routes>
      </main>
    </div>
  );
}
