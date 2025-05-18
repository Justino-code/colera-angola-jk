import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Configurar ícones
L.Icon.Default.mergeOptions({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png'
});

export default function HealthMap({ hospitals }) {
  return (
    <MapContainer
      center={[-8.8383, 13.2344]}
      zoom={12}
      className="h-[500px] w-full rounded-lg shadow-lg"
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; OpenStreetMap'
      />
      
      {hospitals.map((hospital) => (
        <Marker
          key={hospital.id}
          position={[hospital.latitude, hospital.longitude]}
        >
          <Popup>
            <div className="p-2">
              <h3 className="font-bold">{hospital.nome}</h3>
              <p>Tipo: {hospital.tipo}</p>
              <p>Leitos: {hospital.capacidade_leitos}</p>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
