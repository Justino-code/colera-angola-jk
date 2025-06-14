// src/pages/provincia/Criar.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

export default function ProvinciaCriar() {
  const [nome, setNome] = useState('');
  const [salvando, setSalvando] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSalvando(true);
    try {
      await api.post('/provincias', { nome });
      navigate('/provincia');
    } catch (error) {
      console.error('Erro ao criar província:', error);
    } finally {
      setSalvando(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Criar Província</h1>
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
