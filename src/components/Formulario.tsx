import { useState } from 'react';
import { Participante, Modalidad, Nivel } from '../models/Participante';

interface FormularioProps {
  onAgregar: (p: Participante) => void;
}

const PAISES = ['Argentina', 'Brasil', 'Chile', 'Colombia', 'México', 'Perú', 'Uruguay', 'España', 'Otro'];
const TECNOLOGIAS = ['React', 'Angular', 'Vue', 'Node', 'Python', 'Java'];
const NIVELES: Nivel[] = ['Principiante', 'Intermedio', 'Avanzado'];
const MODALIDADES: Modalidad[] = ['Presencial', 'Virtual', 'Híbrido'];

export default function Formulario({ onAgregar }: FormularioProps) {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [edad, setEdad] = useState('');
  const [pais, setPais] = useState('Argentina');
  const [modalidad, setModalidad] = useState<Modalidad>('Presencial');
  const [tecnologias, setTecnologias] = useState<string[]>([]);
  const [nivel, setNivel] = useState<Nivel>('Principiante');
  const [aceptaTerminos, setAceptaTerminos] = useState(false);
  const [error, setError] = useState('');

  const toggleTecnologia = (tec: string) => {
    setTecnologias(prev =>
      prev.includes(tec) ? prev.filter(t => t !== tec) : [...prev, tec]
    );
  };

  const handleSubmit = () => {
    if (!nombre.trim() || !email.trim() || !edad) {
      setError('Por favor completá nombre, email y edad.');
      return;
    }
    if (!aceptaTerminos) {
      setError('Debés aceptar los términos.');
      return;
    }
    setError('');
    const nuevo = new Participante(
      nombre.trim(),
      email.trim(),
      Number(edad),
      pais,
      modalidad,
      tecnologias,
      nivel,
      aceptaTerminos
    );
    onAgregar(nuevo);
    setNombre('');
    setEmail('');
    setEdad('');
    setPais('Argentina');
    setModalidad('Presencial');
    setTecnologias([]);
    setNivel('Principiante');
    setAceptaTerminos(false);
  };

  return (
    <div className="formulario">
      {error && <div className="error-msg">{error}</div>}

      <div className="form-row">
        <input
          type="text"
          placeholder="Nombre"
          value={nombre}
          onChange={e => setNombre(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
      </div>

      <div className="form-row">
        <input
          type="number"
          placeholder="Edad"
          value={edad}
          onChange={e => setEdad(e.target.value)}
        />
        <select value={pais} onChange={e => setPais(e.target.value)}>
          {PAISES.map(p => <option key={p}>{p}</option>)}
        </select>
      </div>

      <div className="form-group">
        <label className="form-label">Modalidad</label>
        <div className="radio-group">
          {MODALIDADES.map(m => (
            <label key={m} className="radio-label">
              <input
                type="radio"
                name="modalidad"
                value={m}
                checked={modalidad === m}
                onChange={() => setModalidad(m)}
              />
              {m}
            </label>
          ))}
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Tecnologías</label>
        <div className="checkbox-grid">
          {TECNOLOGIAS.map(tec => (
            <label key={tec} className="checkbox-label">
              <input
                type="checkbox"
                checked={tecnologias.includes(tec)}
                onChange={() => toggleTecnologia(tec)}
              />
              {tec}
            </label>
          ))}
        </div>
      </div>

      <div className="form-row">
        <select value={nivel} onChange={e => setNivel(e.target.value as Nivel)}>
          {NIVELES.map(n => <option key={n}>{n}</option>)}
        </select>
      </div>

      <div className="form-group">
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={aceptaTerminos}
            onChange={e => setAceptaTerminos(e.target.checked)}
          />
          Acepto términos
        </label>
      </div>

      <button className="btn-registrar" onClick={handleSubmit}>
        Registrar
      </button>
    </div>
  );
}
