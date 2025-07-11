import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import api from '../../services/api';
import Skeleton from '../../components/common/Skeleton';
import { toast } from 'react-hot-toast';
import { 
  FiArrowLeft, FiSave, FiLock, FiUser, FiMail, 
  FiBriefcase, FiKey, FiCheck, FiX, FiShield,
  FiHome, FiArchive
} from 'react-icons/fi';

const schema = z.object({
  nome: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: z.string().email('Por favor, insira um email válido'),
  password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
  password_confirmation: z.string(),
  role: z.string().min(1, 'Selecione um cargo'),
  permissoes: z.string(),
  id_hospital: z.string().optional().nullable(),
  id_gabinete: z.string().optional().nullable()
}).refine((data) => data.password === data.password_confirmation, {
  message: 'As senhas não coincidem',
  path: ['password_confirmation']
});

// Constantes para os tipos de gestor (apenas para uso no frontend)
const GESTOR_TYPES = {
  HOSPITALAR: 'gestor_hospitalar',
  GABINETE: 'gestor_gabinete'
};

export default function CriarUsuario() {
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
    formState: { errors },
    watch,
    setValue,
    reset
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      nome: '',
      email: '',
      password: '',
      password_confirmation: '',
      role: '',
      permissoes: '',
      id_hospital: '',
      id_gabinete: ''
    }
  });

  const selectedRole = watch('role');
  
  // Determinar qual campo mostrar baseado na seleção do usuário
  const showHospitalField = selectedRole === GESTOR_TYPES.HOSPITALAR || 
                          ['medico', 'enfermeiro', 'tecnico'].includes(selectedRole);
  
  const showGabineteField = selectedRole === GESTOR_TYPES.GABINETE || 
                           selectedRole === 'coordenador_regional';

  useEffect(() => {
    const usuarioLogado = localStorage.getItem('usuario');
    if (usuarioLogado) {
      const parsedUser = JSON.parse(usuarioLogado);
      setCurrentUser(parsedUser);
      setIsAdmin(parsedUser.role === 'admin');
      
      // Preencher automaticamente hospital/gabinete se não for admin
      if (parsedUser.role !== 'admin') {
        if (parsedUser.id_hospital) {
          setValue('id_hospital', parsedUser.id_hospital);
        }
        if (parsedUser.id_gabinete) {
          setValue('id_gabinete', parsedUser.id_gabinete);
        }
      }
    }

    const fetchData = async () => {
      try {
        const [hospRes, gabRes] = await Promise.all([
          api.get('/hospitais'),
          api.get('/gabinetes')
        ]);
        setHospitais(hospRes.success ? hospRes.data : []);
        setGabinetes(gabRes.success ? gabRes.data : []);
      } catch (err) {
        toast.error('Erro ao carregar dados necessários');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [setValue]);

  const onSubmit = async (data) => {
    setSaving(true);
    try {
      // Preparar payload para envio
      const payload = {
        nome: data.nome.trim(),
        email: data.email.trim(),
        password: data.password,
        password_confirmation: data.password_confirmation,
        role: data.role === GESTOR_TYPES.HOSPITALAR || data.role === GESTOR_TYPES.GABINETE 
              ? 'gestor' : data.role,
        permissoes: data.permissoes.split(',').map(p => p.trim()).filter(p => p),
        id_hospital: data.id_hospital || null,
        id_gabinete: data.id_gabinete || null
      };

      const res = await api.post('/usuario', payload);
      
      if (res.success) {
        toast.success('Usuário criado com sucesso!');
        setTimeout(() => navigate('/usuario'), 1000);
      } else {
        toast.error(res.message || 'Falha ao criar usuário');
      }
    } catch (err) {
      console.error('Erro ao criar usuário:', err);
      toast.error(err.response?.message || 'Erro ao criar usuário');
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

  // Mapear roles para nomes amigáveis (apenas para exibição)
  const roleNames = {
    admin: 'Administrador',
    gestor: 'Gestor',
    gestor_hospitalar: 'Gestor Hospitalar',
    gestor_gabinete: 'Gestor de Gabinete',
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

  // Função para renderizar campo não editável
  const renderReadOnlyField = (value, label, icon) => (
    <div className="relative">
      <input
        type="text"
        value={value || 'Não atribuído'}
        readOnly
        className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md bg-gray-50 cursor-not-allowed"
      />
      {icon}
      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
        <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
          Fixo
        </span>
      </div>
    </div>
  );

  return (
    <div className="min-h-full w-full bg-gray-50 p-4 md:p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        <div className="bg-gradient-to-r from-cyan-600 to-blue-600 p-6 text-white">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
            <div>
              <h1 className="text-2xl font-bold flex items-center">
                <FiUser className="mr-3" />
                Criar Novo Usuário
              </h1>
              <p className="text-cyan-100 mt-1">Preencha os campos para registrar um novo usuário</p>
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
                      placeholder="Ex: João da Silva"
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
                      placeholder="Ex: joao.silva@exemplo.com"
                      className={`w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                        errors.email ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-cyan-200'
                      }`}
                    />
                    <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                    <span>Senha</span>
                    {errors.password && (
                      <span className="ml-2 text-red-600 text-xs flex items-center">
                        <FiX className="mr-1" /> {errors.password.message}
                      </span>
                    )}
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      {...register('password')}
                      className={`w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                        errors.password ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-cyan-200'
                      }`}
                    />
                    <FiKey className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                    <span>Confirmar Senha</span>
                    {errors.password_confirmation && (
                      <span className="ml-2 text-red-600 text-xs flex items-center">
                        <FiX className="mr-1" /> {errors.password_confirmation.message}
                      </span>
                    )}
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      {...register('password_confirmation')}
                      className={`w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                        errors.password_confirmation ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-cyan-200'
                      }`}
                    />
                    <FiCheck className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-5">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center border-b pb-2">
                <FiBriefcase className="mr-2 text-amber-600" />
                Perfil e Permissões
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    <select
                      {...register('role')}
                      className={`w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 appearance-none ${
                        errors.role ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-amber-200'
                      }`}
                    >
                      <option value="">Selecione um cargo</option>
                      <option value="admin">Administrador</option>
                      <option value={GESTOR_TYPES.HOSPITALAR}>Gestor Hospitalar</option>
                      <option value={GESTOR_TYPES.GABINETE}>Gestor de Gabinete</option>
                      <option value="medico">Médico</option>
                      <option value="tecnico">Técnico</option>
                      <option value="enfermeiro">Enfermeiro</option>
                      <option value="epidemiologista">Epidemiologista</option>
                      <option value="administrativo">Administrativo</option>
                      <option value="agente_sanitario">Agente Sanitário</option>
                      <option value="farmaceutico">Farmacêutico</option>
                      <option value="analista_dados">Analista de Dados</option>
                      <option value="coordenador_regional">Coordenador Regional</option>
                    </select>
                    <FiBriefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Permissões
                    <span className="text-xs text-gray-500 ml-1">(separadas por vírgula)</span>
                  </label>
                  <input
                    type="text"
                    {...register('permissoes')}
                    placeholder="Ex: criar_usuario, editar_paciente"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-200"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-5">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center border-b pb-2">
                <FiBriefcase className="mr-2 text-purple-600" />
                Associação Institucional
              </h2>
              
              {/* Campo de Hospital - Visível para gestores hospitalares e profissionais de saúde */}
              {(selectedRole === GESTOR_TYPES.HOSPITALAR || 
                selectedRole === 'medico' || 
                selectedRole === 'enfermeiro' || 
                selectedRole === 'tecnico') && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                    <FiHome className="mr-2 text-blue-500" />
                    Hospital
                  </label>
                  {isAdmin ? (
                    <select
                      {...register('id_hospital')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-200"
                    >
                      <option value="">Selecione um hospital</option>
                      {hospitais.map(h => (
                        <option key={h.id_hospital} value={h.id_hospital}>{h.nome}</option>
                      ))}
                    </select>
                  ) : (
                    renderReadOnlyField(
                      hospitais.find(h => h.id_hospital == currentUser?.id_hospital)?.nome || 'Não atribuído',
                      'Hospital',
                      <FiHome className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    )
                  )}
                </div>
              )}

              {/* Campo de Gabinete - Visível para gestores de gabinete e coordenadores */}
              {(selectedRole === GESTOR_TYPES.GABINETE || 
                selectedRole === 'coordenador_regional') && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                    <FiArchive className="mr-2 text-indigo-500" />
                    Gabinete
                  </label>
                  {isAdmin ? (
                    <select
                      {...register('id_gabinete')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-200"
                    >
                      <option value="">Selecione um gabinete</option>
                      {gabinetes.map(g => (
                        <option key={g.id_gabinete} value={g.id_gabinete}>{g.nome}</option>
                      ))}
                    </select>
                  ) : (
                    renderReadOnlyField(
                      gabinetes.find(g => g.id_gabinete == currentUser?.id_gabinete)?.nome || 'Não atribuído',
                      'Gabinete',
                      <FiArchive className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    )
                  )}
                </div>
              )}

              {/* Mensagem quando nenhum campo é necessário */}
              {!(
                selectedRole === GESTOR_TYPES.HOSPITALAR || 
                selectedRole === GESTOR_TYPES.GABINETE || 
                selectedRole === 'medico' || 
                selectedRole === 'enfermeiro' || 
                selectedRole === 'tecnico' || 
                selectedRole === 'coordenador_regional'
              ) && (
                <div className="text-center py-4 text-gray-500">
                  Nenhuma associação institucional necessária para este cargo
                </div>
              )}
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
                disabled={saving}
                className={`px-4 py-2 text-white rounded-lg transition min-w-32 flex items-center justify-center ${
                  saving 
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
                    Criando...
                  </span>
                ) : (
                  <span className="flex items-center">
                    <FiSave className="mr-2" /> Criar Usuário
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