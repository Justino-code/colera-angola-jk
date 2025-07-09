import { BarChart as ReBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { PieChart as RePieChart, Pie, Cell, Tooltip as PieTooltip, Legend as PieLegend, ResponsiveContainer as PieResponsiveContainer } from 'recharts';

const colorPalette = [
  '#3b82f6', // blue-500
  '#10b981', // emerald-500
  '#f59e0b', // amber-500
  '#ef4444', // red-500
  '#8b5cf6', // violet-500
  '#ec4899', // pink-500
  '#14b8a6', // teal-500
  '#f97316', // orange-500
];

export function BarChart({ data, height = 300, barSize = 30 }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <ReBarChart
        data={data}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis 
          dataKey="name" 
          tick={{ fill: '#6b7280' }} 
          axisLine={{ stroke: '#e5e7eb' }}
        />
        <YAxis 
          tick={{ fill: '#6b7280' }} 
          axisLine={{ stroke: '#e5e7eb' }}
        />
        <Tooltip 
          contentStyle={{
            backgroundColor: '#fff',
            border: '1px solid #e5e7eb',
            borderRadius: '0.375rem',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}
        />
        <Legend 
          wrapperStyle={{ paddingTop: '20px' }}
        />
        <Bar 
          dataKey="value" 
          fill={colorPalette[0]} 
          radius={[4, 4, 0, 0]}
          barSize={barSize}
        />
      </ReBarChart>
    </ResponsiveContainer>
  );
}

export function PieChart({ data, height = 300 }) {
  return (
    <PieResponsiveContainer width="100%" height={height}>
      <RePieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={80}
          paddingAngle={5}
          dataKey="value"
          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
          labelLine={false}
        >
          {data.map((entry, index) => (
            <Cell 
              key={`cell-${index}`} 
              fill={colorPalette[index % colorPalette.length]} 
              stroke="#fff"
            />
          ))}
        </Pie>
        <PieTooltip 
          formatter={(value, name, props) => [
            value, 
            `${name}: ${(props.payload.percent * 100).toFixed(1)}%`
          ]}
          contentStyle={{
            backgroundColor: '#fff',
            border: '1px solid #e5e7eb',
            borderRadius: '0.375rem',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}
        />
        <PieLegend 
          layout="vertical"
          verticalAlign="middle"
          align="right"
          wrapperStyle={{
            paddingLeft: '20px'
          }}
          formatter={(value, entry, index) => (
            <span style={{ color: '#4b5563' }}>
              {value}: {data[index].value}
            </span>
          )}
        />
      </RePieChart>
    </PieResponsiveContainer>
  );
}

export function LineChart({ data, height = 300 }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <ReBarChart
        data={data}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis 
          dataKey="name" 
          tick={{ fill: '#6b7280' }} 
          axisLine={{ stroke: '#e5e7eb' }}
        />
        <YAxis 
          tick={{ fill: '#6b7280' }} 
          axisLine={{ stroke: '#e5e7eb' }}
        />
        <Tooltip 
          contentStyle={{
            backgroundColor: '#fff',
            border: '1px solid #e5e7eb',
            borderRadius: '0.375rem',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}
        />
        <Legend 
          wrapperStyle={{ paddingTop: '20px' }}
        />
        <Bar 
          dataKey="value" 
          fill={colorPalette[2]} 
          radius={[4, 4, 0, 0]}
        />
      </ReBarChart>
    </ResponsiveContainer>
  );
}