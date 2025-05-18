import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LogoLoader from '../../components/cammon/LogoLoader';

const SplashScreen = () => {
  const navigate = useNavigate();

  // Simula carregamento e navega após 2.5 segundos
  useEffect(() => {
    const timer = setTimeout(() => {
      //navigate('/login', { replace: true });
    }, 2500);
    return () => clearTimeout(timer);
  }, [navigate]);

  return <LogoLoader />;
};

export default SplashScreen;