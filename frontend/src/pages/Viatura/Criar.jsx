import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

export default function ViaturaCriar() {
  const [form, setForm] = useState({
    matricula: '',
    modelo: '',
    capacidade: ''
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/viaturas', form);
      alert('Viatura criada com sucesso!');
      navigate('/viatura');
    } catch (error) {
      console.error('Erro ao criar viatura:', error);
      alert('Erro ao criar viatura');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-white p-6 rounded shadow">
      <h1 className="text-2xl font-bold mb-4 text-slate-700">Nova Viatura</h1>
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
          disabled={loading}
          className={`w-full bg-cyan-600 text-white py-2 rounded hover:bg-cyan-700 transition ${loading ? 'opacity-50' : ''}`}
        >
          {loading ? 'Salvando...' : 'Salvar'}
        </button>
      </form>
    </div>
  );
}
