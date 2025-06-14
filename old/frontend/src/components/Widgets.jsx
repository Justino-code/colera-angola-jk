export function RecentPatients() {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <h3 className="text-lg font-semibold mb-4">Pacientes Recentes</h3>
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                🧑⚕️
              </div>
              <div>
                <p className="font-medium">Maria Fernandes</p>
                <p className="text-sm text-gray-500">Alto Risco • 32 anos</p>
              </div>
            </div>
            <span className="text-sm text-blue-600">Ver detalhes</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function AmbulanceStatus() {
  const statusColors = {
    disponivel: 'bg-green-100 text-green-800',
    em_viagem: 'bg-amber-100 text-amber-800',
    ocupada: 'bg-rose-100 text-rose-800',
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <h3 className="text-lg font-semibold mb-4">Status das Ambulâncias</h3>
      <div className="grid grid-cols-2 gap-4">
        {['AMB-001', 'AMB-002', 'AMB-003', 'AMB-004'].map((ambulance, i) => (
          <div key={ambulance} className="p-4 rounded-lg border">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium">{ambulance}</span>
              <span className={`px-2 py-1 rounded-full text-xs ${statusColors[['disponivel', 'em_viagem', 'ocupada'][i % 3]]}`}>
                {['Disponível', 'Em Viagem', 'Ocupada'][i % 3]}
              </span>
            </div>
            <p className="text-sm text-gray-500">Hospital Central • 12km</p>
          </div>
        ))}
      </div>
    </div>
  );
}