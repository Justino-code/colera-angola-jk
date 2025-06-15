import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import Skeleton from '../../components/common/Skeleton';

export default function PacienteLista() {
  const [pacientes, setPacientes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/pacientes')
      .then(data => setPacientes(data))
      .catch(err => console.error('Erro ao buscar pacientes:', err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-slate-700">Lista de Pacientes</h1>
        <Link 
          to="/paciente/criar" 
          className="bg-cyan-600 text-white px-4 py-2 rounded hover:bg-cyan-700 transition"
        >
          Novo Paciente
        </Link>
      </div>

      {loading ? (
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-10 w-full" />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded shadow overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-slate-100">
              <tr>
                <th className="text-left p-2">Nome</th>
                <th className="text-left p-2">Idade</th>
                <th className="text-left p-2">Local</th>
                <th className="text-left p-2">Ações</th>
              </tr>
            </thead>
            <tbody>
              {pacientes.map(p => (
                <tr key={p.id} className="border-t">
                  <td className="p-2">{p.nome}</td>
                  <td className="p-2">{p.idade}</td>
                  <td className="p-2">{p.local}</td>
                  <td className="p-2 space-x-2">
                    <Link 
                      to={`/paciente/${p.id}`} 
                      className="text-cyan-600 hover:underline"
                    >
                      Ver
                    </Link>
                    <Link 
                      to={`/paciente/editar/${p.id}`} 
                      className="text-yellow-600 hover:underline"
                    >
                      Editar
                    </Link>
                    <button 
                      className="text-red-600 hover:underline"
                      onClick={() => handleDelete(p.id)}
                    >
                      Apagar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

  function handleDelete(id) {
    if (confirm('Tem certeza que deseja apagar este paciente?')) {
      api.delete(`/pacientes/${id}`)
        .then(() => {
          setPacientes(pacientes.filter(p => p.id !== id));
        })
        .catch(err => alert('Erro ao apagar paciente: ' + err));
    }
  }
}
