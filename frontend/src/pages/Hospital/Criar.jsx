import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import toast from 'react-hot-toast';

function FlyToLocation({ position }) {
  const map = useMap();
  if (position) {
    map.flyTo(position, 16);
  }
  return null;
}

export default function HospitalCriar() {
  const [formData, setFormData] = useState({
    nome: '',
    tipo: '',
    endereco: '',
    capacidade: '',
    idMunicipio: '',
    latitude: null,
    longitude: null
  });
  const [municipios, setMunicipios] = useState([]);
  const [saving, setSaving] = useState(false);

  const navigate = useNavigate();
  const mapRef = useRef();

  const tipos = [
    'Geral',
    'Municipal',
    'Centro de Saúde',
    'Posto Médico',
    'Clínica',
    'Outros'
  ];

  useEffect(() => {
    async function carregarMunicipios() {
      try {
        const { data } = await api.get('/municipios');
        setMunicipios(data); 
      } catch (err) {
        console.error(err);
        toast.error('Erro ao carregar municípios');
      }
    }
    carregarMunicipios();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleMapClick = async (e) => {
    const lat = e.latlng.lat;
    const lng = e.latlng.lng;
    setFormData(prev => ({ ...prev, latitude: lat, longitude: lng }));

    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`, {
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'meu-app-teste'
        }
      });
      const data = await res.json();

      if (data?.display_name) {
        setFormData(prev => ({
          ...prev,
          nome: data.display_name,
          endereco: data.address?.road || '',
          latitude: lat,
          longitude: lng
        }));
        toast.success(`Local detectado: ${data.display_name}`);
      } else {
        toast.info('Localização marcada no mapa');
      }
    } catch (error) {
      console.error(error);
      toast.error('Erro ao identificar o local');
    }
  };

  const buscarCoordenadas = async () => {
    if (!formData.nome || !formData.endereco) {
      toast.error('Preencha o nome e o endereço para buscar localização');
      return;
    }

    try {
      const query = encodeURIComponent(`${formData.nome} ${formData.endereco}`);
      const url = `https://nominatim.openstreetmap.org/search?format=json&q=${query}`;
      const response = await fetch(url, {
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'meu-app-teste'
        }
      });

      if (!response.ok) throw new Error(`Erro HTTP: ${response.status}`);

      const data = await response.json();

      if (data.length > 0) {
        const lat = parseFloat(data[0].lat);
        const lon = parseFloat(data[0].lon);
        setFormData(prev => ({ ...prev, latitude: lat, longitude: lon }));
        toast.success('Localização encontrada');
      } else {
        toast.error('Localização não encontrada');
      }
    } catch (err) {
      console.error(err);
      toast.error('Erro ao buscar localização');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    if (!formData.latitude || !formData.longitude) {
      toast.warn('Selecione ou busque a localização no mapa');
      setSaving(false);
      return;
    }

    try {
      const payload = {
        nome: formData.nome,
        tipo: formData.tipo,
        endereco: formData.endereco,
        capacidade_leitos: parseInt(formData.capacidade, 10),
        latitude: formData.latitude,
        longitude: formData.longitude,
        id_municipio: parseInt(formData.idMunicipio, 10)
      };

      const res = await api.post('/hospitais', payload);

      if (res.success) {
        toast.success('Hospital criado com sucesso!');
        navigate('/hospital');
      } else {
        toast.error(res.message || 'Erro ao criar hospital');
      }
    } catch (err) {
      console.error(err);
      toast.error('Erro ao criar hospital');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="h-full w-full flex flex-col min-h-0 bg-white p-4 md:p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl md:text-2xl font-bold text-gray-800">Novo Hospital</h1>
        <button
          onClick={() => navigate('/hospital')}
          className="text-sm bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-1 rounded transition"
        >
          Voltar
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Nome *</label>
            <input
              type="text"
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Tipo *</label>
            <select
              name="tipo"
              value={formData.tipo}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Selecione o tipo</option>
              {tipos.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Endereço *</label>
            <input
              type="text"
              name="endereco"
              value={formData.endereco}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Capacidade de Leitos *</label>
            <input
              type="number"
              name="capacidade"
              value={formData.capacidade}
              onChange={handleChange}
              required
              min="0"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Município *</label>
            <select
              name="idMunicipio"
              value={formData.idMunicipio}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Selecione o município</option>
              {municipios.map((m) => (
                <option key={m.id_municipio} value={m.id_municipio}>
                  {m.nome}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-2">
            <button
              type="button"
              onClick={buscarCoordenadas}
              className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-md transition flex-1"
            >
              Buscar Localização
            </button>
            {formData.latitude && formData.longitude && (
              <div className="bg-green-100 text-green-800 px-3 py-2 rounded-md text-sm">
                Localização definida: {formData.latitude.toFixed(4)}, {formData.longitude.toFixed(4)}
              </div>
            )}
          </div>

          <div className="border rounded-md overflow-hidden">
            <MapContainer
              center={[-11.2027, 17.8739]}
              zoom={6}
              style={{ height: '300px', width: '100%' }}
              whenCreated={(mapInstance) => {
                mapRef.current = mapInstance;
              }}
              onclick={handleMapClick}
            >
              <TileLayer 
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" 
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              {formData.latitude && formData.longitude && (
                <>
                  <Marker position={[formData.latitude, formData.longitude]} />
                  <FlyToLocation position={[formData.latitude, formData.longitude]} />
                </>
              )}
            </MapContainer>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={() => navigate('/hospital')}
            className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={saving}
            className="px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-md transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Salvando...
              </span>
            ) : 'Salvar Hospital'}
          </button>
        </div>
      </form>
    </div>
  );
}