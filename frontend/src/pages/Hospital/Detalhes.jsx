import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

export default function HospitalDetalhes() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [hospital, setHospital] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Carrega usuário do localStorage
    const usuario = localStorage.getItem('usuario');
    setUser(usuario ? JSON.parse(usuario) : null);

    const fetchHospital = async () => {
      try {
        const res = await api.get(`/hospitais/${id}`);
        if (res.success) {
          setHospital(res.data);
        } else {
          toast.error(res.message || 'Erro ao carregar hospital');
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

  if (loading) {
    return (
      <div className="p-6 text-center">
        <p className="animate-pulse text-slate-500">Carregando hospital...</p>
      </div>
    );
  }

  if (!hospital) {
    return (
      <div className="p-6 text-center">
        <p className="text-slate-500">Hospital não encontrado.</p>
        <button
          onClick={() => navigate('/hospital')}
          className="mt-4 bg-slate-300 text-slate-700 py-2 px-4 rounded hover:bg-slate-400 transition"
        >
          Voltar
        </button>
      </div>
    );
  }

  const position = [
    parseFloat(hospital.latitude) || -11.2027,
    parseFloat(hospital.longitude) || 17.8739
  ];

  const markerIcon = new L.Icon({
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  });

  const podeEditar = user && (user.role === 'admin' || user.role === 'gestor');

  return (
    <div className="h-full w-full flex flex-col min-h-0 bg-white p-6 rounded shadow">
      <h1 className="text-2xl font-bold text-slate-700">Detalhes do Hospital</h1>
      <div className="space-y-2">
        <div><span className="font-semibold text-slate-600">Nome:</span> {hospital.nome}</div>
        <div><span className="font-semibold text-slate-600">Local:</span> {hospital.endereco}</div>
        <div><span className="font-semibold text-slate-600">Capacidade:</span> {hospital.capacidade_leitos} pacientes</div>
        <div><span className="font-semibold text-slate-600">Registrado em:</span> {hospital.created_at ? new Date(hospital.created_at).toLocaleString() : 'N/A'}</div>
        {hospital.updated_at && (
          <div><span className="font-semibold text-slate-600">Atualizado em:</span> {new Date(hospital.updated_at).toLocaleString()}</div>
        )}
      </div>

      {hospital.latitude && hospital.longitude && (
        <div className="h-64 rounded overflow-hidden">
          <MapContainer
            center={position}
            zoom={13}
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="&copy; OpenStreetMap contributors"
            />
            <Marker position={position} icon={markerIcon}>
              <Popup>{hospital.nome}</Popup>
            </Marker>
          </MapContainer>
        </div>
      )}

      <div className="flex space-x-2">
        {podeEditar && (
          <button
            onClick={() => navigate(`/hospital/${hospital.id_hospital}/editar`)}
            className="bg-cyan-600 text-white py-2 px-4 rounded hover:bg-cyan-700 transition"
          >
            Editar
          </button>
        )}
        <button
          onClick={() => navigate('/hospital')}
          className="bg-slate-300 text-slate-700 py-2 px-4 rounded hover:bg-slate-400 transition"
        >
          Voltar
        </button>
      </div>
    </div>
  );
}
