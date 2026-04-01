import { useState, useEffect } from 'react';
import { Participante } from './models/Participante';
import Formulario from './components/Formulario';
import Filtros, { FiltrosState } from './components/Filtros';
import ParticipanteCard from './components/ParticipanteCard';

const STORAGE_KEY = 'participantes';

function toParticipante(obj: Participante): Participante {
  const p = new Participante(
    obj.nombre, obj.email, obj.edad, obj.pais,
    obj.modalidad, obj.tecnologias, obj.nivel, obj.aceptaTerminos
  );
  p.id = obj.id;
  return p;
}

export default function App() {
  const [participantes, setParticipantes] = useState<Participante[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as Participante[];
        return parsed.map(toParticipante);
      }
    } catch {
      // ignore
    }
    return [];
  });

  const [filtros, setFiltros] = useState<FiltrosState>({
    busqueda: '',
    nivel: 'Todos',
    modalidad: 'Todas',
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(participantes));
  }, [participantes]);

  const agregar = (p: Participante) => {
    setParticipantes(prev => [...prev, p]);
  };

  const eliminar = (id: string) => {
    setParticipantes(prev => prev.filter(p => p.id !== id));
  };

  const resetear = () => {
    localStorage.removeItem(STORAGE_KEY);
    setParticipantes([]);
  };

  const filtrados = participantes.filter(p => {
    const matchNombre = p.nombre.toLowerCase().includes(filtros.busqueda.toLowerCase());
    const matchNivel = filtros.nivel === 'Todos' || p.nivel === filtros.nivel;
    const matchModalidad = filtros.modalidad === 'Todas' || p.modalidad === filtros.modalidad;
    return matchNombre && matchNivel && matchModalidad;
  });

  return (
    <div className="app">
      <header className="header">
        <span>Registro de Participantes</span>
      </header>

      <main className="container">
        <div className="contador-total">
          Participantes registrados: {participantes.length}
        </div>

        <Formulario onAgregar={agregar} />

        <div className="filtros-wrapper">
          <Filtros filtros={filtros} setFiltros={setFiltros} />
        </div>

        <div className="contador-filtrado">
          Mostrando {filtrados.length} de {participantes.length} participantes
        </div>

        {filtrados.length === 0 ? (
          <div className="vacio">No hay participantes</div>
        ) : (
          <div className="cards-grid">
            {filtrados.map(p => (
              <ParticipanteCard key={p.id} participante={p} onEliminar={eliminar} />
            ))}
          </div>
        )}

        <div className="resetear-wrapper">
          <button className="btn-resetear" onClick={resetear}>Resetear datos</button>
        </div>
      </main>
    </div>
  );
}
