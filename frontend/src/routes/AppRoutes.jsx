import { Routes, Route, Navigate } from 'react-router-dom';
import PrincipalLayout from '../layouts/PrincipalLayout';
import AuthLayout from '../layouts/AuthLayout';

// Páginas públicas
import Login from '../pages/Auth/Login';

// Páginas protegidas
import DashboardPage from '../pages/OverviewPage';

// Paciente
import PacienteListar from '../pages/Paciente/Listar';
import PacienteCriar from '../pages/Paciente/Criar';
import PacienteEditar from '../pages/Paciente/Editar';
import PacienteDetalhes from '../pages/Paciente/Detalhes';

// Hospital
import HospitalListar from '../pages/Hospital/Listar';
import HospitalCriar from '../pages/Hospital/Criar';
import HospitalEditar from '../pages/Hospital/Editar';
import HospitalDetalhes from '../pages/Hospital/Detalhes';

// Viatura
import ViaturaListar from '../pages/Viatura/Listar';
import ViaturaCriar from '../pages/Viatura/Criar';
import ViaturaEditar from '../pages/Viatura/Editar';
import ViaturaDetalhes from '../pages/Viatura/Detalhes';

// Gabinete
import GabineteListar from '../pages/Gabinete/Listar';
import GabineteCriar from '../pages/Gabinete/Criar';
import GabineteEditar from '../pages/Gabinete/Editar';
import GabineteDetalhes from '../pages/Gabinete/Detalhes';

// Usuário
import UsuarioListar from '../pages/Usuario/Listar';
import UsuarioCriar from '../pages/Usuario/Criar';
import UsuarioEditar from '../pages/Usuario/Editar';
import UsuarioDetalhes from '../pages/Usuario/Detalhes';

// Relatório
import RelatorioGerar from '../pages/Relatorio/Gerar';
import RelatorioDetalhes from '../pages/Relatorio/Detalhes';
import RelatorioListar from '../pages/Relatorio/Listar';

// Província
import ProvinciaListar from '../pages/Provincia/Listar';
import ProvinciaCriar from '../pages/Provincia/Criar';
import ProvinciaEditar from '../pages/Provincia/Editar';
import ProvinciaDetalhes from '../pages/Provincia/Detalhes';

// Município
import MunicipioListar from '../pages/Municipio/Listar';
import MunicipioCriar from '../pages/Municipio/Criar';
import MunicipioEditar from '../pages/Municipio/Editar';
import MunicipioDetalhes from '../pages/Municipio/Detalhes';

export default function AppRoutes() {
  const isAuthenticated = !!localStorage.getItem('access_token');

  return (
    <Routes>
      {/* Rotas públicas */}
      <Route path="/" element={<AuthLayout />}>
        <Route path="login" element={<Login />} />
      </Route>

      {/* Rotas protegidas */}
      <Route path="/" element={isAuthenticated ? <PrincipalLayout /> : <Navigate to="/login" />}>
        <Route index element={<Navigate to="dashboard" />} />
        <Route path="dashboard" element={<DashboardPage />} />

        {/* Paciente */}
        <Route path="paciente" element={<PacienteListar />} />
        <Route path="paciente/criar" element={<PacienteCriar />} />
        <Route path="paciente/editar/:id" element={<PacienteEditar />} />
        <Route path="paciente/detalhes/:id" element={<PacienteDetalhes />} />

        {/* Hospital */}
        <Route path="hospital" element={<HospitalListar />} />
        <Route path="hospital/criar" element={<HospitalCriar />} />
        <Route path="hospital/editar/:id" element={<HospitalEditar />} />
        <Route path="hospital/detalhes/:id" element={<HospitalDetalhes />} />

        {/* Viatura */}
        <Route path="viatura" element={<ViaturaListar />} />
        <Route path="viatura/criar" element={<ViaturaCriar />} />
        <Route path="viatura/editar/:id" element={<ViaturaEditar />} />
        <Route path="viatura/detalhes/:id" element={<ViaturaDetalhes />} />

        {/* Gabinete */}
        <Route path="gabinete" element={<GabineteListar />} />
        <Route path="gabinete/criar" element={<GabineteCriar />} />
        <Route path="gabinete/editar/:id" element={<GabineteEditar />} />
        <Route path="gabinete/detalhes/:id" element={<GabineteDetalhes />} />

        {/* Usuário */}
        <Route path="usuario" element={<UsuarioListar />} />
        <Route path="usuario/criar" element={<UsuarioCriar />} />
        <Route path="usuario/editar/:id" element={<UsuarioEditar />} />
        <Route path="usuario/detalhes/:id" element={<UsuarioDetalhes />} />

        {/* Relatórios */}
        <Route path="relatorio/gerar" element={<RelatorioGerar />} />
        <Route path="relatorio/detalhes/:id" element={<RelatorioDetalhes />} />
        <Route path="relatorio" element={<RelatorioListar />} />

        {/* Província */}
        <Route path="provincia" element={<ProvinciaListar />} />
        <Route path="provincia/criar" element={<ProvinciaCriar />} />
        <Route path="provincia/editar/:id" element={<ProvinciaEditar />} />
        <Route path="provincia/detalhes/:id" element={<ProvinciaDetalhes />} />

        {/* Município */}
        <Route path="municipio" element={<MunicipioListar />} />
        <Route path="municipio/criar" element={<MunicipioCriar />} />
        <Route path="municipio/editar/:id" element={<MunicipioEditar />} />
        <Route path="municipio/detalhes/:id" element={<MunicipioDetalhes />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} />} />
    </Routes>
  );
}
