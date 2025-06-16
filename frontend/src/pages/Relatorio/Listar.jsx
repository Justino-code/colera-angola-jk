import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import toast from 'react-hot-toast';

export default function RelatorioListar() {
  const [relatorios, setRelatorios] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRelatorios = async () => {
      try {
        const res = await api.get('/relatorios');
        if (res.data.success) {
          setRelatorios(res.data.data);
        } else {
          toast.error(res.data.message || 'Falha ao carregar relatórios');
        }
      } catch (err) {
        console.error('Erro ao carregar relatórios:', err);
        toast.error('Erro ao carregar relatórios');
      } finally {
        setLoading(false);
      }
    };

    fetchRelatorios();
  }, []);

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-700">Lista de Relatórios</h1>
        <Link 
          to="/relatorios/gerar" 
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
        >
          Gerar Relatório
        </Link>
      </div>

      {loading ? (
        <div className="space-y-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-12 bg-slate-200 rounded animate-pulse"></div>
          ))}
        </div>
      ) : relatorios.length > 0 ? (
        <div className="space-y-2">
          {relatorios.map((r) => (
            <div 
              key={r.id}
              className="bg-white p-3 rounded shadow flex justify-between items-center"
            >
              <div>
                <p className="font-medium">{r.titulo}</p>
                <p className="text-sm text-slate-500">{new Date(r.data).toLocaleDateString()} - {r.hospital_nome}</p>
              </div>
              <Link 
                to={`/relatorios/${r.id}`}
                className="text-blue-500 hover:underline text-sm"
              >
                Ver detalhes
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-slate-500">Nenhum relatório encontrado.</p>
      )}
    </div>
  );
}

