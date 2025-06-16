import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import toast from 'react-hot-toast';

export default function ProvinciaDetalhes() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [provincia, setProvincia] = useState(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    api.get(`/provincias/${id}`)
      .then(res => {
        if (res.data.success) {
          setProvincia(res.data.data);
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
  if (carregando) {
    return <div className="text-center py-10">Carregando...</div>;
  }

  return (
    <div className="max-w-lg mx-auto bg-white p-6 rounded shadow">
      <h1 className="text-2xl font-bold text-slate-700 mb-4">Detalhes da Província</h1>
      <p><strong className="text-slate-600">Nome:</strong> {provincia.nome}</p>
      <p><strong className="text-slate-600">Código ISO:</strong> {provincia.codigo_iso}</p>
      <p><strong className="text-slate-600">Criado em:</strong> {new Date(provincia.created_at).toLocaleString()}</p>
      {provincia.updated_at && (
        <p><strong className="text-slate-600">Atualizado em:</strong> {new Date(provincia.updated_at).toLocaleString()}</p>
      )}
      <div className="mt-4 flex space-x-2">
        <button onClick={() => navigate(`/provincia/editar/${provincia.id}`)} className="bg-cyan-600 text-white px-4 py-2 rounded hover:bg-cyan-700 transition">
          Editar
        </button>
        <button onClick={() => navigate('/provincia')} className="bg-slate-300 text-slate-700 px-4 py-2 rounded hover:bg-slate-400 transition">
          Voltar
        </button>
      </div>
    </div>
  );
}

