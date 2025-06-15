import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../services/api';
import Skeleton from '../../components/common/Skeleton';

export default function DetalhesUsuario() {
  const { id } = useParams();
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsuario = async () => {
      try {
        const response = await api.get(`/usuario/${id}`);
        console.log(response);
        setUsuario(response);
      } catch (error) {
        console.error('Erro ao carregar detalhes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsuario();
  }, [id]);

  if (loading) return <Skeleton />;

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
