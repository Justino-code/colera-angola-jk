import { useState } from 'react';

const usePageLoader = () => {
  const [loading, setLoading] = useState(true);

  const hideLoader = () => {
    setLoading(false);
  };

  return { loading, hideLoader };
};

export default usePageLoader;