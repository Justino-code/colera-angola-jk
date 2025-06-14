import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

export default function GabineteListar() {
  const [gabinetes, setGabinetes] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGabinetes = async () => {
      try {
        const { data } = await api.get('/gabinetes');
        setGabinetes(data);
      } catch (error) {
        console.error('Erro ao buscar gabinetes:', error);
        alert('Erro ao carregar os gabinetes');
      } finally {
        setLoading(false);
      }
    };

    fetchGabinetes();
  }, []);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-slate-700">Lista de Gabinetes</h1>
        <button
          onClick={() => navigate('/gabinete/criar')}
          className="bg-cyan-600 text-white py-2 px-4 rounded hover:bg-cyan-700 transition"
        >
          Novo Gabinete
        </button>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-10 bg-slate-200 rounded animate-pulse"></div>
          ))}
        </div>
      ) : gabinetes.length > 0 ? (
        <div className="space-y-2">
          {gabinetes.map((gab) => (
            <div
              key={gab.id}
              className="p-4 bg-white rounded shadow flex justify-between items-center"
            >
              <div>
                <p className="font-medium text-slate-700">{gab.nome}</p>
                <p className="text-sm text-slate-500">Responsável: {gab.responsavel}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => navigate(`/gabinete/detalhes/${gab.id}`)}
                  className="text-cyan-600 hover:underline"
                >
                  Detalhes
                </button>
                <button
                  onClick={() => navigate(`/gabinete/editar/${gab.id}`)}
                  className="text-yellow-600 hover:underline"
                >
                  Editar
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-slate-500">Nenhum gabinete cadastrado.</p>
      )}
    </div>
  );
}
