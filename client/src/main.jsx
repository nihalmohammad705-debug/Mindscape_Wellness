import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// FORCE TITLE AND FAVICON
document.title = "Mindscape Wellness";

// Function to aggressively replace all favicons
function replaceFavicons() {
  // Remove ALL possible favicon links
  const selectors = [
    'link[rel*="icon"]',
    'link[rel*="shortcut"]',
    'link[rel*="apple-touch-icon"]',
    'link[href*="react"]',
    'link[href*="vite"]'
  ];
  
  selectors.forEach(selector => {
    document.querySelectorAll(selector).forEach(element => {
      console.log('Removing:', element.href);
      element.remove();
    });
  });

  // Add our favicon with multiple approaches
  const favicon = document.createElement('link');
  favicon.rel = 'icon';
  favicon.type = 'image/svg+xml';
  favicon.href = '/leaf-icon.svg?t=' + Date.now();
  document.head.appendChild(favicon);

  // Also add as shortcut icon for older browsers
  const shortcut = document.createElement('link');
  shortcut.rel = 'shortcut icon';
  shortcut.href = '/fevicon.svg?t=' + Date.now();
  document.head.appendChild(shortcut);

  console.log('Added our favicon:', favicon.href);
}

// Run immediately
replaceFavicons();

// Run again after React loads
setTimeout(replaceFavicons, 100);
setTimeout(replaceFavicons, 1000);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)