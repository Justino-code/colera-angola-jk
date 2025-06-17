import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import toast from 'react-hot-toast';

export default function HospitalDetalhes() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [hospital, setHospital] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHospital = async () => {
      try {
        const res = await api.get(`/hospitais/${id}`);
        if (res.success) {
          setHospital(res.data);
        } else {
          toast.error(res.message || 'Erro ao carregar hospital');
          navigate('/hospital');
        }
      } catch (error) {
        console.error('Erro ao carregar hospital:', error);
        toast.error('Erro ao carregar hospital');
        navigate('/hospital');
      } finally {
        setLoading(false);
      }
    };

    fetchHospital();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="p-6 text-center">
        <p className="animate-pulse text-slate-500">Carregando hospital...</p>
      </div>
    );
  }

  if (!hospital) {
    return (
      <div className="p-6 text-center">
        <p className="text-slate-500">Hospital não encontrado.</p>
        <button
          onClick={() => navigate('/hospital')}
          className="mt-4 bg-slate-300 text-slate-700 py-2 px-4 rounded hover:bg-slate-400 transition"
        >
          Voltar
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-lg mx-auto bg-white rounded shadow space-y-4">
      <h1 className="text-2xl font-bold text-slate-700">Detalhes do Hospital</h1>
      <div className="space-y-2">
        <div>
          <span className="font-semibold text-slate-600">Nome:</span> {hospital.nome}
        </div>
        <div>
          <span className="font-semibold text-slate-600">Local:</span> {hospital.endereco}
        </div>
        <div>
          <span className="font-semibold text-slate-600">Capacidade:</span> {hospital.capacidade_leitos} pacientes
        </div>
        <div>
          <span className="font-semibold text-slate-600">Criado em:</span>{' '}
          {hospital.created_at ? new Date(hospital.created_at).toLocaleString() : 'N/A'}
        </div>
        {hospital.updated_at && (
          <div>
            <span className="font-semibold text-slate-600">Atualizado em:</span>{' '}
            {new Date(hospital.updated_at).toLocaleString()}
          </div>
        )}
      </div>

      <div className="flex space-x-2">
        <button
          onClick={() => navigate(`/hospital/editar/${hospital.id_hospital}`)}
          className="bg-cyan-600 text-white py-2 px-4 rounded hover:bg-cyan-700 transition"
        >
          Editar
        </button>
        <button
          onClick={() => navigate('/hospital')}
          className="bg-slate-300 text-slate-700 py-2 px-4 rounded hover:bg-slate-400 transition"
        >
          Voltar
        </button>
      </div>
    </div>
  );
}
