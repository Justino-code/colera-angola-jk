// src/components/PageLoader.js
import { useState, useEffect } from 'react';
import LogoLoader from './LogoLoader';

const PageLoader = ({ children, onLoadingComplete }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    // Simula carregamento inicial ou executa função customizada
    const timer = setTimeout(() => {
      if (typeof onLoadingComplete === 'function') {
        onLoadingComplete()
          .then(() => setLoading(false))
          .catch((err) => {
            console.error('Erro no carregamento:', err);
            setLoading(false);
          });
      } else {
        setLoading(false);
      }
    }, 1000); // Ajuste conforme necessário

    return () => clearTimeout(timer);
  }, [onLoadingComplete]);

  if (loading) return <LogoLoader />;

  return children;
};

export default PageLoader;