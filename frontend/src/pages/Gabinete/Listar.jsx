import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import api from '../../services/api';
import Skeleton from '../../components/common/Skeleton';
import { 
  FiPlus, FiSearch, FiEye, FiEdit, FiTrash2, 
  FiBriefcase, FiRotateCw, FiX, FiMapPin 
} from 'react-icons/fi';

export default function GabineteListar() {
  const [gabinetes, setGabinetes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [removingId, setRemovingId] = useState(null);

  useEffect(() => {
    carregarGabinetes();
  }, []);

  const carregarGabinetes = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/gabinetes');
      
      if (res.success) {
        const dados = Array.isArray(res.data) ? res.data : 
                     Array.isArray(res.gabinetes) ? res.gabinetes : [];
        setGabinetes(dados);
        
        if (dados.length === 0) {
          toast('Nenhum gabinete cadastrado', { icon: 'ℹ️' });
        }
      } else {
        setError(res.message || 'Erro ao carregar gabinetes');
        toast.error(res.message || 'Erro ao carregar gabinetes');
      }
    } catch (error) {
      setError('Erro ao conectar ao servidor');
      toast.error('Erro ao carregar gabinetes');
      console.error('Erro ao carregar gabinetes:', error);
    } finally {
      setLoading(false);
    }
  };

  const removerGabinete = async (id, nome) => {
    if (!window.confirm(`Tem certeza que deseja remover o gabinete "${nome}"?`)) return;

    setRemovingId(id);
    try {
      const res = await api.delete(`/gabinetes/${id}`);
      if (res.success) {
        toast.success(`Gabinete "${nome}" removido com sucesso!`);
        setGabinetes(prev => prev.filter(g => (g.id || g.id_gabinete) !== id));
      } else {
        toast.error(res.message || 'Erro ao remover gabinete');
      }
    } catch (error) {
      toast.error('Erro ao remover gabinete');
      console.error('Erro ao remover gabinete:', error);
    } finally {
      setRemovingId(null);
    }
  };

  const filteredGabinetes = gabinetes.filter(gabinete => {
    const searchLower = searchTerm.toLowerCase();
    return (
      gabinete.nome.toLowerCase().includes(searchLower) ||
      (gabinete.local && gabinete.local.toLowerCase().includes(searchLower))
    );
  });

  if (error) {
    return (
      <div className="min-h-full w-full bg-gray-50 p-4 md:p-6">
        <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-md p-6 text-center">
          <div className="text-red-500 mb-4">
            <FiBriefcase size={48} className="mx-auto" />
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Erro ao carregar gabinetes</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={carregarGabinetes}
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
              <h1 className="text-xl md:text-2xl font-bold text-gray-800">Gestão de Gabinetes</h1>
              <p className="text-sm text-gray-500 mt-1">
                {filteredGabinetes.length} {filteredGabinetes.length === 1 ? 'gabinete encontrado' : 'gabinetes encontrados'}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1 min-w-[200px]">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiSearch className="text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Buscar gabinetes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-200 w-full"
                />
              </div>
              <Link
                to="/gabinete/criar"
                className="flex items-center justify-center gap-2 bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-md transition whitespace-nowrap"
              >
                <FiPlus size={18} /> Novo Gabinete
              </Link>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="p-8">
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-20 w-full" />
              ))}
            </div>
          </div>
        ) : filteredGabinetes.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            {searchTerm ? (
              <div>
                <FiBriefcase size={48} className="mx-auto text-gray-400 mb-4" />
                <p className="mt-2">Nenhum gabinete encontrado para "{searchTerm}"</p>
                <button 
                  onClick={() => setSearchTerm('')} 
                  className="mt-4 text-cyan-600 hover:underline flex items-center justify-center gap-1 mx-auto"
                >
                  <FiX size={16} /> Limpar busca
                </button>
              </div>
            ) : (
              <div>
                <FiBriefcase size={48} className="mx-auto text-gray-400 mb-4" />
                <p className="mt-2">Nenhum gabinete cadastrado</p>
                <Link
                  to="/gabinete/criar"
                  className="mt-4 inline-flex items-center gap-2 bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-md transition"
                >
                  <FiPlus size={16} /> Cadastrar primeiro gabinete
                </Link>
              </div>
            )}
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredGabinetes.map((gabinete) => {
              const idGabinete = gabinete.id || gabinete.id_gabinete;
              return (
                <div
                  key={idGabinete}
                  className="p-4 md:p-6 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-800">{gabinete.nome}</h3>
                      {gabinete.local && (
                        <div className="mt-1 text-sm text-gray-600 flex items-center gap-2">
                          <FiMapPin size={14} />
                          {gabinete.local}
                        </div>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2 justify-end">
                      <Link
                        to={`/gabinete/${idGabinete}`}
                        className="flex items-center gap-1 text-cyan-600 hover:text-cyan-800 px-3 py-1 rounded transition-colors"
                        title="Detalhes"
                      >
                        <FiEye size={16} /> <span className="hidden sm:inline">Detalhes</span>
                      </Link>
                      <Link
                        to={`/gabinete/${idGabinete}/editar`}
                        className="flex items-center gap-1 text-amber-600 hover:text-amber-800 px-3 py-1 rounded transition-colors"
                        title="Editar"
                      >
                        <FiEdit size={16} /> <span className="hidden sm:inline">Editar</span>
                      </Link>
                      <button
                        onClick={() => removerGabinete(idGabinete, gabinete.nome)}
                        disabled={removingId === idGabinete}
                        className="flex items-center gap-1 text-red-600 hover:text-red-800 px-3 py-1 rounded transition-colors disabled:opacity-50"
                        title="Remover"
                      >
                        {removingId === idGabinete ? (
                          <FiRotateCw className="animate-spin" size={16} />
                        ) : (
                          <FiTrash2 size={16} />
                        )}
                        <span className="hidden sm:inline">Remover</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}