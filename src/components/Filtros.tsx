import { Nivel, Modalidad } from '../models/Participante';

export interface FiltrosState {
  busqueda: string;
  nivel: Nivel | 'Todos';
  modalidad: Modalidad | 'Todas';
}

interface FiltrosProps {
  filtros: FiltrosState;
  setFiltros: (f: FiltrosState) => void;
}

const NIVELES: Array<Nivel | 'Todos'> = ['Todos', 'Principiante', 'Intermedio', 'Avanzado'];
const MODALIDADES: Array<Modalidad | 'Todas'> = ['Todas', 'Presencial', 'Virtual', 'Híbrido'];

export default function Filtros({ filtros, setFiltros }: FiltrosProps) {
  const limpiar = () => {
    setFiltros({ busqueda: '', nivel: 'Todos', modalidad: 'Todas' });
  };

  return (
    <div className="filtros">
      <input
        type="text"
        placeholder="Buscar"
        value={filtros.busqueda}
        onChange={e => setFiltros({ ...filtros, busqueda: e.target.value })}
      />
      <select
        value={filtros.modalidad}
        onChange={e => setFiltros({ ...filtros, modalidad: e.target.value as Modalidad | 'Todas' })}
      >
        {MODALIDADES.map(m => <option key={m}>{m}</option>)}
      </select>
      <select
        value={filtros.nivel}
        onChange={e => setFiltros({ ...filtros, nivel: e.target.value as Nivel | 'Todos' })}
      >
        {NIVELES.map(n => <option key={n}>{n}</option>)}
      </select>
      <button className="btn-limpiar" onClick={limpiar}>Limpiar filtros</button>
    </div>
  );
}
