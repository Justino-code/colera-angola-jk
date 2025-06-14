import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import api from '../../services/api';
import { FiArrowLeft, FiUser, FiActivity } from 'react-icons/fi';
import { Link } from 'react-router-dom';

export default function PatientDetails() {
  const { id } = useParams();
  const [patient, setPatient] = useState(null);

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        const response = await api.get(`/paciente/${id}`);
        setPatient(response.data);
      } catch (error) {
        console.error('Erro ao buscar paciente:', error);
      }
    };
    fetchPatient();
  }, [id]);

  if (!patient) return <div>Carregando...</div>;

  return (
    <div className="p-6">
      <div className="flex items-center gap-4 mb-8">
        <Link
          to="/pacientes"
          className="text-blue-600 hover:text-blue-800 flex items-center gap-2"
        >
          <FiArrowLeft /> Voltar
        </Link>
        <h1 className="text-2xl font-bold text-slate-800">{patient.name}</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Informações Básicas */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="bg-blue-100 p-3 rounded-full">
              <FiUser className="text-blue-600 text-xl" />
            </div>
            <h2 className="text-lg font-semibold">Informações Pessoais</h2>
          </div>
          <dl className="space-y-4">
            <div>
              <dt className="text-gray-500">Número do BI</dt>
              <dd className="font-medium">{patient.bi_number}</dd>
            </div>
            <div>
              <dt className="text-gray-500">Telefone</dt>
              <dd className="font-medium">{patient.phone}</dd>
            </div>
            <div>
              <dt className="text-gray-500">Idade</dt>
              <dd className="font-medium">{patient.age}</dd>
            </div>
          </dl>
        </div>

        {/* Histórico Médico */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="bg-green-100 p-3 rounded-full">
              <FiActivity className="text-green-600 text-xl" />
            </div>
            <h2 className="text-lg font-semibold">Histórico Clínico</h2>
          </div>
          <div className="space-y-4">
            <div>
              <h3 className="text-gray-500 mb-1">Última Triagem</h3>
              <p className="font-medium">{patient.last_screening}</p>
            </div>
            <div>
              <h3 className="text-gray-500 mb-1">Resultado da Triagem</h3>
              <span className={`px-3 py-1 rounded-full text-sm ${
                patient.risk_level === 'high' 
                  ? 'bg-red-100 text-red-800' 
                  : 'bg-green-100 text-green-800'
              }`}>
                {patient.risk_level === 'high' ? 'Alto Risco' : 'Baixo Risco'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}