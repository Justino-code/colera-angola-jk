import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import api from '../../services/api';
import Skeleton from '../../components/common/Skeleton';
import { toast } from 'react-hot-toast';

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

export default function CriarUsuario() {
  const navigate = useNavigate();
  const [hospitais, setHospitais] = useState([]);
  const [gabinetes, setGabinetes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
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

  useEffect(() => {
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
  }, []);

  const onSubmit = async (data) => {
    setSaving(true);
    try {
      const payload = {
        nome: data.nome.trim(),
        email: data.email.trim(),
        password: data.password,
        password_confirmation: data.password_confirmation,
        role: data.role,
        permissoes: data.permissoes.split(',').map(p => p.trim()).filter(p => p),
        id_hospital: data.id_hospital || null,
        id_gabinete: data.id_gabinete || null
      };

      const res = await api.post('/usuario', payload);
      console.log(res);
      

      if (res.success) {
        toast.success('Usuário criado com sucesso!');
        reset();
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
        <Skeleton />
      </div>
    );
  }

  return (
    <div className="min-h-full w-full bg-gray-50 p-4 md:p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-4 md:p-6 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-gray-800">Criar Novo Usuário</h1>
              <p className="text-sm text-gray-500 mt-1">Preencha os campos abaixo para registrar um novo usuário</p>
            </div>
            <button
              onClick={() => navigate("/usuario")}
              className="text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded transition flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Voltar
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-4 md:p-6">
          <div className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome Completo *
                  {errors.nome && (
                    <span className="ml-2 text-red-600 text-xs">{errors.nome.message}</span>
                  )}
                </label>
                <input
                  type="text"
                  {...register('nome')}
                  placeholder="Ex: João da Silva"
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                    errors.nome ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-amber-200'
                  }`}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                  {errors.email && (
                    <span className="ml-2 text-red-600 text-xs">{errors.email.message}</span>
                  )}
                </label>
                <input
                  type="email"
                  {...register('email')}
                  placeholder="Ex: joao.silva@exemplo.com"
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                    errors.email ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-amber-200'
                  }`}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Senha *
                  {errors.password && (
                    <span className="ml-2 text-red-600 text-xs">{errors.password.message}</span>
                  )}
                </label>
                <input
                  type="password"
                  {...register('password')}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                    errors.password ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-amber-200'
                  }`}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirmar Senha *
                  {errors.password_confirmation && (
                    <span className="ml-2 text-red-600 text-xs">{errors.password_confirmation.message}</span>
                  )}
                </label>
                <input
                  type="password"
                  {...register('password_confirmation')}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                    errors.password_confirmation ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-amber-200'
                  }`}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cargo *
                {errors.role && (
                  <span className="ml-2 text-red-600 text-xs">{errors.role.message}</span>
                )}
              </label>
              <select
                {...register('role')}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                  errors.role ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-amber-200'
                }`}
              >
                <option value="">Selecione um cargo</option>
                <option value="admin">Administrador</option>
                <option value="gestor">Gestor</option>
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
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Permissões
                <span className="text-xs text-gray-500 ml-1">(separadas por vírgula)</span>
              </label>
              <input
                type="text"
                {...register('permissoes')}
                placeholder="Ex: criar_usuario, editar_paciente, visualizar_relatorios"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-200"
              />
            </div>

            {(selectedRole === 'medico' || selectedRole === 'enfermeiro' || selectedRole === 'tecnico') && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Hospital
                </label>
                <select
                  {...register('id_hospital')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-200"
                >
                  <option value="">Selecione um hospital</option>
                  {hospitais.map((h) => (
                    <option key={h.id_hospital} value={h.id_hospital}>
                      {h.nome}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {(selectedRole === 'gestor' || selectedRole === 'coordenador_regional') && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Gabinete
                </label>
                <select
                  {...register('id_gabinete')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-200"
                >
                  <option value="">Selecione um gabinete</option>
                  {gabinetes.map((g) => (
                    <option key={g.id_gabinete} value={g.id_gabinete}>
                      {g.nome}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="flex justify-end pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={() => navigate('/usuario')}
                className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition mr-3"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-4 py-2 text-white bg-amber-600 hover:bg-amber-700 rounded-md transition disabled:opacity-70 disabled:cursor-not-allowed min-w-32 flex justify-center"
              >
                {saving ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Criando...
                  </span>
                ) : 'Criar Usuário'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}