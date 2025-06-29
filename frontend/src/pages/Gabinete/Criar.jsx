import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { toast, Toaster } from 'react-hot-toast';

export default function GabineteCriar() {
  const [nome, setNome] = useState('');
  const [responsavel, setResponsavel] = useState('');
  const [municipio, setMunicipio] = useState('');
  const [municipios, setMunicipios] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/municipios')
      .then((res) => setMunicipios(res.data || []))
      .catch(() => toast.error('Erro ao carregar municípios'));

    api.get('/usuario')
      .then((res) => setUsuarios(res.data || []))
      .catch(() => toast.error('Erro ao carregar usuários'));
  }, []);

  const cleanData = (data) => {
    return Object.fromEntries(
      Object.entries(data).filter(([_, v]) => v !== '' && v !== null && v !== undefined)
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    const payload = cleanData({
      nome,
      id_responsavel: responsavel,
      id_municipio: municipio,
    });

    try {
      const res = await api.post('/gabinetes', payload);

      if (res.success) {
        toast.success(res.message || 'Gabinete criado com sucesso!');
        setTimeout(() => navigate('/gabinete'), 1500);
      } else if (res.errors) {
        setErrors(res.errors);
        toast('Por favor corrija os erros do formulário.', { icon: '⚠️' });
      } else {
        toast.error('Erro inesperado. Tente novamente.');
      }
    } catch (error) {
      console.error('Erro ao criar gabinete:', error);
      toast.error('Erro ao criar gabinete');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full w-full flex flex-col min-h-0 bg-white p-6 rounded shadow">
      <Toaster position="top-right" />
      <h1 className="text-2xl font-bold text-slate-700 mb-4">Novo Gabinete</h1>
      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-4 rounded shadow">
        <div>
          <label className="block text-slate-600 mb-1">Nome do Gabinete</label>
          <input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            className="w-full border rounded p-2 focus:outline-none focus:ring focus:border-cyan-400"
          />
          {errors.nome && <p className="text-red-600 text-sm">{errors.nome[0]}</p>}
        </div>

        <div>
          <label className="block text-slate-600 mb-1">Responsável</label>
          <select
            value={responsavel}
            onChange={(e) => setResponsavel(e.target.value)}
            className="w-full border rounded p-2 focus:outline-none focus:ring focus:border-cyan-400"
          >
            <option value="">Selecione o responsável</option>
            {usuarios.map((u) => (
              <option key={u.id_usuario} value={u.id_usuario}>
                {u.nome} ({u.email})
              </option>
            ))}
          </select>
          {errors.id_responsavel && <p className="text-red-600 text-sm">{errors.id_responsavel[0]}</p>}
        </div>

        <div>
          <label className="block text-slate-600 mb-1">Município</label>
          <select
            value={municipio}
            onChange={(e) => setMunicipio(e.target.value)}
            className="w-full border rounded p-2 focus:outline-none focus:ring focus:border-cyan-400"
          >
            <option value="">Selecione o município</option>
            {municipios.map((m) => (
              <option key={m.id_municipio} value={m.id_municipio}>
                {m.nome}
              </option>
            ))}
          </select>
          {errors.id_municipio && <p className="text-red-600 text-sm">{errors.id_municipio[0]}</p>}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-cyan-600 text-white py-2 px-4 rounded hover:bg-cyan-700 transition disabled:opacity-50"
        >
          {loading ? 'Salvando...' : 'Salvar'}
        </button>
      </form>
    </div>
  );
}
