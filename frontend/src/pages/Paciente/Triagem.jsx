import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../services/api";
import toast from "react-hot-toast";

const sintomasDisponiveis = [
  "diarreia_aquosa",
  "vomito",
  "desidratacao",
  "cãibras_musculares",
  "sede_excessiva",
  "olhos_fundos",
  "pele_retraida",
  "fraqueza",
  "batimento_acelerado",
  "pressao_baixa",
  "urinacao_reduzida",
  "letargia",
  "febre"
];

const sintomasLabels = {
  "diarreia_aquosa": "Diarreia aquosa",
  "vomito": "Vômito",
  "desidratacao": "Desidratação",
  "cãibras_musculares": "Cãibras musculares",
  "sede_excessiva": "Sede excessiva",
  "olhos_fundos": "Olhos fundos",
  "pele_retraida": "Pele retraída",
  "fraqueza": "Fraqueza extrema",
  "batimento_acelerado": "Batimento acelerado",
  "pressao_baixa": "Pressão baixa",
  "urinacao_reduzida": "Pouca urina",
  "letargia": "Letargia",
  "febre": "Febre"
};

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

// Componente para badge de resultado
const ResultadoBadge = ({ nivel }) => {
  let classe = "";
  let texto = "";

  switch(nivel) {
    case "alto_risco":
      classe = "bg-red-100 text-red-800";
      texto = "Alto Risco";
      break;
    case "medio_risco":
      classe = "bg-yellow-100 text-yellow-800";
      texto = "Médio Risco";
      break;
    case "baixo_risco":
      classe = "bg-green-100 text-green-800";
      texto = "Baixo Risco";
      break;
    default:
      classe = "bg-gray-100 text-gray-800";
      texto = "Não avaliado";
  }

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${classe}`}>
      {texto}
    </span>
  );
};

// Componente para card de avaliação
const AvaliacaoCard = ({ avaliacao }) => {
  const dataFormatada = new Date(avaliacao.created_at).toLocaleString('pt-BR');
  
  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <div>
          <h4 className="font-medium text-gray-800">
            Avaliado em {dataFormatada}
          </h4>
          {avaliacao.resultadoParsed && (
            <div className="mt-2 space-y-1">
              <p className="text-sm text-gray-600">
                <span className="font-medium">Nível de risco:</span>{" "}
                <ResultadoBadge nivel={avaliacao.resultadoParsed.nivel_risco} />
              </p>
            </div>
          )}
        </div>
        <div className="flex-shrink-0">
          {avaliacao.resultadoParsed?.nivel_risco === "alto_risco" && (
            <svg className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          )}
          {avaliacao.resultadoParsed?.nivel_risco === "medio_risco" && (
            <svg className="h-6 w-6 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          )}
          {avaliacao.resultadoParsed?.nivel_risco === "baixo_risco" && (
            <svg className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )}
        </div>
      </div>
    </div>
  );
};

export default function Triagem() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [paciente, setPaciente] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sintomas, setSintomas] = useState([]);
  const [avaliacoes, setAvaliacoes] = useState([]);
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    async function fetchPaciente() {
      setLoading(true);
      try {
        const res = await api.get(`/pacientes/${id}`);
        if (res.success) {
          setPaciente(res.data);
          setSintomas(res.data.sintomas || []);
          
          // Processar as avaliações de risco
          if (res.data.avaliacao_risco && Array.isArray(res.data.avaliacao_risco)) {
            const avaliacoesProcessadas = res.data.avaliacao_risco
              .map(avaliacao => {
                try {
                  const resultadoParsed = JSON.parse(avaliacao.resultado);
                  return {
                    ...avaliacao,
                    resultadoParsed
                  };
                } catch (e) {
                  console.error("Erro ao parsear resultado:", e);
                  return avaliacao;
                }
              })
              .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
              .slice(0, 2); // Pegar apenas as 2 últimas avaliações

            setAvaliacoes(avaliacoesProcessadas);
          }
        } else {
          toast.error("Paciente não encontrado");
          navigate("/paciente");
        }
      } catch {
        toast.error("Erro ao buscar paciente");
        navigate("/paciente");
      } finally {
        setLoading(false);
      }
    }
    fetchPaciente();
  }, [id, navigate]);

  const handleSintomaChange = (sintoma) => {
    setSintomas((prev) =>
      prev.includes(sintoma)
        ? prev.filter((s) => s !== sintoma)
        : [...prev, sintoma]
    );
  };

  const handleSalvar = async (e) => {
    e.preventDefault();
    setSalvando(true);
    try {
      const res = await api.put(`/pacientes/${id}/triagem`, {
        sintomas
      });
      if (res.success) {
        toast.success("Triagem salva com sucesso!");
        // Atualizar dados após salvar
        const resPaciente = await api.get(`/pacientes/${id}`);
        if (resPaciente.success) {
          setPaciente(resPaciente.data);
          setSintomas(resPaciente.data.sintomas || []);
          
          if (resPaciente.data.avaliacao_risco && Array.isArray(resPaciente.data.avaliacao_risco)) {
            const avaliacoesProcessadas = resPaciente.data.avaliacao_risco
              .map(avaliacao => {
                try {
                  const resultadoParsed = JSON.parse(avaliacao.resultado);
                  return {
                    ...avaliacao,
                    resultadoParsed
                  };
                } catch (e) {
                  console.error("Erro ao parsear resultado:", e);
                  return avaliacao;
                }
              })
              .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
              .slice(0, 2);

            setAvaliacoes(avaliacoesProcessadas);
          }
        }
      } else {
        toast.error(res.message || "Erro ao salvar triagem");
      }
    } catch {
      toast.error("Erro ao salvar triagem");
    } finally {
      setSalvando(false);
    }
  };

  const formatarIdade = (idade) => {
    if (!idade) return "Não informada";
    return `${idade} anos`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
      </div>
    );
  }

  if (!paciente) {
    return <div className="p-6 text-center text-gray-500">Paciente não encontrado</div>;
  }

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6">
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        {/* Cabeçalho */}
        <div className="bg-gradient-to-r from-cyan-600 to-blue-600 p-6 text-white">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
            <div>
              <h1 className="text-2xl font-bold">Triagem do Paciente</h1>
              <div className="flex flex-wrap items-center gap-2 mt-2">
                <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm">
                  ID: {paciente.codigo || paciente.id_paciente}
                </span>
              </div>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => navigate(`/paciente/${id}`)}
                className="px-4 py-2 bg-white bg-opacity-20 rounded-lg hover:bg-opacity-30 transition-all flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
                Voltar
              </button>
            </div>
          </div>
        </div>

        {/* Conteúdo Principal */}
        <div className="p-6 grid grid-cols-1 gap-6">
          {/* Seção de Informações Básicas */}
          <div className="bg-white rounded-lg border border-gray-200 p-5">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center border-b pb-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-cyan-600" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
              Informações Pessoais
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
                    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2H4a1 1 0 110-2V4zm2 0v12h8V4H6z" clipRule="evenodd" />
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
            </div>
          </div>

          {/* Seção de Sintomas */}
          <form onSubmit={handleSalvar} className="bg-white rounded-lg border border-gray-200 p-5 space-y-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center border-b pb-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              Sintomas
            </h2>
            
            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-3">Sintomas</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {sintomasDisponiveis.map((sintoma) => (
                  <label key={sintoma} className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg hover:bg-gray-100">
                    <input
                      type="checkbox"
                      checked={sintomas.includes(sintoma)}
                      onChange={() => handleSintomaChange(sintoma)}
                      className="form-checkbox h-5 w-5 text-cyan-600 rounded focus:ring-cyan-500"
                    />
                    <span className="text-gray-800">{sintomasLabels[sintoma]}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t">
              <button
                type="button"
                onClick={() => navigate(`/paciente/${id}`)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors"
                disabled={salvando}
              >
                {salvando ? (
                  <span className="flex items-center">
                    <svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                    </svg>
                    Salvando...
                  </span>
                ) : (
                  "Salvar Triagem"
                )}
              </button>
            </div>
          </form>

          {/* Seção de Histórico de Avaliações */}
          <div className="bg-white rounded-lg border border-gray-200 p-5">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center border-b pb-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
              </svg>
              Últimas Avaliações
            </h2>
            <div className="space-y-4">
              {avaliacoes.length > 0 ? (
                avaliacoes.map((avaliacao, index) => (
                  <AvaliacaoCard key={index} avaliacao={avaliacao} />
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  Nenhuma avaliação registrada
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}