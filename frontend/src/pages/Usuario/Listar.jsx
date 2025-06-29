import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import Skeleton from '../../components/common/Skeleton';
import { toast } from 'react-hot-toast';

export default function UsuarioListar() {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const res = await api.get('/usuario');
        if (res.success) {
          setUsuarios(res.data);
        } else {
          toast.error('Erro ao carregar usuários');
        }
      } catch (err) {
        toast.error('Erro ao carregar usuários');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsuarios();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Tem certeza que deseja remover este usuário?')) return;
    try {
      const res = await api.delete(`/usuario/${id}`);
      if (res.success) {
        setUsuarios(usuarios.filter(u => u.id_usuario !== id));
        toast.success('Usuário removido com sucesso!');
      } else {
        toast.error('Erro ao remover usuário');
      }
    } catch (err) {
      toast.error('Erro ao remover usuário');
      console.error(err);
    }
  };

  if (loading) return <Skeleton />;

  return (
    <div className="h-full w-full flex flex-col bg-white p-6 rounded shadow">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-slate-700">Usuários</h1>
        <Link to="/usuario/criar" className="bg-amber-600 text-white px-4 py-2 rounded hover:bg-amber-700 transition">
          Criar Usuário
        </Link>
      </div>

      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="w-full border-collapse">
          <thead className="bg-slate-100">
            <tr>
              <th className="p-2 text-left">Nome</th>
              <th className="p-2 text-left">Email</th>
              <th className="p-2 text-left">Cargo</th>
              <th className="p-2 text-left">Ações</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.length === 0 && (
              <tr>
                <td colSpan="4" className="p-4 text-center text-slate-500">Nenhum usuário encontrado</td>
              </tr>
            )}
            {usuarios.map((u) => (
              <tr key={u.id_usuario} className="border-t">
                <td className="p-2">{u.nome}</td>
                <td className="p-2">{u.email}</td>
                <td className="p-2">{u.role}</td>
                <td className="p-2 space-x-2">
                  <Link
                    to={`/usuario/${u.id_usuario}/editar`}
                    className="text-blue-600 hover:underline"
                  >
                    Editar
                  </Link>
                  <button
                    onClick={() => navigate(`/usuario/${u.id_usuario}`)}
                    className="text-green-600 hover:underline"
                  >
                    Detalhes
                  </button>
                  <button
                    onClick={() => handleDelete(u.id_usuario)}
                    className="text-red-600 hover:underline"
                  >
                    Remover
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
