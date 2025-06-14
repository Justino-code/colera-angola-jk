import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      // Simula fetch do user
      setUser({ nome: 'Admin', cargo: 'Gestor' });
    }
  }, []);

  const login = (token) => {
    localStorage.setItem('access_token', token);
    setUser({ nome: 'Admin', cargo: 'Gestor' });
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
