import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import toast from 'react-hot-toast';

export default function ViaturaCriar() {
  const [form, setForm] = useState({
    identificacao: '',
    tipo: '',
    status: 'disponivel',
    latitude: '',
    longitude: '',
    id_hospital: '',
  });
  const [hospitais, setHospitais] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingHospitais, setLoadingHospitais] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHospitais = async () => {
      try {
        const res = await api.get('/hospitais');
        if (res.success) {
          setHospitais(res.data);
        } else {
          toast.error(res.error || 'Erro ao carregar hospitais');
        }
      } catch {
        toast.error('Erro ao carregar hospitais');
      } finally {
        setLoadingHospitais(false);
      }
    };
    fetchHospitais();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const hospital = hospitais.find(h => h.id_hospital === Number(form.id_hospital));

      if (!hospital) {
        toast.error('Hospital não encontrado');
        setLoading(false);
        return;
      }

      const latitude = form.latitude !== '' ? parseFloat(form.latitude) : hospital.latitude;
      const longitude = form.longitude !== '' ? parseFloat(form.longitude) : hospital.longitude;

      const payload = {
        identificacao: form.identificacao,
        tipo: form.tipo,
        status: form.status,
        latitude,
        longitude,
        id_hospital: form.id_hospital,
      };

      const res = await api.post('/viaturas', payload);
      if (res.success) {
        toast.success('Viatura criada com sucesso!');
        navigate('/viatura');
      } else {
        toast.error(res.error || 'Erro ao criar viatura');
      }
    } catch (err) {
      toast.error('Erro ao conectar ao servidor');
    } finally {
      setLoading(false);
    }
  };

  if (loadingHospitais) {
    return <div className="p-6 text-center text-slate-500">Carregando hospitais...</div>;
  }

  return (
    <div className="p-6 max-w-lg mx-auto bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Nova Viatura</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Identificação *</label>
          <input
            type="text"
            name="identificacao"
            value={form.identificacao}
            onChange={handleChange}
            required
            maxLength="50"
            className="w-full border rounded p-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Tipo *</label>
          <input
            type="text"
            name="tipo"
            value={form.tipo}
            onChange={handleChange}
            required
            maxLength="50"
            className="w-full border rounded p-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Status *</label>
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            required
            className="w-full border rounded p-2"
          >
            <option value="disponivel">Disponível</option>
            <option value="em_viagem">Em Viagem</option>
            <option value="ocupada">Ocupada</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium">Latitude (opcional)</label>
          <input
            type="number"
            step="any"
            name="latitude"
            value={form.latitude}
            onChange={handleChange}
            className="w-full border rounded p-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Longitude (opcional)</label>
          <input
            type="number"
            step="any"
            name="longitude"
            value={form.longitude}
            onChange={handleChange}
            className="w-full border rounded p-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Hospital *</label>
          <select
            name="id_hospital"
            value={form.id_hospital}
            onChange={handleChange}
            required
            className="w-full border rounded p-2"
          >
            <option value="">Selecione</option>
            {hospitais.map(h => (
              <option key={h.id_hospital} value={h.id_hospital}>
                {h.nome}
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="bg-cyan-600 text-white py-2 px-4 rounded hover:bg-cyan-700 transition w-full"
        >
          {loading ? 'Salvando...' : 'Criar'}
        </button>
      </form>
    </div>
  );
}
