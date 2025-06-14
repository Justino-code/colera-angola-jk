import { useState } from 'react';
import { FiDownload, FiFileText } from 'react-icons/fi';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export default function Reports() {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [reportType, setReportType] = useState('daily');

  const generateReport = () => {
    // Lógica de geração de relatório
  };

  return (
    <div className="p-6">
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <h1 className="text-2xl font-bold text-slate-800 mb-6">Gerar Relatórios</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Relatório</label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="w-full p-2 border rounded-lg"
            >
              <option value="daily">Diário</option>
              <option value="weekly">Semanal</option>
              <option value="monthly">Mensal</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Data Inicial</label>
            <DatePicker
              selected={startDate}
              onChange={date => setStartDate(date)}
              className="w-full p-2 border rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Data Final</label>
            <DatePicker
              selected={endDate}
              onChange={date => setEndDate(date)}
              className="w-full p-2 border rounded-lg"
            />
          </div>
        </div>

        <button
          onClick={generateReport}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg flex items-center gap-2 hover:bg-blue-700"
        >
          <FiDownload /> Gerar Relatório
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-semibold mb-4">Relatórios Gerados</h2>
        <div className="space-y-4">
          {[1, 2, 3].map((report) => (
            <div key={report} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <FiFileText className="text-blue-500" />
                <span>Relatório_{new Date().toISOString().split('T')[0]}.pdf</span>
              </div>
              <button className="text-blue-600 hover:text-blue-800">
                <FiDownload size={20} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}