import { useEffect, useState } from 'react';
import { FiPlus, FiTruck } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import api from '../../services/api';

export default function VehicleList() {
  const [vehicles, setVehicles] = useState([]);

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const response = await api.get('/ambulances');
        setVehicles(response.data);
      } catch (error) {
        console.error('Erro ao buscar viaturas:', error);
      }
    };
    fetchVehicles();
  }, []);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-slate-800">Gestão de Viaturas</h1>
        <Link
          to="/viaturas/nova"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
        >
          <FiPlus /> Nova Viatura
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left py-4 px-6">Placa</th>
              <th className="text-left py-4 px-6">Status</th>
              <th className="text-left py-4 px-6">Última Localização</th>
              <th className="text-left py-4 px-6">Ações</th>
            </tr>
          </thead>
          <tbody>
            {vehicles.map(vehicle => (
              <tr key={vehicle.id} className="border-t border-gray-100 hover:bg-gray-50">
                <td className="py-4 px-6 flex items-center gap-3">
                  <div className="bg-blue-100 p-2 rounded-full">
                    <FiTruck className="text-blue-600" />
                  </div>
                  {vehicle.plate}
                </td>
                <td className="py-4 px-6">
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    vehicle.status === 'available' ? 'bg-green-100 text-green-800' :
                    vehicle.status === 'in_route' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {vehicle.status === 'available' ? 'Disponível' : 
                     vehicle.status === 'in_route' ? 'Em Rota' : 'Ocupada'}
                  </span>
                </td>
                <td className="py-4 px-6">{vehicle.last_location}</td>
                <td className="py-4 px-6">
                  <button className="text-blue-600 hover:text-blue-800">
                    Atualizar Localização
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}