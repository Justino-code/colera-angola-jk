import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../services/api';
import { toast } from 'react-hot-toast';
import Skeleton from '../../components/common/Skeleton';

export default function ViaturaEditar() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    identificacao: '',
    tipo: 'ambulancia',
    status: 'disponivel',
    latitude: '',
    longitude: '',
    id_hospital: ''
  });
  const [hospitais, setHospitais] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [gettingLocation, setGettingLocation] = useState(false);

  const tiposViatura = [
    { value: 'ambulancia', label: 'Ambulância' },
    { value: 'resgate', label: 'Veículo de Resgate' },
    { value: 'suporte', label: 'Veículo de Suporte' },
    { value: 'utimovel', label: 'UTI Móvel' },
    { value: 'outros', label: 'Outros' }
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [viaturaRes, hospitaisRes] = await Promise.all([
          api.get(`/viaturas/${id}`),
          api.get('/hospitais')
        ]);

        if (!viaturaRes.success) {
          toast.error(viaturaRes.message || 'Falha ao carregar viatura');
          navigate('/viatura');
          return;
        }

        if (!hospitaisRes.success) {
          toast.error(hospitaisRes.message || 'Falha ao carregar hospitais');
          return;
        }

        setForm({
          identificacao: viaturaRes.data.identificacao,
          tipo: viaturaRes.data.tipo,
          status: viaturaRes.data.status,
          latitude: viaturaRes.data.latitude ?? '',
          longitude: viaturaRes.data.longitude ?? '',
          id_hospital: viaturaRes.data.id_hospital
        });
        setHospitais(hospitaisRes.data);
      } catch (error) {
        console.error('Erro na requisição:', error);
        toast.error(error.response?.data?.message || 'Erro na comunicação com o servidor');
        navigate('/viatura');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const getLocation = () => {
    if ('geolocation' in navigator) {
      setGettingLocation(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setForm(prev => ({
            ...prev,
            latitude: position.coords.latitude.toFixed(7),
            longitude: position.coords.longitude.toFixed(7)
          }));
          toast.success('Localização obtida com sucesso');
          setGettingLocation(false);
        },
        (error) => {
          console.error('Erro ao obter localização:', error);
          let errorMessage = 'Não foi possível obter localização';
          if (error.code === error.PERMISSION_DENIED) {
            errorMessage = 'Permissão de localização negada';
          } else if (error.code === error.POSITION_UNAVAILABLE) {
            errorMessage = 'Localização indisponível';
          } else if (error.code === error.TIMEOUT) {
            errorMessage = 'Tempo limite excedido';
          }
          toast.error(errorMessage);
          setGettingLocation(false);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    } else {
      toast.error('Geolocalização não é suportada pelo seu navegador');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await api.put(`/viaturas/${id}`, form);
      if (res.success) {
        toast.success(res.message || 'Viatura atualizada com sucesso');
        setTimeout(() => navigate('/viatura'), 1500);
      } else {
        toast.error(res.message || 'Erro ao atualizar viatura');
      }
    } catch (error) {
      console.error('Erro na requisição:', error);
      toast.error(error.response?.data?.message || 'Erro na comunicação com o servidor');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-full w-full bg-gray-50 p-4 md:p-6">
        <Skeleton />
      </div>
    );
  }

  return (
    <div className="min-h-full w-full bg-gray-50 p-4 md:p-6">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-4 md:p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-gray-800">Editar Viatura</h1>
              <p className="text-sm text-gray-500 mt-1">Atualize os dados da viatura</p>
            </div>
            <button
              onClick={() => navigate('/viatura')}
              className="text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded transition"
            >
              Voltar
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-4 md:p-6">
          <div className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Identificação *
                </label>
                <input
                  type="text"
                  name="identificacao"
                  value={form.identificacao}
                  onChange={handleChange}
                  required
                  placeholder="Ex: AMB-001"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-200"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo *
                </label>
                <select
                  name="tipo"
                  value={form.tipo}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-200"
                >
                  {tiposViatura.map((tipo) => (
                    <option key={tipo.value} value={tipo.value}>
                      {tipo.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status *
                </label>
                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-200"
                >
                  <option value="disponivel">Disponível</option>
                  <option value="em_viagem">Em Viagem</option>
                  <option value="ocupada">Ocupada</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Hospital *
                </label>
                <select
                  name="id_hospital"
                  value={form.id_hospital}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-200"
                >
                  <option value="">Selecione um hospital</option>
                  {hospitais.map(h => (
                    <option key={h.id_hospital} value={h.id_hospital}>
                      {h.nome}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Localização
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Latitude</label>
                  <input
                    type="text"
                    name="latitude"
                    value={form.latitude}
                    readOnly
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Longitude</label>
                  <input
                    type="text"
                    name="longitude"
                    value={form.longitude}
                    readOnly
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                  />
                </div>
                <div className="flex items-end">
                  <button
                    type="button"
                    onClick={getLocation}
                    disabled={gettingLocation}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-2 rounded-md transition disabled:opacity-70"
                  >
                    {gettingLocation ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Obtendo...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        Obter Localização
                      </span>
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={() => navigate('/viatura')}
                className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition mr-3"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-md transition disabled:opacity-70 disabled:cursor-not-allowed min-w-32 flex justify-center"
              >
                {saving ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Salvando...
                  </span>
                ) : 'Salvar Alterações'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}