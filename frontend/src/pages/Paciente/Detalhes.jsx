import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../services/api";
import toast from "react-hot-toast";
import Modal from "react-modal";
import TriagemModal from "./TriagemModal";

// Configuração do Modal para acessibilidade
Modal.setAppElement("#root");

// Componente para exibir informações em cards
const InfoCard = ({ label, value, icon, className = "", children }) => (
  <div className={`bg-gray-50 p-4 rounded-lg shadow-sm border border-gray-100 ${className}`}>
    <div className="flex items-start space-x-3">
      {icon && (
        <div className="p-2 bg-cyan-100 rounded-full text-cyan-600 flex-shrink-0">
          {icon}
        </div>
      )}
      <div className="flex-1">
        <h3 className="text-sm font-medium text-gray-500">{label}</h3>
        {children || (
          <p className="mt-1 text-lg font-semibold text-gray-900 break-words">
            {value || <span className="text-gray-400">Não informado</span>}
          </p>
        )}
      </div>
    </div>
  </div>
);

// Componente para o badge de sintomas
const SintomaBadge = ({ sintoma }) => {
  const traducoes = {
    'diarreia_aquosa': 'Diarreia aquosa',
    'vomito': 'Vômito',
    'desidratacao': 'Desidratação',
    'cãibras_musculares': 'Cãibras musculares',
    'sede_excessiva': 'Sede excessiva',
    'olhos_fundos': 'Olhos fundos',
    'pele_retraida': 'Pele retraída',
    'fraqueza': 'Fraqueza extrema',
    'batimento_acelerado': 'Batimento acelerado',
    'pressao_baixa': 'Pressão baixa',
    'urinacao_reduzida': 'Pouca urina',
    'letargia': 'Letargia',
    'febre': 'Febre'
  };

  return (
    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-cyan-100 text-cyan-800">
      {traducoes[sintoma] || sintoma}
    </span>
  );
};

// Componente para resultado da triagem
const ResultadoTriagemBadge = ({ resultado }) => {
  const cores = {
    'alto_risco': 'bg-red-100 text-red-800',
    'medio_risco': 'bg-yellow-100 text-yellow-800',
    'baixo_risco': 'bg-green-100 text-green-800'
  };

  const textos = {
    'alto_risco': 'Alto Risco (Prioridade Máxima)',
    'medio_risco': 'Médio Risco (Prioridade Intermediária)',
    'baixo_risco': 'Baixo Risco (Prioridade Normal)'
  };

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${cores[resultado] || 'bg-gray-100 text-gray-800'}`}>
      {textos[resultado] || resultado}
    </span>
  );
};

// Componente para status do hospital
const HospitalStatus = ({ hospital }) => {
  if (!hospital) {
    return (
      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
        Não atribuído
      </span>
    );
  }

  return (
    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
      {hospital}
    </span>
  );
};

export default function PacienteDetalhes() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [paciente, setPaciente] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qrCodeUrl, setQrCodeUrl] = useState(null);
  const [loadingQr, setLoadingQr] = useState(false);
  const [modalTriagemIsOpen, setModalTriagemIsOpen] = useState(false);
  const [ultimaAvaliacao, setUltimaAvaliacao] = useState(null);

  useEffect(() => {
    const carregarPaciente = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/pacientes/${id}`);
        console.log("Dados do paciente:", res);
        
        
        if (res.success) {
          const pacienteData = res.data;
          setPaciente(pacienteData);

          // Processa a última avaliação
          if (pacienteData.avaliacao_risco && pacienteData.avaliacao_risco.length > 0) {
            const avaliacoesOrdenadas = [...pacienteData.avaliacao_risco].sort(
              (a, b) => new Date(b.created_at) - new Date(a.created_at)
            );
            
            const ultima = {
              ...avaliacoesOrdenadas[0],
              resultadoParsed: JSON.parse(avaliacoesOrdenadas[0].resultado),
              sintomasParsed: JSON.parse(avaliacoesOrdenadas[0].sintomas)
            };
            
            setUltimaAvaliacao(ultima);
          }
        } else {
          toast.error(res.message || "Paciente não encontrado");
          navigate("/paciente");
        }
      } catch (error) {
        console.error(error);
        toast.error("Erro ao carregar paciente");
        navigate("/paciente");
      } finally {
        setLoading(false);
      }
    };

    carregarPaciente();
  }, [id, navigate]);

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
      }
    };

    fetchQrCode();
  }, [paciente]);

  const formatarData = (dataString) => {
    if (!dataString) return "Não informado";
    const data = new Date(dataString);
    return data.toLocaleDateString('pt-PT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatarIdade = (idade) => {
    if (!idade) return "Não informada";
    return `${idade} anos`;
  };

  const formatarTelefone = (telefone) => {
    if (!telefone) return "Não informado";
    return telefone.replace(/(\d{3})(\d{3})(\d{3})/, '$1 $2 $3');
  };

  const renderQrCodeSection = () => (
    <div className="bg-white rounded-lg border border-gray-200 p-5">
      <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center border-b pb-2">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M3 4a1 1 0 011-1h3a1 1 0 011 1v3a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm2 2V5h1v1H5zM3 13a1 1 0 011-1h3a1 1 0 011 1v3a1 1 0 01-1 1H4a1 1 0 01-1-1v-3zm2 2v-1h1v1H5zM13 3a1 1 0 00-1 1v3a1 1 0 001 1h3a1 1 0 001-1V4a1 1 0 00-1-1h-3zm1 2v1h1V5h-1z" />
          <path d="M11 4a1 1 0 10-2 0v1a1 1 0 002 0V4zM10 7a1 1 0 011 1v1h2a1 1 0 110 2h-3a1 1 0 01-1-1V8a1 1 0 011-1zM16 9a1 1 0 100 2 1 1 0 000-2zM9 13a1 1 0 011-1h1a1 1 0 110 2v2a1 1 0 11-2 0v-3zM7 11a1 1 0 100-2H4a1 1 0 100 2h3zM17 13a1 1 0 01-1 1h-2a1 1 0 110-2h2a1 1 0 011 1zM16 17a1 1 0 100-2h-3a1 1 0 100 2h3z" />
        </svg>
        Identificação
      </h2>
      <div className="flex flex-col items-center space-y-3">
        {loadingQr ? (
          <div className="flex items-center justify-center" style={{ width: 180, height: 180 }}>
            <svg className="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
            </svg>
          </div>
        ) : qrCodeUrl ? (
          <>
            <img 
              src={qrCodeUrl}
              alt={`QR Code do paciente ${paciente?.nome}`}
              className="w-40 h-40 object-contain border border-gray-200 rounded-lg"
            />
            <div className="text-center">
              <p className="text-sm font-medium text-gray-700">ID: {paciente?.codigo}</p>
              <p className="text-xs text-gray-500">Código de identificação única</p>
            </div>
            <a
              href={qrCodeUrl}
              download={`qr_code_paciente_${paciente?.id_paciente}.png`}
              className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
              Baixar QR Code
            </a>
          </>
        ) : (
          <div className="text-center py-8">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="mt-2 text-sm text-gray-500">QR Code não disponível</p>
          </div>
        )}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
      </div>
    );
  }

  if (!paciente) {
    return (
      <div className="p-6 text-center text-gray-500">
        Nenhum paciente encontrado
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6">
      <TriagemModal 
        isOpen={modalTriagemIsOpen} 
        onRequestClose={() => setModalTriagemIsOpen(false)} 
        pacienteId={id}
      />

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="bg-gradient-to-r from-cyan-600 to-blue-600 p-6 text-white">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
            <div>
              <h1 className="text-2xl font-bold">{paciente.nome}</h1>
              <div className="flex flex-wrap items-center gap-2 mt-2">
                <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm">
                  ID: {paciente.codigo || paciente.id_paciente}
                </span>
                {ultimaAvaliacao && (
                  <ResultadoTriagemBadge resultado={ultimaAvaliacao.resultadoParsed.nivel_risco} />
                )}
              </div>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => navigate("/paciente")}
                className="px-4 py-2 bg-white bg-opacity-20 rounded-lg hover:bg-opacity-30 transition-all flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
                Voltar
              </button>
              <button
                onClick={() => setModalTriagemIsOpen(true)}
                className={`px-4 py-2 bg-white bg-opacity-20 rounded-lg hover:bg-opacity-30 transition-all flex items-center ${!paciente.avaliacao_risco || paciente.avaliacao_risco.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={!paciente.avaliacao_risco || paciente.avaliacao_risco.length === 0}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                Ver Triagem
              </button>
              <button
                onClick={() => navigate(`/paciente/${paciente.id_paciente}/editar`)}
                className="px-4 py-2 bg-white text-cyan-600 rounded-lg hover:bg-opacity-90 transition-all flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
                Editar
              </button>
              <button
                onClick={() => navigate(`/triagem/${paciente.id_paciente}`)}
                className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-all flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
                Fazer Triagem
              </button>
            </div>
          </div>
        </div>

        <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-lg border border-gray-200 p-5">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center border-b pb-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-cyan-600" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
                Informações Pessoais
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InfoCard
                  label="Nome Completo"
                  value={paciente.nome}
                  icon={
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                  }
                />
                <InfoCard
                  label="Número de BI"
                  value={paciente.numero_bi}
                  icon={
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z" clipRule="evenodd" />
                    </svg>
                  }
                />
                <InfoCard
                  label="Telefone"
                  value={formatarTelefone(paciente.telefone)}
                  icon={
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                    </svg>
                  }
                />
                <InfoCard
                  label="Idade"
                  value={formatarIdade(paciente.idade)}
                  icon={
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                    </svg>
                  }
                />
                <InfoCard
                  label="Sexo"
                  value={paciente.sexo === "M" ? "Masculino" : "Feminino"}
                  icon={
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                    </svg>
                  }
                />
                <InfoCard
                  label="Hospital Atribuído"
                  icon={
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 0v12h8V4H6z" clipRule="evenodd" />
                    </svg>
                  }
                >
                  <HospitalStatus hospital={paciente.nome_hospital} />
                </InfoCard>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-5">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center border-b pb-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                Última Triagem
              </h2>
              {ultimaAvaliacao ? (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Sintomas identificados</h3>
                    <div className="bg-red-50 border border-red-100 rounded-lg p-4">
                      <div className="flex flex-wrap gap-2">
                        {ultimaAvaliacao.sintomasParsed.map((sintoma, index) => (
                          <SintomaBadge key={index} sintoma={sintoma} />
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InfoCard
                      label="Resultado"
                      icon={
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                      }
                    >
                      <ResultadoTriagemBadge resultado={ultimaAvaliacao.resultadoParsed.nivel_risco} />
                    </InfoCard>
                    <InfoCard
                      label="Pontuação"
                      value={ultimaAvaliacao.resultadoParsed.pontuacao}
                      icon={
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      }
                    />
                  </div>
                  {ultimaAvaliacao.resultadoParsed.protocolo && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="text-sm font-medium text-gray-700 mb-2">Protocolo Recomendado</h3>
                      <div className="space-y-2">
                        <div>
                          <p className="text-sm text-gray-500">Recomendação</p>
                          <p className="font-medium">{ultimaAvaliacao.resultadoParsed.protocolo["Recomendação"]}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Prioridade</p>
                          <p className="font-medium">{ultimaAvaliacao.resultadoParsed.protocolo["Prioridade"]}</p>
                        </div>
                        {ultimaAvaliacao.resultadoParsed.protocolo["Ações"]?.length > 0 && (
                          <div>
                            <p className="text-sm text-gray-500">Ações</p>
                            <ul className="list-disc list-inside space-y-1">
                              {ultimaAvaliacao.resultadoParsed.protocolo["Ações"].map((acao, index) => (
                                <li key={index} className="text-sm">{acao}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-4 text-gray-500">
                  Nenhuma avaliação de risco registrada
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-lg border border-gray-200 p-5">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center border-b pb-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-600" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                Localização
              </h2>
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <InfoCard
                    label="Latitude"
                    value={paciente.latitude || "Não informada"}
                  />
                  <InfoCard
                    label="Longitude"
                    value={paciente.longitude || "Não informada"}
                  />
                </div>
                {paciente.latitude && paciente.longitude && (
                  <a
                    href={`https://www.google.com/maps?q=${paciente.latitude},${paciente.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                    Ver no Mapa
                  </a>
                )}
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-5">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center border-b pb-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-purple-600" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm2 10a1 1 0 10-2 0v3a1 1 0 102 0v-3zm2-3a1 1 0 011 1v5a1 1 0 11-2 0v-5a1 1 0 011-1zm4-1a1 1 0 100 2v7a1 1 0 102 0V8z" clipRule="evenodd" />
                </svg>
                Registro do Sistema
              </h2>
              <div className="space-y-4">
                <InfoCard
                  label="Data de Criação"
                  value={formatarData(paciente.created_at)}
                />
                <InfoCard
                  label="Última Atualização"
                  value={formatarData(paciente.updated_at)}
                />
              </div>
            </div>

            {renderQrCodeSection()}
          </div>
        </div>
      </div>
    </div>
  );
}