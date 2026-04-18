import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import Login from './Pages/Login';
import Register from './Pages/Register';
import ForgotPassword from './Pages/ForgotPassword';
import Dashboard from './Pages/Dashboard';
import MoodTracker from './Pages/MoodTracker';
import NutritionTracker from './Pages/NutritionTracker';
import ActivityTracker from './Pages/ActivityTracker';
import Analytics from './Pages/Analytics';
import Profile from './Pages/Profile';
import Home from './Pages/Home';
import UserGuide from './Pages/UserGuide';
import FAQ from './Pages/FAQ';
import ReportIssue from './Pages/ReportIssue';
import ContactSupport from './Pages/ContactSupport';
import HelpCenter from './Pages/HelpCenter';
import Contact from './Pages/Contact';
import PrivacyPolicy from './Pages/PrivacyPolicy';
import About from "./Pages/About";
import './App.css';
import './styles/globals.css';

// Network Status Hook
const useNetworkStatus = () => {
  const [isOnline, setIsOnline] = React.useState(navigator.onLine);

  React.useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOnline;
};

// Network Status Handler Component
const NetworkStatusHandler = () => {
  const isOnline = useNetworkStatus();
  const { user, logout } = useAuth();

  React.useEffect(() => {
    if (!isOnline) {
      console.log('App is offline - token validation will fail until online');
    }
  }, [isOnline, user]);

  return null;
};

const ThemeDebug = () => {
  const { darkMode } = useTheme();
  React.useEffect(() => {
    console.log('Dark Mode:', darkMode);
    console.log('Document has dark class:', document.documentElement.classList.contains('dark'));
  }, [darkMode]);
  
  return null;
};

function ProtectedRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
}

function PublicRoute({ children }) {
  const { user } = useAuth();
  return !user ? children : <Navigate to="/dashboard" />;
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="App">
            <Header />
            <main className="main-content">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
                <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
                <Route path="/forgot-password" element={<PublicRoute><ForgotPassword /></PublicRoute>} />
                <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                <Route path="/mood-tracker" element={<ProtectedRoute><MoodTracker /></ProtectedRoute>} />
                <Route path="/nutrition" element={<ProtectedRoute><NutritionTracker /></ProtectedRoute>} />
                <Route path="/activity" element={<ProtectedRoute><ActivityTracker /></ProtectedRoute>} />
                <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
                <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                <Route path="/user-guide" element={<ProtectedRoute><UserGuide /></ProtectedRoute>} />
                <Route path="/faq" element={<ProtectedRoute><FAQ /></ProtectedRoute>} />
                <Route path="/report-issue" element={<ProtectedRoute><ReportIssue /></ProtectedRoute>} />
                <Route path="/contact-support" element={<ProtectedRoute><ContactSupport /></ProtectedRoute>} />
                <Route path="/help-center" element={<HelpCenter />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                <Route path="/about" element={<About />} />
              </Routes>
            </main>
            <Footer />
            <NetworkStatusHandler />
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;