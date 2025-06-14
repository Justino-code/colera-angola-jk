import { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import PageLoader from "../components/common/PageLoader";
import MainLayout from "../layouts/PrincipalLayout";
import AuthLayout from "../layouts/AuthLayout";

// Lazy import das páginas
const Login = lazy(() => import("../pages/Auth/Login"));
const OverviewPage = lazy(() => import("../pages/OverviewPage"));

// Paciente
const PacienteListar = lazy(() => import("../pages/Paciente/Listar"));
const PacienteCriar = lazy(() => import("../pages/Paciente/Criar"));
const PacienteEditar = lazy(() => import("../pages/Paciente/Editar"));
const PacienteDetalhes = lazy(() => import("../pages/Paciente/Detalhes"));

// Hospital
const HospitalListar = lazy(() => import("../pages/Hospital/Listar"));
const HospitalCriar = lazy(() => import("../pages/Hospital/Criar"));
const HospitalEditar = lazy(() => import("../pages/Hospital/Editar"));
const HospitalDetalhes = lazy(() => import("../pages/Hospital/Detalhes"));

// Viatura
const ViaturaListar = lazy(() => import("../pages/Viatura/Listar"));
const ViaturaCriar = lazy(() => import("../pages/Viatura/Criar"));
const ViaturaEditar = lazy(() => import("../pages/Viatura/Editar"));
const ViaturaDetalhes = lazy(() => import("../pages/Viatura/Detalhes"));

// Gabinete
const GabineteListar = lazy(() => import("../pages/Gabinete/Listar"));
const GabineteCriar = lazy(() => import("../pages/Gabinete/Criar"));
const GabineteEditar = lazy(() => import("../pages/Gabinete/Editar"));
const GabineteDetalhes = lazy(() => import("../pages/Gabinete/Detalhes"));

// Usuario
const UsuarioListar = lazy(() => import("../pages/Usuario/Listar"));
const UsuarioCriar = lazy(() => import("../pages/Usuario/Criar"));
const UsuarioEditar = lazy(() => import("../pages/Usuario/Editar"));
const UsuarioDetalhes = lazy(() => import("../pages/Usuario/Detalhes"));

// Relatório
const RelatorioGerar = lazy(() => import("../pages/Relatorio/Gerar"));
const RelatorioListar = lazy(() => import("../pages/Relatorio/Listar"));
const RelatorioDetalhes = lazy(() => import("../pages/Relatorio/Detalhes"));

export default function AppRoutes() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Rotas de autenticação */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
        </Route>

        {/* Rotas protegidas */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Navigate to="/dashboard" />} />
          <Route path="/dashboard" element={<OverviewPage />} />

          {/* Paciente */}
          <Route path="/paciente" element={<PacienteListar />} />
          <Route path="/paciente/criar" element={<PacienteCriar />} />
          <Route path="/paciente/:id/editar" element={<PacienteEditar />} />
          <Route path="/paciente/:id" element={<PacienteDetalhes />} />

          {/* Hospital */}
          <Route path="/hospital" element={<HospitalListar />} />
          <Route path="/hospital/criar" element={<HospitalCriar />} />
          <Route path="/hospital/:id/editar" element={<HospitalEditar />} />
          <Route path="/hospital/:id" element={<HospitalDetalhes />} />

          {/* Viatura */}
          <Route path="/viatura" element={<ViaturaListar />} />
          <Route path="/viatura/criar" element={<ViaturaCriar />} />
          <Route path="/viatura/:id/editar" element={<ViaturaEditar />} />
          <Route path="/viatura/:id" element={<ViaturaDetalhes />} />

          {/* Gabinete */}
          <Route path="/gabinete" element={<GabineteListar />} />
          <Route path="/gabinete/criar" element={<GabineteCriar />} />
          <Route path="/gabinete/:id/editar" element={<GabineteEditar />} />
          <Route path="/gabinete/:id" element={<GabineteDetalhes />} />

          {/* Usuario */}
          <Route path="/usuario" element={<UsuarioListar />} />
          <Route path="/usuario/criar" element={<UsuarioCriar />} />
          <Route path="/usuario/:id/editar" element={<UsuarioEditar />} />
          <Route path="/usuario/:id" element={<UsuarioDetalhes />} />

          {/* Relatórios */}
          <Route path="/relatorio/gerar" element={<RelatorioGerar />} />
          <Route path="/relatorio/detalhes/:id" element={<RelatorioDetalhes />} />
          <Route path="/relatorio" element={<RelatorioListar />} />
        </Route>

        {/* Fallback para rotas não encontradas */}
        <Route path="*" element={<div className="p-10 text-center text-red-500">Página não encontrada</div>} />
      </Routes>
    </Suspense>
  );
}
