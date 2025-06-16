import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-markercluster";
import { motion } from "framer-motion";
import api from "../../services/api";
import L from "leaflet";

import "leaflet/dist/leaflet.css";
import "react-leaflet-markercluster/dist/styles.min.css";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

export default function MapaCasos() {
  const [pacientes, setPacientes] = useState([]);
  const [filtro, setFiltro] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/pacientes")
      .then(setPacientes)
      .catch(err => {
        alert("Erro ao carregar pacientes: " + err);
        console.error(err);
      })
      .finally(() => setLoading(false));
  }, []);

  const centroAngola = [-11.2027, 17.8739];

  const pacientesFiltrados = pacientes.filter(p => {
    if (!p.latitude || !p.longitude) return false;
    if (!filtro) return true;
    return p.sintomas?.includes(filtro);
  });

  return (
    <motion.div
      className="w-full h-[80vh] rounded shadow overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <h1 className="text-2xl font-bold mb-2">Mapa de Casos</h1>

      <div className="mb-2">
        <label className="mr-2 font-medium">Filtrar por sintoma:</label>
        <select
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          className="border rounded p-1"
        >
          <option value="">Todos</option>
          <option value="febre">Febre</option>
          <option value="vomito">Vômito</option>
          <option value="diarreia">Diarreia</option>
          <option value="desidratacao">Desidratação</option>
        </select>
      </div>

      {loading ? (
        <p className="text-gray-500">Carregando dados...</p>
      ) : (
        <MapContainer center={centroAngola} zoom={6} className="w-full h-full z-0">
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MarkerClusterGroup>
            {pacientesFiltrados.map((p) => (
              <Marker
                key={p.id}
                position={[
                  parseFloat(p.latitude),
                  parseFloat(p.longitude)
                ]}
              >
                <Popup>
                  <strong>{p.nome}</strong><br />
                  Idade: {p.idade}<br />
                  Sintomas: {p.sintomas?.join(", ") || "N/A"}
                </Popup>
              </Marker>
            ))}
          </MarkerClusterGroup>
        </MapContainer>
      )}
    </motion.div>
  );
}
