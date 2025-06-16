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
    nome: z.string().min(2, 'Nome muito curto'),
    email: z.string().email('Email inválido'),
    role: z.string().min(1, 'Cargo obrigatório'),
    permissoes: z.string(),
    id_hospital: z.string().optional().nullable(),
    id_gabinete: z.string().optional().nullable()
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
    formState: { errors }
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      nome: '',
      email: '',
      role: '',
      permissoes: '',
      id_hospital: '',
      id_gabinete: ''
    }
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userRes, hospRes, gabRes] = await Promise.all([
          api.get(`/usuario/${id}`),
          api.get('/hospital'),
          api.get('/gabinete')
        ]);
        if (userRes.data.success) {
          const u = userRes.data.data;
          reset({
            nome: u.nome,
            email: u.email,
            role: u.role,
            permissoes: u.permissoes.join(', '),
            id_hospital: u.id_hospital || '',
            id_gabinete: u.id_gabinete || ''
          });
        } else {
          toast.error('Usuário não encontrado');
          navigate('/usuarios');
        }

        setHospitais(hospRes.data.success ? hospRes.data.data : []);
        setGabinetes(gabRes.data.success ? gabRes.data.data : []);
      } catch (err) {
        toast.error('Erro ao carregar dados');
        console.error(err);
        navigate('/usuarios');
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
        nome: data.nome,
        email: data.email,
        role: data.role,
        permissoes: data.permissoes.split(',').map(p => p.trim()),
        id_hospital: data.id_hospital || null,
        id_gabinete: data.id_gabinete || null
      };

      const res = await api.put(`/usuario/${id}`, payload);
      if (res.data.success) {
        toast.success('Usuário atualizado com sucesso!');
        navigate('/usuarios');
      } else {
        toast.error(res.data.message || 'Falha ao atualizar usuário');
      }
    } catch (err) {
      toast.error('Erro ao atualizar usuário');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Skeleton />;

  return (
    <div className="max-w-xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold text-slate-700">Editar Usuário</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-4 rounded shadow space-y-4">

        <div>
          <label className="block font-medium">Nome</label>
          <input {...register('nome')} className="w-full p-2 border rounded" />
          {errors.nome && <p className="text-red-500 text-sm">{errors.nome.message}</p>}
        </div>

        <div>
          <label className="block font-medium">Email</label>
          <input {...register('email')} className="w-full p-2 border rounded" />
          {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
        </div>

        <div>
          <label className="block font-medium">Cargo</label>
          <input {...register('role')} className="w-full p-2 border rounded" />
          {errors.role && <p className="text-red-500 text-sm">{errors.role.message}</p>}
        </div>

        <div>
          <label className="block font-medium">Permissões</label>
          <input {...register('permissoes')} className="w-full p-2 border rounded" />
        </div>

        <div>
          <label className="block font-medium">Hospital</label>
          <select {...register('id_hospital')} className="w-full p-2 border rounded">
            <option value="">Selecione um hospital</option>
            {hospitais.map(h => (
              <option key={h.id_hospital} value={h.id_hospital}>{h.nome}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-medium">Gabinete</label>
          <select {...register('id_gabinete')} className="w-full p-2 border rounded">
            <option value="">Selecione um gabinete</option>
            {gabinetes.map(g => (
              <option key={g.id_gabinete} value={g.id_gabinete}>{g.nome}</option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="bg-amber-600 text-white px-4 py-2 rounded hover:bg-amber-700 transition disabled:opacity-50"
        >
          {saving ? 'Salvando...' : 'Salvar Alterações'}
        </button>
      </form>
    </div>
  );
}
