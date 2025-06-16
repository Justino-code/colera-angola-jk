import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../services/api';
import Skeleton from '../../components/common/Skeleton';
import { toast } from 'react-hot-toast';

export default function DetalhesUsuario() {
  const { id } = useParams();
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsuario = async () => {
      try {
        const response = await api.get(`/usuario/${id}`);
        // Se sua API retorna no formato { data: { ... } }, descomente a linha abaixo:
        // setUsuario(response.data);
        // Se já vem direto o objeto do usuário, use:
        setUsuario(response);
      } catch (error) {
        console.error('Erro ao carregar detalhes:', error);
        toast.error('Erro ao carregar detalhes do usuário');
      } finally {
        setLoading(false);
      }
    };

    fetchUsuario();
  }, [id]);

  if (loading) return <Skeleton />;

  if (!usuario) {
    return (
      <div className="text-red-500">
        Não foi possível carregar os detalhes do usuário.
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Detalhes do Usuário</h2>
      <div className="bg-white rounded shadow p-4 space-y-2">
        <p><strong>Nome:</strong> {usuario.nome}</p>
        <p><strong>Email:</strong> {usuario.email}</p>
        <p><strong>Cargo:</strong> {usuario.role}</p>
      </div>
    </div>
  );
}

