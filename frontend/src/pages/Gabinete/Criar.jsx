import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

export default function GabineteCriar() {
  const [nome, setNome] = useState('');
  const [responsavel, setResponsavel] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/gabinetes', { nome, responsavel });
      alert('Gabinete criado com sucesso!');
      navigate('/gabinete');
    } catch (error) {
      console.error('Erro ao criar gabinete:', error);
      alert('Erro ao criar gabinete');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold text-slate-700 mb-4">Novo Gabinete</h1>
      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-4 rounded shadow">
        <div>
          <label className="block text-slate-600 mb-1">Nome do Gabinete</label>
          <input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
            className="w-full border rounded p-2 focus:outline-none focus:ring focus:border-cyan-400"
          />
        </div>
        <div>
          <label className="block text-slate-600 mb-1">Responsável</label>
          <input
            type="text"
            value={responsavel}
            onChange={(e) => setResponsavel(e.target.value)}
            required
            className="w-full border rounded p-2 focus:outline-none focus:ring focus:border-cyan-400"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="bg-cyan-600 text-white py-2 px-4 rounded hover:bg-cyan-700 transition disabled:opacity-50"
        >
          {loading ? 'Salvando...' : 'Salvar'}
        </button>
      </form>
    </div>
  );
}
