import { useEffect, useState } from 'react';
import api from '../services/api';
import { BarChart, PieChart } from '../components/Charts';

export default function OverviewPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    api.get('/dashboard')
      .then(response => setData(response.data)) // Corrigido para usar response.data
      .catch(err => {
        console.error('Erro ao buscar dados:', err);
        setErro('Erro ao carregar dados do dashboard');
      })
      .finally(() => setLoading(false));
  }, []);

  if (erro) {
    return (
      <div className="p-6 text-red-500 bg-red-100 rounded-lg">
        {erro}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold mb-4">Visão Geral</h1>

      {/* Estatísticas principais */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {loading ? (
          Array(4).fill(0).map((_, idx) => (
            <SkeletonCard key={idx} />
          ))
        ) : (
          <>
            <StatCard title="Casos Ativos" value={data?.casos_ativos ?? 0} color="bg-red-100 text-red-600" />
            <StatCard title="Curados" value={data?.curados ?? 0} color="bg-green-100 text-green-600" />
            <StatCard title="Óbitos" value={data?.obitos ?? 0} color="bg-gray-100 text-gray-600" />
            <StatCard title="Novos Casos (24h)" value={data?.novos_casos_24h ?? 0} color="bg-blue-100 text-blue-600" />
          </>
        )}
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {loading ? (
          <>
            <SkeletonChart />
            <SkeletonChart />
          </>
        ) : (
          <>
            <div className="bg-white p-4 rounded shadow">
              <h2 className="font-semibold mb-2">Distribuição por Região</h2>
              <BarChart data={data?.regional_distribution ?? []} />
            </div>
            <div className="bg-white p-4 rounded shadow">
              <h2 className="font-semibold mb-2">Classificação de Risco</h2>
              <PieChart data={data?.risk_classification ?? []} />
            </div>
          </>
        )}
      </div>

      {/* Ambulâncias */}
      {loading ? (
        <SkeletonAmbulancia />
      ) : (
        <div className="bg-white p-4 rounded shadow">
          <h2 className="font-semibold mb-2">Ambulâncias Ativas</h2>
          <p className="text-lg">
            {data?.ambulancias_ativas?.ativas ?? 0} de {data?.ambulancias_ativas?.total ?? 0} ativas
          </p>
        </div>
      )}
    </div>
  );
}

function StatCard({ title, value, color }) {
  return (
    <div className={`p-4 rounded shadow ${color}`}>
      <p className="text-sm">{title}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="p-4 rounded shadow bg-slate-200 animate-pulse h-24">
      <div className="w-1/2 h-4 bg-slate-300 rounded mb-2"></div>
      <div className="w-1/3 h-6 bg-slate-300 rounded"></div>
    </div>
  );
}

function SkeletonChart() {
  return (
    <div className="bg-white p-4 rounded shadow">
      <div className="w-1/3 h-4 bg-slate-300 rounded mb-4 animate-pulse"></div>
      <div className="w-full h-40 bg-slate-200 rounded animate-pulse"></div>
    </div>
  );
}

function SkeletonAmbulancia() {
  return (
    <div className="bg-white p-4 rounded shadow">
      <div className="w-1/4 h-4 bg-slate-300 rounded mb-2 animate-pulse"></div>
      <div className="w-1/2 h-6 bg-slate-200 rounded animate-pulse"></div>
    </div>
  );
}
