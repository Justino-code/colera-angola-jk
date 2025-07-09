import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { FiArrowLeft, FiMapPin, FiRefreshCw, FiAlertCircle, FiUser, FiCreditCard, FiPhone, FiCalendar, FiInfo } from 'react-icons/fi';
import api from '../../services/api';

// Lista de províncias válidas para BI angolano
const PROVINCIAS_BI = ['LA', 'ME', 'ZE', 'BE', 'BA', 'BO', 'CA', 'CC', 'CN', 'CS', 'CE', 'HO', 'HA', 'LN', 'LS', 'MO', 'NE', 'UE'];

// Funções de validação específicas para Angola
const validateAngolanBI = (bi) => {
  // Formato: 00 + 7 dígitos + 2 letras (província) + 3 dígitos
  const biRegex = /^00\d{7}(LA|ME|ZE|BE|BA|BO|CA|CC|CN|CS|CE|HO|HA|LN|LS|MO|NE|UE)\d{3}$/i;
  return biRegex.test(bi.toUpperCase());
};

const validateAngolanPhone = (phone) => {
  // Formatos: 9XXXXXXXX, 9XX XXX XXX, +2449XXXXXXXX
  const phoneRegex = /^(\+244|00244)?9[1-9][0-9]{7}$/;
  const digitsOnly = phone.replace(/\D/g, '');
  return phoneRegex.test(digitsOnly);
};

// Esquema de validação com regras específicas para Angola
const schema = z.object({
  nome: z.string()
    .min(3, "Nome deve ter pelo menos 3 caracteres")
    .max(100, "Nome muito longo"),
  numero_bi: z.string()
    .min(14, "BI deve ter exatamente 14 caracteres")
    .max(14, "BI deve ter exatamente 14 caracteres")
    .refine(validateAngolanBI, {
      message: "Formato do BI inválido. Exemplo correto: 001234567LA042"
    }),
  telefone: z.string()
    .min(9, "Telefone deve ter pelo menos 9 dígitos")
    .max(15, "Telefone muito longo")
    .refine(validateAngolanPhone, {
      message: "Número angolano inválido. Use formato 9XXXXXXXX ou +2449XXXXXXXX"
    }),
  idade: z.number()
    .min(0, "Idade inválida")
    .max(120, "Idade inválida"),
  sexo: z.enum(["M", "F"], { 
    required_error: "Sexo é obrigatório",
    invalid_type_error: "Sexo deve ser Masculino ou Feminino"
  }),
  sintomas: z.array(z.string())
    .min(1, "Selecione pelo menos 1 sintoma")
    .max(20, "Máximo de 20 sintomas"),
  localizacao: z.object({
    latitude: z.number()
      .min(-90, "Latitude inválida")
      .max(90, "Latitude inválida"),
    longitude: z.number()
      .min(-180, "Longitude inválida")
      .max(180, "Longitude inválida"),
  }).refine(data => data.latitude !== 0 && data.longitude !== 0, {
    message: "Localização é obrigatória",
  }),
});

// Lista de sintomas organizada
const SINTOMAS = [
  { id: 'diarreia_aquosa', label: 'Diarreia aquosa profusa (em água de arroz)' },
  { id: 'vomito', label: 'Vômito' },
  { id: 'desidratacao', label: 'Sinais de desidratação' },
  { id: 'cãibras_musculares', label: 'Cãibras musculares' },
  { id: 'sede_excessiva', label: 'Sede excessiva' },
  { id: 'olhos_fundos', label: 'Olhos fundos' },
  { id: 'pele_retraida', label: 'Pele com perda de elasticidade' },
  { id: 'fraqueza', label: 'Fraqueza extrema' },
  { id: 'batimento_acelerado', label: 'Batimento cardíaco acelerado' },
  { id: 'pressao_baixa', label: 'Pressão arterial baixa' },
  { id: 'urinacao_reduzida', label: 'Diminuição da urina' },
  { id: 'letargia', label: 'Letargia / sonolência' },
  { id: 'febre', label: 'Febre' },
];

export default function PacienteCriar() {
  const navigate = useNavigate();
  const [localizacao, setLocalizacao] = useState(null);
  const [loadingGeo, setLoadingGeo] = useState(false);
  
  const { 
    register, 
    handleSubmit, 
    setValue, 
    watch,
    formState: { errors, isSubmitting, isValid } 
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      sintomas: [],
      localizacao: { latitude: 0, longitude: 0 }
    },
    mode: 'onChange'
  });

  // Observa mudanças na localização
  const watchedLocation = watch("localizacao");

  // Efeito para obter localização inicial
  useEffect(() => {
    setLoadingGeo(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = {
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          accuracy: pos.coords.accuracy
        };
        setLocalizacao(coords);
        setValue("localizacao.latitude", coords.latitude, { shouldValidate: true });
        setValue("localizacao.longitude", coords.longitude, { shouldValidate: true });
        setLoadingGeo(false);
      },
      (err) => {
        console.error("Erro ao obter localização:", err);
        toast.error("Não foi possível obter localização automática. Por favor, insira manualmente.");
        setLoadingGeo(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, [setValue]);

  // Atualiza localização
  const handleAtualizarLocalizacao = () => {
    setLoadingGeo(true);
    toast.loading("Obtendo localização...", { id: 'geo' });
    
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = {
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          accuracy: pos.coords.accuracy
        };
        setLocalizacao(coords);
        setValue("localizacao.latitude", coords.latitude, { shouldValidate: true });
        setValue("localizacao.longitude", coords.longitude, { shouldValidate: true });
        toast.success(`Localização atualizada (precisão: ~${Math.round(coords.accuracy)}m)`, { id: 'geo' });
        setLoadingGeo(false);
      },
      (err) => {
        console.error(err);
        toast.error("Falha ao obter localização. Verifique as permissões.", { id: 'geo' });
        setLoadingGeo(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  // Formata o BI enquanto o usuário digita
  const handleBIChange = (e) => {
    let value = e.target.value.toUpperCase();
    
    // Permite apenas números e letras das províncias válidas
    value = value.replace(/[^0-9A-Z]/g, '');
    
    // Limita o tamanho
    if (value.length > 14) {
      value = value.substring(0, 14);
    }
    
    e.target.value = value;
  };

  // Formata o telefone enquanto o usuário digita
  const handlePhoneChange = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    
    // Adiciona o prefixo de Angola se necessário
    if (value.startsWith('244')) {
      value = `+${value}`;
    } else if (value.length > 0 && !value.startsWith('9')) {
      value = `9${value}`;
    }
    
    // Formatação visual
    if (value.length > 3) {
      value = value.replace(/(\+244|00244)?(\d{3})(\d{3})(\d{3})/, (match, p1, p2, p3, p4) => {
        return p1 ? `${p1} ${p2} ${p3} ${p4}` : `${p2} ${p3} ${p4}`;
      });
    }
    
    e.target.value = value;
  };

  // Submissão do formulário
  const onSubmit = async (data) => {
    try {
      // Remove formatação do telefone antes de enviar
      const phoneCleaned = data.telefone.replace(/\D/g, '').replace(/^244/, '+244');
      
      // Formata o BI para maiúsculas
      const biCleaned = data.numero_bi.toUpperCase();
      
      const pacienteData = {
        ...data,
        telefone: phoneCleaned,
        numero_bi: biCleaned
      };

      const res = await api.post('/pacientes', pacienteData);

      if (res.success) {
        toast.success("Paciente cadastrado com sucesso!");
        navigate('/paciente');
      } else {
        throw new Error(res.message || "Erro ao criar paciente");
      }
    } catch (err) {
      console.error("Erro ao criar paciente:", err);
      toast.error(err.message || "Erro ao criar paciente");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6">
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        {/* Cabeçalho */}
        <div className="bg-gradient-to-r from-cyan-600 to-blue-600 p-6 text-white">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
            <div>
              <h1 className="text-2xl font-bold">Cadastrar Novo Paciente</h1>
              <p className="text-cyan-100 mt-1">Preencha todos os campos obrigatórios</p>
            </div>
            <button 
              onClick={() => navigate('/paciente')}
              className="px-4 py-2 bg-white bg-opacity-20 rounded-lg hover:bg-opacity-30 transition-all flex items-center"
            >
              <FiArrowLeft className="mr-2" />
              Voltar para lista
            </button>
          </div>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Nome */}
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-cyan-100 rounded-full text-cyan-600">
                  <FiUser className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nome Completo *</label>
                  <input 
                    {...register("nome")} 
                    className={`w-full p-2 border rounded-md ${errors.nome ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="Ex: João da Silva"
                  />
                  {errors.nome && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <FiAlertCircle className="mr-1" />
                      {errors.nome.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Número de BI */}
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-cyan-100 rounded-full text-cyan-600">
                  <FiCreditCard className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Número de BI *</label>
                  <input 
                    {...register("numero_bi", {
                      onChange: handleBIChange,
                      validate: {
                        validFormat: v => validateAngolanBI(v) || "Formato do BI inválido"
                      }
                    })}
                    className={`w-full p-2 border rounded-md ${errors.numero_bi ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="Ex: 001234567LA042"
                    maxLength={14}
                  />
                  {errors.numero_bi && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <FiAlertCircle className="mr-1" />
                      {errors.numero_bi.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Telefone */}
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-cyan-100 rounded-full text-cyan-600">
                  <FiPhone className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Telefone *</label>
                  <input 
                    {...register("telefone", {
                      onChange: handlePhoneChange,
                      validate: {
                        validFormat: v => validateAngolanPhone(v) || "Formato de telefone inválido"
                      }
                    })}
                    className={`w-full p-2 border rounded-md ${errors.telefone ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="Ex: 923 456 789 ou +244 923 456 789"
                  />
                  {errors.telefone && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <FiAlertCircle className="mr-1" />
                      {errors.telefone.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Idade */}
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-cyan-100 rounded-full text-cyan-600">
                  <FiCalendar className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Idade *</label>
                  <input 
                    type="number" 
                    {...register("idade", { valueAsNumber: true })} 
                    className={`w-full p-2 border rounded-md ${errors.idade ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="Ex: 25"
                    min="0"
                    max="120"
                  />
                  {errors.idade && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <FiAlertCircle className="mr-1" />
                      {errors.idade.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Sexo */}
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-cyan-100 rounded-full text-cyan-600">
                  <FiInfo className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sexo *</label>
                  <select 
                    {...register("sexo")} 
                    className={`w-full p-2 border rounded-md ${errors.sexo ? 'border-red-500' : 'border-gray-300'}`}
                  >
                    <option value="">Selecione o sexo</option>
                    <option value="M">Masculino</option>
                    <option value="F">Feminino</option>
                  </select>
                  {errors.sexo && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <FiAlertCircle className="mr-1" />
                      {errors.sexo.message}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Sintomas */}
          <div className="bg-white rounded-lg border border-gray-200 p-5">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center border-b pb-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              Sintomas *
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {SINTOMAS.map(({ id, label }) => (
                <label key={id} className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded">
                  <input 
                    type="checkbox" 
                    value={id} 
                    {...register("sintomas")} 
                    className="h-4 w-4 text-cyan-600 focus:ring-cyan-500 border-gray-300 rounded"
                  />
                  <span className="text-sm text-gray-700">{label}</span>
                </label>
              ))}
            </div>
            {errors.sintomas && (
              <p className="mt-2 text-sm text-red-600 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {errors.sintomas.message}
              </p>
            )}
          </div>

          {/* Localização */}
          <div className="bg-white rounded-lg border border-gray-200 p-5">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center border-b pb-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-600" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
              Localização *
            </h2>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Latitude</label>
                  <input
                    type="number"
                    step="any"
                    {...register("localizacao.latitude", { valueAsNumber: true })}
                    className={`w-full p-2 border rounded-md ${errors.localizacao?.latitude ? 'border-red-500' : 'border-gray-300'}`}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Longitude</label>
                  <input
                    type="number"
                    step="any"
                    {...register("localizacao.longitude", { valueAsNumber: true })}
                    className={`w-full p-2 border rounded-md ${errors.localizacao?.longitude ? 'border-red-500' : 'border-gray-300'}`}
                  />
                </div>
                <div className="flex items-end">
                  <button
                    type="button"
                    onClick={handleAtualizarLocalizacao}
                    disabled={loadingGeo}
                    className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all flex items-center justify-center space-x-2"
                  >
                    <FiRefreshCw className={`${loadingGeo ? 'animate-spin' : ''}`} />
                    <span>{loadingGeo ? 'Obtendo...' : 'Atualizar Localização'}</span>
                  </button>
                </div>
              </div>

              {errors.localizacao && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <FiAlertCircle className="mr-1" />
                  {errors.localizacao.message}
                </p>
              )}

              {localizacao && (
                <div className="mt-3 flex items-center gap-2 text-sm text-gray-600">
                  <FiMapPin />
                  <span>
                    Localização atual: {localizacao.latitude.toFixed(6)}, {localizacao.longitude.toFixed(6)}
                    {localizacao.accuracy && ` (Precisão: ~${Math.round(localizacao.accuracy)}m)`}
                  </span>
                </div>
              )}

              {!localizacao && (
                <div className="mt-3 flex items-center gap-2 text-sm text-yellow-600">
                  <FiAlertCircle />
                  <span>Localização não detectada automaticamente. Por favor, insira manualmente.</span>
                </div>
              )}
            </div>
          </div>

          {/* Ações */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => navigate('/paciente')}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-all"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !isValid}
              className="px-6 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-lg text-white hover:from-cyan-700 hover:to-blue-700 transition-all flex items-center space-x-2"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Cadastrando...</span>
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>Cadastrar Paciente</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}