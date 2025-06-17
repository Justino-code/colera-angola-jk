import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../../services/api';

export default function MunicipioEditar() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [nome, setNome] = useState('');
  const [provinciaId, setProvinciaId] = useState('');
  const [provincias, setProvincias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [provRes, munRes] = await Promise.all([
          api.get('/provincias'),
          api.get(`/municipios/${id}`)
        ]);

        setProvincias(provRes.data);
        setNome(munRes.data.nome);
        setProvinciaId(munRes.data.id_provincia);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
        toast.error('Erro ao carregar dados');
        navigate('/municipio');
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
      await api.put(`/municipios/${id}`, { nome, provincia_id: provinciaId });
      toast.success('Município atualizado com sucesso!');
      navigate('/municipio');
    } catch (error) {
      console.error('Erro ao atualizar município:', error);
      toast.error('Erro ao atualizar município');
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
    <div className="p-6 max-w-lg mx-auto bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4 text-slate-700">Editar Município</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-slate-600 mb-1">Nome</label>
          <input
            type="text"
            className="w-full border rounded px-3 py-2"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-slate-600 mb-1">Província</label>
          <select
            className="w-full border rounded px-3 py-2"
            value={provinciaId}
            onChange={(e) => setProvinciaId(e.target.value)}
            required
          >
            <option value="">Selecione</option>
            {provincias.map((prov) => (
              <option key={prov.id_provincia} value={prov.id_provincia}>
                {prov.nome}
              </option>
            ))}
          </select>
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
            onClick={() => navigate('/municipio')}
            className="bg-slate-300 text-slate-700 px-4 py-2 rounded hover:bg-slate-400 transition"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}

