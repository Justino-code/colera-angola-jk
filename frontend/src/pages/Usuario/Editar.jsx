import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import api from '../../services/api';
import Skeleton from '../../components/common/Skeleton';
import { toast } from 'react-hot-toast';

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

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors }
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
  }, [id, navigate, reset]);

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
              <h1 className="text-xl md:text-2xl font-bold text-gray-800">Editar Usuário</h1>
              <p className="text-sm text-gray-500 mt-1">Atualize os dados do usuário</p>
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
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                    errors.email ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-amber-200'
                  }`}
                />
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
                  placeholder="Ex: criar_usuario, editar_paciente"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-200"
                />
              </div>
            </div>

            {showHospitalField && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Hospital
                </label>
                <select
                  {...register('id_hospital')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-200"
                >
                  <option value="">Selecione um hospital</option>
                  {hospitais.map(h => (
                    <option key={h.id_hospital} value={h.id_hospital}>{h.nome}</option>
                  ))}
                </select>
              </div>
            )}

            {showGabineteField && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Gabinete
                </label>
                <select
                  {...register('id_gabinete')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-200"
                >
                  <option value="">Selecione um gabinete</option>
                  {gabinetes.map(g => (
                    <option key={g.id_gabinete} value={g.id_gabinete}>{g.nome}</option>
                  ))}
                </select>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nova Senha
                  {errors.senha && (
                    <span className="ml-2 text-red-600 text-xs">{errors.senha.message}</span>
                  )}
                </label>
                <input
                  type="password"
                  {...register('senha')}
                  placeholder="Deixe em branco para manter a atual"
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                    errors.senha ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-amber-200'
                  }`}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirmar Nova Senha
                  {errors.confirmarSenha && (
                    <span className="ml-2 text-red-600 text-xs">{errors.confirmarSenha.message}</span>
                  )}
                </label>
                <input
                  type="password"
                  {...register('confirmarSenha')}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                    errors.confirmarSenha ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-amber-200'
                  }`}
                />
              </div>
            </div>

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
                    Salvando...
                  </span>
                ) : 'Salvar Alterações'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}