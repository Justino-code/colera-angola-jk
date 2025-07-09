import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import toast from 'react-hot-toast';

export default function ViaturaListar() {
  const [viaturas, setViaturas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Carrega usuário do localStorage
    const usuario = localStorage.getItem('usuario');
    setUser(usuario ? JSON.parse(usuario) : null);

    const fetchViaturas = async () => {
      try {
        const res = await api.get('/viaturas');
        if (res.success) {
          setViaturas(res.data);
        } else {
          toast.error(res.error || 'Erro ao carregar viaturas');
        }
      } catch (error) {
        console.error('Erro ao carregar viaturas:', error);
        toast.error('Erro ao conectar ao servidor');
      } finally {
        setLoading(false);
      }
    };
    fetchViaturas();
  }, []);

  const removerViatura = async (id) => {
    if (!window.confirm('Tem certeza que deseja remover esta viatura?')) return;
    try {
      const res = await api.delete(`/viaturas/${id}`);
      if (res.success) {
        toast.success('Viatura removida com sucesso');
        setViaturas(viaturas.filter(v => v.id_viatura || v.id !== id));
      } else {
        toast.error(res.error || 'Erro ao remover viatura');
      }
    } catch (error) {
      console.error('Erro ao remover viatura:', error);
      toast.error(error.response?.data?.message || 'Erro ao remover viatura');
    }
  };

  const filteredViaturas = viaturas.filter(viatura => {
    const searchLower = searchTerm.toLowerCase();
    return (
      viatura.identificacao.toLowerCase().includes(searchLower) ||
      viatura.tipo.toLowerCase().includes(searchLower) ||
      viatura.status.toLowerCase().includes(searchLower) ||
      (viatura.hospital?.nome && viatura.hospital.nome.toLowerCase().includes(searchLower))
    );
  });

  const statusColors = {
    disponivel: 'bg-green-100 text-green-800',
    em_viagem: 'bg-yellow-100 text-yellow-800',
    ocupada: 'bg-red-100 text-red-800',
  };

  const podeEditar = user && (user.role === 'admin' || user.role === 'gestor');

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center p-6 max-w-md">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando lista de viaturas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full w-full bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-4 md:p-6 border-b border-gray-200">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-gray-800">Gestão de Viaturas</h1>
              <p className="text-sm text-gray-500 mt-1">
                {filteredViaturas.length} {filteredViaturas.length === 1 ? 'viatura encontrada' : 'viaturas encontradas'}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Buscar viaturas..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-200 w-full"
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
              {podeEditar && (
                <Link
                  to="/viatura/criar"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition flex items-center justify-center whitespace-nowrap"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                  Nova Viatura
                </Link>
              )}
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          {filteredViaturas.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              {searchTerm ? (
                <div>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="mt-2">Nenhuma viatura encontrada para "{searchTerm}"</p>
                  <button 
                    onClick={() => setSearchTerm('')} 
                    className="mt-4 text-blue-600 hover:underline"
                  >
                    Limpar busca
                  </button>
                </div>
              ) : (
                <div>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
                  </svg>
                  <p className="mt-2">Nenhuma viatura cadastrada</p>
                  {podeEditar && (
                    <Link
                      to="/viatura/criar"
                      className="mt-4 inline-block bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition"
                    >
                      Adicionar primeira viatura
                    </Link>
                  )}
                </div>
              )}
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Identificação
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tipo
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Hospital
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredViaturas.map(v => (
                  <tr key={v.id_viatura} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">{v.identificacao}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-gray-500">{v.tipo}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColors[v.status] || 'bg-gray-100 text-gray-800'}`}>
                        {v.status === 'disponivel' ? 'Disponível' : 
                         v.status === 'em_viagem' ? 'Em Viagem' : 
                         v.status === 'ocupada' ? 'Ocupada' : v.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-gray-500">{v.hospital?.nome || 'N/A'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-3">
                        <Link
                          to={`/viatura/${v.id_viatura || v.id}`}
                          className="text-blue-600 hover:text-blue-900"
                          title="Detalhes"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </Link>
                        {podeEditar && (
                          <Link
                            to={`/viatura/${v.id_viatura || v.id}/editar`}
                            className="text-yellow-600 hover:text-yellow-900"
                            title="Editar"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </Link>
                        )}
                        {podeEditar && (
                          <button
                            onClick={() => removerViatura(v.id_viatura || v.id)}
                            className="text-red-600 hover:text-red-900"
                            title="Remover"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        )}
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