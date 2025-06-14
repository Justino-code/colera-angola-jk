import { useEffect, useState } from 'react';
import { apiGet, apiPost } from '../services/api';

export default function ConfiguracoesPage() {
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    apiGet('/configuracoes')
      .then(data => setConfig(data))
      .catch(() => setErro('Erro ao carregar configurações'))
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e) => {
    setConfig({
      ...config,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setErro(null);

    try {
      await apiPost('/configuracoes', config);
      alert('Configurações salvas com sucesso!');
    } catch {
      setErro('Erro ao salvar configurações');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Configurações</h1>

      {erro && <div className="p-4 bg-red-100 text-red-600 rounded">{erro}</div>}

      {loading ? (
        <SkeletonConfiguracoes />
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
          <div>
            <label className="block mb-1 text-sm font-medium">Email de Notificações</label>
            <input
              type="email"
              name="email_notificacao"
              value={config.email_notificacao}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium">Limite de Alerta de Casos</label>
            <input
              type="number"
              name="limite_alerta"
              value={config.limite_alerta}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
              min="1"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium">Região Prioritária</label>
            <input
              type="text"
              name="regiao_prioritaria"
              value={config.regiao_prioritaria}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {saving ? 'Salvando...' : 'Salvar Configurações'}
          </button>
        </form>
      )}
    </div>
  );
}

function SkeletonConfiguracoes() {
  return (
    <div className="space-y-3 max-w-md">
      {Array(3).fill(0).map((_, idx) => (
        <div key={idx}>
          <div className="h-4 bg-slate-200 rounded w-1/3 mb-2"></div>
          <div className="h-10 bg-slate-200 rounded"></div>
        </div>
      ))}
      <div className="h-10 bg-slate-300 rounded mt-4"></div>
    </div>
  );
}
