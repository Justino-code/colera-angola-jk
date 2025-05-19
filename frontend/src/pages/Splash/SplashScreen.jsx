import { useEffect, useState } from 'react';
import LogoLoader from '../../components/cammon/LogoLoader';

const SplashScreen = ({ children }) => {
  const [showLoader, setShowLoader] = useState(true);

  useEffect(() => {
    const hasVisited = localStorage.getItem('hasVisited');

    if (hasVisited) {
      // Já visitou antes → pula o loader
      setShowLoader(false);
    } else {
      // Primeira visita → mostra o loader e marca como visitado
      const timer = setTimeout(() => {
        localStorage.setItem('hasVisited', 'true');
        setShowLoader(false);
      }, 2500); // Tempo do loader (2.5s)

      return () => clearTimeout(timer);
    }
  }, []);

  if (showLoader) {
    return <LogoLoader />;
  }

  return children;
};

export default SplashScreen;