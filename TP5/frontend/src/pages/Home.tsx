import { useState, useEffect } from 'react';
import { Link } from "react-router-dom"; 
import { useParticipantes } from "../context/ParticipantesContext"; 
import { useAuth } from "../context/AuthContext";
import ParticipanteCard from "../components/ParticipanteCard"; 
import Filtros, { FiltrosState } from '../components/Filtros';
import { useDebounce } from '../hooks/useDebounce';

interface Compra {
  id: number;
  payment_id: string;
  curso_titulo: string;
  curso_precio: number;
  status: string;
  fecha: string;
}

export default function Home() { 
  const { participantes, resetear } = useParticipantes(); 
  const { user } = useAuth(); 

  const [filtros, setFiltros] = useState<FiltrosState>({
    busqueda: '',
    nivel: 'Todos',
    modalidad: 'Todas',
  });

  const [compras, setCompras] = useState<Compra[]>([]);

  useEffect(() => {
    const fetchCompras = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const res = await fetch('http://localhost:8000/api/compras/me', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (res.ok) {
          const data = await res.json();
          setCompras(data.filter((c: Compra) => c.status === 'approved'));
        }
      } catch (err) {
        console.log('No se pudieron cargar las compras');
      }
    };
    fetchCompras();
  }, []);

  // PARTE 3 - Custom Hook para debouncing y mejorar UX
  const debouncedFiltros = {
    ...filtros,
    busqueda: useDebounce(filtros.busqueda, 300)
  };

  const filtrados = participantes.filter(p => {
    const matchNombre = p.nombre.toLowerCase().includes(debouncedFiltros.busqueda.toLowerCase());
    const matchNivel = debouncedFiltros.nivel === 'Todos' || p.nivel === debouncedFiltros.nivel;
    const matchModalidad = debouncedFiltros.modalidad === 'Todas' || p.modalidad === debouncedFiltros.modalidad;
    return matchNombre && matchNivel && matchModalidad;
  });

  return ( 
    <div> 
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div className="contador-total">
          Participantes registrados: {participantes.length}
        </div>
        {user?.rol === 'ADMIN' && (
          <Link to="/nuevo" className="btn-registrar" style={{ textDecoration: 'none' }}>
            Nuevo participante
          </Link> 
        )}
      </div>

      {compras.length > 0 && (
        <div style={{
          background: 'linear-gradient(135deg, #009ee3, #0077b6)',
          color: 'white',
          padding: '20px',
          borderRadius: '12px',
          marginBottom: '30px',
          boxShadow: '0 4px 15px rgba(0, 158, 227, 0.3)'
        }}>
          <h3 style={{ margin: '0 0 15px 0', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span>🎓</span> Mis Cursos Adquiridos
          </h3>
          <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
            {compras.map(compra => (
              <div key={compra.id} style={{
                background: 'rgba(255, 255, 255, 0.15)',
                padding: '10px 20px',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                fontWeight: 'bold',
                backdropFilter: 'blur(5px)'
              }}>
                ✓ {compra.curso_titulo}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="filtros-wrapper">
        <Filtros filtros={filtros} setFiltros={setFiltros} />
      </div>

      <div className="contador-filtrado">
        Mostrando {filtrados.length} de {participantes.length} participantes
      </div>

      {filtrados.length === 0 ? (
        <div className="vacio">No hay participantes registrados aún</div>
      ) : (
        <div className="cards-grid"> 
          {filtrados.map(p => ( 
            <ParticipanteCard key={p.id} participante={p} /> 
          ))} 
        </div> 
      )}

      <div className="resetear-wrapper">
        <button className="btn-resetear" onClick={resetear}>Resetear datos</button>
      </div>
    </div> 
  ); 
} 
