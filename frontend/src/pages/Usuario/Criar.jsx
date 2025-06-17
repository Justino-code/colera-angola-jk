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
        navigate('/usuarios');
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
    <div className="max-w-xl mx-auto space-y-4 p-4">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Criar Usuário</h1>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="rounded-lg shadow space-y-4 p-4 border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900"
      >
        {[
          { name: 'nome', label: 'Nome', type: 'text' },
          { name: 'email', label: 'Email', type: 'text' },
          { name: 'password', label: 'Senha', type: 'password' },
          { name: 'password_confirmation', label: 'Confirmação de Senha', type: 'password' },
          { name: 'permissoes', label: 'Permissões (separadas por vírgula)', type: 'text' }
        ].map((field) => (
          <div key={field.name}>
            <label className="block font-medium text-gray-700 dark:text-gray-300">{field.label}</label>
            <input
              type={field.type}
              {...register(field.name)}
              className="w-full p-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            />
            {errors[field.name] && (
              <p className="text-red-500 text-sm">{errors[field.name].message}</p>
            )}
          </div>
        ))}

        <div>
          <label className="block font-medium text-gray-700 dark:text-gray-300">Cargo</label>
          <select
            {...register('role')}
            className="w-full p-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
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
            <p className="text-red-500 text-sm">{errors.role.message}</p>
          )}
        </div>

        <div>
          <label className="block font-medium text-gray-700 dark:text-gray-300">Hospital</label>
          <select
            {...register('id_hospital')}
            className="w-full p-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          >
            <option value="">Selecione um hospital</option>
            {hospitais.map((h) => (
              <option key={h.id_hospital} value={h.id_hospital}>
                {h.nome}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-medium text-gray-700 dark:text-gray-300">Gabinete</label>
          <select
            {...register('id_gabinete')}
            className="w-full p-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          >
            <option value="">Selecione um gabinete</option>
            {gabinetes.map((g) => (
              <option key={g.id_gabinete} value={g.id_gabinete}>
                {g.nome}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded transition disabled:opacity-50"
        >
          {saving ? 'Criando...' : 'Criar Usuário'}
        </button>
      </form>
    </div>
  );
}
