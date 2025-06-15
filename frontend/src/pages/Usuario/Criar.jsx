import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import api from '../../services/api';
import Skeleton from '../../components/common/Skeleton';

const schema = z.object({
  nome: z.string().min(2, 'Nome muito curto'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
  password_confirmation: z.string(),
  role: z.string().min(1, 'Role é obrigatório'),
  permissoes: z.string(),
  id_hospital: z.string().optional(),
  id_gabinete: z.string().optional()
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
        const [hospitaisRes, gabinetesRes] = await Promise.all([
          api.get('/hospital'),
          api.get('/gabinete')
        ]);
        setHospitais(hospitaisRes);
        setGabinetes(gabinetesRes);
      } catch (error) {
        console.error('Erro ao carregar hospitais/gabinetes:', error);
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
        ...data,
        permissoes: data.permissoes.split(',').map(p => p.trim())
      };
      await api.post('/usuario', payload);
      navigate('/usuarios');
    } catch (error) {
      console.error('Erro ao criar usuário:', error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Skeleton />;

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Criar Usuário</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

        <div>
          <label className="block mb-1">Nome</label>
          <input {...register('nome')} className="w-full border rounded p-2" />
          {errors.nome && <p className="text-red-500">{errors.nome.message}</p>}
        </div>

        <div>
          <label className="block mb-1">Email</label>
          <input {...register('email')} className="w-full border rounded p-2" />
          {errors.email && <p className="text-red-500">{errors.email.message}</p>}
        </div>

        <div>
          <label className="block mb-1">Senha</label>
          <input type="password" {...register('password')} className="w-full border rounded p-2" />
          {errors.password && <p className="text-red-500">{errors.password.message}</p>}
        </div>

        <div>
          <label className="block mb-1">Confirmação de senha</label>
          <input type="password" {...register('password_confirmation')} className="w-full border rounded p-2" />
          {errors.password_confirmation && <p className="text-red-500">{errors.password_confirmation.message}</p>}
        </div>

        <div>
          <label className="block mb-1">Cargo (Role)</label>
          <input {...register('role')} className="w-full border rounded p-2" />
          {errors.role && <p className="text-red-500">{errors.role.message}</p>}
        </div>

        <div>
          <label className="block mb-1">Permissões (separadas por vírgula)</label>
          <input {...register('permissoes')} className="w-full border rounded p-2" />
        </div>

        <div>
          <label className="block mb-1">Hospital</label>
          <select {...register('id_hospital')} className="w-full border rounded p-2">
            <option value="">Selecione um hospital</option>
            {hospitais.map(h => (
              <option key={h.id_hospital} value={h.id_hospital}>{h.nome}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1">Gabinete</label>
          <select {...register('id_gabinete')} className="w-full border rounded p-2">
            <option value="">Selecione um gabinete</option>
            {gabinetes.map(g => (
              <option key={g.id_gabinete} value={g.id_gabinete}>{g.nome}</option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="bg-amber-600 text-white px-4 py-2 rounded"
        >
          {saving ? 'Criando...' : 'Criar Usuário'}
        </button>
      </form>
    </div>
  );
}

