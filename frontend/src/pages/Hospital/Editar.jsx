import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';

export default function HospitalEditar() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [hospital, setHospital] = useState({
    nome: '',
    local: '',
    capacidade: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchHospital = async () => {
      try {
        const response = await api.get(`/hospitais/${id}`);
        setHospital({
          nome: response.data.nome,
          local: response.data.local,
          capacidade: response.data.capacidade
        });
      } catch (error) {
        console.error('Erro ao carregar hospital:', error);
        alert('Erro ao carregar hospital');
      } finally {
        setLoading(false);
      }
    };

    fetchHospital();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setHospital((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put(`/hospitais/${id}`, {
        nome: hospital.nome,
        local: hospital.local,
        capacidade: parseInt(hospital.capacidade, 10)
      });
      navigate('/hospital');
    } catch (error) {
      console.error('Erro ao salvar hospital:', error);
      alert('Erro ao salvar hospital');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-2">
        <div className="animate-pulse h-6 bg-slate-200 rounded w-1/2"></div>
        <div className="animate-pulse h-4 bg-slate-200 rounded w-1/3"></div>
        <div className="animate-pulse h-4 bg-slate-200 rounded w-1/4"></div>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto bg-white p-6 rounded shadow">
      <h1 className="text-2xl font-bold mb-4 text-slate-700">Editar Hospital</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-slate-600 mb-1">Nome</label>
          <input
            type="text"
            name="nome"
            value={hospital.nome}
            onChange={handleChange}
            required
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-slate-600 mb-1">Local</label>
          <input
            type="text"
            name="local"
            value={hospital.local}
            onChange={handleChange}
            required
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-slate-600 mb-1">Capacidade</label>
          <input
            type="number"
            name="capacidade"
            value={hospital.capacidade}
            onChange={handleChange}
            required
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div className="flex space-x-2">
          <button
            type="submit"
            disabled={saving}
            className="bg-amber-600 text-white px-4 py-2 rounded hover:bg-amber-700 transition"
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
