import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";

import HeaderNav from "./components/HeaderNav";
import Footer from "./components/Footer";
import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Dashboard";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => setIsLoggedIn(true);
  const handleLogout = () => setIsLoggedIn(false);

  return (
    <Router>
      <div className="app-layout">
        <HeaderNav isLoggedIn={isLoggedIn} onLogout={handleLogout} />
        
        <Routes>
          <Route 
            path="/" 
            element={!isLoggedIn ? <LandingPage onLogin={handleLogin} /> : <Navigate to="/dashboard" />} 
          />

          <Route 
            path="/dashboard" 
            element={isLoggedIn ? <Dashboard /> : <Navigate to="/" />} 
          />
        </Routes>
        
        <Footer />
      </div>
    </Router>
  );
}

export default App;