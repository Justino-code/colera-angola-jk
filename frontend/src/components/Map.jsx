import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

// Fix para ícones do Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: icon,
  shadowUrl: iconShadow,
});

export default function Map({ hospitals }) {
  return (
    <MapContainer
      center={[-8.8383, 13.2344]} // Coordenadas de Luanda
      zoom={12}
      className="h-96 w-full"
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      />

      {hospitals?.map((hospital) => (
        <Marker key={hospital.id} position={[hospital.latitude, hospital.longitude]}>
          <Popup>
            <h3 className="font-bold">{hospital.nome}</h3>
            <p>{hospital.tipo}</p>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
