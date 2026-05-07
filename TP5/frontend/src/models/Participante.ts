export type Modalidad = 'Presencial' | 'Virtual' | 'Híbrido';
export type Nivel = 'Principiante' | 'Intermedio' | 'Avanzado';

export class Participante {
  id: string;
  nombre: string;
  email: string;
  edad: number;
  pais: string;
  modalidad: Modalidad;
  tecnologias: string[];
  nivel: Nivel;
  aceptaTerminos: boolean;

  constructor(
    nombre: string,
    email: string,
    edad: number,
    pais: string,
    modalidad: Modalidad,
    tecnologias: string[],
    nivel: Nivel,
    aceptaTerminos: boolean
  ) {
    this.id = crypto.randomUUID();
    this.nombre = nombre;
    this.email = email;
    this.edad = edad;
    this.pais = pais;
    this.modalidad = modalidad;
    this.tecnologias = tecnologias;
    this.nivel = nivel;
    this.aceptaTerminos = aceptaTerminos;
  }
}
