import { useNavigate, Link } from "react-router-dom"; 
import { useEffect } from "react";
import Formulario from "../components/Formulario"; 
import { useParticipantes } from "../context/ParticipantesContext";

export default function FormularioPage() { 
  const navigate = useNavigate(); 
  const { seleccionar } = useParticipantes();

  useEffect(() => {
    seleccionar(null);
  }, [seleccionar]);

  return ( 
    <div> 
      <h2>Nuevo Participante</h2>
      <br />
      <Formulario onSuccess={() => navigate("/")} /> 
    </div> 
  ); 
} 
