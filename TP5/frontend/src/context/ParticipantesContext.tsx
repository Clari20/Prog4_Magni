import React, { createContext, useReducer, useEffect, ReactNode, useState, useContext } from 'react';
import { Participante } from '../models/Participante';
import { participantesReducer } from './ParticipantesReducer';
import { useAuth } from './AuthContext';

interface ContextType {
  participantes: Participante[];
  agregar: (p: Participante) => void;
  eliminar: (id: string) => void;
  actualizar: (p: Participante) => void;
  resetear: () => void;
  participanteEditando: Participante | null;
  setParticipanteEditando: (p: Participante | null) => void;
  seleccionar: (p: Participante | null) => void;
}

export const ParticipantesContext = createContext<ContextType | undefined>(undefined);

const API_URL = 'http://localhost:8000/participantes';

export const ParticipantesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [participantes, dispatch] = useReducer(participantesReducer, []);
  const [participanteEditando, setParticipanteEditando] = useState<Participante | null>(null);
  const { token } = useAuth();

  const getHeaders = () => {
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    return headers;
  };

  const getHeadersDelete = () => {
    const headers: Record<string, string> = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;
    return headers;
  };

  const fetchParticipantes = async () => {
    try {
      const res = await fetch(API_URL, { headers: getHeadersDelete() });
      if (!res.ok) throw new Error("Error en la respuesta");
      const data = await res.json();
      const loaded = data.map((obj: any) => {
        const p = new Participante(
          obj.nombre, obj.email, obj.edad, obj.pais,
          obj.modalidad, obj.tecnologias, obj.nivel, obj.aceptaTerminos
        );
        p.id = obj.id;
        return p;
      });
      dispatch({ type: "GET_PARTICIPANTES", payload: loaded });
    } catch (err) {
      console.error("Error al cargar participantes:", err);
    }
  };

  useEffect(() => {
    fetchParticipantes();
  }, []);

  const agregar = async (p: Participante) => {
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(p)
      });
      if (res.ok) {
        dispatch({ type: "AGREGAR", payload: p });
      } else {
        console.error("Error al agregar en la DB");
      }
    } catch (err) {
      console.error("Fetch error al agregar:", err);
    }
  };

  const eliminar = async (id: string) => {
    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
        headers: getHeadersDelete()
      });
      if (res.ok) {
        dispatch({ type: "ELIMINAR", payload: id });
      }
    } catch (err) {
      console.error("Error al eliminar participante:", err);
    }
  };

  const actualizar = async (p: Participante) => {
    try {
      const res = await fetch(`${API_URL}/${p.id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(p)
      });
      if (res.ok) {
        dispatch({ type: "EDITAR", payload: p });
        setParticipanteEditando(null);  // Clear edit state after update
      } else {
        console.error("Error al actualizar en la DB");
      }
    } catch (err) {
      console.error("Fetch error al actualizar:", err);
    }
  };

  const resetear = () => {
    dispatch({ type: "RESET", payload: [] });
  };

  return (
    <ParticipantesContext.Provider value={{ 
      participantes, 
      agregar, 
      eliminar, 
      actualizar, 
      resetear,
      participanteEditando,
      setParticipanteEditando,
      seleccionar: setParticipanteEditando
    }}>
      {children}
    </ParticipantesContext.Provider>
  );
};

export const useParticipantes = () => {
  const context = useContext(ParticipantesContext);
  if (context === undefined) {
    throw new Error('useParticipantes must be used within a ParticipantesProvider');
  }
  return context;
};
