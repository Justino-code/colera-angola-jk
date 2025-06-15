import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../services/api';
import Skeleton from '../../components/common/Skeleton';

export default function EditarUsuario() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ nome: '', email: '', cargo: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchUsuario = async () => {
      try {
        const response = await api.get(`/usuario/${id}`);
        setForm(response);
      } catch (error) {
        console.error('Erro ao carregar usuário:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsuario();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put(`/usuario/${id}`, form);
      navigate('/usuarios');
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Skeleton />;

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Editar Usuário</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {['nome', 'email', 'role'].map((field) => (
          <div key={field}>
            <label className="block mb-1 capitalize">{field}</label>
            <input
              type="text"
              className="w-full border rounded p-2"
              value={form[field]}
              onChange={(e) => setForm({ ...form, [field]: e.target.value })}
              required
            />
          </div>
        ))}
        <button type="submit" disabled={saving}
                className="bg-amber-600 text-white px-4 py-2 rounded">
          {saving ? 'Salvando...' : 'Salvar Alterações'}
        </button>
      </form>
    </div>
  );
}
