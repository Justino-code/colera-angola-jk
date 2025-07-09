import { useEffect, useState, useCallback, useMemo } from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import ClusterMarkers from "../components/map/ClusterMarkers";
import api from "../services/api";
import { toast } from 'react-hot-toast';
import { 
  FiFilter, FiMaximize, FiMinimize, FiX, FiArrowRight, FiArrowLeft,
  FiMapPin, FiRefreshCw, FiAlertCircle
} from "react-icons/fi";

export default function MapaCasos() {
  const [pacientes, setPacientes] = useState([]);
  const [filtro, setFiltro] = useState("");
  const [showFilter, setShowFilter] = useState(true);
  const [loading, setLoading] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Extrai sintomas únicos dos pacientes
  const sintomasDisponiveis = useMemo(() => {
    const todosSintomas = pacientes.flatMap(p => {
      try {
        return typeof p.sintomas === 'string' ? JSON.parse(p.sintomas) : p.sintomas || [];
      } catch (e) {
        return [];
      }
    });
    
    return [...new Set(todosSintomas)].filter(Boolean).sort();
  }, [pacientes]);

  // Carrega pacientes
  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      toast.loading("Carregando casos...", { id: 'loading' });
      
      const pacientesRes = await api.get("/pacientes");

      if (pacientesRes.success) {
        setPacientes(pacientesRes.data || []);
        toast.success("Casos carregados com sucesso!", { id: 'loading' });
      } else {
        setPacientes([]);
        toast.error(pacientesRes.message || "Falha ao carregar casos.", { id: 'loading' });
      }
    } catch (err) {
      console.error(err);
      toast.error("Erro ao carregar dados: " + err.message, { id: 'loading' });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
    
    // Carrega filtro salvo
    const savedFiltro = localStorage.getItem("filtroSintoma");
    if (savedFiltro !== null) setFiltro(savedFiltro);

    // Configura listener para fullscreen
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, [loadData]);

  // Filtra pacientes baseado no sintoma selecionado
  const pacientesFiltrados = useMemo(() => {
    if (!filtro) return pacientes;
    
    return pacientes.filter(p => {
      try {
        const sintomas = typeof p.sintomas === 'string' ? JSON.parse(p.sintomas) : p.sintomas || [];
        return sintomas.some(s => s.toLowerCase().includes(filtro.toLowerCase()));
      } catch (e) {
        return false;
      }
    });
  }, [pacientes, filtro]);

  const handleFiltroChange = value => {
    setFiltro(value);
    localStorage.setItem("filtroSintoma", value);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen()
        .catch(err => {
          console.error(err);
          toast.error("Erro ao ativar tela cheia: " + err.message);
        });
    } else {
      document.exitFullscreen();
    }
  };

  const refreshData = () => {
    loadData();
    toast.success("Dados atualizados", { icon: <FiRefreshCw className="animate-spin" /> });
  };

  return (
    <div className="relative w-full h-full">
      {/* Painel de Controle */}
      <div
        className={`fixed top-4 right-4 z-[1000] bg-white dark:bg-gray-800 bg-opacity-90 backdrop-blur rounded-lg shadow-lg p-4
        transition-all duration-300 ease-in-out ${showFilter ? "translate-x-0" : "translate-x-full"}`}
        style={{ width: "280px", maxWidth: "90vw" }}
      >
        <div className="flex justify-between items-center mb-3">
          <h1 className="text-lg font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
            <FiMapPin /> Mapa de Casos
          </h1>
          <button
            onClick={() => setShowFilter(false)}
            className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            title="Ocultar painel"
          >
            <FiX size={18} />
          </button>
        </div>

        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Filtrar por Sintoma:
            </label>
            <select
              value={filtro}
              onChange={e => handleFiltroChange(e.target.value)}
              className="w-full p-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              disabled={loading}
            >
              <option value="">Todos os casos</option>
              {sintomasDisponiveis.map(sintoma => (
                <option key={sintoma} value={sintoma}>
                  {sintoma.charAt(0).toUpperCase() + sintoma.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-2">
            <button
              onClick={toggleFullscreen}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-md text-sm"
            >
              {isFullscreen ? <FiMinimize size={16} /> : <FiMaximize size={16} />}
              {isFullscreen ? 'Sair' : 'Tela Cheia'}
            </button>

            <button
              onClick={refreshData}
              className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-100 px-3 py-2 rounded-md text-sm"
              disabled={loading}
            >
              <FiRefreshCw size={16} className={loading ? "animate-spin" : ""} />
              Atualizar
            </button>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            <strong>{pacientesFiltrados.length}</strong> casos {filtro ? `com "${filtro}"` : 'no total'}
          </p>
        </div>
      </div>

      {/* Botão para mostrar filtro quando oculto */}
      {!showFilter && (
        <button
          onClick={() => setShowFilter(true)}
          className="fixed top-4 right-4 z-[1000] bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-100 p-2 rounded-lg shadow-md flex items-center gap-2"
          title="Mostrar painel"
        >
          <FiFilter size={18} />
          <FiArrowLeft size={16} />
        </button>
      )}

      {/* Mapa */}
      <MapContainer
        center={[-11.2027, 17.8739]}
        zoom={6}
        minZoom={5}
        maxBounds={[[-18.0421, 11.4600], [-4.3881, 24.0879]]} // Angola bounds
        className="w-full h-full"
        preferCanvas={true}
      >
        <TileLayer 
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        
        {loading ? (
          <div className="leaflet-top leaflet-right">
            <div className="leaflet-control bg-white dark:bg-gray-800 p-2 rounded shadow flex items-center gap-2">
              <FiRefreshCw className="animate-spin" />
              <span>Carregando...</span>
            </div>
          </div>
        ) : pacientesFiltrados.length === 0 ? (
          <div className="leaflet-top leaflet-left">
            <div className="leaflet-control bg-white dark:bg-gray-800 p-2 rounded shadow flex items-center gap-2 text-red-500">
              <FiAlertCircle />
              <span>Nenhum caso encontrado</span>
            </div>
          </div>
        ) : (
          <ClusterMarkers 
            markers={pacientesFiltrados} 
            onMarkerClick={marker => {
              toast.success(`Paciente: ${marker.nome}`, {
                icon: <FiMapPin className="text-blue-500" />
              });
            }}
          />
        )}
      </MapContainer>
    </div>
  );
}