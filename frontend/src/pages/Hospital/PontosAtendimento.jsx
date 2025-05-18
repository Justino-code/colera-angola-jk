import { useEffect, useState } from 'react';
import { FiPlus, FiMapPin } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import api from '../../services/api';

export default function HealthPointList() {
  const [points, setPoints] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchPoints = async () => {
      try {
        const response = await api.get('/health-points');
        setPoints(response.data);
      } catch (error) {
        console.error('Erro ao buscar pontos:', error);
      }
    };
    fetchPoints();
  }, []);

  const filteredPoints = points.filter(point =>
    point.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-slate-800">Pontos de Atendimento</h1>
        <Link
          to="/pontos-atendimento/novo"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
        >
          <FiPlus /> Novo Ponto
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
        <input
          type="text"
          placeholder="Buscar ponto de atendimento..."
          className="w-full p-2 border rounded-lg"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPoints.map(point => (
          <div key={point.id} className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-blue-100 p-3 rounded-full">
                <FiMapPin className="text-blue-600 text-xl" />
              </div>
              <h2 className="text-lg font-semibold">{point.name}</h2>
            </div>
            <div className="space-y-2 text-sm text-gray-600">
              <p>Tipo: {point.type}</p>
              <p>Horário: {point.operating_hours}</p>
              <p>Responsável: {point.responsible}</p>
            </div>
            <div className="mt-4 flex gap-2">
              <Link
                to={`/pontos-atendimento/${point.id}`}
                className="text-blue-600 hover:text-blue-800 text-sm"
              >
                Editar
              </Link>
              <button className="text-red-600 hover:text-red-800 text-sm">
                Excluir
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}