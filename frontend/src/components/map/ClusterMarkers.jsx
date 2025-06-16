import { useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet.markercluster/dist/leaflet.markercluster.js";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";

import "leaflet/dist/leaflet.css";

import { useEffect } from "react";

export default function ClusterMarkers({ markers }) {
  const map = useMap();

  useEffect(() => {
    const clusterGroup = L.markerClusterGroup();

    markers.forEach((p) => {
      if (p.latitude && p.longitude) {
        const marker = L.marker([parseFloat(p.latitude), parseFloat(p.longitude)])
          .bindPopup(`<strong>${p.nome}</strong><br>Idade: ${p.idade}<br>Sintomas: ${p.sintomas?.join(", ")}`);
        clusterGroup.addLayer(marker);
      }
    });

    map.addLayer(clusterGroup);

    return () => {
      map.removeLayer(clusterGroup);
    };
  }, [map, markers]);

  return null;
}
