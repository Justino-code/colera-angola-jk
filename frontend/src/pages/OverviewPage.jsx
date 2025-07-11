import { useEffect, useState } from 'react';
import api from '../services/api';
import { toast } from 'react-hot-toast';
import { 
  FiActivity, FiHeart, FiAlertTriangle, FiPlusCircle,
  FiRefreshCw, FiMap, FiAlertCircle, FiTruck, 
  FiTrendingUp, FiTrendingDown, FiCircle, FiCheck
} from 'react-icons/fi';
import { BarChart } from '../components/Charts';

export default function OverviewPage() {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/dashboard');
      
      // A resposta real está em response.data
      if (response.success) {
        setDashboardData(response.data);
        setLastUpdated(new Date());
      } else {
        const errorMessage = response.message || 'Erro ao carregar dados';
        setError(errorMessage);
        toast.error(errorMessage);
      }
    } catch (err) {
      console.error('Erro ao buscar dados:', err);
      const errorMessage = err?.message || 'Erro de conexão com o servidor';
      setError(errorMessage);
      toast.error('Erro ao carregar dashboard: ' + errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Função para formatar os níveis de risco para exibição
  const formatRiskLevel = (level) => {
    switch(level) {
      case 'alto_risco': return 'Alto Risco';
      case 'medio_risco': return 'Médio Risco';
      case 'baixo_risco': return 'Baixo Risco';
      case 'desconhecido': return 'Desconhecido';
      default: return level;
    }
  };

  // Função para parsear os dados de tendência
  const parseTrendValue = (trendData) => {
    if (!trendData) return null;
    
    if (typeof trendData === 'object') {
      return {
        value: trendData.valor || 0,
        direction: trendData.tendencia === 'aumento' ? 'up' : 
                 trendData.tendencia === 'reducao' ? 'down' : 'neutral',
        display: trendData.percentual || '0%',
        details: trendData.detalhes || ''
      };
    }
    
    return {
      value: 0,
      direction: 'neutral',
      display: '0%',
      details: ''
    };
  };

  if (error) {
    return (
      <div className="min-h-screen p-6">
        <div className="max-w-7xl mx-auto bg-red-50 p-6 rounded-lg border border-red-200 text-center">
          <FiAlertCircle className="mx-auto text-red-500 text-4xl mb-4" />
          <h2 className="text-xl font-bold text-red-600 mb-2">Erro ao carregar o dashboard</h2>
          <p className="text-red-500 mb-6">{error}</p>
          <button
            onClick={fetchDashboardData}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition flex items-center gap-2 mx-auto"
          >
            <FiRefreshCw size={18} /> Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Cabeçalho */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Painel de Monitoramento</h1>
            {lastUpdated && (
              <p className="text-sm text-gray-500 mt-1">
                Última atualização: {lastUpdated.toLocaleTimeString()}
              </p>
            )}
          </div>
          <button
            onClick={fetchDashboardData}
            disabled={loading}
            className="flex items-center gap-2 bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-md transition disabled:opacity-50"
          >
            <FiRefreshCw className={loading ? 'animate-spin' : ''} size={18} />
            {loading ? 'Atualizando...' : 'Atualizar Dados'}
          </button>
        </div>

        {/* Cards de Estatísticas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {loading ? (
            Array(5).fill(0).map((_, idx) => (
              <StatCardSkeleton key={idx} />
            ))
          ) : (
            <>
              <StatCard 
                title="Casos Ativos" 
                value={dashboardData?.casos_ativos?.total || 0}
                icon={<FiActivity className="text-red-500" size={24} />}
                trend={parseTrendValue(dashboardData?.tendencias?.casos_ativos)}
                color="bg-red-50"
                additionalInfo={[
                  { label: 'Alto Risco', value: dashboardData?.casos_ativos?.alto_risco || 0 },
                  { label: 'Médio Risco', value: dashboardData?.casos_ativos?.medio_risco || 0 }
                ]}
              />
              <StatCard 
                title="Novos Casos (24h)" 
                value={dashboardData?.novos_casos_24h?.total || 0}
                icon={<FiPlusCircle className="text-blue-500" size={24} />}
                trend={parseTrendValue(dashboardData?.tendencias?.novos_casos)}
                color="bg-blue-50"
                additionalInfo={[
                  { label: 'Alto Risco', value: dashboardData?.novos_casos_24h?.por_risco?.alto || 0 },
                  { label: 'Médio Risco', value: dashboardData?.novos_casos_24h?.por_risco?.medio || 0 },
                  { label: 'Baixo Risco', value: dashboardData?.novos_casos_24h?.por_risco?.baixo || 0 }
                ]}
              />
              <StatCard 
                title="Recuperados" 
                value={dashboardData?.recuperados?.total || 0}
                icon={<FiCheck className="text-green-500" size={24} />}
                color="bg-green-50"
                description={dashboardData?.recuperados?.descricao || 'Pacientes que tiveram alto risco e agora têm baixo risco'}
              />
              <StatCard 
                title="Leitos Ocupados" 
                value={`${dashboardData?.leitos?.ocupados || 0}/${dashboardData?.leitos?.total || 0}`}
                subValue={`${dashboardData?.leitos?.percentual_ocupacao || 0}%`}
                icon={<FiHeart className="text-purple-500" size={24} />}
                trend={parseTrendValue(dashboardData?.tendencias?.leitos_ocupados)}
                color="bg-purple-50"
              />
              <StatCard 
                title="Ambulâncias" 
                value={`${dashboardData?.ambulancias?.disponiveis || 0}/${dashboardData?.ambulancias?.total || 0}`}
                icon={<FiTruck className="text-amber-500" size={24} />}
                trend={parseTrendValue(dashboardData?.tendencias?.ambulancias_disponiveis)}
                color="bg-amber-50"
              />
            </>
          )}
        </div>

        {/* Gráficos Principais */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {loading ? (
            <>
              <ChartSkeleton />
              <ChartSkeleton />
            </>
          ) : (
            <>
              <div className="bg-white p-4 rounded-lg shadow-md border border-gray-100">
                <h2 className="font-semibold text-lg flex items-center gap-2 mb-4">
                  <FiMap className="text-cyan-600" /> Distribuição por Nível de Risco
                </h2>
                <div className="h-80">
                  <BarChart 
                    data={dashboardData?.distribuicao_risco?.map(item => ({
                      name: formatRiskLevel(item.nivel),
                      value: item.quantidade,
                      color: item.nivel === 'alto_risco' ? '#ef4444' : 
                             item.nivel === 'medio_risco' ? '#f59e0b' : 
                             item.nivel === 'baixo_risco' ? '#10b981' : '#6b7280'
                    })) || []}
                    colors={['#ef4444', '#f59e0b', '#10b981', '#6b7280']}
                  />
                </div>
              </div>
              
              {/* Seção revisada de Ocupação de Recursos */}
              <div className="bg-white p-4 rounded-lg shadow-md border border-gray-100">
                <h2 className="font-semibold text-lg flex items-center gap-2 mb-4">
                  <FiAlertTriangle className="text-amber-600" /> Ocupação de Recursos
                </h2>
                
                <div className="space-y-6">
                  {/* Card para Leitos */}
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-3">
                      <div className="flex items-center gap-2">
                        <FiHeart className="text-purple-600" size={20} />
                        <h3 className="font-medium text-gray-700">Leitos Hospitalares</h3>
                      </div>
                      <span className="font-bold text-lg">
                        {dashboardData?.leitos?.ocupados || 0}/{dashboardData?.leitos?.total || 0}
                      </span>
                    </div>
                    
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className="h-2.5 rounded-full bg-purple-600" 
                        style={{ 
                          width: `${dashboardData?.leitos?.percentual_ocupacao || 0}%`,
                          minWidth: '5px' 
                        }}
                      ></div>
                    </div>
                    
                    <div className="flex justify-between mt-2 text-sm text-gray-600">
                      <span>Disponíveis: {dashboardData?.leitos?.disponiveis || 0}</span>
                      <span>{dashboardData?.leitos?.percentual_ocupacao || 0}% ocupados</span>
                    </div>
                  </div>
                  
                  {/* Card para Ambulâncias */}
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-3">
                      <div className="flex items-center gap-2">
                        <FiTruck className="text-amber-600" size={20} />
                        <h3 className="font-medium text-gray-700">Ambulâncias</h3>
                      </div>
                      <span className="font-bold text-lg">
                        {dashboardData?.ambulancias?.disponiveis || 0}/{dashboardData?.ambulancias?.total || 0}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-2">
                      <div className="text-center">
                        <div className="text-sm text-gray-600 mb-1">Disponíveis</div>
                        <div className="text-lg font-bold text-green-600">
                          {dashboardData?.ambulancias?.disponiveis || 0}
                        </div>
                      </div>
                      
                      <div className="text-center">
                        <div className="text-sm text-gray-600 mb-1">Em Uso</div>
                        <div className="text-lg font-bold text-amber-600">
                          {dashboardData?.ambulancias?.em_uso || 0}
                        </div>
                      </div>
                      
                      <div className="text-center">
                        <div className="text-sm text-gray-600 mb-1">Manutenção</div>
                        <div className="text-lg font-bold text-red-600">
                          {dashboardData?.ambulancias?.manutencao || 0}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Gráfico de barras para ocupação percentual */}
                  <div>
                    <h4 className="font-medium text-gray-700 mb-3">Comparação de Ocupação</h4>
                    <div className="h-48">
                      <BarChart 
                        data={[
                          { 
                            name: 'Leitos', 
                            value: dashboardData?.leitos?.percentual_ocupacao || 0,
                            color: '#8b5cf6'
                          },
                          { 
                            name: 'Ambulâncias', 
                            value: dashboardData?.ambulancias?.total 
                              ? Math.round(
                                  (dashboardData.ambulancias.em_uso / dashboardData.ambulancias.total) * 100
                                )
                              : 0,
                            color: '#f59e0b'
                          }
                        ]}
                        colors={['#8b5cf6', '#f59e0b']}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Tabela de Tendências */}
        <div className="bg-white p-4 rounded-lg shadow-md border border-gray-100">
          <h2 className="font-semibold text-lg mb-4">Tendências</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Métrica</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Variação</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tendência</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Detalhes</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {dashboardData?.tendencias && Object.entries(dashboardData.tendencias).map(([key, trendData]) => {
                  const trend = parseTrendValue(trendData);
                  return (
                    <tr key={key}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 capitalize">
                        {key.replace(/_/g, ' ')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {trend.display}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className={`flex items-center ${
                          trend.direction === 'up' ? 'text-red-500' : 
                          trend.direction === 'down' ? 'text-green-500' : 'text-gray-500'
                        }`}>
                          {trend.direction === 'up' ? (
                            <FiTrendingUp className="mr-1" />
                          ) : trend.direction === 'down' ? (
                            <FiTrendingDown className="mr-1" />
                          ) : (
                            <FiCircle className="mr-1" />
                          )}
                          {trend.direction === 'up' ? 'Aumento' : 
                           trend.direction === 'down' ? 'Redução' : 'Estável'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {trend.details}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

// Componente StatCard atualizado
function StatCard({ title, value, subValue, icon, trend, color, additionalInfo, description }) {
  return (
    <div className={`p-4 rounded-lg shadow-md border border-gray-100 ${color}`}>
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <p className="text-2xl font-bold mt-1">{value}</p>
          {subValue && <p className="text-sm text-gray-600 mt-1">{subValue}</p>}
          {description && <p className="text-xs text-gray-500 mt-1">{description}</p>}
        </div>
        <div className="p-2 rounded-full bg-white shadow-sm">
          {icon}
        </div>
      </div>
      
      {trend && (
        <div className={`mt-2 text-sm flex items-center ${
          trend.direction === 'up' ? 'text-red-500' : 
          trend.direction === 'down' ? 'text-green-500' : 'text-gray-500'
        }`}>
          {trend.direction === 'up' ? (
            <FiTrendingUp className="mr-1" />
          ) : trend.direction === 'down' ? (
            <FiTrendingDown className="mr-1" />
          ) : (
            <FiCircle className="mr-1" />
          )}
          {trend.display}
        </div>
      )}
      
      {additionalInfo && (
        <div className="mt-3 pt-3 border-t border-gray-200">
          {additionalInfo.map((info, index) => (
            <div key={index} className="flex justify-between text-xs text-gray-600 mb-1 last:mb-0">
              <span>{info.label}:</span>
              <span className="font-medium">{info.value}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Componentes de Loading
function StatCardSkeleton() {
  return (
    <div className="p-4 rounded-lg shadow-md bg-gray-100 animate-pulse h-32">
      <div className="w-1/2 h-4 bg-gray-300 rounded mb-4"></div>
      <div className="w-1/3 h-8 bg-gray-300 rounded mb-4"></div>
      <div className="w-3/4 h-3 bg-gray-200 rounded"></div>
    </div>
  );
}

function ChartSkeleton() {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md border border-gray-100">
      <div className="w-1/3 h-5 bg-gray-200 rounded mb-6 animate-pulse"></div>
      <div className="w-full h-64 bg-gray-100 rounded animate-pulse"></div>
    </div>
  );
}