import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import toast from 'react-hot-toast';

export default function ProvinciaEditar() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [nome, setNome] = useState('');
  const [codigoIso, setCodigoIso] = useState('');
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    api.get(`/provincias/${id}`)
      .then(res => {
        if (res.data.success) {
          setNome(res.data.data.nome);
          setCodigoIso(res.data.data.codigo_iso);
        } else {
          toast.error(res.data.message || 'Erro ao carregar província');
          navigate('/provincia');
        }
      })
      .catch(err => {
        console.error('Erro na requisição:', err);
        toast.error('Erro ao carregar província');
        navigate('/provincia');
      })
      .finally(() => setCarregando(false));
  }, [id, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSalvando(true);
    try {
      const res = await api.put(`/provincias/${id}`, { nome, codigo_iso: codigoIso });
      if (res.data.success) {
        toast.success(res.data.message || 'Província atualizada com sucesso!');
        navigate('/provincia');
      } else {
        toast.error(res.data.message || 'Erro ao atualizar província');
      }
    } catch (error) {
      console.error('Erro na requisição:', error);
      toast.error('Erro ao atualizar província');
    } finally {
      setSalvando(false);
    }
  };

  if (carregando) {
    return <div className="text-center py-10">Carregando...</div>;
  }

  return (
    <div className="max-w-lg mx-auto bg-white p-6 rounded shadow">
      <h1 className="text-2xl font-bold mb-4 text-slate-700">Editar Província</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-slate-600 mb-1">Nome</label>
          <input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            className="w-full border rounded p-2"
            required
          />
        </div>
        <div>
          <label className="block text-slate-600 mb-1">Código ISO</label>
          <input
            type="text"
            value={codigoIso}
            onChange={(e) => setCodigoIso(e.target.value.toUpperCase())}
            className="w-full border rounded p-2"
            required
          />
        </div>
        <button disabled={salvando} className="bg-cyan-600 text-white px-4 py-2 rounded hover:bg-cyan-700 transition">
          {salvando ? 'Salvando...' : 'Salvar Alterações'}
        </button>
      </form>
    </div>
  );
}

