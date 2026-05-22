import { useParams, useNavigate, Link } from "react-router-dom"; 
import { useEffect } from "react"; 
import { useParticipantes } from "../context/ParticipantesContext"; 
import Formulario from "../components/Formulario"; 

export default function EditarPage() { 
  const { id } = useParams(); 
  const navigate = useNavigate(); 
  const { participantes, seleccionar } = useParticipantes(); 

  useEffect(() => { 
    const participante = participantes.find(p => p.id === id);
    if (participante) { 
      seleccionar(participante); 
    } 
  }, [id, participantes, seleccionar]); 

  return ( 
    <div> 
      <h2>Editar Participante</h2>
      <br />
      <Formulario onSuccess={() => navigate("/")} /> 
    </div> 
  ); 
} 
