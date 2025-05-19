import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import LogoLoader from '../components/cammon/LogoLoader';

const RootLayout = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 15000); // Tempo do loader

    return () => clearTimeout(timer);
  }, []);

  if (loading) return <LogoLoader />;

  // Renderiza as páginas filhas com <Outlet />
  return <Outlet />;
};

export default RootLayout;