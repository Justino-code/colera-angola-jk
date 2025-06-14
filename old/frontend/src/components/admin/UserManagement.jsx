import { useEffect, useState } from 'react';
import api from '../../services/api';

export default function UserManagement() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const response = await api.get('/users');
      setUsers(response.data);
    };
    fetchUsers();
  }, []);

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Gestão de Usuários</h2>
      <table className="min-w-full divide-y divide-gray-200">
        {/* Tabela de usuários similar à de pacientes */}
      </table>
    </div>
  );
}
