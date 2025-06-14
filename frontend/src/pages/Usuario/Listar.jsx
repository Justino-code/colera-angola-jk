import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import Skeleton from '../../components/common/Skeleton';

export default function ListarUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const { data } = await api.get('/usuarios');
        setUsuarios(data);
      } catch (error) {
        console.error('Erro ao carregar usuários:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsuarios();
  }, []);

  if (loading) return <Skeleton />;

  return (
    <div>
      <div className="flex justify-between mb-4">
        <h2 className="text-xl font-bold">Usuários</h2>
        <Link to="/usuarios/criar" className="bg-cyan-600 text-white px-4 py-2 rounded">
          Novo Usuário
        </Link>
      </div>
      <table className="w-full bg-white rounded shadow">
        <thead className="bg-slate-100">
          <tr>
            <th className="text-left p-2">Nome</th>
            <th className="text-left p-2">Email</th>
            <th className="text-left p-2">Cargo</th>
            <th className="text-left p-2">Ações</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((usuario) => (
            <tr key={usuario.id} className="border-b">
              <td className="p-2">{usuario.nome}</td>
              <td className="p-2">{usuario.email}</td>
              <td className="p-2">{usuario.cargo}</td>
              <td className="p-2 space-x-2">
                <Link to={`/usuarios/${usuario.id}`} className="text-cyan-600">Detalhes</Link>
                <Link to={`/usuarios/${usuario.id}/editar`} className="text-amber-600">Editar</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
