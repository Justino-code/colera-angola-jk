import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

export default function GabineteCriar() {
  const [nome, setNome] = useState('');
  const [responsavel, setResponsavel] = useState('');
  const [municipio, setMunicipio] = useState('');
  const [municipios, setMunicipios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    // Carregar municípios para o select
    api.get('/municipios')
      .then((res) => setMunicipios(res.data.data || []))
      .catch(() => alert('Erro ao carregar municípios'));
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
      responsavel,
      municipio_id: municipio // enviar apenas o ID
    });

    try {
      const response = await api.post('/gabinetes', payload);

      if (response.data.success) {
        alert(response.data.message || 'Gabinete criado com sucesso!');
        navigate('/gabinete');
      } else if (response.data.errors) {
        setErrors(response.data.errors);
      } else {
        alert('Erro inesperado. Tente novamente.');
      }
    } catch (error) {
      console.error('Erro ao criar gabinete:', error);
      alert('Erro ao criar gabinete');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto">
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
          <input
            type="text"
            value={responsavel}
            onChange={(e) => setResponsavel(e.target.value)}
            className="w-full border rounded p-2 focus:outline-none focus:ring focus:border-cyan-400"
          />
          {errors.responsavel && <p className="text-red-600 text-sm">{errors.responsavel[0]}</p>}
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
              <option key={m.id} value={m.id}>
                {m.nome}
              </option>
            ))}
          </select>
          {errors.municipio_id && <p className="text-red-600 text-sm">{errors.municipio_id[0]}</p>}
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

