import { useEffect, useState } from 'react';
import Map from '../components/Map';
import api from '../services/api';

export default function Dashboard() {
  const [hospitals, setHospitals] = useState([]);

  useEffect(() => {
    const fetchHospitals = async () => {
      try {
        const res = await api.get('/hospitals');
        setHospitals(res.data);
      } catch (error) {
        console.error('Erro ao buscar hospitais:', error);
      }
    };
    fetchHospitals();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4">Monitoramento de Casos</h1>
      <div className="border rounded-lg overflow-hidden">
        <Map hospitals={hospitals} />
      </div>
    </div>
  );
}
