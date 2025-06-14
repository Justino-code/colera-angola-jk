// src/pages/provincia/Listar.jsx
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';

export default function ProvinciaListar() {
  const [provincias, setProvincias] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProvincias = async () => {
      try {
        const response = await api.get('/provincias');
        setProvincias(response.data);
      } catch (error) {
        console.error('Erro ao buscar províncias:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProvincias();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Provincias</h1>
      <Link to="/provincia/criar" className="bg-blue-500 text-white px-4 py-2 rounded mb-4 inline-block">Criar Nova Provincia</Link>

      {loading ? (
        <div className="space-y-2">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-10 bg-slate-200 rounded animate-pulse"></div>
          ))}
        </div>
      ) : (
        <ul className="space-y-2">
          {provincias.map((provincia) => (
            <li key={provincia.id} className="bg-white p-4 rounded shadow flex justify-between items-center">
              <span>{provincia.nome}</span>
              <div className="space-x-2">
                <Link to={`/provincia/${provincia.id}`} className="text-blue-500">Detalhes</Link>
                <Link to={`/provincia/editar/${provincia.id}`} className="text-green-500">Editar</Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
