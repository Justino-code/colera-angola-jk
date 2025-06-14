// src/pages/municipio/Editar.jsx
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';

export default function MunicipioEditar() {
  const { id } = useParams();
  const [nome, setNome] = useState('');
  const [provinciaId, setProvinciaId] = useState('');
  const [provincias, setProvincias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [munRes, provRes] = await Promise.all([
          api.get(`/municipios/${id}`),
          api.get('/provincias')
        ]);
        setNome(munRes.data.nome);
        setProvinciaId(munRes.data.provincia_id);
        setProvincias(provRes.data);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSalvando(true);
    try {
      await api.put(`/municipios/${id}`, { nome, provincia_id: provinciaId });
      navigate('/municipio');
    } catch (error) {
      console.error('Erro ao atualizar município:', error);
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
      <h1 className="text-2xl font-bold mb-4">Editar Município</h1>
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
        <div>
          <label className="block mb-1">Província</label>
          <select
            className="w-full border rounded p-2"
            value={provinciaId}
            onChange={(e) => setProvinciaId(e.target.value)}
            required
          >
            <option value="">Selecione</option>
            {provincias.map((prov) => (
              <option key={prov.id} value={prov.id}>{prov.nome}</option>
            ))}
          </select>
        </div>
        <button disabled={salvando} className="bg-green-500 text-white px-4 py-2 rounded">
          {salvando ? 'Salvando...' : 'Salvar'}
        </button>
      </form>
    </div>
  );
}
