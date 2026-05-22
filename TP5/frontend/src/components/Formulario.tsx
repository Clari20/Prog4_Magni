import { useState, useEffect, useRef, useId } from 'react';
import { Participante, Modalidad, Nivel } from '../models/Participante';
import { useParticipantes } from '../context/ParticipantesContext';

interface FormularioProps {
  onSuccess?: () => void;
}

const PAISES = ['Argentina', 'Brasil', 'Chile', 'Colombia', 'México', 'Perú', 'Uruguay', 'España', 'Otro'];
const TECNOLOGIAS = ['React', 'Angular', 'Vue', 'Node', 'Python', 'Java'];
const NIVELES: Nivel[] = ['Principiante', 'Intermedio', 'Avanzado'];
const MODALIDADES: Modalidad[] = ['Presencial', 'Virtual', 'Híbrido'];

export default function Formulario({ onSuccess }: FormularioProps) {
  const { agregar, actualizar, participanteEditando } = useParticipantes();

  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [edad, setEdad] = useState('');
  const [pais, setPais] = useState('Argentina');
  const [modalidad, setModalidad] = useState<Modalidad>('Presencial');
  const [tecnologias, setTecnologias] = useState<string[]>([]);
  const [nivel, setNivel] = useState<Nivel>('Principiante');
  const [aceptaTerminos, setAceptaTerminos] = useState(false);
  const [error, setError] = useState('');

  // PARTE 1 - useRef para foco automático
  const nombreRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Al ingresar a la pantalla, dar foco automático al input Nombre
    nombreRef.current?.focus();
  }, []);

  // PARTE 2 - useId para generar identificadores únicos accesibles
  const nombreId = useId();
  const emailId = useId();
  const edadId = useId();
  const paisId = useId();
  const nivelId = useId();
  const terminosId = useId();
  // Para las opciones de radio y checkbox es ideal generarlos dinámicamente o con un prefijo del id base
  const formBaseId = useId();

  useEffect(() => {
    if (participanteEditando) {
      setNombre(participanteEditando.nombre);
      setEmail(participanteEditando.email);
      setEdad(participanteEditando.edad.toString());
      setPais(participanteEditando.pais);
      setModalidad(participanteEditando.modalidad);
      setTecnologias(participanteEditando.tecnologias);
      setNivel(participanteEditando.nivel);
      setAceptaTerminos(participanteEditando.aceptaTerminos);
    }
  }, [participanteEditando]);

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
    
    const participante = new Participante(
      nombre.trim(),
      email.trim(),
      Number(edad),
      pais,
      modalidad,
      tecnologias,
      nivel,
      aceptaTerminos
    );

    if (participanteEditando) {
      participante.id = participanteEditando.id;
      actualizar(participante);
    } else {
      agregar(participante);
    }

    if (onSuccess) {
      onSuccess();
    } else {
      setNombre('');
      setEmail('');
      setEdad('');
      setPais('Argentina');
      setModalidad('Presencial');
      setTecnologias([]);
      setNivel('Principiante');
      setAceptaTerminos(false);
      
      // Devolver foco al nombre luego de guardar y resetear
      nombreRef.current?.focus();
    }
  };

  return (
    <div className="formulario">
      {error && <div className="error-msg">{error}</div>}

      <div className="form-row">
        <div style={{display: 'flex', flexDirection: 'column', flex: 1}}>
          <label htmlFor={nombreId} className="form-label">Nombre</label>
          <input
            id={nombreId}
            ref={nombreRef}
            type="text"
            placeholder="Nombre"
            value={nombre}
            onChange={e => setNombre(e.target.value)}
          />
        </div>
        <div style={{display: 'flex', flexDirection: 'column', flex: 1}}>
          <label htmlFor={emailId} className="form-label">Email</label>
          <input
            id={emailId}
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
        </div>
      </div>

      <div className="form-row">
        <div style={{display: 'flex', flexDirection: 'column', flex: 1}}>
          <label htmlFor={edadId} className="form-label">Edad</label>
          <input
            id={edadId}
            type="number"
            placeholder="Edad"
            value={edad}
            onChange={e => setEdad(e.target.value)}
          />
        </div>
        <div style={{display: 'flex', flexDirection: 'column', flex: 1}}>
          <label htmlFor={paisId} className="form-label">País</label>
          <select id={paisId} value={pais} onChange={e => setPais(e.target.value)}>
            {PAISES.map(p => <option key={p}>{p}</option>)}
          </select>
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Modalidad</label>
        <div className="radio-group">
          {MODALIDADES.map((m, index) => {
            const radioId = `${formBaseId}-mod-${index}`;
            return (
              <label key={m} htmlFor={radioId} className="radio-label">
                <input
                  id={radioId}
                  type="radio"
                  name="modalidad"
                  value={m}
                  checked={modalidad === m}
                  onChange={() => setModalidad(m)}
                />
                {m}
              </label>
            );
          })}
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Tecnologías</label>
        <div className="checkbox-grid">
          {TECNOLOGIAS.map((tec, index) => {
            const checkId = `${formBaseId}-tec-${index}`;
            return (
              <label key={tec} htmlFor={checkId} className="checkbox-label">
                <input
                  id={checkId}
                  type="checkbox"
                  checked={tecnologias.includes(tec)}
                  onChange={() => toggleTecnologia(tec)}
                />
                {tec}
              </label>
            );
          })}
        </div>
      </div>

      <div className="form-row">
        <div style={{display: 'flex', flexDirection: 'column', flex: 1}}>
          <label htmlFor={nivelId} className="form-label">Nivel</label>
          <select id={nivelId} value={nivel} onChange={e => setNivel(e.target.value as Nivel)}>
            {NIVELES.map(n => <option key={n}>{n}</option>)}
          </select>
        </div>
      </div>

      <div className="form-group">
        <label htmlFor={terminosId} className="checkbox-label">
          <input
            id={terminosId}
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
