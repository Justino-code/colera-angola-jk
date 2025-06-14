import { createContext, useState, useEffect } from 'react';

export const SettingsContext = createContext();

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem('user_settings');
    if (stored) {
      setSettings(JSON.parse(stored));
    } else {
      setSettings({
        theme: 'light',
        sidebarOpen: true,
        language: 'pt'
      });
    }
  }, []);

  useEffect(() => {
    if (settings) {
      localStorage.setItem('user_settings', JSON.stringify(settings));
    }
  }, [settings]);

  const updateSetting = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSetting }}>
      {children}
    </SettingsContext.Provider>
  );
}
