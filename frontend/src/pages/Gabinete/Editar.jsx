import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../../services/api';

export default function GabineteEditar() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [nome, setNome] = useState('');
  const [id_responsavel, setResponsavel] = useState('');
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [gabRes, usersRes] = await Promise.all([
          api.get(`/gabinetes/${id}`),
          api.get('/usuario') // ajuste conforme seu endpoint
        ]);

        if (gabRes.success) {
          const g = gabRes.data;
          setNome(g.nome || '');
          setResponsavel(g.id_responsavel?.id_usuario || '');
        } else {
          toast.error(gabRes.message || 'Gabinete não encontrado');
          navigate('/gabinete');
        }

        setUsuarios(usersRes.success ? usersRes.data : []);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
        toast.error('Erro ao carregar dados');
        navigate('/gabinete');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { nome, id_responsavel };
      const res = await api.put(`/gabinetes/${id}`, payload);
      if (res.success) {
        toast.success('Gabinete atualizado com sucesso!');
        console.log(res);
        navigate('/gabinete');
      } else {
        toast.error(res.message || 'Erro ao atualizar gabinete');
      }
    } catch (error) {
      console.error('Erro ao atualizar gabinete:', error);
      toast.error('Erro ao atualizar gabinete');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="h-full w-full flex flex-col min-h-0 bg-white p-6 rounded shadow">
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
    <div className="h-full w-full flex flex-col min-h-0 bg-white p-6 rounded shadow">
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
          <select
            value={id_responsavel}
            onChange={(e) => setResponsavel(e.target.value)}
            className="w-full border rounded p-2 focus:outline-none focus:ring focus:border-cyan-400"
          >
            <option value="">Selecione um usuário</option>
            {usuarios.map((u) => (
              <option key={u.id_usuario} value={u.id_usuario}>
                {u.nome} ({u.email})
              </option>
            ))}
          </select>
        </div>

        <div className="flex space-x-2">
          <button
            type="submit"
            disabled={saving}
            className="bg-cyan-600 text-white py-2 px-4 rounded hover:bg-cyan-700 transition disabled:opacity-50"
          >
            {saving ? 'Salvando...' : 'Salvar Alterações'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/gabinete')}
            className="bg-slate-300 text-slate-700 py-2 px-4 rounded hover:bg-slate-400 transition"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
