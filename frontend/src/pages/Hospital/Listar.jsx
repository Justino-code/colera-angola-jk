import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import toast from "react-hot-toast";


export default function HospitalListar() {
  const [hospitais, setHospitais] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHospitais = async () => {
      try {
        const res = await api.get('/hospitais');
        console.log(res);

        if (res.success && res.data.length > 0) {
          setHospitais(res.data);
        } else if(res.success && res.data.length == 0){
          toast.error('Nenhum hospital cadastrado');
        } 
        else {
          toast.error(res.error || 'Erro ao carregar hospitais');
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
      <div className="p-6">
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
        <p className="text-slate-500">Nenhum hospital cadastrado.</p>
      ) : (
        <div className="space-y-2">
          {hospitais.map((hosp) => (
            <Link
              to={`/hospital/${hosp.id}`}
              key={hosp.id}
              className="block border rounded p-3 hover:bg-slate-50 transition"
            >
              <div className="font-semibold text-slate-700">{hosp.nome}</div>
              <div className="text-slate-500 text-sm">{hosp.local} - Capacidade: {hosp.capacidade}</div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

