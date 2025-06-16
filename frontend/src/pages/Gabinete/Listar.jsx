import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';

export default function GabineteListar() {
  const [gabinetes, setGabinetes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGabinetes = async () => {
      try {
        const response = await api.get('/gabinetes');
        console.log('Dados recebidos:', response);

        const { data } = response;

        if (data.success && Array.isArray(data.data)) {
          setGabinetes(data.data);
        } else if (data.success && Array.isArray(data.gabinetes)) {
          setGabinetes(data.gabinetes);
        } else {
          console.warn('Formato inesperado:', data);
          setGabinetes([]);
        }
      } catch (error) {
        console.error('Erro ao buscar gabinetes:', error);
        setGabinetes([]);
      } finally {
        setLoading(false);
      }
    };

    fetchGabinetes();
  }, []);

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
    <div className="p-6 max-w-3xl mx-auto">
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
          {gabinetes.map((gabinete) => (
            <div
              key={gabinete.id || gabinete.id_gabinete}
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
                  to={`/gabinete/detalhes/${gabinete.id || gabinete.id_gabinete}`}
                  className="text-cyan-600 hover:underline"
                >
                  Detalhes
                </Link>
                <Link
                  to={`/gabinete/editar/${gabinete.id || gabinete.id_gabinete}`}
                  className="text-amber-600 hover:underline"
                >
                  Editar
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

