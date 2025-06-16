// src/layouts/PrincipalLayout.jsx
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import {
  LogOut, Menu, X, Home, User, Building2, Car, Landmark, Users, Map, MapPin, Sun, Moon
} from 'lucide-react';

export default function PrincipalLayout() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      navigate('/login');
    }

    const savedSidebar = localStorage.getItem('sidebarOpen');
    if (savedSidebar !== null) {
      setSidebarOpen(savedSidebar === 'true');
    }

    const savedTheme = localStorage.getItem('darkMode');
    if (savedTheme !== null) {
      setDarkMode(savedTheme === 'true');
      document.documentElement.classList.toggle('dark', savedTheme === 'true');
    }
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

  return (
    <div className={`min-h-screen flex transition-colors duration-300 ${darkMode ? 'bg-gray-900 text-gray-200' : 'bg-gray-50 text-gray-800'}`}>
      {/* Sidebar */}
      <div className={`transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-16'} flex flex-col
                      ${darkMode ? 'bg-blue-900' : 'bg-blue-700'} text-white`}>
        <div className="flex items-center justify-between p-4 min-h-[56px]">
          {sidebarOpen && (
            <span className="font-bold text-lg">
              🩺 Sistema
            </span>
          )}
          <button onClick={toggleSidebar}>
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
        <nav className="flex-1 flex flex-col gap-2 p-2">
          <SidebarLink to="/dashboard" text="Dashboard" icon={<Home size={20} />} sidebarOpen={sidebarOpen} darkMode={darkMode} />
          <SidebarLink to="/paciente" text="Pacientes" icon={<User size={20} />} sidebarOpen={sidebarOpen} darkMode={darkMode} />
          <SidebarLink to="/hospital" text="Hospitais" icon={<Building2 size={20} />} sidebarOpen={sidebarOpen} darkMode={darkMode} />
          <SidebarLink to="/viatura" text="Viaturas" icon={<Car size={20} />} sidebarOpen={sidebarOpen} darkMode={darkMode} />
          <SidebarLink to="/gabinete" text="Gabinetes" icon={<Landmark size={20} />} sidebarOpen={sidebarOpen} darkMode={darkMode} />
          <SidebarLink to="/usuario" text="Usuários" icon={<Users size={20} />} sidebarOpen={sidebarOpen} darkMode={darkMode} />
          <SidebarLink to="/provincia" text="Províncias" icon={<Map size={20} />} sidebarOpen={sidebarOpen} darkMode={darkMode} />
          <SidebarLink to="/municipio" text="Municípios" icon={<MapPin size={20} />} sidebarOpen={sidebarOpen} darkMode={darkMode} />
          <SidebarLink to="/mapacasos" text="Mapa" icon={<MapPin size={20} />} sidebarOpen={sidebarOpen} darkMode={darkMode} />
        </nav>
        <div className="flex flex-col gap-2 p-2">
          <button
            onClick={toggleTheme}
            className="flex items-center gap-2 bg-gray-600 hover:bg-gray-500 p-2 rounded transition"
          >
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            {sidebarOpen && <span>Tema</span>}
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-500 hover:bg-red-600 p-2 rounded transition"
          >
            <LogOut size={18} /> {sidebarOpen && <span>Sair</span>}
          </button>
        </div>
      </div>

      {/* Main */}
      <div className="flex-1 flex flex-col">
        <header className={`shadow p-4 flex justify-between items-center
                           ${darkMode ? 'bg-gray-800 text-gray-100' : 'bg-white text-gray-900'}`}>
          <h1 className="font-semibold text-xl">Sistema Cólera Angola</h1>
        </header>
        <main className="flex-1 p-4">
          <Outlet />
        </main>
        <footer className={`text-sm text-center py-2 shadow-inner
                            ${darkMode ? 'bg-gray-800 text-gray-400' : 'bg-white text-gray-500'}`}>
          &copy; {new Date().getFullYear()} Sistema Cólera Angola. Todos os direitos reservados.
        </footer>
      </div>
    </div>
  );
}

function SidebarLink({ to, text, icon, sidebarOpen, darkMode }) {
  return (
    <Link
      to={to}
      className={`flex items-center gap-2 p-2 rounded transition 
                  ${darkMode ? 'hover:bg-blue-800' : 'hover:bg-blue-600'}`}
    >
      {icon}
      {sidebarOpen && <span>{text}</span>}
    </Link>
  );
}
