import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';

export default function ViaturaListar() {
  const [viaturas, setViaturas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchViaturas = async () => {
      try {
        const response = await api.get('/viaturas');
        setViaturas(response);
      } catch (error) {
        console.error('Erro ao carregar viaturas:', error);
        alert('Erro ao carregar viaturas');
      } finally {
        setLoading(false);
      }
    };

    fetchViaturas();
  }, []);

  if (loading) {
    return (
      <div className="space-y-2">
        <div className="animate-pulse h-6 bg-slate-200 rounded w-1/3"></div>
        <div className="animate-pulse h-4 bg-slate-200 rounded w-1/2"></div>
        <div className="animate-pulse h-4 bg-slate-200 rounded w-1/4"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-slate-700">Lista de Viaturas</h1>
        <Link
          to="/viatura/criar"
          className="bg-cyan-600 text-white px-4 py-2 rounded hover:bg-cyan-700 transition"
        >
          Nova Viatura
        </Link>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border rounded shadow">
          <thead className="bg-slate-100">
            <tr>
              <th className="text-left p-2 border-b">ID</th>
              <th className="text-left p-2 border-b">Matrícula</th>
              <th className="text-left p-2 border-b">Modelo</th>
              <th className="text-left p-2 border-b">Capacidade</th>
              <th className="text-left p-2 border-b">Ações</th>
            </tr>
          </thead>
          <tbody>
            {viaturas.map((viatura) => (
              <tr key={viatura.id} className="hover:bg-slate-50">
                <td className="p-2 border-b">{viatura.id}</td>
                <td className="p-2 border-b">{viatura.matricula}</td>
                <td className="p-2 border-b">{viatura.modelo}</td>
                <td className="p-2 border-b">{viatura.capacidade}</td>
                <td className="p-2 border-b space-x-2">
                  <Link
                    to={`/viatura/detalhes/${viatura.id}`}
                    className="text-cyan-600 hover:underline"
                  >
                    Detalhes
                  </Link>
                  <Link
                    to={`/viatura/editar/${viatura.id}`}
                    className="text-amber-600 hover:underline"
                  >
                    Editar
                  </Link>
                </td>
              </tr>
            ))}
            {viaturas.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center p-2">
                  Nenhuma viatura cadastrada.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
