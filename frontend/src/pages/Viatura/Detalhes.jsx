import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../services/api';
import { toast } from 'react-hot-toast';
import Skeleton from '../../components/common/Skeleton';

export default function ViaturaDetalhes() {
  const { id } = useParams();
  const [viatura, setViatura] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchViatura = async () => {
      try {
        const res = await api.get(`/viatura/${id}`);
        if (res.success) {
          setViatura(res.data);
        } else {
          toast.error(res.message || 'Viatura não encontrada');
        }
      } catch (error) {
        console.error('Erro na requisição:', error);
        toast.error('Erro na comunicação com o servidor');
      } finally {
        setLoading(false);
      }
    };
    fetchViatura();
  }, [id]);

  if (loading) return <Skeleton />;
  if (!viatura) return <p className="text-center text-slate-500">Viatura não encontrada</p>;

  return (
    <div className="max-w-lg mx-auto p-4 bg-white rounded shadow">
      <h1 className="text-2xl font-bold text-slate-700 mb-4">Detalhes da Viatura</h1>
      
      <div className="space-y-2">
        <p><span className="font-semibold">Identificação:</span> {viatura.identificacao}</p>
        <p><span className="font-semibold">Tipo:</span> {viatura.tipo}</p>
        <p><span className="font-semibold">Status:</span> {viatura.status}</p>
        <p><span className="font-semibold">Latitude:</span> {viatura.latitude}</p>
        <p><span className="font-semibold">Longitude:</span> {viatura.longitude}</p>
        <p><span className="font-semibold">Hospital ID:</span> {viatura.id_hospital}</p>
      </div>

      <div className="mt-4 flex gap-2">
        <Link
          to={`/viatura/${viatura.id}/editar`}
          className="bg-cyan-600 text-white px-4 py-2 rounded hover:bg-cyan-700 transition"
        >
          Editar
        </Link>
        <Link
          to="/viatura"
          className="border border-slate-300 px-4 py-2 rounded hover:bg-slate-100 transition"
        >
          Voltar
        </Link>
      </div>
    </div>
  );
}

