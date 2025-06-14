// src/pages/relatorios/Detalhes.jsx
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../services/api';

export default function RelatoriosDetalhes() {
  const { id } = useParams();
  const [relatorio, setRelatorio] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRelatorio = async () => {
      try {
        const response = await api.get(`/relatorios/${id}`);
        setRelatorio(response.data);
      } catch (error) {
        console.error('Erro ao carregar relatório:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRelatorio();
  }, [id]);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Detalhes do Relatório</h1>

      {loading ? (
        <div className="space-y-2">
          <div className="h-6 bg-slate-200 rounded animate-pulse w-1/3"></div>
          <div className="h-6 bg-slate-200 rounded animate-pulse w-1/2"></div>
          <div className="h-40 bg-slate-200 rounded animate-pulse"></div>
        </div>
      ) : relatorio ? (
        <div className="bg-white p-4 rounded shadow">
          <p><strong>ID:</strong> {relatorio.id}</p>
          <p><strong>Título:</strong> {relatorio.titulo}</p>
          <p><strong>Data:</strong> {new Date(relatorio.data).toLocaleDateString()}</p>
          <p><strong>Hospital:</strong> {relatorio.hospital_nome}</p>
          <p><strong>Descrição:</strong></p>
          <p className="mt-2">{relatorio.descricao}</p>

          <div className="mt-4">
            <Link
              to="/relatorios"
              className="text-blue-500 hover:underline"
            >
              Voltar para Relatórios
            </Link>
          </div>
        </div>
      ) : (
        <p className="text-slate-500">Relatório não encontrado.</p>
      )}
    </div>
  );
}
