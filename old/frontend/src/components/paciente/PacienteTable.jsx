import { useEffect, useState } from 'react';
import api from '../../services/api';

export default function PatientTable() {
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    const fetchPatients = async () => {
      const response = await api.get('/patients');
      setPatients(response.data);
    };
    fetchPatients();
  }, []);

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left">Nome</th>
            <th className="px-6 py-3 text-left">Hospital</th>
            <th className="px-6 py-3 text-left">Risco</th>
            <th className="px-6 py-3 text-left">Ações</th>
          </tr>
        </thead>
        <tbody>
          {patients.map((patient) => (
            <tr key={patient.id}>
              <td className="px-6 py-4">{patient.nome}</td>
              <td className="px-6 py-4">{patient.hospital?.nome || 'N/A'}</td>
              <td className="px-6 py-4">
                <span className={`px-2 py-1 rounded ${patient.resultado_triagem === 'alto_risco' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                  {patient.resultado_triagem}
                </span>
              </td>
              <td className="px-6 py-4">
                <button className="text-blue-600 hover:text-blue-900">
                  Ver Detalhes
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
