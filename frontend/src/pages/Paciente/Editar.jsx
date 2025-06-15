import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import Skeleton from '../../components/common/Skeleton';

export default function PacienteEditar() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [paciente, setPaciente] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [location, setLocation] = useState({ latitude: null, longitude: null });

  useEffect(() => {
    api.get(`/pacientes/${id}`)
      .then(data => {
        setPaciente(data);
        setLocation({
          latitude: data.latitude || null,
          longitude: data.longitude || null
        });
      })
      .catch(err => alert('Erro ao carregar paciente: ' + err))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setLocation({ latitude, longitude });
          setPaciente(prev => ({
            ...prev,
            latitude,
            longitude
          }));
        },
        (err) => {
          console.error("Erro ao obter localização: ", err.message);
          alert("Não foi possível obter sua localização automaticamente.");
        }
      );
    }
  }, []);

  const handleChange = (e) => {
    setPaciente({
      ...paciente,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSaving(true);
    api.put(`/pacientes/${id}`, paciente)
      .then(() => {
        alert('Paciente atualizado com sucesso');
        navigate('/pacientes');
      })
      .catch(err => alert('Erro ao salvar: ' + err))
      .finally(() => setSaving(false));
  };

  if (loading) {
    return (
      <div className="space-y-2">
        <Skeleton className="h-10 w-1/2" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    );
  }

  if (!paciente) {
    return <p className="text-red-500">Paciente não encontrado.</p>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-700 mb-4">Editar Paciente</h1>
      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-4 rounded shadow">
        <div>
          <label className="block text-slate-600 mb-1">Nome</label>
          <input 
            type="text"
            name="nome"
            value={paciente.nome || ''}
            onChange={handleChange}
            className="w-full border rounded p-2"
            required
          />
        </div>
        <div>
          <label className="block text-slate-600 mb-1">Idade</label>
          <input 
            type="number"
            name="idade"
            value={paciente.idade || ''}
            onChange={handleChange}
            className="w-full border rounded p-2"
            required
          />
        </div>
        <div>
          <label className="block text-slate-600 mb-1">Local</label>
          <input 
            type="text"
            name="local"
            value={paciente.local || ''}
            onChange={handleChange}
            className="w-full border rounded p-2"
            required
          />
        </div>

        {/* Latitude e longitude - automáticas e ocultas */}
        {location.latitude && location.longitude && (
          <div className="text-green-600 text-sm">
            Localização detectada: {location.latitude.toFixed(5)}, {location.longitude.toFixed(5)}
          </div>
        )}
        <input type="hidden" name="latitude" value={location.latitude || ''} />
        <input type="hidden" name="longitude" value={location.longitude || ''} />

        <button 
          type="submit"
          disabled={saving}
          className="bg-cyan-600 text-white px-4 py-2 rounded hover:bg-cyan-700 transition"
        >
          {saving ? 'Salvando...' : 'Salvar'}
        </button>
      </form>
    </div>
  );
}
