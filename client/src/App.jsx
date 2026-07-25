import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import "./App.css";

import HeaderNav from "./components/HeaderNav";
import Footer from "./components/Footer";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import Dashboard from "./pages/Dashboard";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkLogin();
  }, []);

  const checkLogin = async () => {
    try {
      const response = await fetch(
        "http://localhost:5050/api/auth/protected",
        {
          method: "GET",
          credentials: "include", // send the cookie
        }
      );

      if (response.ok) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
    } catch (err) {
      setIsLoggedIn(false);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = async () => {
    await fetch("http://localhost:5050/api/auth/logout", {
      method: "POST",
      credentials: "include",
    });

    setIsLoggedIn(false);
  };

  if (loading) {
    return <h2>Loading...</h2>;
  }

  return (
    <Router>
      <div className="app-container">
        <HeaderNav
          isLoggedIn={isLoggedIn}
          onLogout={handleLogout}
        />

        <Routes>
          <Route path="/" element={!isLoggedIn ? (
                <LandingPage />
              ) : (
                <Navigate to="/dashboard" replace />
              )
            } 
          />

          <Route
            path="/login"
            element={
              !isLoggedIn ? (
                <LoginPage onLogin={handleLogin} />
              ) : (
                <Navigate to="/dashboard" replace />
              )
            }
          />

          <Route
            path="/register"
            element={
              !isLoggedIn ? (
                <RegisterPage onRegister={handleLogin} />
              ) : (
                <Navigate to="/dashboard" replace />
              )
            }
          />

          <Route
            path="/dashboard"
            element={
              isLoggedIn ? (
                <Dashboard />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
        </Routes>

        <Footer />
      </div>
    </Router>
  );
}

export default App;