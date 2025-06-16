import { useEffect, useState } from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import ClusterMarkers from "../components/map/ClusterMarkers";
import api from "../services/api";

export default function MapaCasos() {
  const [pacientes, setPacientes] = useState([]);
  const [filtro, setFiltro] = useState("");
  const [showFilter, setShowFilter] = useState(true);

  useEffect(() => {
    api.get("/pacientes")
      .then(data => setPacientes(data))
      .catch(err => alert("Erro ao carregar casos: " + err));

    const savedFiltro = localStorage.getItem("filtroSintoma");
    if (savedFiltro !== null) setFiltro(savedFiltro);
  }, []);

  const pacientesFiltrados = filtro
    ? pacientes.filter(p => p.sintomas?.includes(filtro))
    : pacientes;

  const handleFiltroChange = value => {
    setFiltro(value);
    localStorage.setItem("filtroSintoma", value);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => console.error(err));
    } else {
      document.exitFullscreen();
    }
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden">
      <div
        className={`fixed top-4 right-4 z-[1000] bg-white dark:bg-gray-800 bg-opacity-90 backdrop-blur rounded shadow p-2
        transition-all duration-300 ${showFilter ? "translate-x-0" : "translate-x-full"}`}
        style={{ width: "240px", maxWidth: "90vw" }}
      >
        <div className="flex justify-between items-center mb-1">
          <h1 className="text-lg font-bold text-gray-800 dark:text-gray-100">Mapa de Casos</h1>
          <button
            onClick={() => setShowFilter(!showFilter)}
            className="ml-2 bg-blue-600 hover:bg-blue-700 text-white p-1 rounded"
            title={showFilter ? "Ocultar painel" : "Mostrar painel"}
          >
            {showFilter ? "→" : "←"}
          </button>
        </div>

        <div className="flex items-center gap-2 mb-2">
          <label className="text-sm text-gray-700 dark:text-gray-300">Sintoma:</label>
          <select
            value={filtro}
            onChange={e => handleFiltroChange(e.target.value)}
            className="p-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          >
            <option value="">Todos</option>
            <option value="febre">Febre</option>
            <option value="vomito">Vômito</option>
            <option value="diarreia">Diarreia</option>
            <option value="desidratacao">Desidratação</option>
          </select>
        </div>

        <button
          onClick={toggleFullscreen}
          className="bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded text-sm"
        >
          Tela Cheia
        </button>
      </div>

      {!showFilter && (
        <button
          onClick={() => setShowFilter(true)}
          className="fixed top-4 right-4 z-[1000] bg-blue-600 hover:bg-blue-700 text-white p-1 rounded"
          title="Mostrar painel"
        >
          ←
        </button>
      )}

      <MapContainer
        center={[-11.2027, 17.8739]}
        zoom={6}
        bounds={[[-18.0421, 11.4600], [-4.3881, 24.0879]]} // Angola bounds
        className="w-full h-full"
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <ClusterMarkers markers={pacientesFiltrados} />
      </MapContainer>
    </div>
  );
}
