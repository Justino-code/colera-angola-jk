import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import ProtectedRoute from './components/ProtectedRoute';
import Dashboard from './pages/Dashboard';

function App() {
    return (
        <BrowserRouter>
        <Routes>
        {/* Rotas Públicas */}
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Register />} />

        {/* Rotas Protegidas */}
        <Route element={<ProtectedRoute />}>
        <Route path="/" element={<Dashboard />} />
        </Route>
        </Routes>
        </BrowserRouter>
    );
}

export default App;
