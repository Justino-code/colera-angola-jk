import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import toast from 'react-hot-toast';

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
        const res = await api.get(`/hospitais/${id}`);
        if (res.data?.success) {
          const hosp = res.data.data;
          setNome(hosp.nome);
          setLocal(hosp.local || '');
          setCapacidade(hosp.capacidade?.toString() || '0');
        } else {
          toast.error(res.data?.message || 'Erro ao carregar hospital');
          navigate('/hospital');
        }
      } catch (error) {
        console.error('Erro ao carregar hospital:', error);
        toast.error('Erro ao carregar hospital');
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
      const res = await api.put(`/hospitais/${id}`, {
        nome,
        local,
        capacidade: parseInt(capacidade, 10)
      });
      if (res.data?.success) {
        toast.success('Hospital atualizado com sucesso!');
        navigate('/hospital');
      } else {
        toast.error(res.data?.message || 'Erro ao atualizar hospital');
      }
    } catch (error) {
      console.error('Erro ao atualizar hospital:', error);
      toast.error('Erro ao atualizar hospital');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 text-center">
        <p className="animate-pulse text-slate-500">Carregando hospital...</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-lg mx-auto bg-white rounded shadow space-y-4">
      <h1 className="text-2xl font-bold text-slate-700">Editar Hospital</h1>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="block text-slate-600">Nome</label>
          <input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-cyan-400"
          />
        </div>

        <div>
          <label className="block text-slate-600">Local</label>
          <input
            type="text"
            value={local}
            onChange={(e) => setLocal(e.target.value)}
            required
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-cyan-400"
          />
        </div>

        <div>
          <label className="block text-slate-600">Capacidade de Leitos</label>
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
