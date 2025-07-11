import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import Skeleton from '../../components/common/Skeleton';
import { toast } from 'react-hot-toast';

export default function UsuarioListar() {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const roleColors = {
    admin: 'bg-purple-100 text-purple-800',
    gestor: 'bg-blue-100 text-blue-800',
    medico: 'bg-green-100 text-green-800',
    enfermeiro: 'bg-teal-100 text-teal-800',
    tecnico: 'bg-amber-100 text-amber-800',
    epidemiologista: 'bg-indigo-100 text-indigo-800',
    administrativo: 'bg-gray-100 text-gray-800',
    farmaceutico: 'bg-red-100 text-red-800',
    analista_dados: 'bg-cyan-100 text-cyan-800',
    coordenador_regional: 'bg-yellow-100 text-yellow-800'
  };

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const res = await api.get('/usuario');
        if (res.success) {
          setUsuarios(res.data);
        } else {
          toast.error(res.message || 'Erro ao carregar usuários');
        }
      } catch (err) {
        console.error('Erro ao carregar usuários:', err);
        toast.error('Erro ao conectar ao servidor');
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
        toast.error(res.message || 'Erro ao remover usuário');
        
      }
    } catch (err) {
      console.error('Erro ao remover usuário:', err);
      toast.error(err?.data?.message || 'Erro ao remover usuário');
    }
  };

  const filteredUsuarios = usuarios.filter(usuario => {
    const searchLower = searchTerm.toLowerCase();
    return (
      usuario.nome.toLowerCase().includes(searchLower) ||
      usuario.email.toLowerCase().includes(searchLower) ||
      usuario.role.toLowerCase().includes(searchLower)
    );
  });

  if (loading) {
    return (
      <div className="min-h-full w-full bg-gray-50 p-4 md:p-6">
        <Skeleton />
      </div>
    );
  }

  return (
    <div className="min-h-full w-full bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-4 md:p-6 border-b border-gray-200">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-gray-800">Gestão de Usuários</h1>
              <p className="text-sm text-gray-500 mt-1">
                {filteredUsuarios.length} {filteredUsuarios.length === 1 ? 'usuário encontrado' : 'usuários encontrados'}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Buscar usuários..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-200 w-full"
                />
                <svg
                  className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <Link
                to="/usuario/criar"
                className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-md transition flex items-center justify-center whitespace-nowrap"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Novo Usuário
              </Link>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          {filteredUsuarios.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              {searchTerm ? (
                <div>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="mt-2">Nenhum usuário encontrado para "{searchTerm}"</p>
                  <button 
                    onClick={() => setSearchTerm('')} 
                    className="mt-4 text-amber-600 hover:underline"
                  >
                    Limpar busca
                  </button>
                </div>
              ) : (
                <div>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                  <p className="mt-2">Nenhum usuário cadastrado</p>
                  <Link
                    to="/usuario/criar"
                    className="mt-4 inline-block bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-md transition"
                  >
                    Adicionar primeiro usuário
                  </Link>
                </div>
              )}
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nome
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cargo
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsuarios.map((u) => (
                  <tr key={u.id_usuario} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center">
                          <span className="text-amber-600 font-medium">
                            {u.nome.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{u.nome}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{u.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        roleColors[u.role] || 'bg-gray-100 text-gray-800'
                      }`}>
                        {u.role === 'admin' ? 'Administrador' : 
                         u.role === 'gestor' ? 'Gestor' : 
                         u.role === 'medico' ? 'Médico' : 
                         u.role === 'enfermeiro' ? 'Enfermeiro' : 
                         u.role === 'tecnico' ? 'Técnico' : 
                         u.role === 'epidemiologista' ? 'Epidemiologista' : 
                         u.role === 'administrativo' ? 'Administrativo' : 
                         u.role === 'farmaceutico' ? 'Farmacêutico' : 
                         u.role === 'analista_dados' ? 'Analista de Dados' : 
                         u.role === 'coordenador_regional' ? 'Coordenador Regional' : u.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-3">
                        <Link
                          to={`/usuario/${u.id_usuario}`}
                          className="text-blue-600 hover:text-blue-900"
                          title="Detalhes"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </Link>
                        <Link
                          to={`/usuario/${u.id_usuario}/editar`}
                          className="text-yellow-600 hover:text-yellow-900"
                          title="Editar"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </Link>
                        <button
                          onClick={() => handleDelete(u.id_usuario)}
                          className="text-red-600 hover:text-red-900"
                          title="Remover"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}