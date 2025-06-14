import { useEffect, useState } from 'react';
import { apiGet } from '../services/api';

export default function RelatoriosPage() {
  const [relatorios, setRelatorios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    apiGet('/relatorios')
      .then(data => setRelatorios(data))
      .catch(() => setErro('Erro ao carregar relatórios'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Relatórios</h1>

      {erro && <div className="p-4 bg-red-100 text-red-600 rounded">{erro}</div>}

      {loading ? (
        <SkeletonRelatorios />
      ) : (
        <div className="space-y-3">
          {relatorios.map((relatorio) => (
            <div key={relatorio.id} className="bg-white p-4 rounded shadow">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="font-semibold">{relatorio.titulo}</h2>
                  <p className="text-sm text-slate-500">
                    Gerado em: {new Date(relatorio.gerado_em).toLocaleString()}
                  </p>
                </div>
                <a
                  href={relatorio.url_pdf}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  Ver PDF
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function SkeletonRelatorios() {
  return (
    <div className="space-y-3">
      {Array(4).fill(0).map((_, idx) => (
        <div key={idx} className="bg-slate-200 p-4 rounded shadow animate-pulse space-y-2">
          <div className="h-4 bg-slate-300 rounded w-1/3"></div>
          <div className="h-3 bg-slate-300 rounded w-1/4"></div>
        </div>
      ))}
    </div>
  );
}
