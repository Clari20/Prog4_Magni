import { useState, useEffect } from "react";

// ─── Tipos ────────────────────────────────────────────────────────────────────
interface Participante {
  id: number;
  nombre: string;
  email: string;
  edad: number | "";
  pais: string;
  modalidad: string;
  tecnologias: string[];
  nivel: string;
  aceptaTerminos: boolean;
}

// ─── Constantes ───────────────────────────────────────────────────────────────
const PAISES = ["Argentina", "Chile", "Uruguay", "México", "España"];
const MODALIDADES = ["Presencial", "Virtual", "Híbrido"];
const TECNOLOGIAS = ["React", "Angular", "Vue", "Node", "Python", "Java"];
const NIVELES = ["Principiante", "Intermedio", "Avanzado"];

const FORM_INICIAL: Omit<Participante, "id"> = {
  nombre: "",
  email: "",
  edad: "",
  pais: "Argentina",
  modalidad: "Presencial",
  tecnologias: [],
  nivel: "Principiante",
  aceptaTerminos: false,
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
function colorNivel(nivel: string): string {
  switch (nivel) {
    case "Principiante":
      return "text-green-600 font-semibold";
    case "Intermedio":
      return "text-yellow-600 font-semibold";
    case "Avanzado":
      return "text-red-600 font-semibold";
    default:
      return "";
  }
}

function bgNivel(nivel: string): string {
  switch (nivel) {
    case "Principiante":
      return "bg-green-50 border-green-200";
    case "Intermedio":
      return "bg-yellow-50 border-yellow-200";
    case "Avanzado":
      return "bg-red-50 border-red-200";
    default:
      return "bg-white border-gray-200";
  }
}

// ─── Componente principal ─────────────────────────────────────────────────────
export default function App() {
  // Estado: lista de participantes (cargada desde localStorage)
  const [participantes, setParticipantes] = useState<Participante[]>(() => {
    const guardados = localStorage.getItem("participantes");
    return guardados ? JSON.parse(guardados) : [];
  });

  // Estado: formulario
  const [form, setForm] = useState<Omit<Participante, "id">>(FORM_INICIAL);

  // Estado: filtros
  const [busqueda, setBusqueda] = useState("");
  const [filtroModalidad, setFiltroModalidad] = useState("");
  const [filtroNivel, setFiltroNivel] = useState("");

  // Persistencia: guardar en localStorage cada vez que cambia la lista
  useEffect(() => {
    localStorage.setItem("participantes", JSON.stringify(participantes));
  }, [participantes]);

  // ── Handlers del formulario ────────────────────────────────────────────────

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) {
    const { name, value, type } = e.target;

    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      if (name === "aceptaTerminos") {
        setForm((prev) => ({ ...prev, aceptaTerminos: checked }));
      } else {
        // Checkboxes de tecnologías
        setForm((prev) => ({
          ...prev,
          tecnologias: checked
            ? [...prev.tecnologias, value]
            : prev.tecnologias.filter((t) => t !== value),
        }));
      }
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  }

  function handleSubmit() {
    // Validación básica
    if (!form.nombre || !form.email || !form.edad) {
      alert("Por favor completá nombre, email y edad.");
      return;
    }
    if (!form.aceptaTerminos) {
      alert("Debés aceptar los términos y condiciones.");
      return;
    }

    const nuevo: Participante = {
      ...form,
      id: Date.now(),
      edad: Number(form.edad),
    };

    setParticipantes((prev) => [...prev, nuevo]);
    setForm(FORM_INICIAL);
  }

  function eliminarParticipante(id: number) {
    setParticipantes((prev) => prev.filter((p) => p.id !== id));
  }

  // ── Filtrado ───────────────────────────────────────────────────────────────
  const participantesFiltrados = participantes.filter((p) => {
    const coincideNombre = p.nombre
      .toLowerCase()
      .includes(busqueda.toLowerCase());
    const coincideModalidad = filtroModalidad
      ? p.modalidad === filtroModalidad
      : true;
    const coincideNivel = filtroNivel ? p.nivel === filtroNivel : true;
    return coincideNombre && coincideModalidad && coincideNivel;
  });

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-green-600 text-white p-4 shadow">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">
            Registro de Participantes
          </h1>
          <span className="bg-white text-green-700 text-sm font-semibold px-3 py-1 rounded-full">
            Participantes registrados: {participantes.length}
          </span>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-6 space-y-8">
        {/* ── Formulario de inscripción ──────────────────────────────────────── */}
        <section className="bg-white shadow rounded-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Nombre */}
            <div className="flex flex-col gap-1">
              <input
                type="text"
                name="nombre"
                placeholder="Nombre"
                value={form.nombre}
                onChange={handleChange}
                className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
              />
            </div>

            {/* Email */}
            <div className="flex flex-col gap-1">
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
                className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
              />
            </div>

            {/* Edad */}
            <div className="flex flex-col gap-1">
              <input
                type="number"
                name="edad"
                placeholder="Edad"
                value={form.edad}
                onChange={handleChange}
                className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
              />
            </div>

            {/* País */}
            <div className="flex flex-col gap-1">
              <select
                name="pais"
                value={form.pais}
                onChange={handleChange}
                className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400 bg-white"
              >
                {PAISES.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>

            {/* Modalidad – ocupa columna completa */}
            <div className="md:col-span-2">
              <p className="font-semibold text-green-700 mb-1">Modalidad</p>
              <div className="flex gap-4">
                {MODALIDADES.map((m) => (
                  <label
                    key={m}
                    className="flex items-center gap-1 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="modalidad"
                      value={m}
                      checked={form.modalidad === m}
                      onChange={handleChange}
                      className="accent-green-600"
                    />
                    {m}
                  </label>
                ))}
              </div>
            </div>

            {/* Tecnologías – ocupa columna completa */}
            <div className="md:col-span-2">
              <p className="font-semibold text-green-700 mb-1">Tecnologías</p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {TECNOLOGIAS.map((tec) => (
                  <label
                    key={tec}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      name="tecnologias"
                      value={tec}
                      checked={form.tecnologias.includes(tec)}
                      onChange={handleChange}
                      className="accent-green-600"
                    />
                    {tec}
                  </label>
                ))}
              </div>
            </div>

            {/* Nivel de experiencia */}
            <div className="md:col-span-2">
              <select
                name="nivel"
                value={form.nivel}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400 bg-white"
              >
                {NIVELES.map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </div>

            {/* Acepta términos */}
            <div className="md:col-span-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="aceptaTerminos"
                  checked={form.aceptaTerminos}
                  onChange={handleChange}
                  className="accent-green-600"
                />
                Acepto los términos y condiciones del evento
              </label>
            </div>

            {/* Botón enviar */}
            <div className="md:col-span-2">
              <button
                onClick={handleSubmit}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
              >
                Registrar
              </button>
            </div>
          </div>
        </section>

        {/* ── Filtros de búsqueda ────────────────────────────────────────────── */}
        <section className="bg-white shadow rounded-lg p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Buscar"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
            />
            <select
              value={filtroModalidad}
              onChange={(e) => setFiltroModalidad(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-green-400"
            >
              <option value="">Todas</option>
              {MODALIDADES.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
            <select
              value={filtroNivel}
              onChange={(e) => setFiltroNivel(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-green-400"
            >
              <option value="">Todos</option>
              {NIVELES.map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </div>
        </section>

        {/* ── Lista de participantes ─────────────────────────────────────────── */}
        <section>
          {participantesFiltrados.length === 0 ? (
            <p className="text-center text-gray-400">
              No hay participantes registrados todavía.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {participantesFiltrados.map((p) => (
                <div
                  key={p.id}
                  className={`border rounded p-4 shadow hover:shadow-lg transition ${bgNivel(
                    p.nivel,
                  )}`}
                >
                  <p className="font-bold text-gray-800">{p.nombre}</p>
                  <p className="text-gray-500 text-sm">{p.pais}</p>
                  <p className="mt-2 text-sm">
                    <span className="font-medium">Modalidad:</span>{" "}
                    {p.modalidad}
                  </p>
                  <p className={`text-sm ${colorNivel(p.nivel)}`}>
                    Nivel: {p.nivel}
                  </p>
                  {p.tecnologias.length > 0 && (
                    <p className="text-sm mt-1">{p.tecnologias.join(", ")}</p>
                  )}
                  <button
                    onClick={() => eliminarParticipante(p.id)}
                    className="mt-3 bg-red-500 text-white text-sm px-3 py-1 rounded hover:bg-red-600 transition"
                  >
                    Eliminar
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
