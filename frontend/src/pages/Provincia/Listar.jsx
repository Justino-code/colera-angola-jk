import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { toast } from 'react-hot-toast';
import Skeleton from '../../components/common/Skeleton';
import { 
  FiPlus, FiSearch, FiEye, FiEdit, FiTrash2, 
  FiMap, FiRotateCw, FiX 
} from 'react-icons/fi';

export default function ProvinciaListar() {
  const [provincias, setProvincias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    carregarProvincias();
  }, []);

  const carregarProvincias = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/provincias');
      if (res.success) {
        setProvincias(res.data);
      } else {
        setError(res.message || 'Erro ao carregar províncias');
        toast.error(res.message || 'Erro ao carregar províncias');
      }
    } catch (err) {
      setError('Erro ao conectar ao servidor');
      toast.error('Erro ao carregar províncias');
      console.error('Erro na requisição:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, nome) => {
    if (!window.confirm(`Tem certeza que deseja apagar a província "${nome}"?`)) return;
    
    try {
      setLoading(true);
      const res = await api.delete(`/provincias/${id}`);
      if (res.success) {
        toast.success(`Província "${nome}" eliminada com sucesso`);
        setProvincias(prev => prev.filter(p => p.id_provincia !== id));
      } else {
        toast.error(res.message || 'Erro ao eliminar província');
      }
    } catch (err) {
      toast.error('Erro ao eliminar província');
      console.error('Erro na requisição:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredProvincias = provincias.filter(provincia => {
    const searchLower = searchTerm.toLowerCase();
    return (
      provincia.nome.toLowerCase().includes(searchLower) ||
      (provincia.codigo_iso && provincia.codigo_iso.toLowerCase().includes(searchLower))
    );
  });

  if (error) {
    return (
      <div className="min-h-full w-full bg-gray-50 p-4 md:p-6">
        <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-md p-6 text-center">
          <div className="text-red-500 mb-4">
            <FiMap size={48} className="mx-auto" />
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Erro ao carregar províncias</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={carregarProvincias}
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
              <h1 className="text-xl md:text-2xl font-bold text-gray-800">Gestão de Províncias</h1>
              <p className="text-sm text-gray-500 mt-1">
                {filteredProvincias.length} {filteredProvincias.length === 1 ? 'província encontrada' : 'províncias encontradas'}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1 min-w-[200px]">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiSearch className="text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Buscar províncias..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-200 w-full"
                />
              </div>
              <Link
                to="/provincia/criar"
                className="flex items-center justify-center gap-2 bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-md transition whitespace-nowrap"
              >
                <FiPlus size={18} /> Nova Província
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
        ) : filteredProvincias.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            {searchTerm ? (
              <div>
                <FiMap size={48} className="mx-auto text-gray-400 mb-4" />
                <p className="mt-2">Nenhuma província encontrada para "{searchTerm}"</p>
                <button 
                  onClick={() => setSearchTerm('')} 
                  className="mt-4 text-cyan-600 hover:underline flex items-center justify-center gap-1 mx-auto"
                >
                  <FiX size={16} /> Limpar busca
                </button>
              </div>
            ) : (
              <div>
                <FiMap size={48} className="mx-auto text-gray-400 mb-4" />
                <p className="mt-2">Nenhuma província cadastrada</p>
                <Link
                  to="/provincia/criar"
                  className="mt-4 inline-flex items-center gap-2 bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-md transition"
                >
                  <FiPlus size={16} /> Cadastrar primeira província
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
                    Código ISO
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredProvincias.map(provincia => (
                  <tr key={provincia.id_provincia} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {provincia.nome}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {provincia.codigo_iso || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-3">
                        <Link
                          to={`/provincia/${provincia.id_provincia}`}
                          className="text-blue-600 hover:text-blue-800 transition-colors"
                          title="Visualizar"
                        >
                          <FiEye size={18} />
                        </Link>
                        <Link
                          to={`/provincia/${provincia.id_provincia}/editar`}
                          className="text-yellow-600 hover:text-yellow-800 transition-colors"
                          title="Editar"
                        >
                          <FiEdit size={18} />
                        </Link>
                        <button
                          onClick={() => handleDelete(provincia.id_provincia, provincia.nome)}
                          className="text-red-600 hover:text-red-800 transition-colors"
                          title="Apagar"
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