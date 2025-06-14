import useSettings from '../../config/hooks/useSettings';
import ConfiguracoesSkeleton from './Skeleton';

export default function ConfiguracoesIndex() {
  const { settings, updateSetting } = useSettings();

  if (!settings) return <ConfiguracoesSkeleton />;

  return (
    <div className="p-6 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Configurações</h2>

      <div className="space-y-4">
        {/* Tema */}
        <div className="flex justify-between items-center">
          <span>Tema atual: {settings.theme}</span>
          <button
            onClick={() => updateSetting('theme', settings.theme === 'light' ? 'dark' : 'light')}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            Alternar Tema
          </button>
        </div>

        {/* Sidebar */}
        <div className="flex justify-between items-center">
          <span>Sidebar: {settings.sidebarOpen ? 'Aberta' : 'Fechada'}</span>
          <button
            onClick={() => updateSetting('sidebarOpen', !settings.sidebarOpen)}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            Alternar Sidebar
          </button>
        </div>

        {/* Idioma */}
        <div className="flex justify-between items-center">
          <span>Idioma: {settings.language}</span>
          <select
            value={settings.language}
            onChange={e => updateSetting('language', e.target.value)}
            className="border rounded p-2"
          >
            <option value="pt">Português</option>
            <option value="en">Inglês</option>
          </select>
        </div>
      </div>
    </div>
  );
}
