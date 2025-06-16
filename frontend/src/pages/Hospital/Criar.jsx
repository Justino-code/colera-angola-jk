import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

export default function HospitalCriar() {
  const [nome, setNome] = useState('');
  const [local, setLocal] = useState('');
  const [capacidade, setCapacidade] = useState('');
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const payload = {
        nome,
        local,
        capacidade: parseInt(capacidade, 10),
      };

      const { data } = await api.post('/hospitais', payload);

      if (data.success) {
        alert('Hospital criado com sucesso!');
        navigate('/hospital');
      } else {
        alert(data.message || 'Erro ao criar hospital');
      }
    } catch (error) {
      console.error('Erro ao criar hospital:', error);
      alert('Erro ao criar hospital');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-white p-6 rounded shadow">
      <h1 className="text-2xl font-bold mb-4 text-slate-700">Novo Hospital</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-slate-600 mb-1">Nome</label>
          <input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-cyan-400"
          />
        </div>

        <div>
          <label className="block text-slate-600 mb-1">Local</label>
          <input
            type="text"
            value={local}
            onChange={(e) => setLocal(e.target.value)}
            required
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-cyan-400"
          />
        </div>

        <div>
          <label className="block text-slate-600 mb-1">Capacidade</label>
          <input
            type="number"
            value={capacidade}
            onChange={(e) => setCapacidade(e.target.value)}
            required
            min="0"
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-cyan-400"
          />
        </div>

        <div className="flex space-x-2">
          <button
            type="submit"
            disabled={saving}
            className="bg-cyan-600 text-white px-4 py-2 rounded hover:bg-cyan-700 transition disabled:opacity-50"
          >
            {saving ? 'Salvando...' : 'Salvar'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/hospital')}
            className="bg-slate-300 text-slate-700 px-4 py-2 rounded hover:bg-slate-400 transition"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}

