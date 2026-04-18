export const exportUserData = async (userId, format = 'json') => {
  const userData = await fetchUserData(userId);
  
  switch (format) {
    case 'json':
      exportAsJSON(userData);
      break;
    case 'csv':
      exportAsCSV(userData);
      break;
    case 'pdf':
      exportAsPDF(userData);
      break;
    default:
      exportAsJSON(userData);
  }
};

const fetchUserData = async (userId) => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return {
    user: {
      id: userId,
      name: "John Doe",
      email: "john@example.com"
    },
    wellnessData: [
      { date: "2024-01-01", sleep: 7.5, steps: 8452, mood: "good" },
      { date: "2024-01-02", sleep: 6.8, steps: 9234, mood: "excellent" }
    ],
    moodEntries: Array.from({ length: 30 }, (_, i) => ({
      date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      mood: Math.floor(Math.random() * 10) + 1,
      notes: `Sample note ${i + 1}`
    })),
    exportDate: new Date().toISOString()
  };
};

const exportAsJSON = (data) => {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  downloadBlob(blob, `mindscape-data-${new Date().toISOString().split('T')[0]}.json`);
};

const exportAsCSV = (data) => {
  const headers = ['Date', 'Mood', 'Notes'];
  const csvRows = [headers.join(',')];
  
  data.moodEntries.forEach(entry => {
    const row = [
      entry.date,
      entry.mood,
      `"${entry.notes.replace(/"/g, '""')}"`
    ];
    csvRows.push(row.join(','));
  });
  
  const csvString = csvRows.join('\n');
  const blob = new Blob([csvString], { type: 'text/csv' });
  downloadBlob(blob, `mindscape-mood-data-${new Date().toISOString().split('T')[0]}.csv`);
};

const exportAsPDF = (data) => {
  alert('PDF export would be implemented with a library like jsPDF');
  exportAsJSON(data);
};

const downloadBlob = (blob, filename) => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};