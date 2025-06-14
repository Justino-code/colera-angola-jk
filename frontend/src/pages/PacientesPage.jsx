import { useEffect, useState } from 'react';
import { apiGet } from '../services/api';

export default function PacientesPage() {
  const [pacientes, setPacientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    apiGet('/pacientes')
      .then(data => setPacientes(data))
      .catch(() => setErro('Erro ao carregar pacientes'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Pacientes</h1>

      {erro && <div className="p-4 bg-red-100 text-red-600 rounded">{erro}</div>}

      <input 
        type="text"
        placeholder="Buscar por nome..."
        className="p-2 border rounded w-full mb-4"
        onChange={(e) => {
          const query = e.target.value.toLowerCase();
          setPacientes(prev => prev.map(p => ({
            ...p,
            hidden: !p.nome.toLowerCase().includes(query)
          })));
        }}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading
          ? Array(6).fill(0).map((_, idx) => <SkeletonPaciente key={idx} />)
          : pacientes.filter(p => !p.hidden).map(p => <PacienteCard key={p.id} paciente={p} />)
        }
      </div>
    </div>
  );
}

function PacienteCard({ paciente }) {
  return (
    <div className="p-4 bg-white rounded shadow">
      <p className="font-semibold">{paciente.nome}</p>
      <p className="text-sm">Idade: {paciente.idade}</p>
      <p className="text-sm">Região: {paciente.regiao}</p>
      <p className={`text-sm font-medium ${paciente.status === 'Ativo' ? 'text-red-500' : 'text-green-500'}`}>
        {paciente.status}
      </p>
    </div>
  );
}

function SkeletonPaciente() {
  return (
    <div className="p-4 bg-slate-200 rounded shadow animate-pulse">
      <div className="h-4 bg-slate-300 rounded w-1/2 mb-2"></div>
      <div className="h-3 bg-slate-300 rounded w-1/3 mb-1"></div>
      <div className="h-3 bg-slate-300 rounded w-1/2 mb-1"></div>
      <div className="h-3 bg-slate-300 rounded w-1/4"></div>
    </div>
  );
}
