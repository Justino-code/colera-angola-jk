// src/components/Charts.jsx

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
  Title,
} from 'chart.js';

import { Bar, Pie } from 'react-chartjs-2';

// ✅ Registrar todos os elementos necessários
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
  Title
);

export function BarChart() {
  return (
    <Bar
      data={{
        labels: ['Luanda', 'Bengo', 'Huíla', 'Cabinda', 'Malanje'],
        datasets: [{
          label: 'Casos Confirmados',
          data: [650, 230, 420, 180, 350],
          backgroundColor: '#3B82F6',
          borderRadius: 8,
        }]
      }}
      options={{
        responsive: true,
        plugins: {
          legend: { display: false }
        }
      }}
    />
  );
}

export function PieChart() {
  return (
    <Pie
      data={{
        labels: ['Alto Risco', 'Médio Risco', 'Baixo Risco'],
        datasets: [{
          data: [45, 30, 25],
          backgroundColor: ['#EF4444', '#F59E0B', '#10B981']
        }]
      }}
      options={{
        responsive: true,
        plugins: {
          legend: { position: 'right' }
        }
      }}
    />
  );
}
