import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';

export default function HospitalEditar() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [nome, setNome] = useState('');
  const [local, setLocal] = useState('');
  const [capacidade, setCapacidade] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchHospital = async () => {
      try {
        const { data } = await api.get(`/hospitais/${id}`);
        if (data.success) {
          setNome(data.data.nome);
          setLocal(data.data.local);
          setCapacidade(data.data.capacidade.toString());
        } else {
          alert(data.message || 'Erro ao carregar hospital');
          navigate('/hospital');
        }
      } catch (error) {
        console.error('Erro ao carregar hospital:', error);
        alert('Erro ao carregar hospital');
        navigate('/hospital');
      } finally {
        setLoading(false);
      }
    };

    fetchHospital();
  }, [id, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { data } = await api.put(`/hospitais/${id}`, {
        nome,
        local,
        capacidade: parseInt(capacidade, 10),
      });
      if (data.success) {
        alert('Hospital atualizado com sucesso!');
        navigate('/hospital');
      } else {
        alert(data.message || 'Erro ao atualizar hospital');
      }
    } catch (error) {
      console.error('Erro ao atualizar hospital:', error);
      alert('Erro ao atualizar hospital');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <p className="animate-pulse text-slate-500">Carregando hospital...</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-lg mx-auto bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4 text-slate-700">Editar Hospital</h1>
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
            {saving ? 'Salvando...' : 'Salvar Alterações'}
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

