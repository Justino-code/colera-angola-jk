// src/layouts/DashboardLayout.js
import { Outlet, Link } from 'react-router-dom';
import { FiMenu, FiX, FiHome, FiUsers, FiMap, FiFileText, FiSettings } from 'react-icons/fi';
import { useState } from 'react';

export default function DashboardLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar Mobile */}
      <div className={`fixed inset-0 z-40 bg-black/50 lg:hidden ${isSidebarOpen ? 'block' : 'hidden'}`}
           onClick={() => setIsSidebarOpen(false)} />

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-gradient-to-b from-slate-900 to-slate-800 transform transition-all duration-300 
                        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
        <div className="flex items-center justify-between p-6 border-b border-slate-700">
          <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
            HealthGuard
          </h1>
          <button onClick={() => setIsSidebarOpen(false)} className="text-slate-400 lg:hidden">
            <FiX size={24} />
          </button>
        </div>

        <nav className="p-4 space-y-2">
          {[
            { to: '/', icon: FiHome, text: 'Visão Geral' },
            { to: '/pacientes', icon: FiUsers, text: 'Pacientes' },
            { to: '/mapa', icon: FiMap, text: 'Mapa de Casos' },
            { to: '/relatorios', icon: FiFileText, text: 'Relatórios' },
            { to: '/configuracoes', icon: FiSettings, text: 'Configurações' },
          ].map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="flex items-center p-3 space-x-3 text-slate-300 hover:bg-slate-800/50 rounded-lg transition-all"
            >
              <item.icon className="flex-shrink-0" />
              <span>{item.text}</span>
            </Link>
          ))}
        </nav>
      </aside>

      {/* Conteúdo Principal */}
      <div className="lg:pl-64">
        {/* Header */}
        <header className="sticky top-0 z-30 bg-white/95 backdrop-blur border-b">
          <div className="flex items-center justify-between px-6 py-4">
            <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden text-slate-600">
              <FiMenu size={24} />
            </button>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="font-medium">Dr. João Silva</p>
                <p className="text-sm text-slate-500">Médico Chefe</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600" />
            </div>
          </div>
        </header>

        {/* Conteúdo Dinâmico */}
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}