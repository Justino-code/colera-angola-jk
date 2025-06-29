import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import toast from 'react-hot-toast';

export default function HospitalListar() {
  const [hospitais, setHospitais] = useState([]);
  const [loading, setLoading] = useState(true);
  const [removingId, setRemovingId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHospitais = async () => {
      try {
        const res = await api.get('/hospitais');
        if (res.success) {
          const lista = res.data || [];
          if (lista.length > 0) {
            setHospitais(lista);
          } else {
            toast('Nenhum hospital cadastrado', { icon: 'ℹ️' });
          }
        } else {
          toast.error(res.message || 'Erro ao carregar hospitais');
        }
      } catch (error) {
        console.error('Erro ao carregar hospitais:', error);
        toast.error('Erro ao carregar hospitais');
      } finally {
        setLoading(false);
      }
    };

    fetchHospitais();
  }, []);

  const handleRemover = async (id) => {
    if (!window.confirm('Tem certeza que deseja remover este hospital?')) {
      return;
    }
    setRemovingId(id);
    try {
      const res = await api.delete(`/hospitais/${id}`);
      if (res.success) {
        toast.success('Hospital removido com sucesso');
        setHospitais((prev) => prev.filter((h) => h.id_hospital !== id));
      } else {
        toast.error(res.message || 'Erro ao remover hospital');
      }
    } catch (error) {
      console.error('Erro ao remover hospital:', error);
      toast.error('Erro ao remover hospital');
    } finally {
      setRemovingId(null);
    }
  };

  if (loading) {
    return (
      <div className="p-6 text-center">
        <p className="animate-pulse text-slate-500">Carregando hospitais...</p>
      </div>
    );
  }

  return (
    <div className="h-full w-full flex flex-col min-h-0 bg-white p-6 rounded shadow">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-slate-700">Hospitais</h1>
        <Link
          to="/hospital/criar"
          className="bg-cyan-600 text-white px-4 py-2 rounded hover:bg-cyan-700 transition"
        >
          Novo Hospital
        </Link>
      </div>

      {hospitais.length === 0 ? (
        <div className="text-slate-500">Nenhum hospital cadastrado.</div>
      ) : (
        <div className="space-y-2">
          {hospitais.map((hosp) => (
            <div
              key={hosp.id_hospital}
              className="border rounded-lg p-4 hover:bg-slate-50 transition"
            >
              <div className="font-semibold text-slate-700 text-lg">{hosp.nome}</div>
              <div className="text-slate-500 text-sm">
                {hosp.endereco || 'Endereço não informado'} — Capacidade: {hosp.capacidade_leitos || 0}
              </div>
              {hosp.municipio?.nome && (
                <div className="text-slate-400 text-xs">Município: {hosp.municipio.nome}</div>
              )}

              <div className="mt-2 flex gap-2">
                <Link
                  to={`/hospital/${hosp.id_hospital}`}
                  className="bg-blue-600 text-white text-sm px-3 py-1 rounded hover:bg-blue-700 transition"
                >
                  Ver
                </Link>
                <button
                  onClick={() => navigate(`/hospital/${hosp.id_hospital}/editar`)}
                  className="bg-cyan-600 text-white text-sm px-3 py-1 rounded hover:bg-cyan-700 transition"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleRemover(hosp.id_hospital)}
                  disabled={removingId === hosp.id_hospital}
                  className="bg-red-600 text-white text-sm px-3 py-1 rounded hover:bg-red-700 transition disabled:opacity-50"
                >
                  {removingId === hosp.id_hospital ? 'Removendo...' : 'Remover'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
