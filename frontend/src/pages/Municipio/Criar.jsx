import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../../services/api';

export default function MunicipioCriar() {
  const [nome, setNome] = useState('');
  const [provinciaId, setProvinciaId] = useState('');
  const [provincias, setProvincias] = useState([]);
  const [salvando, setSalvando] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProvincias = async () => {
      try {
        const res = await api.get('/provincias');
        if (res.success) {
          setProvincias(res.data);
        } else {
          toast.error(res.message || 'Erro ao carregar províncias');
        }
      } catch (error) {
        console.error('Erro ao carregar províncias:', error);
        toast.error('Erro ao carregar províncias');
      }
    };

    fetchProvincias();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSalvando(true);
    try {
      const res = await api.post('/municipios', {
        nome,
        id_provincia: provinciaId,
      });

      if (res.success) {
        toast.success('Município criado com sucesso!');
        navigate('/municipio');
      } else {
        toast.error(res.message || 'Erro ao criar município');
      }
    } catch (error) {
      console.error('Erro ao criar município:', error);
      toast.error('Erro ao criar município');
    } finally {
      setSalvando(false);
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4 text-slate-700">Criar Município</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-slate-600 mb-1">Nome</label>
          <input
            type="text"
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-cyan-400"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-slate-600 mb-1">Província</label>
          <select
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-cyan-400"
            value={provinciaId}
            onChange={(e) => setProvinciaId(e.target.value)}
            required
          >
            <option value="">Selecione</option>
            {provincias.map((prov) => (
              <option key={prov.id_provincia} value={prov.id_provincia}>
                {prov.nome}
              </option>
            ))}
          </select>
        </div>

        <div className="flex space-x-2">
          <button
            disabled={salvando}
            className="bg-cyan-600 text-white px-4 py-2 rounded hover:bg-cyan-700 transition disabled:opacity-50"
          >
            {salvando ? 'Salvando...' : 'Salvar'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/municipio')}
            className="bg-slate-300 text-slate-700 px-4 py-2 rounded hover:bg-slate-400 transition"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}

