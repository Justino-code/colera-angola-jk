import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { toast } from 'react-hot-toast';
import Skeleton from '../../components/common/Skeleton';

export default function ViaturaListar() {
  const [viaturas, setViaturas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchViaturas = async () => {
      try {
        const res = await api.get('/viatura');
        if (res.success) {
          setViaturas(res.data);
        } else {
          toast.error(res.message || 'Falha ao carregar viaturas');
        }
      } catch (error) {
        console.error('Erro na requisição:', error);
        toast.error('Erro na comunicação com o servidor');
      } finally {
        setLoading(false);
      }
    };
    fetchViaturas();
  }, []);

  if (loading) return <Skeleton />;

  return (
    <div className="max-w-5xl mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-slate-700">Viaturas</h1>
        <Link
          to="/viatura/criar"
          className="bg-cyan-600 text-white px-4 py-2 rounded hover:bg-cyan-700 transition"
        >
          Nova Viatura
        </Link>
      </div>

      {viaturas.length === 0 ? (
        <p className="text-slate-500">Nenhuma viatura cadastrada.</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {viaturas.map(v => (
            <div key={v.id} className="border rounded p-4 shadow-sm bg-white">
              <h2 className="font-semibold text-lg mb-1">{v.identificacao}</h2>
              <p className="text-sm text-slate-600">Tipo: {v.tipo}</p>
              <p className="text-sm text-slate-600">Status: {v.status}</p>
              <p className="text-sm text-slate-600">Hospital ID: {v.id_hospital}</p>
              <Link
                to={`/viatura/${v.id}`}
                className="text-cyan-600 text-sm mt-2 inline-block hover:underline"
              >
                Ver detalhes
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

