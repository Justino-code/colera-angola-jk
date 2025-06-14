import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../services/api';

export default function ViaturaEditar() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    matricula: '',
    modelo: '',
    capacidade: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchViatura = async () => {
      try {
        const { data } = await api.get(`/viaturas/${id}`);
        setForm({
          matricula: data.matricula,
          modelo: data.modelo,
          capacidade: data.capacidade
        });
      } catch (error) {
        console.error('Erro ao buscar viatura:', error);
        alert('Erro ao carregar viatura');
      } finally {
        setLoading(false);
      }
    };

    fetchViatura();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put(`/viaturas/${id}`, form);
      alert('Viatura atualizada com sucesso!');
      navigate('/viatura');
    } catch (error) {
      console.error('Erro ao atualizar viatura:', error);
      alert('Erro ao atualizar viatura');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-lg mx-auto bg-white p-6 rounded shadow">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-slate-200 rounded w-1/3"></div>
          <div className="h-10 bg-slate-200 rounded"></div>
          <div className="h-6 bg-slate-200 rounded w-1/3"></div>
          <div className="h-10 bg-slate-200 rounded"></div>
          <div className="h-6 bg-slate-200 rounded w-1/3"></div>
          <div className="h-10 bg-slate-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto bg-white p-6 rounded shadow">
      <h1 className="text-2xl font-bold mb-4 text-slate-700">Editar Viatura</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 text-sm font-medium">Matrícula</label>
          <input
            type="text"
            name="matricula"
            value={form.matricula}
            onChange={handleChange}
            required
            className="w-full border rounded p-2"
          />
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium">Modelo</label>
          <input
            type="text"
            name="modelo"
            value={form.modelo}
            onChange={handleChange}
            required
            className="w-full border rounded p-2"
          />
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium">Capacidade</label>
          <input
            type="number"
            name="capacidade"
            value={form.capacidade}
            onChange={handleChange}
            required
            className="w-full border rounded p-2"
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className={`w-full bg-cyan-600 text-white py-2 rounded hover:bg-cyan-700 transition ${saving ? 'opacity-50' : ''}`}
        >
          {saving ? 'Salvando...' : 'Salvar Alterações'}
        </button>
      </form>
    </div>
  );
}
