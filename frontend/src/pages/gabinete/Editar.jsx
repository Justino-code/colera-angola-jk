import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';

export default function GabineteEditar() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [nome, setNome] = useState('');
  const [responsavel, setResponsavel] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchGabinete = async () => {
      try {
        const { data } = await api.get(`/gabinetes/${id}`);
        setNome(data.nome);
        setResponsavel(data.responsavel);
      } catch (error) {
        console.error('Erro ao carregar gabinete:', error);
        alert('Erro ao carregar gabinete');
        navigate('/gabinete');
      } finally {
        setLoading(false);
      }
    };

    fetchGabinete();
  }, [id, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put(`/gabinetes/${id}`, { nome, responsavel });
      alert('Gabinete atualizado com sucesso!');
      navigate('/gabinete');
    } catch (error) {
      console.error('Erro ao atualizar gabinete:', error);
      alert('Erro ao atualizar gabinete');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-pulse w-full max-w-lg space-y-4">
          <div className="h-6 bg-slate-200 rounded" />
          <div className="h-10 bg-slate-200 rounded" />
          <div className="h-6 bg-slate-200 rounded" />
          <div className="h-10 bg-slate-200 rounded" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold text-slate-700 mb-4">Editar Gabinete</h1>
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
          disabled={saving}
          className="bg-cyan-600 text-white py-2 px-4 rounded hover:bg-cyan-700 transition disabled:opacity-50"
        >
          {saving ? 'Salvando...' : 'Salvar Alterações'}
        </button>
      </form>
    </div>
  );
}
