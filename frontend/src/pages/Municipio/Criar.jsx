// src/pages/municipio/Criar.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

export default function MunicipioCriar() {
  const [nome, setNome] = useState('');
  const [provinciaId, setProvinciaId] = useState('');
  const [provincias, setProvincias] = useState([]);
  const [salvando, setSalvando] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/provincias').then((res) => setProvincias(res.data));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSalvando(true);
    try {
      await api.post('/municipios', { nome, provincia_id: provinciaId });
      navigate('/municipio');
    } catch (error) {
      console.error('Erro ao criar município:', error);
    } finally {
      setSalvando(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Criar Município</h1>
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
