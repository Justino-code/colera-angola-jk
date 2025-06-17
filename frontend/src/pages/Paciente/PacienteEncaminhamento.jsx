import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { MapContainer, TileLayer, Polyline, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

export default function PacienteEncaminhamento() {
  const { id } = useParams();
  const [paciente, setPaciente] = useState(null);
  const [rota, setRota] = useState(null);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const resPaciente = await fetch(`${import.meta.env.VITE_API_URL}/paciente/${id}`);
        const dataPaciente = await resPaciente.json();

        if (!dataPaciente.success) throw new Error(dataPaciente.error || "Erro ao buscar paciente");
        setPaciente(dataPaciente.data);

        const resRota = await fetch(`${import.meta.env.VITE_API_URL}/paciente/${id}/encaminhamento`);
        const dataRota = await resRota.json();

        if (!dataRota.success) throw new Error(dataRota.error || "Erro ao buscar encaminhamento");
        setRota(dataRota.data);
      } catch (err) {
        setErro(err.message);
      }
    }

    fetchData();
  }, [id]);

  if (erro) {
    return <div className="text-red-600 text-center mt-4">Erro: {erro}</div>;
  }

  if (!paciente || !rota) {
    return <div className="text-center mt-4">Carregando...</div>;
  }

  const pacientePos = [paciente.latitude, paciente.longitude];
  const hospitalPos = [paciente.hospital.latitude, paciente.hospital.longitude];
  const caminho = rota.geometry.coordinates.map(([lng, lat]) => [lat, lng]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Encaminhamento do Paciente</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="col-span-1">
          <div className="bg-white shadow rounded p-4">
            <h2 className="text-xl font-semibold mb-2">Paciente</h2>
            <p><strong>Nome:</strong> {paciente.nome}</p>
            <p><strong>Idade:</strong> {paciente.idade}</p>
            <p><strong>Sexo:</strong> {paciente.sexo}</p>
            <p><strong>Triagem:</strong> {paciente.resultado_triagem}</p>
            <p><strong>Hospital:</strong> {paciente.hospital.nome}</p>
            <p><strong>Distância:</strong> {(rota.distancia_metros / 1000).toFixed(2)} km</p>
            <p><strong>Duração:</strong> {(rota.duracao_segundos / 60).toFixed(1)} min</p>
          </div>

          <div className="bg-white shadow rounded p-4 mt-4">
            <h2 className="text-xl font-semibold mb-2">Instruções</h2>
            <ul className="list-disc pl-4">
              {rota.instrucoes.map((inst, idx) => (
                <li key={idx}>{inst}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="col-span-1 md:col-span-2">
          <MapContainer
            center={pacientePos}
            zoom={13}
            scrollWheelZoom={true}
            className="w-full h-96 rounded shadow"
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            />
            <Marker position={pacientePos}>
              <Popup>Paciente: {paciente.nome}</Popup>
            </Marker>
            <Marker position={hospitalPos}>
              <Popup>Hospital: {paciente.hospital.nome}</Popup>
            </Marker>
            <Polyline positions={caminho} color="blue" />
          </MapContainer>
        </div>
      </div>
    </div>
  );
}
