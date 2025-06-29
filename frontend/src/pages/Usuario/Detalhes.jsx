import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import Skeleton from '../../components/common/Skeleton';
import { toast } from 'react-hot-toast';

export default function UsuarioDetalhes() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsuario = async () => {
      try {
        const res = await api.get(`/usuario/${id}`);
        if (res.success) {
          setUsuario(res.data);
        } else {
          toast.error('Usuário não encontrado');
          //navigate('/usuario');
        }
      } catch (err) {
        toast.error('Erro ao carregar usuário');
        console.error(err);
        //navigate('/usuario');
      } finally {
        setLoading(false);
      }
    };

    fetchUsuario();
  }, [id, navigate]);

  if (loading) return <Skeleton />;

  if (!usuario) {
    return (
      <div className="h-full w-full flex flex-col bg-white p-6 rounded shadow">
        <p className="text-center text-slate-500">Usuário não encontrado.</p>
        <div className="text-center mt-4">
          <Link
            to="/usuario"
            className="bg-amber-600 text-white px-4 py-2 rounded hover:bg-amber-700 transition"
          >
            Voltar
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full flex flex-col bg-white p-6 rounded shadow">
      <h1 className="text-2xl font-bold text-slate-700">Detalhes do Usuário</h1>

      <div className="bg-white rounded shadow p-4 space-y-2">
        <div>
          <span className="font-medium">Nome:</span> {usuario.nome}
        </div>
        <div>
          <span className="font-medium">Email:</span> {usuario.email}
        </div>
        <div>
          <span className="font-medium">Cargo:</span> {usuario.role}
        </div>
        <div>
          <span className="font-medium">Permissões:</span> {usuario.permissoes.join(', ')}
        </div>
        <div>
          <span className="font-medium">Hospital:</span> {usuario.hospital_nome || 'N/A'}
        </div>
        <div>
          <span className="font-medium">Gabinete:</span> {usuario.gabinete_nome || 'N/A'}
        </div>
      </div>

      <div className="flex space-x-2">
        <Link
          to={`/usuario/${usuario.id_usuario}/editar`}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Editar
        </Link>
        <Link
          to="/usuario"
          className="bg-amber-600 text-white px-4 py-2 rounded hover:bg-amber-700 transition"
        >
          Voltar
        </Link>
      </div>
    </div>
  );
}
