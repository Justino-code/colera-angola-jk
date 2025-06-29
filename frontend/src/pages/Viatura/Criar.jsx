import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import toast from 'react-hot-toast';

export default function ViaturaCriar() {
  const [form, setForm] = useState({
    identificacao: '',
    tipo: '',
    status: 'disponivel',
    latitude: '',
    longitude: '',
    id_hospital: '',
  });
  const [hospitais, setHospitais] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingHospitais, setLoadingHospitais] = useState(true);
  const navigate = useNavigate();

  const tiposViatura = [
    'Ambulância',
    'UTI Móvel',
    'Veículo de Suporte',
    'Carro de Resgate',
    'Motocicleta'
  ];

  useEffect(() => {
    const fetchHospitais = async () => {
      try {
        const res = await api.get('/hospitais');
        if (res.success) {
          setHospitais(res.data);
        } else {
          toast.error(res.error || 'Erro ao carregar hospitais');
        }
      } catch (err) {
        toast.error('Erro ao conectar ao servidor');
        console.error('Erro ao carregar hospitais:', err);
      } finally {
        setLoadingHospitais(false);
      }
    };
    fetchHospitais();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const hospital = hospitais.find(h => h.id_hospital === Number(form.id_hospital));

      if (!hospital) {
        toast.error('Selecione um hospital válido');
        setLoading(false);
        return;
      }

      const payload = {
        identificacao: form.identificacao.trim(),
        tipo: form.tipo,
        status: form.status,
        latitude: form.latitude || hospital.latitude,
        longitude: form.longitude || hospital.longitude,
        id_hospital: form.id_hospital,
      };

      const res = await api.post('/viaturas', payload);
      if (res.success) {
        toast.success('Viatura criada com sucesso!');
        setTimeout(() => navigate('/viatura'), 1000);
      } else {
        toast.error(res.error || 'Erro ao criar viatura');
      }
    } catch (err) {
      console.error('Erro ao criar viatura:', err);
      toast.error(err.response?.data?.message || 'Erro ao criar viatura');
    } finally {
      setLoading(false);
    }
  };

  if (loadingHospitais) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center p-6 max-w-md">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando lista de hospitais...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full w-full bg-gray-50 p-4 md:p-6">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-4 md:p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-gray-800">Nova Viatura</h1>
              <p className="text-sm text-gray-500 mt-1">Preencha os dados da viatura</p>
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
                  maxLength="50"
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
                  <option value="">Selecione o tipo</option>
                  {tiposViatura.map(tipo => (
                    <option key={tipo} value={tipo}>{tipo}</option>
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
                  <option value="">Selecione o hospital</option>
                  {hospitais.map(h => (
                    <option key={h.id_hospital} value={h.id_hospital}>
                      {h.nome}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Latitude (opcional)
                </label>
                <input
                  type="number"
                  step="any"
                  name="latitude"
                  value={form.latitude}
                  onChange={handleChange}
                  placeholder="Usará do hospital se vazio"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-200"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Longitude (opcional)
                </label>
                <input
                  type="number"
                  step="any"
                  name="longitude"
                  value={form.longitude}
                  onChange={handleChange}
                  placeholder="Usará do hospital se vazio"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-200"
                />
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
                disabled={loading}
                className="px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-md transition disabled:opacity-70 disabled:cursor-not-allowed min-w-32 flex justify-center"
              >
                {loading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Salvando...
                  </span>
                ) : 'Criar Viatura'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}