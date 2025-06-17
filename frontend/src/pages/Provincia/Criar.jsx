import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import toast from 'react-hot-toast';

export default function ProvinciaCriar() {
  const [nome, setNome] = useState('');
  const [salvando, setSalvando] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSalvando(true);
    try {
      const res = await api.post('/provincias', { nome });
      if (res.success) {
        toast.success(res.message || 'Província criada com sucesso!');
        navigate('/provincia');
      } else if(res.error){
        console.log(res.error);
      } 
      else {
        toast.error(res.message || 'Erro ao criar província');
      }
    } catch (error) {
      console.error('Erro na requisição:', error);
      toast.error('Erro ao criar província');
    } finally {
      setSalvando(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-white p-6 rounded shadow">
      <h1 className="text-2xl font-bold text-slate-700 mb-4">Criar Província</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-slate-600 mb-1">Nome</label>
          <input
            type="text"
            className="w-full border rounded p-2 focus:outline-none focus:ring focus:border-cyan-400"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
          />
        </div>
        <div className="flex space-x-2">
          <button
            type="submit"
            disabled={salvando}
            className="bg-cyan-600 text-white px-4 py-2 rounded hover:bg-cyan-700 transition disabled:opacity-50"
          >
            {salvando ? 'Salvando...' : 'Salvar'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/provincia')}
            className="bg-slate-300 text-slate-700 px-4 py-2 rounded hover:bg-slate-400 transition"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}

