import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Páginas
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import SplashScreen from './pages/Splash/SplashScreen';
import RouteProgress from './components/cammon/RouteProgress';

// Layouts
import DashboardLayout from './layouts/DashboardLayout';

// Páginas do Dashboard
import Overview from './pages/Dashboard/Overview';
import PatientList from './pages/Paciente/PacienteList';
import PatientDetails from './pages/Paciente/PacienteDetails';
import EpidemicMap from './pages/Map/EpidemicMap';
import Reports from './pages/Reports/Reports';
import Settings from './pages/Settings/Settings';

// Hospitais
import HospitalList from './pages/Hospital/HospitalList';
import HospitalForm from './pages/Hospital/HospitalForm';

// Pontos de Atendimento
import PontosAtendimento from './pages/Hospital/PontosAtendimento';
import PontosAtendimentoForm from './pages/Hospital/PontosAtendimentoForm';

// Usuários
import UserList from './pages/Usuario/UserList';
import UserForm from './pages/Usuario/UserForm';

// Componentes
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
	  {/* Barra de progresso global */}
      <RouteProgress />
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#2D2D2D',
            color: '#F1F1F1',
            padding: '14px 20px',
            borderRadius: '10px',
            fontSize: '15px',
            boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
            fontFamily: `'Segoe UI', Tahoma, Geneva, Verdana, sans-serif`,
          },
          success: {
            iconTheme: {
              primary: '#22c55e',
              secondary: '#ffffff',
            },
            style: {
              background: '#1E3A2F',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#ffffff',
            },
            style: {
              background: '#3B1F1F',
            },
          },
        }}
      />

      <Routes>
        {/* Rota Inicial - Splash Screen */}

        {/* Rotas Públicas */}
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Register />} />

        {/* Rotas Protegidas com Layout de Dashboard */}
        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            {/* Página Inicial/Dashboard */}
            <Route index element={<Overview />} />
            
            {/* Gestão de Pacientes */}
            <Route path="/pacientes" element={<PatientList />} />
            <Route path="/pacientes/:id" element={<PatientDetails />} />
            
            {/* Mapa Epidemiológico */}
            <Route path="/mapa" element={<EpidemicMap />} />
            
            {/* Relatórios */}
            <Route path="/relatorios" element={<Reports />} />
            
            {/* Configurações */}
            <Route path="/configuracoes" element={<Settings />} />

            {/* Hospitais */}
            <Route path="/hospital" element={<HospitalList />} />
            <Route path="/hospital/novo" element={<HospitalForm />} />
            <Route path="/hospital/:id" element={<HospitalForm />} />

            {/* Usuários */}
            <Route path="/usuario" element={<UserList />} />
            <Route path="/usuario/novo" element={<UserForm />} />
            <Route path="/usuario/:id" element={<UserForm />} />

            {/* Pontos de Atendimento */}
            <Route path="/pontos-atendimento" element={<PontosAtendimento />} />
            <Route path="/pontos-atendimento/novo" element={<PontosAtendimentoForm />} />
            <Route path="/pontos-atendimento/:id" element={<PontosAtendimentoForm />} />

            {/* Página 404 Personalizada (Opcional) */}
            <Route path="*" element={<div className="p-6 text-center">Página não encontrada</div>} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;