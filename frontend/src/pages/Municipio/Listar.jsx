import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import api from '../../services/api';
import Skeleton from '../../components/common/Skeleton';
import { 
  FiPlus, FiSearch, FiEye, FiEdit, FiTrash2, 
  FiMapPin, FiRotateCw, FiX 
} from 'react-icons/fi';

export default function MunicipioListar() {
  const [municipios, setMunicipios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    carregarMunicipios();
  }, []);

  const carregarMunicipios = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, success, message } = await api.get('/municipios');
      if (success) {
        setMunicipios(data);
      } else {
        setError(message || 'Erro ao carregar municípios');
        toast.error(message || 'Erro ao carregar municípios');
      }
    } catch (error) {
      setError('Erro ao conectar ao servidor');
      toast.error('Erro ao carregar municípios');
      console.error('Erro ao carregar municípios:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, nome) => {
    if (!window.confirm(`Tem certeza que deseja excluir o município "${nome}"?`)) return;
    
    try {
      setLoading(true);
      const { success, message } = await api.delete(`/municipios/${id}`);
      if (success) {
        setMunicipios(prev => prev.filter(m => m.id_municipio !== id));
        toast.success(`Município "${nome}" excluído com sucesso!`);
      } else {
        toast.error(message || 'Erro ao excluir município');
      }
    } catch (error) {
      toast.error('Erro ao excluir município');
      console.error('Erro ao excluir município:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredMunicipios = municipios.filter(municipio => {
    const searchLower = searchTerm.toLowerCase();
    return (
      municipio.nome.toLowerCase().includes(searchLower) ||
      (municipio.nome_provincia && municipio.nome_provincia.toLowerCase().includes(searchLower))
    );
  });

  if (error) {
    return (
      <div className="min-h-full w-full bg-gray-50 p-4 md:p-6">
        <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-md p-6 text-center">
          <div className="text-red-500 mb-4">
            <FiMapPin size={48} className="mx-auto" />
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Erro ao carregar municípios</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={carregarMunicipios}
            className="bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-md transition flex items-center gap-2 mx-auto"
          >
            <FiRotateCw size={18} /> Tentar novamente
          </button>
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
              <h1 className="text-xl md:text-2xl font-bold text-gray-800">Gestão de Municípios</h1>
              <p className="text-sm text-gray-500 mt-1">
                {filteredMunicipios.length} {filteredMunicipios.length === 1 ? 'município encontrado' : 'municípios encontrados'}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1 min-w-[200px]">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiSearch className="text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Buscar municípios..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-200 w-full"
                />
              </div>
              <Link
                to="/municipio/criar"
                className="flex items-center justify-center gap-2 bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-md transition whitespace-nowrap"
              >
                <FiPlus size={18} /> Novo Município
              </Link>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="p-8">
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          </div>
        ) : filteredMunicipios.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            {searchTerm ? (
              <div>
                <FiMapPin size={48} className="mx-auto text-gray-400 mb-4" />
                <p className="mt-2">Nenhum município encontrado para "{searchTerm}"</p>
                <button 
                  onClick={() => setSearchTerm('')} 
                  className="mt-4 text-cyan-600 hover:underline flex items-center justify-center gap-1 mx-auto"
                >
                  <FiX size={16} /> Limpar busca
                </button>
              </div>
            ) : (
              <div>
                <FiMapPin size={48} className="mx-auto text-gray-400 mb-4" />
                <p className="mt-2">Nenhum município cadastrado</p>
                <Link
                  to="/municipio/criar"
                  className="mt-4 inline-flex items-center gap-2 bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-md transition"
                >
                  <FiPlus size={16} /> Cadastrar primeiro município
                </Link>
              </div>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nome
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Província
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredMunicipios.map(municipio => (
                  <tr key={municipio.id_municipio} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {municipio.nome}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {municipio.nome_provincia || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-3">
                        <button
                          onClick={() => navigate(`/municipio/${municipio.id_municipio}`)}
                          className="text-blue-600 hover:text-blue-800 transition-colors"
                          title="Detalhes"
                        >
                          <FiEye size={18} />
                        </button>
                        <button
                          onClick={() => navigate(`/municipio/${municipio.id_municipio}/editar`)}
                          className="text-yellow-600 hover:text-yellow-800 transition-colors"
                          title="Editar"
                        >
                          <FiEdit size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(municipio.id_municipio, municipio.nome)}
                          className="text-red-600 hover:text-red-800 transition-colors"
                          title="Excluir"
                        >
                          <FiTrash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}