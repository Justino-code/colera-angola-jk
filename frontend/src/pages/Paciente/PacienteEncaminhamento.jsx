import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../../services/api";
import toast from "react-hot-toast";
import { MapContainer, TileLayer, Polyline, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import polyline from "@mapbox/polyline"; // Importa o decodificador de polyline
import InstrucoesRota from '../../components/InstrucoesRota';

// Corrigir ícones padrão do Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: new URL("leaflet/dist/images/marker-icon-2x.png", import.meta.url).href,
  iconUrl: new URL("leaflet/dist/images/marker-icon.png", import.meta.url).href,
  shadowUrl: new URL("leaflet/dist/images/marker-shadow.png", import.meta.url).href,
});

export default function PacienteEncaminhamento() {
  const { id } = useParams();
  const [paciente, setPaciente] = useState(null);
  const [rota, setRota] = useState(null);
  const [path, setPath] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Estado de loading

  useEffect(() => {
    carregarEncaminhamento();
  }, []);

  const carregarEncaminhamento = async () => {
    setIsLoading(true);
    try {
      const res = await api.get(`/pacientes/${id}/encaminhamento`);
      console.log(res);

      if (res.success) {
        setPaciente(res.paciente);
        setRota(res.open_route);

        const decoded = polyline.decode(res.open_route.geometry);
        setPath(decoded);
      } else {
        toast.error(res.message || "Erro ao carregar encaminhamento");
      }
    } catch (error) {
      toast.error("Falha ao comunicar com o servidor");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto bg-white rounded shadow">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Encaminhamento do Paciente</h1>
        <Link
          to="/paciente"
          className="bg-slate-600 text-white px-4 py-2 rounded hover:bg-slate-700"
        >
          Voltar
        </Link>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-10">
          <svg
            className="animate-spin h-8 w-8 text-blue-600"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8H4z"
            ></path>
          </svg>
          <span className="ml-2 text-blue-700 font-medium">
            Carregando encaminhamento...
          </span>
        </div>
      ) : !paciente ? (
        <p className="text-gray-500">Paciente não encontrado.</p>
      ) : (
        <div className="space-y-4">
          <div className="border p-4 rounded bg-slate-50">
            <h2 className="text-lg font-semibold">Paciente</h2>
            <p><strong>Nome:</strong> {paciente.nome}</p>
            <p><strong>BI:</strong> {paciente.numero_bi}</p>
            <p><strong>Hospital:</strong> {paciente.hospital?.nome || "Não informado"}</p>
            <p><strong>Risco:</strong> {paciente.resultado_triagem}</p>
          </div>

          {rota && path.length > 0 ? (
            <div className="border p-4 rounded bg-slate-50">
              <h2 className="text-lg font-semibold">Rota</h2>
              <p><strong>Distância:</strong> {(rota.distancia_metros / 1000).toFixed(2)} km</p>
              <p><strong>Duração:</strong> {(rota.duracao_segundos / 60).toFixed(1)} min</p>

              {/* Instruções com animação inteligente */}
              <InstrucoesRota instrucoes={rota.instrucoes} />

              <div className="mt-4">
                <h3 className="font-medium mb-2">Mapa</h3>
                <MapContainer
                  center={path[0]}
                  zoom={13}
                  scrollWheelZoom={true}
                  className="w-full h-96 rounded"
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                  />
                  <Polyline positions={path} color="blue" />
                  <Marker position={path[0]}>
                    <Popup>Localização do Paciente</Popup>
                  </Marker>
                  <Marker position={path[path.length - 1]}>
                    <Popup>Hospital de destino</Popup>
                  </Marker>
                </MapContainer>
              </div>
            </div>
          ) : (
            <p className="text-gray-500">Sem rota disponível para este paciente.</p>
          )}
        </div>
      )}
    </div>
  );
}
