// src/pages/municipio/Detalhes.jsx
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../services/api';

export default function MunicipioDetalhes() {
  const { id } = useParams();
  const [municipio, setMunicipio] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMunicipio = async () => {
      try {
        const response = await api.get(`/municipios/${id}`);
        setMunicipio(response.data);
      } catch (error) {
        console.error('Erro ao buscar município:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMunicipio();
  }, [id]);

  if (loading) {
    return (
      <div className="space-y-2">
        <div className="h-8 bg-slate-200 rounded animate-pulse"></div>
        <div className="h-6 bg-slate-200 rounded animate-pulse"></div>
      </div>
    );
  }

  if (!municipio) {
    return <p>Município não encontrado.</p>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Detalhes do Município</h1>
      <p><strong>ID:</strong> {municipio.id}</p>
      <p><strong>Nome:</strong> {municipio.nome}</p>
      <p><strong>Província:</strong> {municipio.provincia_nome}</p>
    </div>
  );
}
