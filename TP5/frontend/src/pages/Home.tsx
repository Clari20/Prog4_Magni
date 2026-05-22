import { useState } from 'react';
import { Link } from "react-router-dom"; 
import { useParticipantes } from "../context/ParticipantesContext"; 
import { useAuth } from "../context/AuthContext";
import ParticipanteCard from "../components/ParticipanteCard"; 
import Filtros, { FiltrosState } from '../components/Filtros';
import { useDebounce } from '../hooks/useDebounce';

export default function Home() { 
  const { participantes, resetear } = useParticipantes(); 
  const { user } = useAuth(); 

  const [filtros, setFiltros] = useState<FiltrosState>({
    busqueda: '',
    nivel: 'Todos',
    modalidad: 'Todas',
  });

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
