import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../services/api';
import Skeleton from '../../components/common/Skeleton';

export default function EditarUsuario() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    nome: '',
    email: '',
    password: '',
    password_confirmation: '',
    role: '',
    permissoes: [],
    id_hospital: '',
    id_gabinete: ''
  });
  const [hospitais, setHospitais] = useState([]);
  const [gabinetes, setGabinetes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usuarioRes, hospitaisRes, gabinetesRes] = await Promise.all([
          api.get(`/usuario/${id}`),
          api.get('/hospitais'),
          api.get('/gabinetes')
        ]);

        setForm({
          nome: usuarioRes.nome || '',
          email: usuarioRes.email || '',
          password: '',
          password_confirmation: '',
          role: usuarioRes.role || '',
          permissoes: usuarioRes.permissoes || [],
          id_hospital: usuarioRes.id_hospital || '',
          id_gabinete: usuarioRes.id_gabinete || ''
        });

        setHospitais(hospitaisRes);
        setGabinetes(gabinetesRes);

      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const dataToSend = { ...form };
      if (!form.password) {
        delete dataToSend.password;
        delete dataToSend.password_confirmation;
      }
      await api.put(`/usuario/${id}`, dataToSend);
      navigate('/usuarios');
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
    } finally {
      setSaving(false);
    }
  };

  const handlePermissoesChange = (e) => {
    setForm({ ...form, permissoes: e.target.value.split(',').map(p => p.trim()) });
  };

  if (loading) return <Skeleton />;

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Editar Usuário</h2>
      <form onSubmit={handleSubmit} className="space-y-4">

        {/* Campos básicos */}
        {['nome', 'email', 'role'].map(field => (
          <div key={field}>
            <label className="block mb-1 capitalize">{field}</label>
            <input
              type="text"
              className="w-full border rounded p-2"
              value={form[field]}
              onChange={(e) => setForm({ ...form, [field]: e.target.value })}
              required
            />
          </div>
        ))}

        {/* Permissões */}
        <div>
          <label className="block mb-1">Permissões (separadas por vírgula)</label>
          <input
            type="text"
            className="w-full border rounded p-2"
            value={form.permissoes.join(', ')}
            onChange={handlePermissoesChange}
          />
        </div>

        {/* Senha */}
        <div>
          <label className="block mb-1">Nova senha</label>
          <input
            type="password"
            className="w-full border rounded p-2"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
        </div>

        <div>
          <label className="block mb-1">Confirmação da nova senha</label>
          <input
            type="password"
            className="w-full border rounded p-2"
            value={form.password_confirmation}
            onChange={(e) => setForm({ ...form, password_confirmation: e.target.value })}
          />
        </div>

        {/* Hospital */}
        <div>
          <label className="block mb-1">Hospital</label>
          <select
            className="w-full border rounded p-2"
            value={form.id_hospital || ''}
            onChange={(e) => setForm({ ...form, id_hospital: e.target.value })}
          >
            <option value="">Selecione um hospital</option>
            {hospitais.map(h => (
              <option key={h.id_hospital} value={h.id_hospital}>{h.nome}</option>
            ))}
          </select>
        </div>

        {/* Gabinete */}
        <div>
          <label className="block mb-1">Gabinete</label>
          <select
            className="w-full border rounded p-2"
            value={form.id_gabinete || ''}
            onChange={(e) => setForm({ ...form, id_gabinete: e.target.value })}
          >
            <option value="">Selecione um gabinete</option>
            {gabinetes.map(g => (
              <option key={g.id_gabinete} value={g.id_gabinete}>{g.nome}</option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="bg-amber-600 text-white px-4 py-2 rounded"
        >
          {saving ? 'Salvando...' : 'Salvar Alterações'}
        </button>

      </form>
    </div>
  );
}

