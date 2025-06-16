import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { toast } from 'react-hot-toast';

export default function ListarUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const response = await api.get('/usuario');
        const data = response;

        if (Array.isArray(data)) {
          setUsuarios(data);
        } else if (Array.isArray(data?.usuarios)) {
          setUsuarios(data.usuarios);
        } else {
          console.warn('Formato inesperado:', data);
          toast.error('Formato inesperado dos dados');
          setUsuarios([]);
        }
      } catch (error) {
        toast.error('Erro ao buscar usuários');
        console.error('Erro ao buscar usuários:', error);
        setUsuarios([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUsuarios();
  }, []);

  if (loading) {
    return (
      <div className="space-y-2">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="animate-pulse bg-slate-200 rounded h-16"></div>
        ))}
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-slate-700">Usuários</h1>
        <Link
          to="/usuario/criar"
          className="bg-cyan-600 text-white px-4 py-2 rounded hover:bg-cyan-700 transition"
        >
          Novo Usuário
        </Link>
      </div>

      {usuarios.length === 0 ? (
        <p className="text-slate-500">Nenhum usuário cadastrado.</p>
      ) : (
        <div className="space-y-2">
          {usuarios.map((usuario) => (
            <div
              key={usuario.id_usuario}
              className="p-4 bg-white rounded shadow flex justify-between items-center"
            >
              <div>
                <p className="font-medium text-lg">{usuario.nome}</p>
                <p className="text-sm text-slate-500">{usuario.email}</p>
                <p className="text-sm text-slate-500">Cargo: {usuario.role}</p>
                <p className="text-sm text-slate-500">
                  Hospital: {usuario.hospital_nome || 'N/A'}
                </p>
                <p className="text-sm text-slate-500">
                  Gabinete: {usuario.gabinete_nome || 'N/A'}
                </p>
                <p className="text-sm text-slate-500">
                  Permissões: {usuario.permissoes?.join(', ') || 'Nenhuma'}
                </p>
              </div>
              <div className="space-x-2">
                <Link
                  to={`/usuario/${usuario.id_usuario}`}
                  className="text-cyan-600 hover:underline"
                >
                  Detalhes
                </Link>
                <Link
                  to={`/usuario/${usuario.id_usuario}/editar`}
                  className="text-amber-600 hover:underline"
                >
                  Editar
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

