import { useEffect } from 'react';
import NProgress from 'nprogress';

const useNavigationProgress = () => {
  useEffect(() => {
    NProgress.configure({ showSpinner: false });

    const handleStart = () => NProgress.start();
    const handleComplete = () => NProgress.done();

    window.addEventListener('startNavigation', handleStart);
    window.addEventListener('completeNavigation', handleComplete);

    return () => {
      window.removeEventListener('startNavigation', handleStart);
      window.removeEventListener('completeNavigation', handleComplete);
    };
  }, []);

  return null;
};

export default useNavigationProgress;
