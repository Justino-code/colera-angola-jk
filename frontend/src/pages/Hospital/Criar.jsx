import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

function LocationSelector({ setLatitude, setLongitude }) {
  useMapEvents({
    click(e) {
      setLatitude(e.latlng.lat);
      setLongitude(e.latlng.lng);
    },
  });
  return null;
}

export default function HospitalCriar() {
  const [nome, setNome] = useState('');
  const [tipo, setTipo] = useState('');
  const [endereco, setEndereco] = useState('');
  const [capacidade, setCapacidade] = useState('');
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const mapRef = useRef();

  const buscarCoordenadas = async () => {
    if (!nome || !endereco) {
      alert('Informe o nome e o endereço do hospital');
      return;
    }

    try {
      const query = encodeURIComponent(`${nome} ${endereco}`);
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${query}`);
      const results = await response.json();

      if (results.length > 0) {
        const lat = parseFloat(results[0].lat);
        const lon = parseFloat(results[0].lon);
        setLatitude(lat);
        setLongitude(lon);

        // Faz o zoom e centraliza no ponto encontrado
        if (mapRef.current) {
          mapRef.current.setView([lat, lon], 16); // zoom mais próximo
        }
      } else {
        alert('Localização não encontrada');
      }
    } catch (error) {
      console.error('Erro ao buscar coordenadas:', error);
      alert('Erro ao buscar localização');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const payload = {
        nome,
        tipo,
        endereco,
        capacidade_leitos: parseInt(capacidade, 10),
        latitude,
        longitude,
        id_municipio: 1,
      };

      const { data } = await api.post('/hospitais', payload);

      if (data.success) {
        alert('Hospital criado com sucesso!');
        navigate('/hospital');
      } else {
        alert(data.message || 'Erro ao criar hospital');
      }
    } catch (error) {
      console.error('Erro ao criar hospital:', error);
      alert('Erro ao criar hospital');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-white p-6 rounded shadow space-y-4">
      <h1 className="text-2xl font-bold text-slate-700">Novo Hospital</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-slate-600 mb-1">Nome</label>
          <input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-slate-600 mb-1">Tipo</label>
          <input
            type="text"
            value={tipo}
            onChange={(e) => setTipo(e.target.value)}
            required
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-slate-600 mb-1">Endereço</label>
          <input
            type="text"
            value={endereco}
            onChange={(e) => setEndereco(e.target.value)}
            required
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-slate-600 mb-1">Capacidade (leitos)</label>
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
          <button
            type="button"
            onClick={buscarCoordenadas}
            className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
          >
            Buscar Localização pelo Nome e Endereço
          </button>
        </div>

        <div className="h-64">
          <MapContainer
            center={[-11.2027, 17.8739]}
            zoom={6}
            style={{ height: '100%', width: '100%' }}
            whenCreated={(mapInstance) => { mapRef.current = mapInstance; }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <LocationSelector setLatitude={setLatitude} setLongitude={setLongitude} />
            {latitude && longitude && <Marker position={[latitude, longitude]} />}
          </MapContainer>
        </div>

        <div>
          <p className="text-sm text-slate-500">
            Latitude: {latitude ?? 'N/A'}, Longitude: {longitude ?? 'N/A'}
          </p>
        </div>

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
