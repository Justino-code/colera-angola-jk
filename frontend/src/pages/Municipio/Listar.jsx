import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../../services/api';

export default function MunicipioListar() {
  const [municipios, setMunicipios] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMunicipios = async () => {
      try {
        const { data } = await api.get('/municipios');
        setMunicipios(data);
      } catch (error) {
        console.error('Erro ao carregar municípios:', error);
        toast.error('Erro ao carregar municípios');
      } finally {
        setLoading(false);
      }
    };

    fetchMunicipios();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Tem certeza que deseja excluir este município?')) {
      return;
    }
    try {
      await api.delete(`/municipios/${id}`);
      setMunicipios(municipios.filter((m) => m.id_municipio !== id));
      toast.success('Município excluído com sucesso!');
    } catch (error) {
      console.error('Erro ao excluir município:', error);
      toast.error('Erro ao excluir município');
    }
  };

  if (loading) {
    return (
      <div className="h-full w-full flex flex-col bg-white p-6 rounded shadow">
        <div className="animate-pulse w-full max-w-lg space-y-4">
          <div className="h-6 bg-slate-200 rounded" />
          <div className="h-6 bg-slate-200 rounded" />
          <div className="h-6 bg-slate-200 rounded" />
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full flex flex-col bg-white p-6 rounded shadow">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-slate-700">Municípios</h1>
        <Link
          to="/municipio/criar"
          className="bg-cyan-600 text-white px-4 py-2 rounded hover:bg-cyan-700 transition"
        >
          Novo Município
        </Link>
      </div>
      <div className="flex-1 overflow-auto">
        {municipios.length === 0 ? (
          <p className="text-slate-600">Nenhum município cadastrado.</p>
        ) : (
          <table className="w-full table-auto border">
            <thead className="bg-slate-100">
              <tr>
                <th className="border p-2 text-left">Nome</th>
                <th className="border p-2 text-left">Província</th>
                <th className="border p-2 text-center">Ações</th>
              </tr>
            </thead>
            <tbody>
              {municipios.map((m) => (
                <tr key={m.id_municipio} className="hover:bg-slate-50">
                  <td className="border p-2">{m.nome}</td>
                  <td className="border p-2">{m.nome_provincia}</td>
                  <td className="border p-2 text-center space-x-2">
                    <button
                      onClick={() => navigate(`/municipio/${m.id_municipio}`)}
                      className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600 transition"
                    >
                      Detalhes
                    </button>
                    <button
                      onClick={() => navigate(`/municipio/${m.id_municipio}/editar`)}
                      className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600 transition"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(m.id_municipio)}
                      className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition"
                    >
                      Excluir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

