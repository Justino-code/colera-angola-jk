// src/layouts/PrincipalLayout.jsx
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

export default function PrincipalLayout() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-blue-600 text-white p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">🩺 Sistema Cólera Angola</h1>
        <nav className="space-x-4">
          <Link to="/dashboard" className="hover:underline">Dashboard</Link>
          <Link to="/paciente" className="hover:underline">Pacientes</Link>
          <Link to="/hospital" className="hover:underline">Hospitais</Link>
          <Link to="/viatura" className="hover:underline">Viaturas</Link>
          <Link to="/gabinete" className="hover:underline">Gabinetes</Link>
          <Link to="/usuario" className="hover:underline">Usuários</Link>
          <Link to="/provincia" className="hover:underline">Províncias</Link>
          <Link to="/municipio" className="hover:underline">Municípios</Link>
          <button onClick={handleLogout} className="bg-red-500 px-2 py-1 rounded">Sair</button>
        </nav>
      </header>
      
      <main className="flex-1 p-4 bg-gray-50">
        <Outlet />
      </main>

      <footer className="bg-blue-600 text-white p-2 text-center">
        &copy; {new Date().getFullYear()} Sistema Cólera Angola
      </footer>
    </div>
  );
}
