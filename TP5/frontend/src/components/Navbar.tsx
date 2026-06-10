import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo" onClick={() => setIsOpen(false)}>
          Registro de Participantes
        </Link>
        <div className={`menu-icon ${isOpen ? 'open' : ''}`} onClick={() => setIsOpen(!isOpen)}>
          <div className="bar1"></div>
          <div className="bar2"></div>
          <div className="bar3"></div>
        </div>
        <ul className={`nav-menu ${isOpen ? 'active' : ''}`}>
          {isAuthenticated && (
            <li className="nav-item">
              <Link to="/" className="nav-links" onClick={() => setIsOpen(false)}>
                Inicio
              </Link>
            </li>
          )}
          {isAuthenticated && (
            <li className="nav-item">
              <Link to="/cursos" className="nav-links" onClick={() => setIsOpen(false)}>
                Cursos
              </Link>
            </li>
          )}
          {user?.rol === 'ADMIN' && (
            <li className="nav-item">
              <Link to="/nuevo" className="nav-links" onClick={() => setIsOpen(false)}>
                Nuevo Participante
              </Link>
            </li>
          )}
          {isAuthenticated && (
            <li className="nav-item">
              <span className="nav-links" style={{ cursor: 'pointer' }} onClick={handleLogout}>
                Cerrar Sesión
              </span>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
}
