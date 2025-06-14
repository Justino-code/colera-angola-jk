import { useContext } from 'react';
import { SettingsContext } from '../SettingsContext';

export default function useSettings() {
  return useContext(SettingsContext);
}
