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
  const [nome, setNome] = useState('');
  const [tipo, setTipo] = useState('');
  const [endereco, setEndereco] = useState('');
  const [capacidade, setCapacidade] = useState('');
  const [idMunicipio, setIdMunicipio] = useState('');
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
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

  const handleMapClick = async (e) => {
    const lat = e.latlng.lat;
    const lng = e.latlng.lng;
    setLatitude(lat);
    setLongitude(lng);

    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`, {
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'meu-app-teste'
        }
      });
      const data = await res.json();

      if (data && data.display_name) {
        setNome(data.display_name);
        toast.success(`Local detectado: ${data.display_name}`);
      } else {
        toast.info('Localização marcada no mapa (nome não identificado)');
      }
    } catch (error) {
      console.error(error);
      toast.error('Erro ao identificar o nome do local');
    }
  };

  const buscarCoordenadas = async () => {
    if (!nome || !endereco) {
      toast.error('Preencha o nome e o endereço para buscar localização');
      return;
    }

    try {
      const query = encodeURIComponent(`${nome} ${endereco}`);
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
        setLatitude(lat);
        setLongitude(lon);
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

    if (!latitude || !longitude) {
      toast.warn('Selecione ou busque a localização no mapa');
      setSaving(false);
      return;
    }

    try {
      const payload = {
        nome,
        tipo,
        endereco,
        capacidade_leitos: parseInt(capacidade, 10),
        latitude,
        longitude,
        id_municipio: parseInt(idMunicipio, 10)
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
    <div className="h-full w-full flex flex-col min-h-0 bg-white p-6 rounded shadow">
      <h1 className="text-2xl font-bold text-slate-700">Novo Hospital</h1>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="block text-slate-600">Nome</label>
          <input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-slate-600">Tipo</label>
          <select
            value={tipo}
            onChange={(e) => setTipo(e.target.value)}
            required
            className="w-full border rounded px-3 py-2"
          >
            <option value="">Selecione o tipo</option>
            {tipos.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-slate-600">Endereço</label>
          <input
            type="text"
            value={endereco}
            onChange={(e) => setEndereco(e.target.value)}
            required
            className="w-full border rounded px-3 py-2"
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
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-slate-600">Município</label>
          <select
            value={idMunicipio}
            onChange={(e) => setIdMunicipio(e.target.value)}
            required
            className="w-full border rounded px-3 py-2"
          >
            <option value="">Selecione o município</option>
            {municipios.map((m) => (
              <option key={m.id_municipio} value={m.id_municipio}>
                {m.nome}
              </option>
            ))}
          </select>
        </div>

        <button
          type="button"
          onClick={buscarCoordenadas}
          className="bg-amber-500 text-white px-4 py-2 rounded hover:bg-amber-600"
        >
          Buscar Localização
        </button>

        <MapContainer
          center={[-11.2027, 17.8739]}
          zoom={6}
          style={{ height: '300px', width: '100%' }}
          whenCreated={(mapInstance) => {
            mapRef.current = mapInstance;
          }}
          onclick={handleMapClick}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {latitude && longitude && (
            <>
              <Marker position={[latitude, longitude]} />
              <FlyToLocation position={[latitude, longitude]} />
            </>
          )}
        </MapContainer>

        <div className="flex space-x-2">
          <button
            type="submit"
            disabled={saving}
            className="bg-cyan-600 text-white px-4 py-2 rounded hover:bg-cyan-700 disabled:opacity-50"
          >
            {saving ? 'Salvando...' : 'Salvar'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/hospital')}
            className="bg-slate-300 text-slate-700 px-4 py-2 rounded hover:bg-slate-400"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
