// src/pages/municipio/Listar.jsx
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';

export default function MunicipioListar() {
  const [municipios, setMunicipios] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMunicipios = async () => {
      try {
        const response = await api.get('/municipios');
        setMunicipios(response.data);
      } catch (error) {
        console.error('Erro ao buscar municípios:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMunicipios();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Municípios</h1>
      <Link to="/municipio/criar" className="bg-blue-500 text-white px-4 py-2 rounded mb-4 inline-block">Criar Novo Município</Link>

      {loading ? (
        <div className="space-y-2">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-10 bg-slate-200 rounded animate-pulse"></div>
          ))}
        </div>
      ) : (
        <ul className="space-y-2">
          {municipios.map((municipio) => (
            <li key={municipio.id} className="bg-white p-4 rounded shadow flex justify-between items-center">
              <span>{municipio.nome} ({municipio.provincia_nome})</span>
              <div className="space-x-2">
                <Link to={`/municipio/${municipio.id}`} className="text-blue-500">Detalhes</Link>
                <Link to={`/municipio/editar/${municipio.id}`} className="text-green-500">Editar</Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
