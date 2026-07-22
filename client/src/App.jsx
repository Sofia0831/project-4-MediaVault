import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";

import HeaderNav from "./components/HeaderNav";
import Footer from "./components/Footer";
import LandingPage from "./pages/LandingPage";
import AuthPage from "./pages/Auth";
import Dashboard from "./pages/Dashboard";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => setIsLoggedIn(true);
  const handleLogout = () => setIsLoggedIn(false);

  return (
    <Router>
      <div className="app-container">
        <HeaderNav isLoggedIn={isLoggedIn} onLogout={handleLogout} />
        
        <Routes>
          <Route 
            path="/" 
            element={!isLoggedIn ? <LandingPage /> : <Navigate to="/dashboard" replace />} 
          />
          <Route 
            path="/auth" 
            element={!isLoggedIn ? <AuthPage onLogin={handleLogin} /> : <Navigate to="/dashboard" replace />} 
          />
          
          <Route 
            path="/dashboard" 
            element={isLoggedIn ? <Dashboard /> : <Navigate to="/auth" replace />} 
          />
        </Routes>
        
        <Footer />
      </div>
    </Router>
  );
}

export default App;