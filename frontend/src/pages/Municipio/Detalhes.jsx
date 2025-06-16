import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../../services/api';

export default function MunicipioDetalhes() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [municipio, setMunicipio] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMunicipio = async () => {
      try {
        const { data } = await api.get(`/municipios/${id}`);
        setMunicipio(data);
      } catch (error) {
        console.error('Erro ao carregar município:', error);
        toast.error('Erro ao carregar município');
        navigate('/municipio');
      } finally {
        setLoading(false);
      }
    };

    fetchMunicipio();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-pulse w-full max-w-lg space-y-4">
          <div className="h-6 bg-slate-200 rounded" />
          <div className="h-4 bg-slate-200 rounded" />
          <div className="h-4 bg-slate-200 rounded" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-lg mx-auto bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4 text-slate-700">Detalhes do Município</h1>
      <div className="space-y-2">
        <div>
          <span className="font-semibold text-slate-600">Nome:</span>
          <p className="text-slate-700">{municipio.nome}</p>
        </div>
        <div>
          <span className="font-semibold text-slate-600">Província:</span>
          <p className="text-slate-700">{municipio.provincia_nome}</p>
        </div>
        <div>
          <span className="font-semibold text-slate-600">Criado em:</span>
          <p className="text-slate-700">{new Date(municipio.created_at).toLocaleString()}</p>
        </div>
        {municipio.updated_at && (
          <div>
            <span className="font-semibold text-slate-600">Atualizado em:</span>
            <p className="text-slate-700">{new Date(municipio.updated_at).toLocaleString()}</p>
          </div>
        )}
      </div>
      <div className="mt-4 flex space-x-2">
        <button
          onClick={() => navigate(`/municipio/editar/${municipio.id}`)}
          className="bg-cyan-600 text-white px-4 py-2 rounded hover:bg-cyan-700 transition"
        >
          Editar
        </button>
        <button
          onClick={() => navigate('/municipio')}
          className="bg-slate-300 text-slate-700 px-4 py-2 rounded hover:bg-slate-400 transition"
        >
          Voltar
        </button>
      </div>
    </div>
  );
}

