import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { toast } from 'react-hot-toast';
import Skeleton from '../../components/common/Skeleton';

export default function ViaturaCriar() {
  const [form, setForm] = useState({
    identificacao: '',
    tipo: 'ambulancia',
    status: 'disponivel',
    latitude: '',
    longitude: '',
    id_hospital: ''
  });
  const [hospitais, setHospitais] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchHospitais = async () => {
      try {
        const res = await api.get('/hospital');
        if (res.success) {
          setHospitais(res.data);
        } else {
          toast.error(res.message || 'Falha ao carregar hospitais');
        }
      } catch (error) {
        console.error('Erro na requisição:', error);
        toast.error('Erro na comunicação com o servidor');
      } finally {
        setLoading(false);
      }
    };
    fetchHospitais();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const getLocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setForm(prev => ({
            ...prev,
            latitude: position.coords.latitude.toFixed(7),
            longitude: position.coords.longitude.toFixed(7)
          }));
          toast.success('Localização obtida com sucesso');
        },
        (error) => {
          console.error('Erro ao obter localização:', error);
          toast.error('Não foi possível obter localização');
        }
      );
    } else {
      toast.error('Geolocalização não suportada no dispositivo');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await api.post('/viatura', form);
      if (res.success) {
        toast.success(res.message || 'Viatura criada com sucesso');
        navigate('/viatura');
      } else {
        toast.error(res.message || 'Erro ao criar viatura');
      }
    } catch (error) {
      console.error('Erro na requisição:', error);
      toast.error('Erro na comunicação com o servidor');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Skeleton />;

  return (
    <div className="max-w-lg mx-auto bg-white p-6 rounded shadow">
      <h1 className="text-2xl font-bold mb-4 text-slate-700">Nova Viatura</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 text-sm font-medium">Identificação</label>
          <input
            type="text"
            name="identificacao"
            value={form.identificacao}
            onChange={handleChange}
            required
            className="w-full border rounded p-2"
          />
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium">Tipo</label>
          <select
            name="tipo"
            value={form.tipo}
            onChange={handleChange}
            className="w-full border rounded p-2"
          >
            <option value="ambulancia">Ambulância</option>
            <option value="outros">Outros</option>
          </select>
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium">Status</label>
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="w-full border rounded p-2"
          >
            <option value="disponivel">Disponível</option>
            <option value="em_viagem">Em Viagem</option>
            <option value="ocupada">Ocupada</option>
          </select>
        </div>

        <div className="flex gap-2">
          <div className="w-1/2">
            <label className="block mb-1 text-sm font-medium">Latitude</label>
            <input
              type="number"
              name="latitude"
              value={form.latitude}
              readOnly
              className="w-full border rounded p-2"
            />
          </div>
          <div className="w-1/2">
            <label className="block mb-1 text-sm font-medium">Longitude</label>
            <input
              type="number"
              name="longitude"
              value={form.longitude}
              readOnly
              className="w-full border rounded p-2"
            />
          </div>
        </div>

        <button
          type="button"
          onClick={getLocation}
          className="w-full bg-emerald-600 text-white py-2 rounded hover:bg-emerald-700 transition"
        >
          Obter Localização
        </button>

        <div>
          <label className="block mb-1 text-sm font-medium">Hospital</label>
          <select
            name="id_hospital"
            value={form.id_hospital}
            onChange={handleChange}
            required
            className="w-full border rounded p-2"
          >
            <option value="">Selecione um hospital</option>
            {hospitais.map(h => (
              <option key={h.id_hospital} value={h.id_hospital}>
                {h.nome}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          disabled={saving}
          className={`w-full bg-cyan-600 text-white py-2 rounded hover:bg-cyan-700 transition ${saving ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {saving ? 'Salvando...' : 'Salvar'}
        </button>
      </form>
    </div>
  );
}

