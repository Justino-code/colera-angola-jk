import { useEffect, useState } from 'react';
import { FiPlus, FiMapPin } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import api from '../../services/api';

export default function HospitalList() {
  const [hospitals, setHospitals] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchHospitals = async () => {
      try {
        const response = await api.get('/hospitals');
        setHospitals(response.data);
      } catch (error) {
        console.error('Erro ao buscar hospitais:', error);
      }
    };
    fetchHospitals();
  }, []);

  const filteredHospitals = hospitals.filter(hospital =>
    hospital.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-slate-800">Gestão de Unidades de Saúde</h1>
        <Link
          to="/hospitais/novo"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
        >
          <FiPlus /> Novo Hospital
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
        <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-3">
          <input
            type="text"
            placeholder="Buscar hospital..."
            className="bg-transparent w-full focus:outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredHospitals.map(hospital => (
          <div key={hospital.id} className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-blue-100 p-3 rounded-full">
                <FiMapPin className="text-blue-600 text-xl" />
              </div>
              <h2 className="text-lg font-semibold">{hospital.name}</h2>
            </div>
            <div className="space-y-2 text-sm text-gray-600">
              <p>Tipo: {hospital.type}</p>
              <p>Leitos: {hospital.beds}</p>
              <p>Município: {hospital.municipality}</p>
            </div>
            <div className="mt-4 flex gap-2">
              <Link
                to={`/hospitais/${hospital.id}`}
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