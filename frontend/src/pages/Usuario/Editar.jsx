import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import api from '../../services/api';
import Skeleton from '../../components/common/Skeleton';
import { toast } from 'react-hot-toast';
import { 
  FiArrowLeft, FiSave, FiLock, FiUser, FiMail, 
  FiBriefcase, FiKey, FiCheck, FiX, FiShield 
} from 'react-icons/fi';

const schema = z
  .object({
    nome: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
    email: z.string().email('Por favor, insira um email válido'),
    role: z.string().min(1, 'Selecione um cargo'),
    permissoes: z.string(),
    id_hospital: z.string().optional().nullable(),
    id_gabinete: z.string().optional().nullable(),
    senha: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres').optional().or(z.literal('')),
    confirmarSenha: z.string().optional().or(z.literal(''))
  })
  .refine((data) => {
    if (data.senha || data.confirmarSenha) {
      return data.senha === data.confirmarSenha;
    }
    return true;
  }, {
    message: 'As senhas não coincidem',
    path: ['confirmarSenha']
  });

export default function UsuarioEditar() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [hospitais, setHospitais] = useState([]);
  const [gabinetes, setGabinetes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isDirty }
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      nome: '',
      email: '',
      role: '',
      permissoes: '',
      id_hospital: '',
      id_gabinete: '',
      senha: '',
      confirmarSenha: ''
    }
  });

  const selectedRole = watch('role');
  const showHospitalField = ['medico', 'enfermeiro', 'tecnico'].includes(selectedRole);
  const showGabineteField = ['gestor', 'coordenador_regional'].includes(selectedRole);

  useEffect(() => {
    const usuarioLogado = localStorage.getItem('usuario');
    if (usuarioLogado) {
      const parsedUser = JSON.parse(usuarioLogado);
      setCurrentUser(parsedUser);
      setIsAdmin(parsedUser.role === 'admin');
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userRes, hospRes, gabRes] = await Promise.all([
          api.get(`/usuario/${id}`),
          api.get('/hospitais'),
          api.get('/gabinetes')
        ]);

        if (!userRes.success) {
          toast.error(userRes.message || 'Usuário não encontrado');
          navigate('/usuario');
          return;
        }

        const userData = userRes.data;
        
        if (!isAdmin) {
          if (currentUser && currentUser.id_hospital) {
            setValue('id_hospital', currentUser.id_hospital);
          }
          if (currentUser && currentUser.id_gabinete) {
            setValue('id_gabinete', currentUser.id_gabinete);
          }
        }

        reset({
          nome: userData.nome,
          email: userData.email,
          role: userData.role,
          permissoes: userData.permissoes?.join(', ') || '',
          id_hospital: userData.id_hospital || '',
          id_gabinete: userData.id_gabinete || '',
          senha: '',
          confirmarSenha: ''
        });

        setHospitais(hospRes.success ? hospRes.data : []);
        setGabinetes(gabRes.success ? gabRes.data : []);
      } catch (err) {
        console.error('Erro ao carregar dados:', err);
        toast.error(err.response?.data?.message || 'Erro ao carregar dados');
        navigate('/usuario');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, navigate, reset, isAdmin, currentUser, setValue]);

  const onSubmit = async (data) => {
    setSaving(true);
    try {
      const payload = {
        nome: data.nome.trim(),
        email: data.email.trim(),
        role: data.role,
        permissoes: data.permissoes.split(',').map(p => p.trim()).filter(p => p),
        id_hospital: data.id_hospital || null,
        id_gabinete: data.id_gabinete || null
      };

      if (data.senha) {
        payload.senha = data.senha;
      }

      const res = await api.put(`/usuario/${id}`, payload);
      if (res.success) {
        toast.success('Usuário atualizado com sucesso!');
        setTimeout(() => navigate('/usuario'), 1000);
      } else {
        toast.error(res.message || 'Falha ao atualizar usuário');
      }
    } catch (err) {
      console.error('Erro ao atualizar usuário:', err);
      toast.error(err.response?.data?.message || 'Erro ao atualizar usuário');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-full w-full bg-gray-50 p-4 md:p-6">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-10 bg-gray-200 rounded w-1/3"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-10 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
            <div className="h-12 bg-gray-200 rounded w-1/4 ml-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  const hospitalAtual = hospitais.find(h => h.id_hospital == watch('id_hospital'));
  const gabineteAtual = gabinetes.find(g => g.id_gabinete == watch('id_gabinete'));

  // Mapear roles para nomes amigáveis
  const roleNames = {
    admin: 'Administrador',
    gestor: 'Gestor',
    medico: 'Médico',
    tecnico: 'Técnico',
    enfermeiro: 'Enfermeiro',
    epidemiologista: 'Epidemiologista',
    administrativo: 'Administrativo',
    agente_sanitario: 'Agente Sanitário',
    farmaceutico: 'Farmacêutico',
    analista_dados: 'Analista de Dados',
    coordenador_regional: 'Coordenador Regional'
  };

  // Formatar permissões para exibição
  const formatarPermissoes = (permissoes) => {
    if (!permissoes) return [];
    return permissoes.split(',')
      .map(p => p.trim())
      .filter(p => p)
      .map(p => p.charAt(0).toUpperCase() + p.slice(1).replace(/_/g, ' '));
  };

  return (
    <div className="min-h-full w-full bg-gray-50 p-4 md:p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        <div className="bg-gradient-to-r from-cyan-600 to-blue-600 p-6 text-white">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
            <div>
              <h1 className="text-2xl font-bold flex items-center">
                <FiUser className="mr-3" />
                Editar Usuário
              </h1>
              <p className="text-cyan-100 mt-1">Atualize as informações do usuário</p>
            </div>
            <button
              onClick={() => navigate("/usuario")}
              className="px-4 py-2 bg-white bg-opacity-20 rounded-lg hover:bg-opacity-30 transition-all flex items-center"
            >
              <FiArrowLeft className="mr-2" />
              Voltar para Lista
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-4 md:p-6">
          <div className="space-y-6">
            <div className="bg-white rounded-lg border border-gray-200 p-5">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center border-b pb-2">
                <FiUser className="mr-2 text-cyan-600" />
                Informações Pessoais
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                    <span>Nome Completo</span>
                    {errors.nome && (
                      <span className="ml-2 text-red-600 text-xs flex items-center">
                        <FiX className="mr-1" /> {errors.nome.message}
                      </span>
                    )}
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      {...register('nome')}
                      className={`w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                        errors.nome ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-cyan-200'
                      }`}
                    />
                    <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                    <span>Email</span>
                    {errors.email && (
                      <span className="ml-2 text-red-600 text-xs flex items-center">
                        <FiX className="mr-1" /> {errors.email.message}
                      </span>
                    )}
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      {...register('email')}
                      className={`w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                        errors.email ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-cyan-200'
                      }`}
                    />
                    <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                    <span>Cargo</span>
                    {errors.role && (
                      <span className="ml-2 text-red-600 text-xs flex items-center">
                        <FiX className="mr-1" /> {errors.role.message}
                      </span>
                    )}
                  </label>
                  <div className="relative">
                    {isAdmin ? (
                      <>
                        <select
                          {...register('role')}
                          className={`w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 appearance-none ${
                            errors.role ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-cyan-200'
                          }`}
                        >
                          <option value="">Selecione um cargo</option>
                          {Object.entries(roleNames).map(([value, label]) => (
                            <option key={value} value={value}>{label}</option>
                          ))}
                        </select>
                        <FiBriefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      </>
                    ) : (
                      <div className="relative">
                        <input
                          type="text"
                          value={roleNames[watch('role')] || watch('role')}
                          readOnly
                          className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md bg-gray-50 cursor-not-allowed"
                        />
                        <FiBriefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                          <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                            Fixo
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Permissões
                  </label>
                  {isAdmin ? (
                    <input
                      type="text"
                      {...register('permissoes')}
                      placeholder="Ex: criar_usuario, editar_paciente"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-200"
                    />
                  ) : (
                    <div className="bg-gray-50 border border-gray-300 rounded-md p-3">
                      <div className="flex flex-wrap gap-2">
                        {formatarPermissoes(watch('permissoes')).map((permissao, index) => (
                          <span 
                            key={index} 
                            className="bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full flex items-center"
                          >
                            <FiShield className="mr-1 text-blue-600" size={12} />
                            {permissao}
                          </span>
                        ))}
                        {!watch('permissoes') && (
                          <span className="text-gray-500 text-sm">Nenhuma permissão atribuída</span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {(showHospitalField || showGabineteField) && (
              <div className="bg-white rounded-lg border border-gray-200 p-5">
                <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center border-b pb-2">
                  <FiBriefcase className="mr-2 text-amber-600" />
                  Associação Institucional
                </h2>
                
                {showHospitalField && (
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Hospital
                    </label>
                    {isAdmin ? (
                      <select
                        {...register('id_hospital')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-200"
                      >
                        <option value="">Selecione um hospital</option>
                        {hospitais.map(h => (
                          <option key={h.id_hospital} value={h.id_hospital}>{h.nome}</option>
                        ))}
                      </select>
                    ) : (
                      <div className="relative">
                        <input
                          type="text"
                          value={hospitalAtual ? hospitalAtual.nome : 'Não atribuído'}
                          readOnly
                          className="w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md bg-gray-50 cursor-not-allowed"
                        />
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                          <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                            Fixo
                          </span>
                        </div>
                        <input type="hidden" {...register('id_hospital')} />
                      </div>
                    )}
                  </div>
                )}

                {showGabineteField && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Gabinete
                    </label>
                    {isAdmin ? (
                      <select
                        {...register('id_gabinete')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-200"
                      >
                        <option value="">Selecione um gabinete</option>
                        {gabinetes.map(g => (
                          <option key={g.id_gabinete} value={g.id_gabinete}>{g.nome}</option>
                        ))}
                      </select>
                    ) : (
                      <div className="relative">
                        <input
                          type="text"
                          value={gabineteAtual ? gabineteAtual.nome : 'Não atribuído'}
                          readOnly
                          className="w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md bg-gray-50 cursor-not-allowed"
                        />
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                          <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                            Fixo
                          </span>
                        </div>
                        <input type="hidden" {...register('id_gabinete')} />
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            <div className="bg-white rounded-lg border border-gray-200 p-5">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center border-b pb-2">
                <FiLock className="mr-2 text-purple-600" />
                Segurança da Conta
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                    <span>Nova Senha</span>
                    {errors.senha && (
                      <span className="ml-2 text-red-600 text-xs flex items-center">
                        <FiX className="mr-1" /> {errors.senha.message}
                      </span>
                    )}
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      {...register('senha')}
                      placeholder="Deixe em branco para manter a atual"
                      className={`w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                        errors.senha ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-purple-200'
                      }`}
                    />
                    <FiKey className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                    <span>Confirmar Nova Senha</span>
                    {errors.confirmarSenha && (
                      <span className="ml-2 text-red-600 text-xs flex items-center">
                        <FiX className="mr-1" /> {errors.confirmarSenha.message}
                      </span>
                    )}
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      {...register('confirmarSenha')}
                      className={`w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                        errors.confirmarSenha ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-purple-200'
                      }`}
                    />
                    <FiCheck className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button
                type="button"
                onClick={() => navigate('/usuario')}
                className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition mr-3 flex items-center"
              >
                <FiX className="mr-2" /> Cancelar
              </button>
              <button
                type="submit"
                disabled={saving || !isDirty}
                className={`px-4 py-2 text-white rounded-lg transition min-w-32 flex items-center justify-center ${
                  saving || !isDirty 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700'
                }`}
              >
                {saving ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Salvando...
                  </span>
                ) : (
                  <span className="flex items-center">
                    <FiSave className="mr-2" /> Salvar Alterações
                  </span>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}