import { useEffect, useState, useRef } from "react";
import Modal from "react-modal";
import api from "../../services/api";
import toast from "react-hot-toast";
import { format, parseISO } from "date-fns";
import { pt } from "date-fns/locale";
import { usePDF } from "react-to-pdf";

Modal.setAppElement("#root");

const customModalStyles = {
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.75)",
    zIndex: 1000,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    position: "relative",
    top: "auto",
    left: "auto",
    right: "auto",
    bottom: "auto",
    width: "90%",
    maxWidth: "1200px",
    height: "95vh",
    border: "none",
    borderRadius: "0.75rem",
    padding: "0",
    boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
  },
};

// Cores consistentes para os níveis de risco
const RISK_COLORS = {
  alto_risco: {
    bg: 'bg-red-100',
    text: 'text-red-800',
    border: 'border-red-200',
    dark: {
      bg: 'bg-red-600',
      text: 'text-white'
    }
  },
  medio_risco: {
    bg: 'bg-yellow-100',
    text: 'text-yellow-800',
    border: 'border-yellow-200',
    dark: {
      bg: 'bg-yellow-600',
      text: 'text-white'
    }
  },
  baixo_risco: {
    bg: 'bg-green-100',
    text: 'text-green-800',
    border: 'border-green-200',
    dark: {
      bg: 'bg-green-600',
      text: 'text-white'
    }
  },
  critico: {
    bg: 'bg-red-100',
    text: 'text-red-800',
    border: 'border-red-200',
    dark: {
      bg: 'bg-red-600',
      text: 'text-white'
    }
  }
};

const ResultadoTriagemBadge = ({ resultado }) => {
  const colors = RISK_COLORS[resultado] || RISK_COLORS.baixo_risco;
  
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${colors.bg} ${colors.text}`}>
      {resultado.replace('_', ' ')}
    </span>
  );
};

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
    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
      {traducoes[sintoma] || sintoma}
    </span>
  );
};

const SearchFilterBar = ({ 
  searchTerm, 
  setSearchTerm, 
  filterOption, 
  setFilterOption,
  sortOption,
  setSortOption 
}) => {
  return (
    <div className="bg-white p-4 border-b border-gray-200 space-y-3">
      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700">Filtrar por:</label>
        <div className="grid grid-cols-2 gap-2">
          <select
            className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            value={filterOption}
            onChange={(e) => setFilterOption(e.target.value)}
          >
            <option value="all">Todos os níveis</option>
            <option value="alto_risco">Alto risco</option>
            <option value="medio_risco">Médio risco</option>
            <option value="baixo_risco">Baixo risco</option>
            <option value="critico">Casos críticos</option>
          </select>
          <select
            className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
          >
            <option value="recentes">Mais recentes</option>
            <option value="antigas">Mais antigas</option>
            <option value="pontuacao_maior">Maior pontuação</option>
            <option value="pontuacao_menor">Menor pontuação</option>
          </select>
        </div>
      </div>

      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
          </svg>
        </div>
        <input
          type="text"
          placeholder="Pesquisar por data ou avaliador..."
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md bg-white placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
    </div>
  );
};

const HistoricoSidebar = ({ 
  showHistorico, 
  onClose, 
  avaliacoes, 
  avaliacaoSelecionada, 
  onSelectAvaliacao,
  searchTerm,
  setSearchTerm,
  filterOption,
  setFilterOption,
  sortOption,
  setSortOption
}) => {
  const filteredAvaliacoes = avaliacoes.filter(avaliacao => {
    const matchesSearch = avaliacao.usuario?.nome.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         format(parseISO(avaliacao.created_at), 'dd/MM/yyyy HH:mm', { locale: pt }).includes(searchTerm);
    
    const matchesFilter = filterOption === "all" || 
                         (filterOption === "critico" ? avaliacao.resultadoParsed.combinacao_critica : 
                          avaliacao.resultadoParsed.nivel_risco === filterOption);
    
    return matchesSearch && matchesFilter;
  });

  const sortedAvaliacoes = [...filteredAvaliacoes].sort((a, b) => {
    switch(sortOption) {
      case 'antigas':
        return new Date(a.created_at) - new Date(b.created_at);
      case 'pontuacao_maior':
        return b.resultadoParsed.pontuacao - a.resultadoParsed.pontuacao;
      case 'pontuacao_menor':
        return a.resultadoParsed.pontuacao - b.resultadoParsed.pontuacao;
      case 'recentes':
      default:
        return new Date(b.created_at) - new Date(a.created_at);
    }
  });

  return (
    <div className={`w-72 border-r border-gray-200 bg-white flex flex-col transition-all duration-300 ${showHistorico ? 'ml-0' : '-ml-72'}`}>
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">Histórico</h3>
        <button
          onClick={onClose}
          className="p-1 rounded-md hover:bg-gray-100 text-gray-500 hover:text-gray-700"
        >
          <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>

      <SearchFilterBar 
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filterOption={filterOption}
        setFilterOption={setFilterOption}
        sortOption={sortOption}
        setSortOption={setSortOption}
      />

      <div className="flex-1 overflow-y-auto">
        {sortedAvaliacoes.length > 0 ? (
          sortedAvaliacoes.map(avaliacao => {
            const riskColors = RISK_COLORS[avaliacao.resultadoParsed.nivel_risco] || RISK_COLORS.baixo_risco;
            const isCritico = avaliacao.resultadoParsed.combinacao_critica;
            
            return (
              <div 
                key={avaliacao.id_avaliacao}
                className={`p-3 border-b border-gray-100 cursor-pointer ${
                  avaliacaoSelecionada?.id_avaliacao === avaliacao.id_avaliacao 
                    ? `${riskColors.bg} border-l-4 border-l-blue-500`
                    : 'hover:bg-gray-50'
                }`}
                onClick={() => onSelectAvaliacao(avaliacao)}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {format(parseISO(avaliacao.created_at), 'dd/MM/yyyy HH:mm', { locale: pt })}
                    </p>
                    <div className="mt-1 flex items-center space-x-2">
                      <ResultadoTriagemBadge resultado={avaliacao.resultadoParsed.nivel_risco} />
                      {isCritico && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                          Crítico
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Pontuação: {avaliacao.resultadoParsed.pontuacao}
                    </p>
                  </div>
                  <span className="text-xs text-gray-500">
                    {avaliacao.usuario?.nome.split(' ')[0] || 'Sistema'}
                  </span>
                </div>
              </div>
            );
          })
        ) : (
          <div className="p-4 text-center text-gray-500">
            Nenhuma avaliação encontrada
          </div>
        )}
      </div>
    </div>
  );
};

const AvaliacaoDetalhes = ({ avaliacao, paciente, onBackToLatest }) => {
  const contentRef = useRef();
  const buttonRef = useRef();
  const { toPDF, targetRef } = usePDF({ 
    filename: `triagem-${paciente?.codigo || paciente?.id_paciente}-${avaliacao?.id_avaliacao || 'relatorio'}.pdf`,
    page: {
      margin: 10
    }
  });

  const handleExportPDF = () => {
    if (buttonRef.current) buttonRef.current.style.visibility = 'hidden';
    
    toPDF().then(() => {
      if (buttonRef.current) buttonRef.current.style.visibility = 'visible';
    });
  };

  const parseSintomas = (sintomasString) => {
    try {
      return JSON.parse(sintomasString);
    } catch (e) {
      console.error("Erro ao parsear sintomas:", e);
      return [];
    }
  };

  const isUltimaAvaliacao = avaliacao && avaliacao.id_avaliacao === avaliacao?.ultimaAvaliacaoId;
  const riskColors = RISK_COLORS[avaliacao?.resultadoParsed?.nivel_risco] || RISK_COLORS.baixo_risco;

  return (
    <div className="flex-1 overflow-y-auto p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden" ref={targetRef}>
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-100 flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">
              {format(parseISO(avaliacao.created_at), "PPPPp", { locale: pt })}
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Avaliador: {avaliacao.usuario?.nome || 'Não identificado'}
            </p>
          </div>
          <button
            ref={buttonRef}
            onClick={handleExportPDF}
            className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            <svg className="-ml-0.5 mr-1.5 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Exportar PDF
          </button>
        </div>

        <div ref={contentRef} className="p-6">
          <div className="mb-6">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Informações do Paciente</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-500">Nome</p>
                <p className="text-sm font-medium text-gray-900">{paciente?.nome}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">ID</p>
                <p className="text-sm font-medium text-gray-900">{paciente?.codigo || paciente?.id_paciente}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Idade</p>
                <p className="text-sm font-medium text-gray-900">{paciente?.idade} anos</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Sexo</p>
                <p className="text-sm font-medium text-gray-900">{paciente?.sexo === 'M' ? 'Masculino' : 'Feminino'}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-blue-50 p-4 rounded border border-blue-100">
              <p className="text-sm font-medium text-blue-600">Pontuação Total</p>
              <p className="text-2xl font-bold text-blue-800 mt-1">
                {avaliacao.resultadoParsed.pontuacao}
              </p>
            </div>
            <div className={`${riskColors.bg} p-4 rounded border ${riskColors.border}`}>
              <p className={`text-sm font-medium ${riskColors.text}`}>Nível de Risco</p>
              <p className={`text-xl font-semibold ${riskColors.text} mt-1 capitalize`}>
                {avaliacao.resultadoParsed.nivel_risco.replace('_', ' ')}
              </p>
            </div>
            <div className="bg-gray-100 p-4 rounded border border-gray-200">
              <p className="text-sm font-medium text-gray-600">Tipo</p>
              <p className="text-lg font-medium text-gray-800 mt-1">
                {avaliacao.tipo_avaliacao === 'inicial' ? 'Avaliação Inicial' : 'Reavaliação'}
              </p>
            </div>
          </div>

          <div className="mb-6">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Sintomas identificados</h4>
            <div className="bg-gray-100 p-4 rounded border border-gray-200">
              <div className="flex flex-wrap gap-2">
                {parseSintomas(avaliacao.sintomas).map((sintoma, index) => (
                  <SintomaBadge key={index} sintoma={sintoma} />
                ))}
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Protocolo Recomendado</h4>
            <div className="bg-white p-4 rounded border border-gray-200 space-y-4">
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Recomendação</p>
                <p className="mt-1 text-sm font-medium text-gray-900">
                  {avaliacao.resultadoParsed.protocolo["Recomendação"]}
                </p>
              </div>
              
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Prioridade</p>
                <p className="mt-1 text-sm font-medium text-gray-900">
                  {avaliacao.resultadoParsed.protocolo["Prioridade"]}
                </p>
              </div>
              
              {avaliacao.resultadoParsed.protocolo["Ações"]?.length > 0 && (
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Ações Recomendadas</p>
                  <ul className="mt-2 space-y-2">
                    {avaliacao.resultadoParsed.protocolo["Ações"].map((acao, index) => (
                      <li key={index} className="flex items-start">
                        <svg className="h-4 w-4 text-green-500 mt-0.5 mr-2 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span className="text-sm text-gray-700">{acao}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {avaliacao.observacoes && (
            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Observações</h4>
              <div className="bg-yellow-50 p-4 rounded border border-yellow-100">
                <p className="text-sm text-yellow-800">{avaliacao.observacoes}</p>
              </div>
            </div>
          )}

          {!isUltimaAvaliacao && (
            <div className="pt-2">
              <button
                onClick={onBackToLatest}
                className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <svg className="-ml-0.5 mr-1.5 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd" />
                </svg>
                Ver Última Avaliação
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default function TriagemModal({ isOpen, onRequestClose, pacienteId }) {
  const [avaliacoes, setAvaliacoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [paciente, setPaciente] = useState(null);
  const [showHistorico, setShowHistorico] = useState(true);
  const [avaliacaoSelecionada, setAvaliacaoSelecionada] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterOption, setFilterOption] = useState("all");
  const [sortOption, setSortOption] = useState("recentes");

  useEffect(() => {
    if (isOpen && pacienteId) {
      fetchHistoricoAvaliacoes();
      fetchPacienteData();
    }
  }, [isOpen, pacienteId]);

  const fetchHistoricoAvaliacoes = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/pacientes/${pacienteId}/historico-avaliacao`);
      
      if (res.success) {
        const avaliacoesProcessadas = res.data
          .map(avaliacao => {
            try {
              const resultadoParsed = JSON.parse(avaliacao.resultado);
              return {
                ...avaliacao,
                resultadoParsed
              };
            } catch (e) {
              console.error("Erro ao parsear resultado:", e);
              return {
                ...avaliacao,
                resultadoParsed: {
                  nivel_risco: 'baixo_risco',
                  pontuacao: 0,
                  protocolo: {
                    "Recomendação": "Avaliação clínica padrão",
                    "Prioridade": "Normal",
                    "Ações": []
                  },
                  combinacao_critica: false
                }
              };
            }
          })
          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        
        setAvaliacoes(avaliacoesProcessadas);
        if (avaliacoesProcessadas.length > 0) {
          setAvaliacaoSelecionada({
            ...avaliacoesProcessadas[0],
            ultimaAvaliacaoId: avaliacoesProcessadas[0].id_avaliacao
          });
        }
      } else {
        toast.error(res.error || "Erro ao carregar histórico");
      }
    } catch (error) {
      console.error("Erro ao buscar histórico:", error);
      toast.error("Erro ao buscar histórico de avaliações");
    } finally {
      setLoading(false);
    }
  };

  const fetchPacienteData = async () => {
    try {
      const res = await api.get(`/pacientes/${pacienteId}`);
      if (res.success) {
        setPaciente(res.data);
      }
    } catch (error) {
      console.error("Erro ao buscar dados do paciente:", error);
    }
  };

  const handleSelectAvaliacao = (avaliacao) => {
    setAvaliacaoSelecionada({
      ...avaliacao,
      ultimaAvaliacaoId: avaliacoes[0]?.id_avaliacao
    });
  };

  const handleBackToLatest = () => {
    if (avaliacoes.length > 0) {
      setAvaliacaoSelecionada({
        ...avaliacoes[0],
        ultimaAvaliacaoId: avaliacoes[0].id_avaliacao
      });
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      style={customModalStyles}
      contentLabel="Histórico de Triagens"
    >
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between p-4 bg-white border-b border-gray-200">
          <div>
            <h2 className="text-xl font-bold text-gray-800">Histórico de Triagens</h2>
            {paciente && (
              <p className="text-sm text-gray-600">
                {paciente.nome} • {paciente.codigo || paciente.id_paciente}
              </p>
            )}
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setShowHistorico(!showHistorico)}
              className={`px-3 py-1.5 rounded-md text-sm font-medium ${showHistorico ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              {showHistorico ? 'Ocultar' : 'Mostrar'} Histórico
            </button>
            <button
              onClick={onRequestClose}
              className="px-3 py-1.5 rounded-md text-sm font-medium bg-gray-800 text-white hover:bg-gray-700"
            >
              Fechar
            </button>
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden">
          <HistoricoSidebar
            showHistorico={showHistorico}
            onClose={() => setShowHistorico(false)}
            avaliacoes={avaliacoes}
            avaliacaoSelecionada={avaliacaoSelecionada}
            onSelectAvaliacao={handleSelectAvaliacao}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            filterOption={filterOption}
            setFilterOption={setFilterOption}
            sortOption={sortOption}
            setSortOption={setSortOption}
          />

          <div className="flex-1 flex flex-col overflow-hidden bg-gray-100">
            {loading ? (
              <div className="flex-1 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : avaliacaoSelecionada ? (
              <AvaliacaoDetalhes 
                avaliacao={avaliacaoSelecionada} 
                paciente={paciente} 
                onBackToLatest={handleBackToLatest}
              />
            ) : (
              <div className="flex-1 flex items-center justify-center p-6">
                <div className="text-center">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhuma avaliação selecionada</h3>
                  <p className="mt-1 text-sm text-gray-500">Selecione uma avaliação no histórico para visualizar os detalhes</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
}