import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import toast from 'react-hot-toast';

export default function RelatorioDetalhes() {
  const { id } = useParams();
  const [relatorio, setRelatorio] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRelatorio = async () => {
      try {
        const res = await api.get(`/relatorio/${id}`);
        if (res.success) {
          setRelatorio(res.data);
          console.log(res);
          
        } else {
          toast.error("Relatório não encontrado.");
          navigate("/relatorio");
        }
      } catch (err) {
        console.error("Erro ao carregar relatório:", err);
        toast.error("Erro ao carregar relatório");
        navigate("/relatorio");
      } finally {
        setLoading(false);
      }
    };
    fetchRelatorio();
  }, [id, navigate]);

  function renderDados() {
    if (!relatorio?.dados) return <span className="text-slate-400">Sem dados</span>;
    if (typeof relatorio.dados === "object") {
      return (
        <table className="w-full text-sm border mt-2 rounded">
          <thead>
            <tr className="bg-slate-100">
              <th className="border p-2">Campo</th>
              <th className="border p-2">Valor</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(relatorio.dados).map(([k, v]) => (
              <tr key={k} className="even:bg-slate-50">
                <td className="border p-2 font-medium">{k}</td>
                <td className="border p-2">{typeof v === "object" ? JSON.stringify(v) : String(v)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      );
    }
    return (
      <div className="bg-slate-100 p-2 rounded text-xs font-mono mt-2 border">
        {String(relatorio.dados)}
      </div>
    );
  }

  return (
    <div className="h-full w-full flex flex-col bg-white p-4 rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Detalhes do Relatório</h1>

      {loading ? (
        <div className="space-y-2">
          <div className="h-6 bg-slate-200 rounded animate-pulse w-1/3"></div>
          <div className="h-6 bg-slate-200 rounded animate-pulse w-1/2"></div>
          <div className="h-40 bg-slate-200 rounded animate-pulse"></div>
        </div>
      ) : relatorio ? (
        <div className="flex-1 flex flex-col space-y-3">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
            <div>
              <p><strong>ID:</strong> {relatorio.id_relatorio}</p>
              <p><strong>Tipo:</strong> {relatorio.tipo.replaceAll("_", " ")}</p>
              <p>
                <strong>Data:</strong>{" "}
                {relatorio.data_geracao
                  ? new Date(relatorio.data_geracao).toLocaleString()
                  : "-"}
              </p>
              <p>
                <strong>Usuário:</strong>{" "}
                {relatorio.usuario?.nome || relatorio.id_usuario}
              </p>
            </div>
            <button
              onClick={() => navigate("/relatorio")}
              className="bg-slate-200 text-slate-700 px-4 py-2 rounded hover:bg-slate-300"
            >
              Voltar
            </button>
          </div>
          <div className="flex-1 flex flex-col">
            <h2 className="font-semibold mt-2 mb-1">Dados do Relatório</h2>
            {renderDados()}
          </div>
        </div>
      ) : (
        <p className="text-slate-500">Relatório não encontrado.</p>
      )}
    </div>
  );
}

