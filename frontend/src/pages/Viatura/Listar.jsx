import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import toast from 'react-hot-toast';

export default function ViaturaListar() {
  const [viaturas, setViaturas] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchViaturas = async () => {
      try {
        const res = await api.get('/viaturas');
        console.log(res);
        if (res.success) {
          setViaturas(res.data);
        } else {
          toast.error(res.error || 'Erro ao carregar viaturas');
        }
      } catch (error) {
        toast.error('Erro ao conectar ao servidor');
      } finally {
        setLoading(false);
      }
    };
    fetchViaturas();
  }, []);

  const removerViatura = async (id) => {
    if (!window.confirm('Deseja realmente remover esta viatura?')) return;
    try {
      const res = await api.delete(`/viaturas/${id}`);
      if (res.success) {
        toast.success(res.message || 'Viatura removida com sucesso');
        setViaturas(viaturas.filter(v => v.id_viatura || v.id !== id));
      } else {
        toast.error(res.error || 'Erro ao remover viatura');
      }
    } catch {
      toast.error('Erro ao remover viatura');
    }
  };

  if (loading) {
    return <div className="p-6 text-center text-slate-500">Carregando viaturas...</div>;
  }

  return (
    <div className="h-full w-full flex flex-col bg-white p-6 rounded shadow">
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold">Viaturas</h1>
        <Link
          to="/viatura/criar"
          className="bg-cyan-600 text-white px-4 py-2 rounded hover:bg-cyan-700"
        >
          Nova Viatura
        </Link>
      </div>

      {viaturas.length === 0 ? (
        <div className="text-slate-500">Nenhuma viatura cadastrada.</div>
      ) : (
        <table className="w-full border-collapse border flex-1">
          <thead className="bg-slate-100">
            <tr>
              <th className="border p-2 text-left">Identificação</th>
              <th className="border p-2 text-left">Tipo</th>
              <th className="border p-2 text-left">Status</th>
              <th className="border p-2 text-left">Hospital</th>
              <th className="border p-2">Ações</th>
            </tr>
          </thead>
          <tbody>
            {viaturas.map(v => (
              <tr key={v.id_viatura}>
                <td className="border p-2">{v.identificacao}</td>
                <td className="border p-2">{v.tipo}</td>
                <td className="border p-2">{v.status}</td>
                <td className="border p-2">{v.hospital?.nome || 'N/A'}</td>
                <td className="border p-2 text-center">
                  <div className="flex gap-2 justify-center">
                    <Link to={`/viatura/${v.id_viatura || v.id}`} className="text-cyan-600 hover:underline">
                      Detalhes
                    </Link>
                    <Link to={`/viatura/${v.id_viatura || v.id}/editar`} className="text-yellow-600 hover:underline">
                      Editar
                    </Link>
                    <button
                      onClick={() => removerViatura(v.id_viatura || v.id)}
                      className="text-red-600 hover:underline"
                    >
                      Remover
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
