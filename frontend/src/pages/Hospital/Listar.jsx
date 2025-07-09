import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import api from '../../services/api';
import Skeleton from '../../components/common/Skeleton';
import { 
  FiPlus, FiSearch, FiEye, FiEdit, FiTrash2, 
  FiHome, FiRotateCw, FiX, FiMapPin 
} from 'react-icons/fi';

export default function HospitalListar() {
  const [hospitais, setHospitais] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [removingId, setRemovingId] = useState(null);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Carrega usuário do localStorage
    const usuario = localStorage.getItem('usuario');
    setUser(usuario ? JSON.parse(usuario) : null);

    carregarHospitais();
    // eslint-disable-next-line
  }, []);

  const podeEditar = user && (user.role === 'admin' || user.role === 'gestor');

  const carregarHospitais = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/hospitais');
      if (res.success) {
        const lista = res.data || [];
        setHospitais(lista);
        if (lista.length === 0) {
          toast('Nenhum hospital cadastrado', { icon: 'ℹ️' });
        }
      } else {
        setError(res.message || 'Erro ao carregar hospitais');
        toast.error(res.message || 'Erro ao carregar hospitais');
      }
    } catch (error) {
      setError('Erro ao conectar ao servidor');
      toast.error('Erro ao carregar hospitais');
      console.error('Erro ao carregar hospitais:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemover = async (id, nome) => {
    if (!window.confirm(`Tem certeza que deseja remover o hospital "${nome}"?`)) return;
    
    setRemovingId(id);
    try {
      const res = await api.delete(`/hospitais/${id}`);
      if (res.success) {
        toast.success(`Hospital "${nome}" removido com sucesso`);
        setHospitais(prev => prev.filter(h => h.id_hospital !== id));
      } else {
        toast.error(res.message || 'Erro ao remover hospital');
      }
    } catch (error) {
      toast.error('Erro ao remover hospital');
      console.error('Erro ao remover hospital:', error);
    } finally {
      setRemovingId(null);
    }
  };

  const filteredHospitais = hospitais.filter(hospital => {
    const searchLower = searchTerm.toLowerCase();
    return (
      hospital.nome.toLowerCase().includes(searchLower) ||
      (hospital.endereco && hospital.endereco.toLowerCase().includes(searchLower)) ||
      (hospital.municipio?.nome && hospital.municipio.nome.toLowerCase().includes(searchLower))
    );
  });

  if (error) {
    return (
      <div className="min-h-full w-full bg-gray-50 p-4 md:p-6">
        <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-md p-6 text-center">
          <div className="text-red-500 mb-4">
            <FiHome size={48} className="mx-auto" />
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Erro ao carregar hospitais</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={carregarHospitais}
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
              <h1 className="text-xl md:text-2xl font-bold text-gray-800">Gestão de Hospitais</h1>
              <p className="text-sm text-gray-500 mt-1">
                {filteredHospitais.length} {filteredHospitais.length === 1 ? 'hospital encontrado' : 'hospitais encontrados'}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1 min-w-[200px]">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiSearch className="text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Buscar hospitais..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-200 w-full"
                />
              </div>
              {podeEditar && (
                <Link
                  to="/hospital/criar"
                  className="flex items-center justify-center gap-2 bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-md transition whitespace-nowrap"
                >
                  <FiPlus size={18} /> Novo Hospital
                </Link>
              )}
            </div>
          </div>
        </div>

        {loading ? (
          <div className="p-8">
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-28 w-full" />
              ))}
            </div>
          </div>
        ) : filteredHospitais.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            {searchTerm ? (
              <div>
                <FiHome size={48} className="mx-auto text-gray-400 mb-4" />
                <p className="mt-2">Nenhum hospital encontrado para "{searchTerm}"</p>
                <button 
                  onClick={() => setSearchTerm('')} 
                  className="mt-4 text-cyan-600 hover:underline flex items-center justify-center gap-1 mx-auto"
                >
                  <FiX size={16} /> Limpar busca
                </button>
              </div>
            ) : (
              <div>
                <FiHome size={48} className="mx-auto text-gray-400 mb-4" />
                <p className="mt-2">Nenhum hospital cadastrado</p>
                {podeEditar && (
                  <Link
                    to="/hospital/criar"
                    className="mt-4 inline-flex items-center gap-2 bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-md transition"
                  >
                    <FiPlus size={16} /> Cadastrar primeiro hospital
                  </Link>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredHospitais.map(hospital => (
              <div
                key={hospital.id_hospital}
                className="p-4 md:p-6 hover:bg-gray-50 transition-colors"
              >
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-800">{hospital.nome}</h3>
                    <div className="mt-1 text-sm text-gray-600 flex items-center gap-2">
                      <FiMapPin size={14} />
                      {hospital.endereco || 'Endereço não informado'}
                    </div>
                    <div className="mt-2 text-sm text-gray-500">
                      <span className="font-medium">Capacidade:</span> {hospital.capacidade_leitos || 0} leitos
                    </div>
                    {hospital.municipio?.nome && (
                      <div className="mt-1 text-xs text-gray-400">
                        <span className="font-medium">Município:</span> {hospital.municipio.nome}
                      </div>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2 justify-end">
                    <button
                      onClick={() => navigate(`/hospital/${hospital.id_hospital}`)}
                      className="flex items-center gap-1 text-blue-600 hover:text-blue-800 px-3 py-1 rounded transition-colors"
                      title="Visualizar"
                    >
                      <FiEye size={16} /> <span className="hidden sm:inline">Ver</span>
                    </button>
                    {podeEditar && (
                      <button
                        onClick={() => navigate(`/hospital/${hospital.id_hospital}/editar`)}
                        className="flex items-center gap-1 text-cyan-600 hover:text-cyan-800 px-3 py-1 rounded transition-colors"
                        title="Editar"
                      >
                        <FiEdit size={16} /> <span className="hidden sm:inline">Editar</span>
                      </button>
                    )}
                    {podeEditar && (
                      <button
                        onClick={() => handleRemover(hospital.id_hospital, hospital.nome)}
                        disabled={removingId === hospital.id_hospital}
                        className="flex items-center gap-1 text-red-600 hover:text-red-800 px-3 py-1 rounded transition-colors disabled:opacity-50"
                        title="Remover"
                      >
                        {removingId === hospital.id_hospital ? (
                          <FiRotateCw className="animate-spin" size={16} />
                        ) : (
                          <FiTrash2 size={16} />
                        )}
                        <span className="hidden sm:inline">Remover</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}