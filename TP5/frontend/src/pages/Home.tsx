import { useState } from 'react';
import { Link } from "react-router-dom"; 
import { useParticipantes } from "../context/ParticipantesContext"; 
import { useAuth } from "../context/AuthContext";
import ParticipanteCard from "../components/ParticipanteCard"; 
import Filtros, { FiltrosState } from '../components/Filtros';

export default function Home() { 
  const { participantes, resetear } = useParticipantes(); 
  const { user } = useAuth(); 

  const [filtros, setFiltros] = useState<FiltrosState>({
    busqueda: '',
    nivel: 'Todos',
    modalidad: 'Todas',
  });

  const filtrados = participantes.filter(p => {
    const matchNombre = p.nombre.toLowerCase().includes(filtros.busqueda.toLowerCase());
    const matchNivel = filtros.nivel === 'Todos' || p.nivel === filtros.nivel;
    const matchModalidad = filtros.modalidad === 'Todas' || p.modalidad === filtros.modalidad;
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
