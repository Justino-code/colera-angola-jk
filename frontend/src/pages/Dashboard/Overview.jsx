// src/pages/Dashboard/Overview.js
import { BarChart, PieChart } from '../../components/Charts';
import { RecentPatients, AmbulanceStatus } from '../../components/Widgets';

export default function Overview() {
  return (
    <div className="space-y-6">
      {/* Cards Estatísticos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Casos Ativos"
          value="2,345"
          trend="+12.3%"
          icon="🦠"
          color="bg-rose-100 text-rose-600"
        />
        <StatCard
          title="Leitos Ocupados"
          value="85%"
          trend="+3.2%"
          icon="🏥"
          color="bg-amber-100 text-amber-600"
        />
        <StatCard
          title="Ambulâncias Ativas"
          value="18/24"
          trend="-2.1%"
          icon="🚑"
          color="bg-emerald-100 text-emerald-600"
        />
        <StatCard
          title="Novos Casos (24h)"
          value="47"
          trend="+5.6%"
          icon="📈"
          color="bg-blue-100 text-blue-600"
        />
      </div>

      {/* Gráficos Principais */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Distribuição de Casos por Região</h3>
          <BarChart />
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Classificação de Riscos</h3>
          <PieChart />
        </div>
      </div>

      {/* Widgets Secundários */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentPatients />
        <AmbulanceStatus />
      </div>
    </div>
  );
}

// Componente StatCard
function StatCard({ title, value, trend, icon, color }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm flex items-center justify-between">
      <div>
        <p className="text-sm text-slate-500 mb-1">{title}</p>
        <div className="flex items-baseline space-x-2">
          <span className="text-2xl font-bold">{value}</span>
          <span className={`text-sm ${trend.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
            {trend}
          </span>
        </div>
      </div>
      <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${color}`}>
        {icon}
      </div>
    </div>
  );
}