import React from 'react';
import { useTheme } from '../../context/ThemeContext';

const ThemeToggle = () => {
  const { darkMode, toggleDarkMode } = useTheme();

  return (
    <div className="flex items-center justify-between">
      <div>
        <h4 className="font-semibold dark:text-white">Dark Mode</h4>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          Switch to dark theme for better visibility in low light
        </p>
      </div>
      <label className="switch">
        <input
          type="checkbox"
          checked={darkMode}
          onChange={toggleDarkMode}
        />
        <span className="slider"></span>
      </label>
    </div>
  );
};

export default ThemeToggle;