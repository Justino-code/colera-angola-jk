import { useEffect, useState } from 'react';
import { apiGet } from '../services/api';

export default function MapaPage() {
  const [casos, setCasos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    apiGet('/casos')
      .then(data => setCasos(data))
      .catch(() => setErro('Erro ao carregar casos do mapa'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Mapa de Casos</h1>

      {erro && <div className="p-4 bg-red-100 text-red-600 rounded">{erro}</div>}

      {loading ? (
        <SkeletonMapa />
      ) : (
        <div className="space-y-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {casos.map(caso => (
              <div key={caso.id} className="p-4 bg-white rounded shadow">
                <p className="font-semibold">{caso.regiao}</p>
                <p className="text-sm">Casos: {caso.numero_casos}</p>
                <p className="text-sm">Óbitos: {caso.numero_obitos}</p>
                <p className="text-sm text-slate-500">Atualizado: {new Date(caso.atualizado_em).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
          <MapaSVG casos={casos} />
        </div>
      )}
    </div>
  );
}

function SkeletonMapa() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array(6).fill(0).map((_, idx) => (
          <div key={idx} className="p-4 bg-slate-200 rounded shadow animate-pulse space-y-2">
            <div className="h-4 bg-slate-300 rounded w-1/2"></div>
            <div className="h-3 bg-slate-300 rounded w-1/3"></div>
            <div className="h-3 bg-slate-300 rounded w-1/4"></div>
          </div>
        ))}
      </div>
      <div className="h-64 bg-slate-200 rounded animate-pulse"></div>
    </div>
  );
}

function MapaSVG({ casos }) {
  // Aqui você pode colocar seu SVG do mapa ou uma lib como react-simple-maps
  // Para exemplo, só um box
  return (
    <div className="h-64 bg-slate-100 border rounded flex items-center justify-center">
      <p className="text-slate-500">[Mapa SVG / Gráfico de Casos]</p>
    </div>
  );
}
