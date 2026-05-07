import { useNavigate } from 'react-router-dom';
import { useParticipantes } from '../context/ParticipantesContext';
import { Participante } from '../models/Participante';

const NIVEL_COLOR: Record<string, string> = {
  Principiante: '#28a745',
  Intermedio: '#e6a817',
  Avanzado: '#dc3545',
};

const CARD_COLORS = ['#fffde7', '#fce4ec', '#e8f5e9', '#e3f2fd', '#f3e5f5', '#fff3e0'];

function getCardColor(id: string): string {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash += id.charCodeAt(i);
  return CARD_COLORS[hash % CARD_COLORS.length];
}

export default function ParticipanteCard({ participante }: { participante: Participante }) {
  const { id, nombre, pais, modalidad, nivel, tecnologias } = participante;
  const nivelColor = NIVEL_COLOR[nivel] ?? '#555';
  const cardColor = getCardColor(id);

  const esPerfil = nivel === 'Avanzado';

  const { eliminar } = useParticipantes();
  const navigate = useNavigate();

  return (
    <div className="card" style={{ backgroundColor: cardColor }}>
      <div className="card-nombre">{nombre}</div>
      <div className="card-pais">{pais}</div>
      <div className="card-info"><strong>Modalidad:</strong> {modalidad}</div>
      <div className="card-nivel" style={{ color: nivelColor }}>
        Nivel: {nivel}
      </div>
      {tecnologias.length > 0 && (
        <div className="card-tecs">{tecnologias.join(', ')}</div>
      )}
      {esPerfil && (
        <div className="card-perfil" style={{ color: nivelColor }}>Perfil Avanzado</div>
      )}
      <div style={{ display: 'flex', gap: '8px', marginTop: '15px' }}>
        <button className="btn-editar" onClick={() => navigate(`/editar/${id}`)} style={{ flex: 1, backgroundColor: '#f1c40f', color: '#fff', padding: '8px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          Editar
        </button>
        <button className="btn-eliminar" onClick={() => eliminar(id)} style={{ flex: 1 }}>
          Eliminar
        </button>
      </div>
    </div>
  );
}
