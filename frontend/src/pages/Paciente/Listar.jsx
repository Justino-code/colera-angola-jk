import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import api from "../../services/api";
import Skeleton from "../../components/common/Skeleton";
import { 
  FiPlus, FiSearch, FiEye, FiEdit, FiTrash2, 
  FiUser, FiRotateCw, FiX, FiFileText 
} from "react-icons/fi";

export default function PacienteListar() {
  const [pacientes, setPacientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Carrega usuário do localStorage
    const usuario = localStorage.getItem('usuario');
    const userObj = usuario ? JSON.parse(usuario) : null;
    setUser(userObj);

    // Se não for admin/gestor e não tiver hospital, não carrega nada
    if (
      userObj &&
      userObj.role !== 'admin' &&
      userObj.role !== 'gestor' &&
      !userObj.id_hospital
    ) {
      setLoading(false);
      setError('Sem permissão de ver pacientes, entre em contacto com o administrador.');
      return;
    }

    carregarPacientes(userObj);
    // eslint-disable-next-line
  }, []);

  const carregarPacientes = async (userObj) => {
    setLoading(true);
    setError(null);
    try {
      let res;
      if (userObj && userObj.role !== 'admin' && userObj.role !== 'gestor') {
        // Usuário comum: busca apenas pacientes do hospital dele
        res = await api.get(`/pacientes/por-hospital/${userObj.id_hospital}`);
      } else {
        // Admin ou gestor: busca todos os pacientes
        res = await api.get("/pacientes");
      }
      if (res.success) {
        setPacientes(res.data);
        if (res.data.length === 0) {
          toast("Nenhum paciente cadastrado", { icon: "ℹ️" });
        }
      } else {
        setError(res.message || "Erro ao carregar pacientes");
        toast.error(res.message || "Erro ao carregar pacientes");
      }
    } catch (err) {
      setError("Erro ao conectar ao servidor");
      toast.error("Erro ao carregar pacientes");
      console.error("Erro ao carregar pacientes:", err);
    } finally {
      setLoading(false);
    }
  };

  const excluirPaciente = async (id, nome) => {
    if (!window.confirm(`Tem certeza que deseja excluir o paciente "${nome}"?`)) return;

    try {
      setLoading(true);
      const res = await api.delete(`/pacientes/${id}`);
      if (res.success) {
        toast.success(`Paciente "${nome}" excluído com sucesso!`);
        await carregarPacientes(user);
      } else {
        toast.error(res.message || "Erro ao excluir paciente");
      }
    } catch (err) {
      toast.error("Erro ao excluir paciente");
      console.error("Erro ao excluir paciente:", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredPacientes = pacientes.filter(paciente => {
    const searchLower = searchTerm.toLowerCase();
    return (
      paciente.nome.toLowerCase().includes(searchLower) ||
      (paciente.numero_bi && paciente.numero_bi.toLowerCase().includes(searchLower))
    );
  });

  const podeEditar = user && (user.role === 'admin' || user.role === 'gestor' || user.role === 'enfermeiro' || user.role === 'medico');
  const podeCriar = user && (user.role === 'admin' || user.role === 'enfermeiro');
  const podeDeletar = user && (user.role === 'admin' || user.role === 'gestor' || user.role === 'medico');

  if (error) {
    return (
      <div className="min-h-full w-full bg-gray-50 p-4 md:p-6">
        <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-md p-6 text-center">
          <div className="text-red-500 mb-4">
            <FiUser size={48} className="mx-auto" />
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Erro ao carregar pacientes</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => carregarPacientes(user)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition flex items-center gap-2 mx-auto"
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
              <h1 className="text-xl md:text-2xl font-bold text-gray-800">Gestão de Pacientes</h1>
              <p className="text-sm text-gray-500 mt-1">
                {filteredPacientes.length} {filteredPacientes.length === 1 ? 'paciente encontrado' : 'pacientes encontrados'}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1 min-w-[200px]">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiSearch className="text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Buscar pacientes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-200 w-full"
                />
              </div>
              {podeCriar && (
                <Link
                  to="/paciente/criar"
                  className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition whitespace-nowrap"
                >
                  <FiPlus size={18} /> Novo Paciente
                </Link>
              )}
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
        ) : filteredPacientes.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            {searchTerm ? (
              <div>
                <FiUser size={48} className="mx-auto text-gray-400 mb-4" />
                <p className="mt-2">Nenhum paciente encontrado para "{searchTerm}"</p>
                <button 
                  onClick={() => setSearchTerm('')} 
                  className="mt-4 text-blue-600 hover:underline flex items-center justify-center gap-1 mx-auto"
                >
                  <FiX size={16} /> Limpar busca
                </button>
              </div>
            ) : (
              <div>
                <FiUser size={48} className="mx-auto text-gray-400 mb-4" />
                <p className="mt-2">Nenhum paciente cadastrado</p>
                {podeCriar && (
                  <Link
                    to="/paciente/criar"
                    className="mt-4 inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition"
                  >
                    <FiPlus size={16} /> Cadastrar primeiro paciente
                  </Link>
                )}
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
                    BI/Identificação
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPacientes.map(paciente => (
                  <tr key={paciente.id_paciente} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {paciente.nome}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {paciente.numero_bi || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => navigate(`/paciente/${paciente.id_paciente}`)}
                          className="text-blue-600 hover:text-blue-800 transition-colors p-1"
                          title="Visualizar"
                        >
                          <FiEye size={18} />
                        </button>
                        {podeEditar && (
                          <button
                            onClick={() => navigate(`/paciente/${paciente.id_paciente}/editar`)}
                            className="text-yellow-600 hover:text-yellow-800 transition-colors p-1"
                            title="Editar"
                          >
                            <FiEdit size={18} />
                          </button>
                        )}
                        {podeEditar && (
                          <button
                            onClick={() => excluirPaciente(paciente.id_paciente, paciente.nome)}
                            className="text-red-600 hover:text-red-800 transition-colors p-1"
                            title="Excluir"
                          >
                            <FiTrash2 size={18} />
                          </button>
                        )}
                        <button
                          onClick={() => navigate(`/paciente/${paciente.id_paciente}/encaminhamento`)}
                          className="text-indigo-600 hover:text-indigo-800 transition-colors p-1"
                          title="Encaminhamento"
                        >
                          <FiFileText size={18} />
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