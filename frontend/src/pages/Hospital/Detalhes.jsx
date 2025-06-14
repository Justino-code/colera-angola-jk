import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../services/api';

export default function HospitalDetalhes() {
  const { id } = useParams();
  const [hospital, setHospital] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHospital = async () => {
      try {
        const response = await api.get(`/hospitais/${id}`);
        setHospital(response.data);
      } catch (error) {
        console.error('Erro ao buscar hospital:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHospital();
  }, [id]);

  if (loading) {
    return (
      <div className="space-y-2">
        <div className="animate-pulse h-6 bg-slate-200 rounded w-1/2"></div>
        <div className="animate-pulse h-4 bg-slate-200 rounded w-1/3"></div>
        <div className="animate-pulse h-4 bg-slate-200 rounded w-1/4"></div>
      </div>
    );
  }

  if (!hospital) {
    return <p className="text-red-500">Hospital não encontrado.</p>;
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-slate-700">{hospital.nome}</h1>
      <p className="text-slate-600">Local: {hospital.local}</p>
      <p className="text-slate-600">Capacidade: {hospital.capacidade} leitos</p>
      <p className="text-slate-600">Ocupação: {hospital.ocupacao}%</p>

      <div className="flex space-x-2">
        <Link
          to={`/hospital/editar/${hospital.id}`}
          className="bg-amber-500 text-white px-4 py-2 rounded hover:bg-amber-600 transition"
        >
          Editar
        </Link>
        <Link
          to="/hospital"
          className="bg-slate-300 text-slate-700 px-4 py-2 rounded hover:bg-slate-400 transition"
        >
          Voltar
        </Link>
      </div>
    </div>
  );
}
