import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../services/api';
import Skeleton from '../../components/common/Skeleton';

export default function PacienteDetalhes() {
  const { id } = useParams();
  const [paciente, setPaciente] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/pacientes/${id}`)
      .then(data => setPaciente(data))
      .catch(err => alert('Erro ao carregar paciente: ' + err))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="space-y-2">
        <Skeleton className="h-6 w-1/3" />
        <Skeleton className="h-6 w-1/2" />
        <Skeleton className="h-6 w-2/3" />
        <Skeleton className="h-6 w-1/4" />
      </div>
    );
  }

  if (!paciente) {
    return <p className="text-red-500">Paciente não encontrado.</p>;
  }

  return (
    <div className="bg-white p-6 rounded shadow space-y-4">
      <h1 className="text-2xl font-bold text-slate-700">Detalhes do Paciente</h1>
      <div>
        <p className="text-slate-600"><span className="font-semibold">Nome:</span> {paciente.nome}</p>
        <p className="text-slate-600"><span className="font-semibold">Idade:</span> {paciente.idade}</p>
        <p className="text-slate-600"><span className="font-semibold">Local:</span> {paciente.local}</p>
        <p className="text-slate-600"><span className="font-semibold">Estado:</span> {paciente.estado}</p>
        <p className="text-slate-600"><span className="font-semibold">Data de Registro:</span> {new Date(paciente.created_at).toLocaleDateString()}</p>
      </div>
    </div>
  );
}
