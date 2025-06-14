import { useState } from 'react';
import api from '../../services/api';
import { saveAs } from 'file-saver';

export default function ReportGenerator() {
  const [reportType, setReportType] = useState('casos_por_regiao');

  const handleGenerate = async () => {
    try {
      const response = await api.get(`/reports?type=${reportType}`, {
        responseType: 'blob'
      });
      saveAs(response.data, `relatorio_${Date.now()}.pdf`);
    } catch (error) {
      alert('Erro ao gerar relatório!');
    }
  };

  return (
    <div className="space-y-4">
      <select
        value={reportType}
        onChange={(e) => setReportType(e.target.value)}
        className="p-2 border rounded"
      >
        <option value="casos_por_regiao">Casos por Região</option>
        <option value="evolucao_temporal">Evolução Temporal</option>
      </select>
      
      <button
        onClick={handleGenerate}
        className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
      >
        Gerar Relatório PDF
      </button>
    </div>
  );
}
