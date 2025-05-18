import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useEffect, useState } from 'react';
import { FiAlertTriangle, FiMapPin } from 'react-icons/fi';

// Fix para ícones do Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png'
});

const MapController = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center]);
  return null;
};

export default function EpidemicMap() {
  const [cases] = useState([
    { lat: -8.8383, lng: 13.2344, type: 'confirmed', count: 45 },
    { lat: -8.815, lng: 13.245, type: 'suspected', count: 12 },
  ]);

  const getCaseColor = (type) => {
    return type === 'confirmed' ? 'bg-red-500' : 'bg-yellow-400';
  };

  return (
    <div className="p-6 h-[calc(100vh-160px)]">
      <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
        <h1 className="text-2xl font-bold text-slate-800 mb-4">Mapa Epidemiológico</h1>
        <div className="flex gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <span>Casos Confirmados</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
            <span>Casos Suspeitos</span>
          </div>
        </div>
      </div>

      <MapContainer
        center={[-8.8383, 13.2344]}
        zoom={13}
        className="h-full w-full rounded-xl shadow-sm"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />

        {cases.map((caseData, index) => (
          <Marker key={index} position={[caseData.lat, caseData.lng]}>
            <Popup>
              <div className="flex items-center gap-2">
                <div className={`${getCaseColor(caseData.type)} p-2 rounded-full`}>
                  <FiAlertTriangle className="text-white" />
                </div>
                <div>
                  <h3 className="font-bold">{caseData.count} Casos</h3>
                  <p className="text-sm text-gray-600">
                    {caseData.type === 'confirmed' ? 'Confirmados' : 'Suspeitos'}
                  </p>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}

        <MapController center={[-8.8383, 13.2344]} />
      </MapContainer>
    </div>
  );
}