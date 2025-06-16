import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import toast from 'react-hot-toast';

export default function ProvinciaListar() {
  const [provincias, setProvincias] = useState([]);

  useEffect(() => {
    api.get('/provincias')
      .then(res => {
        if (res.data.success) {
          setProvincias(res.data.data);
        } else {
          toast.error(res.data.message || 'Erro ao carregar províncias');
        }
      })
      .catch(err => {
        console.error('Erro na requisição:', err);
        toast.error('Erro ao carregar províncias');
      });
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Tem certeza que deseja apagar esta província?')) return;
    try {
      const res = await api.delete(`/provincias/${id}`);
      if (res.data.success) {
        toast.success(res.data.message || 'Província eliminada');
        setProvincias(prev => prev.filter(p => p.id !== id));
      } else {
        toast.error(res.data.message || 'Erro ao eliminar província');
      }
    } catch (err) {
      console.error('Erro na requisição:', err);
      toast.error('Erro ao eliminar província');
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded shadow">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-slate-700">Provincias</h1>
        <Link to="/provincia/criar" className="bg-cyan-600 text-white px-4 py-2 rounded hover:bg-cyan-700 transition">Nova</Link>
      </div>
      {provincias.length === 0 ? (
        <p className="text-slate-500">Nenhuma província cadastrada.</p>
      ) : (
        <table className="w-full text-left border">
          <thead>
            <tr className="bg-slate-100">
              <th className="p-2">Nome</th>
              <th className="p-2">Código ISO</th>
              <th className="p-2">Ações</th>
            </tr>
          </thead>
          <tbody>
            {provincias.map(p => (
              <tr key={p.id} className="border-t">
                <td className="p-2">{p.nome}</td>
                <td className="p-2">{p.codigo_iso}</td>
                <td className="p-2 space-x-2">
                  <Link to={`/provincia/${p.id}`} className="text-cyan-600 hover:underline">Ver</Link>
                  <Link to={`/provincia/editar/${p.id}`} className="text-yellow-600 hover:underline">Editar</Link>
                  <button onClick={() => handleDelete(p.id)} className="text-red-600 hover:underline">Apagar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

