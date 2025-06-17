import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import toast from 'react-hot-toast';

export default function ViaturaDetalhes() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [viatura, setViatura] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchViatura = async () => {
      try {
        const res = await api.get(`/viaturas/${id}`);
        console.log(res);
        if (res.success && res.data) {
          setViatura(res.data);
        } else {
          toast.error(res.error || 'Erro ao carregar viatura');
        }
      } catch {
        toast.error('Erro ao carregar viatura');
      } finally {
        setLoading(false);
      }
    };
    fetchViatura();
  }, [id, navigate]);

  if (loading) {
    return <div className="p-6 text-slate-500 animate-pulse">Carregando viatura...</div>;
  }

  if (!viatura) {
    return (
      <div className="p-6 text-center text-red-500">
        Viatura não encontrada ou erro ao carregar.
        <div className="mt-4">
          <button
            onClick={() => navigate('/viatura')}
            className="bg-slate-300 text-slate-700 py-2 px-4 rounded hover:bg-slate-400"
          >
            Voltar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-lg mx-auto bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Detalhes da Viatura</h1>
      <div className="space-y-2">
        <div><span className="font-semibold">Identificação:</span> {viatura.identificacao}</div>
        <div><span className="font-semibold">Tipo:</span> {viatura.tipo}</div>
        <div><span className="font-semibold">Status:</span> {viatura.status}</div>
        <div><span className="font-semibold">Latitude:</span> {viatura.latitude ?? 'N/A'}</div>
        <div><span className="font-semibold">Longitude:</span> {viatura.longitude ?? 'N/A'}</div>
        <div><span className="font-semibold">Hospital:</span> {viatura.hospital?.nome || 'Não informado'}</div>
      </div>
      <div className="mt-4 flex gap-2">
        <button
          onClick={() => navigate(`/viatura/${viatura.id || viatura.id_viatura}/editar`)}
          className="bg-cyan-600 text-white py-2 px-4 rounded hover:bg-cyan-700"
        >
          Editar
        </button>
        <button
          onClick={() => navigate('/viatura')}
          className="bg-slate-300 text-slate-700 py-2 px-4 rounded hover:bg-slate-400"
        >
          Voltar
        </button>
      </div>
    </div>
  );
}
