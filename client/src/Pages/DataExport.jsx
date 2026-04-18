import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { exportUserData } from '../../utils/exportData';

const DataExport = () => {
  const { user } = useAuth();
  const [exportStatus, setExportStatus] = useState('idle');
  const [exportFormat, setExportFormat] = useState('json');

  const handleExport = async () => {
    setExportStatus('exporting');
    
    try {
      await exportUserData(user.uniqueId, exportFormat);
      setExportStatus('success');
      
      setTimeout(() => setExportStatus('idle'), 3000);
    } catch (error) {
      console.error('Export failed:', error);
      setExportStatus('error');
      setTimeout(() => setExportStatus('idle'), 3000);
    }
  };

  const getStatusMessage = () => {
    switch (exportStatus) {
      case 'exporting':
        return (
          <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
            Preparing your data export...
          </div>
        );
      case 'success':
        return (
          <div className="text-green-600 dark:text-green-400">
            ✅ Data exported successfully! Check your downloads.
          </div>
        );
      case 'error':
        return (
          <div className="text-red-600 dark:text-red-400">
            ❌ Export failed. Please try again.
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="privacy-card">
      <h4 className="text-lg font-semibold mb-2 dark:text-white">📊 Data Export</h4>
      <p className="text-gray-600 dark:text-gray-300 mb-4">
        Download your complete wellness data for personal records or to share with healthcare providers.
      </p>
      
      <div className="space-y-4">
        <div className="flex flex-wrap gap-4">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              value="json"
              checked={exportFormat === 'json'}
              onChange={(e) => setExportFormat(e.target.value)}
              className="text-blue-600"
            />
            <span className="dark:text-white">JSON Format</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              value="csv"
              checked={exportFormat === 'csv'}
              onChange={(e) => setExportFormat(e.target.value)}
              className="text-blue-600"
            />
            <span className="dark:text-white">CSV Format</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              value="pdf"
              checked={exportFormat === 'pdf'}
              onChange={(e) => setExportFormat(e.target.value)}
              className="text-blue-600"
            />
            <span className="dark:text-white">PDF Report</span>
          </label>
        </div>
        
        <button
          onClick={handleExport}
          disabled={exportStatus === 'exporting'}
          className="btn btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {exportStatus === 'exporting' ? 'Exporting...' : 'Export My Data'}
        </button>
        
        {getStatusMessage()}
      </div>
    </div>
  );
};

export default DataExport;