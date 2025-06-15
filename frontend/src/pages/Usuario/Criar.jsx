import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

export default function CriarUsuario() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ nome: '', email: '', senha: '', cargo: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/usuario', form);
      navigate('/usuarios');
    } catch (error) {
      console.error('Erro ao criar usuário:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Criar Usuário</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {['nome', 'email', 'senha', 'cargo'].map((field) => (
          <div key={field}>
            <label className="block mb-1 capitalize">{field}</label>
            <input
              type={field === 'senha' ? 'password' : 'text'}
              className="w-full border rounded p-2"
              value={form[field]}
              onChange={(e) => setForm({ ...form, [field]: e.target.value })}
              required
            />
          </div>
        ))}
        <button type="submit" disabled={loading}
                className="bg-cyan-600 text-white px-4 py-2 rounded">
          {loading ? 'Salvando...' : 'Salvar'}
        </button>
      </form>
    </div>
  );
}
