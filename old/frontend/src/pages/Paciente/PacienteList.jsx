import { useEffect, useState } from 'react';
import api from '../../services/api';
import { FiUser, FiSearch, FiPlus } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import useNavigationProgress from '../../hooks/useNavigationProgress';

export default function PatientList() {
  useNavigationProgress();
  const [patients, setPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await api.get('/paciente');
        setPatients(response.data);
      } catch (error) {
        console.error('Erro ao buscar pacientes:', error);
      }
    };
    fetchPatients();
  }, []);

  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-slate-800">Gestão de Pacientes</h1>
        <Link
          to="/pacientes/novo"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
        >
          <FiPlus /> Novo Paciente
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
        <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-3">
          <FiSearch className="text-gray-400" />
          <input
            type="text"
            placeholder="Buscar paciente..."
            className="bg-transparent w-full focus:outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left py-4 px-6">Nome</th>
              <th className="text-left py-4 px-6">BI Number</th>
              <th className="text-left py-4 px-6">Status</th>
              <th className="text-left py-4 px-6">Ações</th>
            </tr>
          </thead>
          <tbody>
            {filteredPatients.map(patient => (
              <tr key={patient.id} className="border-t border-gray-100 hover:bg-gray-50">
                <td className="py-4 px-6 flex items-center gap-3">
                  <div className="bg-blue-100 p-2 rounded-full">
                    <FiUser className="text-blue-600" />
                  </div>
                  {patient.name}
                </td>
                <td className="py-4 px-6">{patient.bi_number}</td>
                <td className="py-4 px-6">
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    patient.risk_level === 'high' 
                      ? 'bg-red-100 text-red-800' 
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {patient.risk_level === 'high' ? 'Alto Risco' : 'Baixo Risco'}
                  </span>
                </td>
                <td className="py-4 px-6">
                  <Link
                    to={`/pacientes/${patient.id}`}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    Ver Detalhes
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}