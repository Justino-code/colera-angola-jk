import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import api from '../../services/api';
import Skeleton from '../../components/common/Skeleton';
import { toast } from 'react-hot-toast';

const schema = z.object({
  nome: z.string().min(2, 'Nome muito curto'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
  password_confirmation: z.string(),
  role: z.string().min(1, 'Cargo obrigatório'),
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
    formState: { errors }
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
        toast.error('Erro ao carregar hospitais/gabinetes');
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
        nome: data.nome,
        email: data.email,
        password: data.password,
        password_confirmation: data.password_confirmation,
        role: data.role,
        permissoes: data.permissoes.split(',').map(p => p.trim()),
        id_hospital: data.id_hospital || null,
        id_gabinete: data.id_gabinete || null
      };

      const res = await api.post('/usuario', payload);

      if (res.success) {
        toast.success('Usuário criado com sucesso!');
        navigate('/usuario');
      } else {
        toast.error(res.message || 'Falha ao criar usuário');
      }
    } catch (err) {
      toast.error('Erro ao criar usuário');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Skeleton />;

  return (
    <div className="h-full w-full flex flex-col bg-white p-0 sm:p-6 rounded shadow transition-colors">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 px-6 pt-6">
        <h1 className="text-2xl font-bold text-gray-800">Criar Usuário</h1>
        <button
          type="button"
          onClick={() => navigate("/usuario")}
          className="mt-4 sm:mt-0 bg-slate-200 text-slate-700 px-4 py-2 rounded hover:bg-slate-300 transition"
        >
          Voltar
        </button>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex-1 flex flex-col max-w-2xl mx-auto w-full rounded-lg shadow space-y-5 p-6 border border-gray-200 bg-white transition-colors"
      >
        {[
          { name: 'nome', label: 'Nome', type: 'text' },
          { name: 'email', label: 'Email', type: 'text' },
          { name: 'password', label: 'Senha', type: 'password' },
          { name: 'password_confirmation', label: 'Confirmação de Senha', type: 'password' },
          { name: 'permissoes', label: 'Permissões (separadas por vírgula)', type: 'text' }
        ].map((field) => (
          <div key={field.name}>
            <label className="block font-medium text-gray-700 mb-1">{field.label}</label>
            <input
              type={field.type}
              {...register(field.name)}
              className="w-full p-2 rounded border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-500 transition"
            />
            {errors[field.name] && (
              <p className="text-red-500 text-xs mt-1">{errors[field.name].message}</p>
            )}
          </div>
        ))}

        <div>
          <label className="block font-medium text-gray-700 mb-1">Cargo</label>
          <select
            {...register('role')}
            className="w-full p-2 rounded border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-500 transition"
          >
            <option value="">Selecione um cargo</option>
            <option value="admin">Admin</option>
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
          {errors.role && (
            <p className="text-red-500 text-xs mt-1">{errors.role.message}</p>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label className="block font-medium text-gray-700 mb-1">Hospital</label>
            <select
              {...register('id_hospital')}
              className="w-full p-2 rounded border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-500 transition"
            >
              <option value="">Selecione um hospital</option>
              {hospitais.map((h) => (
                <option key={h.id_hospital} value={h.id_hospital}>
                  {h.nome}
                </option>
              ))}
            </select>
          </div>
          <div className="flex-1">
            <label className="block font-medium text-gray-700 mb-1">Gabinete</label>
            <select
              {...register('id_gabinete')}
              className="w-full p-2 rounded border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-500 transition"
            >
              <option value="">Selecione um gabinete</option>
              {gabinetes.map((g) => (
                <option key={g.id_gabinete} value={g.id_gabinete}>
                  {g.nome}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-2 rounded font-semibold transition disabled:opacity-50"
        >
          {saving ? 'Criando...' : 'Criar Usuário'}
        </button>
      </form>
    </div>
  );
}
