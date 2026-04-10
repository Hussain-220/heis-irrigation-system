import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import './ChartComparison.css';

function ChartComparison({ systemType, results }) {
  const data = [
    {
      metric: 'Flow Rate',
      value: parseFloat(results.summary.systemFlow),
      unit: 'LPS',
    },
    {
      metric: 'Operating Time',
      value: parseFloat(results.summary.operatingTime),
      unit: 'hrs',
    },
    {
      metric: 'Total Head',
      value: parseFloat(results.summary.totalHead),
      unit: 'm',
    },
    {
      metric: 'Pump Power',
      value: parseFloat(results.summary.pumpPower),
      unit: 'HP',
    },
  ];

  const chartData = data.map((item) => ({
    name: `${item.metric}\n(${item.unit})`,
    value: item.value.toFixed(2),
  }));

  const systemName = systemType === 'drip' ? 'Drip System' : 'Sprinkler System';

  return (
    <div className="chart-comparison">
      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis
            dataKey="name"
            tick={{ fontSize: 12, fill: '#64748b' }}
            angle={-15}
            textAnchor="end"
            height={80}
          />
          <YAxis tick={{ fontSize: 12, fill: '#64748b' }} />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1e293b',
              border: 'none',
              borderRadius: '6px',
              padding: '12px',
              color: 'white',
            }}
            formatter={(value) => `${value}`}
          />
          <Bar
            dataKey="value"
            fill="#3b82f6"
            radius={[8, 8, 0, 0]}
            name={systemName}
          />
        </BarChart>
      </ResponsiveContainer>

      <div className="chart-legend">
        <div className="legend-item">
          <div className="legend-color" style={{ backgroundColor: '#3b82f6' }}></div>
          <span>{systemName}</span>
        </div>
        <p className="legend-note">
          {systemType === 'drip'
            ? 'Optimized for efficiency with lower operating pressures'
            : 'Designed for maximum coverage with consistent flow distribution'}
        </p>
      </div>
    </div>
  );
}

export default ChartComparison;
