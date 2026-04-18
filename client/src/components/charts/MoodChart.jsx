import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import './MoodChart.css';

const MoodChart = ({ data }) => {
  console.log('MoodChart received data:', data);
  
  // Use provided data or fallback to empty with proper structure
  const chartData = data && data.length > 0 ? data : [
    { day: 'Mon', mood: 0, entries: 0 },
    { day: 'Tue', mood: 0, entries: 0 },
    { day: 'Wed', mood: 0, entries: 0 },
    { day: 'Thu', mood: 0, entries: 0 },
    { day: 'Fri', mood: 0, entries: 0 },
    { day: 'Sat', mood: 0, entries: 0 },
    { day: 'Sun', mood: 0, entries: 0 },
  ];

  // Check if we have real data (mood > 0 and entries > 0)
  const hasRealData = chartData.some(day => day.mood > 0 && day.entries > 0);
  console.log('Has real data:', hasRealData);

  if (!hasRealData) {
    return (
      <div className="mood-chart-container">
        <div className="mood-chart-placeholder">
          <p>Complete 2+ daily check-ins to see your mood trends</p>
          <small>Your mood patterns will appear here</small>
        </div>
      </div>
    );
  }

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="custom-tooltip">
          <p className="tooltip-label">{`${label}`}</p>
          <p className="tooltip-value" style={{ color: '#667eea' }}>
            {`Mood Score: ${data.mood}`}
          </p>
          <p className="tooltip-value" style={{ color: '#48bb78' }}>
            {`Entries: ${data.entries || 0}`}
          </p>
          {data.date && (
            <p className="tooltip-value" style={{ color: '#718096', fontSize: '0.8rem' }}>
              {`Date: ${data.date}`}
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="mood-chart-container">
      <ResponsiveContainer width="100%" height={300}>
        <LineChart 
          data={chartData} 
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <CartesianGrid 
            strokeDasharray="3 3" 
            stroke="var(--border-color)"
          />
          <XAxis 
            dataKey="day" 
            stroke="var(--text-secondary)"
            fontSize={12}
          />
          <YAxis 
            domain={[0, 10]} 
            stroke="var(--text-secondary)"
            fontSize={12}
          />
          <Tooltip 
            content={<CustomTooltip />}
            contentStyle={{
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              borderRadius: '8px',
              color: 'var(--text-primary)'
            }}
          />
          <Legend 
            wrapperStyle={{
              color: 'var(--text-primary)',
              fontSize: '12px'
            }}
          />
          <Line 
            type="monotone" 
            dataKey="mood" 
            stroke="var(--accent-primary)" 
            strokeWidth={2} 
            name="Mood Score" 
            dot={{ fill: 'var(--accent-primary)', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, fill: 'var(--accent-primary)' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MoodChart;