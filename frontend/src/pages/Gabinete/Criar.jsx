import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { toast, Toaster } from 'react-hot-toast';

export default function GabineteCriar() {
  const [formData, setFormData] = useState({
    nome: '',
    responsavel: '',
    municipio: ''
  });
  const [municipios, setMunicipios] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [municipiosRes, usuariosRes] = await Promise.all([
          api.get('/municipios'),
          api.get('/usuario')
        ]);
        
        setMunicipios(municipiosRes.data || []);
        setUsuarios(usuariosRes.data || []);
      } catch (error) {
        toast.error('Erro ao carregar dados iniciais');
        console.error('Erro ao carregar dados:', error);
      }
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Limpa erro do campo quando alterado
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    const payload = {
      nome: formData.nome,
      id_responsavel: formData.responsavel || null,
      id_municipio: formData.municipio || null
    };

    try {
      const res = await api.post('/gabinetes', payload);

      if (res.success) {
        toast.success(res.message || 'Gabinete criado com sucesso!');
        setTimeout(() => navigate('/gabinete'), 1500);
      } else if (res.errors) {
        setErrors(res.errors);
        toast.error('Por favor corrija os erros do formulário');
      } else {
        toast.error(res.message || 'Erro ao criar gabinete');
      }
    } catch (error) {
      console.error('Erro ao criar gabinete:', error);
      toast.error(error.response?.data?.message || 'Erro ao criar gabinete');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-full w-full bg-gray-50 p-4 md:p-6">
      <Toaster position="top-right" />
      
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-4 md:p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h1 className="text-xl md:text-2xl font-bold text-gray-800">Novo Gabinete</h1>
            <button
              onClick={() => navigate('/gabinete')}
              className="text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded transition"
            >
              Voltar
            </button>
          </div>
          <p className="text-sm text-gray-500 mt-1">Preencha os campos abaixo para criar um novo gabinete</p>
        </div>

        <form onSubmit={handleSubmit} className="p-4 md:p-6">
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nome do Gabinete *
                {errors.nome && (
                  <span className="ml-2 text-red-600 text-xs">{errors.nome[0]}</span>
                )}
              </label>
              <input
                type="text"
                name="nome"
                value={formData.nome}
                onChange={handleChange}
                required
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                  errors.nome ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'
                }`}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Responsável
                  {errors.id_responsavel && (
                    <span className="ml-2 text-red-600 text-xs">{errors.id_responsavel[0]}</span>
                  )}
                </label>
                <select
                  name="responsavel"
                  value={formData.responsavel}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                    errors.id_responsavel ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'
                  }`}
                >
                  <option value="">Selecione o responsável</option>
                  {usuarios.map((u) => (
                    <option key={u.id_usuario} value={u.id_usuario}>
                      {u.nome} ({u.email})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Município
                  {errors.id_municipio && (
                    <span className="ml-2 text-red-600 text-xs">{errors.id_municipio[0]}</span>
                  )}
                </label>
                <select
                  name="municipio"
                  value={formData.municipio}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                    errors.id_municipio ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'
                  }`}
                >
                  <option value="">Selecione o município</option>
                  {municipios.map((m) => (
                    <option key={m.id_municipio} value={m.id_municipio}>
                      {m.nome}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={() => navigate('/gabinete')}
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
                ) : 'Salvar Gabinete'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}