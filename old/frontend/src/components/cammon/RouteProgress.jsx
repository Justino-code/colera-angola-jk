import { useLocation } from 'react-router-dom';
import { useEffect } from 'react';

const RouteProgress = () => {
  useEffect(() => {
    // Dispara imediatamente ao mudar de rota
    window.dispatchEvent(new Event('startNavigation'));

    const timer = setTimeout(() => {
      window.dispatchEvent(new Event('completeNavigation'));
    }, 300);

    return () => clearTimeout(timer);
  }, [location]);

  return null;
};

export default RouteProgress;