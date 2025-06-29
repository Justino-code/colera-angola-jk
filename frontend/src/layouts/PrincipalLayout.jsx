import { Outlet, Link, useNavigate, useMatch } from 'react-router-dom';
import { useEffect, useState } from 'react';
import {
  LogOut, Menu, X, Home, User, Building2, Car, Landmark, Users, 
  Map, MapPin, FileText, Sun, Moon
} from 'lucide-react';
import api from '../services/api';

export default function PrincipalLayout() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) navigate('/login');

    const savedSidebar = localStorage.getItem('sidebarOpen');
    setSidebarOpen(savedSidebar === 'true' || true);

    const savedTheme = localStorage.getItem('darkMode');
    const isDark = savedTheme === 'true';
    setDarkMode(isDark);
    document.documentElement.classList.toggle('dark', isDark);

    async function fetchUser() {
      try {
        const res = await api.get('/me');
        if (res?.success !== false) setUser(res.data || res.user);
      } catch {
        setUser(null);
      }
    }
    fetchUser();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    navigate('/login');
  };

  const toggleSidebar = () => {
    const newState = !sidebarOpen;
    setSidebarOpen(newState);
    localStorage.setItem('sidebarOpen', newState);
  };

  const toggleTheme = () => {
    const newTheme = !darkMode;
    setDarkMode(newTheme);
    localStorage.setItem('darkMode', newTheme);
    document.documentElement.classList.toggle('dark', newTheme);
  };

  const hasRole = (role) => user && user.role === role;
  const hasAnyRole = (roles) => user && roles.includes(user.role);

  return (
    <div className={`flex h-screen w-full overflow-hidden ${
      darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-800'
    }`}>
      {/* Sidebar ocupando toda a altura */}
      <aside
        className={`h-full flex flex-col ${
          sidebarOpen ? 'w-64' : 'w-16'
        } ${
          darkMode ? 'bg-gray-800' : 'bg-white'
        } border-r ${
          darkMode ? 'border-gray-700' : 'border-gray-200'
        }`}
      >
        <div className="flex items-center justify-between p-4 min-h-[60px]">
          {sidebarOpen && (
            <span className="font-bold text-xl tracking-wide">🩺 AngoVIva</span>
          )}
          <button
            onClick={toggleSidebar}
            className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition"
            aria-label={sidebarOpen ? 'Fechar menu' : 'Abrir menu'}
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <nav className={`flex-1 px-2 space-y-1 overflow-y-auto ${
          darkMode ? 'scrollbar-dark' : 'scrollbar-light'
        }`}>
          <SidebarLink to="/dashboard" text="Dashboard" icon={<Home />} sidebarOpen={sidebarOpen} darkMode={darkMode} />
          {hasAnyRole(['admin', 'gestor', 'medico', 'enfermeiro', 'epidemiologista']) && (
            <SidebarLink to="/paciente" text="Pacientes" icon={<User />} sidebarOpen={sidebarOpen} darkMode={darkMode} />
          )}
          {hasAnyRole(['admin', 'gestor', 'medico', 'epidemiologista']) && (
            <SidebarLink to="/hospital" text="Hospitais" icon={<Building2 />} sidebarOpen={sidebarOpen} darkMode={darkMode} />
          )}
          {hasAnyRole(['admin', 'gestor', 'tecnico']) && (
            <SidebarLink to="/viatura" text="Viaturas" icon={<Car />} sidebarOpen={sidebarOpen} darkMode={darkMode} />
          )}
          {hasAnyRole(['admin', 'gestor']) && (
            <SidebarLink to="/gabinete" text="Gabinetes" icon={<Landmark />} sidebarOpen={sidebarOpen} darkMode={darkMode} />
          )}
          {hasRole('admin') && (
            <SidebarLink to="/usuario" text="Usuários" icon={<Users />} sidebarOpen={sidebarOpen} darkMode={darkMode} />
          )}
          {hasAnyRole(['admin', 'gestor', 'epidemiologista']) && (
            <>
              <SidebarLink to="/provincia" text="Províncias" icon={<Map />} sidebarOpen={sidebarOpen} darkMode={darkMode} />
              <SidebarLink to="/municipio" text="Municípios" icon={<MapPin />} sidebarOpen={sidebarOpen} darkMode={darkMode} />
            </>
          )}
          <SidebarLink to="/relatorio" text="Relatórios" icon={<FileText />} sidebarOpen={sidebarOpen} darkMode={darkMode} />
          <SidebarLink to="/mapacasos" text="Mapa" icon={<MapPin />} sidebarOpen={sidebarOpen} darkMode={darkMode} />
        </nav>
      </aside>

      {/* Área principal com header e conteúdo */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Header com botões de tema e sair */}
        <header className={`min-h-[60px] px-6 flex items-center justify-between ${
          darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
        } border-b ${
          darkMode ? 'border-gray-700' : 'border-gray-200'
        }`}>
          <div className="flex items-center">
            <h1 className="text-xl font-semibold">Angola Viva</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            {user && (
              <div className="text-sm">
                <span className="font-medium">{user.nome || user.name}</span>
                <span className="ml-2 px-2 py-1 rounded bg-blue-100 text-blue-800 text-xs dark:bg-blue-900 dark:text-blue-200">
                  {user.role}
                </span>
              </div>
            )}
            
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-full ${
                darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
              } transition`}
              aria-label="Alternar tema"
            >
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            
            <button
              onClick={handleLogout}
              className={`p-2 rounded-full ${
                darkMode ? 'hover:bg-gray-700 text-red-400' : 'hover:bg-gray-100 text-red-600'
              } transition`}
              aria-label="Sair"
            >
              <LogOut size={18} />
            </button>
          </div>
        </header>

        {/* Conteúdo principal - sem margens laterais */}
        <main className={`flex-1 overflow-auto ${
          darkMode ? 'bg-gray-900' : 'bg-gray-50'
        }`}>
          <Outlet />
        </main>

        {/* Footer sem margens laterais */}
        <footer className={`py-3 px-6 text-sm ${
          darkMode ? 'bg-gray-800 text-gray-400' : 'bg-white text-gray-500'
        } border-t ${
          darkMode ? 'border-gray-700' : 'border-gray-200'
        }`}>
          &copy; {new Date().getFullYear()} Angola Viva. Todos os direitos reservados.
        </footer>
      </div>
    </div>
  );
}

function SidebarLink({ to, text, icon, sidebarOpen, darkMode }) {
  const isActive = useMatch(to);

  return (
    <Link
      to={to}
      className={`flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-all duration-200
                  ${isActive
                    ? 'bg-blue-600 text-white font-medium'
                    : ''
                  } ${
                    darkMode
                      ? 'hover:bg-gray-700 text-gray-200'
                      : 'hover:bg-gray-100 text-gray-700'
                  }`}
    >
      {icon}
      {sidebarOpen && <span>{text}</span>}
    </Link>
  );
}