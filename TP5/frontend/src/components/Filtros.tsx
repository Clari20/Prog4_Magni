import { useRef, useId } from 'react';
import { Nivel, Modalidad } from '../models/Participante';
import { useKeyboardShortcut } from '../hooks/useKeyboardShortcut';

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
  // PARTE 1 - useRef para foco
  const inputBusquedaRef = useRef<HTMLInputElement>(null);
  
  // PARTE 2 - useId para accesibilidad (buena práctica aunque el PDF pida principalmente en formulario)
  const busquedaId = useId();
  const modalidadId = useId();
  const nivelId = useId();

  // PARTE 3 - Custom Hook para atajo de teclado (Ctrl + B)
  useKeyboardShortcut('b', true, () => {
    inputBusquedaRef.current?.focus();
  });

  const limpiar = () => {
    setFiltros({ busqueda: '', nivel: 'Todos', modalidad: 'Todas' });
  };

  return (
    <div className="filtros">
      <div style={{display: 'flex', flexDirection: 'column'}}>
        <label htmlFor={busquedaId} className="sr-only" style={{fontSize: '0.8rem', color: '#666', marginBottom: '2px'}}>Buscar (Ctrl+B)</label>
        <input
          id={busquedaId}
          ref={inputBusquedaRef}
          type="text"
          placeholder="Buscar..."
          value={filtros.busqueda}
          onChange={e => setFiltros({ ...filtros, busqueda: e.target.value })}
        />
      </div>
      <div style={{display: 'flex', flexDirection: 'column'}}>
        <label htmlFor={modalidadId} className="sr-only" style={{fontSize: '0.8rem', color: '#666', marginBottom: '2px'}}>Modalidad</label>
        <select
          id={modalidadId}
          value={filtros.modalidad}
          onChange={e => setFiltros({ ...filtros, modalidad: e.target.value as Modalidad | 'Todas' })}
        >
          {MODALIDADES.map(m => <option key={m}>{m}</option>)}
        </select>
      </div>
      <div style={{display: 'flex', flexDirection: 'column'}}>
        <label htmlFor={nivelId} className="sr-only" style={{fontSize: '0.8rem', color: '#666', marginBottom: '2px'}}>Nivel</label>
        <select
          id={nivelId}
          value={filtros.nivel}
          onChange={e => setFiltros({ ...filtros, nivel: e.target.value as Nivel | 'Todos' })}
        >
          {NIVELES.map(n => <option key={n}>{n}</option>)}
        </select>
      </div>
      <button className="btn-limpiar" onClick={limpiar} style={{alignSelf: 'flex-end', marginBottom: '2px'}}>Limpiar filtros</button>
    </div>
  );
}
