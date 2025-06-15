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
const ListarUsuarios = lazy(() => import("../pages/Usuario/Listar"));
const CriarUsuario = lazy(() => import("../pages/Usuario/Criar"));
const EditarUsuario = lazy(() => import("../pages/Usuario/Editar"));
const DetalhesUsuario = lazy(() => import("../pages/Usuario/Detalhes"));

// Relatório
const RelatorioGerar = lazy(() => import("../pages/Relatorio/Gerar"));
const RelatorioListar = lazy(() => import("../pages/Relatorio/Listar"));
const RelatorioDetalhes = lazy(() => import("../pages/Relatorio/Detalhes"));

// Provincia
const ProvinciaListar = lazy(() => import("../pages/Provincia/Listar"));
const ProvinciaCriar = lazy(() => import("../pages/Provincia/Criar"));
const ProvinciaEditar = lazy(() => import("../pages/Provincia/Editar"));
const ProvinciaDetalhes = lazy(() => import("../pages/Provincia/Detalhes"));

// Município
const MunicipioListar = lazy(() => import("../pages/Municipio/Listar"));
const MunicipioCriar = lazy(() => import("../pages/Municipio/Criar"));
const MunicipioEditar = lazy(() => import("../pages/Municipio/Editar"));
const MunicipioDetalhes = lazy(() => import("../pages/Municipio/Detalhes"));

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
          <Route path="/usuario" element={<ListarUsuarios />} />
          <Route path="/usuario/criar" element={<CriarUsuario />} />
          <Route path="/usuario/:id/editar" element={<EditarUsuario />} />
          <Route path="/usuario/:id" element={<DetalhesUsuario />} />

          {/* Relatórios */}
          <Route path="/relatorio/gerar" element={<RelatorioGerar />} />
          <Route path="/relatorio/detalhes/:id" element={<RelatorioDetalhes />} />
          <Route path="/relatorio" element={<RelatorioListar />} />

          {/* Provincia */}
          <Route path="/provincia" element={<ProvinciaListar />} />
          <Route path="/provincia/criar" element={<ProvinciaCriar />} />
          <Route path="/provincia/:id/editar" element={<ProvinciaEditar />} />
          <Route path="/provincia/:id" element={<ProvinciaDetalhes />} />

          {/* Município */}
          <Route path="/municipio" element={<MunicipioListar />} />
          <Route path="/municipio/criar" element={<MunicipioCriar />} />
          <Route path="/municipio/:id/editar" element={<MunicipioEditar />} />
          <Route path="/municipio/:id" element={<MunicipioDetalhes />} />
        </Route>

        {/* Fallback para rotas não encontradas */}
        <Route path="*" element={<div className="p-10 text-center text-red-500">Página não encontrada</div>} />
      </Routes>
    </Suspense>
  );
}
