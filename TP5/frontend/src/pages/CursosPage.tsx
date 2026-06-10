import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const CURSOS = [
  { id: 1, titulo: "Curso React", precio: 25000 },
  { id: 2, titulo: "Curso DBA", precio: 40000 },
  { id: 3, titulo: "Curso Node.js", precio: 30000 },
  { id: 4, titulo: "Curso Python", precio: 20000 },
  { id: 5, titulo: "Curso AWS", precio: 50000 },
  { id: 6, titulo: "Curso Docker", precio: 35000 },
];

interface Compra {
  id: number;
  payment_id: string;
  curso_titulo: string;
  curso_precio: number;
  status: string;
  fecha: string;
}

export default function CursosPage() {
  const [loadingId, setLoadingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [compras, setCompras] = useState<Compra[]>([]);

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const status = searchParams.get('status');

  useEffect(() => {
    fetchCompras();
  }, []);

  useEffect(() => {
    if (status === 'success') {
      fetchCompras();
    }
  }, [status]);

  const fetchCompras = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const res = await fetch('http://localhost:8000/api/compras/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        setCompras(data);
      }
    } catch (err) {
      console.log('No se pudieron cargar las compras');
    }
  };

  const isCursoComprado = (titulo: string) => {
    return compras.some(c => c.curso_titulo === titulo && c.status === 'approved');
  };

  const handlePagar = async (cursoId: number, titulo: string, precio: number) => {
    setLoadingId(cursoId);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8000/api/pagos/create-preference', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ titulo, precio }),
      });

      if (!response.ok) {
        throw new Error('Error al crear la preferencia de pago');
      }

      const data = await response.json();
      if (data.init_point) {
        window.location.href = data.init_point;
      } else {
        throw new Error('No se recibió el link de pago desde el backend');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div>
      <h2 style={{ marginBottom: '20px' }}>Nuestros Cursos (Integración MP)</h2>
      
      {status === 'success' && (
        <div style={{ background: '#d4edda', color: '#155724', padding: '15px', marginBottom: '20px', borderRadius: '5px' }}>
          <strong>¡Excelente!</strong> El pago fue aprobado y ya estás inscripto al curso.
        </div>
      )}
      {status === 'failure' && (
        <div style={{ background: '#f8d7da', color: '#721c24', padding: '15px', marginBottom: '20px', borderRadius: '5px' }}>
          <strong>Ups...</strong> El pago fue rechazado o cancelado. Intentá de nuevo.
        </div>
      )}
      {status === 'pending' && (
        <div style={{ background: '#fff3cd', color: '#856404', padding: '15px', marginBottom: '20px', borderRadius: '5px' }}>
          <strong>Pendiente:</strong> Tu pago está en proceso de acreditación.
        </div>
      )}
      {error && (
        <div style={{ background: '#f8d7da', color: '#721c24', padding: '15px', marginBottom: '20px', borderRadius: '5px' }}>
          {error}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
        {CURSOS.map(curso => {
          const comprado = isCursoComprado(curso.titulo);
          return (
            <div key={curso.id} style={{
              border: comprado ? '2px solid #28a745' : '1px solid #ddd',
              padding: '20px',
              borderRadius: '8px',
              textAlign: 'center',
              boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
              background: comprado ? '#f0fff0' : 'white',
              position: 'relative',
            }}>
              {comprado && (
                <div style={{
                  position: 'absolute',
                  top: '10px',
                  right: '10px',
                  background: '#28a745',
                  color: 'white',
                  padding: '4px 10px',
                  borderRadius: '12px',
                  fontSize: '0.8em',
                  fontWeight: 'bold',
                }}>
                  ✓ COMPRADO
                </div>
              )}
              <h3 style={{ margin: '0 0 10px 0', color: '#333' }}>{curso.titulo}</h3>
              <p style={{ fontSize: '1.5em', fontWeight: 'bold', color: comprado ? '#28a745' : '#009ee3', margin: '10px 0' }}>
                ${curso.precio.toLocaleString('es-AR')}
              </p>
              {comprado ? (
                <button
                  disabled
                  style={{
                    backgroundColor: '#28a745',
                    color: 'white',
                    border: 'none',
                    padding: '12px 20px',
                    borderRadius: '6px',
                    width: '100%',
                    fontWeight: 'bold',
                    fontSize: '1em',
                    cursor: 'default',
                  }}
                >
                  ✓ YA ESTÁS INSCRIPTO
                </button>
              ) : (
                <button
                  onClick={() => handlePagar(curso.id, curso.titulo, curso.precio)}
                  disabled={loadingId === curso.id}
                  style={{
                    backgroundColor: '#009ee3',
                    color: 'white',
                    border: 'none',
                    padding: '12px 20px',
                    borderRadius: '6px',
                    cursor: loadingId === curso.id ? 'not-allowed' : 'pointer',
                    width: '100%',
                    fontWeight: 'bold',
                    fontSize: '1em',
                    opacity: loadingId === curso.id ? 0.7 : 1,
                    transition: 'background 0.2s'
                  }}
                >
                  {loadingId === curso.id ? 'Conectando con MP...' : 'QUIERO ESTE CURSO'}
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
