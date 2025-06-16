import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';

export default function HospitalDetalhes() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [hospital, setHospital] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHospital = async () => {
      try {
        const { data } = await api.get(`/hospitais/${id}`);
        if (data.success) {
          setHospital(data.data);
        } else {
          alert(data.message || 'Erro ao carregar hospital');
          navigate('/hospital');
        }
      } catch (error) {
        console.error('Erro ao carregar hospital:', error);
        alert('Erro ao carregar hospital');
        navigate('/hospital');
      } finally {
        setLoading(false);
      }
    };

    fetchHospital();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="p-6">
        <p className="animate-pulse text-slate-500">Carregando hospital...</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-lg mx-auto bg-white rounded shadow">
      <h1 className="text-2xl font-bold text-slate-700 mb-4">Detalhes do Hospital</h1>
      <div className="space-y-2">
        <div><span className="font-semibold text-slate-600">Nome:</span> {hospital.nome}</div>
        <div><span className="font-semibold text-slate-600">Local:</span> {hospital.local}</div>
        <div><span className="font-semibold text-slate-600">Capacidade:</span> {hospital.capacidade}</div>
        <div><span className="font-semibold text-slate-600">Criado em:</span> {new Date(hospital.created_at).toLocaleString()}</div>
        {hospital.updated_at && (
          <div><span className="font-semibold text-slate-600">Atualizado em:</span> {new Date(hospital.updated_at).toLocaleString()}</div>
        )}
      </div>

      <div className="mt-4 flex space-x-2">
        <button
          onClick={() => navigate(`/hospital/editar/${hospital.id}`)}
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

