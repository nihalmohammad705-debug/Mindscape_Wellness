import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const NutritionChart = ({ data }) => {
  console.log('NutritionChart received data:', data);
  
  // Use real data passed as prop, fallback to empty array
  const chartData = data || [];
  
  // Check if we have valid data with actual values
  const hasValidData = chartData.length > 0 && chartData.some(day => 
    day.calories > 0 || day.protein > 0 || day.carbs > 0 || day.fat > 0
  );
  
  console.log('Has valid nutrition data:', hasValidData);

  if (!hasValidData) {
    return (
      <div className="chart-container">
        <div className="chart-placeholder">
          <p>No nutrition data available for this week</p>
          <p>Add food entries to see your nutrition overview</p>
        </div>
      </div>
    );
  }

  // Custom tooltip with better formatting
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip" style={{
          backgroundColor: 'white',
          padding: '10px',
          border: '1px solid #ccc',
          borderRadius: '5px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        }}>
          <p className="label" style={{ fontWeight: 'bold', marginBottom: '5px' }}>{`${label}`}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ 
              color: entry.color,
              margin: '2px 0',
              fontSize: '12px'
            }}>
              {`${entry.name}: ${entry.value}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="chart-container" style={{ padding: '10px' }}>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart 
          data={chartData}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            dataKey="day" 
            tick={{ fontSize: 12 }}
          />
          <YAxis 
            tick={{ fontSize: 12 }}
            // Let YAxis auto-scale based on data
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Bar 
            dataKey="calories" 
            fill="#667eea" 
            name="Calories" 
            barSize={20}
            radius={[4, 4, 0, 0]}
          />
          <Bar 
            dataKey="protein" 
            fill="#48bb78" 
            name="Protein (g)" 
            barSize={20}
            radius={[4, 4, 0, 0]}
          />
          <Bar 
            dataKey="carbs" 
            fill="#ed8936" 
            name="Carbs (g)" 
            barSize={20}
            radius={[4, 4, 0, 0]}
          />
          <Bar 
            dataKey="fat" 
            fill="#e53e3e" 
            name="Fat (g)" 
            barSize={20}
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default NutritionChart;