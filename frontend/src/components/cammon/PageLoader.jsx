import { useState, useEffect } from 'react';
import LogoLoader from './LogoLoader';

const PageLoader = ({ children, onLoadingComplete }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    const timer = setTimeout(() => {
      // Se não tiver função de carregamento real, libera direto
      if (typeof onLoadingComplete === 'function') {
        onLoadingComplete()
          .catch((err) => console.error('Erro no carregamento:', err))
          .finally(() => setLoading(false));
      } else {
        setLoading(false);
      }
    }, 500); // Tempo inicial do loader

    return () => clearTimeout(timer);
  }, [onLoadingComplete]);

  if (loading) return <LogoLoader />;

  return children;
};

export default PageLoader;