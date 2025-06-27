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
  const [isLoading, setIsLoading] = useState(true);
  const [qrCodeUrl, setQrCodeUrl] = useState(null);
  const [loadingQr, setLoadingQr] = useState(false);

  useEffect(() => {
    carregarEncaminhamento();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    // Busca a imagem do QR Code se existir
    const fetchQrCode = async () => {
      if (paciente && paciente.qr_code) {
        setLoadingQr(true);
        try {
          const qrcode = await api.get(`/files/${encodeURIComponent(paciente.qr_code)}`);
          if (qrcode.success && qrcode.mime && qrcode.data) {
            setQrCodeUrl(`data:${qrcode.mime};base64,${qrcode.data}`);
          } else {
            setQrCodeUrl(null);
          }
        } catch {
          setQrCodeUrl(null);
        } finally {
          setLoadingQr(false);
        }
      } else {
        setQrCodeUrl(null);
        setLoadingQr(false);
      }
    };
    fetchQrCode();
  }, [paciente]);

  const carregarEncaminhamento = async () => {
    setIsLoading(true);
    try {
      const res = await api.get(`/pacientes/${id}/encaminhamento`);
      if (res.success) {
        setPaciente(res.paciente);
        setRota(res.open_route);
        const decoded = polyline.decode(res.open_route.geometry);
        setPath(decoded);
      } else if (!res.encaminhamento) {
        toast.error(res.message || "Paciente com risco baixo não necessita de encaminhamento.");
        setPaciente(res.paciente);
        setRota(null);
        setPath([]);
      } else {
        toast.error(res.message || "Erro ao carregar encaminhamento");
      }
    } catch (error) {
      toast.error("Falha ao comunicar com o servidor");
    } finally {
      setIsLoading(false);
    }
  };

  // Função para exibir sintomas corretamente, removendo "_"
  const renderSintomas = (sintomas) => {
    if (!sintomas) return "Não informado";
    const format = (s) =>
      s
        .replace(/_/g, " ")
        .replace(/\b\w/g, (l) => l.toLowerCase()); // opcional: deixa tudo minúsculo
    if (Array.isArray(sintomas)) return sintomas.map(format).join(", ");
    if (typeof sintomas === "string") return format(sintomas);
    return Object.values(sintomas).map(format).join(", ");
  };

  // Função para exibir sexo formatado
  const renderSexo = (sexo) => {
    if (sexo === "M") return "Masculino";
    if (sexo === "F") return "Feminino";
    return sexo || "Não informado";
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
          <div
            className={`border p-4 rounded flex flex-col md:flex-row justify-between items-start gap-6 ${
              paciente.resultado_triagem === "baixo_risco"
                ? "bg-green-50"
                : paciente.resultado_triagem === "alto_risco"
                ? "bg-red-50"
                : "bg-slate-50"
            }`}
          >
            {/* Informações do paciente */}
            <div className="flex-1">
              <h2
                className={`text-lg font-semibold ${
                  paciente.resultado_triagem === "baixo_risco"
                    ? "text-green-700"
                    : paciente.resultado_triagem === "alto_risco"
                    ? "text-red-700"
                    : ""
                }`}
              >
                Paciente
              </h2>
              <p><strong>Nome:</strong> {paciente.nome}</p>
              <p><strong>BI:</strong> {paciente.numero_bi}</p>
              <p><strong>Telefone:</strong> {paciente.telefone}</p>
              <p><strong>Idade:</strong> {paciente.idade}</p>
              <p><strong>Sexo:</strong> {renderSexo(paciente.sexo)}</p>
              <p><strong>Sintomas:</strong> {renderSintomas(paciente.sintomas)}</p>
              <p>
                <strong>Resultado da Triagem:</strong>{" "}
                {paciente.resultado_triagem === "baixo_risco" ? (
                  <span className="text-green-700 font-semibold">Baixo risco</span>
                ) : paciente.resultado_triagem === "alto_risco" ? (
                  <span className="text-red-700 font-semibold">Alto risco</span>
                ) : (
                  paciente.resultado_triagem
                )}
              </p>
              <p>
                <strong>Hospital mais proximo:</strong>{" "}
                {paciente.hospital?.nome || paciente.nome_hospital || "Não informado"}
              </p>
            </div>
            {/* QR Code ao lado direito */}
            <div className="flex-shrink-0 flex flex-col items-center">
              <span className="text-sm text-gray-500 mb-2">QR Code do paciente</span>
              {loadingQr ? (
                <div className="flex items-center justify-center" style={{ width: 180, height: 180 }}>
                  <svg className="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                  </svg>
                </div>
              ) : paciente.qr_code && qrCodeUrl ? (
                <img
                  src={qrCodeUrl}
                  alt="QR Code do paciente"
                  style={{
                    width: 180,
                    height: 180,
                    border: "2px solid #ccc",
                    background: "#fff",
                    padding: 8,
                  }}
                />
              ) : (
                <span className="text-xs text-gray-400">Não informado</span>
              )}
            </div>
          </div>

          {/* Mensagem para baixo_risco */}
          {paciente.resultado_triagem === "baixo_risco" ? (
            <div className="mt-4 p-3 rounded border bg-green-100 text-green-800 border-green-300">
              O paciente foi classificado como <strong>baixo risco</strong> na triagem e <strong>não necessita de encaminhamento</strong> para um hospital neste momento.
            </div>
          ) : paciente.resultado_triagem === "alto_risco" ? (
            // Exibe o encaminhamento (rota/mapa) para alto risco
            rota && path.length > 0 ? (
              <div className="border p-4 rounded bg-red-50">
                <h2 className="text-lg font-semibold text-red-700">Encaminhamento</h2>
                <p><strong>Distância:</strong> {(rota.distancia_metros / 1000).toFixed(2)} km</p>
                <p><strong>Duração:</strong> {(rota.duracao_segundos / 60).toFixed(1)} min</p>
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
              <div className="mt-4 p-3 rounded border bg-red-100 text-red-800 border-red-300">
                Paciente de alto risco, mas sem rota disponível para encaminhamento.
              </div>
            )
          ) : (
            // Caso não seja baixo nem alto risco
            <p className="text-gray-500">Sem encaminhamento disponível para este paciente.</p>
          )}
        </div>
      )}
    </div>
  );
}
