import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../../services/api';

export default function GabineteListar() {
  const [gabinetes, setGabinetes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGabinetes = async () => {
      try {
        const res = await api.get('/gabinetes');
        console.log('Dados recebidos:', res);

        if (res.success && Array.isArray(res.data)) {
          setGabinetes(res.data);
        } else if (res.success && Array.isArray(res.gabinetes)) {
          setGabinetes(res.gabinetes);
        } else {
          toast.error('Formato inesperado:', res);
          console.warn('Formato inesperado:', res);
          setGabinetes([]);
        }
      } catch (error) {
        toast.error('Erro ao buscar gabinetes:', error);
        console.error('Erro ao buscar gabinetes:', error);
        setGabinetes([]);
      } finally {
        setLoading(false);
      }
    };

    fetchGabinetes();
  }, []);

  const removerGabinete = async (id) => {
    if (!window.confirm('Tem certeza que deseja remover este gabinete?')) return;

    try {
      const res = await api.delete(`/gabinetes/${id}`);
      if (res.success) {
        toast.success('Gabinete removido com sucesso!');
        setGabinetes(gabinetes.filter(g => (g.id || g.id_gabinete) !== id));
      } else {
        toast.error(res.message || 'Erro ao remover gabinete');
      }
    } catch (error) {
      console.error('Erro ao remover gabinete:', error);
      toast.error('Erro ao remover gabinete');
    }
  };

  if (loading) {
    return (
      <div className="space-y-2">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="animate-pulse bg-slate-200 rounded h-16"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="h-full w-full flex flex-col min-h-0 bg-white p-6 rounded shadow">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-slate-700">Gabinetes</h1>
        <Link
          to="/gabinete/criar"
          className="bg-cyan-600 text-white px-4 py-2 rounded hover:bg-cyan-700 transition"
        >
          Novo Gabinete
        </Link>
      </div>

      {gabinetes.length === 0 ? (
        <p className="text-slate-500">Nenhum gabinete cadastrado.</p>
      ) : (
        <div className="space-y-2">
          {gabinetes.map((gabinete) => {
            const idGabinete = gabinete.id || gabinete.id_gabinete;
            return (
              <div
                key={idGabinete}
                className="p-4 bg-white rounded shadow flex justify-between items-center"
              >
                <div>
                  <p className="font-medium">{gabinete.nome}</p>
                  {gabinete.local && (
                    <p className="text-sm text-slate-500">{gabinete.local}</p>
                  )}
                </div>
                <div className="space-x-2">
                  <Link
                    to={`/gabinete/${idGabinete}`}
                    className="text-cyan-600 hover:underline"
                  >
                    Detalhes
                  </Link>
                  <Link
                    to={`/gabinete/${idGabinete}/editar`}
                    className="text-amber-600 hover:underline"
                  >
                    Editar
                  </Link>
                  <button
                    onClick={() => removerGabinete(idGabinete)}
                    className="text-red-600 hover:underline"
                  >
                    Remover
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
