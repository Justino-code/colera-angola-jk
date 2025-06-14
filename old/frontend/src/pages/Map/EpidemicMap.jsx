// src/pages/EpidemicDashboard.js
import { MapContainer, TileLayer, Marker, Popup, useMap, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useEffect, useState } from 'react';
import { FiAlertTriangle, FiMapPin, FiFilter, FiUsers } from 'react-icons/fi';

// Marcador para cidades principais
const cityMarker = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/2975/2975661.png ',
  shadowUrl: 'https://unpkg.com/leaflet @1.7.1/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

// Marcador personalizado para casos (usando SVG inline)
const createCustomMarker = (type) => {
  const color = type === 'confirmed' ? '#ef4444' : '#facc15';

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" fill="${color}" stroke="white" stroke-width="2"/>
      <circle cx="12" cy="12" r="4" fill="white"/>
    </svg>
  `;

  const encodedSvg = encodeURIComponent(svg).replace(/'/g, '%27').replace(/"/g, '%22');

  return new L.Icon({
    iconUrl: `data:image/svg+xml;charset=UTF-8,${encodedSvg}`,
    shadowUrl: 'https://unpkg.com/leaflet @1.7.1/dist/images/marker-shadow.png',
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -30]
  });
};

// Componente para ajustar o mapa automaticamente
const FitMapToBounds = ({ locations }) => {
  const map = useMap();

  useEffect(() => {
    if (locations.length > 0) {
      const bounds = L.latLngBounds(locations.map(([lat, lng]) => [lat, lng]));
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 8 });
    }
  }, [locations]);

  return null;
};

// Cidades principais de Angola
const majorCities = [
  { name: "Luanda", lat: -8.8383, lng: 13.2344 },
  { name: "Huambo", lat: -12.7933, lng: 15.7438 },
  { name: "Benguela", lat: -12.3333, lng: 13.4333 },
  { name: "Huíla", lat: -14.8986, lng: 13.2034 },
  { name: "Cabinda", lat: -5.5597, lng: 12.1994 }
];

// Regiões afetadas com polígonos (exemplo)
const affectedRegions = [
  {
    name: "Luanda",
    color: "#ef4444",
    polygon: [
      [[12.5, -9.0], [13.0, -9.0], [13.0, -8.5], [12.5, -8.5], [12.5, -9.0]]
    ]
  },
  {
    name: "Benguela",
    color: "#facc15",
    polygon: [
      [[12.8, -12.3], [13.0, -12.3], [13.0, -12.0], [12.8, -12.0], [12.8, -12.3]]
    ]
  }
];

// Função para extrair coordenadas do mapa
const getAllCoordinates = (cases, cities, regions) => {
  const coords = [...cases.map(c => [c.lat, c.lng])];
  cities.forEach(c => coords.push([c.lat, c.lng]));
  regions.forEach(r => {
    r.polygon[0].forEach(p => coords.push([p[1], p[0]]));
  });
  return coords;
};

// Legenda - Casos
const CaseLegend = () => (
  <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
    <h3 className="font-semibold text-gray-800 mb-2">Legenda</h3>
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 rounded-full bg-red-500"></div>
        <span className="text-sm">Casos Confirmados</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
        <span className="text-sm">Casos Suspeitos</span>
      </div>
    </div>
  </div>
);

// Legenda - Cidades
const CityLegend = () => (
  <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
    <h3 className="font-semibold text-gray-800 mb-2">Cidades Principais</h3>
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <img src="https://cdn-icons-png.flaticon.com/512/2975/2975661.png " alt="Cidade" className="w-4 h-4" />
        <span className="text-sm">Cidade</span>
      </div>
    </div>
  </div>
);

// Legenda - Regiões Afetadas
const RegionLegend = () => (
  <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
    <h3 className="font-semibold text-gray-800 mb-2">Regiões Afetadas</h3>
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
        <span className="text-sm">Área com Casos Confirmados</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
        <span className="text-sm">Área com Casos Suspeitos</span>
      </div>
    </div>
  </div>
);

export default function EpidemicDashboard() {
  const [cases, setCases] = useState([
    { lat: -8.8383, lng: 13.2344, type: 'confirmed', count: 45, region: 'Luanda' },
    { lat: -8.815, lng: 13.245, type: 'suspected', count: 12, region: 'Benguela' },
    { lat: -9.1332, lng: 13.2123, type: 'confirmed', count: 30, region: 'Huambo' },
  ]);

  const [filteredCases, setFilteredCases] = useState(cases);
  const [filterType, setFilterType] = useState('all');
  const [loading, setLoading] = useState(false);

  const getCaseColor = (type) => {
    return type === 'confirmed' ? 'bg-red-500' : 'bg-yellow-400';
  };

  // Atualiza os casos filtrados
  useEffect(() => {
    if (filterType === 'all') {
      setFilteredCases(cases);
    } else {
      setFilteredCases(cases.filter(c => c.type === filterType));
    }
  }, [filterType, cases]);

  // Simula carregamento de novos dados
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setCases(prev => [
        ...prev,
        { lat: -12.3333, lng: 13.4333, type: 'suspected', count: 8, region: 'Benguela' },
      ]);
      setLoading(false);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  // Ajusta o mapa ao redimensionar
  useEffect(() => {
    const handleResize = () => window.dispatchEvent(new Event('resize'));
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-3xl font-bold text-slate-900">Epidemia de Cólera</h1>
          <p className="mt-2 text-gray-600">Visualização geográfica dos casos confirmados e suspeitos em Angola.</p>
        </div>

        {/* Conteúdo Principal */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 p-6">
          {/* Informações laterais */}
          <div className="space-y-6">
            {/* Filtros */}
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <h2 className="font-semibold text-lg mb-3 flex items-center gap-2">
                <FiFilter /> Filtros
              </h2>
              <div className="space-y-2">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="filter"
                    checked={filterType === 'all'}
                    onChange={() => setFilterType('all')}
                  />
                  <span>Todos</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="filter"
                    checked={filterType === 'confirmed'}
                    onChange={() => setFilterType('confirmed')}
                  />
                  <span>Confirmados</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="filter"
                    checked={filterType === 'suspected'}
                    onChange={() => setFilterType('suspected')}
                  />
                  <span>Suspeitos</span>
                </label>
              </div>
            </div>

            {/* Legendas */}
            <CaseLegend />
            <CityLegend />
            <RegionLegend />
          </div>

          {/* Mapa */}
          <div className="lg:col-span-3 h-[60vh] md:h-[70vh] rounded-xl overflow-hidden shadow-inner bg-gray-200">
            <MapContainer
              center={[-12.0, 18.0]}
              zoom={5}
              className="h-full w-full"
              style={{ height: '100%', width: '100%' }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright ">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              {/* Ajuste automático do mapa */}
              <FitMapToBounds locations={getAllCoordinates(cases, majorCities, affectedRegions)} />

              {/* Marcadores de cidades */}
              {majorCities.map((city, index) => (
                <Marker key={index} position={[city.lat, city.lng]} icon={cityMarker}>
                  <Popup>{city.name}</Popup>
                </Marker>
              ))}

              {/* Marcadores de casos */}
              {filteredCases.map((caseData, index) => {
                const markerIcon = createCustomMarker(caseData.type);
                return (
                  <Marker
                    key={index}
                    position={[caseData.lat, caseData.lng]}
                    icon={markerIcon}
                  >
                    <Popup>
                      <div className="flex items-center gap-3">
                        <div className={`${getCaseColor(caseData.type)} p-2 rounded-full`}>
                          <FiAlertTriangle className="text-white" />
                        </div>
                        <div>
                          <h3 className="font-bold">{caseData.count} Casos</h3>
                          <p className="text-sm text-gray-600">
                            {caseData.type === 'confirmed' ? 'Confirmados' : 'Suspeitos'}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">Região: {caseData.region}</p>
                        </div>
                      </div>
                    </Popup>
                  </Marker>
                );
              })}

              {/* Regiões afetadas com polígonos */}
              {affectedRegions.map((region, index) => (
                <GeoJSON
                  key={index}
                  data={{
                    type: "Feature",
                    properties: { name: region.name },
                    geometry: {
                      type: "Polygon",
                      coordinates: region.polygon
                    }
                  }}
                  style={() => ({
                    color: region.color,
                    fillColor: region.color,
                    fillOpacity: 0.2,
                    weight: 2
                  })}
                >
                  <Popup>{region.name}</Popup>
                </GeoJSON>
              ))}
            </MapContainer>
          </div>
        </div>

        {/* Rodapé */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 text-xs text-gray-500">
          <p>
            Dados do mapa fornecidos por{' '}
            <a href="https://www.openstreetmap.org/copyright " target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-600">
              OpenStreetMap
            </a> sob licença{' '}
            <a href="https://opendatacommons.org/licenses/odbl/ " target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-600">
              ODbL
            </a>. {loading && <span className="text-yellow-500 animate-pulse">Atualizando dados...</span>}
          </p>
        </div>
      </div>
    </div>
  );
}