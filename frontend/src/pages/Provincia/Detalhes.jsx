// src/pages/provincia/Detalhes.jsx
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../services/api';

export default function ProvinciaDetalhes() {
  const { id } = useParams();
  const [provincia, setProvincia] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProvincia = async () => {
      try {
        const response = await api.get(`/provincias/${id}`);
        setProvincia(response.data);
      } catch (error) {
        console.error('Erro ao buscar província:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProvincia();
  }, [id]);

  if (loading) {
    return (
      <div className="space-y-2">
        <div className="h-8 bg-slate-200 rounded animate-pulse"></div>
        <div className="h-6 bg-slate-200 rounded animate-pulse"></div>
      </div>
    );
  }

  if (!provincia) {
    return <p>Província não encontrada.</p>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Detalhes da Província</h1>
      <p><strong>ID:</strong> {provincia.id}</p>
      <p><strong>Nome:</strong> {provincia.nome}</p>
    </div>
  );
}
