// src/layouts/AuthLayout.jsx
import { Outlet } from 'react-router-dom';

export default function AuthLayout() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-blue-700">
      <div className="bg-white rounded shadow-lg p-8 w-full max-w-md">
        <h1 className="text-center text-2xl font-bold text-blue-700 mb-6">
          Sistema Cólera Angola
        </h1>
        <Outlet />
      </div>
    </div>
  );
}
