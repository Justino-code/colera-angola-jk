import { useEffect } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet.markercluster/dist/leaflet.markercluster.js";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import "leaflet/dist/leaflet.css";

export default function ClusterMarkers({ markers }) {
  const map = useMap();

  useEffect(() => {
    let clusterGroup;

    try {
      clusterGroup = L.markerClusterGroup();

      markers.forEach((p) => {
        const lat = parseFloat(p.latitude);
        const lng = parseFloat(p.longitude);

        if (!isNaN(lat) && !isNaN(lng)) {
          const marker = L.marker([lat, lng])
            .bindPopup(`
              <strong>${p.nome || "Desconhecido"}</strong><br>
              Idade: ${p.idade || "N/A"}<br>
              Sintomas: ${Array.isArray(p.sintomas) ? p.sintomas.join(", ") : "N/A"}
            `);
          clusterGroup.addLayer(marker);
        } else {
          console.warn("Coordenada inválida para paciente:", p);
        }
      });

      map.addLayer(clusterGroup);
    } catch (err) {
      console.error("Erro ao criar cluster:", err);
    }

    return () => {
      if (clusterGroup) {
        map.removeLayer(clusterGroup);
      }
    };
  }, [map, markers]);

  return null;
}
