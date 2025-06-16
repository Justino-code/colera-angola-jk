import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import toast from 'react-hot-toast';

export default function RelatorioGerar() {
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [hospitalId, setHospitalId] = useState('');
  const [hospitais, setHospitais] = useState([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchHospitais = async () => {
      try {
        const res = await api.get('/hospitais');
        setHospitais(res.data);
      } catch (err) {
        console.error("Erro ao carregar hospitais:", err);
        toast.error("Erro ao carregar hospitais");
      }
    };

    fetchHospitais();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.post('/relatorios', {
        titulo,
        descricao,
        hospital_id: hospitalId,
        data: new Date().toISOString(),
      });

      if (res.data.success) {
        toast.success(res.data.message || "Relatório gerado com sucesso!");
        navigate('/relatorios');
      } else {
        toast.error(res.data.message || "Erro ao gerar relatório");
      }
    } catch (err) {
      console.error("Erro ao gerar relatório:", err);
      toast.error("Erro ao gerar relatório");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-4">Gerar Relatório</h1>

      <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow space-y-4">
        <div>
          <label className="block font-medium">Título</label>
          <input
            type="text"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            required
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block font-medium">Descrição</label>
          <textarea
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            required
            className="w-full p-2 border rounded"
          ></textarea>
        </div>

        <div>
          <label className="block font-medium">Hospital</label>
          <select
            value={hospitalId}
            onChange={(e) => setHospitalId(e.target.value)}
            required
            className="w-full p-2 border rounded"
          >
            <option value="">Selecione um hospital</option>
            {hospitais.map((h) => (
              <option key={h.id} value={h.id}>
                {h.nome}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition disabled:opacity-50"
        >
          {loading ? "Gerando..." : "Gerar Relatório"}
        </button>
      </form>
    </div>
  );
}

