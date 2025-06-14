import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

export default function PacienteCriar() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    nome: '',
    idade: '',
    local: '',
    estado: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await api.post('/pacientes', form);
      navigate('/pacientes');
    } catch (err) {
      setError('Erro ao criar paciente. Verifique os dados e tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded shadow max-w-lg mx-auto">
      <h1 className="text-2xl font-bold text-slate-700 mb-4">Registrar Novo Paciente</h1>

      {error && <p className="text-red-500 mb-2">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-600">Nome</label>
          <input
            type="text"
            name="nome"
            value={form.nome}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-600">Idade</label>
          <input
            type="number"
            name="idade"
            value={form.idade}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-600">Local</label>
          <input
            type="text"
            name="local"
            value={form.local}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-600">Estado</label>
          <select
            name="estado"
            value={form.estado}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          >
            <option value="">Selecione</option>
            <option value="Estável">Estável</option>
            <option value="Grave">Grave</option>
            <option value="Crítico">Crítico</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full p-2 bg-cyan-600 text-white rounded hover:bg-cyan-700 transition"
        >
          {loading ? 'Salvando...' : 'Salvar Paciente'}
        </button>
      </form>
    </div>
  );
}
