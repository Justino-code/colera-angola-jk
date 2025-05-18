import { useState } from 'react';
import { FiAlertTriangle, FiMapPin } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

export default function TriageForm() {
  const [step, setStep] = useState(1);
  const [symptoms, setSymptoms] = useState([]);
  const navigate = useNavigate();

  const symptomList = [
    'Diarreia Severa',
    'Vômitos Persistentes',
    'Desidratação',
    'Febre Alta',
    'Cãibras Musculares'
  ];

  const handleSymptomSelect = (symptom) => {
    setSymptoms(prev => 
      prev.includes(symptom) 
        ? prev.filter(s => s !== symptom) 
        : [...prev, symptom]
    );
  };

  const calculateRisk = () => {
    return symptoms.length >= 2 ? 'high' : 'low';
  };

  return (
    <div className="p-6">
      <div className="bg-white rounded-xl shadow-sm p-6 max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-slate-800 mb-6">Triagem Inteligente</h1>
        
        {step === 1 && (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold">Selecione os Sintomas:</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {symptomList.map((symptom) => (
                <button
                  key={symptom}
                  onClick={() => handleSymptomSelect(symptom)}
                  className={`p-4 rounded-lg border flex items-center gap-3 ${
                    symptoms.includes(symptom) 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'hover:border-blue-300'
                  }`}
                >
                  <FiAlertTriangle className="flex-shrink-0" />
                  {symptom}
                </button>
              ))}
            </div>
            
            <button
              onClick={() => setStep(2)}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg w-full hover:bg-blue-700"
            >
              Continuar
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold">Resultado da Triagem</h2>
            <div className={`p-6 rounded-lg ${
              calculateRisk() === 'high' 
                ? 'bg-red-100 text-red-800' 
                : 'bg-green-100 text-green-800'
            }`}>
              <div className="flex items-center gap-3">
                <FiMapPin className="text-xl" />
                <span className="font-medium">
                  {calculateRisk() === 'high' 
                    ? 'Alto Risco - Encaminhar para Hospital Central'
                    : 'Baixo Risco - Encaminhar para Posto de Saúde'}
                </span>
              </div>
            </div>
            
            <div className="flex gap-4">
              <button
                onClick={() => navigate('/')}
                className="bg-gray-100 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-200"
              >
                Cancelar
              </button>
              <button
                onClick={() => alert('Paciente registrado!')}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
              >
                Confirmar Encaminhamento
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}