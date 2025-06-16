import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';

export default function GabineteDetalhes() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [gabinete, setGabinete] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGabinete = async () => {
      try {
        const { data } = await api.get(`/gabinetes/${id}`);
        if (data.success) {
          setGabinete(data.data); // assume resposta { success, data }
        } else {
          alert(data.message || 'Gabinete não encontrado');
          navigate('/gabinete');
        }
      } catch (error) {
        console.error('Erro ao buscar gabinete:', error);
        alert('Erro ao buscar gabinete');
        navigate('/gabinete');
      } finally {
        setLoading(false);
      }
    };

    fetchGabinete();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="p-6 max-w-lg mx-auto">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-slate-200 rounded w-1/3" />
          <div className="h-4 bg-slate-200 rounded w-1/2" />
          <div className="h-4 bg-slate-200 rounded w-2/3" />
          <div className="h-4 bg-slate-200 rounded w-1/4" />
        </div>
      </div>
    );
  }

  if (!gabinete) return null;

  return (
    <div className="p-6 max-w-lg mx-auto bg-white rounded shadow">
      <h1 className="text-2xl font-bold text-slate-700 mb-4">Detalhes do Gabinete</h1>
      <div className="space-y-2">
        <div>
          <span className="font-semibold text-slate-600">Nome:</span>
          <p className="text-slate-700">{gabinete.nome}</p>
        </div>
        <div>
          <span className="font-semibold text-slate-600">Responsável:</span>
          <p className="text-slate-700">{gabinete.responsavel}</p>
        </div>
        {gabinete.municipio && (
          <div>
            <span className="font-semibold text-slate-600">Município:</span>
            <p className="text-slate-700">{gabinete.municipio.nome}</p>
          </div>
        )}
        <div>
          <span className="font-semibold text-slate-600">Criado em:</span>
          <p className="text-slate-700">{new Date(gabinete.created_at).toLocaleString()}</p>
        </div>
        {gabinete.updated_at && (
          <div>
            <span className="font-semibold text-slate-600">Atualizado em:</span>
            <p className="text-slate-700">{new Date(gabinete.updated_at).toLocaleString()}</p>
          </div>
        )}
      </div>
      <div className="mt-4 flex space-x-2">
        <button
          onClick={() => navigate(`/gabinete/editar/${gabinete.id || gabinete.id_gabinete}`)}
          className="bg-cyan-600 text-white py-2 px-4 rounded hover:bg-cyan-700 transition"
        >
          Editar
        </button>
        <button
          onClick={() => navigate('/gabinete')}
          className="bg-slate-300 text-slate-700 py-2 px-4 rounded hover:bg-slate-400 transition"
        >
          Voltar
        </button>
      </div>
    </div>
  );
}

