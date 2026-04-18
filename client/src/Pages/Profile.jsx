import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import Navigation from '../components/common/Navigation';
import { useLocation } from 'react-router-dom';
import './Profile.css';

const Profile = () => {
  const { user, logout } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('personal');
  const [loading, setLoading] = useState(false);
  const [exportStatus, setExportStatus] = useState('');

  // Handle navigation from support links
  useEffect(() => {
    if (location.state?.activeTab) {
      setActiveTab(location.state.activeTab);
      // Clear the state to avoid keeping it on refresh
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  // Real user data from AuthContext
  const [userData, setUserData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    dateOfBirth: user?.dateOfBirth || '',
    gender: user?.gender || 'male',
    height: user?.height || '',
    weight: user?.weight || '',
    uniqueId: user?.uniqueId || ''
  });

  // Settings state
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
    weeklyReports: true,
  });

  // Load settings from localStorage on component mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('mindscape_settings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  // Save settings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('mindscape_settings', JSON.stringify(settings));
  }, [settings]);

  const tabs = [
    { id: 'personal', label: 'Personal Info', icon: '👤' },
    { id: 'settings', label: 'Settings', icon: '⚙️' },
    { id: 'privacy', label: 'Privacy & Security', icon: '🔒' },
    { id: 'help', label: 'Help & Support', icon: '❓' }
  ];

  const handleInputChange = (e) => {
    setUserData({
      ...userData,
      [e.target.name]: e.target.value
    });
  };

  const handleSettingChange = (settingName) => {
    if (settingName === 'darkMode') {
      toggleDarkMode();
    } else {
      setSettings(prev => ({
        ...prev,
        [settingName]: !prev[settingName]
      }));
    }
  };

  const handleSaveProfile = async () => {
    setLoading(true);
    try {
      // Real API call to update user profile
      const token = localStorage.getItem('mindscape_token');
      const response = await fetch('http://localhost:5000/api/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(userData)
      });

      if (response.ok) {
        const updatedUser = await response.json();
        // Update local storage and context
        localStorage.setItem('mindscape_user', JSON.stringify(updatedUser));
        alert('Profile updated successfully!');
      } else {
        throw new Error('Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Error updating profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleExportData = async () => {
    setLoading(true);
    setExportStatus('exporting');
    
    try {
      // Try to get real data first
      const token = localStorage.getItem('mindscape_token');
      const userData = JSON.parse(localStorage.getItem('mindscape_user') || '{}');
      
      // Create comprehensive data export
      const exportData = {
        user: {
          id: userData.id || user?.id,
          name: userData.name || user?.name,
          email: userData.email || user?.email,
          uniqueId: userData.uniqueId || user?.uniqueId,
          profile: userData
        },
        exportInfo: {
          exportedAt: new Date().toISOString(),
          app: "MindScape Wellness",
          version: "1.0.0",
          format: "JSON"
        },
        wellnessData: await getWellnessData(token),
        settings: {
          appSettings: settings,
          theme: darkMode ? 'dark' : 'light'
        }
      };

      // Create and download the file
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { 
        type: 'application/json' 
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `mindscape-wellness-export-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      
      setExportStatus('success');
      setTimeout(() => setExportStatus(''), 3000);
      
    } catch (error) {
      console.error('Error exporting data:', error);
      setExportStatus('error');
      setTimeout(() => setExportStatus(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  // Get wellness data from localStorage as fallback
  const getWellnessData = async (token) => {
    try {
      // Try to fetch from API first
      if (token) {
        const responses = await Promise.allSettled([
          fetch('http://localhost:5000/api/mood/entries', {
            headers: { 'Authorization': `Bearer ${token}` }
          }),
          fetch('http://localhost:5000/api/nutrition/entries', {
            headers: { 'Authorization': `Bearer ${token}` }
          }),
          fetch('http://localhost:5000/api/activity/entries', {
            headers: { 'Authorization': `Bearer ${token}` }
          })
        ]);

        const [moodRes, nutritionRes, activityRes] = responses;
        
        return {
          mood: moodRes.status === 'fulfilled' && moodRes.value.ok ? await moodRes.value.json() : getLocalData('moodData'),
          nutrition: nutritionRes.status === 'fulfilled' && nutritionRes.value.ok ? await nutritionRes.value.json() : getLocalData('nutritionData'),
          activity: activityRes.status === 'fulfilled' && activityRes.value.ok ? await activityRes.value.json() : getLocalData('activityData')
        };
      }
    } catch (error) {
      console.log('Using local data fallback');
    }

    // Fallback to local data
    return {
      mood: getLocalData('moodData'),
      nutrition: getLocalData('nutritionData'),
      activity: getLocalData('activityData')
    };
  };

  // Get data from localStorage
  const getLocalData = (key) => {
    try {
      return JSON.parse(localStorage.getItem(`mindscape_${key}`) || '[]');
    } catch {
      return [];
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      try {
        const token = localStorage.getItem('mindscape_token');
        const response = await fetch('http://localhost:5000/api/users/delete-account', {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          logout();
          alert('Account deleted successfully.');
        } else {
          throw new Error('Failed to delete account');
        }
      } catch (error) {
        console.error('Error deleting account:', error);
        alert('Error deleting account. Please try again.');
      }
    }
  };

  const getExportStatusMessage = () => {
    switch (exportStatus) {
      case 'exporting':
        return <div className="export-status exporting">⏳ Preparing your data export...</div>;
      case 'success':
        return <div className="export-status success">✅ Data exported successfully! Check your downloads.</div>;
      case 'error':
        return <div className="export-status error">❌ Export failed. Please try again.</div>;
      default:
        return null;
    }
  };

  return (
    <div className="profile-page">
      <div className="profile-container">
        <aside className="profile-sidebar">
          <Navigation />
        </aside>

        <main className="profile-main">
          <div className="profile-header">
            <h1>👤 Your Profile</h1>
            <p>Manage your account settings and preferences</p>
          </div>

          <div className="profile-content">
            <div className="profile-tabs">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  <span className="tab-icon">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="tab-content">
              {activeTab === 'personal' && (
                <div className="personal-info">
                  <h2>Personal Information</h2>
                  
                  {user?.uniqueId && (
                    <div className="unique-id-section">
                      <label>Your Unique ID</label>
                      <div className="unique-id-display">
                        {user.uniqueId}
                        <span className="id-hint">This is your unique identifier for password recovery</span>
                      </div>
                    </div>
                  )}

                  <div className="form-grid">
                    <div className="form-group">
                      <label htmlFor="name">Full Name</label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={userData.name}
                        onChange={handleInputChange}
                        className="form-input"
                        placeholder="Enter your full name"
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="email">Email Address</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={userData.email}
                        onChange={handleInputChange}
                        className="form-input"
                        placeholder="Enter your email"
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="dateOfBirth">Date of Birth</label>
                      <input
                        type="date"
                        id="dateOfBirth"
                        name="dateOfBirth"
                        value={userData.dateOfBirth}
                        onChange={handleInputChange}
                        className="form-input"
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="gender">Gender</label>
                      <select
                        id="gender"
                        name="gender"
                        value={userData.gender}
                        onChange={handleInputChange}
                        className="form-input"
                      >
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                        <option value="prefer-not-to-say">Prefer not to say</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label htmlFor="height">Height (cm)</label>
                      <input
                        type="number"
                        id="height"
                        name="height"
                        value={userData.height}
                        onChange={handleInputChange}
                        className="form-input"
                        placeholder="Enter height in cm"
                        min="100"
                        max="250"
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="weight">Weight (kg)</label>
                      <input
                        type="number"
                        id="weight"
                        name="weight"
                        value={userData.weight}
                        onChange={handleInputChange}
                        className="form-input"
                        placeholder="Enter weight in kg"
                        min="30"
                        max="300"
                      />
                    </div>
                  </div>

                  <button 
                    onClick={handleSaveProfile} 
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              )}

              {activeTab === 'settings' && (
                <div className="settings">
                  <h2>Application Settings</h2>
                  
                  <div className="settings-list">
                    <div className="setting-item">
                      <div className="setting-info">
                        <h4>📧 Email Notifications</h4>
                        <p>Receive weekly wellness reports and updates via email</p>
                      </div>
                      <label className="switch">
                        <input
                          type="checkbox"
                          checked={settings.emailNotifications}
                          onChange={() => handleSettingChange('emailNotifications')}
                        />
                        <span className="slider"></span>
                      </label>
                    </div>

                    <div className="setting-item">
                      <div className="setting-info">
                        <h4>🔔 Push Notifications</h4>
                        <p>Get reminders for mood tracking and daily activities</p>
                      </div>
                      <label className="switch">
                        <input
                          type="checkbox"
                          checked={settings.pushNotifications}
                          onChange={() => handleSettingChange('pushNotifications')}
                        />
                        <span className="slider"></span>
                      </label>
                    </div>

                    <div className="setting-item">
                      <div className="setting-info">
                        <h4>📊 Weekly Reports</h4>
                        <p>Receive detailed weekly analytics of your wellness journey</p>
                      </div>
                      <label className="switch">
                        <input
                          type="checkbox"
                          checked={settings.weeklyReports}
                          onChange={() => handleSettingChange('weeklyReports')}
                        />
                        <span className="slider"></span>
                      </label>
                    </div>

                    <div className="setting-item">
                      <div className="setting-info">
                        <h4>🌙 Dark Mode</h4>
                        <p>Switch to dark theme for better visibility in low light</p>
                      </div>
                      <label className="switch">
                        <input
                          type="checkbox"
                          checked={darkMode}
                          onChange={() => handleSettingChange('darkMode')}
                        />
                        <span className="slider"></span>
                      </label>
                    </div>
                  </div>

                  <div className="settings-actions">
                    <button 
                      className="btn btn-secondary"
                      onClick={() => {
                        const defaultSettings = {
                          emailNotifications: true,
                          pushNotifications: false,
                          weeklyReports: true,
                        };
                        setSettings(defaultSettings);
                        alert('Settings reset to defaults!');
                      }}
                    >
                      Reset to Defaults
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'privacy' && (
                <div className="privacy">
                  <h2>Privacy & Security</h2>
                  
                  <div className="privacy-options">
                    <div className="privacy-card">
                      <h4>🔒 Data Privacy</h4>
                      <p>Your wellness data is encrypted and stored securely. We never share your personal information with third parties.</p>
                    </div>

                    <div className="privacy-card">
                      <h4>📊 Data Export</h4>
                      <p>Download your complete wellness data for personal records or to share with healthcare providers.</p>
                      <button 
                        onClick={handleExportData}
                        className="btn btn-secondary"
                        disabled={loading}
                      >
                        {loading ? 'Exporting...' : 'Export My Data'}
                      </button>
                      {getExportStatusMessage()}
                    </div>

                    <div className="privacy-card">
                      <h4>🗑️ Account Deletion</h4>
                      <p>Permanently delete your account and all associated data. This action cannot be undone.</p>
                      <button 
                        onClick={handleDeleteAccount}
                        className="btn btn-danger"
                      >
                        Delete Account
                      </button>
                    </div>
                  </div>

                  <div className="security-tips">
                    <h4>Security Tips</h4>
                    <ul>
                      <li>Keep your Unique ID safe for password recovery</li>
                      <li>Use a strong, unique password</li>
                      <li>Never share your login credentials</li>
                      <li>Log out from shared devices</li>
                    </ul>
                  </div>
                </div>
              )}

              {activeTab === 'help' && (
                <div className="help">
                  <h2>Help & Support</h2>
                  
                  <div className="help-sections">
                    <div className="help-card">
                      <h4>📖 User Guide</h4>
                      <p>Learn how to make the most of MindScape Wellness features.</p>
                      <a href="/user-guide" className="btn btn-secondary">View Guide</a>
                    </div>

                    <div className="help-card">
                      <h4>❓ FAQ</h4>
                      <p>Find answers to frequently asked questions about the platform.</p>
                      <a href="/faq" className="btn btn-secondary">View FAQ</a>
                    </div>

                    <div className="help-card">
                      <h4>📞 Contact Support</h4>
                      <p>Get help from our support team for any issues or questions.</p>
                      <a href="/contact-support" className="btn btn-secondary">Contact Us</a>
                    </div>

                    <div className="help-card">
                      <h4>🐛 Report Issue</h4>
                      <p>Found a bug or experiencing technical issues? Let us know.</p>
                      <a href="/report-issue" className="btn btn-secondary">Report Issue</a>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="profile-actions">
            <button onClick={logout} className="btn btn-danger">
              🚪 Logout
            </button>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Profile;