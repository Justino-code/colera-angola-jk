import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';

export default function ViaturaDetalhes() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [viatura, setViatura] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchViatura = async () => {
      try {
        const { data } = await api.get(`/viaturas/${id}`);
        setViatura(data);
      } catch (error) {
        console.error('Erro ao buscar viatura:', error);
        alert('Erro ao carregar detalhes da viatura');
      } finally {
        setLoading(false);
      }
    };

    fetchViatura();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-lg mx-auto bg-white p-6 rounded shadow">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-slate-200 rounded w-1/3"></div>
          <div className="h-5 bg-slate-200 rounded w-2/3"></div>
          <div className="h-5 bg-slate-200 rounded w-1/2"></div>
          <div className="h-5 bg-slate-200 rounded w-1/4"></div>
        </div>
      </div>
    );
  }

  if (!viatura) {
    return (
      <div className="max-w-lg mx-auto bg-white p-6 rounded shadow">
        <p className="text-red-500">Viatura não encontrada.</p>
        <button
          onClick={() => navigate('/viatura')}
          className="mt-4 bg-cyan-600 text-white py-2 px-4 rounded hover:bg-cyan-700 transition"
        >
          Voltar
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto bg-white p-6 rounded shadow">
      <h1 className="text-2xl font-bold mb-4 text-slate-700">Detalhes da Viatura</h1>
      <div className="space-y-2 text-slate-700">
        <p><span className="font-medium">Matrícula:</span> {viatura.matricula}</p>
        <p><span className="font-medium">Modelo:</span> {viatura.modelo}</p>
        <p><span className="font-medium">Capacidade:</span> {viatura.capacidade}</p>
      </div>
      <button
        onClick={() => navigate('/viatura')}
        className="mt-4 bg-cyan-600 text-white py-2 px-4 rounded hover:bg-cyan-700 transition"
      >
        Voltar
      </button>
    </div>
  );
}
