import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Dashboard from './Dashboard';
import LandingPage from './components/LandingPage';
import IndexScreen from './components/IndexScreen';
import LoginScreen from './components/LoginScreen';
import LoginModal from './components/LoginModal';
import './App.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [user, setUser] = useState(null);
  const [fromExposureCalc, setFromExposureCalc] = useState(false);

  const handleLogin = (userData) => {
    setUser(userData);
    setIsLoggedIn(true);
    setShowLoginModal(false);
  };

  const handleLogout = () => {
    setUser(null);
    setIsLoggedIn(false);
  };

  const handleShowLogin = () => {
    setShowLoginModal(true);
  };

  const handleCloseLogin = () => {
    setShowLoginModal(false);
  };

  const handleDirectLogin = (userData) => {
    setUser(userData);
    setIsLoggedIn(true);
    setFromExposureCalc(true);
  };

  const handleSwitchToAdmin = () => {
    // For now, just show an alert. In a real app, this would redirect to admin panel
    alert('Switching to Admin Panel - This feature will be implemented in the admin module');
  };

  // Component to handle URL parameters and exposure calculator results
  const AppContent = () => {
    const location = useLocation();
    
    useEffect(() => {
      // Check if coming from exposure calculator
      const urlParams = new URLSearchParams(location.search);
      const fromCalc = urlParams.get('from') === 'exposure_calc';
      const resultId = urlParams.get('rid');
      
      if (fromCalc && resultId) {
        // Check if we have exposure calculator result data
        const exposureResult = sessionStorage.getItem('exposure_calc_result');
        const sessionToken = sessionStorage.getItem('exposure_session_token');
        
        if (exposureResult && sessionToken) {
          // Set user as logged in with exposure calculator data
          setFromExposureCalc(true);
          setUser({
            name: JSON.parse(exposureResult).user.name,
            email: JSON.parse(exposureResult).user.email,
            phone: JSON.parse(exposureResult).user.phone,
            fromExposureCalc: true,
            resultId: resultId
          });
          setIsLoggedIn(true);
        }
      }
    }, [location]);

    return (
      <Routes>
        {/* Index Screen Route - Entry Point */}
        <Route 
          path="/" 
          element={<IndexScreen />}
        />
        
        {/* Login Route */}
        <Route 
          path="/login" 
          element={
            isLoggedIn ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <LoginScreen onLogin={handleLogin} />
            )
          } 
        />
        
        {/* Landing Page Route */}
        <Route 
          path="/landing" 
          element={
            <LandingPage onLogin={handleShowLogin} onDirectLogin={handleDirectLogin} />
          } 
        />
        
        {/* Dashboard Route */}
        <Route 
          path="/dashboard" 
          element={
            isLoggedIn ? (
              <Dashboard user={user} onLogout={handleLogout} onSwitchToAdmin={handleSwitchToAdmin} fromExposureCalc={fromExposureCalc} />
            ) : (
              <Navigate to="/" replace />
            )
          } 
        />
        
        {/* Catch all route - redirect to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    );
  };

  return (
    <Router>
      <div className="App">
        <AppContent />

        {/* Login Modal */}
        <LoginModal
          isOpen={showLoginModal}
          onClose={handleCloseLogin}
          onLogin={handleLogin}
        />
      </div>
    </Router>
  );
}

export default App;
