import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';
import { Toaster } from 'react-hot-toast';
import './index.css';  // TailwindCSS e estilos globais

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AppRoutes />
      <Toaster
  position="top-right"
  reverseOrder={false}
  toastOptions={{
    // Estilo global padrão
    style: {
      fontSize: '14px',
      padding: '12px 16px',
      borderRadius: '8px',
    },
    // Toast de sucesso
    success: {
      style: {
        background: '#059669', // verde-emerald (Tailwind green-600)
        color: '#fff',
      },
      iconTheme: {
        primary: '#fff',
        secondary: '#059669',
      },
    },
    // Toast de erro
    error: {
      style: {
        background: '#DC2626', // red-600
        color: '#fff',
      },
      iconTheme: {
        primary: '#fff',
        secondary: '#DC2626',
      },
    },
  }}
/>

    </BrowserRouter>
  </React.StrictMode>
);
