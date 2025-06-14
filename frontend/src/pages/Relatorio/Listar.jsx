// src/pages/relatorios/Listar.jsx
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';

export default function RelatoriosListar() {
  const [relatorios, setRelatorios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState('');

  useEffect(() => {
    const fetchRelatorios = async () => {
      try {
        const response = await api.get('/relatorios', {
          params: { search: filtro }
        });
        setRelatorios(response.data);
      } catch (error) {
        console.error('Erro ao buscar relatórios:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRelatorios();
  }, [filtro]);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Relatórios</h1>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Filtrar por título, hospital..."
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          className="w-full md:w-1/3 p-2 border rounded-lg"
        />
      </div>

      {loading ? (
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-10 bg-slate-200 rounded animate-pulse"></div>
          ))}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg shadow-sm">
            <thead className="bg-slate-100">
              <tr>
                <th className="p-3 text-left">#</th>
                <th className="p-3 text-left">Título</th>
                <th className="p-3 text-left">Data</th>
                <th className="p-3 text-left">Hospital</th>
                <th className="p-3 text-left">Ações</th>
              </tr>
            </thead>
            <tbody>
              {relatorios.length > 0 ? relatorios.map((r) => (
                <tr key={r.id} className="border-b">
                  <td className="p-3">{r.id}</td>
                  <td className="p-3">{r.titulo}</td>
                  <td className="p-3">{new Date(r.data).toLocaleDateString()}</td>
                  <td className="p-3">{r.hospital_nome}</td>
                  <td className="p-3 space-x-2">
                    <Link to={`/relatorios/${r.id}`} className="text-blue-500 hover:underline">Ver</Link>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="5" className="p-3 text-center text-slate-500">Nenhum relatório encontrado</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
