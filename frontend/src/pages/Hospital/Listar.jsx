import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import toast from 'react-hot-toast';

export default function HospitalListar() {
  const [hospitais, setHospitais] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHospitais = async () => {
      try {
        const res = await api.get('/hospitais');
        console.log(res);

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

  if (loading) {
    return (
      <div className="p-6 text-center">
        <p className="animate-pulse text-slate-500">Carregando hospitais...</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
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
            <Link
              key={hosp.id_hospital}
              to={`/hospital/${hosp.id_hospital}`}
              className="block border rounded-lg p-4 hover:bg-slate-50 transition"
            >
              <div className="font-semibold text-slate-700 text-lg">{hosp.nome}</div>
              <div className="text-slate-500 text-sm">
                {hosp.endereco || 'Endereço não informado'} — Capacidade: {hosp.capacidade_leitos || 0}
              </div>
              {hosp.municipio?.nome && (
                <div className="text-slate-400 text-xs">Município: {hosp.municipio.nome}</div>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
