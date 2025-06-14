// src/pages/provincia/Editar.jsx
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';

export default function ProvinciaEditar() {
  const { id } = useParams();
  const [nome, setNome] = useState('');
  const [loading, setLoading] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProvincia = async () => {
      try {
        const response = await api.get(`/provincias/${id}`);
        setNome(response.data.nome);
      } catch (error) {
        console.error('Erro ao buscar província:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProvincia();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSalvando(true);
    try {
      await api.put(`/provincias/${id}`, { nome });
      navigate('/provincia');
    } catch (error) {
      console.error('Erro ao atualizar província:', error);
    } finally {
      setSalvando(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-2">
        <div className="h-10 bg-slate-200 rounded animate-pulse"></div>
        <div className="h-10 bg-slate-200 rounded animate-pulse"></div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Editar Província</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">Nome</label>
          <input
            type="text"
            className="w-full border rounded p-2"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
          />
        </div>
        <button disabled={salvando} className="bg-green-500 text-white px-4 py-2 rounded">
          {salvando ? 'Salvando...' : 'Salvar'}
        </button>
      </form>
    </div>
  );
}
