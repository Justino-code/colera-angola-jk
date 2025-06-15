import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';

export default function HospitalListar() {
  const [hospitais, setHospitais] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHospitais = async () => {
      try {
        const response = await api.get('/hospitais');
        console.log('Dados recebidos:', response);

        // Garante que o estado será um array
        if (Array.isArray(response)) {
          setHospitais(response);
        } else if (Array.isArray(response.hospitais)) {
          // Caso a API retorne { hospitais: [...] }
          setHospitais(response.hospitais);
        } else {
          setHospitais([]);
        }
      } catch (error) {
        console.error('Erro ao buscar hospitais:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHospitais();
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
    <div>
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
          {hospitais.map((hospital) => (
            <div
              key={hospital.id}
              className="p-4 bg-white rounded shadow flex justify-between items-center"
            >
              <div>
                <p className="font-medium">{hospital.nome}</p>
                <p className="text-sm text-slate-500">{hospital.local}</p>
              </div>
              <div className="space-x-2">
                <Link
                  to={`/hospital/detalhes/${hospital.id_hospital}`}
                  className="text-cyan-600 hover:underline"
                >
                  Detalhes
                </Link>
                <Link
                  to={`/hospital/editar/${hospital.id_hospital}`}
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
