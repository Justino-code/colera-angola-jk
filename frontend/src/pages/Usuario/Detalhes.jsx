import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import Skeleton from '../../components/common/Skeleton';
import { toast } from 'react-hot-toast';

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

const roleLabels = {
  admin: 'Administrador',
  gestor: 'Gestor',
  medico: 'Médico',
  enfermeiro: 'Enfermeiro',
  tecnico: 'Técnico',
  epidemiologista: 'Epidemiologista',
  administrativo: 'Administrativo',
  farmaceutico: 'Farmacêutico',
  analista_dados: 'Analista de Dados',
  coordenador_regional: 'Coordenador Regional'
};

export default function UsuarioDetalhes() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchUsuario = async () => {
      try {
        const res = await api.get(`/usuario/${id}`);
        if (res.success) {
          setUsuario(res.data);
          console.log(res);
        } else {
          toast.error(res.message || 'Usuário não encontrado');
          navigate('/usuario');
        }
      } catch (err) {
        console.error('Erro ao carregar usuário:', err);
        toast.error('Erro ao conectar ao servidor');
        navigate('/usuario');
      } finally {
        setLoading(false);
      }
    };

    fetchUsuario();
  }, [id, navigate]);

  const handleDelete = async () => {
    if (!window.confirm('Tem certeza que deseja remover este usuário?')) return;
    
    setDeleting(true);
    try {
      const res = await api.delete(`/usuario/${id}`);
      if (res.success) {
        toast.success('Usuário removido com sucesso');
        navigate('/usuario');
      } else {
        toast.error(res.message || 'Erro ao remover usuário');
      }
    } catch (error) {
      console.error('Erro ao remover usuário:', error);
      toast.error(error.response?.data?.message || 'Erro ao remover usuário');
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center p-6 max-w-md">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando detalhes do usuário...</p>
        </div>
      </div>
    );
  }

  if (!usuario) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center p-6 max-w-md">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h2 className="text-xl font-medium text-gray-800 mt-4">Usuário não encontrado</h2>
          <p className="text-gray-500 mt-2">O usuário solicitado não existe ou ocorreu um erro ao carregar.</p>
          <button
            onClick={() => navigate('/usuario')}
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition"
          >
            Voltar para a lista
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full w-full bg-gray-50 p-4 md:p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-4 md:p-6 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-gray-800">Detalhes do Usuário</h1>
              <p className="text-sm text-gray-500 mt-1">Informações completas sobre o usuário</p>
            </div>
            <div className="flex gap-2">
              <Link
                to={`/usuario/${usuario.id_usuario}/editar`}
                className="flex items-center gap-1 bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1.5 rounded-md text-sm transition"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Editar
              </Link>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-md text-sm transition disabled:opacity-70"
              >
                {deleting ? (
                  <>
                    <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Removendo...
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Remover
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="p-4 md:p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-800 mb-3 pb-2 border-b border-gray-200">Informações Básicas</h2>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Nome:</span>
                    <span className="font-medium">{usuario.nome}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Email:</span>
                    <span className="font-medium">{usuario.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Cargo:</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${roleColors[usuario.role] || 'bg-gray-100 text-gray-800'}`}>
                      {roleLabels[usuario.role] || usuario.role}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-lg font-semibold text-gray-800 mb-3 pb-2 border-b border-gray-200">Permissões</h2>
                <div className="flex flex-wrap gap-2">
                  {usuario.permissoes?.length > 0 ? (
                    usuario.permissoes.map((permissao, index) => (
                      <span key={index} className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">
                        {permissao}
                      </span>
                    ))
                  ) : (
                    <span className="text-gray-500 italic">Nenhuma permissão específica</span>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-800 mb-3 pb-2 border-b border-gray-200">Vinculações</h2>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Hospital:</span>
                    <span className="font-medium">{usuario.hospital?.nome || 'Nenhum'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Gabinete:</span>
                    <span className="font-medium">{usuario.gabinete?.nome || 'Nenhum'}</span>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-lg font-semibold text-gray-800 mb-3 pb-2 border-b border-gray-200">Informações Adicionais</h2>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Data de Criação:</span>
                    <span className="font-medium">
                      {new Date(usuario.created_at).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Última Atualização:</span>
                    <span className="font-medium">
                      {new Date(usuario.updated_at).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-gray-200 flex justify-end">
            <button
              onClick={() => navigate('/usuario')}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-md transition"
            >
              Voltar para lista
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}