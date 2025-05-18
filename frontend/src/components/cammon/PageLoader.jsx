import { useState, useEffect } from 'react';
import LogoLoader from './LogoLoader';

const PageLoader = ({ children }) => {
  const [loading, setLoading] = useState(false);

  // Simula o carregamento por 2.5s sempre que a rota muda
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 6500);

    return () => clearTimeout(timer);
  }, []);

  if (loading) return <LogoLoader />;

  return children;
};
export default PageLoader;