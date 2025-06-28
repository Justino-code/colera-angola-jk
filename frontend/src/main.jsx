import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext'; // <== IMPORTANTE
import './index.css'; // TailwindCSS e estilos globais

ReactDOM.createRoot(document.getElementById('root')).render(
  //<React.StrictMode>
  <BrowserRouter>
    <AuthProvider>
      <AppRoutes />
      <Toaster
        position="top-right"
        reverseOrder={false}
        toastOptions={{
          style: {
            fontSize: '14px',
            padding: '12px 16px',
            borderRadius: '8px',
          },
          success: {
            style: {
              background: '#059669',
              color: '#fff',
            },
            iconTheme: {
              primary: '#fff',
              secondary: '#059669',
            },
          },
          error: {
            style: {
              background: '#DC2626',
              color: '#fff',
            },
            iconTheme: {
              primary: '#fff',
              secondary: '#DC2626',
            },
          },
        }}
      />
    </AuthProvider>
  </BrowserRouter>
  //</React.StrictMode>
);
