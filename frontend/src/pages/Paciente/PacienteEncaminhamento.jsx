import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../../services/api";
import toast from "react-hot-toast";
import { MapContainer, TileLayer, Polyline, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import polyline from "@mapbox/polyline";
import InstrucoesRota from '../../components/InstrucoesRota';
import { 
  FiArrowLeft, 
  FiUser, 
  FiCreditCard, 
  FiPhone, 
  FiCalendar, 
  FiDroplet,
  FiMapPin, 
  FiAlertTriangle,
  FiAlertCircle,
  FiNavigation,
  FiClock,
  FiMap
} from "react-icons/fi";

// Configuração do Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: new URL("leaflet/dist/images/marker-icon-2x.png", import.meta.url).href,
  iconUrl: new URL("leaflet/dist/images/marker-icon.png", import.meta.url).href,
  shadowUrl: new URL("leaflet/dist/images/marker-shadow.png", import.meta.url).href,
});

export default function PacienteEncaminhamento() {
  const { id } = useParams();
  const [paciente, setPaciente] = useState(null);
  const [ultimaAvaliacao, setUltimaAvaliacao] = useState(null);
  const [rota, setRota] = useState(null);
  const [path, setPath] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [qrCodeUrl, setQrCodeUrl] = useState(null);
  const [loadingQr, setLoadingQr] = useState(false);

  useEffect(() => {
    carregarEncaminhamento();
  }, []);

  useEffect(() => {
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
      console.log("Dados do paciente:", res);
      
      if (res.success) {
        setPaciente(res.paciente);
        
        // Pega a última avaliação de risco (último item do array)
        if (res.paciente.avaliacao_risco && res.paciente.avaliacao_risco.length > 0) {
          const ultima = res.paciente.avaliacao_risco[res.paciente.avaliacao_risco.length - 1];
          setUltimaAvaliacao(ultima);
          
          // Parse dos dados JSON armazenados como string
          try {
            const parsedResultado = JSON.parse(ultima.resultado);
            const parsedSintomas = JSON.parse(ultima.sintomas);
            setUltimaAvaliacao(prev => ({
              ...prev,
              resultado: parsedResultado,
              sintomas: parsedSintomas
            }));
          } catch (e) {
            console.error("Erro ao parsear dados:", e);
          }
        }
        
        if (res.open_route) {
          setRota(res.open_route);
          const decoded = polyline.decode(res.open_route.geometry);
          setPath(decoded);
        }
      } else if (!res.encaminhamento) {
        toast(res.message || "Paciente com risco baixo não necessita de encaminhamento." ,{icon: 'ℹ️',});
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

  const renderRiskBadge = (riskLevel) => {
    const config = {
      'alto_risco': {
        color: 'red',
        icon: <FiAlertTriangle className="h-5 w-5" />,
        text: 'Alto Risco'
      },
      'medio_risco': {
        color: 'yellow',
        icon: <FiAlertCircle className="h-5 w-5" />,
        text: 'Médio Risco'
      },
      'baixo_risco': {
        color: 'green',
        icon: <FiDroplet className="h-5 w-5" />,
        text: 'Baixo Risco'
      }
    };

    const { color, icon, text } = config[riskLevel] || config['baixo_risco'];

    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-${color}-100 text-${color}-800`}>
        {icon}
        <span className="ml-2">{text}</span>
      </span>
    );
  };

  // Obtém o nível de risco do paciente baseado na última avaliação
  const getRiskLevel = () => {
    return ultimaAvaliacao?.resultado?.nivel_risco || 'baixo_risco';
  };

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6">
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        {/* Cabeçalho */}
        <div className="bg-gradient-to-r from-cyan-600 to-blue-600 p-6 text-white">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
            <div>
              <h1 className="text-2xl font-bold">Detalhes do Paciente</h1>
              <p className="text-cyan-100 mt-1">
                {paciente?.nome || 'Carregando informações...'}
              </p>
            </div>
            <Link 
              to="/paciente"
              className="px-4 py-2 bg-white bg-opacity-20 rounded-lg hover:bg-opacity-30 transition-all flex items-center"
            >
              <FiArrowLeft className="mr-2" />
              Voltar para lista
            </Link>
          </div>
        </div>

        {/* Conteúdo principal */}
        <div className="p-6 space-y-6">
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : !paciente ? (
            <div className="text-center py-10">
              <p className="text-gray-500">Paciente não encontrado.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Coluna 1 - Dados do paciente */}
              <div className="lg:col-span-1 space-y-6">
                {/* Cartão de identificação */}
                <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-lg font-semibold text-gray-800">Identificação</h2>
                      <p className="text-sm text-gray-500">Dados cadastrais</p>
                    </div>
                    {renderRiskBadge(getRiskLevel())}
                  </div>

                  <div className="mt-4 space-y-4">
                    <div className="flex items-start">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                        <FiUser className="h-5 w-5" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-500">Nome completo</p>
                        <p className="text-sm text-gray-900">{paciente.nome}</p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                        <FiCreditCard className="h-5 w-5" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-500">Documento</p>
                        <p className="text-sm text-gray-900">{paciente.numero_bi || 'Não informado'}</p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                        <FiPhone className="h-5 w-5" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-500">Telefone</p>
                        <p className="text-sm text-gray-900">{paciente.telefone}</p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                        <FiCalendar className="h-5 w-5" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-500">Idade/Sexo</p>
                        <p className="text-sm text-gray-900">{paciente.idade} anos • {paciente.sexo === 'M' ? 'Masculino' : 'Feminino'}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Cartão de sintomas */}
                <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
                  <h2 className="text-lg font-semibold text-gray-800">Informações Clínicas</h2>
                  <p className="text-sm text-gray-500 mb-4">Dados da última triagem realizada</p>

                  <div className="space-y-3">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Sintomas apresentados</p>
                      <p className="text-sm text-gray-900 mt-1">
                        {ultimaAvaliacao?.sintomas ? ultimaAvaliacao.sintomas.join(', ') : 'Nenhum sintoma registrado'}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-gray-500">Hospital indicado</p>
                      <p className="text-sm text-gray-900 mt-1">
                        {paciente.hospital?.nome || paciente.nome_hospital || 'Não especificado'}
                      </p>
                    </div>

                    {ultimaAvaliacao?.resultado?.pontuacao && (
                      <div>
                        <p className="text-sm font-medium text-gray-500">Pontuação de risco</p>
                        <p className="text-sm text-gray-900 mt-1">
                          {ultimaAvaliacao.resultado.pontuacao} pontos
                        </p>
                      </div>
                    )}

                    {ultimaAvaliacao?.created_at && (
                      <div>
                        <p className="text-sm font-medium text-gray-500">Data da avaliação</p>
                        <p className="text-sm text-gray-900 mt-1">
                          {new Date(ultimaAvaliacao.created_at).toLocaleString()}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* QR Code */}
                <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
                  <h2 className="text-lg font-semibold text-gray-800">Identificação Digital</h2>
                  <p className="text-sm text-gray-500 mb-4">Código QR para acesso rápido</p>

                  <div className="flex justify-center">
                    {loadingQr ? (
                      <div className="w-40 h-40 flex items-center justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                      </div>
                    ) : qrCodeUrl ? (
                      <img 
                        src={qrCodeUrl} 
                        alt="QR Code do paciente" 
                        className="w-40 h-40 border border-gray-200 rounded-lg p-2"
                      />
                    ) : (
                      <div className="w-40 h-40 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                        <p className="text-xs text-gray-500 text-center">QR Code não disponível</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Coluna 2 - Conteúdo dinâmico baseado no risco */}
              <div className="lg:col-span-2 space-y-6">
                {getRiskLevel() === 'baixo_risco' ? (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-5">
                    <div className="flex items-center">
                      <FiDroplet className="h-6 w-6 text-green-600" />
                      <h2 className="ml-2 text-xl font-semibold text-green-800">Monitoramento Recomendado</h2>
                    </div>
                    <p className="mt-3 text-green-700">
                      O paciente foi classificado como <span className="font-semibold">baixo risco</span> na última triagem. 
                      Recomenda-se monitoramento ambulatorial e orientações sobre hidratação oral.
                    </p>
                    {ultimaAvaliacao?.resultado?.orientacoes && (
                      <div className="mt-4 bg-white p-4 rounded border border-green-100">
                        <h3 className="font-medium text-green-800">Orientações</h3>
                        <ul className="mt-2 space-y-2 text-sm text-green-700">
                          {ultimaAvaliacao.resultado.orientacoes.map((orientacao, index) => (
                            <li key={index} className="flex items-start">
                              <span className="mr-2">•</span>
                              <span>{orientacao}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ) : getRiskLevel() === 'alto_risco' && rota ? (
                  <>
                    <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
                      <div className="flex items-center">
                        <FiNavigation className="h-6 w-6 text-red-600" />
                        <h2 className="ml-2 text-xl font-semibold text-gray-800">Encaminhamento Urgente</h2>
                      </div>
                      <p className="mt-2 text-gray-600">
                        Paciente classificado como alto risco na última avaliação. Encaminhamento imediato para:
                      </p>
                      <p className="font-medium text-red-600">{paciente.hospital?.nome || paciente.nome_hospital}</p>

                      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-blue-50 p-4 rounded-lg">
                          <div className="flex items-center">
                            <FiMapPin className="h-5 w-5 text-blue-600" />
                            <h3 className="ml-2 font-medium text-blue-800">Distância</h3>
                          </div>
                          <p className="mt-2 text-2xl font-bold text-blue-900">
                            {(rota.distancia_metros / 1000).toFixed(1)} km
                          </p>
                        </div>

                        <div className="bg-blue-50 p-4 rounded-lg">
                          <div className="flex items-center">
                            <FiClock className="h-5 w-5 text-blue-600" />
                            <h3 className="ml-2 font-medium text-blue-800">Tempo estimado</h3>
                          </div>
                          <p className="mt-2 text-2xl font-bold text-blue-900">
                            {(rota.duracao_segundos / 60).toFixed(0)} min
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                      <div className="p-4 border-b bg-gray-50">
                        <div className="flex items-center">
                          <FiMap className="h-5 w-5 text-gray-600" />
                          <h3 className="ml-2 font-medium text-gray-800">Rota para o Hospital</h3>
                        </div>
                      </div>
                      <div className="h-96">
                        <MapContainer
                          center={path[0]}
                          zoom={13}
                          scrollWheelZoom={true}
                          className="h-full w-full"
                        >
                          <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                          />
                          <Polyline positions={path} color="red" />
                          <Marker position={path[0]}>
                            <Popup>Local do Paciente</Popup>
                          </Marker>
                          <Marker position={path[path.length - 1]}>
                            <Popup>Hospital de Destino</Popup>
                          </Marker>
                        </MapContainer>
                      </div>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
                      <h3 className="font-medium text-gray-800">Instruções de Rota</h3>
                      <InstrucoesRota instrucoes={rota.instrucoes} />
                    </div>
                  </>
                ) : (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-5">
                    <div className="flex items-center">
                      <FiAlertCircle className="h-6 w-6 text-yellow-600" />
                      <h2 className="ml-2 text-xl font-semibold text-yellow-800">Atenção Necessária</h2>
                    </div>
                    <p className="mt-3 text-yellow-700">
                      O paciente requer avaliação médica, mas não foi possível gerar o encaminhamento automático.
                    </p>
                    {ultimaAvaliacao?.resultado?.orientacoes && (
                      <div className="mt-4 bg-white p-4 rounded border border-yellow-100">
                        <h3 className="font-medium text-yellow-800">Orientações</h3>
                        <ul className="mt-2 space-y-2 text-sm text-yellow-700">
                          {ultimaAvaliacao.resultado.orientacoes.map((orientacao, index) => (
                            <li key={index} className="flex items-start">
                              <span className="mr-2">•</span>
                              <span>{orientacao}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}