import React, { useState } from 'react';
import DataExport from './DataExport';

const PrivacySecurity = () => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleDeleteAccount = () => {
    // Implement account deletion logic
    console.log('Account deletion requested');
    setShowDeleteConfirm(false);
  };

  return (
    <div className="privacy">
      <h2 className="text-xl font-semibold mb-6 dark:text-white">Privacy & Security</h2>
      
      <div className="privacy-options">
        <div className="privacy-card">
          <h4 className="text-lg font-semibold mb-2 dark:text-white">🔒 Data Privacy</h4>
          <p className="text-gray-600 dark:text-gray-300">
            Your wellness data is encrypted and stored securely. We never share your personal information with third parties.
          </p>
        </div>

        <DataExport />

        <div className="privacy-card">
          <h4 className="text-lg font-semibold mb-2 dark:text-white">🗑️ Account Deletion</h4>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Permanently delete your account and all associated data. This action cannot be undone.
          </p>
          
          {!showDeleteConfirm ? (
            <button 
              onClick={() => setShowDeleteConfirm(true)}
              className="btn btn-danger"
            >
              Delete Account
            </button>
          ) : (
            <div className="space-y-3">
              <p className="text-red-600 dark:text-red-400 font-semibold">
                ⚠️ Are you sure? This action cannot be undone.
              </p>
              <div className="flex gap-2 flex-wrap">
                <button 
                  onClick={handleDeleteAccount}
                  className="btn btn-danger"
                >
                  Yes, Delete My Account
                </button>
                <button 
                  onClick={() => setShowDeleteConfirm(false)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="security-tips mt-6">
        <h4 className="text-lg font-semibold mb-3 dark:text-red-800">Security Tips</h4>
        <ul className="space-y-1 dark:text-red-700">
          <li>• Keep your Unique ID safe for password recovery</li>
          <li>• Use a strong, unique password</li>
          <li>• Never share your login credentials</li>
          <li>• Log out from shared devices</li>
        </ul>
      </div>
    </div>
  );
};

export default PrivacySecurity;