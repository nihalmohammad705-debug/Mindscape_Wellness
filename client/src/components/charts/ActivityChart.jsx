import React from 'react';
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend
} from 'recharts';

const ActivityChart = ({ data }) => {
  // Process real activity data for the chart
  const processActivityData = (activities) => {
    if (!activities || activities.length === 0) {
      return [
        { name: 'No Data', value: 100, color: '#e2e8f0' }
      ];
    }

    const activityMap = {};
    
    activities.forEach(activity => {
      let activityName = 'Other';
      
      if (activity.isCustom) {
        // Custom activity - use the custom name
        activityName = activity.activityName || 'Custom Activity';
      } else {
        // Predefined activity
        const activityId = parseInt(activity.activityType);
        const activityNames = {
          1: 'Walking',
          2: 'Running', 
          3: 'Cycling',
          4: 'Yoga',
          5: 'Weight Training',
          6: 'Swimming',
          7: 'Office Work',
          8: 'House Cleaning',
          9: 'Sleeping',
          10: 'Other'
        };
        activityName = activityNames[activityId] || 'Other';
      }
      
      if (activityMap[activityName]) {
        activityMap[activityName].value += 1;
      } else {
        activityMap[activityName] = {
          name: activityName,
          value: 1,
          color: getColorForActivity(activityName)
        };
      }
    });

    return Object.values(activityMap);
  };

  const getColorForActivity = (activityName) => {
    const colors = {
      'Walking': '#667eea',
      'Running': '#48bb78',
      'Cycling': '#ed8936',
      'Yoga': '#9f7aea',
      'Weight Training': '#f56565',
      'Swimming': '#4299e1',
      'Office Work': '#a0aec0',
      'House Cleaning': '#68d391',
      'Sleeping': '#b794f4',
      'Other': '#e53e3e'
    };
    
    // For custom activities, generate a color based on the name
    if (!colors[activityName]) {
      // Generate a consistent color for custom activities
      const customColors = [
        '#d69e2e', '#38a169', '#319795', '#00b5d8', 
        '#3182ce', '#5a67d8', '#805ad5', '#d53f8c'
      ];
      const hash = activityName.split('').reduce((a, b) => {
        a = ((a << 5) - a) + b.charCodeAt(0);
        return a & a;
      }, 0);
      return customColors[Math.abs(hash) % customColors.length];
    }
    
    return colors[activityName] || '#718096';
  };

  const chartData = processActivityData(data || []);

  return (
    <div className="chart-container">
      <h3>Activity Distribution</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ActivityChart;